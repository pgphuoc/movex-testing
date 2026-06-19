// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Quotation';
const LIST_URL = '/oms/quotation';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Quotation').or(page.locator('text=Quotation List')).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new/i }).or(page.getByRole('button', { name: /add quotation/i })).first()).toBeVisible();
  });
});
