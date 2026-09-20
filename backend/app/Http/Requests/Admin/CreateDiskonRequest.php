<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateDiskonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Enforce the unique condition manually scoped per owner
        $idOwner = $this->user()->spaceOwner->id ?? null;

        return [
            'nama_diskon' => [
                'required', 
                'string',
                Rule::unique('diskons')->where(function ($query) use ($idOwner) {
                    return $query->where('id_owner', $idOwner);
                })
            ],
            'persentase_diskon' => 'required|integer|min:1|max:100',
            'tanggal_awal' => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ];
    }
}
