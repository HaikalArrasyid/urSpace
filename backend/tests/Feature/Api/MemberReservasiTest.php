<?php

use App\Models\User;
use App\Models\Space;
use App\Models\SpaceOwner;
use App\Models\Member;
use App\Models\Reservasi;

beforeEach(function () {
    $this->u = User::create(['username' => 'm3', 'password' => '1', 'role' => 'member']);
    $this->m = Member::create(['id_user'=>$this->u->id, 'nama_member'=>'A', 'instansi'=>'A', 'alamat'=>'A', 'telp'=>'1', 'email'=>'l@m.c']);
    $this->tkn = $this->u->createToken('auth')->plainTextToken;

    $this->ou = User::create(['username' => 's_own2', 'password' => '1', 'role' => 'admin_space']);
    $this->ow = SpaceOwner::create(['id_user' => $this->ou->id, 'nama_coworking' => 'HQ', 'nama_pemilik' => 'O', 'telp' => '1']);
    $this->s1 = Space::create([
        'id_owner' => $this->ow->id,
        'nama_space' => 'Desk A',
        'harga_per_jam' => 15000,
        'tipe' => 'desk',
        'kapasitas' => 1,
        'deskripsi' => 'A'
    ]);
});

test('Member /my (Happy)', function () {
    $this->withToken($this->tkn)->getJson('/api/reservasi/my')->assertStatus(200);
});

test('Member /my (Auth Boundary)', function () {
    $this->getJson('/api/reservasi/my')->assertStatus(401);
});

test('Member /my/history (Happy and Filtering)', function () {
    $this->withToken($this->tkn)->getJson('/api/reservasi/my/history')->assertStatus(200);
    $this->withToken($this->tkn)->getJson('/api/reservasi/my/history?month=1&year=2030')->assertStatus(200);
});

test('Member /my/history (Auth Boundary)', function () {
    $this->getJson('/api/reservasi/my/history')->assertStatus(401);
});

test('Member eTicket (Happy, Not Found, Forbidden if not approved)', function () {
    $r = Reservasi::create([
        'id_member' => $this->m->id,
        'id_space' => $this->s1->id,
        'kode_booking' => 'B1',
        'tanggal_reservasi' => '2030-01-01',
        'jam_mulai' => '10:00:00',
        'jam_selesai' => '2030-01-01 12:00:00',
        'durasi_jam' => 2,
        'harga_per_jam' => 15000,
        'total_harga_awal' => 30000,
        'potongan_diskon' => 0,
        'total_bayar' => 30000,
        'status' => 'belum_dikonfirm',
    ]);
    
    // Not approved yet
    $this->withToken($this->tkn)->getJson('/api/reservasi/'.$r->id.'/e-ticket')->assertStatus(400);
    
    // Set approved
    $r->update(['status' => 'disetujui']);
    $this->withToken($this->tkn)->getJson('/api/reservasi/'.$r->id.'/e-ticket')->assertStatus(200);
    
    // Not found
    $this->withToken($this->tkn)->getJson('/api/reservasi/999/e-ticket')->assertStatus(404);
});

test('Member Cancel Reservation', function () {
    $r = Reservasi::create([
        'id_member' => $this->m->id,
        'id_space' => $this->s1->id,
        'kode_booking' => 'B2',
        'tanggal_reservasi' => '2030-01-01',
        'jam_mulai' => '10:00:00',
        'jam_selesai' => '2030-01-01 12:00:00',
        'durasi_jam' => 2,
        'harga_per_jam' => 15000,
        'total_harga_awal' => 30000,
        'potongan_diskon' => 0,
        'total_bayar' => 30000,
        'status' => 'disetujui',
    ]);
    
    $this->withToken($this->tkn)->patchJson('/api/reservasi/'.$r->id.'/cancel')->assertStatus(200);
    expect($r->fresh()->status)->toBe('dibatalkan');
    $this->withToken($this->tkn)->patchJson('/api/reservasi/999/cancel')->assertStatus(404);
});

test('Member Cancel Auth Bounds', function () {
    $this->patchJson('/api/reservasi/1/cancel')->assertStatus(401);
    $this->getJson('/api/reservasi/1/e-ticket')->assertStatus(401);
});
