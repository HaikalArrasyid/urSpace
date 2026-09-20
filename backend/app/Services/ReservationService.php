<?php

namespace App\Services;

use App\Models\Diskon;
use App\Models\Reservasi;
use App\Models\Space;
use Carbon\Carbon;
use Exception;

class ReservationService
{
    /**
     * Mengecek ketersediaan jam untuk booking.
     * Mengembalikan true jika tersedia, false jika bertabrakan.
     */
    public function checkAvailability($spaceId, $tanggal, $jamMulai, $durasiJam): bool
    {
        $start = Carbon::parse("$tanggal $jamMulai");
        $end = $start->copy()->addHours((int) $durasiJam);

        // Ambil semua reservasi pada ruangan dan tanggal tersebut yang telah disetujui atau aktif
        $reservations = Reservasi::where('id_space', $spaceId)
            ->where('tanggal_reservasi', $tanggal)
            ->whereIn('status', ['disetujui', 'aktif'])
            ->get();

        foreach ($reservations as $res) {
            $resStart = Carbon::parse($res->tanggal_reservasi . ' ' . $res->jam_mulai);
            $resEnd = Carbon::parse($res->jam_selesai);

            // Cek apakah ada irisan waktu
            // Syarat OVERLAP: Waktu mulai baru < Waktu selesai lama AND Waktu selesai baru > Waktu mulai lama
            // Jika Waktu mulai baru == Waktu selesai lama, tidak overlap karena tidak ada buffer
            if ($start->lt($resEnd) && $end->gt($resStart)) {
                return false; // Bertabrakan
            }
        }

        return true;
    }

    /**
     * Menghitung total harga dan diskon
     */
    public function calculatePricing($spaceId, $durasiJam, $kodePromo = null): array
    {
        $space = Space::findOrFail($spaceId);
        $hargaPerJam = $space->harga_per_jam;
        $totalHargaAwal = $hargaPerJam * $durasiJam;
        
        $potonganDiskon = 0;
        $idDiskon = null;

        if ($kodePromo) {
            $diskon = Diskon::where('nama_diskon', $kodePromo)
                ->where('tanggal_awal', '<=', now())
                ->where('tanggal_akhir', '>=', now())
                ->first();

            if ($diskon) {
                // Potongan dihitung berdasar persentase diskon
                $potonganDiskon = intval($totalHargaAwal * ($diskon->persentase_diskon / 100));
                $idDiskon = $diskon->id;
            } else {
                throw new Exception("Kode promo tidak valid atau sudah kadaluarsa");
            }
        }

        $totalBayar = $totalHargaAwal - $potonganDiskon;

        return [
            'harga_per_jam' => $hargaPerJam,
            'total_harga_awal' => $totalHargaAwal,
            'potongan_diskon' => $potonganDiskon,
            'total_bayar' => $totalBayar,
            'id_diskon' => $idDiskon,
        ];
    }
}
