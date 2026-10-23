# T03 Mobile Automation Testing — Hướng dẫn sử dụng

**Môn:** CS423 / CSC15003 Kiểm thử phần mềm  
**Đề tài:** T03 — Mobile Automation Testing  
**SUT:** client EShop React Native Expo (`eshop-sut-main/frontend-mobile`)  
**Lớp công cụ:** Appium 2 + UiAutomator2 (chức năng) · Applitools Eyes (giao diện) · Maestro CLI + AI assertions (dự phòng)

**Trạng thái (23/10/2026):** mục 1–7 viết bằng tiếng Việt theo repo hiện tại, `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md` và `Demo_Scenario.md`. Lệnh đã chạy lấy từ A1 trên Ubuntu, AVD `eshop_api34`. Ảnh Inspector nằm ở mục 3 và mục 4. Eyes và Maestro chưa có lần chạy trong repo.

**Thông điệp:** Appium kiểm tra việc người dùng làm được và dữ liệu trên màn hình. Applitools kiểm tra thứ người dùng nhìn thấy. Hai lớp bổ sung cho nhau.

---

## 1. Giới thiệu

### 1.1 Hướng dẫn này để làm gì

Người làm lại bài cần:

1. Khởi động API EShop từ `eshop-sut-main` và xác nhận danh mục mẫu qua HTTP.
2. Cài JDK, Android SDK, emulator, Appium 2 và driver UiAutomator2 khi máy chưa có các công cụ đó.
3. Chạy bộ test trong `src/appium/` trên bản debug Android sau khi thư mục đó có trong cây mã.
4. Đọc checkpoint chức năng đầu: đăng nhập, tìm `iPhone`, thấy tên `iPhone 15 Pro Max`.
5. Thêm checkpoint Applitools Eyes sau khi mục 4 có lần chạy TV2. Repo chưa có lần chạy đó.
6. Chuyển sang Maestro khi trial Applitools không dùng được và giảng viên đã chấp thuận.

### 1.2 Vì sao tự động hoá mobile khó hơn web

Cùng một kịch bản có thể đạt trên ảnh Android này và trượt trên ảnh khác vì phân mảnh OS, quyền, độ trễ mạng và vùng chạm nhỏ. Cấu hình đã chạy đạt là một AVD: `eshop_api34`, Android 14, 1080×2400 (A1/A2, Linux). Ảnh máy thứ hai là một bài test khác.

### 1.3 Mỗi công cụ trả lời câu hỏi nào

| Lớp | Công cụ | Câu hỏi | Trong repo này |
|-----|---------|---------|----------------|
| Chức năng | Appium 2 + UiAutomator2 | Đăng nhập và tìm kiếm có trả dữ liệu đúng không? | `src/appium/`, lệnh `npm test` |
| Visual AI | Applitools Eyes | Màn hình có lệch baseline đã duyệt không? | Chưa tích hợp (TV2) |
| Dự phòng | Maestro + AI assertions | Cùng luồng có chạy được với một kiểm tra AI nhẹ hơn không? | Chưa có file flow |
| Chính sách | Quy tắc nhóm | Diff nào là lỗi, nhiễu, hay cập nhật có chủ đích? | Mục 4, sau khi có batch Eyes |

Quy tắc demo (Seminar Guide): buổi trình bày có ít nhất một tính năng truyền thống và một tính năng có AI. Tính năng truyền thống là bộ Appium. Tính năng AI chờ TV2.

### 1.4 Kịch bản trong phạm vi

Bộ test chạy được nằm ở `src/appium/data/cases.js`:

1. Đăng nhập sai mật khẩu, rồi đăng nhập tài khoản mẫu (`L1` → `L2`).
2. Tìm `iPhone` (1 sản phẩm), `Pro M` (2 sản phẩm), `Nokia 3310` (0 sản phẩm).
3. Kiểm tra tên, dòng đếm kết quả, và sản phẩm không được xuất hiện.
4. Cùng lệnh `npm test` còn thêm iPhone 15 Pro Max vào giỏ hai lần và kiểm tra tổng tiền. Luồng giỏ nằm sau bài test đầu; mục 3 dừng ở kết quả tìm kiếm.
5. Checkpoint giao diện, và so sánh banner với màu, thuộc mục 4.

Bài test đầu không gồm thanh toán, coupon, trang admin, iOS và device farm.

Bài một người khác làm lại hẹp hơn cả bộ: đăng nhập tài khoản mẫu, tìm `iPhone`, thấy `iPhone 15 Pro Max`. Lệnh có sẵn vẫn là `npm test`, và lệnh đó chạy cả bộ trong một tiến trình.

---

## 2. Cài đặt

`eshop-sut-main` là ứng dụng cần kiểm thử. Thư mục đó không chứa Appium, driver UiAutomator2, Android SDK hay bộ test. Cài các công cụ trên máy, rồi build app. `npm test` cần thêm `src/appium` từ repo seminar.

| Đang có trên đĩa | Mục 2 đưa tới đâu |
|------------------|-------------------|
| Chỉ `eshop-sut-main` | Điều kiện, backend và APK debug. Trước mục 3, chép `src/appium` từ repo seminar vào cùng cây thư mục. |
| Cây seminar: `eshop-sut-main` và `src/appium` | Cùng các công cụ, cài từ project đã khóa trong `src/appium`, rồi sang mục 3. |

`$SUT` là thư mục `eshop-sut-main`. Trong cây seminar, đường dẫn đó là `eshop-sut-main`. Nếu terminal đang đứng trong thư mục SUT thì `$SUT` là thư mục hiện tại. Đặt biến trước các lệnh phía sau.

**Ghi chú hệ điều hành.** A1 đã chạy trên Ubuntu/Linux với Android Emulator. Lệnh `export` và đường dẫn JDK trong mục này là của Linux. Trên Windows PowerShell, đặt cùng các biến bằng `$env:...` theo đường dẫn máy đó. Mã test dùng Node.js và `npm test`, không phụ thuộc Bash. A1 chưa ghi một lượt A1/A2 trên Windows.

Linux hoặc Git Bash:

```bash
export SUT=eshop-sut-main
# đang đứng trong thư mục SUT: export SUT=.
```

Windows PowerShell:

```powershell
$SUT = "eshop-sut-main"
# đang đứng trong thư mục SUT: $SUT = "."
```

### 2.1 Điều kiện

Cài từng dòng rồi chạy lệnh kiểm tra. Bài test đầu cần mọi dòng trừ Eyes và Maestro.

| Công cụ | Cài | Kiểm tra |
|---------|-----|----------|
| Node.js | 20.19 trở lên. Bản 22.13 trở lên chỉ dành cho PoC Detox ở mục 4.7. | `node -v` và `npm -v` |
| JDK | 17 hoặc 21. Bản build Android đã ghi dùng 21. Trỏ `JAVA_HOME` vào bản đó. | `java -version` in đúng JDK vừa đặt |
| Android SDK | Đặt `ANDROID_HOME`. Có platform-tools (`adb`), emulator, cmdline-tools (`sdkmanager`, `apkanalyzer`), **SDK Platform 36** và **Build-Tools 36.0.0**. Expo SDK 54 biên dịch app với Platform 36. | `adb version`. `sdkmanager --list_installed` liệt kê `platforms;android-36` và `build-tools;36.0.0`. |
| AVD | Tạo `eshop_api34`, Android 14 (API 34), 1080×2400. Đó là thiết bị của bộ test đã ghi. | `emulator -list-avds` in `eshop_api34`. Sau khi boot, `adb devices` hiện `device`. |
| Appium 2 + UiAutomator2 | Không nằm trong SUT. Mục 2.4 cài từ `src/appium`. | `GET http://127.0.0.1:4723/status` trả `ready: true`. |
| Eyes, Maestro | Để ngoài bài test đầu. | — |

Đặt `JAVA_HOME`, `ANDROID_HOME` và các thư mục bin của SDK vào `PATH` ở mọi terminal chạy `adb`, Expo hoặc Appium.

Linux (bash). Trỏ `JAVA_HOME` vào JDK đã cài:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
adb devices
emulator -list-avds
```

Windows (PowerShell). Android Studio để SDK trong Local AppData. Trỏ `JAVA_HOME` vào thư mục JDK 17 hoặc 21 của máy:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
adb devices
emulator -list-avds
```

Lưu các biến này vào hồ sơ shell để terminal mới vẫn thấy chúng. Trên Windows, đổi `JAVA_HOME` nếu JDK không nằm ở đường dẫn ví dụ.

Khi thiếu `adb` hoặc thiếu Platform 36, cài bằng Android Studio → SDK Manager, hoặc bằng `sdkmanager` sau khi cmdline-tools đã có trên `PATH`:

```bash
sdkmanager --install "platform-tools" "emulator" "cmdline-tools;latest" "platforms;android-36" "build-tools;36.0.0"
sdkmanager --licenses
```

Tạo máy ảo trong Android Studio → Device Manager: tên `eshop_api34`, hệ điều hành Android 14, màn hình 1080×2400. Các lượt đã ghi dùng ảnh `x86_64`. Trên máy ARM, cài ảnh hệ thống ARM mà Android Studio đưa cho API 34 và giữ tên `eshop_api34`. Ảnh ARM là một thiết bị khác với các lượt đã ghi.

Mở máy ảo:

```bash
emulator -avd eshop_api34
```

`appium driver doctor uiautomator2` cần `apkanalyzer` từ cmdline-tools. Cài cmdline-tools nếu doctor báo thiếu. `bundletool`, `ffmpeg` và GStreamer là tuỳ chọn. Server vẫn có thể báo `ready: true` khi thiếu ba mục đó.

### 2.2 Khởi động backend EShop

`server.js` nạp `database.js`, và `database.js` xoá rồi tạo lại bảng mỗi lần khởi động. Mỗi `npm start` là một bộ dữ liệu mẫu mới. Dừng server trước khi chạy `npm run seed:demo`.

Từ gốc seminar, backend là `eshop-sut-main/backend`. Nếu thư mục đang mở đã là SUT thì `cd backend`.

```bash
cd "$SUT/backend"
npm ci
npm start
```

PowerShell, khi `$SUT` đã được đặt:

```powershell
Set-Location "$SUT/backend"
npm ci
npm start
```

Đợi log có đủ ba dòng sau. Thứ tự có thể đảo vì kết nối SQLite và seed chạy song song với lúc server lắng nghe:

```text
Connected to database
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
```

Giữ terminal đó. Xác nhận dữ liệu mẫu qua HTTP:

| Yêu cầu | Kỳ vọng |
|---------|---------|
| `GET http://localhost:3000/api/products` | 5 sản phẩm |
| `GET http://localhost:3000/api/products?search=iPhone` | 1 dòng, `iPhone 15 Pro Max` |
| `POST /api/login` với `test@eshop.com` / `Test1234!` | `200`, tên `Test User` |

Một mật khẩu sai cộng 2 vào `login_attempts` (`server.js`). Lần sai thứ hai trong cùng tiến trình khoá tài khoản 3 phút. Khởi động lại `npm start` để seed lại. Chỉ dùng một lần sai khi tới bài đăng nhập ở mục 3.

**Tài khoản mẫu** (`eshop-sut-main/backend/database.js`):

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Người dùng (dùng cho test mobile) | `test@eshop.com` | `Test1234!` |
| Admin | `admin@eshop.com` | `Admin123!` |

**Sản phẩm mẫu:**

| id | Tên | Giá (VND) |
|----|-----|-----------|
| 1 | iPhone 15 Pro Max | 30000000 |
| 2 | Samsung Galaxy S24 Ultra | 28000000 |
| 3 | MacBook Pro M3 | 45000000 |
| 4 | Tai nghe AirPods Pro 2 | 6000000 |
| 5 | Bàn phím cơ Keychron Q1 | 4000000 |

`eshop-sut-main/setup_guide.md` in mật khẩu admin `admin123`. Seed dùng `Admin123!`. Dùng chuỗi trong seed. Bài test đầu dùng tài khoản người dùng, không dùng admin.

Trên emulator, client gọi backend bằng địa chỉ mặc định trong mã. Bài test đầu không cần tạo file env. Giữ backend ở cổng 3000.

### 2.3 Build và cài client mobile

Bước này chỉ cần `$SUT`. Không cần `src/`.

