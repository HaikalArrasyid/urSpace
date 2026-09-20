# API Contract (45 Endpoints)
> Excluding multi-tenancy `maker/*` endpoints 3-7. All endpoints verbatim from Bagian III.

## 0. Canonical Response Envelopes
Do NOT deviate. EVERY response listed below MUST be wrapped in this envelope.
**Success (200/201):**
```json
{ "status": true, "statusCode": 200, "message": "keterangan", "data": { ... }, "timestamp": "ISO 8601" }
```
**Error (400/401/403/404/500):**
```json
{ "status": false, "statusCode": 400, "message": "keterangan error", "error": "NamaError", "timestamp": "ISO 8601" }
```

## 1. Root & Health
1. **GET `/`** (Publik) Status & Petunjuk
2. **GET `/health`** (Publik) Health Check

## 2. Auth Profiles
8. **POST `/api/auth/register/member`** (Publik)
   *Req:* `username`, `password`, `nama_member`, `instansi`, `alamat`, `telp`, `foto` (opsional)
9. **POST `/api/auth/register/admin-space`** (Publik)
   *Req:* `username`, `password`, `nama_coworking`, `nama_pemilik`, `telp`
10. **POST `/api/auth/login`** (Publik)
   *Req:* `username`, `password` | *Res:* Returns `access_token`
11. **GET `/api/auth/profile`** (Bearer User)
   *Res:* returns current active profile based on token.

## 3. Public Space & Discount Modules
12. **GET `/api/spaces/types`** (Publik/User) Returns array [{tipe: desk, label: Personal Desk...}]
13. **GET `/api/spaces/availability`** (Publik/User)
   *Query:* `?id_space=1&tanggal=YYYY-MM-DD&jam_mulai=HH:mm&durasi_jam=3` | *Res:* Evaluates and returns { available: boolean }
14. **GET `/api/spaces`** (Publik/User)
   *Query:* `?tipe=desk` (opsional), `?search=X` (opsional) | *Res:* Array of Space models.
15. **GET `/api/spaces/{id}`** (Publik/User) Detail by id.
16. **GET `/api/diskon/active`** (Publik/User) List active promos.
17. **POST `/api/diskon/check`** (Publik/User)
   *Req:* `{ "nama_diskon": "X" }` | *Res:* Validates validity and dates.
18. **GET `/api/diskon/{id}`** (Publik/User) Detail promo by id.

## 4. Member Reservation Actions
19. **POST `/api/reservasi`** (Member)
   *Req:* `id_space`, `tanggal_reservasi`, `jam_mulai`, `durasi_jam`, `id_diskon` (opsional), `kode_promo` (opsional)
20. **GET `/api/reservasi/my`** (Member) List own active reservations.
21. **GET `/api/reservasi/my/history`** (Member)
   *Query:* `?month=8&year=2026` | *Res:* Historic bookings.
22. **GET `/api/reservasi/{id}/e-ticket`** (Member/Admin)
   *Res:* `{ e_ticket_number, kode_booking, coworking_space, member, space, jadwal, rincian_pembayaran, status_reservasi, qr_code_payload }`
23. **GET `/api/reservasi/{id}`** (Member/Admin) Raw detail by ID.
24. **PATCH `/api/reservasi/{id}/cancel`** (Member) Sets status to `dibatalkan`.

## 5. Admin Domains
25. **GET `/api/admin/profile`** (Admin Space) Get profile owner details.
26. **PUT `/api/admin/profile`** (Admin Space) Update profile details.
27. **GET `/api/admin/members`** (Admin Space) List all members. *Query:* `?search=`
28. **POST `/api/admin/members`** (Admin Space) Add new member directly (`username`, `password`, `nama_member`, `instansi`, `alamat`, `telp`, `foto`).
29. **GET `/api/admin/members/{id}`** (Admin Space) Read.
30. **PUT `/api/admin/members/{id}`** (Admin Space) Update (all opsional fields incl password edit).
31. **DELETE `/api/admin/members/{id}`** (Admin Space) Destroy member record.
32. **GET `/api/admin/spaces`** (Admin Space) List spaces globally managed.
33. **POST `/api/admin/spaces`** (Admin Space) Create space (`nama_space`, `harga_per_jam`, `tipe`, `kapasitas`, `deskripsi`, `foto`).
34. **GET `/api/admin/spaces/{id}`** (Admin Space) Read space.
35. **PUT `/api/admin/spaces/{id}`** (Admin Space) Update space.
36. **DELETE `/api/admin/spaces/{id}`** (Admin Space) Destroy space.
37. **GET `/api/admin/diskon`** (Admin Space) List codes.
38. **POST `/api/admin/diskon`** (Admin Space) Create code.
39. **GET `/api/admin/diskon/{id}`** (Admin Space) Read code.
40. **PUT `/api/admin/diskon/{id}`** (Admin Space) Update code bounds/percentages.
41. **DELETE `/api/admin/diskon/{id}`** (Admin Space) Destroy code.

## 6. Admin Booking Validations & Reporting
42. **GET `/api/admin/reservasi`** (Admin Space) 
   *Query:* `?month, ?year, ?status, ?id_space, ?tanggal`
43. **PATCH `/api/admin/reservasi/{id}/status`** (Admin Space)
   *Req:* `{ "status": "disetujui" }`
44. **POST `/api/admin/reservasi/{id}/check-in`** (Admin Space) Modifies status to `aktif` and sets check-in timestamp.
45. **POST `/api/admin/reservasi/{id}/check-out`** (Admin Space) Modifies status to `selesai` and sets check-out timestamp.
46. **GET `/api/admin/reports/monthly`** (Admin Space) 
   *Query:* `?month=8&year=2026` | *Res:* Complex financial breakdown (total_transaksi, jam_terpakai, estimasi, dsb).
47. **GET `/api/admin/reports/income`** (Admin Space) Alias report.

## 7. Global Uploads
48. **POST `/api/upload/image`** (User/Admin) Multipart Form Data (`file`). Generic upload.
49. **POST `/api/upload/spaces`** (Admin Space) 
50. **POST `/api/upload/members`** (User/Admin)

## Custom/Additional Endpoints (Not Part of UKK Kontrak API)
51. **GET `/api/public/availability-summary`** (Publik/User)
   *Query:* `?month=9&year=2026` | *Res:* Array `[{ "tanggal": "YYYY-MM-DD", "full": boolean }]`. Fast query to check if all spaces combined have reached their daily operating capacity limit.

## Custom Additions (Beyond UKK Kontrak API — added for own frontend use)
52. **PUT `/api/member/profile`** (Member Auth)
   *Req:* `{ "nama_member"?: "string", "telp"?: "numeric string", "password"?: "string min 6" }`
   *Res:* Updated member profile object (excluding raw password).
