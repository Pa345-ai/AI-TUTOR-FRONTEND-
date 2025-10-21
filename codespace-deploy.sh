#!/bin/bash

# 🚀 CODESPACE DEPLOYMENT SCRIPT
# Run this in your GitHub Codespace to deploy OmniMind AI Tutor

echo "🚀 OmniMind AI Tutor - Codespace Deployment"
echo "==========================================="
echo ""

# Check if we're in a codespace
if [ -n "$CODESPACES" ]; then
    echo "✅ Running in GitHub Codespace"
else
    echo "⚠️  Not running in Codespace - this script is optimized for Codespace"
fi

echo ""
echo "📋 Available deployment scripts:"
echo "1. ./deploy-with-token.sh  - Interactive deployment (recommended)"
echo "2. ./deploy-now.sh         - Quick deployment (requires token)"
echo "3. ./deploy-supabase-complete.sh - Full automated deployment"
echo ""

echo "🎯 RECOMMENDED: Run the interactive deployment"
echo "   ./deploy-with-token.sh"
echo ""
echo "📝 You'll need:"
echo "   - Supabase access token from: https://supabase.com/dashboard/account/tokens"
echo "   - OpenAI API key (optional, for AI features)"
echo ""

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm is available"
else
    echo "❌ npm not found - installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if Supabase CLI is available
if command -v npx supabase &> /dev/null; then
    echo "✅ Supabase CLI is available"
else
    echo "📦 Supabase CLI will be installed when needed"
fi

echo ""
echo "🚀 Ready to deploy! Run:"
echo "   ./deploy-with-token.sh"
echo ""
echo "🎉 After deployment, run:"
echo "   npm install"
echo "   npm run dev"
echo "   # Then visit http://localhost:3000"