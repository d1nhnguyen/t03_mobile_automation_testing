# Báo cáo T03 — Mobile Automation Testing

**Môn:** CS423 / CSC15003 Kiểm thử phần mềm  
**SUT:** EShop React Native Expo (`eshop-sut-main/frontend-mobile`), package Android `com.eshop.sut`  
**Phạm vi đã đo:** Appium và Detox trên Ubuntu/Linux, AVD `eshop_api34` (Android 14, 1080×2400), 22–23/10/2026. Applitools Eyes trên Windows (Git Bash), AVD `Medium_Phone_API_37.0` (1080×2400), sáng 23/10/2026  
**Nguồn chương này:** phần A, B, C của `Ly_Thuyet_T03_Mobile_Automation.md`; kết quả TV1 ở `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`; kết quả TV2 ở `docs/B2_Report.md`, `docs/B4_Activity_Worksheet.md`, `docs/diff-cards/`, log `src/appium/logs/` và ảnh `docs/evidence/B1_B2_applitools-dashboard/`; ma trận S1 ở `Tool_Survey_Proposal.md`

Appium xác minh việc người dùng làm được và dữ liệu trên màn hình. Applitools Eyes kiểm tra thứ người dùng nhìn thấy so với baseline đã duyệt. Hai lớp bổ sung cho nhau, và lượt V2 ở chương 3 cho thấy điều đó bằng số đo: Appium đạt 8/8 trong khi Eyes bắt được màu và bố cục sai. Chương 1 là lựa chọn công cụ. Chương 2 là phần Appium và Detox đã chạy. Chương 3 là phần Visual AI: cấu hình Eyes, hai bản UI có kiểm soát, kết quả base / V1 / V2 và hoạt động phân loại diff cho lớp.

---

## Quy ước ký hiệu dùng trong tài liệu

| Ký hiệu | Nghĩa |
|---|---|
| **base / V1 / V2** | Ba bản giao diện EShop dùng cho visual testing, chọn bằng `EXPO_PUBLIC_UI_VARIANT`. base = bản gốc; **V1** = đổi ảnh sản phẩm 1, bố cục giữ nguyên (thay đổi hợp lệ); **V2** = đổi màu giá, màu nút, lệch vị trí nút và dòng tổng tiền (lỗi giao diện) |
| **L1, L2 / S1–S3** | Dòng dữ liệu trong `src/appium/data/cases.js`: đăng nhập (sai mật khẩu, đúng) / tìm kiếm (1, 2, 0 kết quả) |
| **TV1, TV2, TV3** | Ba thành viên nhóm, phụ trách lần lượt Appium–Detox, Applitools–hoạt động lớp, lý thuyết–báo cáo (xem `README.md`) |
| **A1…A4, B1…B6, C1…C6** | Mã công việc nội bộ trong kế hoạch nhóm; tên file và nội dung tương ứng liệt kê ở `README.md` |

## 1. Ma trận chọn công cụ

Ma trận dưới đây lấy từ đề xuất S1 (`Tool_Survey_Proposal.md`), đối chiếu ngày 28/09/2026. Detox không nằm trong ma trận S1. Brief T03 yêu cầu đối sánh DX với Appium; PoC đó thuộc chương 2, không phải ứng viên thay Eyes.

| Công cụ | Chi phí bản quyền | Độ khó học | Mức phù hợp với EShop | Khả năng AI | Cộng đồng |
|---------|-------------------|------------|------------------------|-------------|-----------|
| **Appium 2 + UiAutomator2** *(truyền thống)* | Miễn phí, Apache-2.0 | Trung bình-cao; cần Node.js, JDK, Android SDK và WebDriver | **Cao:** Android native, emulator, thiết bị thật và device farm | Không tích hợp AI; thao tác và assertion xác định | **Rất lớn:** khoảng 22 nghìn sao GitHub; driver và Inspector chính thức |
| **Applitools Eyes** *(AI-augmented)* | Thương mại; Starter 667 USD/tháng khi trả theo năm; trial 14 ngày | Trung bình; gắn được vào Appium, nhưng phải quản lý baseline và ignore region | **Rất cao:** thêm visual checkpoint vào cùng luồng Appium | Visual AI phát hiện lệch bố cục/nội dung và giảm nhiễu kết xuất | Tài liệu và SDK do hãng duy trì; tích hợp hơn 50 framework |
| **Maestro CLI + AI assertions** *(dự phòng)* | CLI/Studio cục bộ miễn phí, mã nguồn mở; Cloud cần gói hoặc trial | Thấp-trung bình; YAML dễ đọc, tự chờ | **Rất cao:** React Native, Expo, emulator và thiết bị thật | `assertWithAI`, `assertNoDefectsWithAI`, còn thử nghiệm | **Lớn:** khoảng 15,6 nghìn sao GitHub |

