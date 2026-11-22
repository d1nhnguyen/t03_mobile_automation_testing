# Hoạt động trên lớp: Kahoot "Appium + Visual Diff Triage"

Hoạt động dùng trong buổi seminar là một Kahoot gồm **4 câu Appium** và **10 câu thẻ diff** lấy từ `docs/diff-cards/`. Nội dung dưới đây chép từ bản Kahoot đang dùng (sửa lần cuối 04/11/2026). Muốn xem câu hỏi kèm ảnh thì mở link Kahoot.

- **Link Kahoot:** https://create.kahoot.it/share/diffcards/58b34eaa-b377-4e90-bbe5-2c0f6a13e5f2
- **Cấu trúc:** 2 slide mở đầu, 4 câu Appium (mỗi câu có một slide giải thích), 10 câu thẻ diff. Tổng cộng 14 câu hỏi và 6 slide nội dung.
- **Thời gian trả lời:** câu Appium 20 giây, câu thẻ diff 30 giây. Phần giải thích đáp án và bảng xếp hạng nằm trong khung 25 phút của hoạt động.
- **Chế độ chơi:** cá nhân, tính điểm theo tốc độ.
- **Ảnh và đáp án chi tiết của thẻ diff:** `docs/diff-cards/DiffCards_Questions.md` và `DiffCards_AnswerKey.md`. Câu 5–14 của Kahoot lần lượt là thẻ 1–10.

## Mở đầu

1. **Giải thích:** Mỗi thẻ có một ảnh và một đoạn ngữ cảnh release. Trong mỗi ảnh, bên trái là baseline (bản đã duyệt), bên phải là bản mới.
2. **Bốn quyết định:**
   - **Accept:** thay đổi có chủ đích, cập nhật baseline.
   - **Reject:** lỗi thật, mở bug.
   - **Nhiễu:** không phải thay đổi của sản phẩm.
   - **Chưa đủ thông tin:** không thể quyết định nếu chưa hỏi thêm.

## Phần 1: Appium (4 câu, 20 giây mỗi câu)

| Câu | Câu hỏi | Đáp án đúng | Các đáp án nhiễu | Slide giải thích |
| --- | --- | --- | --- | --- |
| 1 | Việc nào phù hợp nhất để tự động hóa bằng Appium? | Chạy lại cùng kịch bản sau mỗi bản build | Khám phá màn hình mới chưa có kịch bản · Đánh giá app có dễ dùng không · Một ca chỉ chạy đúng một lần | **Tự động hoá hợp với việc lặp lại.** Kiểm thử hồi quy là việc lặp lại. Khám phá màn hình mới và đánh giá độ dễ dùng cần con người. Ca chỉ chạy một lần thì không đáng viết script. |
| 2 | Trong Appium 2, thành phần nào trực tiếp điều khiển app Android? | UiAutomator2 Driver | Appium Inspector · Test script WebdriverIO · Applitools Eyes | **Script → Appium server → Driver → App.** Script gửi lệnh HTTP tới server, server chuyển cho driver, và driver mới là bên bấm, gõ, đọc chữ trên app. Từ Appium 2, driver cài riêng. |
| 3 | Locator nào ổn định nhất cho nút "Thêm vào giỏ" trên EShop? | resource-id "product-add-1" | text("Thêm vào giỏ") · XPath theo vị trí · Tọa độ chạm (540, 1200) | **testID → resource-id.** id này không đổi khi đổi chữ hay đổi bố cục. Text gãy khi đổi ngôn ngữ. XPath và tọa độ gãy khi giao diện dịch chuyển. |
| 4 | Với test Appium, điều gì quyết định kết quả Pass hay Fail? | Assertion trong script | Emulator tự hiện thông báo · Appium Inspector · Không crash là Pass | **Appium chỉ điều khiển, assertion mới phán xét.** Thứ gì không được assert, như màu hay vị trí, thì Appium không phát hiện được. Câu này dẫn sang phần thẻ diff. |

## Phần 2: Thẻ diff (10 câu, 30 giây mỗi câu)

Mỗi câu có ảnh của thẻ tương ứng. Bốn lựa chọn luôn là Accept / Reject / Nhiễu / Chưa đủ thông tin.

| Câu | Thẻ | Ngữ cảnh release (đề trên Kahoot) | Đáp án |
| --- | --- | --- | --- |
| 5 | 1 | Release 2.4.1 chỉ sửa chính tả một số nhãn trong màn Giỏ hàng. Không có thay đổi thiết kế nào ở màn Danh sách sản phẩm | Reject |
| 6 | 2 | Release 2.4.1 sửa lỗi làm tròn tổng tiền trong giỏ hàng. Ticket không nhắc thay đổi giao diện nào | Reject |
| 7 | 3 | Release 2.4.2, ticket MKT-118: marketing thay ảnh minh họa của sản phẩm "iPhone 15 Pro Max". Các sản phẩm khác không đổi | Accept |
| 8 | 4 | Release 2.4.2: backend bắt đầu trả ảnh thật cho "iPhone 15 Pro Max"; các sản phẩm còn lại vẫn dùng ảnh tạm | Accept |
| 9 | 5 | Release 2.5.0, ticket UI-190: "Cập nhật nút kêu gọi hành động (CTA) theo design mới". Ticket chưa đính kèm spec chi tiết | Chưa đủ thông tin |
| 10 | 6 | Release 2.5.0, ticket CART-77: làm nổi bật dòng "Tổng tạm tính" trong Giỏ hàng. Ticket không nhắc đến các nút bấm | Reject |
| 11 | 7 | Release 2.6.0, ticket UI-204: làm mới thanh điều hướng theo brand mới (xanh đậm hơn, cao hơn một chút) | Accept |
| 12 | 8 | Cùng Release 2.6.0 với câu trên. Công cụ so sánh đánh dấu gần như toàn bộ trang | Accept (cùng nguyên nhân gốc với thẻ 7) |
| 13 | 9 | Release 2.6.0, ticket UI-210: "Làm mới màn Giỏ hàng". Ticket chưa có ảnh thiết kế đính kèm | Chưa đủ thông tin |
| 14 | 10 | Release 2.6.1 chỉ chỉnh khoảng cách bên trong thẻ sản phẩm | Reject |

Phân bố đáp án: 4 lỗi thật (thẻ 1, 2, 6, 10), 4 Accept (thẻ 3, 4, 7, 8, trong đó thẻ 8 là nhiễu dây chuyền của thẻ 7) và 2 thẻ mơ hồ (5, 9). Thẻ 1 và 2 trùng với bản V2 của demo, thẻ 3 cùng loại với V1. Lời giải thích từng thẻ nằm ở `docs/diff-cards/DiffCards_AnswerKey.md`.

## Ý chốt của người dẫn sau bảng xếp hạng (nói miệng, không có slide trên Kahoot)

1. **Hai lớp, hai câu hỏi.** Appium kiểm app *làm* đúng: ở thẻ 1 và 2, assert vẫn pass dù giao diện hỏng. Eyes kiểm app *trông* đúng: ở thẻ 10, visual dễ bỏ sót, còn assert bắt chắc.
2. **Có diff chưa chắc có bug.** Thẻ 3, 4, 7, 8 đều có vùng bị tô nhưng là thay đổi đúng.
3. **Quyết định theo ngữ cảnh release**, không theo diện tích vùng bị tô. Thiếu thông tin thì hỏi lại, đừng đoán.
