# T03 Mobile Automation Testing — User Guide

**Course:** CS423 / CSC15003 Software Testing  
**Topic:** T03 — Mobile Automation Testing  
**SUT:** EShop React Native Expo client (`eshop-sut/frontend-mobile`)  
**Stack:** Appium 2 + UiAutomator2 (traditional) · Applitools Eyes (AI visual) · Maestro CLI + AI assertions (backup)

**Status of this guide:** draft for Stage S4. Steps marked **Verified in repo** come from `eshop-sut` or the team documents. Steps marked **Not yet recorded** have no team install log, script, or screenshot in this repository. Do not treat those as a finished procedure.

**Core message:** Appium checks what the user *does* and what data the app shows. Applitools checks what the user *sees*. The two layers complement each other.

---

## 1. Introduction

### 1.1 What this guide is for

A peer should be able to:

1. Start the EShop API and the mobile client.
2. Drive a login → product search → data assertion with Appium on an Android emulator.
3. Add an Applitools Eyes checkpoint on the home or product list.
4. Tell a true visual bug from a false positive, and know which regions must not be ignored.
5. Switch to Maestro only if the Applitools trial is unavailable and the instructor has approved the switch.

### 1.2 Why mobile automation is harder than web

The same scenario can pass on one Android image and fail on another because of OS/device fragmentation, permissions, network delay, and small touch targets. EShop’s Expo client is the system under test for that problem.

### 1.3 What each tool is responsible for

| Layer | Tool | Question it answers |
|-------|------|---------------------|
| Functional | Appium 2 + UiAutomator2 | Did login and search return the expected data? |
| Visual AI | Applitools Eyes | Did the screen regress against an approved baseline? |
| Backup | Maestro + AI assertions | Can the same flow run, with a lighter AI check, if Eyes is unavailable? |
| Policy | Team rules | Which diffs are bugs, noise, or intentional updates? |

Live demo rule (Seminar Guide): show at least one traditional feature and one AI-augmented feature.

### 1.4 Scenario in scope

Verified from the seminar scenario and the tool survey:

1. Log in.
2. Search for a product.
3. Assert the result (name and price).
4. Take a visual checkpoint.
5. Compare two controlled UI changes: a banner image change (possible false positive) versus a colour/layout change (true regression even if the functional test still passes).

Out of scope for the minimum demo: checkout, coupons, admin, iOS, and a real device farm. Device farm is a later extension, not a requirement of the first runnable test.

---

## 2. Install

### 2.1 Prerequisites

**Verified in repo** (`eshop-sut/setup_guide.md`):

- Node.js 18 or newer, with npm.

**Required by the tool survey, not yet recorded as a working install in this repo:**

- JDK (for Android command-line tools / Appium).
- Android SDK, platform tools (`adb`), and one Android Virtual Device (AVD).
- Appium 2 and the UiAutomator2 driver.
- An Applitools account and API key (14-day trial; the department does not provide a paid account).
- Maestro CLI only if the backup path is approved.

Pin the exact versions after the first successful run and paste them into section 9.

### 2.2 Start the EShop backend

**Verified in repo.** Paths below use this course tree (`eshop-sut`), not the `EShop/` path printed in the original setup guide.

```bash
cd eshop-sut/backend
npm install
node database.js
node server.js
```

Expected log: the API listens on `http://localhost:3000`. Leave this terminal open. `node database.js` seeds users and products; run it again only when you need a clean database.

**Seed accounts (verified in `backend/database.js` and the system spec):**

| Role | Email | Password |
|------|-------|----------|
| User (use this for the mobile test) | `test@eshop.com` | `Test1234!` |
| Admin | `admin@eshop.com` | `Admin123!` |

**Seed products you can assert:**

| Name | Price (VND) |
|------|-------------|
| iPhone 15 Pro Max | 30000000 |
| Samsung Galaxy S24 Ultra | 28000000 |
| MacBook Pro M3 | 45000000 |
| Tai nghe AirPods Pro 2 | 6000000 |
| Bàn phím cơ Keychron Q1 | 4000000 |

`setup_guide.md` prints a different admin password (`admin123`). The database seed and the system spec both use `Admin123!`. Use the seed value.

### 2.3 Point the mobile app at the API

**Verified in repo** (`frontend-mobile/App.js`):

```js
const API_URL = "http://192.168.10.13:3000/api";
```

That address is a LAN IP. It is not the emulator loopback.

The tool survey says the demo should use `10.0.2.2:3000` so the Android emulator can reach the host. `10.0.2.2` is the emulator’s alias for the host machine.

Before any automated run:

1. Change `API_URL` to the address that matches the device you use.
   - Android emulator: `http://10.0.2.2:3000/api`
   - Physical phone on the same Wi-Fi: the computer’s current LAN IP, for example `http://<lan-ip>:3000/api`
