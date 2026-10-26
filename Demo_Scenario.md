# Kịch bản demo seminar: Appium và Applitools Eyes

**Mục đích:** hướng dẫn bạn cùng lớp những bước đầu tiên và trình bày bằng chứng từ chính dự án EShop của nhóm. Hai công cụ demo là Appium và Applitools Eyes. Detox được trình bày riêng như phần đối sánh trải nghiệm (DX), không phải công cụ demo thứ ba.

**Video bắt buộc:** một file `Demo_Screencast.mp4` dài 5–8 phút, có mốc thời gian rõ cho ba mức *cài đặt*, *chức năng cơ bản*, *luồng phức tạp* của từng công cụ. Đăng YouTube, ghi link và mốc vào `Demo_Video_Links.md` và slide. Thuyết minh tiếng Anh (theo Seminar Guide), nền sáng chữ tối, MP4 ≤ 100 MB, tối thiểu 720p, quay terminal/IDE thật.

## Phạm vi demo

| Công cụ | Demo cài đặt | Demo chức năng cơ bản | Demo luồng phức tạp | Trạng thái bằng chứng |
|---|---|---|---|---|
| Appium 2 | Trình bày bước cài đặt A1 và Appium `/status` báo `ready: true`. Dùng log A1, nói rõ phạm vi đã kiểm chứng là Linux. | Trong Appium Inspector (plugin web), tạo phiên UiAutomator2, xem cây giao diện màn Login, chọn `login-email`, bật Recorder và xem đoạn code sinh ra. Giải thích script dùng `testID` ổn định, ánh xạ sang `resource-id` của Android. | Chạy bộ test data-driven A2: đăng nhập theo bảng (sai mật khẩu → đúng), tìm kiếm theo bảng (1 kết quả, 2 kết quả, 0 kết quả), thêm giỏ hàng và kiểm tra tổng tiền. Chỉ ra assertion nghiệp vụ và kết quả TAP thật. | Đã kiểm chứng 22–23/10: A1; bộ data-driven 3 test / 8 kiểm tra pass 10/10 lượt ([A3](docs/A3_Metrics.md)); phiên Inspector thật có 4 ảnh + code Recorder ([A2](docs/A2_Test_Design.md) mục 7). |
| Applitools Eyes | Trình bày SDK `@applitools/eyes-webdriverio@5.61.14`, API key qua `APPLITOOLS_API_KEY` (không commit), cấu hình `src/appium/config/eyes.js` và lệnh `run-variants.sh`. | Chiếu baseline đã Accept: base lần 2, Eyes 3/3 Passed, 0/10 checkpoint lệch, Appium `# pass 8`. | Cùng luồng trên V1 (đổi ảnh sản phẩm 1) và V2 (đổi màu, vị trí nút, căn lề tổng tiền). | Đã chạy sáng 23/10/2026, AVD `Medium_Phone_API_37.0`. V1: Appium 8/8, Eyes Unresolved 5/10. V2: Appium 8/8, Eyes Unresolved 6/10. Log `src/appium/logs/20261023-065743/`, ảnh `docs/evidence/B1_B2_applitools-dashboard/`, chi tiết [B2](docs/B2_Report.md). |

Ba mức demo là ba cấp độ học cho từng công cụ: cài đặt, một khả năng cơ bản, một luồng nhiều bước sát thực tế. Đánh dấu từng mức trong video; chi tiết lặp lại được và bằng chứng nằm ở User Guide và báo cáo.

## Trước khi quay

Dùng [hướng dẫn A1](docs/A1_Setup.md) đã kiểm chứng. Kiểm tra trước khi mở emulator hoặc build:

```bash
free -h
df -h .
```

Khởi động backend từ `eshop-sut-main/backend` (mỗi lần khởi động sẽ tạo lại dữ liệu mẫu); mở AVD `eshop_api34` cho đoạn Appium; trong terminal đã nạp Android SDK, chạy `adb start-server`, `adb devices -l`, `adb reverse tcp:8081 tcp:8081`. Xác nhận thiết bị ở trạng thái `device`, backend trả lời tại `http://localhost:3000/api/products`, Metro đang chạy, Appium `/status` báo `ready`. Để emulator hiển thị cạnh terminal/IDE. Chạy thử đúng phiên bản của từng demo một lần trước khi quay. Nếu A2 thay đổi, đo lại A3 trước khi trích dẫn số liệu; xem [A3](docs/A3_Metrics.md).

