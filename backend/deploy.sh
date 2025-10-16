#!/bin/bash

# AI Tutoring App - Backend Deployment Script
# Deploys to Vercel with Supabase integration

set -e

echo "🚀 Starting AI Tutoring App Backend Deployment..."

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Error: SUPABASE_URL environment variable is not set"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🗄️  Running database migrations..."
echo "Please run the following SQL in your Supabase SQL editor:"
echo "1. Copy the contents of supabase-schema-complete.sql"
echo "2. Paste and execute in Supabase SQL editor"
echo "3. Verify all tables and functions are created successfully"

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up environment variables in Vercel dashboard:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_CLOUD_API_KEY (optional)"
echo "   - AZURE_SPEECH_KEY (optional)"
echo "   - AZURE_SPEECH_REGION (optional)"
echo ""
echo "2. Configure Supabase RLS policies"
echo "3. Set up file storage buckets in Supabase"
echo "4. Test all API endpoints"
echo "5. Configure webhooks if needed"
echo ""
echo "🎉 Your AI Tutoring App backend is now live!"