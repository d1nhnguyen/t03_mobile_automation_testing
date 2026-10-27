# Khai báo sử dụng AI — Seminar T03 Mobile Automation Testing

**Môn:** CS423 / CSC15003 — Kiểm chứng Phần mềm (AI-First 2026)  
**Giảng viên:** TS. Lâm Quang Vũ  
**Chủ đề:** T03 — Mobile Automation Testing (Appium 2 + Applitools Eyes, Detox để so sánh)  
**SUT:** EShop React Native Expo (`eshop-sut-main/frontend-mobile`, package Android `com.eshop.sut`)  
**Đợt nộp:** bản ~90% nội dung seminar  
**Ngày lập:** 23/10/2026  
**Cấp độ AI của bài:** Cấp 5 — AI-Integrated Work (theo Seminar Guide mục 7 và đề cương mục 9.2.2)

Tài liệu này gộp ba biểu mẫu của môn cho phần seminar:

- **[AI-03] AI Disclosure Form** — mục 2: dùng công cụ nào, ở giai đoạn nào, đóng góp phần nào, xác minh ra sao.
- **[AI-02] AI Audit Report** — mục 3: mỗi artifact có AI tham gia, verdict VALID / INVALID / INCOMPLETE và phần nhóm đã sửa.
- **[AI-05] Privacy Checklist** — mục 4.

[AI-04] Reflective Statement (300 từ tiếng Anh mỗi thành viên) nộp ở Stage S8, trong 5 ngày làm việc sau buổi seminar, nên không nằm trong đợt này.

---

## 1. Thông tin nhóm

| Vai trò        | Họ tên             | MSSV     | Tài khoản Git   | Phần phụ trách                                                                                  |
| -------------- | ------------------ | -------- | --------------- | ----------------------------------------------------------------------------------------------- |
| TV1            | Nguyễn Phú Dinh    | 23120031 | `d1nhnguyen`    | Khảo sát S1, cài đặt A1, bộ Appium data-driven A2, đo A3, PoC Detox A4, video demo A5, slide A6 |
| TV2            | Nguyễn Hải Đăng    | 23120027 | `stardust65613` | Tích hợp Applitools Eyes (B1), hai UI variant có kiểm soát (B2), diff cards và worksheet        |
| TV3            | Ứng Thị Thùy Dương | 23120034 | `UngDuong125`   | Lý thuyết, báo cáo `report/Report.md`, `User_Guide.md`, kịch bản demo                           |
| TV4 _(nếu có)_ | `[điền]`           | `[điền]` | `[điền]`        | `[điền]`                                                                                        |

---

## 2. [AI-03] Khai báo sử dụng AI

### 2.1 Công cụ AI dùng làm trợ lý

| Công cụ                                                                   | Ai dùng | Dùng vào việc gì                                                                                                                                                                                                                                                                                                                                            | Nguồn xác nhận trong repo                                                                                                                                                                                                       |
| ------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI Codex                                                              | TV1     | Trích tiêu chí S1 từ đề bài, đọc mã EShop, soạn nháp ma trận so sánh 5 tiêu chí                                                                                                                                                                                                                                                                             | Mục _AI Disclosure_ trong `Tool_Survey_Proposal.md`                                                                                                                                                                             |
| Claude Code (tiện ích VS Code; model Claude Fable 5.1 và Claude Opus 5.5) | TV1     | Lập kế hoạch task và bảng contribution; viết bộ test Appium data-driven, script đo thời gian/flake; viết lại tài liệu A2/A3 và kịch bản demo; đưa Eyes thành lớp tuỳ chọn; kiểm chứng layout/ignore region; README; bổ sung nền tảng lý thuyết và đánh số đề mục; dựng slide; viết lời dẫn tiếng Anh và dựng bản video demo có thuyết minh; viết file test mẫu cho bạn cùng lớp. Trợ lý chạy lệnh trên máy TV1 (chạy test, điều khiển emulator, chụp màn hình) | Trailer `Co-Authored-By: Claude Fable 5.1` trong commit `de57ee8`, `18ef5fd`, `33209e2`, `54a2df2`, `4cb9736`, `0973b28`, `e8f6e76`, `0a8cbbc`, `aa604fc`; trailer `Co-Authored-By: Claude Opus 5.5` trong `d385309`, `ce3ad9c` |
| `[TV1 điền tên công cụ]`                                                  | TV1     | Nhận xét và chấm điểm bản nháp slide "Viết test", đề xuất bố cục                                                                                                                                                                                                                                                                                            | Góp ý TV1 dán vào phiên Claude Code ngày 23/10/2026 (Phụ lục A)                                                                                                                                                                 |
| Piper TTS 1.8.0 (giọng `en_US-lessac-medium`, chạy cục bộ trên máy TV1) | TV1 | Đọc lời dẫn tiếng Anh do Claude Code viết, cho video demo https://youtu.be/N3cN5d2LSG4 | Thư mục làm việc `seminar/.video_work/` (ngoài repo): `build.py`, các file âm thanh và đoạn video tạm |
| Cursor agent (Grok)                                                       | TV3     | Biên tập lý thuyết, căn chỉnh kịch bản demo, soạn báo cáo chương 1–2 và User Guide, dịch sang tiếng Việt; cập nhật User Guide theo kết quả Eyes                                                                                                                                                                                                             | Trailer `Co-authored-by: Cursor` trong commit `29d06a4`, `c97aebd`, `2db70ed`, `eebdc08`; mục 8 của `User_Guide.md`; cuối `report/Report.md`                                                                                    |
| Cursor agent (Claude)                                                     | TV3     | Tóm tắt yêu cầu seminar; soạn tài liệu khai báo này; hoàn thiện chương 3 của báo cáo từ log và ảnh dashboard; lần lỗi `adb_shell` trong log Appium; sửa selector `productImage`; sửa số liệu và kết luận `docs/B2_Report.md`; căn `docs/B4_Activity_Worksheet.md` theo deck in-class; sửa câu sai ở `User_Guide.md` mục 6.2                                 | Phiên làm việc ngày 23/10/2026; ghi chú cuối `report/Report.md`; mục 3 hàng 9, 12, 13, 14 của tài liệu này                                                                                                                      |
| Claude                                                                    | TV2     | Cấu hình Applitool Eyes, viết script phục vụ việc chạy test, tạo các diffcard và các tài liệu B2, B4                                                                                                                                                                                                                                                        | Các commit `24eb347`, `e154ead`, `f792677`, `b7f11c4`, `42c20f4`, `0e5a176` không có trailer AI và tài liệu B2/B4 không có mục khai báo.                                                                                        |

