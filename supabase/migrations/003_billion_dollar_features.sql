-- =====================================================
-- OmniMind AI Tutor - Billion Dollar Features Schema
-- =====================================================
-- This migration adds the advanced features that push
-- OmniMind beyond $1B valuation potential
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- 1. META-LEARNING CORE
-- =====================================================

-- Teaching optimization engine - analyzes teaching effectiveness
CREATE TABLE teaching_optimization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    teaching_method VARCHAR(100) NOT NULL,
    personality_type VARCHAR(50) NOT NULL,
    culture VARCHAR(50),
    subject VARCHAR(100) NOT NULL,
    effectiveness_score DECIMAL(3,2) NOT NULL CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
    interaction_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) NOT NULL,
    engagement_metrics JSONB NOT NULL DEFAULT '{}',
    learning_outcomes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Self-improving curriculum AI - tracks global performance
CREATE TABLE curriculum_optimization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    global_performance_score DECIMAL(3,2) NOT NULL,
    completion_rate DECIMAL(3,2) NOT NULL,
    average_learning_time INTEGER NOT NULL, -- in minutes
    user_satisfaction DECIMAL(3,2) NOT NULL,
    improvement_suggestions JSONB NOT NULL DEFAULT '[]',
    auto_updated_content JSONB NOT NULL DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Federated learning network - anonymous global improvements
CREATE TABLE federated_learning_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'teaching', 'assessment', 'personalization'
    global_accuracy DECIMAL(3,2) NOT NULL,
    local_contributions INTEGER DEFAULT 0,
    privacy_preserving_hash VARCHAR(255) NOT NULL,
    model_weights JSONB NOT NULL DEFAULT '{}',
    training_metadata JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. NEUROVERSE - GLOBAL LEARNING METAVERSE
-- =====================================================

-- 3D immersive classrooms and environments
CREATE TABLE neuroverse_environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    environment_type VARCHAR(50) NOT NULL, -- 'classroom', 'lab', 'historical', 'space', 'underwater'
    subject VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    vr_required BOOLEAN DEFAULT false,
    ar_supported BOOLEAN DEFAULT false,
    max_participants INTEGER DEFAULT 50,
    environment_data JSONB NOT NULL DEFAULT '{}', -- 3D scene data
    physics_settings JSONB NOT NULL DEFAULT '{}',
    interactive_objects JSONB NOT NULL DEFAULT '{}',
    ai_avatars JSONB NOT NULL DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI class companion avatars
CREATE TABLE ai_companion_avatars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_name VARCHAR(100) NOT NULL,
    personality_type VARCHAR(50) NOT NULL,
    appearance_data JSONB NOT NULL DEFAULT '{}',
    emotional_state JSONB NOT NULL DEFAULT '{}',
    learning_preferences JSONB NOT NULL DEFAULT '{}',
    relationship_level INTEGER DEFAULT 1 CHECK (relationship_level >= 1 AND relationship_level <= 10),
    total_interaction_time INTEGER DEFAULT 0, -- in minutes
    favorite_subjects JSONB NOT NULL DEFAULT '[]',
    motivational_style VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mixed-reality lab experiments
CREATE TABLE mixed_reality_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_name VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL, -- 'physics', 'chemistry', 'biology', 'engineering'
    experiment_type VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    lab_environment JSONB NOT NULL DEFAULT '{}',
    experiment_procedures JSONB NOT NULL DEFAULT '[]',
    safety_guidelines JSONB NOT NULL DEFAULT '[]',
    expected_outcomes JSONB NOT NULL DEFAULT '[]',
    real_world_physics BOOLEAN DEFAULT true,
    vr_equipment_required JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. AI ECOSYSTEM INFRASTRUCTURE
-- =====================================================

-- AI plugin ecosystem and SDK
CREATE TABLE ai_plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plugin_name VARCHAR(200) NOT NULL,
    developer_id UUID REFERENCES users(id),
    description TEXT,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    api_endpoints JSONB NOT NULL DEFAULT '[]',
    permissions JSONB NOT NULL DEFAULT '[]',
    pricing_model VARCHAR(50) NOT NULL, -- 'free', 'subscription', 'pay_per_use'
    price DECIMAL(10,2) DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    plugin_code TEXT, -- encrypted plugin code
    configuration_schema JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Open API hub integrations
