const { Target, MatchLevel } = require("@applitools/eyes-webdriverio");

// Vùng dùng chung cho mọi màn hình (đổi theo độ phân giải AVD của bạn)
const STATUS_BAR = { left: 0, top: 0, width: 1080, height: 80 };

// Mỗi checkpoint = tên + cách tạo target
const CHECKPOINTS = {
  login: {
    name: "Login Screen",
    target: () => Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR),
  },
  homeLoggedIn: {
    name: "Home - Logged In",
    target: () => Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR),
  },
  searchResults: {
    name: "Search Results - iPhone",
    target: () => Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR),
  },
};

CHECKPOINTS.cartFilled = {
  name: "Cart - With Item",
  target: () => Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR),
};

CHECKPOINTS.cartEmpty = {
  name: "Cart - Empty",
  target: () => Target.window().matchLevel(MatchLevel.Strict).ignoreRegions(STATUS_BAR),
};

// Hàm dùng chung: test chỉ cần gọi checkpoint(eyes, "login")
async function checkpoint(eyes, key) {
  const cp = CHECKPOINTS[key];
  await eyes.check(cp.name, cp.target());
}

async function checkpointAs(eyes, key, name) {
  await eyes.check(name, CHECKPOINTS[key].target());
}

module.exports = { CHECKPOINTS, checkpoint, checkpointAs, STATUS_BAR };

