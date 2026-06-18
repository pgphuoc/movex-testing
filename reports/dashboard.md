# 📊 Bảng Điều Khiển Kiểm Thử Tự Động (E2E Testing Dashboard)

> **Dự án:** MoveX Logistics & E-Commerce Platform
> **Ngày cập nhật:** 2026-06-18
> **Người vận hành:** Senior BA Agent / Antigravity

---

## 1. Tóm tắt chỉ số kiểm thử (Dashboard Metrics)

| Chỉ số | Số lượng | Tỷ lệ | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Tổng số Module cần viết** | 40 | 100% | Toàn bộ phân hệ trên toàn hệ thống MoveX |
| **Total Module Đã Có Script** | 40 | 100% | Đã thiết lập file kịch bản kiểm thử |
| **Total Module Chưa Có Script** | 0 | 0% | Chưa có file kịch bản |
| **Total Module Đã Chạy Script** | 27 | 68% | Đã thực thi (Passed / Failed) trên UI |
| **Total Module Chưa Chạy Script** | 13 | 33% | Bỏ qua (skipped) do chờ UI/Script |
| **Số lỗi phát hiện (Bugs Found)** | 1 | — | Tổng số test cases bị lỗi (Failed) |

---

## 2. Trạng thái kiểm thử theo từng Module (Module Status Board)

### 🔑 Platform & System Admin

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Platform-Admin / Tenant Management** | 🟢 **ACTIVE** | **5 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:40:56 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Platform-Admin / Plan Management** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Platform-Admin / Subscription** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |

### 📁 Tenant-Admin / Master-data

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Admin / Master-data / Business Partner** | 🟢 **ACTIVE** | **7 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Vehicle** | 🟢 **ACTIVE** | **12 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Administrative Info** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Source Master** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Toll Station** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Routing** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Service** | 🔴 **FAILED** | **2 Passed** / 1 Failed / 0 Skipped | 2026-06-18 11:40:56 | Lỗi phát hiện tại 1 test cases. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Cost** | 🟢 **ACTIVE** | **8 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Pricing** | 🟢 **ACTIVE** | **5 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Vendor Tariff** | 🟢 **ACTIVE** | **8 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Common Code** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Exchange Rate** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Currency** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Unit of Measure** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / User Management** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Authorization** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Organization** | 🟢 **ACTIVE** | **2 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Admin / Master-data / Settings** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |

### 📦 Tenant-Operation / IM

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / IM / Inventory (Kho)** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |

### 🚛 Tenant-Operation / OMS

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / OMS / Customer request** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Quotation** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Work order** | 🟢 **ACTIVE** | **20 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Purchase Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Internal Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Execution request: Customs Job** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / OMS / Execution request: Freight Job** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |

### 🚚 Tenant-Operation / TMS

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / TMS / Trucking Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Trucking Planning** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Proof of Delivery** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Fleet Management** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / TMS Work Order List** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Driver Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Driver Salary** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Maintenance Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Fuel Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Electric Charging Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |
| **Tenant-Operation / TMS / Maintenance & Replacement** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI. | [Xem HTML](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html) |


---

## 3. Nhật ký lỗi phát hiện (Bugs Registry Log)

Đã phát hiện 1 lỗi trong quá trình kiểm thử:

1. **[Service] — FN-001: Mở modal Create Service thành công**
   ```
   Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
   
   Locator: locator('.ant-modal-title:has-text("Create Service")').first().or(locator('text=Create Service').first())
   Expected: visible
   Timeout: 5000ms
   Error: element(s) not found
   
   Call log:
   [2m  - Expect "toBeVisible" with timeout 5000ms[22m
   [2m  - waiting for locator('.ant-modal-title:has-text("Create Service")').first().or(locator('text=Create Service').first())[22m
   
   
     28 |     
     29 |     // Kiểm tra modal xuất hiện
   > 30 |     await expect(page.locator('.ant-modal-title:has-text("Create Service")').first().or(page.locator('text=Create Service').first())).toBeVisible();
        |                                                                                                                                       ^
     31 |     
     32 |     // Đóng modal
     33 |     const cancelBtn = page.locator('.ant-modal-footer button:has-text("Cancel")').or(page.locator('button:has-text("Cancel")')).first();
       at /Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/specs/services/services.spec.js:30:135
   ```

---

## 4. Hướng dẫn chạy kiểm thử toàn bộ hệ thống (Execution Guide)

Để thực hiện chạy kiểm thử tự động toàn bộ phân hệ:
```bash
# Di chuyển vào project kiểm thử
cd movex-e2e-tests

# Chạy kiểm thử E2E bằng Playwright và tự động tổng hợp báo cáo Dashboard
TEST_EMAIL=owner.368329@qtllogistics.vn TEST_PASSWORD=Movex@2026 BASE_URL=https://qtltest368329.movex.vn npx playwright test; node helpers/generate-dashboard.js
```

Báo cáo kiểm thử dạng HTML chi tiết sẽ được tự động cập nhật tại [reports/html/index.html](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/html/index.html).
