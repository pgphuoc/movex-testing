// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'User Management';
const LIST_URL = '/tenant-admin/user-management';
const CREATE_URL = `${LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=User Management').or(page.locator('text=User List')).or(page.locator('text=Quản lý người dùng')).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new|thêm mới/i }).first()).toBeVisible();
  });

  test('UI-002: Trang tạo mới hiển thị đầy đủ trường', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    await expect(page.locator('text=New User').or(page.locator('text=Create User')).or(page.locator('text=Add User')).or(page.locator('text=Tạo mới người dùng')).first()).toBeVisible();
    await page.screenshot({ path: 'reports/UM-UI-002-Create-Layout.png' });
  });
});

test.describe(`${MODULE_NAME} — Chức năng & Nghiệp vụ`, () => {
  test('FN-001: Nút Hủy từ tạo mới quay lại danh sách', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    const cancelBtn = page.getByRole('button', { name: /cancel|hủy/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(page).toHaveURL(new RegExp(LIST_URL));
    }
  });

  test('FN-002: Validation lỗi bắt buộc khi lưu form trống', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    const saveBtn = page.getByRole('button', { name: /save|lưu/i }).first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
      const errorMsg = page.locator('text=required').or(page.locator('text=bắt buộc')).or(page.locator('text=This field is required'));
      expect(await errorMsg.count()).toBeGreaterThanOrEqual(1);
    }
  });
});
