@echo off
REM Copyright (c) 2026 BlackVideo (Zephyra)
REM YouTube Proxy Server Startup Script for Windows

title BlackVideo YouTube Proxy Server

echo.
echo ================================================
echo   BlackVideo YouTube Proxy Server
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js found: 
node --version
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Start the server
echo [INFO] Starting YouTube Proxy Server...
echo [INFO] Server will run on http://localhost:9292
echo [INFO] Press Ctrl+C to stop the server
echo.

node youtube-stream-server.js

pause