Checkout mới chưa có thư mục `android/` và chưa có APK. Expo sinh chúng. Sau khi build xong, APK debug nằm tại:

`$SUT/frontend-mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Mở AVD và đợi `adb devices` hiện `device`. Sau mỗi lần boot lạnh, chuyển tiếp cổng Metro:

```bash
adb reverse tcp:8081 tcp:8081
cd "$SUT/frontend-mobile"
npm ci
npx expo run:android
```

PowerShell:

```powershell
adb reverse tcp:8081 tcp:8081
Set-Location "$SUT/frontend-mobile"
npm ci
npx expo run:android
```

Giữ Metro chạy. Thay đổi chỉ có JavaScript có thể nạp lại qua Metro. Thay đổi native cần `npx expo run:android` lần nữa.

`npx expo start` và Expo Go là phiên làm tay. Appium mở APK debug đã cài. Trỏ bộ test vào APK đó.

### 2.4 Cài Appium 2 và driver UiAutomator2

Appium 2 chỉ gồm server. Driver Android cài riêng. WebdriverIO là client của bộ test. Cài cả hai bằng script trong `src/appium`.

Linux, khi cây seminar đã có `src/appium`:

```bash
cd src/appium
npm ci
export APPIUM_HOME="$PWD/.appium"
npm run driver:install
npm run driver:doctor
npm run server
```

Windows PowerShell:

```powershell
Set-Location src/appium
npm ci
$env:APPIUM_HOME = Join-Path (Get-Location) ".appium"
npm run driver:install
npm run driver:doctor
npm run server
```

`npm run server` lắng nghe `127.0.0.1:4723`. Đặt `APPIUM_HOME` bằng `src/appium/.appium` ở mọi terminal sau này. Thư mục đó bị git bỏ qua, nên clone mới phải cài driver lại.

Nếu đĩa chỉ có `eshop-sut-main`, chép `src/appium` từ repo seminar để cây thành:

```text
<seminar-root>/
  eshop-sut-main/
  src/appium/
```

Rồi dùng các lệnh ở trên. `eshop-sut-main` không có `npm test` của Appium. Nếu `src/appium` không nằm tại `<seminar-root>/src/appium`, đặt `ESHOP_APK_PATH` thành đường dẫn tuyệt đối của `app-debug.apk`. Mặc định trong `config/session.js` giả định đúng bố cục seminar.

**Xác nhận server**

- Log có dòng `Appium REST http interface listener started on http://127.0.0.1:4723`.
- `GET http://127.0.0.1:4723/status` trả `"ready": true` và `"message": "The server is ready to accept new connections"`.
- Sẵn sàng đọc ở `/status`. Đường `/` không phải trang trạng thái.

`driver doctor` phải thấy `ANDROID_HOME`, `adb`, `emulator` và `JAVA_HOME`. Nếu thiếu `apkanalyzer`, cài cmdline-tools (mục 2.1) rồi chạy doctor lại. Khi `adb` đã có trên `PATH`, dòng doctor bảo cài lại cả SDK nghĩa là thiếu gói cmdline-tools. Cảnh báo `bundletool`, `ffmpeg` và GStreamer không chặn bài test đầu.

Capability mà bộ test gửi nằm trong `src/appium/config/session.js`: `platformName` là `Android`, automation là `UiAutomator2`, app là APK debug ở mục 2.3 hoặc `ESHOP_APK_PATH`, `noReset` là `false`. Client nối `127.0.0.1:4723`, đường `/`.

Inspector dùng khi cần xem cây giao diện. Quit Session trước `npm test`. UiAutomator2 chỉ chạy một instrumentation trên một thiết bị. Ảnh phiên Linux ngày 23/10/2026 nằm ở mục 3.

### 2.5 Applitools Eyes

Bỏ qua cho bài test đầu. Repo seminar chưa có SDK Eyes hay batch dashboard. Khi có lần chạy, giữ khoá trong `APPLITOOLS_API_KEY` và không commit khoá đó. Test Appium viết bằng JavaScript (WebdriverIO), nên SDK Eyes phải là bản JavaScript.

### 2.6 Maestro (chỉ phương án dự phòng)

Bỏ qua, trừ khi giảng viên chấp nhận Maestro thay trial Applitools đã hết. Checkout SUT không có file flow Maestro.

---

## 3. Bài test đầu

Mục tiêu: một đường chức năng. Visual AI để ở mục 4. Làm xong mục 2 trước. Nếu đĩa chỉ có `eshop-sut-main`, chép `src/appium` rồi làm mục 2.4 trước bước 6. Kết quả cả bộ đã ghi nằm ở `docs/A3_Metrics.md`: 3 test, 8 kiểm tra, 10/10 lượt trên AVD `eshop_api34`.

Một lượt đạt của đường đầu trông như sau:

- Mật khẩu sai `SaiMatKhau-1` còn ở màn Đăng nhập. Dòng lỗi khớp `Đăng nhập thất bại`. App luôn hiện `Đăng nhập thất bại. Vui lòng kiểm tra lại.`
- Mật khẩu mẫu `Test1234!` hiện lời chào `Chào, Test User`.
- Tìm `iPhone` hiện `Hiển thị 1 sản phẩm` và tên `iPhone 15 Pro Max`.

Màn Đăng nhập trên emulator, chụp trong Appium Inspector ngày 23/10/2026. Ô email đã có `test@eshop.com`. Cây nguồn bên phải lúc chụp chưa được làm mới.

![Màn Đăng nhập EShop trong Appium Inspector](docs/evidence/A2_inspector_02_login_source.png)

Phiên Inspector vừa mở có thể vẫn hiện màn hình Android trống cho tới khi app được đưa lên trước. Ảnh dưới là trạng thái đó, cùng ngày, trước khi màn Đăng nhập xuất hiện trong khung điện thoại.

![Phiên Inspector mới mở, khung điện thoại còn màn hình Android](docs/evidence/A2_inspector_01_session_home.png)

### 3.1 Mười bốn bước

