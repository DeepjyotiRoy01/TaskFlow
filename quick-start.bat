@echo off
REM =============================================================================
REM Task Manager Pro - Quick Start Script for Windows
REM =============================================================================
REM This script will help you set up Task Manager Pro quickly on Windows
REM Run: quick-start.bat

setlocal enabledelayedexpansion

echo =============================================================================
echo 🚀 Task Manager Pro - Quick Start Script for Windows
echo =============================================================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do (
    set NODE_VERSION=%%a
    set NODE_VERSION=!NODE_VERSION:~1!
)
if !NODE_VERSION! lss 18 (
    echo [ERROR] Node.js version is too old. Please install Node.js 18 or higher.
    pause
    exit /b 1
)
echo [SUCCESS] Node.js version is compatible

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm 9 or higher.
    pause
    exit /b 1
)

REM Check npm version
for /f "tokens=1 delims=." %%a in ('npm --version') do set NPM_VERSION=%%a
if !NPM_VERSION! lss 9 (
    echo [ERROR] npm version is too old. Please install npm 9 or higher.
    pause
    exit /b 1
)
echo [SUCCESS] npm version is compatible

REM Check if MongoDB is installed
echo [INFO] Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed. You can:
    echo   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
    echo   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas
    echo   3. Continue without MongoDB (you'll need to configure it later)
    set /p CONTINUE="Do you want to continue? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] MongoDB is installed
)

echo.
echo [INFO] Setting up Task Manager Pro...

REM Create environment file if it doesn't exist
if not exist "server\.env" (
    echo [INFO] Creating environment file...
    if exist "server\env.example" (
        copy "server\env.example" "server\.env" >nul
        echo [SUCCESS] Environment file created from template
        echo [WARNING] Please update server\.env with your configuration
    ) else (
        echo [ERROR] env.example file not found
        pause
        exit /b 1
    )
) else (
    echo [INFO] Environment file already exists
)

REM Create required directories
echo [INFO] Creating required directories...
if not exist "server\uploads" mkdir "server\uploads"
if not exist "server\logs" mkdir "server\logs"
echo [SUCCESS] Directories created

REM Install dependencies
echo [INFO] Installing dependencies...
call npm run install-all
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

REM Start MongoDB if available
if exist "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" (
    echo [INFO] Checking if MongoDB is running...
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo [SUCCESS] MongoDB is already running
    ) else (
        echo [WARNING] Starting MongoDB...
        start /B "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
        timeout /t 3 /nobreak >nul
        echo [SUCCESS] MongoDB started
    )
)

echo.
echo [INFO] Starting Task Manager Pro...
echo [SUCCESS] Application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo [WARNING] Press Ctrl+C to stop the application
echo.

REM Start the application
call npm run dev

pause 