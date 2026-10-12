# ============================================================================
# BASE IMAGE
# ============================================================================
# FROM → ambil "template" dasar. Kayak bilang "mulai dari laptop yang udah
# ada PHP 8.4 terinstall". Image ini dari Docker Hub (registry public).
# Kita pakai php:8.4-cli karena cukup buat `php artisan serve`.
FROM php:8.4-cli

# ============================================================================
# INSTALL SYSTEM DEPENDENCIES
# ============================================================================
# RUN → jalankan command di dalam container (kayak nulis di terminal).
# apt-get update → update daftar package Linux.
# apt-get install → install tools yang dibutuhin Laravel:
#   - git: buat Composer download packages
#   - unzip: buat extract package
#   - libpng-dev, libjpeg-dev, libfreetype6-dev: buat extension GD (image processing)
#   - libzip-dev: buat extension zip
#   - default-mysql-client: buat cek koneksi MySQL
# rm -rf /var/lib/apt/lists/* → bersihin cache supaya container lebih kecil
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# ============================================================================
# INSTALL PHP EXTENSIONS
# ============================================================================
# docker-php-ext-configure → konfigurasi extension sebelum install.
# docker-php-ext-install → install PHP extension yang dibutuhin Laravel:
#   - pdo_mysql: koneksi ke MySQL
#   - gd: image processing (upload foto)
#   - zip: handle file zip
#   - bcmath: kalkulasi presisi tinggi (harga, diskon)
#   - pcntl: process control (queue worker)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip bcmath pcntl

# ============================================================================
# INSTALL COMPOSER
# ============================================================================
# COPY --from=composer → ini namanya "multi-stage copy".
# Daripada install Composer manual, kita langsung copy binary Composer
# dari official Composer image. Lebih bersih dan cepat.
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ============================================================================
# SET WORKING DIRECTORY
# ============================================================================
# WORKDIR → set "current directory" di dalam container.
# Semua command setelah ini akan jalan di /app.
# Mirip kayak `cd /app` di terminal.
WORKDIR /app

# ============================================================================
# COPY PROJECT FILES
# ============================================================================
# COPY . . → copy SEMUA file dari folder backend/ (di laptop kamu)
# ke /app/ (di dalam container).
# Titik pertama = source (laptop), titik kedua = destination (container).
COPY . .

# ============================================================================
# INSTALL LARAVEL DEPENDENCIES
# ============================================================================
# composer install → install semua package dari composer.json.
# --no-dev → ga install package development (phpunit, dll) biar lebih ringan.
# --optimize-autoloader → bikin autoloader lebih cepat untuk production.
RUN composer install --no-dev --optimize-autoloader

# ============================================================================
# EXPOSE PORT
# ============================================================================
# EXPOSE → kasih tau Docker bahwa container ini akan listen di port 8000.
# Ini cuma "dokumentasi" — yang beneran buka port itu di docker-compose.yml.
EXPOSE 8000

# ============================================================================
# STARTUP COMMAND
# ============================================================================
# CMD → command yang dijalankan waktu container START.
# php artisan serve → nyalain Laravel development server.
# --host=0.0.0.0 → PENTING! Supaya bisa diakses dari LUAR container.
#   Kalau cuma --host=127.0.0.1, container lain ga bisa akses.
# --port=8000 → listen di port 8000.
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]