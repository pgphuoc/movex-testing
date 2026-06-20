// @ts-check
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname, '..', 'reports');
const REGISTRY_FILE = path.join(REPORT_DIR, 'test-registry.json');
const RESULTS_FILE = path.join(REPORT_DIR, 'results.json');
const HTML_FILE = path.join(REPORT_DIR, 'html', 'index.html');

function getRelativeLink(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('reports/')) {
    return '../' + filePath.substring(8);
  }
  return '../../' + filePath;
}


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
  { id: 'settings', name: 'Settings', system: 'Tenant-Admin / Master-data', specFile: 'specs/settings/settings.spec.js', status: 'ACTIVE' },

  // 20. Tenant-Operation / IM
  { id: 'inventory-master', name: 'Inventory (Kho)', system: 'Tenant-Operation / IM', specFile: 'specs/inventory-master/inventory-master.spec.js', status: 'ACTIVE' },

  // 20. Tenant-Operation / OMS
  { id: 'customer-request', name: 'Customer request', system: 'Tenant-Operation / OMS', specFile: 'specs/customer-request/customer-request.spec.js', status: 'ACTIVE' },
  { id: 'quotation', name: 'Quotation', system: 'Tenant-Operation / OMS', specFile: 'specs/quotation/quotation.spec.js', status: 'ACTIVE' },
  { id: 'work-order', name: 'Work order', system: 'Tenant-Operation / OMS', specFile: 'specs/work-order/work-order.spec.js', status: 'ACTIVE' },
  { id: 'purchase-order', name: 'Purchase Order', system: 'Tenant-Operation / OMS', specFile: 'specs/purchase-order/purchase-order.spec.js', status: 'ACTIVE' },
  { id: 'internal-order', name: 'Internal Order', system: 'Tenant-Operation / OMS', specFile: 'specs/internal-order/internal-order.spec.js', status: 'ACTIVE' },
  { id: 'customs-job', name: 'Execution request: Customs Job', system: 'Tenant-Operation / OMS', specFile: 'specs/customs-job/customs-job.spec.js', status: 'ACTIVE' },
  { id: 'freight-job', name: 'Execution request: Freight Job', system: 'Tenant-Operation / OMS', specFile: 'specs/freight-job/freight-job.spec.js', status: 'ACTIVE' },

  // 20. Tenant-Operation / TMS
  { id: 'trucking-order', name: 'Trucking Order', system: 'Tenant-Operation / TMS', specFile: 'specs/trucking-order/trucking-order.spec.js', status: 'ACTIVE' },
  { id: 'trucking-planning', name: 'Trucking Planning', system: 'Tenant-Operation / TMS', specFile: 'specs/trucking-planning/trucking-planning.spec.js', status: 'ACTIVE' },
  { id: 'pod-management', name: 'Proof of Delivery', system: 'Tenant-Operation / TMS', specFile: 'specs/pod-management/pod-management.spec.js', status: 'ACTIVE' },
  { id: 'fleet-management', name: 'Fleet Management', system: 'Tenant-Operation / TMS', specFile: 'specs/fleet-management/fleet-management.spec.js', status: 'ACTIVE' },
  { id: 'tms-work-order', name: 'TMS Work Order List', system: 'Tenant-Operation / TMS', specFile: 'specs/tms-work-order/tms-work-order.spec.js', status: 'ACTIVE' },
  { id: 'driver-management', name: 'Driver Management', system: 'Tenant-Operation / TMS', specFile: 'specs/driver-management/driver-management.spec.js', status: 'ACTIVE' },
  { id: 'driver-salary', name: 'Driver Salary', system: 'Tenant-Operation / TMS', specFile: 'specs/driver-salary/driver-salary.spec.js', status: 'ACTIVE' },
  { id: 'maintenance', name: 'Maintenance Management', system: 'Tenant-Operation / TMS', specFile: 'specs/maintenance/maintenance.spec.js', status: 'ACTIVE' },
  { id: 'fuel', name: 'Fuel Management', system: 'Tenant-Operation / TMS', specFile: 'specs/fuel/fuel.spec.js', status: 'ACTIVE' },
  { id: 'charging', name: 'Electric Charging Management', system: 'Tenant-Operation / TMS', specFile: 'specs/charging/charging.spec.js', status: 'ACTIVE' },
  { id: 'replacement', name: 'Maintenance & Replacement', system: 'Tenant-Operation / TMS', specFile: 'specs/replacement/replacement.spec.js', status: 'ACTIVE' }
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
        
        // Trích xuất screenshot, video & api-log
        let screenshot = null;
        let video = null;
        let apiLog = null;
        if (result && result.attachments) {
          let screenshotAttachment = result.attachments.find(a => a.path && a.path.includes('reports/screenshots'));
          if (!screenshotAttachment) {
            screenshotAttachment = result.attachments.find(a => a.name === 'screenshot' || (a.contentType && a.contentType.includes('image')));
          }
          if (screenshotAttachment) {
            screenshot = screenshotAttachment.path;
            if (path.isAbsolute(screenshot)) {
              screenshot = path.relative(path.join(__dirname, '..'), screenshot).replace(/\\/g, '/');
            }
          }
          const videoAttachment = result.attachments.find(a => a.name === 'video' || (a.contentType && a.contentType.includes('video')));
          if (videoAttachment) {
            video = videoAttachment.path;
            if (path.isAbsolute(video)) {
              video = path.relative(path.join(__dirname, '..'), video).replace(/\\/g, '/');
            }
          }
          const apiLogAttachment = result.attachments.find(a => a.name === 'api-log');
          if (apiLogAttachment) {
            if (apiLogAttachment.body) {
              apiLog = typeof apiLogAttachment.body === 'string' ? apiLogAttachment.body : apiLogAttachment.body.toString('utf8');
            } else if (apiLogAttachment.path) {
              try {
                apiLog = fs.readFileSync(apiLogAttachment.path, 'utf8');
              } catch (e) {
                console.warn('Could not read api-log attachment:', e.message);
              }
            }
          }
        }

        // Trích xuất lý do bỏ qua (skipReason) từ annotations
        let skipReason = null;
        if (test.annotations && test.annotations.length > 0) {
          const skipAnno = test.annotations.find(a => a.type === 'skip' || a.type === 'fixme');
          if (skipAnno) {
            skipReason = skipAnno.description || null;
          }
        }
        if (!skipReason && result && result.annotations && result.annotations.length > 0) {
          const skipAnno = result.annotations.find(a => a.type === 'skip' || a.type === 'fixme');
          if (skipAnno) {
            skipReason = skipAnno.description || null;
          }
        }

        tests.push({
          title: spec.title,
          file: currentFile,
          status,
          duration,
          error,
          screenshot,
          video,
          apiLog,
          skipReason,
          description: test.annotations?.find(a => a.type === 'description')?.description || null,
          preAction: test.annotations?.find(a => a.type === 'pre-action')?.description || null,
          testSteps: result?.steps || []
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
      
      // Làm sạch và chuyển đổi đường dẫn tuyệt đối sang tương đối
      for (const mId in registry) {
        const m = registry[mId];
        if (m.tests) {
          for (const t of m.tests) {
            if (t.screenshot && path.isAbsolute(t.screenshot)) {
              t.screenshot = path.relative(path.join(__dirname, '..'), t.screenshot).replace(/\\/g, '/');
            }
            if (t.video && path.isAbsolute(t.video)) {
              t.video = path.relative(path.join(__dirname, '..'), t.video).replace(/\\/g, '/');
            }
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ Lỗi khi đọc file registry cũ, tạo mới:', e.message);
    }
  }

  // Khởi tạo và đồng bộ các module từ MASTER_MODULES
  for (const m of MASTER_MODULES) {
    if (!registry[m.id]) {
      registry[m.id] = {
        ...m,
        tests: [],
        lastRun: null,
        summary: { passed: 0, failed: 0, skipped: 0, total: 0 }
      };
    } else {
      // Đồng bộ thông tin từ MASTER_MODULES để tránh dữ liệu cũ (ví dụ specFile: null)
      registry[m.id].name = m.name;
      registry[m.id].system = m.system;
      registry[m.id].specFile = m.specFile;
      registry[m.id].status = m.status;
    }
  }


  // 2. Đọc kết quả mới từ các file báo cáo module riêng lẻ
  const modulesDir = path.join(REPORT_DIR, 'modules');
  if (fs.existsSync(modulesDir)) {
    try {
      const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.json'));
      console.log(`📊 Đang nạp dữ liệu kiểm thử từ các file báo cáo module riêng lẻ tại ${modulesDir}...`);

      for (const file of files) {
        const filePath = path.join(modulesDir, file);
        try {
          const modData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const mId = modData.moduleId;

          if (registry[mId]) {
            const nowStr = modData.lastRun || new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            // Map screenshots & videos to relative paths from workspace root
            registry[mId].tests = modData.tests.map(rt => {
              let screenshot = rt.screenshot;
              if (screenshot && path.isAbsolute(screenshot)) {
                screenshot = path.relative(path.join(__dirname, '..'), screenshot).replace(/\\/g, '/');
              }
              let video = rt.video;
              if (video && path.isAbsolute(video)) {
                video = path.relative(path.join(__dirname, '..'), video).replace(/\\/g, '/');
              }

              // Handle Buffer or object apiLog (e.g. from older JSON reports)
              let apiLog = rt.apiLog;
              if (apiLog && typeof apiLog === 'object' && apiLog.type === 'Buffer' && Array.isArray(apiLog.data)) {
                apiLog = Buffer.from(apiLog.data).toString('utf8');
              } else if (apiLog && typeof apiLog === 'object') {
                apiLog = JSON.stringify(apiLog);
              }

              return {
                title: rt.title,
                status: rt.status,
                duration: rt.duration,
                error: rt.error,
                screenshot,
                video,
                apiLog,
                skipReason: rt.skipReason,
                description: rt.description,
                preAction: rt.preAction,
                testSteps: rt.testSteps
              };
            });
            registry[mId].lastRun = nowStr;

            // Tính toán lại summary
            const passed = registry[mId].tests.filter(t => t.status === 'passed').length;
            const failed = registry[mId].tests.filter(t => t.status === 'failed').length;
            const skipped = registry[mId].tests.filter(t => t.status === 'skipped').length;
            
            const total = registry[mId].tests.length;
            registry[mId].summary = {
              passed,
              failed,
              skipped,
              total
            };
            
            // Add to history for trend tracking
            if (!registry[mId].history) {
              registry[mId].history = [];
            }
            // Chỉ thêm history nếu có test cases (để tránh push data rỗng nhiều lần khi chưa có script)
            if (total > 0) {
              registry[mId].history.push({
                date: nowStr,
                passed,
                failed,
                skipped,
                total
              });
              // Giữ lại 30 lịch sử gần nhất để tối ưu kích thước file
              if (registry[mId].history.length > 30) {
                registry[mId].history.shift();
              }
            }
            
            if (registry[mId].tests.length > 0 && failed === 0 && passed > 0) {
              registry[mId].activeStatus = 'passed';
            } else if (failed > 0) {
              registry[mId].activeStatus = 'failed';
            } else if (skipped === registry[mId].tests.length) {
              registry[mId].activeStatus = 'skipped';
            } else {
              registry[mId].activeStatus = 'active';
            }
            console.log(`   - Nạp thành công [${mId}] từ ${file}`);
          }
        } catch (e) {
          console.error(`❌ Lỗi khi đọc file báo cáo module ${file}:`, e.message);
        }
      }
      
      // Lưu lại registry mới
      fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');
      console.log('💾 Đã lưu trữ cập nhật kết quả kiểm thử vào registry.');
      
    } catch (e) {
      console.error('❌ Lỗi khi quét thư mục báo cáo module:', e);
    }
  } else {
    console.warn(`⚠️ Không tìm thấy file kết quả chạy mới tại ${RESULTS_FILE}. Sẽ sử dụng dữ liệu cũ từ registry.`);
  }

  // 3. Tính toán các chỉ số dashboard tổng hợp
  let totalModules = 0;          // Total module cần viết (40)
  let modulesWithScript = 0;     // Total module đã có script (specFile !== null)
  let modulesWithoutScript = 0;  // Total module chưa có script (specFile === null)
  let modulesExecuted = 0;       // Total module đã chạy script (passed > 0 || failed > 0)
  let modulesNotExecuted = 0;    // Total module chưa chạy script (passed === 0 && failed === 0)
  let failedModules = 0;         // Số lượng module bị lỗi
  let totalBugs = 0;             // Số lượng bug tìm được (failed test cases count)

  let totalTestCases = 0;
  let passedTestCases = 0;
  let failedTestCases = 0;
  let skippedTestCases = 0;

  const moduleItems = [];
  for (const key in registry) {
    const m = registry[key];
    totalModules++;
    moduleItems.push(m);

    if (m.specFile) {
      modulesWithScript++;
      totalTestCases += m.summary.total;
      passedTestCases += m.summary.passed;
      failedTestCases += m.summary.failed;
      skippedTestCases += m.summary.skipped;
      totalBugs += m.summary.failed; // Số lượng bug tìm được

      const hasRun = m.summary.passed > 0 || m.summary.failed > 0;
      if (hasRun) {
        modulesExecuted++;
        if (m.summary.failed > 0) {
          failedModules++;
        }
      } else {
        modulesNotExecuted++;
      }
    } else {
      modulesWithoutScript++;
      modulesNotExecuted++;
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

  // 3.5 Prepare Data for Analytics (System Health & RCA)
  const systemData = {};
  for (const m of moduleItems) {
    if (!systemData[m.system]) systemData[m.system] = { passed: 0, failed: 0 };
    systemData[m.system].passed += m.summary.passed;
    systemData[m.system].failed += m.summary.failed;
  }
  const sysLabels = Object.keys(systemData);
  const sysPassed = sysLabels.map(s => systemData[s].passed);
  const sysFailed = sysLabels.map(s => systemData[s].failed);

  const errorPatterns = [
    { regex: /timeout|timed out|exceeded/i, category: 'Timeout & Performance' },
    { regex: /500|internal server error/i, category: 'Server Error (500)' },
    { regex: /401|403|unauthorized|forbidden/i, category: 'Auth & Permissions' },
    { regex: /404|not found/i, category: 'Not Found (404)' },
    { regex: /not visible|hidden|detached|intercepted/i, category: 'UI Element Not Interactable' },
    { regex: /expected.*to be|expected.*to have/i, category: 'Assertion Failed' },
    { regex: /network|ECONNREFUSED/i, category: 'Network Connection' }
  ];

  const rcaData = {};
  for (const m of moduleItems) {
    if (m.tests) {
      for (const t of m.tests) {
        if (t.status === 'failed' && t.error) {
          let cat = 'Unknown / Other Issues';
          for (const p of errorPatterns) {
            if (p.regex.test(t.error)) {
              cat = p.category;
              break;
            }
          }
          if (!rcaData[cat]) rcaData[cat] = { count: 0, tests: [] };
          rcaData[cat].count++;
          rcaData[cat].tests.push(`[${m.name}] ${t.title}`);
        }
      }
    }
  }
  const sortedRca = Object.entries(rcaData).sort((a, b) => b[1].count - a[1].count);

  // 4. Tạo giao diện HTML Premium Dashboard
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoveX Automation E2E Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

    .main-tab {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      padding: 1rem 1.5rem;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: -2px;
    }
    
    .main-tab.active {
      border-bottom-color: var(--primary);
      color: var(--text-main);
    }
    
    .main-tab:hover {
      color: var(--text-main);
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

  <!-- Tab Switcher -->
  <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--card-border); margin-bottom: 2rem;">
    <button class="main-tab active" id="tab-modules-btn" onclick="switchMainTab('modules')">
      📂 Báo Cáo Phân Hệ (Modules Board)
    </button>
    <button class="main-tab" id="tab-bugs-btn" onclick="switchMainTab('bugs')" style="display: flex; align-items: center; gap: 0.5rem;">
      🐞 Nhật Ký Lỗi (Bugs Log) <span style="background: var(--danger-glow); color: var(--danger); font-size: 0.8rem; padding: 0.1rem 0.5rem; border-radius: 9999px; font-weight: 800; border: 1px solid rgba(239, 68, 68, 0.2);">${totalBugs}</span>
    </button>
    <button class="main-tab" id="tab-analytics-btn" onclick="switchMainTab('analytics')">
      📈 Phân Tích Dữ Liệu (Analytics & RCA)
    </button>
  </div>

  <!-- Tab Modules Content Wrapper -->
  <div id="main-tab-modules-content">

    <!-- Stats Grid -->
    <section class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <div class="stat-card primary">
        <div class="stat-label">Tổng Module Cần Viết</div>
        <div class="stat-val">${totalModules}</div>
        <div class="stat-sub">Toàn bộ Platform</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Total Module Đã Có Script</div>
        <div class="stat-val">${modulesWithScript}</div>
        <div class="stat-sub">Đã thiết lập file kiểm thử</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Total Module Chưa Có Script</div>
        <div class="stat-val">${modulesWithoutScript}</div>
        <div class="stat-sub">Chưa có file kịch bản</div>
      </div>
      <div class="stat-card info">
        <div class="stat-label">Total Module Đã Chạy Script</div>
        <div class="stat-val">${modulesExecuted}</div>
        <div class="stat-sub">Đạt hoặc Thất bại thực tế</div>
      </div>
      <div class="stat-card warning" style="border-left: 4px solid var(--text-muted);">
        <div class="stat-label">Total Module Chưa Chạy Script</div>
        <div class="stat-val">${modulesNotExecuted}</div>
        <div class="stat-sub">Bỏ qua (skipped) hoặc chưa chạy</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Số Bug Tìm Được</div>
        <div class="stat-val" style="color: ${totalBugs > 0 ? 'var(--danger)' : 'var(--success)'}">${totalBugs}</div>
        <div class="stat-sub">Tổng số test cases failed</div>
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
        <button class="filter-tab" onclick="setFilter('active', this)">Đã chạy (${modulesExecuted})</button>
        <button class="filter-tab" onclick="setFilter('failed', this)">Lỗi (${failedModules})</button>
        <button class="filter-tab" onclick="setFilter('pending', this)">Chưa chạy (${modulesNotExecuted})</button>
      </div>
    </section>

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
            <tr class="module-row" data-id="${m.id}" data-system="${m.system}" data-status="${(m.summary.passed > 0 || m.summary.failed > 0) ? (m.summary.failed > 0 ? 'failed' : 'active') : 'pending'}">
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
                            ${t.description ? `
                              <div style="margin-top: 1rem; font-size: 0.95rem; color: #e2e8f0;">
                                <strong>📝 Mô tả kịch bản (Description):</strong> ${t.description}
                              </div>
                            ` : ''}
                            ${t.preAction ? `
                              <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #cbd5e1;">
                                <strong>🔧 Tiền điều kiện (Pre-action):</strong> ${t.preAction}
                              </div>
                            ` : ''}
                            ${t.testSteps && t.testSteps.length > 0 ? `
                              <div style="margin-top: 1rem; margin-bottom: 1rem;">
                                <div style="font-size: 0.9rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">📍 Thao tác từng bước (Step-by-step):</div>
                                <table class="board-table" style="font-size: 0.85rem; margin-bottom: 0;">
                                  <thead>
                                    <tr>
                                      <th style="width: 70%; padding: 0.5rem;">Bước thực hiện (Step)</th>
                                      <th style="width: 15%; padding: 0.5rem; text-align: right;">Thời gian (ms)</th>
                                      <th style="width: 15%; padding: 0.5rem; text-align: center;">Trạng thái</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${t.testSteps.map(step => `
                                      <tr>
                                        <td style="padding: 0.5rem; color: #e2e8f0;">
                                          <strong>${step.title}</strong>
                                          ${step.error ? `<div style="color: var(--danger); font-size: 0.8rem; margin-top: 0.25rem;">Lỗi: ${step.error}</div>` : ''}
                                        </td>
                                        <td style="padding: 0.5rem; text-align: right; color: #94a3b8;">${step.duration}</td>
                                        <td style="padding: 0.5rem; text-align: center;">
                                          ${step.error ? '<span style="color: var(--danger);">🔴 Lỗi</span>' : '<span style="color: var(--success);">🟢 OK</span>'}
                                        </td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                              </div>
                            ` : ''}
                            ${t.skipReason ? `
                              <div class="skip-reason" style="margin-top: 0.75rem; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.15); padding: 0.75rem 1rem; border-radius: 6px; color: #fcd34d; font-size: 0.85rem;">
                                <strong>Lý do bỏ qua:</strong> ${t.skipReason}
                              </div>
                            ` : ''}
                            ${t.error ? `
                              <div class="error-log">${t.error}</div>
                            ` : ''}
                            ${t.apiLog ? `
                              <div style="margin-top: 0.75rem;">
                                <div style="font-size: 0.85rem; font-weight: 700; color: #fca5a5; margin-bottom: 0.25rem;">API Requests & Responses:</div>
                                <pre class="error-log" style="background: rgba(15, 23, 42, 0.6); border-color: rgba(239, 68, 68, 0.25); max-height: 250px; overflow-y: auto;">${t.apiLog}</pre>
                              </div>
                            ` : ''}
                            ${(t.screenshot || t.video) ? `
                              <div style="display: flex; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap;">
                                ${t.video ? `
                                  <div style="flex: 1; min-width: 300px;">
                                    <a href="${getRelativeLink(t.video)}" target="_blank" class="screenshot-link" style="color: var(--warning); display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-bottom: 0.5rem;">
                                      <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13H6v-2h8v2z"/></svg>
                                      <span>Xem video ghi hình (Video Recording)</span>
                                    </a>
                                    <video controls class="screenshot-preview" style="width: 100%; max-height: 350px; display: block; border: 1px solid var(--card-border); border-radius: 8px;">
                                      <source src="${getRelativeLink(t.video)}" type="video/webm">
                                      Trình duyệt của bạn không hỗ trợ tag video.
                                    </video>
                                  </div>
                                ` : ''}
                                ${t.screenshot ? `
                                  <div style="flex: 1; min-width: 300px;">
                                    <a href="${getRelativeLink(t.screenshot)}" target="_blank" class="screenshot-link" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-bottom: 0.5rem;">
                                      <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                                      <span>Xem ảnh chụp màn hình (Screenshot)</span>
                                    </a>
                                    <img src="${getRelativeLink(t.screenshot)}" class="screenshot-preview" alt="Test Screenshot" style="width: 100%; max-height: 350px; display: block; border: 1px solid var(--card-border); border-radius: 8px; object-fit: contain; background: rgba(0,0,0,0.2);">
                                  </div>
                                ` : ''}
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
  </div> <!-- End #main-tab-modules-content -->

  <!-- Tab Bugs Content Wrapper -->
  <div id="main-tab-bugs-content" style="display: none;">
    <section class="bugs-section">
      <div class="section-title" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span style="color: var(--danger)">🐞</span> Nhật ký lỗi phát hiện (Bugs Registry Log)
      </div>
      
      ${totalBugs > 0 ? `
        <div class="bugs-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${moduleItems.filter(m => m.summary.failed > 0).map(m => `
            ${m.tests.filter(t => t.status === 'failed').map(t => `
              <div class="bug-item" style="background: var(--card-bg); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem;">
                  <div class="bug-info">
                    <h4 style="font-size: 1.15rem; font-weight: 700; color: #fca5a5; margin: 0;">${m.name} — ${t.title}</h4>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">Hệ thống: <strong>${m.system}</strong> | Chạy lần cuối: <strong>${m.lastRun || 'Chưa rõ'}</strong></p>
                  </div>
                  <span class="badge badge-failed" style="margin-left: auto;">Bug</span>
                </div>
                ${t.error ? `<div class="error-log" style="margin-top: 0; padding: 1rem; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #fca5a5; white-space: pre-wrap; word-break: break-all;">${t.error}</div>` : ''}
                ${t.apiLog ? `
                  <div style="margin-top: 0.5rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: #fca5a5; margin-bottom: 0.25rem;">API Requests & Responses (API Logs):</div>
                    <pre class="error-log" style="margin-top: 0; padding: 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #fca5a5; white-space: pre-wrap; word-break: break-all; max-height: 250px; overflow-y: auto;">${t.apiLog}</pre>
                  </div>
                ` : ''}
                
                ${(t.screenshot || t.video) ? `
                  <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                    ${t.video ? `
                      <div style="flex: 1; min-width: 300px;">
                        <a href="${getRelativeLink(t.video)}" target="_blank" class="screenshot-link" style="color: var(--warning); display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-bottom: 0.5rem;">
                          <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13H6v-2h8v2z"/></svg>
                          <span>Xem video ghi hình (Video Recording)</span>
                        </a>
                        <video controls class="screenshot-preview" style="width: 100%; max-height: 350px; display: block; border: 1px solid var(--card-border); border-radius: 8px;">
                          <source src="${getRelativeLink(t.video)}" type="video/webm">
                        </video>
                      </div>
                    ` : ''}
                    ${t.screenshot ? `
                      <div style="flex: 1; min-width: 300px;">
                        <a href="${getRelativeLink(t.screenshot)}" target="_blank" class="screenshot-link" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-bottom: 0.5rem;">
                          <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                          <span>Xem ảnh chụp màn hình (Screenshot)</span>
                        </a>
                        <img src="${getRelativeLink(t.screenshot)}" class="screenshot-preview" alt="Bug Screenshot" style="width: 100%; max-height: 350px; display: block; border: 1px solid var(--card-border); border-radius: 8px; object-fit: contain; background: rgba(0,0,0,0.2);">
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          `).join('')}
        </div>
      ` : `
        <div style="text-align: center; padding: 4rem 1.5rem; background: rgba(16, 185, 129, 0.03); border: 1px dashed rgba(16, 185, 129, 0.15); border-radius: 12px; margin-top: 1rem;">
          <span style="font-size: 3.5rem;">🎉</span>
          <h3 style="margin-top: 1rem; font-size: 1.35rem; font-weight: 700; color: var(--success);">Hệ thống sạch lỗi!</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.95rem;">Tuyệt vời! Không phát hiện bất kỳ test case nào thất bại trong phiên chạy kiểm thử này.</p>
        </div>
      `}
    </section>
  </div>

  <!-- Tab Analytics Content Wrapper -->
  <div id="main-tab-analytics-content" style="display: none;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
      <!-- Execution Status Chart -->
      <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(12px);">
        <h3 style="margin-bottom: 1rem; text-align: center; font-size: 1.2rem; font-weight: 700;">Tỷ lệ Thành công Tổng thể</h3>
        <div style="position: relative; height: 300px; width: 100%;">
          <canvas id="statusPieChart"></canvas>
        </div>
      </div>
      
      <!-- System Health Chart -->
      <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(12px);">
        <h3 style="margin-bottom: 1rem; text-align: center; font-size: 1.2rem; font-weight: 700;">Tỷ lệ Lỗi theo Hệ thống (System Health)</h3>
        <div style="position: relative; height: 300px; width: 100%;">
          <canvas id="systemBarChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- RCA Section -->
    <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; backdrop-filter: blur(12px);">
      <h3 style="margin-bottom: 1.5rem; color: var(--warning); display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem; font-weight: 700;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        Phân Tích Nguyên Nhân Lỗi (Root Cause Analysis - RCA)
      </h3>
      ${sortedRca.length > 0 ? `
        <table class="board-table">
          <thead>
            <tr>
              <th style="width: 30%;">Loại lỗi (Error Category)</th>
              <th style="width: 15%; text-align: center;">Số lượng</th>
              <th style="width: 55%;">Test Cases Bị Ảnh Hưởng (Top 3)</th>
            </tr>
          </thead>
          <tbody>
            ${sortedRca.map(([cat, data]) => `
              <tr>
                <td style="font-weight: 600; color: #fca5a5;">${cat}</td>
                <td style="text-align: center; font-size: 1.2rem; font-weight: 800; color: var(--danger);">${data.count}</td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">
                  <ul style="margin: 0; padding-left: 1.2rem;">
                    ${data.tests.slice(0, 3).map(t => `<li style="margin-bottom: 0.25rem;">${t.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}
                    ${data.tests.length > 3 ? `<li style="margin-top: 0.25rem;"><em style="color: var(--primary);">+ ${data.tests.length - 3} tests khác...</em></li>` : ''}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <div style="text-align: center; padding: 2rem; color: var(--success); font-weight: 600; font-size: 1.1rem;">
          🎉 Không phát hiện lỗi hệ thống nào.
        </div>
      `}
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Data injected from Node.js
      const totalPassed = ${passedTestCases};
      const totalFailed = ${failedTestCases};
      const totalSkipped = ${skippedTestCases};
      
      const sysLabels = ${JSON.stringify(sysLabels)};
      const sysPassed = ${JSON.stringify(sysPassed)};
      const sysFailed = ${JSON.stringify(sysFailed)};
      
      // Pie Chart
      const pieCtx = document.getElementById('statusPieChart').getContext('2d');
      new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed', 'Skipped'],
          datasets: [{
            data: [totalPassed, totalFailed, totalSkipped],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#f3f4f6', font: { family: "'Plus Jakarta Sans', sans-serif" } } }
          },
          cutout: '70%'
        }
      });

      // Bar Chart
      const barCtx = document.getElementById('systemBarChart').getContext('2d');
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: sysLabels,
          datasets: [
            {
              label: 'Failed Tests',
              data: sysFailed,
              backgroundColor: '#ef4444',
              borderRadius: 4
            },
            {
              label: 'Passed Tests',
              data: sysPassed,
              backgroundColor: '#10b981',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { display: false } },
            y: { stacked: true, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
          },
          plugins: {
            legend: { position: 'bottom', labels: { color: '#f3f4f6', font: { family: "'Plus Jakarta Sans', sans-serif" } } }
          }
        }
      });
    });

    let currentFilter = 'all';

    function setFilter(filter, el) {
      currentFilter = filter;
      document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
      el.classList.add('active');
      filterModules();
    }

    function toggleDetails(id) {
      const detailRow = document.querySelector("[data-id='details-" + id + "']");
      const container = document.getElementById("container-" + id);
      
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
        const detailRow = document.querySelector("[data-id='details-" + id + "']");
        
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
            const container = document.getElementById("container-" + id);
            if (container) container.classList.remove('open');
          }
        }
      });
    }

    function switchMainTab(tab) {
      document.querySelectorAll('.main-tab').forEach(btn => {
        btn.classList.remove('active');
      });
      
      const activeBtn = document.getElementById("tab-" + tab + "-btn");
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
      
      if (tab === 'modules') {
        document.getElementById('main-tab-modules-content').style.display = 'block';
        document.getElementById('main-tab-bugs-content').style.display = 'none';
        document.getElementById('main-tab-analytics-content').style.display = 'none';
      } else if (tab === 'bugs') {
        document.getElementById('main-tab-modules-content').style.display = 'none';
        document.getElementById('main-tab-bugs-content').style.display = 'block';
        document.getElementById('main-tab-analytics-content').style.display = 'none';
      } else if (tab === 'analytics') {
        document.getElementById('main-tab-modules-content').style.display = 'none';
        document.getElementById('main-tab-bugs-content').style.display = 'none';
        document.getElementById('main-tab-analytics-content').style.display = 'block';
      }
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

  // 5. Tạo báo cáo markdown reports/dashboard.md
  const mdFile = path.join(REPORT_DIR, 'dashboard.md');
  
  const platformAdminModules = moduleItems.filter(m => m.system === 'Platform-Admin');
  const tenantAdminModules = moduleItems.filter(m => m.system === 'Tenant-Admin / Master-data');
  const omsModules = moduleItems.filter(m => m.system === 'Tenant-Operation / OMS');
  const tmsModules = moduleItems.filter(m => m.system === 'Tenant-Operation / TMS');
  const imModules = moduleItems.filter(m => m.system === 'Tenant-Operation / IM');
  
  let mdContent = `# 📊 Bảng Điều Khiển Kiểm Thử Tự Động (E2E Testing Dashboard)

> **Dự án:** MoveX Logistics & E-Commerce Platform
> **Ngày cập nhật:** ${new Date().toISOString().slice(0, 10)}
> **Người vận hành:** Senior BA Agent / Antigravity

---

## 1. Tóm tắt chỉ số kiểm thử (Dashboard Metrics)

| Chỉ số | Số lượng | Tỷ lệ | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Tổng số Module cần viết** | ${totalModules} | 100% | Toàn bộ phân hệ trên toàn hệ thống MoveX |
| **Total Module Đã Có Script** | ${modulesWithScript} | ${Math.round((modulesWithScript / totalModules) * 100)}% | Đã thiết lập file kịch bản kiểm thử |
| **Total Module Chưa Có Script** | ${modulesWithoutScript} | ${Math.round((modulesWithoutScript / totalModules) * 100)}% | Chưa có file kịch bản |
| **Total Module Đã Chạy Script** | ${modulesExecuted} | ${Math.round((modulesExecuted / totalModules) * 100)}% | Đã thực thi (Passed / Failed) trên UI |
| **Total Module Chưa Chạy Script** | ${modulesNotExecuted} | ${Math.round((modulesNotExecuted / totalModules) * 100)}% | Bỏ qua (skipped) do chờ UI/Script |
| **Số lỗi phát hiện (Bugs Found)** | ${totalBugs} | — | Tổng số test cases bị lỗi (Failed) |

---

## 2. Trạng thái kiểm thử theo từng Module (Module Status Board)

`;

  const renderModuleTable = (modules) => {
    let table = `| Hệ thống / Module | Trạng thái kịch bản | Chỉ số kiểm thử | Chạy lần cuối | Chi tiết lỗi / Ghi chú | Báo cáo chi tiết |\n`;
    table += `| :--- | :---: | :---: | :---: | :--- | :---: |\n`;
    
    for (const m of modules) {
      let statusText = '🟡 **PENDING**';
      if (m.specFile) {
        if (m.summary.total > 0) {
          if (m.summary.failed > 0) {
            statusText = '🔴 **FAILED**';
          } else if (m.summary.passed > 0) {
            statusText = '🟢 **ACTIVE**';
          } else {
            statusText = '🟡 **SKIPPED**';
          }
        } else {
          statusText = '🟡 **PENDING** (Chưa chạy)';
        }
      }
      
      const tcText = m.summary.total > 0 ? `**${m.summary.passed} Passed** / ${m.summary.failed} Failed / ${m.summary.skipped} Skipped` : 'Chưa chạy';
      const lastRun = m.lastRun || 'Chưa chạy';
      
      let notes = 'Kịch bản kiểm thử hoạt động bình thường.';
      if (m.summary.total > 0) {
        if (m.summary.failed > 0) {
          notes = `Lỗi phát hiện tại ${m.summary.failed} test cases.`;
        } else {
          const skippedList = m.tests.filter(t => t.status === 'skipped');
          if (skippedList.length > 0) {
            const reasons = skippedList.map(t => t.skipReason ? `"${t.skipReason}"` : 'chờ phát triển UI').filter((val, idx, self) => self.indexOf(val) === idx);
            notes = `Bỏ qua ${skippedList.length} test cases (${reasons.join(', ')}).`;
          } else if (m.summary.skipped === m.summary.total) {
            notes = 'Toàn bộ test cases bị bỏ qua (skipped) do chờ phát triển UI.';
          }
        }
      } else {
        notes = 'Kịch bản chưa được chạy.';
      }
      
      table += `| **${m.system} / ${m.name}** | ${statusText} | ${tcText} | ${lastRun} | ${notes} | [Xem HTML](html/index.html) |\n`;
    }
    return table;
  };

  mdContent += `### 🔑 Platform & System Admin\n\n` + renderModuleTable(platformAdminModules) + `\n`;
  mdContent += `### 📁 Tenant-Admin / Master-data\n\n` + renderModuleTable(tenantAdminModules) + `\n`;
  mdContent += `### 📦 Tenant-Operation / IM\n\n` + renderModuleTable(imModules) + `\n`;
  mdContent += `### 🚛 Tenant-Operation / OMS\n\n` + renderModuleTable(omsModules) + `\n`;
  mdContent += `### 🚚 Tenant-Operation / TMS\n\n` + renderModuleTable(tmsModules) + `\n`;

  mdContent += `\n---\n\n## 3. Phân Tích Nguyên Nhân Lỗi (Root Cause Analysis - RCA)\n\n`;
  if (sortedRca.length > 0) {
    mdContent += `| Loại Lỗi (Error Category) | Số Lượng | Test Cases Bị Ảnh Hưởng (Top 3) |\n`;
    mdContent += `| :--- | :---: | :--- |\n`;
    sortedRca.forEach(([cat, data]) => {
      const topTests = data.tests.slice(0, 3).map(t => `<li>${t.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('');
      const more = data.tests.length > 3 ? `<li>+ ${data.tests.length - 3} tests khác...</li>` : '';
      mdContent += `| **${cat}** | 🔴 ${data.count} | <ul>${topTests}${more}</ul> |\n`;
    });
  } else {
    mdContent += `🎉 Không phát hiện lỗi hệ thống nào trong phiên kiểm thử này.\n`;
  }

  mdContent += `\n---\n\n## 4. Nhật ký lỗi phát hiện chi tiết (Bugs Registry Log)\n\n`;

  const failedTests = [];
  for (const m of moduleItems) {
    if (m.summary.failed > 0) {
      for (const t of m.tests) {
        if (t.status === 'failed') {
          failedTests.push({ module: m.name, title: t.title, error: t.error, screenshot: t.screenshot, video: t.video, apiLog: t.apiLog });
        }
      }
    }
  }

  if (failedTests.length > 0) {
    mdContent += `Đã phát hiện ${failedTests.length} lỗi trong quá trình kiểm thử:\n\n`;
    failedTests.forEach((b, idx) => {
      mdContent += `${idx + 1}. **[${b.module}] — ${b.title}**\n`;
      if (b.error) {
        mdContent += `   \`\`\`\n   ${b.error.replace(/\n/g, '\n   ')}\n   \`\`\`\n`;
      }
      if (b.apiLog) {
        mdContent += `   * **API Logs**:\n   \`\`\`\n   ${b.apiLog.replace(/\n/g, '\n   ')}\n   \`\`\`\n`;
      }
      if (b.screenshot) {
        mdContent += `   * **Screenshot**: ![Screenshot](../${b.screenshot})\n`;
      }
      if (b.video) {
        mdContent += `   * **Video Recording**: [Xem/Tải video](../${b.video})\n`;
      }
      mdContent += `\n`;
    });
  } else {
    mdContent += `Toàn bộ kịch bản kiểm thử chạy thành công. Không phát hiện lỗi mới nào.\n`;
  }

  mdContent += `\n---\n\n## 4. Kịch bản kiểm thử bị bỏ qua (Skipped Tests Registry)\n\n`;

  const skippedTests = [];
  for (const m of moduleItems) {
    if (m.summary.skipped > 0) {
      for (const t of m.tests) {
        if (t.status === 'skipped') {
          skippedTests.push({ module: m.name, title: t.title, reason: t.skipReason || 'Chờ phát triển giao diện / kịch bản' });
        }
      }
    }
  }

  if (skippedTests.length > 0) {
    mdContent += `Có ${skippedTests.length} kịch bản kiểm thử đang tạm thời bị bỏ qua:\n\n`;
    skippedTests.forEach((s, idx) => {
      mdContent += `${idx + 1}. **[${s.module}] — ${s.title}**\n`;
      mdContent += `   * **Lý do**: ${s.reason}\n`;
    });
  } else {
    mdContent += `Không có kịch bản kiểm thử nào bị bỏ qua.\n`;
  }

  mdContent += `\n---\n\n## 5. Hướng dẫn chạy kiểm thử toàn bộ hệ thống (Execution Guide)\n\n`;
  mdContent += `Để thực hiện chạy kiểm thử tự động toàn bộ phân hệ:\n`;
  mdContent += `\`\`\`bash\n`;
  mdContent += `# Di chuyển vào project kiểm thử\n`;
  mdContent += `cd movex-e2e-tests\n\n`;
  mdContent += `# Chạy kiểm thử E2E bằng Playwright và tự động tổng hợp báo cáo Dashboard\n`;
  mdContent += `TEST_EMAIL=owner.368329@qtllogistics.vn TEST_PASSWORD=Movex@2026 BASE_URL=https://qtltest368329.movex.vn npx playwright test; node helpers/generate-dashboard.js\n`;
  mdContent += `\`\`\`\n\n`;
  mdContent += `Báo cáo kiểm thử dạng HTML chi tiết sẽ được tự động cập nhật tại [reports/html/index.html](html/index.html).\n`;

  fs.writeFileSync(mdFile, mdContent, 'utf8');
  console.log(`🎉 Tạo báo cáo Markdown thành công tại: ${mdFile}`);
}


main();
