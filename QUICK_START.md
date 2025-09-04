# ⚡ Quick Start Guide (5 minutes)

> **Get your Voice AI Agent running in under 5 minutes!**

**For Cursor AI Users**: This guide is optimized for Cursor to execute step-by-step. Each command is ready to run directly.

## 🎯 **What You're Building**

**A Voice AI Agent that:**
- **📞 Receives phone calls** via Twilio
- **🎤 Listens to speech** using Deepgram (Speech-to-Text)
- **🧠 Processes with AI** using OpenAI GPT-4o-mini
- **🗣️ Responds naturally** using ElevenLabs (Text-to-Speech)
- **🌍 Speaks Spanish/English** for LATAM markets
- **⚡ Responds in <500ms** for real-time conversation
- **📊 Monitors performance** via web dashboard

**Perfect for:**
- Customer service automation
- Appointment scheduling
- Support hotlines
- Interactive voice systems

**What you'll end up with:**
- A web dashboard to monitor calls
- An AI agent that handles phone conversations
- Real-time performance metrics
- Production-ready voice AI platform

---

## 📋 **Prerequisites (Install First)**

**Before running the setup script, you need these installed:**

### **System Requirements:**
- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download Git](https://git-scm.com/)

### **macOS Users:**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install python@3.11 node git

# Verify installations
python3 --version  # Should show 3.11+
node --version     # Should show 18+
npm --version      # Should show 9+
git --version      # Should show 2.30+
```

### **Windows Users:**
```bash
# Download and install from:
# Python: https://www.python.org/downloads/
# Node.js: https://nodejs.org/
# Git: https://git-scm.com/

# Verify in Command Prompt:
python --version   # Should show 3.11+
node --version     # Should show 18+
npm --version      # Should show 9+
git --version      # Should show 2.30+
```

### **Linux Users:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip nodejs npm git

# CentOS/RHEL
sudo yum install python3.11 python3.11-pip nodejs npm git

# Verify installations
python3.11 --version  # Should show 3.11+
node --version         # Should show 18+
npm --version          # Should show 9+
git --version          # Should show 2.30+
```

**✅ Once all prerequisites are installed, continue to Step 1**

---

## 🚀 **Step 1: Setup (2 minutes)**

### **macOS/Linux:**
```bash
./setup_and_test.sh
```

### **Windows:**
```bash
setup_and_test.bat
```

**What this does:**
- ✅ Creates Python virtual environment
- ✅ Installs all dependencies
- ✅ Sets up React frontend
- ✅ Creates `.env` template

**What Gets Installed:**
```bash
# Python Dependencies (in venv/):
pipecat-ai          # Voice AI framework
flask               # Web server for Twilio webhooks
flask-cors          # CORS support for frontend
twilio              # Twilio SDK for telephony
openai              # OpenAI GPT-4o-mini API
deepgram-sdk        # Speech-to-Text service
elevenlabs          # Text-to-Speech service
python-dotenv       # Environment variable loading
asyncio             # Async programming support

# Node.js Dependencies (in frontend/):
react               # Frontend framework
@mui/material       # Material-UI components
@emotion/react      # CSS-in-JS styling
react-router-dom    # Frontend routing
axios               # HTTP client for API calls
```

**Cursor Command**: Copy and paste this command in your terminal

---

## 🔑 **Step 2: Get API Keys (2 minutes)**

| Service | Sign Up | Get Key |
|---------|---------|---------|
| **Twilio** | [twilio.com/try-twilio](https://www.twilio.com/try-twilio) | Account SID + Auth Token |
| **OpenAI** | [platform.openai.com/signup](https://platform.openai.com/signup) | API Key |
| **Deepgram** | [console.deepgram.com/signup](https://console.deepgram.com/signup) | API Key |
| **ElevenLabs** | [elevenlabs.io/sign-up](https://elevenlabs.io/sign-up) | API Key |

**Edit `.env` file with your keys:**

**Why These Services?**
- **Twilio**: Handles phone calls, webhooks, and audio streaming
- **OpenAI**: Powers the AI brain for natural conversations
- **Deepgram**: Converts speech to text (what the caller says)
- **ElevenLabs**: Converts text to speech (AI's responses)

**Cursor Task**: Open the `.env` file and replace the placeholder values with your actual API keys:

```bash
# Replace these with your actual values:
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=sk-your_actual_openai_key
DEEPGRAM_API_KEY=your_actual_deepgram_key
ELEVENLABS_API_KEY=your_actual_elevenlabs_key
```

**⚠️ IMPORTANT**: After editing `.env`, run the setup script again to test everything!

---

## 🚀 **Step 3: Start Services & Test APIs (1 minute)**

**After editing `.env` with your API keys, run:**
```bash
# macOS/Linux
./setup_and_test.sh

# Windows
setup_and_test.bat
```

**This will automatically:**
- ✅ Test all API connections
- ✅ Start backend server
- ✅ Start frontend dashboard
- ✅ Validate everything works

**Cursor Command**: Run this command after editing your `.env` file

---

## 🎯 **Step 4: Verify Everything Works (1 minute)**

**The setup script will show:**
```
🎉 SETUP COMPLETE! Your Voice AI Agent is ready!
================================================

✅ Backend: http://localhost:5001 (running)
✅ Frontend: http://localhost:3000 (running)
✅ Health Check: http://localhost:5001/health
```

**Open Dashboard**: http://localhost:3000

**Cursor Task**: Open this URL in your browser to verify the platform is working

**What you'll see:**
- ✅ **All APIs Connected**: Green checkmarks for each service
- ✅ **Backend Status**: "Connected" with performance metrics
- ✅ **Ready to Test**: Platform is fully operational

---

## 🧪 **Step 5: Test Your Platform (2 minutes)**

### **Dashboard Testing:**
**Cursor Task**: Navigate through the dashboard to verify everything works

1. **Go to Settings** → **Test API Connections**
2. **Verify all services** show "Connected"
3. **Check performance metrics** are updating
4. **Monitor backend health** status

### **If APIs Fail:**
- ❌ **Check your `.env` file** has real API keys
- ❌ **Verify account balances** for each service
- ❌ **Run setup script again** after fixing issues

---

## 📞 **Step 6: Test Real Phone Calls**

### **Expose Backend:**

**Cursor Command**: Install and run ngrok to expose your backend to the internet

```bash
# macOS
brew install ngrok

# Windows: Download from https://ngrok.com/

# Then run:
ngrok http 5001
```

### **Configure Twilio:**

**Cursor Task**: Configure your Twilio phone number webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. **Phone Numbers** → **Manage** → **Active numbers**
3. Click on your phone number
4. Set **Webhook URL**: `https://abc123.ngrok.io/webhook` (replace with your actual ngrok URL)
5. Set **HTTP Method**: `POST`
6. Save changes

### **Make a Call:**

**Cursor Task**: Test your Voice AI Agent with a real phone call

1. **Call your Twilio number**
2. **Hear consent message** in Spanish: "Esta llamada puede grabarse para calidad. ¿Deseas continuar?"
3. **Respond "sí"** or "yes" to continue
4. **Start talking** with the AI agent!
5. **Experience**: Natural conversation in Spanish/English with <500ms response times

---

## 🆘 **Need Help?**

### **Common Issues & Solutions:**

#### **Python Issues:**
```bash
# "python: command not found"
# Solution: Install Python 3.11+ from python.org

# "pip: command not found"
# Solution: python -m ensurepip --upgrade

# "Permission denied" on macOS
# Solution: Use python3 instead of python
```

#### **Node.js Issues:**
```bash
# "node: command not found"
# Solution: Install Node.js 18+ from nodejs.org

# "npm: command not found"
# Solution: Reinstall Node.js (npm comes with it)

# "EACCES" permission errors
# Solution: Use nvm or fix npm permissions
```

#### **Setup Script Issues:**
```bash
# "Permission denied" on setup script
# Solution: chmod +x setup_and_test.sh

# "Port already in use"
# Solution: Kill existing processes or change ports

# "API connection failed"
# Solution: Check your .env file has real API keys
```

### **Get More Help:**
- **Setup Issues**: [Team Onboarding Guide](docs/setup/TEAM_ONBOARDING.md)
- **API Problems**: Check account balances and API keys
- **Testing Issues**: Run setup script again after fixing `.env`
- **Team Support**: Ask in team chat

---

## 🎉 **You're Done!**

Your Voice AI Agent is now running and ready for real phone calls!

**Next Steps:**
- 🧪 Test different scenarios
- 🔧 Customize responses
- 🚀 Deploy to production
- 📈 Scale for your use case

---

**Happy coding! 🚀**

*Questions? Check the [full documentation](docs/README.md) or ask the team!*

---

## 🤖 **For Cursor AI Users**

**This guide is optimized for Cursor to execute automatically:**

- **✅ Clear Commands**: Every bash command is ready to copy/paste
- **✅ Explicit Tasks**: Each step has a "Cursor Task" label
- **✅ Sequential Flow**: Steps are numbered and ordered logically
- **✅ Error Handling**: Clear instructions for what to do if something fails

**Cursor can now:**
1. **Check prerequisites** and help install missing dependencies
2. **Execute setup commands** automatically
3. **Guide you through** each step
4. **Help troubleshoot** any issues
5. **Validate success** at each stage

**Just tell Cursor**: "Read the QUICK_START.md and help me set up the Voice AI Agent step by step"

**Or for dependency help**: "Check if I have all prerequisites installed and help me install what's missing"
