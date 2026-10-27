// File mẫu: MỘT test Appium có đủ các thành phần, đọc từ trên xuống.
// Bộ test thật tách các phần này ra nhiều file (config/, pages/, data/, tests/);
// file này gom lại một chỗ để người mới thấy cả cấu trúc trước khi đọc bộ test thật.
//
// Chạy từ src/appium, khi emulator, backend, Metro và Appium server đã bật:
//   npm run example
// Không có APPLITOOLS_API_KEY (hoặc đặt EYES=off) thì phần Eyes được bỏ qua.
// Tên file không khớp mẫu *.test.js / *-test.js của Node test runner, nên `npm test` không tự chạy file này.
//
// Kịch bản: tìm kiếm theo bảng dữ liệu, không cần đăng nhập
// (nên không ảnh hưởng bộ đếm sai mật khẩu của backend).

require("dotenv").config();
const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { remote } = require("webdriverio");
const { Eyes, Target, Configuration, BatchInfo } = require("@applitools/eyes-webdriverio");

// ── 1. SESSION & CAPABILITIES ───────────────────────────────────────────────
// Capabilities cho Appium biết dùng nền tảng nào, driver nào, cài app nào.
// Khoá chuẩn W3C (platformName) viết trần; khoá riêng của Appium có tiền tố "appium:".
const APP_PACKAGE = "com.eshop.sut";
const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2", // Appium chọn driver theo khoá này
  "appium:deviceName": "Android Emulator",
  "appium:app":
    process.env.ESHOP_APK_PATH ||
    path.resolve(__dirname, "../../../eshop-sut-main/frontend-mobile/android/app/build/outputs/apk/debug/app-debug.apk"),
  "appium:appPackage": APP_PACKAGE,
  "appium:noReset": false, // xoá dữ liệu app khi mở và đóng phiên → mỗi lần chạy bắt đầu sạch
};

// Mở phiên: test gửi capabilities tới Appium server (cổng 4723, đường gốc "/").
function openSession() {
  return remote({ hostname: "127.0.0.1", port: 4723, path: "/", logLevel: "error", capabilities });
}

// ── 2. LOCATOR ──────────────────────────────────────────────────────────────
// testID trong code React Native hiện thành resource-id trên Android.
// Tìm theo resource-id không phụ thuộc chữ hiển thị hay vị trí, nên ít gãy khi đổi giao diện.
const byId = (id) => `android=new UiSelector().resourceId("${id}")`;

// ── 3. PAGE OBJECT ──────────────────────────────────────────────────────────
// Gom locator và thao tác của MỘT màn hình vào một lớp. Test chỉ gọi home.search("iPhone");
// khi giao diện đổi, chỉ phải sửa ở đây. (Bộ test thật: pages/home.page.js.)
class HomeScreen {
  constructor(driver) {
    this.driver = driver;
  }

  get searchInput() { return this.driver.$(byId("search-input")); }
  get searchButton() { return this.driver.$(byId("search-submit")); }
  get resultCount() { return this.driver.$(byId("search-result-count")); } // "Hiển thị N sản phẩm"
  productName(id) { return this.driver.$(byId(`product-name-${id}`)); }

  // Bản debug đôi khi không tự lên màn hình sau khi cài, nên chủ động mở lại app
  // rồi chờ một phần tử của màn chính.
  async open() {
    await this.driver.terminateApp(APP_PACKAGE);
    await this.driver.activateApp(APP_PACKAGE);
    await (await this.searchInput).waitForDisplayed({ timeout: 30_000 });
  }

  async search(keyword) {
    await (await this.searchInput).setValue(keyword); // setValue xoá chữ cũ rồi gõ chữ mới
    await (await this.searchButton).click();
    // Bàn phím ảo còn mở sẽ che phần dưới màn hình; UiAutomator2 không trả về phần tử bị che.
    if (await this.driver.isKeyboardShown()) await this.driver.hideKeyboard();
  }
}

