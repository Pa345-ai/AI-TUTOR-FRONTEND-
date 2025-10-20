# 🏗️ OmniMind AI Tutor - Complete Architecture Flow

## 📊 **Data Flow Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Vercel API    │    │  Supabase Edge  │    │   Database      │
│   (Next.js)     │    │   Routes        │    │   Functions     │    │  (PostgreSQL)   │
│                 │    │                 │    │                 │    │                 │
│  All 30+        │◄──►│  Environment    │◄──►│  8 AI Functions │◄──►│  18+ Tables     │
│  Features       │    │  Variables      │    │                 │    │  + RLS          │
│                 │    │                 │    │                 │    │                 │
│  Interactive UI │    │  CORS Headers   │    │  OpenAI GPT     │    │  Audit Logging  │
│  TypeScript     │    │  Rate Limiting  │    │  Integration    │    │  Security       │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 **Step-by-Step Data Flow**

### **1. User Interaction (Frontend)**
```typescript
// User clicks "Generate Learning Path" in dashboard
const handleGeneratePath = async () => {
  const result = await OmniMindAPI.generateLearningPath({
    subject: 'programming',
    difficulty_level: 'beginner',
    learning_goals: ['Master Python']
  })
}
```

### **2. API Route Proxy (Vercel)**
```typescript
// pages/api/ai/[...path].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai/${functionPath}`, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
  return res.json(await response.json())
}
```

### **3. Edge Function Processing (Supabase)**
```typescript
// supabase/functions/ai/generate_learning_path.ts
export default async function handler(req: Request) {
  const { user_id, subject, difficulty_level } = await req.json()
  
  // Call OpenAI API
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: `Generate learning path for ${subject}` }]
  })
  
  // Save to database
  const { data } = await supabase
    .from('learning_paths')
    .insert([{ user_id, subject, ...aiResponse }])
  
  return new Response(JSON.stringify({ learning_path: data }))
}
```

### **4. Database Storage (PostgreSQL)**
```sql
-- learning_paths table with RLS
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can only see their own learning paths" 
ON learning_paths FOR ALL 
USING (auth.uid() = user_id);
```

## 🚀 **Deployment Commands**

### **Step 1: Deploy Backend to Supabase**
```bash
# In your project root directory
chmod +x deploy.sh
./deploy.sh
```

**What this does:**
- ✅ Checks Supabase CLI installation
- ✅ Links to your Supabase project
- ✅ Deploys database schema (18+ tables)
- ✅ Deploys Edge Functions (8 AI functions)
- ✅ Loads mock data
- ✅ Tests deployment

### **Step 2: Deploy Frontend + Backend to Vercel**
```bash
# In your project root directory
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

**What this does:**
- ✅ Checks Vercel CLI installation
- ✅ Validates environment variables
- ✅ Deploys Next.js frontend to Vercel
- ✅ Sets up API route proxying
- ✅ Configures environment variables
- ✅ Tests deployment

## 🔧 **Environment Variables Setup**

### **1. Create .env.local file:**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your actual values
nano .env.local
```

### **2. Required Environment Variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Application Settings
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📁 **File Structure**

```
omnimind-ai-tutor/
├── pages/
│   ├── index.tsx                    # Home page (30+ features showcase)
│   ├── dashboard.tsx                # Main dashboard (10 tabs)
│   └── api/
│       └── ai/
│           └── [...path].ts         # API route proxy
├── components/
│   ├── ai/
│   │   ├── EmotionalTutor.tsx       # ChatGPT-quality AI
│   │   └── QuizGenerator.tsx        # Advanced quiz generation
│   └── features/
│       ├── LearningPaths.tsx        # Personalized learning
│       ├── KnowledgeGraph.tsx       # Knowledge visualization
│       ├── Gamification.tsx         # XP, badges, streaks
│       └── VREnvironments.tsx       # VR learning spaces
├── lib/
│   ├── supabase.ts                  # Database client
│   └── api.ts                       # API client
├── hooks/
│   └── useOmniMind.ts               # Data management
├── supabase/
│   ├── migrations/                  # Database schema
│   └── functions/ai/                # 8 AI Edge Functions
├── deploy.sh                        # Supabase deployment
├── deploy-vercel.sh                 # Vercel deployment
└── vercel.json                      # Vercel configuration
```

## 🎯 **Quick Start Commands**

### **1. Setup (One-time)**
```bash
# Install dependencies
npm install

# Install Supabase CLI
npm install -g supabase

# Install Vercel CLI
npm install -g vercel

# Login to Supabase
supabase login

# Login to Vercel
vercel login
```

### **2. Deploy Backend**
```bash
# Deploy to Supabase
./deploy.sh
```

### **3. Deploy Frontend**
```bash
# Deploy to Vercel
./deploy-vercel.sh
```

### **4. Test Deployment**
```bash
# Test API endpoint
curl -X POST "https://your-app.vercel.app/api/ai/generate_learning_path" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "subject": "programming", "difficulty_level": "beginner"}'
```

## 🔍 **How to Verify Everything Works**

### **1. Check Supabase Dashboard**
- Go to https://supabase.com/dashboard
- Verify all tables are created
- Check Edge Functions are deployed
- Review audit logs

### **2. Check Vercel Dashboard**
- Go to https://vercel.com/dashboard
- Verify deployment is successful
- Check environment variables
- Review function logs

### **3. Test Frontend**
- Visit your Vercel URL
- Navigate through all 10 dashboard tabs
- Test AI tutor chat
- Generate a learning path
- Try quiz generation

## 🎉 **Result**

After running these commands, you'll have:

✅ **Complete Backend** - Supabase with 8 AI functions + 18+ tables  
✅ **Beautiful Frontend** - Next.js with all 30+ features  
✅ **API Integration** - Vercel API routes connecting frontend to backend  
✅ **Production Ready** - Fully deployed and functional  
✅ **Security** - RLS policies and audit logging active  

**Your OmniMind AI Tutor will be live and fully functional! 🚀**
