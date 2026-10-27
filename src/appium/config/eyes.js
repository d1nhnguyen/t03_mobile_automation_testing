require("dotenv").config();
const variant = process.env.VARIANT_LABEL || "base";

const {
  Eyes,
  Configuration,
  BatchInfo,
  MatchLevel,
} = require("@applitools/eyes-webdriverio");

// Eyes là lớp cộng thêm. Không có khoá (hoặc EYES=off) thì trả về null:
// các checkpoint bị bỏ qua, assertion chức năng vẫn chạy đầy đủ.
// Lý do: lớp functional là lưới an toàn, không được phụ thuộc vào trial/khoá của Applitools.
function createEyes() {
  const apiKey = (process.env.APPLITOOLS_API_KEY || "").trim();

  if (!apiKey || process.env.EYES === "off") {
    const why = process.env.EYES === "off" ? "EYES=off" : "không có APPLITOOLS_API_KEY";
    console.log(`Eyes: tắt (${why}) — chỉ chạy assertion chức năng`);
    return null;
  }

  const eyes = new Eyes();
  const conf = new Configuration();

  conf.setApiKey(apiKey);
  conf.setAppName("EShop");
  conf.setBatch(new BatchInfo(`EShop - ${variant}`));
  conf.setMatchLevel(MatchLevel.Strict);
  conf.setSaveNewTests(true);
  conf.setHostApp("com.eshop.sut");
  conf.setHostOS("Android");

  eyes.setConfiguration(conf);

  return eyes;
}

// Mở phiên Eyes nếu có; tên test cố định là khoá baseline.
async function openEyes(eyes, driver, testName) {
  if (eyes) await eyes.open(driver, "EShop", testName);
}

// Đóng phiên và in trạng thái + link dashboard vào TAP.
// close(false): diff visual không làm test chức năng đỏ, nhưng không bị nuốt im lặng.
async function closeEyes(eyes) {
  if (!eyes) return null;
  const r = await eyes.close(false);
  if (r) {
    console.log(`Eyes: ${r.getStatus()} | ${r.getName()} | steps ${r.getSteps()} (mismatch ${r.getMismatches()}, missing ${r.getMissing()}) | ${r.getUrl()}`);
  }
  return r;
}

// Gọi trong finally; không làm gì nếu đã close hoặc Eyes tắt.
async function abortEyes(eyes) {
  if (eyes) await eyes.abort();
}

module.exports = { createEyes, openEyes, closeEyes, abortEyes };