**Quyết định S1:** Appium 2 + UiAutomator2 làm lớp chức năng, Applitools Eyes làm lớp giao diện, Maestro chỉ khi trial Eyes không phủ S3–S6 và giảng viên chấp thuận.

Repo đã khóa và chạy Appium **2.19.0**, driver **uiautomator2@4.2.9**, client WebdriverIO **9.32.0**, SDK **`@applitools/eyes-webdriverio@5.61.14`**. Eyes chạy trên tài khoản trial (dashboard ghi "You are currently on a trial plan"). Maestro chưa có flow vì trial Eyes đã phủ được phần visual, nên phương án dự phòng không cần kích hoạt. Giá Starter cần đối chiếu lại trang giá trước khi nộp, vì mốc kiểm tra là 28/09/2026.

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

Appium không kiểm tra màu, khoảng cách hay ảnh banner. Một màn hình sai màu nhưng còn đủ `testID` vẫn pass. Lượt V2 ở mục 3.4 đo đúng trường hợp này.

---

## 3. Visual AI

### 3.1 Khung lý thuyết

Visual testing hỏi màn hình còn giống bản đã duyệt không. Một checkpoint đi từ trạng thái đã biết, chụp ảnh, so với baseline, rồi người triage xếp lỗi thật, nhiễu, hoặc thay đổi có chủ đích. Cập nhật baseline là chấp nhận UI mới, không phải bước tự động để cho lượt chạy xanh.

Ba cách so, từ cứng đến có ngữ cảnh: Exact từng pixel, ngưỡng pixel, và Visual AI theo vùng. Exact không dùng cho kiểm thử thường ngày vì anti-alias, font và thanh trạng thái cũng thành fail. Baseline gắn với một cấu hình. Lần B2 dùng AVD `Medium_Phone_API_37.0`, 1080×2400, và dashboard ghi viewport 411×866. Đổi AVD là bắt đầu baseline mới.

Hai hướng AI trong T03 không cùng một oracle:

| | Applitools Eyes | Maestro |
|--|-----------------|---------|
| Câu hỏi | Ảnh lần này có lệch baseline đã duyệt, theo match level đã chọn, không? | LLM có cho rằng ảnh thỏa câu mô tả, hoặc có defect nhìn thấy, không? |
| Oracle | Baseline có người duyệt | Phán đoán; không có baseline |
| Tính lặp | Cùng ảnh, cùng baseline, cùng match level | Xác suất. `assertWithAI` mặc định `optional: true` |
| Chỗ chạy | Eyes Cloud, cần API key | Lệnh AI đi qua Maestro Cloud |

Match level dùng cho cả checkpoint hoặc từng vùng: Strict (hồi quy trên một thiết bị, nội dung tĩnh), Layout (bỏ nội dung, giữ cấu trúc), Ignore colors, Content, Dynamic, Exact. Ảnh xoay vòng là vùng Layout hoặc ignore. Giá, nút và thông báo lỗi giữ Strict. Ignore cả cửa sổ sẽ che regression sau này.

### 3.2 Cấu hình Eyes đã chạy

Eyes gắn vào chính bộ test Appium ở chương 2, không có bộ test riêng. Mỗi file test mở một phiên Eyes, chụp checkpoint **sau** khi phần tử đã hiển thị và assertion chức năng đã qua, rồi đóng phiên.

