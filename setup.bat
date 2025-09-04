@echo off
REM Voice AI Agent Setup Script for Windows
REM This script automates the initial setup process for team members

echo 🚀 Voice AI Agent Setup Script
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    echo    Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create virtual environment
echo 🐍 Setting up Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📦 Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt
echo ✅ Python dependencies installed

REM Deactivate virtual environment
deactivate

REM Setup frontend
echo ⚛️  Setting up React frontend...
cd frontend

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install
echo ✅ Node.js dependencies installed

REM Return to project root
cd ..

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔐 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your actual API keys:
    echo    - TWILIO_ACCOUNT_SID
    echo    - TWILIO_AUTH_TOKEN
    echo    - OPENAI_API_KEY
    echo    - DEEPGRAM_API_KEY
    echo    - ELEVENLABS_API_KEY
    echo.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your API keys
echo 2. Start backend: venv\Scripts\activate && python twilio_voice_agent.py
echo 3. Start frontend: cd frontend && npm start
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For detailed instructions, see README.md
echo.
echo Happy coding! 🚀
pause
