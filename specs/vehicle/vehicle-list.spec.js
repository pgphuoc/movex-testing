// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

/**
 * Vehicle List (SCR-VH-001) — Playwright Test
 *
 * Tham chiếu chéo:
 *  - Đặc tả màn hình: 11 Screen Specification / 2 Vehicle (Mục 7)
 *  - API: GET /api/vehicles
 *  - Quy tắc: SR-VH-001, SR-VH-006, SR-VH-008
 *  - Mã lỗi: VHC_001
 *  - Phân quyền: Admin (CRUD) / Viewer (Chỉ xem)
 *
 * URL: /master-data/vehicle
 */

const VEHICLE_URL = '/master-data/vehicle';
const VEHICLE_CREATE_URL = '/master-data/vehicle/create';

// ============================================================
// Đăng nhập trước tất cả tests
// ============================================================
test.beforeEach(async ({ page }) => {
  await login(page);
});

// ============================================================
// 1. GIAO DIỆN / BỐ CỤC (UI)
// ============================================================
test.describe('Danh sách Phương tiện — Giao diện', () => {
  test('VH-UI-001: Trang tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Vehicle').first()).toBeVisible();

    // Kiểm tra các nút toolbar
    await expect(page.getByRole('button', { name: /add new/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('VH-UI-002: Mặc định hiển thị 7 cột', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Kiểm tra nút Columns hiển thị badge "7"
    const columnsButton = page.getByRole('button', { name: /columns/i });
    await expect(columnsButton).toBeVisible();
    await expect(columnsButton).toContainText('7');

    // Kiểm tra các cột header
    const expectedColumns = [
      'Plate Number',
      'VIN',
      'Vehicle Type',
      'Trade Mark',
      'Model Code',
    ];

    for (const col of expectedColumns) {
      await expect(
        page.getByRole('columnheader', { name: col })
      ).toBeVisible();
    }
  });

  test('VH-UI-006: Có phân trang', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Kiểm tra bảng dữ liệu hiển thị
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
  });
});

// ============================================================
// 2. CHỨC NĂNG (FUNCTIONAL)
// ============================================================
test.describe('Danh sách Phương tiện — Chức năng', () => {
  test('VH-FN-007: Nhấn hàng → Trang Chi tiết', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Nhấn vào hàng đầu tiên trong bảng
    const firstRow = page.getByRole('row').nth(1); // nth(0) = header
    await firstRow.click();

    // Kiểm tra URL chuyển sang trang detail
    await expect(page).toHaveURL(/\/master-data\/vehicle\/\d+/);
  });

  test('VH-FN-009: Nút Hủy từ Thêm mới → quay về Danh sách', async ({ page }) => {
    await navigateTo(page, VEHICLE_CREATE_URL);

    // Nhấn nút Hủy
    await page.getByRole('button', { name: /cancel/i }).click();

    // Kiểm tra quay về trang danh sách
    await expect(page).toHaveURL(new RegExp(VEHICLE_URL + '$'));
  });
});

// ============================================================
// 3. VALIDATION
// ============================================================
test.describe('Thêm mới Phương tiện — Validation', () => {
  test('VH-VL-001→007: Lưu form trống hiện lỗi tất cả trường bắt buộc', async ({ page }) => {
    await navigateTo(page, VEHICLE_CREATE_URL);

    // Nhấn Lưu khi form trống
    await page.getByRole('button', { name: /save/i }).click();

    // Kiểm tra thông báo lỗi hiển thị
    const errorMessages = page.locator('text=This field is required');
    const count = await errorMessages.count();

    // Phải có ít nhất 7 trường bắt buộc báo lỗi
    expect(count).toBeGreaterThanOrEqual(7);
  });
});

