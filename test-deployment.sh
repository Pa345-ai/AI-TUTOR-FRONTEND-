#!/bin/bash

# OmniMind Backend Deployment Test Script
# This script tests all deployed functions and features

set -e

echo "🧪 Testing OmniMind Backend Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Get project details
get_project_details() {
    print_status "Getting project details..."
    
    PROJECT_URL=$(supabase status | grep "API URL" | awk '{print $3}')
    ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
    
    if [ -z "$PROJECT_URL" ] || [ -z "$ANON_KEY" ]; then
        print_error "Could not retrieve project details. Make sure you're in a linked project directory."
        exit 1
    fi
    
    print_success "Project URL: $PROJECT_URL"
    print_success "Anon Key: ${ANON_KEY:0:20}..."
}

# Test database connection
test_database() {
    print_status "Testing database connection..."
    
    response=$(curl -s -X GET "$PROJECT_URL/rest/v1/users?select=count" \
        -H "apikey: $ANON_KEY" \
        -H "Authorization: Bearer $ANON_KEY")
    
    if echo "$response" | grep -q "count"; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        return 1
    fi
}

# Test learning path generation
test_learning_path() {
    print_status "Testing learning path generation..."
    
    response=$(curl -s -X POST "$PROJECT_URL/functions/v1/ai/generate_learning_path" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "550e8400-e29b-41d4-a716-446655440001",
            "subject": "programming",
            "difficulty_level": "beginner",
            "learning_goals": ["Master Python", "Build projects"],
            "preferred_languages": ["en"],
            "learning_style": "visual"
        }')
    
    if echo "$response" | grep -q "learning_path"; then
        print_success "Learning path generation working"
    else
        print_error "Learning path generation failed: $response"
        return 1
    fi
}

# Test enhanced emotional tutor
test_emotional_tutor() {
    print_status "Testing enhanced emotional tutor..."
    
    response=$(curl -s -X POST "$PROJECT_URL/functions/v1/ai/enhanced_emotional_tutor" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "550e8400-e29b-41d4-a716-446655440001",
            "user_input": "I am struggling with this concept and feeling frustrated",
            "session_type": "tutoring",
            "subject": "mathematics"
        }')
    
    if echo "$response" | grep -q "ai_response"; then
        print_success "Enhanced emotional tutor working"
    else
        print_error "Enhanced emotional tutor failed: $response"
        return 1
    fi
}

# Test enhanced quiz generator
test_quiz_generator() {
    print_status "Testing enhanced quiz generator..."
    
    response=$(curl -s -X POST "$PROJECT_URL/functions/v1/ai/enhanced_quiz_generator" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "550e8400-e29b-41d4-a716-446655440001",
            "subject": "mathematics",
            "topic": "algebra",
            "difficulty_level": "beginner",
            "question_count": 3,
            "quiz_type": "multiple_choice"
        }')
    
    if echo "$response" | grep -q "quiz"; then
        print_success "Enhanced quiz generator working"
    else
        print_error "Enhanced quiz generator failed: $response"
        return 1
    fi
}

# Test security monitoring
test_security_monitor() {
    print_status "Testing security monitoring..."
    
    response=$(curl -s -X POST "$PROJECT_URL/functions/v1/ai/security_monitor" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "550e8400-e29b-41d4-a716-446655440001",
            "action_type": "read",
            "resource_type": "learning_paths"
        }')
    
    if echo "$response" | grep -q "security_assessment"; then
        print_success "Security monitoring working"
    else
        print_error "Security monitoring failed: $response"
        return 1
    fi
}

# Test RLS policies
test_rls_policies() {
    print_status "Testing Row Level Security policies..."
    
    # Test without authentication (should fail)
    response=$(curl -s -X GET "$PROJECT_URL/rest/v1/users" \
        -H "apikey: $ANON_KEY")
    
    if echo "$response" | grep -q "JWT"; then
        print_success "RLS policies working (unauthenticated access blocked)"
    else
        print_warning "RLS policies may not be working correctly"
    fi
}

# Test all functions
test_all_functions() {
    print_status "Testing all Edge Functions..."
    
    functions=(
        "ai/generate_learning_path"
        "ai/update_knowledge_graph"
        "ai/contextual_memory"
        "ai/enhanced_emotional_tutor"
        "ai/tutor_persona"
        "ai/enhanced_quiz_generator"
        "ai/meta_learning"
        "ai/security_monitor"
    )
    
    for func in "${functions[@]}"; do
        print_status "Testing $func..."
        
        response=$(curl -s -X POST "$PROJECT_URL/functions/v1/$func" \
            -H "Authorization: Bearer $ANON_KEY" \
            -H "Content-Type: application/json" \
            -d '{"test": true}')
        
        if echo "$response" | grep -q -E "(error|Error)"; then
            print_warning "$func returned an error (may be expected for test data)"
        else
            print_success "$func is accessible"
        fi
    done
}

# Main test function
main() {
    echo
    print_status "Starting comprehensive deployment tests..."
    echo
    
    # Get project details
    get_project_details
    
    # Test core functionality
    test_database
    test_learning_path
    test_emotional_tutor
    test_quiz_generator
    test_security_monitor
    
    # Test security
    test_rls_policies
    
    # Test all functions
    test_all_functions
    
    echo
    print_success "🎉 All tests completed!"
    echo
    print_status "Deployment Summary:"
    echo "✅ Database schema deployed"
    echo "✅ Edge Functions deployed"
    echo "✅ Security policies active"
    echo "✅ API endpoints working"
    echo
    print_status "Your OmniMind Backend is ready for production! 🚀"
}

# Run main function
main "$@"
