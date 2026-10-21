const assert = require("node:assert/strict");
const test = require("node:test");
const { createSession } = require("../config/session");
const { HomePage } = require("../pages/home.page");
const { LoginPage } = require("../pages/login.page");

const DEMO_EMAIL = "test@eshop.com";
const DEMO_PASSWORD = "Test1234!";
const PRODUCT_ID = 1;
const PRODUCT_NAME = "iPhone 15 Pro Max";

test("EShop: đăng nhập rồi tìm iPhone", { timeout: 120_000 }, async () => {
  let driver;
  try {
    driver = await createSession();
    const home = new HomePage(driver);
    const login = new LoginPage(driver);

    // A fresh Appium session resets app state (noReset=false in config/session.js).
    await (await home.loginLink).waitForDisplayed({ timeout: 20_000 });
    await home.openLogin();
    await (await login.screen).waitForDisplayed({ timeout: 10_000 });

    await login.signIn(DEMO_EMAIL, DEMO_PASSWORD);
    await (await home.profileLink).waitForDisplayed({ timeout: 20_000 });
    assert.match(await (await home.profileLink).getAttribute("content-desc"), /Test User/);
    assert.equal(await (await login.errorMessage).isExisting(), false);

    await (await home.searchInput).waitForDisplayed({ timeout: 10_000 });
    await home.searchFor("iPhone");
    await driver.waitUntil(
      async () => (await (await home.resultCount).getText()) === "Hiển thị 1 sản phẩm",
      { timeout: 20_000, timeoutMsg: "Tìm kiếm chưa trả về đúng một sản phẩm" },
    );
    assert.match(await (await home.searchQuery).getText(), /iPhone/);
    assert.equal(await (await home.productName(PRODUCT_ID)).getText(), PRODUCT_NAME);
    assert.equal(await (await home.productName(2)).isExisting(), false);
  } finally {
    if (driver) await driver.deleteSession();
  }
});
