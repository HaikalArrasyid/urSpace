<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiskonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_diskon' => 'sometimes|string',
            'persentase_diskon' => 'sometimes|integer|min:1|max:100',
            'tanggal_awal' => 'sometimes|date',
            'tanggal_akhir' => 'sometimes|date|after_or_equal:tanggal_awal',
        ];
    }
}
