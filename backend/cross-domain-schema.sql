-- Cross-Domain OmniMind Applications - Database Schema
-- Extending OmniMind beyond education into health, coding, and business domains

-- =====================================================
-- CROSS-DOMAIN OMNIMIND TABLES
-- =====================================================

-- OmniMind Health - Personalized health & emotional therapy tutor
CREATE TABLE IF NOT EXISTS omnimind_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    health_profile JSONB NOT NULL DEFAULT '{}',
    emotional_state JSONB NOT NULL DEFAULT '{}',
    therapy_sessions JSONB NOT NULL DEFAULT '[]',
    wellness_goals JSONB NOT NULL DEFAULT '[]',
    health_metrics JSONB NOT NULL DEFAULT '{}',
    medication_tracking JSONB NOT NULL DEFAULT '[]',
    mood_patterns JSONB NOT NULL DEFAULT '{}',
    stress_levels JSONB NOT NULL DEFAULT '{}',
    sleep_quality JSONB NOT NULL DEFAULT '{}',
    exercise_routine JSONB NOT NULL DEFAULT '{}',
    nutrition_tracking JSONB NOT NULL DEFAULT '{}',
    mental_health_score INTEGER DEFAULT 0,
    physical_health_score INTEGER DEFAULT 0,
    emotional_wellness_score INTEGER DEFAULT 0,
    overall_health_score INTEGER DEFAULT 0,
    ai_insights JSONB NOT NULL DEFAULT '{}',
    recommendations JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    privacy_level VARCHAR(20) DEFAULT 'private' CHECK (privacy_level IN ('private', 'confidential', 'public')),
    data_retention_days INTEGER DEFAULT 365
);

