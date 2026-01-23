-- =====================================================
-- AI TUTORING APP - COMPLETE SUPABASE SCHEMA
-- Premium Quality Backend Infrastructure
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =====================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
    grade_level TEXT,
    school TEXT,
    language_preference TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- User profiles for detailed information
CREATE TABLE public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    interests TEXT[],
    learning_goals TEXT[],
    study_preferences JSONB DEFAULT '{}',
    accessibility_settings JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. LEARNING ENGINE & PERSONALIZATION
-- =====================================================

-- Learning paths
CREATE TABLE public.learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_duration INTEGER, -- in minutes
    is_adaptive BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Learning objectives
CREATE TABLE public.learning_objectives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge graph nodes
CREATE TABLE public.knowledge_nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    prerequisites UUID[] DEFAULT '{}',
    learning_outcomes TEXT[],
    content_type TEXT CHECK (content_type IN ('concept', 'skill', 'fact', 'procedure')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User knowledge mastery
CREATE TABLE public.user_knowledge_mastery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    knowledge_node_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    mastery_level DECIMAL(3,2) DEFAULT 0, -- 0.0 to 1.0
    confidence_score DECIMAL(3,2) DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    practice_count INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, knowledge_node_id)
);

-- =====================================================
-- 3. LESSONS & CONTENT
-- =====================================================

-- Lessons
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    content_type TEXT CHECK (content_type IN ('text', 'video', 'interactive', 'quiz', 'assignment')),
    content JSONB NOT NULL,
    learning_objectives TEXT[],
    prerequisites TEXT[],
    estimated_duration INTEGER, -- in minutes
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Lesson sessions (user progress)
CREATE TABLE public.lesson_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    is_completed BOOLEAN DEFAULT FALSE,
    score DECIMAL(5,2),
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. QUIZZES & ASSESSMENTS
-- =====================================================

-- Quizzes
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    question_count INTEGER NOT NULL,
    time_limit INTEGER, -- in minutes
    total_points INTEGER NOT NULL,
    passing_score DECIMAL(5,2),
    is_published BOOLEAN DEFAULT FALSE,
    is_adaptive BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions
CREATE TABLE public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN (
        'multiple_choice', 'true_false', 'fill_blank', 'essay', 'matching', 
        'ordering', 'drag_drop', 'hotspot', 'cloze', 'numerical', 'short_answer',
        'code_completion', 'diagram_labeling', 'audio_response', 'video_analysis',
        'simulation', 'case_study', 'scenario', 'problem_solving', 'critical_thinking'
    )),
    options JSONB, -- for multiple choice, matching, etc.
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    bloom_taxonomy_level TEXT CHECK (bloom_taxonomy_level IN ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create')),
    media_url TEXT,
    hints TEXT[],
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2),
    total_points INTEGER,
    percentage DECIMAL(5,2),
    time_spent INTEGER, -- in seconds
    is_completed BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. COLLABORATIVE STUDY ROOMS
-- =====================================================

-- Study rooms
CREATE TABLE public.study_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'scheduled')),
    scheduled_start_at TIMESTAMP WITH TIME ZONE,
    scheduled_end_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    ai_moderator_settings JSONB DEFAULT '{}'
);

-- Study room participants
CREATE TABLE public.study_room_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'participant' CHECK (role IN ('host', 'moderator', 'participant')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT TRUE,
    is_muted BOOLEAN DEFAULT FALSE,
    is_video_on BOOLEAN DEFAULT FALSE,
    is_screen_sharing BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    UNIQUE(room_id, user_id)
);

-- Study room messages
CREATE TABLE public.study_room_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'ai', 'announcement')),
    attachments JSONB DEFAULT '[]',
    reactions JSONB DEFAULT '{}',
    mentions UUID[] DEFAULT '{}',
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study room resources
CREATE TABLE public.study_room_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. AI CAREER & GOAL ADVISOR
-- =====================================================

