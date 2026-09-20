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
        Schema::table('spaces', function (Blueprint $table) {
            $table->string('image_cover')->nullable()->after('foto');
            $table->string('badge_label')->nullable()->after('image_cover');
            $table->integer('wifi_speed_mbps')->nullable()->after('badge_label');
            $table->integer('area_sqm')->nullable()->after('wifi_speed_mbps');
            $table->string('floor')->nullable()->after('area_sqm');
            $table->string('location_name')->nullable()->after('floor');
            $table->text('facilities_text')->nullable()->after('location_name');
            $table->decimal('rating', 3, 2)->nullable()->after('facilities_text');
            $table->integer('review_count')->nullable()->after('rating');
            $table->json('gallery')->nullable()->after('review_count');
            $table->json('gallery_labels')->nullable()->after('gallery');
            $table->json('amenities')->nullable()->after('gallery_labels');
            $table->json('specs')->nullable()->after('amenities');
            $table->string('host_name')->nullable()->after('specs');
            $table->string('host_avatar')->nullable()->after('host_name');
            $table->string('host_response_time')->nullable()->after('host_avatar');
            $table->decimal('latitude', 10, 7)->nullable()->after('host_response_time');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('nearby_info')->nullable()->after('longitude');
            $table->text('description_long')->nullable()->after('nearby_info');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spaces', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