-- Health Therapy Sessions
CREATE TABLE IF NOT EXISTS health_therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_id UUID REFERENCES omnimind_health(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- 'emotional_support', 'stress_management', 'anxiety_therapy', 'depression_support', 'mindfulness', 'counseling'
    session_title VARCHAR(255) NOT NULL,
    session_description TEXT,
    duration_minutes INTEGER NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    emotional_state_before JSONB NOT NULL DEFAULT '{}',
    emotional_state_after JSONB NOT NULL DEFAULT '{}',
    session_notes TEXT,
    ai_analysis JSONB NOT NULL DEFAULT '{}',
    effectiveness_score INTEGER DEFAULT 0,
    user_feedback TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    next_session_recommended TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Wellness Goals
CREATE TABLE IF NOT EXISTS health_wellness_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_id UUID REFERENCES omnimind_health(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- 'mental_health', 'physical_fitness', 'emotional_wellness', 'stress_reduction', 'sleep_improvement', 'nutrition'
    goal_title VARCHAR(255) NOT NULL,
    goal_description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    target_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    ai_recommendations JSONB NOT NULL DEFAULT '[]',
    milestone_achievements JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OmniMind Code - AI coding mentor for developers
CREATE TABLE IF NOT EXISTS omnimind_code (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    developer_profile JSONB NOT NULL DEFAULT '{}',
    coding_skills JSONB NOT NULL DEFAULT '{}',
    programming_languages JSONB NOT NULL DEFAULT '[]',
    frameworks JSONB NOT NULL DEFAULT '[]',
    projects JSONB NOT NULL DEFAULT '[]',
    code_reviews JSONB NOT NULL DEFAULT '[]',
    learning_path JSONB NOT NULL DEFAULT '[]',
    coding_challenges JSONB NOT NULL DEFAULT '[]',
    mentorship_sessions JSONB NOT NULL DEFAULT '[]',
    code_quality_metrics JSONB NOT NULL DEFAULT '{}',
    productivity_metrics JSONB NOT NULL DEFAULT '{}',
    skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    experience_years INTEGER DEFAULT 0,
    github_integration JSONB NOT NULL DEFAULT '{}',
    ai_mentor_personality VARCHAR(50) DEFAULT 'helpful',
    coding_goals JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Code Mentorship Sessions
CREATE TABLE IF NOT EXISTS code_mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID REFERENCES omnimind_code(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- 'code_review', 'debugging', 'architecture_design', 'best_practices', 'algorithm_explanation', 'project_guidance'
    session_title VARCHAR(255) NOT NULL,
    session_description TEXT,
    code_snippet TEXT,
    programming_language VARCHAR(50),
    framework VARCHAR(50),
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 10),
    duration_minutes INTEGER NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ai_feedback JSONB NOT NULL DEFAULT '{}',
    code_improvements JSONB NOT NULL DEFAULT '[]',
    learning_outcomes JSONB NOT NULL DEFAULT '[]',
    skill_improvements JSONB NOT NULL DEFAULT '[]',
    user_rating INTEGER DEFAULT 0 CHECK (user_rating BETWEEN 1 AND 5),
    ai_rating INTEGER DEFAULT 0 CHECK (ai_rating BETWEEN 1 AND 5),
    follow_up_tasks JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code Projects
CREATE TABLE IF NOT EXISTS code_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID REFERENCES omnimind_code(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    project_type VARCHAR(50) NOT NULL, -- 'web_app', 'mobile_app', 'api', 'library', 'game', 'data_science', 'ai_ml', 'blockchain'
    programming_languages JSONB NOT NULL DEFAULT '[]',
    frameworks JSONB NOT NULL DEFAULT '[]',
    technologies JSONB NOT NULL DEFAULT '[]',
    project_status VARCHAR(20) DEFAULT 'planning' CHECK (project_status IN ('planning', 'development', 'testing', 'deployment', 'maintenance', 'completed')),
    complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 10),
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    github_repository VARCHAR(500),
    deployment_url VARCHAR(500),
    ai_guidance JSONB NOT NULL DEFAULT '{}',
    code_quality_score INTEGER DEFAULT 0,
    performance_metrics JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OmniMind Business - Corporate AI training + productivity modules
CREATE TABLE IF NOT EXISTS omnimind_business (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID,
    employee_profile JSONB NOT NULL DEFAULT '{}',
    role VARCHAR(100),
    department VARCHAR(100),
    business_skills JSONB NOT NULL DEFAULT '{}',
    leadership_skills JSONB NOT NULL DEFAULT '{}',
    productivity_metrics JSONB NOT NULL DEFAULT '{}',
    training_modules JSONB NOT NULL DEFAULT '[]',
    performance_reviews JSONB NOT NULL DEFAULT '[]',
    career_goals JSONB NOT NULL DEFAULT '[]',
    team_collaboration JSONB NOT NULL DEFAULT '{}',
    project_management JSONB NOT NULL DEFAULT '{}',
    communication_skills JSONB NOT NULL DEFAULT '{}',
    decision_making JSONB NOT NULL DEFAULT '{}',
    innovation_metrics JSONB NOT NULL DEFAULT '{}',
    business_intelligence JSONB NOT NULL DEFAULT '{}',
    ai_coaching_sessions JSONB NOT NULL DEFAULT '[]',
    productivity_score INTEGER DEFAULT 0,
    leadership_score INTEGER DEFAULT 0,
    collaboration_score INTEGER DEFAULT 0,
    innovation_score INTEGER DEFAULT 0,
    overall_performance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Business Training Modules
CREATE TABLE IF NOT EXISTS business_training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES omnimind_business(id) ON DELETE CASCADE,
    module_type VARCHAR(50) NOT NULL, -- 'leadership', 'productivity', 'communication', 'project_management', 'innovation', 'teamwork', 'decision_making'
    module_title VARCHAR(255) NOT NULL,
    module_description TEXT,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 10),
    estimated_duration_hours INTEGER NOT NULL,
    actual_duration_hours INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    module_status VARCHAR(20) DEFAULT 'not_started' CHECK (module_status IN ('not_started', 'in_progress', 'completed', 'paused')),
    learning_objectives JSONB NOT NULL DEFAULT '[]',
    content_modules JSONB NOT NULL DEFAULT '[]',
    assessments JSONB NOT NULL DEFAULT '[]',
    ai_feedback JSONB NOT NULL DEFAULT '{}',
    skill_improvements JSONB NOT NULL DEFAULT '[]',
    practical_applications JSONB NOT NULL DEFAULT '[]',
    peer_interactions JSONB NOT NULL DEFAULT '[]',
    certification_earned BOOLEAN DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business AI Coaching Sessions
CREATE TABLE IF NOT EXISTS business_ai_coaching (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES omnimind_business(id) ON DELETE CASCADE,
    coaching_type VARCHAR(50) NOT NULL, -- 'leadership_development', 'productivity_optimization', 'communication_skills', 'project_management', 'innovation_coaching', 'team_building'
    session_title VARCHAR(255) NOT NULL,
    session_description TEXT,
    duration_minutes INTEGER NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    coaching_objectives JSONB NOT NULL DEFAULT '[]',
    current_challenges JSONB NOT NULL DEFAULT '[]',
    ai_guidance JSONB NOT NULL DEFAULT '{}',
    action_plan JSONB NOT NULL DEFAULT '[]',
    progress_metrics JSONB NOT NULL DEFAULT '{}',
    skill_development JSONB NOT NULL DEFAULT '[]',
    leadership_insights JSONB NOT NULL DEFAULT '[]',
    productivity_tips JSONB NOT NULL DEFAULT '[]',
    follow_up_actions JSONB NOT NULL DEFAULT '[]',
    effectiveness_rating INTEGER DEFAULT 0 CHECK (effectiveness_rating BETWEEN 1 AND 5),
    user_satisfaction INTEGER DEFAULT 0 CHECK (user_satisfaction BETWEEN 1 AND 5),
    next_session_scheduled TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-Domain Analytics
CREATE TABLE IF NOT EXISTS cross_domain_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(20) NOT NULL CHECK (domain IN ('health', 'code', 'business')),
    domain_id UUID NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'engagement', 'progress', 'satisfaction', 'effectiveness', 'productivity', 'learning'
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(50),
    measurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
    context_data JSONB NOT NULL DEFAULT '{}',
    ai_insights JSONB NOT NULL DEFAULT '{}',
    trends JSONB NOT NULL DEFAULT '{}',
    comparisons JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- OmniMind Health indexes
CREATE INDEX IF NOT EXISTS idx_omnimind_health_user_id ON omnimind_health(user_id);
CREATE INDEX IF NOT EXISTS idx_omnimind_health_active ON omnimind_health(is_active);
CREATE INDEX IF NOT EXISTS idx_health_therapy_sessions_health_id ON health_therapy_sessions(health_id);
CREATE INDEX IF NOT EXISTS idx_health_therapy_sessions_date ON health_therapy_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_health_wellness_goals_health_id ON health_wellness_goals(health_id);
CREATE INDEX IF NOT EXISTS idx_health_wellness_goals_status ON health_wellness_goals(status);

-- OmniMind Code indexes
CREATE INDEX IF NOT EXISTS idx_omnimind_code_user_id ON omnimind_code(user_id);
CREATE INDEX IF NOT EXISTS idx_omnimind_code_active ON omnimind_code(is_active);
CREATE INDEX IF NOT EXISTS idx_code_mentorship_sessions_code_id ON code_mentorship_sessions(code_id);
CREATE INDEX IF NOT EXISTS idx_code_mentorship_sessions_date ON code_mentorship_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_code_projects_code_id ON code_projects(code_id);
CREATE INDEX IF NOT EXISTS idx_code_projects_status ON code_projects(project_status);

-- OmniMind Business indexes
CREATE INDEX IF NOT EXISTS idx_omnimind_business_user_id ON omnimind_business(user_id);
CREATE INDEX IF NOT EXISTS idx_omnimind_business_company_id ON omnimind_business(company_id);
CREATE INDEX IF NOT EXISTS idx_omnimind_business_active ON omnimind_business(is_active);
CREATE INDEX IF NOT EXISTS idx_business_training_modules_business_id ON business_training_modules(business_id);
CREATE INDEX IF NOT EXISTS idx_business_training_modules_status ON business_training_modules(module_status);
CREATE INDEX IF NOT EXISTS idx_business_ai_coaching_business_id ON business_ai_coaching(business_id);
CREATE INDEX IF NOT EXISTS idx_business_ai_coaching_date ON business_ai_coaching(session_date);

-- Cross-Domain Analytics indexes
CREATE INDEX IF NOT EXISTS idx_cross_domain_analytics_user_id ON cross_domain_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_cross_domain_analytics_domain ON cross_domain_analytics(domain);
CREATE INDEX IF NOT EXISTS idx_cross_domain_analytics_date ON cross_domain_analytics(measurement_date);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- OmniMind Health RLS
ALTER TABLE omnimind_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own health data" ON omnimind_health FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health data" ON omnimind_health FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health data" ON omnimind_health FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health data" ON omnimind_health FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE health_therapy_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own therapy sessions" ON health_therapy_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_health WHERE id = health_id AND user_id = auth.uid())
);

ALTER TABLE health_wellness_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wellness goals" ON health_wellness_goals FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_health WHERE id = health_id AND user_id = auth.uid())
);

-- OmniMind Code RLS
ALTER TABLE omnimind_code ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own code data" ON omnimind_code FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own code data" ON omnimind_code FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own code data" ON omnimind_code FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own code data" ON omnimind_code FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE code_mentorship_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own mentorship sessions" ON code_mentorship_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_code WHERE id = code_id AND user_id = auth.uid())
);

ALTER TABLE code_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own code projects" ON code_projects FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_code WHERE id = code_id AND user_id = auth.uid())
);