2. Rebuild or reload the app so the new URL is in the binary you automate.
3. Confirm login works once by hand. If the API is unreachable, every later test will look like a locator failure.

### 2.4 Run the mobile client

**Verified in repo** for a manual Expo session (`setup_guide.md`, `frontend-mobile/package.json`):

```bash
cd eshop-sut/frontend-mobile
npm install
npx expo start
```

Press `a` to open an Android emulator, or scan the QR code with Expo Go. The phone and the computer must share a network when you use Expo Go.

**Not yet recorded:** the seminar scenario asks for an Android **development APK**, not only Expo Go. `app.json` has no `android.package`. There is no EAS/dev-client config and no APK path in this repository. Appium needs a package you can install with `app` or `appPackage` + `appActivity`. Record that package name and activity after the first build (section 9).

### 2.5 Install Appium 2 + UiAutomator2

**Not yet recorded.** Official starting points are listed in References. After a successful install, replace this checklist with the exact commands that worked:

1. Install the Appium 2 CLI.
2. Install the UiAutomator2 driver (`appium driver install uiautomator2`).
3. Start an AVD and check `adb devices`.
4. Start the Appium server.
5. Open Appium Inspector, attach a session, and confirm the EShop screen is in the hierarchy.

Suggested capability keys (values are **not** verified):

| Capability | Expected meaning |
|------------|------------------|
| `platformName` | `Android` |
| `appium:automationName` | `UiAutomator2` |
| `appium:deviceName` | AVD name from `adb devices` |
| `appium:app` | Absolute path to the development APK |
| `appium:appPackage` / `appium:appActivity` | Only if you launch an already installed app |

### 2.6 Install Applitools Eyes

**Not yet recorded.**

1. Create a trial account and an API key. Store the key in an environment variable (`APPLITOOLS_API_KEY`). Do not commit the key.
2. Add the Eyes SDK that matches the test language the team actually uses (Node, Java, or Python). The language is not chosen in the repo yet.
3. Call `Eyes.open` → `check` → `close` once, then accept the first baseline on the dashboard.

### 2.7 Install Maestro (backup only)

**Not yet recorded.** Install the Maestro CLI and confirm `maestro` can see the same emulator. Use this path only after the instructor accepts it as the replacement for an expired Applitools trial.

---

## 3. First test

Goal: one functional path on EShop. Visual AI comes in section 4.

### 3.1 What “pass” means

Using the seed user and the seed catalog:

1. Open the app (backend already running, `API_URL` reachable).
2. Open **Đăng Nhập**.
3. Enter `test@eshop.com` / `Test1234!`.
4. Tap **Sign In**.
5. Search for `iPhone`.
6. Assert that the text `iPhone 15 Pro Max` is visible.

A wrong password must not reach that product screen. The login error is rendered as text under the form (`loginError` in `App.js`). The exact error string is **not** specified in the system spec beyond “a suitable error message”.

### 3.2 How to find elements

**Verified in repo:** `App.js` has **no** `testID` and **no** `accessibilityLabel`. Visible hooks that do exist:

| Screen | What you can see |
|--------|------------------|
| Login | Label `Username`, placeholder `Email`, placeholder `Mật khẩu`, button text `Sign In` |
| Home search | placeholder `Tìm kiếm...` |

Text and placeholders work for a first test. They break when copy or language changes. The theory note still stands: prefer `testID` once the team adds it. Until then, record the Inspector strategy you actually used (text, placeholder, or XPath) in section 9.

Do not ship a long hierarchy XPath as the long-term locator.

### 3.3 Recommended first script shape

The repository does not contain a test file yet. Write the test in the language chosen in section 9. The sequence is fixed even though the code is not:

1. Create a session with the capabilities from section 2.5.
2. Wait until `Sign In` or `Đăng Nhập` is present. Use an explicit wait, not a fixed sleep.
3. Type the seed email and password. On Android, hide the keyboard before the next tap if it covers **Sign In**.
4. Tap **Sign In** and wait until the login form is gone or the search field is visible.
5. Type `iPhone` into `Tìm kiếm...`.
6. Assert `iPhone 15 Pro Max` is displayed.
7. End the session.

Run this test **three times** on the same AVD before the seminar (scenario draft). A single green run is not enough.

### 3.4 Record and playback, data, checkpoint

| Building block | First-test minimum |
|----------------|--------------------|
| Record and playback | Use Appium Inspector to discover the login locators, then save the steps as a script. Inspector output is a draft, not the submitted test. |
| Data-driven | Keep email, password, keyword, and expected name in one table. The first row is the seed user + `iPhone` / `iPhone 15 Pro Max`. |
| Checkpoint | The functional checkpoint is the product-name assertion. The visual checkpoint is added in section 4. |

---

## 4. Advanced usage

### 4.1 Add an Eyes checkpoint

