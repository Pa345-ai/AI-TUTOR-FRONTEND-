-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    learning_level TEXT DEFAULT 'intermediate',
    learning_style TEXT DEFAULT 'visual',
    age INTEGER,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning paths table
CREATE TABLE public.learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_duration INTEGER, -- in minutes
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    lesson_type TEXT DEFAULT 'interactive',
    order_index INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    questions JSONB NOT NULL,
    time_limit INTEGER, -- in seconds
    is_completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    total_questions INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study rooms table
CREATE TABLE public.study_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    max_participants INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study room participants table
CREATE TABLE public.study_room_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    study_room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(study_room_id, user_id)
);

-- Create learning progress table
CREATE TABLE public.learning_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    points INTEGER DEFAULT 0,
    category TEXT,
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create AI interactions table
CREATE TABLE public.ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    input_data JSONB,
    ai_response JSONB,
    emotion_detected TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI summaries table
CREATE TABLE public.ai_summaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    subject TEXT,
    summary_type TEXT,
    summary_data JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI lessons table
CREATE TABLE public.ai_lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    lesson_type TEXT,
    learning_objectives TEXT,
    lesson_data JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career advice table
CREATE TABLE public.career_advice (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interests TEXT,
    skills TEXT,
    goals TEXT,
    current_level TEXT,
    experience TEXT,
    career_analysis JSONB NOT NULL,
    action_plan JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essay feedback table
CREATE TABLE public.essay_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    essay_text TEXT NOT NULL,
    essay_type TEXT,
    subject TEXT,
    rubric_criteria TEXT,
    feedback_data JSONB NOT NULL,
    improvement_plan JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create multilang translations table
CREATE TABLE public.multilang_translations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    source_language TEXT,
    target_language TEXT,
    context TEXT,
    translation_type TEXT,
    translation_data JSONB NOT NULL,
    grammar_analysis JSONB NOT NULL,
    vocabulary JSONB NOT NULL,
    learning_content JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI ecosystem table
CREATE TABLE public.ai_ecosystem (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    integration_type TEXT,
    app_data JSONB,
    ecosystem_management JSONB NOT NULL,
    development_guidelines JSONB NOT NULL,
    monitoring_analytics JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user tokens table
CREATE TABLE public.user_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create token transactions table
CREATE TABLE public.token_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    learning_activity TEXT,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transparency audits table
CREATE TABLE public.transparency_audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    audit_type TEXT NOT NULL,
    ai_decision JSONB,
    context TEXT,
    fairness_criteria TEXT,
    transparency_report JSONB NOT NULL,
    ethical_compliance JSONB NOT NULL,
    risk_assessment JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX idx_lessons_learning_path_id ON public.lessons(learning_path_id);
CREATE INDEX idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_study_room_participants_user_id ON public.study_room_participants(user_id);
CREATE INDEX idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_created_at ON public.ai_interactions(created_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multilang_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ecosystem ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_audits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own learning paths" ON public.learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning paths" ON public.learning_paths FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own learning paths" ON public.learning_paths FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view lessons in their learning paths" ON public.lessons FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.learning_paths WHERE id = learning_path_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own quizzes" ON public.quizzes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all study rooms" ON public.study_rooms FOR SELECT USING (true);
CREATE POLICY "Users can create study rooms" ON public.study_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view study room participants" ON public.study_room_participants FOR SELECT USING (true);
CREATE POLICY "Users can join study rooms" ON public.study_room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own learning progress" ON public.learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning progress" ON public.learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning progress" ON public.learning_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all achievements" ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Users can view own user achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for AI-related tables
CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI interactions" ON public.ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI summaries" ON public.ai_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI summaries" ON public.ai_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI lessons" ON public.ai_lessons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI lessons" ON public.ai_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own career advice" ON public.career_advice FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career advice" ON public.career_advice FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own essay feedback" ON public.essay_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own essay feedback" ON public.essay_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own multilang translations" ON public.multilang_translations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own multilang translations" ON public.multilang_translations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI ecosystem" ON public.ai_ecosystem FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI ecosystem" ON public.ai_ecosystem FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own user tokens" ON public.user_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user tokens" ON public.user_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user tokens" ON public.user_tokens FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own token transactions" ON public.token_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own token transactions" ON public.token_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transparency audits" ON public.transparency_audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transparency audits" ON public.transparency_audits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON public.user_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();