const assert = require("node:assert/strict");
const test = require("node:test");
const { createSession } = require("../config/session");
const { DEMO_USER, LOGIN_CASES, SEARCH_CASES } = require("../data/cases");
const { HomePage } = require("../pages/home.page");
const { LoginPage } = require("../pages/login.page");
const { startApp, signInAs } = require("./helpers");

test("EShop: đăng nhập theo bảng dữ liệu", { timeout: 180_000 }, async (t) => {
  let driver;
  try {
    driver = await createSession();
    const home = new HomePage(driver);
    const login = new LoginPage(driver);
    await startApp(driver, home);
    await home.openLogin();
    await (await login.screen).waitForDisplayed({ timeout: 10_000 });

    for (const row of LOGIN_CASES) {
      await t.test(`${row.id} ${row.label}`, async () => {
        await login.signIn(row.email, row.password);
        if (row.expect === "error") {
          await (await login.errorMessage).waitForDisplayed({ timeout: 15_000 });
          assert.match(await (await login.errorMessage).getText(), row.errorPattern);
          assert.equal(await (await login.screen).isDisplayed(), true);
          assert.equal(await (await home.profileLink).isExisting(), false);
        } else {
          await (await home.profileLink).waitForDisplayed({ timeout: 20_000 });
          assert.match(
            await (await home.profileLink).getAttribute("content-desc"),
            new RegExp(DEMO_USER.displayName),
          );
          assert.equal(await (await login.errorMessage).isExisting(), false);
        }
      });
    }
  } finally {
    if (driver) await driver.deleteSession();
  }
});

test("EShop: tìm kiếm theo bảng dữ liệu", { timeout: 240_000 }, async (t) => {
  let driver;
  try {
    driver = await createSession();
    const home = new HomePage(driver);
    const login = new LoginPage(driver);
    await startApp(driver, home);
    await signInAs(home, login, DEMO_USER);

    for (const row of SEARCH_CASES) {
      await t.test(`${row.id} "${row.keyword}" → ${row.expectedCount} sản phẩm`, async () => {
        await home.searchFor(row.keyword);
        await driver.waitUntil(
          async () =>
            (await (await home.searchQuery).getText()).includes(row.keyword) &&
            !(await (await home.loadingText).isExisting()),
          { timeout: 20_000, timeoutMsg: `Chưa tải xong kết quả cho "${row.keyword}"` },
        );
        if (row.expectedCount > 0) {
          await driver.waitUntil(
            async () =>
              (await (await home.resultCount).getText()) ===
              `Hiển thị ${row.expectedCount} sản phẩm`,
            { timeout: 20_000, timeoutMsg: `Số kết quả khác ${row.expectedCount}` },
          );
          for (const p of row.expected) {
            assert.equal(await (await home.productName(p.id)).getText(), p.name);
          }
        } else {
          await driver.waitUntil(
            async () => !(await (await home.resultCount).isExisting()),
            { timeout: 20_000, timeoutMsg: "Vẫn còn dòng đếm kết quả khi tìm không ra" },
          );
        }
        for (const id of row.absentIds) {
          assert.equal(await (await home.productCard(id)).isExisting(), false, `product-card-${id} không được xuất hiện`);
        }
      });
    }
  } finally {
    if (driver) await driver.deleteSession();
  }
});
