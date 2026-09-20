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
        Schema::create('space_owners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->unique()->constrained('users')->onDelete('cascade');
            $table->string('nama_coworking');
            $table->string('nama_pemilik');
            $table->string('telp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('space_owners');
    }
};
