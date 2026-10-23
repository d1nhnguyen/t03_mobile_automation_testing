# Visual Diff Triage Workshop — Activity Worksheet

Hoạt động trong lớp: 25 phút, 10 thẻ diff, làm cá nhân rồi chấm chéo.

> **Cần đối chiếu với deck của giảng viên.** File này được soạn theo yêu cầu B4, chưa dựa trên deck in-class của GV. Trước khi in, đối chiếu và sửa các mục sau cho khớp deck: (1) tên các nhãn phân loại, (2) thời lượng từng phần, (3) thang điểm chấm chéo, (4) câu hỏi minute paper, (5) thứ tự và số thẻ. Các chỗ này được đánh dấu **[khớp deck]** bên dưới.

**Cấu trúc file**

| Phần | Nội dung | Phát cho người chơi? |
|---|---|---|
| 1 | Luật chơi và phân bổ 25 phút | Có |
| 2 | Phiếu phân loại 10 thẻ | Có |
| 3 | Mẫu policy ignore region cho banner Home (bản trống) | Có |
| 4 | Minute paper | Có |
| 5 | Đáp án, lý do một dòng, rubric chấm chéo | **Không** (chỉ GV và nhóm tổ chức) |
| 6 | Mẫu biên bản dry-run | Không |

Khi in, tách phần 5 và 6 thành tờ riêng.

---

## 1. Luật chơi

### Mục tiêu
Học cách **phân loại kết quả so sánh hình ảnh** thay vì bấm Accept hoặc Reject theo cảm tính. Công cụ chỉ báo "có khác biệt"; người duyệt phải quyết định khác biệt đó là gì.

### Bộ thẻ
10 thẻ, mỗi thẻ gồm: một ảnh (**trái là baseline, phải là bản mới**), 1–2 dòng ngữ cảnh release. Ảnh nằm trong `diff-cards/questions/card1.png` đến `card10.png`. Toast "Open debugger to view warnings." có ở cả hai bên mọi thẻ, hãy bỏ qua.

### Bốn nhãn phân loại **[khớp deck]**

| Nhãn | Dùng khi |
|---|---|
| **Accept** | Thay đổi **có chủ đích**, khớp với ngữ cảnh release. Cập nhật baseline |
| **Reject** | **Lỗi thật**: thay đổi không nằm trong phạm vi release, hoặc làm hỏng giao diện hay dữ liệu |
| **Nhiễu** | Không phải thay đổi của sản phẩm, hoặc chỉ là hệ quả dây chuyền của một thay đổi khác đã duyệt |
| **Chưa đủ thông tin** | Không thể quyết định nếu chưa hỏi thêm. **Phải nêu rõ cần hỏi gì** |

### Quy tắc
1. Làm **một mình**, không trao đổi, không tra cứu.
2. Mỗi thẻ: chọn **một** nhãn và viết **một dòng lý do** dẫn chứng cụ thể (nhìn thấy gì trong ảnh, khớp hay không khớp với ngữ cảnh release).
3. Không biết thì chọn "Chưa đủ thông tin" nhưng phải ghi câu hỏi cần hỏi. Chọn nhãn này mà không ghi câu hỏi thì không có điểm lý do.
4. Quyết định dựa vào **ngữ cảnh release**, không dựa vào lượng vùng bị tô màu: một thay đổi nhỏ có thể làm cả trang bị tô.
5. Không sửa đáp án sau khi vào phần chấm chéo.

### Phân bổ 25 phút **[khớp deck]**

| Thời gian | Hoạt động |
|---|---|
| 0:00–2:00 | Giới thiệu luật chơi và 4 nhãn |
| 2:00–14:00 | Phân loại 10 thẻ cá nhân (khoảng 70 giây một thẻ) |
| 14:00–18:00 | Chấm chéo theo đáp án và rubric (phần 5) |
| 18:00–21:00 | Thảo luận các thẻ mơ hồ; điền mẫu policy ignore region (phần 3) |
| 21:00–25:00 | Minute paper (phần 4) |

---

## 2. Phiếu phân loại (phát cho người chơi)

Họ tên (hoặc mã số): ______________________  Người chấm chéo: ______________________

