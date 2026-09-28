# Kịch bản seminar T03 Mobile Automation Testing

## 1. Thông tin chung

- **Chủ đề:** T03 Mobile Automation Testing - Appium truyền thống và kiểm thử trực quan có hỗ trợ AI.
- **Thời lượng:** 45 phút.
- **Hệ thống được kiểm thử:** ứng dụng React Native Expo trong `eshop-sut/frontend-mobile`.
- **Công cụ chính:** Appium 2, UiAutomator2, Android Emulator và Applitools Eyes.
- **Phương án dự phòng:** Maestro CLI với `assertWithAI` nếu Applitools trial không khả dụng.
- **Kết quả cần đạt:** người nghe hiểu kiến trúc mobile automation, quan sát được một luồng kiểm thử thật trên EShop và tự phân loại được các kết quả visual diff.

Buổi seminar phải thể hiện trực tiếp ít nhất một tính năng của công cụ truyền thống và một tính năng của công cụ AI. Phần demo sử dụng terminal/IDE và emulator thật, không dùng video dựng sẵn để thay thế cho demo chính.

## 2. Mục tiêu học tập

Sau buổi seminar, người tham dự có thể:

1. Giải thích vai trò của Appium Server, UiAutomator2, Android Emulator, test client và ứng dụng EShop.
2. Phân biệt functional assertion với visual AI checkpoint.
3. Hiểu vì sao locator ổn định như `testID` tốt hơn XPath phụ thuộc cấu trúc giao diện.
4. Nhận biết ba loại kết quả visual diff: lỗi thật, nhiễu/false positive và thay đổi có chủ đích.
5. Đề xuất chính sách ignore region và cập nhật baseline mà không che giấu regression.
6. Nêu được ít nhất ba giới hạn của mobile automation và visual AI.

## 3. Phân vai trong nhóm

| Vai trò | Trách nhiệm trước buổi học | Trách nhiệm trong seminar |
|---|---|---|
| Người trình bày | Hoàn thiện nội dung kiến trúc và so sánh công cụ | Dẫn phần mở đầu 10 phút, kết nối các phần và quản lý Q&A |
| Người demo | Chuẩn bị emulator, APK, backend, Appium và Eyes | Thực hiện demo trực tiếp, giải thích log và kết quả |
| Người điều phối hoạt động | Chuẩn bị diff cards, worksheet và đáp án | Chia nhóm, bấm giờ, thu câu trả lời và dẫn phần thảo luận |
| Người kiểm soát thời gian/kỹ thuật | Kiểm tra thiết bị, mạng, tài khoản và bản sao dự phòng | Báo mốc thời gian, xử lý sự cố và ghi lại câu hỏi chưa trả lời |

Nếu nhóm chỉ có ba thành viên, người trình bày kiêm kiểm soát thời gian. Mỗi thành viên vẫn phải tự chạy được toàn bộ demo trong buổi tập dượt.

## 4. Chuẩn bị trước seminar

### 4.1 Môi trường kỹ thuật

- Android Studio và một AVD ổn định, ưu tiên Pixel với API 33 hoặc 34.
- Backend EShop chạy tại cổng `3000` và có dữ liệu sản phẩm cố định.
- Mobile app dùng API URL `http://10.0.2.2:3000/api` khi chạy trên Android Emulator.
- Android development APK có package name cố định; không phụ thuộc vào Expo Go trong demo.
- Appium 2 và driver UiAutomator2 đã được cài đặt; `appium driver doctor uiautomator2` không báo lỗi nghiêm trọng.
- Test client và reporter đã được khóa phiên bản trong project automation.
- Các thành phần đăng nhập, tìm kiếm và kết quả sản phẩm có `testID`/accessibility label ổn định.
- `APPLITOOLS_API_KEY` nằm trong biến môi trường, không xuất hiện trong source code, slide hoặc log trình chiếu.

### 4.2 Dữ liệu demo cố định