| Hạng mục | Giá trị trong repo |
|----------|--------------------|
| SDK | `@applitools/eyes-webdriverio@5.61.14` (`src/appium/package.json`) |
| Cấu hình | `src/appium/config/eyes.js`: app `EShop`, host app `com.eshop.sut`, host OS Android, match level mặc định Strict, `setSaveNewTests(true)` |
| API key | Đọc từ `APPLITOOLS_API_KEY` (biến môi trường hoặc `src/appium/.env`, file đã nằm trong `.gitignore`) |
| Khóa baseline | Tên test cố định: `Login data-driven`, `Search data-driven`, `Cart add and total` |
| Batch | `EShop - base`, `EShop - v1`, `EShop - v2`, đặt bằng `VARIANT_LABEL`; chỉ để nhóm lượt chạy, không đổi baseline |
| Vùng | Ignore status bar (`0, 0, 1080, 80`). Layout region trên `product-image-1` có trong `checkpoints.js`, nhưng lượt B2 không gửi được vì selector `id=` (mục 3.4). Selector đã sửa; lượt xác nhận 23/10 cho thấy vùng được gửi nhưng vẫn không có hiệu lực (mục 3.4) |
| Đóng phiên | `eyes.close(false)`: diff không làm test đỏ trong terminal; mỗi test in `Eyes: <trạng thái> | steps | link` vào TAP, chi tiết xem trên dashboard |
| Khi không có khoá | `createEyes()` trả về `null`, mọi checkpoint bị bỏ qua, assertion chức năng vẫn chạy đủ (`EYES=off` để tắt chủ động). Lớp functional không phụ thuộc trial Applitools |
| Chạy | `run-variants.sh` ở gốc repo: mở AVD nếu chưa có emulator (mặc định `eshop_api34`; lần B2 dùng emulator `Medium_Phone_API_37.0` đang chạy sẵn), tắt animation, khởi động lại backend mỗi lượt, build APK lần đầu rồi đổi bản UI bằng cách khởi động lại Metro với `EXPO_PUBLIC_UI_VARIANT`, chạy base hai lần rồi V1, V2 |

Ba test tạo **10 checkpoint** mỗi lượt:

| Test | Checkpoint |
|------|-----------|
| `Login data-driven` | Login - initial · Login - L1 error · Home - L2 logged in |
| `Search data-driven` | Home - before search · Search S1 "iPhone" · Search S2 "Pro M" · Search S3 "Nokia 3310" |
| `Cart add and total` | Home - product list · Cart - 1 item with total · Cart - empty after remove |

### 3.3 Hai bản UI có kiểm soát

Learning objective của brief là so chi phí bảo trì khi **banner đổi ảnh** và khi **đổi colour token**. Màn Home của EShop mobile không có banner riêng, nên nhóm dùng ảnh sản phẩm id 1 làm vùng thay thế cho banner. Cả hai bản giữ nguyên `testID`, chữ và thứ tự màn hình, để mọi khác biệt chỉ nằm ở giao diện.

| | V1 — đổi ảnh (thay cho banner) | V2 — đổi màu và bố cục |
|--|--------------------------------|------------------------|
| Thay đổi | Ảnh sản phẩm id 1 thay bằng `assets/product-v1.png`, khung giữ nguyên kích thước | Giá tím và to hơn; hai nút trong thẻ sản phẩm bị đẩy xuống và sang phải; nút "Thêm vào giỏ" từ xanh sang đỏ; dòng tổng tiền lệch trái; nút thanh toán từ xanh lá sang cam |
| Bản chất | Thay đổi hợp lệ về nội dung | Lỗi giao diện thật |
| Mã | `App.js` (`renderProduct`) + ảnh mới | `App.js` (`v2Styles`, `renderProduct`, `renderCart`) |
| Bật bằng | `EXPO_PUBLIC_UI_VARIANT=v1` | `EXPO_PUBLIC_UI_VARIANT=v2` |

### 3.4 Kết quả base / V1 / V2

Lượt đo hợp lệ nằm trong `src/appium/logs/20261023-065743/`. Lượt trước đó (`20261023-065159`) hỏng ngay ở `newSession` với `ECONNREFUSED` vì server Appium chưa chạy, nên không tính. Thời gian lấy từ `duration_ms` trong log của `node --test`.

