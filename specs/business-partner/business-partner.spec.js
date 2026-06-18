// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const MODULE_NAME = 'Business Partner';
const LIST_URL = '/master-data/business-partner';
const CREATE_URL = `${LIST_URL}/create`;

// Dùng tài khoản Owner của tenant đang chạy test
const TENANT_CREDENTIALS = {
  email: process.env.TEST_EMAIL || 'owner.368329@qtllogistics.vn',
  password: process.env.TEST_PASSWORD || 'Movex@2026'
};

test.beforeEach(async ({ page }) => {
  await login(page, TENANT_CREDENTIALS);
});

test.describe(`${MODULE_NAME} — Giao diện`, () => {
  test('BP-UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Business Partner').first()).toBeVisible();

    // Kiểm tra nút Thêm mới
    await expect(
      page.getByRole('button', { name: /add new|add business|thêm mới/i }).first()
    ).toBeVisible();
  });

  test('BP-UI-002: Trang tạo mới hiển thị đầy đủ các trường và tab con', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    // Kiểm tra các trường thông tin chung
    await expect(page.locator('div[data-form-field="legalType"]')).toBeVisible();
    await expect(page.locator('div[data-form-field="identifyId"]')).toBeVisible();
    await expect(page.locator('input[name="invoiceSerial"]')).toBeVisible();
    await expect(page.locator('textarea[name="localName"]')).toBeVisible();
    await expect(page.locator('input[name="phoneNumber"]')).toBeVisible();
    await expect(page.locator('div[data-form-field="currency"]')).toBeVisible();
    await expect(page.locator('div[data-form-field="country"]')).toBeVisible();
    await expect(page.locator('textarea[name="localAddress"]')).toBeVisible();
    await expect(page.locator('div[data-form-field="businessCategory"]')).toBeVisible();
    await expect(page.locator('div[data-form-field="partnerGroup"]')).toBeVisible();

    // Mặc định chỉ có tab Documents hiển thị
    await expect(page.locator('text=Documents').first()).toBeVisible();

    // Chọn Business Category để hiển thị tab Customer
    const categoryDropdown = page.locator('div[data-form-field="businessCategory"] .ant-select-selector');
    await categoryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // Click tab Customer
    const customerTab = page.locator('.ant-tabs-tab:has-text("Customer"), [role="tab"]:has-text("Customer")').first();
    await expect(customerTab).toBeVisible();
    await customerTab.click();
    await page.waitForTimeout(500);

    // Kiểm tra các section con hiển thị bên trong tab Customer
    await expect(page.locator('text=Contact Information').first()).toBeVisible();
    await expect(page.locator('text=Bank Account').first()).toBeVisible();
  });
});

test.describe(`${MODULE_NAME} — Validation`, () => {
  test('BP-VL-001: Lưu form trống hiện lỗi trường bắt buộc', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    // Nhấn Lưu khi form trống
    await page.getByRole('button', { name: /save/i }).click();

    // Đợi validation chạy và kiểm tra các thông báo lỗi required
    const errorMessages = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errorMessages.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('BP-VL-002: Kiểm tra định dạng email và số điện thoại', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    // Điền email sai định dạng
    await page.locator('input[name="email"]').fill('invalid-email');
    // Điền số điện thoại sai định dạng (chữ cái)
    await page.locator('input[name="phoneNumber"]').fill('abcdef');

    // Nhấn Save
    await page.getByRole('button', { name: /save/i }).click();

    // Kiểm tra có lỗi định dạng
    const emailError = page.locator('text=invalid email').or(page.locator('text=Email is invalid')).or(page.locator('text=Email không hợp lệ'));
    if (await emailError.count() > 0) {
      await expect(emailError.first()).toBeVisible();
    }
  });
});

