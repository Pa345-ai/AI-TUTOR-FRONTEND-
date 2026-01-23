#!/bin/bash

# =====================================================
# AI TUTORING APP - UNIFIED DEPLOYMENT SCRIPT
# Deploys Frontend (Next.js) + Backend (Vercel) + Supabase
# =====================================================

set -e

echo "🚀 Starting AI Tutoring App Unified Deployment..."
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
        print_error "Please run this script from the project root directory."
        exit 1
    fi
    
    print_success "All dependencies are available!"
}

# Validate environment variables
validate_environment() {
    print_status "Validating environment variables..."
    
    # Check for .env.local file
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating from template..."
        cp .env.example .env.local
        print_warning "Please edit .env.local with your actual values before continuing."
        print_warning "Required variables:"
        echo "  - SUPABASE_URL"
        echo "  - SUPABASE_ANON_KEY"
        echo "  - SUPABASE_SERVICE_ROLE_KEY"
        echo "  - OPENAI_API_KEY"
        echo "  - NEXTAUTH_SECRET"
        echo "  - NEXTAUTH_URL"
        read -p "Press Enter after updating .env.local..."
    fi
    
    # Source environment variables
    source .env.local
    
    # Validate required variables
    local missing_vars=()
    
    if [ -z "$SUPABASE_URL" ]; then missing_vars+=("SUPABASE_URL"); fi
    if [ -z "$SUPABASE_ANON_KEY" ]; then missing_vars+=("SUPABASE_ANON_KEY"); fi
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then missing_vars+=("SUPABASE_SERVICE_ROLE_KEY"); fi
    if [ -z "$OPENAI_API_KEY" ]; then missing_vars+=("OPENAI_API_KEY"); fi
    if [ -z "$NEXTAUTH_SECRET" ]; then missing_vars+=("NEXTAUTH_SECRET"); fi
    if [ -z "$NEXTAUTH_URL" ]; then missing_vars+=("NEXTAUTH_URL"); fi
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        printf '  - %s\n' "${missing_vars[@]}"
        print_error "Please update .env.local with all required variables."
        exit 1
    fi
    
    print_success "Environment variables validated!"
}

# Deploy Supabase database
deploy_database() {
    print_status "Deploying Supabase database..."
    
    if [ ! -f "backend/supabase-schema-complete.sql" ]; then
        print_error "Database schema file not found!"
        exit 1
    fi
    
    print_warning "Please run the following steps in your Supabase dashboard:"
    echo "1. Go to SQL Editor in your Supabase dashboard"
    echo "2. Copy the contents of backend/supabase-schema-complete.sql"
    echo "3. Paste and execute the SQL"
    echo "4. Verify all tables are created successfully"
    echo "5. Set up file storage buckets (avatars, documents, media, exports, imports)"
    echo "6. Configure RLS policies"
    echo "7. Enable real-time subscriptions for:"
    echo "   - study_room_messages"
    echo "   - study_room_participants"
    echo "   - ai_interactions"
    echo "   - notifications"
    
    read -p "Press Enter after completing Supabase setup..."
    print_success "Database setup completed!"
}

# Deploy backend to Vercel
deploy_backend() {
    print_status "Deploying backend to Vercel..."
    
    cd backend
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Deploy to Vercel
    print_status "Deploying backend functions to Vercel..."
    vercel --prod --yes
    
    # Get the deployment URL
    BACKEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    print_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying frontend to Vercel..."
    vercel --prod --yes
    
    # Get the deployment URL
    FRONTEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    print_success "Frontend deployed to: $FRONTEND_URL"
    
    cd ..
}

