#!/bin/bash

# OmniMind Backend Deployment Script
# This script automates the deployment process to Supabase

set -e  # Exit on any error

echo "🚀 Starting OmniMind Backend Deployment to Supabase"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Supabase CLI is installed
check_supabase_cli() {
    print_status "Checking Supabase CLI installation..."
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first:"
        echo "npm install -g supabase"
        exit 1
    fi
    print_success "Supabase CLI is installed"
}

# Check if user is logged in
check_supabase_auth() {
    print_status "Checking Supabase authentication..."
    if ! supabase projects list &> /dev/null; then
        print_warning "Not logged in to Supabase. Please run:"
        echo "supabase login"
        exit 1
    fi
    print_success "Authenticated with Supabase"
}

# Initialize Supabase project
init_supabase() {
    print_status "Initializing Supabase project..."
    
    if [ ! -f "supabase/config.toml" ]; then
        print_status "Creating new Supabase project..."
        supabase init
    else
        print_status "Supabase project already initialized"
    fi
}

# Link to existing project or create new one
link_project() {
    print_status "Linking to Supabase project..."
    
    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        print_warning "SUPABASE_PROJECT_REF not set. Please provide your project reference:"
        echo "export SUPABASE_PROJECT_REF=your-project-ref"
        echo "Then run this script again."
        exit 1
    fi
    
    supabase link --project-ref $SUPABASE_PROJECT_REF
    print_success "Linked to project: $SUPABASE_PROJECT_REF"
}

# Deploy database schema
deploy_database() {
    print_status "Deploying database schema..."
    
    # Deploy migrations
    supabase db push
    
    print_success "Database schema deployed successfully"
}

# Deploy Edge Functions
deploy_functions() {
    print_status "Deploying Edge Functions..."
    
    # Deploy all functions
    supabase functions deploy
    
    print_success "Edge Functions deployed successfully"
}

# Load mock data
load_mock_data() {
    print_status "Loading mock data..."
    
    if [ -f "mock_data/seed.sql" ]; then
        supabase db shell --file mock_data/seed.sql
        print_success "Mock data loaded successfully"
    else
        print_warning "Mock data file not found. Skipping data loading."
    fi
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test a simple function call
    PROJECT_URL=$(supabase status | grep "API URL" | awk '{print $3}')
    ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
    
    if [ -n "$PROJECT_URL" ] && [ -n "$ANON_KEY" ]; then
        print_status "Testing API endpoint..."
        
        # Test learning path generation
        curl -X POST "$PROJECT_URL/functions/v1/ai/generate_learning_path" \
            -H "Authorization: Bearer $ANON_KEY" \
            -H "Content-Type: application/json" \
            -d '{"user_id": "test", "subject": "programming", "difficulty_level": "beginner"}' \
            --max-time 30 \
            --silent --show-error > /dev/null
        
        if [ $? -eq 0 ]; then
            print_success "API endpoint test passed"
        else
            print_warning "API endpoint test failed, but deployment may still be successful"
        fi
    else
        print_warning "Could not retrieve project details for testing"
    fi
}

# Main deployment function
main() {
    echo
    print_status "Starting deployment process..."
    echo
    
    # Check prerequisites
    check_supabase_cli
    check_supabase_auth
    
    # Initialize and link
    init_supabase
    link_project
    
    # Deploy components
    deploy_database
    deploy_functions
    load_mock_data
    
    # Test deployment
    test_deployment
    
    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    print_status "Next steps:"
    echo "1. Check your Supabase dashboard for the deployed project"
    echo "2. Test the API endpoints using the provided curl commands"
    echo "3. Configure your frontend to connect to the backend"
    echo "4. Set up monitoring and alerts"
    echo
    print_status "Your OmniMind Backend is now live! 🚀"
}

# Run main function
main "$@"
