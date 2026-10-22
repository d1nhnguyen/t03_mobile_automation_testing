const assert = require("node:assert/strict");

const APP_PACKAGE = "com.eshop.sut";

// Chỉ giữ chữ số để so sánh tiền, tránh phụ thuộc vào dấu phân cách của toLocaleString.
const digits = (text) => String(text).replace(/\D/g, "");

// Debug APK có thể không được đưa lên foreground sau khi emulator cold start.
// Chủ động mở lại app sau khi Appium tạo session xong, rồi đợi màn Home.
async function startApp(driver, home) {
  await driver.terminateApp(APP_PACKAGE);
  await driver.activateApp(APP_PACKAGE);
  await (await home.loginLink).waitForDisplayed({ timeout: 30_000 });
}

async function signInAs(home, login, user) {
  await home.openLogin();
  await (await login.screen).waitForDisplayed({ timeout: 10_000 });
  await login.signIn(user.email, user.password);
  await (await home.profileLink).waitForDisplayed({ timeout: 20_000 });
  assert.match(
    await (await home.profileLink).getAttribute("content-desc"),
    new RegExp(user.displayName),
  );
  await (await home.searchInput).waitForDisplayed({ timeout: 10_000 });
  await hideKeyboardIfShown(home.driver);
}

// Bàn phím ảo còn mở sau khi nhập liệu sẽ che phần dưới màn hình; UiAutomator2
// không trả về phần tử bị che, nên click sẽ báo "element wasn't found".
async function hideKeyboardIfShown(driver) {
  if (await driver.isKeyboardShown()) {
    await driver.hideKeyboard();
  }
}

module.exports = { APP_PACKAGE, digits, startApp, signInAs, hideKeyboardIfShown };
