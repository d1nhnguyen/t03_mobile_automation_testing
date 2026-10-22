# Appium demo scenario: EShop login and product search

**Target length:** about 2 minutes of the Appium portion of the seminar demo. Use English narration. The Applitools Eyes scenario is a separate task.

## Before recording

Follow [A1 setup](docs/A1_Setup.md) to start the backend, Metro, an Android emulator with a visible window, and Appium. Check RAM before opening the emulator. Confirm the backend has demo data, `adb devices` reports `device`, `adb reverse tcp:8081 tcp:8081` is set, and Appium `/status` reports `ready: true`. Keep the EShop emulator visible beside the terminal. Run `npm test` once as a rehearsal, then restart the backend if the data needs resetting.

## Live sequence

| Time | Show | Say / verify |
|---|---|---|
| 0:00–0:20 | EShop on Android and the Appium test file | “Appium sends WebDriver commands to UiAutomator2, which interacts with the Android app. This test checks a user journey, not just whether controls can be tapped.” |
| 0:20–0:35 | `src/appium/tests/login-search.test.js` | Point out the login and search assertions. The demo account and product are seeded by the backend. |
| 0:35–1:15 | Run `cd src/appium && npm test` | Watch the app open, sign in as the demo user, and search for `iPhone`. Avoid entering credentials by hand during the timed run. |
| 1:15–1:40 | Test output; refer to the product list shown during the run | Expected: `pass 1`, `fail 0`; one result named `iPhone 15 Pro Max`, with no Samsung item in the filtered list. Explain that the test checks both authenticated state and search data. |
| 1:40–2:00 | A3 measurement summary | State the measured setup time, median test run time, and failures out of ten runs from [A3 metrics](docs/A3_Metrics.md). Explain the measurement conditions. |

If the run fails, keep the actual output visible, identify the failing step, and recheck the backend, Metro, emulator, and Appium readiness described in [A1 setup](docs/A1_Setup.md). Do not present a rehearsal result as a live pass.