### 2.2 AI là đối tượng được kiểm thử (không phải trợ lý)

Hai công cụ dưới đây là **nội dung của seminar**, không phải AI viết hộ bài:

| Công cụ                                                             | Vai trò trong seminar                             | Trạng thái                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Applitools Eyes (Visual AI), `@applitools/eyes-webdriverio@5.61.14` | Lớp kiểm thử giao diện, gắn vào cùng luồng Appium | Đã chạy base / V1 / V2 sáng 23/10/2026; đã merge vào `main` (`docs/B2_Report.md`, `report/Report.md` chương 3) |
| Maestro `assertWithAI` / `assertNoDefectsWithAI`                    | Phương án dự phòng trong đề xuất S1               | Chưa dùng; chỉ dùng khi trial Eyes không phủ S3–S6 và giảng viên đồng ý                                        |

Kết quả Eyes (Passed / Unresolved) do dịch vụ Applitools trả về trên dashboard. Việc phân loại diff thành false positive hay true regression do nhóm quyết định, không giao cho trợ lý AI.

### 2.3 Giai đoạn có dùng AI

| Giai đoạn                             | Có dùng | Ghi chú                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | :-----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brainstorm                            |    ✔    | Chọn tiêu chí và ứng viên công cụ ở S1                                                                                                                                                                                                                                                   |
| Outline                               |    ✔    | Khung lý thuyết, khung User Guide, khung báo cáo                                                                                                                                                                                                                                         |
| Viết nháp                             |    ✔    | Ma trận S1, tài liệu A2/A3, lý thuyết, báo cáo, User Guide                                                                                                                                                                                                                               |
| Phản hồi / sửa chữa                   |    ✔    | Viết lại tiếng Việt, căn chỉnh tài liệu với log chạy thật                                                                                                                                                                                                                                |
| Code                                  |    ✔    | Bộ test Appium data-driven, script đo `measure-runs.sh` / `summarize-runs.py`; sau đó sửa `productImage()` và thêm cờ `--allow-insecure` cho server, đã chạy lại trên máy TV1 ngày 23/10 (`docs/evidence/applitools-region-check-2026-10-23/`); lớp Eyes tuỳ chọn trong `config/eyes.js` |
| Phân tích dữ liệu                     |    ✔    | Tổng hợp trung bình, trung vị, flake từ CSV đo thật                                                                                                                                                                                                                                      |
| Thiết kế đồ hoạ                       |    ✔    | Chỉ bố cục slide: bản Marp `slides/Seminar_Slides.md` và slide 9 của file PowerPoint do Claude Code dựng (TV1). Ảnh Inspector, ảnh dashboard Eyes và ảnh giỏ hàng trên slide là ảnh chụp màn hình thật                                                                                   |
| Lồng tiếng / dựng video | ✔ | Video demo https://youtu.be/N3cN5d2LSG4: lời dẫn tiếng Anh do Claude Code viết, Piper TTS đọc; cắt, tua nhanh, chèn nhãn chương và thẻ mở đầu/tổng kết bằng script ffmpeg do Claude Code viết. Hình là bản quay màn hình thật của TV1 (`1023.mp4`, 23/10/2026) |
| Tạo kết quả test, log, ảnh bằng chứng |    ✘    | Không dùng AI để tạo hay sửa kết quả chạy. Claude Code có khởi chạy test trên máy TV1; log lưu nguyên đầu ra của lần chạy đó                                                                                                                                                             |

### 2.4 Prompt / nhiệm vụ chính giao cho AI

Biểu mẫu yêu cầu dán nguyên văn 2–3 prompt quan trọng. Nhóm chưa lưu `prompt_log.md` có timestamp trong repo, nên bảng dưới là **mô tả nhiệm vụ**, không phải nguyên văn. Mỗi thành viên dán prompt nguyên văn từ lịch sử công cụ của mình vào Phụ lục A trước khi ký.

| #   | Thành viên | Công cụ         | Nhiệm vụ giao cho AI                                                                                                                                   |
| --- | ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | TV1        | OpenAI Codex    | Đọc đề T03 và mã `frontend-mobile`, lập ma trận so sánh Appium / Applitools / Maestro theo 5 tiêu chí của S1                                           |
| P2  | TV1        | Claude          | Tách bộ test thành bảng dữ liệu đăng nhập L1–L2, tìm kiếm S1–S3 và ca tổng tiền giỏ hàng; thêm `testID` còn thiếu                                      |
| P3  | TV1        | Claude          | Viết script chạy lặp 10 lượt, ghi CSV và tính thời gian, flake                                                                                         |
| P4  | TV3        | Cursor (Grok)   | Biên tập lý thuyết, báo cáo và User Guide từ `docs/A1`–`A4` và mã nguồn; chỉ ghi lệnh đã chạy thật                                                     |
| P5  | TV3        | Cursor (Claude) | Đọc tài liệu seminar của giảng viên, tóm tắt yêu cầu, soạn khung khai báo AI từ commit và tài liệu trong repo                                          |
| P6  | TV3        | Cursor (Claude) | Lấy bản cập nhật của TV2 trên GitHub, hoàn thiện chương 3 của báo cáo từ log và ảnh dashboard, rồi commit                                              |
| P7  | TV3        | Cursor (Claude) | Kiểm tra mục việc còn lại của báo cáo: tìm nguồn lỗi trong `appium.log`, sửa những chỗ đối chiếu được với log và deck, không bịa lần chạy Eyes mới     |
| P8  | TV2        | Claude          | Cấu hình applitool eyes và viết scripts chạy test                                                                                                      |
| P9  | TV1        | Claude Code     | Rà phần việc còn lại của TV1 rồi làm 8 đầu việc: data-driven, `testID` giỏ hàng, phiên Inspector, đo lại A3, dịch và sửa tài liệu A1/A3, kịch bản demo |
| P10 | TV1        | Claude Code     | Kiểm chứng lại các nhận xét review (đơn vị thời gian B2, layout region, Eyes bắt buộc trong code); đưa Eyes thành lớp tuỳ chọn và đồng bộ tài liệu     |
| P11 | TV1        | Claude Code     | Bổ sung nền tảng lý thuyết mobile testing, đổi đề mục sang I / 1 / a                                                                                   |
| P12 | TV1        | Claude Code     | Dựng slide theo template của lớp; sửa slide "Viết test" theo góp ý; đồng bộ bản Marp với file PowerPoint TV1 tự chỉnh                                  |
| P13 | TV1        | Claude Code     | Lồng tiếng Anh cho video demo 10 phút của TV1: viết lời dẫn khớp với hình, đọc bằng TTS, tua các đoạn chờ để video còn dưới 8 phút |
| P14 | TV1        | Claude Code     | Viết một file test Appium mẫu tự chứa, đủ các phần cấu trúc, để bạn cùng lớp nắm nhanh cách một test được ghép lại |
| P15 | TV1        | Claude Code     | Bổ sung `User_Guide.md` để người đọc tự bật và chạy đầy đủ: bật lại môi trường mỗi lần, đổi giao diện bằng tay, chi tiết Inspector, bảng lỗi khi tự bật môi trường |
| P16 | TV1        | Claude Code     | Viết lại mục 2.1 `User_Guide.md` thành các bước cài từ máy Ubuntu trống (JDK, Node, Android SDK command-line tools, KVM, AVD) để TV1 dựa vào khi hướng dẫn setup trong video demo |

