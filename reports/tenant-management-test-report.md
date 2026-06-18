# 🧪 Báo Cáo Kiểm Thử — Module Tenant Management (Quản lý Tenant)

> **Module:** Tenant Management (Quản lý Đối tác/Tenant — Platform Admin)  
> **Ngày thực hiện:** 18/06/2026  
> **Người thực hiện:** Hệ thống AI Automation QA (Antigravity)  
> **Địa chỉ hệ thống:** https://dev.movex.vn/  
> **Tài khoản test:** admin@movex.vn (Quyền Platform Admin)  
> **Các màn hình đã test:** Tenant List (Danh sách Tenant), New Tenant (Thêm mới Tenant)

---

## 📊 Tổng quan kết quả

| Chỉ số | Giá trị |
|--------|---------|
| **Tổng số Test Case thiết kế** | 7 |
| **Số Test Case đã thực thi** | 6 |
| **✅ Đạt (PASS)** | **4** |
| **⚠️ Cảnh báo (WARNING)** | **0** |
| **❌ Không đạt (FAIL)** | **2** (1 lỗi RLS Backend, 1 lỗi UI không hiển thị thông báo lỗi) |
| **⏭️ Bỏ qua (SKIP)** | 1 (do bước trước đó bị lỗi) |
| **Tỷ lệ đạt** | **66.7%** (4/6) |

---

## 📋 Tài liệu đã tham chiếu chéo

| Nguồn | Tài liệu | Mục đích sử dụng |
|-------|----------|-------------------|
| Đặc tả màn hình | `SS_TN_Tenant_Management_Screen_Spec.md` | Bố cục, các trường dữ liệu, cấu trúc form New Tenant và luồng chuyển đổi |
| Tài khoản/Môi trường | `env-dev.md` | Lấy thông tin URL https://dev.movex.vn/ và tài khoản Platform Admin |
| Quy tắc hệ thống | SR-TN-001 | Kiểm tra tính duy nhất của Subdomain |

---

## 🔍 Kết quả chi tiết

### 1. Danh sách Tenant (STN001) — `/platform-admin/tenant-management`

| Mã TC | Tên kiểm thử | Kết quả | Ghi chú |
|-------|-------------|---------|---------|
| TN-UI-001 | Trang danh sách tải đúng bố cục | ✅ Đạt | Tiêu đề "Tenant List", breadcrumbs "Home > Tenant Management", các nút Add New, Import, Export, Filter, Columns hiển thị đầy đủ và đúng vị trí. |
| TN-PM-001 | Platform Admin thấy tất cả hành động | ✅ Đạt | Tài khoản admin@movex.vn có đầy đủ quyền thao tác (thấy nút Add New, Sửa, Import, Export). |

**Ảnh chụp màn hình:**

![Trang Danh sách Tenant](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-workspace/frontend/movex-fe-masterdata/e2e/reports/TN-UI-001-List-Layout.png)

---

### 2. Thêm mới Tenant (STN003) — `/platform-admin/tenant-management/create`

| Mã TC | Tên kiểm thử | Kết quả | Ghi chú |
|-------|-------------|---------|---------|
| TN-UI-002 | New Tenant form sections display correctly | ✅ Đạt | Form hiển thị đúng 6 phân đoạn chính: Tenant Information, Legal Information, Tenant Owner, Technical Contact, Billing Information, Default Setup Package. |
| TN-VL-001 | Required fields cannot be empty | ✅ Đạt | Click Save khi form trống hiển thị thông báo lỗi "This field is required" tại các trường bắt buộc. |
| TN-FN-001 | Create tenant successfully | ❌ Không đạt | Lỗi **HTTP 500** từ API do vi phạm chính sách RLS phía Database (xem chi tiết ở phần Lỗi). |
| TN-FN-002 | Search tenant by code or name | ⏭️ Bỏ qua | Bỏ qua do test case TN-FN-001 tạo tenant không thành công. |
| TN-BR-001 | Unique Subdomain validation (SR-TN-001) | ❌ Không đạt | Lỗi **UI Bug**: Backend trả về lỗi 400 (Subdomain already exists) nhưng giao diện không hiển thị thông báo lỗi lên màn hình (xem chi tiết ở phần Lỗi). |

