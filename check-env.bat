@echo off
setlocal enabledelayedexpansion
set FAILS=0

echo ============================================
echo   KIEM TRA MOI TRUONG APPIUM / ANDROID
echo ============================================

echo.
echo --- Bien moi truong ---
call :chk_env ANDROID_HOME
call :chk_env JAVA_HOME

echo.
echo --- Cong cu ---
call :chk_cmd node
call :chk_cmd npm
call :chk_cmd java
call :chk_cmd adb
call :chk_cmd emulator
call :chk_cmd curl

set "NODEV="
for /f "delims=" %%v in ('node -v 2^>nul') do set "NODEV=%%v"
if defined NODEV (
  for /f "tokens=1 delims=." %%a in ("!NODEV:~1!") do set "MAJOR=%%a"
  if !MAJOR! GEQ 20 (
    call :ok "Node !NODEV! dat yeu cau 20.19 tro len"
  ) else (
    call :fail "Node !NODEV! qua cu, can 20.19 tro len, dung nvm use 20"
  )
)

echo.
echo --- Android SDK ---
if defined ANDROID_HOME (
  call :chk_path "SDK Platform 36" "%ANDROID_HOME%\platforms\android-36"
  call :chk_path "Build-Tools 36.0.0" "%ANDROID_HOME%\build-tools\36.0.0"
  call :chk_path "platform-tools" "%ANDROID_HOME%\platform-tools\adb.exe"
)

echo.
echo --- Emulator / thiet bi ---
emulator -list-avds 2>nul | findstr /x "eshop_api34" >nul
if errorlevel 1 (call :fail "Khong thay AVD eshop_api34") else (call :ok "AVD eshop_api34")

adb devices 2>nul | findstr /r "device$" >nul
if errorlevel 1 (call :fail "adb devices: chua co thiet bi o trang thai device") else (call :ok "adb devices: co thiet bi")

adb reverse --list 2>nul | findstr "8081" >nul
if errorlevel 1 (call :fail "Chua adb reverse tcp:8081, chay: adb reverse tcp:8081 tcp:8081") else (call :ok "adb reverse 8081")

adb shell pm list packages com.eshop.sut 2>nul | findstr "com.eshop.sut" >nul
if errorlevel 1 (call :fail "App com.eshop.sut chua cai tren emulator") else (call :ok "App com.eshop.sut da cai")

echo.
echo --- Dich vu dang chay ---
call :chk_port 3000 "Backend"
call :chk_port 4723 "Appium server"
call :chk_port 8081 "Metro bundler"

curl -s -f -m 3 http://localhost:3000/api/products >nul 2>nul
if errorlevel 1 (call :fail "API /api/products khong tra loi") else (call :ok "API /api/products")

echo.
echo ============================================
if %FAILS%==0 (
  echo   TAT CA DEU OK, chay: npm test
) else (
  echo   CO %FAILS% MUC FAIL, xem cac dong [FAIL] o tren
)
echo ============================================
endlocal
pause
exit /b

:ok
echo [OK]   %~1
exit /b

:fail
echo [FAIL] %~1
set /a FAILS+=1
exit /b

:chk_env
if not defined %~1 goto :env_fail
set "val=!%~1!"
if exist "!val!" (
  call :ok "%~1 = !val!"
) else (
  call :fail "%~1 tro toi duong dan khong ton tai: !val!"
)
exit /b
:env_fail
call :fail "%~1 chua duoc dat"
exit /b

:chk_cmd
where %~1 >nul 2>nul
if errorlevel 1 (call :fail "%~1 khong co trong PATH") else (call :ok "%~1")
exit /b

:chk_path
if exist "%~2" (call :ok "%~1") else (call :fail "%~1 khong ton tai")
exit /b

:chk_port
netstat -ano | findstr /r /c:":%~1 .*LISTENING" >nul
if errorlevel 1 (call :fail "Cong %~1 %~2 chua chay") else (call :ok "Cong %~1 %~2 dang chay")
exit /b
