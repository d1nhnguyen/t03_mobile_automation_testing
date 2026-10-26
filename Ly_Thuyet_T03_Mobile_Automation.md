# Lý thuyết T03 — Mobile Automation Testing

Tài liệu lý thuyết cho seminar **T03 Mobile Automation Testing** (CS423 / CSC15003), dựa trên brief T03, Seminar Guide, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal và Seminar Scenario Draft. Ba mức demo ở III.1.e, III.2.e và cách chia video với phần live ở IV.3 bám [Demo_Scenario.md](Demo_Scenario.md).

**Thông điệp xuyên suốt:** Appium xác minh *hành vi* của người dùng; Applitools kiểm tra *thứ người dùng nhìn thấy*. Hai lớp kiểm thử bổ sung cho nhau, không thay thế nhau.

**Công cụ trong phạm vi nhóm**

| Vai trò | Công cụ |
|---------|---------|
| Truyền thống (chính) | Appium 2.19.0 + UiAutomator2 4.2.9 (client WebdriverIO 9.32.0) |
| AI-augmented (chính) | Applitools Eyes |
| Dự phòng | Maestro CLI + AI assertions |
| So sánh truyền thống (learning objective) | Detox (khi nào chọn thay Appium) |

**SUT:** EShop React Native Expo (`frontend-mobile`), Android development APK trên emulator.

---

## Mục lục

| Phần | Nội dung |
|------|----------|
| **I** | Bốn mảng lý thuyết cốt lõi: 1. Kiểm thử mobile và tự động hoá · 2. Kiểm thử chức năng · 3. Visual testing · 4. Độ tin cậy và bảo trì |
| **II** | Ba khối nền tảng automation: Record & Playback · Data-driven · Checkpoints |
| **III** | Lý thuyết theo từng công cụ: 1. Appium 2 · 2. Applitools Eyes · 3. Maestro · 4. Bản đồ công cụ ↔ lớp kiểm thử |
| **IV** | Tóm tắt, đọc thêm, map sang buổi seminar |

Mỗi công cụ ở Phần III theo cùng khung:

a. Lý thuyết liên quan  
b. Thuật ngữ  
c. Chức năng chính  
d. Nguyên lý hoạt động  
e. Ba kịch bản demo (cài đặt · cơ bản · phức tạp)  
f. Điểm yếu / giới hạn  
(Appium có thêm g. Quy trình vận hành đã kiểm chứng)

---

# I. Bốn mảng lý thuyết cốt lõi

---

## 1. Kiểm thử mobile và kiểm thử tự động trên mobile (Mobile Testing & Test Automation)

### a. Kiểm thử mobile là gì và để làm gì

**Kiểm thử ứng dụng mobile** (mobile application testing) là hoạt động kiểm tra một ứng dụng chạy trên thiết bị di động (điện thoại, máy tính bảng) để xác nhận nó **làm đúng chức năng**, **hiển thị đúng** và **dùng được** trong điều kiện thật của người dùng: nhiều loại máy, nhiều phiên bản hệ điều hành, mạng không ổn định, bị gián đoạn bởi cuộc gọi hay thông báo. Mục đích không khác kiểm thử phần mềm nói chung — tìm lỗi trước người dùng và cung cấp bằng chứng để quyết định phát hành — nhưng **đối tượng và môi trường** khác, nên cách làm khác.

**Đối tượng kiểm thử** là một trong ba loại ứng dụng:

| Loại app | Cách xây | Kiểm thử nhìn thấy gì |
|----------|----------|------------------------|
| Native | Kotlin/Java (Android), Swift (iOS) | Cây giao diện native, truy cập đầy đủ cảm biến và API hệ điều hành |
| Hybrid / web app | Web chạy trong WebView hoặc trình duyệt | Phần lớn là DOM web; cần chuyển ngữ cảnh native ↔ web |
| Cross-platform (React Native, Flutter) | Một mã nguồn, render ra thành phần native | Cây native do framework tạo ra; nhãn (`testID`) phải được framework đưa xuống native |

EShop là React Native Expo: giao diện là thành phần native, logic viết bằng JavaScript. Công cụ đứng ngoài app chỉ thấy cây native, không thấy trạng thái JavaScript.

**Kiểm thử mobile gồm những gì.** Một ứng dụng được kiểm theo nhiều khía cạnh; seminar này tập trung vào hai khía cạnh đầu.

| Khía cạnh | Câu hỏi | Trong seminar T03 |
|-----------|---------|-------------------|
| Chức năng (functional) | Luồng nghiệp vụ cho đúng kết quả không: đăng nhập, tìm kiếm, giỏ hàng, tổng tiền | Appium + assertion (I.2) |
| Giao diện / hiển thị (UI, visual) | Màn hình trông đúng thiết kế không: bố cục, màu, kích thước, không vỡ | Applitools Eyes (I.3) |
| Tương thích (compatibility) | Chạy đúng trên các máy, phiên bản OS, độ phân giải khác nhau không | Ghi nhận giới hạn: chỉ kiểm chứng trên một AVD |
| Hiệu năng, pin, mạng | Khởi động, phản hồi, tiêu thụ tài nguyên, hành vi khi mạng chậm hoặc mất | Ngoài phạm vi; có nhắc khi bàn về flaky |
| Gián đoạn (interrupt) | Cuộc gọi, thông báo, xoay màn hình, chuyển nền | Ngoài phạm vi |
| Cài đặt, cập nhật, quyền | Cài mới, nâng cấp, cấp/thu quyền | Một phần: `noReset` cài lại app mỗi phiên |
| Khả dụng, truy cập (usability, accessibility) | Dễ dùng, đọc được bằng trình đọc màn hình | Gián tiếp: automation dựa trên cây accessibility nên app có nhãn tốt thì test cũng tốt |
| Bảo mật | Dữ liệu, xác thực, lưu trữ | Ngoài phạm vi; có ghi nhận lỗi SUT phát hiện được |

**Cấp độ và vị trí của kiểm thử giao diện tự động.** Theo mô hình kim tự tháp, phần lớn ca kiểm thử nên nằm ở unit và component (nhanh, rẻ, ổn định); kiểm thử end-to-end qua giao diện ít hơn vì chậm và dễ nhiễu, nhưng là lớp duy nhất xác nhận **người dùng thực sự làm được việc** trên bản build thật. Appium, Espresso, Detox và visual testing đều nằm ở lớp này. Với React Native, Jest phủ unit/component; lớp đó không thay một phiên chạy trên APK.

**Thủ công hay tự động.** Kiểm thử khám phá và đánh giá khả dụng làm thủ công tốt hơn. Tự động hoá hợp với kịch bản **lặp lại nhiều lần** (hồi quy sau mỗi thay đổi), **nhiều bộ dữ liệu** (data-driven), **nhiều thiết bị** (device farm) và so sánh giao diện giữa các bản. Chi phí của tự động hoá là viết và bảo trì script khi UI đổi; vì vậy việc chọn locator (I.1.d) và chính sách baseline (I.3.d) là phần cốt lõi, không phải chi tiết.

**Quy trình một vòng kiểm thử tự động trên mobile** (cũng là thứ tự nhóm làm với EShop):

1. Chuẩn bị môi trường: SDK, emulator hoặc thiết bị, bản build có thể cài (APK), dịch vụ backend và dữ liệu mẫu.
2. Làm app kiểm thử được: đặt nhãn ổn định (`testID`), dữ liệu seed, cách reset trạng thái.
3. Thiết kế ca kiểm thử: kịch bản người dùng, bảng dữ liệu, kết quả kỳ vọng (oracle) cho chức năng và cho giao diện (baseline).
4. Viết script: Page Object, chờ theo điều kiện, assertion; gắn checkpoint visual.
5. Chạy lặp lại để đo độ ổn định; đọc log; phân biệt lỗi test, lỗi môi trường và lỗi app.
6. Triage kết quả visual: lỗi thật, thay đổi có chủ đích, nhiễu; cập nhật baseline có người duyệt.
7. Bảo trì khi app đổi: sửa locator, dữ liệu, baseline.

**Thuật ngữ dùng xuyên suốt:** SUT (hệ thống được kiểm thử), emulator/AVD, APK, cây accessibility, locator, session, capability, oracle, assertion/checkpoint, baseline, flaky, false positive / true regression, device farm. Định nghĩa chi tiết ở từng mục C.

### b. Kiểm thử tự động trên mobile và thách thức riêng của môi trường

Kiểm thử tự động trên mobile dùng một chương trình điều khiển ứng dụng trên thiết bị hoặc emulator, lặp lại thao tác của người dùng và kiểm tra kết quả. Appium nằm ở lớp end-to-end, black-box: nó chỉ thấy cây giao diện mà hệ điều hành công bố, không gọi hàm bên trong JavaScript của React Native.

Môi trường là một phần của bài test. Script đúng locator vẫn fail khi máy chưa cấp quyền, bàn phím che nút, mạng chậm, hoặc dữ liệu phiên trước còn trong app. Độ ổn định vì vậy thuộc thiết kế test (I.4), không phải việc dọn sau khi script đã xanh một lần. Những yếu tố sau là đặc thù của mobile và đều đã xuất hiện trong lần chạy của nhóm:

