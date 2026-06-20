// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

/**
 * MoveX E2E Test Configuration
 * Xem GUIDELINE.md để hiểu quy trình test
 *
 * Improvements:
 *  - Global setup: Login once, reuse session via storageState
 *  - Retries: 1 retry on CI to handle flaky network
 *  - Projects: smoke (fast) vs regression (full) separation
 *  - Smarter timeouts
 */

const isCI = !!process.env.CI;
const storageStatePath = path.join(__dirname, 'test-results', '.auth', 'storageState.json');

module.exports = defineConfig({
  // Thư mục chứa test specs
  testDir: './specs',

  // Timeout cho mỗi test case
  // CI: 60s (network latency), Local: 30s
  timeout: isCI ? 60_000 : 30_000,

  // Timeout cho expect assertions
  expect: {
    timeout: 10_000,
  },

  // Chạy test tuần tự (không song song) để tránh xung đột data
  fullyParallel: false,

  // Retry 1 lần trên CI để giảm false negatives
  retries: isCI ? 1 : 0,

  // Số worker (1 = chạy tuần tự)
  workers: 1,

  // Global setup: login once and save session
  globalSetup: require.resolve('./helpers/global-setup'),

  // Reporter: HTML report + JSON report + console output + custom ModuleReporter
  reporter: [
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['json', { outputFile: './reports/results.json' }],
    ['list'],
    ['./helpers/module-reporter.js']
  ],

  // Cấu hình chung cho tất cả tests
  use: {
    // Base URL — đọc từ env
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Reuse login session (skip login per test)
    storageState: storageStatePath,

    // Chụp screenshot cho mọi test case làm minh chứng (evidence)
    screenshot: 'on',

    // Quay video khi test fail
    video: 'retain-on-failure',

    // Trace khi retry (để debug flaky tests)
    trace: 'on-first-retry',

    // Viewport mặc định
    viewport: { width: 1280, height: 720 },

    // Bỏ qua HTTPS errors (local dev)
    ignoreHTTPSErrors: true,

    // Action timeout — smarter than global timeout
    actionTimeout: 10_000,

    // Navigation timeout
    navigationTimeout: 15_000,
  },

  // Test projects — cho phép chạy subset theo tag
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
    // Uncomment khi cần cross-browser testing (Phase 4+)
    // {
    //   name: 'firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'webkit',
    //   use: { browserName: 'webkit' },
    // },
  ],

  // Output folder cho test results
  outputDir: './test-results',
});