Đoạn Eyes dùng AVD đã Accept baseline: `Medium_Phone_API_37.0`, 1080×2400. Mở `eshop_api34` cho checkpoint Eyes là một baseline mới. Màn Home không có banner riêng; V1 đổi ảnh sản phẩm id 1, V2 đổi màu và bố cục. Vùng Layout của ảnh sản phẩm 1 viết trong code không có hiệu lực ở lượt B2, nên khi nói V1 phải nói đây là báo thừa, không phải một ignore region đã chạy.

## Demo Inspector (chức năng cơ bản của Appium)

Nhóm dùng **plugin Inspector chạy trong trình duyệt**, không cần cài app desktop:

1. Cài một lần trong `src/appium/`: `npx appium plugin install --source=npm appium-inspector-plugin@2025.3.1` (bản mới hơn đòi Appium 3).
2. Khởi động server kèm plugin: `npx appium --address 127.0.0.1 --port 4723 --use-plugins=inspector --allow-cors`, rồi mở `http://127.0.0.1:4723/inspector`.
3. Nhập capabilities giống `src/appium/config/session.js` (`platformName`, `appium:automationName`, `appium:deviceName`, `appium:app`, `appium:appPackage`), bấm Start Session.
4. Bấm `nav-login` trên cây giao diện, chọn ô Login email và chỉ vào `resource-id` = `login-email`.
5. Bật Recorder, thao tác đăng nhập một lần, xem đoạn code WebdriverIO sinh ra. Giải thích: Recorder giúp khám phá thao tác và locator; code sinh ra là bản nháp, test chính thức giữ Page Object và assertion trong `src/appium/`.

**Quy tắc bắt buộc về phiên:** UiAutomator2 chỉ chạy một instrumentation trên một thiết bị. Khi phiên Inspector đang mở mà chạy `npm test`, một trong hai phiên sẽ đứt. Vì vậy **đóng phiên Inspector (Quit Session) trước khi chạy test**, và trong phần live chỉ chiếu Inspector từ video đã quay.

**Bằng chứng đã có (23/10/2026):** phiên Inspector thật với 4 ảnh `docs/evidence/A2_inspector_0{1..4}_*.png` và code Recorder `A2_inspector_recorder_2026-10-23.js`; khi tìm phần tử dùng chiến lược UIAutomator, không dùng Id (tự thêm tiền tố package).

## Đề cương video (5–8 phút)

| Thời gian | Chiếu gì | Giải thích gì |
|---|---|---|
| 0:00–0:35 | EShop trên Android, cấu trúc dự án và file test | Appium gửi lệnh WebDriver qua UiAutomator2 tới app Android. Appium kiểm tra hành vi và dữ liệu; Eyes kiểm tra giao diện hiển thị. |
| 0:35–1:15 | Bằng chứng cài đặt A1 và trạng thái server | Đã cài gì và xác nhận sẵn sàng thế nào. Chỉ sang User Guide cho bước chi tiết. |
| 1:15–2:05 | Inspector trên màn Login | Xem cây giao diện, tìm `login-email`, nối `testID` với locator, bật Recorder ngắn. Quit Session trước khi sang bước sau. |
| 2:05–3:25 | Chạy `npm test` từ `src/appium/` | Bộ test data-driven: bảng đăng nhập, bảng tìm kiếm, luồng giỏ hàng; chỉ vào assertion và kết quả TAP thật. |
| 3:25–4:00 | Kết quả Appium và giới hạn | Một failure mode đã quan sát có bằng chứng (ví dụ lỗi khoá tài khoản sau 2 lần sai của SUT). Chỉ trích dẫn số liệu A3 của đúng phiên bản đã đo. |
| 4:00–4:40 | Cài Eyes và checkpoint base lần 2 | SDK, cấu hình Strict, baseline đã Accept. Base lần 2: Eyes 3/3 Passed, 0/10 checkpoint, Appium 8/8 (191,297 s). |
| 4:40–6:30 | V1 và V2 | V1: Appium 8/8, Eyes 5/10 lệch vì đổi ảnh sản phẩm 1 mà vùng Layout không gắn (báo thừa). V2: Appium 8/8, Eyes 6/10 lệch màu, vị trí nút và căn lề tổng tiền (lỗi giao diện thật). |
| 6:30–7:15 | Tổng kết và link | Chỉ cho lớp chương video và mục guide để lặp lại cài đặt, chức năng cơ bản và luồng phức tạp. |

