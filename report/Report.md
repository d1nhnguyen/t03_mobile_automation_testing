# Báo cáo T03 — Mobile Automation Testing

**Môn:** CS423 / CSC15003 Kiểm thử phần mềm  
**SUT:** EShop React Native Expo (`eshop-sut-main/frontend-mobile`), package Android `com.eshop.sut`  
**Phạm vi đã đo:** Ubuntu/Linux, AVD `eshop_api34` (Android 14, 1080×2400), 22–23/10/2026  
**Nguồn chương này:** phần A, B, C của `Ly_Thuyet_T03_Mobile_Automation.md`, kết quả TV1 ở `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`, và ma trận S1 ở `Tool_Survey_Proposal.md`

Appium xác minh việc người dùng làm được và dữ liệu trên màn hình. Applitools Eyes, khi đã có baseline, kiểm tra thứ người dùng nhìn thấy. Hai lớp bổ sung cho nhau. Chương 1 là lựa chọn công cụ. Chương 2 là phần Appium và Detox đã chạy. Chương 3 là phần Visual AI: khung lý thuyết đã viết, cột kết quả Eyes còn trống vì TV2 chưa giao lần chạy.

---

## 1. Ma trận chọn công cụ

Ma trận dưới đây lấy từ đề xuất S1 (`Tool_Survey_Proposal.md`), đối chiếu ngày 28/09/2026. Detox không nằm trong ma trận S1. Brief T03 yêu cầu đối sánh DX với Appium; PoC đó thuộc chương 2, không phải ứng viên thay Eyes.

| Công cụ | Chi phí bản quyền | Độ khó học | Mức phù hợp với EShop | Khả năng AI | Cộng đồng |
|---------|-------------------|------------|------------------------|-------------|-----------|
| **Appium 2 + UiAutomator2** *(truyền thống)* | Miễn phí, Apache-2.0 | Trung bình-cao; cần Node.js, JDK, Android SDK và WebDriver | **Cao:** Android native, emulator, thiết bị thật và device farm | Không tích hợp AI; thao tác và assertion xác định | **Rất lớn:** khoảng 22 nghìn sao GitHub; driver và Inspector chính thức |
| **Applitools Eyes** *(AI-augmented)* | Thương mại; Starter 667 USD/tháng khi trả theo năm; trial 14 ngày | Trung bình; gắn được vào Appium, nhưng phải quản lý baseline và ignore region | **Rất cao:** thêm visual checkpoint vào cùng luồng Appium | Visual AI phát hiện lệch bố cục/nội dung và giảm nhiễu kết xuất | Tài liệu và SDK do hãng duy trì; tích hợp hơn 50 framework |
| **Maestro CLI + AI assertions** *(dự phòng)* | CLI/Studio cục bộ miễn phí, mã nguồn mở; Cloud cần gói hoặc trial | Thấp-trung bình; YAML dễ đọc, tự chờ | **Rất cao:** React Native, Expo, emulator và thiết bị thật | `assertWithAI`, `assertNoDefectsWithAI`, còn thử nghiệm | **Lớn:** khoảng 15,6 nghìn sao GitHub |

**Quyết định S1:** Appium 2 + UiAutomator2 làm lớp chức năng, Applitools Eyes làm lớp giao diện, Maestro chỉ khi trial Eyes không phủ S3–S6 và giảng viên chấp thuận.

Repo đã khóa và chạy Appium **2.19.0**, driver **uiautomator2@4.2.9**, client WebdriverIO **9.32.0**. Eyes và Maestro chưa có SDK, flow, baseline hay log trong repo (23/10/2026). Giá Starter cần đối chiếu lại trang giá trước khi nộp, vì mốc kiểm tra là 28/09/2026.

---

## 2. Appium và Detox

### 2.1 Kiến trúc đã dùng

Appium 2 tách server và driver. Server chỉ nói W3C WebDriver trên cổng 4723, đường gốc `/`. Driver Android cài riêng. Capability chuẩn W3C (`platformName`) viết trần; capability của Appium có tiền tố `appium:`.

Một lệnh đi qua năm tầng: test WebdriverIO → Appium Server → driver UiAutomator2 trên máy host → hai APK instrumentation trên thiết bị → cây accessibility của EShop. `findElement` chỉ thấy cây UI tại thời điểm lệnh tới, không thấy JS thread hay bridge của Expo còn bận. Vì vậy bộ test tự viết explicit wait. Espresso và Detox chờ đến khi app idle; Appium không tự biết điều đó.