| Lượt | Functional (Appium) | Visual (Eyes, theo test) | Checkpoint lệch | Thời gian chạy |
|------|---------------------|--------------------------|:---------------:|---------------:|
| Base lần 1 (tạo baseline) | `# pass 8` `# fail 0` | New; theo quy trình B2, Accept và Save trên dashboard | — | 198,578 s |
| Base lần 2 (đối chứng) | `# pass 8` `# fail 0` | 3/3 Passed | 0/10 | 191,297 s |
| V1 | `# pass 8` `# fail 0` | 3/3 Unresolved | 5/10 | 209,672 s |
| V2 | `# pass 8` `# fail 0` | 3/3 Unresolved | 6/10 | 192,640 s |

Bản đầu của `docs/B2_Report.md` ghi 19,1297 s, 20,9672 s và 19,2640 s, nhỏ hơn log đúng 10 lần. File đó đã sửa theo `duration_ms`. Bảng trên dùng số của log.

**Đọc "3/3 Unresolved" cho đúng.** Dashboard gắn trạng thái cho cả **test**, không cho từng màn. Test `Login data-driven` ở V1 bị Unresolved, nhưng ảnh `login_v1.png` cho thấy hai bước Login vẫn khớp (dấu `=`). Bước lệch là bước thứ ba, Home sau đăng nhập, nơi có ảnh sản phẩm 1. Đếm theo checkpoint:

- **V1, 5/10:** ba bước Home (mỗi test một bước) cộng Search S1 và S2, vì hai kết quả này có iPhone 15 Pro Max. Search S3 không có sản phẩm 1 nên khớp. Hai bước Cart khớp.
- **V2, 6/10:** năm bước trên cộng Cart - 1 item with total, vì tổng tiền lệch trái và nút thanh toán đổi màu (`v2_cart_with_item_step.png`). Cart - empty khớp ở cả ba lượt.

Số đếm này khớp với phạm vi thay đổi ở mục 3.3: Eyes không báo checkpoint nào nằm ngoài vùng đã sửa.

**Layout region không được gửi trong lượt V1.** `checkpoints.js` chỉ gọi `layoutRegions` khi `productImage(1)` tồn tại. Hàm đó tìm bằng `id=product-image-1`, trong khi mọi `testID` khác dùng `UiSelector().resourceId(...)`. Trên UiAutomator2, chiến lược `id` thêm tiền tố package (`com.eshop.sut:id/product-image-1`) và không khớp `resource-id` mà React Native ghi ra, nên `isExisting()` sai và nhánh gắn vùng không chạy. Vì vậy V1 vẫn so Strict cả ảnh sản phẩm. Hai ảnh `v1_home_with_layout_region.png` và `v1_home_without_layout_region.png` là cùng một bước dashboard, chụp trong step editor, không phải hai lượt chạy. Selector đã đổi sang `byTestId` và thêm cảnh báo khi không thấy phần tử. Lượt xác nhận ngày 23/10 trên máy TV1 với selector `byTestId` (xem `docs/evidence/applitools-region-check-2026-10-23/`): vùng đã được gắn, nhưng V1 vẫn Unresolved 3/4 ở các bước có ảnh, kể cả khi đổi sang `ignoreRegions` hoặc tự tính toạ độ (dp, trừ status bar, px); base đối chứng Passed và vùng phủ toàn ảnh Passed. Kết luận: vùng khai báo trong code được gửi lên nhưng không trùng vị trí ảnh trên ảnh chụp của Eyes (nguyên nhân chưa xác định, ghi là failure mode); vùng có hiệu lực trong B2 là vùng đặt trên dashboard.

### 3.5 Ma trận functional × visual

