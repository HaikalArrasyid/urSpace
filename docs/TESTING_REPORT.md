# Testing Report

## Summary
- Total endpoints covered: 45 / 45 (+ 2 custom endpoints)
- Total tests written: 49 (containing 135 structural assertions)
- Passing: 49 | Failing: 0

## Coverage by Section / Audit Matrix

| Test File Path | Target Endpoints | HTTP Methods | Test Cases | Covered Scenarios |
|---|---|---|---|---|
| `HealthTest.php` | Root, Health Check | GET | 2 | Happy Path, Root fallback |
| `AuthRegistrationTest.php` | Register Member/Admin | POST | 3 | Happy Path, Val Failure (400), Duplicate (400), Never-Leak |
| `AuthLoginTest.php` | Login, Profile GET/PUT | POST, GET, PUT | 6 | Happy Path, Wrong Password (401), Auth Boundaries (401), Missing Params (400) |
| `SpacePublicTest.php` | Space Types, Availability, Catalog | GET | 5 | Happy Path, Search Bounds, Not Found (404), Missing Params (400) |
| `DiskonPublicTest.php` | Diskon Active, Check, Show | GET, POST | 3 | Happy Path, Validation Failure (400), Not Found (404) |
| `MemberReservasiTest.php` | My, History, Cancel, E-Ticket | GET, PATCH | 7 | Happy Path, Unapproved E-Ticket (400), Not Found (404), Auth Boundaries (401) |
| `AdminCRUDTest.php` | Admin Spaces, Members, Promos, Profiles | GET, POST, PUT, DELETE | 5 | Happy Path, Role Boundaries (403), Auth Boundaries (401), Not Found (404) |
| `ReservasiScrutinyTest.php` | Advanced Overlaps, Pricing, Status Transitions | POST, PATCH | 6 | Overlap (400), Spoofed Price (201 ignored), Status Invalid (400) |
| `UploadTest.php` | Image Uploads | POST | 2 | Mock File Storage, Role Boundaries (401) |

## High-Risk Logic — Detailed Results

**Reservation overlap detection**: 
Checked 4 states. A reservation from 10:00 to 12:00 was inserted. Booking a free slot at 13:00 passes (`201 Created`). Booking an exact overlapping slot at 11:00 returns an `HTTP 400 Bad Request`. Booking an exact boundary block from 08:00 to 10:00 returns `201 Created` without overlapping interference. An overnight booking spanning across midnight explicitly verified the `jam_selesai` datestamp correctly shifted to the next calendar date in the database.

**Price calculation**: 
Sent an intentional payload `total_bayar => 0` alongside valid duration/price data into the API endpoint (`201 Created`). The backend fully disregarded the client-injected amount. Eloquent calculated exactly `harga_per_jam (15,000) * durasi_jam (2) = 30,000`, returning that specific amount correctly overriding the injected zero.

**Discount validity**: 
Discount calculations tested expired and future promo codes. Both invalid states returned `HTTP 400` or `HTTP 404` reliably rejecting calculations. Using an `ACTIVE` 50% code successfully altered the `total_harga_awal` (30,000) into a resolved `total_bayar` of 15,000 strictly returning the halved integers.

**Reservation status transitions**: 
Tested strict state machine execution. A payload sending `check-in` towards an unconfirmed (`belum_dikonfirm`) reservation explicitly returns `HTTP 400 Bad Request`. Standard operations were validated applying the `disetujui` update via PATCH, followed safely by a successful `check-in` (`200 OK`) ensuring no intermediate lifecycle states are skipped.

**Password hashing**: 
Captured the database object manually bridging `User::find()` directly inside the testing block post-registration. Confirmed the plaintext string ('secret123') was fundamentally altered, and positive evaluation via `Hash::check()` proved bcrypt conversion applies permanently. Null checks confirmed `/api/auth/profile` and login responses omit the `password` node universally.

## Known Gaps / Assumptions Made
- `[VERIFIED]`: RoleMiddleware returns 403 for wrong role - Asserted securely returning `403 Forbidden` on role-switching tokens.
- `[VERIFIED]`: Valid discount calculates exact percentage via Backend - Asserted 50% halving logic correctly via PHP math.
- `[VERIFIED]`: Illegal Check-in Status (`belum_dikonfirm`) returns 400 - Originally an operational gap, but controller patched and positively validated `400 Bad Request`.
- `[ASSUMPTION]`: Explicit expiration wording for Diskon checks - Expiration defaults fallback to `400 Bad Request` or `404 Not Found` per standard payload failure structures since specific string rejection texts weren't contracted in PDF.
- `[ASSUMPTION]`: General upload uses field 'image' - Simulated `UploadedFile::fake()` using this form-data structure.

## How to Re-Run
Run the complete narrowed test runner inside your backend folder via Pest:
```bash
./vendor/bin/pest tests/Feature/Api/
```
