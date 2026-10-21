const path = require("node:path");
const { remote } = require("webdriverio");

const defaultApk = path.resolve(
  __dirname,
  "../../../eshop-sut-main/frontend-mobile/android/app/build/outputs/apk/debug/app-debug.apk",
);

async function createSession() {
  const capabilities = {
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": process.env.ANDROID_DEVICE_NAME || "Android Emulator",
    "appium:app": process.env.ESHOP_APK_PATH || defaultApk,
    "appium:appPackage": "com.eshop.sut",
    "appium:noReset": false,
  };

  if (process.env.ANDROID_UDID) {
    capabilities["appium:udid"] = process.env.ANDROID_UDID;
  }

  return remote({
    hostname: process.env.APPIUM_HOST || "127.0.0.1",
    port: Number(process.env.APPIUM_PORT || 4723),
    path: "/",
    logLevel: "error",
    capabilities,
  });
}

module.exports = { createSession };
