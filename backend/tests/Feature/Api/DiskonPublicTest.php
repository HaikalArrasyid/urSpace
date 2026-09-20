<?php
use App\Models\Diskon;
use App\Models\User;
use App\Models\SpaceOwner;

beforeEach(function () {
    $this->oUser = User::create(['username' => 'd_own', 'password' => '123', 'role' => 'admin_space']);
    $this->o = SpaceOwner::create(['id_user' => $this->oUser->id, 'nama_coworking' => 'HQ', 'nama_pemilik' => 'O', 'telp' => '1']);
});

test('Diskon Active (Happy)', function () {
    Diskon::create([
        'id_owner' => $this->o->id,
        'nama_diskon' => 'A10',
        'persentase_diskon' => 10,
        'tanggal_awal' => now()->subDay(),
        'tanggal_akhir' => now()->addMonth()
    ]);
    
    $this->getJson('/api/diskon/active')->assertStatus(200)->assertJsonFragment(['nama_diskon' => 'A10']);
});

test('Diskon Show (Happy & Fail)', function () {
    $d = Diskon::create([
        'id_owner' => $this->o->id,
        'nama_diskon' => 'A20',
        'persentase_diskon' => 20,
        'tanggal_awal' => now()->subDay(),
        'tanggal_akhir' => now()->addMonth()
    ]);
    $this->getJson('/api/diskon/'.$d->id)->assertStatus(200);
    $this->getJson('/api/diskon/999')->assertStatus(404);
});

test('Diskon Check Validation Fails', function () {
    $this->postJson('/api/diskon/check', [])->assertStatus(400);
});