After step 6 of the first test, while the product list is on screen:

1. `Eyes.open` with the app name, test name, and the emulator viewport.
2. `Eyes.check` the window (or a named region such as “home” / “search results”).
3. `Eyes.close` so the batch is uploaded.

First successful check **creates** a baseline. Later checks compare against it. A human accepts or rejects the result on the Applitools dashboard. Accepting a baseline means “this UI is the new standard”, not “the test was noisy so I clicked through”.

### 4.2 Two controlled UI changes

Run the same functional test against two builds. Record both results.

| Change | Functional test | Visual test | How to treat it |
|--------|-----------------|-------------|-----------------|
| Banner / product image changes, layout stays | Usually pass | Often fail | Candidate false positive. An ignore region is allowed only for that image area. |
| Colour token, spacing, or layout changes outside the request | Often still pass | Should fail | True regression. Do not ignore it. |

Maintenance question the seminar must answer in writing: a banner image change is cheaper for Appium (no locator break) and more expensive for Eyes (triage). A colour change is the opposite.

### 4.3 Ignore-region policy

| May be ignored | Must not be ignored |
|----------------|---------------------|
| Rotating banner or product image when layout is unchanged | Price and order total |
| Timestamp or random avatar, if it is outside the scenario | Primary buttons (`Sign In`, buy / checkout) |
| A marketing region the team already agreed rotates | Error text and form state |

### 4.4 Who may update a baseline

- The UI change is already accepted by the person playing product/design (in class: the instructor or the named QA owner).
- The note says why, which regions were ignored, and which build it applies to.
- Do not update a baseline to hide a bug.

### 4.5 Data-driven extension

Add rows only after the first row is stable:

| Email | Password | Keyword | Expected visible text | Expected functional result |
|-------|----------|---------|-----------------------|----------------------------|
| `test@eshop.com` | `Test1234!` | `iPhone` | `iPhone 15 Pro Max` | Pass |
| `test@eshop.com` | `wrong-password` | — | Login error visible, search not available | Fail closed (rejected login) |
| `test@eshop.com` | `Test1234!` | `does-not-exist` | Empty-state message | Pass only if the empty state matches the spec |

The empty-state wording is specified as “a suitable empty state”, not as an exact string. Capture the real string from the app before asserting it.

Account lockout is in the spec (3 failures, 30 seconds). Do not burn the seed user with repeated bad logins during demo setup. Use a separate account if you test lockout.

### 4.6 Maestro backup

If the Applitools trial cannot cover the seminar, and the instructor has agreed:

1. Recreate login → search → `assertVisible` of `iPhone 15 Pro Max` as a Maestro YAML flow.
2. Add `assertWithAI` only as the visual stand-in.
3. Say explicitly in the demo that Maestro AI does **not** provide an Eyes baseline, ignore region, or dashboard triage.

Maestro Studio can record the flow. Built-in waiting reduces some sleeps. It does not remove the need for a real data assertion.

### 4.7 When Detox is the better traditional tool

Detox is not the main demo tool. Mention it when someone asks about React Native CI:

| Prefer Appium | Prefer Detox |
|---------------|--------------|
| Android and iOS, real devices, device farm, black-box APK | React Native CI, same JS repo, less device setup |
| You must attach Eyes to a WebDriver session | You care more about RN synchronization than visual AI |

A written DX comparison (same login/search scenario) is a T03 study milestone. The PoC itself belongs with the traditional-tool demo, not with this guide’s happy path.

---

## 5. Troubleshooting

| Symptom | Likely cause | What to check |
|---------|--------------|---------------|
| App opens, login spins or shows a network error | API URL | `API_URL` in `App.js`; backend still on port 3000; emulator uses `10.0.2.2`, not `localhost` |
| `adb devices` is empty | Emulator not booted, or USB debugging off | Start the AVD before Appium |
| Session fails immediately | Wrong APK, package, or activity | Inspector against a known-good APK; `app.json` currently has no package name |
| Element not found on login | Copy used as locator changed, keyboard covering the button, or screen still animating | Re-read the hierarchy; wait for `Sign In`; hide the keyboard |
| Search returns nothing | Seed not loaded, or keyword not applied | Re-run `node database.js` only if you intend to wipe data; search `iPhone` |
| Login starts failing after several tries | Spec lockout: 3 failures, 30 seconds | Wait, or use a fresh user |
| Eyes never uploads | Missing API key, offline machine, or `close` not called | Environment variable and the dashboard batch list |
| Eyes fails on every run | Dynamic images, or the baseline was taken on another device/viewport | Same AVD and window size; then triage, do not auto-accept |
| Maestro cannot see the app | Different device than Appium, or Expo Go vs installed APK | One target only during the demo |

Reset rule: one backend, one emulator, one app build. Change one of those at a time.

---

## 6. Failure modes

