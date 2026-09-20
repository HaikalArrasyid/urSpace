<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diskon;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DiskonController extends Controller
{
    use ApiResponse;

    public function active()
    {
        $activeDiskons = Diskon::where('tanggal_awal', '<=', now())
            ->where('tanggal_akhir', '>=', now())
            ->get();

        return $this->successResponse('Berhasil memproses permintaan', $activeDiskons);
    }

    public function check(Request $request)
    {
        $request->validate(['nama_diskon' => 'required|string']);

        $diskon = Diskon::where('nama_diskon', $request->nama_diskon)
            ->where('tanggal_awal', '<=', now())
            ->where('tanggal_akhir', '>=', now())
            ->first();

        if (!$diskon) {
            return $this->errorResponse('Kode promo tidak ditemukan atau sudah kedaluwarsa!', 'Bad Request', 400);
        }

        return $this->successResponse('Kode promo valid dan masih berlaku!', $diskon);
    }

    public function show($id)
    {
        $diskon = Diskon::find($id);
        if (!$diskon) {
            return $this->errorResponse('Diskon tidak ditemukan', 'Not Found', 404);
        }

        return $this->successResponse('Berhasil memproses permintaan', $diskon);
    }
}
