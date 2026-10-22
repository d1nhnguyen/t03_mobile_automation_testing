const assert = require("node:assert/strict");
const test = require("node:test");
const { createSession } = require("../config/session");
const { DEMO_USER, CART_CASE } = require("../data/cases");
const { CartPage } = require("../pages/cart.page");
const { HomePage } = require("../pages/home.page");
const { LoginPage } = require("../pages/login.page");
const { digits, startApp, signInAs } = require("./helpers");

test("EShop: thêm giỏ hàng và kiểm tra tổng tiền", { timeout: 180_000 }, async () => {
  let driver;
  try {
    driver = await createSession();
    const home = new HomePage(driver);
    const login = new LoginPage(driver);
    const cart = new CartPage(driver);
    await startApp(driver, home);
    await signInAs(home, login, DEMO_USER);

    const { productId, name, unitPrice, addTimes } = CART_CASE;
    await (await home.productCard(productId)).waitForDisplayed({ timeout: 20_000 });
    assert.equal(await (await home.productName(productId)).getText(), name);
    assert.equal(digits(await (await home.productPrice(productId)).getText()), String(unitPrice));

    await home.addToCart(productId, addTimes);
    await driver.waitUntil(
      async () => (await (await home.cartLink).getAttribute("content-desc")) === "Giỏ (1)",
      { timeout: 10_000, timeoutMsg: "Thanh điều hướng chưa hiển thị 1 dòng giỏ hàng" },
    );

    await home.openCart();
    await (await cart.item(productId)).waitForDisplayed({ timeout: 10_000 });
    assert.equal(await (await cart.name(productId)).getText(), name);
    const expectedTotal = String(unitPrice * addTimes);
    assert.equal(digits(await (await cart.subtotal(productId)).getText()), expectedTotal);
    assert.equal(digits(await (await cart.total).getText()), expectedTotal);

    await (await cart.removeButton(productId)).click();
    await (await cart.emptyBox).waitForDisplayed({ timeout: 10_000 });
    assert.equal(await (await cart.total).isExisting(), false);
  } finally {
    if (driver) await driver.deleteSession();
  }
});
