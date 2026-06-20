// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');
const { ListPage, FormPage, AntSelect, AntTable } = require('../../pages');

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
 *  1. Copy file này vào: specs/<tên-module>/<tên-module>.spec.js
 *  2. Tìm & thay thế các placeholder [VIẾT HOA TRONG NGOẶC VUÔNG]
 *  3. Thêm/bớt test case theo đặc tả BA
 *  4. Chạy: npx playwright test specs/<tên-module>/
 *
 * Test Tags:
 *  - @smoke      → Quick validation (~5 min total suite)
 *  - @regression → Full regression (~30 min)
 *  - @critical   → Business-critical flows
 *
 * ===================================================================
 */

// ============================================================
// CẤU HÌNH MODULE
// Thay đổi các dòng dưới đây cho module của bạn
// ============================================================
const MODULE_NAME = '[TÊN MODULE]';           // VD: 'Business Partner'
const LIST_URL = '/master-data/[đường-dẫn]';  // VD: '/master-data/business-partner'
const CREATE_URL = `${LIST_URL}/create`;

// ============================================================
// PAGE OBJECTS — Khởi tạo trong beforeEach
// ============================================================
let listPage;
let formPage;

// ============================================================
// ĐĂNG NHẬP TRƯỚC MỖI TEST
// ============================================================
test.beforeEach(async ({ page }) => {
  await login(page);
  listPage = new ListPage(page, { url: LIST_URL, title: MODULE_NAME });
  formPage = new FormPage(page, { url: CREATE_URL });
});

// ============================================================
// 1. GIAO DIỆN / BỐ CỤC (UI) — @smoke
// ============================================================
test.describe(`${MODULE_NAME} — Giao diện`, () => {

  test('XX-UI-001: Trang danh sách tải đúng bố cục', { tag: ['@smoke', '@ui'] }, async ({ page }) => {
    await listPage.open();
    await listPage.verifyLayout(expect);

    // Kiểm tra có bảng dữ liệu
    const table = new AntTable(page);
    await expect(page.getByRole('table').or(page.locator('.ant-table'))).toBeVisible();
  });

  test('XX-UI-002: Các cột mặc định hiển thị đúng', { tag: ['@regression', '@ui'] }, async ({ page }) => {
    await listPage.open();

    // TODO: Thay bằng các cột thực tế từ đặc tả BA
    const expectedColumns = [
      // 'Cột 1',
      // 'Cột 2',
      // 'Cột 3',
    ];

    const table = new AntTable(page);
    for (const col of expectedColumns) {
      const hasCol = await table.hasColumn(col);
      expect(hasCol).toBeTruthy();
    }
  });
});

// ============================================================
// 2. CHỨC NĂNG (FUNCTIONAL)
// ============================================================
test.describe(`${MODULE_NAME} — Chức năng`, () => {

  test('XX-FN-001: Nhấn hàng → Trang Chi tiết', { tag: ['@smoke', '@functional'] }, async ({ page }) => {
    await listPage.open();
    await listPage.clickFirstRow();

    // Kiểm tra URL chuyển sang detail
    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+`));
  });

  test('XX-FN-002: Nút Thêm mới → Trang tạo mới', { tag: ['@regression', '@functional'] }, async ({ page }) => {
    await listPage.open();
    await listPage.clickAdd();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/create`));
  });

  test('XX-FN-003: Nút Hủy từ Tạo mới → quay về Danh sách', { tag: ['@regression', '@functional'] }, async ({ page }) => {
    await formPage.open();
    await formPage.clickCancel();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}$`));
  });

  test('XX-FN-004: Nút Sửa trên Chi tiết → Trang chỉnh sửa', { tag: ['@regression', '@functional'] }, async ({ page }) => {
    await listPage.open();
    await listPage.clickFirstRow();
    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+`));

    await formPage.clickEdit();
    await expect(page).toHaveURL(new RegExp(`${LIST_URL}/\\d+/edit`));
  });
});

// ============================================================
// 3. VALIDATION
// ============================================================
test.describe(`${MODULE_NAME} — Validation`, () => {

  test('XX-VL-001: Lưu form trống hiện lỗi trường bắt buộc', { tag: ['@regression', '@validation'] }, async ({ page }) => {
    await formPage.open();
    await formPage.clickSave();

    // Kiểm tra có thông báo lỗi
    const errorCount = await formPage.countValidationErrors();
    // TODO: Thay số bằng số trường bắt buộc thực tế
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// 4. QUY TẮC NGHIỆP VỤ
// ============================================================
test.describe(`${MODULE_NAME} — Quy tắc nghiệp vụ`, () => {

  // TODO: Thêm test case cho từng Systems Rule (SR-XX-YYY)
  // Ví dụ:
  //
  // test('XX-BR-001: [Mô tả rule] (SR-XX-001)', { tag: ['@regression', '@business-rule'] }, async ({ page }) => {
  //   await formPage.open();
  //   // ... thao tác ...
  //   // ... kiểm tra kết quả ...
  // });

  test.skip('XX-BR-001: [Thêm rule ở đây]', async ({ page }) => {
    // Placeholder — xóa test.skip và thêm logic
  });
});

// ============================================================
// 5. PHÂN QUYỀN
// ============================================================
test.describe(`${MODULE_NAME} — Phân quyền`, () => {

  test('XX-PM-001: Admin thấy các nút hành động', { tag: ['@regression', '@permission'] }, async ({ page }) => {
    await listPage.open();

    // Admin thấy nút Thêm mới
    await expect(listPage.addButton).toBeVisible();

    // Vào chi tiết → Admin thấy nút Sửa
    await listPage.clickFirstRow();
    await expect(formPage.editButton).toBeVisible();
  });
});
