// @ts-check
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { ENV } = require('./env');

const storageStatePath = path.join(__dirname, '..', 'test-results', '.auth', 'storageState.json');

/**
 * Global Setup — Runs ONCE before all test files.
 *
 * Performs login and saves the browser session (cookies + localStorage)
 * to a file. All tests then reuse this session via `storageState` config,
 * eliminating the need to login before every single test case.
 *
 * Performance impact: Saves ~5-10 seconds per test case.
 * For 95 tests → saves ~8-16 minutes per run.
 */
async function globalSetup() {
  // Ensure the auth directory exists
  const authDir = path.dirname(storageStatePath);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Skip if credentials are not configured
  if (!ENV.admin.email || !ENV.admin.password) {
    console.warn(
      '\n⚠️  Skipping global setup: TEST_EMAIL / TEST_PASSWORD not configured.' +
      '\n   Tests will need to login individually via beforeEach.\n'
    );
    // Create an empty storage state so tests don't crash
    fs.writeFileSync(storageStatePath, JSON.stringify({ cookies: [], origins: [] }), 'utf8');
    return;
  }

  console.log('🔐 Global Setup: Logging in to save session...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    const baseURL = ENV.baseUrl;
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill email
    const emailInput = page.locator('input[name="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10_000 });
    await emailInput.fill(ENV.admin.email);

    // Fill password
    const passwordInput = page.locator('input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 5_000 });
    await passwordInput.fill(ENV.admin.password);

    // Click login
    const loginButton = page
      .locator(
        'button:has-text("Login"), button:has-text("Sign in"), button:has-text("Đăng nhập"), button:has-text("Log in")'
      )
      .first();
    await loginButton.waitFor({ state: 'visible', timeout: 5_000 });
    await loginButton.click();

    // Wait for successful redirect
    await page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 15_000,
    });

    // Save session state
    await context.storageState({ path: storageStatePath });
    console.log(`✅ Global Setup: Session saved to ${storageStatePath}`);

  } catch (error) {
    console.error('❌ Global Setup: Login failed!', error.message);
    // Create empty state so tests can still run (will fail at login assertions)
    fs.writeFileSync(storageStatePath, JSON.stringify({ cookies: [], origins: [] }), 'utf8');
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
