
require("dotenv").config();

const {
  Eyes,
  Configuration,
  BatchInfo,
  MatchLevel,
} = require("@applitools/eyes-webdriverio");

function createEyes() {
  const apiKey = process.env.APPLITOOLS_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "Missing APPLITOOLS_API_KEY. Please check src/appium/.env"
    );
  }

  const eyes = new Eyes();
  const conf = new Configuration();

  conf.setApiKey(apiKey);
  conf.setAppName("EShop");
  conf.setBatch(new BatchInfo("EShop Appium"));
  conf.setMatchLevel(MatchLevel.Strict);
  conf.setSaveNewTests(true);
  conf.setHostApp("com.eshop.sut");
  conf.setHostOS("Android");

  eyes.setConfiguration(conf);

  return eyes;
}

module.exports = { createEyes };
