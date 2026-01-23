# 🚀 OmniMind Backend Deployment Guide

Complete step-by-step guide to deploy the OmniMind Super-Intelligent AI Backend to Supabase.

## 📋 Prerequisites

### 1. Required Tools
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Git](https://git-scm.com/)
- [PostgreSQL Client](https://www.postgresql.org/download/) (optional, for direct DB access)

### 2. Accounts Needed
- [Supabase Account](https://supabase.com/)
- [OpenAI Account](https://openai.com/) (for AI features)
- [GitHub Account](https://github.com/) (for version control)

## 🏗️ Step 1: Project Setup

### 1.1 Initialize Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize new project (if starting fresh)
supabase init

# Link to existing project (if you have one)
supabase link --project-ref YOUR_PROJECT_REF
```

### 1.2 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `omnimind-backend`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

## 🔧 Step 2: Environment Configuration

### 2.1 Get Supabase Credentials
1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL**
   - **Anon Key**
   - **Service Role Key** (keep this secret!)

### 2.2 Create Environment File
```bash
# Create .env file
cp .env.example .env

# Edit with your credentials
nano .env
```

### 2.3 Configure Environment Variables
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# Application Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com

# Security Configuration
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Feature Flags
ENABLE_VR_FEATURES=true
ENABLE_WEB3_FEATURES=true
ENABLE_SPEECH_RECOGNITION=true
ENABLE_REAL_TIME_ANALYTICS=true
```

## 🗄️ Step 3: Database Setup

### 3.1 Deploy Database Schema
```bash
# Deploy all migrations
supabase db push

# Or deploy specific migration
supabase db push --include-all

# Verify deployment
supabase db diff
```

### 3.2 Enable Required Extensions
```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
```

### 3.3 Verify Schema Deployment
```bash
# Check if tables were created
supabase db shell

# In the SQL shell, run:
\dt

# You should see all 18+ tables including:
# - users
# - learning_paths
# - lessons
# - ai_sessions
# - progress
# - knowledge_graphs
# - tutor_personas
# - quizzes
# - quiz_attempts
# - flashcards
# - gamification
# - mock_vr_environments
# - cognitive_twins
# - developer_apps
# - tokens
# - audit_logs
# - audit_logs_enhanced
# - security_events
# - meta_learning
# - cross_domain_apps
```

## 🔐 Step 4: Security Configuration

### 4.1 Enable Row Level Security
```sql
-- RLS is already enabled in the migration files
-- Verify by running:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

### 4.2 Configure Authentication
1. Go to Authentication > Settings in Supabase Dashboard
2. Configure the following:
   - **Site URL**: Your frontend domain
   - **Redirect URLs**: Add your frontend URLs
   - **JWT Settings**: Use default or configure custom
   - **Email Settings**: Configure SMTP for email auth

### 4.3 Set Up API Keys
1. Go to Settings > API
2. Copy your API keys
3. Update your `.env` file with the correct keys

## 🚀 Step 5: Deploy Edge Functions

### 5.1 Deploy All Functions
```bash
# Deploy all AI functions
supabase functions deploy

# Or deploy specific functions
supabase functions deploy ai/generate_learning_path
supabase functions deploy ai/enhanced_emotional_tutor
supabase functions deploy ai/enhanced_quiz_generator
supabase functions deploy ai/security_monitor
```

### 5.2 Verify Function Deployment
```bash
# List deployed functions
supabase functions list

# Test a function
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/ai/generate_learning_path' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"user_id": "test", "subject": "programming", "difficulty_level": "beginner"}'
```

## 📊 Step 6: Load Mock Data

### 6.1 Load Seed Data
```bash
# Connect to database
supabase db shell

# Load the seed data
\i mock_data/seed.sql

# Verify data was loaded
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM learning_paths;
SELECT COUNT(*) FROM lessons;
```

### 6.2 Verify Data Integrity
```bash
# Check if all tables have data
SELECT 
  schemaname,
  tablename,
  n_tup_ins as row_count
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

## 🔍 Step 7: Testing & Validation

### 7.1 Test Core Functions
```bash
# Test learning path generation
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/ai/generate_learning_path' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "subject": "programming",
    "difficulty_level": "beginner",
    "learning_goals": ["Master Python", "Build projects"],
    "preferred_languages": ["en"],
    "learning_style": "visual"
  }'

# Test enhanced emotional tutor
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/ai/enhanced_emotional_tutor' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "user_input": "I am struggling with this concept",
    "session_type": "tutoring",
    "subject": "mathematics"
  }'

# Test security monitoring
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/ai/security_monitor' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "action_type": "read",
    "resource_type": "learning_paths"
  }'
```

### 7.2 Test Security Features
```bash
# Test RLS policies
# Try to access data without authentication (should fail)
curl -X GET 'https://your-project-ref.supabase.co/rest/v1/users' \
  -H 'apikey: YOUR_ANON_KEY'

# Test with authentication (should work)
curl -X GET 'https://your-project-ref.supabase.co/rest/v1/users' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY'
```

## 🌐 Step 8: Frontend Integration

### 8.1 Install Supabase Client
```bash
# In your frontend project
npm install @supabase/supabase-js
```

### 8.2 Configure Supabase Client
```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseKey = 'your_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 8.3 Test Frontend Connection
```javascript
// Test connection
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1)

if (error) {
  console.error('Connection failed:', error)
} else {
  console.log('Connected successfully:', data)
}
```

## 📈 Step 9: Monitoring & Maintenance

### 9.1 Set Up Monitoring
1. Go to your Supabase Dashboard
2. Navigate to Logs
3. Monitor the following:
   - **API Logs**: Track function calls and errors
   - **Database Logs**: Monitor query performance
   - **Auth Logs**: Track authentication events
   - **Edge Function Logs**: Monitor function execution

### 9.2 Set Up Alerts
1. Go to Settings > Alerts
2. Configure alerts for:
   - High error rates
   - Slow queries
   - Authentication failures
   - Security events

### 9.3 Regular Maintenance
```bash
# Update functions
supabase functions deploy

# Update database schema
supabase db push

# Check function logs
supabase functions logs ai/generate_learning_path

# Monitor database performance
supabase db shell
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Function Deployment Fails
```bash
# Check function logs
supabase functions logs ai/function_name

# Common fixes:
# - Check environment variables
# - Verify function syntax
# - Check dependencies
```

#### 2. Database Connection Issues
```bash
# Check connection
supabase db ping

# Reset connection
supabase db reset
```

#### 3. RLS Policy Issues
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies;
```

#### 4. Authentication Issues
```bash
# Check auth configuration
supabase auth list

# Test auth
supabase auth signup --email test@example.com --password testpass
```

## 📚 Next Steps

### 1. Production Optimization
- Set up CDN for static assets
- Configure database backups
- Set up monitoring and alerting
- Implement rate limiting

### 2. Security Hardening
- Enable additional security headers
- Set up WAF (Web Application Firewall)
- Implement IP whitelisting
- Regular security audits

### 3. Performance Optimization
- Database query optimization
- Function performance tuning
- Caching strategy implementation
- Load testing

### 4. Scaling
- Database read replicas
- Function auto-scaling
- CDN optimization
- Multi-region deployment

## 🆘 Support

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Supabase Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **OmniMind Issues**: [github.com/omnimind/backend/issues](https://github.com/omnimind/backend/issues)

---

**Deployment Complete! 🎉**

Your OmniMind Super-Intelligent AI Backend is now live on Supabase with enterprise-grade security and ChatGPT-quality AI responses!
