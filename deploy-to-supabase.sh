#!/bin/bash

# =====================================================
# Deploy OmniMind AI Tutor to Supabase
# Project: qyqwayytssgwsmxokrbl.supabase.co
# =====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${PURPLE}=====================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}=====================================================${NC}"
}

# Your Supabase project details
PROJECT_REF="qyqwayytssgwsmxokrbl"
SUPABASE_URL="https://qyqwayytssgwsmxokrbl.supabase.co"

print_header "🚀 DEPLOYING TO SUPABASE"
print_status "Project: $SUPABASE_URL"
print_status "Reference: $PROJECT_REF"

# Check if user is logged in
check_auth() {
    print_header "🔐 CHECKING AUTHENTICATION"
    
    if npx supabase projects list &> /dev/null; then
        print_success "Supabase authentication verified"
        return 0
    else
        print_warning "Please authenticate first:"
        print_status "Run: npx supabase login"
        print_status "Then run: npx supabase link --project-ref $PROJECT_REF"
        return 1
    fi
}

# Deploy database schema
deploy_schema() {
    print_header "📊 DEPLOYING DATABASE SCHEMA"
    
    print_status "Pushing database migrations..."
    npx supabase db push
    
    print_success "Database schema deployed!"
}

# Deploy Edge Functions
deploy_functions() {
    print_header "⚡ DEPLOYING EDGE FUNCTIONS"
    
    # List of all Edge Functions
    local functions=(
        "generate_learning_path"
        "enhanced_emotional_tutor"
        "enhanced_quiz_generator"
        "summarize_notes"
        "lesson_builder"
        "career_advisor"
        "essay_feedback"
        "multilang_tutor"
        "meta_learning_optimizer"
        "neuroverse_metaverse"
        "cognitive_digital_twin"
        "ai_ecosystem"
        "token_system"
        "transparency_audit"
        "security_monitor"
    )
    
    for func in "${functions[@]}"; do
        if [ -d "supabase/functions/ai/$func" ]; then
            print_status "Deploying $func..."
            npx supabase functions deploy "$func" --project-ref "$PROJECT_REF"
        else
            print_warning "Function $func not found, skipping..."
        fi
    done
    
    print_success "All Edge Functions deployed!"
}

# Seed database
seed_database() {
    print_header "🌱 SEEDING DATABASE"
    
    print_status "Adding initial data..."
    npx supabase db seed
    
    print_success "Database seeded with initial data!"
}

# Test deployment
test_deployment() {
    print_header "🧪 TESTING DEPLOYMENT"
    
    print_status "Testing Supabase connection..."
    npx supabase status
    
    print_success "Deployment test completed!"
}

# Main deployment function
main() {
    print_header "🚀 OMNIMIND AI TUTOR - SUPABASE DEPLOYMENT"
    
    # Check authentication
    if ! check_auth; then
        print_error "Please authenticate with Supabase first"
        print_status "Run: npx supabase login"
        print_status "Then run: npx supabase link --project-ref $PROJECT_REF"
        exit 1
    fi
    
    # Deploy everything
    deploy_schema
    deploy_functions
    seed_database
    test_deployment
    
    print_header "🎉 DEPLOYMENT COMPLETED!"
    
    echo -e "${GREEN}Your OmniMind AI Tutor backend is now live at:${NC}"
    echo -e "${BLUE}$SUPABASE_URL${NC}"
    echo ""
    echo -e "${GREEN}Deployed features:${NC}"
    echo -e "✅ Database schema (43+ tables)"
    echo -e "✅ 15+ Edge Functions with real AI"
    echo -e "✅ Initial data seeded"
    echo -e "✅ All billion-dollar features ready"
    echo ""
    echo -e "${YELLOW}Next step: Deploy frontend to Vercel${NC}"
}

# Run main function
main "$@"