// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Administrative Info';
const LIST_URL = '/master-data/administrative-info';
const CREATE_URL = `${LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('AI-UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    // Tiêu đề hoặc breadcrumb
    await expect(page.locator('text=Administrative Info').first()).toBeVisible();
    // Các nút hành động chính
    const addNewBtn = page.getByRole('button', { name: /add new/i }).or(page.locator('button:has-text("Add New")'));
    await expect(addNewBtn).toBeVisible();
  });

  test('AI-UI-002: Trang tạo mới hiển thị đầy đủ các trường và tab con', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    // Tiêu đề
    await expect(page.locator('text=New Administrative Info').first().or(page.locator('text=New Country').first())).toBeVisible();
    
    // Các section
    await expect(page.locator('text=Country Information').first()).toBeVisible();
    
    // Các tab con
    await expect(page.locator('.ant-tabs-tab-btn:has-text("Administrative")').first().or(page.locator('text=Administrative').first())).toBeVisible();
    await expect(page.locator('.ant-tabs-tab-btn:has-text("Zones")').first().or(page.locator('text=Zones').first())).toBeVisible();
  });
});

test.describe(`${MODULE_NAME} — Chức năng & Nghiệp vụ`, () => {
  test('AI-FN-001: Validation lỗi bắt buộc khi lưu form trống', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    // Nhấn Lưu
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).first();
    await saveBtn.click();
    
    // Kiểm tra thông báo lỗi validation
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('AI-FN-002: Nút Hủy từ màn hình tạo mới quay lại màn hình danh sách', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(new RegExp(LIST_URL));
    expect(page.url()).toContain(LIST_URL);
  });
});
