# 🧪 MoveX E2E Tests

Bộ kiểm thử tự động End-to-End cho dự án MoveX, sử dụng [Playwright](https://playwright.dev/).

---

## ⚡ Bắt đầu nhanh (dành cho Tester)

### Yêu cầu
- **Node.js** >= 18.x
- **Frontend** đang chạy (hoặc truy cập staging URL)
- **Backend API** đang chạy và có dữ liệu test

### Cài đặt (chỉ lần đầu)

```bash
npm install
npm run install:browsers
```

### Cấu hình

```bash
# Copy file cấu hình môi trường
cp .env.example .env

# Mở .env và điền thông tin đăng nhập thật
# ⚠️ KHÔNG commit file .env vào git
```

### Chạy test

```bash
# Chạy smoke tests (nhanh, ~5 phút)
npm run test:smoke

# Chạy regression tests (~30 phút)
npm run test:regression

# Chạy tất cả tests (headless)
npm test

# Chạy test có hiện trình duyệt (để quan sát)
npm run test:headed

# Chạy test module cụ thể
npm run test:vehicle
npm run test:bp
npm run test:pricing

# Mở Playwright UI (giao diện đồ họa, rất tiện debug)
npm run test:ui

# Chạy ở chế độ debug
npm run test:debug
```

### Xem báo cáo

```bash
npm run report           # Mở Playwright HTML report
npm run report:dashboard # Tạo markdown dashboard
```

---

## 🔧 Cấu hình

### Thay đổi URL server

```bash
# Cách 1: Dùng biến môi trường
BASE_URL=https://staging.movex.vn npm test

# Cách 2: Sửa file .env → BASE_URL
```

### Thay đổi tài khoản test

```bash
# Sửa file .env → TEST_EMAIL, TEST_PASSWORD
```

---

## 📁 Cấu trúc thư mục

```
movex-e2e-tests/
├── .env.example              # Template cấu hình môi trường
├── .github/workflows/        # CI/CD pipelines
├── GUIDELINE.md              # Quy trình & phân role (BA/AI/DEV)
├── README.md                 # ← File này
├── package.json              # Dependencies & scripts
├── playwright.config.js      # Cấu hình Playwright
│
├── pages/                    # 📦 Page Object Models
│   ├── base.page.js          #   Base class (smart waits, toast, modal)
│   ├── login.page.js         #   Login page
│   ├── list.page.js          #   Generic list page
│   ├── form.page.js          #   Generic form page
│   ├── index.js              #   Barrel exports
│   └── components/           #   AntD component wrappers
│       ├── ant-select.js     #     Select dropdown
│       └── ant-table.js      #     Data table
│
├── helpers/                  # 🛠️ Utilities
│   ├── auth.js               #   Login helper + API logger
│   ├── env.js                #   Centralized env config
│   ├── global-setup.js       #   Login once, save session
│   ├── module-reporter.js    #   Custom Playwright reporter
│   └── generate-dashboard.js #   HTML dashboard generator
│
├── specs/                    # 🧪 Test specifications (40 modules)
│   ├── business-partner/     #   BP: 7 tests ✅
│   ├── vehicle/              #   Vehicle: 12 tests ✅
│   ├── pricing/              #   Pricing: ~10 tests ✅
│   ├── work-order/           #   WO: 20 tests ✅
│   └── ...                   #   (see Module Status below)
│
└── reports/                  # 📊 Test reports & evidence
    ├── html/                 #   Playwright HTML report
    ├── modules/              #   Per-module JSON reports
    ├── screenshots/          #   Test screenshots
    └── dashboard.md          #   Summary dashboard
```

---

## 📋 Module Status

### ✅ Modules có test thực chất (12/40)

| # | Module | Tests | System |
|:---:|:---|:---:|:---|
| 1 | Business Partner | 7 | Tenant-Admin / Master-data |
| 2 | Vehicle | 12 | Tenant-Admin / Master-data |
| 3 | Administrative Info | 4 | Tenant-Admin / Master-data |
| 4 | Source Master | 4 | Tenant-Admin / Master-data |
| 5 | Toll Station | 4 | Tenant-Admin / Master-data |
| 6 | Routing | 4 | Tenant-Admin / Master-data |
| 7 | Cost | 2+ | Tenant-Admin / Master-data |
| 8 | Services | 2+ | Tenant-Admin / Master-data |
| 9 | Pricing | ~10 | Tenant-Admin / Master-data |
| 10 | Vendor Tariff | 8 | Tenant-Admin / Master-data |
| 11 | Tenant Management | 5 | Platform-Admin |
| 12 | Work Order | 20 | Tenant-Operation / OMS |

### ⏳ Modules có scaffold (cần bổ sung tests)

Customer Request, Quotation, Purchase Order, Internal Order, Trucking Order, Trucking Planning, POD Management, Fleet Management, TMS Work Order, Common Code, User Management, Authorization, Organization, Plan Management, Subscription

### 🔲 Modules chờ UI (test skipped)

Exchange Rate, Currency, Unit of Measure, Settings, Inventory, Customs Job, Freight Job, Driver Management, Driver Salary, Maintenance, Fuel, Charging, Replacement

---

## 📖 Tài liệu liên quan

- [GUIDELINE.md](./GUIDELINE.md) — Quy trình test & phân role (BA / AI / DEV)
- [Dashboard](./reports/dashboard.md) — Tổng quan test results
- [HTML Report](./reports/html/index.html) — Interactive test report