Workflow Briefing quy định cứng 5–8 phút. Giữ video gọn, đưa lệnh chi tiết và giải thích dài vào User Guide. Không tuyên bố một mức demo đã được trình bày nếu mức đó không xuất hiện trong video hoặc bằng chứng khác của nhóm.

## Trình tự live tại seminar (10 phút, không slide)

Khung 10 phút live trong `requirements/Seminar_Guide.docx` dành cho một màn demo EShop tích hợp. Ba mức demo của từng công cụ nằm trong video và guide đã chia sẻ trước, không phải sáu lần chạy live riêng. Khởi động backend, Metro, emulator và Appium trước khung này; kiểm tra sẵn sàng khi diễn tập. Có bản ghi dự phòng khi mất mạng; khi hệ thống chạy được thì dùng terminal/IDE thật.

| Thời gian | Hành động | Bằng chứng cần giải thích |
|---|---|---|
| 0:00–0:45 | Chiếu EShop và terminal/IDE đã chuẩn bị. | Gọi tên phần kiểm tra truyền thống (Appium) và phần AI-augmented (Eyes). |
| 0:45–3:30 | Chạy bộ test Appium đã kiểm chứng. | Chỉ một locator, một dòng dữ liệu, một assertion nghiệp vụ và kết quả pass/fail thật. **Không mở Inspector trong lúc này**; nếu cần nhắc Inspector, chiếu đoạn video 1:15–2:05. |
| 3:30–4:15 | Giải thích kết quả và chuyển sang kiểm tra giao diện. | Functional pass không chứng minh giao diện đúng. |
| 4:15–7:45 | Chạy hoặc chiếu checkpoint Eyes đã đo trên V2 (AVD `Medium_Phone_API_37.0`). V1 nằm trong video. | Appium 8/8 cạnh Eyes Unresolved 6/10. Nói rõ diff là màu, vị trí nút và căn lề tổng tiền. |
| 7:45–9:15 | Đặt kết quả Appium và Eyes cạnh nhau, nêu một giới hạn đã quan sát. | Oracle nào bắt được lỗi nào; không tuyên bố không có căn cứ. |
| 9:15–10:00 | Hướng dẫn worksheet và chuyển sang 20 phút hoạt động lớp. | Người tham gia lặp lại được một bước cơ bản bằng guide đã chia sẻ. |

Diễn tập đúng trình tự này cùng TV2. Live Eyes dùng đúng AVD đã Accept (`Medium_Phone_API_37.0`). Nếu 10 phút không kịp cả hai công cụ, giữ kịch bản V2: Appium pass 8/8, Eyes bắt 6/10 checkpoint lệch.

**Đường lùi khi Eyes gặp sự cố lúc live** (hết trial, mất mạng, khoá lỗi): chạy `EYES=off npm test` để phần Appium vẫn chạy đủ 8 kiểm tra, rồi chiếu kết quả Eyes từ video/ảnh dashboard đã có. Không được dừng demo vì lớp AI.

## Checklist quay và bằng chứng

- [ ] Chương cài đặt Appium dùng lệnh và kết quả thật của dự án.
- [ ] Phiên Inspector được mở trên app Android của nhóm; thấy locator và Recorder; đã Quit Session trước khi chạy test.
- [ ] A2 có bảng dữ liệu thật, pass với dữ liệu đó, và số liệu A3 khớp phiên bản đó trước khi trình bày.
- [x] Cài Eyes, checkpoint base và so sánh V1/V2 đã chạy sáng 23/10/2026; số và ảnh nằm ở [B2](docs/B2_Report.md).
- [ ] Nội dung video khớp kết quả đã ghi; giải thích lỗi thật thay vì giấu.
- [x] Video đã lên YouTube (https://youtu.be/N3cN5d2LSG4); link nằm ở `Demo_Video_Links.md`.
- [ ] Mỗi thành viên đã diễn tập phần của mình và tự chạy được demo.