| Tình huống | Appium | Eyes |
|------------|--------|------|
| Đăng nhập sai rồi đúng, tìm 1 / 2 / 0 sản phẩm, tổng giỏ 60.000.000 | **Đã đo.** A3 chiến dịch 2: 10/10; B2: 8/8 ở cả bốn lượt | **Đã đo.** Base lần 2: 10/10 checkpoint khớp |
| Đổi ảnh sản phẩm, khung giữ nguyên (V1) | **Đã đo:** pass 8/8. Đúng, vì đây không phải lỗi | **Đã đo:** 5/10 lệch. Báo thừa (false positive) cho tới khi người duyệt Accept hoặc có vùng Layout hoạt động |
| Đổi màu, vị trí nút, căn lề tổng tiền (V2) | **Đã đo:** pass 8/8. Đây là lỗ hổng của lớp functional | **Đã đo:** 6/10 lệch, đúng các vùng đã sửa (true regression) |
| Bỏ hoặc đổi `testID` | **Suy từ locator:** `resourceId` không khớp thì script gãy. Chưa có lượt cố ý gỡ id | Chưa đo |
| Giá hiển thị sai, bố cục giữ nguyên | **Đã đo dạng assertion:** so chữ số `60000000`. Một click rơi vào Alert từng để tổng ở 30.000.000 | Chưa chạy trên app. Thẻ diff số 10 (mục 3.8) dựng đúng ca này: vùng lệch chỉ là vài chữ số, rất dễ bị Accept nhầm, và sẽ qua hẳn nếu vùng giá đặt ở Layout |
| Bàn phím che nút, Alert che cú bấm, cold start | **Đã gặp và đã xử lý trong test** trước chiến dịch 2 | Không phải oracle giao diện |
| `pressBack()` sau khi nhập mật khẩu trên Detox | **Đã gặp** ở lượt nháp A4; activity đóng | Không liên quan Eyes |

### 3.6 Chi phí bảo trì: đổi ảnh so với đổi màu

| | Đổi ảnh (V1) | Đổi màu và bố cục (V2) |
|--|--------------|------------------------|
| Appium cần sửa gì | Không gì; test vẫn đúng | Không gì; nhưng test cũng không thấy lỗi |
| Eyes cần làm gì | Mỗi lần ảnh đổi: duyệt 5 bước rồi Accept, hoặc đặt chính sách Layout cho vùng ảnh một lần | Duyệt 6 bước, Reject, mở bug. Nếu đổi màu là chủ ý thì Accept 6 bước và baseline mới thành chuẩn |
| Ai quyết định | Người duyệt baseline, theo ngữ cảnh release | Như bên trái |

Đổi ảnh rẻ với Appium nhưng tốn công duyệt với Eyes. Đổi màu cũng rẻ với Appium, nhưng chỉ vì Appium không nhìn thấy nó. Chi phí thật của Eyes là thời gian triage của con người, nên hoạt động trên lớp (mục 3.8) tập trung vào việc phân loại diff.

### 3.7 Failure mode

**Đã quan sát với Eyes**

1. **Terminal xanh, dashboard vàng.** `eyes.close(false)` không ném lỗi khi có diff (từ 23/10 TAP in thêm dòng `# Eyes: Unresolved | ... | link`, nên không còn im lặng, nhưng exit code vẫn 0). Lượt V2 có `# fail 0` và exit 0, trong khi dashboard báo 6/10 checkpoint lệch. Ai chỉ đọc CI hoặc terminal sẽ cho rằng V2 không có vấn đề.
2. **Trạng thái theo test che vị trí lệch.** "Login data-driven: Unresolved" ở V1 khiến người đọc nghĩ màn Login đổi, trong khi lệch nằm ở bước Home cuối test. Phải mở từng bước mới biết.
3. **Vùng viết trong code chưa chắc có hiệu lực.** Lần đầu, selector `id=` không tìm thấy phần tử nên vùng không được gửi. Sau khi sửa selector, vùng được gửi nhưng V1 vẫn lệch ở ảnh sản phẩm; chỉ vùng phủ toàn ảnh mới Passed (chi tiết `docs/evidence/applitools-region-check-2026-10-23/`). Phải kiểm tra vùng trên dashboard của lượt chạy, không chỉ đọc khai báo hay log.

**Đã quan sát với Appium và Detox**

1. Kết quả thao tác không phải oracle. Cú bấm thứ hai vào "Thêm vào giỏ" trả về, nhưng rơi vào Alert, số lượng còn 1 và tổng còn 30.000.000. Assertion chữ số mới làm test đỏ.
2. Lượt đỏ có thể là lỗi test. Bàn phím, Alert, cold start và `pressBack()` đã tái lập, đã sửa trong mã test, và không tính vào 10/10. Ghi chúng thành defect của EShop là chọn nhầm oracle.
3. Câu trên màn hình yếu hơn phản hồi API. UI luôn hiện "Đăng nhập thất bại. Vui lòng kiểm tra lại." dù API trả sai mật khẩu hoặc tài khoản bị khoá. Test chỉ đọc `login-error` thì không tách hai nguyên nhân.

