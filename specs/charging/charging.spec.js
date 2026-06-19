// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Electric Charging Management';
const LIST_URL = '/tms/charging';

test.describe(`${MODULE_NAME} — Giao diện (Chưa kiểm thử)`, () => {
  test('UI-001: Trang quản lý sạc điện tải đúng bố cục', async ({ page }) => {
    test.skip(true, 'Chờ phát triển giao diện (UI) của phân hệ');
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});

test.describe(`${MODULE_NAME} — Chức năng (Chưa kiểm thử)`, () => {
  test('FN-001: Tạo mới phiếu sạc điện thành công', async ({ page }) => {
    test.skip(true, 'Chờ tích hợp API và hoàn thiện tính năng');
    // Sẽ thực hiện kiểm thử tự động ở giai đoạn sau
  });
});
