#!/bin/bash

# 🚀 SUPABASE DEPLOYMENT WITH TOKEN INPUT
# This script will prompt you for your Supabase access token

echo "🚀 OmniMind AI Tutor - Supabase Deployment"
echo "=========================================="
echo ""

# Check if token is already set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "🔑 Please enter your Supabase access token:"
    echo "   Get it from: https://supabase.com/dashboard/account/tokens"
    echo ""
    read -p "Enter your Supabase access token: " SUPABASE_ACCESS_TOKEN
    echo ""
fi

# Validate token format
if [[ ! $SUPABASE_ACCESS_TOKEN =~ ^sbp_ ]]; then
    echo "❌ Invalid token format. Token should start with 'sbp_'"
    echo "   Please get a valid token from: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

echo "✅ Token received: ${SUPABASE_ACCESS_TOKEN:0:10}..."
echo ""

PROJECT_REF="qyqwayytssgwsmxokrbl"

echo "📋 Project: $PROJECT_REF"
echo "🔗 Linking to project..."

# Link to project
npx supabase link --project-ref $PROJECT_REF

echo "🗄️ Deploying database schema..."
# Deploy database
npx supabase db push --project-ref $PROJECT_REF

echo "⚡ Deploying Edge Functions..."

# Deploy all functions
functions=(
    "emotional-tutor"
    "quiz-generator" 
    "enhanced-quiz-generator"
    "generate-learning-path"
    "tutor-persona"
    "update-knowledge-graph"
    "security-monitor"
    "meta-learning"
    "meta-learning-optimizer"
    "neuroverse-metaverse"
    "cognitive-digital-twin"
    "contextual-memory"
    "enhanced-emotional-tutor"
    "summarize-notes"
    "lesson-builder"
    "career-advisor"
    "essay-feedback"
    "multilang-tutor"
    "ai-ecosystem"
    "token-system"
    "transparency-audit"
)

for func in "${functions[@]}"; do
    echo "  📦 Deploying $func..."
    npx supabase functions deploy $func --project-ref $PROJECT_REF
done

echo ""
echo "✅ Deployment complete!"
echo "🔗 Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "📚 Functions: https://supabase.com/dashboard/project/$PROJECT_REF/functions"
echo "🗄️ Database: https://supabase.com/dashboard/project/$PROJECT_REF/editor"

echo ""
echo "🎉 Your OmniMind AI Tutor backend is now live!"
echo ""
echo "📝 Next Steps:"
echo "1. Get your Supabase anon key from: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "2. Update .env.local with your keys"
echo "3. Run 'npm run dev' to start the frontend"
echo "4. Visit http://localhost:3000 to see your app"