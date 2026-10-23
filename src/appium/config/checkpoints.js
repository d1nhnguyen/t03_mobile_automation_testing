const { Target, MatchLevel } = require("@applitools/eyes-webdriverio");

// Đổi theo độ phân giải AVD của bạn
const STATUS_BAR = { left: 0, top: 0, width: 1080, height: 80 };

// Quy tắc chung: Strict + bỏ qua status bar
function baseTarget() {
  return Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR);
}

// Home/Search: ảnh sản phẩm 1 so ở mức Layout (bỏ qua nội dung ảnh, vẫn bắt lỗi khung/kích thước)
async function targetWithProductImage(ctx) {
  let target = baseTarget();
  if (ctx && ctx.home) {
    const img = await ctx.home.productImage(1);
    if (await img.isExisting()) target = target.layoutRegions(img);
  }
  return target;
}

const CHECKPOINTS = {
  login:         { name: "Login Screen",           target: async () => baseTarget() },
  homeLoggedIn:  { name: "Home - Logged In",       target: targetWithProductImage },
  searchResults: { name: "Search Results",         target: targetWithProductImage },
  cartFilled:    { name: "Cart - With Item",       target: async () => baseTarget() },
  cartEmpty:     { name: "Cart - Empty",           target: async () => baseTarget() },
};

// ctx = { home } khi checkpoint cần tìm phần tử (home/search)
async function checkpointAs(eyes, key, name, ctx) {
  await eyes.check(name, await CHECKPOINTS[key].target(ctx));
}

async function checkpoint(eyes, key, ctx) {
  await checkpointAs(eyes, key, CHECKPOINTS[key].name, ctx);
}

module.exports = { CHECKPOINTS, checkpoint, checkpointAs, STATUS_BAR };
