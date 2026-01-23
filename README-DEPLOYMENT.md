# 🚀 AI Tutoring App - Unified Deployment Guide

This guide covers deploying both the frontend and backend together using multiple deployment strategies.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed
- **npm 8+** installed
- **Vercel CLI** installed (`npm install -g vercel`)
- **Supabase account** and project created
- **OpenAI API key**
- **Git** repository set up

## 🎯 Deployment Options

### Option 1: Quick Deploy (Recommended)
**One-command deployment using our unified script**

```bash
# Clone the repository
git clone https://github.com/your-org/ai-tutoring-app.git
cd ai-tutoring-app

# Run the unified deployment script
chmod +x deploy-unified.sh
./deploy-unified.sh
```

### Option 2: Manual Deploy
**Step-by-step manual deployment**

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Deploy database (Supabase)
# Run the SQL schema in your Supabase dashboard

# 4. Deploy backend
cd backend
vercel --prod

# 5. Deploy frontend
cd ../frontend
vercel --prod
```

### Option 3: Docker Deploy
**Using Docker for local development**

```bash
# Start all services with Docker
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Option 4: CI/CD Deploy
**Automated deployment with GitHub Actions**

1. Set up GitHub repository
2. Add secrets to GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
3. Push to `main` branch to trigger deployment

## 🔧 Environment Setup

### Required Environment Variables

Create `.env.local` file with these variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down URL and keys

2. **Deploy Database Schema:**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `backend/supabase-schema-complete.sql`
   - Paste and execute the SQL

3. **Set up File Storage:**
   - Create buckets: `avatars`, `documents`, `media`, `exports`, `imports`
   - Configure RLS policies

4. **Enable Real-time:**
   - Enable replication for: `study_room_messages`, `study_room_participants`, `ai_interactions`, `notifications`

## 🚀 Deployment Steps

### Step 1: Prepare Environment

```bash
# Clone repository
git clone https://github.com/your-org/ai-tutoring-app.git
cd ai-tutoring-app

# Install all dependencies
npm run setup

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values
```

### Step 2: Deploy Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `backend/supabase-schema-complete.sql`
4. Execute the SQL to create all tables and functions
5. Set up file storage buckets
6. Configure RLS policies

### Step 3: Deploy Backend

```bash
cd backend

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
```

### Step 4: Deploy Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

### Step 5: Test Deployment

```bash
# Test backend health
curl https://your-backend-url.vercel.app/api/health

# Test frontend
curl https://your-frontend-url.vercel.app

# Run health check
npm run health
```

## 🔍 Post-Deployment

### 1. Verify Deployment

- ✅ Frontend is accessible
- ✅ Backend API responds
- ✅ Database connection works
- ✅ Authentication flows work
- ✅ AI features function
- ✅ Real-time features work

### 2. Configure Additional Services

- **OAuth Providers:** Set up Google, GitHub, Facebook OAuth
- **Email Services:** Configure SendGrid or SMTP
- **Monitoring:** Set up Sentry or New Relic
- **Analytics:** Configure Google Analytics

### 3. Set up Monitoring

- **Vercel Dashboard:** Monitor function performance
- **Supabase Dashboard:** Monitor database usage
- **Error Tracking:** Set up Sentry for error monitoring
- **Uptime Monitoring:** Use UptimeRobot or similar

## 🛠️ Development Commands

```bash
# Start development servers
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Clean dependencies
npm run clean
```

## 🐳 Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build
```

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Set:**
   - Check `.env.local` file exists
   - Verify all required variables are set
   - Restart development servers

2. **Database Connection Issues:**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure database schema is deployed

3. **Build Failures:**
   - Clear node_modules and reinstall
   - Check Node.js version (18+)
   - Verify all dependencies are installed

4. **Deployment Issues:**
   - Check Vercel CLI is installed
   - Verify Vercel project is linked
   - Check environment variables in Vercel

### Getting Help

- **Documentation:** Check README files in frontend/ and backend/
- **Issues:** Create GitHub issues for bugs
- **Discord:** Join our community Discord
- **Email:** support@ai-tutoring-app.com

## 📊 Monitoring & Analytics

### Vercel Analytics
- Function performance metrics
- Edge function execution times
- Error rates and logs

### Supabase Analytics
- Database query performance
- Real-time subscription usage
- Storage usage and bandwidth

### Application Monitoring
- User activity tracking
- AI feature usage
- Error tracking and alerts

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions for automated deployment:

1. **Push to main branch** triggers deployment
2. **Tests run** automatically
3. **Build process** executes
4. **Deployment** happens automatically
5. **Health checks** verify deployment

## 🎉 Success!

Once deployed, your AI Tutoring App will be available at:

- **Frontend:** `https://your-frontend-url.vercel.app`
- **Backend:** `https://your-backend-url.vercel.app`
- **Database:** Supabase dashboard

**Congratulations! Your AI Tutoring App is now live! 🚀**