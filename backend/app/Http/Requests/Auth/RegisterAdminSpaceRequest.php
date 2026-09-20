<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterAdminSpaceRequest extends FormRequest
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
            'nama_coworking' => ['required', 'string'],
            'nama_pemilik' => ['required', 'string'],
            'telp' => ['required', 'string'],
        ];
    }
}