The T03 brief requires three real ways these tools can mislead you. These are the three the seminar should be ready to show.

### 6.1 A green functional test hides a broken screen

Appium taps and reads text. It can pass after a colour, spacing, or overlap change, including a control that is still “there” in the hierarchy but no longer looks usable. Eyes is the layer that should fail. Treating “Appium passed” as “the release is fine” is the mistake.

### 6.2 A red visual test is not automatically a product bug

A new banner image, anti-aliasing, or a loading spinner left in the screenshot makes Eyes fail while behaviour and prices stay correct. Ignoring the whole screen to get green hides real regressions. Ignore only the agreed dynamic region. Price, totals, **Sign In** / checkout, and error text stay inside the comparison.

### 6.3 The two oracles disagree, and the team picks the wrong one

Typical pairs:

- Functional pass + visual fail → layout/colour regression, or noise. Decide with the policy in section 4.3, not by habit.
- Functional fail + visual pass → wrong price, wrong account, or a missing error, while the screenshot still “looks like” the baseline.

Applitools does not check authorization or the numeric price. Maestro `assertWithAI` can also miss or invent a defect. Keep at least the login and product-name assertions even when an AI check is green.

Related, but secondary: a flaky Appium run (animation, network, leftover session) looks like a product bug. Re-run on a reset emulator before you file it. Three identical results are the seminar bar.

---

## 7. References

1. Hans-Joachim Görg — *Practical Appium*, chapters 1–4.
2. React Native testing docs — Detox vs Appium decision matrix.
3. Applitools — *Visual AI 101* whitepaper.
4. [Appium](https://appium.io/)
5. [UiAutomator2 driver](https://appium.io/docs/en/2.5/quickstart/uiauto2-driver/)
6. [Applitools mobile testing](https://applitools.com/solutions/mobile-testing/)
7. [Applitools pricing](https://support.applitools.com/platform-pricing/) (Starter listed in the S1 survey as 667 USD/month billed yearly; trial 14 days; re-check before submission)
8. [Maestro — React Native](https://docs.maestro.dev/get-started/supported-platform/react-native)
9. [Maestro — assertWithAI](https://docs.maestro.dev/reference/commands-available/assertwithai)
10. Course documents: `T03_Mobile_Automation_Testing.docx`, `Seminar_Guide.docx`, `Tool_Survey_Proposal.md`, `Seminar_Scenario_Draft.md`, `eshop-sut/setup_guide.md`, `eshop-sut/README.md`.

Internal theory notes: `Ly_Thuyet_T03_Mobile_Automation.md`.

---

## 8. AI disclosure

The S1 tool survey used OpenAI Codex to extract criteria and draft the comparison matrix. Licence, price, React Native support, AI features, and community size were checked against vendor docs and repositories on 28/09/2026.

This user guide was drafted with Cursor (Grok) from those course documents and from `eshop-sut` source. It is not a record of a successful Appium or Eyes run. The team must edit it after the install verification and replace every **Not yet recorded** item before Stage S4 submission.

---

## 9. Open items (not specified clearly enough to execute)

Fill this table from the install log. Until a row is filled, that part of the guide is not reproducible.

| # | Gap | Why it blocks a peer | Where to look |
|---|-----|----------------------|---------------|
| 1 | No Appium / JDK / Android SDK versions and no command log | Section 2.5 cannot be repeated | Team install notes |
| 2 | No development APK, package name, or activity | Appium has nothing to launch; `app.json` has no `android.package` | EAS/dev build or `adb shell pm` |
| 3 | `API_URL` is a fixed LAN IP (`192.168.10.13`), while the survey says `10.0.2.2` | Emulator tests fail closed on network | `frontend-mobile/App.js` |
| 4 | No `testID` / accessibility id in the mobile app | Locators are text-only and fragile | `App.js` |
| 5 | Test language and repo path of the script are undecided | No first test to run | Team choice: JS, Java, or Python |
| 6 | Eyes SDK language, app name, viewport, and match level are undecided | Checkpoint cannot be repeated | Applitools dashboard after the first batch |
| 7 | Exact login-error and empty-search strings are not in the spec | Assertions would be guessed | Capture from the running app |
| 8 | Admin password disagrees across docs (`admin123` vs `Admin123!`) | Wrong account in a demo | Trust `database.js`: `Admin123!` |
| 9 | Controlled UI builds (banner vs colour) are not in the repo | Section 4.2 has no build to switch | TV2 UI variants |
| 10 | Maestro flow file does not exist | Backup demo is undescribed as a file | Only after instructor approval |
| 11 | Detox DX write-up is a milestone, not written | Learning objective 5 is unfinished | Same scenario, short comparison |
| 12 | Failure modes are theoretical until one real run of each is attached | Rubric asks for 3 real ways the tool misleads | Screenshots from sections 6.1–6.3 |
