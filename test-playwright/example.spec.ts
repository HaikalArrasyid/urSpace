import { test, expect } from '@playwright/test';

// ============================================================================
// TEST GROUP: Landing Page
// ============================================================================
// test.describe() → Mengelompokkan test yang berhubungan.
// Mirip kayak "folder" untuk test. Semua test di dalam sini berkaitan
// dengan Landing Page.
// ============================================================================

test.describe('Landing Page', () => {

  // --------------------------------------------------------------------------
  // TEST 1: Cek apakah landing page ke-load dengan benar
  // --------------------------------------------------------------------------
  // Ini test paling fundamental — "smoke test".
  // Kalau ini aja gagal, berarti ada masalah besar (server mati, error, dll).
  // --------------------------------------------------------------------------

  test('should display hero section correctly', async ({ page }) => {
    // ARRANGE: Buka halaman utama
    // Karena kita udah set baseURL di config, cukup tulis '/' aja
    await page.goto('/');

    // ASSERT: Cek heading utama muncul
    // getByRole('heading') → cari element <h1>, <h2>, dll berdasarkan "role" HTML.
    // Ini best practice karena accessibility-friendly dan ga gampang pecah
    // kalau developer ganti class name.
    await expect(
      page.getByRole('heading', { name: /Tingkatkan Produktivitasmu/i })
    ).toBeVisible();
    // NOTE: /Tingkatkan Produktivitasmu/i → ini Regex.
    //   - Tanda /.../ artinya regex (bukan string biasa)
    //   - Huruf 'i' di akhir artinya case-insensitive (huruf besar/kecil dianggap sama)
    //   - Pakai regex supaya ga perlu match 100% exact (lebih fleksibel)
  });

  // --------------------------------------------------------------------------
  // TEST 2: Cek apakah navigasi di navbar ada dan lengkap
  // --------------------------------------------------------------------------

  test('should display navbar with navigation links', async ({ page }) => {
    await page.goto('/');

    // ASSERT: Cek link-link penting di navbar
    // getByRole('link') → cari element <a> (hyperlink)
    // { name: '...' } → filter berdasarkan teks yang terlihat di link tersebut
    //
    // PELAJARAN PENTING: Awalnya kita tulis:
    //   page.getByRole('link', { name: 'Katalog Ruang' })
    // Tapi GAGAL karena "Katalog Ruang" ada 2x di page (navbar DAN footer).
    // Playwright strict mode ga mau ambil yang ambigu.
    //
    // SOLUSI: Scope ke dalam <nav> dulu pakai getByRole('navigation'),
    // baru cari link di dalamnya. Ini namanya "chaining locators".
    const navbar = page.getByRole('navigation');
    await expect(navbar.getByRole('link', { name: 'Katalog Ruang' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Opsi Sewa' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Masuk' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Daftar' })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 3: Cek apakah footer muncul
  // --------------------------------------------------------------------------

  test('should display footer with copyright', async ({ page }) => {
    await page.goto('/');

    // ASSERT: Cek teks copyright di footer
    // getByText() → cari element apapun yang mengandung teks tertentu.
    // Bedanya sama getByRole: getByText ga peduli role-nya apa (bisa <p>, <span>, <div>, dll).
    //
    // PELAJARAN PENTING: Awalnya kita tulis exact string:
    //   page.getByText('© 2025 urSpace Technologies.')
    // Tapi GAGAL karena source code-nya pakai `new Date().getFullYear()` (dynamic).
    // Teksnya bisa jadi "© 2025" atau "© 2026" dst tergantung tahun.
    //
    // SOLUSI: Pakai Regex → /urSpace Technologies/i
    // Ini lebih fleksibel dan ga peduli tahun berapa.
    await expect(
      page.getByText(/urSpace Technologies/i)
    ).toBeVisible();
  });
});

// ============================================================================
// TEST GROUP: Navigation to Login Page
// ============================================================================
// Test ini simulasi flow user: dari landing page → klik "Masuk" → sampai
// di halaman login dan semua form element terlihat.
// ============================================================================

test.describe('Navigation to Login Page', () => {

  // --------------------------------------------------------------------------
  // TEST 4: User bisa navigasi ke login dari navbar
  // --------------------------------------------------------------------------

  test('should navigate to login page when clicking "Masuk"', async ({ page }) => {
    // ARRANGE: Buka landing page
    await page.goto('/');

    // ACT: Klik link "Masuk" di navbar
    // .click() → simulasi user mengklik element tersebut.
    // Playwright otomatis tunggu sampai element visible & clickable (auto-wait).
    await page.getByRole('link', { name: 'Masuk' }).click();

    // ASSERT: URL harus berubah ke /login
    // toHaveURL() → cek apakah browser sekarang ada di URL yang benar.
    // Ini penting karena memastikan navigasi beneran terjadi.
    await expect(page).toHaveURL('/login');

    // ASSERT: Heading login muncul
    await expect(
      page.getByRole('heading', { name: 'Selamat Datang.' })
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 5: Semua form element di login page terlihat
  // --------------------------------------------------------------------------

  test('should display login form elements', async ({ page }) => {
    // ARRANGE: Langsung buka /login (ga perlu lewat landing dulu)
    // Kenapa? Karena test ini fokusnya bukan navigasi, tapi "apakah form-nya muncul?"
    // Setiap test harus INDEPENDEN — ga boleh bergantung pada test lain.
    await page.goto('/login');

    // ASSERT: Cek input username ada
    // getByPlaceholder() → cari <input> berdasarkan placeholder text-nya.
    // Best practice kalau input-nya ga punya label yang accessible.
    await expect(page.getByPlaceholder('username_anda')).toBeVisible();

    // ASSERT: Cek input password ada
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();

    // ASSERT: Cek tombol Sign In ada
    await expect(
      page.getByRole('button', { name: 'Sign In' })
    ).toBeVisible();

    // ASSERT: Cek link kembali ke beranda ada
    await expect(page.getByText('Kembali ke Beranda')).toBeVisible();
  });
});
