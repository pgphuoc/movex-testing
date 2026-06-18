// @ts-check
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname, '..', 'reports');
const REGISTRY_FILE = path.join(REPORT_DIR, 'test-registry.json');
const RESULTS_FILE = path.join(REPORT_DIR, 'results.json');
const HTML_FILE = path.join(REPORT_DIR, 'html', 'index.html');

// Danh sách toàn bộ các module trong hệ thống MoveX theo đúng sort order của AGENTS.md
const MASTER_MODULES = [
  // 00. Platform-Admin
  { id: 'tenant-management', name: 'Tenant Management', system: 'Platform-Admin', specFile: 'specs/tenant-management/tenant-management.spec.js', status: 'ACTIVE' },
  { id: 'plan-management', name: 'Plan Management', system: 'Platform-Admin', specFile: 'specs/plan-management/plan-management.spec.js', status: 'ACTIVE' },
  { id: 'subscription', name: 'Subscription', system: 'Platform-Admin', specFile: 'specs/subscription/subscription.spec.js', status: 'ACTIVE' },

  // 10. Tenant-Admin / Master Data
  { id: 'business-partner', name: 'Business Partner', system: 'Tenant-Admin / Master-data', specFile: 'specs/business-partner/business-partner.spec.js', status: 'ACTIVE' },
  { id: 'vehicle', name: 'Vehicle', system: 'Tenant-Admin / Master-data', specFile: 'specs/vehicle/vehicle-list.spec.js', status: 'ACTIVE' },
  { id: 'administrative-info', name: 'Administrative Info', system: 'Tenant-Admin / Master-data', specFile: 'specs/administrative-info/administrative-info.spec.js', status: 'ACTIVE' },
  { id: 'source-master', name: 'Source Master', system: 'Tenant-Admin / Master-data', specFile: 'specs/source-master/source-master.spec.js', status: 'ACTIVE' },
  { id: 'toll-station', name: 'Toll Station', system: 'Tenant-Admin / Master-data', specFile: 'specs/toll-station/toll-station.spec.js', status: 'ACTIVE' },
  { id: 'routing', name: 'Routing', system: 'Tenant-Admin / Master-data', specFile: 'specs/routing/routing.spec.js', status: 'ACTIVE' },
  { id: 'services', name: 'Service', system: 'Tenant-Admin / Master-data', specFile: 'specs/services/services.spec.js', status: 'ACTIVE' },
  { id: 'cost', name: 'Cost', system: 'Tenant-Admin / Master-data', specFile: 'specs/cost/cost.spec.js', status: 'ACTIVE' },
  { id: 'pricing', name: 'Pricing', system: 'Tenant-Admin / Master-data', specFile: 'specs/pricing/pricing.spec.js', status: 'ACTIVE' },
  { id: 'vendor-tariff', name: 'Vendor Tariff', system: 'Tenant-Admin / Master-data', specFile: 'specs/vendor-tariff/vendor-tariff.spec.js', status: 'ACTIVE' },
  { id: 'common-codes', name: 'Common Code', system: 'Tenant-Admin / Master-data', specFile: 'specs/common-codes/common-codes.spec.js', status: 'ACTIVE' },
  { id: 'exchange-rate', name: 'Exchange Rate', system: 'Tenant-Admin / Master-data', specFile: 'specs/exchange-rate/exchange-rate.spec.js', status: 'ACTIVE' },
  { id: 'currency', name: 'Currency', system: 'Tenant-Admin / Master-data', specFile: 'specs/currency/currency.spec.js', status: 'ACTIVE' },
  { id: 'unit-of-measure', name: 'Unit of Measure', system: 'Tenant-Admin / Master-data', specFile: 'specs/unit-of-measure/unit-of-measure.spec.js', status: 'ACTIVE' },
  { id: 'user-management', name: 'User Management', system: 'Tenant-Admin / Master-data', specFile: 'specs/user-management/user-management.spec.js', status: 'ACTIVE' },
  { id: 'authorization', name: 'Authorization', system: 'Tenant-Admin / Master-data', specFile: 'specs/authorization/authorization.spec.js', status: 'ACTIVE' },
  { id: 'organization', name: 'Organization', system: 'Tenant-Admin / Master-data', specFile: 'specs/organization/organization.spec.js', status: 'ACTIVE' },
  { id: 'settings', name: 'Settings', system: 'Tenant-Admin / Master-data', specFile: null, status: 'PENDING' },

  // 20. Tenant-Operation / IM
  { id: 'inventory-master', name: 'Inventory (Kho)', system: 'Tenant-Operation / IM', specFile: 'specs/inventory-master/inventory-master.spec.js', status: 'ACTIVE' },

  // 20. Tenant-Operation / OMS
  { id: 'customer-request', name: 'Customer request', system: 'Tenant-Operation / OMS', specFile: 'specs/customer-request/customer-request.spec.js', status: 'ACTIVE' },
  { id: 'quotation', name: 'Quotation', system: 'Tenant-Operation / OMS', specFile: 'specs/quotation/quotation.spec.js', status: 'ACTIVE' },
  { id: 'work-order', name: 'Work order', system: 'Tenant-Operation / OMS', specFile: 'specs/work-order/work-order.spec.js', status: 'ACTIVE' },
  { id: 'purchase-order', name: 'Purchase Order', system: 'Tenant-Operation / OMS', specFile: 'specs/purchase-order/purchase-order.spec.js', status: 'ACTIVE' },
  { id: 'internal-order', name: 'Internal Order', system: 'Tenant-Operation / OMS', specFile: 'specs/internal-order/internal-order.spec.js', status: 'ACTIVE' },
  { id: 'customs-job', name: 'Execution request: Customs Job', system: 'Tenant-Operation / OMS', specFile: null, status: 'PENDING' },
  { id: 'freight-job', name: 'Execution request: Freight Job', system: 'Tenant-Operation / OMS', specFile: null, status: 'PENDING' },

  // 20. Tenant-Operation / TMS
  { id: 'trucking-order', name: 'Trucking Order', system: 'Tenant-Operation / TMS', specFile: 'specs/trucking-order/trucking-order.spec.js', status: 'ACTIVE' },
  { id: 'trucking-planning', name: 'Trucking Planning', system: 'Tenant-Operation / TMS', specFile: 'specs/trucking-planning/trucking-planning.spec.js', status: 'ACTIVE' },
  { id: 'pod-management', name: 'Proof of Delivery', system: 'Tenant-Operation / TMS', specFile: 'specs/pod-management/pod-management.spec.js', status: 'ACTIVE' },
  { id: 'fleet-management', name: 'Fleet Management', system: 'Tenant-Operation / TMS', specFile: 'specs/fleet-management/fleet-management.spec.js', status: 'ACTIVE' },
  { id: 'tms-work-order', name: 'TMS Work Order List', system: 'Tenant-Operation / TMS', specFile: 'specs/tms-work-order/tms-work-order.spec.js', status: 'ACTIVE' },
  { id: 'driver-management', name: 'Driver Management', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' },
  { id: 'driver-salary', name: 'Driver Salary', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' },
  { id: 'maintenance', name: 'Maintenance Management', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' },
  { id: 'fuel', name: 'Fuel Management', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' },
  { id: 'charging', name: 'Electric Charging Management', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' },
  { id: 'replacement', name: 'Maintenance & Replacement', system: 'Tenant-Operation / TMS', specFile: null, status: 'PENDING' }
];

// Hàm tìm tất cả tests đệ quy từ file json kết quả của Playwright
function extractTests(suite, filePath = '') {
  let tests = [];
  const currentFile = suite.file || filePath;
  
  if (suite.specs) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const result = test.results && test.results[0];
        // Status map
        let status = 'skipped';
        if (test.status === 'expected') status = 'passed';
        else if (test.status === 'unexpected') status = 'failed';
        else if (test.status === 'skipped') status = 'skipped';
        else if (result && result.status) {
          status = result.status === 'passed' ? 'passed' : (result.status === 'failed' ? 'failed' : 'skipped');
        }

        const duration = result ? result.duration : 0;
        let error = null;
        if (result && result.errors && result.errors.length > 0) {
          error = result.errors.map(e => e.message || e.value).join('\n');
        }
        
        // Trích xuất screenshot
        let screenshot = null;
        if (result && result.attachments) {
          const attachment = result.attachments.find(a => a.name === 'screenshot' || (a.contentType && a.contentType.includes('image')));
          if (attachment) {
            screenshot = attachment.path;
          }
        }

        tests.push({
          title: spec.title,
          file: currentFile,
          status,
          duration,
          error,
          screenshot
        });
      }
    }
  }
  
  if (suite.suites) {
    for (const subSuite of suite.suites) {
      tests = tests.concat(extractTests(subSuite, currentFile));
    }
  }
  
  return tests;
}

// Khởi chạy quá trình xử lý
function main() {
  console.log('🔄 Đang bắt đầu tạo báo cáo Dashboard...');
  
  // 1. Tải Registry lịch sử (nếu có)
  let registry = {};
  if (fs.existsSync(REGISTRY_FILE)) {
    try {
      registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
      console.log('📜 Tìm thấy registry kiểm thử lịch sử.');
    } catch (e) {
      console.warn('⚠️ Lỗi khi đọc file registry cũ, tạo mới:', e.message);
    }
  }

  // Khởi tạo các module chưa có trong registry
  for (const m of MASTER_MODULES) {
    if (!registry[m.id]) {
      registry[m.id] = {
        ...m,
        tests: [],
        lastRun: null,
        summary: { passed: 0, failed: 0, skipped: 0, total: 0 }
      };
    }
  }

  // 2. Đọc kết quả mới từ kết quả chạy Playwright
  if (fs.existsSync(RESULTS_FILE)) {
    try {
      const resultsData = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
      const allTestsRun = [];
      
      if (resultsData.suites) {
        for (const suite of resultsData.suites) {
          allTestsRun.push(...extractTests(suite));
        }
      }

      console.log(`📊 Đã phân tích được ${allTestsRun.length} test cases từ kết quả chạy mới.`);

      // Nhóm test cases theo file spec
      const testsByFile = {};
      for (const t of allTestsRun) {
        // Chuẩn hóa đường dẫn file (loại bỏ absolute prefix nếu có)
        let relFile = t.file;
        if (path.isAbsolute(relFile)) {
          relFile = path.relative(path.join(__dirname, '..'), relFile);
        }
        relFile = relFile.replace(/\\/g, '/'); // Chuẩn hóa dấu phân cách

        if (!testsByFile[relFile]) {
          testsByFile[relFile] = [];
        }
        testsByFile[relFile].push(t);
      }

      // Cập nhật kết quả vào registry cho các file spec đã thực sự chạy
      const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      for (const mId in registry) {
        const m = registry[mId];
        if (m.specFile && testsByFile[m.specFile]) {
          const runTests = testsByFile[m.specFile];
          m.tests = runTests.map(rt => ({
            title: rt.title,
            status: rt.status,
            duration: rt.duration,
            error: rt.error,
            screenshot: rt.screenshot
          }));
          m.lastRun = nowStr;

          // Tính toán lại summary
          const passed = m.tests.filter(t => t.status === 'passed').length;
          const failed = m.tests.filter(t => t.status === 'failed').length;
          const skipped = m.tests.filter(t => t.status === 'skipped').length;
          
          m.summary = {
            passed,
            failed,
            skipped,
            total: m.tests.length
          };
          
          // Cập nhật trạng thái module thành ACTIVE hoặc PENDING dựa trên test cases
          if (m.tests.length > 0 && failed === 0 && passed > 0) {
            m.activeStatus = 'passed';
          } else if (failed > 0) {
            m.activeStatus = 'failed';
          } else if (skipped === m.tests.length) {
            m.activeStatus = 'skipped';
          } else {
            m.activeStatus = 'active';
          }
        }
      }
      
      // Lưu lại registry mới
      fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');
      console.log('💾 Đã lưu trữ cập nhật kết quả kiểm thử vào registry.');

    } catch (e) {
      console.error('❌ Lỗi khi phân tích results.json:', e);
    }
  } else {
    console.warn(`⚠️ Không tìm thấy file kết quả chạy mới tại ${RESULTS_FILE}. Sẽ sử dụng dữ liệu cũ từ registry.`);
  }

  // 3. Tính toán các chỉ số dashboard tổng hợp
  let totalModules = 0;
  let activeModules = 0;
  let passedModules = 0;
  let failedModules = 0;
  let skippedModules = 0;
  let untestedModules = 0;

  let totalTestCases = 0;
  let passedTestCases = 0;
  let failedTestCases = 0;
  let skippedTestCases = 0;
  let totalBugs = 0;

  const moduleItems = [];
  for (const key in registry) {
    const m = registry[key];
    totalModules++;
    moduleItems.push(m);

    if (m.specFile) {
      totalTestCases += m.summary.total;
      passedTestCases += m.summary.passed;
      failedTestCases += m.summary.failed;
      skippedTestCases += m.summary.skipped;
      totalBugs += m.summary.failed; // coi mỗi test case failed là một bug tiềm ẩn

      if (m.summary.total > 0) {
        activeModules++;
        if (m.summary.failed > 0) {
          failedModules++;
        } else if (m.summary.passed > 0) {
          passedModules++;
        } else {
          skippedModules++;
        }
      } else {
        untestedModules++;
      }
    } else {
      untestedModules++;
    }
  }

  // Sắp xếp moduleItems theo danh mục và ID để hiển thị đẹp
  moduleItems.sort((a, b) => {
    const systemsOrder = ['Platform-Admin', 'Tenant-Admin / Master-data', 'Tenant-Operation / IM', 'Tenant-Operation / OMS', 'Tenant-Operation / TMS'];
    const systemDiff = systemsOrder.indexOf(a.system) - systemsOrder.indexOf(b.system);
    if (systemDiff !== 0) return systemDiff;
    
    // Nếu cùng hệ thống, sắp xếp theo thứ tự khai báo trong danh sách MASTER
    const aIndex = MASTER_MODULES.findIndex(m => m.id === a.id);
    const bIndex = MASTER_MODULES.findIndex(m => m.id === b.id);
    return aIndex - bIndex;
  });

  // 4. Tạo giao diện HTML Premium Dashboard
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoveX Automation E2E Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #0b0f19;
      --card-bg: rgba(22, 28, 45, 0.6);
      --card-border: rgba(255, 255, 255, 0.05);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.15);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.15);
      --danger: #ef4444;
      --danger-glow: rgba(239, 68, 68, 0.15);
      --warning: #f59e0b;
      --warning-glow: rgba(245, 158, 11, 0.15);
      --info: #06b6d4;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.6;
      padding: 2.5rem;
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
    }

    header {
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 1.5rem;
    }

    .title-area h1 {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, var(--text-muted) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }

    .title-area p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .meta-badge {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pulse {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 0 0 var(--success-glow);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: transform 0.2s, border-color 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .stat-card.primary { border-left: 4px solid var(--primary); }
    .stat-card.success { border-left: 4px solid var(--success); }
    .stat-card.danger { border-left: 4px solid var(--danger); }
    .stat-card.warning { border-left: 4px solid var(--warning); }
    .stat-card.info { border-left: 4px solid var(--info); }

    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .stat-val {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .stat-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Filters & Controls */
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      max-width: 400px;
      min-width: 250px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      color: var(--text-main);
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .search-box svg {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      fill: var(--text-muted);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(22, 28, 45, 0.9);
      padding: 0.25rem;
      border-radius: 10px;
      border: 1px solid var(--card-border);
    }

    .filter-tab {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s, color 0.2s;
    }

    .filter-tab.active, .filter-tab:hover {
      background: var(--card-border);
      color: var(--text-main);
    }

    /* Module Board Table */
    .board-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      backdrop-filter: blur(12px);
      margin-bottom: 2rem;
    }

    .board-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .board-table th {
      background: rgba(15, 23, 42, 0.4);
      padding: 1rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--card-border);
    }

    .board-table td {
      padding: 1.25rem;
      border-bottom: 1px solid var(--card-border);
      vertical-align: middle;
    }

    .board-table tr:last-child td {
      border-bottom: none;
    }

    .board-table tr {
      transition: background-color 0.15s;
    }

    .board-table tr.module-row:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .badge-active { background: var(--primary-glow); color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.2); }
    .badge-pending { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .badge-passed { background: var(--success-glow); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); }
    .badge-failed { background: var(--danger-glow); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }
    .badge-skipped { background: rgba(156, 163, 175, 0.1); color: #d1d5db; border: 1px solid rgba(209, 213, 219, 0.2); }

    .module-name {
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-main);
    }

    .system-category {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      overflow: hidden;
      min-width: 100px;
    }

    .progress-fill {
      height: 100%;
      border-radius: 9999px;
    }

    .progress-fill.passed { background: var(--success); }
    .progress-fill.failed { background: var(--danger); }
    .progress-fill.skipped { background: var(--warning); }

    .progress-txt {
      font-size: 0.8rem;
      font-weight: 600;
      min-width: 40px;
    }

    .btn-toggle {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      border-radius: 8px;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s;
    }

    .btn-toggle:hover {
      background: var(--card-border);
      color: var(--text-main);
    }

    /* Detailed Test List (Nested) */
    .detail-row {
      background: rgba(15, 23, 42, 0.25);
    }

    .detail-row td {
      padding: 0 1.25rem;
    }

    .detail-container {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), padding 0.3s ease;
      padding: 0;
    }

    .detail-container.open {
      max-height: 2000px;
      padding: 1.25rem 0;
      transition: max-height 0.3s cubic-bezier(1, 0, 1, 0), padding 0.3s ease;
    }

    .test-cases-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-left: 1.5rem;
      border-left: 2px solid var(--card-border);
    }

    .test-case-item {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 1rem;
    }

    .test-case-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .test-case-title {
      font-weight: 600;
      font-size: 0.92rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .test-case-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .error-log {
      margin-top: 0.75rem;
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.15);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      color: #fca5a5;
      font-family: monospace;
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .screenshot-link {
      color: var(--info);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.8rem;
      margin-top: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .screenshot-link:hover {
      text-decoration: underline;
    }

    .screenshot-preview {
      margin-top: 0.75rem;
      max-width: 100%;
      max-height: 350px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      display: block;
    }

    /* Bug registry section */
    .bugs-section {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bugs-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bug-item {
      background: rgba(239, 68, 68, 0.03);
      border: 1px solid rgba(239, 68, 68, 0.1);
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .bug-info h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fca5a5;
      margin-bottom: 0.2rem;
    }

    .bug-info p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Responsive */
    @media (max-width: 768px) {
      body {
        padding: 1.25rem;
      }
      header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .controls {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        max-width: none;
      }
    }
  </style>
</head>
<body>

  <header>
    <div class="title-area">
      <h1>MoveX E2E Test Dashboard</h1>
      <p>Hệ thống giám sát kiểm thử tự động toàn diện dành cho Business Analyst</p>
    </div>
    <div class="meta-badge">
      <div class="pulse"></div>
      <span>Cập nhật: <strong id="update-time">${new Date().toLocaleString('vi-VN')}</strong></span>
    </div>
  </header>

  <!-- Stats Grid -->
  <section class="stats-grid">
    <div class="stat-card primary">
      <div class="stat-label">Tổng số Module</div>
      <div class="stat-val">${totalModules}</div>
      <div class="stat-sub">Toàn bộ Platform</div>
    </div>
    <div class="stat-card success">
      <div class="stat-label">Module Đã Kiểm Thử</div>
      <div class="stat-val">${activeModules}</div>
      <div class="stat-sub">Đã thiết lập kịch bản E2E</div>
    </div>
    <div class="stat-card warning">
      <div class="stat-label">Module Chưa Kiểm Thử</div>
      <div class="stat-val">${untestedModules}</div>
      <div class="stat-sub">Sắp triển khai kịch bản</div>
    </div>
    <div class="stat-card info">
      <div class="stat-label">Độ Phủ (Coverage)</div>
      <div class="stat-val">${((activeModules / totalModules) * 100).toFixed(1)}%</div>
      <div class="stat-sub">Tỷ lệ bao phủ kiểm thử</div>
    </div>
    <div class="stat-card danger">
      <div class="stat-label">Lỗi Hệ Thống (Bugs)</div>
      <div class="stat-val" style="color: ${totalBugs > 0 ? 'var(--danger)' : 'var(--success)'}">${totalBugs}</div>
      <div class="stat-sub">Kịch bản lỗi phát hiện</div>
    </div>
  </section>

  <!-- Controls -->
  <section class="controls">
    <div class="search-box">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" id="search-input" placeholder="Tìm kiếm module..." oninput="filterModules()">
    </div>
    
    <div class="filter-tabs">
      <button class="filter-tab active" onclick="setFilter('all', this)">Tất cả (${totalModules})</button>
      <button class="filter-tab" onclick="setFilter('active', this)">Đã test (${activeModules})</button>
      <button class="filter-tab" onclick="setFilter('failed', this)">Lỗi (${failedModules})</button>
      <button class="filter-tab" onclick="setFilter('pending', this)">Chưa test (${untestedModules})</button>
    </div>
  </section>

  <!-- Bugs Section -->
  ${totalBugs > 0 ? `
  <section class="bugs-section">
    <div class="section-title">
      <span style="color: var(--danger)">🐞</span> Nhật ký lỗi phát hiện (Bugs Registry)
    </div>
    <div class="bugs-list">
      ${moduleItems.filter(m => m.summary.failed > 0).map(m => `
        ${m.tests.filter(t => t.status === 'failed').map(t => `
          <div class="bug-item">
            <div class="bug-info">
              <h4>${m.name} — ${t.title}</h4>
              <p>Mã lỗi/Exception chi tiết được lưu trong test report chi tiết bên dưới.</p>
            </div>
            <span class="badge badge-failed">Bug</span>
          </div>
        `).join('')}
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Module Board -->
  <section class="board-container">
    <table class="board-table">
      <thead>
        <tr>
          <th style="width: 25%;">Hệ thống / Module</th>
          <th style="width: 15%; text-align: center;">Trạng thái kịch bản</th>
          <th style="width: 30%; text-align: center;">Chỉ số kiểm thử</th>
          <th style="width: 15%; text-align: center;">Chạy lần cuối</th>
          <th style="width: 15%; text-align: right;">Thao tác</th>
        </tr>
      </thead>
      <tbody id="module-rows">
        ${moduleItems.map((m, index) => {
          let badgeClass = 'badge-pending';
          let badgeText = 'Chưa kiểm thử';
          if (m.specFile) {
            badgeClass = 'badge-active';
            badgeText = 'Đã có kịch bản';
            if (m.summary.total > 0) {
              if (m.summary.failed > 0) {
                badgeClass = 'badge-failed';
                badgeText = 'Thất bại';
              } else if (m.summary.passed > 0) {
                badgeClass = 'badge-passed';
                badgeText = 'Đạt';
              } else {
                badgeClass = 'badge-skipped';
                badgeText = 'Bỏ qua';
              }
            }
          }

          const hasTests = m.tests && m.tests.length > 0;
          const total = m.summary.total;
          const passed = m.summary.passed;
          const failed = m.summary.failed;
          const skipped = m.summary.skipped;
          
          const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
          
          let fillClass = 'passed';
          if (failed > 0) fillClass = 'failed';
          else if (skipped === total && total > 0) fillClass = 'skipped';

          return `
            <tr class="module-row" data-id="${m.id}" data-system="${m.system}" data-status="${m.specFile ? (m.summary.total > 0 ? (m.summary.failed > 0 ? 'failed' : 'active') : 'active') : 'pending'}">
              <td>
                <div class="module-name">${m.name}</div>
                <div class="system-category">${m.system}</div>
              </td>
              <td style="text-align: center;">
                <span class="badge ${badgeClass}">${badgeText}</span>
              </td>
              <td>
                ${total > 0 ? `
                  <div class="progress-bar-container">
                    <div class="progress-bar">
                      <div class="progress-fill ${fillClass}" style="width: ${passRate}%;"></div>
                    </div>
                    <span class="progress-txt">${passed}/${total} Đạt (${passRate}%)</span>
                  </div>
                ` : `
                  <span style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Chưa chạy kiểm thử</span>
                `}
              </td>
              <td style="text-align: center; font-size: 0.85rem; color: var(--text-muted);">
                ${m.lastRun || 'Chưa chạy'}
              </td>
              <td style="text-align: right;">
                ${hasTests ? `
                  <button class="btn-toggle" onclick="toggleDetails('${m.id}')">
                    <span>Xem kịch bản</span>
                    <svg style="width: 12px; height: 12px; fill: currentColor;" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                  </button>
                ` : `
                  <span style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Không có log chi tiết</span>
                `}
              </td>
            </tr>
            ${hasTests ? `
              <tr class="detail-row" data-id="details-${m.id}" style="display: none;">
                <td colspan="5">
                  <div class="detail-container" id="container-${m.id}">
                    <div class="test-cases-list">
                      ${m.tests.map(t => {
                        let tBadge = 'badge-passed';
                        if (t.status === 'failed') tBadge = 'badge-failed';
                        if (t.status === 'skipped') tBadge = 'badge-skipped';
                        
                        return `
                          <div class="test-case-item">
                            <div class="test-case-header">
                              <div class="test-case-title">
                                <span class="badge ${tBadge}">${t.status}</span>
                                <strong>${t.title}</strong>
                              </div>
                              <div class="test-case-meta">
                                <span>Thời gian: <strong>${(t.duration / 1000).toFixed(2)}s</strong></span>
                              </div>
                            </div>
                            ${t.error ? `
                              <div class="error-log">${t.error}</div>
                            ` : ''}
                            ${t.screenshot ? `
                              <div>
                                <a href="../${t.screenshot}" target="_blank" class="screenshot-link">
                                  <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                                  <span>Xem ảnh chụp màn hình (Screenshot)</span>
                                </a>
                                <img src="../${t.screenshot}" class="screenshot-preview" alt="Test Screenshot">
                              </div>
                            ` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </td>
              </tr>
            ` : ''}
          `;
        }).join('')}
      </tbody>
    </table>
  </section>

  <script>
    let currentFilter = 'all';

    function setFilter(filter, el) {
      currentFilter = filter;
      document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
      el.classList.add('active');
      filterModules();
    }

    function toggleDetails(id) {
      const detailRow = document.querySelector(\`[data-id="details-\${id}"]\`);
      const container = document.getElementById(\`container-\${id}\`);
      
      if (detailRow.style.display === 'none') {
        detailRow.style.display = 'table-row';
        setTimeout(() => container.classList.add('open'), 10);
      } else {
        container.classList.remove('open');
        setTimeout(() => {
          detailRow.style.display = 'none';
        }, 300);
      }
    }

    function filterModules() {
      const searchVal = document.getElementById('search-input').value.toLowerCase();
      const rows = document.querySelectorAll('.module-row');
      
      rows.forEach(row => {
        const id = row.getAttribute('data-id');
        const system = row.getAttribute('data-system').toLowerCase();
        const status = row.getAttribute('data-status');
        const name = row.querySelector('.module-name').textContent.toLowerCase();
        const detailRow = document.querySelector(\`[data-id="details-\${id}"]\`);
        
        let matchSearch = name.includes(searchVal) || system.includes(searchVal);
        let matchFilter = true;

        if (currentFilter === 'active') {
          matchFilter = status === 'active' || status === 'failed';
        } else if (currentFilter === 'failed') {
          matchFilter = status === 'failed';
        } else if (currentFilter === 'pending') {
          matchFilter = status === 'pending';
        }

        if (matchSearch && matchFilter) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
          if (detailRow) {
            detailRow.style.display = 'none';
            const container = document.getElementById(\`container-\${id}\`);
            if (container) container.classList.remove('open');
          }
        }
      });
    }
  </script>

</body>
</html>`;

  // Ghi file index.html
  const htmlDir = path.dirname(HTML_FILE);
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }
  
  fs.writeFileSync(HTML_FILE, htmlContent, 'utf8');
  console.log(`🎉 Tạo báo cáo Dashboard thành công tại: ${HTML_FILE}`);
}

main();
