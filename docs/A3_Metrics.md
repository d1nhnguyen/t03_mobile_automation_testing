# A3 — Thời gian chạy và độ lặp lại của bộ test Appium

Hai chiến dịch đo trong ngày 22/10/2026 (UTC+7) trên cùng máy: Ubuntu/Linux, AVD `eshop_api34` (Android 14), Appium 2.19.0, UiAutomator2 4.2.9, Node.js 20.19. Mỗi chiến dịch đo một **phiên bản test khác nhau**, không so trực tiếp thời gian giữa hai bảng.

| Chiến dịch | Phiên bản test | Nội dung một lượt `npm test` | Bằng chứng |
|---|---|---|---|
| 1 — sáng 22/10 | commit `865deea`, một test đăng nhập + tìm `iPhone` | 1 phiên Appium, 1 test | [`A3_runs_2026-10-22.csv`](evidence/A3_runs_2026-10-22.csv), [`.log`](evidence/A3_runs_2026-10-22.log) |
| 2 — tối 22/10 | bộ data-driven của A2 (xem [A2_Test_Design](A2_Test_Design.md)) | 3 phiên Appium, 3 test, 8 kiểm tra TAP (L1–L2, S1–S3, giỏ hàng) | [`A3_runs_2026-10-22_data-driven.csv`](evidence/A3_runs_2026-10-22_data-driven.csv), [`.log`](evidence/A3_runs_2026-10-22_data-driven.log) |

## Điều kiện đo

- APK debug và dependency đã cài sẵn; AVD dùng trạng thái có sẵn. Không tính build Android, cài gói hay tải dependency.
- **Thời gian khởi động dịch vụ** (setup time): tính từ lúc chạy backend tới khi đủ bốn thành phần sẵn sàng: backend `/api/products` trả HTTP 200, Metro `/status` trả `packager-status:running`, Appium `/status` báo `ready: true`, emulator báo `sys.boot_completed=1`; sau đó cấu hình `adb reverse tcp:8081 tcp:8081`. Chiến dịch 1 đo được **20,219 s** (10:31:20,703 → 10:31:40,922). Chiến dịch 2 dùng lại các dịch vụ đã chạy từ trước, không đo lại; con số này là thời gian khởi động dịch vụ trên máy này, không phải thời gian cài đặt lần đầu.
- **Thời gian một lượt** là thời gian bao quanh `npm test` (`node --test`, từ chiến dịch 2 có thêm `--test-concurrency=1`), gồm khởi động npm, tạo phiên Appium, các bước và assertion, đóng phiên. Mười lượt chạy nối tiếp trên cùng emulator và dịch vụ; mỗi test tạo phiên mới với `noReset=false`; không khởi động lại dịch vụ giữa các lượt. Mỗi lượt có timeout bảo vệ (150 s ở chiến dịch 1, 600 s ở chiến dịch 2).
- **Flake quan sát** = số lượt có exit code khác 0 / 10 trong điều kiện cố định trên. Một lượt được tính đạt khi exit code bằng 0 và log TAP có `fail 0`. Mẫu 10 lượt không đủ để kết luận xác suất flaky dài hạn.
- Chiến dịch 2 chạy bằng [`scripts/measure-runs.sh`](../src/appium/scripts/measure-runs.sh); bảng dưới sinh bằng [`scripts/summarize-runs.py`](../src/appium/scripts/summarize-runs.py).

## Chiến dịch 1 — test một ca (commit `865deea`)

| Lượt | Thời gian (s) | Kết quả |
|---:|---:|---|
| 1 | 31,734 | Đạt |
| 2 | 30,532 | Đạt |
| 3 | 30,902 | Đạt |
| 4 | 30,460 | Đạt |
| 5 | 30,162 | Đạt |
| 6 | 30,652 | Đạt |
| 7 | 30,150 | Đạt |
| 8 | 30,862 | Đạt |
| 9 | 29,751 | Đạt |
| 10 | 30,389 | Đạt |

**Tóm tắt:** 10/10 đạt; flake quan sát **0/10 = 0 %**. Trung bình **30,559 s**, trung vị **30,496 s**, khoảng **29,751–31,734 s**. Lần lỗi cold start trước đó xảy ra trước bản sửa `activateApp` ở commit `865deea`, không thuộc chiến dịch này.

## Chiến dịch 2 — bộ data-driven (3 test, 8 kiểm tra TAP)

| Lượt | Thời gian (s) | Kết quả | TAP pass/fail |
|---:|---:|---|---|
| 1 | 101,182 | Đạt | 8/0 |
| 2 | 98,729 | Đạt | 8/0 |
| 3 | 98,996 | Đạt | 8/0 |
| 4 | 104,365 | Đạt | 8/0 |
| 5 | 103,818 | Đạt | 8/0 |
| 6 | 105,646 | Đạt | 8/0 |
| 7 | 105,384 | Đạt | 8/0 |
| 8 | 100,242 | Đạt | 8/0 |
| 9 | 101,671 | Đạt | 8/0 |
| 10 | 102,805 | Đạt | 8/0 |

**Tóm tắt:** 10/10 đạt; flake quan sát **0/10 = 0 %**. Trung bình **102,284 s**, trung vị **102,238 s**, khoảng **98,729–105,646 s** (23:46–00:03, 22–23/10).

Thời gian tăng từ ~30 s lên ~102 s chủ yếu vì mỗi lượt giờ tạo **ba** phiên Appium (mỗi phiên cài lại app do `noReset=false`, khoảng 25–30 s/phiên) cộng thêm các bước giỏ hàng và ba lần tìm kiếm. Đây là chi phí của việc tách test độc lập; có thể giảm bằng `noReset=true` kèm reset state thủ công, đổi lại mất tính cô lập giữa các test.

Trước khi viết bộ data-driven, hai lượt chạy đầu đã lỗi vì bàn phím ảo che nút "Thêm vào giỏ" và vì Alert "Thành công" chặn cú bấm thứ hai; cả hai đã được xử lý trong code trước chiến dịch 2 (xem [A2_Test_Design](A2_Test_Design.md) mục 5). Chúng không được tính vào 10 lượt vì là lỗi của test, không phải lỗi ngẫu nhiên.

## Lặp lại phép đo

Khởi động bốn thành phần theo [A1](A1_Setup.md), kiểm tra RAM, rồi từ `src/appium/`:

```bash
export APPIUM_HOME="$PWD/.appium"
bash scripts/measure-runs.sh 10 ../../docs/evidence
python3 -I scripts/summarize-runs.py ../../docs/evidence/A3_runs_<ngày>.csv
```

Đổi tên file kết quả theo phiên bản test nếu đo nhiều lần trong một ngày. Kịch bản trình diễn ở [Demo_Scenario.md](../Demo_Scenario.md).
