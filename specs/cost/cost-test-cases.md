# 📝 Test Cases — Cost

> **Module:** Cost
> **Đường dẫn spec:** `specs/cost/cost.spec.js`
> **Trạng thái:** Đã triển khai

---

## Danh sách Test Cases đã triển khai (Implemented E2E)

### 1. Giao diện (UI)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| CS-UI-001 | Trang danh sách Cost Group tải đúng |
| CS-UI-002 | Trang tạo mới Cost Group hiển thị đúng |
| CS-UI-003 | Trang danh sách Cost Item tải đúng |
| CS-UI-004 | Trang tạo mới Cost Item hiển thị đúng |

### 2. Chức năng (FN)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| CS-FN-001 | Nút Hủy từ màn hình tạo mới Cost Group quay lại danh sách |
| CS-FN-005 | BA Spec SR-CG-002 — Tạo Cost Group trùng mã → 409 Conflict |
| CS-FN-006 | BA Spec SCG001→SCG002 — Double-click dòng trong List mở Detail |
| CS-IF-001 | Logic rẽ nhánh (If/Else) — Thay đổi UOM theo nhóm Category UOM |
| CS-FN-002 | Business Flow — Tạo mới Cost Item thành công |

### 3. Validation (VL)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| CS-VL-001 | Validation lỗi bắt buộc khi lưu Cost Group trống |
| CS-VL-002 | Validation lỗi bắt buộc khi lưu Cost Item trống |
| CS-VL-003 | Boundary Value — Kiểm tra độ dài mã chi phí bị giới hạn ở 20 ký tự (maxLength) |
| CS-VL-004 | Format Validation — Kiểm tra ký tự đặc biệt trong Cost Code |

