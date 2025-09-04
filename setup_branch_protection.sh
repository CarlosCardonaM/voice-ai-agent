#!/bin/bash

# 🚀 Branch Protection Setup Script
# This script sets up branch protection rules for the Voice AI Agent repository

set -e

echo "🔒 Setting up branch protection rules for voice-ai-agent repository..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "🔐 Run: gh auth login"
    exit 1
fi

REPO="CarlosCardonaM/voice-ai-agent"

echo "📋 Setting up protection for main branch..."

# Set up main branch protection
gh api repos/$REPO/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/backend-test","ci/frontend-test","ci/integration-test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_reviewers":[]}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Main branch protection configured!"

echo "📋 Setting up protection for develop branch..."

# Set up develop branch protection (less strict)
gh api repos/$REPO/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/backend-test","ci/frontend-test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_reviewers":[]}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Develop branch protection configured!"

echo ""
echo "🎉 Branch protection setup complete!"
echo ""
echo "📋 Protection Summary:"
echo "   main branch:"
echo "     - Requires 1 approval"
echo "     - Requires code owner review"
echo "     - All CI checks must pass"
echo "     - No force pushes or deletions"
echo ""
echo "   develop branch:"
echo "     - Requires 1 approval"
echo "     - Basic CI checks must pass"
echo "     - No force pushes or deletions"
echo ""
echo "🔐 Code owners: @CarlosCardonaM"
echo ""
echo "💡 To modify these rules, go to:"
echo "   https://github.com/$REPO/settings/branches"
