// @ts-check
const { test: base } = require('@playwright/test')

/**
 * Tài khoản test mặc định
 * ⚠️ Thay đổi nếu dùng tài khoản khác
 */
const TEST_ACCOUNTS = {
  admin: {
    email: process.env.TEST_EMAIL || 'tenant.admin@gmail.vn',
    password: process.env.TEST_PASSWORD || 'AdminTeant@1466!'
  }
}

/**
 * Đăng nhập hệ thống MoveX
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string }} credentials
 */
async function login(page, credentials = TEST_ACCOUNTS.admin) {
  await page.goto('/login')

  // Chờ trang login tải xong
  await page.waitForLoadState('networkidle')

  // Điền email — MoveX dùng XInputText, render ra input[name="email"] (không phải type="email")
  const emailInput = page.locator('input[name="email"]').first()
  await emailInput.waitFor({ state: 'visible', timeout: 10_000 })
  await emailInput.fill(credentials.email)

  // Điền password — XInputText với type="password"
  const passwordInput = page.locator('input[name="password"]').first()
  await passwordInput.waitFor({ state: 'visible', timeout: 5_000 })
  await passwordInput.fill(credentials.password)

  // Nhấn nút đăng nhập — XButton hiển thị text từ i18n key 'login.loginButton'
  // Có thể là "Login", "Sign in", "Đăng nhập" tuỳ ngôn ngữ
  const loginButton = page
    .locator(
      'button:has-text("Login"), button:has-text("Sign in"), button:has-text("Đăng nhập"), button:has-text("Log in")'
    )
    .first()
  await loginButton.waitFor({ state: 'visible', timeout: 5_000 })
  await loginButton.click()

  // Chờ chuyển trang (khỏi /login)
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 15_000
  })
}

/**
 * Điều hướng đến một module Master Data
 * @param {import('@playwright/test').Page} page
 * @param {string} path - ví dụ: '/master-data/vehicle'
 */
async function navigateTo(page, path) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

module.exports = { TEST_ACCOUNTS, login, navigateTo }