1. Trong `$SUT/backend`, chạy `npm start`. Đợi `Database initialized and seeded` và `Server is running on http://localhost:3000`.
2. Mở `http://localhost:3000/api/products`. Kỳ vọng 5 sản phẩm. Mở `http://localhost:3000/api/products?search=iPhone`. Kỳ vọng một dòng, `iPhone 15 Pro Max`.
3. Khởi động AVD `eshop_api34` và đợi `adb devices -l` báo trạng thái `device`.
4. Chạy `adb reverse tcp:8081 tcp:8081`.
5. Nếu app debug chưa được cài, chạy `npm ci` rồi `npx expo run:android` từ `$SUT/frontend-mobile`. Giữ Metro.
6. Trong `src/appium`, đặt `APPIUM_HOME` tới thư mục `.appium` của thư mục đó (mục 2.4). Đặt `ANDROID_HOME` và `JAVA_HOME` như mục 2.1. Nếu APK không nằm ở đường mặc định của seminar, đặt `ESHOP_APK_PATH` thành đường tuyệt đối của file APK.
7. Bật server bằng `npm run server`.
8. Mở `http://127.0.0.1:4723/status`. Chỉ tiếp tục khi `ready` là `true`.
9. Quit mọi phiên Inspector. Một instrumentation UiAutomator2 cho một thiết bị. `npm test` thất bại nếu Inspector còn giữ phiên.
10. Từ terminal thứ hai trong `src/appium`, cùng `APPIUM_HOME`, chạy `npm test`. Đó là `node --test --test-concurrency=1`.
11. Ở test đăng nhập, `L1` còn màn Đăng nhập, có dòng `Đăng nhập thất bại`, và chưa có lời chào `Test User`. `L2` có lời chào `Chào, Test User` và không còn dòng lỗi.
12. Ở test tìm kiếm, từ khoá `iPhone` tới `Hiển thị 1 sản phẩm` và tên `iPhone 15 Pro Max`. Các sản phẩm còn lại không còn trên màn hình. Đây là checkpoint của bài test đầu.
13. Không nhập mật khẩu sai lần thứ hai khi tiến trình backend này còn chạy. Mỗi lần sai cộng 2 vào `login_attempts`, và tài khoản khoá 3 phút khi đạt 3. Nếu một lượt chết sau `L1` và trước `L2`, dừng backend rồi khởi động lại để seed sạch, sau đó chạy lại `npm test`.
14. Cùng `npm test` còn chạy tiếp `Pro M` (2 tên), `Nokia 3310` (dòng đếm kết quả biến mất) và tổng giỏ `60000000`. TAP xanh của cả bộ là `# pass 8` và `# fail 0`. Đó là bộ seminar. Bài test đầu xong ở bước 12.

Bộ test đã chờ màn Đăng nhập, lời chào và kết quả tìm kiếm, và ẩn bàn phím sau đăng nhập (`src/appium/tests/helpers.js`). Không thêm `sleep` cố định.

### 3.2 Chỗ các bước nằm trong mã

| Phần | File |
|------|------|
| Capability của phiên | `src/appium/config/session.js` |
| Thao tác đăng nhập và tìm kiếm | `src/appium/pages/login.page.js`, `src/appium/pages/home.page.js` |
| Dòng `L1`, `L2`, `S1`–`S3` | `src/appium/data/cases.js` |
| Test mà `npm test` chạy | `src/appium/tests/login-search.test.js` (và `cart-total.test.js` cho bước 14) |

Đoạn Recorder của Inspector là bản nháp. Test nộp là Page Object ở bảng trên. Bản ghi ngày 23/10/2026 nằm trong `docs/evidence/` của repo seminar.

---

## 4. Dùng nâng cao

Mục 2–3 là mức cài đặt và bài test đầu (đăng nhập rồi tìm `iPhone`). Mục này là phần còn lại của buổi demo: Inspector và Recorder, cả bộ dữ liệu, tổng giỏ, và khung Eyes. Detox là đối sánh DX, không phải công cụ demo thứ ba.

Workflow Briefing giữ video 5–8 phút. Lệnh và giải thích dài nằm ở đây. Một mức chỉ được gọi là đã trình bày khi mức đó có trong video hoặc trong bằng chứng của nhóm. Đề cương thời gian nằm ở `Demo_Scenario.md`. Repo chưa có file `Demo_Screencast.mp4`.

### 4.1 Ba mức demo

| Mức | Appium | Eyes |
|-----|--------|------|
| Cài đặt | Mục 2. `GET http://127.0.0.1:4723/status` có `ready: true`. Phạm vi đã chạy là Linux, AVD `eshop_api34` (A1). | Cài SDK và cấu hình thật của TV2. Repo chưa có. |
| Chức năng cơ bản | Inspector trên màn Đăng nhập, chọn ô email, bật Recorder (mục 4.3). | Một checkpoint so với baseline đã duyệt. Chưa chạy. |
| Luồng phức tạp | `npm test`: bảng đăng nhập, bảng tìm kiếm, giỏ hai lần và tổng tiền (mục 4.4). | Cùng luồng trên bản đổi banner và bản đổi màu hoặc bố cục. Chưa có hai bản UI. |

Phần live 10 phút không mở Inspector. Nếu cần nhắc Recorder, chiếu đoạn video của mức cơ bản. Backend, Metro, emulator và Appium được bật trước.

### 4.2 Ba khối Record, data-driven, checkpoint

| Khối | Trong repo | Vai trò ở buổi demo |
|------|------------|---------------------|
| Record & Playback | Plugin Inspector trong trình duyệt. Ảnh và file Recorder ngày 23/10/2026 ở `docs/evidence/`. | Khám phá cây giao diện. Code sinh ra là bản nháp. |
| Data-driven | `src/appium/data/cases.js`: `LOGIN_CASES`, `SEARCH_CASES`, `CART_CASE`. Thêm dòng không sửa assertion. | Demo phức tạp đọc bảng, không đọc số viết cứng trong test. |
| Checkpoint | Assertion trong `tests/login-search.test.js` và `tests/cart-total.test.js`: câu lỗi, lời chào, số kết quả, tên sản phẩm, chữ số tổng tiền. | TAP xanh chỉ có giá trị khi các câu này đúng. |

Eyes thêm visual checkpoint khi có baseline. Maestro không có file flow, nên không thay khối nào ở trên.

### 4.3 Record và Playback — demo cơ bản

