# Lý thuyết T03 — Mobile Automation Testing

Tài liệu lý thuyết cho seminar **T03 Mobile Automation Testing** (CS423 / CSC15003), dựa trên brief T03, Seminar Guide, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal và Seminar Scenario Draft. Ba mức demo ở C1.5, C2.5 và cách chia video với phần live ở D3 bám [Demo_Scenario.md](Demo_Scenario.md).

**Thông điệp xuyên suốt:** Appium xác minh *hành vi* của người dùng; Applitools kiểm tra *thứ người dùng nhìn thấy*. Hai lớp kiểm thử bổ sung cho nhau, không thay thế nhau.

**Công cụ trong phạm vi nhóm**

| Vai trò | Công cụ |
|---------|---------|
| Truyền thống (chính) | Appium 2 + UiAutomator2 |
| AI-augmented (chính) | Applitools Eyes |
| Dự phòng | Maestro CLI + AI assertions |
| So sánh truyền thống (learning objective) | Detox (khi nào chọn thay Appium) |

**SUT:** EShop React Native Expo (`frontend-mobile`), Android development APK trên emulator.

---

## Mục lục

| Phần | Nội dung |
|------|----------|
| **A** | Bốn mảng lý thuyết cốt lõi |
| **B** | Ba khối nền tảng automation: Record & Playback · Data-driven · Checkpoints |
| **C** | Lý thuyết theo từng công cụ (Appium · Applitools · Maestro) |
| **D** | Tóm tắt, đọc thêm, map sang buổi seminar |

Mỗi công cụ ở Phần C theo cùng khung:

1. Lý thuyết liên quan  
2. Thuật ngữ  
3. Chức năng chính  
4. Nguyên lý hoạt động  
5. Ba kịch bản demo (cài đặt · cơ bản · phức tạp)  
6. Điểm yếu / giới hạn  

---

# Phần A — Bốn mảng lý thuyết cốt lõi

---

## A1. Kiểm thử tự động trên mobile (Mobile Test Automation)

### A1.1 Kiểm thử tự động trên mobile là gì?

Kiểm thử tự động trên mobile dùng một chương trình điều khiển ứng dụng trên thiết bị hoặc emulator, lặp lại thao tác của người dùng và kiểm tra kết quả. Appium nằm ở lớp end-to-end, black-box: nó chỉ thấy cây giao diện mà hệ điều hành công bố, không gọi hàm bên trong JavaScript của React Native. Jest phủ đơn vị và component; lớp đó không thay một phiên chạy trên APK.

Môi trường là một phần của bài test. Script đúng locator vẫn fail khi máy chưa cấp quyền, bàn phím che nút, mạng chậm, hoặc dữ liệu phiên trước còn trong app. Độ ổn định vì vậy thuộc thiết kế test (A4), không phải việc dọn sau khi script đã xanh một lần.

| Yếu tố | Hệ quả với kiểm thử |
|--------|---------------------|
| Phân mảnh OS / thiết bị | Cùng kịch bản có thể pass trên AVD này, fail trên thiết bị khác. Baseline và timeout gắn với một cấu hình (EShop: AVD `eshop_api34`) |
| Cảm biến, quyền, trạng thái máy | GPS, camera, pin, thông báo xen ngang, bàn phím ảo làm cây UI đổi giữa hai lệnh |
| Mạng và độ trễ | Spinner còn quay, danh sách chưa có dữ liệu, race giữa lệnh tiếp theo và phản hồi API |
| Vùng chạm nhỏ, gesture | Tap, swipe, long-press phụ thuộc toạ độ và thời điểm; khó tái lập hơn click trên web |
| App vẽ UI bất đồng bộ | React Native commit layout sau khi JS và bridge xong. Công cụ đứng ngoài không biết lúc đó |

EShop là client React Native Expo (Android + iOS) nên cùng một màn hình có thể đặt câu hỏi cho Appium, Espresso và Detox (A1.4). Seminar chạy lớp functional trên APK Android.

### A1.2 Kiến trúc Appium 2: W3C WebDriver và UiAutomator2

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

Server trên thiết bị là hai gói `io.appium.uiautomator2.server` và `io.appium.uiautomator2.server.test`. Driver cài và khởi động chúng bằng instrumentation; `adb forward` nối cổng máy host tới HTTP server đó. `findElement` và `click` hỏi cây accessibility tại đúng thời điểm lệnh tới. Chúng không thấy JS thread hay bridge của Expo còn bận — đó là lý do phải explicit wait (A4.1) và là điểm khác Detox (A1.4).

