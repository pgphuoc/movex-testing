// @ts-check
const { BasePage } = require('./base.page');
const { AntTable } = require('./components/ant-table');

/**
 * ListPage — Generic Page Object for module list views.
 *
 * Most MoveX modules share the same list pattern:
 *  - Title heading
 *  - "Add New" button
 *  - Search input
 *  - Data table with rows
 *  - Pagination
 *
 * Usage:
 *   const listPage = new ListPage(page, {
 *     url: '/master-data/vehicle',
 *     title: 'Vehicle',
 *   });
 *   await listPage.open();
 *   await listPage.search('Toyota');
 *   await listPage.clickFirstRow();
 */
class ListPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {object} config
   * @param {string} config.url - List page URL (e.g. '/master-data/vehicle')
   * @param {string} config.title - Page title text to verify
   * @param {string} [config.addButtonText] - Custom add button text (default: 'add')
   */
  constructor(page, config) {
    super(page);
    this.config = config;
    this.table = new AntTable(page);

    // ── Selectors ──
    this.heading = page.locator(`text=${config.title}`).first();
    this.addButton = page
      .getByRole('button', { name: new RegExp(config.addButtonText || 'add', 'i') })
      .or(page.locator(`button:has-text("Add")`))
      .or(page.locator(`button:has-text("Thêm mới")`))
      .first();
    this.searchInput = page
      .getByPlaceholder(/search/i)
      .or(page.locator('input[placeholder*="Tìm kiếm"]'))
      .first();
  }

  /**
   * Navigate to the list page and wait for data.
   */
  async open() {
    await this.goto(this.config.url);
    await this.waitForTableReady();
  }

  /**
   * Verify the list page loaded correctly (heading + add button + table).
   * @param {import('@playwright/test').Expect} expect
   */
  async verifyLayout(expect) {
    await expect(this.heading).toBeVisible();
    await expect(this.addButton).toBeVisible();
  }

  /**
   * Click the "Add New" button.
   */
  async clickAdd() {
    await this.addButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Search for text in the search box.
   * @param {string} query
   */
  async search(query) {
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill(query);
      await this.page.keyboard.press('Enter');
      await this.waitForTableReady();
    }
  }

  /**
   * Click the first row in the table.
   */
  async clickFirstRow() {
    await this.table.clickRow(0);
    await this.waitForLoadingComplete();
  }

  /**
   * Double-click the first row in the table.
   */
  async dblClickFirstRow() {
    await this.table.dblClickRow(0);
    await this.waitForLoadingComplete();
  }
}

module.exports = { ListPage };
