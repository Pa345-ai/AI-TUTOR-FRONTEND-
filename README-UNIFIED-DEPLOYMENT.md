# 🚀 AI Tutoring App - Unified Deployment Guide

This guide will help you deploy both the frontend and backend of the AI Tutoring App together using multiple deployment strategies.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed
- **npm 8+** installed
- **Vercel CLI** installed (`npm install -g vercel`)
- **Docker** installed (for containerized deployment)
- **Git** installed
- **Supabase account** and project
- **OpenAI API key**

## 🎯 Deployment Options

### Option 1: Quick Vercel Deployment (Recommended)

This is the fastest way to get your app running:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-tutoring-app

# 2. Install dependencies
npm run install:all

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# 4. Deploy everything
npm run deploy
```

### Option 2: Manual Vercel Deployment

Deploy frontend and backend separately:

```bash
# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd ../frontend
vercel --prod
```

### Option 3: Docker Deployment

Deploy using Docker containers:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual containers
docker build -t ai-tutoring-frontend ./frontend
docker build -t ai-tutoring-backend ./backend
```

### Option 4: CI/CD Pipeline

Automated deployment with GitHub Actions:

1. Set up repository secrets in GitHub
2. Push to main branch
3. Automatic deployment will trigger

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file with these variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and keys

2. **Run Database Schema:**
   - Go to SQL Editor in Supabase
   - Copy contents of `backend/supabase-schema-complete.sql`
   - Execute the SQL to create all tables

3. **Set up File Storage:**
   - Create buckets: `avatars`, `documents`, `media`, `exports`, `imports`
   - Configure RLS policies for each bucket

4. **Enable Real-time:**
   - Enable replication for: `study_room_messages`, `study_room_participants`, `ai_interactions`, `notifications`

## 🚀 Quick Start

### 1. One-Command Deployment

```bash
# Make the script executable
chmod +x deploy-unified.sh

# Run the deployment script
./deploy-unified.sh
```

This script will:
- ✅ Check all dependencies
- ✅ Validate environment variables
- ✅ Deploy Supabase database
- ✅ Deploy backend to Vercel
- ✅ Deploy frontend to Vercel
- ✅ Update environment variables
- ✅ Test the deployment
- ✅ Create deployment summary

### 2. Development Mode

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

### 3. Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints

- **Frontend:** `GET /` - Main application
- **Backend:** `GET /api/health` - API health status
- **Database:** Check Supabase dashboard

### Monitoring Tools

- **Vercel Dashboard:** Monitor function performance
- **Supabase Dashboard:** Monitor database usage
- **Application Logs:** Check Vercel function logs

## 🔒 Security Configuration

### Environment Variables Security

- Never commit `.env.local` to version control
- Use Vercel environment variables for production
- Rotate API keys regularly
- Use strong passwords for database

### CORS Configuration

The application includes proper CORS configuration:
- Frontend and backend are on the same domain
- API endpoints are properly protected
- Rate limiting is enabled

### Authentication

- JWT tokens for API authentication
- Supabase RLS for database security
- Social login providers configured
- Session management with NextAuth

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Set:**
   ```bash
   # Check if .env.local exists and has correct values
   cat .env.local
   ```

2. **Database Connection Issues:**
   - Verify Supabase URL and keys
   - Check if database schema is deployed
   - Verify RLS policies

3. **API Endpoints Not Working:**
   - Check Vercel function logs
   - Verify environment variables in Vercel
   - Test endpoints individually

4. **Frontend Build Errors:**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `npm run install:all`
   - Check for TypeScript errors

### Debug Commands

```bash
# Check application health
npm run health

# View logs
vercel logs

# Test specific endpoints
curl -X GET https://your-app.vercel.app/api/health
```

## 📈 Performance Optimization

### Frontend Optimization

- Next.js automatic code splitting
- Image optimization with next/image
- Static generation where possible
- CDN caching with Vercel

### Backend Optimization

- Serverless functions for scalability
- Edge caching for frequently accessed data
- Database query optimization
- Rate limiting to prevent abuse

### Database Optimization

- Proper indexing on all tables
- Connection pooling
- Query optimization
- Regular maintenance

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm run install:all

# Build and deploy
npm run build
npm run deploy
```

### Database Migrations

1. Update schema in `backend/supabase-schema-complete.sql`
2. Run migration in Supabase SQL Editor
3. Update application code if needed
4. Deploy updated application

### Monitoring Updates

- Check Vercel dashboard for function performance
- Monitor Supabase usage and costs
- Set up alerts for errors and performance issues
- Regular security audits

## 📞 Support

### Getting Help

1. **Documentation:** Check README files in frontend/ and backend/
2. **Issues:** Create GitHub issues for bugs
3. **Discussions:** Use GitHub discussions for questions
4. **Email:** Contact support team

### Useful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🎉 Success!

Once deployed, your AI Tutoring App will be available at:

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.vercel.app/api`
- **Database:** Supabase dashboard

### Next Steps

1. **Test all features** - User registration, AI chat, study rooms
2. **Configure monitoring** - Set up alerts and dashboards
3. **Set up CI/CD** - Automate deployments
4. **Scale as needed** - Monitor usage and scale resources

---

**Your AI Tutoring App is now live and ready to help students learn! 🚀**