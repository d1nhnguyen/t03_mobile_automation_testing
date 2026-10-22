# A2 — Thiết kế bộ test Appium data-driven cho EShop

Tài liệu mô tả bộ test trong [`src/appium/`](../src/appium/) sau khi mở rộng ngày 22/10/2026: từ một ca đăng nhập + tìm kiếm cố định thành ba test điều khiển bằng bảng dữ liệu, có bước nghiệp vụ tính tiền. Phạm vi kiểm chứng: Ubuntu/Linux, AVD `eshop_api34` (Android 14, 1080×2400), Appium 2.19.0, UiAutomator2 4.2.9, Node.js 20.19.

## 1. Cấu trúc

| Thành phần | File | Vai trò |
|---|---|---|
| Bảng dữ liệu | `data/cases.js` | `LOGIN_CASES`, `SEARCH_CASES`, `CART_CASE`; đổi dữ liệu không cần sửa test |
| Page Object | `pages/login.page.js`, `pages/home.page.js`, `pages/cart.page.js` | Gom locator và thao tác theo màn hình; locator là `testID` → `resource-id` |
| Hàm dùng chung | `tests/helpers.js` | Mở app sau khi tạo session, đăng nhập, ẩn bàn phím, so sánh tiền theo chữ số |
| Test | `tests/login-search.test.js`, `tests/cart-total.test.js` | Ba test, mỗi test một phiên Appium (`noReset=false`) |
| Đo lặp lại | `scripts/measure-runs.sh` | Chạy `npm test` N lượt, ghi CSV/log vào `docs/evidence/` |

`npm test` = `node --test --test-concurrency=1`: các file test chạy tuần tự vì UiAutomator2 chỉ cho một instrumentation trên một thiết bị.

## 2. Ba khối Record & Playback · Data-driven · Checkpoint

| Khối | Thể hiện ở đâu |
|---|---|
| Record & Playback | Appium Inspector (plugin web, xem [A1](A1_Setup.md) mục 4) dùng để khám phá cây UI và ghi thao tác; code sinh ra là bản nháp, test chính thức giữ Page Object |
| Data-driven | Mỗi dòng của `LOGIN_CASES` / `SEARCH_CASES` là một subtest riêng trong TAP (`L1`, `L2`, `S1`–`S3`); thêm dòng mới chỉ cần sửa `cases.js` |
| Checkpoint | Assertion chức năng: thông báo lỗi, tên người dùng trên thanh điều hướng, số kết quả, tên sản phẩm có/không xuất hiện, thành tiền và tổng tạm tính = đơn giá × số lượng |

## 3. Bảng dữ liệu đang dùng

**Đăng nhập** (thứ tự cố định L1 → L2, xem mục 5):

| ID | Email | Mật khẩu | Kỳ vọng |
|---|---|---|---|
| L1 | `test@eshop.com` | `SaiMatKhau-1` | Còn ở màn Login, hiện `login-error` chứa "Đăng nhập thất bại", chưa có `nav-profile` |
| L2 | `test@eshop.com` | `Test1234!` | `nav-profile` hiện "Chào, Test User", không còn `login-error` |

**Tìm kiếm** (backend lọc `name LIKE '%keyword%'`):

| ID | Từ khoá | Số kết quả | Phải có | Không được có |
|---|---|---|---|---|
| S1 | `iPhone` | 1 | id 1 iPhone 15 Pro Max | 2, 3, 4, 5 |
| S2 | `Pro M` | 2 | id 1, id 3 MacBook Pro M3 | 2, 4, 5 |
| S3 | `Nokia 3310` | 0 | — (không còn dòng `search-result-count`) | 1–5 |

**Giỏ hàng:** sản phẩm 1, đơn giá 30 000 000, bấm "Thêm vào giỏ" 2 lần → `cart-subtotal-1` và `cart-total` đều có chữ số `60000000`; xoá dòng → `cart-empty` hiện, `cart-total` biến mất. So sánh bằng chữ số để không phụ thuộc dấu phân cách của `toLocaleString`.

## 4. `testID` thêm cho A2

Thêm vào `eshop-sut-main/frontend-mobile/App.js`, chỉ gắn nhãn phần tử, không đổi hành vi: `nav-cart`, `product-price-<id>`, `product-add-<id>`, `cart-empty`, `cart-item-<id>`, `cart-name-<id>`, `cart-subtotal-<id>`, `cart-remove-<id>`, `cart-total`. Bảng đầy đủ ở [A1](A1_Setup.md) mục 4. Vì chỉ đổi JavaScript nên Metro nạp lại, không cần build lại APK.

## 5. Phát hiện về SUT trong khi viết test

