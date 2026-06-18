# 📊 Báo Cáo Kết Quả Kiểm Thử (Test Execution Report) — Business Partner

> **Module:** Business Partner (Đối tác kinh doanh)
> **Môi trường kiểm thử:** Live Dev Environment (`https://qtltest368329.movex.vn`)
> **Tài khoản test:** `owner.368329@qtllogistics.vn` / `Movex@2026` (Tenant Owner)
> **Ngày thực hiện:** 2026-06-18
> **Người thực hiện:** Senior BA Agent / Antigravity

---

## 1. Tóm tắt kết quả (Summary Results)

| Tổng số test cases | Đạt (Passed) | Không đạt (Failed) | Bị bỏ qua (Skipped) | Tỷ lệ thành công (Pass Rate) |
|:------------------:|:------------:|:------------------:|:-------------------:|:----------------------------:|
| 7 | 7 | 0 | 0 | **100%** |

---

## 2. Chi tiết kết quả kiểm thử (Detailed Test Results)

| Mã TC | Tên kiểm thử | Trạng thái | Thời gian chạy | Kết quả & Ghi chú |
| :--- | :--- | :---: | :---: | :--- |
| **BP-UI-001** | Trang danh sách tải đúng bố cục | **PASSED** | 4.7s | Tiêu đề "Business Partner" và nút "Add Business Partner" hiển thị đúng. |
| **BP-UI-002** | Trang tạo mới hiển thị đầy đủ các trường và tab con | **PASSED** | 10.1s | Các trường input thông tin chung hiển thị đúng. Tab "Customer" hiển thị động và render đúng các section con "Contact Information" và "Bank Account". |
| **BP-VL-001** | Lưu form trống hiện lỗi trường bắt buộc | **PASSED** | 4.4s | Hiện viền đỏ cảnh báo các trường bắt buộc (`identifyId`, `localName`, `phoneNumber`, `currency`, `country`, `localAddress`, `businessCategory`, `partnerGroup`). |
| **BP-VL-002** | Kiểm tra định dạng email và số điện thoại | **PASSED** | 4.7s | Báo lỗi định dạng khi điền email không hợp lệ (`invalid-email`) và phone number chứa chữ (`abcdef`). |
| **BP-FN-003** | Nút Hủy từ Tạo mới → quay về Danh sách | **PASSED** | 4.7s | Quay lại trang danh sách đối tác thành công. |
| **BP-BR-001** | Tạo mới doanh nghiệp thành công & Tìm kiếm | **PASSED** | 18.4s | Tạo đối tác với thông tin ngẫu nhiên, lưu thành công, tự động điều hướng sang trang chi tiết, quay lại trang danh sách tìm kiếm thấy bản ghi. |
| **BP-BR-002** | Ràng buộc duy nhất MST (SR-BP-001) | **PASSED** | (gộp ở trên) | Hệ thống chặn không cho tạo mới đối tác có mã số thuế trùng với đối tác vừa tạo và hiển thị thông báo lỗi trùng lặp. |
| **BP-BR-003** | Hiển thị có điều kiện Tab Cộng tác viên | **PASSED** | 4.8s | Tab "Cộng tác viên" hiển thị động khi chọn vai trò CTV, và tự động ẩn khi bỏ chọn vai trò này. |

---

## 3. Ảnh chụp màn hình kiểm thử thành công (Test Screenshots)
Các ảnh chụp màn hình kiểm thử và báo cáo lỗi được lưu trữ tại thư mục [reports/](file:///Users/phuocpg/Documents/20.Projects/MoveX/dev-space/movex-e2e-tests/reports/):
- Mẫu điền form đối tác: `reports/BP-BR-001-Form-Filled-[timestamp].png`
- Tạo đối tác thành công: `reports/BP-BR-001-Created-[timestamp].png`
- Lỗi trùng lặp MST: `reports/BP-BR-002-Duplicate-Error-[timestamp].png`

---

## 4. Kết luận
- Module **Business Partner** đã vượt qua tất cả các kịch bản kiểm thử giao diện, validation và quy tắc nghiệp vụ quan trọng.
- Ràng buộc trùng lặp MST (`SR-BP-001`) hoạt động chính xác cả ở frontend và backend.
- Cấu hình hiển thị tab động theo vai trò (Customer/Collaborator) hoạt động ổn định và mượt mà.
