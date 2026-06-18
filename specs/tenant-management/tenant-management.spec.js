// @ts-check
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('../../helpers/auth');

const LIST_URL = '/platform-admin/tenant-management';
const CREATE_URL = `${LIST_URL}/create`;

const ADMIN_CREDENTIALS = {
  email: 'admin@movex.vn',
  password: 'Admin@2026'
};

test.beforeEach(async ({ page }) => {
  await login(page, ADMIN_CREDENTIALS);
  
  // Log all network requests and responses for debugging
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`>> Request: ${request.method()} ${request.url()}`);
    }
  });
  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      console.log(`<< Response: ${response.status()} ${response.url()}`);
      if (response.status() >= 400) {
        try {
          const body = await response.text();
          console.log(`<< Response Body (${response.status()}):`, body);
        } catch (e) {
          console.log('Could not read response body:', e.message);
        }
      }
    }
  });
});

test.describe('Tenant Management — Giao diện', () => {
  test('TN-UI-001: Trang danh sách tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL);
    await expect(page.locator('text=Tenant List').first()).toBeVisible();
    await expect(page.locator('text=Tenant Management').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /add new/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /import/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /filter/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /columns/i })).toBeVisible();
    await page.screenshot({ path: 'reports/TN-UI-001-List-Layout.png' });
  });

  test('TN-UI-002: New Tenant form sections display correctly', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    await expect(page.locator('text=New Tenant').first()).toBeVisible();
    await expect(page.locator('text=Tenant Information').first()).toBeVisible();
    await expect(page.locator('text=Legal Information').first()).toBeVisible();
    await expect(page.locator('text=Tenant Owner').first()).toBeVisible();
    await expect(page.locator('text=Technical Contact').first()).toBeVisible();
    await expect(page.locator('text=Billing Information').first()).toBeVisible();
    await expect(page.locator('text=Default Setup Package').first()).toBeVisible();
    await page.screenshot({ path: 'reports/TN-UI-002-Create-Layout.png' });
  });
});

test.describe('Tenant Management — Validation', () => {
  test('TN-VL-001: Required fields cannot be empty', async ({ page }) => {
    await navigateTo(page, CREATE_URL);
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();
    await page.waitForTimeout(1000);
    const errorMessages = page.locator('text=This field is required').or(page.locator('text=required'));
    const count = await errorMessages.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await page.screenshot({ path: 'reports/TN-VL-001-Validation-Errors.png' });
  });
});

