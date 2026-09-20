<?php

use App\Models\Space;
use App\Models\User;
use App\Models\SpaceOwner;
use App\Models\Reservasi;
use App\Models\Member;

beforeEach(function () {
    $this->ownerUser = User::create(['username' => 'own', 'password' => '123', 'role' => 'admin_space']);
    $this->owner = SpaceOwner::create(['id_user' => $this->ownerUser->id, 'nama_coworking' => 'Test', 'nama_pemilik' => 'Test', 'telp' => '123']);
});

test('GET /api/spaces/types returns array of types', function () {
    $response = $this->getJson('/api/spaces/types');
    $response->assertStatus(200)
        ->assertJsonStructure(['data' => [['tipe', 'label']]]);
});

test('GET /api/spaces returns spaces', function () {
    Space::create([
        'id_owner' => $this->owner->id,
        'nama_space' => 'Desk 1',
        'harga_per_jam' => 10000,
        'tipe' => 'desk',
        'kapasitas' => 1,
        'deskripsi' => 'test'
    ]);

    $response = $this->getJson('/api/spaces');
    $response->assertStatus(200)
        ->assertJsonFragment(['nama_space' => 'Desk 1']);
        
    $responseFiltered = $this->getJson('/api/spaces?search=Desk');
    $responseFiltered->assertStatus(200);
});

test('GET /api/spaces/{id} returns detail or 404', function () {
    $space = Space::create([
        'id_owner' => $this->owner->id,
        'nama_space' => 'Desk Detail',
        'harga_per_jam' => 10000,
        'tipe' => 'desk',
        'kapasitas' => 1,
        'deskripsi' => 'test detail'
    ]);

    $response = $this->getJson('/api/spaces/' . $space->id);
    $response->assertStatus(200)
        ->assertJsonPath('data.nama_space', 'Desk Detail');
        
    $this->getJson('/api/spaces/99999')->assertStatus(404);
});

test('GET /api/spaces/availability check overlaps', function () {
    $space = Space::create([
        'id_owner' => $this->owner->id,
        'nama_space' => 'Desk Avail',
        'harga_per_jam' => 10000,
        'tipe' => 'desk',
        'kapasitas' => 1,
        'deskripsi' => 'test 123'
    ]);
    
    // Check free space
    $response = $this->getJson('/api/spaces/availability?id_space=' . $space->id . '&tanggal=2030-01-01&jam_mulai=10:00&durasi_jam=2');
    $response->assertStatus(200)->assertJsonPath('status', true);
    
    // Create an active reservation
    $memberUser = User::create(['username'=>'m','password'=>'1','role'=>'member']);
    $member = Member::create(['id_user'=>$memberUser->id,'nama_member'=>'m','instansi'=>'m','telp'=>'1','email'=>'m@m.c','alamat'=>'a']);
    
    Reservasi::create([
        'id_member' => $member->id,
        'id_space' => $space->id,
        'kode_booking' => 'BK1',
        'tanggal_reservasi' => '2030-01-01',
        'jam_mulai' => '10:00:00',
        'jam_selesai' => '2030-01-01 12:00:00',
        'durasi_jam' => 2,
        'harga_per_jam' => 10000,
        'total_harga_awal' => 20000,
        'potongan_diskon' => 0,
        'total_bayar' => 20000,
        'status' => 'disetujui' // Takes up the slot
    ]);
    
    // Missing fields check
    $this->getJson('/api/spaces/availability')->assertStatus(400);

    // Overlapping check
    $responseOverlaps = $this->getJson('/api/spaces/availability?id_space=' . $space->id . '&tanggal=2030-01-01&jam_mulai=11:00&durasi_jam=2');
    $responseOverlaps->assertStatus(400);
    
    // No-buffer exact boundary (Ends at 10:00, Starts at 10:00) -> Should NOT conflict
    $responseEdge = $this->getJson('/api/spaces/availability?id_space=' . $space->id . '&tanggal=2030-01-01&jam_mulai=08:00&durasi_jam=2');
    $responseEdge->assertStatus(200); // 08:00 to 10:00 does not overlap 10:00 to 12:00
});

