<?php
use App\Models\User;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->u = User::create(['username' => 'logintest', 'password' => Hash::make('secret'), 'role' => 'member']);
    $this->m = Member::create(['id_user'=>$this->u->id, 'nama_member'=>'A', 'instansi'=>'A', 'alamat'=>'A', 'telp'=>'1', 'email'=>'l@m.c']);
});

test('Login Happy Path', function () {
    $res = $this->postJson('/api/auth/login', ['username' => 'logintest', 'password' => 'secret']);
    $res->assertStatus(200)->assertJsonStructure(['data' => ['access_token', 'role']]);
    expect($res->json('data.password'))->toBeNull(); // No leak
});

test('Login Validation Failure', function () {
    $this->postJson('/api/auth/login', ['username' => 'none', 'password' => 'wrong'])->assertStatus(401);
    $this->postJson('/api/auth/login', [])->assertStatus(400);
});

test('Get Profile Happy Path', function () {
    $token = $this->u->createToken('auth')->plainTextToken;
    $this->withToken($token)->getJson('/api/auth/profile')
        ->assertStatus(200)
        ->assertJsonPath('data.username', 'logintest');
});

test('Get Profile Auth Bounds', function () {
    $this->getJson('/api/auth/profile')->assertStatus(401);
});

test('Put Member Profile (Happy)', function () {
    $token = $this->u->createToken('auth')->plainTextToken;
    $this->withToken($token)->putJson('/api/member/profile', ['nama_member' => 'UPD'])
        ->assertStatus(200);
});

test('Put Member Profile Auth Bounds', function () {
    $this->putJson('/api/member/profile', ['nama_member' => 'UPD'])->assertStatus(401);
});
