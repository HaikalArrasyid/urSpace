<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_booking',
        'id_member',
        'id_space',
        'id_diskon',
        'tanggal_reservasi',
        'jam_mulai',
        'jam_selesai',
        'durasi_jam',
        'harga_per_jam',
        'total_harga_awal',
        'potongan_diskon',
        'total_bayar',
        'status',
        'check_in_time',
        'check_out_time',
        'payment_method',
        'payment_status',
        'transaction_code',
        'gate_sync_status',
        'security_hash',
        'gateway_node',
        'qr_serial_token',
        'discount_code',
        'discount_amount',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'id_member');
    }

    public function space()
    {
        return $this->belongsTo(Space::class, 'id_space');
    }

    public function diskon()
    {
        return $this->belongsTo(Diskon::class, 'id_diskon');
    }
}
