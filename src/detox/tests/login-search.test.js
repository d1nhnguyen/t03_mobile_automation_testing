describe("EShop login and product search", () => {
  beforeAll(async () => {
    await device.reverseTcpPort(8081);
    await device.launchApp({ delete: true });
  });

  it("signs in and filters products to iPhone", async () => {
    await waitFor(element(by.id("nav-login"))).toExist().withTimeout(30_000);
    await element(by.id("nav-login")).tap();
    await expect(element(by.id("login-screen"))).toExist();

    await element(by.id("login-email")).replaceText("test@eshop.com");
    await element(by.id("login-password")).replaceText("Test1234!");
    await element(by.id("login-submit")).tap();

    await waitFor(element(by.id("nav-profile"))).toExist().withTimeout(20_000);
    await expect(element(by.text("Chào, Test User"))).toExist();
    await expect(element(by.id("login-error"))).not.toExist();

    await element(by.id("search-input")).replaceText("iPhone");
    await element(by.id("search-submit")).tap();

    await waitFor(element(by.id("search-result-count")))
      .toHaveText("Hiển thị 1 sản phẩm")
      .withTimeout(20_000);
    await expect(element(by.id("search-query")))
      .toHaveText("Kết quả tìm kiếm cho: iPhone");
    await expect(element(by.id("product-name-1"))).toHaveText("iPhone 15 Pro Max");
    await expect(element(by.id("product-name-2"))).not.toExist();
  });
});