- Một tài khoản hợp lệ dành riêng cho demo.
- Một từ khóa chắc chắn có kết quả, ví dụ tên của sản phẩm seed trong cơ sở dữ liệu.
- Một từ khóa không có kết quả để minh họa empty state nếu còn thời gian.
- Baseline Eyes đã được tạo và phê duyệt trên đúng device profile trước buổi seminar.
- Hai thay đổi giao diện có kiểm soát:
  - **Thay đổi A:** ảnh banner/sản phẩm động thay đổi nhưng bố cục không đổi.
  - **Thay đổi B:** màu nút chính hoặc bố cục bị thay đổi ngoài mong đợi.
- Nên chuẩn bị sẵn hai APK hoặc hai build variant để chuyển đổi nhanh; không sửa code ứng biến trong lúc demo.

### 4.3 Tài liệu cho hoạt động lớp

- Mười visual diff cards, đánh số D01-D10.
- Một phiếu trả lời cho mỗi nhóm 3-4 sinh viên.
- Ba nhãn phân loại: `Lỗi thật`, `False positive/Nhiễu`, `Thay đổi có chủ đích`.
- Một trang đáp án dành cho người điều phối.
- Đồng hồ đếm ngược hiển thị trên màn hình.

### 4.4 Kiểm tra theo thời điểm

**Trước ba ngày:** chia sẻ user guide, screencast, worksheet và slide theo quy định; xác nhận tài khoản trial còn hiệu lực.

**Trước một ngày:** chạy toàn bộ luồng ba lần, ghi thời gian và flake rate; chụp sẵn ảnh kết quả để dùng khi dashboard mạng chậm; kiểm tra không có thông tin bí mật trong ảnh.

**Trước giờ học 30 phút:** khởi động backend, emulator và Appium; kiểm tra `adb devices`; đăng nhập Eyes; đóng thông báo hệ điều hành; đặt emulator ở đúng độ phân giải; khôi phục database về dữ liệu seed.

## 5. Kịch bản chi tiết 45 phút

### 5.1 Phần 1 - Giới thiệu và kiến thức nền 0:00-10:00

| Thời gian | Người thực hiện | Nội dung và lời dẫn gợi ý | Màn hình/đạo cụ |
|---|---|---|---|
| 0:00-1:00 | Người trình bày | Mở đầu bằng câu hỏi: “Một test đăng nhập chạy đúng có chứng minh nút đăng nhập không bị che, chữ không bị cắt và màu cảnh báo vẫn đúng không?” Chốt: functional test và visual test trả lời hai nhóm câu hỏi khác nhau. | Slide tiêu đề và một ảnh giao diện có lỗi dễ thấy |
| 1:00-2:30 | Người trình bày | Nêu vấn đề của mobile testing: nhiều phiên bản OS, kích thước màn hình, bàn phím ảo, animation, mạng và view hierarchy. Liên hệ trực tiếp với EShop React Native Expo. | Slide “Vì sao mobile khó hơn web” |
| 2:30-4:30 | Người trình bày | Giải thích luồng Appium: test client gửi lệnh WebDriver đến Appium Server; server chuyển lệnh cho UiAutomator2; UiAutomator2 thao tác trên app trong emulator; kết quả trả lại test runner. | Sơ đồ kiến trúc 5 thành phần |
| 4:30-6:00 | Người trình bày | Trình bày Appium kiểm tra điều gì: tìm phần tử, nhập dữ liệu, nhấn nút, chờ trạng thái và xác minh text/data. Nhấn mạnh tránh XPath dài; ưu tiên `testID`. | Ví dụ locator tốt và locator dễ vỡ |
| 6:00-7:30 | Người trình bày | Giải thích Applitools Eyes: chụp checkpoint, so với baseline và trả về vùng khác biệt. Nêu rõ Visual AI không thay thế functional assertion và kết quả vẫn cần con người phân loại. | Một baseline và một diff mẫu |
| 7:30-9:00 | Người trình bày | So sánh ngắn Appium, Applitools và Maestro theo chi phí, độ khó, EShop fit và AI. Nêu lý do chọn Appium + Eyes, Maestro là backup. | Bảng rút gọn từ S1 |
| 9:00-10:00 | Người trình bày | Giới thiệu demo: “Chúng tôi sẽ đăng nhập, tìm sản phẩm bằng Appium, sau đó dùng cùng luồng để phát hiện thay đổi giao diện bằng Eyes.” Chuyển sang terminal, không dừng để hỏi đáp. | Slide mục tiêu demo rồi chuyển IDE |

