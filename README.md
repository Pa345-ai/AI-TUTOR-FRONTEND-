# 🧠 OmniMind Super-Intelligent AI Backend

A complete, test-ready backend for the OmniMind / NeuroLearn ecosystem — a next-generation AI tutor platform that teaches, learns, and improves itself.

## 🚀 Features

### 🧠 Ultra-Intelligent Learning Engine
- **Personalized Learning Paths**: AI generates customized learning journeys
- **Adaptive Difficulty**: Adjusts based on real-time performance
- **Knowledge Graph Mapping**: Tracks strengths/weaknesses per subject
- **Multi-Modal Support**: Text, voice, drawing, and code interactions
- **Contextual Memory**: Remembers user sessions and learning patterns

### 🎙️ Human-Like Interaction Layer
- **Emotional AI Tutor**: Detects and responds to user emotions
- **Tutor Personas**: Socratic, Friendly, Exam, and Motivational modes
- **Voice Integration**: Speech-to-text and text-to-speech capabilities
- **Real-time Feedback**: Immediate, personalized responses

### 📚 Immersive Learning Tools
- **AI Quiz Generator**: Creates personalized assessments
- **Lesson Builder**: Generates structured learning content
- **Flashcard Creator**: Spaced repetition learning system
- **Note Summarizer**: AI-powered content summarization
- **Gamification**: XP, badges, streaks, and leaderboards

### 💎 Premium Differentiators
- **Offline Mode**: Cached AI responses for offline learning
- **Collaborative Rooms**: Group learning sessions with AI
- **ELI5/Expert Toggle**: Adjustable explanation depth
- **Career Advisor**: AI-powered career guidance
- **Multi-Language Support**: Real-time translation and tutoring

### 🧩 Billion-Dollar Ecosystem Features
- **Meta-Learning Core**: AI that learns how to teach itself
- **NeuroVerse Integration**: VR/AR environment support
- **Developer SDK**: Plugin architecture for third-party apps
- **Cognitive Digital Twins**: Predictive learning models
- **Cross-Domain Applications**: Health, Code, and Business tutors
- **Tokenized Learning Economy**: Learn-to-earn system
- **Ethical AI Layer**: Privacy, transparency, and fairness

## 🏗️ Tech Stack

- **Supabase**: Database (PostgreSQL), Auth, Storage, Realtime
- **Edge Functions**: TypeScript backend logic
- **OpenAI API**: AI reasoning, tutoring, and meta-learning
- **Mock Data**: Comprehensive test datasets
- **Optional**: Whisper (speech), Web3 (tokens), VR/AR stubs

## 📂 Project Structure

```
supabase/
├── migrations/
│   └── 001_omnimind_core_schema.sql    # Complete database schema
├── functions/
│   └── ai/
│       ├── generate_learning_path.ts   # AI learning path generation
│       ├── update_knowledge_graph.ts   # Knowledge graph updates
│       ├── contextual_memory.ts        # Memory and context management
│       ├── emotional_tutor.ts          # Emotional AI responses
│       ├── tutor_persona.ts            # Tutor personality system
│       ├── quiz_generator.ts           # AI quiz generation
│       └── meta_learning.ts            # Self-improving AI
mock_data/
├── seed.sql                            # Comprehensive test data
└── seed.ts                             # TypeScript seed utilities
.env.example                            # Environment configuration
README.md                               # This file
```

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 2. Database Setup

```bash
# Run migrations
supabase db reset

# Or apply specific migration
supabase db push
```

### 3. Seed Test Data

```bash
# Load comprehensive mock data
psql -d your_database -f mock_data/seed.sql
```

### 4. Deploy Edge Functions

```bash
# Deploy all AI functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy ai/generate_learning_path
```

## 🧪 Testing Features

### Test Learning Path Generation
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ai/generate_learning_path' \
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
```

### Test Emotional Tutor
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ai/emotional_tutor' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "user_input": "I am really struggling with this concept",
    "session_type": "tutoring",
    "subject": "mathematics"
  }'
```

