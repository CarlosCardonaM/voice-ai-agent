@echo off
REM 🚀 Branch Protection Setup Script for Windows
REM This script sets up branch protection rules for the Voice AI Agent repository

echo 🔒 Setting up branch protection rules for voice-ai-agent repository...

REM Check if GitHub CLI is installed
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI (gh) is not installed.
    echo 📥 Install it from: https://cli.github.com/
    pause
    exit /b 1
)

REM Check if user is authenticated
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Not authenticated with GitHub CLI.
    echo 🔐 Run: gh auth login
    pause
    exit /b 1
)

set REPO=CarlosCardonaM/voice-ai-agent

echo 📋 Setting up protection for main branch...

REM Set up main branch protection
gh api repos/%REPO%/branches/main/protection ^
  --method PUT ^
  --field required_status_checks="{\"strict\":true,\"contexts\":[\"ci/backend-test\",\"ci/frontend-test\",\"ci/integration-test\"]}" ^
  --field enforce_admins=true ^
  --field required_pull_request_reviews="{\"required_approving_review_count\":1,\"dismiss_stale_reviews\":true,\"require_code_owner_reviews\":true,\"required_reviewers\":[]}" ^
  --field restrictions=null ^
  --field allow_force_pushes=false ^
  --field allow_deletions=false

if %errorlevel% equ 0 (
    echo ✅ Main branch protection configured!
) else (
    echo ❌ Failed to configure main branch protection
)

echo 📋 Setting up protection for develop branch...

REM Set up develop branch protection (less strict)
gh api repos/%REPO%/branches/develop/protection ^
  --method PUT ^
  --field required_status_checks="{\"strict\":true,\"contexts\":[\"ci/backend-test\",\"ci/frontend-test\"]}" ^
  --field enforce_admins=false ^
  --field required_pull_request_reviews="{\"required_approving_review_count\":1,\"dismiss_stale_reviews\":true,\"require_code_owner_reviews\":false,\"required_reviewers\":[]}" ^
  --field restrictions=null ^
  --field allow_force_pushes=false ^
  --field allow_deletions=false

if %errorlevel% equ 0 (
    echo ✅ Develop branch protection configured!
) else (
    echo ❌ Failed to configure develop branch protection
)

echo.
echo 🎉 Branch protection setup complete!
echo.
echo 📋 Protection Summary:
echo    main branch:
echo      - Requires 1 approval
echo      - Requires code owner review
echo      - All CI checks must pass
echo      - No force pushes or deletions
echo.
echo    develop branch:
echo      - Requires 1 approval
echo      - Basic CI checks must pass
echo      - No force pushes or deletions
echo.
echo 🔐 Code owners: @CarlosCardonaM
echo.
echo 💡 To modify these rules, go to:
echo    https://github.com/%REPO%/settings/branches
echo.
pause
