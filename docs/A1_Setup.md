# A1 — EShop Android và Appium 2

Tài liệu bàn giao cho TV2 (Eyes) và TV3 (User Guide). Chạy các lệnh từ thư mục `t03_mobile_automation_testing/` của repo.

## 1. Chuẩn bị

- Node.js 20.19.x trở lên, npm, Java và Android SDK. Với Expo SDK 54, cần Android SDK Platform 36 và Build-Tools 36.0.0; một AVD Android đã tạo. Máy thực hiện A1 dùng AVD `eshop_api34`.
- Đặt `ANDROID_HOME` tới thư mục SDK và thêm `platform-tools`, `emulator` vào `PATH`. Ví dụ trên Linux:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64  # thay bằng JDK của máy bạn
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
adb devices
```

Nếu chưa có SDK Platform 36 và Build-Tools 36.0.0, cài bằng Android Studio hoặc `sdkmanager` trước khi build.
Đặt các biến môi trường này trong mọi terminal chạy Expo hoặc Appium (hoặc lưu vào cấu hình shell của máy).

## 2. Backend và dữ liệu demo

```bash
cd eshop-sut-main/backend
npm ci
npm start
```

Backend chạy ở `http://localhost:3000`. `server.js` nạp `database.js`, vì vậy **mỗi lần khởi động backend sẽ tạo lại bảng và dữ liệu mẫu**. Muốn seed thủ công, dừng backend trước rồi chạy `npm run seed:demo`; sau đó khởi động lại backend. File SQLite cục bộ không được commit.

Dữ liệu mẫu cần cho demo:

- User: `test@eshop.com` / `Test1234!`
- Từ khóa tìm kiếm: `iPhone` → `iPhone 15 Pro Max`
- Kiểm tra API nhanh: `curl http://localhost:3000/api/products`

`eshop-sut-main/run_servers.sh` chứa đường dẫn của máy khác; dùng các lệnh ở trên.

## 3. Emulator và app mobile

Mở AVD, ví dụ `emulator -avd eshop_api34`, và đợi `adb devices` hiển thị trạng thái `device`. Sau mỗi lần mở lại AVD, nối cổng Metro bằng `adb reverse tcp:8081 tcp:8081`. Mở terminal khác:

```bash
cd eshop-sut-main/frontend-mobile
npm ci
npx expo run:android
```

Lệnh Expo tạo native Android project, build APK debug và cài lên emulator. APK mặc định nằm tại `eshop-sut-main/frontend-mobile/android/app/build/outputs/apk/debug/app-debug.apk`; thư mục `android/` được Git bỏ qua vì được sinh tự động. Mã app Android là `com.eshop.sut`.
Giữ Metro Bundler do `npx expo run:android` khởi động (hoặc chạy `npx expo start` trong terminal khác) khi dùng **debug APK**. Bản APK đã build trên máy TV1 được chép vào `.artifacts/eshop-sut-debug.apk` để chia sẻ trực tiếp; thư mục `.artifacts/` không nằm trong Git. Nếu lấy repo bằng Git, build lại theo lệnh trên.

App dùng `http://10.0.2.2:3000/api` theo mặc định để emulator gọi backend trên máy chủ. Khi chạy thiết bị thật, tạo `frontend-mobile/.env.local` với `EXPO_PUBLIC_API_URL=http://<IP-LAN-của-máy-chủ>:3000/api`, rồi khởi động lại Expo. Xem `frontend-mobile/.env.example`.

Sau lần build đầu, nếu chỉ đổi JavaScript, có thể chạy `npx expo start` và mở app đã cài. Khi đổi native config hoặc package, build lại bằng `npx expo run:android`.

## 4. Appium 2

```bash
cd src/appium
npm ci
export APPIUM_HOME="$PWD/.appium"
npm run driver:install
npm run driver:doctor
npm run server
```

Appium 2 và WebdriverIO được khóa phiên bản trong `package-lock.json`; `driver:install` cài UiAutomator2 4.2.9 tương thích Appium 2. `config/session.js` tạo Appium session và mặc định dùng APK ở đường dẫn trên. Có thể đặt `ESHOP_APK_PATH`, `ANDROID_UDID`, `APPIUM_HOST`, `APPIUM_PORT` nếu môi trường khác.

Các `testID` đã thêm cho A2. Trên bản Android React Native hiện tại, chúng xuất hiện dưới dạng `resource-id`; mã test dùng `UiSelector().resourceId(...)`.

| Màn hình | `testID` |
|---|---|
| Thanh điều hướng | `nav-home`, `nav-login`, `nav-profile` |
| Login | `login-screen`, `login-email`, `login-password`, `login-submit`, `login-error` |
| Search | `search-input`, `search-submit`, `search-query`, `search-result-count` |
| Sản phẩm | `product-card-<id>`, `product-name-<id>` |

## 5. Bàn giao

- TV2 dùng APK, tài khoản demo, cấu hình Appium và ba màn hình baseline cần chọn cho Eyes.
- TV3 dùng các lệnh đã chạy được ở đây để biên soạn User Guide; không sao chép các bước chưa được kiểm chứng.
- A2 nằm trong `src/appium/pages/` và `src/appium/tests/`; chạy bằng `npm test` từ `src/appium/`.

## 6. Kết quả đã kiểm chứng trên máy TV1

- Backend trả về 5 sản phẩm; API login chấp nhận tài khoản demo.
- Expo build APK debug và cài lên AVD `eshop_api34` thành công; app hiển thị danh sách sản phẩm từ backend.
- Appium 2.19.0 + UiAutomator2 4.2.9 tạo session thành công. XML giao diện có các `testID` trên màn hình Home và Login; Appium bấm được `nav-login` rồi thấy `login-email`, `login-password`, `login-submit`.
- APK chia sẻ: `.artifacts/eshop-sut-debug.apk` (35 MB), SHA-256 `c94ba67435ff671d6a6ef50bdc144e637ab2cd80523c3a38355afa5c48571509`.