Trên APK EShop của nhóm, `testID` của React Native xuất hiện thành `resource-id`. Locator vì vậy dùng `UiSelector().resourceId` (`src/appium/config/locators.js`). Session trong `src/appium/config/session.js` khai đúng hợp đồng Appium 2: `platformName` trần, các khoá còn lại có tiền tố `appium:`, `automationName` là `UiAutomator2`, `app` trỏ APK debug, `appPackage` là `com.eshop.sut`, `noReset` là `false`.

| | |
|--|--|
| **Điểm mạnh** | Một client WebDriver cho nhiều nền; chạy emulator, máy thật và device farm; chỉ cần APK |
| **Điểm yếu** | Đường đi dài, mỗi lệnh là một ảnh của cây UI. Session, capability, locator và chờ có điều kiện là phần bắt buộc của script |

### A1.3 Locator: yếu tố quyết định độ bền script

| Cách định vị | Đánh giá |
|--------------|----------|
| `testID` / accessibility label | Ổn định, khuyến nghị cho automation |
| XPath dài theo hierarchy | Dễ hỏng khi UI đổi cấu trúc |
| Text hiển thị | Phụ thuộc ngôn ngữ / copy; dễ false fail |

**Quy tắc thực hành:** ưu tiên `testID` (trên APK EShop là `resource-id`) và accessibility; coi XPath dài là tín hiệu nợ kỹ thuật. Locator yếu là một nguồn flaky riêng, vì cây UI đổi nhẹ làm cùng một XPath lúc thấy lúc không (A4.1).

### A1.4 Ma trận chọn Appium / Espresso / Detox

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

---

## A2. Kiểm thử chức năng (Functional Testing)

### A2.1 Khái niệm

Kiểm thử chức năng xác minh **hệ thống làm đúng việc nghiệp vụ**: người dùng thao tác → hệ thống phản hồi đúng dữ liệu và trạng thái. Trên mobile automation, điều này thể hiện bằng chuỗi hành động + assertion xác định (không phải “ảnh giống baseline”).

### A2.2 Kịch bản chuẩn trên EShop

1. **Đăng nhập** — tài khoản hợp lệ vào được; tài khoản sai bị từ chối (nếu mở rộng).  
2. **Tìm sản phẩm** — nhập từ khóa, danh sách cập nhật.  
3. **Xác minh kết quả** — tên, giá, trạng thái hiển thị khớp dữ liệu kỳ vọng.  
4. *(Sang lớp visual)* checkpoint giao diện — xem **A3**.

Assertion chức năng trả lời: *“Người dùng có hoàn thành được việc và thấy đúng dữ liệu không?”*

### A2.3 Functional assertion vs Visual checkpoint

| Tiêu chí | Functional assertion | Visual checkpoint |
|----------|----------------------|-------------------|
| Đối tượng | Hành vi + dữ liệu | Bố cục, màu, khoảng cách, ảnh, chữ đang hiển thị |
| Oracle | Giá trị / trạng thái mong đợi trong code | Baseline ảnh + cách so khớp đã chọn |
| UI đổi màu hoặc khoảng cách, dữ liệu giữ nguyên | Thường vẫn pass | Thường fail ở match level Strict |
| Giá hiển thị sai | Fail nếu assertion đọc đúng text | Fail ở Strict hoặc Content vì chữ đổi. Có thể pass nếu vùng giá bị ignore, match level là Layout (bỏ qua nội dung), hoặc lỗi không được vẽ lên màn hình |

**Kết luận:** Visual testing bắt thay đổi *nhìn thấy được*. Nó không biết một thay đổi là lỗi nghiệp vụ hay bản thiết kế đã duyệt, và không bắt lỗi không xuất hiện trên ảnh (sai quyền, sai tổng tiền chưa render, tác dụng phụ phía server). Vì vậy nó không thay assertion về giá, tổng tiền, quyền truy cập hay thông báo lỗi.

### A2.4 Lớp an toàn (safety net)

Khi dùng AI visual, vẫn giữ một tập nhỏ assertion chức năng:

- Đăng nhập thành công / thất bại đúng kỳ vọng.  
- Sản phẩm tìm thấy có đúng tên / giá.  
- CTA và thông báo lỗi không bị “ignore” khỏi kiểm soát.

Locator ổn định + assertion chức năng = lớp an toàn khi visual tool báo nhiễu hoặc ignore region quá rộng.

---

## A3. Visual Testing và kiểm thử hồi quy giao diện

### A3.1 Visual testing là gì?

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

Nhiễu đặc thù trên mobile: mật độ màn hình, font, thanh trạng thái (giờ, pin), animation chưa kết thúc, ảnh banner xoay, và khác biệt render giữa máy thật với emulator. Vì vậy baseline nên gắn với một cấu hình thiết bị cố định; EShop dùng AVD `eshop_api34`, 1080×2400.

