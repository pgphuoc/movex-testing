const { test: base, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const apiLogs = [];
    
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        const request = response.request();
        let logLines = [];
        
        // Log Request details (with payload available since request is completed)
        let reqLog = `>> Request: ${request.method()} ${request.url()}`;
        const postData = request.postData();
        if (postData) {
          reqLog += `\n   Request Payload: ${postData}`;
        }
        logLines.push(reqLog);
        
        // Log Response details
        let resLog = `<< Response: ${response.status()} ${response.url()}`;
        try {
          const body = await response.text();
          if (body) {
            resLog += `\n   Response Body: ${body.slice(0, 5000)}${body.length > 5000 ? '... [Truncated]' : ''}`;
          }
        } catch (e) {
          resLog += `\n   [Could not read response body: ${e.message}]`;
        }
        logLines.push(resLog);
        
        apiLogs.push(logLines.join('\n'));
      }
    });

    page.on('requestfailed', request => {
      if (request.url().includes('/api/')) {
        let logLine = `>> Request FAILED: ${request.method()} ${request.url()}`;
        const postData = request.postData();
        if (postData) {
          logLine += `\n   Request Payload: ${postData}`;
        }
        logLine += `\n   Error: ${request.failure() ? request.failure().errorText : 'Unknown Error'}`;
        apiLogs.push(logLine);
      }
    });

    try {
      await use(page);
    } finally {
      // Always attach the api-log for debugging & tracing
      const logsText = apiLogs.join('\n');
      await testInfo.attach('api-log', {
        body: logsText,
        contentType: 'text/plain'
      });

      // Parse testId from testInfo.title or generate a safe filename
      const match = testInfo.title.match(/^([A-Z0-9-]+):/);
      const testId = match ? match[1] : null;
      const safeTitleName = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
      const screenshotFilename = testId ? `${testId}.png` : `${safeTitleName}.png`;

      const reportsDir = path.join(__dirname, '..', 'reports', 'screenshots');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      const screenshotPath = path.join(reportsDir, screenshotFilename);
      try {
        await page.screenshot({ path: screenshotPath });
        // Attach the screenshot path to testInfo so Playwright registers it
        await testInfo.attach('screenshot', {
          path: screenshotPath,
          contentType: 'image/png'
        });
      } catch (e) {
        console.warn(`Failed to take screenshot for ${testInfo.title}:`, e.message);
      }
    }
  }
});

const { ENV } = require('./env');

/**
 * Tài khoản test — đọc từ biến môi trường hoặc file .env
 * ⚠️ Copy .env.example → .env và điền giá trị thật.
 * ⚠️ KHÔNG hardcode credentials trong source code.
 */
const TEST_ACCOUNTS = {
  admin: {
    email: ENV.admin.email,
    password: ENV.admin.password,
  },
  owner: {
    email: ENV.owner.email,
    password: ENV.owner.password,
  },
  viewer: {
    email: ENV.viewer.email,
    password: ENV.viewer.password,
  },
}

async function login(page, credentials = TEST_ACCOUNTS.admin) {
  await page.goto('/login')

  // Chờ trang load xong (có thể là trang login hoặc đã redirect sang trang chủ nếu có session)
  await page.waitForLoadState('networkidle')

  // Nếu app đã tự động redirect khỏi /login (nghĩa là storageState có hiệu lực), thì bỏ qua bước điền form
  if (!page.url().includes('/login')) {
    return;
  }

  // Điền email — MoveX dùng XInputText, render ra input[name="email"] (không phải type="email")
  const emailInput = page.locator('input[name="email"]').first()
  await emailInput.waitFor({ state: 'visible', timeout: 10_000 })
  await emailInput.fill(credentials.email)

  // Điền password — XInputText với type="password"
  const passwordInput = page.locator('input[name="password"]').first()
  await passwordInput.waitFor({ state: 'visible', timeout: 5_000 })
  await passwordInput.fill(credentials.password)

  // Nhấn nút đăng nhập
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

module.exports = { TEST_ACCOUNTS, login, navigateTo, test, expect }
