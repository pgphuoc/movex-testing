const fs = require('fs');
const path = require('path');

const SPECS_DIR = path.join(__dirname, '..', 'specs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.spec.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(SPECS_DIR);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('test.skip(')) {
    // Replace UI- skipped tests
    content = content.replace(/test\.skip\('UI-([^']*)',\s*async\s*\(\{\s*page\s*\}\)\s*=>\s*\{/g, (match, p1) => {
      changed = true;
      return `test('UI-${p1}', async ({ page }) => {\n    test.skip(true, 'Chờ phát triển giao diện (UI) của phân hệ');`;
    });

    // Replace FN- skipped tests
    content = content.replace(/test\.skip\('FN-([^']*)',\s*async\s*\(\{\s*page\s*\}\)\s*=>\s*\{/g, (match, p1) => {
      changed = true;
      return `test('FN-${p1}', async ({ page }) => {\n    test.skip(true, 'Chờ tích hợp API và hoàn thiện tính năng');`;
    });
    
    // Replace any other test.skip that didn't match the specific UI/FN pattern
    content = content.replace(/test\.skip\('([^']*)',\s*async\s*\(\{\s*page\s*\}\)\s*=>\s*\{/g, (match, p1) => {
      changed = true;
      return `test('${p1}', async ({ page }) => {\n    test.skip(true, 'Chờ phát triển phân hệ kiểm thử');`;
    });
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Converted: ${path.relative(SPECS_DIR, file)}`);
  }
});
console.log('✅ Conversion completed.');