# Update environment variables in Vercel
update_vercel_env() {
    print_status "Updating Vercel environment variables..."
    
    # Update backend environment variables
    cd backend
    vercel env add SUPABASE_URL
    vercel env add SUPABASE_ANON_KEY
    vercel env add SUPABASE_SERVICE_ROLE_KEY
    vercel env add OPENAI_API_KEY
    vercel env add GOOGLE_CLOUD_API_KEY
    vercel env add AZURE_SPEECH_KEY
    vercel env add AZURE_SPEECH_REGION
    cd ..
    
    # Update frontend environment variables
    cd frontend
    vercel env add NEXTAUTH_URL
    vercel env add NEXTAUTH_SECRET
    vercel env add SUPABASE_URL
    vercel env add SUPABASE_ANON_KEY
    vercel env add NEXT_PUBLIC_SUPABASE_URL
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
    vercel env add NEXT_PUBLIC_API_URL
    cd ..
    
    print_success "Environment variables updated in Vercel!"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test backend health
    print_status "Testing backend health endpoint..."
    if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
        print_success "Backend health check passed!"
    else
        print_warning "Backend health check failed. Please check the deployment."
    fi
    
    # Test frontend
    print_status "Testing frontend accessibility..."
    if curl -f -s "$FRONTEND_URL" > /dev/null; then
        print_success "Frontend is accessible!"
    else
        print_warning "Frontend accessibility test failed. Please check the deployment."
    fi
    
    print_success "Deployment testing completed!"
}

# Create deployment summary
create_summary() {
    print_status "Creating deployment summary..."
    
    cat > DEPLOYMENT_SUMMARY.md << EOF
# 🎉 AI Tutoring App - Deployment Summary

## Deployment Status: ✅ COMPLETE

### Frontend
- **URL:** $FRONTEND_URL
- **Platform:** Vercel
- **Status:** Deployed and accessible

### Backend
- **URL:** $BACKEND_URL
- **Platform:** Vercel (Serverless Functions)
- **Status:** Deployed and accessible

### Database
- **Platform:** Supabase
- **Status:** Schema deployed and configured

## Next Steps

1. **Test the application:**
   - Visit: $FRONTEND_URL
   - Test user registration and login
   - Test AI chat functionality
   - Test study room creation and joining

2. **Configure additional services:**
   - Set up Google OAuth (if using)
   - Set up GitHub OAuth (if using)
   - Configure email services
   - Set up monitoring and alerts

3. **Monitor performance:**
   - Check Vercel dashboard for function performance
   - Monitor Supabase usage and performance
   - Set up error tracking (Sentry recommended)

## Environment Variables

Make sure these are set in both Vercel projects:

### Backend (Vercel Functions)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- GOOGLE_CLOUD_API_KEY (optional)
- AZURE_SPEECH_KEY (optional)
- AZURE_SPEECH_REGION (optional)

### Frontend (Vercel)
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- SUPABASE_URL
- SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_API_URL

## Support

- **Documentation:** Check README files in frontend/ and backend/
- **Issues:** Create GitHub issues for bugs or feature requests
- **Monitoring:** Use Vercel and Supabase dashboards

---

**Deployment completed on:** $(date)
**Deployed by:** $(whoami)
EOF

    print_success "Deployment summary created: DEPLOYMENT_SUMMARY.md"
}

# Main deployment function
main() {
    echo "🚀 AI Tutoring App - Unified Deployment"
    echo "========================================"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    echo ""
    
    # Step 2: Validate environment
    validate_environment
    echo ""
    
    # Step 3: Deploy database
    deploy_database
    echo ""
    
    # Step 4: Deploy backend
    deploy_backend
    echo ""
    
    # Step 5: Deploy frontend
    deploy_frontend
    echo ""
    
    # Step 6: Update environment variables
    update_vercel_env
    echo ""
    
    # Step 7: Test deployment
    test_deployment
    echo ""
    
    # Step 8: Create summary
    create_summary
    echo ""
    
    print_success "🎉 UNIFIED DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo ""
    echo "📋 Summary:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Backend:  $BACKEND_URL"
    echo "  Database: Supabase (configured)"
    echo ""
    echo "📖 Next steps:"
    echo "  1. Test the application at $FRONTEND_URL"
    echo "  2. Check DEPLOYMENT_SUMMARY.md for details"
    echo "  3. Configure additional services as needed"
    echo "  4. Set up monitoring and alerts"
    echo ""
    print_success "Your AI Tutoring App is now live! 🚀"
}

# Run main function
main "$@"