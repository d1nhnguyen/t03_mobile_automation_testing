# A3 — Appium timing and repeatability

Measured on 22 October 2026 (UTC+7), Ubuntu/Linux, Android 14 AVD `eshop_api34`, Appium 2.19.0 with UiAutomator2 4.2.9, using the A2 login and search test at commit `865deea`.

## Measurement conditions

- The debug APK and npm dependencies were already installed. The AVD used its existing state; no Android build, package installation, or dependency download is included in setup time.
- **Setup time** is wall time from starting the backend to all four components being ready: backend `/api/products` returned HTTP 200, Metro `/status` returned `packager-status:running`, Appium `/status` reported `ready: true`, and the emulator reported `sys.boot_completed=1`. `adb reverse tcp:8081 tcp:8081` was then configured. Start: 10:31:20.703; ready: 10:31:40.922. **Setup time: 20.219 s.** This is service startup on this machine, not first-time installation or APK build time.
- **Run time** is wall time around `npm test` (`node --test`), including npm startup, Appium session creation, login/search assertions, and session teardown. Ten runs were sequential on the same emulator and services. Each run created a new Appium session with `noReset=false`; no service was restarted between runs. A 150 s timeout guarded each run.
- **Observed flake rate** = runs with nonzero exit code / 10 under these fixed conditions. A run counted as a pass only when its exit code was zero; the raw TAP log was also checked for `pass 1`, `fail 0` in every run. This 10-run sample cannot establish a long-term flake probability.

## Results

| Run | Time (s) | Result |
|---:|---:|---|
| 1 | 31.734 | Pass |
| 2 | 30.532 | Pass |
| 3 | 30.902 | Pass |
| 4 | 30.460 | Pass |
| 5 | 30.162 | Pass |
| 6 | 30.652 | Pass |
| 7 | 30.150 | Pass |
| 8 | 30.862 | Pass |
| 9 | 29.751 | Pass |
| 10 | 30.389 | Pass |

**Summary:** 10/10 passed; observed flake rate **0/10 = 0%**. Mean run time **30.559 s**, median **30.496 s**, range **29.751–31.734 s**. The earlier cold-start failure occurred before the A2 app-activation fix at commit `865deea`; it is excluded from this post-fix campaign.

Raw [CSV](evidence/A3_runs_2026-10-22.csv) and [TAP log](evidence/A3_runs_2026-10-22.log) contain the per-run evidence. To repeat the measurement, start the four components using [A1 setup](A1_Setup.md), check RAM, then run `npm test` ten times from `src/appium/`, timing each process from start to exit. The short presentation flow is in [Demo_Scenario.md](../Demo_Scenario.md).