### Test Quiz Generation
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ai/quiz_generator' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "subject": "mathematics",
    "topic": "algebra",
    "difficulty_level": "beginner",
    "question_count": 5,
    "quiz_type": "multiple_choice"
  }'
```

## 📊 Mock Data Coverage

The included mock data provides comprehensive testing for:

- **20 User Profiles**: Diverse learning styles and preferences
- **100+ Lessons**: Across multiple subjects and difficulty levels
- **50+ AI Sessions**: Realistic conversation examples
- **10+ Quizzes**: Per subject with various question types
- **5 VR Environments**: Immersive learning spaces
- **100+ Token Transactions**: Learn-to-earn economy simulation
- **20+ Learning Trajectories**: Cognitive twin predictions
- **10+ Audit Logs**: Ethical AI transparency examples

## 🔧 API Endpoints

### Core Learning Engine
- `POST /functions/v1/ai/generate_learning_path` - Create personalized learning paths
- `POST /functions/v1/ai/update_knowledge_graph` - Update user knowledge mapping
- `POST /functions/v1/ai/contextual_memory` - Retrieve relevant learning context

### Human-Like Interaction
- `POST /functions/v1/ai/emotional_tutor` - Emotion-aware AI responses
- `POST /functions/v1/ai/tutor_persona` - Personality-based tutoring

### Learning Tools
- `POST /functions/v1/ai/quiz_generator` - Generate personalized quizzes
- `POST /functions/v1/ai/lesson_builder` - Create structured lessons
- `POST /functions/v1/ai/summarize_notes` - AI-powered summarization

### Advanced Features
- `POST /functions/v1/ai/meta_learning` - Self-improving AI analysis
- `POST /functions/v1/ai/cognitive_twin` - Predictive learning models
- `POST /functions/v1/ai/token_system` - Learn-to-earn transactions

## 🎯 Key Features Demonstrated

### 1. Personalized Learning
- AI generates custom learning paths based on user profile
- Adaptive difficulty adjustment based on performance
- Knowledge graph tracking of strengths and weaknesses

### 2. Emotional Intelligence
- Emotion detection from user input
- Appropriate response tone and teaching approach
- Encouragement and motivation based on user state

### 3. Multi-Modal Learning
- Text, voice, and visual learning support
- Interactive quizzes and assessments
- Gamification with XP, badges, and streaks

### 4. Meta-Learning
- AI analyzes its own teaching effectiveness
- Global learning pattern recognition
- Continuous improvement of teaching strategies

### 5. Ethical AI
- Transparent reasoning logs
- Bias detection and mitigation
- Fairness metrics across demographic groups

## 🔒 Security & Privacy

- **Row Level Security**: User data isolation
- **API Authentication**: Supabase Auth integration
- **Data Encryption**: Secure data transmission
- **Privacy Controls**: Granular consent management
- **Audit Logging**: Complete interaction tracking

## 📈 Performance

- **Optimized Queries**: Indexed database operations
- **Caching**: Redis integration for fast responses
- **Edge Functions**: Global CDN deployment
- **Real-time Updates**: WebSocket connections
- **Scalable Architecture**: Microservices design

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Supabase Deployment
```bash
# Deploy database
supabase db push

# Deploy functions
supabase functions deploy
```

## 🧪 Testing

### Run All Tests
```bash
# Test database schema
supabase db test

# Test Edge Functions
supabase functions test

# Test API endpoints
npm run test:api
```

### Load Test Data
```bash
# Load comprehensive test data
npm run seed:data

# Verify data integrity
npm run test:data
```

## 📚 Documentation

- **API Documentation**: `/docs/api.md`
- **Database Schema**: `/docs/schema.md`
- **Deployment Guide**: `/docs/deployment.md`
- **Testing Guide**: `/docs/testing.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [docs.omnimind.ai](https://docs.omnimind.ai)
- **Community**: [discord.omnimind.ai](https://discord.omnimind.ai)
- **Issues**: [github.com/omnimind/backend/issues](https://github.com/omnimind/backend/issues)

---

**Built with ❤️ by the OmniMind Team**

*Transforming education through AI-powered personalized learning*