| Thẻ | Màn hình | Ngữ cảnh release (tóm tắt) | Accept | Reject | Nhiễu | Chưa đủ TT | Lý do một dòng (hoặc câu hỏi cần hỏi) |
|---|---|---|:-:|:-:|:-:|:-:|---|
| 1 | Danh sách sản phẩm | 2.4.1: chỉ sửa chính tả nhãn ở màn Giỏ hàng | ☐ | ☐ | ☐ | ☐ | |
| 2 | Giỏ hàng | 2.4.1: sửa lỗi làm tròn tổng tiền; không nhắc thay đổi giao diện | ☐ | ☐ | ☐ | ☐ | |
| 3 | Danh sách sản phẩm | 2.4.2, MKT-118: marketing thay ảnh sản phẩm iPhone 15 Pro Max | ☐ | ☐ | ☐ | ☐ | |
| 4 | Danh sách sản phẩm | 2.4.2: backend trả ảnh thật cho iPhone 15 Pro Max | ☐ | ☐ | ☐ | ☐ | |
| 5 | Danh sách sản phẩm | 2.5.0, UI-190: cập nhật nút CTA theo design system mới; chưa có spec | ☐ | ☐ | ☐ | ☐ | |
| 6 | Giỏ hàng | 2.5.0, CART-77: làm nổi bật dòng Tổng tạm tính; không nhắc các nút | ☐ | ☐ | ☐ | ☐ | |
| 7 | Đăng nhập | 2.6.0, UI-204: làm mới thanh điều hướng (xanh đậm hơn, cao hơn) | ☐ | ☐ | ☐ | ☐ | |
| 8 | Danh sách sản phẩm | 2.6.0 (cùng release thẻ 7); gần như cả trang bị tô | ☐ | ☐ | ☐ | ☐ | |
| 9 | Giỏ hàng | 2.6.0, UI-210: làm mới màn Giỏ hàng; chưa có ảnh thiết kế | ☐ | ☐ | ☐ | ☐ | |
| 10 | Danh sách sản phẩm | 2.6.1: chỉ chỉnh khoảng cách trong thẻ; giá niêm yết không đổi | ☐ | ☐ | ☐ | ☐ | |

---

## 3. Mẫu policy ignore region cho banner Home (phát bản trống)

### 3.1. Vì sao cần policy
Banner thường đổi theo chiến dịch. Nếu không có quy tắc, mỗi lần đổi banner lại tạo diff giả. Nếu **ignore quá tay**, lỗi thật trong vùng đó cũng không bị bắt. Policy ghi lại quyết định một lần, có lý do và có người chịu trách nhiệm.

### 3.2. Ba lựa chọn cho một vùng động

| Lựa chọn | Hành vi | Nên dùng khi | Rủi ro |
|---|---|---|---|
| **Ignore** | Bỏ hẳn vùng khỏi phép so sánh | Nội dung hoàn toàn không liên quan chất lượng giao diện (ví dụ giờ ở status bar) | Lỗi thật trong vùng không bao giờ bị bắt |
| **Layout** | Chỉ so bố cục, bỏ qua nội dung chữ và ảnh | Nội dung đổi thường xuyên nhưng khung phải ổn định (**khuyến nghị cho banner**) | Không bắt được lỗi nội dung (sai chữ, sai giá) trong vùng |
| **Accept thủ công** | Duyệt từng lần đổi | Thay đổi hiếm, mỗi lần cần người xem | Tốn công; dễ Accept nhầm khi mệt |

### 3.3. Mẫu trống (điền trong phần thảo luận)

| Trường | Nội dung |
|---|---|
| Tên vùng | |
| Màn hình / checkpoint áp dụng | |
| Cách xác định vùng (testID, accessibility id hoặc tọa độ) | |
| Lựa chọn (Ignore / Layout / Accept thủ công) | |
| Lý do chọn | |
| Điều vẫn phải bắt được trong vùng này | |
| Điều chấp nhận bỏ qua | |
| Người chịu trách nhiệm duyệt | |
| Ngày xem lại policy | |
| Dấu hiệu phải siết lại policy (ví dụ banner vỡ khung vẫn không bị báo) | |

### 3.4. Ví dụ đã điền cho EShop (dùng khi chấm thảo luận)

EShop mobile hiện **chưa có banner riêng** trên màn Home. Vùng tương đương trong thực nghiệm B2 là **ảnh sản phẩm của sản phẩm id 1**, và nó được xử lý đúng theo mẫu này.

