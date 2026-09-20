<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpaceOwner extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'nama_coworking',
        'nama_pemilik',
        'telp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function spaces()
    {
        return $this->hasMany(Space::class, 'id_owner');
    }

    public function diskons()
    {
        return $this->hasMany(Diskon::class, 'id_owner');
    }
}
