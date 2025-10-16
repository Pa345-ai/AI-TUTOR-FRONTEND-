# 🔗 Connecting to Existing Supabase Project

This guide will help you connect your AI Tutoring App frontend to your existing Supabase project that already has schemas and edge functions.

## 📋 **Prerequisites**

- ✅ Existing Supabase project with schemas and edge functions
- ✅ Frontend application ready for connection
- ✅ Supabase project URL and API keys

## 🔧 **Step 1: Get Your Supabase Credentials**

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings → API**
3. **Copy these values:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: (public key for frontend)
   - **Service Role Key**: (secret key for backend)

## 🔧 **Step 2: Configure Environment Variables**

Create a `.env.local` file in your project root:

```bash
# Backend Configuration
NEXT_PUBLIC_BACKEND_TYPE=supabase

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Frontend Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
NEXT_PUBLIC_API_URL=https://your-project-id.supabase.co/functions/v1

# Other required variables
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🔧 **Step 3: Install Supabase Dependencies**

```bash
cd frontend
npm install @supabase/supabase-js
```

## 🔧 **Step 4: Test the Connection**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check the connection status:**
   - Look for the connection status indicator in the bottom-right corner
   - Should show "Connected to Supabase database"

3. **Test authentication:**
   - Try signing up with a new account
   - Check if user appears in your Supabase auth.users table

## 🔧 **Step 5: Verify Database Schema**

Make sure your existing Supabase project has these tables:

### **Required Tables:**
- `users` - User profiles and authentication
- `study_rooms` - Collaborative study rooms
- `study_room_participants` - Room membership
- `study_room_messages` - Chat messages
- `user_progress` - Learning progress tracking
- `achievements` - Gamification system
- `user_achievements` - User's earned achievements
- `notifications` - User notifications
- `ai_interactions` - AI chat history
- `emotion_tracking` - Facial recognition data
- `file_uploads` - File storage metadata
- `homework_submissions` - Assignment submissions
- `career_profiles` - Career guidance data
- `user_goals` - Personal goals
- `integrations` - External tool connections

### **Required Edge Functions:**
- `chat` - AI chat functionality
- `voice` - Voice processing
- `emotion` - Emotion recognition
- `feedback` - Homework feedback
- `quiz-generate` - Quiz generation
- `career-advice` - Career guidance

## 🔧 **Step 6: Configure File Storage**

1. **Go to Storage in your Supabase dashboard**
2. **Create these buckets:**
   - `avatars` - User profile pictures
   - `documents` - PDFs, Word docs, etc.
   - `media` - Images, videos, audio
   - `exports` - Generated exports
   - `imports` - Imported files

3. **Set up RLS policies for each bucket**

## 🔧 **Step 7: Enable Real-time Subscriptions**

1. **Go to Database → Replication in Supabase**
2. **Enable real-time for these tables:**
   - `study_room_messages`
   - `study_room_participants`
   - `ai_interactions`
   - `notifications`

## 🔧 **Step 8: Test All Features**

### **Authentication:**
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Profile updates

### **AI Features:**
- [ ] Chat with AI tutor
- [ ] Voice interaction
- [ ] Emotion recognition
- [ ] Quiz generation
- [ ] Career advice
- [ ] Homework feedback

### **Collaborative Features:**
- [ ] Create study rooms
- [ ] Join study rooms
- [ ] Send messages
- [ ] Real-time updates

### **Learning Features:**
- [ ] Progress tracking
- [ ] Achievements
- [ ] Notifications
- [ ] File uploads

## 🐛 **Troubleshooting**

### **Connection Issues:**
```bash
# Check if Supabase URL is correct
curl https://your-project-id.supabase.co/rest/v1/

# Check if API key is valid
curl -H "apikey: your_anon_key" https://your-project-id.supabase.co/rest/v1/users
```

### **Authentication Issues:**
- Verify RLS policies are set up correctly
- Check if auth.users table exists
- Ensure JWT tokens are being passed correctly

### **Real-time Issues:**
- Verify real-time is enabled for required tables
- Check if WebSocket connection is working
- Look for CORS issues in browser console

### **File Upload Issues:**
- Verify storage buckets exist
- Check RLS policies for storage
- Ensure file size limits are appropriate

## 📊 **Monitoring**

### **Supabase Dashboard:**
- Monitor API usage
- Check database performance
- View real-time connections
- Review error logs

### **Browser Console:**
- Check for JavaScript errors
- Monitor network requests
- Verify authentication status

## 🎯 **Next Steps**

1. **Test all features** thoroughly
2. **Set up monitoring** and alerts
3. **Configure production** environment
4. **Deploy to Vercel** or your preferred platform
5. **Set up CI/CD** pipeline

## 📞 **Support**

If you encounter issues:

1. **Check the browser console** for errors
2. **Verify your Supabase configuration**
3. **Test the connection** using the status indicator
4. **Review the Supabase logs** in your dashboard

---

**Your AI Tutoring App is now connected to your existing Supabase project!** 🎉

The frontend will automatically use your existing database schema and edge functions, providing a seamless integration with your current backend infrastructure.