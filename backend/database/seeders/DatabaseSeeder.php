<?php

namespace Database\Seeders;

use App\Models\Space;
use App\Models\SpaceOwner;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin (Owner urSpace)
        $adminUser = User::create([
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin_space',
        ]);

        $owner = SpaceOwner::create([
            'id_user' => $adminUser->id,
            'nama_coworking' => 'urSpace HQ',
            'nama_pemilik' => 'Haikal (Admin)',
            'telp' => '081122334455',
        ]);

        // 2. Akun Member (Tester)
        $memberUser = User::create([
            'username' => 'member',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        $memberUser->member()->create([
            'nama_member' => 'Tamu VVIP',
            'instansi' => 'Tech Startup Inc.',
            'alamat' => 'Sudirman Central Business District',
            'telp' => '089988776655',
            'email' => 'member@urspace.test',
        ]);

        // 3. Ruangan (Mewah)
        Space::create([
            'id_owner' => $owner->id,
            'nama_space' => 'WFA Open Spot',
            'harga_per_jam' => 25000,
            'tipe' => 'desk',
            'kapasitas' => 1,
            'deskripsi' => 'Meja kerja individual dengan colokan universal, kursi ergonomis herman miller, dan area komunal yang tenang.',
            'foto' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
            'image_cover' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
            'badge_label' => 'Diskon 20% Member',
            'wifi_speed_mbps' => 300,
            'area_sqm' => 4,
            'floor' => 'Lantai 1',
            'location_name' => 'Batu Bolong Hub, Bali Canggu',
            'facilities_text' => 'Fiber 300 Mbps, Kursi Herman Miller, Colokan Universal, Loker Pribadi',
            'rating' => 4.94,
            'review_count' => 128,
            'gallery' => [
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
            ],
            'gallery_labels' => ['Zona A • Suaka Fokus', 'Bilik Diskusi', 'Bilik Telepon', 'Kafe Artisan'],
            'amenities' => [
                ['icon' => 'wifi', 'title' => 'Fiber 300 Mbps', 'desc' => 'Koneksi stabil tanpa lag'],
                ['icon' => 'armchair', 'title' => 'Herman Miller', 'desc' => 'Kursi ergonomis premium'],
                ['icon' => 'monitor', 'title' => 'Dual 27" 4K', 'desc' => 'Layar tajam untuk multitasking'],
                ['icon' => 'volume-2', 'title' => 'Akustik NRC 0.85', 'desc' => 'Ruang kedap suara'],
                ['icon' => 'coffee', 'title' => 'Kopi Single Origin', 'desc' => 'Racikan barista in-house'],
                ['icon' => 'fingerprint', 'title' => 'Biometrik 24/7', 'desc' => 'Akses aman kapan saja'],
            ],
            'specs' => [
                'Meja Height-Adjustable', 'Kursi Ergonomis Herman Miller', 'Colokan Universal & USB-C',
                'Pencahayaan Alami', 'AC Individual', 'Loker Pribadi', 'Akses 24/7',
                'Dapur Bersama', 'Area Cetak Dokumen', 'Keamanan CCTV',
            ],
            'host_name' => 'Made & Sarah',
            'host_avatar' => 'https://i.pravatar.cc/150?img=12',
            'host_response_time' => '< 15 menit',
            'latitude' => -8.6559,
            'longitude' => 115.1385,
            'nearby_info' => 'Canggu Pusat • 400m dari Pantai',
            'description_long' => 'Meja kerja individual yang dirancang untuk fokus mendalam, dilengkapi dengan koneksi internet fiber berkecepatan tinggi dan kursi ergonomis kelas dunia. Cocok untuk pekerja remote yang membutuhkan suasana tenang namun tetap terhubung dengan komunitas.',
        ]);

        Space::create([
            'id_owner' => $owner->id,
            'nama_space' => 'Exclusive Boardroom',
            'harga_per_jam' => 150000,
            'tipe' => 'meeting_room',
            'kapasitas' => 10,
            'deskripsi' => 'Kesan pertama menentukan segalanya. Ruang temu kedap suara dengan LED Smart TV 65 Inch, whiteboard interaktif, dan free flow specialty coffee.',
            'foto' => 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&q=80&w=1600',
            'image_cover' => 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&q=80&w=1600',
            'badge_label' => 'BARU',
            'wifi_speed_mbps' => 500,
            'area_sqm' => 24,
            'floor' => 'Lantai 2',
            'location_name' => 'Batu Bolong Hub, Bali Canggu',
            'facilities_text' => 'LED Smart TV 65", Whiteboard Interaktif, Free Flow Coffee, Sound System',
            'rating' => 4.88,
            'review_count' => 76,
            'gallery' => [
                'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&q=80&w=1600',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
            ],
            'gallery_labels' => ['Ruang Rapat Utama', 'Bilik Diskusi', 'Bilik Telepon', 'Kafe Artisan'],
            'amenities' => [
                ['icon' => 'wifi', 'title' => 'Fiber 500 Mbps', 'desc' => 'Koneksi stabil untuk video call'],
                ['icon' => 'tv', 'title' => 'LED Smart TV 65"', 'desc' => 'Presentasi jernih'],
                ['icon' => 'pen-tool', 'title' => 'Whiteboard Interaktif', 'desc' => 'Brainstorming lebih hidup'],
                ['icon' => 'volume-2', 'title' => 'Sound System', 'desc' => 'Audio jernih untuk diskusi'],
                ['icon' => 'coffee', 'title' => 'Free Flow Coffee', 'desc' => 'Kopi tanpa batas'],
                ['icon' => 'fingerprint', 'title' => 'Biometrik 24/7', 'desc' => 'Akses aman kapan saja'],
            ],
            'specs' => [
                'Meja Rapat 10 Kursi', 'LED Smart TV 65"', 'Whiteboard Interaktif', 'Sound System',
                'AC Sentral', 'Free Flow Coffee', 'Akses 24/7', 'Ruang Kedap Suara',
                'Proyektor Cadangan', 'Keamanan CCTV',
            ],
            'host_name' => 'Made & Sarah',
            'host_avatar' => 'https://i.pravatar.cc/150?img=12',
            'host_response_time' => '< 15 menit',
            'latitude' => -8.6559,
            'longitude' => 115.1385,
            'nearby_info' => 'Canggu Pusat • 400m dari Pantai',
            'description_long' => 'Ruang rapat eksklusif yang dirancang untuk kesan profesional maksimal. Dilengkapi teknologi presentasi terkini dan kedap suara penuh untuk menjaga kerahasiaan diskusi bisnis Anda.',
        ]);

        Space::create([
            'id_owner' => $owner->id,
            'nama_space' => 'Presidential Suite',
            'harga_per_jam' => 350000,
            'tipe' => 'private_office',
            'kapasitas' => 5,
            'deskripsi' => 'Kantor pribadi eksklusif yang dirancang untuk CEO atau tim pimpinan. Akses biometrik 24/7 dan asisten ruangan khusus.',
            'foto' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1600',
            'image_cover' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1600',
            'badge_label' => null,
            'wifi_speed_mbps' => 500,
            'area_sqm' => 32,
            'floor' => 'Lantai 3',
            'location_name' => 'Batu Bolong Hub, Bali Canggu',
            'facilities_text' => 'Akses Biometrik 24/7, Asisten Ruangan, Fiber 500 Mbps, Lounge Privat',
            'rating' => 4.97,
            'review_count' => 42,
            'gallery' => [
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1600',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
            ],
            'gallery_labels' => ['Kantor Privat Utama', 'Bilik Diskusi', 'Bilik Telepon', 'Kafe Artisan'],
            'amenities' => [
                ['icon' => 'wifi', 'title' => 'Fiber 500 Mbps', 'desc' => 'Koneksi tercepat di lokasi'],
                ['icon' => 'armchair', 'title' => 'Herman Miller', 'desc' => 'Kursi eksekutif premium'],
                ['icon' => 'monitor', 'title' => 'Dual 27" 4K', 'desc' => 'Layar tajam untuk multitasking'],
                ['icon' => 'volume-2', 'title' => 'Akustik NRC 0.9', 'desc' => 'Privasi penuh'],
                ['icon' => 'coffee', 'title' => 'Kopi Single Origin', 'desc' => 'Layanan barista pribadi'],
                ['icon' => 'fingerprint', 'title' => 'Biometrik 24/7', 'desc' => 'Akses aman eksklusif'],
            ],
            'specs' => [
                'Kantor Privat Berpintu', 'Kursi Eksekutif Herman Miller', 'Meja Kerja Kayu Solid',
                'Lounge Privat', 'AC Individual', 'Asisten Ruangan Khusus', 'Akses Biometrik 24/7',
                'Brankas Pribadi', 'Dapur Bersama', 'Keamanan CCTV',
            ],
            'host_name' => 'Made & Sarah',
            'host_avatar' => 'https://i.pravatar.cc/150?img=12',
            'host_response_time' => '< 15 menit',
            'latitude' => -8.6559,
            'longitude' => 115.1385,
            'nearby_info' => 'Canggu Pusat • 400m dari Pantai',
            'description_long' => 'Kantor pribadi paling eksklusif di lokasi, dirancang khusus untuk CEO dan tim pimpinan yang membutuhkan privasi dan layanan personal. Dilengkapi asisten ruangan dan akses keamanan biometrik.',
        ]);

        // 4. Promo Code Dummy
        $promo = $owner->diskons()->create([
            'nama_diskon' => 'WELCOME20',
            'persentase_diskon' => 20,
            'tanggal_awal' => now()->subDay(),
            'tanggal_akhir' => now()->addMonths(2),
        ]);

        // 5. Dummy Reservations (Untuk Testing History & Dashboard)
        $spaces = \App\Models\Space::all();
        $desk = $spaces->where('tipe', 'desk')->first();
        $meeting = $spaces->where('tipe', 'meeting_room')->first();
        
        if ($desk && $meeting) {
            // Reservasi Selesai (Past)
            $pastDate = now()->subDays(5)->format('Y-m-d');
            \App\Models\Reservasi::create([
                'id_member' => $memberUser->member->id,
                'id_space' => $desk->id,
                'id_diskon' => null,
                'kode_booking' => 'INV-RES-'.strtoupper(uniqid()),
                'tanggal_reservasi' => $pastDate,
                'jam_mulai' => '09:00:00',
                'jam_selesai' => $pastDate . ' 12:00:00',
                'durasi_jam' => 3,
                'harga_per_jam' => $desk->harga_per_jam,
                'total_harga_awal' => $desk->harga_per_jam * 3,
                'potongan_diskon' => 0,
                'total_bayar' => $desk->harga_per_jam * 3,
                'status' => 'selesai',
                'payment_method' => 'CASH',
                'qr_serial_token' => \Illuminate\Support\Str::random(32)
            ]);

            // Reservasi Aktif (Sedang Berjalan)
            $today = now()->format('Y-m-d');
            \App\Models\Reservasi::create([
                'id_member' => $memberUser->member->id,
                'id_space' => $meeting->id,
                'id_diskon' => $promo->id,
                'kode_booking' => 'INV-RES-'.strtoupper(uniqid()),
                'tanggal_reservasi' => $today,
                'jam_mulai' => now()->subHour()->format('H:00:00'),
                'jam_selesai' => now()->addHours(2)->format('Y-m-d H:00:00'),
                'durasi_jam' => 3,
                'harga_per_jam' => $meeting->harga_per_jam,
                'total_harga_awal' => $meeting->harga_per_jam * 3,
                'potongan_diskon' => ($meeting->harga_per_jam * 3) * ($promo->persentase_diskon / 100),
                'total_bayar' => ($meeting->harga_per_jam * 3) - (($meeting->harga_per_jam * 3) * ($promo->persentase_diskon / 100)),
                'status' => 'aktif',
                'payment_method' => 'TRANSFER',
                'qr_serial_token' => \Illuminate\Support\Str::random(32)
            ]);

            // Reservasi Disetujui (Akan Datang)
            $futureDate = now()->addDays(2)->format('Y-m-d');
            \App\Models\Reservasi::create([
                'id_member' => $memberUser->member->id,
                'id_space' => $desk->id,
                'id_diskon' => null,
                'kode_booking' => 'INV-RES-'.strtoupper(uniqid()),
                'tanggal_reservasi' => $futureDate,
                'jam_mulai' => '14:00:00',
                'jam_selesai' => $futureDate . ' 18:00:00',
                'durasi_jam' => 4,
                'harga_per_jam' => $desk->harga_per_jam,
                'total_harga_awal' => $desk->harga_per_jam * 4,
                'potongan_diskon' => 0,
                'total_bayar' => $desk->harga_per_jam * 4,
                'status' => 'disetujui',
                'payment_method' => null,
                'qr_serial_token' => \Illuminate\Support\Str::random(32)
            ]);
            
            // Reservasi Batal (Cancelled)
            $cancelDate = now()->subDays(10)->format('Y-m-d');
            \App\Models\Reservasi::create([
                'id_member' => $memberUser->member->id,
                'id_space' => $meeting->id,
                'id_diskon' => null,
                'kode_booking' => 'INV-RES-'.strtoupper(uniqid()),
                'tanggal_reservasi' => $cancelDate,
                'jam_mulai' => '10:00:00',
                'jam_selesai' => $cancelDate . ' 12:00:00',
                'durasi_jam' => 2,
                'harga_per_jam' => $meeting->harga_per_jam,
                'total_harga_awal' => $meeting->harga_per_jam * 2,
                'potongan_diskon' => 0,
                'total_bayar' => $meeting->harga_per_jam * 2,
                'status' => 'dibatalkan',
                'payment_method' => null,
                'qr_serial_token' => \Illuminate\Support\Str::random(32)
            ]);
        }
    }
}
