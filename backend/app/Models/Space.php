<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Space extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_owner',
        'nama_space',
        'harga_per_jam',
        'tipe',
        'kapasitas',
        'deskripsi',
        'foto',
        'image_cover',
        'badge_label',
        'wifi_speed_mbps',
        'area_sqm',
        'floor',
        'location_name',
        'facilities_text',
        'rating',
        'review_count',
        'gallery',
        'gallery_labels',
        'amenities',
        'specs',
        'host_name',
        'host_avatar',
        'host_response_time',
        'latitude',
        'longitude',
        'nearby_info',
        'description_long',
        'is_open_24_7',
    ];

    protected $casts = [
        'gallery' => 'array',
        'gallery_labels' => 'array',
        'amenities' => 'array',
        'specs' => 'array',
        'rating' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_open_24_7' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(SpaceOwner::class, 'id_owner');
    }
}
