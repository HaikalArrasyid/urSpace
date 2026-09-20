<?php
use App\Models\Space;
use App\Models\User;
use App\Models\SpaceOwner;

beforeEach(function () {
    $this->ownerUser = User::create(['username' => 's_own', 'password' => '123', 'role' => 'admin_space']);
    $this->owner = SpaceOwner::create(['id_user' => $this->ownerUser->id, 'nama_coworking' => 'HQ', 'nama_pemilik' => 'O', 'telp' => '1']);
    
    $this->s1 = Space::create([
        'id_owner' => $this->owner->id,
        'nama_space' => 'Desk A',
        'harga_per_jam' => 15000,
        'tipe' => 'desk',
        'kapasitas' => 1,
        'deskripsi' => 'A'
    ]);
});

test('Space Types (Happy)', function () {
    $this->getJson('/api/spaces/types')->assertStatus(200)->assertJsonStructure(['data']);
});

test('Space Index (Happy & Search Bound)', function () {
    // No auth required
    $this->getJson('/api/spaces')->assertStatus(200)->assertJsonFragment(['nama_space' => 'Desk A']);
    $this->getJson('/api/spaces?search=Desk')->assertStatus(200)->assertJsonFragment(['nama_space' => 'Desk A']);
    $res = $this->getJson('/api/spaces?search=INVALIDX')->assertStatus(200);
    expect(count($res->json('data')))->toBe(0);
});

test('Space Show (Happy & NotFound)', function () {
    $this->getJson('/api/spaces/'.$this->s1->id)->assertStatus(200);
    $this->getJson('/api/spaces/9999')->assertStatus(404);
});

test('Space Availability (Validation Fails)', function () {
    // Missing durasi_jam
    $this->getJson('/api/spaces/availability?id_space='.$this->s1->id.'&tanggal=2030-01-01&jam_mulai=10:00')->assertStatus(400);
});

test('Space Availability Summary (Happy)', function () {
    $this->getJson('/api/public/availability-summary?month=1&year=2030')->assertStatus(200);
});

test('Space Availability Summary (Validation Fails)', function () {
    $this->getJson('/api/public/availability-summary')->assertStatus(400);
});