**Chưa chạy trên app, đã dựng thành thẻ diff:** giá sai nhưng bố cục giữ nguyên (thẻ 10). Một vùng lệch rất nhỏ dễ bị duyệt qua, và sẽ không bị báo nếu vùng giá đặt ở Layout. Đây là lý do giữ assertion chữ số cho giá kể cả khi đã có Eyes.

### 3.8 Hoạt động lớp: Visual Diff Triage Workshop

Theo brief T03, nhóm khán giả phân loại một bộ diff trong 25 phút. TV2 đã soạn:

- `docs/B4_Activity_Worksheet.md`: luật chơi, phiếu phân loại 10 thẻ, mẫu chính sách ignore region, minute paper, đáp án, rubric chấm chéo 20 điểm và mẫu biên bản dry-run.
- `docs/diff-cards/DiffCards_Questions.md` và `DiffCards_AnswerKey.md` (kèm bản PDF): mỗi thẻ có ảnh baseline và bản mới, ngữ cảnh release, ảnh diff và đáp án.

Bốn nhãn: Accept, Reject, Nhiễu, Chưa đủ thông tin. Phân bố đáp án: 4 lỗi thật (thẻ 1, 2, 6, 10), 3 thay đổi có chủ đích (3, 4, 7), 1 nhiễu dây chuyền (8), 2 mơ hồ (5, 9). Thay đổi trong thẻ 1 và 2 trùng với V2; thẻ 3 cùng loại với V1.

Chính sách mẫu cho vùng thay banner là **Layout** trên `product-image-1`, không Ignore, và không phủ giá, tên hay nút. Ignore chỉ dùng cho status bar.

Đã đối chiếu với deck mẫu `T03_Mobile_Automation_Testing_InClass.pptx` (8 slide). Khớp deck: 10 thẻ, 25 phút, đúng năm mốc của slide 6, nhóm 3–4 người. Ba nhãn của deck (*true bug*, *intentional update*, *false positive*) map sang Reject, Accept và Nhiễu; phiếu giữ thêm **Chưa đủ thông tin** vì thẻ 5 và 9 không quyết được. Minute paper lấy bốn câu debrief của slide 7, cộng thang 1–5 của Seminar Guide, và nộp sau 25 phút chứ không chiếm suất cuối.

Còn lại, và không làm được từ repo:

- Chỉ có một thẻ nhiễu, và đó là nhiễu dây chuyền. Chưa có thẻ nhiễu thuần do render (giờ status bar, ảnh chưa tải xong, khử răng cưa).
- Ảnh diff thẻ 7 chụp form đã nhập và có lỗi đăng nhập, trong khi ảnh câu hỏi là form trống. Phải chụp lại trên dashboard trước khi in.
- Chưa có dry-run với người ngoài nhóm, nên chưa có số đo chứng minh 10 thẻ xong trong 10 phút của slide 6.

### 3.9 Việc còn lại

Đã xử lý trong repo, chưa cần chạy lại:

| Việc | Kết quả |
|------|---------|
| Vì sao layout region không ăn | Selector `id=` không khớp `testID`. Đã đổi `productImage()` sang `byTestId` và thêm cảnh báo khi không thấy phần tử (`home.page.js`, `checkpoints.js`). Lượt xác nhận 23/10: vùng được gửi nhưng V1 vẫn lệch 3/4; chỉ vùng phủ toàn ảnh Passed. Ghi nhận là failure mode; vùng có hiệu lực đặt trên dashboard |
| Số liệu và chỗ trống trong `docs/B2_Report.md` | Thời gian lấy từ log (191,297 s / 209,672 s / 192,640 s). Bỏ dòng `checkout-flow.test.js` vì file không tồn tại. Mục 9 đã điền từ bốn lượt đã chạy. Mục 10 ghi có/không theo file thật |
| Nguồn lỗi `adb_shell` và `Method is not implemented` | Cả hai do SDK Eyes, không do test của nhóm. `mobile:shell` hỏi `dumpsys window ... mCurrentRotation`; Appium chặn vì chưa bật insecure feature. Lệnh `execute/sync` còn lại là đoạn JS dò DOM trình duyệt (`applitools-marker`), UiAutomator2 trả 405 vì app là native. Checkpoint vẫn được chụp, base lần 2 vẫn Passed. `npm run server` đã thêm `--allow-insecure=uiautomator2:adb_shell` để lần sau hết lỗi xoay màn hình. Lỗi 405 trên app native là nhiễu, không sửa bằng cờ đó |
| Đối chiếu deck và bằng chứng B2 | Worksheet căn theo slide 6 và slide 7. Phụ lục B2 không còn ô trống |