Session trong `src/appium/config/session.js`:

| Capability | Giá trị |
|------------|---------|
| `platformName` | `Android` |
| `appium:automationName` | `UiAutomator2` |
| `appium:app` | APK debug, hoặc `ESHOP_APK_PATH` |
| `appium:appPackage` | `com.eshop.sut` |
| `appium:noReset` | `false` |

`noReset: false` reset app lúc mở và đóng phiên, nên dữ liệu giỏ của phiên trước không còn.

### 2.2 `testID` thành `resource-id`

`testID` trong `eshop-sut-main/frontend-mobile/App.js` chỉ gắn nhãn, không đổi hành vi. Trên APK Android chúng hiện thành `resource-id`. Page Object tìm bằng `android=new UiSelector().resourceId("...")` (`src/appium/config/locators.js`).

Trong Inspector, chiến lược Id tự thêm tiền tố package (`com.eshop.sut:id/...`) và không khớp các id này. Chiến lược dùng được là UIAutomator: `new UiSelector().resourceId("login-email")`. Phiên Inspector ngày 23/10/2026 chọn đúng `login-email`; bốn ảnh và file Recorder nằm ở `docs/evidence/`. Code Recorder dùng `$$(...)[0]`, không có wait và không có assertion, nên test chính thức giữ Page Object.

| Màn hình | `testID` |
|----------|----------|
| Điều hướng | `nav-home`, `nav-login`, `nav-profile`, `nav-cart` |
| Đăng nhập | `login-screen`, `login-email`, `login-password`, `login-submit`, `login-error` |
| Tìm kiếm | `search-input`, `search-submit`, `search-query`, `search-result-count` |
| Sản phẩm | `product-card-<id>`, `product-name-<id>`, `product-price-<id>`, `product-add-<id>` |
| Giỏ | `cart-empty`, `cart-item-<id>`, `cart-name-<id>`, `cart-subtotal-<id>`, `cart-remove-<id>`, `cart-total` |

Detox trên cùng app dùng `by.id()` với đúng các `testID` đó, không đi qua `UiSelector`.

### 2.3 Ba khối automation trên bộ test A2

| Khối | Trong repo |
|------|------------|
| Record & Playback | Inspector plugin `2025.3.1` khám phá cây UI và ghi bước. Bản ghi là nháp |
| Data-driven | `src/appium/data/cases.js`: đăng nhập L1→L2, tìm kiếm S1–S3, một ca giỏ hàng. Thêm dòng không cần sửa assertion |
| Checkpoint | Thông báo lỗi, tên người dùng, số kết quả, tên sản phẩm có hoặc vắng, thành tiền và tổng theo chữ số |

Dữ liệu đã chạy:

| ID | Đầu vào | Kỳ vọng đã assert |
|----|---------|-------------------|
| L1 | `test@eshop.com` / `SaiMatKhau-1` | Còn màn Login, `login-error` chứa "Đăng nhập thất bại" |
| L2 | cùng email / `Test1234!` | "Chào, Test User" |
| S1 | `iPhone` | 1 kết quả, `iPhone 15 Pro Max` |
| S2 | `Pro M` | 2 kết quả, gồm iPhone 15 Pro Max và MacBook Pro M3 |
| S3 | `Nokia 3310` | 0 kết quả: dòng đếm biến mất, năm sản phẩm không còn |
| Giỏ | iPhone 15 Pro Max, 30.000.000, thêm 2 lần | Chữ số `60000000` ở thành tiền và tổng; xoá dòng thì `cart-empty` hiện |

`npm test` là `node --test --test-concurrency=1`: ba test, mỗi test một phiên, vì UiAutomator2 chỉ một instrumentation trên một thiết bị. TAP kỳ vọng `# pass 8`, `# fail 0` (3 test và 5 subtest).

### 2.4 Quy trình vận hành

Thứ tự dưới đây là thứ tự đã chạy trên máy TV1. Biến môi trường theo hệ điều hành, đường dẫn JDK và cách cài SDK từ máy trống nằm ở `User_Guide.md` mục 2. Lệnh Linux gốc nằm ở `docs/A1_Setup.md`.

