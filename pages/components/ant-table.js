// @ts-check
/**
 * AntTable — Wrapper for Ant Design Table component.
 *
 * Encapsulates table-related interactions:
 *  - Click/double-click rows
 *  - Get row data
 *  - Check column headers
 *  - Wait for data loading
 *  - Pagination
 *
 * Usage:
 *   const table = new AntTable(page);
 *   await table.waitForData();
 *   await table.clickRow(0);
 *   const headers = await table.getColumnHeaders();
 */
class AntTable {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').Locator} [container] - Specific table container (if page has multiple tables)
   */
  constructor(page, container) {
    this.page = page;
    this.root = container || page.locator('.ant-table').first();
  }

  /**
   * Wait for table to finish loading data (spinner disappears).
   * @param {number} [timeout=15000]
   */
  async waitForData(timeout = 15000) {
    const loading = this.root.locator('.ant-spin-spinning, .ant-table-placeholder .ant-spin');
    if (await loading.isVisible().catch(() => false)) {
      await loading.waitFor({ state: 'hidden', timeout });
    }
    // Wait a beat for rows to render
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if the table has any data rows.
   * @returns {Promise<boolean>}
   */
  async hasData() {
    const rows = this.root.locator('.ant-table-row, tr[data-row-key]');
    return (await rows.count()) > 0;
  }

  /**
   * Get the number of visible data rows.
   * @returns {Promise<number>}
   */
  async rowCount() {
    return this.root.locator('.ant-table-row, tr[data-row-key]').count();
  }

  /**
   * Click a row by index (0-based).
   * @param {number} index
   */
  async clickRow(index = 0) {
    const row = this.root.locator('.ant-table-row, tr[data-row-key]').nth(index);
    await row.click();
  }

  /**
   * Double-click a row by index (0-based).
   * @param {number} index
   */
  async dblClickRow(index = 0) {
    const row = this.root.locator('.ant-table-row, tr[data-row-key]').nth(index);
    await row.dblclick();
  }

  /**
   * Get all column header texts.
   * @returns {Promise<string[]>}
   */
  async getColumnHeaders() {
    return this.root.locator('th .ant-table-column-title, th')
      .allTextContents();
  }

  /**
   * Check if a specific column header exists.
   * @param {string} headerText
   * @returns {Promise<boolean>}
   */
  async hasColumn(headerText) {
    const header = this.root.locator(`th:has-text("${headerText}")`);
    return header.isVisible();
  }

  /**
   * Get text content of a specific cell.
   * @param {number} rowIndex - 0-based row index
   * @param {number} colIndex - 0-based column index
   * @returns {Promise<string>}
   */
  async getCellText(rowIndex, colIndex) {
    const cell = this.root
      .locator('.ant-table-row, tr[data-row-key]').nth(rowIndex)
      .locator('td').nth(colIndex);
    return (await cell.textContent()) || '';
  }

  /**
   * Get the row locator for a row containing specific text.
   * @param {string} text
   */
  getRowByText(text) {
    return this.root.locator(`.ant-table-row:has-text("${text}")`).first();
  }

  /**
   * Check if the "empty" placeholder is visible.
   * @returns {Promise<boolean>}
   */
  async isEmpty() {
    const empty = this.root.locator('.ant-empty, .ant-table-placeholder');
    return empty.isVisible();
  }
}

module.exports = { AntTable };
