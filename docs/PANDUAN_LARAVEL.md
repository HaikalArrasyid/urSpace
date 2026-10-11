# Panduan Transisi: Dari Next.js Menuju Laravel 11

Sebagai *developer* yang sudah terbiasa dengan struktur modern Next.js (App Router), masuk ke kerangka kerja (*framework*) berbasis PHP seperti Laravel mungkin pada awalnya terasa rumit. Dokumen ini dirancang khusus untuk memetakan arsitektur backend Laravel 11 kita ke konsep yang sudah kamu pahami di Next.js.

---

## 1. Peta Anatomi Singkat (Kamus Direktori)

Dalam monorepo ini, folder `/backend` adalah server Laravel mandiri. Berikut adalah padanannya di dunia Next.js:

| Konsep / Fungsi | Ekosistem Next.js (React) | Ekosistem Laravel 11 |
| :--- | :--- | :--- |
| **Pintu Masuk API (Entry Point)** | `app/api/.../route.ts` | **`routes/api.php`** |
| **Logika Bisnis API** | Ada di dalam fungsi GET/POST di `route.ts` | **`app/Http/Controllers/Api/`** |
| **Skema Database / Tipe Data** | `prisma/schema.prisma` | **`database/migrations/`** |
| **Interaksi Database (ORM)** | Prisma Client | **Eloquent (`app/Models/`)** |
| **Data Tester (Dummy Data)** | Skrip Eksekusi JS Kustom / Seeders Prisma | **`database/seeders/DatabaseSeeder.php`** |
| **Keamanan Rute Secara Global** | `middleware.ts` | **`app/Http/Middleware/RoleMiddleware.php`** |
| **Pengujian (Testing / QA)** | Jest / Cypress / Playwright | **Pest PHP (`tests/Feature/Api/`)** |

---

## 2. Di Mana Saya Memulai Jika Ingin Mengedit Sesuatu?

### A. "Aku mau buat atau mengubah rute URL API" 🛣️
- Buka: **`routes/api.php`**
- Berbeda dengan Next.js yang menggunakan sistem direktori *(Folder-based Routing)*, Laravel memusatkan deklarasi HTTP API di satu file teks bernama `routes/api.php`.
- Di file ini, kita mengatur URL `GET/POST`, menentukan *Middleware* apa yang melindungi URL tersebut, lalu menyambungkannya ke fungsi di *Controller*.

### B. "Aku mau merombak logika apa yang terjadi saat URL tersebut dipanggil" 🧠
- Buka: **`app/Http/Controllers/Api/`**
- Setiap fungsi yang disebutkan di `routes/api.php` bermuara pada file-file *Controller* (Misalnya `SpaceController.php`). Beban kerja seperti perhitungan matematis dan pengambilan basis data *(query database)* dieksekusi di sini.
- *Catatan Khusus:* Untuk logika tingkat rumit yang dipakai berulang kali lintas Controller (contoh: Pengecekan Tabrakan Waktu/Kapasitas), kita memisahkannya ke folder **`app/Services/ReservationService.php`**.

### C. "Aku mau mendaftarkan Aturan Baru / Ganti Middleware" 🛡️
- Buka: **`bootstrap/app.php`** dan **`app/Http/Middleware/`**
- **Perhatian Penting (Spesifik Laravel 11):** Dalam Laravel 11 terbaru, file lama seperti `Http/Kernel.php` sudah dihilangkan sepenuhnya! Sekarang, fungsi "Mendaftarkan" atau menyalakan fungsi pelindung seperti CORS, Proteksi Otentikasi Santum, dan Filter Hak Akses dilakukan terpusat di dalam file `bootstrap/app.php`. Sedangkan kode logikanya (if/else hak akses) ada di folder Middleware.

### D. "Aku perlu nambah table, nambah kolom 'status baru'?" 📊
- Buka: **`database/migrations/`**
- Larvel menggunakan file *Migration* alih-alih `prisma.schema`. Setiap file migration merepresentasikan aksi merubah tabel, (contoh: "Bikin tabel Reservasi" / "Tambahkan kolom foto di Ruangan"). Saat kamu mengetik perintah `php artisan migrate`, kode di file inilah yang menjalankan injeksi SQL secara otomatis.

---

## 3. Alur Kerja (Workflow) Data Singkat

Pemahaman 3 Lapisan (Tiga Serangkai) saat satu data ditembak oleh Client/Frontend Axios:

1. Request Frontend masuk melalui URL. Diterima oleh **Routes (`routes/api.php`)**.
2. **Routes** memeriksa apakah ia berpelindung otentikasi. Jika rute disisipkan `->middleware('auth:sanctum')`, ia akan memverifikasi *Token Bearer* terlebih dahulu.
3. Rute menunjuk pada sebuah fungsi di **Controller (`app/Http/Controllers/`)**. Controller memeriksan payload form *(Form Request / Body)*.
4. Controller menggunakan **Model (`app/Models/`)** — yaitu si kembaran "Prisma Client" — untuk membuat data baru `Reservasi::create()` lalu mengembalikannya dalam wujud respons fungsi *(JSON)*.

*(Selamat menjelajah dan selamat menikmati backend API murni yang sangat kuat ini!)*
