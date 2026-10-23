# Diff Cards — Bộ câu hỏi

Bài tập phân loại kết quả so sánh hình ảnh (visual diff) của ứng dụng EShop mobile.

## Cách làm

Mỗi thẻ có một ảnh và một đoạn ngữ cảnh release.

- Trong ảnh: **bên trái là baseline** (bản đã duyệt), **bên phải là bản mới**.
- Dựa vào ảnh và ngữ cảnh release, chọn **một** quyết định:
  - **Accept**: thay đổi có chủ đích, cập nhật baseline.
  - **Reject**: lỗi thật, mở bug.
  - **Nhiễu**: không phải thay đổi của sản phẩm (hoặc chỉ là hệ quả dây chuyền của một thay đổi khác).
  - **Chưa đủ thông tin**: không thể quyết định nếu chưa hỏi thêm; nêu rõ cần hỏi gì.
- Viết lý do trong 1–2 câu.

Lưu ý chung: toast "Open debugger to view warnings." ở cuối màn hình xuất hiện ở **cả hai bên** của mọi thẻ (do bản debug), hãy bỏ qua nó.

Giữ nguyên thư mục `diff-cards/questions/` để ảnh hiển thị đúng.

---

## Thẻ 1

![Thẻ 1](diff-cards/questions/card1.png)

**Ngữ cảnh release:** Release 2.4.1 chỉ sửa chính tả một số nhãn trong màn Giỏ hàng. Không có thay đổi thiết kế nào ở màn Danh sách sản phẩm.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 2

![Thẻ 2](diff-cards/questions/card2.png)

**Ngữ cảnh release:** Release 2.4.1 sửa lỗi làm tròn tổng tiền trong giỏ hàng. Ticket không nhắc thay đổi giao diện nào.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 3

![Thẻ 3](diff-cards/questions/card3.png)

**Ngữ cảnh release:** Release 2.4.2, ticket MKT-118: marketing thay ảnh minh họa của sản phẩm "iPhone 15 Pro Max". Các sản phẩm khác không đổi.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 4

![Thẻ 4](diff-cards/questions/card4.png)

**Ngữ cảnh release:** Release 2.4.2: backend bắt đầu trả ảnh thật cho "iPhone 15 Pro Max"; các sản phẩm còn lại vẫn dùng ảnh tạm.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 5

![Thẻ 5](diff-cards/questions/card5.png)

**Ngữ cảnh release:** Release 2.5.0, ticket UI-190: "Cập nhật nút kêu gọi hành động (CTA) theo design system mới". Ticket chưa đính kèm spec chi tiết.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 6

![Thẻ 6](diff-cards/questions/card6.png)

**Ngữ cảnh release:** Release 2.5.0, ticket CART-77: làm nổi bật dòng "Tổng tạm tính" trong Giỏ hàng. Ticket không nhắc đến các nút ở cuối màn hình.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 7

![Thẻ 7](diff-cards/questions/card7.png)

**Ngữ cảnh release:** Release 2.6.0, ticket UI-204: làm mới thanh điều hướng theo brand mới (xanh đậm hơn, cao hơn một chút). Màn hình trong ảnh: Đăng nhập.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 8

![Thẻ 8](diff-cards/questions/card8.png)

**Ngữ cảnh release:** Cùng Release 2.6.0 với thẻ 7. Màn hình trong ảnh: Danh sách sản phẩm. Công cụ so sánh đánh dấu gần như toàn bộ trang.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 9

![Thẻ 9](diff-cards/questions/card9.png)

**Ngữ cảnh release:** Release 2.6.0, ticket UI-210: "Làm mới màn Giỏ hàng". Ticket chưa có ảnh thiết kế đính kèm.

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________

---

## Thẻ 10

![Thẻ 10](diff-cards/questions/card10.png)

**Ngữ cảnh release:** Release 2.6.1 chỉ chỉnh khoảng cách bên trong thẻ sản phẩm. Giá niêm yết không thay đổi (iPhone 15 Pro Max vẫn 30,000,000 ₫).

**Quyết định:** ☐ Accept ☐ Reject ☐ Nhiễu ☐ Chưa đủ thông tin

**Lý do:** ______________________________
