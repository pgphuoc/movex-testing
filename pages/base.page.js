// @ts-check
/**
 * BasePage — Abstract base class for all Page Objects.
 *
 * Provides common utilities:
 *  - Smart wait helpers (replaces waitForTimeout)
 *  - Toast/notification detection
 *  - Screenshot helpers
 *  - Navigation with networkidle
 *
 * All module-specific pages extend this class.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    /** @type {import('@playwright/test').Page} */
    this.page = page;

    // ── Common UI selectors (Ant Design based) ──
    this.selectors = {
      // Notifications & messages
      successToast: '.ant-message-success, .ant-notification-notice-success',
      errorToast: '.ant-message-error, .ant-notification-notice-error',
      warningToast: '.ant-message-warning, .ant-notification-notice-warning',

      // Loading states
      spinner: '.ant-spin-spinning, .ant-spin-dot',
      tableLoading: '.ant-table-loading, .ant-spin-container.ant-spin-blur',

      // Modal & Drawer
      modal: '.ant-modal-content',
      modalOk: '.ant-modal-footer .ant-btn-primary',
      modalCancel: '.ant-modal-footer .ant-btn-default',
      drawer: '.ant-drawer-content',

      // Form
      requiredError: '.ant-form-item-explain-error',
      formItem: '.ant-form-item',
    };
  }

  // ── Navigation ──────────────────────────────────────────────

  /**
   * Navigate to a path and wait for network to settle.
   * @param {string} path - e.g. '/master-data/vehicle'
   */
  async goto(path) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  // ── Smart Wait Helpers ──────────────────────────────────────

  /**
   * Wait for loading spinners to disappear.
   * Replaces arbitrary waitForTimeout calls.
   * @param {number} [timeout=10000]
   */
  async waitForLoadingComplete(timeout = 10000) {
    const spinner = this.page.locator(this.selectors.spinner);
    // If spinner is visible, wait for it to disappear
    if (await spinner.isVisible().catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout });
    }
  }

  /**
   * Wait for the table to finish loading data.
   * @param {number} [timeout=15000]
   */
  async waitForTableReady(timeout = 15000) {
    const loading = this.page.locator(this.selectors.tableLoading);
    if (await loading.isVisible().catch(() => false)) {
      await loading.waitFor({ state: 'hidden', timeout });
    }
  }

  /**
   * Wait for an API response matching a URL pattern.
   * @param {string|RegExp} urlPattern
   * @param {number} [timeout=15000]
   * @returns {Promise<import('@playwright/test').Response>}
   */
  async waitForAPI(urlPattern, timeout = 15000) {
    return this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern) && response.status() < 400;
        }
        return urlPattern.test(url) && response.status() < 400;
      },
      { timeout }
    );
  }

  // ── Toast / Notification Helpers ────────────────────────────

  /**
   * Assert that a success toast/notification appears.
   * @param {number} [timeout=5000]
   */
  async expectSuccessToast(timeout = 5000) {
    const toast = this.page.locator(this.selectors.successToast).first();
    await toast.waitFor({ state: 'visible', timeout });
  }

  /**
   * Assert that an error toast/notification appears.
   * @param {number} [timeout=5000]
   */
  async expectErrorToast(timeout = 5000) {
    const toast = this.page.locator(this.selectors.errorToast).first();
    await toast.waitFor({ state: 'visible', timeout });
  }

  // ── Form Helpers ────────────────────────────────────────────

  /**
   * Count the number of validation error messages currently visible.
   * @returns {Promise<number>}
   */
  async countValidationErrors() {
    await this.waitForLoadingComplete(3000);
    return this.page.locator(this.selectors.requiredError).count();
  }

  /**
   * Get all visible validation error texts.
   * @returns {Promise<string[]>}
   */
  async getValidationErrors() {
    await this.waitForLoadingComplete(3000);
    return this.page.locator(this.selectors.requiredError).allTextContents();
  }

  // ── Screenshot Helpers ──────────────────────────────────────

  /**
   * Take a screenshot with a descriptive name.
   * @param {string} name - e.g. 'BP-BR-001-Created'
   * @param {object} [options]
   * @param {boolean} [options.fullPage=false]
   */
  async screenshot(name, options = {}) {
    const path = `reports/screenshots/${name}.png`;
    await this.page.screenshot({ path, fullPage: options.fullPage || false });
    return path;
  }

  // ── Modal Helpers ───────────────────────────────────────────

  /**
   * Wait for a modal to appear and return its locator.
   * @param {number} [timeout=5000]
   */
  async waitForModal(timeout = 5000) {
    const modal = this.page.locator(this.selectors.modal).last();
    await modal.waitFor({ state: 'visible', timeout });
    return modal;
  }

  /**
   * Click the OK/Submit button in the currently visible modal.
   */
  async confirmModal() {
    await this.page.locator(this.selectors.modalOk).last().click();
    await this.waitForLoadingComplete();
  }

  /**
   * Click the Cancel button in the currently visible modal.
   */
  async cancelModal() {
    await this.page.locator(this.selectors.modalCancel).last().click();
  }
}

module.exports = { BasePage };
