<?php

use App\Models\Space;
use App\Models\User;
use App\Models\SpaceOwner;
use App\Models\Member;
use App\Models\Diskon;

beforeEach(function () {
    $this->ownerUser = User::create(['username' => 'ownr3', 'password' => '123', 'role' => 'admin_space']);
    $this->owner = SpaceOwner::create(['id_user' => $this->ownerUser->id, 'nama_coworking' => 'Test', 'nama_pemilik' => 'T', 'telp' => '1']);
    $this->adminToken = $this->ownerUser->createToken('auth')->plainTextToken;
    
    $this->memberUser = User::create(['username'=>'mem3','password'=>'1','role'=>'member']);
    $this->member = Member::create(['id_user'=>$this->memberUser->id,'nama_member'=>'m','instansi'=>'m','telp'=>'1','email'=>'m3@m.c','alamat'=>'a']);
    $this->memberToken = $this->memberUser->createToken('auth')->plainTextToken;
});

// --- Auth / Role Boundary Tests ---

test('Admin routes rejected without token (401)', function () {
    $this->getJson('/api/admin/spaces')->assertStatus(401);
    $this->getJson('/api/admin/members')->assertStatus(401);
    $this->getJson('/api/admin/diskon')->assertStatus(401);
    $this->getJson('/api/admin/reservasi')->assertStatus(401);
});

test('Admin routes rejected with member token (403)', function () {
    // [ASSUMPTION]: RoleMiddleware returns 403 for wrong role
    $res = $this->withToken($this->memberToken)->getJson('/api/admin/spaces');
    expect($res->status())->toBe(403);
});

// --- Admin Profile ---

test('Admin can fetch and update profile', function () {
    $this->withToken($this->adminToken)->getJson('/api/admin/profile')->assertStatus(200);
    
    $this->withToken($this->adminToken)->putJson('/api/admin/profile', [
        'nama_coworking' => 'Updated HQ',
        'nama_pemilik' => 'Haikal Updated',
        'telp' => '089999',
    ])->assertStatus(200);
});

// --- Spaces CRUD ---

test('Admin can CRUD spaces', function () {
    // Create
    $res = $this->withToken($this->adminToken)->postJson('/api/admin/spaces', [
        'nama_space' => 'New Dsk',
        'harga_per_jam' => 50000,
        'tipe' => 'desk',
        'kapasitas' => 2,
        'deskripsi' => 'xyz'
    ]);
    $res->assertStatus(201);
    $spaceId = $res->json('data.id');
    
    // Show
    $this->withToken($this->adminToken)->getJson('/api/admin/spaces/'.$spaceId)->assertStatus(200);
    
    // Update
    $this->withToken($this->adminToken)->putJson('/api/admin/spaces/'.$spaceId, ['nama_space' => 'UPD'])->assertStatus(200);
        
    // Delete
    $this->withToken($this->adminToken)->deleteJson('/api/admin/spaces/'.$spaceId)->assertStatus(200);
    
    // Show after delete -> 404
    $this->withToken($this->adminToken)->getJson('/api/admin/spaces/'.$spaceId)->assertStatus(404);
});

// --- Members CRUD ---

test('Admin can CRUD members', function () {
    // List
    $this->withToken($this->adminToken)->getJson('/api/admin/members')->assertStatus(200);
    
    // Create
    $res = $this->withToken($this->adminToken)->postJson('/api/admin/members', [
        'username' => 'newmem',
        'password' => 'secret',
        'nama_member' => 'Budi',
        'instansi' => 'PT XYZ',
        'alamat' => 'Jakarta',
        'telp' => '08111',
        'email' => 'budi@mail.com'
    ]);
    $res->assertStatus(201);
    $memId = $res->json('data.id');
    
    // Show
    $this->withToken($this->adminToken)->getJson('/api/admin/members/'.$memId)->assertStatus(200);
    
    // Update
    $this->withToken($this->adminToken)->putJson('/api/admin/members/'.$memId, ['nama_member' => 'Budi Upd'])->assertStatus(200);
    
    // Delete
    $this->withToken($this->adminToken)->deleteJson('/api/admin/members/'.$memId)->assertStatus(200);
});

// --- Diskon CRUD ---

test('Admin can CRUD discounts', function () {
    $res = $this->withToken($this->adminToken)->postJson('/api/admin/diskon', [
        'nama_diskon' => 'NEWPROMO',
        'persentase_diskon' => 30,
        'tanggal_awal' => now()->format('Y-m-d'),
        'tanggal_akhir' => now()->addMonth()->format('Y-m-d'),
    ]);
    $res->assertStatus(201);
    $diskonId = $res->json('data.id');
    
    // Show
    $this->withToken($this->adminToken)->getJson('/api/admin/diskon/'.$diskonId)->assertStatus(200);
    
    // Update
    $this->withToken($this->adminToken)->putJson('/api/admin/diskon/'.$diskonId, ['persentase_diskon' => 40])->assertStatus(200);
    
    // Delete
    $this->withToken($this->adminToken)->deleteJson('/api/admin/diskon/'.$diskonId)->assertStatus(200);
});

// --- Reports ---

test('Admin can fetch monthly report', function () {
    $this->withToken($this->adminToken)->getJson('/api/admin/reports/monthly')->assertStatus(200)->assertJsonStructure(['data']);
});

// --- Never Leak Password ---

test('Admin member endpoints never leak password', function () {
    $res = $this->withToken($this->adminToken)->getJson('/api/admin/members');
    $res->assertStatus(200);
    $members = $res->json('data');
    if (is_array($members) && count($members) > 0) {
        foreach ($members as $m) {
            expect($m)->not->toHaveKey('password');
        }
    }
});