### A3.2 Thuật ngữ then chốt

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Baseline** | Ảnh / trạng thái UI được chấp nhận làm chuẩn |
| **Checkpoint** | Điểm trong test chụp và so với baseline |
| **Visual diff** | Khác biệt giữa lần chạy hiện tại và baseline |
| **Ignore region** | Vùng cố ý bỏ qua (banner xoay ảnh, đồng hồ, ads…) |
| **True positive** | Diff phản ánh lỗi giao diện thật |
| **False positive** | Diff do nhiễu / thay đổi không quan trọng |
| **Intentional update** | Đổi UI có chủ đích → cập nhật baseline có phê duyệt |

### A3.3 Phân loại kết quả visual diff (trọng tâm hoạt động lớp)

1. **Lỗi thật** — bố cục vỡ, màu/token sai, CTA biến mất, giá/label lệch vị trí nghiêm trọng.  
2. **False positive / nhiễu** — ảnh carousel đổi, anti-alias, nội dung động không ảnh hưởng nghiệp vụ.  
3. **Thay đổi có chủ đích** — redesign đã được chấp thuận → cập nhật baseline theo quy trình.

### A3.4 Chính sách ignore region

| Được cân nhắc ignore | Không được ignore |
|----------------------|-------------------|
| Banner ảnh động (giữ bố cục) | Giá, tổng tiền |
| Timestamp / avatar ngẫu nhiên (nếu ngoài scope) | CTA chính (Mua, Đăng nhập…) |
| Vùng marketing xoay nội dung đã thống nhất | Thông báo lỗi, trạng thái form |

Ignore quá rộng → che regression. Ignore quá hẹp → triage mệt, mất niềm tin vào tool.

### A3.5 Minh họa trên EShop

- **Đổi ảnh động, giữ bố cục** → dễ false positive; ignore region hoặc match level Layout trên đúng vùng banner có thể chấp nhận.  
- **Đổi màu / bố cục ngoài yêu cầu** → regression visual ở match level Strict dù functional test vẫn pass.

### A3.6 Hai hướng AI trong kiểm thử GUI: Applitools và Maestro

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

Trên EShop: banner xoay ảnh nên là **vùng** Layout hoặc ignore, không phải cả màn hình. Giá, nút Đăng nhập và thông báo lỗi giữ Strict. Đổi colour token ngoài yêu cầu là true positive ở Strict; đổi ảnh banner mà giữ khung là nhiễu nếu cả màn hình để Strict và không có chính sách vùng.

**Maestro có hai lớp, đừng trộn:**

- `assertVisible` / `assertNotVisible`: oracle xác định, đọc cây UI.
- `assertScreenshot`: so ảnh với file cục bộ — visual testing cổ điển, không phải AI.
- `assertWithAI` và `assertNoDefectsWithAI`: LLM, đang thí nghiệm. `assertNoDefectsWithAI` là smoke test defect nhìn thấy (cắt chữ, chồng, lệch khung), không thay checkpoint có baseline.
- `maestro test --analyze`: báo cáo sau lượt chạy (hồi quy UI, chính tả, vỡ layout), không phải assertion trong flow.

Maestro là lớp dự phòng khi trial Eyes không phủ S3–S6, và chỉ sau khi giảng viên chấp thuận. Khi dùng, demo phải nói rõ: AI flag được lệch *nhìn thấy*, không có dashboard baseline, ignore region hay pha duyệt chuẩn như Eyes. Assertion giá và quyền vẫn là lệnh xác định.

---

## A4. Độ tin cậy và bảo trì kiểm thử (Test Reliability & Maintenance)

### A4.1 Flaky test và cách xử lý

Một test **flaky** khi cùng mã SUT, cùng mã test và cùng môi trường chủ định, lần chạy này pass và lần khác fail. Lỗi tái lập mọi lần là defect. Phiên không tạo được vì emulator tắt hoặc Appium chưa sẵn sàng là môi trường hỏng. Hai trường hợp đó cần sửa khác với flake.

Appium dễ flaky vì mỗi lệnh là một ảnh của cây accessibility (A1.2). Giữa hai HTTP request, app có thể còn animation, còn chờ API, hoặc chưa commit layout. Espresso và Detox chờ đến khi app idle; Appium không tự biết điều đó.