1. **Công cụ.** Node.js 20.19 trở lên cho Appium và Expo. JDK 17 hoặc 21 (`JAVA_HOME`). Android SDK với `ANDROID_HOME`, platform-tools, emulator, cmdline-tools, SDK Platform 36 và Build-Tools 36.0.0. AVD `eshop_api34`, Android 14, 1080×2400. Detox cần Node.js 22.13 trở lên và không dùng server Appium.
2. **Backend.** Từ `eshop-sut-main/backend`: `npm ci` rồi `npm start`. Mỗi lần khởi động tạo lại bảng và seed. Kiểm tra `http://localhost:3000/api/products`. Tài khoản demo là `test@eshop.com` / `Test1234!`.
3. **App.** Mở emulator đến khi `adb devices` báo `device`. `adb reverse tcp:8081 tcp:8081`. Từ `eshop-sut-main/frontend-mobile`: `npm ci` rồi `npx expo run:android`. Giữ Metro khi chạy APK debug. Package là `com.eshop.sut`. App trên emulator gọi `http://10.0.2.2:3000/api`.
4. **Appium.** Từ `src/appium`: `npm ci`, đặt `APPIUM_HOME` bằng thư mục `src/appium/.appium`, `npm run driver:install` (cài `uiautomator2@4.2.9`), `npm run server`. Tiếp tục khi `GET http://127.0.0.1:4723/status` có `ready: true` và `build.version` là `2.19.0`.
5. **Inspector, nếu cần xem cây UI.** Cài `appium-inspector-plugin@2025.3.1`, bật server với `--use-plugins=inspector`, mở `http://127.0.0.1:4723/inspector`. Quit Session trước `npm test`.
6. **Bộ test.** Từ `src/appium`, cùng `APPIUM_HOME`, chạy `npm test`. Một lượt bộ data-driven khoảng 100 giây khi bốn dịch vụ đã chạy sẵn.
7. **Ràng buộc dữ liệu.** Mỗi lần sai mật khẩu cộng 2 vào `login_attempts`; từ 3 lần thì khoá 3 phút. Mỗi lượt chỉ được có một L1 rồi một L2. Nếu lượt gãy sau L1, khởi động lại backend để seed lại. Không gõ số lượng trong giỏ: ô đó cộng thêm 1 khi parse. Sau mỗi lần thêm, test bấm OK của Alert "Thành công" rồi mới bấm tiếp.

Đo lại 10 lượt, sau khi bốn dịch vụ đã sẵn sàng:

```bash
cd src/appium
export APPIUM_HOME="$PWD/.appium"
bash scripts/measure-runs.sh 10 ../../docs/evidence
python3 -I scripts/summarize-runs.py ../../docs/evidence/A3_runs_<ngày>.csv
```

PoC Detox, từ `eshop-sut-main/frontend-mobile` với Node 22.13+: `npm ci`, `npx expo prebuild --platform android --no-install`, `npm run detox:build`, backend và Metro đang chạy, rồi `npm run detox:test -- --headless --gpu swiftshader_indirect`. Kiểm tra đĩa trống trước khi mở emulator. Lần trên máy TV1, emulator từ chối boot khi còn khoảng 1,7 GiB; sau khi còn khoảng 3,4 GiB thì boot được.

### 2.5 Số liệu A3

Hai chiến dịch cùng máy, cùng AVD, cùng Appium 2.19.0 và UiAutomator2 4.2.9. Chúng đo hai phiên bản test khác nhau, không so thời gian giữa hai bảng. Mười lượt không đủ để kết luận xác suất flaky dài hạn. Log và CSV ở `docs/evidence/`.

| | Chiến dịch 1 — sáng 22/10 | Chiến dịch 2 — tối 22/10 |
|--|----------------------------|---------------------------|
| Bản test | Commit `865deea`, một ca đăng nhập + tìm `iPhone` | Bộ data-driven A2: 3 phiên, 3 test, 8 kiểm tra TAP |
| Kết quả | 10/10 đạt, flake quan sát 0/10 | 10/10 đạt, `# pass 8` `# fail 0`, flake quan sát 0/10 |
| Thời gian một lượt | Trung bình 30,559 s; trung vị 30,496 s; khoảng 29,751–31,734 s | Trung bình 102,284 s; trung vị 102,238 s; khoảng 98,729–105,646 s |
| Setup | Bốn dịch vụ sẵn sàng trong 20,219 s | Dùng lại dịch vụ đã chạy, không đo lại |