-- Career profiles
CREATE TABLE public.career_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('technology', 'healthcare', 'business', 'education', 'arts', 'science', 'engineering', 'law', 'finance', 'other')),
    education JSONB DEFAULT '{}',
    experience JSONB DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    values TEXT[] DEFAULT '{}',
    personality JSONB DEFAULT '{}',
    goals JSONB DEFAULT '{}',
    assessment JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career paths
CREATE TABLE public.career_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_min INTEGER,
    duration_max INTEGER,
    requirements JSONB DEFAULT '{}',
    salary_info JSONB DEFAULT '{}',
    job_market JSONB DEFAULT '{}',
    steps JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    universities JSONB DEFAULT '[]',
    companies JSONB DEFAULT '[]',
    success_rate DECIMAL(5,2),
    satisfaction DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User goals
CREATE TABLE public.user_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('career', 'education', 'personal', 'financial', 'health', 'relationship', 'skill', 'other')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'cancelled')),
    deadline TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    milestones JSONB DEFAULT '[]',
    resources TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. HOMEWORK & ESSAY FEEDBACK
-- =====================================================

-- Homework submissions
CREATE TABLE public.homework_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    submission_type TEXT CHECK (submission_type IN ('essay', 'homework', 'assignment', 'project', 'report', 'presentation', 'lab', 'quiz', 'exam', 'other')),
    content TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'reviewed', 'graded', 'returned')),
    rubric JSONB DEFAULT '{}',
    ai_feedback JSONB DEFAULT '{}',
    grade JSONB DEFAULT '{}',
    analytics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback templates
CREATE TABLE public.feedback_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    criteria JSONB DEFAULT '[]',
    default_comments JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. REAL TOOLS INTEGRATION
-- =====================================================

-- Integrations
CREATE TABLE public.integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('productivity', 'education', 'communication', 'storage', 'social', 'development', 'design', 'analytics', 'other')),
    integration_type TEXT NOT NULL,
    is_connected BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'disabled' CHECK (sync_status IN ('success', 'error', 'pending', 'disabled')),
    permissions TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    api_version TEXT,
    rate_limit JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Export jobs
CREATE TABLE public.export_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    format TEXT CHECK (format IN ('pdf', 'docx', 'xlsx', 'csv', 'json', 'html', 'md', 'txt')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    download_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Import jobs
CREATE TABLE public.import_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    format TEXT CHECK (format IN ('pdf', 'docx', 'xlsx', 'csv', 'json', 'html', 'md', 'txt')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 9. AI FEATURES & EMOTION RECOGNITION
-- =====================================================

-- AI interactions
CREATE TABLE public.ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID,
    interaction_type TEXT CHECK (interaction_type IN ('chat', 'voice', 'video', 'drawing', 'quiz', 'lesson')),
    input_text TEXT,
    input_audio_url TEXT,
    input_video_url TEXT,
    ai_response TEXT,
    ai_response_audio_url TEXT,
    ai_response_video_url TEXT,
    emotion_detected TEXT,
    confidence_score DECIMAL(3,2),
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emotion tracking
CREATE TABLE public.emotion_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID,
    emotion_type TEXT NOT NULL,
    intensity DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
    confidence DECIMAL(3,2) NOT NULL,
    facial_landmarks JSONB DEFAULT '{}',
    micro_expressions JSONB DEFAULT '{}',
    learning_state TEXT,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. PROGRESS & ANALYTICS
-- =====================================================

-- User progress
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    mastery_level DECIMAL(3,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_studied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject, topic)
);

-- Learning streaks
CREATE TABLE public.learning_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    freeze_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('system', 'achievement', 'reminder', 'social', 'learning')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 11. GAMIFICATION & ACHIEVEMENTS
-- =====================================================

-- Achievements
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    category TEXT CHECK (category IN ('learning', 'streak', 'social', 'special')),
    requirements JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress JSONB DEFAULT '{}',
    UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE public.leaderboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE public.leaderboard_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    leaderboard_id UUID REFERENCES public.leaderboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    rank INTEGER,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(leaderboard_id, user_id, period_start)
);