| Nguồn | Biểu hiện | Cách xử lý |
|-------|-----------|------------|
| Thời điểm | `element not found`, lần chạy sau thì pass | Explicit wait trên một điều kiện: phần tử của màn đích đã hiện (`waitForDisplayed` với timeout). Sleep cố định hoặc quá ngắn nên vẫn flake, hoặc kéo dài cả những lần đã pass |
| Implicit wait toàn cục | Mọi `findElement` đều chờ hết hạn | Che triệu chứng. Script không nêu điều kiện nào cho phép đi tiếp |
| Chuyển màn / animation | Assert dính màn cũ | Chờ phần tử chỉ có trên màn mới, không chờ một khoảng thời gian |
| Mạng và API | Spinner, danh sách lúc rỗng lúc có | Chờ dữ liệu xuất hiện; seed backend ổn định trước phiên |
| Trạng thái máy | Bàn phím, quyền, thông báo | Đưa máy về trạng thái đã biết trước khi thao tác |
| Vòng đời app | App không ở foreground sau cold start | Mở lại app, rồi chờ màn hình mốc |
| Dữ liệu dính phiên trước | Kết quả phụ thuộc thứ tự test | Reset khi mở và đóng session; mỗi test một session |
| Locator yếu | Cùng XPath lúc khớp lúc không | `testID` / `resource-id` (A1.3) |
| Retry | Báo cáo xanh hơn | Nguyên nhân còn nguyên. Chỉ thêm retry sau khi wait và reset đã có, và phải ghi số lần retry |

`noReset: false` (mặc định, và là giá trị session EShop) bảo driver chạy reset thông thường lúc mở và đóng phiên, nên dữ liệu app của phiên trước không còn. `fullReset: true` gỡ rồi cài lại APK — nặng hơn, dùng khi chính bản cài đặt phải sạch.

Hai flake đã gặp trên EShop, và cách bộ test đang xử lý:

- Bàn phím ảo còn mở che phần dưới màn hình. UiAutomator2 không trả về phần tử bị che, nên click báo không tìm thấy dù nút vẫn trong app. Helper đóng bàn phím nếu nó đang hiện, rồi mới tìm ô tìm kiếm.
- APK debug có thể không lên foreground sau cold start. Bộ test gọi `terminateApp` rồi `activateApp`, sau đó chờ liên kết đăng nhập tối đa 30 giây. Điều kiện chờ là phần tử màn Home, không phải một `sleep`.

Khi một fail không tái lập, tăng timeout không phải bước đầu. Chạy lại cùng test nhiều lần và lấy page source tại lần `findElement` thất bại (`appium:printPageSourceOnFindFailure`) để phân biệt locator sai, màn hình sai, và chờ chưa đủ.

### A4.2 Chi phí bảo trì khi UI thay đổi

| Loại thay đổi UI | Functional (Appium) | Visual AI (Eyes) |
|------------------|---------------------|------------------|
| Banner đổi ảnh, layout giữ nguyên | Ít ảnh hưởng nếu không assert ảnh | Có thể fail → triage / ignore region |
| Đổi màu / spacing / typography | Thường vẫn pass | Thường fail → phát hiện regression |
| Đổi hierarchy / bỏ `testID` | Script gãy | Checkpoint vẫn có thể bắt lệch layout |

Learning objective T03: **đo và giải thích** chi phí bảo trì khi home banner đổi ảnh so với đổi colour token.

### A4.3 Ghép cặp hai lớp kiểm thử

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

### A4.4 Failure modes (khung lý thuyết — chi tiết worksheet thuộc TV2)

1. **Locator / đồng bộ** — không tìm thấy element; timeout do animation hoặc mạng.  
2. **Visual nhiễu** — Eyes báo fail vì nội dung động; ignore region che mất lỗi thật.  
3. **Oracle lệch** — functional pass + visual fail (hoặc ngược lại); cần quy trình triage rõ.

### A4.5 Ai được cập nhật baseline?

Cập nhật baseline là **quyết định chấp nhận UI mới**, không phải thao tác kỹ thuật thuần:

- Điều kiện: thay đổi đã được product/design xác nhận.  
- Người phê duyệt: chỉ định trước (tech lead / QA owner / giảng viên).  
- Ghi nhận: lý do cập nhật, ảnh hưởng ignore region, liên kết ticket nếu có.

---

# Phần B — Ba khối nền tảng automation

Theo yêu cầu seminar FIT@HCMUS, mỗi công cụ thường thể hiện ba khối: **Record & Playback**, **Data-driven**, **Checkpoints**. Map sang stack T03 như sau.

