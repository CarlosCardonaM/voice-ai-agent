#!/bin/bash

# 🎤 Voice AI Agent - Complete Setup & Test Script
# This script makes the platform truly "plug & play" for your team!

set -e  # Exit on any error

echo "🚀 Voice AI Agent - Complete Setup & Test"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.11+ first."
    echo "   Download from: https://www.python.org/downloads/"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Prerequisites check passed"

# Step 1: Environment Setup
echo ""
print_status "Step 1: Setting up environment..."

# Create virtual environment
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"

# Deactivate virtual environment
deactivate

# Step 2: Frontend Setup
echo ""
print_status "Step 2: Setting up React frontend..."

cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install
print_success "Node.js dependencies installed"

# Return to project root
cd ..

# Step 3: Environment Configuration
echo ""
print_status "Step 3: Configuring environment..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_success ".env file created"
    echo ""
    print_warning "IMPORTANT: Please edit .env file with your actual API keys:"
    echo "   - TWILIO_ACCOUNT_SID"
    echo "   - TWILIO_AUTH_TOKEN"
    echo "   - TWILIO_PHONE_NUMBER (your actual Twilio number)"
    echo "   - OPENAI_API_KEY"
    echo "   - DEEPGRAM_API_KEY"
    echo "   - ELEVENLABS_API_KEY"
    echo ""
    echo "After editing .env, run this script again to test everything!"
    echo ""
    exit 0
else
    print_success ".env file already exists"
fi

# Step 4: Test API Connections
echo ""
print_status "Step 4: Testing API connections..."

# Activate virtual environment for testing
source venv/bin/activate

# Test if .env has real values (not placeholder)
if grep -q "your_twilio_account_sid_here" .env; then
    print_warning "Please edit .env file with your actual API keys first!"
    echo "   Then run this script again to test everything."
    echo ""
    exit 0
fi

print_status "Testing API connections..."

# Test script
python test_setup.py

if [ $? -eq 0 ]; then
    print_success "All API connections successful!"
else
    print_error "Some API connections failed. Please check your .env file."
    echo ""
    print_warning "Common issues:"
    echo "   - Invalid API keys"
    echo "   - Insufficient account balance"
    echo "   - API service down"
    echo ""
    exit 1
fi

# Step 5: Start Services
echo ""
print_status "Step 5: Starting services..."

print_status "Starting backend server..."
# Start backend in background
source venv/bin/activate
python twilio_voice_agent.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    print_success "Backend server started successfully on port 5001"
else
    print_error "Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

print_status "Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend started successfully on port 3000"
else
    print_warning "Frontend may still be starting up..."
fi

cd ..

# Step 6: Final Instructions
echo ""
echo "🎉 SETUP COMPLETE! Your Voice AI Agent is ready!"
echo "================================================"
echo ""
print_success "✅ Backend: http://localhost:5001 (running)"
print_success "✅ Frontend: http://localhost:3000 (running)"
print_success "✅ Health Check: http://localhost:5001/health"
echo ""
echo "📱 NEXT STEPS TO TEST REAL PHONE CALLS:"
echo "1. Install ngrok: brew install ngrok (macOS) or download from ngrok.com"
echo "2. Expose backend: ngrok http 5001"
echo "3. Copy the ngrok URL (e.g., https://abc123.ngrok.io)"
echo "4. Go to Twilio Console → Phone Numbers → Manage → Active numbers"
echo "5. Set Webhook URL: https://abc123.ngrok.io/webhook"
echo "6. Set HTTP Method: POST"
echo "7. Call your Twilio number and test!"
echo ""
echo "🔧 TO STOP SERVICES:"
echo "   Backend: kill $BACKEND_PID"
echo "   Frontend: kill $FRONTEND_PID"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - QUICK_START.md (5-minute setup)"
echo "   - docs/README.md (full documentation)"
echo ""
print_success "Happy testing! 🚀"

# Keep script running to maintain services
echo ""
echo "Press Ctrl+C to stop all services and exit..."
wait