| Trường | Nội dung |
|---|---|
| Tên vùng | Ảnh sản phẩm id 1 (thay cho banner Home) |
| Màn hình / checkpoint áp dụng | Home sau đăng nhập, Home trước khi tìm kiếm, kết quả tìm kiếm (nếu sản phẩm 1 có mặt) |
| Cách xác định vùng | `testID` `product-image-1` (wrapper `View` quanh ảnh) |
| Lựa chọn | **Layout** (không Ignore) |
| Lý do chọn | Marketing và backend đổi ảnh thường xuyên (thẻ 3, 4). Layout bỏ qua nội dung ảnh nhưng vẫn bắt khung ảnh bị lệch hoặc đổi kích thước |
| Điều vẫn phải bắt được trong vùng này | Khung ảnh đổi kích thước, lệch vị trí, đẩy các phần tử bên dưới |
| Điều chấp nhận bỏ qua | Nội dung bên trong ảnh |
| Người chịu trách nhiệm duyệt | `[điền: tên hoặc vai trò]` |
| Ngày xem lại policy | `[điền]` |
| Dấu hiệu phải siết lại | Ảnh vỡ hoặc méo nhưng vẫn qua; khi đó chuyển sang so Strict và Accept thủ công |

Ghi chú cấu hình tham khảo (đã dùng trong B2): `Target.window().ignoreRegions(STATUS_BAR).layoutRegions(<phần tử product-image-1>)`. Status bar dùng **Ignore** vì nội dung của nó (giờ, pin) không liên quan chất lượng giao diện.

Lưu ý: policy **không** che giá, tên sản phẩm hay nút. Vùng này chỉ gồm ảnh, nên thẻ 10 (giá sai) vẫn bị phát hiện.

---

## 4. Minute paper (phát cho người chơi, nộp ẩn danh)

Viết ngắn, 1–2 câu mỗi mục. Không cần ghi tên.

1. Điều quan trọng nhất bạn học được hôm nay là gì?
   ______________________________
2. Điều gì bạn vẫn còn mơ hồ hoặc muốn hỏi thêm?
   ______________________________
3. Thẻ nào khó nhất với bạn, và vì sao?
   ______________________________
4. Nếu được đổi một điều trong buổi này, bạn sẽ đổi gì? (tùy chọn)
   ______________________________

**[khớp deck]** Thay bằng câu hỏi minute paper trong deck của GV nếu khác. Giữ nguyên số lượng và nội dung câu hỏi khi thu thập để B5 tổng hợp được thống nhất.

---

# CHỈ DÙNG CHO GIẢNG VIÊN VÀ NHÓM TỔ CHỨC

## 5. Đáp án, rubric chấm chéo

### 5.1. Đáp án và lý do một dòng

| Thẻ | Đáp án | Lý do một dòng |
|---|---|---|
| 1 | **Reject** | Giá đổi màu tím và to hơn, hàng nút bị đẩy xuống, nút "Thêm vào giỏ" đổi sang đỏ, trong khi release chỉ sửa chính tả ở màn khác |
| 2 | **Reject** | Tổng tiền chuyển sang căn trái và nút đổi sang cam dù ticket chỉ nói về làm tròn số tiền; chữ vẫn đúng nên chỉ kiểm tra hình ảnh bắt được |
| 3 | **Accept** | Chỉ vùng ảnh sản phẩm 1 đổi, đúng ticket MKT-118; khung ảnh, tên, giá, nút giữ nguyên |
| 4 | **Accept** | Sản phẩm 1 chuyển từ ảnh tạm sang ảnh thật theo ngữ cảnh; bố cục không đổi |
| 5 | **Chưa đủ thông tin** | Nút bo tròn có thể thuộc ticket nhưng màu và cỡ giá, vị trí hàng nút thì không; cần hỏi thiết kế về phạm vi (mặc định Reject phần ngoài ticket) |
| 6 | **Reject** | Khung tổng tiền nổi bật đúng ticket, nhưng nút thanh toán đổi màu và đè lên nút "Mua tiếp", không được yêu cầu |
| 7 | **Accept** | Thanh điều hướng đậm hơn và cao hơn đúng ticket UI-204; phần nội dung bên dưới chỉ dịch xuống |
| 8 | **Accept** cùng thẻ 7 (hoặc **Nhiễu**) | Cùng nguyên nhân gốc là thanh điều hướng cao hơn; mọi thứ bên dưới chỉ dịch theo nên cả trang bị tô, duyệt một lần cùng thẻ 7 |
| 9 | **Chưa đủ thông tin** | "Làm mới" bao hàm nhiều thay đổi nhưng nút thanh toán đè lên nút khác; cần hỏi thiết kế và vị trí nút có đúng không |
| 10 | **Reject** | Chỉ giá đổi (30,000,000 lên 40,000,000 và 28,000,000 lên 38,000,000) trong khi giá niêm yết không đổi; vùng bị tô rất nhỏ nên dễ bị cho qua |

