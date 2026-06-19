// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Trucking Planning';
const LIST_URL = '/tms/trucking-planing';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang Trucking Planning tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Trucking Planning').or(page.locator('text=Planning')).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new/i }).or(page.getByRole('button', { name: /create/i })).or(page.locator('.ant-btn')).first()).toBeVisible();
  });
});
