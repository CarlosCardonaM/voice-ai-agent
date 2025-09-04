#!/bin/bash

# Start Voice AI Agent with Ngrok Integration
# This script starts both the backend and ngrok tunnel

echo "🚀 Starting Voice AI Agent with Ngrok Integration"
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if backend is already running
if curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "✅ Backend is already running on port 5001"
else
    echo "🔧 Starting backend server..."
    # Start backend in background
    python twilio_voice_agent.py &
    BACKEND_PID=$!

    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:5001/health > /dev/null 2>&1; then
            echo "✅ Backend started successfully"
            break
        fi
        sleep 1
    done

    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   brew install ngrok/ngrok/ngrok"
    exit 1
fi

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 5001 &
NGROK_PID=$!

# Wait for ngrok to start
echo "⏳ Waiting for ngrok to start..."
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data.get('tunnels', []):
        if tunnel.get('proto') == 'https':
            print(tunnel.get('public_url', ''))
            break
    else:
        for tunnel in data.get('tunnels', []):
            if tunnel.get('proto') == 'http':
                print(tunnel.get('public_url', ''))
                break
except:
    pass
")

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    kill $NGROK_PID 2>/dev/null
    exit 1
fi

echo "✅ Ngrok tunnel started successfully!"
echo "🌐 Public URL: $NGROK_URL"
echo "🔗 Local URL: http://localhost:5001"
echo ""

# Print Twilio configuration instructions
echo "📞 TWILIO WEBHOOK CONFIGURATION"
echo "================================"
echo ""
echo "1. Go to your Twilio Console: https://console.twilio.com/"
echo "2. Navigate to Phone Numbers > Manage > Active numbers"
echo "3. Click on your Twilio phone number"
echo "4. Configure the following webhooks:"
echo ""
echo "   Voice URL: ${NGROK_URL}/webhook"
echo "   Status Callback URL: ${NGROK_URL}/status"
echo ""
echo "5. Set HTTP method to 'POST' for both"
echo "6. Save the configuration"
echo ""
echo "🔧 Alternative: Use Twilio CLI"
echo "   twilio phone-numbers:update YOUR_TWILIO_NUMBER \\"
echo "     --voice-url=${NGROK_URL}/webhook \\"
echo "     --status-callback-url=${NGROK_URL}/status"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Configure your Twilio webhooks using the URLs above"
echo "2. Call your Twilio phone number to test"
echo "3. Check the backend logs for call activity"
echo "4. Use the frontend dashboard to monitor performance"
echo ""
echo "💡 Keep this script running to maintain the ngrok tunnel"
echo "   Press Ctrl+C to stop both services when done"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $NGROK_PID 2>/dev/null
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done
