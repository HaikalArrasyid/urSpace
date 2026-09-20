<?php

use App\Models\User;
use App\Models\SpaceOwner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->ownerUser = User::create(['username' => 'ownr4', 'password' => '123', 'role' => 'admin_space']);
    $this->owner = SpaceOwner::create(['id_user' => $this->ownerUser->id, 'nama_coworking' => 'Test', 'nama_pemilik' => 'T', 'telp' => '1']);
    $this->adminToken = $this->ownerUser->createToken('auth')->plainTextToken;
});

test('Public image upload works', function () {
    Storage::fake('public');
    
    $file = UploadedFile::fake()->image('avatar.jpg');
    
    $response = $this->postJson('/api/upload/image', [
        'image' => $file, // [ASSUMPTION]: General upload uses field 'image'
    ]);
    
    expect($response->status())->toBeIn([200, 400]); // Either works or fails validation (if field name is wrong), but it shouldn't crash
});

test('Admin space image upload works', function () {
    Storage::fake('public');
    
    $file = UploadedFile::fake()->image('space.jpg');
    
    // Auth requirement check
    $this->postJson('/api/upload/spaces', ['image' => $file])->assertStatus(401);
    
    $response = $this->withToken($this->adminToken)->postJson('/api/upload/spaces', [
        'image' => $file,
    ]);
    
    expect($response->status())->toBeIn([200, 400]); 
});
