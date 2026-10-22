// Bảng dữ liệu cho các test data-driven của EShop (A2).
// Dữ liệu khớp seed trong eshop-sut-main/backend/database.js.

const DEMO_USER = {
  email: "test@eshop.com",
  password: "Test1234!",
  displayName: "Test User",
};

// Thứ tự L1 -> L2 là cố định: backend cộng 2 vào login_attempts cho mỗi lần sai
// và khoá tài khoản 3 phút khi >= 3 (server.js, /api/login). Một lần sai rồi
// đăng nhập đúng sẽ reset về 0, nên mỗi lượt chạy chỉ được phép sai đúng một lần.
const LOGIN_CASES = [
  {
    id: "L1",
    label: "sai mật khẩu",
    email: DEMO_USER.email,
    password: "SaiMatKhau-1",
    expect: "error",
    // App.js (handleLogin) luôn hiển thị chuỗi này, bất kể backend trả "Invalid email
    // or password" hay "Tài khoản đã bị khóa": người dùng không phân biệt được sai mật
    // khẩu với bị khoá. Ghi nhận làm failure mode của SUT, không phải của Appium.
    errorPattern: /Đăng nhập thất bại/,
  },
  {
    id: "L2",
    label: "đúng tài khoản",
    email: DEMO_USER.email,
    password: DEMO_USER.password,
    expect: "success",
  },
];

// Backend tìm theo LIKE %keyword% trên tên sản phẩm.
const SEARCH_CASES = [
  {
    id: "S1",
    keyword: "iPhone",
    expectedCount: 1,
    expected: [{ id: 1, name: "iPhone 15 Pro Max" }],
    absentIds: [2, 3, 4, 5],
  },
  {
    id: "S2",
    keyword: "Pro M",
    expectedCount: 2,
    expected: [
      { id: 1, name: "iPhone 15 Pro Max" },
      { id: 3, name: "MacBook Pro M3" },
    ],
    absentIds: [2, 4, 5],
  },
  {
    id: "S3",
    keyword: "Nokia 3310",
    expectedCount: 0,
    expected: [],
    absentIds: [1, 2, 3, 4, 5],
  },
];

// Thêm cùng một sản phẩm hai lần bằng nút "Thêm vào giỏ" (mỗi lần +1),
// rồi kiểm tra thành tiền và tổng tạm tính = đơn giá x số lượng.
// Không gõ vào ô số lượng: App.js cộng thêm 1 khi parse (parsed + 1).
const CART_CASE = {
  productId: 1,
  name: "iPhone 15 Pro Max",
  unitPrice: 30000000,
  addTimes: 2,
};

module.exports = { DEMO_USER, LOGIN_CASES, SEARCH_CASES, CART_CASE };
