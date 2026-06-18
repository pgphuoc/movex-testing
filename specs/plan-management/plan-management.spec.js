// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Plan Management';
const LIST_URL = '/platform-admin/plan-management';

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
    await expect(page.locator('text=Plan Management').or(page.locator('text=Plan List')).or(page.locator('text=Quản lý gói')).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new|thêm mới/i }).first()).toBeVisible();
  });
});
