#!/usr/bin/env python3
"""Tổng hợp CSV của measure-runs.sh thành bảng Markdown và số liệu thống kê.
Cách dùng: python3 -I scripts/summarize-runs.py ../../docs/evidence/A3_runs_YYYY-MM-DD.csv
"""
import csv, statistics, sys

path = sys.argv[1]
rows = list(csv.DictReader(open(path, encoding="utf-8")))
durs = [int(r["duration_ms"]) / 1000 for r in rows]
fails = [r for r in rows if r["result"] != "PASS"]

print("| Lượt | Thời gian (s) | Kết quả | TAP pass/fail |")
print("|---:|---:|---|---|")
for r, d in zip(rows, durs):
    print(f"| {r['run']} | {d:.3f} | {'Đạt' if r['result']=='PASS' else 'Lỗi'} | {r.get('tap_pass','?')}/{r.get('tap_fail','?')} |")
print()
print(f"Số lượt: {len(rows)} · Đạt: {len(rows)-len(fails)}/{len(rows)} · "
      f"Flake quan sát: {len(fails)}/{len(rows)} = {100*len(fails)/len(rows):.0f}%")
print(f"Trung bình: {statistics.mean(durs):.3f} s · Trung vị: {statistics.median(durs):.3f} s · "
      f"Khoảng: {min(durs):.3f}–{max(durs):.3f} s")
