# T03 Mobile Automation Testing - Đề xuất công cụ S1

**Phạm vi:** kiểm thử ứng dụng React Native Expo tại `eshop-sut/frontend-mobile` trên Android Emulator, kết hợp kiểm thử chức năng truyền thống và kiểm thử giao diện có hỗ trợ AI.

## Ma trận so sánh

| Công cụ                                      | Chi phí bản quyền                                                 | Độ khó học                                                                | Mức phù hợp với EShop                                                  | Khả năng AI                                                          | Cộng đồng                                                               |
| -------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Appium 2 + UiAutomator2** _(truyền thống)_ | Miễn phí, Apache-2.0                                              | Trung bình-cao; cần Node.js, JDK, Android SDK và WebDriver                | **Cao:** hỗ trợ Android native, emulator, thiết bị thật và device farm | Không tích hợp AI; cung cấp thao tác và assertion xác định           | **Rất lớn:** khoảng 22 nghìn sao GitHub; driver và Inspector chính thức |
| **Applitools Eyes** _(AI-augmented)_         | Thương mại; Starter 667 USD/tháng khi trả theo năm; trial 14 ngày | Trung bình; dễ gắn vào Appium nhưng cần quản lý baseline và ignore region | **Rất cao:** thêm visual checkpoint vào cùng luồng Appium              | Visual AI phát hiện khác biệt bố cục/nội dung và giảm nhiễu kết xuất | Tài liệu/SDK do hãng duy trì; tích hợp hơn 50 framework                 |
| **Maestro CLI + AI assertions** _(dự phòng)_ | CLI/Studio cục bộ miễn phí, mã nguồn mở; Cloud cần gói/trial      | Thấp-trung bình; YAML dễ đọc, tự động chờ                                 | **Rất cao:** hỗ trợ React Native, Expo, emulator và thiết bị thật      | Có `assertWithAI`, `assertNoDefectsWithAI` nhưng còn thử nghiệm      | **Lớn:** khoảng 15,6 nghìn sao GitHub; cập nhật thường xuyên            |

## Lựa chọn đề xuất

**Chọn Appium 2 + UiAutomator2 kết hợp Applitools Eyes; dùng Maestro làm phương án dự phòng nếu trial Applitools không bao phủ S3-S6.**

- Bám sát mục tiêu T03: Appium xác minh đăng nhập, tìm kiếm và dữ liệu sản phẩm; Eyes kiểm tra giao diện trang chủ/danh sách sản phẩm.
- Dùng chung một kịch bản EShop nên dễ chứng minh sự khác biệt giữa functional assertion và visual checkpoint trong demo.
- Có khả năng mở rộng lên device farm; locator `testID` và assertion chức năng được giữ làm lớp an toàn, tránh phụ thuộc hoàn toàn vào AI.

**Phạm vi demo dự kiến:** tạo Android development APK; cấu hình API `10.0.2.2:3000`; chạy luồng đăng nhập → tìm sản phẩm → xác minh kết quả → Eyes checkpoint; sau đó thay đổi ảnh động và màu giao diện để so sánh false positive với lỗi thật.

## AI Disclosure

Nhóm sử dụng **OpenAI Codex** để trích xuất tiêu chí S1, kiểm tra mã nguồn EShop và hỗ trợ soạn ma trận. Các thông tin về giấy phép, chi phí, hỗ trợ React Native/Appium, tính năng AI và quy mô cộng đồng được đối chiếu với tài liệu, bảng giá và repository chính thức. Nhóm chịu trách nhiệm kiểm tra trial, chạy proof of concept và biên tập bản cuối; không có kết quả kiểm thử hay phản hồi người dùng nào được tạo giả.

**Nguồn kiểm tra ngày 28/09/2026:** [Appium](https://github.com/appium/appium) · [UiAutomator2](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/) · [Applitools Mobile](https://applitools.com/solutions/mobile-testing/) · [Applitools Pricing](https://support.applitools.com/platform-pricing/) · [Maestro React Native](https://docs.maestro.dev/get-started/supported-platform/react-native) · [Maestro AI](https://docs.maestro.dev/reference/commands-available/assertwithai)
