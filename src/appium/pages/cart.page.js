const { byTestId } = require("../config/locators");

class CartPage {
  constructor(driver) {
    this.driver = driver;
  }

  get emptyBox() {
    return this.driver.$(byTestId("cart-empty"));
  }

  get total() {
    return this.driver.$(byTestId("cart-total"));
  }

  item(id) {
    return this.driver.$(byTestId(`cart-item-${id}`));
  }

  name(id) {
    return this.driver.$(byTestId(`cart-name-${id}`));
  }

  subtotal(id) {
    return this.driver.$(byTestId(`cart-subtotal-${id}`));
  }

  removeButton(id) {
    return this.driver.$(byTestId(`cart-remove-${id}`));
  }
}

module.exports = { CartPage };