### 5.2 Phần 2 - Live demo trên EShop 10:00-20:00

#### Trạng thái ban đầu

- Emulator đang ở màn hình Home hoặc đã đóng app.
- Backend và Appium đã chạy nhưng cửa sổ terminal vẫn hiển thị để khán giả thấy đây là phiên thật.
- Không mở sẵn kết quả test cuối cùng. Dashboard Eyes có thể đăng nhập sẵn để tiết kiệm thời gian.

| Thời gian | Thao tác demo | Điều cần nói và bằng chứng cần chỉ ra |
|---|---|---|
| 10:00-10:45 | Chạy kiểm tra nhanh `adb devices`, endpoint backend và trạng thái Appium. | Giải thích ba kiểm tra này tách lỗi hạ tầng khỏi lỗi test. Không đọc toàn bộ log. |
| 10:45-11:30 | Mở file test và chỉ ra capabilities, package name, `automationName: UiAutomator2` và các locator `testID`. | Chỉ giải thích các dòng quyết định, không giảng code từng dòng. API key phải được lấy từ environment. |
| 11:30-14:30 | Chạy test chức năng Appium: khởi chạy app, mở đăng nhập, nhập tài khoản, submit, quay về Home, tìm sản phẩm và xác minh kết quả. | Khán giả phải thấy thao tác thật trên emulator. Chỉ ra assertion đăng nhập thành công, tên sản phẩm và số lượng kết quả. Đây là tính năng truyền thống bắt buộc. |
| 14:30-15:30 | Mở report/log của lần chạy vừa hoàn tất. | Chỉ ra thời gian chạy, trạng thái pass và ảnh chụp khi lỗi nếu reporter có hỗ trợ. Nhấn mạnh pass chức năng chưa đảm bảo giao diện đúng. |
| 15:30-17:00 | Chạy cùng luồng có Eyes checkpoint trên bản baseline hoặc bản có thay đổi ảnh động. | Chỉ ra tên app, tên test, device profile và checkpoint. Nếu dùng ignore region/Layout mode, nói rõ vùng nào được bỏ qua và lý do. Đây là tính năng AI bắt buộc. |
| 17:00-18:30 | Chuyển sang build có thay đổi màu/bố cục ngoài mong đợi và chạy lại visual checkpoint. | Kỳ vọng functional assertion vẫn pass nhưng Eyes báo `Unresolved/Failed`. Đây là thông điệp trọng tâm: hai lớp kiểm thử bắt được hai loại lỗi khác nhau. |
| 18:30-19:30 | Mở dashboard Eyes và phóng to vùng diff. | Xác định đây là lỗi thật, không bấm “Accept baseline”. Giải thích việc cập nhật baseline tùy tiện sẽ hợp thức hóa regression. |
| 19:30-20:00 | Tổng kết demo bằng hai dòng. | “Appium chứng minh người dùng hoàn thành được hành vi. Eyes kiểm tra thứ người dùng thực sự nhìn thấy. Hai kết quả phải được đọc cùng nhau.” |

#### Tên lệnh mục tiêu

Tên script cần được đồng bộ với project automation ở S3; có thể chuẩn hóa như sau:

```powershell
adb devices
appium driver doctor uiautomator2
npm run test:mobile:functional
npm run test:mobile:visual
```