-- OmniMind Business RLS
ALTER TABLE omnimind_business ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own business data" ON omnimind_business FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own business data" ON omnimind_business FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own business data" ON omnimind_business FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own business data" ON omnimind_business FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE business_training_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own training modules" ON business_training_modules FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_business WHERE id = business_id AND user_id = auth.uid())
);

ALTER TABLE business_ai_coaching ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own coaching sessions" ON business_ai_coaching FOR ALL USING (
    EXISTS (SELECT 1 FROM omnimind_business WHERE id = business_id AND user_id = auth.uid())
);

-- Cross-Domain Analytics RLS
ALTER TABLE cross_domain_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON cross_domain_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON cross_domain_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS FOR CROSS-DOMAIN OMNIMIND
-- =====================================================

-- Create OmniMind Health profile
CREATE OR REPLACE FUNCTION create_omnimind_health(
    p_user_id UUID,
    p_health_profile JSONB DEFAULT '{}',
    p_privacy_level VARCHAR(20) DEFAULT 'private'
) RETURNS UUID AS $$
DECLARE
    health_id UUID;
BEGIN
    INSERT INTO omnimind_health (user_id, health_profile, privacy_level)
    VALUES (p_user_id, p_health_profile, p_privacy_level)
    RETURNING id INTO health_id;
    
    RETURN health_id;
