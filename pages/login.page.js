// @ts-check
const { BasePage } = require('./base.page');

/**
 * LoginPage — Page Object for MoveX login screen.
 *
 * Encapsulates all login-related interactions:
 *  - Fill email/password
 *  - Click login button (multi-language aware)
 *  - Wait for redirect
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.emailInput = page.locator('input[name="email"]').first();
    this.passwordInput = page.locator('input[name="password"]').first();
    this.loginButton = page
      .locator(
        'button:has-text("Login"), button:has-text("Sign in"), button:has-text("Đăng nhập"), button:has-text("Log in")'
      )
      .first();
  }

  /**
   * Navigate to login page.
   */
  async open() {
    await this.goto('/login');
  }

  /**
   * Perform full login flow.
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    await this.open();

    await this.emailInput.waitFor({ state: 'visible', timeout: 10_000 });
    await this.emailInput.fill(credentials.email);

    await this.passwordInput.waitFor({ state: 'visible', timeout: 5_000 });
    await this.passwordInput.fill(credentials.password);

    await this.loginButton.waitFor({ state: 'visible', timeout: 5_000 });
    await this.loginButton.click();

    // Wait for redirect away from /login
    await this.page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 15_000,
    });
  }
}

module.exports = { LoginPage };