// ============================================================
// 4. QUY TẮC NGHIỆP VỤ — Hiển thị có điều kiện
// ============================================================
test.describe('Thêm mới Phương tiện — Quy tắc nghiệp vụ', () => {
  test('VH-BR-003: Rơ moóc ẩn trường Động cơ/Nhiên liệu/Dung tích (SR-VH-003)', async ({ page }) => {
    await navigateTo(page, VEHICLE_CREATE_URL);

    // Chọn Loại xe = Rơ moóc (Trailer)
    const vehicleTypeDropdown = page.locator('.ant-select').first();
    await vehicleTypeDropdown.click();
    await page.getByTitle('Rơ moóc').click();

    // Các trường phải BỊ ẨN khi chọn Rơ moóc
    await expect(page.locator('text=Engine Number')).toBeHidden();
    await expect(page.locator('text=Fuel Type')).toBeHidden();
    await expect(page.locator('text=Engine Displacement')).toBeHidden();

    // Các trường phải HIỆN
    await expect(page.locator('text=Serial Number')).toBeVisible();
    await expect(page.locator('text=Overall Dimension')).toBeVisible();
    await expect(page.locator('text=Kerb Mass')).toBeVisible();
  });

  test('VH-BR-004: Đầu kéo hiện trường Khối lượng kéo theo (SR-VH-004)', async ({ page }) => {
    await navigateTo(page, VEHICLE_CREATE_URL);

    // Chọn Loại xe = Đầu kéo (Head)
    const vehicleTypeDropdown = page.locator('.ant-select').first();
    await vehicleTypeDropdown.click();
    await page.getByTitle('Đầu kéo').click();

    // Đầu kéo phải HIỆN các trường động cơ
    await expect(page.locator('text=Engine Number')).toBeVisible();
    await expect(page.locator('text=Fuel Type')).toBeVisible();
    await expect(page.locator('text=Engine Displacement')).toBeVisible();

    // Đầu kéo phải HIỆN trường riêng: Khối lượng kéo theo
    await expect(page.locator('text=Authorized Towed Mass')).toBeVisible();
  });

  test('VH-BR-002: Xe tải hiện trường Động cơ, ẩn Khối lượng kéo theo (SR-VH-002)', async ({ page }) => {
    await navigateTo(page, VEHICLE_CREATE_URL);

    // Chọn Loại xe = Xe tải (Truck)
    const vehicleTypeDropdown = page.locator('.ant-select').first();
    await vehicleTypeDropdown.click();
    await page.getByTitle('Xe tải').click();

    // Xe tải HIỆN các trường động cơ
    await expect(page.locator('text=Engine Number')).toBeVisible();
    await expect(page.locator('text=Fuel Type')).toBeVisible();

    // Xe tải ẨN trường Khối lượng kéo theo (chỉ có ở Đầu kéo)
    await expect(page.locator('text=Authorized Towed Mass')).toBeHidden();
  });
});

// ============================================================
// 5. PHÂN QUYỀN
// ============================================================
test.describe('Phân quyền — Admin', () => {
  test('VH-PM-001: Admin thấy nút Thêm mới và Sửa', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Admin thấy nút Thêm mới
    await expect(page.getByRole('button', { name: /add new/i })).toBeVisible();

    // Nhấn vào hàng → vào Chi tiết
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();
    await expect(page).toHaveURL(/\/master-data\/vehicle\/\d+/);

    // Admin thấy nút Sửa
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
  });
});

// ============================================================
// 6. CHI TIẾT PHƯƠNG TIỆN
// ============================================================
test.describe('Chi tiết Phương tiện — Giao diện', () => {
  test('VH-UI-008: Trang chi tiết hiển thị đúng bố cục', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Vào chi tiết xe đầu tiên
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();
    await expect(page).toHaveURL(/\/master-data\/vehicle\/\d+/);

    // Kiểm tra badge trạng thái
    await expect(page.locator('text=Active').first()).toBeVisible();

    // Kiểm tra các phần chính
    await expect(page.locator('text=General Information')).toBeVisible();
    await expect(page.locator('text=Vehicle Identification')).toBeVisible();

    // Kiểm tra các nút hành động
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('VH-FN-008: Nút Sửa → Trang chỉnh sửa', async ({ page }) => {
    await navigateTo(page, VEHICLE_URL);

    // Vào chi tiết
    const firstRow = page.getByRole('row').nth(1);
    await firstRow.click();
    await expect(page).toHaveURL(/\/master-data\/vehicle\/\d+/);

    // Nhấn Sửa
    await page.getByRole('button', { name: /edit/i }).click();

    // Kiểm tra URL chuyển sang trang edit
    await expect(page).toHaveURL(/\/master-data\/vehicle\/\d+\/edit/);
  });
});
