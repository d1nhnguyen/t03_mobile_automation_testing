const assert = require("node:assert/strict");
const test = require("node:test");
const { createSession } = require("../config/session");
const { createEyes } = require("../config/eyes");
const { checkpointAs } = require("../config/checkpoints");
const { DEMO_USER, LOGIN_CASES, SEARCH_CASES } = require("../data/cases");
const { HomePage } = require("../pages/home.page");
const { LoginPage } = require("../pages/login.page");
const { startApp, signInAs } = require("./helpers");

test("EShop: đăng nhập theo bảng dữ liệu", { timeout: 180_000 }, async (t) => {
  let driver;
  const eyes = createEyes();
  try {
    driver = await createSession();
    await eyes.open(driver, "EShop", "Login data-driven"); // tên cố định = khóa baseline
    const home = new HomePage(driver);
    const login = new LoginPage(driver);
    await startApp(driver, home);
    await home.openLogin();
    await (await login.screen).waitForDisplayed({ timeout: 10_000 });

    // Checkpoint 1: màn hình Login ban đầu (chưa nhập gì)
    await checkpointAs(eyes, "login", "Login - initial");

    for (const row of LOGIN_CASES) {
      await t.test(`${row.id} ${row.label}`, async () => {
        await login.signIn(row.email, row.password);
        if (row.expect === "error") {
          await (await login.errorMessage).waitForDisplayed({ timeout: 15_000 });
          assert.match(await (await login.errorMessage).getText(), row.errorPattern);
          assert.equal(await (await login.screen).isDisplayed(), true);
          assert.equal(await (await home.profileLink).isExisting(), false);
          // Checkpoint: màn hình Login hiển thị lỗi (sau khi assert xong)
          await checkpointAs(eyes, "login", `Login - ${row.id} error`);
        } else {
          await (await home.profileLink).waitForDisplayed({ timeout: 20_000 });
          assert.match(
            await (await home.profileLink).getAttribute("content-desc"),
            new RegExp(DEMO_USER.displayName),
          );
          assert.equal(await (await login.errorMessage).isExisting(), false);
          // Checkpoint: Home sau đăng nhập thành công
          await (await home.productCard(1)).waitForDisplayed({ timeout: 20_000 }); // ĐỔI: chờ danh sách tải xong
          await checkpointAs(eyes, "homeLoggedIn", `Home - ${row.id} logged in`, { home, requireImage: true }); // ĐỔI
        }
      });
    }

    await eyes.close(false); // không throw, xem kết quả trên dashboard
  } finally {
    await eyes.abort(); // không làm gì nếu đã close
    if (driver) await driver.deleteSession();
  }
});

test("EShop: tìm kiếm theo bảng dữ liệu", { timeout: 240_000 }, async (t) => {
  let driver;
  const eyes = createEyes();
  try {
    driver = await createSession();
    await eyes.open(driver, "EShop", "Search data-driven");
    const home = new HomePage(driver);
    const login = new LoginPage(driver);
    await startApp(driver, home);
    await signInAs(home, login, DEMO_USER);

    // Checkpoint: Home sau đăng nhập, trước khi tìm kiếm
    await (await home.productCard(1)).waitForDisplayed({ timeout: 20_000 }); // ĐỔI: chờ danh sách tải xong
    await checkpointAs(eyes, "homeLoggedIn", "Home - before search", { home, requireImage: true }); // ĐỔI

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
        // Checkpoint: kết quả tìm kiếm (hoặc trạng thái rỗng), chụp sau khi mọi assert đã qua
        await checkpointAs(eyes, "searchResults", `Search - ${row.id} "${row.keyword}"`, { home }); // ĐỔI: không requireImage vì sản phẩm 1 có thể không có trong kết quả
      });
    }

    await eyes.close(false);
  } finally {
    await eyes.abort();
    if (driver) await driver.deleteSession();
  }
});
