Phase 1: Database & System Foundation (Backend)
- UKK-01 Initial Laravel 11 scaffold (MySQL local setup).
- UKK-02 Migrations matching SCHEMA.md. Apply strict ||--o| relationships and unique composites.
- UKK-03 Link local Storage to public (/uploads/spaces, /uploads/members, /uploads/general). 
- 🛑 Phase 1 Audit: I can provide an SQL desc statement proving reservasi table exists exactly with 16 columns matching the DTOs, and MySQL refuses dummy inserts that violate the foreign key constraints.
Phase 2: Authentication & Security Logic (Backend)
- UKK-04 Install Laravel Sanctum.
- UKK-05 Implement POST /api/auth/register (Member & Admin branches) enforcing bcrypt.
- UKK-06 Implement POST /api/auth/login and GET /api/auth/profile.
- UKK-07 Implement custom Middleware (role:admin_space, role:member).
- 🛑 Phase 2 Audit: 
- POST /api/auth/register/member returns 201 with exactly the canonical envelope.
- Duplicate username returns 400 with error: 'Bad Request'.
- The password string is absent from ALL JSON payload responses. 
- DB inspect proves the password string is stored as a bcrypt hash.
Phase 3: Core API Services (Backend)
- UKK-08 Develop Admin CRUD Space, Diskon, Member endpoints.
- UKK-09 Implement Availability logic evaluating overlaps against disetujui/aktif states.
- UKK-10 Implement Reservation logic computing mathematically (durasi * harga) - diskon.
- UKK-11 Implement API Status Modifiers (Check-In/Out, Cancel, Invoice API).
- UKK-12 Postman Collection generation completion.
- 🛑 Phase 3 Audit: 
- A manual POST /api/reservasi attempt over an identical date + time boundary previously marked disetujui returns HTTP 400. 
- A manual POST /api/reservasi with a fake price calculates the real DB price properly.
Phase 4: Frontend Infrastructure
- UKK-13 Scaffold Next.js 14 App Router, Lenis Smooth Scroll, Shadcn base configs.
- UKK-14 Build axios.ts enforcing the Bearer injection on every request.
- UKK-15 Code Authentication flow interfaces (Login, Register Forms).
- 🛑 Phase 4 Audit: 
- Submitting the login form successfully stores the JWT token locally. 
- Accessing a protected browser route dumps the user back to the login page if the token is wiped from the browser.
Phase 5: Member Experience (Frontend)
- UKK-16 Public Catalog Page (Space Grid).
- UKK-17 Detail Page integration with the Space Availability Calendar.
- UKK-18 Reservation checkout module applying promo data.
- UKK-19 Booking History tracking UI. E-Ticket generation explicitly passing qr_code_payload from Endpoint 22 into <QRCode value={payload} /> (qrcode.react).
- 🛑 Phase 5 Audit: 
- Clicking a space calendar date visibly fires exactly 12 individual parallel fetch requests (Network Tab) yielding blocked clicking for taken slots. 
- E-ticket screen renders an actively scannable QR Code containing the VERIFY-RESERVASI payload prefix.
Phase 6: Admin Dashboard (Frontend)
- UKK-20 Protected /admin layout.
- UKK-21 Admin Tables handling Space/Member parameters.
- UKK-22 Form logic pushing FormData images to /api/upload/... and saving the returned URL paths correctly in DB entries. 
- UKK-23 Reservation Queue management enabling manual Admin checks (check-in/check-out updating row states).
- UKK-24 Render Revenue Bar Charts against /api/admin/reports/monthly.
- 🛑 Phase 6 Audit: 
- Admin check-in button click fires exactly one POST that returns 200 updating UI string to aktif.
- Uploading a photo stores the file under /public/uploads/ on the local laravel server, verified physically in the directory.

---

### Phase 7: UI/UX Refinement & Specific Constraints (Strict Feature Prompt)

**7.1 Aesthetics & Standardized Behavior**
- **Theme**: Minimalist SaaS style (Off-white backgrounds `bg-slate-50`, crisp white cards `bg-white`, soft shadows, rounded corners `rounded-xl`).
- **Accent**: A single consistent accent color (Yellow/Primary) applied sparingly for primary actions; strictly NO rainbow-coding badges.
- **Form Interface (Side Panels)**: Admin CRUD screens (Member, Space, Promos) must NOT use centered modals. All `Create/Edit` forms must trigger a seamless slide-in panel (drawer) moving from the right side of the screen.

**7.2 Non-Negotiable Contract Constraints (No Scope Creep)**
- `[CONSTRAINT]`: **Payment Handling is OUT OF SCOPE.** The application must NEVER manage records, fields, badges, or form inputs related to money transfers, QRIS statuses, or financial approvals. Status `disetujui` confirms an external, human-level verification. The checkout UI may only feature static text (e.g. "Pay at the front desk") with no interactive payment functionality.
- `[CONSTRAINT]`: **Admin Profile**. Adhere strictly to the DTO. The edit form renders ONLY `nama_coworking`, `nama_pemilik`, and `telp`. Exclude `alamat` and `deskripsi` mapping.
- `[CONSTRAINT]`: **Diskon Forms**. Limit to exact DTO (`nama_diskon`, `persentase_diskon`, `tanggal_awal`, `tanggal_akhir`). Reject any impulse to build "notes" or "keterangan" tracking fields.
- `[CONSTRAINT]`: **QR Payloads**. Treat `qr_code_payload` strictly as a plaintext lookup lookup string. It is NOT a cryptographically secured artifact.

**7.3 Dashboard Analytics Restructure**
- Every Admin list page mandates: A title, computational summary cards parsed securely from active list payloads (e.g. Total spaces, active bookings), a search-and-filter toolbar row (client-side), the central table, and list pagination.
- Apply a text-input "Simulator Scanner" on the Admin Reservation page. Admin pastes a string -> Filter evaluates it -> Quick Actions reveal "Check-In" directly on the table.

**7.4 Custom UI Quality-of-Life Actions**
- **Member Registration (Instansi Logic)**: Transform raw text input into a Radio/Dropdown group ("Pribadi/Freelance" vs "Perusahaan" -> renders manual input) keeping validation clean.
- **The 404 Route**: Establish `app/not-found.tsx` to handle lost routes creatively without dropping user out of the theme.
- **Client-Side CSV Export**: Equip Admin tables with generic "Export CSV" buttons that strictly evaluate rendered data components globally without dispatching new API tracking.
- **Pricing Simulator**: The Diskon side-panel allows checking a live, client-computed simulation to verify visual logic safely.