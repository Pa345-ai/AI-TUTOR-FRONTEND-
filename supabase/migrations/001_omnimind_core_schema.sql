-- OmniMind Super-Intelligent AI Backend Database Schema
-- Complete schema for next-generation AI tutor platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE,
    learning_goals TEXT[],
    preferred_languages TEXT[] DEFAULT ARRAY['en'],
    timezone VARCHAR(50) DEFAULT 'UTC',
    learning_style VARCHAR(50) DEFAULT 'visual', -- visual, auditory, kinesthetic, reading
    difficulty_preference VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard, adaptive
    ai_personality_preference VARCHAR(50) DEFAULT 'friendly', -- socratic, friendly, exam, motivational
    privacy_settings JSONB DEFAULT '{"data_sharing": false, "analytics": true}',
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free, premium, enterprise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Learning Paths Table
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    estimated_duration_hours INTEGER DEFAULT 0,
    current_progress DECIMAL(5,2) DEFAULT 0.0, -- 0-100%
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed, abandoned
    ai_generated BOOLEAN DEFAULT FALSE,
    learning_objectives TEXT[],
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Lessons Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    lesson_type VARCHAR(50) NOT NULL, -- video, text, interactive, quiz, project
    duration_minutes INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) NOT NULL,
    order_index INTEGER NOT NULL,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    ai_generated BOOLEAN DEFAULT FALSE,
    content_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. AI Sessions Table
CREATE TABLE ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- tutoring, quiz, feedback, general
    subject VARCHAR(100),
    ai_personality VARCHAR(50) DEFAULT 'friendly',
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    confidence_score DECIMAL(5,2), -- 0-100
    emotional_tone VARCHAR(50), -- happy, frustrated, confused, excited
    learning_objective VARCHAR(255),
    context_data JSONB DEFAULT '{}'::jsonb,
    session_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Progress Tracking Table
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    progress_type VARCHAR(50) NOT NULL, -- lesson_completion, quiz_score, time_spent
    value DECIMAL(10,2) NOT NULL,
    max_value DECIMAL(10,2),
    percentage DECIMAL(5,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. Knowledge Graphs Table
CREATE TABLE knowledge_graphs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    mastery_level DECIMAL(5,2) DEFAULT 0.0, -- 0-100
    confidence_score DECIMAL(5,2) DEFAULT 0.0, -- 0-100
    last_practiced TIMESTAMP WITH TIME ZONE,
    practice_count INTEGER DEFAULT 0,
    strengths TEXT[],
    weaknesses TEXT[],
    related_topics TEXT[],
    ai_insights JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Tutor Personas Table
CREATE TABLE tutor_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    personality_type VARCHAR(50) NOT NULL, -- socratic, friendly, exam, motivational
    description TEXT,
    voice_characteristics JSONB DEFAULT '{}'::jsonb,
    teaching_style JSONB DEFAULT '{}'::jsonb,
    response_templates JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. Quizzes Table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quiz_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, fill_blank, essay
    questions JSONB NOT NULL,
    time_limit_minutes INTEGER,
    passing_score DECIMAL(5,2) DEFAULT 70.0,
    difficulty_level VARCHAR(20) NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 9. Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score DECIMAL(5,2),
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    feedback JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 10. Flashcards Table
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    next_review_date TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 11. Gamification Table
CREATE TABLE gamification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    streaks JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '{}'::jsonb,
    leaderboard_position INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 12. VR Environments Table
CREATE TABLE mock_vr_environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    environment_type VARCHAR(100) NOT NULL, -- classroom, lab, historical, space
    description TEXT,
    vr_data JSONB NOT NULL, -- 3D environment data
    ai_avatars JSONB DEFAULT '{}'::jsonb,
    interactive_objects JSONB DEFAULT '{}'::jsonb,
    physics_settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 13. Cognitive Twins Table
CREATE TABLE cognitive_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_style_profile JSONB NOT NULL,
    knowledge_graph_vector VECTOR(1536), -- OpenAI embedding dimension
    learning_patterns JSONB DEFAULT '{}'::jsonb,
    prediction_models JSONB DEFAULT '{}'::jsonb,
    memory_retention_curve JSONB DEFAULT '{}'::jsonb,
    optimal_learning_times JSONB DEFAULT '{}'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 14. Developer Apps Table
CREATE TABLE developer_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_name VARCHAR(255) NOT NULL,
    description TEXT,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 15. Tokens Table (Learn-to-Earn)
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(50) NOT NULL, -- OMNI, SKILL, ACHIEVEMENT, PARTICIPATION
    amount DECIMAL(18,8) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- earn, spend, transfer, reward
    source VARCHAR(100) NOT NULL, -- lesson_completion, quiz_perfect, streak_bonus
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 16. Audit Logs Table (Ethical AI)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    ai_model VARCHAR(100),
    input_data JSONB,
    output_data JSONB,
    reasoning_steps JSONB,
    confidence_score DECIMAL(5,2),
    bias_detection JSONB DEFAULT '{}'::jsonb,
    fairness_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 17. Meta Learning Table
CREATE TABLE meta_learning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interaction_id UUID NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    user_feedback JSONB,
    ai_performance_metrics JSONB,
    teaching_effectiveness_score DECIMAL(5,2),
    improvement_suggestions JSONB,
    global_learning_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 18. Cross-Domain Applications Table
CREATE TABLE cross_domain_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_domain VARCHAR(50) NOT NULL, -- health, code, business
    session_data JSONB NOT NULL,
    ai_insights JSONB DEFAULT '{}'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_subject ON learning_paths(subject);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);

