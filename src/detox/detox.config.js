const path = require("node:path");

const mobileRoot = path.resolve(__dirname, "../../eshop-sut-main/frontend-mobile");

module.exports = {
  artifacts: {
    rootDir: path.resolve(__dirname, "../../.artifacts/detox"),
  },
  testRunner: {
    args: {
      $0: "jest",
      config: path.join(__dirname, "jest.config.js"),
    },
  },
  apps: {
    "android.debug": {
      type: "android.apk",
      binaryPath: path.join(mobileRoot, "android/app/build/outputs/apk/debug/app-debug.apk"),
      testBinaryPath: path.join(mobileRoot, "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk"),
      build: `cd "${mobileRoot}/android" && ./gradlew :app:assembleDebug :app:assembleDebugAndroidTest -DtestBuildType=debug -PreactNativeArchitectures=x86_64 --max-workers=2 --no-parallel`,
    },
  },
  devices: {
    emulator: {
      type: "android.emulator",
      device: { avdName: process.env.DETOX_AVD_NAME || "eshop_api34" },
    },
  },
  configurations: {
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
