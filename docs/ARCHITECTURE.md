# Technical Architecture & Conventions

## 1. System Layers & Data Flow

Next.js → Laravel (Controller → FormRequest → Service → Eloquent Model) → MySQL.

- **Next.js (Frontend)**: Consumes the REST API. Forms are strictly mapped to the Contrak API endpoints.
- **Laravel (Backend)**: Single-tenant RESTful API.
  - **Controllers**: Responsible for receiving requests, invoking FormRequests, handing structured data to Services, and outputting JSON strictly matching the standard response envelope.
  - **FormRequests**: Used to validate raw HTTP bodies before reaching Business logic.
  - **Services**: Business calculations (discounts mapping, overlapping duration math) are abstracted into Service classes to keep Controllers thin.
  - **Eloquent Models**: Handles direct interactions with MySQL schema tables.
- **MySQL**: Relational storage mapping strictly to `SCHEMA.md`.

## 2. Authentication & Authorization

- **Authentication Method**: `[ASSUMPTION]` **Laravel Sanctum**. *Reasoning*: Sanctum is natively integrated with Laravel 11's modern stack ecosystem, explicitly supports stateless API Bearer token issuance perfectly matching the UKK spec, and has less setup overhead than third-party packages like `tymon/jwt-auth`.
- **Validation**: Performed via the `auth:sanctum` middleware on protected routes.
- **Role Checks**:
  - `[ASSUMPTION]`: We will validate role-specific boundaries using custom Middleware (e.g., `role:admin_space` or `role:member`) applied directly to the Routes rather than Laravel Policies. *Reasoning*: The API Contract explicitly blocks access per controller grouping (e.g., `/api/admin/*`), making Route-level middleware the most declarative and closest match to the PDF intent.

## 3. File Upload Strategy

*Trace: Bagian III - Penyimpanan & URL Akses Foto / Media*
Files are handled natively via Laravel's `Storage` facade utilizing the `public` disk.
- **Space Photos**: Target URL `http://localhost:8000/uploads/spaces/{filename}`.
- **Member Photos**: Target URL `http://localhost:8000/uploads/members/{filename}`.
- **General Media**: Target URL `http://localhost:8000/uploads/general/{filename}`.

## 4. Naming Conventions

*Trace: Master Prompt §3.2*
- **Database Fields & API Attributes**: We MUST use the verbatim Indonesian `snake_case` from the PDF DTOs. Example: `nama_member`, `harga_per_jam`, `jam_mulai`.
- **Do not translate** fields into English.
- **Do not convert** to camelCase for API JSON payloads unless explicitly written that way in the PDF.
## 5. Deployment & Infrastructure

- `[ASSUMPTION]` **Both Backend and Frontend run locally on the exam machine** (`http://localhost:8000` for Laravel, `http://localhost:3000` for Next.js). *Reasoning*: a Vercel-hosted frontend cannot reliably call a `localhost` backend — the examiner's browser has no route to your development machine's localhost, and even on the same machine, cross-origin requests from a deployed Vercel domain to `localhost:8000` will typically be blocked or simply unreachable outside your own dev session. Running both locally removes this entire class of exam-day failure and matches the PDF's own expectation that photo URLs resolve to `localhost`.
- **Portfolio deployment (separate, post-exam)**: once the API contract is fully implemented and passing, a *second*, independently deployed version (Laravel on a real host + Next.js on Vercel, pointed at that public API URL) can be built for portfolio purposes. Keep this entirely separate from the exam-day setup — do not let deployment configuration drift affect the graded build.
- **Database**: Run locally (MySQL) on the same exam machine as the Laravel backend.
