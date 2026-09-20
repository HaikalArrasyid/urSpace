<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class CreateReservasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_space' => 'required|exists:spaces,id',
            'tanggal_reservasi' => 'required|date_format:Y-m-d',
            'jam_mulai' => 'required|date_format:H:i',
            'durasi_jam' => 'required|integer|min:1',
            'id_diskon' => 'nullable|exists:diskons,id',
            'kode_promo' => 'nullable|string',
        ];
    }
}
