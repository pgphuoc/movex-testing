# 📝 Test Cases — Common Codes

> **Module:** Common Codes
> **URL:** /master-data/common-codes
> **Ngày tạo:** 2026-06-18
> **Người tạo:** [Tên]

---

## Tham chiếu chéo

| Nguồn | File | Đã đọc |
|-------|------|--------|
| Đặc tả màn hình | `input/11 Screen Specification/...` | ☐ |
| Quy tắc hệ thống | SR-XX-001 → SR-XX-00N | ☐ |
| Mã lỗi | ... | ☐ |
| Phân quyền | Actor & Permission list | ☐ |

---

## Danh sách Test Cases

### 1. Giao diện (UI)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| UI-001 | Trang danh sách tải đúng | Mở URL module | Hiển thị tiêu đề, bảng, toolbar | — |
| UI-002 | Các cột mặc định | Kiểm tra header bảng | Đúng theo đặc tả BA | — |

### 2. Chức năng (FN)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| FN-001 | Nhấn hàng → Chi tiết | Nhấn row đầu tiên | URL chuyển sang /id | — |
| FN-002 | Thêm mới | Nhấn Add New | URL chuyển sang /create | — |

### 3. Validation (VL)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| VL-001 | Lưu form trống | Nhấn Save khi chưa nhập | Hiện lỗi required | — |

### 4. Quy tắc nghiệp vụ (BR)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| BR-001 | TODO | TODO | TODO | SR-XX-001 |

### 5. Phân quyền (PM)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| PM-001 | Admin thấy nút hành động | Đăng nhập Admin | Thấy Add New, Edit | — |
