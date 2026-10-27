# Link video demo

- **Video demo chung** (6:51): https://youtu.be/N3cN5d2LSG4
- **Playlist các video demo chi tiết:** https://www.youtube.com/playlist?list=PLeb4FZ9d0wiQ

## Tình trạng playlist (cập nhật 27/10/2026)

| Video    | Nội dung                                                                                                                                                                 | Tình trạng                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Video 01 | Cài đặt từ đầu, bật môi trường và các khái niệm cơ bản                                                                                                                   |                                       |
| Video 02 | Demo đơn giản: Appium Inspector, Record & Playback và bài test đầu tiên                                                                                                  |                                       |
| Video 03 | Demo phức tạp và kiểm thử hướng dữ liệu (_Demo Eyes Complex Flow_, 4:01): code test WebdriverIO, dữ liệu dạng bảng, chạy cả bộ test EShop với checkpoint Applitools Eyes | Đã đăng: https://youtu.be/8nfXBO29Lg8 |

## Lý do các video còn thiếu

Nhóm đã quay video 01 và 02 vào tối 27/10/2026 khi có thông tin cần demo nhiều luồng, nhưng các bản ghi bị lỗi và không dùng được.

- **Hiện tượng:** mỗi file chỉ hiển thị một khung hình đứng yên từ đầu đến cuối (ảnh màn hình lúc 21:49), dù thời lượng file vẫn đúng.
- **Nguyên nhân:** lúc 21:49:24, luồng quay màn hình của OBS Studio (PipeWire trên Ubuntu Wayland) chuyển sang trạng thái tạm dừng (log OBS ghi `[pipewire] Stream ... state: "paused"`) và không tự chạy lại. OBS vẫn ghi file nhưng chỉ lặp lại khung hình cuối cùng. Vì vậy cả 6 file quay từ 22:23 đến 23:04 (tổng khoảng 16 phút) đều bị đứng hình.
- **Kiểm tra:** bộ lọc `freezedetect` của ffmpeg xác nhận cả 6 file đứng hình từ giây 0 đến hết. Các file quay trước 21:49 vẫn bình thường.
- **Khắc phục:** khởi động lại OBS để tạo lại luồng quay màn hình, kiểm tra khung preview trước mỗi lần quay, và quay lại toàn bộ các video còn thiếu.

**Thời hạn:** các video còn thiếu có thể được đăng lên playlist trễ khoảng 30 phút so với hạn nộp, và chắc chắn có đầy đủ trước buổi demo.
