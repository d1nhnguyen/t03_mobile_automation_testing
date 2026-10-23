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

  get cartLink() {
    return this.driver.$(byTestId("nav-cart"));
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

  get loadingText() {
    return this.driver.$('android=new UiSelector().text("Đang tải...")');
  }

  productCard(id) {
    return this.driver.$(byTestId(`product-card-${id}`));
  }

  productName(id) {
    return this.driver.$(byTestId(`product-name-${id}`));
  }

  productImage(id) {
    return this.driver.$(byTestId(`product-image-${id}`));
  }

  productPrice(id) {
    return this.driver.$(byTestId(`product-price-${id}`));
  }

  addToCartButton(id) {
    return this.driver.$(byTestId(`product-add-${id}`));
  }

  async openLogin() {
    await (await this.loginLink).click();
  }

  async openCart() {
    await (await this.cartLink).click();
  }

  async searchFor(query) {
    const input = await this.searchInput;
    await input.setValue(query);
    await (await this.searchButton).click();
  }

  // Nút OK của Alert "Thành công – Đã thêm vào giỏ hàng" (Alert.alert trong App.js).
  get alertOkButton() {
    return this.driver.$('android=new UiSelector().resourceId("android:id/button1")');
  }

  // Mỗi lần thêm, app mở Alert che toàn màn hình; phải đóng Alert trước khi thao tác tiếp,
  // nếu không cú bấm kế tiếp rơi vào hộp thoại và cây UI không còn nav-cart.
  async addToCart(id, times = 1) {
    for (let i = 0; i < times; i += 1) {
      const button = await this.addToCartButton(id);
      await button.waitForDisplayed({ timeout: 10_000 });
      await button.click();
      const ok = await this.alertOkButton;
      await ok.waitForDisplayed({ timeout: 10_000 });
      await ok.click();
      await ok.waitForExist({ timeout: 10_000, reverse: true });
    }
  }
}

module.exports = { HomePage };