Làm sau mục 2, khi emulator đang `device`, Metro đang chạy và APK debug đã cài. Cài plugin một lần trong `src/appium`, cùng `APPIUM_HOME` với server. Bản plugin đã dùng là `appium-inspector-plugin@2025.3.1`. Bản mới hơn đòi Appium 3.

Linux:

```bash
cd src/appium
export APPIUM_HOME="$PWD/.appium"
npx appium plugin install --source=npm appium-inspector-plugin@2025.3.1
npx appium --address 127.0.0.1 --port 4723 --use-plugins=inspector --allow-cors
```

Windows PowerShell:

```powershell
Set-Location src/appium
$env:APPIUM_HOME = Join-Path (Get-Location) ".appium"
npx appium plugin install --source=npm appium-inspector-plugin@2025.3.1
npx appium --address 127.0.0.1 --port 4723 --use-plugins=inspector --allow-cors
```

Mở `http://127.0.0.1:4723/inspector`. Capability lấy từ `src/appium/config/session.js`: `platformName` là `Android`, automation là `UiAutomator2`, app là APK debug. Start Session.

`testID` trong `eshop-sut-main/frontend-mobile/App.js` hiện trên Android thành `resource-id`. Phiên ngày 23/10/2026 chọn ô email: `resource-id` = `login-email`, chữ trong ô là `test@eshop.com`. Chiến lược Id của Inspector tự thêm tiền tố package nên không khớp các id này. Chiến lược dùng được là UIAutomator: `new UiSelector().resourceId("login-email")`.

![Ô email được chọn trong Inspector, resource-id login-email](docs/evidence/A2_inspector_03_login_email_selected.png)

Bật Recorder, bấm Đăng nhập trên cây giao diện, gửi email một lần, rồi xem code **JS - WebdriverIO**. File đã lưu là `docs/evidence/A2_inspector_recorder_2026-10-23.js`. Đoạn đó tìm `nav-login` và `login-email` bằng `$$(...)[0]`, không có wait và không có assertion.

![Recorder sinh code WebdriverIO cho nút Đăng nhập và ô email](docs/evidence/A2_inspector_04_recorder_code.png)

Test nộp nằm ở Page Object (`pages/`, `tests/`), không phải file Recorder. Quit Session trước `npm test`. UiAutomator2 chỉ một instrumentation trên một thiết bị; phiên Inspector còn mở thì bộ test đứt.

### 4.4 Bộ dữ liệu và tổng giỏ — demo phức tạp

Đây là phần `npm test` sau checkpoint `iPhone` ở bước 12 của mục 3. Thứ tự đăng nhập cố định: một mật khẩu sai, rồi mật khẩu mẫu. `server.js` cộng 2 vào `login_attempts` mỗi lần sai và khoá 3 phút khi đạt 3. Thêm một dòng sai nữa sẽ khoá `test@eshop.com` đến hết tiến trình backend. Chạy lại `npm start` để seed.

| Id | Đầu vào | Checkpoint |
|----|---------|------------|
| L1 | `SaiMatKhau-1` | Còn màn Đăng nhập; dòng lỗi chứa `Đăng nhập thất bại`; chưa có lời chào |
| L2 | `Test1234!` | Lời chào chứa `Test User`; dòng lỗi biến mất |
| S1 | `iPhone` | `Hiển thị 1 sản phẩm`; tên `iPhone 15 Pro Max`; bốn sản phẩm kia vắng |
| S2 | `Pro M` | `Hiển thị 2 sản phẩm`; có iPhone 15 Pro Max và MacBook Pro M3; Samsung, tai nghe và bàn phím vắng |
| S3 | `Nokia 3310` | Dòng đếm kết quả biến mất; cả năm sản phẩm vắng |

S3 không tìm một câu “không có sản phẩm”. Checkpoint là dòng đếm không còn.

Giỏ (`src/appium/tests/cart-total.test.js`, `CART_CASE`): sản phẩm 1, đơn giá 30000000, bấm **Thêm vào giỏ** hai lần. Huy hiệu thành `Giỏ (1)` vì hai lần bấm cập nhật cùng một dòng. Thành tiền và tổng phải chứa chữ số `60000000`. Bộ test chỉ so chữ số, nên đổi dấu phân cách của `toLocaleString` không làm fail. Xoá dòng thì khung giỏ trống hiện và dòng tổng biến mất.

Hai hành vi của EShop mà test giỏ đã né (A2, mục 5):

- Mỗi lần thêm mở `Alert.alert("Thành công", "Đã thêm vào giỏ hàng")`. `addToCart` bấm `android:id/button1` và đợi nút đó biến mất rồi mới bấm tiếp.
- Ô số lượng trong giỏ làm `parsed + 1` khi đổi (`App.js`). Gõ `2` không ra số lượng 2. Bộ test không gõ ô đó; nó thêm sản phẩm lần nữa.

Bằng chứng cả bộ: chiến dịch 2 của A3, 22–23/10/2026, 10 lượt, mỗi lượt `# pass 8` và `# fail 0`, trung bình 102,284 s, trung vị 102,238 s. Mười lượt này bắt đầu sau khi đã xử lý bàn phím và Alert. Mười lượt không phải xác suất flaky dài hạn. Log ở `docs/evidence/A3_runs_2026-10-22_data-driven.log`.

### 4.5 Eyes — ba mức chưa có lần chạy

TV2 chưa đưa SDK, khoá API, tên app, viewport hay batch dashboard. Chưa có những thứ đó thì không trình bày baseline hay ảnh diff.

Thứ tự dự kiến, sau khi danh sách sản phẩm đã hiện (bước 12 của mục 3): `Eyes.open` (tên app, tên test, viewport emulator) → `Eyes.check` → `Eyes.close`. Lần check được chấp nhận đầu tiên tạo baseline. Chấp nhận nghĩa là UI đó thành chuẩn mới. Match level và vùng bỏ qua ghi trong phiếu của batch đó. Lý thuyết: `Ly_Thuyet_T03_Mobile_Automation.md`, mục C2 và A4.2–A4.5.

Repo chưa có bản đổi banner và chưa có bản đổi màu. Câu bảo trì seminar vẫn chờ một cặp lần chạy thật:

