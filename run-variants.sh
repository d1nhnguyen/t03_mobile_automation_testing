#!/usr/bin/env bash
# run-variants.sh - Chạy test Appium + Applitools Eyes cho 3 UI variant (base, v1, v2)
# theo docs/A1_Setup.md:
#   emulator -> adb reverse -> backend (npm start) -> Appium (npm run server)
#   -> Metro / expo run:android -> npm test
#
# Đặt ở thư mục gốc repo t03_mobile_automation_testing/ rồi chạy trong Git Bash:
#   export APPLITOOLS_API_KEY="your_key"     # hoặc ghi vào src/appium/.env
#   ./run-variants.sh            # all: base (tạo + kiểm baseline) -> v1 -> v2
#   ./run-variants.sh base|v1|v2 # chạy riêng một variant
#
# Biến tùy chọn:
#   AVD_NAME=eshop_api34   AVD sẽ mở nếu chưa có emulator
#   SKIP_BASELINE=1        bỏ qua lần chạy tạo baseline (đã Accept từ trước)
#   AUTO=1                 không dừng chờ Enter
#   FORCE_BUILD=1          luôn chạy 'npx expo run:android' cho mỗi variant
#   RESET_BACKEND=0        không restart backend trước mỗi lần chạy test
#   METRO_PORT / BACKEND_PORT / APPIUM_PORT   đổi cổng

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${BACKEND_DIR:-$ROOT/eshop-sut-main/backend}"
MOBILE_DIR="${MOBILE_DIR:-$ROOT/eshop-sut-main/frontend-mobile}"
APPIUM_DIR="${APPIUM_DIR:-$ROOT/src/appium}"

AVD_NAME="${AVD_NAME:-eshop_api34}"
BACKEND_PORT="${BACKEND_PORT:-3000}"
METRO_PORT="${METRO_PORT:-8081}"
APPIUM_PORT="${APPIUM_PORT:-4723}"
TARGET="${1:-all}"

STAMP="$(date +%Y%m%d-%H%M%S)"
LOG_DIR="$APPIUM_DIR/logs/$STAMP"
mkdir -p "$LOG_DIR"

BACKEND_PID=""
METRO_PID=""
APPIUM_PID=""
APK_INSTALLED=0
SUMMARY=()

log()   { echo -e "\n\033[1;36m[$(date +%H:%M:%S)] $*\033[0m"; }
err()   { echo -e "\033[1;31m[ERROR] $*\033[0m" >&2; }
pause() { [ "${AUTO:-0}" = "1" ] && return 0; read -r -p "$1" _; }

# ---------- Biến môi trường từ .env (xử lý cả CRLF) ----------
load_env() {
  local f
  for f in "$APPIUM_DIR/.env" "$ROOT/.env"; do
    if [ -f "$f" ]; then
      set -a
      # shellcheck disable=SC1090
      source <(tr -d '\r' < "$f")
      set +a
    fi
  done
}

# ---------- Tiến trình / cổng ----------
is_windows() { command -v taskkill >/dev/null 2>&1; }

port_pids() {
  local port="$1"
  if is_windows; then
    netstat -ano 2>/dev/null | grep -E ":${port}[[:space:]].*LISTENING" | awk '{print $5}' | sort -u
  else
    lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null | sort -u
  fi
}

kill_port() {
  local port="$1" p i
  for p in $(port_pids "$port"); do
    if is_windows; then
      taskkill //F //T //PID "$p" >/dev/null 2>&1 || kill -9 "$p" >/dev/null 2>&1
    else
      kill -9 "$p" >/dev/null 2>&1
    fi
  done
  for i in $(seq 1 15); do
    [ -z "$(port_pids "$port")" ] && return 0
    sleep 1
  done
  return 0
}

wait_http() { # wait_http <url> <pattern|""> <timeout_s>
  local url="$1" pat="$2" timeout="$3" i
  for i in $(seq 1 "$timeout"); do
    if [ -n "$pat" ]; then
      curl -s -m 2 "$url" 2>/dev/null | grep -q "$pat" && return 0
    else
      curl -s -m 2 -o /dev/null "$url" 2>/dev/null && return 0
    fi
    sleep 1
  done
  return 1
}

# ---------- Kiểm tra điều kiện ----------
preflight() {
  [ -d "$BACKEND_DIR" ] || { err "Không thấy $BACKEND_DIR"; exit 1; }
  [ -d "$MOBILE_DIR" ]  || { err "Không thấy $MOBILE_DIR"; exit 1; }
  [ -d "$APPIUM_DIR" ]  || { err "Không thấy $APPIUM_DIR"; exit 1; }
  command -v node >/dev/null 2>&1 || { err "Không thấy node trong PATH (nvm use 20)"; exit 1; }
  command -v npx  >/dev/null 2>&1 || { err "Không thấy npx trong PATH"; exit 1; }
  command -v adb  >/dev/null 2>&1 || { err "Không thấy adb (thêm \$ANDROID_HOME/platform-tools vào PATH)"; exit 1; }
  [ -n "${APPLITOOLS_API_KEY:-}" ] || { err "Chưa có APPLITOOLS_API_KEY (export hoặc ghi vào src/appium/.env)"; exit 1; }
  [ -d "$APPIUM_DIR/node_modules" ] || { err "Chưa npm ci trong $APPIUM_DIR"; exit 1; }
  [ -d "$BACKEND_DIR/node_modules" ] || { err "Chưa npm ci trong $BACKEND_DIR"; exit 1; }
  [ -d "$MOBILE_DIR/node_modules" ]  || { err "Chưa npm ci trong $MOBILE_DIR"; exit 1; }
  log "Node $(node -v)"
}