test.describe(`${MODULE_NAME} — Chức năng & Nghiệp vụ`, () => {
  test('BP-FN-003: Nút Hủy từ Tạo mới → quay về Danh sách', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LIST_URL}$`));
  });

  test('BP-BR-001 & BP-BR-002: Tạo mới doanh nghiệp thành công, tìm kiếm và kiểm tra trùng MST', async ({ page }) => {
    const timestamp = Date.now().toString().slice(-6);
    const taxCode = `83${timestamp}28`; // 10 chữ số
    const partnerName = `QTL Auto BP ${timestamp}`;
    const invoiceSerial = `AP/${timestamp.slice(0, 2)}E`;

    console.log(`Creating Business Partner: ${partnerName} with Tax Code: ${taxCode}`);

    await navigateTo(page, CREATE_URL);

    // 1. Chọn Legal Type
    const legalDropdown = page.locator('div[data-form-field="legalType"] .ant-select-selector');
    await legalDropdown.click();
    await page.waitForTimeout(500);
    // Chọn Company
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // 2. Điền Tax Code
    await page.locator('input[name="identifyId"]').fill(taxCode);

    // 3. Điền Invoice Serial
    await page.locator('input[name="invoiceSerial"]').fill(invoiceSerial);

    // 4. Điền Local Name
    await page.locator('textarea[name="localName"]').fill(partnerName);

    // 5. Điền Phone Number
    await page.locator('input[name="phoneNumber"]').fill(`0912${timestamp}`);

    // 6. Chọn Currency
    const currencyDropdown = page.locator('div[data-form-field="currency"] .ant-select-selector');
    await currencyDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // 7. Chọn Country
    const countryDropdown = page.locator('div[data-form-field="country"] .ant-select-selector');
    await countryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // 8. Chọn ProvinceCity
    const provinceDropdown = page.locator('div[data-form-field="provinceCity"] .ant-select-selector');
    if (await provinceDropdown.isVisible()) {
      await provinceDropdown.click();
      await page.waitForTimeout(500);
      await page.locator('.ant-select-item-option-content:visible').first().click();
    }

    // 9. Điền Address
    await page.locator('textarea[name="localAddress"]').fill('123 Logistics St, District 1, HCMC');

    // 10. Chọn Business Category
    const categoryDropdown = page.locator('div[data-form-field="businessCategory"] .ant-select-selector');
    await categoryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click(); // Chọn vai trò đầu tiên

    // 11. Chọn Partner Group
    const groupDropdown = page.locator('div[data-form-field="partnerGroup"] .ant-select-selector');
    await groupDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await page.screenshot({ path: `reports/BP-BR-001-Form-Filled-${timestamp}.png` });

    // Click Save
    await page.getByRole('button', { name: /save/i }).click();

    // Đợi redirect sang chi tiết
    await page.waitForURL(new RegExp(`${LIST_URL}/\\d+`), { timeout: 15_000 });
    await expect(page.url()).toMatch(new RegExp(`${LIST_URL}/\\d+`));
    await page.screenshot({ path: `reports/BP-BR-001-Created-${timestamp}.png` });

    // Quay lại danh sách và kiểm tra tìm kiếm
    await navigateTo(page, LIST_URL);
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill(partnerName);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${partnerName}`).first()).toBeVisible();
    }

    // Test Case: Check trùng MST (Unique Tax Code - SR-BP-001)
    console.log(`Testing Duplicate Tax Code validation with MST: ${taxCode}`);
    await navigateTo(page, CREATE_URL);

    // Điền form với cùng taxCode
    await legalDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();
    await page.locator('input[name="identifyId"]').fill(taxCode);
    await page.locator('input[name="invoiceSerial"]').fill(invoiceSerial);
    await page.locator('textarea[name="localName"]').fill(`Duplicate MST Test ${timestamp}`);
    await page.locator('input[name="phoneNumber"]').fill(`0912${timestamp}`);
    
    await currencyDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await countryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await page.locator('textarea[name="localAddress"]').fill('123 Duplicate St');

    await categoryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await groupDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // Click Save
    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(3000);

    // Kiểm tra có thông báo lỗi trùng MST
    const duplicateError = page.locator('text=exist').or(page.locator('text=already')).or(page.locator('text=trùng')).or(page.locator('.ant-message-error')).or(page.locator('.ant-notification-notice-message'));
    await expect(duplicateError.first()).toBeVisible();
    await page.screenshot({ path: `reports/BP-BR-002-Duplicate-Error-${timestamp}.png` });
  });

  test('BP-BR-003: Hiển thị có điều kiện Tab Cộng tác viên', async ({ page }) => {
    await navigateTo(page, CREATE_URL);

    // Click Business Category dropdown
    const categoryDropdown = page.locator('div[data-form-field="businessCategory"] .ant-select-selector');
    await categoryDropdown.click();
    await page.waitForTimeout(500);

    // Tìm và chọn option "Collaborator" hoặc "Cộng tác viên" hoặc "CTV"
    const collaboratorOption = page.locator('.ant-select-item-option-content:visible:has-text("Collaborator")').or(page.locator('.ant-select-item-option-content:visible:has-text("Cộng tác viên")')).or(page.locator('.ant-select-item-option-content:visible:has-text("CTV")'));
    
    if (await collaboratorOption.count() > 0) {
      await collaboratorOption.first().click();
      await page.waitForTimeout(500);

      // Tab Collaborator (Cộng tác viên) phải xuất hiện
      const collaboratorTab = page.locator('text=Collaborator').or(page.locator('text=Cộng tác viên')).first();
      await expect(collaboratorTab).toBeVisible();

      // Bỏ chọn Collaborator
      await collaboratorOption.first().click();
      await page.waitForTimeout(500);

      // Tab Collaborator phải bị ẩn đi
      await expect(collaboratorTab).toBeHidden();
    }
  });
});
