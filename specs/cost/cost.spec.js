// @ts-check
/**
 * ===================================================================
 * Cost — Playwright E2E Test
 * ===================================================================
 *
 * Tham chiếu chéo (Cross-Reference):
 *  - Đặc tả màn hình: 10-Screen-Specification / Tenant-Admin / Master-data / Cost
 *  - FE Routes: /master-data/cost/* (Routes.ts → ROUTES.masterData.cost)
 *  - Quy tắc hệ thống: BR-COST-001 → BR-COST-018 (Cost Group, Cost Item)
 *  - API: GET/POST /api/cost-groups, /api/cost-items
 *  - Phân quyền: Owner (Full CRUD) / Admin (CRUD) / Viewer (Read Only)
 *
 * Danh mục test case:
 *  - CS-UI-xxx: Layout & List Views
 *  - CS-VL-xxx: Validation & Boundaries
 *  - CS-FN-xxx: Functional (CRUD)
 *  - CS-IF-xxx: Integration Flow
 * ===================================================================
 */
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Cost';
const GROUP_LIST_URL = '/master-data/cost/group';
const GROUP_CREATE_URL = `${GROUP_LIST_URL}/create`;
const COST_LIST_URL = '/master-data/cost/cost';
const COST_CREATE_URL = `${COST_LIST_URL}/create`;

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} Group — Giao diện & Chức năng`, () => {
  test('CS-UI-001: Trang danh sách Cost Group tải đúng', async ({ page }) => {
    await navigateTo(page, GROUP_LIST_URL);
    await expect(page.locator('text=Cost Group').or(page.locator('text=Nhóm chi phí')).first()).toBeVisible();
    
    // Nút Add Cost Group
    const addBtn = page.getByRole('button', { name: /add cost group/i })
      .or(page.locator('button:has-text("Add Cost Group")'))
      .or(page.locator('button:has-text("Thêm nhóm chi phí")'))
      .first();
    await expect(addBtn).toBeVisible();
  });

  test('CS-UI-002: Trang tạo mới Cost Group hiển thị đúng', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    await expect(page.locator('text=Create Cost Group').or(page.locator('text=Tạo nhóm chi phí')).first()).toBeVisible();
  });

  test('CS-VL-001: Validation lỗi bắt buộc khi lưu Cost Group trống', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required')).or(page.locator('text=Trường này là bắt buộc'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('CS-FN-001: Nút Hủy từ màn hình tạo mới Cost Group quay lại danh sách', async ({ page }) => {
    await navigateTo(page, GROUP_CREATE_URL);
    
    const cancelBtn = page.getByRole('button', { name: /cancel/i }).or(page.locator('button:has-text("Cancel")')).or(page.locator('button:has-text("Hủy")')).first();
    await cancelBtn.click();
    
    await page.waitForURL(url => url.pathname === GROUP_LIST_URL);
    expect(page.url()).toContain(GROUP_LIST_URL);
  });

  // --- BA Spec Gap Analysis: New tests from SR-CG-002, SCG001→SCG002, SCG003 AC ---

  test('CS-FN-005: BA Spec SR-CG-002 — Tạo Cost Group trùng mã → 409 Conflict', async ({ page }) => {
    const timestamp = Date.now().toString().slice(-6);
    const dupCode = `DUP${timestamp}`;
    const dupName = `DupGroup ${timestamp}`;

    // Step 1: Tạo bản gốc
    await navigateTo(page, GROUP_CREATE_URL);
    const codeInput = page.locator('input[placeholder*="Group Code" i]').or(page.locator('input[placeholder*="Mã nhóm" i]')).first();
    await codeInput.fill(dupCode);
    const nameInput = page.locator('input[placeholder*="Group Name" i]').or(page.locator('input[placeholder*="Tên nhóm" i]')).first();
    await nameInput.fill(dupName);
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    await page.waitForURL(url => url.pathname === GROUP_LIST_URL, { timeout: 15000 });

    // Step 2: Tạo bản trùng mã
    await navigateTo(page, GROUP_CREATE_URL);
    const codeInput2 = page.locator('input[placeholder*="Group Code" i]').or(page.locator('input[placeholder*="Mã nhóm" i]')).first();
    await codeInput2.fill(dupCode);
    const nameInput2 = page.locator('input[placeholder*="Group Name" i]').or(page.locator('input[placeholder*="Tên nhóm" i]')).first();
    await nameInput2.fill(`Duplicate ${dupName}`);
    const saveBtn2 = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn2.click();

    // Kiểm tra: phải hiển thị lỗi trùng mã (409 Conflict hoặc toast)
    await page.waitForTimeout(2000);
    const dupError = page.locator('text=already exists').or(page.locator('text=duplicate')).or(page.locator('text=trùng')).or(page.locator('text=đã tồn tại')).or(page.locator('.ant-message-error'));
    const errorCount = await dupError.count();
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });

  test('CS-FN-006: BA Spec SCG001→SCG002 — Double-click dòng trong List mở Detail', async ({ page }) => {
    await navigateTo(page, GROUP_LIST_URL);
    await page.waitForTimeout(2000);

    // Double-click dòng đầu tiên trong Table Grid
    const firstRow = page.locator('.ant-table-row').first();
    if (await firstRow.isVisible()) {
      await firstRow.dblclick();
      await page.waitForTimeout(2000);
      // Kiểm tra chuyển sang trang Detail (URL chứa /group/ + ID)
      expect(page.url()).toMatch(/\/master-data\/cost\/group\/\d+/);
    }
  });
});

test.describe(`${MODULE_NAME} Item — Giao diện & Chức năng`, () => {
  test('CS-UI-003: Trang danh sách Cost Item tải đúng', async ({ page }) => {
    await navigateTo(page, COST_LIST_URL);
    await expect(page.locator('text=Cost').or(page.locator('text=Chi phí')).first()).toBeVisible();
    
    // Nút Add Cost
    const addBtn = page.getByRole('button', { name: /add cost/i })
      .or(page.locator('button:has-text("Add Cost")'))
      .or(page.locator('button:has-text("Thêm chi phí")'))
      .first();
    await expect(addBtn).toBeVisible();
  });

  test('CS-UI-004: Trang tạo mới Cost Item hiển thị đúng', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    await expect(page.locator('text=Create Cost').or(page.locator('text=Tạo chi phí')).first()).toBeVisible();
  });

  test('CS-VL-002: Validation lỗi bắt buộc khi lưu Cost Item trống', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    const errors = page.locator('text=This field is required').or(page.locator('text=required')).or(page.locator('text=Trường này là bắt buộc'));
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('CS-VL-003: Boundary Value — Kiểm tra độ dài mã chi phí bị giới hạn ở 20 ký tự (maxLength)', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    // Nhập Cost Code dài 21 ký tự
    const longCode = 'C'.repeat(21);
    const codeInput = page.locator('input[placeholder*="Cost Code"]').or(page.locator('input[placeholder*="Mã chi phí"]')).first();
    
    // Fill 21 ký tự
    await codeInput.fill(longCode);
    
    // Kiểm tra giá trị thực tế của input bị giới hạn bởi thuộc tính maxLength (còn 20 ký tự)
    const inputValue = await codeInput.inputValue();
    expect(inputValue.length).toBe(20);
    expect(inputValue).toBe('C'.repeat(20));
  });

  test('CS-VL-004: Format Validation — Kiểm tra ký tự đặc biệt trong Cost Code', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    // Nhập mã chi phí chứa ký tự đặc biệt
    const invalidCode = 'COST#123';
    const codeInput = page.locator('input[placeholder*="Cost Code"]').or(page.locator('input[placeholder*="Mã chi phí"]')).first();
    await codeInput.fill(invalidCode);
    
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    const formatError = page.locator('text=Only A-Z').or(page.locator('text=allow')).or(page.locator('text=không hợp lệ')).or(page.locator('text=chỉ chứa ký tự'));
    await expect(formatError.first()).toBeVisible();
  });

  test('CS-IF-001: Logic rẽ nhánh (If/Else) — Thay đổi UOM theo nhóm Category UOM', async ({ page }) => {
    await navigateTo(page, COST_CREATE_URL);
    
    // 1. Chọn Category UOM
    const catSelect = page.locator('.ant-select').filter({ hasText: /Select Category UoM|Chọn nhóm đơn vị tính/i }).first();
    await catSelect.click();
    await page.waitForTimeout(1000);
    
    // Chọn option đầu tiên (ví dụ: Distance, Weight, v.v.)
    await page.locator('.ant-select-item-option-content:visible').first().click();
    await page.waitForTimeout(1000);
    
    // 2. Click Unit of Measure dropdown để xem danh sách UoM đã được lọc tương ứng
    const uomSelect = page.locator('.ant-select').filter({ hasText: /Select UoM|Chọn đơn vị tính/i }).first();
    await uomSelect.click();
    await page.waitForTimeout(1000);
    
    // Option hiển thị phải thuộc nhóm UOM đã lọc
    const uomOptions = page.locator('.ant-select-item-option-content:visible');
    const uomCount = await uomOptions.count();
    expect(uomCount).toBeGreaterThanOrEqual(1);
  });

  test('CS-FN-002: Business Flow — Tạo mới Cost Item thành công', async ({ page }) => {
    const timestamp = Date.now().toString().slice(-6);
    const groupCode = `GP${timestamp}`;
    const groupName = `Group ${timestamp}`;
    const costCode = `CST${timestamp}`;
    const costName = `Auto Test Cost ${timestamp}`;
    
    // Step 1: Tạo Cost Group
    console.log(`Creating Cost Group: ${groupCode}`);
    await navigateTo(page, GROUP_CREATE_URL);
    const groupCodeInput = page.locator('input[placeholder*="Group Code" i]').or(page.locator('input[placeholder*="Mã nhóm" i]')).first();
    await groupCodeInput.fill(groupCode);
    const groupNameInput = page.locator('input[placeholder*="Group Name" i]').or(page.locator('input[placeholder*="Tên nhóm" i]')).first();
    await groupNameInput.fill(groupName);
    const groupSaveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await groupSaveBtn.click();
    await page.waitForURL(url => url.pathname === GROUP_LIST_URL, { timeout: 15000 });
    console.log(`✅ Cost Group ${groupCode} created successfully.`);

    // Step 2: Tạo Cost Item
    console.log(`Creating Cost Item: ${costCode}`);
    await navigateTo(page, COST_CREATE_URL);
    
    // 1. Chọn Cost Group Name (Code tự động hiển thị)
    const groupSelect = page.locator('.ant-select').filter({ hasText: /Select Cost Group Name|Chọn tên nhóm chi phí|Cost Group Name/i }).first();
    await groupSelect.click();
    await page.waitForTimeout(1000);
    
    // Chọn option tương ứng với groupName
    const matchedOption = page.locator('.ant-select-item-option-content:visible').filter({ hasText: groupName }).first();
    if (await matchedOption.isVisible()) {
      await matchedOption.click();
    } else {
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    await page.waitForTimeout(500);
    
    // 2. Điền Cost Code
    const codeInput = page.locator('input[placeholder="Enter Cost Code"]').or(page.locator('input[placeholder="Nhập mã chi phí"]')).first();
    await codeInput.fill(costCode);
    
    // 3. Điền Cost Name
    const nameInput = page.locator('input[placeholder="Enter Cost Name"]').or(page.locator('input[placeholder="Nhập tên chi phí"]')).first();
    await nameInput.fill(costName);
    
    // 4. Chọn Currency mặc định
    const currencySelect = page.locator('.ant-select').filter({ hasText: /Select currency|Chọn tiền tệ/i }).first();
    if (await currencySelect.isVisible()) {
      await currencySelect.click();
      await page.waitForTimeout(1000);
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    
    // 5. Lưu
    const saveBtn = page.getByRole('button', { name: /save/i }).or(page.locator('button:has-text("Save")')).or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    // Đợi redirect về trang danh sách
    await page.waitForURL(url => url.pathname === COST_LIST_URL, { timeout: 15000 });
    expect(page.url()).toContain(COST_LIST_URL);
    
    // Tìm kiếm cost vừa tạo trong bảng danh sách
    const searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[placeholder*="Tìm kiếm"]')).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(costName);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${costName}`).first()).toBeVisible();
    }
  });
});