**Phân bố:** 4 lỗi thật (1, 2, 6, 10), 3 có chủ đích (3, 4, 7), 1 nhiễu dây chuyền (8), 2 mơ hồ (5, 9). Đáp án đầy đủ kèm ảnh diff nằm trong `DiffCards_AnswerKey.md`.

### 5.2. Chấp nhận đáp án thay thế

| Thẻ | Đáp án thay thế được chấp nhận | Điều kiện |
|---|---|---|
| 5 | Reject | Lý do nêu rõ phần nào ngoài phạm vi ticket (màu giá, vị trí hàng nút) |
| 8 | Nhiễu hoặc Accept | Lý do nêu được nguyên nhân gốc là thanh điều hướng ở thẻ 7 |
| 9 | Reject | Lý do nêu rõ nút chồng lấn là phần nghi lỗi |

### 5.3. Rubric chấm chéo (mỗi thẻ tối đa 2 điểm, cả phiếu 20 điểm) **[khớp deck]**

| Tiêu chí | 0 điểm | 1 điểm | (thêm) 1 điểm |
|---|---|---|---|
| **Nhãn** | Sai nhãn so với đáp án (hoặc đáp án thay thế) | Đúng nhãn | |
| **Lý do** | Không có lý do, hoặc nêu chung chung ("trông khác") | Có dẫn chứng cụ thể từ ảnh **hoặc** từ ngữ cảnh release | Dẫn chứng cả hai, hoặc nêu đúng nguyên nhân gốc |

Quy tắc chấm:
- Thẻ 5 và 9: chọn "Chưa đủ thông tin" **kèm câu hỏi cụ thể** mới được điểm lý do. Không ghi câu hỏi thì 0 điểm lý do dù nhãn đúng.
- Thẻ 10: lý do nhận 1 điểm thêm nếu đề cập kiểm tra chữ (assert) hoặc việc vùng khác biệt quá nhỏ dễ bị bỏ sót.
- Thẻ 8: lý do nhận 1 điểm thêm nếu liên hệ với thẻ 7.
- Không trừ điểm vì viết dài hay chính tả.

### 5.4. Mức đánh giá tổng

| Tổng điểm (trên 20) | Nhận xét |
|---|---|
| 17–20 | Phân loại chắc, lý do có dẫn chứng |
| 12–16 | Nắm cách phân loại, còn lỡ ở thẻ mơ hồ hoặc lý do chung chung |
| 7–11 | Cần đọc lại ngữ cảnh release trước khi quyết định |
| 0–6 | Đang quyết định theo cảm giác hình ảnh; xem lại luật 4 |

### 5.5. Quy trình chấm chéo (4 phút)
1. Đổi phiếu với bạn bên cạnh.
2. Người chấm đọc đáp án ở 5.1 và chấm từng thẻ theo 5.3.
3. Ghi điểm từng thẻ và tổng điểm trên phiếu, rồi trả lại.
4. Mọi thắc mắc về điểm hỏi GV, không tự thương lượng.

---

## 6. Biên bản dry-run (mẫu, điền sau khi chạy thử)

Dry-run với **một người ngoài nhóm** (không tham gia soạn bộ thẻ), tổng thời gian không quá 25 phút. Không điền số ước đoán; ghi đúng thời gian đo thật.

| Trường | Nội dung |
|---|---|
| Ngày giờ | |
| Người chạy thử (vai trò, không cần tên thật) | |
| Người quan sát / bấm giờ | |
| Hình thức (trực tiếp hoặc từ xa) | |

### 6.1. Thời gian thực tế

| Phần | Dự kiến | Thực tế | Ghi chú |
|---|---|---|---|
| Luật chơi | 2 phút | | |
| Phân loại 10 thẻ | 12 phút | | |
| Chấm chéo | 4 phút | | |
| Thảo luận + policy | 3 phút | | |
| Minute paper | 4 phút | | |
| **Tổng** | **25 phút** | | |

### 6.2. Quan sát

| Câu hỏi | Ghi nhận |
|---|---|
| Thẻ nào làm người chạy thử mất nhiều thời gian nhất? | |
| Chỗ nào luật chơi hoặc nhãn bị hiểu sai? | |
| Thẻ nào người chạy thử trả lời khác đáp án? Lý do họ đưa ra? | |
| Rubric có chấm được không, chỗ nào gây tranh cãi? | |
| Mẫu policy có điền được trong thời gian cho phép không? | |

### 6.3. Điều chỉnh sau dry-run

| Vấn đề | Thay đổi đã làm | Đã cập nhật vào file |
|---|---|---|
| | | ☐ |

**Kết luận:** (hoạt động có hoàn thành trong 25 phút không; nếu vượt, phần nào đã cắt)
