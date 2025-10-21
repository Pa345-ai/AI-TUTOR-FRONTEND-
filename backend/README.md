# AI Tutoring App - Premium Backend

A comprehensive, production-ready backend for the AI Tutoring App built with Supabase and Vercel.

## 🚀 Features

### Core AI Features
- **AI Chat & Voice** - Natural language processing with OpenAI GPT-4
- **Emotion Recognition** - Advanced facial emotion detection and analysis
- **Homework Feedback** - AI-powered essay and homework analysis
- **Quiz Generation** - Automatic quiz creation with 20+ question types
- **Career Guidance** - AI career advisor with personalized recommendations
- **Note Summarization** - Multi-format file processing and summarization

### Collaborative Features
- **Study Rooms** - Real-time collaborative learning spaces
- **AI Moderation** - Intelligent content moderation and suggestions
- **File Sharing** - Secure file upload and sharing system
- **Real-time Messaging** - Live chat with reactions and mentions

### Integration Features
- **Google Docs** - Sync notes and documents
- **Quizlet** - Export flashcards and study sets
- **YouTube** - Generate and upload educational videos
- **Notion** - Sync knowledge base and notes
- **Multi-language Support** - Real-time translation and teaching

## 🏗️ Architecture

### Database (Supabase)
- **PostgreSQL** with advanced indexing and RLS policies
- **Real-time subscriptions** for collaborative features
- **File storage** for media and documents
- **Edge functions** for serverless processing

### API (Vercel)
- **Serverless functions** for scalable performance
- **Edge caching** for optimal response times
- **Rate limiting** and security measures
- **Comprehensive error handling**

## 📊 Database Schema

### Core Tables
- `users` - User profiles and authentication
- `learning_paths` - Personalized learning roadmaps
- `knowledge_nodes` - Knowledge graph structure
- `lessons` - Educational content and materials
- `quizzes` - Assessment and testing system
- `study_rooms` - Collaborative learning spaces
- `career_profiles` - Career guidance and assessment
- `homework_submissions` - AI feedback system
- `integrations` - External tool connections

### Key Features
- **Row Level Security (RLS)** - Data protection and privacy
- **Real-time subscriptions** - Live updates and collaboration
- **Advanced indexing** - Optimized query performance
- **Automated triggers** - Data consistency and updates

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account
- OpenAI API key

### Environment Variables
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Optional Integrations
GOOGLE_CLOUD_API_KEY=your_google_cloud_key
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region
```

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/ai-tutoring-app-backend.git
cd ai-tutoring-app-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Deploy to Vercel
npm run deploy
```

### Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema-complete.sql`
3. Configure RLS policies
4. Set up file storage buckets
5. Configure real-time subscriptions

## 📚 API Endpoints

### AI Features
- `POST /api/ai/chat` - AI chat interactions
- `POST /api/ai/voice` - Voice processing and TTS
- `POST /api/ai/emotion` - Emotion recognition
- `POST /api/ai/feedback` - Homework and essay feedback
- `POST /api/ai/quiz-generate` - Quiz generation
- `POST /api/ai/career-advice` - Career guidance

### Study Rooms
- `GET /api/study-rooms` - List study rooms
- `POST /api/study-rooms` - Create study room
- `GET /api/study-rooms/[id]` - Get room details
- `POST /api/study-rooms/[id]/join` - Join room
- `POST /api/study-rooms/[id]/leave` - Leave room
- `GET /api/study-rooms/[id]/messages` - Get messages
- `POST /api/study-rooms/[id]/messages` - Send message

### Learning Management
- `GET /api/lessons` - List lessons
- `POST /api/lessons` - Create lesson
- `GET /api/quizzes` - List quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/progress/[userId]` - User progress

### Integrations
- `GET /api/integrations` - List integrations
- `POST /api/integrations` - Connect integration
- `POST /api/export` - Export data
- `POST /api/import` - Import data

## 🔒 Security Features

### Authentication
- Supabase Auth with JWT tokens
- Social login (Google, GitHub, Facebook)
- Password reset and email verification
- Session management

### Data Protection
- Row Level Security (RLS) policies
- API rate limiting
- Input validation and sanitization
- CORS configuration
- Helmet security headers

### Privacy
- GDPR compliant data handling
- User data encryption
- Secure file storage
- Audit logging

## 📈 Performance & Monitoring

### Optimization
- Database query optimization
- Edge caching with Vercel
- Image and file compression
- Lazy loading and pagination

### Monitoring
- Error tracking and logging
- Performance metrics
- User analytics
- System health checks

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 📖 Documentation

### API Documentation
- Comprehensive endpoint documentation
- Request/response examples
- Error code reference
- Authentication guide

### Database Documentation
- Schema relationships
- Index optimization
- RLS policy guide
- Migration procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs.ai-tutoring-app.com](https://docs.ai-tutoring-app.com)
- Issues: [GitHub Issues](https://github.com/your-org/ai-tutoring-app-backend/issues)
- Email: support@ai-tutoring-app.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core AI features
- ✅ Collaborative study rooms
- ✅ Basic integrations

### Phase 2 (Next)
- 🔄 Advanced analytics
- 🔄 Mobile app support
- 🔄 Offline capabilities

### Phase 3 (Future)
- 📋 AR/VR integration
- 📋 Advanced AI models
- 📋 Enterprise features

---

**Built with ❤️ for the future of education**