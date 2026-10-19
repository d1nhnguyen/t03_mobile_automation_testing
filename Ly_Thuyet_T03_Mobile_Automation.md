# Lý thuyết T03 — Mobile Automation Testing

Tài liệu lý thuyết cho seminar **T03 Mobile Automation Testing** (CS423 / CSC15003), dựa trên brief T03, Seminar Guide, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal và Seminar Scenario Draft.

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

### A1.1 Vì sao mobile khó hơn web?

| Yếu tố | Hệ quả với kiểm thử |
|--------|---------------------|
| Phân mảnh OS / thiết bị | Cùng kịch bản có thể pass trên AVD này, fail trên thiết bị khác |
| Cảm biến, quyền, trạng thái máy | GPS, camera, pin, thông báo xen ngang làm test không ổn định |
| Mạng và độ trễ | Timeout, spinner kéo dài, race condition |
| Vùng chạm nhỏ, gesture | Tap lệch, swipe, long-press khó tái lập hơn click trên web |

EShop có client React Native Expo (Android + iOS) nên phù hợp để học automation đa nền tảng và so sánh công cụ.

### A1.2 Kiến trúc Appium 2

Appium là lớp điều khiển theo giao thức **WebDriver**:

1. **Test client** (script Node.js / Java / Python…) gửi lệnh WebDriver.  
2. **Appium Server** nhận lệnh, chọn driver phù hợp.  
3. **UiAutomator2** (Android) thao tác trên emulator hoặc thiết bị thật.  
4. **Ứng dụng SUT** (APK EShop) phản hồi; kết quả trả về client để assert.

| | |
|--|--|
| **Điểm mạnh** | Đa nền tảng, cộng đồng lớn, chạy được trên emulator, thiết bị thật và device farm |
| **Điểm yếu** | Đường đi dài hơn in-process framework → cần hiểu session, capability, locator và đồng bộ chờ |

### A1.3 Locator: yếu tố quyết định độ bền script

| Cách định vị | Đánh giá |
|--------------|----------|
| `testID` / accessibility label | Ổn định, khuyến nghị cho automation |
| XPath dài theo hierarchy | Dễ hỏng khi UI đổi cấu trúc |
| Text hiển thị | Phụ thuộc ngôn ngữ / copy; dễ false fail |

**Quy tắc thực hành:** ưu tiên `testID` và accessibility; coi XPath dài là tín hiệu nợ kỹ thuật.

### A1.4 So sánh hướng truyền thống & khi nào chọn Detox

| Công cụ | Đặc điểm | Phù hợp khi… |
|---------|----------|--------------|
| **Appium 2** | Cross-platform, WebDriver, device farm | Cần đa nền / thiết bị thật / cùng stack với Selenium |
| **Espresso** | In-process Android, nhanh, deterministic | Chỉ Android, team native, ưu tiên tốc độ |
| **Detox** | Gắn RN/Expo, đồng bộ tốt trong CI | DX React Native trong CI, ít phụ thuộc device thật |

#### Ma trận quyết định Detox vs Appium (learning objective T03)

| Tiêu chí | Nghiêng **Appium** | Nghiêng **Detox** |
|----------|--------------------|-------------------|
| Nền tảng | Android + iOS + device farm thống nhất | Chủ yếu RN/Expo trong CI |
| Ngôn ngữ / stack | Độc lập ngôn ngữ app (black-box APK) | JS/TS cùng codebase RN |
| Đồng bộ UI | Explicit wait do team tự thiết kế | Built-in sync với bridge RN |
| Thiết bị thật | Điểm mạnh | Không bắt buộc trong CI |
| Chi phí học | Cao hơn (server, driver, capability) | Thấp hơn với team RN |
| Scope T03 | **Công cụ chính** cho demo live | **PoC so sánh DX** (TV1), không thay Eyes |

**Kết luận cho nhóm T03:** chọn Appium làm lớp functional chính vì khớp device farm và gắn Eyes; Detox dùng để *báo cáo khác biệt DX*, không thay thế cặp Appium + Applitools.

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
| Đối tượng | Hành vi + dữ liệu | Bố cục, màu, khoảng cách, ảnh |
| Oracle | Giá trị / trạng thái mong đợi trong code | Baseline ảnh + mô hình Visual AI |
| Pass khi UI đổi màu nhẹ | Thường vẫn pass | Có thể fail |
| Pass khi giá sai nhưng UI “đẹp” | Fail | Có thể pass nếu layout không đổi rõ |