| Yếu tố | Hệ quả với kiểm thử |
|--------|---------------------|
| Phân mảnh OS / thiết bị | Cùng kịch bản có thể pass trên AVD này, fail trên thiết bị khác. Baseline và timeout gắn với một cấu hình (EShop: AVD `eshop_api34`) |
| Cảm biến, quyền, trạng thái máy | GPS, camera, pin, thông báo xen ngang, bàn phím ảo làm cây UI đổi giữa hai lệnh |
| Mạng và độ trễ | Spinner còn quay, danh sách chưa có dữ liệu, race giữa lệnh tiếp theo và phản hồi API |
| Vùng chạm nhỏ, gesture | Tap, swipe, long-press phụ thuộc toạ độ và thời điểm; khó tái lập hơn click trên web |
| App vẽ UI bất đồng bộ | React Native commit layout sau khi JS và bridge xong. Công cụ đứng ngoài không biết lúc đó |

EShop là client React Native Expo (Android + iOS) nên cùng một màn hình có thể đặt câu hỏi cho Appium, Espresso và Detox (I.1.e). Seminar chạy lớp functional trên APK Android.

### c. Kiến trúc Appium 2: W3C WebDriver và UiAutomator2

Appium 2 tách **server** và **driver**. Cài server chỉ có tiến trình HTTP nói giao thức W3C WebDriver. Driver không đi kèm: Android phải cài riêng (`appium driver install uiautomator2`). Appium 2 không chọn driver mặc định. Session bắt buộc khai `appium:automationName`. Giao thức cũ JSON Wire Protocol đã bỏ; đường gốc mặc định là `/`, không còn `/wd/hub`.

Capability chuẩn của W3C, như `platformName`, viết trần. Capability do Appium thêm phải có tiền tố nhà cung cấp `appium:` — ví dụ `appium:automationName`, `appium:app`, `appium:noReset`. Client tạo phiên bằng `POST /session`. Capability không sửa được giữa phiên.

Một lệnh trên Android đi qua năm tầng:

```
[Test client — WebdriverIO]
        |  HTTP W3C, cổng 4723, path /
        v
[Appium Server]  chọn driver theo appium:automationName
        v
[UiAutomator2 driver trên máy host]
        |  adb: cài server APK + instrumentation APK, am instrument, adb forward
        v
[UiAutomator2 server trên thiết bị]
        |  HTTP trong tiến trình instrumentation; gọi UiAutomator
        v
[Cây accessibility của Android] --> [EShop APK]
```

Server trên thiết bị là hai gói `io.appium.uiautomator2.server` và `io.appium.uiautomator2.server.test`. Driver cài và khởi động chúng bằng instrumentation; `adb forward` nối cổng máy host tới HTTP server đó. `findElement` và `click` hỏi cây accessibility tại đúng thời điểm lệnh tới. Chúng không thấy JS thread hay bridge của Expo còn bận — đó là lý do phải explicit wait (I.4.a) và là điểm khác Detox (I.1.e).

Trên APK EShop của nhóm, `testID` của React Native xuất hiện thành `resource-id`. Locator vì vậy dùng `UiSelector().resourceId` (`src/appium/config/locators.js`). Chiến lược Id của Inspector tự thêm tiền tố package (`com.eshop.sut:id/...`) nên không khớp các id này. Session trong `src/appium/config/session.js` khai đúng hợp đồng Appium 2: `platformName` trần, các khoá còn lại có tiền tố `appium:`, `automationName` là `UiAutomator2`, `app` trỏ APK debug, `appPackage` là `com.eshop.sut`, `noReset` là `false`, đường gốc là `/`.

Phiên bản khóa trong `src/appium/package.json` và đã tạo session trên máy TV1 (Ubuntu, AVD `eshop_api34`, 22–23/10/2026): Appium **2.19.0**, UiAutomator2 **4.2.9**, WebdriverIO **9.32.0**. `npm run driver:install` cài `uiautomator2@4.2.9`. Inspector dùng plugin `appium-inspector-plugin@2025.3.1`; bản plugin mới hơn yêu cầu Appium 3.

| | |
|--|--|
| **Điểm mạnh** | Một client WebDriver cho nhiều nền; chạy emulator, máy thật và device farm; chỉ cần APK |
| **Điểm yếu** | Đường đi dài, mỗi lệnh là một ảnh của cây UI. Session, capability, locator và chờ có điều kiện là phần bắt buộc của script |

### d. Locator: yếu tố quyết định độ bền script

| Cách định vị | Đánh giá |
|--------------|----------|
| `testID` / accessibility label | Ổn định, khuyến nghị cho automation |
| XPath dài theo hierarchy | Dễ hỏng khi UI đổi cấu trúc |
| Text hiển thị | Phụ thuộc ngôn ngữ / copy; dễ false fail |

**Quy tắc thực hành:** ưu tiên `testID` (trên APK EShop là `resource-id`) và accessibility; coi XPath dài là tín hiệu nợ kỹ thuật. Locator yếu là một nguồn flaky riêng, vì cây UI đổi nhẹ làm cùng một XPath lúc thấy lúc không (I.4.a).

### e. Ma trận chọn Appium / Espresso / Detox

Ba công cụ cùng điều khiển giao diện mobile, nhưng khác nhau ở chỗ bài test đứng *ngoài* hay *trong* ứng dụng, và ở cách chúng biết giao diện đã ổn định. Brief T03 nêu cả ba; learning objective bắt nhóm quyết định khi nào Detox hợp hơn Appium trên React Native.

| Tiêu chí | **Appium 2** | **Espresso** | **Detox** |
|----------|--------------|--------------|-----------|
| Mô hình | Black-box, ngoài tiến trình | White-box, cùng tiến trình (instrumentation) | Gray-box: runner ở ngoài, theo dõi trạng thái từ trong app |
| Cách điều khiển | W3C WebDriver → driver (UiAutomator2 / XCUITest) | `onView` → `perform` → `check` | API JavaScript riêng; không dùng WebDriver |
| Đồng bộ | Không biết app đang bận; team tự viết explicit wait | Tự chờ đến khi hàng đợi UI không còn việc cần xử lý ngay, không còn `AsyncTask`, và mọi `IdlingResource` đã idle | Tự chờ app idle: network, main thread, layout (kể cả Yoga), timer, animation, JS thread, native module, bridge RN |
| Nền tảng | Android, iOS và nền khác, một client | Chỉ Android | Android + iOS, hướng React Native |
| Ngôn ngữ test | Bất kỳ client WebDriver | Kotlin / Java, trong `androidTest` | JavaScript (Jest), cùng repo RN |
| Bản app | APK/IPA cài được | App đã instrument, cần mã nguồn Android | Bản debug đã gắn instrumentation; Expo cần config plugin và prebuild |
| Thiết bị | Emulator, máy thật, device farm | Emulator hoặc thiết bị trong Android test | Emulator/simulator trên CI là trường hợp chính |
| Tốc độ và độ ổn định | Chậm hơn; dễ flaky nếu wait hoặc locator yếu | Nhanh và ổn định trên Android native | Nhanh trên RN vì ít phải tự viết wait; nhạy khi nâng cấp RN |
| Điểm mù | Không thấy JS bridge đang bận | Không theo dõi JS thread, bridge hay network của RN nếu team không tự đăng ký idling | Không dành cho app không phải RN; không test black-box bản store chưa gắn instrumentation |

#### Khi nào chọn công cụ nào

| Chọn | Khi nào |
|------|---------|
| **Appium** | Cần một stack cho Android và iOS, máy thật hoặc device farm; test đúng bản APK người dùng cài; team không viết Kotlin; muốn gắn checkpoint thị giác (Eyes) vào cùng phiên WebDriver. |
| **Espresso** | App Android native, team Kotlin/Java, ưu tiên tốc độ và độ ổn định trong cùng process. Không chọn làm công cụ chính cho EShop: EShop là React Native, Espresso không đồng bộ với JS bridge. |
| **Detox** | Team RN/Expo viết test bằng JS trong CI, chấp nhận bản build đã instrument, và muốn framework tự chờ network, animation và bridge. |

**Quan hệ Espresso và Detox.** Trên Android, Detox dùng Espresso để thao tác view, rồi thêm lớp đồng bộ React Native mà Espresso thuần không có. Trên iOS, từ Detox 18 hệ đồng bộ là của Detox, không còn phụ thuộc EarlGrey. “Detox nhanh vì nó là Espresso” chỉ đúng một nửa: đường chạm view trên Android đi qua Espresso; lý do ít flaky trên RN là lớp gray-box.

**Kết luận cho nhóm T03:** Appium là lớp functional chính vì black-box trên APK, chạy được device farm và gắn được Eyes. Espresso bị loại vì chỉ phủ Android native. Detox dùng để *báo cáo khác biệt DX* trên cùng luồng đăng nhập và tìm kiếm (TV1), không thay cặp Appium + Applitools.

