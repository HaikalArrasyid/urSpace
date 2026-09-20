<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_space' => 'required|string',
            'harga_per_jam' => 'required|integer',
            'tipe' => 'required|in:desk,meeting_room,private_office',
            'kapasitas' => 'required|integer',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|string',
        ];
    }
}