-- =====================================================
-- 12. FILE STORAGE & MEDIA
-- =====================================================

-- File uploads
CREATE TABLE public.file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_last_active ON public.users(last_active_at);

-- Learning indexes
CREATE INDEX idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX idx_learning_paths_subject ON public.learning_paths(subject);
CREATE INDEX idx_knowledge_nodes_subject_topic ON public.knowledge_nodes(subject, topic);
CREATE INDEX idx_user_knowledge_mastery_user_id ON public.user_knowledge_mastery(user_id);
CREATE INDEX idx_user_knowledge_mastery_mastery_level ON public.user_knowledge_mastery(mastery_level);

-- Lesson indexes
CREATE INDEX idx_lessons_subject_topic ON public.lessons(subject, topic);
CREATE INDEX idx_lessons_created_by ON public.lessons(created_by);
CREATE INDEX idx_lesson_sessions_user_id ON public.lesson_sessions(user_id);
CREATE INDEX idx_lesson_sessions_lesson_id ON public.lesson_sessions(lesson_id);

-- Quiz indexes
CREATE INDEX idx_quizzes_subject_topic ON public.quizzes(subject, topic);
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);

-- Study room indexes
CREATE INDEX idx_study_rooms_created_by ON public.study_rooms(created_by);
CREATE INDEX idx_study_rooms_status ON public.study_rooms(status);
CREATE INDEX idx_study_room_participants_room_id ON public.study_room_participants(room_id);
CREATE INDEX idx_study_room_participants_user_id ON public.study_room_participants(user_id);
CREATE INDEX idx_study_room_messages_room_id ON public.study_room_messages(room_id);
CREATE INDEX idx_study_room_messages_created_at ON public.study_room_messages(created_at);

-- Career indexes
CREATE INDEX idx_career_profiles_user_id ON public.career_profiles(user_id);
CREATE INDEX idx_career_paths_category ON public.career_paths(category);
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_status ON public.user_goals(status);

-- Homework indexes
CREATE INDEX idx_homework_submissions_user_id ON public.homework_submissions(user_id);
CREATE INDEX idx_homework_submissions_subject ON public.homework_submissions(subject);
CREATE INDEX idx_homework_submissions_status ON public.homework_submissions(status);

-- Integration indexes
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX idx_integrations_type ON public.integrations(integration_type);
CREATE INDEX idx_export_jobs_user_id ON public.export_jobs(user_id);
CREATE INDEX idx_import_jobs_user_id ON public.import_jobs(user_id);

-- AI interaction indexes
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_created_at ON public.ai_interactions(created_at);
CREATE INDEX idx_emotion_tracking_user_id ON public.emotion_tracking(user_id);
CREATE INDEX idx_emotion_tracking_emotion_type ON public.emotion_tracking(emotion_type);