Không gõ hoặc hiển thị API key trực tiếp. Nếu test mất hơn 90 giây mà không có tiến triển, người kiểm soát thời gian chuyển sang quy trình dự phòng trong Mục 7.

### 5.3 Phần 3 - Hoạt động Visual Diff Triage 20:00-40:00

#### Mục tiêu hoạt động

Mỗi nhóm phân loại các visual diff và xây dựng một chính sách ignore region cho trang Home của EShop. Hoạt động được rút gọn còn 20 phút để khớp khung seminar chung.

| Thời gian | Hoạt động | Hướng dẫn của người điều phối |
|---|---|---|
| 20:00-22:00 | Chia nhóm và hướng dẫn | Mỗi nhóm nhận 10 diff cards. Với mỗi card, chọn một trong ba nhãn và viết một lý do ngắn. Không được chọn “ignore” chỉ vì chưa hiểu khác biệt. |
| 22:00-30:00 | Các nhóm phân loại | Người điều phối đi quanh lớp, chỉ trả lời câu hỏi về ngữ cảnh, không tiết lộ đáp án. Khi còn hai phút phải thông báo. |
| 30:00-34:30 | Công bố đáp án | Hiển thị lần lượt đáp án. Tập trung thảo luận các card có khả năng gây nhầm lẫn thay vì đọc lại toàn bộ worksheet. |
| 34:30-38:00 | Thiết kế chính sách ignore region | Mỗi nhóm viết ba quy tắc: vùng nào có thể bỏ qua, vùng nào tuyệt đối không bỏ qua và ai được phép cập nhật baseline. |
| 38:00-39:30 | Chia sẻ nhanh | Chọn 2-3 nhóm, mỗi nhóm trình bày một quy tắc trong tối đa 30 giây. |
| 39:30-40:00 | Chốt kiến thức | Visual AI giảm công sức viết assertion nhưng tạo thêm công việc triage; ignore region phải dựa trên chính sách, không dựa trên sự tiện lợi. |

#### Bộ diff cards và đáp án cho người điều phối

| Mã | Tình huống | Phân loại dự kiến | Lý do |
|---|---|---|---|
| D01 | Nút “Thêm vào giỏ” bị che một phần trên màn hình nhỏ | Lỗi thật | Người dùng không thể thao tác tin cậy; ảnh hưởng chức năng và bố cục |
| D02 | Anti-aliasing của chữ lệch vài pixel giữa hai emulator | False positive/Nhiễu | Không tạo khác biệt có ý nghĩa với người dùng |
| D03 | Ảnh banner chiến dịch đã được Product Owner phê duyệt thay đổi | Thay đổi có chủ đích | Có bằng chứng nghiệp vụ; cần cập nhật baseline có review |
| D04 | Giá sản phẩm bị cắt mất chữ số cuối | Lỗi thật | Nội dung tài chính hiển thị sai |
| D05 | Đồng hồ và mức pin trên status bar khác baseline | False positive/Nhiễu | Dữ liệu hệ thống biến động; nên loại khỏi vùng so sánh |
| D06 | Màu nút thanh toán đổi từ xanh sang xám mà không có yêu cầu | Lỗi thật | Làm nút giống trạng thái disabled và vi phạm quy ước giao diện |
| D07 | Bộ màu thương hiệu mới đã có ticket và thiết kế được duyệt | Thay đổi có chủ đích | Cập nhật baseline sau khi kiểm tra ticket và reviewer |
| D08 | Tên người dùng trên header khác dữ liệu baseline | False positive/Nhiễu | Dữ liệu cá nhân động; có thể dùng tài khoản cố định hoặc ignore vùng hẹp |
| D09 | Tổng tiền checkout biến mất nhưng test điều hướng vẫn pass | Lỗi thật | Functional flow chưa kiểm tra được lỗi trình bày quan trọng |
| D10 | Thứ tự sản phẩm thay đổi do seed data không được khôi phục | False positive/Nhiễu | Vấn đề kiểm soát dữ liệu test; nên sửa fixture trước khi thêm ignore region |

