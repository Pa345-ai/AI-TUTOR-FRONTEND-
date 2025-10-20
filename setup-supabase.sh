#!/bin/bash

# =====================================================
# Supabase Quick Setup Script
# =====================================================
# This script helps you set up Supabase for the first time
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

# Check if Supabase CLI is installed
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed."
        print_status "Installing Supabase CLI..."
        npm install -g supabase
    fi
    print_success "Supabase CLI found"
}

# Login to Supabase
login_supabase() {
    print_header "🔐 SUPABASE LOGIN"
    
    print_status "Please log in to your Supabase account..."
    supabase login
    
    print_success "Logged in to Supabase"
}

# Create or link project
setup_project() {
    print_header "🏗️ PROJECT SETUP"
    
    echo "Choose an option:"
    echo "1) Create a new Supabase project"
    echo "2) Link to existing project"
    read -p "Enter your choice (1 or 2): " choice
    
    case $choice in
        1)
            print_status "Creating new Supabase project..."
            print_warning "Please create a new project in the Supabase dashboard first:"
            print_status "1. Go to https://supabase.com/dashboard"
            print_status "2. Click 'New Project'"
            print_status "3. Choose your organization"
            print_status "4. Enter project name: 'omnimind-ai-tutor'"
            print_status "5. Set a strong database password"
            print_status "6. Choose a region close to your users"
            print_status "7. Click 'Create new project'"
            echo ""
            read -p "Press Enter when you've created the project..."
            ;;
        2)
            print_status "Linking to existing project..."
            ;;
    esac
    
    # Get project reference
    read -p "Enter your Supabase project reference (found in project settings): " project_ref
    
    if [ -z "$project_ref" ]; then
        print_error "Project reference is required"
        exit 1
    fi
    
    # Link to project
    print_status "Linking to project: $project_ref"
    supabase link --project-ref "$project_ref"
    
    print_success "Project linked successfully"
}

# Set up environment variables
setup_env() {
    print_header "🔧 ENVIRONMENT SETUP"
    
    print_status "Creating .env.local file..."
    
    # Get Supabase credentials
    local supabase_url=$(supabase status | grep "API URL" | awk '{print $3}')
    local supabase_anon_key=$(supabase status | grep "anon key" | awk '{print $3}')
    
    if [ -z "$supabase_url" ] || [ -z "$supabase_anon_key" ]; then
        print_error "Could not get Supabase credentials. Please check your project link."
        exit 1
    fi
    
    # Create .env.local
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key

# OpenAI Configuration (Add your API key)
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

    print_success ".env.local file created"
    print_warning "Please add your OpenAI API key to .env.local"
}

# Deploy database schema
deploy_schema() {
    print_header "🗄️ DATABASE DEPLOYMENT"
    
    print_status "Deploying database schema..."
    supabase db push
    
    print_status "Seeding database with initial data..."
    supabase db seed
    
    print_success "Database deployed and seeded"
}

# Deploy Edge Functions
deploy_functions() {
    print_header "⚡ EDGE FUNCTIONS DEPLOYMENT"
    
    print_status "Deploying AI Edge Functions..."
    
    # Get project reference
    local project_ref=$(supabase status | grep "API URL" | cut -d'/' -f3 | cut -d'.' -f1)
    
    # Deploy all AI Edge Functions
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
            supabase functions deploy "$func" --project-ref "$project_ref"
        else
            print_warning "Function $func not found, skipping..."
        fi
    done
    
    print_success "Edge Functions deployed"
}

# Test deployment
test_deployment() {
    print_header "🧪 TESTING DEPLOYMENT"
    
    print_status "Testing Supabase connection..."
    
    # Test database connection
    if supabase db ping &> /dev/null; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        return 1
    fi
    
    # Test Edge Functions
    print_status "Testing Edge Functions..."
    local project_ref=$(supabase status | grep "API URL" | cut -d'/' -f3 | cut -d'.' -f1)
    local supabase_url=$(supabase status | grep "API URL" | awk '{print $3}')
    
    # Test a simple function
    local test_response=$(curl -s -X POST \
        "$supabase_url/functions/v1/generate_learning_path" \
        -H "Authorization: Bearer $(supabase status | grep 'anon key' | awk '{print $3}')" \
        -H "Content-Type: application/json" \
        -d '{"user_id":"test","subject":"mathematics","difficulty_level":"beginner","learning_goals":["learn basics"],"preferred_languages":["en"],"learning_style":"visual"}' \
        2>/dev/null || echo "failed")
    
    if [[ "$test_response" != "failed" ]]; then
        print_success "Edge Functions are working"
    else
        print_warning "Edge Functions may not be working properly"
    fi
    
    print_success "Deployment test completed"
}

# Main setup function
main() {
    print_header "🚀 SUPABASE SETUP FOR OMNIMIND AI TUTOR"
    
    print_status "This script will help you set up Supabase for the OmniMind AI Tutor"
    echo ""
    
    # Step 1: Check Supabase CLI
    check_supabase_cli
    
    # Step 2: Login to Supabase
    login_supabase
    
    # Step 3: Set up project
    setup_project
    
    # Step 4: Set up environment
    setup_env
    
    # Step 5: Deploy schema
    deploy_schema
    
    # Step 6: Deploy functions
    deploy_functions
    
    # Step 7: Test deployment
    test_deployment
    
    print_header "🎉 SUPABASE SETUP COMPLETED!"
    
    echo -e "${GREEN}Your Supabase backend is now ready!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Add your OpenAI API key to .env.local"
    echo -e "2. Run 'npm run dev' to start the frontend"
    echo -e "3. Test the application locally"
    echo -e "4. Run './deploy-production.sh' to deploy to production"
    echo ""
    echo -e "${PURPLE}Supabase Dashboard:${NC} https://supabase.com/dashboard"
    echo -e "${PURPLE}Project URL:${NC} $(supabase status | grep 'API URL' | awk '{print $3}')"
}

# Run main function
main "$@"