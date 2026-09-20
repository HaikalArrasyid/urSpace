<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

test('Member registration (Happy Path)', function () {
    $res = $this->postJson('/api/auth/register/member', [
        'username' => 'mem_'.Str::random(5),
        'password' => 'secret123',
        'nama_member' => 'Test',
        'instansi' => 'Free',
        'alamat' => 'Sudirman',
        'telp' => '081',
        'email' => 'a@mail.com',
    ]);
    $res->assertStatus(201)->assertJsonPath('status', true);
    expect($res->json('data.password') ?? $res->json('data.user.password'))->toBeNull(); // No leak
});

test('Admin registration (Happy Path) & No Leak', function () {
    $res = $this->postJson('/api/auth/register/admin-space', [
        'username' => 'adm_'.Str::random(5),
        'password' => 'secret123',
        'nama_coworking' => 'HQ',
        'nama_pemilik' => 'O',
        'telp' => '081',
    ]);
    $res->assertStatus(201)->assertJsonPath('status', true);
    expect($res->json('data.password') ?? $res->json('data.user.password'))->toBeNull(); // No leak
    
    // Hash verify
    $u = User::where('username', $res->json('data.username') ?? $res->json('data.user.username'))->first();
    expect(Hash::check('secret123', $u->password))->toBeTrue();
});

test('Registration Validation Failures', function () {
    // Missing required member fields
    $this->postJson('/api/auth/register/member', ['username' => 'x'])->assertStatus(400);
    // Duplicate username
    User::create(['username' => 'dup', 'password' => '1', 'role' => 'member']);
    $this->postJson('/api/auth/register/member', [
        'username' => 'dup', 'password' => '1', 'nama_member' => 'A', 'instansi' => 'A', 'alamat' => 'A', 'telp' => '1', 'email' => 'A@m.c'
    ])->assertStatus(400);
});
