// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Common Code';
const LIST_URL = '/master-data/common-codes';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('CC-UI-001: Trang danh sách Common Codes tải đúng', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Common Code List').first()).toBeVisible();
    
    // Kiểm tra bộ lọc hoặc bảng hiển thị
    await expect(page.locator('text=Filters').first().or(page.locator('.ant-table').first())).toBeVisible();
  });
});