CREATE TABLE api_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_name VARCHAR(200) NOT NULL,
    platform_type VARCHAR(100) NOT NULL, -- 'edtech', 'hr', 'corporate', 'government'
    api_endpoint VARCHAR(500) NOT NULL,
    authentication_method VARCHAR(50) NOT NULL,
    api_key_hash VARCHAR(255),
    permissions JSONB NOT NULL DEFAULT '[]',
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'hourly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NeuroCloud AI workspace for institutions
CREATE TABLE neurocloud_workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_name VARCHAR(200) NOT NULL,
    workspace_name VARCHAR(200) NOT NULL,
    admin_user_id UUID REFERENCES users(id),
    private_data_sources JSONB NOT NULL DEFAULT '[]',
    custom_ai_models JSONB NOT NULL DEFAULT '[]',
    training_data_size BIGINT DEFAULT 0, -- in bytes
    model_accuracy DECIMAL(3,2) DEFAULT 0,
    privacy_level VARCHAR(20) DEFAULT 'high', -- 'low', 'medium', 'high', 'maximum'
    data_retention_days INTEGER DEFAULT 365,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. COGNITIVE DIGITAL TWIN SYSTEM
-- =====================================================

-- Personal cognitive twin for each student
CREATE TABLE cognitive_twins_advanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    twin_name VARCHAR(100) NOT NULL,
    knowledge_graph JSONB NOT NULL DEFAULT '{}',
    memory_retention_patterns JSONB NOT NULL DEFAULT '{}',
    thinking_style JSONB NOT NULL DEFAULT '{}',
    learning_velocity DECIMAL(3,2) NOT NULL,
    attention_span_profile JSONB NOT NULL DEFAULT '{}',
    cognitive_strengths JSONB NOT NULL DEFAULT '[]',
    cognitive_weaknesses JSONB NOT NULL DEFAULT '[]',
    predicted_performance JSONB NOT NULL DEFAULT '{}',
    learning_trajectory JSONB NOT NULL DEFAULT '[]',
    personality_insights JSONB NOT NULL DEFAULT '{}',
    emotional_patterns JSONB NOT NULL DEFAULT '{}',
    social_learning_preferences JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictive learning engine
CREATE TABLE predictive_learning_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cognitive_twin_id UUID REFERENCES cognitive_twins_advanced(id),
    forecast_period VARCHAR(20) NOT NULL, -- '1_month', '3_months', '6_months', '1_year'
    predicted_performance JSONB NOT NULL DEFAULT '{}',
    recommended_learning_path JSONB NOT NULL DEFAULT '[]',
    risk_factors JSONB NOT NULL DEFAULT '[]',
    intervention_suggestions JSONB NOT NULL DEFAULT '[]',
    confidence_score DECIMAL(3,2) NOT NULL,
    forecast_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory replay tool - timeline of learning growth
CREATE TABLE learning_memory_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    learning_milestone VARCHAR(200) NOT NULL,
    knowledge_gained JSONB NOT NULL DEFAULT '{}',
    skills_developed JSONB NOT NULL DEFAULT '[]',
    emotional_state JSONB NOT NULL DEFAULT '{}',
    difficulty_level VARCHAR(20) NOT NULL,
    time_spent INTEGER NOT NULL, -- in minutes
    achievement_level DECIMAL(3,2) NOT NULL,
    memory_tags JSONB NOT NULL DEFAULT '[]',
    session_recording_url VARCHAR(500), -- optional video/audio recording
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CROSS-DOMAIN OMNIMIND APPLICATIONS
-- =====================================================

-- OmniMind Health - personalized health & therapy
CREATE TABLE omnimind_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    health_domain VARCHAR(100) NOT NULL, -- 'mental_health', 'physical_health', 'nutrition', 'fitness'
    current_goals JSONB NOT NULL DEFAULT '[]',
    health_metrics JSONB NOT NULL DEFAULT '{}',
    therapy_sessions JSONB NOT NULL DEFAULT '[]',
    emotional_state_history JSONB NOT NULL DEFAULT '[]',
    wellness_recommendations JSONB NOT NULL DEFAULT '[]',
    progress_tracking JSONB NOT NULL DEFAULT '{}',
    privacy_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OmniMind Code - AI coding mentor
