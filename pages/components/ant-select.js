// @ts-check
/**
 * AntSelect — Wrapper for Ant Design Select component.
 *
 * Encapsulates all the fragile `.ant-select-*` selectors in one place.
 * When AntD upgrades and changes class names, fix ONLY this file.
 *
 * Usage:
 *   const select = new AntSelect(page, { label: 'Customer' });
 *   await select.selectByText('QTL Logistics');
 *   await select.searchAndSelect('QTL');
 *   const value = await select.getValue();
 */
class AntSelect {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {object} options - How to find the select on the page
   * @param {string} [options.label] - Label text near the select (e.g. 'Customer')
   * @param {string} [options.name] - Name attribute (e.g. 'costTypeId')
   * @param {string} [options.placeholder] - Placeholder text
   * @param {import('@playwright/test').Locator} [options.locator] - Direct locator
   */
  constructor(page, options = {}) {
    this.page = page;

    if (options.locator) {
      this.container = options.locator;
    } else if (options.name) {
      this.container = page.locator(`.ant-select[name="${options.name}"]`).first();
    } else if (options.label) {
      // Find the form item by its label, then get the select inside it
      this.container = page
        .locator(`.ant-form-item:has(.ant-form-item-label:has-text("${options.label}")) .ant-select`)
        .first()
        .or(page.locator(`.ant-select`).filter({ hasText: new RegExp(options.label, 'i') }).first());
    } else if (options.placeholder) {
      this.container = page
        .locator(`.ant-select`).filter({ hasText: new RegExp(options.placeholder, 'i') }).first();
    } else {
      throw new Error('AntSelect requires at least one of: label, name, placeholder, or locator');
    }
  }

  /**
   * Open the dropdown.
   */
  async open() {
    await this.container.click();
    // Wait for dropdown to animate open
    await this.page.locator('.ant-select-dropdown:visible').first()
      .waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Select an option by its visible text.
   * @param {string} text
   */
  async selectByText(text) {
    await this.open();
    const option = this.page.locator('.ant-select-item-option-content:visible')
      .filter({ hasText: text }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    // Wait for dropdown to close
    await this.page.waitForTimeout(300);
  }

  /**
   * Select the first available option.
   */
  async selectFirst() {
    await this.open();
    const option = this.page.locator('.ant-select-item-option-content:visible').first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Type to search, then select the first matching option.
   * @param {string} searchText
   * @param {number} [timeout=10000] - Wait timeout for option to appear
   */
  async searchAndSelect(searchText, timeout = 10000) {
    await this.open();
    const input = this.container.locator('input');
    await input.fill(searchText);
    // Wait for server-side search response
    await this.page.waitForTimeout(1500);

    const option = this.page.locator(`.ant-select-item-option[title="${searchText}"]`)
      .or(this.page.locator(`.ant-select-item-option:has-text("${searchText}")`))
      .or(this.page.locator('.ant-select-item-option-content:visible').filter({ hasText: searchText }))
      .first();
    await option.waitFor({ state: 'visible', timeout });
    await option.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get the currently selected value text.
   * @returns {Promise<string>}
   */
  async getValue() {
    const selection = this.container.locator('.ant-select-selection-item');
    if (await selection.isVisible()) {
      return selection.textContent() || '';
    }
    return '';
  }

  /**
   * Check if the select is visible on the page.
   * @returns {Promise<boolean>}
   */
  async isVisible() {
    return this.container.isVisible();
  }
}

module.exports = { AntSelect };