#### Chính sách mẫu cần rút ra

1. Chỉ ignore vùng động đã được xác định trước, với phạm vi nhỏ nhất có thể.
2. Không ignore giá, tổng tiền, CTA chính, thông báo lỗi hoặc trạng thái đơn hàng.
3. Ưu tiên cố định dữ liệu test trước khi tạo ignore region.
4. Mọi lần cập nhật baseline phải liên kết với ticket/thay đổi đã duyệt và có người thứ hai review.
5. Visual checkpoint luôn đi cùng một tập nhỏ functional assertion quan trọng.

### 5.4 Phần 4 - Hỏi đáp và kết luận 40:00-45:00

| Thời gian | Nội dung |
|---|---|
| 40:00-40:45 | Nhắc lại ba kết luận: Appium kiểm tra hành vi; Eyes kiểm tra giao diện; con người chịu trách nhiệm phân loại và phê duyệt baseline. |
| 40:45-44:15 | Nhận tối đa ba câu hỏi. Người kiểm soát thời gian ghi các câu chưa trả lời vào parking lot. |
| 44:15-45:00 | Kết luận, cung cấp liên kết user guide/worksheet và yêu cầu mỗi nhóm nộp minute paper. |

#### Câu hỏi dự kiến và câu trả lời ngắn

**Vì sao không chỉ dùng Maestro hoặc Detox?** Appium phù hợp mục tiêu học về WebDriver, có hệ sinh thái đa ngôn ngữ và có thể kết nối nhiều device farm. Maestro dễ tiếp cận và là backup tốt; Detox có đồng bộ hóa mạnh với React Native nhưng yêu cầu tích hợp/build test chặt hơn và không phải lựa chọn chính của phạm vi đã đề xuất.

**Visual AI có thể thay toàn bộ assertion không?** Không. Nó mạnh ở bố cục và biểu hiện trực quan nhưng không thay thế kiểm tra nghiệp vụ như đúng sản phẩm, đúng giá, quyền truy cập hoặc trạng thái đơn hàng.

**Tại sao không bấm Accept khi diff là thay đổi dự kiến?** Chỉ được accept sau khi đối chiếu yêu cầu và có review; nếu không, baseline có thể ghi nhận luôn một regression.

**Có thể demo bằng Expo Go không?** Có thể cho thử nghiệm ban đầu, nhưng development APK ổn định hơn cho automation vì có package name riêng, quy trình launch rõ ràng và ít phụ thuộc vào container Expo Go.

**Nếu Applitools trial hết hạn thì sao?** Chuyển sang Maestro AI theo phương án dự phòng đã nêu ở S1, đồng thời giữ nguyên Appium functional test. Việc đổi công cụ phải được giảng viên chấp thuận ở S2.

## 6. Ba failure mode bắt buộc phải trình bày

1. **Locator dễ vỡ:** XPath dựa trên cây view có thể hỏng sau khi refactor giao diện dù hành vi không đổi. Phát hiện bằng lỗi “element not found”; giảm thiểu bằng `testID`, accessibility label và locator ngắn.
2. **Flaky do trạng thái và thời gian:** animation, backend chậm, bàn phím hoặc dữ liệu còn từ lần chạy trước làm test lúc pass lúc fail. Phát hiện bằng chạy lặp và lưu log/video; giảm thiểu bằng explicit condition, reset state và dữ liệu seed xác định.
3. **Visual AI gây hiểu nhầm:** dữ liệu động có thể tạo diff không quan trọng, còn ignore region quá rộng có thể che lỗi thật. Phát hiện bằng triage có ngữ cảnh; giảm thiểu bằng vùng ignore nhỏ, review baseline và functional assertions.

Có thể bổ sung failure mode về sai device profile, khác font/rendering giữa emulator và rò rỉ API key trong log nếu thời gian cho phép.

## 7. Kế hoạch dự phòng khi demo lỗi

