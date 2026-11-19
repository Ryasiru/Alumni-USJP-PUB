@echo off
setlocal EnableDelayedExpansion
:: USJ Alumni Directory - Windows Launcher (start.command.bat)
set "DIR=%~dp0"
if "%DIR:~-1%"=="\" set "DIR=%DIR:~0,-1%"

:: 1. Locate Node.js binary
set "NODE_BIN="
where node >nul 2>&1
if %errorlevel%==0 (
    for /f "delims=" %%i in ('where node') do (
        set "NODE_BIN=%%i"
        goto :found_node
    )
)
:found_node

:: 2. Start add_member.js daemon silently if not already running
if defined NODE_BIN (
    tasklist /FI "IMAGENAME eq node.exe" /FO CSV 2>nul | findstr /i "add_member.js" >nul 2>&1
    if errorlevel 1 (
        start "" /B "%NODE_BIN%" "%DIR%\add_member.js" --daemon >nul 2>&1
        timeout /t 1 /nobreak >nul
    )
)

:: 3. Open Directory in default browser (unless --no-open is specified)
if "%1" neq "--no-open" (
    start "" "%DIR%\index.html"
)

exit /b 0
