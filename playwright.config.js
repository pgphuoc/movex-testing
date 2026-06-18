// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * MoveX E2E Test Configuration
 * Xem GUIDELINE.md để hiểu quy trình test
 */
module.exports = defineConfig({
  // Thư mục chứa test specs
  testDir: './specs',

  // Timeout cho mỗi test case (30 giây)
  timeout: 30_000,

  // Timeout cho expect assertions (5 giây)
  expect: {
    timeout: 5_000,
  },

  // Chạy test tuần tự (không song song) để tránh xung đột data
  fullyParallel: false,

  // Không retry khi fail (để dễ debug)
  retries: 0,

  // Số worker (1 = chạy tuần tự)
  workers: 1,

  // Reporter: HTML report + console output
  reporter: [
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['list'],
  ],

  // Cấu hình chung cho tất cả tests
  use: {
    // ⚠️ THAY ĐỔI URL NÀY nếu server chạy ở port khác
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Chụp screenshot khi test fail
    screenshot: 'only-on-failure',

    // Quay video khi test fail
    video: 'retain-on-failure',

    // Trace khi retry
    trace: 'on-first-retry',

    // Viewport mặc định
    viewport: { width: 1280, height: 720 },

    // Bỏ qua HTTPS errors (local dev)
    ignoreHTTPSErrors: true,
  },

  // Chỉ test trên Chromium
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