END;
$$ LANGUAGE plpgsql;

-- Create OmniMind Code profile
CREATE OR REPLACE FUNCTION create_omnimind_code(
    p_user_id UUID,
    p_developer_profile JSONB DEFAULT '{}',
    p_skill_level VARCHAR(20) DEFAULT 'beginner'
) RETURNS UUID AS $$
DECLARE
    code_id UUID;
BEGIN
    INSERT INTO omnimind_code (user_id, developer_profile, skill_level)
    VALUES (p_user_id, p_developer_profile, p_skill_level)
    RETURNING id INTO code_id;
    
    RETURN code_id;
END;
$$ LANGUAGE plpgsql;

-- Create OmniMind Business profile
CREATE OR REPLACE FUNCTION create_omnimind_business(
    p_user_id UUID,
    p_company_id UUID DEFAULT NULL,
    p_employee_profile JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    business_id UUID;
BEGIN
    INSERT INTO omnimind_business (user_id, company_id, employee_profile)
    VALUES (p_user_id, p_company_id, p_employee_profile)
    RETURNING id INTO business_id;
    
    RETURN business_id;
END;
$$ LANGUAGE plpgsql;

-- Add health therapy session
CREATE OR REPLACE FUNCTION add_health_therapy_session(
    p_health_id UUID,
    p_session_type VARCHAR(50),
    p_session_title VARCHAR(255),
    p_duration_minutes INTEGER,
    p_session_date TIMESTAMP WITH TIME ZONE
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO health_therapy_sessions (
        health_id, session_type, session_title, duration_minutes, session_date
    )
    VALUES (
        p_health_id, p_session_type, p_session_title, p_duration_minutes, p_session_date
    )
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Add code mentorship session
CREATE OR REPLACE FUNCTION add_code_mentorship_session(
    p_code_id UUID,
    p_session_type VARCHAR(50),
    p_session_title VARCHAR(255),
    p_duration_minutes INTEGER,
    p_session_date TIMESTAMP WITH TIME ZONE
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO code_mentorship_sessions (
        code_id, session_type, session_title, duration_minutes, session_date
    )
    VALUES (
        p_code_id, p_session_type, p_session_title, p_duration_minutes, p_session_date
    )
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Add business coaching session
CREATE OR REPLACE FUNCTION add_business_coaching_session(
    p_business_id UUID,
    p_coaching_type VARCHAR(50),
    p_session_title VARCHAR(255),
    p_duration_minutes INTEGER,
    p_session_date TIMESTAMP WITH TIME ZONE
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO business_ai_coaching (
        business_id, coaching_type, session_title, duration_minutes, session_date
    )
    VALUES (
        p_business_id, p_coaching_type, p_session_title, p_duration_minutes, p_session_date
    )
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Get cross-domain insights
CREATE OR REPLACE FUNCTION get_cross_domain_insights(p_user_id UUID) RETURNS JSONB AS $$
DECLARE
    insights JSONB := '{}';
    health_data JSONB;
    code_data JSONB;
    business_data JSONB;
BEGIN
    -- Get health insights
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*),
        'average_effectiveness', AVG(effectiveness_score),
        'recent_sessions', jsonb_agg(
            jsonb_build_object(
                'session_type', session_type,
                'session_date', session_date,
                'effectiveness_score', effectiveness_score
            ) ORDER BY session_date DESC LIMIT 5
        )
    ) INTO health_data
    FROM health_therapy_sessions hts
    JOIN omnimind_health oh ON hts.health_id = oh.id
    WHERE oh.user_id = p_user_id;
    
    -- Get code insights
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*),
        'average_rating', AVG(user_rating),
        'recent_sessions', jsonb_agg(
            jsonb_build_object(
                'session_type', session_type,
                'session_date', session_date,
                'user_rating', user_rating
            ) ORDER BY session_date DESC LIMIT 5
        )
    ) INTO code_data
    FROM code_mentorship_sessions cms
    JOIN omnimind_code oc ON cms.code_id = oc.id
    WHERE oc.user_id = p_user_id;
    
    -- Get business insights
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*),
        'average_effectiveness', AVG(effectiveness_rating),
        'recent_sessions', jsonb_agg(
            jsonb_build_object(
                'coaching_type', coaching_type,
                'session_date', session_date,
                'effectiveness_rating', effectiveness_rating
            ) ORDER BY session_date DESC LIMIT 5
        )
    ) INTO business_data
    FROM business_ai_coaching bac
    JOIN omnimind_business ob ON bac.business_id = ob.id
    WHERE ob.user_id = p_user_id;
    
    insights := jsonb_build_object(
        'health', COALESCE(health_data, '{}'),
        'code', COALESCE(code_data, '{}'),
        'business', COALESCE(business_data, '{}'),
        'generated_at', NOW()
    );
    
    RETURN insights;
