// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Pricing';
const POLICY_LIST_URL = '/master-data/pricing/pricing-policy';
const POLICY_CREATE_URL = `${POLICY_LIST_URL}/create`;
const RULE_LIST_URL = '/master-data/pricing/pricing-rule';
const PLANNED_COST_LIST_URL = '/master-data/pricing/planned-cost';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện & Chức năng`, () => {
  test('UI-001: Trang danh sách Pricing Policy tải đúng', async ({ page }) => {
    await navigateTo(page, POLICY_LIST_URL);
    await expect(page.locator('text=Pricing Policy').first()).toBeVisible();
    
    // Nút Add
    const addBtn = page.getByRole('button', { name: /add/i }).or(page.locator('button:has-text("Add")'));
    await expect(addBtn).toBeVisible();
  });

  test('UI-002: Trang tạo mới Pricing Policy hiển thị đúng', async ({ page }) => {
    await navigateTo(page, POLICY_CREATE_URL);
    await expect(page.locator('text=New Pricing Policy').first().or(page.locator('text=Create Pricing Policy').first())).toBeVisible();
  });

  test('FN-001: Nút Hủy từ màn hình tạo mới Pricing Policy quay lại danh sách', async ({ page }) => {
    await navigateTo(page, POLICY_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(POLICY_LIST_URL));
    expect(page.url()).toContain(POLICY_LIST_URL);
  });

  test('UI-003: Trang danh sách Pricing Rule tải đúng', async ({ page }) => {
    await navigateTo(page, RULE_LIST_URL);
    await expect(page.locator('text=Pricing Rule').first()).toBeVisible();
  });

  test('UI-004: Trang danh sách Planned Cost tải đúng', async ({ page }) => {
    await navigateTo(page, PLANNED_COST_LIST_URL);
    await expect(page.locator('text=Planned Cost').first()).toBeVisible();
  });
});
