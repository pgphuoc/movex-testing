// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Administrative Info';
const LIST_URL = '/master-data/administrative-info';

test.describe(`${MODULE_NAME} — Giao diện (Chưa kiểm thử)`, () => {
  test.skip('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    // Sẽ được thực hiện trong giai đoạn tiếp theo
  });

  test.skip('UI-002: Các cột mặc định hiển thị đúng', async ({ page }) => {
    // Sẽ được thực hiện trong giai đoạn tiếp theo
  });
});

test.describe(`${MODULE_NAME} — Chức năng (Chưa kiểm thử)`, () => {
  test.skip('FN-001: Thêm mới Administrative Info thành công', async ({ page }) => {
    // Sẽ được thực hiện trong giai đoạn tiếp theo
  });
});
