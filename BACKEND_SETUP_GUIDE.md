# 🔗 Backend Connection Setup Guide

## 🎯 **Current Status: Backend Not Connected**

The provided backend URL `https://ai-tutor-backend-ftis.vercel.app` is returning 404 errors for all API endpoints. Let's set up a working backend!

## 🚀 **Option 1: Quick Setup (Recommended)**

### **Step 1: Deploy Backend to Vercel**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Navigate to backend directory
cd backend

# 4. Deploy
vercel --prod

# 5. Note your deployment URL (e.g., https://ai-tutor-backend-abc123.vercel.app)
```

### **Step 2: Set up Supabase Database**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be ready

2. **Set up Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `backend/supabase-schema.sql`
   - Click "Run" to execute the schema

3. **Get API Keys**
   - Go to Settings > API
   - Copy your Project URL and anon public key

### **Step 3: Configure Environment Variables**

In your Vercel dashboard:
1. Go to your project
2. Go to Settings > Environment Variables
3. Add these variables:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### **Step 4: Update Frontend Configuration**

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_BASE_URL=https://your-backend-url.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **Step 5: Test the Connection**

```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health

# Test chat endpoint
curl -X POST https://your-backend-url.vercel.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","content":"Hello"}'
```

## 🛠️ **Option 2: Use Mock Backend (Temporary)**

If you want to test the frontend immediately:

1. **Enable Mock Mode**
   ```bash
   # In frontend/src/lib/mock-api.ts
   export const MOCK_BACKEND = true;
   ```

2. **Deploy Frontend**
   ```bash
   npm run build
   # Deploy to any hosting platform
   ```

## 📊 **Backend Features Implemented**

### **✅ API Endpoints Ready**
- `GET /api/health` - Health check
- `POST /api/chat/message` - AI chat
- `GET /api/progress/[userId]` - User progress
- `GET /api/achievements` - Achievements
- `GET /api/flashcards` - Flashcards
- `GET /api/study-rooms` - Study rooms
- `POST /api/study-rooms` - Create study room

### **✅ Database Schema**
- Users and authentication
- User progress and achievements
- Conversations and chat history
- Flashcards with spaced repetition
- Study rooms and collaboration
- Learning paths and quizzes
- Notifications system

### **✅ Features Supported**
- AI Chat with multiple personalities
- Progress tracking and analytics
- Achievement system
- Flashcard learning
- Study room collaboration
- Learning path management
- Quiz generation and tracking

## 🔧 **Troubleshooting**

### **Backend Returns 404**
- Check if Vercel deployment was successful
- Verify API routes are in correct directory structure
- Check Vercel function logs

### **Database Connection Issues**
- Verify Supabase URL and keys are correct
- Check if database schema was applied
- Test connection in Supabase dashboard

### **Frontend Can't Connect**
- Verify `NEXT_PUBLIC_BASE_URL` is correct
- Check browser network tab for errors
- Ensure CORS is properly configured

## 🎯 **Quick Test Commands**

```bash
# Test backend health
curl https://your-backend-url.vercel.app/api/health

# Test chat API
curl -X POST https://your-backend-url.vercel.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","content":"What is photosynthesis?"}'

# Test progress API
curl https://your-backend-url.vercel.app/api/progress/test123

# Test achievements API
curl https://your-backend-url.vercel.app/api/achievements
```

## 🚀 **Deployment Checklist**

- [ ] Backend deployed to Vercel
- [ ] Supabase database set up
- [ ] Environment variables configured
- [ ] Frontend environment updated
- [ ] Health endpoint responding
- [ ] Chat API working
- [ ] Database connection successful
- [ ] Frontend connecting to backend

## 🎉 **Expected Result**

Once connected, your AI Tutoring App will have:
- ✅ Real AI chat functionality
- ✅ Persistent user progress
- ✅ Working achievements system
- ✅ Functional flashcards
- ✅ Collaborative study rooms
- ✅ Complete learning management

**Ready to connect your backend! 🚀**