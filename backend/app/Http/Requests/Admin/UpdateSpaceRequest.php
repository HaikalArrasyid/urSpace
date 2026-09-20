<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_space' => 'sometimes|string',
            'harga_per_jam' => 'sometimes|integer',
            'tipe' => 'sometimes|in:desk,meeting_room,private_office',
            'kapasitas' => 'sometimes|integer',
            'deskripsi' => 'sometimes|string',
            'foto' => 'nullable|string',
        ];
    }
}
