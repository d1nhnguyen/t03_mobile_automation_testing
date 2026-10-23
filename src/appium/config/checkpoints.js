const { Target, MatchLevel } = require("@applitools/eyes-webdriverio");

// Đổi theo độ phân giải AVD của bạn
const STATUS_BAR = { left: 0, top: 0, width: 1080, height: 80 };

// Quy tắc chung: Strict + bỏ qua status bar
function baseTarget() {
  return Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR);
}

// Home/Search: vùng ảnh sản phẩm 1 — IMAGE_REGION_MODE=layout (mặc định) | ignore.
// Vùng khai báo ở đây chưa chắc có hiệu lực trên ảnh của Eyes; đã kiểm chứng 23/10, xem
// docs/evidence/applitools-region-check-2026-10-23/README.md. TODO(nộp bài): xoá dòng này khi đã chốt.
const IMAGE_REGION_MODE = (process.env.IMAGE_REGION_MODE || "layout").toLowerCase();

async function targetWithProductImage(ctx) {
  let target = baseTarget();
  if (ctx && ctx.home) {
    const img = await ctx.home.productImage(1);
    if (await img.isExisting()) {
      target = IMAGE_REGION_MODE === "ignore" ? target.ignoreRegions(img) : target.layoutRegions(img);
      console.log(`Eyes: vùng ảnh sản phẩm 1 (${IMAGE_REGION_MODE}) — kiểm tra hiệu lực trên dashboard`);
    } else console.warn("Eyes: không thấy product-image-1, layout region không được gắn");
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
  if (!eyes) return; // Eyes tắt (không có khoá / EYES=off): bỏ qua checkpoint visual
  await eyes.check(name, await CHECKPOINTS[key].target(ctx));
}

async function checkpoint(eyes, key, ctx) {
  await checkpointAs(eyes, key, CHECKPOINTS[key].name, ctx);
}

module.exports = { CHECKPOINTS, checkpoint, checkpointAs, STATUS_BAR };
