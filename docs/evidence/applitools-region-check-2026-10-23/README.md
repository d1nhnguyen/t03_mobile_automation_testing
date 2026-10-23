# Kiểm chứng vùng layout/ignore của Eyes trên bản V1 (23/10/2026)

Máy TV1: Ubuntu, AVD `eshop_api34` (1080×2400, 420 dpi), Appium 2.19.0, UiAutomator2 4.2.9, `@applitools/eyes-webdriverio` 5.61.14, tài khoản Applitools của TV1 (baseline tạo từ bản base cùng ngày). Mỗi lượt chạy test "Tìm kiếm theo bảng dữ liệu" (4 checkpoint: Home trước tìm, S1, S2, S3) hoặc cả file login-search.

| Lượt | Biến thể | Vùng ảnh sản phẩm 1 gửi kèm | Kết quả Eyes | Log |
|---|---|---|---|---|
| Đối chứng | base | layoutRegions(phần tử) | **Passed** 0/4 lệch | `eyes-base-verify.log` |
| 1 | v1 | layoutRegions(phần tử) — selector đã sửa, vùng được gắn | Unresolved 3/4 | `eyes-v1-run.log` |
| 2 | v1 | ignoreRegions(phần tử) | Unresolved 3/4 | `eyes-v1-ignore-run.log` |
| 3 | v1 | ignoreRegions(toạ độ dp = px ÷ 2,625) | Unresolved 3/4 | `eyes-v1-ignore-dp.log` |
| 4 | v1 | ignoreRegions(dp, trừ status bar 128 px) | Unresolved 3/4 | `eyes-v1-ignore-viewport.log` |
| 5 | v1 | ignoreRegions(px nguyên bản) | Unresolved 3/4 | `eyes-v1-ignore-px.log` |
| 6 | v1 | ignoreRegions(phủ toàn ảnh 5000×5000) | **Passed** 0/4 | `eyes-v1-ignore-full.log` |

So pixel cục bộ (`home_base_vs_v1_diffmask.png`, PIL, ngưỡng 24): V1 chỉ khác base ở đồng hồ status bar (y 52–80 px) và đúng hộp ảnh sản phẩm 1 `[84,687][996,1133]`; không có khác biệt nào khác.

**Kết luận:** region có được áp dụng (lượt 6), baseline ổn định (đối chứng), V1 chỉ đổi ảnh; nhưng vùng truyền bằng phần tử hoặc bằng bốn hệ toạ độ thử nghiệm đều không trùng vị trí ảnh trên ảnh chụp của Eyes (viewport báo 411×866 dp, trong khi màn hình là 411×914 dp). Nguyên nhân chính xác chưa xác định; vùng có hiệu lực trong B2 là vùng đặt tay trên dashboard. Code giữ `layoutRegions`/`ignoreRegions` (công tắc `IMAGE_REGION_MODE`) kèm cảnh báo "phải xác nhận trên dashboard".
