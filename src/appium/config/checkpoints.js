const { Target, MatchLevel } = require("@applitools/eyes-webdriverio");

// Đổi theo độ phân giải AVD của bạn
const STATUS_BAR = { left: 0, top: 0, width: 1080, height: 80 };

// Quy tắc chung: Strict + bỏ qua status bar
function baseTarget() {
  return Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR);
}

// Home/Search: ảnh sản phẩm 1 so ở mức Layout (bỏ qua nội dung ảnh, vẫn bắt lỗi khung/kích thước)
// IMAGE_REGION_MODE=layout (mặc định): vùng ảnh sản phẩm 1 so ở mức Layout.
// IMAGE_REGION_MODE=ignore: bỏ hẳn vùng ảnh khỏi so sánh.
//
// LƯU Ý ĐÃ KIỂM CHỨNG (23/10/2026, SDK eyes-webdriverio 5.61.14, Appium 2.19 native Android, AVD 1080x2400):
// vùng truyền bằng phần tử WebdriverIO (hoặc toạ độ px/dp/viewport tự quy đổi) KHÔNG trùng vị trí ảnh trên
// ảnh chụp của Eyes: bản V1 (chỉ đổi ảnh sản phẩm 1) vẫn Unresolved dù đã ignoreRegions/layoutRegions;
// chỉ vùng phủ toàn màn hình mới Passed, còn base đối chứng Passed. Vì vậy vùng khai báo ở đây chưa được coi
// là có hiệu lực; vùng có hiệu lực trong B2 là vùng đặt trên dashboard (docs/evidence/.../v1_home_with_layout_region.png).
// Giữ code để demo "khai báo vùng trong code" và để tiếp tục điều tra; phải xác nhận lại trên dashboard sau mỗi lần chạy.
const IMAGE_REGION_MODE = (process.env.IMAGE_REGION_MODE || "layout").toLowerCase();

async function targetWithProductImage(ctx) {
  let target = baseTarget();
  if (ctx && ctx.home) {
    const img = await ctx.home.productImage(1);
    if (await img.isExisting()) {
      target = IMAGE_REGION_MODE === "ignore" ? target.ignoreRegions(img) : target.layoutRegions(img);
      console.log(`Eyes: vùng ảnh sản phẩm 1 gửi kèm checkpoint (${IMAGE_REGION_MODE}); hiệu lực phải kiểm tra trên dashboard`);
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
