# urSpace — Smart Coworking Space Booking System

A scalable, full-stack coworking space reservation system originally built for the UKK RPL 2024/2025 examination standard. The architecture utilizes a monorepo structure establishing a strict decoupling between the Next.js client application and the Laravel REST API backend.

Designed explicitly for a single-building operation model, prioritizing operational speed via QR Code E-Ticket check-ins, exact time-boundary overlap prevention, and dynamic client-side filtering.

## 🛠 Tech Stack

**Frontend Environment:**
- Framework: Next.js 16 (App Router)
- UI Library: React 19
- Styling: Tailwind CSS v4 + Custom Glassmorphism Theme
- Interactions: Framer Motion (Route & Component Animations)
- State Management/API: Axios & Nookies (JWT Token Cookies)
- Tooling: HTML5-QRCode (Zero-dependency WebRTC Scanner)

**Backend Environment:**
- Framework: Laravel 11.x
- Authentication: Laravel Sanctum (Stateful Domain / Token Bearer)
- Database RDBMS: SQLite / MySQL
- Testing Suite: Pest PHP v5.x (Strict TDD Coverage)

---

## ✨ System Features

### Member & Public Application
- **Dynamic Catalog:** Client-side hydration of space categories (Desk, Meeting Room, Private Office).
- **Collision-Free Booking:** Server and UI-level overlap logic rejecting reservations spanning pre-booked schedules.
- **Promo Mathematics:** Database-synced coupon logic strictly executed server-side.
- **E-Ticket State Machine:** Access gates restricted via dynamically generated QR payloads matching secure internal status progression.

### Admin Dashboard & Operations
- **Live QR Scanner:** Built-in dashboard webcam scanner auto-validating base64 / tokenized QR payloads for immediate customer Check-in operations.
- **State Machine Guard:** Forced transition validations (`belum_dikonfirm` &rarr; `disetujui` &rarr; `aktif` &rarr; `selesai`).
- **Inventory Management:** Complete administrative CRUD routes tied securely across Eloquent relations.
- **Analytics View:** Monthly metric overviews aggregating pending validations, total bookings, and running hours.

---

## 🏗 Repository Structure

This repository is constructed as a monorepo encapsulating two isolated directories:
- `/frontend` — Node.js runtime container running the Next.js React application.
- `/backend` — PHP runtime container running the core Laravel API module and its tests.
- `/docs` — System design documents, API contracts, PRDs, and testing reports.

---

## 🚦 Getting Started

### 1. Backend Setup (Laravel API)
Ensure you have PHP 8.2+ and Composer installed on your environment.

```bash
cd backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Build database schema and inject 100+ dummy records
php artisan migrate:fresh --seed

# Start the PHP server on port 8000
php artisan serve
```

### 2. Frontend Setup (Next.js Application)
Ensure you have Node.js 18+ installed on your environment.

```bash
cd frontend

# Install package dependencies
npm install

# Run the development server (runs on port 3000)
npm run dev
```
*Note: Make sure your backend `.env` has the correct `FRONTEND_URL` / CORS setup matching your `localhost:3000` source.*

---

## 🧪 Testing

The backend business logic is enforced by an extensive testing suite using **Pest**. The suite currently runs 49 strict operational tests generating over 135 assertions confirming overlap blocks, price spoofing rejections, and state machine integrity.

To execute the test runner:
```bash
cd backend
./vendor/bin/pest tests/Feature/Api/
```
*For the extended documentation interpreting these test bounds, read: `docs/TESTING_REPORT.md`.*

---

## 📝 License
This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