| Thay đổi | Test chức năng | Test giao diện | Cách xử lý khi đã có diff |
|----------|----------------|----------------|---------------------------|
| Ảnh banner hoặc ảnh sản phẩm đổi, bố cục giữ | Thường pass nếu script không assert ảnh | Thường fail | Ứng viên vùng bỏ qua, và chỉ cho đúng ảnh đó |
| Màu, khoảng cách hoặc bố cục đổi ngoài yêu cầu | Thường vẫn pass | Phải fail | Regression thật. Không bỏ qua |

Đổi banner rẻ với Appium và đắt với Eyes. Đổi màu thì ngược lại. Câu này là dự đoán từ hai oracle cho tới khi TV2 gắn cả hai kết quả.

### 4.6 Vùng bỏ qua và người được cập nhật baseline

Chỉ dùng sau một diff Eyes thật. Đây là quy tắc, chưa phải vùng đã vẽ trên baseline.

| Có thể bỏ qua | Không bỏ qua |
|---------------|--------------|
| Banner hoặc ảnh sản phẩm khi bố cục không đổi | Giá và tổng đơn |
| Mốc thời gian hoặc avatar ngẫu nhiên ngoài kịch bản | Nút đăng nhập, thêm vào giỏ, thanh toán |
| Vùng marketing nhóm đã thống nhất là nội dung xoay | Dòng lỗi đăng nhập và form đăng nhập |

Người cập nhật baseline phải có chấp thuận của giảng viên hoặc người QA được chỉ định. Phiếu ghi lý do, vùng đã bỏ qua, và bản build áp dụng. Cập nhật baseline để che một lỗi làm hỏng oracle.

### 4.7 Maestro — chỉ khi được chấp thuận

Repo không có file flow. Dùng Maestro sau khi giảng viên nhận nó thay trial Applitools đã hết. Flow sẽ lặp đăng nhập → tìm kiếm → `assertVisible` tên `iPhone 15 Pro Max`. `assertWithAI` chỉ đứng vai kiểm tra giao diện thay thế. Trong demo phải nói kiểm tra AI này không có baseline Eyes, vùng bỏ qua hay triage trên dashboard. `assertWithAI` mặc định `optional: true`, nên một câu AI sai không làm fail flow trừ khi đặt `optional: false`.

### 4.8 Detox trên cùng đăng nhập và tìm kiếm

Detox là đối sánh DX, không phải công cụ demo. PoC `src/detox/tests/login-search.test.js` đăng nhập tài khoản mẫu, tìm `iPhone`, xác nhận còn `iPhone 15 Pro Max` và không còn thẻ Samsung. PoC không chạy tổng giỏ.

Đã ghi trên Linux, 22/10/2026, AVD `eshop_api34`, Node 22.23.4, Detox 20.51.4 (`docs/A4_Detox.md`, `docs/evidence/A4_detox_runs_2026-10-22.log`):

- Build Gradle rút gọn: `BUILD SUCCESSFUL` trong 4 phút 42 giây.
- Ba lượt sau: mỗi lượt 1/1 test; Jest 25,508 s, 24,790 s và 38,594 s.
- Bản nháp đầu fail vì `pressBack()` sau `replaceText` đóng activity. Lệnh đó đã bỏ trước ba lượt pass.

| | Appium A2 | Detox A4 |
|--|-----------|----------|
| Chuẩn bị thêm | Server Appium và driver UiAutomator2 | Instrumentation, APK test, Jest, Node 22.13+ |
| Tìm phần tử | `UiSelector().resourceId` trên `testID` | `by.id` trên cùng `testID` |
| Chờ | `waitForDisplayed` / `waitUntil` | Detox chờ idle; PoC vẫn chờ dữ liệu API |
| State sạch | `noReset: false`, rồi `terminateApp` + `activateApp` | `device.launchApp({ delete: true })` |
| Khi nên chọn | APK hộp đen, device farm về sau, phiên WebDriver để gắn Eyes | CI React Native trong repo này, ít lệnh chờ tự viết |

Không xếp hạng hai công cụ bằng 25 s của Detox và trung vị 30,496 s của chiến dịch Appium 1. Chiến dịch 1 là một test đăng nhập + tìm kiếm; mẫu Detox là ba lượt trong điều kiện khác. A4 ghi thẳng so sánh đó.

Lệnh dựng, từ `eshop-sut-main/frontend-mobile`, Node 22.13 trở lên, backend và Metro đang chạy:

```bash
npm ci
npx expo prebuild --platform android --no-install
npm run detox:build
npm run detox:test -- --headless --gpu swiftshader_indirect
```

Kiểm tra đĩa trống trước khi mở emulator. Lần trên máy TV1, emulator từ chối boot khi còn khoảng 1,7 GiB; sau khi còn khoảng 3,4 GiB thì boot được.

---

## 5. Xử lý sự cố

Một lỗi lặp lại trên mọi lượt là defect hoặc môi trường hỏng. Một lỗi lúc có lúc không trên cùng bản build, cùng test và cùng AVD là flake. Sáu mục 5.1–5.6 đã gặp trên AVD Linux khi viết A2, A3 và A4. Mục 5.7 là máy chưa xong mục 2.1. Eyes và Maestro không có log trong hướng dẫn này.

Quy tắc reset: một backend, một emulator, một bản app. Mỗi lần chỉ đổi một trong ba.

### 5.1 Bàn phím che nút

**Đã gặp** trên Linux trước chiến dịch 2 của A3. Cú bấm báo không tìm thấy phần tử. Nút vẫn có trong app.

UiAutomator2 không trả về phần tử bị bàn phím ảo che. A2 mục 5 ghi việc này ở nửa dưới màn hình, gồm **Thêm vào giỏ**. `hideKeyboardIfShown` trong `src/appium/tests/helpers.js` chạy sau đăng nhập. Nếu một cú bấm mới fail cùng kiểu, ẩn bàn phím rồi `waitForDisplayed` đúng phần tử cần bấm. Kéo dài `sleep` không nêu điều kiện để test đi tiếp.

### 5.2 Alert thành công nuốt cú bấm sau

**Đã gặp** trên Linux ở các lần giỏ đầu, trước chiến dịch 2. Hai cú bấm **Thêm vào giỏ** để lại số lượng 1, và huy hiệu giỏ rời khỏi cây giao diện.

