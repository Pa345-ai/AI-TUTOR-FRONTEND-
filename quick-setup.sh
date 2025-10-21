#!/bin/bash

# Quick Setup Script for OmniMind Backend
# This script helps you get started quickly

echo "🚀 OmniMind Backend Quick Setup"
echo "==============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Install Supabase CLI if not installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is already installed: $(supabase --version)"
fi

# Check if user is logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Authenticated with Supabase"

# List available projects
echo "📋 Available Supabase projects:"
supabase projects list

echo ""
echo "🎯 Next steps:"
echo "1. Choose a project from the list above"
echo "2. Set your project reference:"
echo "   export SUPABASE_PROJECT_REF=your-project-ref"
echo "3. Run the deployment script:"
echo "   ./deploy.sh"
echo ""
echo "Or create a new project at: https://supabase.com/dashboard"
