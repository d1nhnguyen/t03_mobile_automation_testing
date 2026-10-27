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
  h1 { color: #1F4E79; font-size: 36px; margin: 0 0 12px 0; }
  section.red h1 { color: #C00000; }
  h2 { color: #1F4E79; font-size: 22px; margin: 8px 0 4px 0; }
  .band { background: #1F4E79; color: #fff; font-weight: bold; text-align: center; padding: 5px 10px; font-size: 18px; margin: 8px 0 6px 0; }
  .band.red { background: #C00000; } .band.green { background: #375623; } .band.light { background: #DCE6F2; color: #1F4E79; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  .w60 { grid-template-columns: 1.3fr 1fr; }
  .w40 { grid-template-columns: 1fr 1.2fr; }
  .three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 10px 0; }
  .three .box { border: 2px solid #1F4E79; background: #EEF3FA; padding: 12px 14px; font-size: 16px; line-height: 1.35; }
  .three .box b { display: block; color: #1F4E79; font-size: 18px; margin-bottom: 6px; }
  .three .box .n { display: inline-block; background: #1F4E79; color: #fff; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; font-size: 14px; margin-right: 6px; }
  table { border-collapse: collapse; width: 100%; font-size: 16px; margin: 6px 0; }
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
  .tl .foot { position: absolute; bottom: 28px; left: 32px; font-size: 13px; font-style: italic; }
  .tr { padding: 48px 44px; box-sizing: border-box; }
  .tr h1 { font-size: 32px; margin: 36px 0 28px 0; }
  section.test pre { font-size: 16px; line-height: 1.26; color: #18212C; background: #F7F9FC; border-left: 4px solid #1F4E79; padding: 10px 14px; margin: 8px 0 10px; }
  section.test pre code, section.test pre code span { color: #18212C !important; background: transparent !important; }
  .test-takeaway { border-left: 5px solid #C00000; background: #FFF4F2; color: #6A160D; padding: 9px 14px; font-size: 18px; font-weight: bold; }
  .members { position: absolute; left: 32px; bottom: 70px; font-size: 16px; line-height: 1.55; }
  .members b { display: block; margin-bottom: 2px; }
  .logos { display: flex; gap: 56px; align-items: center; margin: 16px 0 24px; }
  .flow { display: flex; align-items: center; gap: 8px; margin: 10px 0; }
  .flow .box { flex: 1; border: 2px solid #1F4E79; background: #EEF3FA; padding: 8px 10px; text-align: center; font-size: 15px; line-height: 1.3; }
  .flow .box b { display: block; color: #1F4E79; font-size: 16px; margin-bottom: 2px; }
  .flow .arr { color: #4FA3A0; font-size: 28px; font-weight: bold; text-align: center; line-height: 1; }
  .flow .arr small { display: block; font-size: 11px; color: #1F4E79; font-weight: bold; }
  section.divider, section.qa { justify-content: center !important; align-items: center; text-align: center; }
  section.divider h1 { color: #C00000; font-size: 54px; }
  section.qa h1 { font-size: 120px; margin: 0 0 16px 0; }
  .shot img { width: 100%; border: 1px solid #ccc; }
  .vlink { font-size: 18px; color: #1F4E79; font-weight: bold; margin-top: 10px; line-height: 1.45; }
  .vlink a { color: #1F4E79; }
  .codeshot { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; align-items: start; }
  section.test .codeshot pre { font-size: 15px; line-height: 1.32; }
  section.test pre .c-step { color: #1F4E79 !important; font-weight: bold; }
  section.test pre .c-sub { color: #7A8494 !important; }
  section.test .flow { align-items: stretch; }
  section.test .flow .box { font-size: 14px; padding: 8px 8px; display: flex; flex-direction: column; justify-content: center; }
  section.test .flow .arr { align-self: center; }
  .bp { font-size: 15px; color: #555; margin: 4px 0 10px; }
  .tree { font-family: Consolas, "Courier New", monospace; font-size: 15px; background: #F4F6F9; border-left: 4px solid #1F4E79; padding: 10px 16px; line-height: 1.4; margin: 8px 0; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 8px 0; }
  .pair .col { border: 2px solid #1F4E79; background: #EEF3FA; padding: 10px 12px; font-size: 15px; line-height: 1.35; }
  .pair .col.red { border-color: #C00000; background: #FFF4F2; }
  .pair .col b { display: block; color: #1F4E79; margin-bottom: 4px; font-size: 17px; }
  .pair .col.red b { color: #C00000; }
  .steps ol { margin: 6px 0; padding-left: 26px; }
  .steps li { margin: 3px 0; font-size: 17px; }
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
<div class="logos"><img src="assets/logo_appium.png" height="56"><img src="assets/logo_applitools.png" height="70"></div>
<div class="band light">DEMO: Appium 2 + UiAutomator2 (truyền thống) · Applitools Eyes (AI visual)</div>
<div class="vlink">
Video demo: <a href="https://youtu.be/N3cN5d2LSG4">https://youtu.be/N3cN5d2LSG4</a><br>
<span class="small">Video theo phần (cài đặt · Record · Data-driven · Eyes): <code>Demo_Video_Links.md</code> · Hướng dẫn chạy lại: <code>User_Guide.md</code></span>
</div>
</div>

---

<!-- _footer: "2 · Đặc trưng kiểm thử mobile" -->
# Tại sao kiểm thử mobile khác web và app thường?

Cùng mục tiêu tìm lỗi trước người dùng, nhưng trên mobile **môi trường là một phần của bài test**.

| Đặc trưng | Mobile | Web / desktop thường |
|---|---|---|
| Phân mảnh máy + OS + DPI / OEM | Rất mạnh | Ít hơn (vài browser / vài OS) |
| Tương tác | Touch, swipe, long-press, bàn phím ảo che UI | Click, hover, bàn phím vật lý |
| Vòng đời app | Background, bị OS kill, xoay màn, mở lại giữa chừng | Tab / cửa sổ thường sống lâu |
| Gián đoạn | Gọi, noti, chuyển app — phải xét phục hồi | Hiếm là hạng mục riêng |
| Mạng | Wi‑Fi ↔ 4G, mất sóng, offline, sync lại | Thường giả định có mạng |
| Quyền, cảm biến, pin | Runtime permission, GPS/camera, pin | Hạn chế hơn (sandbox trình duyệt) |
| Phát hành | Store; máy giữ bản cũ lâu | Deploy server / installer |

- Cùng locator đúng vẫn có thể fail khi bàn phím che nút, cold start chưa lên foreground, hoặc baseline Eyes gắn nhầm AVD.
- Buổi demo đi sâu **chức năng** và **visual**; các hạng mục còn lại nằm ngoài phạm vi chạy thật.

![h:120](assets/devices.jpeg) &nbsp;&nbsp; ![h:120](assets/keyboard_state.jpg)

---

<!-- _footer: "3 · Các lớp kiểm thử" -->
# Kiểm thử mobile gồm những lớp nào?

<div class="two">
<div>
<div class="band">Phạm vi thường gặp</div>

| Khía cạnh | Câu hỏi ngắn |
|---|---|
| Chức năng | Luồng nghiệp vụ đúng chưa? |
| Giao diện / visual | Còn giống thiết kế không? |
| Tương thích | Máy / OS / độ phân giải? |
| Hiệu năng, pin, mạng | Chậm, tốn pin, mạng yếu? |
| Gián đoạn | Gọi, noti, chuyển nền? |
| Cài đặt / quyền | Cài mới, cập nhật, cấp quyền? |
| Usability / a11y, bảo mật | Dễ dùng? An toàn? |

</div>
<div>
<div class="band red">Hai lớp trong demo T03</div>

| | Functional | Visual |
|---|---|---|
| Hỏi | App **làm** đúng không? | App **trông** đúng không? |
| Chuẩn so | Giá trị kỳ vọng trong code | Ảnh baseline đã duyệt |
| Công cụ | Appium | Applitools Eyes |

- Functional pass chưa đủ để kết luận giao diện đúng
- Visual pass chưa đủ để kết luận dữ liệu đúng
- Hai lớp bổ sung nhau trên cùng luồng EShop

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

**Detox** — cho React Native, tự đồng bộ animation/network, cần build riêng. **Đã chạy thử cùng kịch bản: 3/3 lượt pass.** Hợp khi đội RN chỉ cần CI nhanh.

</div>
<div>
<div class="band red">AI-augmented</div>

**Applitools Eyes** — so ảnh với baseline bằng Visual AI, có ignore/layout region và dashboard duyệt. ✅ **chọn làm lớp visual**

**Maestro + AI assertion** — flow YAML, `assertWithAI` bằng LLM, không có baseline, không lịch sử duyệt. Dự phòng.

</div>
</div>

<div class="band green">Vì sao ghép Appium + Eyes</div>

Eyes gắn vào **cùng một session** Appium: assert chức năng và checkpoint visual chạy trên cùng luồng, cùng APK người dùng cài.

---

<!-- _footer: "5 · Quy trình và ba khối" -->
# Quy trình tự động hoá và ba khối nền tảng

<div class="two">
<div>
<div class="band">Một vòng với EShop</div>

<div class="steps">

1. Chuẩn bị môi trường (SDK, AVD, APK, backend)
2. Làm app kiểm thử được (`testID`, seed, reset)
3. Thiết kế ca + bảng dữ liệu + oracle
4. Viết script (Page Object, wait, assert, Eyes)
5. Chạy lặp → đọc log → phân biệt lỗi test / môi trường / app
6. Triage visual → Accept / Reject baseline
7. Bảo trì khi app đổi (locator, data, baseline)

</div>
</div>
<div>
<div class="band red">Ba khối trong demo</div>

<div class="three" style="grid-template-columns: 1fr; gap: 10px;">
<div class="box"><b><span class="n">1</span> Record & Playback</b>Inspector khám phá cây UI và ghi thao tác. Code Recorder là bản nháp.</div>
<div class="box"><b><span class="n">2</span> Data-driven</b>Cùng một kịch bản, nhiều bộ dữ liệu trong <code>data/cases.js</code>.</div>
<div class="box"><b><span class="n">3</span> Checkpoints</b>Assert nghiệp vụ (Appium) và checkpoint giao diện (Eyes).</div>
</div>

</div>
</div>

---

<!-- _footer: "6 · Tổng quan bộ code" -->
# Cấu trúc bộ test Appium

Bộ test nằm ở `src/appium/`. Code Recorder từ Inspector giữ trong `docs/evidence/` để đối chiếu với Page Object.

<div class="two w60">
<div>

<div class="tree">
src/appium/<br>
&nbsp;&nbsp;config/&nbsp;&nbsp; session, locators, eyes, checkpoints<br>
&nbsp;&nbsp;pages/&nbsp;&nbsp;&nbsp; Page Object theo màn hình<br>
&nbsp;&nbsp;data/&nbsp;&nbsp;&nbsp;&nbsp; cases.js — bảng dữ liệu<br>
&nbsp;&nbsp;tests/&nbsp;&nbsp;&nbsp; login-search, cart-total<br>
&nbsp;&nbsp;examples/ search-example.js — file mẫu gom đủ phần<br>
docs/evidence/<br>
&nbsp;&nbsp;A2_inspector_recorder_….js — code Recorder
</div>

</div>
<div>

<div class="band">Recorder so với Page Object</div>

| Recorder | Page Object |
|---|---|
| `$$(...)[0].click()` | `waitForDisplayed` + `click` |
| Không assertion | Assert text / số / trạng thái |
| Locator rải trong bước ghi | Locator gom theo màn hình |

Diff hai file cho thấy Recorder thiếu wait và assert — đủ để khám phá locator, chưa đủ để chạy ổn định trên CI.

<span class="small"><code>docs/evidence/A2_inspector_recorder_2026-10-23.js</code> · <code>pages/login.page.js</code></span>

</div>
</div>

---

<!-- _footer: "7 · File mẫu search-example" -->
# Nhìn toàn bộ một test — `search-example.js`

File mẫu gom đủ các phần trong một chỗ. Bộ test chính thức tách cùng cấu trúc ra nhiều file.

<div class="flow">
<div class="box"><b>1 · Session</b>capabilities, mở phiên</div>
<div class="arr">➜</div>
<div class="box"><b>2 · Locator</b><code>resource-id</code> từ testID</div>
<div class="arr">➜</div>
<div class="box"><b>3 · Page Object</b>gom thao tác màn Home</div>
<div class="arr">➜</div>
<div class="box"><b>4 · Data</b>bảng SEARCH_CASES</div>
<div class="arr">➜</div>
<div class="box"><b>5 · Assert</b>action → wait → assert</div>
<div class="arr">➜</div>
<div class="box"><b>6 · Eyes</b>tuỳ chọn, sau assert</div>
</div>

```js
const SEARCH_CASES = [
  { keyword: "iPhone", count: 1, names: { 1: "iPhone 15 Pro Max" } },
  { keyword: "Pro M",  count: 2, names: { 1: "…", 3: "MacBook Pro M3" } },
];
for (const row of SEARCH_CASES) {
  await t.test(`tìm "${row.keyword}" → ${row.count}`, async () => {
    await home.search(row.keyword);
    await driver.waitUntil(/* … count … */);
    assert.equal(/* tên sản phẩm */, row.names[…]);
  });
}
```

- Chạy riêng: `npm run example` (không nằm trong `npm test`).
- Bộ thật: `config/`, `pages/`, `data/cases.js`, `tests/`.

---

<!-- _footer: "8 · Appium Inspector — Record" -->
# ① Record & Playback — Appium Inspector

<div class="two w60">
<div>

![w:500](assets/inspector_login.png)

</div>
<div>

## Appium Inspector là gì?

Công cụ hỗ trợ quan sát cấu trúc giao diện, xem thuộc tính phần tử và thử các thao tác trên ứng dụng.

## Ba tính năng chính

- **Inspect UI Elements:** xem cây giao diện và thuộc tính phần tử.
- **Find & Test Locators:** tìm phần tử bằng locator và thử Tap, Send Keys.
- **Record Actions:** ghi thao tác và sinh code mẫu WebdriverIO.

`testID` trên React Native xuất hiện thành `resource-id` (ví dụ `login-email`).

=> Inspector dùng để **tìm locator và thử thao tác**. Code Recorder là bản nháp; test nộp giữ Page Object kèm wait và assertion.

<div class="band red" style="margin-top:10px">Quit Session trước khi chạy npm test</div>

</div>
</div>

---

<!-- _footer: "9 · Data-driven" -->
# ② Data-driven — cùng kịch bản, nhiều bộ dữ liệu

Dữ liệu tách khỏi logic: thêm một trường hợp là thêm một dòng trong `data/cases.js`.

<div class="two">
<div>
<div class="band">Bảng dữ liệu</div>

| ID | Đầu vào | Kỳ vọng |
|---|---|---|
| L1 | sai mật khẩu | còn Login + `login-error` |
| L2 | đúng tài khoản | “Chào, Test User” |
| S1 | `iPhone` | 1 kết quả |
| S2 | `Pro M` | 2 kết quả |
| S3 | `Nokia 3310` | 0 kết quả |
| Cart | iPhone × 2 | tổng chữ số `60000000` |

</div>
<div>
<div class="band red">Vòng lặp trong test</div>

```js
const { SEARCH_CASES } = require("../data/cases");

for (const row of SEARCH_CASES) {
  await t.test(
    `${row.id} "${row.keyword}"`,
    async () => {
      await home.searchFor(row.keyword);
      // assert theo row.expectedCount / row.expected
    }
  );
}
```

- Mỗi dòng bảng → một subtest  
- Assertion lấy kỳ vọng từ dòng đó  
- Mở rộng bộ dữ liệu: thêm object vào mảng

</div>
</div>

<span class="small">LOGIN_CASES cùng kiểu; thứ tự L1→L2 cố định vì backend khoá tài khoản sau nhiều lần sai.</span>

---

<!-- _class: test -->
<!-- _footer: "10 · Checkpoint chức năng — chi tiết code" -->
# ③ Checkpoint chức năng — Locator, Action & Assertion

**Kịch bản — Verify Cart Total:** thêm *iPhone 15 Pro Max* (30 000 000 ₫) vào giỏ 2 lần → tổng tạm tính phải là **60 000 000 ₫**.

<div class="flow">
<div class="box"><b>1 · Locator</b><span>Tìm nút “Thêm vào giỏ” (<code>product-add-1</code>)</span></div>
<div class="arr">➜</div>
<div class="box"><b>2 · Action</b><span>Bấm 2 lần, mở giỏ hàng</span></div>
<div class="arr">➜</div>
<div class="box"><b>3 · Wait</b><span>Chờ dòng tổng tiền hiện ra</span></div>
<div class="arr">➜</div>
<div class="box"><b>4 · Assertion</b><span>Tổng = 60 000 000 ₫?</span></div>
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
await (await byId("nav-cart")).click();
const total = await byId("cart-total");
await total.waitForDisplayed({ timeout: 10_000 });   <span class="c-step">// 3 Wait: chờ điều kiện</span>
assert.equal((await total.getText()).replace(/\D/g, ""), "60000000");  <span class="c-step">// 4 Assertion</span></code></pre>

<div class="bp"><b>Best practice:</b> Explicit Wait — chờ điều kiện cụ thể thay vì thời gian cố định. Bộ test thật gom các bước vào Page Object (<code>home.addToCart(1, 2)</code>).</div>
</div>
<div class="shot">

![](assets/eshop_cart_total.png)
<span class="small">Màn giỏ hàng EShop lúc test chạy trên emulator (23/10/2026).</span>

</div>
</div>

<div class="test-takeaway">Test này pass vì tổng tiền đúng. Nhưng nếu dòng tổng lệch sang trái và nút thanh toán đổi màu, Appium có phát hiện được không? → Applitools Eyes</div>

---

<!-- _footer: "11 · Kết quả Pass / Fail" -->
# Đọc kết quả — Pass, Fail và nhiều bộ dữ liệu

`npm test` chạy **3 test**, trong đó Login và Search lặp theo bảng. TAP đếm từng subtest.

<div class="pair">
<div class="col">
<b>Pass</b>
- L1: thấy `login-error`, vẫn ở màn Login  
- L2: thấy “Chào, Test User”  
- S1 / S2 / S3: đúng số kết quả (1 / 2 / 0)  
- Cart: tổng chữ số = `60000000`  
→ <code># pass 8</code> <code># fail 0</code>
</div>
<div class="col red">
<b>Fail</b>
- Sai mật khẩu mà không có thông báo lỗi  
- Tìm `iPhone` mà số kết quả ≠ 1  
- Tổng giỏ ≠ `60000000`  
→ Chỉ subtest đó đỏ; các dòng còn lại vẫn chạy
</div>
</div>

<div class="band light">Chạy theo bảng dữ liệu</div>

| | |
|---|---|
| Trong session | Mỗi dòng `cases.js` thành một subtest, chạy tuần tự |
| Trên TAP | Mỗi dòng có dòng `# Subtest …` riêng |
| Thêm bộ dữ liệu | Thêm object → lần sau tăng số kiểm tra (ví dụ 8 → 9) |
| Eyes | Mỗi bước quan trọng một checkpoint trong cùng batch |

---

<!-- _footer: "12 · Eyes — Checkpoint và Baseline" -->
# Applitools Eyes — Checkpoint và Baseline

<div class="two">
<div>

| | |
|---|---|
| **Checkpoint** | Ảnh chụp lần chạy hiện tại, tại một bước đã ổn định (sau assert) |
| **Baseline** | Ảnh đã Accept — chuẩn để so lần sau |
| **Visual diff** | Vùng Eyes tô khi checkpoint lệch baseline |
| **Match level** | Strict, Layout…; có thể gắn ignore / layout region |

<div class="band light">Từ chụp đến duyệt</div>

1. Đưa app tới trạng thái đã biết  
2. `eyes.check(...)` tạo checkpoint  
3. So với baseline cùng tên bước và cùng cấu hình máy  
4. Khớp → Passed; lệch → Unresolved  
5. Accept → thành baseline mới; Reject → ghi nhận lỗi  

<span class="small">Lần đầu chưa có chuẩn: trạng thái New; Accept lần đầu tạo baseline.</span>

</div>
<div>
<div class="band red">Cùng session Appium</div>

```js
await openEyes(eyes, driver, "Cart add and total");
await checkpointAs(eyes, "cartFilled",
  "Cart - 1 item with total");
await closeEyes(eyes);
// Eyes: Passed | … | link dashboard
```

- Eyes so ảnh, không đọc giá trị tiền như assertion.  
- Baseline gắn một AVD; đổi máy thường cần baseline mới.

![w:380](assets/eyes_dashboard_v2.png)
<span class="small">Trái: baseline · Phải: checkpoint · vùng tô: diff</span>

</div>
</div>

---

<!-- _footer: "13 · Eyes — Dashboard và kết quả" -->
# Xem kết quả Eyes trên dashboard

Sau khi chạy, terminal in trạng thái và link batch. Chi tiết so ảnh nằm trên **Eyes Cloud**.

<div class="two">
<div>
<div class="band">Từ terminal tới dashboard</div>

1. Chạy test với `APPLITOOLS_API_KEY`  
2. Terminal: `Eyes: Passed | Unresolved | …` + URL  
3. Mở Applitools Dashboard  
4. Chọn test → từng step là một checkpoint  
5. Xem baseline / checkpoint / diff  
6. Accept hoặc Reject từng bước  

<div class="band green" style="margin-top:10px">Khi demo / CI</div>

- `eyes.close(false)`: TAP chức năng vẫn có thể `# fail 0` khi có diff visual  
- Cần mở dashboard để triage  
- Ảnh lưu sẵn: `docs/evidence/B1_B2_applitools-dashboard/`

</div>
<div>
<div class="band red">Ba bản giao diện</div>

| Bản | Appium | Eyes |
|---|---|---|
| **base** | 8/8 pass | Passed |
| **V1** đổi ảnh SP | 8/8 pass | Unresolved 5/10 |
| **V2** đổi màu + lệch layout | 8/8 pass | Unresolved 6/10 |

- V1: đổi chủ đích → thường Accept hoặc Layout region  
- V2: regression giao diện mà functional không thấy → Reject  
- Clip: <a href="https://youtu.be/N3cN5d2LSG4?t=246">youtu.be/… (4:06)</a>

</div>
</div>

---

<!-- _footer: "14 · Tính năng hai công cụ" -->
# Tính năng của hai công cụ

<div class="two">
<div>
<div class="band">Appium</div>

- Điều khiển APK qua WebDriver: mở app, nhập liệu, nhấn nút.
- Record (Inspector), data-driven và assertion chức năng.
- Đọc text / trạng thái để xác minh nghiệp vụ (đăng nhập, tìm kiếm, tổng giỏ).
- Chạy trên emulator, thiết bị thật hoặc device farm.

</div>
<div>
<div class="band red">Applitools Eyes</div>

- So màn hình hiện tại với baseline bằng Visual AI.
- Hỗ trợ match level và ignore / layout region.
- Dashboard để Accept hoặc Reject từng checkpoint.
- Gắn cùng session Appium sau bước assert chức năng.

</div>
</div>

<div class="band green">Hai lớp bổ sung nhau — Appium không thay Eyes; Eyes không thay assert giá hay quyền</div>

<span class="small">Lưu ý khi dùng: Appium cần wait và locator ổn định; Eyes cần người duyệt baseline và không bắt lỗi không hiện trên ảnh.</span>

---

<!-- _class: divider -->
<!-- _footer: "15 · Hoạt động lớp" -->
# Visual Diff Triage Workshop

---

<!-- _class: qa -->
<!-- _footer: "16 · Q&A" -->
# Q&A

<div class="vlink">
Video demo: <a href="https://youtu.be/N3cN5d2LSG4">https://youtu.be/N3cN5d2LSG4</a><br>
<span class="small"><code>Demo_Video_Links.md</code> · <code>User_Guide.md</code></span>
</div>