| Khối | Ý nghĩa | Appium | Applitools Eyes | Maestro |
|------|---------|--------|-----------------|---------|
| **Record & Playback** | Ghi thao tác rồi chạy lại | Inspector (plugin web) ghi bước để khám phá locator. Code Recorder là bản nháp; test chính thức là Page Object trong `src/appium/` | Không ghi gesture; “playback” là chạy lại checkpoint trên baseline | Maestro Studio ghi flow YAML |
| **Data-driven** | Cùng kịch bản, nhiều bộ dữ liệu | Ba bảng trong `src/appium/data/cases.js`: đăng nhập (sai rồi đúng), tìm kiếm (1, 2, 0 kết quả), giỏ hàng (đơn giá × số lần thêm) | Baseline theo môi trường/viewport; batch nhiều màn | Biến env / parameters trong flow |
| **Checkpoints** | Điểm xác minh kết quả | Assert thông báo lỗi, tên người dùng, số kết quả, tên sản phẩm, thành tiền và tổng giỏ | Visual checkpoint (`Eyes.check`) so baseline | `assertVisible` / `assertWithAI` |

**Nguyên tắc T03:** video demo Appium thể hiện đủ ba khối — Inspector và Recorder (record), ba bảng A2 (data-driven), assertion nghiệp vụ trong kết quả TAP (checkpoint). Eyes thêm visual checkpoint. Maestro không nằm trong video hay phần live.

---

# Phần C — Lý thuyết theo từng công cụ

---

## C1. Appium 2 + UiAutomator2 *(công cụ truyền thống)*

### C1.1 Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Appium |
|----------------|--------------------|
| **Mobile Test Automation** | Lớp điều khiển ngoài tiến trình (out-of-process) theo WebDriver |
| **Functional Testing** | Tap, type, swipe + assertion dữ liệu/trạng thái |
| **Black-box UI automation** | Nhìn app qua accessibility tree; chỉ cần APK + locator |
| **Test Reliability** | Flaky từ chờ, locator yếu, session/capability, trạng thái thiết bị |
| **Record / Data / Checkpoint** | Inspector (bản nháp); ba bảng đăng nhập, tìm kiếm, giỏ hàng; assert nghiệp vụ |

Appium **không** làm Visual AI; cung cấp hành động xác định và kết quả từ UI hierarchy.

### C1.2 Thuật ngữ

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

### C1.3 Chức năng chính

1. Khởi tạo session với emulator / thiết bị thật.  
2. Cài / mở APK EShop theo capability.  
3. Tìm và thao tác element: tap, nhập text, swipe, back…  
4. Đọc trạng thái UI: text, attribute, hiển thị/ẩn.  
5. Assertion chức năng: đăng nhập theo bảng, số kết quả và tên sản phẩm, thành tiền và tổng giỏ hàng.  
6. Debug: Inspector, page source, screenshot cơ bản.  
7. Tích hợp CI / device farm qua WebDriver.

**Vai trò demo T03:** bộ data-driven **đăng nhập (sai rồi đúng) → tìm kiếm (1, 2, 0 kết quả) → thêm giỏ và kiểm tra tổng tiền**.

### C1.4 Nguyên lý hoạt động

Sơ đồ năm tầng và hợp đồng capability nằm ở **A1.2**. Tóm tắt vòng đời:

1. Script tạo session (`platformName=Android`, `appium:automationName=UiAutomator2`, đường dẫn APK).  
2. Server chọn driver UiAutomator2. Driver cài hai APK server lên thiết bị, chạy instrumentation, `adb forward`.  
3. `findElement` / `click` / `setValue` đọc và ghi cây accessibility tại thời điểm lệnh tới.  
4. Kết quả trả về script để assertion.  
5. Đóng session: driver reset theo `noReset`, rồi giải phóng thiết bị.

**Hệ quả:** chậm hơn Espresso/Detox một chút, nhưng độc lập ngôn ngữ app và chạy được trên thiết bị thật hoặc farm. Vì không thấy app đang idle, script phải chờ có điều kiện (A4.1).

### C1.5 Ba kịch bản demo

Ba mức này nằm trong video 5–8 phút. Phần live không chạy lại Inspector; chi tiết ở D3. Phạm vi đã kiểm chứng là Linux, AVD `eshop_api34`.

#### Demo 1 — Cài đặt & kiểm chứng môi trường

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Chứng minh Appium 2 + UiAutomator2 đã sẵn sàng |
| Việc làm | Trình bày các bước cài trong [A1](docs/A1_Setup.md) và gọi Appium `/status` |
| Kết quả kỳ vọng | `/status` báo `ready: true`. Nói rõ log A1 đã kiểm chứng trên Linux |
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
| Kết quả kỳ vọng | L1 còn màn Login, `login-error` chứa "Đăng nhập thất bại". L2 hiện "Chào, Test User". Tìm kiếm đúng số kết quả và tên; 0 kết quả là ca pass khi không còn dòng đếm. Giỏ: thành tiền và tổng = 60.000.000, rồi giỏ trống. TAP: 3 test / 8 kiểm tra, pass 10/10 lượt ([A3](docs/A3_Metrics.md)) |
| Ràng buộc dữ liệu | Backend cộng 2 vào `login_attempts` mỗi lần sai và khoá 3 phút khi ≥ 3, nên hai lần sai liên tiếp sẽ khoá tài khoản. Mỗi lượt chỉ sai một lần (L1) rồi đăng nhập đúng (L2). Video nêu failure mode này khi có bằng chứng, và chỉ trích số liệu A3 của đúng phiên bản đã đo |
| Case study | Lớp functional của seminar, là safety net trước checkpoint Eyes |