**Kết luận:** Visual AI **không** thay assertion nghiệp vụ về giá, tổng tiền, quyền truy cập hay thông báo lỗi.

### A2.4 Lớp an toàn (safety net)

Khi dùng AI visual, vẫn giữ một tập nhỏ assertion chức năng:

- Đăng nhập thành công / thất bại đúng kỳ vọng.  
- Sản phẩm tìm thấy có đúng tên / giá.  
- CTA và thông báo lỗi không bị “ignore” khỏi kiểm soát.

Locator ổn định + assertion chức năng = lớp an toàn khi visual tool báo nhiễu hoặc ignore region quá rộng.

---

## A3. Visual AI và kiểm thử hồi quy giao diện (Visual Regression Testing)

### A3.1 Vì sao cần Visual AI?

Functional test có thể **pass** trong khi UI đã regress (màu sai, chồng chữ, banner lệch, nút biến mất nhưng vẫn “tap được” vùng cũ). So sánh pixel thuần túy lại tạo quá nhiều false positive (font anti-alias, animation, ảnh động).

**Visual AI** (ví dụ Applitools Eyes) so sánh theo bố cục và nội dung có ngữ cảnh, giảm nhiễu kết xuất, hỗ trợ **ignore region** theo layout.

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

- **Đổi ảnh động, giữ bố cục** → dễ false positive; ignore region hợp lý có thể chấp nhận.  
- **Đổi màu / bố cục ngoài yêu cầu** → regression visual dù functional test vẫn pass.

---

## A4. Độ tin cậy và bảo trì kiểm thử (Test Reliability & Maintenance)

### A4.1 Flaky test trên mobile

Test *flaky*: lúc pass lúc fail dù mã SUT không đổi. Nguyên nhân thường gặp:

- Animation / chuyển scene chưa xong đã assert.  
- Mạng chậm hoặc API chưa sẵn sàng.  
- Trạng thái thiết bị (permission, bàn phím, thông báo).  
- Dữ liệu chưa reset / seed không đồng nhất.  
- Locator yếu (XPath) + hierarchy thay đổi nhẹ.

**Hướng xử lý:** explicit wait, reset dữ liệu, ổn định emulator, locator bền, tách test phụ thuộc trạng thái dùng chung.

### A4.2 Chi phí bảo trì khi UI thay đổi

| Loại thay đổi UI | Functional (Appium) | Visual AI (Eyes) |
|------------------|---------------------|------------------|
| Banner đổi ảnh, layout giữ nguyên | Ít ảnh hưởng nếu không assert ảnh | Có thể fail → triage / ignore region |
| Đổi màu / spacing / typography | Thường vẫn pass | Thường fail → phát hiện regression |
| Đổi hierarchy / bỏ `testID` | Script gãy | Checkpoint vẫn có thể bắt lệch layout |

Learning objective T03: **đo và giải thích** chi phí bảo trì khi home banner đổi ảnh so với đổi colour token.

### A4.3 Ghép cặp hai lớp kiểm thử

```
[Functional layer]  Appium: login → search → assert data
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
| **Record & Playback** | Ghi thao tác rồi chạy lại | Appium Inspector ghi bước → chuyển thành script | Không ghi gesture; “playback” là chạy lại checkpoint trên baseline | Maestro Studio ghi flow YAML |
| **Data-driven** | Cùng kịch bản, nhiều bộ dữ liệu | Parametrize user/password, từ khóa search, giá kỳ vọng | Baseline theo môi trường/viewport; batch nhiều màn | Biến env / parameters trong flow |
| **Checkpoints** | Điểm xác minh kết quả | Assert text, visibility, trạng thái element | Visual checkpoint (Eyes.check) so baseline | `assertVisible` / `assertWithAI` |

**Nguyên tắc T03:** demo phải thể hiện đủ ba khối ở mức tối thiểu — Inspector/Studio (record), dữ liệu login–search (data-driven), assert chức năng + visual/AI (checkpoints).

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
| **Record / Data / Checkpoint** | Inspector; data login–search; assert element |

Appium **không** làm Visual AI; cung cấp hành động xác định và kết quả từ UI hierarchy.

### C1.2 Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **WebDriver / W3C WebDriver** | Giao thức client ↔ server điều khiển app |
| **Appium Server** | Nhận lệnh WebDriver, điều phối driver |
| **Driver (UiAutomator2)** | Driver Android của Appium |
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
5. Assertion chức năng: đăng nhập, kết quả tìm kiếm, giá/tên.  
6. Debug: Inspector, page source, screenshot cơ bản.  
7. Tích hợp CI / device farm qua WebDriver.

**Vai trò demo T03:** luồng **đăng nhập → tìm sản phẩm → xác minh dữ liệu**.

### C1.4 Nguyên lý hoạt động

```
[Test script] --WebDriver commands--> [Appium Server]
                                            |
                                            v
                                    [UiAutomator2 Driver]
                                            |
                                            v
                              [Android UiAutomator2 / ADB]
                                            |
                                            v
                               [EShop APK trên Emulator]
