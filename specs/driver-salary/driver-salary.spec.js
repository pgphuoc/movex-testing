// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Driver Salary';
const LIST_URL = '/tms/driver-salary';

test.describe(`${MODULE_NAME} — Giao diện (Chưa kiểm thử)`, () => {
  test.skip('UI-001: Trang tính lương tài xế tải đúng bố cục', async ({ page }) => {
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});

test.describe(`${MODULE_NAME} — Chức năng (Chưa kiểm thử)`, () => {
  test.skip('FN-001: Tính lương tháng cho tài xế thành công', async ({ page }) => {
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});
