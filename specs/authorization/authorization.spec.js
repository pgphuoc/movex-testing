// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Authorization';
const LIST_URL = '/tenant-admin/role-permission';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Authorization').or(page.locator('text=Role & Permission').or(page.locator('text=Role Management'))).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new|thêm mới/i }).first()).toBeVisible();
  });
});