`App.js` gọi `Alert.alert("Thành công", "Đã thêm vào giỏ hàng")` sau mỗi lần thêm. Cú bấm kế rơi vào hộp thoại. `HomePage.addToCart` đợi `android:id/button1`, bấm OK, và đợi nút đó biến mất. Không bấm thêm khi Alert còn mở. A3 loại các lượt này khỏi 10/10 vì là lỗi của test.

### 5.3 Hai mật khẩu sai khoá tài khoản, màn hình giấu lý do

**Đã gặp** trên Linux khi thiết kế A2 (test cùng `server.js` và `App.js`). Một `POST /api/login` với `SaiMatKhau-1` trả `401` và `{"error":"Invalid email or password"}`.

Mỗi lần sai cộng 2 vào `login_attempts`. Đạt 3 thì khoá 3 phút (`locked_until`). Màn hình luôn hiện `Đăng nhập thất bại. Vui lòng kiểm tra lại.`, kể cả khi API nói tài khoản bị khoá. Nếu một lượt chết sau `L1`, khởi động lại backend. Không thêm dòng đăng nhập sai thứ hai.

### 5.4 Cold start để app ở nền

**Đã gặp** trên Linux trước `activateApp` (ghi chú chiến dịch 1 của A3, commit `865deea`). Phiên mở nhưng không thấy nút Đăng nhập.

APK debug không phải lúc nào cũng được đưa lên trước. `startApp` gọi `terminateApp` rồi `activateApp` trên package `com.eshop.sut` và đợi tối đa 30 giây tới khi có nút đăng nhập. Đó là chờ phần tử màn hình, không phải `sleep`.

### 5.5 `pressBack` đóng màn Đăng nhập của Detox

**Đã gặp** trên Linux ngày 22/10, ở bản nháp Detox đầu. Sau khi gõ mật khẩu, activity đã mất.

`pressBack()` sau `replaceText` đóng màn hình trên `eshop_api34`. Lệnh đã bỏ trước ba lượt pass. Dòng đầu log là `Warm run after fixing pressBack` trong `docs/evidence/A4_detox_runs_2026-10-22.log`.

### 5.6 Emulator không boot khi đĩa gần đầy

**Đã gặp** trên máy Linux lúc làm A4. Còn khoảng 1,7 GiB thì emulator từ chối khởi động. Sau khi dọn cache, còn khoảng 3,4 GiB, máy ảo boot được. Kiểm tra đĩa trống trước khi mở `eshop_api34`. Đây là lỗi môi trường, không phải test flaky.

### 5.7 SDK, AVD hoặc doctor chưa đủ

Các việc này hiện trên máy chưa xong mục 2.1. Chúng là lỗ hổng môi trường, không phải lỗi locator.

| Việc đã xảy ra | Nguyên nhân | Cách mở |
|----------------|-------------|---------|
| `adb` không phải lệnh, hoặc `adb devices` rỗng | `ANDROID_HOME` chưa đặt, platform-tools không trên `PATH`, hoặc `emulator -list-avds` không in gì | Mục 2.1. Tạo `eshop_api34` và boot trước Appium |
| `appium driver doctor uiautomator2` thoát mã 1 | Thiếu `apkanalyzer` vì chưa cài cmdline-tools. `adb` và `emulator` vẫn thấy được khi `ANDROID_HOME` đã đặt | Cài cmdline-tools. Khi `adb` đã chạy, dòng doctor bảo cài lại cả SDK rộng hơn chỗ đang thiếu |
| `GET /` cổng 4723 trả 404 | Appium 2 không có route ở `/`. Sẵn sàng là `GET /status` | Đọc `/status` và kỳ vọng `ready: true` |

### 5.8 Chưa có log để gỡ theo hướng dẫn này

| Triệu chứng có thể gặp sau | Chỗ xem khi nó xảy ra thật |
|----------------------------|----------------------------|
| Đăng nhập xoay mãi hoặc báo lỗi mạng | Backend phải ở cổng 3000. Trên emulator, client dùng địa chỉ mặc định trong mã; `localhost` bên trong emulator là chính emulator. A1 ghi địa chỉ đó |
| Tìm `iPhone` không ra gì | Khởi động lại `npm start` để nạp seed, rồi bấm nút tìm |
| Eyes không tải lên, hoặc fail mọi lượt | Repo chưa có batch. Khi TV2 có: `APPLITOOLS_API_KEY`, `Eyes.close`, cùng AVD và viewport với baseline |
| Maestro không thấy app | Chưa có file flow. Một thiết bị, APK debug đã cài, không phải Expo Go |

---

## 6. Các cách công cụ gây hiểu sai

Brief yêu cầu ba cách các công cụ này làm người đọc kết luận sai. Ba mục dưới đã quan sát trên EShop. Cặp Eyes trong lý thuyết mục A4.4 vẫn là chính sách: chưa có batch dashboard để gắn.

### 6.1 Cú bấm trả về chưa phải giỏ đúng

Ở các lần giỏ đầu, Appium giao cú bấm thứ hai. Cú bấm rơi vào Alert thành công, nên số lượng dòng vẫn là 1 và tổng vẫn 30000000 thay vì 60000000. Script chỉ kiểm tra `click` đã trả về thì vẫn xanh. Lớp gây hiểu sai là kết quả thao tác của Appium. Assertion chữ số trên giỏ mới làm test đỏ.

Cùng hình dạng đó được dự đoán khi màu hoặc khoảng cách đổi mà mọi `testID` còn đủ: Appium có thể pass trong khi màn hình sai. Nửa đó cần checkpoint Eyes. Chưa chạy. Không trích thành kết quả.

### 6.2 Lượt đỏ là lỗi test, không phải lỗi sản phẩm

Các fail sau đã tái lập, đã sửa trong test, và không tính vào tỷ lệ pass của A3:

| Cái đã đỏ | Cái thực sự sai |
|-----------|-----------------|
| Không thấy **Thêm vào giỏ** | Bàn phím che nút (mục 5.1) |
| Tổng giỏ thiếu một món | Alert nhận cú bấm thứ hai (mục 5.2) |
| Không thấy nút đăng nhập sau phiên mới | APK debug không ở foreground (mục 5.4) |
| Activity đăng nhập của Detox mất sau mật khẩu | `pressBack()` đóng nó (mục 5.5) |