Chưa làm được ở máy này:

| Việc | Vì sao còn lại |
|------|----------------|
| Chạy lại V1 sau khi sửa selector, rồi mới ghi Passed hoặc vẫn lệch | Cần AVD, `APPLITOOLS_API_KEY` và dashboard để Accept. Máy biên tập báo cáo không có lần chạy đó |
| Chốt AVD buổi demo | Baseline Eyes đang gắn `Medium_Phone_API_37.0` (viewport dashboard 411×866). Appium/Detox đo trên `eshop_api34`. `run-variants.sh` mặc định mở `eshop_api34`, tức một baseline mới. Demo Eyes phải dùng đúng AVD đã Accept, hoặc Accept lại trên AVD mới. Đây là quyết định của nhóm trước buổi chạy |
| Chụp lại ảnh diff thẻ 7 và thêm thẻ nhiễu thuần | Cần dashboard hoặc một lượt chụp mới |
| Dry-run 25 phút với người ngoài nhóm | Cần một người không soạn thẻ và đồng hồ thật. Mẫu biên bản ở `docs/B4_Activity_Worksheet.md` mục 6 vẫn trống |
| Video demo và `Demo_Video_Links.md` | Chưa có file hay link YouTube trong repo |

---

## Nguồn

1. `Ly_Thuyet_T03_Mobile_Automation.md` — phần I, II, III.1–III.4.
2. `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`, và log trong `docs/evidence/`.
3. `Tool_Survey_Proposal.md` — ma trận S1, kiểm tra ngày 28/09/2026.
4. `User_Guide.md` — quy trình cài trên máy chưa có SDK.
5. `docs/B2_Report.md`, `docs/B4_Activity_Worksheet.md`, `docs/diff-cards/`; log Eyes trong `src/appium/logs/20261023-065159/` và `20261023-065743/`; ảnh dashboard trong `docs/evidence/B1_B2_applitools-dashboard/`; mã `src/appium/config/eyes.js`, `checkpoints.js`, `run-variants.sh`.
6. Appium 2.19: [capability và tiền tố `appium:`](https://appium.io/docs/en/2.19/guides/caps/). [Kiến trúc UiAutomator2](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/architecture.md).
7. [Detox — design principles](https://wix.github.io/Detox/docs/next/articles/design-principles/). [Espresso](https://developer.android.com/training/testing/espresso).
8. Applitools — *Visual AI 101*; [Match levels and regions](https://applitools.com/docs/eyes/concepts/best-practices/match-levels). Giá Starter lấy từ đề xuất S1, cần kiểm tra lại trước khi nộp.

Chương 1–2 được biên tập với Cursor (Grok) ngày 23/10/2026 từ các tài liệu trên. Chương 3 được hoàn thiện với Cursor (Claude) cùng ngày từ tài liệu, log và ảnh dashboard của TV2. Số liệu Eyes lấy từ log và ảnh dashboard, không lấy từ AI. Thời gian chạy được đọc lại từ `duration_ms`, và số checkpoint lệch được đối chiếu với từng bước trên ảnh dashboard. Không có kết quả Eyes, baseline hay ảnh diff nào được tạo thêm. Ma trận S1 do đề xuất công cụ ghi là có dùng OpenAI Codex để trích tiêu chí; nhóm đã đối chiếu giấy phép, giá và tài liệu hãng vào ngày 28/09/2026.