### C1.6 Điểm yếu / giới hạn

| Trường hợp | Vì sao Appium không giải quyết tốt |
|------------|-------------------------------------|
| Cần sync sâu với JS bridge RN trong CI | Detox thường ổn định hơn, ít tự viết wait |
| Kiểm tra “nhìn giống thiết kế” | Không có Visual AI; screenshot thô dễ nhiễu |
| Locator phụ thuộc XPath/text | Script dễ gãy khi UI/copy đổi |
| Môi trường phức tạp | Cài SDK + driver + capability tốn thời gian; sai cấu hình → session fail |
| Flaky do timing/mạng | Ngoài tiến trình, mỗi lệnh là một ảnh cây UI. Wait và reset theo A4.1; Appium không tự hết flaky |

---

## C2. Applitools Eyes *(công cụ AI-augmented)*

### C2.1 Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Eyes |
|----------------|------------------|
| **Visual Regression Testing** | So UI hiện tại với baseline đã chấp nhận |
| **Visual AI / perceptual diff** | Nhận biết bố cục/nội dung; giảm nhiễu pixel |
| **Test oracle** | Baseline + triage người (accept / reject / ignore) |
| **Functional vs Visual** | Bổ sung lớp “nhìn thấy”; không thay assert giá/quyền |
| **Maintenance & policy** | Ignore region và baseline update phải có quy tắc |
| **Checkpoints (FIT)** | Visual checkpoint là dạng checkpoint nâng cao |

### C2.2 Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Eyes SDK** | Thư viện gắn vào test Appium/Selenium… |
| **Eyes.open / check / close** | Mở phiên → checkpoint → đóng & gửi kết quả |
| **Checkpoint** | Điểm so sánh visual (cửa sổ hoặc vùng) |
| **Baseline** | Tập ảnh chuẩn đã phê duyệt |
| **Batch / Test result** | Nhóm kết quả một lần chạy trên dashboard |
| **Visual diff** | Vùng khác biệt so với baseline |
| **Match level** | Cách Eyes so checkpoint với baseline: Strict, Layout, Ignore colors, Content, Dynamic, Exact. Chi tiết ở A3.6 |
| **Ignore region** | Vùng loại khỏi so sánh |
| **Floating region** | Cho phép dịch chuyển trong biên độ |
| **True / false positive** | Lỗi thật vs nhiễu |
| **Baseline update** | Chấp nhận UI mới làm chuẩn |
| **Ultrafast Grid** | Nhiều cấu hình cloud (ngoài scope tối thiểu) |

### C2.3 Chức năng chính

1. Gắn vào cùng luồng Appium sau functional steps.  
2. Chụp/so sánh trang chủ / danh sách sản phẩm với baseline.  
3. Phát hiện lệch bố cục, màu, khoảng cách, nội dung.  
4. Giảm nhiễu so với pixel-diff thuần.  
5. Ignore region theo chính sách (banner động…).  
6. Dashboard triage: accept baseline hoặc mở defect.  
7. Minh họa trade-off: đổi ảnh banner vs đổi colour token.

**Vai trò demo T03:** functional **pass** nhưng visual có thể **fail** (và ngược lại với false positive).

### C2.4 Nguyên lý hoạt động

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

### C2.5 Ba kịch bản demo

Hai công cụ trong video và phần live là Appium và Eyes. Cả ba mức Eyes chỉ được trình bày khi TV2 đã chạy thật (B1/B2). Chưa có lệnh, kết quả hoặc ảnh thì để trống đoạn đó; không dựng ảnh thay cho lần chạy.

#### Demo 1 — Cài đặt SDK và cấu hình

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Cho thấy Eyes gắn được vào stack Appium của nhóm |
| Việc làm | Trình bày lệnh cài SDK, API key (biến môi trường, không commit) và cấu hình thật của TV2, kèm kết quả lệnh đã chạy |
| Kết quả kỳ vọng | Cấu hình và output trùng với những gì TV2 đã ghi |
| Trạng thái | Chờ TV2 làm B1/B2 |