// ── 4. DATA ─────────────────────────────────────────────────────────────────
// Dữ liệu tách khỏi code test: thêm một trường hợp = thêm một dòng.
// (Bộ test thật để bảng này trong data/cases.js.)
const SEARCH_CASES = [
  { keyword: "iPhone", count: 1, names: { 1: "iPhone 15 Pro Max" } },
  { keyword: "Pro M", count: 2, names: { 1: "iPhone 15 Pro Max", 3: "MacBook Pro M3" } },
];

// ── 5. EYES (tuỳ chọn) ──────────────────────────────────────────────────────
// Eyes là lớp cộng thêm: không có API key hoặc EYES=off thì trả null, phần chức năng vẫn chạy đủ.
// Batch riêng "EShop - example" để không lẫn với kết quả của bộ test chính.
// Khi bật Eyes, terminal có thể in "ERROR webdriver: Method is not implemented ... execute/sync":
// SDK thử một lệnh dành cho trang web, app native không hỗ trợ; kết quả test không bị ảnh hưởng.
function createEyes() {
  const apiKey = (process.env.APPLITOOLS_API_KEY || "").trim();
  if (!apiKey || process.env.EYES === "off") {
    console.log("Eyes: tắt — chỉ chạy phần chức năng");
    return null;
  }
  const conf = new Configuration();
  conf.setApiKey(apiKey);
  conf.setAppName("EShop");
  conf.setBatch(new BatchInfo("EShop - example"));
  const eyes = new Eyes();
  eyes.setConfiguration(conf);
  return eyes;
}

// Bỏ qua thanh trạng thái (giờ, pin đổi theo từng lần chạy). Toạ độ theo màn hình 1080×2400;
// vùng khai báo trong code nên được kiểm tra lại trên dashboard (báo cáo, mục 4.5).
const STATUS_BAR = { left: 0, top: 0, width: 1080, height: 80 };

// ── 6. TEST: action → wait → assertion, lặp theo bảng dữ liệu ───────────────
test("Ví dụ: tìm kiếm theo bảng dữ liệu", { timeout: 180_000 }, async (t) => {
  let driver;
  const eyes = createEyes();
  try {
    driver = await openSession();
    // Tên test cố định là khoá của baseline: đổi tên nghĩa là tạo baseline mới.
    if (eyes) await eyes.open(driver, "EShop", "Example - search");
    const home = new HomeScreen(driver);
    await home.open();

    for (const row of SEARCH_CASES) {
      await t.test(`tìm "${row.keyword}" → ${row.count} sản phẩm`, async () => {
        // 6a. ACTION
        await home.search(row.keyword);

        // 6b. WAIT: chờ một điều kiện cụ thể, có giới hạn thời gian; không dùng sleep cố định.
        // Appium chỉ thấy màn hình tại lúc lệnh tới, không biết app còn đang tải dữ liệu.
        const expected = `Hiển thị ${row.count} sản phẩm`;
        await driver.waitUntil(
          async () => {
            const el = await home.resultCount;
            return (await el.isExisting()) && (await el.getText()) === expected;
          },
          { timeout: 20_000, timeoutMsg: `Không thấy "${expected}"` },
        );

        // 6c. ASSERTION: so dữ liệu trên màn hình với dữ liệu mong đợi. Sai thì test fail.
        for (const [id, name] of Object.entries(row.names)) {
          assert.equal(await (await home.productName(id)).getText(), name);
        }

        // Checkpoint Eyes: chụp SAU khi assertion đã qua, để ảnh ở đúng trạng thái.
        if (eyes) await eyes.check(`Search "${row.keyword}"`, Target.window().ignoreRegions(STATUS_BAR));
      });
    }

    if (eyes) {
      // close(false): khác biệt giao diện không làm test fail; kết quả xem trên dashboard.
      const r = await eyes.close(false);
      if (r) console.log(`Eyes: ${r.getStatus()} | ${r.getUrl()}`);
    }
  } finally {
    // ── 7. TEARDOWN ───────────────────────────────────────────────────────────
    // Luôn đóng phiên, kể cả khi test fail; nếu không, phiên còn treo sẽ chặn lần chạy sau
    // (UiAutomator2 chỉ cho một phiên trên một thiết bị).
    if (eyes) await eyes.abort(); // không làm gì nếu đã close
    if (driver) await driver.deleteSession();
  }
});
