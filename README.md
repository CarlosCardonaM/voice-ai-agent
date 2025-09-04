# 🎤 Voice AI Agent for LATAM Market

> **A professional, multilingual voice AI agent platform that handles real phone calls with intelligent conversations in Spanish and English.**

## 🚀 **Quick Start (5 minutes)**

### **For New Team Members:**
1. **Clone & Setup**: `./setup.sh` (macOS/Linux) or `setup.bat` (Windows)
2. **Get API Keys**: [Required Services](#-required-services)
3. **Start Development**: Follow [Team Onboarding Guide](docs/setup/TEAM_ONBOARDING.md)

### **For Developers:**
```bash
# Backend
source venv/bin/activate && python twilio_voice_agent.py

# Frontend  
cd frontend && npm start

# Access
# Dashboard: http://localhost:3000
# API: http://localhost:5001
```

---

## 🌟 **What This Platform Does**

- **📞 Real Phone Calls**: Handle incoming calls via Twilio
- **🗣️ Multilingual**: Spanish (LATAM) + English with auto-detection
- **🤖 AI Conversations**: OpenAI GPT-4o-mini for intelligent responses
- **🔊 Natural Voice**: ElevenLabs Mexican Spanish voice synthesis
- **📊 Performance**: Real-time monitoring with <500ms latency target
- **🌐 Modern UI**: React dashboard with Material-UI

---

## 🔑 **Required Services (Get These First)**

| Service | Purpose | Cost | Setup Time |
|---------|---------|------|------------|
| **[Twilio](https://www.twilio.com/try-twilio)** | Phone calls & voice | ~$1/month + $0.0075/min | 5 min |
| **[OpenAI](https://platform.openai.com/signup)** | AI conversations | ~$0.00015/1K tokens | 2 min |
| **[Deepgram](https://console.deepgram.com/signup)** | Speech recognition | ~$0.0044/minute | 3 min |
| **[ElevenLabs](https://elevenlabs.io/sign-up)** | Voice synthesis | ~$0.30/1K chars | 2 min |

---

## 📱 **Test Real Phone Calls**

### **1. Expose Backend**
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Expose backend
ngrok http 5001
```

### **2. Configure Twilio**
1. Go to [Twilio Console](https://console.twilio.com/)
2. **Phone Numbers** → **Manage** → **Active numbers**
3. Set **Webhook URL**: `https://abc123.ngrok.io/webhook`
4. Set **HTTP Method**: `POST`

### **3. Make a Call**
1. **Call your Twilio number**
2. **Hear**: "Esta llamada puede grabarse para calidad. ¿Deseas continuar?"
3. **Respond**: "Sí" or "Yes"
4. **Start talking** with the AI agent!

---

## 📚 **Documentation Structure**

```
docs/
├── setup/                    # 🚀 Start Here
│   ├── TEAM_ONBOARDING.md   # ⭐ Team Setup Guide
│   ├── GITHUB_SETUP.md      # Repository Setup
│   └── SETUP_SUMMARY.md     # Technical Setup Details
├── development/              # 🛠️ Development
│   ├── FRONTEND_SUMMARY.md  # React Frontend Details
│   ├── MULTILINGUAL_FEATURES_SUMMARY.md
│   └── PERFORMANCE_TESTING_SUMMARY.md
├── api/                     # 🔌 API Documentation
│   └── README_TWILIO.md     # Twilio Integration
└── deployment/              # 🚀 Production Deployment
```

---

## 🎯 **Team Focus Areas**

### **Week 1: Setup & Testing**
- [ ] Complete platform setup
- [ ] Get all API keys working
- [ ] Test real phone calls
- [ ] Understand basic workflow

### **Week 2: Customization**
- [ ] Modify voice responses
- [ ] Adjust language settings
- [ ] Customize AI behavior
- [ ] Test edge cases

### **Week 3: Production Ready**
- [ ] Deploy to production server
- [ ] Set up monitoring
- [ ] Scale for multiple calls
- [ ] Performance optimization

---

## 🆘 **Need Help?**

### **Immediate Support**
- **Setup Issues**: [Team Onboarding Guide](docs/setup/TEAM_ONBOARDING.md)
- **GitHub Setup**: [Repository Setup Guide](docs/setup/GITHUB_SETUP.md)
- **Technical Details**: [Setup Summary](docs/setup/SETUP_SUMMARY.md)

### **Development Support**
- **Frontend**: [Frontend Summary](docs/development/FRONTEND_SUMMARY.md)
- **API Integration**: [Twilio Guide](docs/api/README_TWILIO.md)
- **Performance**: [Testing Summary](docs/development/PERFORMANCE_TESTING_SUMMARY.md)

---

## 🚨 **Security Notes**

- **Never commit** `.env` files or API keys
- **Use environment variables** for all sensitive data
- **Rotate API keys** regularly
- **Monitor usage** to prevent unexpected charges

---

## 🎉 **Welcome to the Team!**

You're building the future of customer service in LATAM! 

**Next Steps:**
1. ✅ **Run setup script**: `./setup.sh` or `setup.bat`
2. 🔑 **Get your API keys** from required services
3. 🧪 **Test the platform** locally
4. 📞 **Make real phone calls** to test voice functionality
5. 🚀 **Start building features** for your use case!

**Questions?** Check the [Team Onboarding Guide](docs/setup/TEAM_ONBOARDING.md) first, then ask in team chat.

---

**Happy coding! 🚀**

*Your Voice AI Agent is ready to revolutionize customer service!*