#### Demo 2 — Chức năng cơ bản (một checkpoint)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Một visual checkpoint so với baseline đã duyệt |
| Việc làm | Chạy checkpoint đó và giải thích kết quả trên dashboard: khớp baseline, hoặc diff cần triage |
| Kết quả kỳ vọng | Baseline đã có người duyệt. Lần chạy này được giải thích từ kết quả thật, không từ ảnh dựng |
| Khối FIT | Checkpoint (visual) |
| Trạng thái | Chờ TV2 làm B1/B2 |

#### Demo 3 — Luồng phức tạp (hai bản UI có kiểm soát)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Phân biệt khác biệt ảnh có chủ đích với regression giao diện thật |
| Việc làm | Chạy cùng luồng trên bản đổi ảnh banner (giữ layout) và bản đổi màu hoặc bố cục. Video chiếu cả hai bản. Phần live chỉ chiếu một bản biến thể đã kiểm chứng, cạnh kết quả Appium |
| Kết quả kỳ vọng | Đổi ảnh banner, layout giữ nguyên: ứng viên ignore region. Đổi màu hoặc bố cục ngoài yêu cầu: true positive dù assertion Appium vẫn pass. Ghi quyết định triage |
| Case study | Learning objective “banner images vs colour tokens”. Hai bản này cũng là đầu vào cho hoạt động phân loại diff của lớp |
| Trạng thái | Chờ TV2 làm B1/B2. Live chưa đủ điều kiện trình bày là hoàn chỉnh khi tích hợp Eyes hoặc bản UI biến thể chưa sẵn sàng |

### C2.6 Điểm yếu / giới hạn

| Trường hợp | Vì sao Eyes không giải quyết tốt |
|------------|----------------------------------|
| Sai giá / sai quyền / sai thông báo lỗi | Visual có thể vẫn “đẹp” → **không thay** functional assert |
| Banner/ads/animation liên tục | Nhiều false positive nếu thiếu chính sách ignore |
| Ignore region quá rộng | Che regression thật (failure mode nguy hiểm) |
| Trial / chi phí bản quyền | Hết trial hoặc hết quota → demo đứt (cần Maestro dự phòng) |
| Phụ thuộc mạng cloud | Không offline đầy đủ; dashboard cần kết nối |
| “Accept all” baseline bừa | Làm mất giá trị oracle — cần người phê duyệt |

---

## C3. Maestro CLI + AI assertions *(công cụ dự phòng)*

> Dùng khi trial Applitools không khả dụng cho S3–S6 (**sau khi giảng viên chấp thuận**). [Demo_Scenario.md](Demo_Scenario.md) không đưa Maestro vào video hay phần live.

### C3.1 Lý thuyết liên quan

| Mảng lý thuyết | Liên hệ với Maestro |
|----------------|---------------------|
| **Mobile UI automation** | Flow YAML, DX đơn giản |
| **Synchronization** | Tự chờ UI → giảm flaky so với `sleep` |
| **AI-augmented assertion** | `assertWithAI` / `assertNoDefectsWithAI` |
| **Functional + light visual/AI** | Vẫn có assert text; AI bổ sung, không phải Eyes đầy đủ |
| **Record / Data / Checkpoint** | Studio ghi flow; biến dữ liệu; assertVisible / AI |

### C3.2 Thuật ngữ

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

### C3.3 Chức năng chính

1. Viết/chạy flow YAML trên Android.  
2. Launch app, login → search tương tự Appium.  
3. Assertion xác định: text/visible.  
4. AI assertions khi không dùng Eyes.  
5. Tự động chờ → flow ngắn, ít flaky hơn script tự viết wait.  
6. Demo dự phòng: vẫn minh họa “functional + AI nhìn UI”.

### C3.4 Nguyên lý hoạt động

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

### C3.5 Ba kịch bản demo

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

### C3.6 Điểm yếu / giới hạn

| Trường hợp | Vì sao Maestro AI không thay Eyes tốt |
|------------|----------------------------------------|
| Cần quy trình baseline / ignore region / triage chuẩn | `assertWithAI` không có dashboard baseline như Applitools (A3.6) |
| Assertion nghiệp vụ chính xác (giá, quyền) | LLM có thể ảo giác hoặc bỏ sót → vẫn cần `assertVisible` |
| Ổn định lâu dài / audit | Cùng một ảnh có thể cho kết quả khác; Maestro đặt AI command là optional mặc định vì lý do này |
| Phạm vi T03 chính thức | Chỉ **dự phòng** sau khi GV chấp thuận; không phải pick mặc định |
| Device farm phức tạp | Appium + farm thường linh hoạt hơn cho mở rộng sau demo |

---

## C4. Bản đồ công cụ ↔ lớp kiểm thử

