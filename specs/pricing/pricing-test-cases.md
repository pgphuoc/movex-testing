# 📝 Test Cases — Pricing

> **Module:** Pricing
> **Đường dẫn spec:** `specs/pricing/pricing.spec.js`
> **Trạng thái:** Đã triển khai

---

## Danh sách Test Cases đã triển khai (Implemented E2E)

### 1. Giao diện (UI)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| PR-UI-001 | Trang danh sách Pricing Policy tải đúng bố cục |
| PR-UI-002 | Trang danh sách Pricing Rule tải đúng bố cục |
| PR-UI-003 | Trang danh sách Pricing List tải đúng bố cục |
| PR-UI-004 | Trang danh sách Planned Cost tải đúng bố cục |

### 2. Chức năng (FN)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| PR-FN-003 | BA Spec SPR001→SPR002 — Double-click dòng Pricing Rule List mở Detail |
| PR-FN-004 | BA Spec SPR003 — Nút Hủy từ tạo mới Pricing Rule quay lại danh sách |
| PR-FN-001 | Tạo Pricing Rule -> Kiểm tra tính giá ở Pricing List -> Tạo mới Pricing Policy |
| PR-FN-002 | Pricing Rule — Nhập đầy đủ (Full-fill), kiểm tra preview kết quả tính toán và đối chiếu bảng giá (Pricing List) |
| PC-FN-001 | BA Spec SPC003 — Tạo Planned Cost thành công |
| PC-FN-002 | BA Spec SPC003 — Planned Cost Create form validation khi thiếu trường bắt buộc |
| PC-FN-003 | BA Spec SPC001→SPC002 — Double-click Planned Cost List mở Detail |
| PL-FN-001 | BA Spec SPX001 — Pricing List hiển thị Rate Card inline với Quick Edit |
| PL-FN-002 | BA Spec SPX002 — Pricing List Detail hiển thị đơn giá lines |
| PP-FN-001 | BA Spec SPP001→SPP002 — Double-click Pricing Policy List mở Detail |
| PP-FN-002 | BA Spec SPP003 — Pricing Policy Create page hiển thị đúng layout |

### 3. Validation (VL)

| Mã TC | Tên kiểm thử |
|-------|-------------|
| PR-VL-001 | Validation lỗi bắt buộc khi lưu Pricing Rule trống |
| PR-VL-002 | Boundary Value — Kiểm tra mã quy tắc định giá bị giới hạn ở 20 ký tự (maxLength) |
| PR-VL-003 | BA Spec SR-PR-002 — Ngày bắt đầu phải <= Ngày kết thúc |

