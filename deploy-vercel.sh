#!/bin/bash

# OmniMind AI Tutor - Vercel Deployment Script
# This script deploys both frontend and backend to Vercel

set -e

echo "🚀 Deploying OmniMind AI Tutor to Vercel"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    print_status "Checking Vercel CLI installation..."
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm install -g vercel"
        exit 1
    fi
    print_success "Vercel CLI is installed: $(vercel --version)"
}

# Check if user is logged in
check_vercel_auth() {
    print_status "Checking Vercel authentication..."
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please run:"
        echo "vercel login"
        exit 1
    fi
    print_success "Authenticated with Vercel"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found. Creating from example..."
        cp .env.local.example .env.local
        print_warning "Please edit .env.local with your actual values before deploying"
        print_warning "Required variables:"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  - OPENAI_API_KEY"
        echo ""
        read -p "Press Enter after updating .env.local to continue..."
    fi
    
    # Check if required variables are set
    source .env.local
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
        print_error "Required environment variables are missing in .env.local"
        print_error "Please set:"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  - OPENAI_API_KEY"
        exit 1
    fi
    
    print_success "Environment variables configured"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy with environment variables
    vercel --prod --env-file .env.local
    
    print_success "Deployment completed!"
}

# Set up Vercel environment variables
setup_vercel_env() {
    print_status "Setting up Vercel environment variables..."
    
    # Get project URL from .env.local
    source .env.local
    
    # Set environment variables in Vercel
    vercel env add NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" production
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY" production
    vercel env add OPENAI_API_KEY "$OPENAI_API_KEY" production
    vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY" production
    
    print_success "Environment variables set in Vercel"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep "omnimind-ai-tutor" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        print_status "Testing API endpoint: $DEPLOYMENT_URL/api/ai/generate_learning_path"
        
        # Test API endpoint
        response=$(curl -s -X POST "$DEPLOYMENT_URL/api/ai/generate_learning_path" \
            -H "Content-Type: application/json" \
            -d '{
                "user_id": "550e8400-e29b-41d4-a716-446655440001",
                "subject": "programming",
                "difficulty_level": "beginner",
                "learning_goals": ["Master Python"],
                "preferred_languages": ["en"],
                "learning_style": "visual"
            }' \
            --max-time 30)
        
        if echo "$response" | grep -q "learning_path"; then
            print_success "API endpoint test passed"
        else
            print_warning "API endpoint test failed, but deployment may still be successful"
            print_warning "Response: $response"
        fi
    else
        print_warning "Could not retrieve deployment URL for testing"
    fi
}

# Main deployment function
main() {
    echo
    print_status "Starting Vercel deployment process..."
    echo
    
    # Check prerequisites
    check_vercel_cli
    check_vercel_auth
    check_env_vars
    
    # Deploy
    deploy_to_vercel
    setup_vercel_env
    
    # Test deployment
    test_deployment
    
    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    print_status "Your OmniMind AI Tutor is now live on Vercel! 🚀"
    echo
    print_status "Next steps:"
    echo "1. Check your Vercel dashboard for the deployed project"
    echo "2. Test the application in your browser"
    echo "3. Monitor logs and performance in Vercel"
    echo "4. Set up custom domain if needed"
    echo
    print_status "Frontend: Next.js app with AI features"
    print_status "Backend: Supabase Edge Functions via API routes"
    print_status "Database: Supabase PostgreSQL with RLS"
    print_status "AI: OpenAI GPT models for intelligent tutoring"
}

# Run main function
main "$@"