### 2.5 Phần AI đóng góp và phần không có AI

**AI có đóng góp bản nháp hoặc mã, nhóm rà soát và sửa:**

- Ma trận so sánh trong `Tool_Survey_Proposal.md`.
- `src/appium/data/cases.js`, `tests/login-search.test.js`, `tests/cart-total.test.js`, `pages/*.page.js` (commit `de57ee8`).
- `src/appium/scripts/measure-runs.sh`, `summarize-runs.py`; văn bản `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `Demo_Scenario.md`.
- Văn bản `Ly_Thuyet_T03_Mobile_Automation.md` (sau bản nháp tay `c5a4d19`), `report/Report.md` (chương 1–2 với Grok, chương 3 với Claude), `User_Guide.md`.
- Bản nháp tài liệu khai báo này.
- Làm cùng Claude Code (TV1, 23/10/2026): `config/eyes.js`, `config/checkpoints.js` và hai file test gọi Eyes (`4cb9736`, `0a8cbbc`); `README.md` (`e8f6e76`, `d385309`); phần nền tảng và hệ đánh số của `Ly_Thuyet_T03_Mobile_Automation.md` (`aa604fc`); đoạn kiểm chứng vùng trong `docs/B2_Report.md`, `report/Report.md`, `User_Guide.md` (`0973b28`); ảnh so pixel `home_base_vs_v1_diffmask.png`, sinh bằng script PIL do AI viết từ hai ảnh chụp thật; slide trong `slides/` (`ce3ad9c`) gồm bản Marp, PDF và các chỉnh sửa trên file PowerPoint của TV1; kế hoạch `Task_Plan.md` và bảng `Project_Contribution_T03.xlsx` (ngoài repo).
- Video demo có thuyết minh https://youtu.be/N3cN5d2LSG4 (TV1, 24/10/2026): kịch bản lời dẫn tiếng Anh, file phụ đề `.srt`, thẻ mở đầu và tổng kết, nhãn chương và nhãn tốc độ do Claude Code viết; giọng đọc do Piper TTS tạo; cắt và tua bằng script ffmpeg do Claude Code viết. Toàn bộ hình trong video là bản quay màn hình thật của TV1.
- File test mẫu `src/appium/examples/search-example.js`, lệnh `npm run example` và mục 3.3 của `User_Guide.md` (TV1, 27/10/2026), viết cùng Claude Code.
- Mục 2.7, phần đổi giao diện bằng tay ở 4.5, chi tiết Inspector ở 4.3 và mục 5.9 của `User_Guide.md` (TV1, 27/10/2026), viết cùng Claude Code từ các lỗi gặp khi chạy thật.
- Sửa chiều 23/10/2026, cũng với Cursor (Claude), và đã đối chiếu log trước khi giữ: `home.page.js` (`productImage` dùng `byTestId`), cảnh báo trong `checkpoints.js`, cờ server trong `package.json`, số liệu và mục 9–10 của `docs/B2_Report.md`, đồng hồ và nhãn của `docs/B4_Activity_Worksheet.md`, câu mục 6.2 của `User_Guide.md`.
- Bản gốc của TV2 (`docs/B2_Report.md`, `docs/B4_Activity_Worksheet.md`, `docs/diff-cards/`, `run-variants.sh`, `config/eyes.js`, `config/checkpoints.js`, biến thể trong `App.js`): **chờ TV2 xác nhận** có dùng AI hay không. Các sửa của TV3 liệt kê ở gạch đầu dòng trên không thay cho khai báo đó.

**Không có AI tạo ra hoặc chỉnh sửa:**

- Mọi kết quả chạy: `docs/evidence/A3_runs_*.csv`, `*.log`, `A4_detox_runs_2026-10-22.log`, log Eyes trong `src/appium/logs/`.
- Ảnh phiên Appium Inspector (`docs/evidence/A2_inspector_*.png`) và file Recorder `A2_inspector_recorder_2026-10-23.js` — đầu ra của Inspector, không phải của AI.
- Ảnh dashboard Applitools trong thư mục `B1_B2_applitools-dashboard`.
- Log `docs/evidence/A2_eyes_optional_2026-10-23_*.log` và log trong `docs/evidence/applitools-region-check-2026-10-23/`: do Claude Code khởi chạy trên máy TV1, nội dung là đầu ra nguyên vẹn của lần chạy (chỉ che `accountId`).
- Số liệu thời gian và flake: tính từ CSV đo thật, không do AI ước lượng.
- Quyết định chọn công cụ và verdict trong mục 3.
- Phản hồi khán giả, điểm danh: chưa có, và sẽ không dùng AI để tạo.

### 2.6 Cách nhóm xác minh đầu ra AI

1. **Chạy trên SUT thật.** Bộ data-driven chạy 10/10 lượt đạt trên AVD `eshop_api34` (Android 14), flake quan sát 0/10, trung vị 102,238 s (`docs/A3_Metrics.md`, chiến dịch 2). Hai lượt lỗi trước đó (bàn phím ảo che nút "Thêm vào giỏ", Alert "Thành công" chặn cú bấm thứ hai) được sửa trong code trước chiến dịch đo.
2. **Đối chiếu tài liệu hãng.** Giấy phép, giá, hỗ trợ React Native và tính năng AI trong ma trận S1 được kiểm tra trên trang chính thức ngày 28/09/2026; link nằm cuối `Tool_Survey_Proposal.md`.
3. **Khóa phiên bản theo mã.** Phiên bản Appium 2.19.0, UiAutomator2 4.2.9, WebdriverIO 9.32.0 trong tài liệu được đối chiếu với `src/appium/package.json`, không lấy theo lời AI.
4. **Không ghi kết quả chưa chạy.** Bản nháp User Guide đầu tiên do AI soạn tự ghi rõ "không phải bản ghi một lần chạy thành công". Sau khi TV2 có batch, chương 3 và User Guide chỉ ghi các lượt có log. Selector `productImage` và cờ `--allow-insecure` đã sửa trong mã; lượt V1 chạy lại trên máy TV1 ngày 23/10 vẫn Unresolved, nên báo cáo không ghi V1 là Passed.
5. **Đọc lại số liệu từ log.** Mọi số Eyes lấy từ `src/appium/logs/` và ảnh dashboard, không chép từ tài liệu. Cách này phát hiện cột thời gian trong `docs/B2_Report.md` nhỏ hơn log đúng 10 lần (19,1297 s thay vì 191,297 s), và hai ảnh layout region là cùng một bước dashboard.
6. **Đọc lệnh bị lỗi trong log server.** `appium.log` ghi nguyên script `mobile:shell` với `dumpsys window | grep 'mCurrentRotation'`, và script JS có chuỗi `applitools-marker`. Nguồn là SDK Eyes, không phải test của nhóm. Selector sai được xác nhận bằng cách đọc `home.page.js` cạnh `locators.js`: một hàm dùng `id=`, các hàm còn lại dùng `UiSelector().resourceId`.
7. **Đối chiếu deck.** Text của `T03_Mobile_Automation_Testing_InClass.pptx` được trích từ file giảng viên. Đồng hồ 25 phút và bốn câu minute paper trong worksheet lấy từ slide 6 và slide 7. Nhãn thứ tư giữ lại vì đáp án thẻ 5 và thẻ 9 không nằm trong ba nhãn của deck.
8. **Review chéo.** Tài liệu của TV3 dựa trên log của TV1 và TV2; TV1 và TV2 đọc lại phần mô tả công việc của mình.
9. **Chạy lại thay đổi của TV1.** Lớp Eyes tuỳ chọn chạy cả hai chế độ, mỗi chế độ `pass 8` / `fail 0` (`docs/evidence/A2_eyes_optional_2026-10-23_off.log`, `_on.log`). Kiểm chứng vùng gồm 6 lượt V1 và một lượt base đối chứng, có log và ảnh trong `docs/evidence/applitools-region-check-2026-10-23/`. Đoạn code trên slide 9 chạy pass trên emulator trước khi đưa lên slide; ảnh giỏ hàng trên slide chụp từ lần chạy thật.
10. **Đối chiếu lời dẫn video với hình.** Trước khi viết lời, khung hình của video được trích theo từng mốc và đọc lại chữ trên terminal. Lời dẫn chỉ nói điều thấy trên hình: lượt base bị dừng giữa chừng nên không nói "pass 8/8"; bản V1 nói theo dòng `fail 0`; bản V2 nói theo dấu ✓ và dòng `mismatch 3`.

### 2.7 Trích dẫn (IEEE)

[1] OpenAI, "Codex," [AI coding agent], 2026. https://openai.com/codex  
[2] Anthropic, "Claude," [Large language model], 2026. https://claude.ai  
[3] Anysphere, "Cursor," [AI code editor], 2026. https://cursor.com  
[4] xAI, "Grok," [Large language model], dùng qua Cursor, 2026. https://x.ai  
[5] Applitools, "Applitools Eyes," [Visual AI testing platform], 2026. https://applitools.com  
[6] Anthropic, "Claude Code," [AI coding agent], 2026. https://claude.com/claude-code  
[7] Open Home Foundation, "Piper," [Neural text-to-speech], v1.8.0, 2026. https://github.com/OHF-Voice/piper1-gpl

---

## 3. [AI-02] AI Audit Report

Bảng dưới dựng lại từ commit, thông điệp commit và tài liệu trong repo. Cột (1) là mô tả nhiệm vụ; prompt nguyên văn bổ sung ở Phụ lục A. Mỗi thành viên kiểm tra lại hàng của mình trước khi ký. Tham chiếu ISTQB theo **CTFL v4.0**.

| #   | (1) Công cụ + nhiệm vụ                                                                                                       | (2) Đầu ra AI                                                                                                                                                                        | (3) Verdict | (4) Lý do                                                                                                                                                       | (5) Phần nhóm sửa                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Codex, 28/09/2026 — lập ma trận S1 (TV1)                                                                                     | Ma trận Appium / Applitools / Maestro theo giá, độ khó, mức phù hợp EShop, AI, cộng đồng                                                                                             | INCOMPLETE  | Giá và số sao GitHub là dữ kiện thay đổi theo thời gian; AI không tự kiểm chứng được. CTFL §6.2 nêu rủi ro kỳ vọng phi thực tế và ước lượng sai chi phí công cụ | Đối chiếu từng ô với trang hãng ngày 28/09/2026, thêm danh sách nguồn; ghi chú giá Starter phải kiểm lại trước khi nộp                         |
| 2   | Claude, 22/10/2026 — bộ test data-driven login / search / cart (TV1, `de57ee8`)                                              | `cases.js` và các test chạy theo bảng dữ liệu, Page Object, assertion                                                                                                                | INCOMPLETE  | Script chưa chạy thì chưa phải test. Hai lượt đầu fail do bàn phím ảo và Alert — rủi ro của automation nêu ở CTFL §6.2                                          | Thêm ẩn bàn phím sau đăng nhập, đóng Alert sau mỗi lần thêm giỏ, chạy tuần tự một phiên UiAutomator2; chạy lại 10/10 đạt                       |
| 3   | Claude, 22–23/10/2026 — script đo và bảng A3 (TV1, `33209e2`)                                                                | `measure-runs.sh`, `summarize-runs.py`, bảng tổng hợp thời gian và flake                                                                                                             |    VALID    | Số liệu tính lại được từ CSV/log trong `docs/evidence/`; hai chiến dịch được tách riêng, không so thời gian chéo                                                | Giữ nguyên chiến dịch 1, ghi rõ điều kiện đo và giới hạn "10 lượt không đủ kết luận flaky dài hạn"                                             |
| 4   | Claude, 23/10/2026 — tài liệu phiên Inspector (TV1, `54a2df2`)                                                               | Văn bản A2 mô tả Record & Playback và chiến lược locator                                                                                                                             |    VALID    | Mô tả khớp ảnh chụp phiên Inspector thật; chiến lược `UiSelector().resourceId(...)` đã chọn đúng `login-email`                                                  | Ghi chú code Recorder (`$$(...)[0]`, không wait, không assertion) chỉ là bản nháp, test chính thức giữ Page Object                             |
| 5   | Claude, 22/10/2026 — viết lại kịch bản demo (TV1, `18ef5fd`)                                                                 | `Demo_Scenario.md` tiếng Việt                                                                                                                                                        | INCOMPLETE  | Kịch bản demo phải bám phần đã chạy được; Seminar Guide cấm trình bày demo dựng sẵn                                                                             | Thêm quy tắc: chưa có lần chạy Eyes thật thì để trống đoạn Eyes, không dựng ảnh                                                                |
| 6   | Cursor (Grok), 23/10/2026 — căn lý thuyết với kịch bản (TV3, `29d06a4`)                                                      | Phần A–D của `Ly_Thuyet_T03_Mobile_Automation.md`                                                                                                                                    | INCOMPLETE  | Thuật ngữ và phiên bản phải khớp hệ thống đã cài                                                                                                                | Khóa phiên bản theo `package.json`; ghi chú plugin Inspector mới hơn 2025.3.1 cần Appium 3                                                     |
| 7   | Cursor (Grok), 23/10/2026 — báo cáo Appium (TV3, `c97aebd`)                                                                  | `report/Report.md` chương 1–3                                                                                                                                                        | INCOMPLETE  | Báo cáo kiểm thử chỉ được ghi kết quả đã quan sát (CTFL §5.3)                                                                                                   | Để trống cột kết quả Eyes thay vì điền dự đoán; ghi nguồn từng số liệu về A1–A4                                                                |
| 8   | Cursor (Grok), 23/10/2026 — User Guide (TV3, `2db70ed`)                                                                      | `User_Guide.md` mục 1–7                                                                                                                                                              | INCOMPLETE  | Bản nháp đầu tự ghi "không phải bản ghi một lần chạy thành công"; User Guide phải tái lập được (rubric 20%)                                                     | Thay các mục _Not yet recorded_ bằng lệnh đã chạy ở A1; lỗi ở mục 5–6 lấy từ log A2/A3/A4                                                      |
| 9   | Cursor (Claude), 23/10/2026 — tóm tắt yêu cầu và soạn khai báo này (TV3)                                                     | Tài liệu này                                                                                                                                                                         | INCOMPLETE  | Khai báo phải đúng và đủ theo [AI-03]; AI không biết họ tên, MSSV và prompt của từng người                                                                      | Thành viên điền thông tin, dán prompt nguyên văn, kiểm tra từng hàng rồi ký                                                                    |
| 10  | Claude 22/10/2026 — tích hợp Eyes, `run-variants.sh`, hai bản UI, `docs/B2_Report.md` (`24eb347`, `e154ead`)                 | `run-variants.sh`, `docs/B2_Report.md`, các file cấu hình applitool eyes                                                                                                             | INCOMPLETE  | luồng test chạy applitool eyes chạy được nhưng vẫn còn lỗi                                                                                                      | Chưa tìm ra vấn đề                                                                                                                             |
| 11  | Claude 22/10/2026 — DiffCards_Questions.md, DiffCards_AnswerKey.md và Activity_Worksheet.md cho workshop Visual Diff Triage. | Tài liệu B4 và diffcard, không bao gồm các hình ảnh                                                                                                                                  | INCOMPLETE  | Nội dung được xây dựng dựa trên yêu cầu B4 nhưng chưa đối chiếu đầy đủ với deck của GV; dry-run và phản hồi thực tế chưa có dữ liệu.                            | Cần đối chiếu deck, kiểm tra ảnh và đáp án, bổ sung nhiễu còn thiếu, thực hiện dry-run thực tế và chỉ tổng hợp minute papers từ phản hồi thật. |
| 12  | Cursor, 23/10/2026 — cập nhật User Guide theo kết quả Eyes (TV3, `eebdc08`, sửa cùng ngày)                                   | Mục 2.5, 4.1, 4.5–4.6, 5.8, 6, 9 của `User_Guide.md`                                                                                                                                 | INCOMPLETE  | Bản `eebdc08` viết "chạy thêm không có layout region". Log chỉ có một lượt V1, và hai ảnh layout region là cùng một bước dashboard (CTFL §5.3)                  | Đã sửa mục 6.2: nêu selector `id=` và ghi lượt xác nhận chưa chạy                                                                              |
| 13  | Cursor (Claude), 23/10/2026 — hoàn thiện chương 3 của báo cáo (TV3)                                                          | `report/Report.md` mục 3.1–3.9                                                                                                                                                       | INCOMPLETE  | Số liệu và lệnh `mobile:shell` lấy từ log. Kết luận "vùng không được gửi" suy từ selector sai cộng với V1 vẫn lệch; chưa có lượt chạy lại                       | TV1 chạy lại V1 ngày 23/10 với selector đã sửa: vẫn lệch (#16); mục 3.4 đã sửa theo (`0973b28`)                                                |
| 14  | Cursor (Claude), 23/10/2026 — xử lý việc còn lại (TV3)                                                                       | Sửa `home.page.js`, `checkpoints.js`, `package.json`; sửa thời gian, mục 9 và mục 10 của `docs/B2_Report.md`; căn `docs/B4_Activity_Worksheet.md`; sửa `User_Guide.md` mục 6.2       | INCOMPLETE  | Hai việc vẫn để mở: dry-run, video. Lượt chạy lại V1 do TV1 làm sau (#16). Không sinh log hay ảnh mới (CTFL §5.3)                                               | Giữ bảng "chưa làm được" ở `report/Report.md` mục 3.9. Nhãn thứ tư của worksheet là quyết định của nhóm, không có trong deck                   |
| 15  | Claude Code, 23/10/2026 — đưa Eyes thành lớp tuỳ chọn (TV1, `4cb9736`)                                                       | `createEyes()` trả `null` khi thiếu khoá hoặc `EYES=off`; `closeEyes` in trạng thái và link dashboard; tài liệu đồng bộ                                                              |    VALID    | Chạy cả hai chế độ trên AVD `eshop_api34`: `pass 8` khi tắt và khi bật Eyes, bật thì 3 test Passed (log `A2_eyes_optional_2026-10-23_*`)                        | Nhận xét "Eyes bắt buộc mâu thuẫn với thông điệp functional là lưới an toàn" do nhóm review nêu; TV1 quyết định đổi                            |
| 16  | Claude Code, 23/10/2026 — kiểm chứng layout/ignore region trên V1 (TV1, `0973b28`, `0a8cbbc`)                                | 6 lượt V1 và base đối chứng, ảnh so pixel, đoạn kết luận trong B2 / Report / User Guide, ghi chú trong `checkpoints.js`                                                              | INCOMPLETE  | Chứng minh được vùng có được gửi và V1 chỉ đổi ảnh, nhưng chưa tìm ra vì sao vùng lệch vị trí; chỉ ghi điều quan sát được (CTFL §5.3)                           | TV1 yêu cầu rút ghi chú dài trong code thành một dòng trỏ tới evidence; nguyên nhân để ở dạng failure mode                                     |
| 17  | Claude Code, 23/10/2026 — `README.md` (TV1, `e8f6e76`, `d385309`)                                                            | Cấu trúc repo, chạy nhanh, bản đồ nộp bài, chú giải ký hiệu, bảng thành viên                                                                                                         |    VALID    | Đường dẫn đối chiếu với repo; hai file chưa có (`Demo_Video_Links.md`, `Git_Commit_Log.md`) được ghi rõ là đang làm                                             | TV1 cung cấp họ tên, MSSV và tài khoản Git thật                                                                                                |
| 18  | Claude Code, 23/10/2026 — nền tảng lý thuyết mobile testing, đánh số I / 1 / a (TV1, `aa604fc`, file do TV3 phụ trách)       | Phần nền tảng mới và hệ đánh số trong `Ly_Thuyet_T03_Mobile_Automation.md`                                                                                                           | INCOMPLETE  | Mục I.4 còn 4 câu chưa khớp kết quả Eyes mới nhất; bản sửa chờ nhóm duyệt (`seminar/drafts/Ly_Thuyet_I4_cap_nhat_ket_qua_Eyes.diff`, ngoài repo)                | TV1 bỏ đoạn "vì sao mobile khó hơn web" (đề không yêu cầu) và chọn hệ đánh số                                                                  |
| 19  | Claude Code, 23/10/2026 — slide (TV1, `ce3ad9c`)                                                                             | `slides/Seminar_Slides.md` (Marp) và `.pdf`; chỉnh file PowerPoint TV1 tự dựng: tên thành viên, slide 9 "Viết test", chân trang, bỏ slide số đo còn trống, thêm ảnh minh hoạ slide 2 | INCOMPLETE  | Code trên slide 9 đã chạy pass, nhưng PDF xuất từ bản Marp nên khác file PowerPoint. Link video đã thêm ở slide 1 và slide 14 (`9f46d48`)                                                | TV1 dựng bố cục PowerPoint gốc; slide 9 sửa ba vòng theo góp ý (bỏ bảng data-driven, giảm màu theo bước, đủ hai lần thêm giỏ)                  |
| 20  | Claude Code, 22–23/10/2026 — kế hoạch task và bảng contribution (TV1)                                                        | `Task_Plan.md`, sheet Tasks và Summary của `Project_Contribution_T03.xlsx` (ngoài repo)                                                                                              | INCOMPLETE  | Số giờ là ước lượng kế hoạch, chưa phải giờ thực; cột commit chưa đếm                                                                                           | Nhóm chuyển từ Jira sang mẫu Google Sheet của môn, bỏ bài tập bổ sung; TV1 điền họ tên thật                                                    |
| 21  | Claude Code, 23/10/2026 — mở rộng `report/Report.md` với các phần còn thiếu (TV1)                                            | Bản báo cáo dài thêm nhiều mục                                                                                                                                                       |   INVALID   | Báo cáo hiện tại đã dài; phần thêm trùng nội dung với User Guide                                                                                                | Không commit; nháp lưu ở `seminar/drafts/Report_mo_rong_2026-10-23.md` (ngoài repo)                                                            |
| 22  | Claude Code, 23/10/2026 — đổi tên tài liệu từ mã task (A1, B2…) sang tên mô tả (TV1)                                         | Đổi tên file và sửa liên kết                                                                                                                                                         |   INVALID   | Nhóm quyết định giữ mã task, thay bằng bảng chú giải ký hiệu trong README và `docs/B2_Report.md`                                                                | Hoàn tác; script đổi tên (`seminar/rename_docs_layer2.sh`) không dùng                                                                          |
| 23  | Claude Code + Piper TTS, 24/10/2026 — lời dẫn và bản dựng video demo (TV1) | Video 6:51 có thuyết minh tiếng Anh, thẻ mở đầu/tổng kết, nhãn chương và nhãn tốc độ, phụ đề `.srt`; bản tải lên https://youtu.be/N3cN5d2LSG4 | INCOMPLETE | Lời dẫn đối chiếu với khung hình, nhưng giọng là TTS và lời có thể lệch hình vài giây; chưa nghe soát toàn bộ sau khi tải lên | TV1 chọn video nguồn và giọng đọc, đồng ý dùng TTS, tải bản dựng lên YouTube; cần nghe soát và đổi tiêu đề video (đang ghi "draft") trước bản nộp cuối |
| 24  | Claude Code, 27/10/2026 — file test mẫu `src/appium/examples/search-example.js` và mục 3.3 `User_Guide.md` (TV1) | Một test tự chứa, đánh số 7 phần: session, locator, Page Object, bảng dữ liệu, Eyes tuỳ chọn, action → wait → assertion, teardown | VALID | Chạy trên AVD `eshop_api34`: tắt Eyes `pass 3`; bật Eyes `Passed`; thêm dòng "Samsung" vào bảng thì `pass 4`; `npm test` vẫn chạy đúng 3 test, `pass 8` | TV1 đề xuất mục đích (giúp bạn cùng lớp nắm cấu trúc nhanh) và duyệt; file đặt ngoài bộ test chính để con số `pass 8` không đổi |
| 25  | Claude Code, 27/10/2026 — bổ sung `User_Guide.md` để tự bật và chạy (TV1, file do TV3 phụ trách) | Mục 2.7 (bật lại môi trường mỗi lần), đổi giao diện bằng tay ở 4.5, chi tiết Inspector ở 4.3, bảng 9 lỗi ở 5.9; sửa hai câu ghi `npm test` bắt buộc có khoá API | INCOMPLETE | Lệnh Linux và các lỗi trong bảng đều đã chạy hoặc đã gặp trên Ubuntu, AVD `eshop_api34`; lệnh Windows (PowerShell, `netstat` / `taskkill`) chưa chạy thử | TV1 yêu cầu User Guide tự đủ để người đọc setup và chạy được mà không cần script riêng của TV1; bản trước khi sửa lưu ở `seminar/drafts/User_Guide.before-2026-10-27.md` (ngoài repo) |
| 26  | Claude Code, 27/10/2026 — mục 2.1 "Cài từ máy trống trên Ubuntu" và ghi chú lần build đầu ở 2.3 `User_Guide.md` (TV1, file do TV3 phụ trách) | 8 bước: JDK, Node qua nvm, Android SDK command-line tools, biến môi trường, gói SDK, KVM, tạo AVD `eshop_api34`, mở máy ảo; đoạn thay thế bằng Android Studio; ghi chú thời gian, dung lượng và tải máy khi build lần đầu | INCOMPLETE | Đối chiếu trên máy TV1 (Ubuntu 24.04): hai link tải trả HTTP 200, tên 5 gói SDK khớp `sdkmanager --list_installed`, `emulator -accel-check` báo KVM dùng được, lệnh `avdmanager` tạo đúng 1080×2400, 420 dpi; chưa chạy lại cả 8 bước trên một máy trống | TV1 yêu cầu hướng dẫn cho máy chưa có môi trường để dùng khi quay video; bản trước khi sửa lưu ở `seminar/drafts/User_Guide.before-setup-section.md` (ngoài repo) |

### 3.1 Tổng kết độ chính xác (artifact #1–#26)

| Chỉ số                                           | Số lượng | Tỉ lệ |
| ------------------------------------------------ | :------: | :---: |
| Tổng artifact AI đã audit                        |    26    | 100%  |
| VALID (dùng nguyên)                              |    5     |  19%  |
| INVALID (loại bỏ)                                |    2     |  8%   |
| INCOMPLETE (dùng sau khi sửa, hoặc còn phải sửa) |    19    |  73%  |

Hai ca INVALID (#21, #22) là đề xuất TV1 đã loại trong phiên Claude Code. Đề xuất bị từ chối ngay trong chat mà không để lại file thì không đếm được, nên số INVALID thực tế có thể cao hơn. Thành viên bổ sung nếu nhớ ca cụ thể.

### 3.2 Kết luận — khi nào nên và không nên dùng AI

AI làm tốt phần việc có khuôn: tách test thành bảng dữ liệu, viết script đo lặp, dựng khung tài liệu, dịch và biên tập. Nó yếu ở mọi thứ phụ thuộc hành vi thật của thiết bị: bản test đầu không lường được bàn phím ảo che nút và Alert chặn cú bấm, chỉ lộ ra khi chạy trên emulator. Với dữ kiện thay đổi theo thời gian như giá Applitools hay số sao GitHub, AI không đáng tin nếu không đối chiếu trang hãng. Bản nháp tài liệu dễ viết như thể đã chạy xong, và khi tóm tắt tài liệu khác, AI chép luôn lỗi của tài liệu đó; tên file ảnh "without layout region" đã bị đọc thành một lượt chạy riêng. Quy tắc nhóm rút ra: AI được viết mã và văn bản, nhưng mọi con số, lệnh và kết quả trong bài nộp phải truy được về một log, CSV hoặc ảnh chụp do người chạy thật. Phần nào chưa chạy thì để trống.

### 3.3 Mandatory Disclosure

"Mã test, script đo và tài liệu (đề xuất công cụ, lý thuyết, báo cáo, User Guide, kịch bản demo, slide, lời dẫn video) của seminar T03 có phiên bản đầu được sinh hoặc biên tập với OpenAI Codex, Claude (gồm Claude Code) và Cursor (Grok, Claude); nhóm đã rà soát và chỉnh sửa bộ test (ẩn bàn phím, đóng Alert, chạy tuần tự), bổ sung nguồn đối chiếu cho ma trận S1, thay mọi mục chưa kiểm chứng bằng lệnh và kết quả đã chạy, đọc lại số liệu Eyes từ log, sửa selector `productImage` và cờ server rồi chạy lại lượt V1 để kiểm chứng (vẫn lệch, ghi là failure mode), và căn worksheet theo deck in-class; log, CSV, ảnh Inspector, ảnh dashboard Applitools và số liệu đo do nhóm chạy trên máy của nhóm và ghi nhận nguyên vẹn (một số lượt do Claude Code khởi chạy trên máy TV1); giọng thuyết minh của video demo do Piper TTS đọc, phần hình là bản quay màn hình thật của nhóm. AI Audit Report chi tiết ở mục 3. Chúng tôi cam đoan không dùng AI để tạo kết quả kiểm thử, bằng chứng hay phản hồi khán giả."

---

## 4. [AI-05] Privacy Checklist

| Mục                                                | Trạng thái | Ghi chú                                                                                                                                                 |
| -------------------------------------------------- | :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đã xác nhận cấp độ AI (Cấp 5)                      |     ✔      | Seminar Guide mục 7                                                                                                                                     |
| Đã đọc Thoả thuận AI của môn                       | `[mỗi TV]` | [AI-01] ký từ Tuần 1                                                                                                                                    |
| Không nhập dữ liệu cá nhân vào AI                  | `[mỗi TV]` | Tài khoản dùng khi test là dữ liệu mẫu công khai của EShop (`test@eshop.com`)                                                                           |
| Không đưa khóa bí mật vào repo                     |     ✔      | `APPLITOOLS_API_KEY` đọc từ biến môi trường / `src/appium/.env`; `.env` nằm trong `.gitignore`, git không theo dõi file này (kiểm tra 23/10/2026)       |
| Không paste tài liệu có bản quyền nguyên văn       | `[mỗi TV]` |                                                                                                                                                         |
| Mọi prompt đã ghi vào `prompt_log.md` có timestamp |     ✘      | Chưa làm; bổ sung ở Phụ lục A                                                                                                                           |
| Mọi artifact AI đã gắn tag trong Audit             |     ✔      | Mục 3, trừ hàng TV2                                                                                                                                     |
| Mọi trích dẫn đã xác minh nguồn thật               |     ✔      | Link hãng kiểm tra 28/09/2026; giá Starter kiểm lại trước khi nộp cuối                                                                                  |
| Mọi code AI đã được chạy và test                   |  Một phần  | Appium 10/10 (A3), Detox PoC (A4), lớp Eyes tuỳ chọn (cả hai chế độ) và lượt V1 sau khi sửa `productImage` đã chạy (23/10). Mã của TV2 chờ TV2 xác nhận |
| Sẵn sàng vấn đáp 5–7 phút                          | `[mỗi TV]` | Commit history cá nhân trên Git                                                                                                                         |

---

## 5. Cam đoan và chữ ký

Chúng tôi cam đoan thông tin khai báo trên là chính xác và đầy đủ. Không khai báo hoặc khai báo sai lệch việc dùng AI là vi phạm liêm chính học thuật.

| Vai trò | Họ tên (in hoa)    | MSSV     | Ngày       | Chữ ký |
| ------- | ------------------ | -------- | ---------- | ------ |
| TV1     | NGUYỄN PHÚ DINH    | 23120031 | 23-10-2026 | DINH   |
| TV2     | NGUYỄN HẢI ĐĂNG    | 23120027 | 23-10-2026 | ĐĂNG   |
| TV3     | ỨNG THỊ THUỲ DƯƠNG | 23120034 | 23-10-2026 | DƯƠNG  |

---

## Phụ lục A — Prompt nguyên văn

Mỗi thành viên dán 2–3 prompt quan trọng nhất, nguyên văn, kèm công cụ và thời điểm.

### TV1

```text
[OpenAI Codex] [28/09/2026 hh:mm]
[TV1 dán prompt Codex nguyên văn từ lịch sử Codex]
```

```text
[Claude Code] [22/10/2026 23:30]
làm các đầu việc từ 1-8
```

Tám đầu việc là danh sách Claude Code lập ngay trước đó khi rà phần việc TV1: (1) mở rộng A2 thành data-driven, (2) thêm `testID` màn giỏ hàng và assert tổng tiền, (3) cài Inspector và lưu một phiên thật, (4) đo lại A3, (5) commit `Demo_Scenario.md`, (6) dịch `Demo_Scenario.md` và `docs/A3_Metrics.md` sang tiếng Việt, (7) sửa câu về Inspector trong kịch bản demo, (8) thêm ghi chú phiên bản Node trong `docs/A1_Setup.md`.

```text
[Claude Code] [23/10/2026 14:57]
"
B2_Report.md: thời gian sai đơn vị 10 lần, kết luận trống. Số này đang được Report §3.4 trích lại, nên lỗi lan sang báo cáo chính.
Layout region: chưa xác nhận code có tác dụng hay chỉ đặt tay trên dashboard. Ảnh hưởng tới câu chuyện "false positive xử lý thế nào" trong cả báo cáo lẫn slide.
Eyes bắt buộc trong code (file eyes.js bạn đang mở): về nội dung, nó mâu thuẫn với chính thông điệp của nhóm "functional là lưới an toàn, không phụ thuộc AI". GV đọc code sẽ thấy.
Worksheet chưa dry-run: brief yêu cầu "nhóm khác làm được trong ≤25 phút không cần hỗ trợ"; chưa có bằng chứng.
Nhãn 4 loại vs deck 3 loại: cần bảng ánh xạ.
" các phần việc này bạn verify lại được ko?

