# 👥 Team Onboarding Guide

Welcome to the Voice AI Agent team! This guide will help you get up and running quickly.

## 🎯 What We're Building

A **multilingual voice AI agent platform** for the LATAM market that can:
- Handle real phone calls via Twilio
- Understand Spanish and English speech
- Generate intelligent responses using AI
- Speak with natural Mexican Spanish voice
- Monitor performance in real-time

## 🚀 Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)
```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat
```

### Option 2: Manual Setup
Follow the detailed instructions in [README.md](README.md)

## 🔑 Required Accounts & API Keys

### 1. Twilio Account ⭐ (Most Important)
- **Sign up**: [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- **Get**: Account SID, Auth Token, Phone Number
- **Cost**: ~$1/month + $0.0075/minute for calls
- **Time**: 5 minutes

### 2. OpenAI Account
- **Sign up**: [https://platform.openai.com/signup](https://platform.openai.com/signup)
- **Get**: API Key
- **Cost**: ~$0.00015/1K tokens (very cheap)
- **Time**: 2 minutes

### 3. Deepgram Account
- **Sign up**: [https://console.deepgram.com/signup](https://console.deepgram.com/signup)
- **Get**: API Key
- **Cost**: ~$0.0044/minute for speech recognition
- **Time**: 3 minutes

### 4. ElevenLabs Account
- **Sign up**: [https://elevenlabs.io/sign-up](https://elevenlabs.io/sign-up)
- **Get**: API Key
- **Cost**: ~$0.30/1K characters for TTS
- **Time**: 2 minutes

## 📱 Testing Real Phone Calls

### Step 1: Expose Your Backend
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Expose backend
ngrok http 5001
```

### Step 2: Configure Twilio
1. Go to [Twilio Console](https://console.twilio.com/)
2. **Phone Numbers** → **Manage** → **Active numbers**
3. Click your number
4. Set **Webhook URL**: `https://abc123.ngrok.io/webhook`
5. Set **HTTP Method**: `POST`

### Step 3: Test Call
1. **Call your Twilio number**
2. **Hear**: "Esta llamada puede grabarse para calidad. ¿Deseas continuar?"
3. **Respond**: "Sí" or "Yes"
4. **Start talking** with the AI agent!

## 🧪 Development Workflow

### Daily Development
```bash
# Terminal 1: Backend
source venv/bin/activate
python twilio_voice_agent.py

# Terminal 2: Frontend
cd frontend
npm start
```

### Testing Changes
1. **Backend changes**: Restart Python process
2. **Frontend changes**: Auto-reloads in browser
3. **API testing**: Use browser console or curl

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
export FLASK_DEBUG=True
```

## 📊 What to Test

### 1. Basic Functionality
- [ ] Frontend loads at http://localhost:3000
- [ ] Dashboard shows "Backend Connected"
- [ ] API connections work in Settings page

### 2. Voice Agent Features
- [ ] Consent message plays in Spanish
- [ ] Language detection works (Spanish/English)
- [ ] AI responses are intelligent and contextual
- [ ] Performance monitoring shows <500ms latency

### 3. Edge Cases
- [ ] User interruptions handled gracefully
- [ ] Low audio quality scenarios
- [ ] Language switching during conversation
- [ ] Call termination and cleanup

## 🐛 Common Issues & Solutions

### "Backend Connection Failed"
```bash
# Check if backend is running
lsof -i :5001

# Restart backend
source venv/bin/activate
python twilio_voice_agent.py
```

### "Port Already in Use"
```bash
# Find process using port
lsof -i :5001

# Kill process
kill -9 <PID>
```

### "API Connection Failed"
- Check `.env` file has correct API keys
- Verify account balances/funding
- Test API keys individually

### "Frontend Won't Start"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🔧 Customization Guide

### Change Language Settings
```python
# In twilio_voice_agent.py
PRIMARY_LANGUAGE = "es-LA"      # Spanish (LATAM)
FALLBACK_LANGUAGE = "en-US"     # English (US)
```

### Modify Voice Responses
```python
# In LanguageManager class
"greeting": "Hola, soy tu agente AI para LATAM. ¿En qué puedo ayudarte?"
"consent": "Esta llamada puede grabarse para calidad. ¿Deseas continuar?"
```

### Adjust Performance Targets
```python
LATENCY_TARGET_MS = 500         # Target response time
MAX_CALL_DURATION = 300         # Maximum call length
```

## 📈 Performance Monitoring

### Key Metrics to Watch
- **STT Latency**: Speech-to-Text processing time
- **LLM Latency**: AI response generation time
- **TTS Latency**: Text-to-Speech processing time
- **Roundtrip Latency**: Total end-to-end time
- **Language Switches**: How often language detection changes

### Dashboard Features
- Real-time call monitoring
- Performance analytics
- Language detection stats
- Call quality metrics

## 🚀 Production Deployment

### When Ready for Production
1. **Use proper WSGI server** (Gunicorn, uWSGI)
2. **Set up reverse proxy** (Nginx, Apache)
3. **Use environment management** (Docker, Kubernetes)
4. **Implement proper logging** and monitoring
5. **Set up SSL certificates** for HTTPS
6. **Use production database** for call history

### Docker Support
```bash
# Build and run with Docker
docker build -t voice-ai-agent .
docker run -p 5001:5001 --env-file .env voice-ai-agent
```

## 🤝 Team Collaboration

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m 'Add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

### Code Standards
- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint rules
- **Comments**: Document complex logic
- **Tests**: Add tests for new features

### Communication
- **Issues**: Create GitHub issues for bugs/features
- **Team Chat**: Use your team's communication platform
- **Code Reviews**: Review each other's PRs
- **Standups**: Regular sync on progress

## 📚 Learning Resources

### Documentation
- [Twilio Voice API](https://www.twilio.com/docs/voice)
- [OpenAI API](https://platform.openai.com/docs)
- [Deepgram API](https://developers.deepgram.com/)
- [ElevenLabs API](https://elevenlabs.io/docs)

### Tutorials
- [Flask Web Development](https://flask.palletsprojects.com/)
- [React Development](https://react.dev/)
- [Python Async Programming](https://docs.python.org/3/library/asyncio.html)

## 🎯 Success Metrics

### Technical Goals
- [ ] <500ms average response time
- [ ] 99%+ uptime
- [ ] Support 100+ concurrent calls
- [ ] Multi-language accuracy >95%

### Business Goals
- [ ] Reduce customer service costs
- [ ] Improve customer satisfaction
- [ ] Support 24/7 availability
- [ ] Scale to multiple markets

## 🆘 Getting Help

### Internal Support
- **Team Lead**: [Your Name]
- **Tech Lead**: [Tech Lead Name]
- **Slack Channel**: #voice-ai-agent

### External Support
- **Twilio Support**: [https://support.twilio.com/](https://support.twilio.com/)
- **OpenAI Support**: [https://help.openai.com/](https://help.openai.com/)
- **Deepgram Support**: [https://support.deepgram.com/](https://support.deepgram.com/)
- **ElevenLabs Support**: [https://elevenlabs.io/support](https://elevenlabs.io/support)

---

## 🎉 Welcome to the Team!

You're now part of building the future of customer service in LATAM! 

**Next Steps:**
1. ✅ Complete setup using `./setup.sh` or `setup.bat`
2. 🔑 Get your API keys from the required services
3. 🧪 Test the basic functionality
4. 📞 Test a real phone call
5. 🚀 Start contributing to the project!

**Questions?** Don't hesitate to ask in the team chat or create GitHub issues.

**Happy coding! 🚀**
