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

---

## 🤝 **Team Workflow**

### **🎯 Development Process**

#### **1. Starting a New Feature**
```bash
# Always start from the develop branch
git checkout develop
git pull origin develop

# Create a feature branch with descriptive name
git checkout -b feature/voice-agent-enhancement
# or
git checkout -b fix/cors-issue
# or
git checkout -b docs/api-documentation
```

#### **2. Development Workflow**
```bash
# Make your changes and commit frequently
git add .
git commit -m "feat(voice): add Brazilian Portuguese voice support"

# Push your feature branch
git push origin feature/voice-agent-enhancement
```

#### **3. Creating a Pull Request**
1. **Go to GitHub**: `https://github.com/CarlosCardonaM/voice-ai-agent`
2. **Click "Compare & pull request"** on your feature branch
3. **Fill out the PR template completely**:
   - ✅ Description of changes
   - ✅ Type of change selected
   - ✅ Testing checklist completed
   - ✅ Self-review completed
4. **Request review** from team members

#### **4. Code Review Process**
- **At least 1 approval required** before merging
- **Code owner review required** for main branch
- **All CI checks must pass** (automated)
- **Address feedback** and update PR if needed

#### **5. Merging and Deployment**
- **Feature branches**: Squash and merge to develop
- **Release branches**: Create merge commit to main
- **Automatic deployment** to staging on develop
- **Production deployment** on main (after testing)

### **🛡️ Quality Gates**

#### **Pre-commit Hooks (Automatic)**
- ✅ Code formatting (Black, isort)
- ✅ Linting (Flake8)
- ✅ Security scanning (Bandit)
- ✅ YAML validation
- ✅ Trailing whitespace fixes

#### **CI/CD Pipeline (Automatic)**
- ✅ **Backend Testing**: Python 3.9, 3.10, 3.11
- ✅ **Frontend Testing**: React build and tests
- ✅ **Integration Testing**: API endpoint validation
- ✅ **Security Scanning**: Vulnerability detection
- ✅ **Code Quality**: SonarCloud analysis

#### **Manual Requirements**
- ✅ **Code Review**: At least 1 team member approval
- ✅ **Self-review**: Complete PR template checklist
- ✅ **Documentation**: Update relevant docs
- ✅ **Testing**: Manual testing completed

### **🌿 Branch Strategy**

```
main (production)
├── develop (staging)
│   ├── feature/voice-enhancement
│   ├── fix/cors-issue
│   └── docs/api-update
└── hotfix/critical-bug
```

- **`main`**: Production-ready code (deploy to production)
- **`develop`**: Integration branch (deploy to staging)
- **`feature/*`**: New features and improvements
- **`fix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### **📝 Commit Standards**

#### **Conventional Commits Format**
```bash
type(scope): description

# Examples:
feat(voice): add Brazilian Portuguese voice support
fix(api): resolve CORS issue with frontend
docs(setup): update installation instructions
test(performance): add latency monitoring tests
refactor(backend): restructure Twilio agent class
style(frontend): improve dashboard UI layout
```

#### **Commit Types**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

### **🔒 Security & Compliance**

#### **Never Commit**
- ❌ API keys or secrets
- ❌ Real phone numbers
- ❌ Database credentials
- ❌ Private certificates
- ❌ User data or PII

#### **Always Include**
- ✅ Environment variable templates (`.env.example`)
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Security logging
- ✅ Rate limiting for APIs

### **📊 Performance Standards**

#### **Response Time Targets**
- **API endpoints**: <500ms average
- **Voice processing**: <1 second roundtrip
- **Frontend rendering**: <200ms initial load

#### **Monitoring & Alerts**
- **Real-time metrics** via `/performance` endpoint
- **Latency tracking** for STT/LLM/TTS pipeline
- **Error rate monitoring**
- **Resource usage tracking**

### **🚨 Emergency Procedures**

#### **Hotfix Process**
```bash
# For critical production issues
git checkout main
git checkout -b hotfix/critical-api-error

# Fix the issue
git commit -m "fix(api): resolve critical authentication error"

# Create PR directly to main
# Get immediate approval and merge
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix: Critical API error"
git push origin v1.0.1
```

#### **Rollback Process**
```bash
# If deployment fails
git checkout main
git revert <commit-hash>
git push origin main

# Or rollback to previous tag
git checkout v1.0.0
git checkout -b rollback/v1.0.0
git push origin rollback/v1.0.0
```

### **📚 Documentation Requirements**

#### **Code Documentation**
- **Functions**: Docstrings with examples
- **Classes**: Purpose and usage explanation
- **APIs**: Endpoint documentation with examples
- **Configuration**: Environment variable explanations

#### **Update These Files**
- **`README.md`**: Major project changes
- **`QUICK_START.md`**: Setup process updates
- **`CHANGELOG.md`**: All version changes
- **API docs**: When endpoints change

### **🔄 Team Communication**

#### **Daily Standups**
- **Progress updates** on current features
- **Blockers** and help needed
- **Code review requests**
- **Deployment status**

#### **Weekly Reviews**
- **Sprint planning** and prioritization
- **Code quality metrics** review
- **Performance analysis**
- **Security assessment**

#### **Monthly Planning**
- **Feature roadmap** updates
- **Technical debt** assessment
- **Infrastructure** improvements
- **Team process** optimization

### **🎯 Success Metrics**

#### **Code Quality**
- **Test coverage**: >80%
- **Code review time**: <24 hours
- **Bug rate**: <5% of deployments
- **Documentation**: 100% coverage

#### **Team Productivity**
- **PR merge time**: <48 hours
- **Deployment frequency**: Daily
- **Feature delivery**: On schedule
- **Team satisfaction**: High

---

**💡 Pro Tip**: Use the [Team Collaboration Guide](docs/development/TEAM_COLLABORATION_GUIDE.md) for detailed workflows and best practices!

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