END;
$$ LANGUAGE plpgsql;

-- Update cross-domain performance
CREATE OR REPLACE FUNCTION update_cross_domain_performance(
    p_user_id UUID,
    p_domain VARCHAR(20),
    p_domain_id UUID,
    p_metrics JSONB
) RETURNS BOOLEAN AS $$
BEGIN
    -- Update health performance
    IF p_domain = 'health' THEN
        UPDATE omnimind_health 
        SET 
            health_metrics = p_metrics,
            last_updated = NOW()
        WHERE id = p_domain_id AND user_id = p_user_id;
    END IF;
    
    -- Update code performance
    IF p_domain = 'code' THEN
        UPDATE omnimind_code 
        SET 
            productivity_metrics = p_metrics,
            last_updated = NOW()
        WHERE id = p_domain_id AND user_id = p_user_id;
    END IF;
    
    -- Update business performance
    IF p_domain = 'business' THEN
        UPDATE omnimind_business 
        SET 
            productivity_metrics = p_metrics,
            last_updated = NOW()
        WHERE id = p_domain_id AND user_id = p_user_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample OmniMind Health data
INSERT INTO omnimind_health (
    user_id, health_profile, emotional_state, mental_health_score, 
    physical_health_score, emotional_wellness_score, overall_health_score
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '{"age": 28, "gender": "non-binary", "medical_conditions": [], "allergies": [], "medications": []}',
    '{"current_mood": "calm", "stress_level": 3, "anxiety_level": 2, "energy_level": 7}',
    85, 78, 82, 81
);

