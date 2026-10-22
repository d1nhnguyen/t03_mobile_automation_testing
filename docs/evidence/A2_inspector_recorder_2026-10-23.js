// Đoạn code do Appium Inspector (plugin 2025.3.1) Recorder sinh ra, ngôn ngữ "JS - WebdriverIO",
// phiên thật trên AVD eshop_api34 ngày 23/10/2026 00:08–00:11 (UTC+7), app com.eshop.sut.
// Thao tác: tìm nav-login → tap → tìm login-email → gửi "test@eshop.com".
// Đây là bản nháp: không có wait, không Page Object, dùng $$ + chỉ số [0].
// Test chính thức của nhóm viết lại trong src/appium/pages/ và src/appium/tests/.
const els1 = await driver.$$("id:nav-login");
const els2 = await driver.$$("-android uiautomator:new UiSelector().resourceId(\"nav-login\")");
await els2[0].click();
const els3 = await driver.$$("-android uiautomator:new UiSelector().resourceId(\"login-email\")");
await els3[0].addValue("test@eshop.com");
