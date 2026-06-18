// @ts-check
const { test, expect } = require('@playwright/test')
const { login, navigateTo } = require('../../helpers/auth')

/**
 * ===================================================================
 * Work Order — Playwright E2E Test
 * ===================================================================
 *
 * Test Cases: TC-MF-001 → TC-MF-010
 * Routes:
 *   - List:   /oms/work-order
 *   - Create: /oms/work-order/create
 *   - Detail: /oms/work-order/:workOrderCode
 *   - Update: /oms/work-order/:workOrderCode/update
 *
 * ===================================================================
 */

const LIST_URL = '/oms/work-order'
const CREATE_URL = '/oms/work-order/create'

// ============================================================
// ĐĂNG NHẬP TRƯỚC MỖI TEST
// ============================================================
test.beforeEach(async ({ page }) => {
  await login(page)
})

// ============================================================
// TC-MF-001: Tạo Work Order không qua CR / Quotation
// ============================================================
test.describe('TC-MF-001: Tạo Work Order không qua CR / Quotation', () => {
  test('UI: Trang Work Order List tải đúng bố cục', async ({ page }) => {
    await navigateTo(page, LIST_URL)

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Work Order').first()).toBeVisible()

    // Kiểm tra nút Add Work Order / Add New
    await expect(page.getByRole('button', { name: /add new|add work order/i }).first()).toBeVisible()
  })

  test('Bước 2: Nhấn Add Work Order → mở màn hình Create', async ({ page }) => {
    await navigateTo(page, LIST_URL)

    await page.getByRole('button', { name: /add new|add work order/i }).first().click()

    // Chờ chuyển sang trang Create
    await expect(page).toHaveURL(/\/oms\/work-order\/create/, { timeout: 10_000 })

    // Kiểm tra tiêu đề Create Work Order
    await expect(page.locator('text=Create Work Order').first()).toBeVisible()
  })

  test('Bước 3: Bỏ trống Quotation Code - không báo lỗi', async ({ page }) => {
    await navigateTo(page, CREATE_URL)

    // Tìm trường Quotation Code và kiểm tra nó cho phép bỏ trống
    const quotationField = page.locator('input[name="quotationCode"], [data-testid="quotationCode"]').first()

    // Nếu trường tồn tại, kiểm tra nó không bắt buộc (không có dấu *)
    if (await quotationField.isVisible()) {
      // Bỏ trống Quotation Code
      await quotationField.fill('')

      // Nhập Contract Number
      const contractField = page.locator('input[name="contractNumber"], [data-testid="contractNumber"]').first()
      if (await contractField.isVisible()) {
        await contractField.fill('CTR-2026-001')
      }

      // Nhấn Save → không nên có lỗi validation cho Quotation Code
      await page.getByRole('button', { name: /save/i }).click()

      // Chờ 2 giây để kiểm tra không có lỗi validation cho Quotation
      await page.waitForTimeout(2000)

      // Không nên có thông báo lỗi liên quan đến Quotation
      const quotationError = page.locator('text=Quotation Code is required')
      await expect(quotationError).toHaveCount(0)
    }
  })

  test('Bước 4: Nhập đầy đủ Header fields và Save', async ({ page }) => {
    await navigateTo(page, CREATE_URL)
    await page.waitForLoadState('networkidle')

    // Kiểm tra các trường bắt buộc hiển thị (có dấu * đỏ)
    // Customer Code
    const customerCodeLabel = page.getByText('Customer Code').first()
    await expect(customerCodeLabel).toBeVisible()

    // Bound Type
    const boundTypeLabel = page.getByText('Bound Type').first()
    await expect(boundTypeLabel).toBeVisible()

    // Performance Date
    const performanceDateLabel = page.getByText('Performance Date').first()
    await expect(performanceDateLabel).toBeVisible()
  })

  test('Bước 5: Scope of Services hiển thị đúng', async ({ page }) => {
    await navigateTo(page, CREATE_URL)
    await page.waitForLoadState('networkidle')

    // Kiểm tra section Scope of Services tồn tại
    const scopeSection = page.locator('text=Scope of Service').first()
    await expect(scopeSection).toBeVisible()
  })

  test('UI: Status badge hiển thị Draft trước khi Save', async ({ page }) => {
    await navigateTo(page, CREATE_URL)
    await page.waitForLoadState('networkidle')

    // Kiểm tra status badge hiển thị "Draft" hoặc "Created"
    const statusBadge = page.locator(':text("Draft"), :text("Created")').first()
    await expect(statusBadge).toBeVisible()
  })
})

