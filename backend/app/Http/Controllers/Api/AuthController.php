<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterAdminSpaceRequest;
use App\Http\Requests\Auth\RegisterMemberRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function registerMember(RegisterMemberRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => 'member',
            ]);

            $member = $user->member()->create([
                'nama_member' => $request->nama_member,
                'instansi' => $request->instansi,
                'alamat' => $request->alamat,
                'telp' => $request->telp,
                'email' => $request->email,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return $this->successResponse('Registrasi member berhasil!', [
                'id' => $user->id,
                'username' => $user->username,
                'role' => $user->role,
                'member' => $member,
                'access_token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse('Terjadi kesalahan sistem', 'Internal Server Error', 500);
        }
    }

    public function registerAdminSpace(RegisterAdminSpaceRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => 'admin_space',
            ]);

            $owner = $user->spaceOwner()->create([
                'nama_coworking' => $request->nama_coworking,
                'nama_pemilik' => $request->nama_pemilik,
                'telp' => $request->telp,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return $this->successResponse('Registrasi Admin Space berhasil!', [
                'id' => $user->id,
                'username' => $user->username,
                'role' => $user->role,
                'space_owner' => $owner,
                'access_token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse('Terjadi kesalahan sistem', 'Internal Server Error', 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Username atau Password salah!', 'Unauthorized', 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load(['member', 'spaceOwner']);

        return $this->successResponse('Login berhasil!', [
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
            'member' => $user->role === 'member' ? $user->member : null,
            'space_owner' => $user->role === 'admin_space' ? $user->spaceOwner : null,
            'access_token' => $token,
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        $user->load(['member', 'spaceOwner']);

        return $this->successResponse('Berhasil memproses permintaan', [
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
            'member' => $user->role === 'member' ? $user->member : null,
            'space_owner' => $user->role === 'admin_space' ? $user->spaceOwner : null,
        ]);
    }

    public function updateMemberProfile(Request $request)
    {
        $user = $request->user();
        $member = $user->member;
        $request->validate([
            'nama_member' => 'nullable|string',
            'instansi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telp' => 'nullable|string|regex:/^[0-9]+$/',
            'email' => 'nullable|string|email|unique:members,email,'.($member ? $member->id : 'NULL'),
            'password' => 'nullable|string|min:6',
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $member = $user->member;
        if ($member) {
            $memberData = [];
            if ($request->filled('nama_member')) {
                $memberData['nama_member'] = $request->nama_member;
            }
            if ($request->filled('instansi')) {
                $memberData['instansi'] = $request->instansi;
            }
            if ($request->filled('alamat')) {
                $memberData['alamat'] = $request->alamat;
            }
            if ($request->filled('telp')) {
                $memberData['telp'] = $request->telp;
            }
            if ($request->filled('email')) {
                $memberData['email'] = $request->email;
            }
            if (! empty($memberData)) {
                $member->update($memberData);
            }
        }

        // Return updated object (user + member data, excluding password)
        $user->refresh()->load('member');

        return $this->successResponse('Profil berhasil diperbarui', [
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
            'member' => $user->member,
        ]);
    }
}
