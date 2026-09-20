<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'unique:users,username'],
            'password' => ['required', 'string', 'min:6'],
            'nama_member' => ['required', 'string'],
            'instansi' => ['required', 'string'],
            'alamat' => ['required', 'string'],
            'telp' => ['required', 'string', 'regex:/^[0-9]+$/'],
            'email' => ['required', 'string', 'email', 'unique:members,email'],
        ];
    }
}
