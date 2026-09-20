<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReservasiStatusRequest;
use App\Http\Requests\Member\CreateReservasiRequest;
use App\Models\Reservasi;
use App\Services\ReservationService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservasiController extends Controller
{
    use ApiResponse;

    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    // MEMBER ENDPOINTS
    public function create(CreateReservasiRequest $request)
    {
        $payload = $request->validated();

        // 1. Overlap Check
        if (! $this->reservationService->checkAvailability($payload['id_space'], $payload['tanggal_reservasi'], $payload['jam_mulai'], $payload['durasi_jam'])) {
            return $this->errorResponse('Space tidak tersedia pada tanggal dan rentang jam tersebut!', 'Bad Request', 400);
        }

        // 2. Financial Math processing
        try {
            $pricing = $this->reservationService->calculatePricing($payload['id_space'], $payload['durasi_jam'], $payload['kode_promo'] ?? null);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 'Bad Request', 400);
        }

        // 3. Persist
        $reservasi = Reservasi::create([
            'kode_booking' => 'BOOK-'.str_replace('-', '', $payload['tanggal_reservasi']).'-'.strtoupper(Str::random(4)),
            'id_member' => $request->user()->member->id,
            'id_space' => $payload['id_space'],
            'id_diskon' => $pricing['id_diskon'],
            'tanggal_reservasi' => $payload['tanggal_reservasi'],
            'jam_mulai' => $payload['jam_mulai'],
            'jam_selesai' => Carbon::parse($payload['tanggal_reservasi'] . ' ' . $payload['jam_mulai'])->addHours((int) $payload['durasi_jam'])->format('Y-m-d H:i:s'),
            'durasi_jam' => $payload['durasi_jam'],
            'harga_per_jam' => $pricing['harga_per_jam'],
            'total_harga_awal' => $pricing['total_harga_awal'],
            'potongan_diskon' => $pricing['potongan_diskon'],
            'total_bayar' => $pricing['total_bayar'],
            'status' => 'belum_dikonfirm',
            'payment_method' => 'QRIS',
            'payment_status' => 'pending',
            'transaction_code' => 'TRX-'.strtoupper(Str::random(8)),
            'discount_code' => $payload['kode_promo'] ?? null,
            'discount_amount' => $pricing['potongan_diskon'],
            'security_hash' => strtoupper(Str::random(16)),
            'gateway_node' => 'BALI-CANGGU-NODE-01',
            'qr_serial_token' => strtoupper(Str::random(12)),
        ]);

        return $this->successResponse('Reservasi berhasil dibuat! Silakan tunggu konfirmasi admin.', $reservasi, 201);
    }

    public function myReservations(Request $request)
    {
        $member = $request->user()->member;

        return $this->successResponse('Berhasil memproses permintaan', $member->reservasis ?? []);
    }

    public function history(Request $request)
    {
        $member = $request->user()->member;
        $query = Reservasi::with('space')->where('id_member', $member->id);

        if ($request->has('month')) {
            $query->whereMonth('tanggal_reservasi', $request->month);
        }
        if ($request->has('year')) {
            $query->whereYear('tanggal_reservasi', $request->year);
        }

        return $this->successResponse('Berhasil memproses permintaan', $query->get());
    }

    public function eTicket($id)
    {
        $res = Reservasi::with(['member', 'space', 'diskon'])->find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        if ($res->status !== 'disetujui' && $res->status !== 'aktif' && $res->status !== 'selesai') {
            return $this->errorResponse('E-Ticket hanya diterbitkan untuk reservasi yang telah disetujui', 'Bad Request', 400);
        }

        $payload = [
            'e_ticket_number' => 'TICKET-'.$res->kode_booking,
            'kode_booking' => $res->kode_booking,
            'coworking_space' => [
                'nama' => $res->space->owner->nama_coworking ?? '',
                'telepon' => $res->space->owner->telp ?? '',
            ],
            'member' => $res->member,
            'space' => $res->space,
            'status_reservasi' => $res->status,
            'qr_code_payload' => "VERIFY-RESERVASI-{$res->id}-{$res->kode_booking}",
            'tanggal_reservasi' => $res->tanggal_reservasi,
            'jam_mulai' => $res->jam_mulai,
            'jam_selesai' => Carbon::parse($res->jam_selesai)->toDateString() === $res->tanggal_reservasi 
                ? Carbon::parse($res->jam_selesai)->format('H:i') 
                : $res->jam_selesai,
            'durasi_jam' => $res->durasi_jam,
            'harga_per_jam' => $res->harga_per_jam,
            'total_harga_awal' => $res->total_harga_awal,
            'potongan_diskon' => $res->potongan_diskon,
            'total_bayar' => $res->total_bayar,
            'discount_code' => $res->discount_code,
            'discount_amount' => $res->discount_amount,
            'payment_method' => $res->payment_method,
            'payment_status' => $res->payment_status,
            'transaction_code' => $res->transaction_code,
            'gate_sync_status' => $res->gate_sync_status,
            'security_hash' => $res->security_hash,
            'gateway_node' => $res->gateway_node,
            'qr_serial_token' => $res->qr_serial_token,
        ];

        return $this->successResponse('E-Ticket berhasil dimuat', $payload);
    }

    public function cancel($id)
    {
        $res = Reservasi::find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        $res->update(['status' => 'dibatalkan']);

        return $this->successResponse('Reservasi berhasil dibatalkan oleh pengguna', $res);
    }

    // ADMIN ENDPOINTS
    public function indexAdmin(Request $request)
    {
        $query = Reservasi::query();
        if ($request->has('month')) {
            $query->whereMonth('tanggal_reservasi', $request->month);
        }
        if ($request->has('year')) {
            $query->whereYear('tanggal_reservasi', $request->year);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('id_space')) {
            $query->where('id_space', $request->id_space);
        }
        if ($request->has('tanggal')) {
            $query->where('tanggal_reservasi', $request->tanggal);
        }

        return $this->successResponse('Berhasil memproses permintaan', $query->get());
    }

    public function updateStatus(UpdateReservasiStatusRequest $request, $id)
    {
        $res = Reservasi::find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        $res->update(['status' => $request->status]);

        return $this->successResponse('Status reservasi berhasil diperbarui menjadi '.$request->status, $res);
    }

    public function checkIn($id)
    {
        $res = Reservasi::find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        if ($res->status !== 'disetujui') {
            return $this->errorResponse('Hanya reservasi berstatus disetujui yang dapat di-check-in.', 'Bad Request', 400);
        }

        $res->update([
            'status' => 'aktif',
            'check_in_time' => now(),
        ]);

        return $this->successResponse('Check-in member berhasil! Status reservasi aktif.', $res);
    }

    public function checkOut($id)
    {
        $res = Reservasi::find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        if ($res->status !== 'aktif') {
            return $this->errorResponse('Hanya reservasi berstatus aktif yang dapat di-check-out.', 'Bad Request', 400);
        }

        $res->update([
            'status' => 'selesai',
            'check_out_time' => now(),
        ]);

        return $this->successResponse('Check-out member berhasil! Reservasi telah selesai.', $res);
    }

    public function show($id)
    {
        $res = Reservasi::with(['member', 'space', 'diskon'])->find($id);
        if (! $res) {
            return $this->errorResponse('Reservasi tidak ditemukan', 'Not Found', 404);
        }

        return $this->successResponse('Berhasil memproses permintaan', $res);
    }
}