Thời gian tăng lên khoảng 102 s vì mỗi lượt tạo ba phiên và `noReset: false` cài lại app (khoảng 25–30 s mỗi phiên), cộng thêm ba lần tìm và bước giỏ. Hai lỗi trước chiến dịch 2 — bàn phím che "Thêm vào giỏ", Alert nuốt cú bấm thứ hai — đã sửa trong test và không tính vào 10/10.

### 2.6 Đối sánh Detox

PoC ở `src/detox/tests/login-search.test.js` đăng nhập tài khoản mẫu, tìm `iPhone`, xác nhận còn `iPhone 15 Pro Max` và không còn sản phẩm Samsung. Không kiểm tra tổng giỏ.

Ngày 22/10/2026, build Gradle rút gọn `BUILD SUCCESSFUL` trong 4 phút 42 giây. Ba lượt sau khi bỏ `pressBack()` đều 1/1 test; Jest báo 25,508 s, 24,790 s và 38,594 s. Lượt nháp đầu đóng activity vì `pressBack()` đứng sau `replaceText()`.

| Khía cạnh | Appium A2 | Detox A4 |
|-----------|-----------|----------|
| Chuẩn bị | Server 2.19.0, driver 4.2.9, APK debug, Metro | Thêm instrumentation, APK test, Jest, Node 22.13+ |
| Locator | `UiSelector().resourceId` | `by.id` trên cùng `testID` |
| Chờ | `waitForDisplayed` / `waitUntil` | Tự chờ idle; vẫn `waitFor` khi đợi API |
| State sạch | `noReset: false`, rồi `terminateApp` + `activateApp` | `device.launchApp({ delete: true })` |
| Vướng đã gặp | Cold start không đưa app lên foreground | `pressBack()` đóng activity; build native tốn đĩa |

Detox làm đoạn thao tác React Native ngắn hơn và ít lệnh chờ tự viết hơn trong PoC này. Đổi lại phải prebuild Expo và tạo APK kiểm thử. Không kết luận công cụ nào nhanh hơn từ 25 s của Detox và trung vị 30,496 s của chiến dịch Appium 1: khác số lượt, khác phạm vi (Detox không có giỏ), khác điều kiện.

Appium vẫn là công cụ demo vì đứng ngoài APK, chạy được device farm về sau, và là phiên WebDriver để gắn Eyes. Detox là phần đối sánh DX, không phải công cụ demo thứ ba.

### 2.7 Giới hạn đã gặp khi vận hành

| Việc đã xảy ra | Cách bộ test xử lý |
|----------------|--------------------|
| Bàn phím ảo che phần tử; UiAutomator2 không trả về phần tử bị che | `hideKeyboardIfShown`, rồi `waitForDisplayed` |
| Alert "Thành công" nhận cú bấm thêm giỏ thứ hai | Bấm `android:id/button1` và chờ nút biến mất |
| APK debug không lên foreground sau cold start | `terminateApp` rồi `activateApp`, chờ `nav-login` tối đa 30 s |
| UI đăng nhập luôn hiện một câu, dù API trả sai mật khẩu hoặc tài khoản bị khoá | Assert đúng câu của app; mỗi lượt chỉ một lần sai |
| `pressBack()` trên Detox đóng màn Login | Bỏ lệnh đó trước ba lượt pass |
| Emulator không boot khi đĩa gần đầy | Cần khoảng vài GiB trống trước khi mở AVD |

Appium không kiểm tra màu, khoảng cách hay ảnh banner. Một màn hình sai màu nhưng còn đủ `testID` vẫn có thể pass. Phần đó thuộc chương 3 và chưa được đo.

---

## 3. Visual AI

### 3.1 Khung đã viết

Visual testing hỏi màn hình còn giống bản đã duyệt không. Một checkpoint đi từ trạng thái đã biết, chụp ảnh, so với baseline, rồi người triage xếp lỗi thật, nhiễu, hoặc thay đổi có chủ đích. Cập nhật baseline là chấp nhận UI mới, không phải bước tự động để cho lượt chạy xanh.

