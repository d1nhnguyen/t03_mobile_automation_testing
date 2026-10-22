#!/usr/bin/env bash
# Đo thời gian và độ lặp lại của bộ test Appium (A3).
# Cách dùng: từ src/appium/, sau khi backend, Metro, emulator và Appium đã sẵn sàng:
#   bash scripts/measure-runs.sh [số lượt=10] [thư mục kết quả=../../docs/evidence]
# Mỗi lượt gọi `npm test` (node --test --test-concurrency=1), ghi exit code,
# thời gian (ms) và kết quả TAP vào CSV + log. Không khởi động lại dịch vụ giữa các lượt.
set -u
RUNS="${1:-10}"
OUT_DIR="${2:-../../docs/evidence}"
STAMP="$(date +%F)"
CSV="$OUT_DIR/A3_runs_${STAMP}.csv"
LOG="$OUT_DIR/A3_runs_${STAMP}.log"
mkdir -p "$OUT_DIR"
export APPIUM_HOME="${APPIUM_HOME:-$PWD/.appium}"
echo "run,start_iso,duration_ms,exit_code,result,tap_pass,tap_fail" > "$CSV"
: > "$LOG"
for i in $(seq 1 "$RUNS"); do
  start_iso="$(date --iso-8601=seconds)"
  t0=$(date +%s%3N)
  echo "===== RUN $i  $start_iso" >> "$LOG"
  timeout 600 npm test >> "$LOG" 2>&1
  code=$?
  t1=$(date +%s%3N)
  dur=$((t1 - t0))
  pass=$(grep -E '^# pass ' "$LOG" | tail -1 | awk '{print $3}')
  fail=$(grep -E '^# fail ' "$LOG" | tail -1 | awk '{print $3}')
  result=PASS; [ "$code" -ne 0 ] && result=FAIL
  echo "$i,$start_iso,$dur,$code,$result,$pass,$fail" | tee -a "$CSV"
done
echo "CSV: $CSV"; echo "LOG: $LOG"
