const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  // Login
  await page.goto('https://qtltest368329.movex.vn/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[name="email"]').fill('owner.368329@qtllogistics.vn');
  await page.locator('input[name="password"]').fill('Movex@2026');
  
  const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign in"), button:has-text("Đăng nhập"), button:has-text("Log in")').first();
  await loginButton.click();
  await page.waitForURL(url => !url.pathname.includes('/login'));
  
  // Navigate to routing create
  await page.goto('https://qtltest368329.movex.vn/master-data/routing/create');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Log all inputs and labels on the page
  const inputs = await page.locator('input').all();
  console.log('--- Inputs on Routing Create Page ---');
  for (const input of inputs) {
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    console.log(`Input name: ${name}, placeholder: ${placeholder}`);
  }
  
  await browser.close();
})();