```

1. Script tạo session (Android + UiAutomator2 + đường dẫn APK).  
2. Server chọn UiAutomator2 driver, cài instrumentation nếu cần.  
3. Lệnh `findElement` / `click` / `setValue` đi qua accessibility layer.  
4. Kết quả trả về script → assertion pass/fail.  
5. Kết thúc: xóa session, giải phóng thiết bị.

**Hệ quả:** chậm hơn Espresso/Detox một chút nhưng độc lập ngôn ngữ app và chạy được trên thiết bị thật/farm.

### C1.5 Ba kịch bản demo

#### Demo 1 — Cài đặt & kiểm chứng môi trường

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Chứng minh Appium 2 + UiAutomator2 chạy được trên AVD |
| Việc làm | Cài Node/JDK/Android SDK; `appium driver install uiautomator2`; khởi động AVD; tạo session mở APK EShop |
| Kết quả kỳ vọng | Session tạo thành công; app hiện trên emulator; log không lỗi driver |
| Liên hệ TV3 | **Kiểm chứng cài đặt** — ghi screenshot/command vào log nhóm |

#### Demo 2 — Chức năng cơ bản (Record & Playback + Checkpoint)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Record nhẹ bằng Inspector rồi playback bằng script |
| Việc làm | Dùng Inspector lấy locator `testID`; script: mở app → nhập user/password → tap Đăng nhập → assert màn hình sau login |
| Kết quả kỳ vọng | Đăng nhập hợp lệ pass; sai credential fail đúng kỳ vọng |
| Khối FIT | Record (Inspector) + Checkpoint (assert visibility/text) |

#### Demo 3 — Luồng phức tạp / case study EShop (Data-driven + Checkpoint)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Kịch bản nghiệp vụ đầy đủ trên SUT |
| Việc làm | Data-driven: nhiều cặp (user, keyword, expected product/price); luồng login → search → assert tên/giá; giữ assertion chức năng làm safety net trước khi gắn Eyes |
| Kết quả kỳ vọng | Bộ dữ liệu hợp lệ pass; dữ liệu sai/không tìm thấy fail rõ ràng |
| Case study | Đúng scope T03: functional layer của seminar |

### C1.6 Điểm yếu / giới hạn

| Trường hợp | Vì sao Appium không giải quyết tốt |
|------------|-------------------------------------|
| Cần sync sâu với JS bridge RN trong CI | Detox thường ổn định hơn, ít tự viết wait |
| Kiểm tra “nhìn giống thiết kế” | Không có Visual AI; screenshot thô dễ nhiễu |
| Locator phụ thuộc XPath/text | Script dễ gãy khi UI/copy đổi |
| Môi trường phức tạp | Cài SDK + driver + capability tốn thời gian; sai cấu hình → session fail |
| Flaky do timing/mạng | Out-of-process → cần kỷ luật wait/reset; không “tự hết flaky” |

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
| **Match level** | Độ nhạy (strict / layout / content…) |
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

#### Demo 1 — Cài đặt & baseline lần đầu

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Eyes SDK gắn Appium; tạo baseline hợp lệ |
| Việc làm | Cài SDK + API key (trial); `Eyes.open` → mở home EShop → `check` → `close`; duyệt baseline trên dashboard |
| Kết quả kỳ vọng | Batch hiện trên cloud; baseline được chấp nhận lần đầu |
| Liên hệ | Kiểm chứng trial còn hạn trước S3–S6 |

#### Demo 2 — Chức năng cơ bản (Checkpoint visual)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Checkpoint trên màn hình ổn định |
| Việc làm | Sau login (Appium), Eyes check trang chủ / danh sách; không đổi UI |
| Kết quả kỳ vọng | Lần chạy sau khớp baseline → pass |
| Khối FIT | Checkpoint (visual) |

#### Demo 3 — Luồng phức tạp / case study (hai thay đổi có kiểm soát)

| Bước | Nội dung |
|------|----------|
| Mục tiêu | Phân biệt false positive vs regression thật |
| Việc làm | (1) Đổi ảnh banner, giữ layout → có thể ignore region; (2) Đổi màu/token ngoài yêu cầu → true positive dù Appium vẫn pass |
| Kết quả kỳ vọng | Ma trận: functional pass/fail × visual pass/fail; tài liệu hóa triage |
| Case study | Đúng learning objective “banner images vs colour tokens” + hoạt động lớp |

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

> Dùng khi trial Applitools không khả dụng cho S3–S6 (**sau khi giảng viên chấp thuận**).

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
| **assertWithAI** | Assertion bằng mô tả ngôn ngữ tự nhiên |
| **assertNoDefectsWithAI** | AI rà defect giao diện rõ (thử nghiệm) |
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
4. Assert AI: gửi ngữ cảnh màn hình + prompt → pass/fail.  
5. Báo cáo CLI (và cloud nếu dùng).

### C3.5 Ba kịch bản demo

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
| Cần quy trình baseline / ignore region / triage chuẩn | AI assert không có dashboard baseline như Applitools |
| Assertion nghiệp vụ chính xác (giá, quyền) | AI có thể ảo giác hoặc bỏ sót → vẫn cần assert xác định |
| Ổn định lâu dài / audit | Kết quả AI ít tái lập và khó chứng minh hơn visual diff có baseline |
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
| 1 | Mobile Test Automation | Điều khiển app thế nào, locator nào bền? | Appium 2 (+ so sánh Detox) |
| 2 | Functional Testing | Hành vi và dữ liệu nghiệp vụ có đúng không? | Assertion Appium / Maestro |
| 3 | Visual AI / Visual Regression | UI người dùng nhìn thấy có regress không? | Applitools Eyes (Maestro AI dự phòng) |
| 4 | Reliability & Maintenance | Giảm flaky, triage diff, bảo trì lâu dài? | Ignore/baseline policy + failure modes |

| Công cụ | Vai trò | Lý thuyết gắn trực tiếp |
|---------|---------|-------------------------|
| Appium 2 + UiAutomator2 | Chính — functional | WebDriver, session, locator, functional assert |
| Applitools Eyes | Chính — AI visual | Baseline, checkpoint, ignore region, triage |
| Maestro + AI | Dự phòng | Flow YAML, auto-wait, AI assertion |
| Detox | PoC so sánh (TV1) | Khi nào chọn thay Appium cho RN CI |

## D2. Gợi ý đọc thêm (brief T03)

1. Hans-Joachim Görg — *Practical Appium* (Chs. 1–4).  
2. React Native testing docs — ma trận quyết định Detox vs Appium.  
3. Applitools — *Visual AI 101* whitepaper.  
4. Tài liệu chính thức: [Appium](https://appium.io/) · [UiAutomator2](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/) · [Applitools Mobile](https://applitools.com/solutions/mobile-testing/) · [Maestro React Native](https://docs.maestro.dev/get-started/supported-platform/react-native) · [Maestro AI](https://docs.maestro.dev/reference/commands-available/assertwithai).

## D3. Map sang buổi seminar 45 phút

| Thời gian | Nội dung | Mục lý thuyết |
|-----------|----------|---------------|
| 0–10 phút | Pitch: khó khăn mobile, kiến trúc Appium, Visual AI, lý do chọn tool | A1–A3, C1–C2, A1.4 |
| 10–20 phút | Live demo Appium + Eyes; hai thay đổi UI có kiểm soát | C1.5, C2.5, A3.5 |
| 20–40 phút | Hoạt động phân loại 10 diff; quy tắc ignore/baseline | A3.3–A3.4, A4 |
| 40–45 phút | Tổng kết, Q&A | A2.3, A4.3 |
| Dự phòng | Maestro AI nếu hết trial Applitools | C3 |

## D4. Ranh giới phân công (tham chiếu)

| Thành viên | Phần lý thuyết này dùng thế nào |
|------------|----------------------------------|
| **TV3** | Sở hữu Phần A–D; kiểm chứng cài đặt (log theo Demo 1); báo cáo / User Guide / slide mở đầu |
| **TV1** | Thực thi demo Appium (+ Detox PoC); lấy khung C1.5 làm checklist |
| **TV2** | Thực thi Eyes/Maestro, 10 diff cards, worksheet, Failure Modes chi tiết; khung A4.4 + C2.5 |

---

*Tài liệu lý thuyết nội bộ nhóm T03 — biên soạn từ Seminar Guide, T03 brief, yêu cầu seminar FIT@HCMUS, Tool Survey Proposal và Seminar Scenario Draft.*
