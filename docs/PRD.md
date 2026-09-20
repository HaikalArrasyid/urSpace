# Product Requirements Document (PRD)

> Source: `Rev_Soal_UKK_2026-2027_Paket_B.pdf` (Bagian II: Gambar Kerja)
> This document transcribes the functional boundaries of the Smart Space Booking system. It is the single source of truth for features. Do not inject assumptions or enhancements.

---

## 1. Feature Specifications

### 1.1 Member (Pelanggan) Features
*Trace: Bagian II - Member / Pengunjung*
- **Register Account**: Register as a customer with fields: `nama lengkap`, `instansi`, `no. telepon`, `alamat`, `username`, `password`, `foto profil` (opsional).
- **Login**: Member login to the booking application.
- **View Space Availability**: See availability for *Personal Desk*, *Private Office*, and *Meeting Room*. Includes viewing photos, capacity, facilities, and hourly rate.
- **Book / Reserve Space**: Select date, start time, duration (hours), and optionally enter a promo/discount code.
- **View Reservation Status**: View status of reservations: `Belum Dikonfirmasi`, `Disetujui`, `Aktif/Digunakan`, `Selesai`, `Dibatalkan`.
- **View Booking History**: Filter reservations by month.
- **Print E-Ticket**: Generate a digital receipt/ticket with a reservation code and a QR Code payload intended for on-site check-in.

### 1.2 Admin (Pengelola Space) Features
*Trace: Bagian II - Admin Pengelola Space*
- **Admin Register & Login**: Register the coworking space location, owner profile, and admin account. Login to management page.
- **Manage Coworking Profile (Update)**: Update space name, owner name, address, phone, facility description.
- **CRUD Member**: Full management of member/customer data.
- **CRUD Spaces**: Manage desk/room data, space type, capacity, hourly rate, description, and photo.
- **CRUD Promo Codes**: Manage discount/event codes (`nama diskon`, `persentase diskon`, `tanggal awal`, `tanggal akhir`).
- **Reservation Approvals & Check-in/out**: Confirm or change order status. Execute physical check-in and check-out logic.
- **View All Reservations**: View with generic filter by status and month.
- **Income Reports**: View monthly revenue estimates and revenue distribution by space type.

### 1.3 Frontend-Only Enhancements (Out of API Contract Scope)
**Space Availability Calendar (Member Portal)**
- **Scope Boundary**: This is a Next.js client-side only enhancement layered on top of the existing `GET /api/spaces/availability` endpoint. No new backend routes, controllers, or migrations are to be created for this feature.
- **Behavior**:
  1. On the space detail page, a month calendar lets the member dynamically browse open slots.
  2. Clicking a date triggers parallel `Promise.all` requests looping through operating hours (08:00 - 19:00 implicitly) to map available vs booked slots using the single-check API endpoint.
  3. Responses are cached client-side per `(space, date)` pair.
  4. Clicking an available slot pre-fills the `tanggal_reservasi` and `jam_mulai` fields without automatically submitting them.
- **UI Constraints**: Loading skeletons during parallel resolution, booked slots rendered strictly un-clickable, mobile-responsive grid, and restriction forbidding past-date reservations (`[ASSUMPTION]`).

---

## 2. Reservation Lifecycle (State Machine)
*Trace: Bagian II (Member bullets) & Bagian III (Endpoint 43, 44, 45)*

The reservation `status` can traverse exactly these states:
1. `belum_dikonfirm` (Initial state upon creation).
2. `disetujui` (Admin confirmed/approved booking).
3. `aktif` (Admin triggers POST check-in).
4. `selesai` (Admin triggers POST check-out).
5. `dibatalkan` (Reachable safely via PATCH cancel from member/admin).

*Lifecycle Flow*:
`belum_dikonfirm` → `disetujui` → `aktif` → `selesai`
(with `dibatalkan` reachable from `belum_dikonfirm` or `disetujui`).

---

## 3. Explictly Out-Of-Scope (Do Not Build)
*Trace: Derivations and constraints from Master Prompt*

- **Multi-Tenancy (`x-maker-key`)**: We build a standalone application. We do NOT build the `maker` APIs.
- **Payment Gateway Integration**: Not in Bagian II or Bagian III.
- **Email/SMS Notifications**: Not requested.
- **Admin Analytics Dashboard**: Beyond the `reports/monthly` data generation, no advanced BI tools.
- **Role Permissions Beyond 2 Base Roles**: No SuperAdmins, Moderators, etc.
