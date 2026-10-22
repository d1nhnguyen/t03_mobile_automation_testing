const path = require("node:path");

const mobileRoot = path.resolve(__dirname, "../../eshop-sut-main/frontend-mobile");
const fromMobile = (name) => require.resolve(name, { paths: [mobileRoot] });

module.exports = {
  rootDir: path.resolve(__dirname, "../.."),
  testMatch: ["<rootDir>/src/detox/tests/**/*.test.js"],
  testTimeout: 120_000,
  maxWorkers: 1,
  globalSetup: fromMobile("detox/runners/jest/globalSetup"),
  globalTeardown: fromMobile("detox/runners/jest/globalTeardown"),
  reporters: [fromMobile("detox/runners/jest/reporter")],
  testEnvironment: fromMobile("detox/runners/jest/testEnvironment"),
  verbose: true,
};
