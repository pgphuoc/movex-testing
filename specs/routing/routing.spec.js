// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Routing';
const LIST_URL = '/master-data/routing';
const CREATE_URL = `${LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện & Chức năng`, () => {
  test('UI-001: Trang danh sách Routing tải đúng', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Routing').first()).toBeVisible();
    
    // Nút Add New
    const addNewBtn = page.getByRole('button', { name: /add new/i }).or(page.locator('button:has-text("Add New")'));
    await expect(addNewBtn).toBeVisible();
  });

  test('UI-002: Trang tạo mới hiển thị đầy đủ các cột và sections', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    // Tiêu đề
    await expect(page.locator('text=New Routing').first().or(page.locator('text=Create Routing').first())).toBeVisible();
    
    // Check form sections
    await expect(page.locator('text=Route Detail').first()).toBeVisible();
    await expect(page.locator('text=Routing Information').first()).toBeVisible();
    await expect(page.locator('text=Toll Station').first()).toBeVisible();
  });

  test('FN-001: Validation lỗi bắt buộc khi lưu form trống', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('FN-002: Nút Hủy từ màn hình tạo mới quay lại màn hình danh sách', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(LIST_URL));
    expect(page.url()).toContain(LIST_URL);
  });
});
