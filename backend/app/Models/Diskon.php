<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diskon extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_owner',
        'nama_diskon',
        'persentase_diskon',
        'tanggal_awal',
        'tanggal_akhir',
    ];

    public function owner()
    {
        return $this->belongsTo(SpaceOwner::class, 'id_owner');
    }
}
