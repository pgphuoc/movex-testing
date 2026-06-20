// @ts-check
const { BasePage } = require('./base.page');

/**
 * FormPage — Generic Page Object for create/edit forms.
 *
 * Most MoveX forms share the same pattern:
 *  - Save button
 *  - Cancel button
 *  - Validation error display
 *  - Tabs (optional)
 *
 * Usage:
 *   const form = new FormPage(page, {
 *     url: '/master-data/vehicle/create',
 *   });
 *   await form.open();
 *   await form.fillInput('name', 'Toyota');
 *   await form.clickSave();
 *   await form.expectValidationErrors(3);
 */
class FormPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {object} config
   * @param {string} config.url - Form page URL
   */
  constructor(page, config) {
    super(page);
    this.config = config;

    // ── Common form buttons ──
    this.saveButton = page
      .getByRole('button', { name: /save/i })
      .or(page.locator('button:has-text("Save")'))
      .or(page.locator('button:has-text("Lưu")'))
      .first();
    this.cancelButton = page
      .getByRole('button', { name: /cancel/i })
      .or(page.locator('button:has-text("Cancel")'))
      .or(page.locator('button:has-text("Hủy")'))
      .or(page.locator('button:has-text("Back")'))
      .first();
    this.nextButton = page
      .locator('button:has-text("Next")')
      .or(page.locator('button:has-text("Tiếp theo")'))
      .first();
    this.editButton = page
      .getByRole('button', { name: /edit/i })
      .first();
  }

  /**
   * Navigate to the form page.
   */
  async open() {
    await this.goto(this.config.url);
  }

  /**
   * Fill an input field by its name attribute.
   * @param {string} name - Input name attribute
   * @param {string} value
   */
  async fillInput(name, value) {
    const input = this.page.locator(`input[name="${name}"]`).first();
    await input.fill(value);
  }

  /**
   * Fill a textarea by its name attribute.
   * @param {string} name
   * @param {string} value
   */
  async fillTextarea(name, value) {
    const textarea = this.page.locator(`textarea[name="${name}"]`).first();
    await textarea.fill(value);
  }

  /**
   * Fill an input by placeholder text.
   * @param {string} placeholder
   * @param {string} value
   */
  async fillByPlaceholder(placeholder, value) {
    const input = this.page.locator(`input[placeholder*="${placeholder}" i]`)
      .or(this.page.locator(`textarea[placeholder*="${placeholder}" i]`))
      .first();
    await input.fill(value);
  }

  /**
   * Click the Save button.
   */
  async clickSave() {
    await this.saveButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Click the Cancel button.
   */
  async clickCancel() {
    await this.cancelButton.click();
  }

  /**
   * Click the Next button (for multi-step forms).
   */
  async clickNext() {
    await this.nextButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Click the Edit button (on detail pages).
   */
  async clickEdit() {
    await this.editButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Click Save on an empty form and verify validation errors appear.
   * @param {import('@playwright/test').Expect} expect
   * @param {number} [minErrors=1]
   */
  async expectValidationErrors(expect, minErrors = 1) {
    await this.clickSave();
    const errorCount = await this.countValidationErrors();
    expect(errorCount).toBeGreaterThanOrEqual(minErrors);
  }

  /**
   * Click a tab by its text.
   * @param {string} tabText
   */
  async clickTab(tabText) {
    const tab = this.page
      .locator(`[role="tab"]:has-text("${tabText}"), .ant-tabs-tab:has-text("${tabText}")`)
      .first();
    await tab.click();
    await this.waitForLoadingComplete(3000);
  }

  /**
   * Check if a tab is visible.
   * @param {string} tabText
   * @returns {Promise<boolean>}
   */
  async isTabVisible(tabText) {
    const tab = this.page
      .locator(`[role="tab"]:has-text("${tabText}"), .ant-tabs-tab:has-text("${tabText}")`)
      .first();
    return tab.isVisible();
  }
}

module.exports = { FormPage };
