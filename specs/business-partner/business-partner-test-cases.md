# 📝 Test Cases — Business Partner

> **Module:** Business Partner (Đối tác kinh doanh)
> **URL:** /master-data/business-partner
> **Ngày cập nhật:** 2026-06-18
> **Người tạo:** Senior BA Agent / Antigravity

---

## Tham chiếu chéo

| Nguồn | File | Đã đọc |
|-------|------|--------|
| Đặc tả màn hình | [SS_BP_Business_Partner_Screen_Spec.md](file:///Users/phuocpg/Documents/20.Projects/MoveX/ba-agent/movex-project-v4/10-Screen-Specification/Tenant-Admin/Master-data/BP_Business_Partner/SS_BP_Business_Partner_Screen_Spec.md) | ☑ |
| Quy tắc hệ thống | SR-BP-001, SR-BP-002, SR-BP-003 | ☑ |
| Mã lỗi | `MSG_ERR_REQUIRED`, `MSG_ERR_DUPLICATE_CODE`, `MSG_BP_ERR_INVALID_TAX_FORMAT` | ☑ |
| Phân quyền | Platform Admin, Tenant Admin, Accountant, Operator | ☑ |

---

## Danh sách Test Cases

### 1. Giao diện (UI)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| BP-UI-001 | Trang danh sách tải đúng | Mở URL `/master-data/business-partner` | - Hiển thị tiêu đề "Business Partner"<br>- Hiển thị nút "Add Business Partner"<br>- Hiển thị bảng danh sách đối tác | — |
| BP-UI-002 | Trang tạo mới hiển thị đầy đủ | Nhấn nút "Add Business Partner" | - URL chuyển sang `/master-data/business-partner/create`<br>- Hiển thị các trường: Loại pháp lý, Mã đối tác (Disabled), Nhóm đối tác, Mã số thuế, Tên Tiếng Việt, Tên viết tắt, Tiền tệ mặc định, Ký hiệu hóa đơn, Email, Số điện thoại, Số Fax, Quốc gia, Tỉnh/Thành, Địa chỉ, Mã Bưu Chính, Vai trò áp dụng<br>- Hiển thị các tab con: Liên Hệ, Ngân Hàng, Công Nợ, Chính Sách Giá | — |

### 2. Validation (VL)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| BP-VL-001 | Lưu form trống | - Nhấn nút "Add Business Partner" để vào form tạo mới<br>- Nhấn nút "Save" khi chưa nhập thông tin | Hiển thị thông báo lỗi bắt buộc nhập đối với các trường:<br>- Mã số thuế<br>- Tên Tiếng Việt<br>- Ký hiệu hóa đơn<br>- Số điện thoại<br>- Tỉnh/Thành<br>- Địa chỉ<br>- Vai trò áp dụng | — |
| BP-VL-002 | Kiểm tra định dạng Email | - Nhập email không hợp lệ (ví dụ: `test@invalid`) vào trường Email<br>- Nhấn "Save" | Hiển thị thông báo lỗi định dạng email không đúng | — |
| BP-VL-003 | Kiểm tra định dạng Số điện thoại | - Nhập số điện thoại sai định dạng (chứa chữ cái hoặc ngắn hơn 9 chữ số)<br>- Nhấn "Save" | Hiển thị thông báo lỗi số điện thoại không hợp lệ | — |
| BP-VL-004 | Kiểm tra định dạng Mã số thuế Doanh nghiệp | - Chọn loại pháp lý "Doanh nghiệp"<br>- Nhập MST sai độ dài (không phải 10 hay 13 chữ số)<br>- Nhấn "Save" | Hiển thị thông báo lỗi định dạng MST không hợp lệ | — |

### 3. Chức năng (FN) & Quy tắc nghiệp vụ (BR)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| BP-FN-001 | Nhấn hàng → Trang Chi tiết | - Tại trang danh sách, nhấn vào hàng đối tác đầu tiên | - URL chuyển hướng sang `/master-data/business-partner/{id}`<br>- Hiển thị thông tin chi tiết đối tác và các tab | — |
| BP-FN-002 | Nút Hủy quay về danh sách | - Tại trang tạo mới `/master-data/business-partner/create`<br>- Nhấn nút "Cancel" | - Quay về trang danh sách `/master-data/business-partner` | — |
| BP-BR-001 | Tạo mới doanh nghiệp thành công | - Điền đầy đủ các trường bắt buộc với thông tin doanh nghiệp hợp lệ (vai trò Khách hàng)<br>- Nhấn nút "Save" | - Lưu thành công và chuyển hướng về trang chi tiết đối tác mới tạo | — |
| BP-BR-002 | Ràng buộc duy nhất MST | - Tạo mới đối tác với MST đã tồn tại trong hệ thống<br>- Nhấn "Save" | - Hệ thống chặn và hiển thị thông báo lỗi trùng mã số thuế | SR-BP-001 |
| BP-BR-003 | Hiển thị có điều kiện Tab CTV | - Chọn vai trò "CTV (Collaborator)" trên form tạo mới/chỉnh sửa | - Hiển thị thêm Tab "Cộng tác viên"<br>- Khi bỏ chọn vai trò này, tab sẽ bị ẩn đi | — |

### 4. Phân quyền (PM)

| Mã TC | Tên kiểm thử | Bước thực hiện | Kết quả kỳ vọng | SR Ref |
|-------|-------------|----------------|-----------------|--------|
| BP-PM-001 | Tenant Admin có toàn quyền | Đăng nhập tài khoản Tenant Admin | Thấy đầy đủ nút hành động: Add Business Partner, Edit, Save, Lock/Unlock | — |

---

## Chi tiết Kịch bản nghiệm thu (Acceptance Criteria - Gherkin)

### Kịch bản 1: Kiểm tra giao diện và Validation form trống (BP-UI-001, BP-VL-001)
- **Cho** Người dùng đã đăng nhập vào hệ thống MoveX bằng tài khoản Tenant Admin và đang ở trang danh sách đối tác.
- **Khi** Người dùng nhấn nút "Add Business Partner", sau đó nhấn nút "Save" mà không điền bất kỳ thông tin nào.
- **Thì** Trang tạo mới hiển thị thông báo lỗi yêu cầu nhập tại các trường bắt buộc bao gồm Mã số thuế, Tên Tiếng Việt, Ký hiệu hóa đơn, Số điện thoại, Địa chỉ và Vai trò áp dụng.

### Kịch bản 2: Tạo mới Business Partner doanh nghiệp thành công (BP-BR-001)
- **Cho** Người dùng đang ở màn hình tạo mới đối tác.
- **Khi** Người dùng chọn loại pháp lý "Doanh nghiệp", nhóm đối tác "Trong nước", nhập Mã số thuế ngẫu nhiên (10 chữ số), Tên Tiếng Việt, Tên viết tắt, Ký hiệu hóa đơn, Số điện thoại hợp lệ, Quốc gia "Việt Nam", chọn Tỉnh/Thành, nhập địa chỉ, chọn vai trò áp dụng là "Khách hàng" (Customer) và chọn điều khoản thanh toán, sau đó nhấn nút "Save".
- **Thì** Hệ thống thực hiện lưu thông tin thành công, hiển thị thông điệp thành công và tự động điều hướng người dùng sang màn hình chi tiết đối tác.

### Kịch bản 3: Ngăn chặn lưu trùng lặp Mã Số Thuế (BP-BR-002)
- **Cho** Hệ thống đã tồn tại một đối tác có Mã số thuế là "0101234567". Người dùng đang ở trang tạo mới đối tác.
- **Khi** Người dùng tạo một đối tác doanh nghiệp mới và nhập Mã số thuế là "0101234567" rồi nhấn nút "Save".
- **Thì** Hệ thống ngăn chặn không cho lưu và hiển thị thông báo lỗi trùng mã số thuế.

### Kịch bản 4: Hiển thị có điều kiện Tab Cộng tác viên (BP-BR-003)
- **Cho** Người dùng đang ở trang tạo mới đối tác.
- **Khi** Người dùng tích chọn vào vai trò "CTV (Collaborator)" dưới mục Vai trò áp dụng.
- **Thì** Hệ thống hiển thị thêm tab "Cộng tác viên" bên cạnh các tab khác.
- **Khi** Người dùng bỏ tích chọn vai trò "CTV (Collaborator)".
- **Thì** Tab "Cộng tác viên" sẽ lập tức biến mất khỏi giao diện.
