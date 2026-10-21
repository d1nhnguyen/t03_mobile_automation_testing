# Tóm tắt kịch bản Seminar T03 Mobile Automation Testing

## Mục tiêu

Nhóm trình bày cách kết hợp kiểm thử chức năng truyền thống và kiểm thử giao diện có hỗ trợ AI trên ứng dụng React Native Expo của EShop. Người tham dự sẽ hiểu kiến trúc Appium, phân biệt functional assertion với visual checkpoint và biết cách phân loại kết quả visual diff.

## Công cụ và phạm vi

- **Truyền thống:** Appium 2 + UiAutomator2.
- **AI-augmented:** Applitools Eyes.
- **Đối sánh theo yêu cầu T03:** chạy cùng luồng login + search bằng Detox và Appium, ghi nhận khác biệt DX; phần này không cần đưa vào live demo.
- **SUT:** `eshop-sut/frontend-mobile`, chạy bằng Android development APK trên emulator.
- **Kịch bản:** đăng nhập → tìm sản phẩm → xác minh kết quả → visual checkpoint.

## Kế hoạch 45 phút

| Thời gian | Nội dung |
|---|---|
| 0–10 phút | Giới thiệu khó khăn của mobile testing, kiến trúc Appium, vai trò của Visual AI và lý do chọn bộ công cụ |
| 10–20 phút | Live demo Appium và Applitools trên EShop |
| 20–40 phút | Hoạt động phân loại visual diff và thiết kế quy tắc ignore region/baseline |
| 40–45 phút | Tổng kết, Q&A và thu minute paper |

## Live demo

Nhóm chạy Appium test để đăng nhập, tìm kiếm và xác minh dữ liệu sản phẩm. Sau đó, cùng kịch bản được bổ sung Applitools Eyes checkpoint. Nhóm tạo hai thay đổi giao diện có kiểm soát:

- Thay đổi ảnh động nhưng giữ nguyên bố cục để minh họa false positive và ignore region hợp lý.
- Thay đổi màu hoặc bố cục ngoài yêu cầu để minh họa regression dù functional test vẫn pass.

Nhóm cũng ghi nhận kết quả chạy cùng luồng login + search bằng Detox để so sánh DX với Appium.

Thông điệp chính: **Appium xác minh hành vi của người dùng; Applitools kiểm tra thứ người dùng nhìn thấy. Hai lớp kiểm thử bổ sung cho nhau.**

## Hoạt động dành cho lớp

Mỗi nhóm nhận 10 visual diff cards và phân loại thành `lỗi thật`, `false positive/nhiễu` hoặc `thay đổi có chủ đích`. Sau đó, nhóm đề xuất ba quy tắc:

1. Vùng nào có thể ignore.
2. Vùng nào không được ignore, như giá, tổng tiền, CTA và thông báo lỗi.
3. Điều kiện và người phê duyệt việc cập nhật baseline.

## Nội dung thảo luận

- XPath dài dễ hỏng; nên ưu tiên `testID` và accessibility label.
- Mobile test có thể flaky do animation, mạng, trạng thái thiết bị hoặc dữ liệu chưa reset.
- Visual AI có thể báo nhiễu; ignore region quá rộng có thể che lỗi thật.
- Visual AI không thay thế assertion nghiệp vụ về dữ liệu, giá và quyền truy cập.

## Chuẩn bị và kết quả dự kiến

Nhóm chuẩn bị sẵn APK, dữ liệu seed, tài khoản demo, baseline và hai phiên bản giao diện; toàn bộ demo được chạy thử ít nhất ba lần. Kết quả seminar gồm một Appium functional test, một visual AI checkpoint, bộ 10 diff cards có đáp án và ba failure mode thực tế.

Nếu demo gặp sự cố, nhóm sử dụng emulator dự phòng và ảnh/log từ lần chạy thật gần nhất.
