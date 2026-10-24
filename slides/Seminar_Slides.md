---
marp: true
size: 16:9
paginate: false
header: "2026 AI-first · Seminar T03 · Mobile Automation Testing"
footer: ""
style: |
  section { font-family: Arial, Helvetica, sans-serif; background: #ffffff; color: #222; font-size: 21px; line-height: 1.3; padding: 60px 48px 52px 48px; justify-content: flex-start !important; align-items: stretch; }
  section::before { content: ""; position: absolute; left: 0; top: 0; width: 100%; height: 10px; background: #1F4E79; }
  header { position: absolute; top: 18px; left: 48px; font-size: 13px; font-weight: bold; color: #1F4E79; }
  footer { position: absolute; left: 0; bottom: 0; width: 100%; height: 24px; line-height: 24px; background: #1F4E79; color: #fff; font-size: 12px; font-weight: bold; padding: 0 48px; box-sizing: border-box; }
  h1 { color: #1F4E79; font-size: 38px; margin: 0 0 14px 0; }
  section.red h1 { color: #C00000; }
  h2 { color: #1F4E79; font-size: 24px; margin: 10px 0 6px 0; }
  .band { background: #1F4E79; color: #fff; font-weight: bold; text-align: center; padding: 5px 10px; font-size: 19px; margin: 8px 0 6px 0; }
  .band.red { background: #C00000; } .band.green { background: #375623; } .band.light { background: #DCE6F2; color: #1F4E79; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  .w60 { grid-template-columns: 1.3fr 1fr; }
  table { border-collapse: collapse; width: 100%; font-size: 17px; margin: 6px 0; }
  th { background: #1F4E79; color: #fff; padding: 5px 9px; text-align: left; font-weight: bold; }
  td { padding: 4px 9px; border-bottom: 1px solid #e3e3e3; vertical-align: top; }
  tr:nth-child(even) td { background: #EEF3FA; }
  pre { font-size: 14px; background: #F4F6F9; border-left: 4px solid #1F4E79; padding: 8px 12px; line-height: 1.3; margin: 6px 0; }
  code { font-size: 0.9em; }
  ul, ol { margin: 4px 0; padding-left: 22px; } li { margin: 2px 0; }
  p { margin: 6px 0; }
  .small { font-size: 14px; color: #555; }
  .note { font-style: italic; color: #C00000; font-size: 15px; }
  section.title { padding: 0; display: grid; grid-template-columns: 34% 66%; }
  section.title::before { display: none; }
  .tl { background: #1F4E79; color: #fff; height: 100%; padding: 56px 32px; box-sizing: border-box; position: relative; }
  .tl .big { font-size: 110px; font-weight: 900; line-height: 1; margin-bottom: 18px; }
  .tl .sub { font-size: 22px; }
  .tl .foot { position: absolute; bottom: 28px; left: 32px; font-size: 13px; font-style: italic; }
  .tr { padding: 56px 44px; box-sizing: border-box; }
  .tr .dept { color: #2E74B5; font-style: italic; font-size: 14px; }
  .tr h1 { font-size: 36px; margin: 48px 0 70px 0; }
  .tr .tag { font-style: italic; font-size: 20px; margin-bottom: 48px; }
  .arch { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 10px; align-items: center; margin: 10px 0; font-size: 16px; }
  .arch .box { border: 2px solid #1F4E79; background: #EEF3FA; padding: 10px 12px; text-align: center; line-height: 1.3; }
  .arch .arrow { text-align: center; color: #1F4E79; font-size: 14px; font-weight: bold; white-space: nowrap; }
  .q { display: grid; grid-template-columns: 70px 1fr; gap: 8px; margin: 10px 0; align-items: stretch; }
  .q b { background: #1F4E79; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .q span { background: #F0F0F0; padding: 12px 16px; font-size: 19px; display: flex; align-items: center; }
  section.test pre { font-size: 16px; line-height: 1.26; color: #18212C; background: #F7F9FC; border-left: 4px solid #1F4E79; padding: 10px 14px; margin: 8px 0 10px; }
  section.test pre code, section.test pre code span { color: #18212C !important; background: transparent !important; }
  .test-takeaway { border-left: 5px solid #C00000; background: #FFF4F2; color: #6A160D; padding: 9px 14px; font-size: 19px; font-weight: bold; }
  .members { position: absolute; left: 32px; bottom: 70px; font-size: 16px; line-height: 1.55; }
  .members b { display: block; margin-bottom: 2px; }
  .logos { display: flex; gap: 56px; align-items: center; margin: 22px 0 40px; }
  .flow { display: flex; align-items: center; gap: 8px; margin: 10px 0; }
  .flow .box { flex: 1; border: 2px solid #1F4E79; background: #EEF3FA; padding: 8px 10px; text-align: center; font-size: 15px; line-height: 1.3; }
  .flow .box b { display: block; color: #1F4E79; font-size: 16px; margin-bottom: 2px; }
  .flow .arr { color: #4FA3A0; font-size: 30px; font-weight: bold; text-align: center; line-height: 1; }
  .flow .arr small { display: block; font-size: 11px; color: #1F4E79; font-weight: bold; }
  section.divider, section.qa { justify-content: center !important; align-items: center; text-align: center; }
  section.divider h1 { color: #C00000; font-size: 54px; }
  section.qa h1 { font-size: 150px; margin: 0; }
  .shot img { width: 100%; border: 1px solid #ccc; }
  .vlink { font-size: 20px; color: #1F4E79; font-weight: bold; margin-top: 12px; }
  .vlink a { color: #1F4E79; }
  .codeshot { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; align-items: start; }
  section.test .codeshot pre { font-size: 16px; line-height: 1.32; }
  section.test pre .c-step { color: #1F4E79 !important; font-weight: bold; }
  section.test pre .c-sub { color: #7A8494 !important; }
  section.test .flow { align-items: stretch; }
  section.test .flow .box { font-size: 15px; padding: 8px 8px; display: flex; flex-direction: column; justify-content: center; }
  section.test .flow .arr { align-self: center; }
  .bp { font-size: 15px; color: #555; margin: 4px 0 10px; }
---

<!-- _class: title -->
<!-- _header: "" -->
<!-- _footer: "" -->
<div class="tl">
<div class="big">T03</div>
<div class="members"><b>Danh sách thành viên:</b>23120027 - Nguyễn Hải Đăng<br>23120031 - Nguyễn Phú Dinh<br>23120034 - Ứng Thị Thuỳ Dương</div>
<div class="foot">2026 AI-First · CS423/CSC15003</div>
</div>
<div class="tr">
<h1>Mobile Automation Testing với Appium 2 và Applitools Eyes</h1>
<div class="logos"><img src="assets/logo_appium.png" height="60"><img src="assets/logo_applitools.png" height="76"></div>
<div class="band light">DEMO: Appium 2 + UiAutomator2 (truyền thống) · Applitools Eyes (AI visual)</div>
<div class="vlink">Video demo: <a href="https://youtu.be/N3cN5d2LSG4">https://youtu.be/N3cN5d2LSG4</a></div>
</div>

---

<!-- _footer: "2 · Thách thức của kiểm thử mobile" -->
# Tại sao kiểm thử mobile khó khăn?

- **Phân mảnh thiết bị:** phiên bản Android/iOS, kích thước và mật độ màn hình.
- **Giao diện thay đổi theo trạng thái:** bàn phím, thông báo, quyền, animation, network.
- **Regression testing:** phải kiểm thử lại sau khi app được cập nhật.

![h:250](assets/devices.jpeg) &nbsp;&nbsp; ![h:250](assets/keyboard_state.jpg)

---

<!-- _footer: "3 · Hai khía cạnh của kiểm thử giao diện" -->
# Hai khía cạnh của kiểm thử giao diện

<div class="two">
<div>
<div class="band">Hai câu hỏi của kiểm thử giao diện</div>

| | Functional | Visual |
|---|---|---|
| Hỏi | App **làm** đúng không? | App **trông** đúng không? |
| Chuẩn so | Giá trị kỳ vọng trong code | Ảnh baseline đã duyệt |
| Công cụ | Appium | Applitools Eyes |

</div>
<div>
<div class="band red">Vì sao cần cả hai</div>

- Functional pass **không** chứng minh giao diện đúng
- Visual pass **không** chứng minh dữ liệu đúng
- Chạy ở đâu: emulator (rẻ, lặp lại được) hay thiết bị thật / device farm (đúng người dùng, đắt hơn)

</div>
</div>

---

<!-- _footer: "4 · Khảo sát công cụ" -->
# Khảo sát công cụ — truyền thống và AI-augmented

<div class="two">
<div>
<div class="band">Truyền thống</div>

**Appium 2** — chuẩn WebDriver, đứng ngoài app, Android + iOS, không cần mã nguồn. ✅ **chọn làm lớp functional**
**Espresso** — chạy trong app, nhanh, chỉ Android, viết Kotlin. ✗
**Detox** — cho React Native, tự đồng bộ animation/network, cần build riêng và Node 22, chỉ JS. **Đã chạy thử cùng kịch bản: 3/3 lượt pass.** Hợp khi đội RN chỉ cần CI nhanh.

</div>
<div>
<div class="band red">AI-augmented</div>

**Applitools Eyes** — so ảnh với baseline bằng Visual AI, có ignore/layout region và dashboard duyệt. ✅ **chọn làm lớp visual**
**Maestro + AI assertion** — flow YAML, `assertWithAI` bằng LLM, không có baseline, không lịch sử duyệt. Dự phòng.

</div>
</div>

<div class="band green">Vì sao ghép Appium + Eyes</div>

Eyes gắn vào **cùng một session** Appium: assert chức năng và checkpoint visual chạy trên cùng luồng, cùng APK người dùng cài, chạy được device farm. Detox không gắn được visual AI theo cách đó.

---

<!-- _footer: "5 · Appium là gì" -->
# Appium là gì?

**Appium** là framework mã nguồn mở dùng để tự động hóa kiểm thử giao diện ứng dụng mobile thông qua các test script.

## Có thể làm gì?

- Tự động mở ứng dụng, nhập dữ liệu, nhấn nút.
- Tìm các thành phần giao diện và kiểm tra kết quả.
- Hỗ trợ Android và iOS thông qua các driver tương ứng.

## Hoạt động thế nào?

<div class="flow">
<div class="box"><b>Test Script (JavaScript)</b>Nhập "iPhone" → Nhấn Search → Kiểm tra kết quả</div>
<div class="arr">➜<small>Gửi lệnh WebDriver</small></div>
<div class="box"><b>Appium server</b>Nhận và chuyển lệnh cho driver</div>
<div class="arr">➜</div>
<div class="box"><b>Android Emulator</b>Thực hiện thao tác và trả kết quả</div>
</div>

---

<!-- _footer: "6 · Session & Capabilities" -->
# Bắt đầu một Appium Test — Session & Capabilities

```js
// src/appium/config/session.js
const driver = await remote({
  hostname: "127.0.0.1", port: 4723, path: "/",        // Appium 2 dùng "/"; Appium 1 dùng "/wd/hub"
  capabilities: {
    platformName: "Android",
    "appium:automationName": "UiAutomator2",           // driver
    "appium:app": ".../app-debug.apk",                  // cài APK này khi tạo session
    "appium:appPackage": "com.eshop.sut",
    "appium:noReset": false,                            // xoá dữ liệu app → mỗi test bắt đầu sạch (~25 s)
  },
});
```

- **Session:** Phiên làm việc giữa test script và Appium Server để điều khiển ứng dụng trên thiết bị.
- **Capabilities:** Các thông tin cấu hình cho Appium biết cần sử dụng nền tảng, driver và ứng dụng nào.

<div class="flow">
<div class="box"><b>Create Session</b>Kết nối và chuẩn bị ứng dụng</div>
<div class="arr">➜</div>
<div class="box"><b>Execute Test</b>Tìm phần tử, thao tác, kiểm tra kết quả</div>
<div class="arr">➜</div>
<div class="box"><b>End Session</b>Giải phóng tài nguyên</div>
</div>

---

<!-- _footer: "7 · Locator" -->
# Locator — Appium tìm phần tử giao diện như thế nào?

**Locator:** là cách xác định một phần tử trên giao diện ứng dụng để Appium có thể tương tác với nó.
Ví dụ: Để Appium nhập email, trước tiên phải tìm đúng ô nhập email.

```xml
<android.widget.EditText resource-id="login-email" ... />
```

| Ưu tiên | Chiến lược | Cú pháp WebdriverIO | Ghi chú |
|---|---|---|---|
| 1 | `resource-id` | `android=new UiSelector().resourceId("login-email")` | Ổn định, do dev đặt |
| 2 | accessibility id | `~Đăng nhập` | Từ `accessibilityLabel` |
| 3 | text | `android=new UiSelector().text("Tìm")` | Gãy khi đổi chữ / ngôn ngữ |
| 4 | XPath | `//android.widget.EditText[@resource-id="login-email"]` | Chậm, gãy khi đổi bố cục |

**Best practice:** Ưu tiên Locator ổn định, ít phụ thuộc vào vị trí và cấu trúc giao diện để giảm chi phí bảo trì test.

---

<!-- _footer: "8 · Appium Inspector" -->
# Appium Inspector — Khám phá giao diện và tìm Locator

<div class="two w60">
<div>

![w:520](assets/inspector_login.png)

</div>
<div>

## Appium Inspector là gì?

Appium Inspector là công cụ hỗ trợ quan sát cấu trúc giao diện, xem thuộc tính phần tử và thử các thao tác trên ứng dụng.

## 3 tính năng chính:

- **Inspect UI Elements:** Xem cây giao diện và các thuộc tính của phần tử.
- **Find & Test Locators:** Tìm phần tử bằng locator và thử các thao tác như Tap, Send Keys.
- **Record Actions:** Ghi lại thao tác và hỗ trợ tạo code mẫu để xây dựng test script.

=> Appium Inspector giúp chúng ta **tìm Locator trước khi viết test script**.

</div>
</div>

---

<!-- _class: test -->
<!-- _footer: "9 · Viết test" -->
# Viết một Appium Test — Locator, Action & Assertion

**Kịch bản — Verify Cart Total:** thêm *iPhone 15 Pro Max* (30 000 000 ₫) vào giỏ 2 lần → tổng tạm tính phải là **60 000 000 ₫**.

<div class="flow">
<div class="box"><b>1 · Locator</b><span>Tìm nút “Thêm vào giỏ” (<code>product-add-1</code>)</span></div>
<div class="arr">➜</div>
<div class="box"><b>2 · Action</b><span>Bấm 2 lần, mở giỏ hàng</span></div>
<div class="arr">➜</div>
<div class="box"><b>3 · Wait</b><span>Chờ dòng tổng tiền hiện ra</span></div>
<div class="arr">➜</div>
<div class="box"><b>4 · Assertion</b><span>Tổng = 60 000 000 ₫?</span></div>
<div class="arr">➜</div>
<div class="box"><b>Test Result</b><span>PASS / FAIL dựa trên Assertion</span></div>
</div>

<div class="codeshot">
<div>
<pre><code>const byId = (id) =&gt; driver.$(`android=new UiSelector().resourceId("${id}")`);
const addBtn = await byId("product-add-1");          <span class="c-step">// 1 Locator</span>
for (let i = 0; i &lt; 2; i++) {                        <span class="c-step">// 2 Action: thêm 2 lần</span>
  await addBtn.click();
  await (await byId("android:id/button1")).click();  <span class="c-sub">// đóng hộp thoại "Thành công"</span>
}
await (await byId("nav-cart")).click();              <span class="c-sub">// mở giỏ hàng</span>
const total = await byId("cart-total");
await total.waitForDisplayed({ timeout: 10_000 });   <span class="c-step">// 3 Wait: chờ điều kiện</span>
assert.equal((await total.getText()).replace(/\D/g, ""), "60000000");  <span class="c-step">// 4 Assertion</span></code></pre>

<div class="bp"><b>Best practice:</b> Explicit Wait — chờ điều kiện cụ thể thay vì dùng thời gian chờ cố định. Bộ test thật gom các bước này vào Page Object (<code>home.addToCart(1, 2)</code>).</div>
</div>
<div class="shot">

![](assets/eshop_cart_total.png)
<span class="small">Màn giỏ hàng EShop lúc test chạy trên emulator (23/10/2026).</span>

</div>
</div>

<div class="test-takeaway">Test này pass vì tổng tiền đúng. Nhưng nếu dòng tổng lệch sang trái và nút thanh toán đổi màu, Appium có phát hiện được không? → Applitools Eyes</div>

<!-- Nói khoảng 60 giây.
Sau khi tìm hiểu Session, Locator và Appium Inspector, chúng ta kết hợp chúng để viết một test thực tế: kiểm tra chức năng tính tổng tiền của giỏ hàng EShop.
Kịch bản là thêm hai chiếc iPhone 15 Pro Max, mỗi chiếc 30 triệu đồng. Tổng tiền mong đợi là 60 triệu.
Đầu tiên, dùng Locator để tìm nút "Thêm vào giỏ" theo resource-id product-add-1.
Tiếp theo là các Action: bấm nút hai lần, mỗi lần đóng hộp thoại "Thành công" mà app hiện ra, rồi mở giỏ hàng.
Sau đó dùng Explicit Wait để chờ dòng tổng tiền hiển thị, chứ không chờ cố định vài giây.
Cuối cùng, Assertion kiểm tra tổng tiền có bằng 60 triệu hay không. Đúng thì test PASS, sai thì FAIL.
Đoạn code này đã chạy pass trên emulator; trong bộ test thật, các bước được gom vào Page Object home.addToCart (pages/home.page.js, tests/cart-total.test.js).
Tuy nhiên, giả sử tổng tiền vẫn đúng nhưng giao diện bị lệch hoặc màu sắc thay đổi bất thường. Ở bản V2 của nhóm, Appium vẫn pass 8/8. Liệu những assertion này có phát hiện được không?
Đó là lý do chúng ta cần tìm hiểu thêm Applitools Eyes. -->

---

<!-- _footer: "10 · Visual testing và Eyes" -->
# Visual testing và Applitools Eyes

<div class="two">
<div>

- **Checkpoint** = ảnh chụp tại một bước; **baseline** = ảnh đã được người duyệt. Visual AI so cấu trúc và bỏ nhiễu render, không so từng pixel
- **Match level** (Strict, Layout…) và **ignore / layout region** cho vùng động (đồng hồ, banner)
- Kết quả **Passed / Unresolved** → người **Accept** (thành baseline mới) hoặc **Reject** (bug). Công cụ chỉ báo "khác", con người quyết định

</div>
<div>
<div class="band red">Gắn vào Appium: cùng session, chụp sau khi assert xong</div>

```js
const eyes = createEyes();      // null nếu không có khoá → chỉ còn functional
await openEyes(eyes, driver, "Cart add and total");
await checkpointAs(eyes, "cartFilled", "Cart - 1 item with total");
await closeEyes(eyes);          // in "Eyes: Passed | … | link dashboard"
```

Eyes là **lớp cộng thêm**: hết trial hay mất mạng thì 8 kiểm tra chức năng vẫn chạy đủ

</div>
</div>

<div class="band">Luồng làm việc: chạy base → Accept baseline trên dashboard → chạy bản mới → triage từng checkpoint</div>

---

<!-- _footer: "11 · Thí nghiệm base / V1 / V2" -->
# Ba bản giao diện, hai lớp kiểm thử

<div class="two w60">
<div>

| Bản | Thay đổi | Appium | Eyes |
|---|---|---|---|
| **base** | bản gốc (baseline) | 8/8 pass | Passed |
| **V1** | đổi **ảnh** sản phẩm 1, bố cục giữ nguyên | 8/8 pass | Unresolved 5/10 |
| **V2** | đổi **màu** giá, màu nút, **lệch** nút và dòng tổng tiền | 8/8 pass | Unresolved 6/10 |

- **V1** = thay đổi hợp lệ → Eyes báo "thừa" nếu coi là lỗi → **Accept**, hoặc đặt vùng Layout/Ignore lên ảnh
- **V2** = regression thật mà functional **không thấy** (chữ, số, testID đều y nguyên) → **Reject**
- Chi phí bảo trì: đổi ảnh rẻ cho Appium, tốn công duyệt cho Eyes; đổi màu/bố cục thì ngược lại

</div>
<div>

![w:430](assets/eyes_dashboard_v2.png)
<span class="small">V2 trên dashboard: baseline (trái) – checkpoint (phải), vùng khác biệt được tô. Clip demo: <b>[link + mốc thời gian]</b></span>

</div>
</div>

---

<!-- _footer: "12 · Giới hạn" -->
# Giới hạn của hai công cụ

<div class="two">
<div>
<div class="band">Appium</div>

- **Không tự đánh giá giao diện** – Functional tests có thể pass dù UI hiển thị sai.
- **Nhạy cảm với thay đổi UI** – Test scripts có thể cần bảo trì khi locators thay đổi.
- **Phụ thuộc môi trường thực thi** – Thiết bị, animation và thời gian tải có thể ảnh hưởng tính ổn định.

</div>
<div>
<div class="band red">Applitools Eyes</div>

- **Không kiểm tra đầy đủ chức năng** – UI đúng không đảm bảo logic hoặc dữ liệu đúng.
- **Cần phân biệt thay đổi và lỗi** – Không phải visual difference nào cũng là bug.
- **Cần quản lý baseline** – Những thay đổi thiết kế hợp lệ phải được review và cập nhật.

</div>
</div>

---

<!-- _class: divider -->
<!-- _footer: "13 · Hoạt động lớp" -->
# Visual Diff Triage Workshop

---

<!-- _class: qa -->
<!-- _footer: "14 · Q&A" -->
# Q&A

<div class="vlink">Video demo: <a href="https://youtu.be/N3cN5d2LSG4">https://youtu.be/N3cN5d2LSG4</a></div>