| Sự cố | Kiểm tra tối đa | Cách xử lý trong buổi seminar |
|---|---:|---|
| Emulator không xuất hiện trong `adb devices` | 30 giây | Khởi động lại ADB một lần; nếu vẫn lỗi, chuyển sang thiết bị/emulator dự phòng đã mở sẵn |
| Backend không phản hồi | 30 giây | Dùng health check, khởi động lại server một lần hoặc chuyển sang database/server dự phòng cục bộ |
| Appium không tạo được session | 60 giây | Hiển thị log capabilities, kiểm tra package/activity; sau một lần thử lại thì chuyển sang report của lần chạy tập dượt và giải thích rõ đây là bằng chứng dự phòng |
| Dashboard Eyes hoặc mạng chậm | 45 giây | Dùng ảnh baseline/diff đã chụp từ lần chạy thật gần nhất; vẫn tiếp tục phân tích trực tiếp, không giả vờ đây là kết quả live |
| Trial/API key hết hiệu lực | 30 giây | Chuyển sang flow Maestro AI đã chuẩn bị hoặc demo functional Appium và dùng bộ diff cards cho phần AI; thông báo rõ giới hạn |
| Build thay đổi cài đặt quá lâu | 60 giây | Dùng emulator thứ hai đã cài sẵn build thay đổi, hoặc dùng kết quả visual run đã tạo trong buổi kiểm tra kỹ thuật |

Video dự phòng chỉ được dùng khi sự cố hạ tầng không thể khôi phục và phải nói rõ với khán giả. Không trình chiếu video như thể đó là thao tác trực tiếp.

## 8. Tiêu chí đánh giá buổi seminar

Buổi seminar được xem là đạt khi:

- Kết thúc trong 45 phút, không rút ngắn hoạt động lớp để bù cho demo quá giờ.
- Khán giả nhìn thấy ít nhất một Appium test chạy thật và một kết quả AI visual check.
- Demo có functional assertion, không chỉ thao tác click tự động.
- Nhóm giải thích đúng một visual diff và không cập nhật baseline tùy tiện.
- Ít nhất 80% nhóm khán giả hoàn thành đủ 10 diff cards trong thời gian quy định.
- Mỗi nhóm viết được ít nhất ba quy tắc ignore/baseline hợp lý.
- Không lộ API key, mật khẩu thật hoặc thông tin cá nhân.
- Mỗi thành viên có thể trả lời câu hỏi về phần mình phụ trách và mô tả được giới hạn của công cụ.

## 9. Kịch bản tập dượt

Nhóm cần thực hiện tối thiểu hai lần rehearsal đầy đủ:

1. **Lần 1 - kiểm tra nội dung:** cho phép dừng để sửa lời dẫn, đo từng phần và loại bỏ nội dung thừa.
2. **Lần 2 - giả lập buổi thật:** chạy liên tục 45 phút, dùng đúng máy, mạng, tài khoản, APK, worksheet và phân vai như trên lớp.

Sau mỗi lần tập, ghi lại thời lượng thực tế, lỗi kỹ thuật, câu nói gây khó hiểu, bước demo chậm và hành động khắc phục. Mục tiêu trước ngày seminar là phần demo hoàn tất trong tối đa 9 phút để còn một phút dự phòng.

## 10. Tài liệu tham khảo

- [Appium Documentation](https://appium.io/docs/en/latest/)
- [Appium UiAutomator2 Driver](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/)
- [Applitools Mobile Testing](https://applitools.com/solutions/mobile-testing/)
- [Maestro React Native and Expo Support](https://docs.maestro.dev/get-started/supported-platform/react-native)
- [Maestro assertWithAI](https://docs.maestro.dev/reference/commands-available/assertwithai)
- [Mô tả chủ đề T03](requirements/T03_Mobile_Automation_Testing.docx)
- [Hướng dẫn Seminar Track](requirements/Seminar_Guide.docx)
- [Seminar Workflow Briefing](requirements/Seminar_Workflow_Briefing.pdf)