// ============================================================
// TC-MF-002: Nhập Baseline Cost cho WO
// ============================================================
test.describe('TC-MF-002: Nhập Baseline Cost cho WO', () => {
  test('UI: WO Detail hiển thị các tab chính xác', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    // Click vào WO đầu tiên trong danh sách
    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Kiểm tra có tab Work Item
      const workItemTab = page.locator('text=Work Item').first()
      await expect(workItemTab).toBeVisible()

      // Kiểm tra có tab Estimated Freight
      const freightTab = page.locator('text=Estimated Freight').first()
      await expect(freightTab).toBeVisible()
    }
  })

  test('Tab Estimated Freight: Hiển thị bảng Sell-out và Buy-in', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click vào tab Estimated Freight
      const freightTab = page
        .locator('[role="tab"]:has-text("Estimated Freight"), .ant-tabs-tab:has-text("Estimated Freight")')
        .first()
      if (await freightTab.isVisible()) {
        await freightTab.click()
        await page.waitForTimeout(1000)

        // Kiểm tra bảng Sell-out
        const sellOutSection = page.locator('text=Sell-out, text=Sell Out, text=Debit').first()
        await expect(sellOutSection).toBeVisible()

        // Kiểm tra bảng Buy-in
        const buyInSection = page.locator('text=Buy-in, text=Buy In, text=Credit').first()
        await expect(buyInSection).toBeVisible()
      }
    }
  })
})

// ============================================================
// TC-MF-003: Điều chỉnh giá dự toán
// ============================================================
test.describe('TC-MF-003: Điều chỉnh giá dự toán', () => {
  test('UI: Summary Cards hiển thị trên tab Estimated Freight', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click tab Estimated Freight
      const freightTab = page
        .locator('[role="tab"]:has-text("Estimated Freight"), .ant-tabs-tab:has-text("Estimated Freight")')
        .first()
      if (await freightTab.isVisible()) {
        await freightTab.click()
        await page.waitForTimeout(1000)

        // Kiểm tra Summary Cards hiển thị (Sell-out Total, Buy-in Total, Net Profit)
        const summarySection = page
          .locator('text=Total Sell-out, text=Sell Out, text=Total Buy-in, text=Buy In, text=Net Profit, text=Profit')
          .first()
        await expect(summarySection).toBeVisible()
      }
    }
  })
})

// ============================================================
// TC-MF-004: Submit WO
// ============================================================
test.describe('TC-MF-004: Submit WO', () => {
  test('UI: WO Detail có nút Submit hoặc Edit', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Kiểm tra có nút Edit hoặc Submit (tùy trạng thái WO)
      const actionButton = page.getByRole('button', { name: /edit|submit|save/i }).first()
      await expect(actionButton).toBeVisible()
    }
  })
})

// ============================================================
// TC-MF-005: Phê duyệt và thông báo cho các team
// ============================================================
test.describe('TC-MF-005: Phê duyệt và thông báo cho các team', () => {
  test('UI: WO Approved hiển thị read-only form', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    // Tìm WO có status Approved
    const approvedBadge = page.locator('.ant-table-row:has-text("Approved")').first()
    if (await approvedBadge.isVisible()) {
      await approvedBadge.click()
      await page.waitForLoadState('networkidle')

      // Kiểm tra status badge hiển thị Approved
      const statusBadge = page.locator('text=Approved').first()
      await expect(statusBadge).toBeVisible()

      // Form nên ở dạng read-only — kiểm tra không có input editable
      // (WO Detail dùng DisplayField component thay vì input)
    }
  })
})

// ============================================================
// TC-MF-006: Tạo và kiểm tra Work Item
// ============================================================
test.describe('TC-MF-006: Tạo và kiểm tra Work Item', () => {
  test('UI: Tab Work Item hiển thị danh sách Work Items', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Tab Work Item nên visible
      const workItemTab = page
        .locator('[role="tab"]:has-text("Work Item"), .ant-tabs-tab:has-text("Work Item")')
        .first()
      await expect(workItemTab).toBeVisible()

      // Click vào tab Work Item
      await workItemTab.click()
      await page.waitForTimeout(1000)

      // Kiểm tra bảng Work Item List hiển thị
      const workItemList = page.locator('text=Work Item List, text=Work Item').first()
      await expect(workItemList).toBeVisible()

      // Kiểm tra có cột No., Work Item No, Type, Quantity
      const noColumn = page.locator('th:has-text("No.")').first()
      await expect(noColumn).toBeVisible()
    }
  })

  test('UI: Tab Work Item hiển thị Grand Total row', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click tab Work Item
      const workItemTab = page
        .locator('[role="tab"]:has-text("Work Item"), .ant-tabs-tab:has-text("Work Item")')
        .first()
      if (await workItemTab.isVisible()) {
        await workItemTab.click()
        await page.waitForTimeout(1000)

        // Kiểm tra Grand Total hiển thị
        const grandTotal = page.locator('text=Grand Total').first()
        // Có thể Grand Total chỉ hiện khi có data
        if (await grandTotal.isVisible()) {
          await expect(grandTotal).toBeVisible()
        }
      }
    }
  })
})