[Claude Code] [23/10/2026 15:01]
vậy hãy triển khai thay đổi này và động bộ các docs
```

```text
[Claude Code] [23/10/2026 19:35]
chỉnh lại slide số 8, tôi đã dùng công cụ khác để chỉnh nhưng chưa ăn ý: [dán kèm bản góp ý slide từ công cụ khác, lược ở đây]

 và tôi có thêm một file pptx do mình chỉnh lại @Seminar_Slides.pptx.pptx , hãy chỉnh lại nội dung .md và dồng bộ các slide lại theo file này.
```

### TV2

```text
[Công cụ] [dd/mm/yyyy hh:mm]
[prompt nguyên văn]
```

### TV3

```text
Cursor, 16/10/2026, 12:48
Với mỗi công cụ, cần trình bày các lý thuyết liên quan, các thuật ngữ; chức năng chính của công cụ, nguyên lý hoạt động; ít nhất 3 kịch bản demo: demo cài đặt, demo các chức năng cơ bản, demo các luồng xử lý phức tạp (nên vận dụng với yêu cầu project / case study hoặc ở mức tương đương); chỉ rõ những trường hợp công cụ có điểm yếu, ko giải quyết tốt mục tiêu đặt ra.
hãy bổ sung cái này vào phần lý thuyết