#### Đối sánh đã đo trên EShop (A4)

PoC Detox chạy cùng luồng đăng nhập tài khoản mẫu và tìm `iPhone`, không chạy giỏ hàng. Phạm vi: Ubuntu, AVD `eshop_api34`, Node.js 22.13+ (lần chạy ghi Node 22.23.4), Detox 20.51.4. Ba lượt sau khi bỏ `pressBack()` đều 1/1 test; Jest báo 25,508 s, 24,790 s và 38,594 s. Build Gradle rút gọn kết thúc trong 4 phút 42 giây. Chi tiết lệnh và hash APK ở [A4](docs/A4_Detox.md).

| Khía cạnh | Appium A2 | Detox A4 |
|-----------|-----------|----------|
| Chuẩn bị thêm | Server Appium 2.19.0 và driver UiAutomator2 4.2.9 | Instrumentation, APK app và APK test, Jest, Node 22.13+ |
| Tìm phần tử | `testID` qua `UiSelector().resourceId(...)` | Cùng `testID`, qua `by.id(...)` |
| Đồng bộ | `waitForDisplayed` / `waitUntil` do test viết | Tự chờ idle; PoC vẫn `waitFor` khi đợi API |
| State sạch | `noReset: false`, rồi `terminateApp` + `activateApp` | `device.launchApp({ delete: true })` |
| Điểm vướng đã gặp | Cold start không đưa app lên foreground | `pressBack()` sau `replaceText()` đóng activity; build native cần đĩa trống (lần đầu emulator không boot khi còn khoảng 1,7 GiB) |

Không xếp hạng tốc độ từ ba lượt Detox và trung vị Appium chiến dịch 1 (30,496 s). Hai mẫu khác số lượt và khác điều kiện. A4 ghi rõ điều này.

---

## 2. Kiểm thử chức năng (Functional Testing)

### a. Khái niệm

Kiểm thử chức năng xác minh **hệ thống làm đúng việc nghiệp vụ**: người dùng thao tác → hệ thống phản hồi đúng dữ liệu và trạng thái. Trên mobile automation, điều này thể hiện bằng chuỗi hành động + assertion xác định (không phải “ảnh giống baseline”).

### b. Kịch bản chuẩn trên EShop

1. **Đăng nhập** — tài khoản hợp lệ vào được; tài khoản sai bị từ chối (nếu mở rộng).  
2. **Tìm sản phẩm** — nhập từ khóa, danh sách cập nhật.  
3. **Xác minh kết quả** — tên, giá, trạng thái hiển thị khớp dữ liệu kỳ vọng.  
4. *(Sang lớp visual)* checkpoint giao diện — xem **I.3**.

Assertion chức năng trả lời: *“Người dùng có hoàn thành được việc và thấy đúng dữ liệu không?”*

### c. Functional assertion vs Visual checkpoint

| Tiêu chí | Functional assertion | Visual checkpoint |
|----------|----------------------|-------------------|
| Đối tượng | Hành vi + dữ liệu | Bố cục, màu, khoảng cách, ảnh, chữ đang hiển thị |
| Oracle | Giá trị / trạng thái mong đợi trong code | Baseline ảnh + cách so khớp đã chọn |
| UI đổi màu hoặc khoảng cách, dữ liệu giữ nguyên | Thường vẫn pass | Thường fail ở match level Strict |
| Giá hiển thị sai | Fail nếu assertion đọc đúng text | Fail ở Strict hoặc Content vì chữ đổi. Có thể pass nếu vùng giá bị ignore, match level là Layout (bỏ qua nội dung), hoặc lỗi không được vẽ lên màn hình |

**Kết luận:** Visual testing bắt thay đổi *nhìn thấy được*. Nó không biết một thay đổi là lỗi nghiệp vụ hay bản thiết kế đã duyệt, và không bắt lỗi không xuất hiện trên ảnh (sai quyền, sai tổng tiền chưa render, tác dụng phụ phía server). Vì vậy nó không thay assertion về giá, tổng tiền, quyền truy cập hay thông báo lỗi.

### d. Lớp an toàn (safety net)

Khi dùng AI visual, vẫn giữ một tập nhỏ assertion chức năng:

- Đăng nhập thành công / thất bại đúng kỳ vọng.  
- Sản phẩm tìm thấy có đúng tên / giá.  
- CTA và thông báo lỗi không bị “ignore” khỏi kiểm soát.

Locator ổn định + assertion chức năng = lớp an toàn khi visual tool báo nhiễu hoặc ignore region quá rộng.

---

## 3. Visual Testing và kiểm thử hồi quy giao diện

### a. Visual testing là gì?

Visual testing (kiểm thử giao diện / visual regression testing) kiểm tra **thứ người dùng nhìn thấy** sau khi app đã ở một trạng thái xác định: bố cục, màu, khoảng cách, ảnh và chữ. Functional testing hỏi “việc có làm được và dữ liệu có đúng không?”. Visual testing hỏi “màn hình còn giống bản đã duyệt không?”.

Functional test có thể **pass** trong khi UI đã regress: màu sai, chữ chồng, banner lệch, nút biến mất nhưng script vẫn chạm được một vùng cũ. Ngược lại, một ảnh “trông ổn” không chứng minh giá, quyền hay thông báo lỗi đúng.

Quy trình một checkpoint:

1. Đưa app tới trạng thái đã biết (sau đăng nhập, sau tìm kiếm).
2. Chụp màn hình hoặc một vùng (checkpoint).
3. So với **baseline** — ảnh đã được người có thẩm quyền chấp nhận.
4. Sinh **visual diff** những vùng không khớp.
5. Người triage phân loại: lỗi thật, nhiễu, hoặc thay đổi có chủ đích.
6. Chỉ cập nhật baseline khi thay đổi đã được duyệt. Cập nhật baseline là quyết định chấp nhận UI mới, không phải bước kỹ thuật tự động.

Ba cách so sánh, từ cứng đến có ngữ cảnh:

| Cách so | Oracle | Điểm yếu |
|---------|--------|----------|
| **Pixel (Exact)** | Từng pixel phải trùng | Anti-alias, làm mịn font, status bar, một khung animation cũng thành fail. Không khuyến nghị cho kiểm thử thường ngày. |
| **Ngưỡng pixel** | Cho phép một tỉ lệ pixel lệch | Ngưỡng là số tùy ý: thấp thì nhiễu, cao thì nuốt lỗi thật (nút lệch vài pixel, chữ bị cắt). |
| **Visual AI (layout-aware)** | So theo vùng, bố cục và nội dung; bỏ khác biệt kết xuất mà mắt người không thấy | Vẫn cần người triage và chính sách ignore. Không tự biết một diff là bug hay redesign. |

Nhiễu đặc thù trên mobile: mật độ màn hình, font, thanh trạng thái (giờ, pin), animation chưa kết thúc, ảnh sản phẩm đổi, và khác biệt render giữa máy thật với emulator. Vì vậy baseline nên gắn với một cấu hình thiết bị cố định. Lượt Eyes của EShop gắn với AVD `Medium_Phone_API_37.0`, 1080×2400. Lượt Appium A3 dùng AVD `eshop_api34`, cùng độ phân giải; đổi AVD là một baseline mới.

### b. Thuật ngữ then chốt

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Baseline** | Ảnh / trạng thái UI được chấp nhận làm chuẩn |
| **Checkpoint** | Điểm trong test chụp và so với baseline |
| **Visual diff** | Khác biệt giữa lần chạy hiện tại và baseline |
| **Ignore region** | Vùng cố ý bỏ qua (banner xoay ảnh, đồng hồ, ads…) |
| **True positive** | Diff phản ánh lỗi giao diện thật |
| **False positive** | Diff do nhiễu / thay đổi không quan trọng |
| **Intentional update** | Đổi UI có chủ đích → cập nhật baseline có phê duyệt |

### c. Phân loại kết quả visual diff (trọng tâm hoạt động lớp)

1. **Lỗi thật** — bố cục vỡ, màu/token sai, CTA biến mất, giá/label lệch vị trí nghiêm trọng.  
2. **False positive / nhiễu** — ảnh carousel đổi, anti-alias, nội dung động không ảnh hưởng nghiệp vụ.  
3. **Thay đổi có chủ đích** — redesign đã được chấp thuận → cập nhật baseline theo quy trình.

### d. Chính sách ignore region

| Được cân nhắc ignore | Không được ignore |
|----------------------|-------------------|
| Banner ảnh động (giữ bố cục) | Giá, tổng tiền |
| Timestamp / avatar ngẫu nhiên (nếu ngoài scope) | CTA chính (Mua, Đăng nhập…) |
| Vùng marketing xoay nội dung đã thống nhất | Thông báo lỗi, trạng thái form |

Ignore quá rộng → che regression. Ignore quá hẹp → triage mệt, mất niềm tin vào tool.

### e. Minh họa trên EShop

