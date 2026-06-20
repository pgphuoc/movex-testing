# 📊 Bảng Điều Khiển Kiểm Thử Tự Động (E2E Testing Dashboard)

> **Dự án:** MoveX Logistics & E-Commerce Platform
> **Ngày cập nhật:** 2026-06-20
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
| **Số lỗi phát hiện (Bugs Found)** | 0 | — | Tổng số test cases bị lỗi (Failed) |

---

## 2. Trạng thái kiểm thử theo từng Module (Module Status Board)

### 🔑 Platform & System Admin

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Platform-Admin / Tenant Management** | 🟢 **ACTIVE** | **5 Passed** / 0 Failed / 0 Skipped | 2026-06-18 13:25:30 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Platform-Admin / Plan Management** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Platform-Admin / Subscription** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |

### 📁 Tenant-Admin / Master-data

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Admin / Master-data / Business Partner** | 🟢 **ACTIVE** | **7 Passed** / 0 Failed / 0 Skipped | 2026-06-20 01:35:40 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Vehicle** | 🟢 **ACTIVE** | **12 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Administrative Info** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Source Master** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Toll Station** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-20 00:48:43 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Routing** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Service** | 🟢 **ACTIVE** | **2 Passed** / 0 Failed / 0 Skipped | 2026-06-19 17:23:06 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Cost** | 🟢 **ACTIVE** | **2 Passed** / 0 Failed / 0 Skipped | 2026-06-19 17:23:06 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Pricing** | 🟢 **ACTIVE** | **18 Passed** / 0 Failed / 0 Skipped | 2026-06-19 17:44:54 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Vendor Tariff** | 🟢 **ACTIVE** | **8 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Common Code** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Exchange Rate** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Currency** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Unit of Measure** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / User Management** | 🟢 **ACTIVE** | **4 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Authorization** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Organization** | 🟢 **ACTIVE** | **2 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Admin / Master-data / Settings** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |

### 📦 Tenant-Operation / IM

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / IM / Inventory (Kho)** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |

### 🚛 Tenant-Operation / OMS

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / OMS / Customer request** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Quotation** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Work order** | 🟢 **ACTIVE** | **20 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Purchase Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Internal Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Execution request: Customs Job** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / OMS / Execution request: Freight Job** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |

### 🚚 Tenant-Operation / TMS

| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Tenant-Operation / TMS / Trucking Order** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Trucking Planning** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Proof of Delivery** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Fleet Management** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / TMS Work Order List** | 🟢 **ACTIVE** | **1 Passed** / 0 Failed / 0 Skipped | 2026-06-18 11:39:33 | Kịch bản kiểm thử hoạt động bình thường. | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Driver Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Driver Salary** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Maintenance Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Fuel Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Electric Charging Management** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |
| **Tenant-Operation / TMS / Maintenance & Replacement** | 🟡 **SKIPPED** | **0 Passed** / 0 Failed / 2 Skipped | 2026-06-18 11:39:33 | Bỏ qua 2 test cases (chờ phát triển UI). | [Xem HTML](html/index.html) |


---

## 3. Phân Tích Nguyên Nhân Lỗi (Root Cause Analysis - RCA)

🎉 Không phát hiện lỗi hệ thống nào trong phiên kiểm thử này.

---

## 4. Nhật ký lỗi phát hiện chi tiết (Bugs Registry Log)

Toàn bộ kịch bản kiểm thử chạy thành công. Không phát hiện lỗi mới nào.

---

## 4. Kịch bản kiểm thử bị bỏ qua (Skipped Tests Registry)

Có 26 kịch bản kiểm thử đang tạm thời bị bỏ qua:

1. **[Exchange Rate] — UI-001: Trang danh sách tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
2. **[Exchange Rate] — FN-001: Tạo mới Exchange Rate thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
3. **[Currency] — UI-001: Trang danh sách tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
4. **[Currency] — FN-001: Tạo mới Currency thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
5. **[Unit of Measure] — UI-001: Trang danh sách tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
6. **[Unit of Measure] — FN-001: Tạo mới Unit of Measure thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
7. **[Settings] — UI-001: Trang cấu hình hệ thống tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
8. **[Settings] — FN-001: Cập nhật cấu hình hệ thống thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
9. **[Inventory (Kho)] — UI-001: Trang danh sách tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
10. **[Inventory (Kho)] — FN-001: Tạo mới Inventory Master thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
11. **[Execution request: Customs Job] — UI-001: Trang danh sách Customs Job tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
12. **[Execution request: Customs Job] — FN-001: Tạo mới Customs Job thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
13. **[Execution request: Freight Job] — UI-001: Trang danh sách Freight Job tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
14. **[Execution request: Freight Job] — FN-001: Tạo mới Freight Job thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
15. **[Driver Management] — UI-001: Trang danh sách Driver Management tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
16. **[Driver Management] — FN-001: Tạo mới tài xế thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
17. **[Driver Salary] — UI-001: Trang tính lương tài xế tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
18. **[Driver Salary] — FN-001: Tính lương tháng cho tài xế thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
19. **[Maintenance Management] — UI-001: Trang danh sách bảo trì tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
20. **[Maintenance Management] — FN-001: Tạo mới yêu cầu bảo trì xe thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
21. **[Fuel Management] — UI-001: Trang quản lý cấp phát nhiên liệu tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
22. **[Fuel Management] — FN-001: Tạo mới phiếu đổ nhiên liệu thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
23. **[Electric Charging Management] — UI-001: Trang quản lý sạc điện tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
24. **[Electric Charging Management] — FN-001: Tạo mới phiếu sạc điện thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
25. **[Maintenance & Replacement] — UI-001: Trang quản lý cấp phát thay thế phụ tùng tải đúng bố cục**
   * **Lý do**: Chờ phát triển giao diện / kịch bản
26. **[Maintenance & Replacement] — FN-001: Tạo mới yêu cầu thay thế phụ tùng thành công**
   * **Lý do**: Chờ phát triển giao diện / kịch bản

---

## 5. Hướng dẫn chạy kiểm thử toàn bộ hệ thống (Execution Guide)

Để thực hiện chạy kiểm thử tự động toàn bộ phân hệ:
```bash
# Di chuyển vào project kiểm thử
cd movex-e2e-tests

# Chạy kiểm thử E2E bằng Playwright và tự động tổng hợp báo cáo Dashboard
TEST_EMAIL=owner.368329@qtllogistics.vn TEST_PASSWORD=Movex@2026 BASE_URL=https://qtltest368329.movex.vn npx playwright test; node helpers/generate-dashboard.js
```

Báo cáo kiểm thử dạng HTML chi tiết sẽ được tự động cập nhật tại [reports/html/index.html](html/index.html).
