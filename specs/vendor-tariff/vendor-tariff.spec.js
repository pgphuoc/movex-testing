// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Vendor Tariff';
const TRUCKING_LIST_URL = '/master-data/vendor-tariff/trucking-freight';
const TRUCKING_CREATE_URL = `${TRUCKING_LIST_URL}/create`;
const VAS_LIST_URL = '/master-data/vendor-tariff/freight-vas-tariff';
const VAS_CREATE_URL = `${VAS_LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} Trucking Freight — Giao diện & Chức năng`, () => {
  test('UI-001: Trang danh sách Trucking Freight tải đúng', async ({ page }) => {
    await navigateTo(page, TRUCKING_LIST_URL);
    await expect(page.locator('text=Trucking Freight List').first()).toBeVisible();
    
    // Nút Add Trucking Freight
    const addBtn = page.getByRole('button', { name: /add/i }).or(page.locator('button:has-text("Add")'));
    await expect(addBtn).toBeVisible();
  });

  test('UI-002: Trang tạo mới Trucking Freight hiển thị đúng', async ({ page }) => {
    await navigateTo(page, TRUCKING_CREATE_URL);
    await expect(page.locator('text=Create Trucking Freight').first()).toBeVisible();
  });

  test('FN-001: Validation lỗi bắt buộc khi lưu Trucking Freight trống', async ({ page }) => {
    await navigateTo(page, TRUCKING_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('FN-002: Nút Hủy từ tạo mới Trucking Freight quay lại danh sách', async ({ page }) => {
    await navigateTo(page, TRUCKING_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(TRUCKING_LIST_URL));
    expect(page.url()).toContain(TRUCKING_LIST_URL);
  });
});

test.describe(`${MODULE_NAME} Freight VAS Tariff — Giao diện & Chức năng`, () => {
  test('UI-003: Trang danh sách Freight VAS Tariff tải đúng', async ({ page }) => {
    await navigateTo(page, VAS_LIST_URL);
    await expect(page.locator('text=Freight VAS Tariff List').first()).toBeVisible();
  });

  test('UI-004: Trang tạo mới Freight VAS Tariff hiển thị đúng', async ({ page }) => {
    await navigateTo(page, VAS_CREATE_URL);
    await expect(page.locator('text=Create Freight VAS Tariff').first()).toBeVisible();
  });

  test('FN-003: Validation lỗi bắt buộc khi lưu Freight VAS Tariff trống', async ({ page }) => {
    await navigateTo(page, VAS_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('FN-004: Nút Hủy từ tạo mới Freight VAS Tariff quay lại danh sách', async ({ page }) => {
    await navigateTo(page, VAS_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(VAS_LIST_URL));
    expect(page.url()).toContain(VAS_LIST_URL);
  });
});
