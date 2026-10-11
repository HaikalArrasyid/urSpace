# Panduan Logika Sistem Pemesanan (Reservation Workflow)

Dokumen ini menjelaskan secara sederhana bagaimana otak dari aplikasi **urSpace** bekerja, terutama dalam memutuskan apakah suatu ruangan/meja bisa dipesan atau tidak, bagaimana harga dikalkulasikan, dan bagaimana alur tiketnya divalidasi.

---

## 1. Logika Kapasitas & Tabrakan Jadwal (Overlap Logic)

Masalah utama dalam aplikasi *booking* adalah: *"Bagaimana jika ada 2 orang yang memesan di jam yang sama?"*

Sistem urSpace menggunakan pendekatan **Berbasis Kuota Slot (Kapasitas)**. 

### Skema Pengecekan:
Setiap ruangan di aplikasi memiliki angka `kapasitas`. 
- **Private Office / Meeting Room** biasanya berkapasitas **1 (Sewa Per Ruangan)**.
- **Desk Personal (Meja Pribadi)** biasanya berkapasitas banyak, misalnya **30 (Sewa Kursi)**.

**Langkah Sistem Bekerja:**
1. Ketika User memilih jam mulai (misal 09:00) dan jam selesai (misal 11:00), sistem akan bertanya pada Database: *"Berapa banyak orang yang sudah punya tiket aktif/disetujui di jam 09:00 - 11:00 untuk ruangan ini?"*
2. Jika yang memesan baru **15 orang**, dan `kapasitas` ruangan adalah **30**, maka sistem **MENGIZINKAN** pemesanan.
3. Namun, jika ada pesanan masuk untuk Ruang Rapat (Kapasitas = 1), dan di jam 09:00 - 11:00 sudah ada **1 pesanan aktif**, maka pesanan baru akan langsung **DITOLAK** dengan pesan ruang penuh.

**Keunggulan:** Pemesanan sangat fleksibel. Orang A bisa pesan jam 08:00 - 10:00, Orang B bisa pesan di meja yang sama pukul 10:00 - 12:00. Begitu jam 10:00 berlalu, kursi otomatis kosong dan siap dihitung valid lagi.

---

## 2. Kalkulasi Harga (Price Logic)

Sistem sama sekali tidak memercayai nominal uang yang dikirim dari Layar HP/Komputer User (*Client-Side Spoofing Prevention*). 

- **Hitungan Otomatis:** Sistem akan mengambil angka `harga_per_jam` asli dari Database, lalu mengalikannya dengan lamanya pemesanan (`durasi_jam`).
- **Diskon & Kupon:** Jika User memasukkan kupon promo (misal: "Diskon 20%"), sistem akan memvalidasi *tanggal kadaluarsa* promo tersebut sebelum memotong harga aslinya sebesar 20%.

**Jika terjadi eksploitasi:** Andaikan *Hacker* mencoba merubah `total_bayar` menjadi Rp 0 dan mengirimnya ke backend, sistem akan membuang angka Rp 0 tersebut dan menimpanya ulang dengan perhitungan matematikanya sendiri, menjamin uang yang tercatat selalu sahih.

---

## 3. Transisi Status Pemesanan & Scanner (State Machine)

Sistem menggunakan alur status searah (State Machine) yang tidak boleh diloncati untuk mencegah kebocoran pemakaian ruang gratis.

### Alur Siklus Tiket:
1. **Belum Dikonfirmasi (`belum_dikonfirm`)** 
   * Kondisi awal pelanggan baru pesan.
2. **Disetujui (`disetujui`)** 
   * Admin telah menekan tombol ACC dari Dasbor. Artinya slot resmi dikunci untuk pelanggan, dan pelanggan bisa melihat tiket QR Code di HP-nya.
3. **Aktif (`aktif`)** 
   * Klien tiba di gedung, membuka HP, dan memberikan QR Code yang memuat Token Unik ke Admin (Resepsionis). Admin memindainya lewat Scanner Aplikasi, lalu status berubah instan menjadi *Aktif (Sedang bekerja di ruang)*.
4. **Selesai (`selesai`)** 
   * Waktu pelanggan habis. Admin menekan tombol *"Proses Selesai"*. Tiket hangus dan masuk ke buku laporan transaksi.
5. **Dibatalkan (`dibatalkan`)** 
   * Klien memutuskan batal datang (Hanya bisa dilakukan sebelum *Check-In*).

*Dengan struktur logika beralur seperti di atas, seluruh inventaris ruangan akan teratur rapi tanpa tabrakan pengunjung dan laporan pemasukan akan tercatat tanpa celah kecurangan.*
