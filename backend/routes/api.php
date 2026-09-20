<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiskonController;
use App\Http\Controllers\Api\ReservasiController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

// 1. Root & Health
Route::get('/', function () {
    return response()->json([
        'status' => true,
        'statusCode' => 200,
        'message' => 'Berhasil memproses permintaan',
        'data' => [
            'name' => 'Coworking Space Backend API - UKK RPL Paket B',
            'version' => '1.0.0',
            'status' => 'online',
        ],
        'timestamp' => now()->toIso8601String()
    ], 200);
});

Route::get('/health', function () {
    return response()->json([
        'status' => true,
        'statusCode' => 200,
        'message' => 'Berhasil memproses permintaan',
        'data' => ['status' => 'ok'],
        'timestamp' => now()->toIso8601String()
    ], 200);
});

// 2. Auth Profiles
Route::prefix('auth')->group(function () {
    Route::post('/register/member', [AuthController::class, 'registerMember']);
    Route::post('/register/admin-space', [AuthController::class, 'registerAdminSpace']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);
});

Route::prefix('member')->middleware(['auth:sanctum', 'role:member'])->group(function () {
    Route::put('/profile', [AuthController::class, 'updateMemberProfile']);
});

// 3. Public Space & Discount Modules
Route::get('/public/availability-summary', [SpaceController::class, 'availabilitySummary']);
Route::prefix('spaces')->group(function () {
    Route::get('/types', [SpaceController::class, 'types']);
    Route::get('/availability', [SpaceController::class, 'availability']);
    Route::get('/', [SpaceController::class, 'index']);
    Route::get('/{id}', [SpaceController::class, 'show']);
});

Route::prefix('diskon')->group(function () {
    Route::get('/active', [DiskonController::class, 'active']);
    Route::post('/check', [DiskonController::class, 'check']);
    Route::get('/{id}', [DiskonController::class, 'show']);
});

// 4. Member Reservation Actions
Route::prefix('reservasi')->middleware(['auth:sanctum', 'role:member'])->group(function () {
    Route::post('/', [ReservasiController::class, 'create']);
    Route::get('/my', [ReservasiController::class, 'myReservations']);
    Route::get('/my/history', [ReservasiController::class, 'history']);
    Route::patch('/{id}/cancel', [ReservasiController::class, 'cancel']);
});

// Shared routes (Member/Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reservasi/{id}/e-ticket', [ReservasiController::class, 'eTicket']);
    Route::get('/reservasi/{id}', [ReservasiController::class, 'show']);
});

// 5 & 6. Admin Domains, Booking Validation, Reporting
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin_space'])->group(function () {
    // Admin Profile
    Route::get('/profile', [AdminController::class, 'getProfile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    
    // Members Management
    Route::get('/members', [AdminController::class, 'getMembers']);
    Route::post('/members', [AdminController::class, 'createMember']);
    Route::get('/members/{id}', [AdminController::class, 'getMember']);
    Route::put('/members/{id}', [AdminController::class, 'updateMember']);
    Route::delete('/members/{id}', [AdminController::class, 'deleteMember']);

    // Spaces Management
    Route::get('/spaces', [AdminController::class, 'getSpaces']);
    Route::post('/spaces', [AdminController::class, 'createSpace']);
    Route::get('/spaces/{id}', [AdminController::class, 'getSpace']);
    Route::put('/spaces/{id}', [AdminController::class, 'updateSpace']);
    Route::delete('/spaces/{id}', [AdminController::class, 'deleteSpace']);

    // Promos Management
    Route::get('/diskon', [AdminController::class, 'getDiskons']);
    Route::post('/diskon', [AdminController::class, 'createDiskon']);
    Route::get('/diskon/{id}', [AdminController::class, 'getDiskon']);
    Route::put('/diskon/{id}', [AdminController::class, 'updateDiskon']);
    Route::delete('/diskon/{id}', [AdminController::class, 'deleteDiskon']);

    // Reservations & Queue
    Route::get('/reservasi', [ReservasiController::class, 'indexAdmin']);
    Route::patch('/reservasi/{id}/status', [ReservasiController::class, 'updateStatus']);
    Route::post('/reservasi/{id}/check-in', [ReservasiController::class, 'checkIn']);
    Route::post('/reservasi/{id}/check-out', [ReservasiController::class, 'checkOut']);

    // Reports
    Route::get('/reports/monthly', [AdminController::class, 'getMonthlyReport']);
    Route::get('/reports/income', [AdminController::class, 'getMonthlyReport']); // Alias
});

// 7. Global Uploads
Route::prefix('upload')->group(function () {
    Route::post('/image', [UploadController::class, 'uploadImage']);
    Route::middleware(['auth:sanctum', 'role:admin_space'])->post('/spaces', [UploadController::class, 'uploadSpaces']);
    Route::middleware('auth:sanctum')->post('/members', [UploadController::class, 'uploadMembers']);
});
