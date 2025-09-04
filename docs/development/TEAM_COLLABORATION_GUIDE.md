# 🤝 Team Collaboration Guide

## 🎯 **Overview**

This guide outlines the best practices for collaborating on the Voice AI Agent project. Follow these guidelines to ensure smooth development and maintain code quality.

## 🌿 **Branch Strategy**

### **Main Branches**

- **`main`** - Production-ready code (deploy to production)
- **`develop`** - Integration branch for features (deploy to staging)

### **Feature Development**

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work and commit frequently
git add .
git commit -m "feat(component): implement user authentication"

# 4. Push and create PR
git push origin feature/your-feature-name
```

### **Branch Naming Convention**

```bash
feature/voice-agent-enhancement    # New features
fix/cors-issue                    # Bug fixes
docs/api-documentation            # Documentation
refactor/backend-structure        # Code refactoring
hotfix/critical-api-error         # Urgent production fixes
```

## 📝 **Commit Message Standards**

### **Conventional Commits Format**

```bash
type(scope): description

# Examples:
feat(voice): add Mexican Spanish voice support
fix(api): resolve CORS issue with frontend
docs(setup): update installation instructions
test(performance): add latency monitoring tests
refactor(backend): restructure Twilio agent class
style(frontend): improve dashboard UI layout
```

### **Commit Types**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

### **Scope Examples**

- `voice` - Voice-related features
- `api` - API endpoints
- `frontend` - React components
- `backend` - Python backend
- `docs` - Documentation
- `setup` - Installation/setup scripts

## 🔄 **Pull Request Process**

### **1. Create Feature Branch**

```bash
git checkout -b feature/your-feature
# Make your changes
git add .
git commit -m "feat(scope): description"
git push origin feature/your-feature
```

### **2. Create Pull Request**

- **Base branch**: `develop` (for features) or `main` (for hotfixes)
- **Compare branch**: Your feature branch
- **Title**: Use conventional commit format
- **Description**: Fill out the PR template completely

### **3. PR Review Process**

- **Self-review**: Complete your own checklist first
- **Code review**: At least 1 team member must approve
- **Testing**: Ensure all tests pass
- **Documentation**: Update relevant docs

### **4. Merge Strategy**

- **Squash and merge** for feature branches
- **Create merge commit** for release branches
- **Rebase and merge** for clean history (if preferred)

### **5. Branch Protection Rules**

- **main branch**: Requires 1 approval + code owner review + all CI checks
- **develop branch**: Requires 1 approval + basic CI checks
- **No direct pushes** to protected branches
- **No force pushes** or deletions allowed

## 🧪 **Testing Requirements**

### **Backend Testing**

```bash
# Run all tests
python -m pytest test_*.py -v

# Run with coverage
python -m pytest test_*.py --cov=. --cov-report=html

# Run specific test file
python -m pytest test_twilio_agent.py -v
```

### **Frontend Testing**

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage --watchAll=false

# Build check
npm run build
```

### **Integration Testing**

```bash
# Start backend server
python twilio_voice_agent.py &

# Run integration tests
python test_api_integration.py

# Test health endpoint
curl http://localhost:5001/health
```

## 🔒 **Security Guidelines**

### **Never Commit**

- API keys or secrets
- Real phone numbers
- Database credentials
- Private certificates
- User data or PII

### **Security Checks**

```bash
# Run security scan
bandit -r . -f json -o bandit-report.json

# Check for secrets
detect-secrets scan --baseline .secrets.baseline

# Frontend security audit
cd frontend && npm audit
```

## 📚 **Documentation Standards**

### **Code Documentation**

```python
def process_voice_input(audio_data: bytes, language: str = "es-LA") -> str:
    """
    Process voice input and convert to text.

    Args:
        audio_data (bytes): Raw audio data from microphone
        language (str): Language code for STT processing

    Returns:
        str: Transcribed text from audio

    Raises:
        AudioProcessingError: If audio data is invalid
        STTServiceError: If speech-to-text service fails

    Example:
        >>> text = process_voice_input(audio_bytes, "es-MX")
        >>> print(text)
        "Hola, ¿cómo estás?"
    """
    # Implementation here
```

### **Documentation Updates**

- Update `README.md` for major changes
- Keep `QUICK_START.md` current
- Document breaking changes in `CHANGELOG.md`
- Update API documentation when endpoints change

## 🎨 **Code Style Guidelines**

### **Python (Backend)**

```bash
# Install formatting tools
pip install black isort flake8

# Format code
black .
isort .

# Check style
flake8 .
```

### **JavaScript/React (Frontend)**

```bash
cd frontend

# Install prettier
npm install --save-dev prettier

# Format code
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,html}"
```

## 🚫 **What NOT to Do**

```bash
# ❌ DON'T commit directly to main/develop
git commit -m "quick fix"  # Wrong!

# ❌ DON'T use vague commit messages
git commit -m "stuff"      # Wrong!

# ❌ DON'T commit large files
git add large_audio_file.wav  # Wrong!

# ❌ DON'T commit sensitive data
git add .env                 # Wrong!

# ❌ DON'T force push to shared branches
git push --force origin develop  # Wrong!
```

## 🛠️ **Development Tools Setup**

### **Branch Protection Setup**
```bash
# Option 1: Run the setup script (recommended)
./setup_branch_protection.sh          # macOS/Linux
setup_branch_protection.bat           # Windows

# Option 2: Manual setup via GitHub web interface
# Go to: https://github.com/CarlosCardonaM/voice-ai-agent/settings/branches
# Add rule for 'main' branch with:
# - Require pull request reviews before merging
# - Require 1 approving review
# - Require review from code owners
# - Require status checks to pass before merging
```

### **Pre-commit Hooks**

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

### **IDE Configuration**

- **VS Code**: Install Python, Python Test Explorer, ESLint extensions
- **PyCharm**: Configure Black, isort, and pytest
- **Vim/Neovim**: Use ALE or similar linting plugins

## 📊 **Performance Guidelines**

### **Code Performance**

- Profile code before optimizing
- Use async/await for I/O operations
- Implement proper caching strategies
- Monitor memory usage

### **API Performance**

- Target <500ms response time
- Implement request rate limiting
- Use connection pooling
- Monitor API usage metrics

## 🔍 **Code Review Checklist**

### **For Reviewers**

- [ ] Code is clean and readable
- [ ] Tests are comprehensive
- [ ] Documentation is clear
- [ ] No security vulnerabilities
- [ ] Performance impact is acceptable
- [ ] Error handling is appropriate
- [ ] Logging is sufficient

### **For Authors**

- [ ] Self-review completed
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No sensitive data exposed
- [ ] Code follows style guidelines
- [ ] Breaking changes documented

## 🚀 **Release Process**

### **1. Prepare Release**

```bash
# Create release branch
git checkout -b release/v1.2.0

# Final testing and bug fixes
# Update version numbers
# Update CHANGELOG.md
```

### **2. Merge Release**

```bash
# Merge to main
git checkout main
git merge release/v1.2.0

# Merge to develop
git checkout develop
git merge release/v1.2.0

# Tag release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### **3. Cleanup**

```bash
# Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

## 📞 **Getting Help**

### **Team Communication**

- **Slack/Discord**: Use dedicated channels for development
- **GitHub Issues**: Report bugs and feature requests
- **Code Reviews**: Ask questions during review process
- **Documentation**: Check existing docs first

### **Resources**

- [Python Style Guide (PEP 8)](https://pep8.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [React Best Practices](https://reactjs.org/docs/hooks-faq.html)

---

**Remember**: Good collaboration leads to better code, faster development, and a more enjoyable team experience! 🎉
