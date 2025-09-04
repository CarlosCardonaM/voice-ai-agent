# 🌐 Ngrok Integration for Real Phone Testing

This guide explains how to set up ngrok to expose your local Voice AI Agent to the internet, enabling real phone calls through Twilio.

## 📋 Prerequisites

- ✅ Backend server running on port 5001
- ✅ Twilio account with a phone number
- ✅ ngrok installed (see installation below)

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)

**macOS/Linux:**
```bash
./start_with_ngrok.sh
```

**Windows:**
```cmd
start_with_ngrok.bat
```

### Option 2: Manual Setup

1. **Start the backend:**
   ```bash
   source venv/bin/activate
   python twilio_voice_agent.py
   ```

2. **Start ngrok in a new terminal:**
   ```bash
   ngrok http 5001
   ```

3. **Get your public URL:**
   - Visit http://localhost:4040
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## 📞 Twilio Webhook Configuration

### Method 1: Twilio Console (Web UI)

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** > **Manage** > **Active numbers**
3. Click on your Twilio phone number
4. Configure the following webhooks:
   - **Voice URL**: `https://your-ngrok-url.ngrok.io/webhook`
   - **Status Callback URL**: `https://your-ngrok-url.ngrok.io/status`
   - **HTTP Method**: POST (for both)
5. Click **Save**

### Method 2: Twilio CLI

```bash
twilio phone-numbers:update YOUR_TWILIO_NUMBER \
  --voice-url=https://your-ngrok-url.ngrok.io/webhook \
  --status-callback-url=https://your-ngrok-url.ngrok.io/status
```

## 🧪 Testing Real Phone Calls

1. **Call your Twilio number** from any phone
2. **Listen for the greeting**: "Hola, soy tu agente AI para LATAM. ¿En qué puedo ayudarte?"
3. **Speak in Spanish or English** - the agent will detect the language
4. **Check the logs** in your terminal for real-time call activity
5. **Monitor performance** in the frontend dashboard

## 📊 Monitoring and Debugging

### Backend Logs
Watch the terminal where you started the backend for:
- Call start/end events
- Language detection
- Performance metrics
- Error messages

### Frontend Dashboard
- Open http://localhost:3000
- Navigate to **Dashboard** to see real-time metrics
- Navigate to **Testing** to start/end test calls

### Ngrok Web Interface
- Visit http://localhost:4040
- View request/response details
- Monitor traffic and errors

## 🔧 Troubleshooting

### Common Issues

**1. "ngrok not found"**
```bash
# Install ngrok
brew install ngrok/ngrok/ngrok  # macOS
# or download from https://ngrok.com/download
```

**2. "Backend not running"**
```bash
# Start the backend first
source venv/bin/activate
python twilio_voice_agent.py
```

**3. "Webhook not receiving calls"**
- Verify ngrok URL is correct
- Check Twilio webhook configuration
- Ensure both Voice URL and Status Callback URL are set
- Test webhook manually: `curl https://your-ngrok-url.ngrok.io/health`

**4. "Calls not connecting"**
- Check if ngrok tunnel is still active
- Verify backend is running on port 5001
- Check Twilio account balance
- Review Twilio logs in the console

### Debug Commands

**Test webhook endpoints:**
```bash
curl https://your-ngrok-url.ngrok.io/health
curl https://your-ngrok-url.ngrok.io/performance
```

**Check ngrok status:**
```bash
curl http://localhost:4040/api/tunnels
```

**Test Twilio webhook:**
```bash
curl -X POST https://your-ngrok-url.ngrok.io/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=test123&From=%2B15551234567&To=%2B15559876543"
```

## 🔒 Security Considerations

### Development Only
- ngrok is for development/testing only
- Don't use for production deployments
- Free ngrok URLs change on restart

### API Keys
- Never commit API keys to version control
- Use `.env` file for local development
- Rotate keys regularly

### Webhook Security
- Consider adding webhook signature verification
- Implement rate limiting for production
- Use HTTPS (ngrok provides this automatically)

## 📈 Performance Tips

### Optimize Latency
- Use ngrok regions closest to your users
- Consider ngrok Pro for better performance
- Monitor latency in the dashboard

### Reduce Costs
- Use ngrok free tier for testing
- Implement call timeouts
- Monitor Twilio usage

## 🚀 Production Deployment

For production, replace ngrok with:
- **Cloud hosting**: AWS, Google Cloud, Azure
- **Reverse proxy**: Nginx, Apache
- **Load balancer**: For high availability
- **SSL certificates**: Let's Encrypt, commercial certificates

## 📚 Additional Resources

- [Ngrok Documentation](https://ngrok.com/docs)
- [Twilio Voice Webhooks](https://www.twilio.com/docs/voice/webhooks)
- [Twilio CLI Documentation](https://www.twilio.com/docs/twilio-cli)
- [Voice AI Agent Documentation](../README.md)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the backend logs
3. Test webhook endpoints manually
4. Verify Twilio configuration
5. Check ngrok status at http://localhost:4040

---

**Next Steps:**
- [Team Collaboration Guide](../development/TEAM_COLLABORATION_GUIDE.md)
- [Frontend Development](../development/FRONTEND_SUMMARY.md)
- [API Documentation](../api/README_TWILIO.md)
