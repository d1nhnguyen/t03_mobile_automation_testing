# B2 — Hai UI variant có kiểm soát: so sánh Functional và Visual

## 1. Mục tiêu và phạm vi

Báo cáo này so sánh hai cách kiểm thử trên cùng một luồng của ứng dụng EShop mobile khi **giao diện thay đổi nhưng chức năng không đổi**:

- **Functional:** assert của Appium (đúng chữ, đúng số, phần tử tồn tại).
- **Visual:** Applitools Eyes (so ảnh chụp màn hình với baseline).

Mục tiêu cụ thể:

1. Tạo **hai bản thay đổi giao diện có kiểm soát** (V1, V2) từ bản gốc (`base`).
2. Chạy lại cùng luồng test trên cả ba bản và so sánh kết quả functional với visual.
3. Giải thích **false positive** và **true regression** bằng chính các ca đã chạy.

Phạm vi: SUT là EShop mobile (`com.eshop.sut`, Android). Baseline lấy từ bản `base`. Chưa xét iOS, nhiều thiết bị hay nhiều độ phân giải.

## 2. Môi trường thực nghiệm

| Hạng mục | Giá trị |
|---|---|
| AVD | `Medium_Phone_API_37.0`, Android `17`, độ phân giải `Physical size: 1080x2400` |
| Node.js | `v26.12.1` |
| Appium / driver | Appium `2.19.0`, UiAutomator2 `uiautomator2@4.2.9` |
| WebdriverIO | `webdriverio@9.32.0` |
| `@applitools/eyes-webdriverio` | `@applitools/eyes-webdriverio@5.61.14` |
| Match level mặc định | `Strict` |
| Vùng ignore | Status bar (`left 0, top 0, width 1080, height 80`, đổi theo độ phân giải AVD) |
| Vùng layout | Ảnh sản phẩm id 1 (`product-image-1`) |
| Backend | `npm start`, dữ liệu mẫu tạo lại mỗi lần khởi động |
| Ngày chạy | `23-10-2026` |

Các điểm giữ cố định để so sánh công bằng: cùng một AVD, backend được khởi động lại trước mỗi lần chạy (dữ liệu giống nhau), animation của emulator tắt, cùng tên test và tên checkpoint cho cả ba bản.

## 3. Hai bản thay đổi có kiểm soát

Biến thể được chọn bằng biến môi trường `EXPO_PUBLIC_UI_VARIANT` (`base` | `v1` | `v2`). Ở cả hai bản, `testID`, text và thứ tự màn hình **không đổi**, để assert functional vẫn chạy được và phép so sánh chỉ khác nhau ở phần giao diện.

| | V1 | V2 |
|---|---|---|
| Thay đổi | Đổi ảnh của sản phẩm id 1 bằng `assets/product-v1.png`, khung ảnh giữ nguyên kích thước | Giá đổi sang màu tím và chữ to hơn; hai nút ở thẻ sản phẩm bị đẩy xuống và sang phải; nút "Thêm vào giỏ" đổi từ xanh sang đỏ; dòng tổng tiền trong giỏ lệch sang trái; nút thanh toán đổi từ xanh lá sang cam |
| Bản chất | Thay đổi **hợp lệ** (đổi nội dung hình ảnh) | **Lỗi giao diện thật** |
| File thay đổi | `App.js` (hàm `renderProduct`), `assets/product-v1.png` | `App.js` (`v2Styles`, `renderProduct`, `renderCart`) |
| Màn hình bị ảnh hưởng dự kiến | Home, Search | Home, Search, Cart có hàng |
| Cách bật | `EXPO_PUBLIC_UI_VARIANT=v1` | `EXPO_PUBLIC_UI_VARIANT=v2` |

## 4. Luồng phức tạp và cấu hình Eyes

### 4.1. Luồng kiểm thử

Đăng nhập → tìm "iPhone" → thêm vào giỏ → mở giỏ → kiểm tra tổng tiền → xóa khỏi giỏ → giỏ trống.

Các test đã dùng:

| Test (tên Eyes cố định) | Nội dung |
|---|---|
| `Login data-driven` | Đăng nhập theo bảng dữ liệu (thành công và lỗi) |
| `Search data-driven` | Tìm kiếm theo bảng dữ liệu |
| `Cart add and total` | Thêm giỏ, kiểm tra thành tiền và tổng, xóa, giỏ trống |

Ba test trên đã phủ luồng đăng nhập → tìm → giỏ. Repo không có `checkout-flow.test.js`.

### 4.2. Checkpoint và quy tắc so sánh

| Checkpoint | Vị trí chụp | Match level | Ignore / Layout |
|---|---|---|---|
| Login - initial, Login - error | Sau khi màn Login hiển thị / sau khi lỗi hiển thị và assert xong | Strict | Ignore status bar |
| Home - logged in / before search | Sau khi `productCard(1)` hiển thị | Strict | Ignore status bar; layout region cho ảnh sản phẩm 1 |
| Search Results | Sau khi số kết quả và tên sản phẩm đã đúng | Strict | Ignore status bar; layout region cho ảnh sản phẩm 1 (nếu có) |
| Cart - With Item | Sau khi assert thành tiền và tổng | Strict | Ignore status bar |
| Cart - Empty | Sau khi `emptyBox` hiển thị | Strict | Ignore status bar |