| Lớp | Công cụ chính | Oracle | Câu hỏi trả lời |
|-----|---------------|--------|-----------------|
| Functional | Appium + UiAutomator2 | Giá trị/trạng thái trong script | User làm được việc và thấy đúng dữ liệu? |
| Visual AI | Applitools Eyes | Baseline + Visual AI + triage người | UI có regress so với chuẩn đã duyệt? |
| Functional + AI assert (backup) | Maestro | Text/visible + phán đoán AI | Flow chạy được và AI thấy defect/mô tả đúng? |
| Policy / Reliability | Quy trình nhóm | Quy tắc ignore + phê duyệt | Có tin được kết quả qua nhiều lần chạy? |

**Quy tắc ghép cặp (Seminar Guide):** live demo phải dùng ít nhất một tính năng **truyền thống** và một tính năng **AI-augmented**.

---

# Phần D — Tóm tắt & liên hệ seminar

## D1. Tóm tắt bốn mảng + ba công cụ

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

## D2. Gợi ý đọc thêm (brief T03)

1. Hans-Joachim Görg — *Practical Appium* (Chs. 1–4).  
2. Ma trận A1.4 đối chiếu [Espresso](https://developer.android.com/training/testing/espresso), [Detox — design principles](https://wix.github.io/Detox/docs/next/articles/design-principles/) và [Detox — how it works](https://github.com/wix/Detox/blob/master/docs/articles/how-detox-works.md).  
3. Applitools — *Visual AI 101* whitepaper; match level: [Match Levels and Regions](https://applitools.com/docs/eyes/concepts/best-practices/match-levels).  
4. Appium 2: [kiến trúc UiAutomator2](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/architecture.md) · [capability và tiền tố `appium:`](https://appium.io/docs/en/2.19/guides/caps/) · [Appium](https://appium.io/) · [UiAutomator2](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/).  
5. [Applitools Mobile](https://applitools.com/solutions/mobile-testing/) · [Maestro React Native](https://docs.maestro.dev/get-started/supported-platform/react-native) · [assertWithAI](https://docs.maestro.dev/reference/commands-available/assertwithai) · [assertNoDefectsWithAI](https://docs.maestro.dev/reference/commands-available/assertnodefectswithai).

## D3. Map sang buổi seminar 45 phút

Ba mức của từng công cụ nằm trong một video 5–8 phút (`Demo_Screencast.mp4`) đã chia sẻ trước, không phải sáu lần chạy live. Đề cương video: cài đặt A1 và `/status` (0:35–1:15), Inspector trên màn Login rồi Quit Session (1:15–2:05), `npm test` bộ A2 (2:05–3:25), một failure mode đã quan sát và số liệu A3 đúng phiên bản (3:25–4:00), cài Eyes và một checkpoint (4:00–4:40), cả hai bản UI biến thể (4:40–6:30). Đoạn Eyes để trống cho tới khi B1/B2 có kết quả thật.

Phần live 10 phút không dùng slide. Backend, Metro, emulator và Appium được bật trước. Không mở Inspector trong lúc này.

| Thời gian | Nội dung | Mục lý thuyết |
|-----------|----------|---------------|
| 0–10 phút | Pitch: khó khăn mobile, kiến trúc Appium, Visual AI, lý do chọn tool | A1–A3, C1–C2, A1.4 |
| 10–20 phút | Live: chạy bộ Appium đã kiểm chứng, rồi một checkpoint Eyes trên một bản UI biến thể. Cả hai bản biến thể nằm ở video | C1.5 Demo 3, C2.5 Demo 2–3, A4.3 |
| 20–40 phút | Hoạt động phân loại 10 diff; quy tắc ignore/baseline | A3.3–A3.4, A4 |
| 40–45 phút | Tổng kết, Q&A | A2.3, A4.3 |
| Ngoài kịch bản demo | Maestro AI chỉ khi hết trial Applitools và giảng viên chấp thuận | C3 |

## D4. Ranh giới phân công (tham chiếu)

| Thành viên | Phần lý thuyết này dùng thế nào |
|------------|----------------------------------|
| **TV3** | Sở hữu Phần A–D; kiểm chứng cài đặt (log theo Demo 1); báo cáo / User Guide / slide mở đầu |
| **TV1** | Thực thi demo Appium (+ Detox PoC); lấy khung C1.5 làm checklist |
| **TV2** | Thực thi Eyes (B1/B2); 10 diff cards, worksheet, Failure Modes chi tiết; khung A4.4 + C2.5. Chưa có lần chạy thì không đưa kết quả Eyes vào video hay live |

---

*Tài liệu lý thuyết nội bộ nhóm T03 — biên soạn từ Seminar Guide, T03 brief, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal, Seminar Scenario Draft và Demo_Scenario.md.*