Màn Home không có banner riêng. Lượt B2 dùng ảnh sản phẩm id 1 cho ca đổi ảnh, và bản V2 cho ca đổi màu.

- **V1 — đổi ảnh sản phẩm 1, khung giữ** → Eyes Unresolved 5/10 trong khi Appium pass 8/8. Đây là báo thừa: vùng Layout khai báo trong code không có hiệu lực ở lượt đó.
- **V2 — đổi màu và bố cục** → Eyes Unresolved 6/10 ở match level Strict dù Appium vẫn pass 8/8. Đây là regression giao diện thật.

### f. Hai hướng AI trong kiểm thử GUI: Applitools và Maestro

“AI trong kiểm thử GUI” ở T03 là **hai cơ chế khác nhau**. Gộp chúng thành một oracle sẽ giải thích sai kết quả demo.

| | **Applitools Eyes — Visual AI** | **Maestro — LLM assertion** |
|--|----------------------------------|-----------------------------|
| Câu hỏi | Ảnh lần này có lệch baseline đã duyệt theo mức so khớp đã chọn không? | Mô hình có cho rằng ảnh hiện tại thỏa câu mô tả, hoặc có defect nhìn thấy, không? |
| Đầu vào | Ảnh checkpoint + baseline + match level / vùng | Ảnh màn hình + câu tiếng tự nhiên (`assertWithAI`), hoặc chỉ ảnh (`assertNoDefectsWithAI`) |
| Oracle | Baseline có phiên bản, có người phê duyệt | Phán đoán của LLM; không có baseline |
| Tính lặp | Cùng ảnh, cùng baseline, cùng match level cho cùng một kết quả so khớp | Xác suất. Tài liệu Maestro đặt `optional: true` mặc định để một câu trả lời không ổn định không làm gãy CI |
| Chỗ chạy | Eyes Cloud (cần API key, trial) | Lệnh AI đi qua Maestro Cloud dù flow chạy local (`maestro login` hoặc `MAESTRO_CLOUD_API_KEY`) |
| Việc AI làm | Tách vùng giao diện, so bố cục / nội dung / màu, lọc nhiễu kết xuất | Đọc ảnh và trả lời có/không, hoặc chỉ defect kiểu chữ bị cắt, phần tử chồng, căn lệch |
| Việc AI không làm | Không kết luận đúng/sai nghiệp vụ | Không lưu chuẩn đã duyệt, không có ignore region hay lịch sử baseline |

**Match level của Eyes** (áp cho cả checkpoint hoặc từng vùng):

| Mức | Bắt được | Bỏ qua |
|-----|----------|--------|
| **Strict** | Chữ, font, màu, ảnh, vị trí — những lệch mắt người thấy | Nhiễu pixel do phần cứng/phần mềm render. Mặc định phù hợp hồi quy trên một OS/thiết bị, nội dung tĩnh |
| **Layout** | Phần tử xuất hiện, biến mất hoặc đổi vị trí tương đối | Nội dung chữ, đồ họa, màu, style. Hợp trang có dữ liệu động hoặc nhiều ngôn ngữ |
| **Ignore colors** | Như Strict, trừ màu | Đổi màu. Hợp khi theme đổi nhưng nội dung phải giữ |
| **Content** | Nội dung chữ | Style và bố cục |
| **Dynamic** | Sai *dạng* dữ liệu (ngày, email, số không còn đúng pattern) | Đúng pattern nhưng đổi giá trị |
| **Exact** | Từng pixel | Không bỏ nhiễu render. Không dùng cho kiểm thử thường ngày |

Trên EShop: ảnh sản phẩm 1 là vùng nội dung động, nên là **vùng** Layout, không phải cả màn hình và không phải Ignore. Giá, nút và thông báo lỗi giữ Strict. V2 (đổi màu và bố cục) là true positive ở Strict: 6/10 checkpoint lệch. V1 (đổi ảnh, khung giữ) lẽ ra là nhiễu nếu vùng Layout có hiệu lực; lượt B2 vẫn Unresolved 5/10 vì vùng đó không được gửi.

**Maestro có hai lớp, đừng trộn:**

- `assertVisible` / `assertNotVisible`: oracle xác định, đọc cây UI.
- `assertScreenshot`: so ảnh với file cục bộ — visual testing cổ điển, không phải AI.
- `assertWithAI` và `assertNoDefectsWithAI`: LLM, đang thí nghiệm. `assertNoDefectsWithAI` là smoke test defect nhìn thấy (cắt chữ, chồng, lệch khung), không thay checkpoint có baseline.
- `maestro test --analyze`: báo cáo sau lượt chạy (hồi quy UI, chính tả, vỡ layout), không phải assertion trong flow.

Maestro là lớp dự phòng khi trial Eyes không phủ S3–S6, và chỉ sau khi giảng viên chấp thuận. Khi dùng, demo phải nói rõ: AI flag được lệch *nhìn thấy*, không có dashboard baseline, ignore region hay pha duyệt chuẩn như Eyes. Assertion giá và quyền vẫn là lệnh xác định.

---

## 4. Độ tin cậy và bảo trì kiểm thử (Test Reliability & Maintenance)

### a. Flaky test và cách xử lý

Một test **flaky** khi cùng mã SUT, cùng mã test và cùng môi trường chủ định, lần chạy này pass và lần khác fail. Lỗi tái lập mọi lần là defect. Phiên không tạo được vì emulator tắt hoặc Appium chưa sẵn sàng là môi trường hỏng. Hai trường hợp đó cần sửa khác với flake.

Appium dễ flaky vì mỗi lệnh là một ảnh của cây accessibility (I.1.c). Giữa hai HTTP request, app có thể còn animation, còn chờ API, hoặc chưa commit layout. Espresso và Detox chờ đến khi app idle; Appium không tự biết điều đó.

| Nguồn | Biểu hiện | Cách xử lý |
|-------|-----------|------------|
| Thời điểm | `element not found`, lần chạy sau thì pass | Explicit wait trên một điều kiện: phần tử của màn đích đã hiện (`waitForDisplayed` với timeout). Sleep cố định hoặc quá ngắn nên vẫn flake, hoặc kéo dài cả những lần đã pass |
| Implicit wait toàn cục | Mọi `findElement` đều chờ hết hạn | Che triệu chứng. Script không nêu điều kiện nào cho phép đi tiếp |
| Chuyển màn / animation | Assert dính màn cũ | Chờ phần tử chỉ có trên màn mới, không chờ một khoảng thời gian |
| Mạng và API | Spinner, danh sách lúc rỗng lúc có | Chờ dữ liệu xuất hiện; seed backend ổn định trước phiên |
| Trạng thái máy | Bàn phím, quyền, thông báo | Đưa máy về trạng thái đã biết trước khi thao tác |
| Vòng đời app | App không ở foreground sau cold start | Mở lại app, rồi chờ màn hình mốc |
| Dữ liệu dính phiên trước | Kết quả phụ thuộc thứ tự test | Reset khi mở và đóng session; mỗi test một session |
| Locator yếu | Cùng XPath lúc khớp lúc không | `testID` / `resource-id` (I.1.d) |
| Retry | Báo cáo xanh hơn | Nguyên nhân còn nguyên. Chỉ thêm retry sau khi wait và reset đã có, và phải ghi số lần retry |

`noReset: false` (mặc định, và là giá trị session EShop) bảo driver chạy reset thông thường lúc mở và đóng phiên, nên dữ liệu app của phiên trước không còn. `fullReset: true` gỡ rồi cài lại APK — nặng hơn, dùng khi chính bản cài đặt phải sạch.

Hai flake đã gặp trên EShop, và cách bộ test đang xử lý:

- Bàn phím ảo còn mở che phần dưới màn hình. UiAutomator2 không trả về phần tử bị che, nên click báo không tìm thấy dù nút vẫn trong app. Helper đóng bàn phím nếu nó đang hiện, rồi mới tìm ô tìm kiếm.
- APK debug có thể không lên foreground sau cold start. Bộ test gọi `terminateApp` rồi `activateApp`, sau đó chờ liên kết đăng nhập tối đa 30 giây. Điều kiện chờ là phần tử màn Home, không phải một `sleep`.

Khi một fail không tái lập, tăng timeout không phải bước đầu. Chạy lại cùng test nhiều lần và lấy page source tại lần `findElement` thất bại (`appium:printPageSourceOnFindFailure`) để phân biệt locator sai, màn hình sai, và chờ chưa đủ.

Hai chiến dịch A3 trên cùng máy Linux, AVD `eshop_api34`, Appium 2.19.0 và UiAutomator2 4.2.9, mỗi chiến dịch 10 lượt, flake quan sát 0/10. Chiến dịch 1 (một ca đăng nhập + tìm `iPhone`, commit `865deea`): trung bình 30,559 s, trung vị 30,496 s, khoảng 29,751–31,734 s; thời gian bốn dịch vụ sẵn sàng đo được 20,219 s. Chiến dịch 2 (bộ data-driven, 3 test, 8 kiểm tra TAP): trung bình 102,284 s, trung vị 102,238 s, khoảng 98,729–105,646 s. Mười lượt không ước lượng xác suất flaky dài hạn. Số liệu và log ở [A3](docs/A3_Metrics.md).

