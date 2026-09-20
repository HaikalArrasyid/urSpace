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
        Schema::table('reservasis', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('total_bayar');
            $table->enum('payment_status', ['pending', 'lunas', 'refund'])->default('pending')->after('payment_method');
            $table->string('transaction_code')->nullable()->after('payment_status');
            $table->string('gate_sync_status')->nullable()->after('transaction_code');
            $table->string('security_hash')->nullable()->after('gate_sync_status');
            $table->string('gateway_node')->nullable()->after('security_hash');
            $table->string('qr_serial_token')->nullable()->after('gateway_node');
            $table->string('discount_code')->nullable()->after('qr_serial_token');
            $table->integer('discount_amount')->nullable()->after('discount_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservasis', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'transaction_code',
                'gate_sync_status',
                'security_hash',
                'gateway_node',
                'qr_serial_token',
                'discount_code',
                'discount_amount',
            ]);
        });
    }
};