CREATE INDEX idx_lessons_learning_path_id ON lessons(learning_path_id);
CREATE INDEX idx_lessons_lesson_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty_level);

CREATE INDEX idx_ai_sessions_user_id ON ai_sessions(user_id);
CREATE INDEX idx_ai_sessions_session_type ON ai_sessions(session_type);
CREATE INDEX idx_ai_sessions_created_at ON ai_sessions(created_at);

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_learning_path_id ON progress(learning_path_id);
CREATE INDEX idx_progress_timestamp ON progress(timestamp);

CREATE INDEX idx_knowledge_graphs_user_id ON knowledge_graphs(user_id);
CREATE INDEX idx_knowledge_graphs_subject ON knowledge_graphs(subject);
CREATE INDEX idx_knowledge_graphs_mastery ON knowledge_graphs(mastery_level);

CREATE INDEX idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX idx_quizzes_difficulty ON quizzes(difficulty_level);

CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_subject ON flashcards(subject);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review_date);

CREATE INDEX idx_gamification_user_id ON gamification(user_id);
CREATE INDEX idx_gamification_xp ON gamification(xp_points);

CREATE INDEX idx_cognitive_twins_user_id ON cognitive_twins(user_id);
CREATE INDEX idx_cognitive_twins_updated ON cognitive_twins(last_updated);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_type ON tokens(token_type);
CREATE INDEX idx_tokens_created_at ON tokens(created_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_vr_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_domain_apps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view their own learning paths" ON learning_paths
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view lessons in their paths" ON lessons
    FOR SELECT USING (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own AI sessions" ON ai_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own knowledge graphs" ON knowledge_graphs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public tutor personas" ON tutor_personas
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can view quizzes in their lessons" ON quizzes
    FOR SELECT USING (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own flashcards" ON flashcards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own gamification" ON gamification
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public VR environments" ON mock_vr_environments
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can view their own cognitive twins" ON cognitive_twins
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own developer apps" ON developer_apps
    FOR ALL USING (auth.uid() = developer_id);

CREATE POLICY "Users can view their own tokens" ON tokens
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own meta learning" ON meta_learning
    FOR ALL USING (true); -- Global learning insights

CREATE POLICY "Users can view their own cross-domain apps" ON cross_domain_apps
    FOR ALL USING (auth.uid() = user_id);

-- Functions for core operations
CREATE OR REPLACE FUNCTION update_user_progress(
    p_user_id UUID,
    p_learning_path_id UUID,
    p_lesson_id UUID,
    p_progress_type VARCHAR(50),
    p_value DECIMAL(10,2),
    p_max_value DECIMAL(10,2) DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    progress_percentage DECIMAL(5,2);
BEGIN
    -- Calculate percentage if max_value provided
    IF p_max_value IS NOT NULL AND p_max_value > 0 THEN
        progress_percentage := (p_value / p_max_value) * 100;
    ELSE
        progress_percentage := NULL;
    END IF;
    
    -- Insert progress record
    INSERT INTO progress (
        user_id, learning_path_id, lesson_id, progress_type, 
        value, max_value, percentage
    ) VALUES (
        p_user_id, p_learning_path_id, p_lesson_id, p_progress_type,
        p_value, p_max_value, progress_percentage
    );
    
    -- Update learning path progress if lesson completed
    IF p_progress_type = 'lesson_completion' AND progress_percentage >= 100 THEN
        UPDATE learning_paths 
        SET current_progress = (
            SELECT AVG(percentage) 
            FROM progress 
            WHERE learning_path_id = p_learning_path_id 
            AND progress_type = 'lesson_completion'
        )
        WHERE id = p_learning_path_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_user_xp(
    p_user_id UUID,
    p_activity_type VARCHAR(50),
    p_difficulty_level VARCHAR(20),
    p_performance_score DECIMAL(5,2)
) RETURNS INTEGER AS $$
DECLARE
    base_xp INTEGER;
    difficulty_multiplier DECIMAL(3,2);
    performance_multiplier DECIMAL(3,2);
    total_xp INTEGER;
BEGIN
    -- Base XP by activity type
    base_xp := CASE p_activity_type
        WHEN 'lesson_completion' THEN 10
        WHEN 'quiz_completion' THEN 15
        WHEN 'perfect_quiz' THEN 25
        WHEN 'streak_bonus' THEN 5
        WHEN 'daily_login' THEN 2
        ELSE 5
    END;
    
    -- Difficulty multiplier
    difficulty_multiplier := CASE p_difficulty_level
        WHEN 'easy' THEN 1.0
        WHEN 'medium' THEN 1.5
        WHEN 'hard' THEN 2.0
        WHEN 'expert' THEN 2.5
        ELSE 1.0
    END;
    
    -- Performance multiplier
    performance_multiplier := CASE 
        WHEN p_performance_score >= 90 THEN 1.5
        WHEN p_performance_score >= 80 THEN 1.2
        WHEN p_performance_score >= 70 THEN 1.0
        WHEN p_performance_score >= 60 THEN 0.8
        ELSE 0.5
    END;
    
    total_xp := ROUND(base_xp * difficulty_multiplier * performance_multiplier);
    
    -- Update user's XP
    INSERT INTO gamification (user_id, xp_points)
    VALUES (p_user_id, total_xp)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        xp_points = gamification.xp_points + total_xp,
        updated_at = NOW();
    
    RETURN total_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_learning_insights(
    p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    insights JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_lessons_completed', (
            SELECT COUNT(*) FROM progress 
            WHERE user_id = p_user_id 
            AND progress_type = 'lesson_completion' 
            AND percentage >= 100
        ),
        'average_quiz_score', (
            SELECT AVG(score) FROM quiz_attempts 
            WHERE user_id = p_user_id
        ),
        'strongest_subject', (
            SELECT subject FROM knowledge_graphs 
            WHERE user_id = p_user_id 
            ORDER BY mastery_level DESC 
            LIMIT 1
        ),
        'learning_streak_days', (
            SELECT COALESCE((streaks->>'current_streak')::INTEGER, 0) 
            FROM gamification 
            WHERE user_id = p_user_id
        ),
        'total_xp', (
            SELECT COALESCE(xp_points, 0) 
            FROM gamification 
            WHERE user_id = p_user_id
        )
    ) INTO insights;
    
    RETURN insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