Đây là hành vi của EShop quan sát được bằng test và đọc mã; test được thiết kế để không bị chúng làm sai lệch, đồng thời chúng là tư liệu cho phần "điểm yếu / failure modes" của báo cáo.

| # | Hành vi | Ảnh hưởng tới test | Cách xử lý trong test |
|---|---|---|---|
| 1 | `server.js` cộng **2** vào `login_attempts` mỗi lần sai và khoá 3 phút khi ≥ 3 → **2 lần sai liên tiếp là bị khoá**; đăng nhập đúng reset về 0 | Chạy lặp nhiều lượt có thể khoá tài khoản demo | Mỗi lượt chỉ sai đúng một lần (L1) rồi đăng nhập đúng (L2); nếu lượt trước gãy giữa chừng, khởi động lại backend để seed lại |
| 2 | `App.js` luôn hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại." bất kể backend trả sai mật khẩu hay "Tài khoản đã bị khóa" | Không phân biệt được hai lỗi qua giao diện | Assert theo chuỗi của app; ghi nhận là failure mode: UI che mất nguyên nhân |
| 3 | Sau mỗi lần "Thêm vào giỏ", app mở `Alert` "Thành công" che toàn màn hình; cú bấm kế tiếp rơi vào hộp thoại | Lần chạy đầu: bấm 2 lần nhưng chỉ thêm 1; `nav-cart` "biến mất" khỏi cây UI | `addToCart` đợi và bấm `android:id/button1` (OK) sau mỗi lần thêm |
| 4 | Ô số lượng trong giỏ cộng thêm 1 khi parse (`parsed + 1`) | Gõ "2" thành 3 | Không gõ vào ô số lượng; tăng số lượng bằng cách thêm lại sản phẩm |
| 5 | Bàn phím ảo còn mở sau khi nhập liệu che phần dưới màn hình; UiAutomator2 không trả về phần tử bị che | "element wasn't found" dù phần tử có trong mã | `hideKeyboardIfShown` sau đăng nhập; `waitForDisplayed` trước khi bấm |
| 6 | Route `/api/products?search=` nối chuỗi thẳng vào SQL | Không ảnh hưởng test hiện tại | Ghi nhận (rủi ro SQL injection) cho phần đánh giá SUT; không khai thác trong demo |

## 6. Cách chạy

Theo [A1](A1_Setup.md): backend, emulator, `adb reverse tcp:8081 tcp:8081`, Metro, Appium. Rồi:

```bash
cd src/appium
export APPIUM_HOME="$PWD/.appium"
npm test                       # 3 file test, tuần tự, ~2 phút
bash scripts/measure-runs.sh   # 10 lượt, ghi docs/evidence/A3_runs_<ngày>.csv|log
```

Kết quả TAP mong đợi: `ok 1 … giỏ hàng`, `ok 2 … đăng nhập theo bảng dữ liệu` (2 subtest), `ok 3 … tìm kiếm theo bảng dữ liệu` (3 subtest); `# pass 8`, `# fail 0` (3 test + 5 subtest).

## 7. Bằng chứng

- Lượt chạy xanh đầu tiên của bộ data-driven: 22/10/2026 (log trong `docs/evidence/A3_runs_2026-10-22*.log` của chiến dịch đo sau khi mở rộng; xem [A3](A3_Metrics.md)).
- Phiên Appium Inspector thật (plugin 2025.3.1, 23/10/2026 00:08–00:11): [`A2_inspector_01_session_home.png`](evidence/A2_inspector_01_session_home.png) (phiên vừa tạo, màn Home), [`A2_inspector_02_login_source.png`](evidence/A2_inspector_02_login_source.png) (sau khi Tap `nav-login`, Recorder đang bật), [`A2_inspector_03_login_email_selected.png`](evidence/A2_inspector_03_login_email_selected.png) (Selected Element: `id = login-email`, selector UiAutomator, `text = test@eshop.com` vừa gửi), [`A2_inspector_04_recorder_code.png`](evidence/A2_inspector_04_recorder_code.png) và [`A2_inspector_recorder_2026-10-23.js`](evidence/A2_inspector_recorder_2026-10-23.js) (code Recorder dạng JS – WebdriverIO).
- Lưu ý khi dùng tìm kiếm trong Inspector: chiến lược `Id` tự thêm tiền tố package (`com.eshop.sut:id/...`) nên không khớp `testID` của React Native; dùng chiến lược `UIAutomator` với `new UiSelector().resourceId("...")`, đúng như `config/locators.js`.
- Code Recorder sinh ra dùng `$$` + chỉ số `[0]`, không có wait và không có assertion. Đó là lý do nhóm giữ Page Object và `waitForDisplayed` trong test chính thức.
