@echo off
REM Start Voice AI Agent with Ngrok Integration
REM This script starts both the backend and ngrok tunnel

echo 🚀 Starting Voice AI Agent with Ngrok Integration
echo ==================================================

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found. Please run setup first.
    pause
    exit /b 1
)

REM Activate virtual environment
echo 📦 Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if backend is already running
curl -s http://localhost:5001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is already running on port 5001
) else (
    echo 🔧 Starting backend server...
    REM Start backend in background
    start /b python twilio_voice_agent.py

    REM Wait for backend to start
    echo ⏳ Waiting for backend to start...
    for /l %%i in (1,1,30) do (
        curl -s http://localhost:5001/health >nul 2>&1
        if %errorlevel% equ 0 (
            echo ✅ Backend started successfully
            goto :backend_ready
        )
        timeout /t 1 /nobreak >nul
    )
    echo ❌ Backend failed to start
    pause
    exit /b 1
)

:backend_ready

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok is not installed. Please install it first:
    echo    Download from: https://ngrok.com/download
    pause
    exit /b 1
)

REM Start ngrok
echo 🌐 Starting ngrok tunnel...
start /b ngrok http 5001

REM Wait for ngrok to start
echo ⏳ Waiting for ngrok to start...
timeout /t 5 /nobreak >nul

REM Get ngrok URL (simplified version for Windows)
echo ✅ Ngrok tunnel started successfully!
echo 🌐 Public URL: Check http://localhost:4040 for the ngrok URL
echo 🔗 Local URL: http://localhost:5001
echo.

REM Print Twilio configuration instructions
echo 📞 TWILIO WEBHOOK CONFIGURATION
echo ================================
echo.
echo 1. Go to your Twilio Console: https://console.twilio.com/
echo 2. Navigate to Phone Numbers ^> Manage ^> Active numbers
echo 3. Click on your Twilio phone number
echo 4. Configure the following webhooks:
echo.
echo    Voice URL: [NGROK_URL]/webhook
echo    Status Callback URL: [NGROK_URL]/status
echo.
echo 5. Set HTTP method to 'POST' for both
echo 6. Save the configuration
echo.
echo 🔧 Alternative: Use Twilio CLI
echo    twilio phone-numbers:update YOUR_TWILIO_NUMBER ^
echo      --voice-url=[NGROK_URL]/webhook ^
echo      --status-callback-url=[NGROK_URL]/status
echo.
echo 🎯 NEXT STEPS:
echo 1. Check http://localhost:4040 for your ngrok URL
echo 2. Configure your Twilio webhooks using the URLs above
echo 3. Call your Twilio phone number to test
echo 4. Check the backend logs for call activity
echo 5. Use the frontend dashboard to monitor performance
echo.
echo 💡 Keep this window open to maintain the services
echo    Press Ctrl+C to stop when done
echo.

REM Keep script running
pause