Các checkpoint luôn được chụp **sau** bước chờ phần tử hiển thị và sau assert, để không chụp lúc màn hình đang chuyển hoặc đang tải.

## 5. Quy trình chạy

1. Chạy `base` lần 1 để tạo baseline, vào dashboard Applitools Accept toàn bộ ảnh và bấm Save.
2. Chạy `base` lần 2, kỳ vọng Passed (đối chứng ổn định).
3. Chạy `v1` và `v2` bằng cùng test, cùng tên Eyes test. **Không Save baseline** ở hai lần này.

Log `src/appium/logs/20261023-065743/` chỉ có một lượt V1. Không có lượt V1 thứ hai bỏ layout region.

Lệnh chạy (Git Bash, thư mục gốc repo):

```bash
export APPLITOOLS_API_KEY="..."
./run-variants.sh            # base (2 lần) -> v1 -> v2
```

Tên batch trên dashboard: `EShop - base`, `EShop - v1`, `EShop - v2` (đặt bằng `VARIANT_LABEL`, không ảnh hưởng baseline).

## 6. Kết quả

### 6.1. Bảng tổng hợp

| Lần chạy | Functional (assert) | Visual (Eyes) | Checkpoint lệch | Thời gian chạy | Kết luận |
|---|---|---|---|---|---|
| Base lần 2 | Pass (8/8) | Pass 3/3 | 0/10 | 191,297 s | Đối chứng |
| V1 | Pass (8/8) | Unresolved (3/3) | 5/10 | 209,672 s | Ảnh sản phẩm đổi có chủ đích; Eyes vẫn báo lệch vì vùng layout trong code không có hiệu lực (mục 7) |
| V2 | Pass (8/8) | Unresolved (3/3) | 6/10 | 192,640 s | True regression: màu, vị trí nút và căn lề tổng tiền lệch; Appium vẫn pass |

Thời gian lấy từ `duration_ms` trong log (`base-2-verify.log` 191297, `v1.log` 209672, `v2.log` 192640). Bản trước ghi 19,1297 s, 20,9672 s và 19,2640 s, lệch đúng một dấu thập phân. Base lần 1 (tạo baseline) mất 198,578 s và cũng `# pass 8` `# fail 0`.

### 6.2. Kết quả theo checkpoint

| Checkpoint | Base | V1 | V2 |
|---|---|---|---|
| Login | Passed | Unresolved | Unresolved |
| Home  | Passed | Unresolved | Unresolved (Nút xem chi tiết, thêm vào giỏ bị lệch, hiển thị giá sản phẩm sai màu) |
| Cart - With Item | Passed | Unresolved | Unresolved (Tổng tiền bị lệch không nằm sát bên phải) |
| Cart - Empty | Passed | Passed | Passed |
| Search result | Passed | Unresolved | Unresolved (Nút xem chi tiết, thêm vào giỏ bị lệch, hiển thị giá sản phẩm sai màu)|


### 6.3. Nhận xét ngắn

- Functional không thấy được thay đổi ở v1 và v2
- Eyes bắt được toàn bộ thay đổi trên giao diện. Không có checkpoint sót.

## 7. Phân tích false positive và true regression

**False positive** là trường hợp công cụ báo khác biệt nhưng đó **không phải lỗi**.

- Ca trong thực nghiệm: V1. Ảnh sản phẩm 1 đổi, khung giữ nguyên, nhưng Eyes vẫn Unresolved ở các bước có sản phẩm đó. `checkpoints.js` có `layoutRegions`, nhưng `productImage()` tìm bằng `id=product-image-1`. Chiến lược `id` của UiAutomator2 thêm tiền tố package (`com.eshop.sut:id/...`) và không khớp `testID` của React Native, nên `isExisting()` trả về sai và vùng Layout không được gửi lên Eyes. Hai ảnh `v1_home_with_layout_region.png` và `v1_home_without_layout_region.png` là cùng một bước trên dashboard (cùng URL step), chụp trong step editor, không phải hai lượt chạy. Lượt xác nhận ngày 23/10 trên máy TV1 với selector `byTestId` (xem `docs/evidence/applitools-region-check-2026-10-23/`): vùng đã được gắn, nhưng V1 vẫn Unresolved 3/4 ở các bước có ảnh, kể cả khi đổi sang `ignoreRegions` hoặc tự tính toạ độ (dp, trừ status bar, px); base đối chứng Passed và vùng phủ toàn ảnh Passed. Kết luận: vùng khai báo trong code được gửi lên nhưng không trùng vị trí ảnh trên ảnh chụp của Eyes (nguyên nhân chưa xác định, ghi là failure mode); vùng có hiệu lực trong B2 là vùng đặt trên dashboard.
- Cách xử lý: selector đã đổi sang `byTestId` (cùng `UiSelector().resourceId` với các `testID` khác). Lượt chạy lại để xác nhận V1 hết lệch ở vùng ảnh **chưa có**. Trước lượt đó, cách xử lý đã kiểm chứng chỉ là Accept thủ công nếu thay đổi là chủ ý.
- Các nguồn false positive thường gặp khác: giờ ở status bar, dữ liệu động, ảnh chưa tải xong lúc chụp, bàn phím ảo che màn hình, animation đang chạy.

