// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Subscription';
const LIST_URL = '/platform-admin/subscription';

const ADMIN_CREDENTIALS = {
  email: 'admin@movex.vn',
  password: 'Admin@2026'
};

test.beforeEach(async ({ page }) => {
  await login(page, ADMIN_CREDENTIALS);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Subscription').or(page.locator('text=Subscription List')).or(page.locator('text=Đăng ký')).first()).toBeVisible();
  });
});
