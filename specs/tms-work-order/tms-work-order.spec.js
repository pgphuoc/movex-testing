// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'TMS Work Order List';
const LIST_URL = '/tms/workOrderList';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang Trucking Work Order List tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Work Order').or(page.locator('text=Work Orders')).first()).toBeVisible();
  });
});