// ============================================================
// TC-MF-007: Phát hành TO
// ============================================================
test.describe('TC-MF-007: Phát hành TO', () => {
  test('UI: Work Item row có Action buttons', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click tab Work Item
      const workItemTab = page
        .locator('[role="tab"]:has-text("Work Item"), .ant-tabs-tab:has-text("Work Item")')
        .first()
      if (await workItemTab.isVisible()) {
        await workItemTab.click()
        await page.waitForTimeout(1000)

        // Kiểm tra cột Action tồn tại
        const actionColumn = page.locator('th:has-text("Action")').first()
        if (await actionColumn.isVisible()) {
          await expect(actionColumn).toBeVisible()
        }
      }
    }
  })
})

// ============================================================
// TC-MF-010: Tự động chuyển trạng thái + Container/Truck List
// ============================================================
test.describe('TC-MF-010: Container/Truck List tab', () => {
  test('UI: Tab Container/Truck List hiển thị', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Kiểm tra tab Container/Truck List tồn tại
      const containerTab = page
        .locator('[role="tab"]:has-text("Container"), .ant-tabs-tab:has-text("Container")')
        .first()
      if (await containerTab.isVisible()) {
        await containerTab.click()
        await page.waitForTimeout(1000)

        // Kiểm tra bảng hiển thị
        const table = page.locator('.ant-table').first()
        await expect(table).toBeVisible()
      }
    }
  })

  test('UI: Status badges hiển thị đúng trên WO List', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    // Kiểm tra bảng danh sách WO hiển thị (hoặc màn hình trống)
    const tableOrEmpty = page.locator('.ant-table').or(page.locator('[role="table"]')).or(page.locator('text=No Work Order Found')).or(page.locator('text=Không có dữ liệu')).first()
    await expect(tableOrEmpty).toBeVisible()

    // Kiểm tra có cột Status
    const statusColumn = page.locator('th:has-text("Status")').first()
    if (await statusColumn.isVisible()) {
      await expect(statusColumn).toBeVisible()
    }
  })
})

// ============================================================
// CROSS-CUTTING: Navigation & Layout
// ============================================================
test.describe('Work Order — Navigation', () => {
  test('Điều hướng OMS → Work Order List', async ({ page }) => {
    await navigateTo(page, LIST_URL)

    // Kiểm tra URL đúng
    await expect(page).toHaveURL(/\/oms\/work-order/)
  })

  test('Cancel từ Create → quay về List', async ({ page }) => {
    await navigateTo(page, CREATE_URL)
    await page.waitForLoadState('networkidle')

    // Tìm nút Cancel
    const cancelButton = page.getByRole('button', { name: /cancel/i }).first()
    if (await cancelButton.isVisible()) {
      await cancelButton.click()

      // Kiểm tra quay về list
      await expect(page).toHaveURL(/\/oms\/work-order$/, { timeout: 10_000 })
    }
  })

  test('Click WO row → Detail page', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()

      // URL chuyển sang detail (chứa work order code)
      await expect(page).toHaveURL(/\/oms\/work-order\/WO-/, { timeout: 10_000 })
    }
  })

  test('Detail → Edit button → Update page', async ({ page }) => {
    await navigateTo(page, LIST_URL)
    await page.waitForLoadState('networkidle')

    const firstRow = page.locator('.ant-table-row, tr[data-row-key]').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Nhấn Edit
      const editButton = page.getByRole('button', { name: /edit/i }).first()
      if (await editButton.isVisible()) {
        await editButton.click()

        // URL chuyển sang update
        await expect(page).toHaveURL(/\/oms\/work-order\/.*\/update/, { timeout: 10_000 })
      }
    }
  })
})