### b. Chi phí bảo trì khi UI thay đổi

| Loại thay đổi UI | Functional (Appium) | Visual AI (Eyes) |
|------------------|---------------------|------------------|
| Ảnh sản phẩm đổi, khung giữ nguyên (V1) | Đã đo: pass 8/8 | Đã đo: Unresolved 5/10. Báo thừa cho tới khi người duyệt Accept, vì vùng Layout trong code không có hiệu lực ở lượt B2 |
| Đổi màu / vị trí nút / căn lề (V2) | Đã đo: pass 8/8 | Đã đo: Unresolved 6/10, đúng các vùng đã sửa |
| Đổi hierarchy / bỏ `testID` | Script gãy nếu `resourceId` không còn khớp. Chưa có lượt cố ý gỡ id | Chưa đo |

Learning objective T03: **đo và giải thích** chi phí bảo trì khi ảnh đổi so với đổi colour token. Màn Home của EShop mobile không có banner riêng, nên lượt B2 sáng 23/10/2026 (AVD `Medium_Phone_API_37.0`) dùng ảnh sản phẩm id 1 làm vùng thay thế. Hai hàng đầu của bảng là kết quả đã chạy; hàng bỏ `testID` vẫn là suy từ locator. Số và ảnh dashboard ở [B2](docs/B2_Report.md) và III.2.e.

### c. Ghép cặp hai lớp kiểm thử

```
[Functional layer]  Appium: đăng nhập (L1→L2) → tìm kiếm (1/2/0) → tổng giỏ hàng
        +
[Visual layer]      Eyes: checkpoint màn hình quan trọng
        +
[Policy layer]      Quy tắc ignore region + phê duyệt baseline
```

- Functional giảm rủi ro AI “nhìn đẹp” nhưng sai nghiệp vụ.  
- Visual giảm rủi ro script “pass” nhưng UI hỏng.  
- Policy giảm rủi ro ignore bừa hoặc cập nhật baseline không kiểm soát.

### d. Failure modes

Lượt Eyes sáng 23/10/2026 (AVD `Medium_Phone_API_37.0`, log `src/appium/logs/20261023-065743/`, ảnh `docs/evidence/B1_B2_applitools-dashboard/`) đã quan sát được cả ba kiểu dưới. Số và ảnh ở [B2](docs/B2_Report.md). Những lần fail Appium và Detox nằm riêng ở I.4.a, [A2](docs/A2_Test_Design.md) mục 5 và [A4](docs/A4_Detox.md): bàn phím che nút, Alert nuốt cú bấm thứ hai, cold start không lên foreground, `pressBack()` đóng activity Detox, và thông báo đăng nhập gộp hai nguyên nhân thành một chuỗi.

1. **Locator / đồng bộ** — không tìm thấy element; timeout do animation hoặc mạng. Trên Eyes, `productImage()` tìm bằng `id=product-image-1`. Chiến lược `id` thêm tiền tố package và không khớp `resource-id` của React Native, nên vùng Layout không được gửi trong lượt B2.
2. **Visual nhiễu** — V1 đổi ảnh sản phẩm 1, khung giữ nguyên, Eyes vẫn Unresolved 5/10. Lượt xác nhận sau khi đổi selector vẫn không trùng vị trí ảnh trên ảnh chụp của Eyes; chỉ vùng phủ toàn ảnh thì Passed. Ignore hoặc Layout quá rộng sẽ che regression thật.
3. **Oracle lệch** — V2: Appium `# pass 8` `# fail 0` trong khi Eyes Unresolved 6/10 (màu giá, vị trí nút, căn lề tổng tiền). `eyes.close(false)` giữ exit code 0; dashboard mới là nơi thấy diff. V2 thì Reject. V1 chỉ Accept khi đổi ảnh là chủ ý.

### e. Ai được cập nhật baseline?

Cập nhật baseline là **quyết định chấp nhận UI mới**, không phải thao tác kỹ thuật thuần:

- Điều kiện: thay đổi đã được product/design xác nhận.  
- Người phê duyệt: chỉ định trước (tech lead / QA owner / giảng viên).  
- Ghi nhận: lý do cập nhật, ảnh hưởng ignore region, liên kết ticket nếu có.

---

# II. Ba khối nền tảng automation

Theo yêu cầu seminar FIT@HCMUS, mỗi công cụ thường thể hiện ba khối: **Record & Playback**, **Data-driven**, **Checkpoints**. Map sang stack T03 như sau.

| Khối | Ý nghĩa | Appium | Applitools Eyes | Maestro |
|------|---------|--------|-----------------|---------|
| **Record & Playback** | Ghi thao tác rồi chạy lại | Inspector (plugin web) ghi bước để khám phá locator. Code Recorder là bản nháp; test chính thức là Page Object trong `src/appium/` | Không ghi gesture; “playback” là chạy lại checkpoint trên baseline | Maestro Studio ghi flow YAML |
| **Data-driven** | Cùng kịch bản, nhiều bộ dữ liệu | Ba bảng trong `src/appium/data/cases.js`: đăng nhập (sai rồi đúng), tìm kiếm (1, 2, 0 kết quả), giỏ hàng (đơn giá × số lần thêm) | Baseline theo môi trường/viewport; batch nhiều màn | Biến env / parameters trong flow |
| **Checkpoints** | Điểm xác minh kết quả | Assert thông báo lỗi, tên người dùng, số kết quả, tên sản phẩm, thành tiền và tổng giỏ | Visual checkpoint (`Eyes.check`) so baseline | `assertVisible` / `assertWithAI` |

**Nguyên tắc T03:** video demo Appium thể hiện đủ ba khối — Inspector và Recorder (record), ba bảng A2 (data-driven), assertion nghiệp vụ trong kết quả TAP (checkpoint). Eyes thêm visual checkpoint. Maestro không nằm trong video hay phần live.

---

# III. Lý thuyết theo từng công cụ

---

## 1. Appium 2 + UiAutomator2 *(công cụ truyền thống)*

### a. Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Appium |
|----------------|--------------------|
| **Mobile Test Automation** | Lớp điều khiển ngoài tiến trình (out-of-process) theo WebDriver |
| **Functional Testing** | Tap, type, swipe + assertion dữ liệu/trạng thái |
| **Black-box UI automation** | Nhìn app qua accessibility tree; chỉ cần APK + locator |
| **Test Reliability** | Flaky từ chờ, locator yếu, session/capability, trạng thái thiết bị |
| **Record / Data / Checkpoint** | Inspector (bản nháp); ba bảng đăng nhập, tìm kiếm, giỏ hàng; assert nghiệp vụ |

Appium **không** làm Visual AI; cung cấp hành động xác định và kết quả từ UI hierarchy.

### b. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **WebDriver / W3C WebDriver** | Giao thức HTTP client ↔ server. Appium 2 chỉ nhận W3C |
| **Tiền tố `appium:`** | Capability ngoài chuẩn W3C phải mang tiền tố này |
| **Appium Server** | Tiến trình HTTP; không kèm driver |
| **Driver (UiAutomator2)** | Driver trên máy host; dịch lệnh W3C sang Android |
| **Instrumentation server** | Hai APK `io.appium.uiautomator2.server` (+ `.test`) chạy trên thiết bị |
| **Session** | Phiên gắn thiết bị/app; tạo bằng capabilities |
| **Capabilities** | `platformName`, `app`/`appPackage`, `deviceName`, `automationName`, … |
| **Locator / Selector** | `id`, `accessibility id`, `xpath`, … |
| **testID / accessibility id** | Định danh ổn định trên component RN |
| **Page Source** | Cây element hiện tại; debug locator |
| **Appium Inspector** | GUI xem hierarchy, thử locator, ghi thao tác |
| **Explicit wait** | Chờ có điều kiện thay vì `sleep` cố định |
| **AVD / Emulator** | Thiết bị ảo Android |
| **Device farm** | Nhiều thiết bị chạy song song |

### c. Chức năng chính

1. Khởi tạo session với emulator / thiết bị thật.  
2. Cài / mở APK EShop theo capability.  
3. Tìm và thao tác element: tap, nhập text, swipe, back…  
4. Đọc trạng thái UI: text, attribute, hiển thị/ẩn.  
5. Assertion chức năng: đăng nhập theo bảng, số kết quả và tên sản phẩm, thành tiền và tổng giỏ hàng.  
6. Debug: Inspector, page source, screenshot cơ bản.  
7. Tích hợp CI / device farm qua WebDriver.

**Vai trò demo T03:** bộ data-driven **đăng nhập (sai rồi đúng) → tìm kiếm (1, 2, 0 kết quả) → thêm giỏ và kiểm tra tổng tiền**.

### d. Nguyên lý hoạt động

Sơ đồ năm tầng và hợp đồng capability nằm ở **I.1.c**. Tóm tắt vòng đời:

1. Script tạo session (`platformName=Android`, `appium:automationName=UiAutomator2`, đường dẫn APK).  
2. Server chọn driver UiAutomator2. Driver cài hai APK server lên thiết bị, chạy instrumentation, `adb forward`.  
3. `findElement` / `click` / `setValue` đọc và ghi cây accessibility tại thời điểm lệnh tới.  
4. Kết quả trả về script để assertion.  
5. Đóng session: driver reset theo `noReset`, rồi giải phóng thiết bị.

**Hệ quả:** chậm hơn Espresso/Detox một chút, nhưng độc lập ngôn ngữ app và chạy được trên thiết bị thật hoặc farm. Vì không thấy app đang idle, script phải chờ có điều kiện (I.4.a).

### e. Ba kịch bản demo

Ba mức này nằm trong video 5–8 phút. Phần live không chạy lại Inspector; chi tiết ở IV.3. Phạm vi đã kiểm chứng là Linux, AVD `eshop_api34`.

#### Demo 1 — Cài đặt & kiểm chứng môi trường

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Chứng minh Appium 2 + UiAutomator2 đã sẵn sàng |
| Việc làm | Trình bày các bước cài trong [A1](docs/A1_Setup.md) và gọi Appium `/status` |
| Kết quả kỳ vọng | `/status` báo `ready: true` và `build.version` là `2.19.0`. `appium driver list --installed` có `uiautomator2@4.2.9`. Nói rõ log A1 đã kiểm chứng trên Linux |
| Bằng chứng | Log cài đặt A1. Không diễn lại toàn bộ bước cài trong video |

#### Demo 2 — Chức năng cơ bản (Inspector + Recorder)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Khám phá cây giao diện và locator ổn định |
| Việc làm | Plugin Inspector trong trình duyệt: tạo phiên UiAutomator2, mở màn Login, chọn `login-email`, bật Recorder và xem code WebdriverIO sinh ra. Giải thích `testID` ánh xạ sang `resource-id` |
| Kết quả kỳ vọng | Thấy `resource-id` = `login-email`. Code Recorder là bản nháp; test chính thức giữ Page Object và assertion trong `src/appium/` |
| Ràng buộc phiên | UiAutomator2 chỉ một instrumentation trên một thiết bị. **Quit Session trước khi `npm test`**. Phần live không mở Inspector; nếu cần, chiếu đoạn video này |
| Bằng chứng | Phiên 23/10/2026: 4 ảnh `docs/evidence/A2_inspector_0{1..4}_*.png` và `A2_inspector_recorder_2026-10-23.js` ([A2](docs/A2_Test_Design.md) mục 7). Tìm phần tử bằng chiến lược UIAutomator; chiến lược Id tự thêm tiền tố package nên không khớp `testID` |
| Khối FIT | Record (Inspector). Checkpoint chức năng nằm ở Demo 3 |

#### Demo 3 — Luồng phức tạp (bộ data-driven A2)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Chạy nghiệp vụ đã kiểm chứng và chỉ ra assertion cùng kết quả TAP thật |
| Việc làm | Từ `src/appium/`, chạy `npm test`. Ba test, mỗi test một phiên (`noReset: false`): đăng nhập theo bảng, tìm kiếm theo bảng, thêm giỏ và kiểm tra tổng tiền |
| Dữ liệu | **L1** `test@eshop.com` / `SaiMatKhau-1` rồi **L2** / `Test1234!`. Tìm `iPhone` → 1, `Pro M` → 2, `Nokia 3310` → 0. Giỏ: iPhone 15 Pro Max, đơn giá 30.000.000, thêm 2 lần |
| Kết quả kỳ vọng | L1 còn màn Login, `login-error` chứa "Đăng nhập thất bại". L2 hiện "Chào, Test User". Tìm kiếm đúng số kết quả và tên; 0 kết quả là ca pass khi không còn dòng đếm. Giỏ: thành tiền và tổng = 60.000.000, rồi giỏ trống. TAP: 3 test / 8 kiểm tra, pass 10/10 lượt. Chiến dịch 2: trung bình 102,284 s, trung vị 102,238 s ([A3](docs/A3_Metrics.md)) |
| Ràng buộc dữ liệu | Backend cộng 2 vào `login_attempts` mỗi lần sai và khoá 3 phút khi ≥ 3, nên hai lần sai liên tiếp sẽ khoá tài khoản. Mỗi lượt chỉ sai một lần (L1) rồi đăng nhập đúng (L2). Video nêu failure mode này khi có bằng chứng, và chỉ trích số liệu A3 của đúng phiên bản đã đo |
| Case study | Lớp functional của seminar, là safety net trước checkpoint Eyes |

### f. Điểm yếu / giới hạn

| Trường hợp | Vì sao Appium không giải quyết tốt |
|------------|-------------------------------------|
| Cần sync sâu với JS bridge RN trong CI | Detox thường ổn định hơn, ít tự viết wait |
| Kiểm tra “nhìn giống thiết kế” | Không có Visual AI; screenshot thô dễ nhiễu |
| Locator phụ thuộc XPath/text | Script dễ gãy khi UI/copy đổi |
| Môi trường phức tạp | Cài SDK + driver + capability tốn thời gian; sai cấu hình → session fail |
| Flaky do timing/mạng | Ngoài tiến trình, mỗi lệnh là một ảnh cây UI. Wait và reset theo I.4.a; Appium không tự hết flaky |

### g. Quy trình vận hành đã kiểm chứng

Thứ tự này là thứ tự máy TV1 đã chạy trên Ubuntu với AVD `eshop_api34`. Lệnh đầy đủ ở [A1](docs/A1_Setup.md); bản cho người làm lại từ máy trống ở [User_Guide.md](User_Guide.md) mục 2–3. Chương báo cáo tóm tắt cùng quy trình ở [Report.md](report/Report.md).

1. Node.js 20.19 trở lên, JDK 17 hoặc 21, `ANDROID_HOME`, SDK Platform 36, Build-Tools 36.0.0, AVD `eshop_api34` (Android 14, 1080×2400). Detox dùng Node.js 22.13 trở lên và không cần server Appium.
2. Backend: `cd eshop-sut-main/backend && npm ci && npm start`. Mỗi lần khởi động tạo lại seed. Tài khoản demo `test@eshop.com` / `Test1234!`. API mặc định của app trên emulator là `http://10.0.2.2:3000/api`.
3. Emulator đang `device`, rồi `adb reverse tcp:8081 tcp:8081`. Metro phải chạy với APK debug. Package là `com.eshop.sut`.
4. Appium: `cd src/appium`, `export APPIUM_HOME="$PWD/.appium"`, `npm ci`, `npm run driver:install`, `npm run server`. Sẵn sàng khi `GET http://127.0.0.1:4723/status` có `ready: true` và phiên bản `2.19.0`.
5. Inspector và `npm test` không chạy cùng lúc: UiAutomator2 chỉ một instrumentation trên một thiết bị. Quit Session trước khi test. Trong Inspector, tìm phần tử bằng chiến lược UIAutomator.
6. `npm test` từ `src/appium/` chạy ba test tuần tự (`--test-concurrency=1`), mỗi test một phiên `noReset: false`. TAP kỳ vọng `# pass 8`, `# fail 0`.
7. Mỗi lượt chỉ được sai mật khẩu một lần (L1) rồi đăng nhập đúng (L2). Backend cộng 2 vào `login_attempts` và khoá 3 phút khi đạt 3.

---

## 2. Applitools Eyes *(công cụ AI-augmented)*

### a. Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Eyes |
|----------------|------------------|
| **Visual Regression Testing** | So UI hiện tại với baseline đã chấp nhận |
| **Visual AI / perceptual diff** | Nhận biết bố cục/nội dung; giảm nhiễu pixel |
| **Test oracle** | Baseline + triage người (accept / reject / ignore) |
| **Functional vs Visual** | Bổ sung lớp “nhìn thấy”; không thay assert giá/quyền |
| **Maintenance & policy** | Ignore region và baseline update phải có quy tắc |
| **Checkpoints (FIT)** | Visual checkpoint là dạng checkpoint nâng cao |

### b. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Eyes SDK** | Thư viện gắn vào test Appium/Selenium… |
| **Eyes.open / check / close** | Mở phiên → checkpoint → đóng & gửi kết quả |
| **Checkpoint** | Điểm so sánh visual (cửa sổ hoặc vùng) |
| **Baseline** | Tập ảnh chuẩn đã phê duyệt |
| **Batch / Test result** | Nhóm kết quả một lần chạy trên dashboard |
| **Visual diff** | Vùng khác biệt so với baseline |
| **Match level** | Cách Eyes so checkpoint với baseline: Strict, Layout, Ignore colors, Content, Dynamic, Exact. Chi tiết ở I.3.f |
| **Ignore region** | Vùng loại khỏi so sánh |
| **Floating region** | Cho phép dịch chuyển trong biên độ |
| **True / false positive** | Lỗi thật vs nhiễu |
| **Baseline update** | Chấp nhận UI mới làm chuẩn |
| **Ultrafast Grid** | Nhiều cấu hình cloud (ngoài scope tối thiểu) |

