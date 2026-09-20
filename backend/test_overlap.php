<?php

use App\Models\User;
use App\Models\Space;
use App\Models\Reservasi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Services\ReservationService;

$adminUser = User::create(['username' => 'admin_test', 'password' => bcrypt('password'), 'role' => 'admin_space']);
$owner = $adminUser->spaceOwner()->create(['nama_coworking' => 'Test Hub', 'nama_pemilik' => 'Admin', 'telp' => '123']);

$space = $owner->spaces()->create(['nama_space' => 'Test Desk', 'harga_per_jam' => 50000, 'tipe' => 'desk', 'kapasitas' => 1, 'deskripsi' => 'test']);

$memberUser = User::create(['username' => 'member_test', 'password' => bcrypt('password'), 'role' => 'member']);
$member = $memberUser->member()->create(['nama_member' => 'Member', 'instansi' => 'A', 'alamat' => 'B', 'telp' => '123']);

// Create First Booking (Active)
$res1 = Reservasi::create([
    'kode_booking' => 'BOOK-1',
    'id_member' => $member->id,
    'id_space' => $space->id,
    'tanggal_reservasi' => '2026-10-10',
    'jam_mulai' => '09:00:00',
    'jam_selesai' => '12:00:00',
    'durasi_jam' => 3,
    'harga_per_jam' => 50000,
    'total_harga_awal' => 150000,
    'potongan_diskon' => 0,
    'total_bayar' => 150000,
    'status' => 'disetujui'
]);

$service = app(ReservationService::class);
$isAvailable = $service->checkAvailability($space->id, '2026-10-10', '10:00', 1);

echo "Overlap Test (Should be false/blocked): " . ($isAvailable ? 'true' : 'false') . "\n";

$pricing = $service->calculatePricing($space->id, 4);
echo "Pricing Test Math Validation:\n";
echo "Hourly = " . $pricing['harga_per_jam'] . ", Duration = 4, Total = " . $pricing['total_bayar'] . "\n";
