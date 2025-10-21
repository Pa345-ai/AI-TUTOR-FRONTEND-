#!/bin/bash

# 🚀 QUICK SUPABASE DEPLOYMENT SCRIPT
# Run this with your Supabase access token

echo "🚀 Deploying OmniMind AI Tutor to Supabase..."

# Check if access token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Please set your Supabase access token:"
    echo "export SUPABASE_ACCESS_TOKEN=your_token_here"
    echo "Get your token from: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

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

echo "✅ Deployment complete!"
echo "🔗 Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "📚 Functions: https://supabase.com/dashboard/project/$PROJECT_REF/functions"
echo "🗄️ Database: https://supabase.com/dashboard/project/$PROJECT_REF/editor"

echo ""
echo "🎉 Your OmniMind AI Tutor backend is now live!"
echo "Next: Update .env.local with your Supabase anon key and run 'npm run dev'"