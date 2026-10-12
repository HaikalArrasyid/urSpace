# ============================================================================
# BASE IMAGE
# ============================================================================
# Pakai Node.js 20 (LTS) dengan Alpine Linux.
# Alpine = versi Linux yang super kecil (~5MB vs ~100MB Ubuntu).
# Cocok buat container karena ukurannya kecil = build lebih cepat.
FROM node:20-alpine

# ============================================================================
# SET WORKING DIRECTORY
# ============================================================================
WORKDIR /app

# ============================================================================
# COPY PACKAGE FILES DULU (OPTIMIZATION!)
# ============================================================================
# Kenapa copy package.json & package-lock.json TERPISAH dari source code?
#
# Karena Docker punya "layer caching". Setiap RUN/COPY bikin "layer" baru.
# Kalau layer ga berubah, Docker SKIP dan pakai cache.
#
# Jadi kalau kamu cuma edit source code (bukan dependencies),
# Docker ga perlu npm install ulang — langsung pakai cache!
# Ini HEMAT WAKTU BANGET (dari 2 menit jadi 5 detik).
COPY package.json package-lock.json ./

# ============================================================================
# INSTALL DEPENDENCIES
# ============================================================================
RUN npm ci

# ============================================================================
# COPY SEMUA SOURCE CODE
# ============================================================================
COPY . .

# ============================================================================
# BUILD NEXT.JS
# ============================================================================
# npm run build → compile Next.js jadi optimized production build.
# NEXT_PUBLIC_API_URL di-set di sini karena Next.js "bake" env variable
# yang prefix-nya NEXT_PUBLIC_ waktu BUILD TIME (bukan runtime).
# Artinya: value ini "masuk" ke dalam JavaScript bundle yang dikirim ke browser.
#
# Kita pakai http://localhost:8000/api karena yang akses API itu BROWSER user,
# bukan container frontend. Browser user akses localhost:8000 yang di-forward
# ke container backend oleh Docker.
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api
RUN npm run build

# ============================================================================
# EXPOSE PORT
# ============================================================================
EXPOSE 3000

# ============================================================================
# STARTUP COMMAND
# ============================================================================
# npm start → jalankan Next.js production server (bukan dev mode).
# Production server lebih cepat dan stabil dari `npm run dev`.
CMD ["npm", "start"]