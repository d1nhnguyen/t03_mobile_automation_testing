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
| `[điền nếu có]` | Luồng gộp `checkout-flow.test.js` dùng cho clip demo |

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
4. Với V1, chạy thêm một lần **không có layout region** để minh họa false positive.

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
| Base lần 2 | Pass (8/8) | Pass 3/3 | 0/10 | 19.1297 s | Đối chứng |
| V1 | Pass (8/8) | Unresolved (3/3) | 5/10 | 20.9672 s | false positive vì thay đổi ảnh là tính năng đổi ảnh sản phẩm |
| V2 | Pass (8/8) | Unresolved (3/3) | 6/10 | 19.2640 s | true regression: Giao diện web bị lệch, các nút bấm bị đổi chỗ, màu, vị trí của 1 số thành phần web bị thay đổi |

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

- Ca trong thực nghiệm: V1 khi bỏ layout region. Eyes báo Unresolved ở vùng ảnh sản phẩm 1, trong khi đó là thay đổi nội dung hình ảnh hợp lệ, khung ảnh không đổi.
- Cách xử lý: Accept nếu thay đổi là chủ ý; hoặc đặt vùng đó ở mức Layout để các lần sau không báo nữa nhưng vẫn bắt được lỗi bố cục.
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
- Code dùng `eyes.close(false)` nên terminal không báo lỗi khi có diff visual; kết quả visual chỉ xem trên dashboard.
- Số lần chạy ít (1 lần mỗi bản), chưa đủ để kết luận về độ ổn định (flake rate) của test visual.
- Tọa độ vùng ignore status bar phụ thuộc độ phân giải AVD.
- Nếu lỡ Accept và Save trên lần chạy V1 hoặc V2, baseline bị ghi đè bằng giao diện variant và các lần chạy sau sẽ so sai; cần khôi phục baseline cũ hoặc tạo lại từ đầu.

## 9. Kết luận

`[điền sau khi có số liệu]` Gợi ý các ý cần nêu: (1) functional và visual bổ sung cho nhau, V2 là ca functional bỏ sót mà visual bắt được; (2) V1 cho thấy visual có thể báo thừa và cách giảm bằng Layout region; (3) giá trị của visual phụ thuộc vào chất lượng baseline và cấu hình match/ignore.

## 10. Phụ lục bằng chứng

- [ ] `diffs/variant-v1.diff`, `diffs/variant-v2.diff`
- [ ] `assets/product-v1.png`
- [ ] Ảnh dashboard: `EShop - base` ở trạng thái New (lần 1) và Passed (lần 2)
- [ ] Ảnh dashboard: `EShop - v1` (cả hai cấu hình layout region)
- [ ] Ảnh dashboard: `EShop - v2` kèm ảnh so sánh Baseline vs Checkpoint có vùng khác biệt được tô
- [ ] Log terminal từng lần chạy (`src/appium/logs/<timestamp>/`)
- [ ] Clip demo luồng phức tạp: chạy base, V1, V2 liên tiếp, thể hiện cả terminal lẫn dashboard
- [ ] Link/đường dẫn clip trong `Demo_Video_Links.md`