**Ảnh chụp màn hình:**

- **Lỗi Validation trường bắt buộc:**
![Lỗi Validation](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-workspace/frontend/movex-fe-masterdata/e2e/reports/TN-VL-001-Validation-Errors.png)

- **Dữ liệu điền trước khi Lưu (Positive Case):**
![Form đầy đủ](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-workspace/frontend/movex-fe-masterdata/e2e/reports/TN-FN-001-Form-Filled.png)

---

## 🐛 Danh sách lỗi & phát hiện

### Lỗi #1: Lỗi Row-Level Security (RLS) trên bảng `users` phía Backend (HTTP 500)
- **Mức độ:** 🔴 Nghiêm trọng (Blocker)
- **Màn hình:** Thêm mới Tenant (STN003)
- **API bị ảnh hưởng:** `POST https://dev-api.movex.vn/api/v1/x-system/tenants`
- **Nguyên nhân:** Khi tạo mới Tenant, Backend tiến hành lưu thông tin Tenant Owner vào bảng `users`. Tuy nhiên, database trả về lỗi vi phạm chính sách bảo mật dòng (RLS):
  ```
  new row violates row-level security policy for table "users"
  ```
  Điều này cho thấy Backend đang lưu bản ghi của Tenant mới mà không thiết lập đúng tenant context trong session kết nối, khiến DB chặn hành động ghi của Platform Admin.
- **Ảnh chụp minh chứng:**
![Lỗi RLS Backend](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-workspace/frontend/movex-fe-masterdata/e2e/reports/TN-FN-001-RLS-Error.png)

### Lỗi #2: UI không hiển thị lỗi trùng Subdomain từ API (HTTP 400)
- **Mức độ:** 🟠 Cao
- **Màn hình:** Thêm mới Tenant (STN003)
- **API bị ảnh hưởng:** `POST https://dev-api.movex.vn/api/v1/x-system/tenants`
- **Mô tả hành vi:** 
  1. Gửi subdomain đã tồn tại (ví dụ: `qtl`).
  2. API trả về HTTP 400 với thông tin lỗi: `{"isSuccess":false,"message":"Subdomain already exists: qtl.movex.vn","errorDetails":{"code":"DNS_RECORD_EXISTS"}}`.
  3. Tuy nhiên, giao diện Frontend hoàn toàn không hiển thị bất kỳ Toast, Alert hay thông báo đỏ nào. Nút Save giữ trạng thái bình thường và người dùng không biết lý do vì sao không tạo được tenant.
- **Ảnh chụp minh chứng:**
![Lỗi UI không hiện thông báo](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-workspace/frontend/movex-fe-masterdata/e2e/reports/TN-BR-001-Duplicate-Subdomain-Bug.png)

---

## ✅ Kết luận & Đề xuất

1. **🔴 Bug Blocker Backend:** Cần yêu cầu đội Backend cấu hình lại chính sách RLS trên bảng `users` hoặc kiểm tra lại Tenant Context propagation khi Platform Admin tạo Tenant và Tenant Owner đầu tiên. Hiện tại chức năng tạo mới tenant đang bị chặn hoàn toàn bởi lỗi DB này.
2. **🟠 Bug Frontend Error Handling:** Cần bổ sung xử lý lỗi trong RTK Query / Axios của màn hình Tenant Create để bắt và hiển thị nội dung `message` trả về từ API (ví dụ: `Subdomain already exists`).
3. **🟢 Bố cục UI đạt yêu cầu:** Các màn hình Danh sách và Thêm mới có giao diện hiển thị đúng 100% so với đặc tả Screen Spec.

---

> **Tạo bởi Hệ thống AI Automation QA**  
> **Công cụ:** Antigravity + Playwright MCP  
