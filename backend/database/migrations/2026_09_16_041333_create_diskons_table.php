<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('diskons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_owner')->constrained('space_owners')->onDelete('cascade');
            $table->string('nama_diskon');
            $table->integer('persentase_diskon');
            $table->timestamp('tanggal_awal');
            $table->timestamp('tanggal_akhir');
            $table->timestamps();
            
            // Per the [ASSUMPTION] in SCHEMA.md:
            // Ensure promo codes are unique per Space Owner, not globally.
            $table->unique(['id_owner', 'nama_diskon']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diskons');
    }
};
