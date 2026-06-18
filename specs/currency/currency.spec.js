// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Currency';
const LIST_URL = '/master-data/currency';

test.describe(`${MODULE_NAME} — Giao diện (Chưa kiểm thử)`, () => {
  test.skip('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});

test.describe(`${MODULE_NAME} — Chức năng (Chưa kiểm thử)`, () => {
  test.skip('FN-001: Tạo mới Currency thành công', async ({ page }) => {
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});
