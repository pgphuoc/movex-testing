// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Services';
const SERVICE_LIST_URL = '/master-data/services/service';
const GROUP_LIST_URL = '/master-data/services/group';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện & Chức năng`, () => {
  test('UI-001: Trang danh sách Service tải đúng', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    await expect(page.locator('text=Service List').first()).toBeVisible();
    
    // Nút Add Service
    const addBtn = page.getByRole('button', { name: /add service/i }).or(page.locator('button:has-text("Add Service")'));
    await expect(addBtn).toBeVisible();
  });

  test('FN-001: Mở modal Create Service thành công', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i }).or(page.locator('button:has-text("Add Service")')).first();
    await addBtn.click();
    
    // Kiểm tra modal xuất hiện
    await expect(page.locator('.ant-modal-title:has-text("Create Service")').first().or(page.locator('text=Create Service').first())).toBeVisible();
    
    // Đóng modal
    const cancelBtn = page.locator('.ant-modal-footer button:has-text("Cancel")').or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    // Đợi modal đóng
    await expect(page.locator('.ant-modal-title:has-text("Create Service")').first().or(page.locator('text=Create Service').first())).not.toBeVisible();
  });

  test('UI-002: Trang danh sách Service Group tải đúng', async ({ page }) => {
    await navigateTo(page, GROUP_LIST_URL);
    await expect(page.locator('text=Service Group').first()).toBeVisible();
  });
});
