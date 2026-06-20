// @ts-check
/**
 * Page Object Model — Central export file
 *
 * Usage in spec files:
 *   const { ListPage, FormPage, AntSelect, AntTable } = require('../../pages');
 */

const { BasePage } = require('./base.page');
const { LoginPage } = require('./login.page');
const { ListPage } = require('./list.page');
const { FormPage } = require('./form.page');
const { AntSelect } = require('./components/ant-select');
const { AntTable } = require('./components/ant-table');

module.exports = {
  BasePage,
  LoginPage,
  ListPage,
  FormPage,
  AntSelect,
  AntTable,
};
