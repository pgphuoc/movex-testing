// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

/**
 * ===================================================================
 * [TÊN MODULE] — Playwright E2E Test
 * ===================================================================
 *
 * Tham chiếu chéo:
 *  - Đặc tả màn hình: input/11 Screen Specification/[FILE].md
 *  - Quy tắc hệ thống: SR-XX-001 → SR-XX-00N
 *  - API: GET/POST /api/[endpoint]
 *  - Phân quyền: Creator (CRUD) / Viewer (Chỉ xem)
 *
 * Hướng dẫn sử dụng template:
 *  1. Copy file này vào: e2e/specs/<tên-module>/<tên-module>.spec.js
 *  2. Tìm & thay thế các placeholder [VIẾT HOA TRONG NGOẶC VUÔNG]
 *  3. Thêm/bớt test case theo đặc tả BA
 *  4. Chạy: npx playwright test specs/<tên-module>/
 *
 * ===================================================================
 */

// ============================================================
// CẤU HÌNH MODULE
// Thay đổi 2 dòng dưới đây cho module của bạn
// ============================================================
const MODULE_NAME = '[TÊN MODULE]';           // VD: 'Business Partner'
const LIST_URL = '/master-data/[đường-dẫn]';  // VD: '/master-data/business-partner'
const CREATE_URL = `${LIST_URL}/create`;

// ============================================================
// ĐĂNG NHẬP TRƯỚC MỖI TEST
// ============================================================
test.beforeEach(async ({ page }) => {
  await login(page);
});

// ============================================================
// 1. GIAO DIỆN / BỐ CỤC (UI)
// ============================================================
test.describe(`${MODULE_NAME} — Giao diện`, () => {

  test('UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // Kiểm tra tiêu đề trang
    await expect(page.locator(`text=${MODULE_NAME}`).first()).toBeVisible();

    // Kiểm tra nút Thêm mới
    await expect(
      page.getByRole('button', { name: /add new/i })
    ).toBeVisible();

    // Kiểm tra có bảng dữ liệu
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('UI-002: Các cột mặc định hiển thị đúng', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // TODO: Thay bằng các cột thực tế từ đặc tả BA
    const expectedColumns = [
      // 'Cột 1',
      // 'Cột 2',
      // 'Cột 3',
    ];

    for (const col of expectedColumns) {
      await expect(
        page.getByRole('columnheader', { name: col })
      ).toBeVisible();
    }
  });
});

// ============================================================
// 2. CHỨC NĂNG (FUNCTIONAL)
// ============================================================
test.describe(`${MODULE_NAME} — Chức năng`, () => {

  test('FN-001: Nhấn hàng → Trang Chi tiết', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // Nhấn hàng đầu tiên
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();

    // Kiểm tra URL chuyển sang detail
    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+`));
  });

  test('FN-002: Nút Thêm mới → Trang tạo mới', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    await page.getByRole('button', { name: /add new|add business/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/create`));
  });

  test('FN-003: Nút Hủy từ Tạo mới → quay về Danh sách', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}$`));
  });

  test('FN-004: Nút Sửa trên Chi tiết → Trang chỉnh sửa', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // Vào chi tiết
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();
    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+`));

    // Nhấn Sửa
    await page.getByRole('button', { name: /edit/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+/edit`));
  });
});

// ============================================================
// 3. VALIDATION
// ============================================================
test.describe(`${MODULE_NAME} — Validation`, () => {

  test('VL-001: Lưu form trống hiện lỗi trường bắt buộc', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    // Nhấn Lưu khi form trống
    await page.getByRole('button', { name: /save/i }).click();

    // Kiểm tra có thông báo lỗi
    const errorMessages = page.locator('text=This field is required');
    const count = await errorMessages.count();

    // TODO: Thay số bằng số trường bắt buộc thực tế
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// 4. QUY TẮC NGHIỆP VỤ
// ============================================================
test.describe(`${MODULE_NAME} — Quy tắc nghiệp vụ`, () => {

  // TODO: Thêm test case cho từng Systems Rule (SR-XX-YYY)
  // Ví dụ:
  //
  // test('BR-001: [Mô tả rule] (SR-XX-001)', async ({ page }) => {
  //   await navigateTo(page, CREATE_URL);
  //   // ... thao tác ...
  //   // ... kiểm tra kết quả ...
  // });

  test.skip('BR-001: [Thêm rule ở đây]', async ({ page }) => {
    // Placeholder — xóa test.skip và thêm logic
  });
});

// ============================================================
// 5. PHÂN QUYỀN
// ============================================================
test.describe(`${MODULE_NAME} — Phân quyền`, () => {

  test('PM-001: Admin thấy các nút hành động', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // Admin thấy nút Thêm mới
    await expect(
      page.getByRole('button', { name: /add new|add business/i })
    ).toBeVisible();

    // Vào chi tiết → Admin thấy nút Sửa
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();

    await expect(
      page.getByRole('button', { name: /edit/i })
    ).toBeVisible();
  });
});