-- Progress indexes
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_subject_topic ON public.user_progress(subject, topic);
CREATE INDEX idx_learning_streaks_user_id ON public.learning_streaks(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Achievement indexes
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX idx_leaderboard_entries_leaderboard_id ON public.leaderboard_entries(leaderboard_id);
CREATE INDEX idx_leaderboard_entries_user_id ON public.leaderboard_entries(user_id);
CREATE INDEX idx_leaderboard_entries_score ON public.leaderboard_entries(score);

-- File indexes
CREATE INDEX idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX idx_file_uploads_file_type ON public.file_uploads(file_type);

-- =====================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_knowledge_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Learning paths policies
CREATE POLICY "Users can view own learning paths" ON public.learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning paths" ON public.learning_paths FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own learning paths" ON public.learning_paths FOR DELETE USING (auth.uid() = user_id);

-- Study rooms policies (users can view rooms they're in)
CREATE POLICY "Users can view study rooms they're in" ON public.study_rooms FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() IN (SELECT user_id FROM public.study_room_participants WHERE room_id = id)
);

-- Add more RLS policies as needed...

-- =====================================================
-- 15. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_nodes_updated_at BEFORE UPDATE ON public.knowledge_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_knowledge_mastery_updated_at BEFORE UPDATE ON public.user_knowledge_mastery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_sessions_updated_at BEFORE UPDATE ON public.lesson_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_rooms_updated_at BEFORE UPDATE ON public.study_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_room_messages_updated_at BEFORE UPDATE ON public.study_room_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_profiles_updated_at BEFORE UPDATE ON public.career_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_paths_updated_at BEFORE UPDATE ON public.career_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homework_submissions_updated_at BEFORE UPDATE ON public.homework_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_templates_updated_at BEFORE UPDATE ON public.feedback_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON public.leaderboard_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user progress
CREATE OR REPLACE FUNCTION calculate_user_progress(p_user_id UUID, p_subject TEXT, p_topic TEXT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage DECIMAL(5,2);
BEGIN
    -- Get total lessons for subject/topic
    SELECT COUNT(*) INTO total_lessons
    FROM public.lessons
    WHERE subject = p_subject AND topic = p_topic AND is_published = TRUE;
    
    -- Get completed lessons for user
    SELECT COUNT(*) INTO completed_lessons
    FROM public.lesson_sessions ls
    JOIN public.lessons l ON ls.lesson_id = l.id
    WHERE ls.user_id = p_user_id 
    AND l.subject = p_subject 
    AND l.topic = p_topic 
    AND ls.is_completed = TRUE;
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        progress_percentage := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- Function to update study room participant count
CREATE OR REPLACE FUNCTION update_study_room_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.study_rooms 
        SET current_participants = current_participants + 1,
            last_activity_at = NOW()
        WHERE id = NEW.room_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.study_rooms 
        SET current_participants = current_participants - 1,
            last_activity_at = NOW()
        WHERE id = OLD.room_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update study room participant count
CREATE TRIGGER update_study_room_participant_count_trigger
    AFTER INSERT OR DELETE ON public.study_room_participants
    FOR EACH ROW EXECUTE FUNCTION update_study_room_participant_count();

-- =====================================================
-- 16. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample achievements
INSERT INTO public.achievements (name, description, category, requirements, points, rarity) VALUES
('First Steps', 'Complete your first lesson', 'learning', '{"lessons_completed": 1}', 10, 'common'),
('Streak Master', 'Maintain a 7-day learning streak', 'streak', '{"streak_days": 7}', 50, 'uncommon'),
('Quiz Champion', 'Score 100% on 5 quizzes', 'learning', '{"perfect_quizzes": 5}', 100, 'rare'),
('Social Learner', 'Join 3 study rooms', 'social', '{"study_rooms_joined": 3}', 25, 'common'),
('Knowledge Seeker', 'Master 10 knowledge nodes', 'learning', '{"mastered_nodes": 10}', 200, 'epic');

-- Insert sample knowledge nodes
INSERT INTO public.knowledge_nodes (title, description, subject, topic, difficulty_level, content_type, learning_outcomes) VALUES
('Basic Algebra', 'Introduction to algebraic expressions and equations', 'Mathematics', 'Algebra', 'beginner', 'concept', '{"Solve linear equations", "Simplify expressions", "Graph linear functions"}'),
('Photosynthesis', 'Process by which plants convert light energy to chemical energy', 'Biology', 'Plant Biology', 'intermediate', 'concept', '{"Explain photosynthesis process", "Identify reactants and products", "Describe energy conversion"}'),
('World War II', 'Major global conflict from 1939-1945', 'History', 'Modern History', 'intermediate', 'fact', '{"Identify key events", "Understand causes and effects", "Analyze historical significance"}');

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;