# ---------- Emulator ----------
ensure_emulator() {
  if adb devices 2>/dev/null | awk 'NR>1 && $2=="device"' | grep -q .; then
    log "Emulator/thiết bị đã sẵn sàng"
  else
    command -v emulator >/dev/null 2>&1 || { err "Chưa có thiết bị chạy và không thấy 'emulator' trong PATH"; return 1; }
    log "Mở AVD $AVD_NAME"
    ( emulator -avd "$AVD_NAME" ) >"$LOG_DIR/emulator.log" 2>&1 &
    adb wait-for-device
    local i
    for i in $(seq 1 180); do
      [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
      sleep 2
    done
  fi
  # Tắt animation để ảnh Eyes ổn định
  adb shell settings put global window_animation_scale 0 >/dev/null 2>&1
  adb shell settings put global transition_animation_scale 0 >/dev/null 2>&1
  adb shell settings put global animator_duration_scale 0 >/dev/null 2>&1
  adb reverse "tcp:${METRO_PORT}" "tcp:${METRO_PORT}" >/dev/null
  log "adb reverse tcp:${METRO_PORT} tcp:${METRO_PORT} xong"
}

# ---------- Backend ----------
stop_backend() {
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" >/dev/null 2>&1
  BACKEND_PID=""
  kill_port "$BACKEND_PORT"
}

start_backend() {
  stop_backend
  log "Backend: npm start (tạo lại DB + dữ liệu mẫu)"
  ( cd "$BACKEND_DIR" && npm start ) >"$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  if ! wait_http "http://localhost:${BACKEND_PORT}/api/products" "iPhone" 60; then
    err "Backend không trả sản phẩm iPhone sau 60s. Xem $LOG_DIR/backend.log"
    return 1
  fi
  log "Backend sẵn sàng (http://localhost:${BACKEND_PORT})"
}

# ---------- Appium ----------
appium_has_driver() {
  (
    cd "$APPIUM_DIR" || exit 1
    export APPIUM_HOME="$PWD/.appium"
    npx appium driver list --installed 2>&1 | grep -qi "uiautomator2"
  )
}

start_appium() {
  # Tắt Appium cũ: có thể chạy không có APPIUM_HOME=.appium nên không thấy driver
  if [ -n "$(port_pids "$APPIUM_PORT")" ]; then
    log "Cổng $APPIUM_PORT đang bị chiếm, tắt để tự khởi động Appium đúng cấu hình"
    kill_port "$APPIUM_PORT"
  fi

  log "Kiểm tra driver UiAutomator2 trong $APPIUM_DIR/.appium"
  if ! appium_has_driver; then
    log "Chưa có UiAutomator2, chạy npm run driver:install"
    (
      cd "$APPIUM_DIR" || exit 1
      export APPIUM_HOME="$PWD/.appium"
      npm run driver:install
    ) 2>&1 | tee "$LOG_DIR/appium-driver.log"
  fi
  if ! appium_has_driver; then
    err "Vẫn không thấy UiAutomator2. Chạy tay: cd src/appium && export APPIUM_HOME=\"\$PWD/.appium\" && npm run driver:install && npm run driver:doctor"
    return 1
  fi

  log "Appium: npm run server (APPIUM_HOME=.appium)"
  (
    cd "$APPIUM_DIR" || exit 1
    export APPIUM_HOME="$PWD/.appium"
    npm run server
  ) >"$LOG_DIR/appium.log" 2>&1 &
  APPIUM_PID=$!
  if ! wait_http "http://127.0.0.1:${APPIUM_PORT}/status" "" 90; then
    err "Appium không lên sau 90s. Xem $LOG_DIR/appium.log"
    return 1
  fi
  log "Appium sẵn sàng"
}

stop_appium() {
  [ -n "$APPIUM_PID" ] || return 0
  kill "$APPIUM_PID" >/dev/null 2>&1
  kill_port "$APPIUM_PORT"
  APPIUM_PID=""
}

# ---------- Metro / app ----------
stop_metro() {
  [ -n "$METRO_PID" ] && kill "$METRO_PID" >/dev/null 2>&1
  METRO_PID=""
  kill_port "$METRO_PORT"
}

# Lần đầu (hoặc FORCE_BUILD=1): expo run:android (build + cài APK + Metro).
# Các lần sau: chỉ restart Metro vì APK debug nạp JS từ Metro.
start_metro() {
  local variant="$1" cmd wait_s
  stop_metro
  if [ "$APK_INSTALLED" = "0" ] || [ "${FORCE_BUILD:-0}" = "1" ]; then
    cmd="npx expo run:android"
    wait_s=1500
    log "Build + cài APK: EXPO_PUBLIC_UI_VARIANT=$variant $cmd (lần đầu có thể mất vài phút)"
  else
    cmd="npx expo start --clear --port $METRO_PORT"
    wait_s=180
    log "Restart Metro: EXPO_PUBLIC_UI_VARIANT=$variant $cmd"
  fi
  (
    cd "$MOBILE_DIR" || exit 1
    EXPO_PUBLIC_UI_VARIANT="$variant" CI=1 $cmd
  ) >"$LOG_DIR/metro-$variant.log" 2>&1 &
  METRO_PID=$!

  if ! wait_http "http://localhost:${METRO_PORT}/status" "running" "$wait_s"; then
    err "Metro không lên. Xem $LOG_DIR/metro-$variant.log"
    return 1
  fi
  APK_INSTALLED=1
  adb reverse "tcp:${METRO_PORT}" "tcp:${METRO_PORT}" >/dev/null
  log "Metro sẵn sàng (variant=$variant)"

  local apk="${ESHOP_APK_PATH:-$MOBILE_DIR/android/app/build/outputs/apk/debug/app-debug.apk}"
  [ -f "$apk" ] || log "CẢNH BÁO: không thấy APK ở $apk (đặt ESHOP_APK_PATH nếu session.js dùng đường dẫn khác)"
}

# ---------- Chạy test ----------
# run_tests <label_batch> <tên_log> ; trả về exit code của npm test
run_tests() {
  local label="$1" name="$2"
  local logfile="$LOG_DIR/$name.log" t0 t1 code

  if [ "${RESET_BACKEND:-1}" = "1" ]; then
    start_backend || return 2
  fi
  adb reverse "tcp:${METRO_PORT}" "tcp:${METRO_PORT}" >/dev/null

  log "Chạy test: $name (VARIANT_LABEL=$label)"
  t0=$(date +%s)
  (
    cd "$APPIUM_DIR" || exit 1
    export APPIUM_HOME="$PWD/.appium"
    VARIANT_LABEL="$label" npm test
  ) 2>&1 | tee "$logfile"
  code=${PIPESTATUS[0]}
  t1=$(date +%s)

  local status="PASS"
  [ "$code" -ne 0 ] && status="FAIL"
  SUMMARY+=("$(printf '%-24s functional=%-5s time=%ss log=%s' "$name" "$status" "$((t1 - t0))" "$logfile")")
  log "Kết quả $name: functional=$status (exit=$code), $((t1 - t0))s"
  return "$code"
}

run_base() {
  start_metro base || return 1
  if [ "${SKIP_BASELINE:-0}" != "1" ]; then
    if ! run_tests base "base-1-create-baseline"; then
      err "Test base lỗi ngay lần tạo baseline: dừng, vì baseline chưa hợp lệ. Xem log trong $LOG_DIR"
      return 1
    fi
    echo
    echo "=============================================================="
    echo " Vào https://eyes.applitools.com -> batch 'EShop - base'"
    echo " Accept TOÀN BỘ ảnh (Save) để lưu baseline, rồi quay lại đây."
    echo "=============================================================="
    pause "Nhấn Enter khi đã Accept baseline... "
  fi
  run_tests base "base-2-verify"
}

run_variant() {
  local v="$1"
  start_metro "$v" || return 1
  pause "Nhìn emulator xác nhận đúng giao diện '$v', rồi nhấn Enter để chạy test... "
  run_tests "$v" "$v"
}

cleanup() {
  log "Dọn dẹp: tắt Metro, backend, Appium (nếu script tự bật)"
  stop_metro
  stop_backend
  stop_appium
}
trap cleanup EXIT INT TERM

# ---------- Main ----------
case "$TARGET" in
  all|base|v1|v2) ;;
  *) err "Tham số không hợp lệ: $TARGET (dùng: all | base | v1 | v2)"; exit 1 ;;
esac

load_env
preflight
log "Log lưu tại: $LOG_DIR"
ensure_emulator || exit 1
start_backend   || exit 1
start_appium    || exit 1

case "$TARGET" in
  all)  run_base && { run_variant v1; run_variant v2; } ;;
  base) run_base ;;
  v1)   run_variant v1 ;;
  v2)   run_variant v2 ;;
esac

echo
echo "================= TỔNG KẾT ================="
for line in "${SUMMARY[@]:-}"; do [ -n "$line" ] && echo "$line"; done
echo "============================================"
echo "Functional = kết quả assert (terminal)."
echo "Visual     = xem Passed/Unresolved trên dashboard Applitools, batch 'EShop - <variant>'."
