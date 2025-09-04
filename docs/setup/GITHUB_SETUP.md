# 🚀 GitHub Repository Setup Guide

This guide will help you set up the GitHub repository and make the initial commit securely.

## 🔒 Security First - Before Pushing to GitHub

### 1. Verify .gitignore is Secure
```bash
# Check that .env is ignored
git status

# Should NOT show .env file
# Should show: .env (ignored)
```

### 2. Remove Any Committed Secrets
```bash
# If .env was accidentally committed, remove it
git rm --cached .env
git commit -m "Remove .env file from tracking"
```

### 3. Verify Sensitive Files are Ignored
```bash
# Check .gitignore contents
cat .gitignore | grep -E "\.env|venv|__pycache__"
```

## 📁 Repository Structure

Your repository should look like this:
```
aiVoice/
├── .gitignore              # ✅ Committed (ignores secrets)
├── .env.example            # ✅ Committed (template only)
├── README.md               # ✅ Committed
├── TEAM_ONBOARDING.md      # ✅ Committed
├── GITHUB_SETUP.md         # ✅ Committed
├── setup.sh                # ✅ Committed
├── setup.bat               # ✅ Committed
├── requirements.txt         # ✅ Committed
├── twilio_voice_agent.py   # ✅ Committed
├── frontend/               # ✅ Committed (React app)
│   ├── package.json
│   ├── src/
│   └── public/
├── .env                    # ❌ NOT committed (contains secrets)
└── venv/                   # ❌ NOT committed (virtual environment)
```

## 🚀 Initial Repository Setup

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. **Repository name**: `voice-ai-agent` or `aiVoice`
4. **Description**: "Multilingual Voice AI Agent for LATAM Market"
5. **Visibility**: Choose based on your needs
6. **Initialize with**: Don't add README (we have one)
7. Click **"Create repository"**

### 2. Initialize Local Git Repository
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/voice-ai-agent.git

# Verify remote
git remote -v
```

### 3. Initial Commit
```bash
# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status

# Should show files like:
# README.md
# .env.example
# twilio_voice_agent.py
# frontend/
# setup.sh
# etc.
# Should NOT show:
# .env
# venv/
# __pycache__/

# Make initial commit
git commit -m "Initial commit: Voice AI Agent platform

- Multilingual voice agent with Spanish/English support
- Twilio integration for real phone calls
- OpenAI, Deepgram, ElevenLabs integration
- React frontend with Material-UI
- Performance monitoring and analytics
- Team setup scripts and documentation"

# Push to GitHub
git push -u origin main
```

## 🔄 Daily Development Workflow

### 1. Start New Feature
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes...
# Test changes...
```

### 2. Commit and Push
```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "Add amazing feature: description of what was added"

# Push feature branch
git push origin feature/amazing-feature
```

### 3. Create Pull Request
1. Go to GitHub repository
2. Click **"Compare & pull request"**
3. **Title**: "Add amazing feature"
4. **Description**: Explain what was added/changed
5. **Reviewers**: Add team members
6. Click **"Create pull request"**

### 4. Merge and Cleanup
```bash
# After PR is merged
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/amazing-feature
git push origin --delete feature/amazing-feature
```

## 🚨 Security Checklist

### Before Every Push
- [ ] `.env` file is NOT tracked by git
- [ ] No API keys in code comments
- [ ] No hardcoded credentials
- [ ] `.gitignore` includes all sensitive patterns
- [ ] Virtual environment is not committed

### Repository Settings
1. **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets for CI/CD (if needed)
3. **Settings** → **Branches**
4. Set up branch protection rules
5. Require pull request reviews

## 🔧 Team Collaboration Setup

### 1. Invite Team Members
1. **Settings** → **Collaborators and teams**
2. Add team members with appropriate permissions
3. Consider using GitHub Teams for organization

### 2. Set Up Branch Protection
1. **Settings** → **Branches**
2. Add rule for `main` branch
3. Require pull request reviews
4. Require status checks to pass
5. Restrict pushes to `main`

### 3. Create Issue Templates
Create `.github/ISSUE_TEMPLATE/` directory with templates:
- Bug report template
- Feature request template
- Enhancement template

### 4. Set Up Project Board
1. **Projects** → **New project**
2. Create Kanban board for development
3. Add columns: Backlog, In Progress, Review, Done

## 📋 Repository Maintenance

### Weekly Tasks
- [ ] Review and merge pull requests
- [ ] Update dependencies if needed
- [ ] Check for security vulnerabilities
- [ ] Review and close resolved issues

### Monthly Tasks
- [ ] Update documentation
- [ ] Review and update .gitignore
- [ ] Clean up old branches
- [ ] Archive completed projects

## 🆘 Troubleshooting

### "Permission Denied" Error
```bash
# Check remote URL
git remote -v

# If using HTTPS, you may need to authenticate
# Consider using SSH keys for better security
```

### "Branch is Behind" Error
```bash
# Pull latest changes
git pull origin main

# If there are conflicts, resolve them first
git status
# Edit conflicted files
git add .
git commit -m "Resolve merge conflicts"
```

### "Large File" Error
```bash
# Check for large files
git ls-files | xargs ls -la | sort -k5 -nr | head -10

# Remove large files from git history if needed
git filter-branch --tree-filter 'rm -f large_file.zip' HEAD
```

## 🎯 Best Practices

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Fix user authentication bug" not "Fix bug"
- Reference issues: "Add user dashboard (#123)"

### Branch Naming
- `feature/description`: New features
- `bugfix/description`: Bug fixes
- `hotfix/description`: Urgent fixes
- `docs/description`: Documentation updates

### File Organization
- Keep related files together
- Use consistent naming conventions
- Document complex configurations
- Keep dependencies up to date

---

## 🎉 You're Ready!

Your GitHub repository is now set up securely and ready for team collaboration!

**Next Steps:**
1. ✅ Share repository with your team
2. 🔑 Team members get their API keys
3. 🚀 Team runs setup scripts
4. 🧪 Test the platform together
5. 📞 Make real phone calls!

**Remember**: Security first, collaboration second, innovation always! 🚀
