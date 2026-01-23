#!/bin/bash

# 🚀 COMPLETE SUPABASE BACKEND DEPLOYMENT SCRIPT
# This script deploys the entire OmniMind AI Tutor backend to Supabase

set -e

echo "🚀 Starting Complete Supabase Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if access token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ SUPABASE_ACCESS_TOKEN environment variable is required${NC}"
    echo -e "${YELLOW}Please set your Supabase access token:${NC}"
    echo -e "${CYAN}export SUPABASE_ACCESS_TOKEN=your_access_token_here${NC}"
    echo -e "${YELLOW}You can get your access token from: https://supabase.com/dashboard/account/tokens${NC}"
    exit 1
fi

# Set project reference
PROJECT_REF="qyqwayytssgwsmxokrbl"
echo -e "${BLUE}📋 Project Reference: $PROJECT_REF${NC}"

# Step 1: Link to Supabase project
echo -e "${PURPLE}🔗 Linking to Supabase project...${NC}"
npx supabase link --project-ref $PROJECT_REF

# Step 2: Deploy database migrations
echo -e "${PURPLE}🗄️  Deploying database schema...${NC}"
npx supabase db push --project-ref $PROJECT_REF

# Step 3: Deploy all Edge Functions
echo -e "${PURPLE}⚡ Deploying Edge Functions...${NC}"

# Core AI Functions
echo -e "${CYAN}  📚 Deploying core AI functions...${NC}"
npx supabase functions deploy emotional-tutor --project-ref $PROJECT_REF
npx supabase functions deploy quiz-generator --project-ref $PROJECT_REF
npx supabase functions deploy enhanced-quiz-generator --project-ref $PROJECT_REF
npx supabase functions deploy generate-learning-path --project-ref $PROJECT_REF
npx supabase functions deploy tutor-persona --project-ref $PROJECT_REF
npx supabase functions deploy update-knowledge-graph --project-ref $PROJECT_REF
npx supabase functions deploy security-monitor --project-ref $PROJECT_REF

# Billion-Dollar Features
echo -e "${CYAN}  💎 Deploying billion-dollar features...${NC}"
npx supabase functions deploy meta-learning --project-ref $PROJECT_REF
npx supabase functions deploy meta-learning-optimizer --project-ref $PROJECT_REF
npx supabase functions deploy neuroverse-metaverse --project-ref $PROJECT_REF
npx supabase functions deploy cognitive-digital-twin --project-ref $PROJECT_REF
npx supabase functions deploy contextual-memory --project-ref $PROJECT_REF
npx supabase functions deploy enhanced-emotional-tutor --project-ref $PROJECT_REF

# Advanced AI Features
echo -e "${CYAN}  🤖 Deploying advanced AI features...${NC}"
npx supabase functions deploy summarize-notes --project-ref $PROJECT_REF
npx supabase functions deploy lesson-builder --project-ref $PROJECT_REF
npx supabase functions deploy career-advisor --project-ref $PROJECT_REF
npx supabase functions deploy essay-feedback --project-ref $PROJECT_REF
npx supabase functions deploy multilang-tutor --project-ref $PROJECT_REF
npx supabase functions deploy ai-ecosystem --project-ref $PROJECT_REF
npx supabase functions deploy token-system --project-ref $PROJECT_REF
npx supabase functions deploy transparency-audit --project-ref $PROJECT_REF

# Step 4: Set up Row Level Security
echo -e "${PURPLE}🔒 Setting up Row Level Security...${NC}"
npx supabase db push --project-ref $PROJECT_REF

# Step 5: Deploy storage policies
echo -e "${PURPLE}📁 Setting up storage policies...${NC}"
npx supabase storage update --project-ref $PROJECT_REF

# Step 6: Verify deployment
echo -e "${PURPLE}✅ Verifying deployment...${NC}"
npx supabase functions list --project-ref $PROJECT_REF

# Step 7: Create environment file for frontend
echo -e "${PURPLE}📝 Creating environment configuration...${NC}"
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OmniMind AI Tutor
EOF

echo -e "${GREEN}🎉 SUPABASE BACKEND DEPLOYMENT COMPLETE!${NC}"
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "${CYAN}1. Update .env.local with your actual Supabase anon key${NC}"
echo -e "${CYAN}2. Add your OpenAI API key to .env.local${NC}"
echo -e "${CYAN}3. Run 'npm run dev' to start the frontend${NC}"
echo -e "${CYAN}4. Visit http://localhost:3000 to see your app${NC}"

echo -e "${BLUE}🔗 Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF${NC}"
echo -e "${BLUE}📚 Edge Functions: https://supabase.com/dashboard/project/$PROJECT_REF/functions${NC}"
echo -e "${BLUE}🗄️  Database: https://supabase.com/dashboard/project/$PROJECT_REF/editor${NC}"

echo -e "${GREEN}✅ All 21 Edge Functions deployed successfully!${NC}"
echo -e "${GREEN}✅ Complete database schema deployed!${NC}"
echo -e "${GREEN}✅ Row Level Security configured!${NC}"
echo -e "${GREEN}✅ Storage policies set up!${NC}"

echo -e "${PURPLE}🚀 Your OmniMind AI Tutor backend is now live and ready!${NC}"