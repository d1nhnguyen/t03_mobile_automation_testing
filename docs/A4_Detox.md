# A4 — Detox PoC cho EShop Android

PoC ở [`src/detox/`](../src/detox/) chạy cùng luồng nghiệp vụ với A2: đăng nhập tài khoản mẫu, tìm `iPhone`, xác nhận chỉ còn `iPhone 15 Pro Max` và không có sản phẩm Samsung. Kết quả ở đây chỉ áp dụng cho Ubuntu/Linux và AVD x86_64 `eshop_api34` (Android API 34).

## Cách dựng và chạy

Detox cần cả APK app và APK kiểm thử Android; Expo SDK 54 dùng `expo-detox-config-plugin` để tái tạo cấu hình native sau `expo prebuild`. Plugin yêu cầu Node.js 22.13+; dự án đã khóa phiên bản Detox, Jest và plugin trong `frontend-mobile/package-lock.json`. Xem [Detox project setup](https://wix.github.io/Detox/docs/introduction/project-setup/) và [plugin Expo SDK 54](https://github.com/isilher/expo-detox-config-plugin).

Trước lệnh build hoặc mở emulator, kiểm tra `free -h` và `df -h .`. Lần chạy trên máy TV1, emulator từ chối khởi động khi đĩa còn 1,7 GiB; sau khi dọn cache và có 3,4 GiB trống, emulator chạy được. Không cần chạy Appium server cho PoC này.

Từ root của repo, đặt Android SDK/JDK như [A1 setup](A1_Setup.md), dùng Node.js 22.13+ rồi chạy:

```bash
cd eshop-sut-main/frontend-mobile
npm ci
npx expo prebuild --platform android --no-install
npm run detox:build
```

Lệnh build chỉ tạo `:app:assembleDebug` và `:app:assembleDebugAndroidTest` cho ABI `x86_64`, tránh build test APK của các module Expo. Hai APK nằm trong `android/app/build/outputs/apk/` và thư mục native `android/` được sinh tự động, không commit.

Trong hai terminal riêng, khởi động backend (`cd eshop-sut-main/backend && npm start`) và Metro (`cd eshop-sut-main/frontend-mobile && npx expo start --localhost`). Từ `frontend-mobile/`, chạy:

```bash
npm run detox:test -- --headless --gpu swiftshader_indirect
```

Detox chọn AVD `eshop_api34` từ [`detox.config.js`](../src/detox/detox.config.js); đặt `DETOX_AVD_NAME` nếu dùng AVD khác. Bài test tự nối cổng Metro 8081 bằng `device.reverseTcpPort()`, xóa/cài lại app trước khi mở để có state sạch, rồi dùng `by.id()` với `testID` React Native. Xem [Detox test ID](https://wix.github.io/Detox/docs/guide/test-id/) và [device API](https://wix.github.io/Detox/docs/api/device/).

## Kết quả thực chạy

Ngày 22/10/2026, lệnh build rút gọn kết thúc **BUILD SUCCESSFUL** trong 4 phút 42 giây với cache Gradle một phần. Hai APK cuối có SHA-256 lần lượt là `b8aebf668ea2cf0fe9aadc2d985358f6e91176ecd246a103db22186fd81a61ff` (app) và `a0d1e9c92800dd1feff76f1cc86587db57d52124d1fb9e6300f887916c9e6323` (test). [`login-search.test.js`](../src/detox/tests/login-search.test.js) pass **ba lượt** trên AVD Linux: **1/1 test mỗi lượt**, thời gian do Jest báo **25,508 s**, **24,790 s** và **38,594 s**. Lượt thứ ba chạy trên emulator mở lại với đúng hai APK từ lệnh build rút gọn. Bài A2/Appium cũng pass **1/1** trên APK mới sau đó. Lượt đầu trong quá trình viết PoC từng lỗi do `pressBack()` đóng activity sau khi nhập mật khẩu; đã bỏ thao tác đó trước ba lượt pass. [Log kiểm chứng](evidence/A4_detox_runs_2026-10-22.log) được lưu trong repo.

## Đối sánh DX quan sát trên EShop

| Khía cạnh | Appium A2 | Detox A4 |
|---|---|---|
| Chuẩn bị | Appium server, UiAutomator2 driver, APK debug và Metro | Thêm cấu hình instrumentation, build APK app và APK test, Jest và Metro |
| Tìm phần tử | `testID` Android qua `UiSelector().resourceId(...)` trong Page Object | `testID` trực tiếp qua `by.id(...)` |
| Đồng bộ | Gọi `waitForDisplayed`/`waitUntil` cho các trạng thái bất đồng bộ | Tự đồng bộ sau thao tác UI; vẫn dùng `waitFor(...).withTimeout(...)` khi đợi dữ liệu API |
| State mới | Phiên Appium với `noReset=false`, rồi chủ động đưa app lên foreground | `device.launchApp({ delete: true })` xóa/cài lại app |
| Điểm vướng thực tế | Cold start từng không đưa app lên foreground; A2 đã xử lý | Native build tốn đĩa hơn; `pressBack()` sau `replaceText()` đã đóng activity trên AVD này |

Detox giúp mã thao tác React Native ngắn và ít lệnh chờ thủ công hơn trong PoC này, đổi lại cần tích hợp native vào Expo và tạo APK kiểm thử. Đây là nhận xét DX trên EShop; thời gian ba lượt Detox ở trên và trung vị Appium A3 **30,496 s** được đo với số lượt và điều kiện khác nhau, nên không dùng để kết luận công cụ nào nhanh hơn. [A3 metrics](A3_Metrics.md) ghi điều kiện của Appium. Detox hỗ trợ tự đồng bộ với hoạt động app theo [hướng dẫn bài test đầu tiên](https://wix.github.io/Detox/docs/introduction/your-first-test/).