-- Sample Health Therapy Sessions
INSERT INTO health_therapy_sessions (
    health_id, session_type, session_title, duration_minutes, session_date, 
    effectiveness_score, emotional_state_before, emotional_state_after
) VALUES (
    (SELECT id FROM omnimind_health WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'mindfulness',
    'Morning Mindfulness Session',
    30,
    NOW() - INTERVAL '2 days',
    8,
    '{"mood": "anxious", "stress": 6, "energy": 4}',
    '{"mood": "calm", "stress": 3, "energy": 7}'
);

-- Sample OmniMind Code data
INSERT INTO omnimind_code (
    user_id, developer_profile, programming_languages, skill_level, 
    experience_years, ai_mentor_personality
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '{"specialization": "full-stack", "interests": ["AI/ML", "Web Development"], "learning_style": "hands-on"}',
    '["JavaScript", "Python", "TypeScript", "React", "Node.js"]',
    'intermediate',
    3,
    'encouraging'
);

-- Sample Code Mentorship Sessions
INSERT INTO code_mentorship_sessions (
    code_id, session_type, session_title, programming_language, 
    difficulty_level, duration_minutes, session_date, user_rating, ai_rating
) VALUES (
    (SELECT id FROM omnimind_code WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'code_review',
    'React Component Optimization',
    'JavaScript',
    6,
    45,
    NOW() - INTERVAL '1 day',
    5,
    4
);

-- Sample OmniMind Business data
INSERT INTO omnimind_business (
    user_id, company_id, role, department, productivity_score, 
    leadership_score, collaboration_score, innovation_score, overall_performance_score
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Product Manager',
    'Engineering',
    88, 75, 92, 85, 85
);

-- Sample Business AI Coaching
INSERT INTO business_ai_coaching (
    business_id, coaching_type, session_title, duration_minutes, 
    session_date, effectiveness_rating, user_satisfaction
) VALUES (
    (SELECT id FROM omnimind_business WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'leadership_development',
    'Team Leadership Strategies',
    60,
    NOW() - INTERVAL '3 days',
    4,
    5
);

-- Sample Cross-Domain Analytics
INSERT INTO cross_domain_analytics (
    user_id, domain, domain_id, metric_type, metric_name, 
    metric_value, metric_unit, measurement_date
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'health',
    (SELECT id FROM omnimind_health WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'engagement',
    'therapy_session_frequency',
    3.5,
    'sessions_per_week',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001',
    'code',
    (SELECT id FROM omnimind_code WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'productivity',
    'code_quality_score',
    87.5,
    'percentage',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001',
    'business',
    (SELECT id FROM omnimind_business WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'performance',
    'overall_performance_score',
    85.0,
    'percentage',
    NOW()
);