Ba cách so, từ cứng đến có ngữ cảnh: Exact từng pixel, ngưỡng pixel, và Visual AI theo vùng. Exact không dùng cho kiểm thử thường ngày vì anti-alias, font và thanh trạng thái cũng thành fail. Trên EShop, baseline — khi có — phải gắn một cấu hình: AVD `eshop_api34`, 1080×2400, cùng viewport với lần duyệt.

Hai hướng AI trong T03 không cùng một oracle:

| | Applitools Eyes | Maestro |
|--|-----------------|---------|
| Câu hỏi | Ảnh lần này có lệch baseline đã duyệt, theo match level đã chọn, không? | LLM có cho rằng ảnh thỏa câu mô tả, hoặc có defect nhìn thấy, không? |
| Oracle | Baseline có người duyệt | Phán đoán; không có baseline |
| Tính lặp | Cùng ảnh, cùng baseline, cùng match level | Xác suất. `assertWithAI` mặc định `optional: true` |
| Chỗ chạy | Eyes Cloud, cần API key | Lệnh AI đi qua Maestro Cloud |

Match level dùng cho cả checkpoint hoặc từng vùng: Strict (hồi quy trên một thiết bị, nội dung tĩnh), Layout (bỏ nội dung, giữ cấu trúc), Ignore colors, Content, Dynamic, Exact. Banner xoay ảnh là vùng Layout hoặc ignore. Giá, nút Đăng nhập và thông báo lỗi giữ Strict. Ignore cả cửa sổ sẽ che regression sau này.

Maestro có `assertVisible` (xác định), `assertScreenshot` (so file cục bộ, không phải AI), và hai lệnh LLM. Nó chỉ là phương án dự phòng sau khi giảng viên chấp thuận. Repo chưa có file flow.

### 3.2 Chính sách, chưa phải vùng đã vẽ

| Có thể cân nhắc ignore | Không ignore |
|------------------------|--------------|
| Banner ảnh động, nếu giữ khung | Giá, tổng tiền |
| Timestamp hoặc avatar ngẫu nhiên, nếu ngoài phạm vi | CTA chính |
| Vùng marketing đã thống nhất là nội dung xoay | Thông báo lỗi, trạng thái form |

Người được cập nhật baseline phải được chỉ định trước. Điều kiện là product hoặc design đã xác nhận thay đổi. Ghi lý do, ảnh hưởng tới ignore region, và ticket nếu có. Chưa có tên người duyệt và chưa có ảnh baseline trong repo.

### 3.3 Ma trận functional × visual

Hàng Eyes để trống có chủ đích. Không có `Eyes.open` / `Eyes.check` / `Eyes.close`, không có tên app trên dashboard, không có match level đã chọn, và không có hai bản UI (đổi banner, đổi màu) trong repo. Ô "dự đoán" suy từ cơ chế oracle, không phải kết quả dashboard.

| Tình huống | Appium | Eyes |
|------------|--------|------|
| Đăng nhập sai rồi đúng, tìm 1 / 2 / 0 sản phẩm, tổng giỏ 60.000.000 | **Đã đo.** Chiến dịch 2: 10/10, 8/8 kiểm tra TAP | Chưa chạy. Không có checkpoint trên các màn này |
| Banner đổi ảnh, layout và `testID` giữ nguyên | **Dự đoán:** pass nếu script không assert ảnh. Chưa có bản UI đó | **Dự đoán:** fail ở Strict nếu không có vùng Layout/ignore. Chưa đo |
| Đổi màu hoặc khoảng cách, `testID` còn đủ | **Dự đoán:** pass. Đây là lỗ hổng của lớp functional. Chưa có bản đổi màu | **Dự đoán:** fail ở Strict. Chưa đo |
| Bỏ hoặc đổi `testID` | **Suy từ locator:** `resourceId` không còn khớp thì script gãy. Chưa có lượt cố ý gỡ id | Checkpoint vẫn có thể thấy lệch layout. Chưa đo |
| Giá hoặc tổng hiển thị sai | **Đã đo dạng assertion:** so chữ số `60000000`. Một click trả về mà rơi vào Alert từng để tổng ở 30.000.000 | Chưa chạy. Eyes xanh không thay assertion này: ảnh có thể đẹp trong khi số sai, hoặc vùng giá bị ignore |
| Bàn phím che nút, Alert che cú bấm, cold start | **Đã gặp và đã xử lý trong test** trước chiến dịch 2 | Không phải oracle giao diện. Không có diff tương ứng |
| `pressBack()` sau khi nhập mật khẩu trên Detox | **Đã gặp** ở lượt nháp A4; activity đóng | Không liên quan Eyes |

