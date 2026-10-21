const { byTestId } = require("../config/locators");

class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  get loginLink() {
    return this.driver.$(byTestId("nav-login"));
  }

  get profileLink() {
    return this.driver.$(byTestId("nav-profile"));
  }

  get searchInput() {
    return this.driver.$(byTestId("search-input"));
  }

  get searchButton() {
    return this.driver.$(byTestId("search-submit"));
  }

  get searchQuery() {
    return this.driver.$(byTestId("search-query"));
  }

  get resultCount() {
    return this.driver.$(byTestId("search-result-count"));
  }

  productName(id) {
    return this.driver.$(byTestId(`product-name-${id}`));
  }

  async openLogin() {
    await (await this.loginLink).click();
  }

  async searchFor(query) {
    const input = await this.searchInput;
    await input.setValue(query);
    await (await this.searchButton).click();
  }
}

module.exports = { HomePage };
