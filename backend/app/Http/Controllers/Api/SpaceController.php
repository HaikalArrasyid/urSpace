<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Space;
use App\Services\ReservationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    use ApiResponse;

    public function types()
    {
        $types = [
            ['tipe' => 'desk', 'label' => 'Personal Desk'],
            ['tipe' => 'meeting_room', 'label' => 'Meeting Room'],
            ['tipe' => 'private_office', 'label' => 'Private Office'],
        ];

        return $this->successResponse('Berhasil memproses permintaan', $types);
    }

    public function availability(Request $request, ReservationService $reservationService)
    {
        $request->validate([
            'id_space' => 'required|exists:spaces,id',
            'tanggal' => 'required|date_format:Y-m-d',
            'jam_mulai' => 'required|date_format:H:i',
            'durasi_jam' => 'required|integer|min:1',
        ]);

        $available = $reservationService->checkAvailability(
            $request->id_space,
            $request->tanggal,
            $request->jam_mulai,
            $request->durasi_jam
        );

        if (!$available) {
            return $this->errorResponse('Maaf, space sudah terisi atau dibooking pada jam tersebut!', 'Bad Request', 400);
        }

        return $this->successResponse('Space tersedia untuk dipesan pada jadwal yang diminta', ['available' => true]);
    }

    public function index(Request $request)
    {
        $query = Space::query();
        if ($request->has('tipe')) {
            $query->where('tipe', $request->tipe);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_space', 'like', "%$search%")
                  ->orWhere('deskripsi', 'like', "%$search%");
            });
        }

        return $this->successResponse('Berhasil memproses permintaan', $query->get());
    }

    public function show($id)
    {
        $space = Space::find($id);
        if (!$space) return $this->errorResponse('Space tidak ditemukan', 'Not Found', 404);
        return $this->successResponse('Berhasil memproses permintaan', $space);
    }

    public function availabilitySummary(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        $month = $request->month;
        $year = $request->year;

        $daysInMonth = \Carbon\Carbon::createFromDate($year, $month, 1)->daysInMonth;
        
        $spacesCount = Space::count();
        $totalDailyHoursCapacity = $spacesCount * 24; // 24 hours per day
        
        $reservations = \App\Models\Reservasi::whereNotIn('status', ['dibatalkan'])
            ->whereMonth('tanggal_reservasi', $month)
            ->whereYear('tanggal_reservasi', $year)
            ->get()
            ->groupBy('tanggal_reservasi');

        $result = [];
        for ($i = 1; $i <= $daysInMonth; $i++) {
            $date = \Carbon\Carbon::createFromDate($year, $month, $i)->format('Y-m-d');
            $bookedHours = 0;
            
            if (isset($reservations[$date])) {
                foreach ($reservations[$date] as $res) {
                    $bookedHours += $res->durasi_jam;
                }
            }
            
            $result[] = [
                'tanggal' => $date,
                'full' => $totalDailyHoursCapacity > 0 ? ($bookedHours >= $totalDailyHoursCapacity) : false
            ];
        }

        return $this->successResponse('Berhasil', $result);
    }
}