### c. Chức năng chính

1. Gắn vào cùng luồng Appium sau functional steps.  
2. Chụp/so sánh trang chủ / danh sách sản phẩm với baseline.  
3. Phát hiện lệch bố cục, màu, khoảng cách, nội dung.  
4. Giảm nhiễu so với pixel-diff thuần.  
5. Ignore region theo chính sách (banner động…).  
6. Dashboard triage: accept baseline hoặc mở defect.  
7. Minh họa trade-off đã đo: V1 đổi ảnh sản phẩm 1, V2 đổi màu và bố cục.

**Vai trò demo T03:** trên V2, functional pass 8/8 nhưng visual Unresolved 6/10. Trên V1, functional cùng pass 8/8 nhưng visual báo thừa 5/10.

### d. Nguyên lý hoạt động

```
[Appium test] --thao tác UI--> [EShop trên emulator]
       |
       |  Eyes.check(window/region)
       v
[Eyes SDK] --upload ảnh + metadata--> [Applitools Cloud / Visual AI]
                                            |
                                            v
                              So với Baseline (layout-aware)
                                            |
                        +-------------------+-------------------+
                        v                   v                   v
                   Khớp baseline      Diff (cần triage)   Lần đầu → tạo baseline
```

1. Mở Eyes session (API key, app/test name, viewport/device).  
2. Checkpoint: SDK chụp màn hình qua Appium.  
3. Visual AI so với baseline.  
4. Kết quả: pass / unresolved / fail.  
5. Người triage: bug → sửa app; nhiễu → ignore; đổi chủ đích → cập nhật baseline.

### e. Ba kịch bản demo

Hai công cụ trong video và phần live là Appium và Eyes. Ba mức dưới đây lấy từ lượt TV2 đã chạy sáng 23/10/2026. Chỉ trình bày số và ảnh của lượt đó; không dựng ảnh thay cho lần chạy. Chi tiết ở [B2](docs/B2_Report.md).

Môi trường lượt này khác lượt Appium A3: Windows (Git Bash), AVD `Medium_Phone_API_37.0` (Android 17, 1080×2400), SDK `@applitools/eyes-webdriverio@5.61.14`, match level Strict, ignore status bar `(0, 0, 1080, 80)`. Appium trên máy này vẫn là 2.19.0 và UiAutomator2 4.2.9. Baseline đã Accept gắn với AVD này.

#### Demo 1 — Cài đặt SDK và cấu hình

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Cho thấy Eyes gắn được vào stack Appium của nhóm |
| Việc làm | Trình bày SDK, API key qua `APPLITOOLS_API_KEY` (không commit), cấu hình `src/appium/config/eyes.js` (app `EShop`, host `com.eshop.sut`, Strict, `setSaveNewTests(true)`) và lệnh `run-variants.sh` |
| Kết quả kỳ vọng | Cấu hình trùng B2. Lượt hợp lệ nằm ở `src/appium/logs/20261023-065743/`. Thư mục `20261023-065159` hỏng `ECONNREFUSED` vì server Appium chưa chạy, không tính |
| Bằng chứng | Ảnh dashboard `docs/evidence/B1_B2_applitools-dashboard/` |

#### Demo 2 — Chức năng cơ bản (một checkpoint)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Một bộ checkpoint so với baseline đã duyệt |
| Việc làm | Base lần 1 tạo baseline, Accept và Save trên dashboard. Base lần 2 chạy lại cùng mười checkpoint, sau khi assertion chức năng đã qua |
| Kết quả kỳ vọng | Base lần 2: functional `# pass 8` `# fail 0`; Eyes 3/3 Passed; 0/10 checkpoint lệch; 191,297 s. Mười checkpoint: Login initial, Login L1 error, Home sau L2; Home trước tìm; Search S1, S2, S3; danh sách sản phẩm; Cart có hàng; Cart trống |
| Khối FIT | Checkpoint (visual) |
| Bằng chứng | `batch_history_4_runs.png` và ảnh `search_base.png` trong thư mục dashboard |

#### Demo 3 — Luồng phức tạp (hai bản UI có kiểm soát)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Phân biệt đổi ảnh có chủ đích với regression giao diện thật |
| Việc làm | Cùng luồng trên V1 (`EXPO_PUBLIC_UI_VARIANT=v1`, đổi ảnh sản phẩm id 1, khung giữ) và V2 (`v2`, đổi màu giá, đẩy nút, lệch tổng tiền, đổi màu nút thanh toán). Video chiếu cả hai bản. Phần live chỉ chiếu V2 cạnh kết quả Appium |
| Kết quả kỳ vọng | V1: Appium 8/8, Eyes 3/3 Unresolved, 5/10 checkpoint (209,672 s). Lệch đúng các bước có sản phẩm 1. Đây là báo thừa: vùng Layout khai báo trong code không được gửi vì selector `id=` không khớp `resource-id`. V2: Appium 8/8, Eyes 3/3 Unresolved, 6/10 (192,640 s), thêm Cart có hàng. Đây là lỗi giao diện thật. Cart trống khớp ở cả hai bản |
| Case study | Learning objective ảnh đổi so với colour token. EShop mobile không có banner Home, nên ảnh sản phẩm 1 đứng vai vùng nội dung động. Hai bản này cũng là đầu vào cho hoạt động phân loại diff của lớp |
| Ràng buộc live | Dùng AVD `Medium_Phone_API_37.0`. Nếu 10 phút không kịp cả hai công cụ, giữ V2: Appium pass, Eyes bắt lệch màu và bố cục |

### f. Điểm yếu / giới hạn

| Trường hợp | Vì sao Eyes không giải quyết tốt |
|------------|----------------------------------|
| Sai giá / sai quyền / sai thông báo lỗi | Visual có thể vẫn “đẹp” → **không thay** functional assert |
| Banner/ads/animation liên tục | Nhiều false positive nếu thiếu chính sách ignore |
| Ignore region quá rộng | Che regression thật (failure mode nguy hiểm) |
| Trial / chi phí bản quyền | Hết trial hoặc hết quota → demo đứt (cần Maestro dự phòng) |
| Phụ thuộc mạng cloud | Không offline đầy đủ; dashboard cần kết nối |
| “Accept all” baseline bừa | Làm mất giá trị oracle — cần người phê duyệt |

---

## 3. Maestro CLI + AI assertions *(công cụ dự phòng)*

> Dùng khi trial Applitools không khả dụng cho S3–S6 (**sau khi giảng viên chấp thuận**). [Demo_Scenario.md](Demo_Scenario.md) không đưa Maestro vào video hay phần live.

### a. Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Maestro |
|----------------|---------------------|
| **Mobile UI automation** | Flow YAML, DX đơn giản |
| **Synchronization** | Tự chờ UI → giảm flaky so với `sleep` |
| **AI-augmented assertion** | `assertWithAI` / `assertNoDefectsWithAI` |
| **Functional + light visual/AI** | Vẫn có assert text; AI bổ sung, không phải Eyes đầy đủ |
| **Record / Data / Checkpoint** | Studio ghi flow; biến dữ liệu; assertVisible / AI |

### b. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Flow** | File YAML mô tả bước test |
| **Maestro CLI** | Chạy flow trên emulator/thiết bị |
| **Maestro Studio** | Ghi/chỉnh flow (local) |
| **Selector** | text, id, thuộc tính UI |
| **Built-in waiting** | Chờ element/visible mặc định |
| **assertVisible / assertNotVisible** | Assertion xác định |
| **assertWithAI** | LLM chấm ảnh theo một câu mô tả. Thí nghiệm; `optional: true` mặc định |
| **assertNoDefectsWithAI** | LLM tìm defect nhìn thấy (chữ cắt, chồng, lệch khung). Không có baseline |
| **assertScreenshot** | So ảnh với file cục bộ — visual testing cổ điển, không phải AI |
| **Cloud / local** | Local miễn phí; cloud có gói/trial |
| **RN / Expo support** | Lý do phù hợp EShop |

### c. Chức năng chính

1. Viết/chạy flow YAML trên Android.  
2. Launch app, login → search tương tự Appium.  
3. Assertion xác định: text/visible.  
4. AI assertions khi không dùng Eyes.  
5. Tự động chờ → flow ngắn, ít flaky hơn script tự viết wait.  
6. Demo dự phòng: vẫn minh họa “functional + AI nhìn UI”.

### d. Nguyên lý hoạt động

```
[flow.yaml] --maestro test--> [Maestro CLI / engine]
                                    |
                                    v
                         Kết nối emulator / device
                                    |
                                    v
                          Thao tác UI (tap, input…)
                                    |
              +---------------------+---------------------+
              v                                           v
     Assertion xác định                    assertWithAI / assertNoDefectsWithAI
     (so text / visible)                   (màn hình + mô tả → pass/fail + lý do)
```