CREATE TABLE omnimind_code (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    programming_languages JSONB NOT NULL DEFAULT '[]',
    skill_levels JSONB NOT NULL DEFAULT '{}',
    coding_projects JSONB NOT NULL DEFAULT '[]',
    code_reviews JSONB NOT NULL DEFAULT '[]',
    learning_path JSONB NOT NULL DEFAULT '[]',
    coding_challenges JSONB NOT NULL DEFAULT '[]',
    mentor_sessions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OmniMind Business - corporate training
CREATE TABLE omnimind_business (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID,
    department VARCHAR(100),
    role VARCHAR(100),
    business_skills JSONB NOT NULL DEFAULT '[]',
    training_modules JSONB NOT NULL DEFAULT '[]',
    productivity_metrics JSONB NOT NULL DEFAULT '{}',
    leadership_development JSONB NOT NULL DEFAULT '{}',
    team_collaboration JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. AI TOKENIZED LEARNING ECONOMY
-- =====================================================

-- Learn-to-earn token system
CREATE TABLE learning_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(50) NOT NULL, -- 'learning', 'achievement', 'participation', 'teaching'
    amount DECIMAL(15,8) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'spent', 'transferred', 'rewarded'
    source_activity VARCHAR(200) NOT NULL,
    blockchain_transaction_hash VARCHAR(255),
    smart_contract_address VARCHAR(255),
    value_usd DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI credential blockchain
CREATE TABLE ai_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credential_type VARCHAR(100) NOT NULL,
    skill_verified VARCHAR(200) NOT NULL,
    mastery_level DECIMAL(3,2) NOT NULL,
    verification_method VARCHAR(100) NOT NULL,
    blockchain_hash VARCHAR(255) NOT NULL,
    issuer_ai_model VARCHAR(100) NOT NULL,
    verification_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT true,
    credential_metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Global scholarship pool
CREATE TABLE scholarship_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_name VARCHAR(200) NOT NULL,
    total_funding DECIMAL(15,2) NOT NULL,
    available_funding DECIMAL(15,2) NOT NULL,
    criteria JSONB NOT NULL DEFAULT '{}',
    smart_contract_address VARCHAR(255),
    distribution_algorithm VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ETHICAL INTELLIGENCE + PRIVACY CORE
-- =====================================================

-- Privacy-preserving AI with zero-knowledge learning
CREATE TABLE privacy_preserving_learning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    learning_data_hash VARCHAR(255) NOT NULL,
    encrypted_insights JSONB NOT NULL DEFAULT '{}',
    zero_knowledge_proof VARCHAR(500),
    privacy_level VARCHAR(20) DEFAULT 'maximum',
    data_anonymization_level VARCHAR(20) DEFAULT 'high',
    consent_given BOOLEAN DEFAULT true,
    data_retention_policy VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transparent AI reasoning reports
CREATE TABLE ai_reasoning_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_decision_id UUID NOT NULL,
    decision_type VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL DEFAULT '{}',
    reasoning_steps JSONB NOT NULL DEFAULT '[]',
    confidence_scores JSONB NOT NULL DEFAULT '{}',
    alternative_options JSONB NOT NULL DEFAULT '[]',
    bias_checks JSONB NOT NULL DEFAULT '{}',
    fairness_metrics JSONB NOT NULL DEFAULT '{}',
    transparency_score DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI fairness engine
CREATE TABLE fairness_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    demographic_group VARCHAR(50) NOT NULL,
    performance_metrics JSONB NOT NULL DEFAULT '{}',
    bias_detection_results JSONB NOT NULL DEFAULT '{}',
    fairness_score DECIMAL(3,2) NOT NULL,
    corrective_actions JSONB NOT NULL DEFAULT '[]',
    monitoring_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    monitoring_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    is_compliant BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Meta-learning indexes
CREATE INDEX idx_teaching_optimization_user_method ON teaching_optimization(user_id, teaching_method);
CREATE INDEX idx_curriculum_optimization_subject ON curriculum_optimization(subject, difficulty_level);
CREATE INDEX idx_federated_learning_active ON federated_learning_models(is_active, model_type);

-- NeuroVerse indexes
CREATE INDEX idx_neuroverse_environments_type ON neuroverse_environments(environment_type, subject);
CREATE INDEX idx_ai_companion_user ON ai_companion_avatars(user_id, is_active);
CREATE INDEX idx_mixed_reality_subject ON mixed_reality_labs(subject, difficulty_level);

-- Ecosystem indexes
CREATE INDEX idx_ai_plugins_category ON ai_plugins(category, is_approved);
CREATE INDEX idx_api_integrations_active ON api_integrations(is_active, platform_type);
CREATE INDEX idx_neurocloud_workspaces_active ON neurocloud_workspaces(is_active);

-- Cognitive twin indexes
CREATE INDEX idx_cognitive_twins_user ON cognitive_twins_advanced(user_id);
CREATE INDEX idx_predictive_forecasts_user ON predictive_learning_forecasts(user_id, is_active);
CREATE INDEX idx_memory_timeline_user ON learning_memory_timeline(user_id, created_at);

-- Cross-domain indexes
CREATE INDEX idx_omnimind_health_user ON omnimind_health(user_id, health_domain);
CREATE INDEX idx_omnimind_code_user ON omnimind_code(user_id);
CREATE INDEX idx_omnimind_business_user ON omnimind_business(user_id, company_id);

-- Token economy indexes
CREATE INDEX idx_learning_tokens_user ON learning_tokens(user_id, created_at);
CREATE INDEX idx_ai_credentials_user ON ai_credentials(user_id, is_verified);
CREATE INDEX idx_scholarship_pool_active ON scholarship_pool(is_active);

-- Privacy indexes
CREATE INDEX idx_privacy_learning_user ON privacy_preserving_learning(user_id);
CREATE INDEX idx_ai_reasoning_user ON ai_reasoning_reports(user_id, created_at);
CREATE INDEX idx_fairness_monitoring_model ON fairness_monitoring(model_name, created_at);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE teaching_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_learning_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuroverse_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_companion_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixed_reality_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE neurocloud_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_twins_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_learning_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_memory_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnimind_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnimind_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE omnimind_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_preserving_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reasoning_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE fairness_monitoring ENABLE ROW LEVEL SECURITY;

-- User-based access policies
CREATE POLICY "Users can view their own teaching optimization data" ON teaching_optimization
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own cognitive twin data" ON cognitive_twins_advanced
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own learning tokens" ON learning_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI credentials" ON ai_credentials
    FOR SELECT USING (auth.uid() = user_id);

-- Public read policies for certain tables
CREATE POLICY "Anyone can view public neuroverse environments" ON neuroverse_environments
    FOR SELECT USING (is_public = true);

CREATE POLICY "Anyone can view approved AI plugins" ON ai_plugins
    FOR SELECT USING (is_approved = true);

-- =====================================================
-- FUNCTIONS FOR ADVANCED FEATURES
-- =====================================================

-- Function to update teaching optimization scores
CREATE OR REPLACE FUNCTION update_teaching_optimization(
    p_user_id UUID,
    p_teaching_method VARCHAR(100),
    p_effectiveness_score DECIMAL(3,2),
    p_success_rate DECIMAL(3,2)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO teaching_optimization (user_id, teaching_method, effectiveness_score, success_rate)
    VALUES (p_user_id, p_teaching_method, p_effectiveness_score, p_success_rate)
    ON CONFLICT (user_id, teaching_method) 
    DO UPDATE SET 
        effectiveness_score = (effectiveness_score + p_effectiveness_score) / 2,
        success_rate = (success_rate + p_success_rate) / 2,
        interaction_count = interaction_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to generate learning memory timeline
CREATE OR REPLACE FUNCTION generate_memory_timeline(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    session_date DATE,
    total_sessions INTEGER,
    total_time INTEGER,
    subjects_learned TEXT[],
    achievements TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as session_date,
        COUNT(*)::INTEGER as total_sessions,
        SUM(time_spent)::INTEGER as total_time,
        ARRAY_AGG(DISTINCT subject) as subjects_learned,
        ARRAY_AGG(DISTINCT learning_milestone) as achievements
    FROM learning_memory_timeline
    WHERE user_id = p_user_id 
        AND created_at >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY DATE(created_at)
    ORDER BY session_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate fairness scores
CREATE OR REPLACE FUNCTION calculate_fairness_score(p_model_name VARCHAR(100))
RETURNS DECIMAL(3,2) AS $$
DECLARE
    avg_performance DECIMAL(3,2);
    min_performance DECIMAL(3,2);
    max_performance DECIMAL(3,2);
    fairness_score DECIMAL(3,2);
BEGIN
    SELECT 
        AVG((performance_metrics->>'overall_score')::DECIMAL),
        MIN((performance_metrics->>'overall_score')::DECIMAL),
        MAX((performance_metrics->>'overall_score')::DECIMAL)
    INTO avg_performance, min_performance, max_performance
    FROM fairness_monitoring
    WHERE model_name = p_model_name
        AND created_at >= NOW() - INTERVAL '30 days';
    
    IF max_performance = min_performance THEN
        fairness_score := 1.0;
    ELSE
        fairness_score := 1.0 - ((max_performance - min_performance) / max_performance);
    END IF;
    
    RETURN GREATEST(0.0, LEAST(1.0, fairness_score));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update curriculum optimization
CREATE OR REPLACE FUNCTION update_curriculum_optimization()
RETURNS TRIGGER AS $$
BEGIN
    -- Update curriculum based on new performance data
    UPDATE curriculum_optimization 
    SET 
        global_performance_score = (
            SELECT AVG(completion_percentage) / 100.0 
            FROM progress 
            WHERE learning_path_id IN (
                SELECT id FROM learning_paths 
                WHERE subject = NEW.subject
            )
        ),
        updated_at = NOW()
    WHERE subject = NEW.subject;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_curriculum
    AFTER INSERT OR UPDATE ON progress
    FOR EACH ROW
    EXECUTE FUNCTION update_curriculum_optimization();

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample teaching optimization data
INSERT INTO teaching_optimization (user_id, teaching_method, personality_type, culture, subject, effectiveness_score, success_rate, engagement_metrics, learning_outcomes)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'socratic', 'visual', 'western', 'mathematics', 0.85, 0.78, '{"attention_span": 0.9, "participation": 0.8}', '{"concept_retention": 0.85, "problem_solving": 0.82}'),
    ('550e8400-e29b-41d4-a716-446655440001', 'friendly', 'kinesthetic', 'eastern', 'science', 0.92, 0.88, '{"attention_span": 0.95, "participation": 0.9}', '{"concept_retention": 0.90, "practical_application": 0.87}');

-- Insert sample neuroverse environments
INSERT INTO neuroverse_environments (name, description, environment_type, subject, difficulty_level, vr_required, ar_supported, max_participants, environment_data, ai_avatars)
VALUES 
    ('Virtual Physics Lab', 'Immersive physics laboratory with realistic experiments', 'lab', 'physics', 'intermediate', true, true, 20, '{"scene": "laboratory", "equipment": ["pendulum", "laser", "prism"]}', '[{"name": "Dr. Einstein", "role": "instructor", "personality": "wise"}]'),
    ('Ancient Rome Classroom', 'Learn history in an authentic Roman setting', 'historical', 'history', 'beginner', false, true, 50, '{"scene": "roman_forum", "period": "ancient_rome"}', '[{"name": "Marcus", "role": "guide", "personality": "enthusiastic"}]');

-- Insert sample cognitive twin data
INSERT INTO cognitive_twins_advanced (user_id, twin_name, knowledge_graph, learning_velocity, cognitive_strengths, cognitive_weaknesses, predicted_performance)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Learning Twin Alpha', '{"mathematics": {"algebra": 0.8, "calculus": 0.6}, "science": {"physics": 0.7, "chemistry": 0.9}}', 0.75, '["logical_reasoning", "pattern_recognition"]', '["working_memory", "attention_span"]', '{"next_month": 0.8, "next_quarter": 0.85}');

-- Insert sample learning tokens
INSERT INTO learning_tokens (user_id, token_type, amount, transaction_type, source_activity, value_usd)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'learning', 100.0, 'earned', 'completed_lesson', 1.50),
    ('550e8400-e29b-41d4-a716-446655440001', 'achievement', 50.0, 'earned', 'quiz_perfect_score', 0.75);

-- Insert sample AI credentials
INSERT INTO ai_credentials (user_id, credential_type, skill_verified, mastery_level, verification_method, blockchain_hash, issuer_ai_model)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'mathematics', 'algebra_fundamentals', 0.85, 'ai_assessment', '0x1234567890abcdef', 'omnimind_v1.0'),
    ('550e8400-e29b-41d4-a716-446655440001', 'programming', 'python_basics', 0.78, 'code_review', '0xabcdef1234567890', 'omnimind_code_v1.0');

COMMIT;