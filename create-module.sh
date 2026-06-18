#!/bin/bash

# ===================================================================
# MoveX E2E — Tạo test mới cho module
# Cách dùng: ./create-module.sh <tên-module> <đường-dẫn-url>
#
# Ví dụ:
#   ./create-module.sh business-partner business-partner
#   ./create-module.sh toll-station toll-station
#   ./create-module.sh cost-group cost/group
# ===================================================================

MODULE_SLUG="$1"    # VD: business-partner
URL_PATH="$2"       # VD: business-partner

if [ -z "$MODULE_SLUG" ] || [ -z "$URL_PATH" ]; then
  echo ""
  echo "❌ Thiếu tham số!"
  echo ""
  echo "Cách dùng:"
  echo "  ./create-module.sh <tên-module> <đường-dẫn-url>"
  echo ""
  echo "Ví dụ:"
  echo "  ./create-module.sh business-partner business-partner"
  echo "  ./create-module.sh toll-station toll-station"
  echo "  ./create-module.sh cost-group cost/group"
  echo ""
  exit 1
fi

# Tạo thư mục
SPEC_DIR="specs/$MODULE_SLUG"
mkdir -p "$SPEC_DIR"

# Copy template
SPEC_FILE="$SPEC_DIR/$MODULE_SLUG.spec.js"

if [ -f "$SPEC_FILE" ]; then
  echo "⚠️  File $SPEC_FILE đã tồn tại. Bỏ qua."
else
  # Chuyển slug thành tên hiển thị (business-partner → Business Partner)
  MODULE_NAME=$(echo "$MODULE_SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')

  cp helpers/_template.spec.js "$SPEC_FILE"

  # Thay thế placeholder
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|\[TÊN MODULE\]|$MODULE_NAME|g" "$SPEC_FILE"
    sed -i '' "s|\[đường-dẫn\]|$URL_PATH|g" "$SPEC_FILE"
    sed -i '' "s|\[FILE\]|$MODULE_NAME|g" "$SPEC_FILE"
  else
    # Linux
    sed -i "s|\[TÊN MODULE\]|$MODULE_NAME|g" "$SPEC_FILE"
    sed -i "s|\[đường-dẫn\]|$URL_PATH|g" "$SPEC_FILE"
    sed -i "s|\[FILE\]|$MODULE_NAME|g" "$SPEC_FILE"
  fi

  echo "✅ Đã tạo: $SPEC_FILE"
fi

# Tạo file test cases markdown
TC_FILE="$SPEC_DIR/$MODULE_SLUG-test-cases.md"
if [ -f "$TC_FILE" ]; then
  echo "⚠️  File $TC_FILE đã tồn tại. Bỏ qua."
else
  MODULE_NAME=$(echo "$MODULE_SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')

  cat > "$TC_FILE" << EOF
# 📝 Test Cases — $MODULE_NAME

> **Module:** $MODULE_NAME
> **URL:** /master-data/$URL_PATH
> **Ngày tạo:** $(date +%Y-%m-%d)
> **Người tạo:** [Tên]

---

## Tham chiếu chéo

| Nguồn | File | Đã đọc |
|-------|------|--------|
| Đặc tả màn hình | \`input/11 Screen Specification/...\` | ☐ |
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
EOF

  echo "✅ Đã tạo: $TC_FILE"
fi

echo ""
echo "📋 Bước tiếp theo:"
echo "  1. Mở $SPEC_FILE và thêm test cases cụ thể"
echo "  2. Mở $TC_FILE và bổ sung test cases từ đặc tả BA"
echo "  3. Chạy test:  npx playwright test specs/$MODULE_SLUG/"
echo ""
