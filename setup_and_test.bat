@echo off
REM 🎤 Voice AI Agent - Complete Setup & Test Script for Windows
REM This script makes the platform truly "plug & play" for your team!

echo 🚀 Voice AI Agent - Complete Setup & Test
echo ==========================================
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.11+ first.
    echo    Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed

REM Step 1: Environment Setup
echo.
echo [INFO] Step 1: Setting up environment...

REM Create virtual environment
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    echo [SUCCESS] Virtual environment created
) else (
    echo [SUCCESS] Virtual environment already exists
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt
echo [SUCCESS] Python dependencies installed

REM Deactivate virtual environment
deactivate

REM Step 2: Frontend Setup
echo.
echo [INFO] Step 2: Setting up React frontend...

cd frontend

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install
echo [SUCCESS] Node.js dependencies installed

REM Return to project root
cd ..

REM Step 3: Environment Configuration
echo.
echo [INFO] Step 3: Configuring environment...

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [SUCCESS] .env file created
    echo.
    echo [WARNING] IMPORTANT: Please edit .env file with your actual API keys:
    echo    - TWILIO_ACCOUNT_SID
    echo    - TWILIO_AUTH_TOKEN
    echo    - TWILIO_PHONE_NUMBER (your actual Twilio number)
    echo    - OPENAI_API_KEY
    echo    - DEEPGRAM_API_KEY
    echo    - ELEVENLABS_API_KEY
    echo.
    echo After editing .env, run this script again to test everything!
    echo.
    pause
    exit /b 0
) else (
    echo [SUCCESS] .env file already exists
)

REM Step 4: Test API Connections
echo.
echo [INFO] Step 4: Testing API connections...

REM Activate virtual environment for testing
call venv\Scripts\activate.bat

REM Test if .env has real values (not placeholder)
findstr "your_twilio_account_sid_here" .env >nul
if not errorlevel 1 (
    echo [WARNING] Please edit .env file with your actual API keys first!
    echo    Then run this script again to test everything.
    echo.
    pause
    exit /b 0
)

echo [INFO] Testing API connections...

REM Test script
python test_setup.py

if errorlevel 1 (
    echo [ERROR] Some API connections failed. Please check your .env file.
    echo.
    echo [WARNING] Common issues:
    echo    - Invalid API keys
    echo    - Insufficient account balance
    echo    - API service down
    echo.
    pause
    exit /b 1
) else (
    echo [SUCCESS] All API connections successful!
)

REM Step 5: Start Services
echo.
echo [INFO] Step 5: Starting services...

echo [INFO] Starting backend server...
REM Start backend in background
call venv\Scripts\activate.bat
start "Voice AI Backend" python twilio_voice_agent.py

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Check if backend is running
curl -s http://localhost:5001/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend server failed to start
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend server started successfully on port 5001
)

echo [INFO] Starting frontend...
cd frontend
start "Voice AI Frontend" npm start

REM Wait for frontend to start
timeout /t 10 /nobreak >nul

cd ..

REM Step 6: Final Instructions
echo.
echo 🎉 SETUP COMPLETE! Your Voice AI Agent is ready!
echo ================================================
echo.
echo [SUCCESS] ✅ Backend: http://localhost:5001 (running)
echo [SUCCESS] ✅ Frontend: http://localhost:3000 (running)
echo [SUCCESS] ✅ Health Check: http://localhost:5001/health
echo.
echo 📱 NEXT STEPS TO TEST REAL PHONE CALLS:
echo 1. Download ngrok from https://ngrok.com/
echo 2. Extract and run: ngrok http 5001
echo 3. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
echo 4. Go to Twilio Console → Phone Numbers → Manage → Active numbers
echo 5. Set Webhook URL: https://abc123.ngrok.io/webhook
echo 6. Set HTTP Method: POST
echo 7. Call your Twilio number and test!
echo.
echo 📚 For detailed instructions, see:
echo    - QUICK_START.md (5-minute setup)
echo    - docs\README.md (full documentation)
echo.
echo [SUCCESS] Happy testing! 🚀
echo.
echo Press any key to exit...
pause >nul
