# T03 — Mobile Automation Testing (Appium + Applitools Eyes) trên EShop

Seminar môn CS423/CSC15003 Software Testing (FIT@HCMUS, 2026 AI-First). Nhóm khảo sát, cài đặt, chạy thật và trình bày hai công cụ kiểm thử mobile trên ứng dụng React Native Expo **EShop**: **Appium 2 + UiAutomator2** (truyền thống) và **Applitools Eyes** (AI visual), có đối sánh **Detox**. Toàn bộ số liệu, ảnh và log trong repo đều từ các lần chạy của nhóm.

## Đọc gì trước

| Bạn là | Mở file |
|---|---|
| Giảng viên / người chấm | `report/Report.md` (báo cáo), `slides/` (khi có), `Demo_Video_Links.md` (khi có), `AI_Usage_Declaration.md` |
| Bạn cùng lớp muốn làm lại | `User_Guide.md` (cài đặt → test đầu tiên ≤ 15 bước → nâng cao → xử lý sự cố), rồi `docs/B4_Activity_Worksheet.md` cho hoạt động lớp |
| Người review code | `src/appium/` (Page Object, bảng dữ liệu, test), `src/detox/`, `docs/A2_Test_Design.md` |

## Cấu trúc repo

```
report/Report.md               Báo cáo chính (lý thuyết, cài đặt, vận hành, kết quả, đánh giá)
User_Guide.md                  Hướng dẫn sử dụng 7 mục, tiếng Việt
Ly_Thuyet_T03_Mobile_Automation.md   Tài liệu lý thuyết đầy đủ (nguồn của chương lý thuyết)
Tool_Survey_Proposal.md        Đề xuất công cụ (giai đoạn S1)
Demo_Scenario.md               Kịch bản video 5–8 phút và 10 phút live
AI_Usage_Declaration.md/.pdf   Khai báo sử dụng AI (AI-02, AI-03, AI-05)
docs/
  A1_Setup.md                  Cài môi trường Linux: SDK, AVD, APK, Appium, Inspector
  A2_Test_Design.md            Thiết kế bộ test data-driven và các phát hiện về SUT
  A3_Metrics.md                Thời gian chạy và độ lặp lại (10 lượt × 2 chiến dịch)
  A4_Detox.md                  PoC Detox cùng kịch bản và đối sánh DX
  B2_Report.md                 Hai bản UI có kiểm soát: functional × visual
  B4_Activity_Worksheet.md     Worksheet Visual Diff Triage Workshop (25 phút, 10 thẻ)
  diff-cards/                  10 thẻ diff (md + PDF) và đáp án
  evidence/                    Log TAP, CSV đo, ảnh Inspector, ảnh dashboard Applitools
src/appium/                    Appium 2 + WebdriverIO: config/, data/cases.js, pages/, tests/, scripts/
src/detox/                     PoC Detox
eshop-sut-main/                Mã nguồn SUT (backend + frontend-mobile đã thêm testID và biến thể UI)
run-variants.sh, check-env.bat Script chạy 3 bản UI với Eyes; kiểm tra môi trường Windows
```

## Chạy nhanh (Linux, đã có SDK/AVD theo `docs/A1_Setup.md`)

```bash
# 1. backend
cd eshop-sut-main/backend && npm ci && npm start
# 2. emulator, rồi nối cổng Metro
emulator -avd eshop_api34 ; adb reverse tcp:8081 tcp:8081
# 3. Metro cho debug APK (base; v1/v2 là hai bản UI biến thể)
cd eshop-sut-main/frontend-mobile && npm ci && npx expo start --localhost
# 4. Appium (driver nằm trong .appium của project)
cd src/appium && npm ci && export APPIUM_HOME="$PWD/.appium" && npm run driver:install && npm run server
# 5. test: 3 file, 8 kiểm tra; có APPLITOOLS_API_KEY trong src/appium/.env thì Eyes chụp thêm checkpoint
cd src/appium && export APPIUM_HOME="$PWD/.appium" && npm test
```

Không có khoá Applitools thì Eyes tự tắt, phần Appium vẫn chạy đủ (`EYES=off` để tắt chủ động). Chi tiết và xử lý sự cố: `User_Guide.md` mục 2 và 5.

## Nộp bài (theo yêu cầu Tuần 6)

| Mục nộp | File |
|---|---|
| Slide (md + pptx + pdf) | `slides/` *(đang làm)* |
| Báo cáo (md + pdf) | `report/Report.md`, `report/Report.pdf` *(pdf đang làm)* |
| Link video demo | `Demo_Video_Links.md` *(đang làm)* |
| Source code | `src/appium/`, `src/detox/`, thay đổi trong `eshop-sut-main/frontend-mobile/App.js` |
| Khai báo AI (md + pdf) | `AI_Usage_Declaration.md`, `.pdf` |
| Git commit log | `Git_Commit_Log.md` *(sinh trước khi nộp)* |
| Phân công và minh chứng | Bảng contribution (Google Sheet) |
| Hoạt động lớp (brief T03) | `docs/B4_Activity_Worksheet.md`, `docs/diff-cards/` |

## Thành viên

| Vai trò | Tài khoản Git | Phụ trách |
|---|---|---|
| TV1 | `d1nhnguyen` | Môi trường, bộ test Appium, đo lặp lại, PoC Detox, kịch bản và video demo |
| TV2 | `stardust65613` | Applitools Eyes, hai bản UI có kiểm soát, 10 thẻ diff, worksheet |
| TV3 | `UngDuong125` | Lý thuyết, báo cáo, hướng dẫn sử dụng, khai báo AI, slide tổng hợp |

Họ tên và MSSV: xem bảng "Thông tin nhóm" trong `AI_Usage_Declaration.md`.

## Quy ước ký hiệu

| Ký hiệu | Nghĩa |
|---|---|
| **base / V1 / V2** | Ba bản giao diện EShop cho visual testing (`EXPO_PUBLIC_UI_VARIANT`): base = gốc; V1 = đổi ảnh sản phẩm 1, bố cục giữ nguyên (thay đổi hợp lệ); V2 = đổi màu giá, màu nút, lệch nút và dòng tổng tiền (lỗi giao diện) |
| **L1, L2 / S1–S3** | Dòng dữ liệu trong `src/appium/data/cases.js`: đăng nhập (sai, đúng) / tìm kiếm (1, 2, 0 kết quả) |
| **A1–A4, B1–B6, C1–C6** | Mã công việc trong kế hoạch nội bộ của nhóm. Trong repo chỉ còn ở tên một số file `docs/` (bảng ở trên) và tên file bằng chứng; không cần biết kế hoạch để đọc nội dung |
| **TV1–TV3** | Ba thành viên (bảng trên) |
