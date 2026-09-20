<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateDiskonRequest;
use App\Http\Requests\Admin\CreateSpaceRequest;
use App\Http\Requests\Admin\UpdateDiskonRequest;
use App\Http\Requests\Admin\UpdateSpaceRequest;
use App\Http\Requests\Auth\RegisterMemberRequest;
use App\Models\Diskon;
use App\Models\Member;
use App\Models\Reservasi;
use App\Models\Space;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    use ApiResponse;

    // PROFILE
    public function getProfile(Request $request)
    {
        return $this->successResponse('Berhasil memproses permintaan', $request->user()->spaceOwner);
    }

    public function updateProfile(Request $request)
    {
        $owner = $request->user()->spaceOwner;
        $request->validate([
            'nama_coworking' => 'sometimes|string',
            'nama_pemilik' => 'sometimes|string',
            'telp' => 'sometimes|string',
        ]);

        $owner->update($request->only(['nama_coworking', 'nama_pemilik', 'telp']));

        return $this->successResponse('Profil Coworking Space berhasil diperbarui!', $owner);
    }

    // MEMBERS
    public function getMembers(Request $request)
    {
        $query = Member::query();
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nama_member', 'like', "%$search%")
                ->orWhere('instansi', 'like', "%$search%")
                ->orWhere('telp', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
        }

        return $this->successResponse('Berhasil memproses permintaan', $query->get());
    }

    public function createMember(RegisterMemberRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => 'member',
            ]);

            $member = $user->member()->create([
                'nama_member' => $request->nama_member,
                'instansi' => $request->instansi,
                'alamat' => $request->alamat,
                'telp' => $request->telp,
                'email' => $request->email,
            ]);

            DB::commit();

            return $this->successResponse('Data member baru berhasil ditambahkan!', $member, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse('Terjadi kesalahan sistem', 'Internal Server Error', 500);
        }
    }

    public function getMember($id)
    {
        $member = Member::find($id);
        if (! $member) {
            return $this->errorResponse('Member tidak ditemukan', 'Not Found', 404);
        }

        return $this->successResponse('Berhasil memproses permintaan', $member);
    }

    public function updateMember(Request $request, $id)
    {
        $member = Member::find($id);
        if (! $member) {
            return $this->errorResponse('Member tidak ditemukan', 'Not Found', 404);
        }

        $member->update($request->only(['nama_member', 'instansi', 'alamat', 'telp', 'email']));

        if ($request->filled('password')) {
            $member->user->update(['password' => Hash::make($request->password)]);
        }

        return $this->successResponse('Data member berhasil diperbarui!', $member);
    }

    public function deleteMember($id)
    {
        $member = Member::find($id);
        if (! $member) {
            return $this->errorResponse('Member tidak ditemukan', 'Not Found', 404);
        }

        $member->user->delete(); // user cascade logic clears member.

        return $this->successResponse('Data member berhasil dihapus!', ['deleted' => true]);
    }

    // SPACES
    public function getSpaces(Request $request)
    {
        // Typically Admin sees only their own spaces, based on ERD space belongs to space_owner
        $owner = $request->user()->spaceOwner;

        return $this->successResponse('Berhasil memproses permintaan', $owner->spaces ?? []);
    }

    public function createSpace(CreateSpaceRequest $request)
    {
        $owner = $request->user()->spaceOwner;
        $space = $owner->spaces()->create($request->validated());

        return $this->successResponse('Space baru berhasil ditambahkan!', $space, 201);
    }

    public function getSpace($id)
    {
        $space = Space::find($id);
        if (! $space) {
            return $this->errorResponse('Space tidak ditemukan', 'Not Found', 404);
        }

        return $this->successResponse('Berhasil memproses permintaan', $space);
    }

    public function updateSpace(UpdateSpaceRequest $request, $id)
    {
        $space = Space::find($id);
        if (! $space) {
            return $this->errorResponse('Space tidak ditemukan', 'Not Found', 404);
        }
        $space->update($request->validated());

        return $this->successResponse('Data space berhasil diperbarui!', $space);
    }

    public function deleteSpace($id)
    {
        $space = Space::find($id);
        if (! $space) {
            return $this->errorResponse('Space tidak ditemukan', 'Not Found', 404);
        }
        $space->delete();

        return $this->successResponse('Space berhasil dihapus!', ['deleted' => true]);
    }

    // DISKONS (Promo Codes)
    public function getDiskons(Request $request)
    {
        $owner = $request->user()->spaceOwner;

        return $this->successResponse('Berhasil memproses permintaan', $owner->diskons ?? []);
    }

    public function createDiskon(CreateDiskonRequest $request)
    {
        $owner = $request->user()->spaceOwner;
        $diskon = $owner->diskons()->create($request->validated());

        return $this->successResponse('Kode promo baru berhasil dibuat!', $diskon, 201);
    }

    public function getDiskon($id)
    {
        $diskon = Diskon::find($id);
        if (! $diskon) {
            return $this->errorResponse('Diskon tidak ditemukan', 'Not Found', 404);
        }

        return $this->successResponse('Berhasil memproses permintaan', $diskon);
    }

    public function updateDiskon(UpdateDiskonRequest $request, $id)
    {
        $diskon = Diskon::find($id);
        if (! $diskon) {
            return $this->errorResponse('Diskon tidak ditemukan', 'Not Found', 404);
        }
        $diskon->update($request->validated());

        return $this->successResponse('Data promo diskon berhasil diperbarui!', $diskon);
    }

    public function deleteDiskon($id)
    {
        $diskon = Diskon::find($id);
        if (! $diskon) {
            return $this->errorResponse('Diskon tidak ditemukan', 'Not Found', 404);
        }
        $diskon->delete();

        return $this->successResponse('Kode promo berhasil dihapus!', ['deleted' => true]);
    }

    // REPORTS
    public function getMonthlyReport(Request $request)
    {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        $reservations = Reservasi::whereMonth('tanggal_reservasi', $month)
            ->whereYear('tanggal_reservasi', $year)
            ->get();

        $transaksi_selesai = $reservations->where('status', 'selesai');

        $data = [
            'month' => $month,
            'year' => $year,
            'total_transaksi' => $reservations->count(),
            'total_jam_terpakai' => $transaksi_selesai->sum('durasi_jam'),
            'estimasi_pendapatan_kotor' => $reservations->sum('total_harga_awal'),
            'total_potongan_diskon' => $reservations->sum('potongan_diskon'),
            'realisasi_pendapatan_bersih' => $transaksi_selesai->sum('total_bayar'),
        ];

        return $this->successResponse('Berhasil memproses permintaan', $data);
    }
}
