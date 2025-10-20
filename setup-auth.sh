#!/bin/bash

# =====================================================
# OmniMind AI Tutor - Authentication Setup
# =====================================================
# This script helps you set up authentication for deployment
# =====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

# Check if user is logged in to Supabase
check_supabase_auth() {
    print_header "🔐 CHECKING SUPABASE AUTHENTICATION"
    
    if npx supabase projects list &> /dev/null; then
        print_success "Supabase authentication verified"
        return 0
    else
        print_warning "Supabase authentication required"
        return 1
    fi
}

# Login to Supabase
login_supabase() {
    print_header "🔑 SUPABASE LOGIN"
    
    print_status "Please log in to your Supabase account..."
    print_status "This will open a browser window for authentication."
    echo ""
    
    npx supabase login
    
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to Supabase"
    else
        print_error "Failed to log in to Supabase"
        exit 1
    fi
}

# Link to project
link_project() {
    print_header "🔗 LINK TO SUPABASE PROJECT"
    
    print_status "Please provide your Supabase project reference ID."
    print_status "You can find this in your Supabase dashboard:"
    print_status "1. Go to https://supabase.com/dashboard"
    print_status "2. Select your project"
    print_status "3. Go to Settings > General"
    print_status "4. Copy the 'Reference ID'"
    echo ""
    
    read -p "Enter your Supabase project reference ID: " project_ref
    
    if [ -z "$project_ref" ]; then
        print_error "Project reference ID is required"
        exit 1
    fi
    
    print_status "Linking to project: $project_ref"
    npx supabase link --project-ref "$project_ref"
    
    if [ $? -eq 0 ]; then
        print_success "Successfully linked to project"
    else
        print_error "Failed to link to project"
        exit 1
    fi
}

# Check Vercel authentication
check_vercel_auth() {
    print_header "🌐 CHECKING VERCEL AUTHENTICATION"
    
    if npx vercel whoami &> /dev/null; then
        print_success "Vercel authentication verified"
        return 0
    else
        print_warning "Vercel authentication required"
        return 1
    fi
}

# Login to Vercel
login_vercel() {
    print_header "🔑 VERCEL LOGIN"
    
    print_status "Please log in to your Vercel account..."
    print_status "This will open a browser window for authentication."
    echo ""
    
    npx vercel login
    
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to Vercel"
    else
        print_error "Failed to log in to Vercel"
        exit 1
    fi
}

# Main setup function
main() {
    print_header "🚀 OMNIMIND AI TUTOR - AUTHENTICATION SETUP"
    
    print_status "This script will help you set up authentication for deployment"
    echo ""
    
    # Check Supabase authentication
    if ! check_supabase_auth; then
        login_supabase
        link_project
    fi
    
    # Check Vercel authentication
    if ! check_vercel_auth; then
        login_vercel
    fi
    
    print_header "🎉 AUTHENTICATION SETUP COMPLETE!"
    
    echo -e "${GREEN}You are now ready to deploy!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Run './deploy-simple.sh' to deploy everything"
    echo -e "2. Or follow the manual steps in DEPLOYMENT_STEPS.md"
    echo ""
    echo -e "${PURPLE}Your Supabase project:${NC} $(npx supabase status | grep 'API URL' | awk '{print $3}')"
    echo -e "${PURPLE}Your Vercel account:${NC} $(npx vercel whoami)"
}

# Run main function
main "$@"