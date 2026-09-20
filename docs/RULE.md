# Rule Directives (Hard Constraints)

You **MUST** rigorously adhere to the rules outlined below. Deviating results in immediate exam failure for the student. Do not inject unauthorized creativity here.

1. **The PDF is the single source of truth.** If anything in common practice, training knowledge, or general booking standards conflicts with the documentation in `PRD.md` or `API_CONTRACT.md`, the documentation wins absolutely.
2. **MUST NOT add features not explicitly listed.** No payment gateways, email notifications, SMS OTP, multi-language toggles, or unauthorized analytics tables. Only what is explicitly asked for in Bagian II is built.
3. **MUST NOT rename fields.** DTO parameters in `API_CONTRACT.md` and database arrays in `SCHEMA.md` MUST match character-for-character with the Indonesian conventions specified (`nama_member`, `harga_per_jam`). Never translate parameters to English (e.g. `price_per_hour` is illegal).
4. **MUST preserve response envelopes.** Every REST endpoint response mapped out in Laravel MUST perfectly utilize the required JSON envelope: `status, statusCode, message, data, timestamp`.
5. **MUST NOT implement `x-maker-key`.** The multi-tenancy App Maker system existing in the PDF is an infrastructure requirement strictly localized to the panitia (examiner server). We are spinning up our own backend environment isolated to us.
6. **MUST document all assumptions explicitly.** Under no circumstance should an undocumented implicit assumption regarding validation parsing, omitted limits, or sorting rules be enacted silently. Tag `[ASSUMPTION]` and request approval.
7. **MUST NEVER invent contradicting data.** Mocking algorithms or debug seeds must recycle existing constants listed in the document (like `DISKONHEMAT20`).
8. **Consult before extending.** Ask before adding any field, endpoint, or table not found in `API_CONTRACT.md` or `SCHEMA.md`.
9. **MUST hash all passwords.** Every `password` field (in `users`, and every register/update endpoint that accepts one) MUST be hashed via Laravel's `Hash::make()` / `bcrypt` before storage, and MUST NEVER be returned in any API response, even inside nested objects. This is an explicitly graded requirement (Lampiran B, Langkah Kerja #4: "Terapkan validasi input dan hashing password") — not optional hardening.
10. **MUST produce API documentation as a deliverable.** Lampiran B requires a Postman collection or Swagger export alongside the source code. Track this as a checklist item, not an afterthought — export it incrementally as endpoints are completed, not all at once the night before submission.
