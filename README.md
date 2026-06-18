# 🧪 MoveX E2E Tests

Bộ kiểm thử tự động End-to-End cho dự án MoveX, sử dụng [Playwright](https://playwright.dev/).

---

## ⚡ Bắt đầu nhanh (dành cho Tester)

### Yêu cầu
- **Node.js** >= 18.x
- **Frontend** đang chạy tại `http://localhost:3000`
- **Backend API** đang chạy và có dữ liệu test

### Cài đặt (chỉ lần đầu)

```bash
cd e2e
npm install
npm run install:browsers
```

### Chạy test

```bash
# Chạy tất cả tests (headless - không hiện trình duyệt)
npm test

# Chạy test có hiện trình duyệt (để quan sát)
npm run test:headed

# Chạy test module Vehicle
npm run test:vehicle

# Mở Playwright UI (giao diện đồ họa, rất tiện debug)
npm run test:ui

# Chạy ở chế độ debug (dừng từng bước)
npm run test:debug
```

### Xem báo cáo

```bash
npm run report
```

---

## 🔧 Cấu hình

### Thay đổi URL server

```bash
# Cách 1: Dùng biến môi trường
BASE_URL=http://192.168.1.100:3000 npm test

# Cách 2: Sửa file playwright.config.js → baseURL
```

### Thay đổi tài khoản test

```bash
# Cách 1: Dùng biến môi trường
TEST_EMAIL=tester@example.com TEST_PASSWORD=abc123 npm test

# Cách 2: Sửa file helpers/auth.js → TEST_ACCOUNTS
```

---

## 📁 Cấu trúc thư mục

```
e2e/
├── GUIDELINE.md              # Quy trình & phân role (BA/AI/DEV)
├── README.md                 # ← File này
├── package.json              # Dependencies
├── playwright.config.js      # Cấu hình Playwright
├── helpers/
│   └── auth.js               # Hàm đăng nhập dùng chung
├── specs/
│   └── vehicle/
│       ├── vehicle-list.spec.js     # Test scripts (chạy được)
│       └── vehicle-test-cases.md    # Danh sách test cases (tài liệu)
├── reports/
│   ├── vehicle-test-report-*.md     # Báo cáo test (.md)
│   ├── vehicle-test-report-*.pdf    # Báo cáo test (.pdf)
│   └── vehicle-*.png                # Ảnh chụp minh chứng
└── workflow-diagram.png             # Sơ đồ quy trình
```

---

## 📋 Danh sách Module đã có test

| Module | File test | Trạng thái |
|--------|-----------|------------|
| **Vehicle** | `specs/vehicle/vehicle-list.spec.js` | ✅ Sẵn sàng |
| Business Partner | — | ⏳ Đang phát triển |
| Administrative Info | — | ⏳ Đang phát triển |

---

## 📖 Tài liệu liên quan

- [GUIDELINE.md](./GUIDELINE.md) — Quy trình test & phân role (BA / AI / DEV)
- [Báo cáo Vehicle](./reports/vehicle-test-report-2026-05-12.md) — Kết quả test Vehicle module
- [Test Cases Vehicle](./specs/vehicle/vehicle-test-cases.md) — 58 test cases chi tiết
