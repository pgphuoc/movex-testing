// @ts-check
const { test, expect } = require('../../helpers/auth');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Services';
const SERVICE_LIST_URL = '/master-data/services/service';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe(`${MODULE_NAME} — Giao diện & Chức năng`, () => {
  test('SV-UI-001: Trang danh sách Service tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    await expect(page.locator('text=Service List').or(page.locator('text=Danh sách dịch vụ')).first()).toBeVisible();
    
    // Nút Add Service
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await expect(addBtn).toBeVisible();
  });

  test('SV-VL-001: Validation lỗi bắt buộc khi lưu Service trống', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await addBtn.click();
    
    // Đợi modal hiển thị
    const modalTitle = page.locator('.ant-modal-title').first();
    await expect(modalTitle).toBeVisible();
    
    // Nhấp Lưu khi chưa điền gì
    const saveBtn = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    // Kiểm tra thông báo lỗi validation
    const errorMessages = page.locator('text=This field is required').or(page.locator('text=required')).or(page.locator('text=Trường này là bắt buộc'));
    const count = await errorMessages.count();
    expect(count).toBeGreaterThanOrEqual(1);
    
    // Hủy bỏ và đóng modal
    const cancelBtn = page.locator('button:has-text("Cancel")').or(page.locator('button:has-text("Hủy")')).first();
    await cancelBtn.click();
  });

  test('SV-VL-002: Boundary Value — Kiểm tra độ dài mã dịch vụ (Max 20 ký tự)', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await addBtn.click();
    
    // Điền mã dịch vụ có 21 ký tự (vượt quá giới hạn 20)
    const longCode = 'A'.repeat(21);
    const codeInput = page.locator('input[placeholder="Enter Service Code"]').or(page.locator('input[placeholder="Nhập mã dịch vụ"]')).first();
    await codeInput.fill(longCode);
    
    // Nhấp Lưu
    const saveBtn = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    // Kiểm tra thông báo lỗi maxLength
    const boundaryError = page.locator('text=max 20 characters').or(page.locator('text=tối đa 20 ký tự')).or(page.locator('text=maxLength'));
    await expect(boundaryError.first()).toBeVisible();
    
    // Hủy bỏ
    const cancelBtn = page.locator('button:has-text("Cancel")').or(page.locator('button:has-text("Hủy")')).first();
    await cancelBtn.click();
  });

  test('SV-VL-003: Format Validation — Kiểm tra ký tự đặc biệt trong Service Code', async ({ page }) => {
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await addBtn.click();
    
    // Điền mã dịch vụ chứa ký tự đặc biệt
    const invalidCode = 'SVC#123';
    const codeInput = page.locator('input[placeholder="Enter Service Code"]').or(page.locator('input[placeholder="Nhập mã dịch vụ"]')).first();
    await codeInput.fill(invalidCode);
    
    // Nhấp Lưu
    const saveBtn = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    // Kiểm tra thông báo lỗi định dạng alphanumeric
    const formatError = page.locator('text=uppercase alphanumeric').or(page.locator('text=chỉ chứa ký tự chữ và số viết hoa'));
    await expect(formatError.first()).toBeVisible();
    
    // Hủy bỏ
    const cancelBtn = page.locator('button:has-text("Cancel")').or(page.locator('button:has-text("Hủy")')).first();
    await cancelBtn.click();
  });

  test('SV-IF-001: Logic rẽ nhánh (If/Else) — Dropdown dịch vụ cha bị khóa khi chưa chọn nhóm dịch vụ', async ({ page }) => {
    test.setTimeout(60_000);
    const timestamp = Date.now().toString().slice(-6);
    const groupCode = `SGP${timestamp}`;
    const groupName = `SGroup ${timestamp}`;

    // Step 1: Tạo Service Group
    console.log(`Creating Service Group: ${groupCode}`);
    await navigateTo(page, '/master-data/services/group');
    const addGroupBtn = page.getByRole('button', { name: /add service group/i })
      .or(page.locator('button:has-text("Add Service Group")'))
      .or(page.locator('button:has-text("Add Group")'))
      .or(page.locator('button:has-text("Thêm nhóm dịch vụ")'))
      .or(page.locator('button:has-text("Thêm mới")'))
      .first();
    await addGroupBtn.click();
    await page.waitForTimeout(1000);
    const groupCodeInput = page.locator('input[placeholder*="Group Code" i]').or(page.locator('input[placeholder*="Mã nhóm" i]')).first();
    await groupCodeInput.fill(groupCode);
    const groupNameInput = page.locator('input[placeholder*="Group Name" i]').or(page.locator('input[placeholder*="Tên nhóm" i]')).first();
    await groupNameInput.fill(groupName);

    // Fill Service Form (Select) and Form Title
    const formSelect = page.locator('.ant-select').filter({ hasText: /Service Form|Biểu mẫu dịch vụ|Select Service Form/i }).first();
    await formSelect.click();
    await page.waitForTimeout(1000);
    const defaultFormOption = page.locator('.ant-select-item-option-content:visible').filter({ hasText: /Default Service Form|Biểu mẫu dịch vụ mặc định/i }).first();
    if (await defaultFormOption.isVisible()) {
      await defaultFormOption.click();
    } else {
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    await page.waitForTimeout(500);

    const formTitleInput = page.locator('input[placeholder*="Form Title" i]').or(page.locator('input[placeholder*="Tiêu đề biểu mẫu" i]')).first();
    await formTitleInput.fill('Default Form Title');

    const groupSaveBtn = page.locator('.ant-modal button:has-text("Save")').or(page.locator('.ant-modal button:has-text("Lưu")')).first();
    await groupSaveBtn.click();
    await page.waitForTimeout(2000);

    // Step 2: Kiểm tra logic Service
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await addBtn.click();
    
    // 1. Kiểm tra dropdown dịch vụ cha phải bị disabled ban đầu
    const parentCodeSelect = page.locator('.ant-select').filter({ hasText: /Enter Parent Service Code|Nhập mã dịch vụ cha/i }).first();
    await expect(parentCodeSelect).toHaveClass(/ant-select-disabled/);
    
    // 2. Chọn Nhóm dịch vụ (Service Group Name)
    const groupNameSelect = page.locator('.ant-select').filter({ hasText: /Enter Service Group Name|Nhập tên nhóm dịch vụ/i }).first();
    await groupNameSelect.click();
    await page.waitForTimeout(1000);
    
    const matchedOption = page.locator('.ant-select-item-option-content:visible').filter({ hasText: groupName }).first();
    if (await matchedOption.isVisible()) {
      await matchedOption.click();
    } else {
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    await page.waitForTimeout(500);
    
    // 3. Sau khi chọn nhóm, dropdown dịch vụ cha phải được kích hoạt (enabled)
    await expect(parentCodeSelect).not.toHaveClass(/ant-select-disabled/);
    
    // Hủy bỏ
    const cancelBtn = page.locator('button:has-text("Cancel")').or(page.locator('button:has-text("Hủy")')).first();
    await cancelBtn.click();
  });

  test('SV-FN-002: Business Flow — Tạo mới Service thành công', async ({ page }) => {
    test.setTimeout(60_000);
    const timestamp = Date.now().toString().slice(-6);
    const groupCode = `SGP${timestamp}`;
    const groupName = `SGroup ${timestamp}`;
    const serviceCode = `SVC${timestamp}`;
    const serviceName = `Auto Test Service ${timestamp}`;
    
    // Step 1: Tạo Service Group
    console.log(`Creating Service Group: ${groupCode}`);
    await navigateTo(page, '/master-data/services/group');
    const addGroupBtn = page.getByRole('button', { name: /add service group/i })
      .or(page.locator('button:has-text("Add Service Group")'))
      .or(page.locator('button:has-text("Add Group")'))
      .or(page.locator('button:has-text("Thêm nhóm dịch vụ")'))
      .or(page.locator('button:has-text("Thêm mới")'))
      .first();
    await addGroupBtn.click();
    await page.waitForTimeout(1000);
    const groupCodeInput = page.locator('input[placeholder*="Group Code" i]').or(page.locator('input[placeholder*="Mã nhóm" i]')).first();
    await groupCodeInput.fill(groupCode);
    const groupNameInput = page.locator('input[placeholder*="Group Name" i]').or(page.locator('input[placeholder*="Tên nhóm" i]')).first();
    await groupNameInput.fill(groupName);

    // Fill Service Form (Select) and Form Title
    const formSelect = page.locator('.ant-select').filter({ hasText: /Service Form|Biểu mẫu dịch vụ|Select Service Form/i }).first();
    await formSelect.click();
    await page.waitForTimeout(1000);
    const defaultFormOption = page.locator('.ant-select-item-option-content:visible').filter({ hasText: /Default Service Form|Biểu mẫu dịch vụ mặc định/i }).first();
    if (await defaultFormOption.isVisible()) {
      await defaultFormOption.click();
    } else {
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    await page.waitForTimeout(500);

    const formTitleInput = page.locator('input[placeholder*="Form Title" i]').or(page.locator('input[placeholder*="Tiêu đề biểu mẫu" i]')).first();
    await formTitleInput.fill('Default Form Title');

    const groupSaveBtn = page.locator('.ant-modal button:has-text("Save")').or(page.locator('.ant-modal button:has-text("Lưu")')).first();
    await groupSaveBtn.click();
    await page.waitForTimeout(2000);

    // Step 2: Tạo Service
    await navigateTo(page, SERVICE_LIST_URL);
    
    const addBtn = page.getByRole('button', { name: /add service/i })
      .or(page.locator('button:has-text("Add Service")'))
      .or(page.locator('button:has-text("Thêm dịch vụ")'))
      .first();
    await addBtn.click();
    
    // 1. Chọn Nhóm dịch vụ (Service Group Name)
    const groupNameSelect = page.locator('.ant-select').filter({ hasText: /Enter Service Group Name|Nhập tên nhóm dịch vụ/i }).first();
    await groupNameSelect.click();
    await page.waitForTimeout(1000);
    
    const matchedOption = page.locator('.ant-select-item-option-content:visible').filter({ hasText: groupName }).first();
    if (await matchedOption.isVisible()) {
      await matchedOption.click();
    } else {
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }
    await page.waitForTimeout(500);
    
    // 2. Chọn Tên nhóm dịch vụ (Service Group Name) - Tự động đồng bộ nên ta có thể bỏ qua hoặc chọn lại
    
    // 3. Điền Service Code (Chữ hoa)
    const codeInput = page.locator('input[placeholder="Enter Service Code"]').or(page.locator('input[placeholder="Nhập mã dịch vụ"]')).first();
    await codeInput.fill(serviceCode);
    
    // 4. Điền Service Name
    const nameInput = page.locator('input[placeholder="Enter Service Name"]').or(page.locator('input[placeholder="Nhập tên dịch vụ"]')).first();
    await nameInput.fill(serviceName);
    
    // 5. Điền Ghi chú
    const remarkInput = page.locator('textarea[placeholder="Enter a Remark..."]').or(page.locator('textarea[placeholder="Nhập ghi chú"]')).first();
    await remarkInput.fill('E2E Automatic Test Service creation');
    
    // Nhấp Lưu
    const saveBtn = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Lưu")')).first();
    await saveBtn.click();
    
    // Chờ modal đóng và reload danh sách
    const modalTitle = page.locator('.ant-modal-title').first();
    await expect(modalTitle).not.toBeVisible({ timeout: 10000 });
    
    // Tìm kiếm service vừa tạo trong bảng danh sách
    const searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[placeholder*="Tìm kiếm"]')).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(serviceName);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${serviceName}`).first()).toBeVisible();
    }
  });
});