Learning objective "banner so với colour token" vì vậy còn là cặp dự đoán ở hai cột. Cột Appium của các luồng dữ liệu thì đã có số.

### 3.4 Failure mode

**Đã quan sát trên Appium và Detox**

1. Kết quả thao tác không phải oracle. Cú bấm thứ hai vào "Thêm vào giỏ" trả về, nhưng rơi vào Alert, số lượng còn 1 và tổng còn 30.000.000. Assertion chữ số mới làm test đỏ.
2. Lượt đỏ có thể là lỗi test. Bàn phím, Alert, cold start và `pressBack()` đã tái lập, đã sửa trong mã test, và không tính vào 10/10. Ghi chúng thành defect của EShop là chọn nhầm oracle.
3. Câu trên màn hình yếu hơn phản hồi API. UI luôn hiện "Đăng nhập thất bại. Vui lòng kiểm tra lại." dù API trả sai mật khẩu hoặc tài khoản bị khoá. Test chỉ đọc `login-error` thì không tách hai nguyên nhân.

**Khung Eyes, chưa có batch để gắn**

1. Nội dung động làm Eyes đỏ; ignore region quá rộng thì che lỗi layout thật.
2. Appium pass trong khi màu hoặc khoảng cách đã sai.
3. Eyes pass trong khi giá sai, nếu vùng giá bị bỏ qua hoặc match level không đọc nội dung.

Ba mục này giữ trong chương để buổi seminar phân loại diff. Chúng chưa phải kết quả TV2. Cấu hình SDK, tên baseline, viewport đã duyệt, match level và quyết định triage sẽ thay các ô trống ở mục 3.3 khi có batch. Đến lúc đó mới được đưa đoạn Eyes vào video hoặc phần live.

### 3.5 Việc còn lại trước khi chương này đủ số liệu

| Việc | Chặn mục nào |
|------|----------------|
| Cài SDK Eyes bản JavaScript, khóa biến `APPLITOOLS_API_KEY`, ghi app name, test name, viewport emulator | 3.2 và 3.3 chưa có cấu hình để làm lại |
| Một checkpoint đã duyệt trên màn đã chọn (trang chủ hoặc danh sách sau tìm kiếm) | Chưa có baseline |
| Hai bản UI có kiểm soát: đổi ảnh banner, và đổi màu hoặc bố cục | Chưa đo được hàng banner và hàng màu |
| Worksheet failure mode từ diff thật | Mục 3.4 phần Eyes vẫn là chính sách |
| Maestro, chỉ sau khi giảng viên chấp thuận và trial Eyes không dùng được | Chưa có flow; không thay các ô Eyes bằng kết quả LLM |

---

## Nguồn

1. `Ly_Thuyet_T03_Mobile_Automation.md` — phần A, B, C1–C4.
2. `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`, và log trong `docs/evidence/`.
3. `Tool_Survey_Proposal.md` — ma trận S1, kiểm tra ngày 28/09/2026.
4. `User_Guide.md` — quy trình cài trên máy chưa có SDK.
5. Appium 2.19: [capability và tiền tố `appium:`](https://appium.io/docs/en/2.19/guides/caps/). [Kiến trúc UiAutomator2](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/architecture.md).
6. [Detox — design principles](https://wix.github.io/Detox/docs/next/articles/design-principles/). [Espresso](https://developer.android.com/training/testing/espresso).
7. Applitools — *Visual AI 101*; [Match levels and regions](https://applitools.com/docs/eyes/concepts/best-practices/match-levels). Giá Starter lấy từ đề xuất S1, cần kiểm tra lại trước khi nộp.

Chương này được biên tập với Cursor (Grok) ngày 23/10/2026 từ các tài liệu trên. Không có kết quả Eyes, baseline hay ảnh diff nào được tạo thêm. Ma trận S1 do đề xuất công cụ ghi là có dùng OpenAI Codex để trích tiêu chí; nhóm đã đối chiếu giấy phép, giá và tài liệu hãng vào ngày 28/09/2026.