**True regression** là trường hợp khác biệt được báo **là lỗi thật** do thay đổi code.

- Ca trong thực nghiệm: V2. Màu giá, vị trí hai nút và vị trí tổng tiền khác thiết kế, người dùng nhìn thấy ngay, nhưng assert vẫn Pass vì text và `testID` không đổi.
- Cách xử lý: Reject, mở bug, sửa code.

**Điểm quyết định.** Eyes chỉ phát hiện *khác biệt so với ảnh đã duyệt*, không biết khác biệt đó đúng hay sai. Con người phân loại nó. Vì vậy cùng một cơ chế cho ra cả false positive lẫn true regression.

**Đánh đổi khi cấu hình.** Ignore quá nhiều thì bỏ sót lỗi thật, ignore quá ít thì ngập false positive. Ví dụ: nếu ignore hẳn vùng ảnh sản phẩm, ảnh bị vỡ khung thật cũng không bị bắt. Dùng match level Layout cho vùng đó giữ được khả năng bắt lỗi bố cục, chỉ bỏ qua nội dung ảnh.

| | Functional (assert) | Visual (Eyes) |
|---|---|---|
| Bắt được | Sai chữ, sai số, thiếu phần tử, sai luồng | Lệch layout, sai màu, sai kích thước, vỡ hiển thị |
| Bỏ sót | Giao diện sai nhưng text và `testID` vẫn đúng (V2) | Lỗi logic không thể hiện trên màn hình |
| Báo thừa | Hiếm (phụ thuộc selector) | Cao nếu ảnh không ổn định hoặc ignore chưa đủ |
| Chi phí bảo trì | Sửa khi selector hoặc luồng đổi | Duyệt và Accept baseline mỗi khi UI đổi chủ ý |

## 8. Hạn chế và lưu ý

- Baseline gắn với môi trường (thiết bị, độ phân giải, tên test). Đổi AVD hoặc độ phân giải sẽ tạo baseline mới.
- Ảnh phải ổn định: cần chờ phần tử hiển thị và tắt animation trước khi chụp.
- Code dùng `eyes.close(false)` nên diff visual không làm test chức năng đỏ; từ 23/10 mỗi test in `# Eyes: <trạng thái> | ... | <link>` vào TAP, chi tiết xem trên dashboard. Không có khoá thì Eyes tắt và chỉ chạy functional (`createEyes()` trả `null`).
- Số lần chạy ít (1 lần mỗi bản), chưa đủ để kết luận về độ ổn định (flake rate) của test visual.
- Tọa độ vùng ignore status bar phụ thuộc độ phân giải AVD.
- Nếu lỡ Accept và Save trên lần chạy V1 hoặc V2, baseline bị ghi đè bằng giao diện variant và các lần chạy sau sẽ so sai; cần khôi phục baseline cũ hoặc tạo lại từ đầu.

## 9. Kết luận

Bốn lượt hợp lệ ngày 23/10/2026 cho thấy hai lớp trả lời hai câu khác nhau. Appium pass 8/8 trên cả base, V1 và V2, vì chữ, số và `testID` không đổi. Eyes pass 10/10 checkpoint ở base lần 2, rồi báo 5/10 lệch ở V1 và 6/10 ở V2, đúng các màn có ảnh hoặc style đã sửa. V2 là ca Appium bỏ sót và Eyes bắt được. V1 là ca Eyes báo thừa: đổi ảnh là chủ ý, nhưng vùng Layout khai báo trong code không được gắn vì selector `id=` sai, nên chưa có lượt nào chứng minh Layout khử được báo thừa đó. Giá trị của Eyes vì vậy phụ thuộc vào baseline đã Accept và vào việc vùng ignore/layout thực sự được gửi, không chỉ được viết trong mã.

## 10. Phụ lục bằng chứng

| Mục | Trạng thái |
|---|---|
| `eshop-sut-main/frontend-mobile/assets/product-v1.png` | Có |
| Ảnh dashboard base / V1 / V2 trong `docs/evidence/B1_B2_applitools-dashboard/` | Có. `batch_history_4_runs.png` cho thấy các lượt base Passed và V1/V2 Unresolved. Không có ảnh riêng của trạng thái New lúc vừa tạo baseline |
| Ảnh so sánh V2 (`v2_home_step.png`, `v2_cart_with_item_step.png`, `v2_search_step.png`) | Có |
| Hai ảnh "có / không layout region" | Có file, nhưng là cùng một bước dashboard, không phải hai lượt chạy |
| Log `src/appium/logs/20261023-065743/` (`base-1`, `base-2`, `v1`, `v2`) | Có. Thư mục `20261023-065159` là lượt hỏng `ECONNREFUSED`, không tính |
| `diffs/variant-v1.diff`, `diffs/variant-v2.diff` | Không có trong repo |
| Clip demo và `Demo_Video_Links.md` | Chưa có |