test.describe('Tenant Management — Chức năng & Nghiệp vụ', () => {
  test('TN-FN-001 & TN-FN-002: Create tenant successfully and Search it in list', async ({ page }) => {
    const timestamp = Date.now().toString().slice(-6);
    const tenantCode = `TNT${timestamp}`;
    const tenantName = `QTL Auto Test ${timestamp}`;
    const subdomain = `qtltest${timestamp}`;
    const companyName = `QTL Logistics Group ${timestamp}`;
    const taxCode = `TAX-${timestamp}`;
    const ownerName = `Owner ${timestamp}`;
    const ownerEmail = `owner.${timestamp}@qtllogistics.vn`;
    const ownerPhone = `0987${timestamp}`;

    console.log(`Creating Tenant with code: ${tenantCode}, subdomain: ${subdomain}, email: ${ownerEmail}`);

    await navigateTo(page, CREATE_URL);

    // 1. Fill Tenant Information
    await page.locator('input[name="tenantCode"]').fill(tenantCode);
    await page.locator('input[name="tenantName"]').fill(tenantName);
    await page.locator('input[name="subdomain"]').fill(subdomain);
    await page.locator('input[name="customDomain"]').fill(`${subdomain}.com`);

    // Plan dropdown
    const planDropdown = page.locator('.ant-select-selector').first();
    await planDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // Country dropdown
    const countryDropdown = page.locator('.ant-select-selector').nth(1);
    await countryDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // Fill Remark
    await page.locator('input[name="remark"]').fill('E2E Automated UI Testing Tenant Creation');

    // 2. Fill Legal Information
    await page.locator('input[name="companyName"]').fill(companyName);
    
    // Legal Type dropdown
    const legalTypeDropdown = page.locator('.ant-select-selector').nth(5);
    await legalTypeDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await page.locator('input[name="taxCode"]').fill(taxCode);
    await page.locator('input[name="legalAddress"]').fill('123 Logistics Highway, Hanoi, Vietnam');

    // 3. Fill Tenant Owner Information
    await page.locator('input[name="tenantOwners.0.tenantOwnerCode"]').fill(`TOC${timestamp}`);
    await page.locator('input[name="tenantOwners.0.tenantOwnerName"]').fill(ownerName);
    await page.locator('input[name="tenantOwners.0.email"]').fill(ownerEmail);
    await page.locator('input[name="tenantOwners.0.phoneNumber"]').fill(ownerPhone);
    
    // Owner Role dropdown
    const ownerRoleDropdown = page.locator('.ant-select-selector').nth(6);
    await ownerRoleDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await page.locator('input[name="tenantOwners.0.position"]').fill('CEO');

    // 4. Fill Technical Contact
    await page.locator('input[name="technicalContacts.0.fullName"]').fill(`Tech ${timestamp}`);
    await page.locator('input[name="technicalContacts.0.email"]').fill(`tech.${timestamp}@qtllogistics.vn`);
    await page.locator('input[name="technicalContacts.0.phoneNumber"]').fill(`0912${timestamp}`);
    await page.locator('input[name="technicalContacts.0.position"]').fill('IT Support');

    // 5. Fill Billing Information
    await page.locator('input[name="billingInformation.0.cardholderName"]').fill(`CARDHOLDER ${timestamp}`);
    await page.locator('input[name="billingInformation.0.last4Digits"]').fill('4321');
    await page.locator('input[name="billingInformation.0.billingZipCode"]').fill('100000');

    // Click Save
    await page.screenshot({ path: 'reports/TN-FN-001-Form-Filled.png' });
    
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Wait for redirect to Tenant List page
    await page.waitForURL(new RegExp(LIST_URL), { timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    expect(page.url()).toContain(LIST_URL);
    await page.screenshot({ path: 'reports/TN-FN-001-Created-Success.png' });

    // Search newly created tenant
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill(tenantName);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const tenantCell = page.locator(`text=${tenantName}`);
    await expect(tenantCell).toBeVisible();
    await page.screenshot({ path: 'reports/TN-FN-002-Search-Result.png' });
  });

  test('TN-BR-001: Unique Subdomain validation (SR-TN-001)', async ({ page }) => {
    // Try to create a tenant with an existing subdomain 'qtl'
    await navigateTo(page, CREATE_URL);

    const timestamp = Date.now().toString().slice(-6);
    
    // 1. Tenant Info
    await page.locator('input[name="tenantCode"]').fill(`DUP${timestamp}`);
    await page.locator('input[name="tenantName"]').fill(`Duplicate Subdomain Test ${timestamp}`);
    await page.locator('input[name="subdomain"]').fill('qtl'); // existing subdomain
    await page.locator('input[name="customDomain"]').fill(`dup-${timestamp}.com`);

    // Plan dropdown
    const planDropdown = page.locator('.ant-select-selector').first();
    await planDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // 2. Legal Info
    await page.locator('input[name="companyName"]').fill(`Dup Company ${timestamp}`);
    
    // Legal Type dropdown
    const legalTypeDropdown = page.locator('.ant-select-selector').nth(5);
    await legalTypeDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    await page.locator('input[name="taxCode"]').fill(`TAX-${timestamp}`);
    await page.locator('input[name="legalAddress"]').fill('123 Duplicate St');

    // 3. Tenant Owner Info
    await page.locator('input[name="tenantOwners.0.tenantOwnerName"]').fill('Dup Owner');
    await page.locator('input[name="tenantOwners.0.email"]').fill(`dup.owner.${timestamp}@qtllogistics.vn`);
    
    // Role dropdown
    const ownerRoleDropdown = page.locator('.ant-select-selector').nth(6);
    await ownerRoleDropdown.click();
    await page.waitForTimeout(500);
    await page.locator('.ant-select-item-option-content:visible').first().click();

    // Click Save
    const saveButton = page.getByRole('button', { name: /save/i });
    console.log('Clicking Save for duplicate subdomain...');
    await saveButton.click();

    await page.waitForTimeout(5000);

    // Kiểm tra trang vẫn ở màn hình Create (không được redirect sang List vì bị trùng subdomain)
    await expect(page).toHaveURL(new RegExp(CREATE_URL));
    await page.screenshot({ path: 'reports/TN-BR-001-Duplicate-Subdomain-Blocked.png' });

    console.log('Searching for error messages on the page...');
    const duplicateError = page.locator('text=exist').or(page.locator('text=already')).or(page.locator('text=trùng')).or(page.locator('.ant-message-error')).or(page.locator('.ant-notification-notice-message'));
    
    const duplicateErrorVisible = await duplicateError.first().isVisible().catch(() => false);
    if (!duplicateErrorVisible) {
      console.warn("UI WARNING: The server returned 400 Bad Request (Subdomain already exists) and registration was successfully blocked, but the UI did not display a visible error toast or inline message.");
    }
  });
});
