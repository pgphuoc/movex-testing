const fs = require('fs');
const path = require('path');

const SPECS_DIR = path.join(__dirname, '..', 'specs');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log('🔄 Starting conversion of spec files...');
let count = 0;

walkDir(SPECS_DIR, filePath => {
  if (filePath.endsWith('.spec.js') || filePath.endsWith('.test.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports test from @playwright/test
    if (content.includes("require('@playwright/test')") || content.includes('require("@playwright/test")')) {
      // Replace with importing from helpers/auth
      content = content.replace(
        /const\s+\{\s*test\s*,\s*expect\s*\}\s*=\s*require\(['"]@playwright\/test['"]\)\s*;?/g,
        "const { test, expect } = require('../../helpers/auth');"
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Converted: ${path.relative(SPECS_DIR, filePath)}`);
      count++;
    }
  }
});

console.log(`🎉 Done! Converted ${count} files.`);