Cursor, 23/10/2026, 08:55
hãy chỉnh sửa lại để hướng dẫn rõ hơn việc cài đặt (thêm cả trong trường hợp không có sẵn mã nguồn như trong src), với lại ở phần prerequisites, bỏ phần this windows machine và chỉnh thành hướng dẫn chung, @User_Guide.md dùng để hướng dẫn chung, không phải cho riêng máy này và người sử dụng có thể chỉ có sẵn mã nguồn trong eshop-sut-main

Cursor, 23/10/2026, 09:09
Rà soát phần A, B, C1, C4 của Ly_Thuyet_T03_Mobile_Automation.md (đã viết), cập nhật theo kết quả thật của repo (phiên bản Appium 2.19.0 / UiAutomator2 4.2.9, testID → resource-id, số liệu A3, đối sánh Detox A4), bổ sung quy trình vận hành và chuyển thành chương Appium/Detox trong report/Report.md
Rà soát phần A3, A4, C2, C3 của Ly_Thuyet (đã viết), cập nhật theo kết quả Eyes thật của TV2 (cấu hình, baseline, ma trận functional × visual, failure modes), chuyển thành chương Visual AI trong report/Report.md kèm ma trận chọn công cụ từ Tool_Survey_Proposal.md
hãy kiểm tra mức độ hoàn thành của các yêu cầu này
pls don't judge me
```