1. Mô tả kịch bản bằng YAML.  
2. Parse flow, mở app, tự chờ điều kiện UI.  
3. Assert thường: text/visibility.  
4. Assert AI: chụp màn hình, gửi ảnh kèm câu mô tả lên LLM qua Maestro Cloud, nhận có/không. Kết quả xác suất; mặc định `optional: true` nên fail AI không dừng flow trừ khi ghi `optional: false`.  
5. Báo cáo CLI. `maestro test --analyze` thêm báo cáo insight sau lượt chạy; đó không phải assertion trong YAML.

### e. Ba kịch bản demo

Ba mức dưới đây là phương án thay Eyes, không phải mức thứ ba của video. Khi dùng, nói rõ AI chỉ flag lệch nhìn thấy và không có baseline, ignore region hay dashboard duyệt như Eyes.

#### Demo 1 — Cài đặt & chạy flow mẫu

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Maestro CLI điều khiển được APK EShop |
| Việc làm | Cài CLI; kết nối AVD; flow `launchApp` + assert màn hình mở |
| Kết quả kỳ vọng | Flow xanh; app mở đúng package |

#### Demo 2 — Chức năng cơ bản (Record + Checkpoint)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Login–search bằng YAML |
| Việc làm | Studio/record hoặc viết tay: login → search → `assertVisible` tên sản phẩm |
| Kết quả kỳ vọng | Assertion xác định pass trên dữ liệu seed |
| Khối FIT | Record (Studio) + Checkpoint (assertVisible) |

#### Demo 3 — Luồng phức tạp / AI assertion (dự phòng Eyes)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Thay lớp visual khi không có Applitools |
| Việc làm | Cùng luồng EShop + `assertWithAI` mô tả layout/CTA; (tuỳ chọn) `assertNoDefectsWithAI`; data-driven vài keyword |
| Kết quả kỳ vọng | AI flag được lệch rõ; **ghi rõ** không có baseline/ignore region chuẩn Eyes |
| Case study | Backup seminar — vẫn cặp traditional + AI theo Seminar Guide |

### f. Điểm yếu / giới hạn

| Trường hợp | Vì sao Maestro AI không thay Eyes tốt |
|------------|----------------------------------------|
| Cần quy trình baseline / ignore region / triage chuẩn | `assertWithAI` không có dashboard baseline như Applitools (I.3.f) |
| Assertion nghiệp vụ chính xác (giá, quyền) | LLM có thể ảo giác hoặc bỏ sót → vẫn cần `assertVisible` |
| Ổn định lâu dài / audit | Cùng một ảnh có thể cho kết quả khác; Maestro đặt AI command là optional mặc định vì lý do này |
| Phạm vi T03 chính thức | Chỉ **dự phòng** sau khi GV chấp thuận; không phải pick mặc định |
| Device farm phức tạp | Appium + farm thường linh hoạt hơn cho mở rộng sau demo |

---

## 4. Bản đồ công cụ ↔ lớp kiểm thử

| Lớp | Công cụ chính | Oracle | Câu hỏi trả lời |
|-----|---------------|--------|-----------------|
| Functional | Appium + UiAutomator2 | Giá trị/trạng thái trong script | User làm được việc và thấy đúng dữ liệu? |
| Visual AI | Applitools Eyes | Baseline + Visual AI + triage người | UI có regress so với chuẩn đã duyệt? |
| Functional + AI assert (backup) | Maestro | Text/visible + phán đoán AI | Flow chạy được và AI thấy defect/mô tả đúng? |
| Policy / Reliability | Quy trình nhóm | Quy tắc ignore + phê duyệt | Có tin được kết quả qua nhiều lần chạy? |

**Quy tắc ghép cặp (Seminar Guide):** live demo phải dùng ít nhất một tính năng **truyền thống** và một tính năng **AI-augmented**.

---

# IV. Tóm tắt & liên hệ seminar

## 1. Tóm tắt bốn mảng + ba công cụ

| # | Mảng lý thuyết | Câu hỏi trung tâm | Công cụ minh họa |
|---|----------------|-------------------|------------------|
| 1 | Mobile Test Automation | Appium 2 điều khiển APK qua tầng nào, và vì sao lệnh dễ flake? | Appium 2 + UiAutomator2 |
| 2 | Functional Testing | Hành vi và dữ liệu nghiệp vụ có đúng không? | Assertion Appium / Maestro |
| 3 | Visual Testing / hai hướng AI trên GUI | UI có regress so với baseline, hay LLM chỉ “thấy” defect? | Applitools Eyes (Maestro AI dự phòng) |
| 4 | Reliability & Maintenance | Giảm flaky, triage diff, bảo trì lâu dài? | Ignore/baseline policy + failure modes |

| Công cụ | Vai trò | Lý thuyết gắn trực tiếp |
|---------|---------|-------------------------|
| Appium 2 + UiAutomator2 | Chính — functional | WebDriver, session, locator, functional assert |
| Applitools Eyes | Chính — AI visual | Baseline, checkpoint, ignore region, triage |
| Maestro + AI | Dự phòng | Flow YAML, auto-wait, AI assertion |
| Detox | PoC so sánh (TV1) | Khi nào chọn thay Appium cho RN CI |

## 2. Gợi ý đọc thêm (brief T03)

1. Hans-Joachim Görg — *Practical Appium* (Chs. 1–4).  
2. Ma trận I.1.e đối chiếu [Espresso](https://developer.android.com/training/testing/espresso), [Detox — design principles](https://wix.github.io/Detox/docs/next/articles/design-principles/) và [Detox — how it works](https://github.com/wix/Detox/blob/master/docs/articles/how-detox-works.md).  
3. Applitools — *Visual AI 101* whitepaper; match level: [Match Levels and Regions](https://applitools.com/docs/eyes/concepts/best-practices/match-levels).  
4. Appium 2: [kiến trúc UiAutomator2](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/architecture.md) · [capability và tiền tố `appium:`](https://appium.io/docs/en/2.19/guides/caps/) · [Appium](https://appium.io/) · [UiAutomator2](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/).  
5. [Applitools Mobile](https://applitools.com/solutions/mobile-testing/) · [Maestro React Native](https://docs.maestro.dev/get-started/supported-platform/react-native) · [assertWithAI](https://docs.maestro.dev/reference/commands-available/assertwithai) · [assertNoDefectsWithAI](https://docs.maestro.dev/reference/commands-available/assertnodefectswithai).

## 3. Map sang buổi seminar 45 phút

Ba mức của từng công cụ nằm trong một video 5–8 phút (`Demo_Screencast.mp4`, https://youtu.be/N3cN5d2LSG4) đã chia sẻ trước, không phải sáu lần chạy live. Đề cương video: cài đặt A1 và `/status` (0:35–1:15), Inspector trên màn Login rồi Quit Session (1:15–2:05), `npm test` bộ A2 (2:05–3:25), một failure mode đã quan sát và số liệu A3 đúng phiên bản (3:25–4:00), cài Eyes và checkpoint base lần 2 (4:00–4:40), V1 và V2 (4:40–6:30). Số Eyes lấy từ lượt 23/10 trong [B2](docs/B2_Report.md): base lần 2 là 0/10 lệch, V1 là 5/10, V2 là 6/10, Appium 8/8 ở cả ba bản.

Phần live 10 phút không dùng slide. Backend, Metro, emulator và Appium được bật trước. Không mở Inspector trong lúc này.

| Thời gian | Nội dung | Mục lý thuyết |
|-----------|----------|---------------|
| 0–10 phút | Pitch: khó khăn mobile, kiến trúc Appium, Visual AI, lý do chọn tool | I.1–I.3, III.1–III.2, I.1.e |
| 10–20 phút | Live: chạy bộ Appium đã kiểm chứng, rồi checkpoint Eyes trên V2. V1 nằm ở video | III.1.e Demo 3, III.2.e Demo 2–3, I.4.c |
| 20–40 phút | Hoạt động phân loại 10 diff; quy tắc ignore/baseline | I.3.c–I.3.d, I.4 |
| 40–45 phút | Tổng kết, Q&A | I.2.c, I.4.c |
| Ngoài kịch bản demo | Maestro AI chỉ khi hết trial Applitools và giảng viên chấp thuận | III.3 |

## 4. Ranh giới phân công (tham chiếu)

| Thành viên | Phần lý thuyết này dùng thế nào |
|------------|----------------------------------|
| **TV3** | Sở hữu Phần I–IV; kiểm chứng cài đặt (log theo Demo 1); báo cáo / User Guide / slide mở đầu |
| **TV1** | Thực thi demo Appium (+ Detox PoC); lấy khung III.1.e làm checklist |
| **TV2** | Đã chạy Eyes (B1/B2) sáng 23/10/2026; 10 diff cards, worksheet, failure mode ở I.4.d và III.2.e. Video và live dùng số và ảnh dashboard đã có |

---

*Tài liệu lý thuyết nội bộ nhóm T03 — biên soạn từ Seminar Guide, T03 brief, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal, Seminar Scenario Draft và Demo_Scenario.md.*
