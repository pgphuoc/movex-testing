// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Cost';
const GROUP_LIST_URL = '/master-data/cost/group';
const GROUP_CREATE_URL = `${GROUP_LIST_URL}/create`;
const COST_LIST_URL = '/master-data/cost/cost';
const COST_CREATE_URL = `${COST_LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} Group — Giao diện & Chức năng`, () => {
  test('UI-001: Trang danh sách Cost Group tải đúng', async ({ page }) => {
    await navigateTo(page, GROUP_LIST_URL);
    await expect(page.locator('text=Cost Group').first()).toBeVisible();
    
    // Nút Add Cost Group
    const addBtn = page.getByRole('button', { name: /add cost group/i }).or(page.locator('button:has-text("Add Cost Group")'));
    await expect(addBtn).toBeVisible();
  });

  test('UI-002: Trang tạo mới Cost Group hiển thị đúng', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    await expect(page.locator('text=Create Cost Group').first()).toBeVisible();
  });

  test('FN-001: Validation lỗi bắt buộc khi lưu Cost Group trống', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('FN-002: Nút Hủy từ màn hình tạo mới Cost Group quay lại danh sách', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(GROUP_LIST_URL));
    expect(page.url()).toContain(GROUP_LIST_URL);
  });
});

test.describe(`${MODULE_NAME} Item — Giao diện & Chức năng`, () => {
  test('UI-003: Trang danh sách Cost Item tải đúng', async ({ page }) => {
    await navigateTo(page, COST_LIST_URL);
    await expect(page.locator('text=Cost').first()).toBeVisible();
    
    // Nút Add Cost
    const addBtn = page.getByRole('button', { name: /add cost/i }).or(page.locator('button:has-text("Add Cost")'));
    await expect(addBtn).toBeVisible();
  });

  test('UI-004: Trang tạo mới Cost Item hiển thị đúng', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    await expect(page.locator('text=Create Cost').first()).toBeVisible();
  });

  test('FN-003: Validation lỗi bắt buộc khi lưu Cost Item trống', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('FN-004: Nút Hủy từ màn hình tạo mới Cost Item quay lại danh sách', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(COST_LIST_URL));
    expect(page.url()).toContain(COST_LIST_URL);
  });
});