Sau các sửa đó, chiến dịch 2 của A3 ghi 10/10 lượt với `# fail 0`. A3 cũng nói mười lượt không ước lượng tỷ lệ flake dài hạn. Ghi bốn dòng trên thành defect của EShop là chọn nhầm oracle.

Đổi banner có thể làm Eyes đỏ trong khi giá vẫn đúng. Đó là dạng giao diện của mode này. Repo không có ảnh diff. Bỏ qua cả cửa sổ để Eyes xanh sẽ che một lỗi bố cục sau này (mục 4.6).

### 6.3 Câu trên màn hình là oracle yếu hơn

`handleLogin` trong `App.js` luôn gán `Đăng nhập thất bại. Vui lòng kiểm tra lại.` API trả `Invalid email or password` hoặc `Tài khoản đã bị khóa. Vui lòng thử lại sau.` Test chỉ assert dòng lỗi không tách được mật khẩu sai khỏi tài khoản bị khoá. Cả hai đều “đỏ” vì cùng một chuỗi. A2 ghi UI gộp hai nguyên nhân. Một lần đăng nhập sai trả HTTP 401 với `Invalid email or password`. Vì vậy mỗi đời backend chỉ được một mật khẩu sai, và server được khởi động lại nếu `L1` không được nối bằng `L2`.

File `docs/evidence/A2_inspector_recorder_2026-10-23.js` là oracle yếu thứ hai. Nó bấm đăng nhập và gõ email qua `$$(...)[0]`, không có wait và không có assertion. Phát lại file đó không kiểm tra tên sản phẩm hay giá.

Eyes xanh cộng giá sai là cặp thứ ba trong ghi chú lý thuyết. Chưa quan sát được. Giữ assertion tên và assertion chữ số của tổng giỏ kể cả khi một kiểm tra giao diện sau này xanh. Applitools không đọc quyền truy cập, và `assertWithAI` có thể bỏ sót hoặc bịa một defect.

---

## 7. Tài liệu tham khảo

1. Hans-Joachim Görg — *Practical Appium*, chương 1–4.
2. [Espresso](https://developer.android.com/training/testing/espresso), [Detox — design principles](https://wix.github.io/Detox/docs/next/articles/design-principles/), [Detox — how it works](https://github.com/wix/Detox/blob/master/docs/articles/how-detox-works.md). Đối sánh EShop nằm ở `docs/A4_Detox.md`.
3. Applitools — *Visual AI 101*; [Match levels and regions](https://applitools.com/docs/eyes/concepts/best-practices/match-levels).
4. [Appium](https://appium.io/). [Kiến trúc UiAutomator2](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/architecture.md). [Capability và tiền tố `appium:`](https://appium.io/docs/en/2.19/guides/caps/) — trang này khớp server khóa trong `src/appium`. [UiAutomator2 driver quickstart](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/).
5. [Applitools mobile testing](https://applitools.com/solutions/mobile-testing/). [Pricing](https://support.applitools.com/platform-pricing/). Khảo sát S1 ghi Starter 667 USD/tháng khi trả theo năm và trial 14 ngày; đối chiếu lại trang giá trước khi nộp.
6. [Maestro — React Native](https://docs.maestro.dev/get-started/supported-platform/react-native). [assertWithAI](https://docs.maestro.dev/reference/commands-available/assertwithai). [assertNoDefectsWithAI](https://docs.maestro.dev/reference/commands-available/assertnodefectswithai).
7. Tài liệu môn: `Ly_Thuyet_T03_Mobile_Automation.md`, `Demo_Scenario.md`, `Tool_Survey_Proposal.md`, `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`, `eshop-sut-main/setup_guide.md`. Brief seminar: `T03_Mobile_Automation_Testing.docx`, `Seminar_Guide.docx`, `Seminar_Scenario_Draft.md`.

---

## 8. AI disclosure

The S1 tool survey used OpenAI Codex to extract criteria and draft the comparison matrix. Licence, price, React Native support, AI features, and community size were checked against vendor docs and repositories on 28/09/2026.

Sections 1–7 were revised with Cursor (Grok) on 23/10/2026 from `Ly_Thuyet_T03_Mobile_Automation.md`, `Demo_Scenario.md`, `docs/A1_Setup.md`, `docs/A2_Test_Design.md`, `docs/A3_Metrics.md`, `docs/A4_Detox.md`, and the current `eshop-sut-main` / `src/appium` source. The same day they were rewritten in Vietnamese. Sections 4–7 cover the three demo levels, record/playback, the data-driven suite, and checkpoints. Failures in sections 5 and 6 come from the A2/A3/A4 logs. Eyes has no recorded batch.

---

## 9. Open items

Closed from the SUT and the seminar test project: Appium 2.19.0 and UiAutomator2 4.2.9, package `com.eshop.sut`, default API `http://10.0.2.2:3000/api`, `testID` locators, the JavaScript suite in `src/appium/`, the login error string, the empty-search check (result count disappears), and the admin seed password `Admin123!`.

Still open:

| # | Gap | Why it blocks a peer | Where to look |
|---|-----|----------------------|---------------|
| 1 | A new machine has not finished section 2.1 (no AVD, no Platform 36, no cmdline-tools, `ANDROID_HOME` unset) | The emulator build and `npm test` cannot start. Doctor exits 1 | Section 2.1. The recorded UI run stays in A1/A3 |
| 2 | `android/` and the debug APK are not in git | `npx expo run:android` has to be run locally. Node for that build is 20.19 or newer (22.13+ only for Detox) | Mục 2.3 |
| 3 | Eyes SDK, app name, viewport, and match level are undecided | Mục 4.5–4.6 cannot be repeated as a run | TV2, after the first dashboard batch. Mục 4.4 và 4.8 đã có bằng chứng Linux |
| 4 | Banner and colour builds are not in the repo | Mục 4.5 has no build to switch | TV2 UI variants |
| 5 | Maestro flow file does not exist | Backup demo has no file | Only after instructor approval |
| 6 | Mục 6.1–6.3 have an observed Appium/Detox half and no Eyes screenshot | The banner-versus-colour pair and a green Eyes check over a wrong price are still a policy | TV2. Keyboard, alert, cold start, `pressBack`, and the collapsed login error are already in A2/A3/A4 |
