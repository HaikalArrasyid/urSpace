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
        $space = Space::findOrFail($spaceId);
        
        // Desk = sewa kursi (banyak orang bisa barengan sampai batas kapasitas).
        // Meeting Room / Private Office = booking sewa se-ruangannya (1 booking = fully booked).
        $isSharedSpace = $space->tipe === 'desk';
        $kapasitasMaksimal = $isSharedSpace ? $space->kapasitas : 1;

        $start = Carbon::parse("$tanggal $jamMulai");
        $end = $start->copy()->addHours((int) $durasiJam);

        // Ambil semua reservasi pada ruangan dan tanggal tersebut yang telah disetujui, aktif, atau baru saja dipesan (belum dikonfirm)
        $reservations = Reservasi::where('id_space', $spaceId)
            ->where('tanggal_reservasi', $tanggal)
            ->whereIn('status', ['belum_dikonfirm', 'disetujui', 'aktif'])
            ->get();

        $overlappingCount = 0;

        foreach ($reservations as $res) {
            $resStart = Carbon::parse($res->tanggal_reservasi . ' ' . $res->jam_mulai);
            $resEnd = Carbon::parse($res->jam_selesai);

            // Cek apakah ada irisan waktu
            if ($start->lt($resEnd) && $end->gt($resStart)) {
                $overlappingCount++; 
                if ($overlappingCount >= $kapasitasMaksimal) {
                    return false; // Slot penuh sesuai tipe booking ruangan
                }
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
