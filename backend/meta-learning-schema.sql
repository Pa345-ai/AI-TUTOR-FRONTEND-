-- Meta-Learning Core Database Schema
-- AI that learns how to teach itself

-- =====================================================
-- TEACHING OPTIMIZATION ENGINE TABLES
-- =====================================================

-- Teaching strategies and their effectiveness
CREATE TABLE IF NOT EXISTS teaching_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'socratic', 'visual', 'gamified', 'adaptive', etc.
    parameters JSONB, -- Strategy-specific parameters
    effectiveness_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0, -- Percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Teaching method effectiveness by user profile
CREATE TABLE IF NOT EXISTS teaching_effectiveness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES teaching_strategies(id) ON DELETE CASCADE,
    user_profile_hash VARCHAR(64) NOT NULL, -- Anonymized user profile
    personality_type VARCHAR(50), -- 'visual', 'auditory', 'kinesthetic', etc.
    learning_style VARCHAR(50), -- 'sequential', 'global', 'active', 'reflective', etc.
    cultural_context VARCHAR(50), -- 'western', 'eastern', 'african', etc.
    age_group VARCHAR(20), -- 'child', 'teen', 'adult', 'senior'
    subject_area VARCHAR(100),
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    effectiveness_score DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
    sample_size INTEGER DEFAULT 1,
    confidence_level DECIMAL(3,2) DEFAULT 0.0, -- Statistical confidence
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teaching interaction patterns
CREATE TABLE IF NOT EXISTS teaching_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES teaching_strategies(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'question', 'explanation', 'example', 'exercise'
    content_hash VARCHAR(64) NOT NULL, -- Anonymized content
    user_response_type VARCHAR(50), -- 'correct', 'incorrect', 'confused', 'engaged'
    response_time_ms INTEGER,
    user_satisfaction DECIMAL(3,2), -- 1.0 to 5.0
    learning_outcome VARCHAR(50), -- 'mastered', 'improved', 'no_change', 'regressed'
    context_data JSONB, -- Additional context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SELF-IMPROVING CURRICULUM AI TABLES
-- =====================================================

-- Global performance data for curriculum optimization
CREATE TABLE IF NOT EXISTS curriculum_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    learning_objective TEXT NOT NULL,
    global_success_rate DECIMAL(5,2) DEFAULT 0.0,
    average_completion_time INTEGER, -- in minutes
    dropout_rate DECIMAL(5,2) DEFAULT 0.0,
    user_satisfaction DECIMAL(3,2) DEFAULT 0.0,
    prerequisite_effectiveness JSONB, -- Which prerequisites work best
    optimal_sequence JSONB, -- Optimal learning sequence
    sample_size INTEGER DEFAULT 0,
    last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curriculum adaptation rules
CREATE TABLE IF NOT EXISTS curriculum_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(50) NOT NULL, -- 'performance_threshold', 'time_threshold', 'satisfaction_threshold'
    condition_value DECIMAL(10,4) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'adjust_difficulty', 'add_prerequisite', 'change_sequence', 'add_practice'
    action_parameters JSONB,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning path optimizations
CREATE TABLE IF NOT EXISTS learning_path_optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_hash VARCHAR(64) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    original_path JSONB NOT NULL,
    optimized_path JSONB NOT NULL,
    optimization_reason TEXT,
    performance_improvement DECIMAL(5,2), -- Percentage improvement
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FEDERATED LEARNING NETWORK TABLES
-- =====================================================

-- Federated learning models
CREATE TABLE IF NOT EXISTS federated_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'teaching_strategy', 'curriculum_optimization', 'personalization'
    version VARCHAR(20) NOT NULL,
    global_model_data BYTEA, -- Encrypted model weights
    model_metadata JSONB,
    performance_metrics JSONB,
    training_samples INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Local model updates (anonymized)
CREATE TABLE IF NOT EXISTS local_model_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES federated_models(id) ON DELETE CASCADE,
    user_hash VARCHAR(64) NOT NULL, -- Anonymized user identifier
    local_update_data BYTEA, -- Encrypted local model update
    update_metadata JSONB,
    performance_improvement DECIMAL(5,2),
    privacy_budget DECIMAL(5,4), -- Differential privacy budget
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Federated learning rounds
CREATE TABLE IF NOT EXISTS federated_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES federated_models(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    participants_count INTEGER DEFAULT 0,
    aggregation_method VARCHAR(50) NOT NULL, -- 'fedavg', 'fedprox', 'scaffold'
    global_loss DECIMAL(10,6),
    global_accuracy DECIMAL(5,4),
    convergence_metric DECIMAL(10,6),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running' -- 'running', 'completed', 'failed'
);

-- =====================================================
-- META-LEARNING ANALYTICS TABLES
-- =====================================================

-- Meta-learning insights
CREATE TABLE IF NOT EXISTS meta_learning_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type VARCHAR(50) NOT NULL, -- 'teaching_optimization', 'curriculum_improvement', 'personalization'
    insight_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    impact_score DECIMAL(3,2) DEFAULT 0.0, -- Potential impact on learning outcomes
    sample_size INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- A/B testing for meta-learning features
CREATE TABLE IF NOT EXISTS meta_learning_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name VARCHAR(255) NOT NULL,
    description TEXT,
    hypothesis TEXT NOT NULL,
    control_group_config JSONB NOT NULL,
    treatment_group_config JSONB NOT NULL,
    success_metrics JSONB NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'running', 'completed', 'cancelled'
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiment participants
CREATE TABLE IF NOT EXISTS experiment_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID REFERENCES meta_learning_experiments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_assignment VARCHAR(20) NOT NULL, -- 'control', 'treatment'
    participation_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Teaching strategies indexes
CREATE INDEX IF NOT EXISTS idx_teaching_strategies_category ON teaching_strategies(category);
CREATE INDEX IF NOT EXISTS idx_teaching_strategies_effectiveness ON teaching_strategies(effectiveness_score DESC);
CREATE INDEX IF NOT EXISTS idx_teaching_strategies_active ON teaching_strategies(is_active) WHERE is_active = true;

-- Teaching effectiveness indexes
CREATE INDEX IF NOT EXISTS idx_teaching_effectiveness_strategy ON teaching_effectiveness(strategy_id);
CREATE INDEX IF NOT EXISTS idx_teaching_effectiveness_profile ON teaching_effectiveness(user_profile_hash);
CREATE INDEX IF NOT EXISTS idx_teaching_effectiveness_personality ON teaching_effectiveness(personality_type);
CREATE INDEX IF NOT EXISTS idx_teaching_effectiveness_subject ON teaching_effectiveness(subject_area);

-- Teaching interactions indexes
CREATE INDEX IF NOT EXISTS idx_teaching_interactions_user ON teaching_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_teaching_interactions_strategy ON teaching_interactions(strategy_id);
CREATE INDEX IF NOT EXISTS idx_teaching_interactions_type ON teaching_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_teaching_interactions_created ON teaching_interactions(created_at);

-- Curriculum performance indexes
CREATE INDEX IF NOT EXISTS idx_curriculum_performance_topic ON curriculum_performance(topic);
CREATE INDEX IF NOT EXISTS idx_curriculum_performance_subject ON curriculum_performance(subject);
CREATE INDEX IF NOT EXISTS idx_curriculum_performance_difficulty ON curriculum_performance(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_curriculum_performance_success ON curriculum_performance(global_success_rate DESC);

-- Federated learning indexes
CREATE INDEX IF NOT EXISTS idx_federated_models_type ON federated_models(model_type);
CREATE INDEX IF NOT EXISTS idx_federated_models_active ON federated_models(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_local_updates_model ON local_model_updates(model_id);
CREATE INDEX IF NOT EXISTS idx_federated_rounds_model ON federated_rounds(model_id);

-- Meta-learning insights indexes
CREATE INDEX IF NOT EXISTS idx_meta_insights_type ON meta_learning_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_meta_insights_confidence ON meta_learning_insights(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_meta_insights_created ON meta_learning_insights(created_at);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE teaching_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_effectiveness ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_model_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_learning_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_learning_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_participants ENABLE ROW LEVEL SECURITY;

-- Teaching strategies - readable by all authenticated users
CREATE POLICY "Teaching strategies are viewable by all users" ON teaching_strategies
    FOR SELECT USING (auth.role() = 'authenticated');

-- Teaching effectiveness - readable by all authenticated users
CREATE POLICY "Teaching effectiveness is viewable by all users" ON teaching_effectiveness
    FOR SELECT USING (auth.role() = 'authenticated');

-- Teaching interactions - users can only see their own
CREATE POLICY "Users can view own teaching interactions" ON teaching_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own teaching interactions" ON teaching_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Curriculum performance - readable by all authenticated users
CREATE POLICY "Curriculum performance is viewable by all users" ON curriculum_performance
    FOR SELECT USING (auth.role() = 'authenticated');

-- Learning path optimizations - users can only see their own
CREATE POLICY "Users can view own learning path optimizations" ON learning_path_optimizations
    FOR SELECT USING (auth.uid()::text = user_profile_hash);

-- Federated models - readable by all authenticated users
CREATE POLICY "Federated models are viewable by all users" ON federated_models
    FOR SELECT USING (auth.role() = 'authenticated');

-- Local model updates - users can only see their own
CREATE POLICY "Users can view own local model updates" ON local_model_updates
    FOR SELECT USING (auth.uid()::text = user_hash);

-- Meta-learning insights - readable by all authenticated users
CREATE POLICY "Meta-learning insights are viewable by all users" ON meta_learning_insights
    FOR SELECT USING (auth.role() = 'authenticated');

-- Experiment participants - users can only see their own
CREATE POLICY "Users can view own experiment participation" ON experiment_participants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiment participation" ON experiment_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS FOR META-LEARNING
-- =====================================================

-- Function to update teaching strategy effectiveness
CREATE OR REPLACE FUNCTION update_teaching_strategy_effectiveness()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the strategy's overall effectiveness score
    UPDATE teaching_strategies 
    SET 
        effectiveness_score = (
            SELECT AVG(effectiveness_score) 
            FROM teaching_effectiveness 
            WHERE strategy_id = NEW.strategy_id
        ),
        usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = NEW.strategy_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update strategy effectiveness
CREATE TRIGGER trigger_update_teaching_strategy_effectiveness
    AFTER INSERT OR UPDATE ON teaching_effectiveness
    FOR EACH ROW
    EXECUTE FUNCTION update_teaching_strategy_effectiveness();

-- Function to calculate curriculum performance metrics
CREATE OR REPLACE FUNCTION calculate_curriculum_performance(
    p_topic VARCHAR,
    p_subject VARCHAR,
    p_difficulty VARCHAR
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'success_rate', AVG(global_success_rate),
        'completion_time', AVG(average_completion_time),
        'dropout_rate', AVG(dropout_rate),
        'satisfaction', AVG(user_satisfaction),
        'sample_size', SUM(sample_size)
    ) INTO result
    FROM curriculum_performance
    WHERE topic = p_topic 
    AND subject = p_subject 
    AND difficulty_level = p_difficulty;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get personalized teaching strategy
CREATE OR REPLACE FUNCTION get_personalized_teaching_strategy(
    p_user_profile_hash VARCHAR,
    p_subject VARCHAR,
    p_difficulty VARCHAR
)
RETURNS TABLE (
    strategy_id UUID,
    strategy_name VARCHAR,
    effectiveness_score DECIMAL,
    confidence_level DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.id,
        ts.name,
        te.effectiveness_score,
        te.confidence_level
    FROM teaching_strategies ts
    JOIN teaching_effectiveness te ON ts.id = te.strategy_id
    WHERE te.user_profile_hash = p_user_profile_hash
    AND te.subject_area = p_subject
    AND te.difficulty_level = p_difficulty
    AND ts.is_active = true
    ORDER BY te.effectiveness_score DESC, te.confidence_level DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample teaching strategies
INSERT INTO teaching_strategies (name, description, category, parameters, effectiveness_score, usage_count) VALUES
('Socratic Questioning', 'Guide students through questions to discover answers themselves', 'socratic', 
 '{"question_types": ["clarifying", "probing", "challenging"], "wait_time": 3}', 0.85, 1250),
('Visual Learning', 'Use diagrams, charts, and visual aids to explain concepts', 'visual',
 '{"visual_types": ["diagrams", "charts", "infographics"], "color_coding": true}', 0.78, 980),
('Gamified Learning', 'Turn learning into a game with points, levels, and rewards', 'gamified',
 '{"points_per_question": 10, "level_thresholds": [100, 500, 1000], "badges": true}', 0.82, 1150),
('Adaptive Difficulty', 'Adjust difficulty based on student performance', 'adaptive',
 '{"difficulty_steps": 5, "performance_threshold": 0.7, "adjustment_rate": 0.1}', 0.88, 2100),
('Peer Learning', 'Students learn from and teach each other', 'collaborative',
 '{"group_size": 4, "rotation_frequency": 15, "peer_evaluation": true}', 0.75, 650);

-- Insert sample curriculum performance data
INSERT INTO curriculum_performance (topic, subject, difficulty_level, learning_objective, global_success_rate, average_completion_time, dropout_rate, user_satisfaction, sample_size) VALUES
('Basic Algebra', 'Mathematics', 'beginner', 'Solve linear equations with one variable', 78.5, 45, 12.3, 4.2, 2500),
('Photosynthesis', 'Biology', 'intermediate', 'Explain the process of photosynthesis', 82.1, 35, 8.7, 4.4, 1800),
('World War II', 'History', 'intermediate', 'Analyze causes and effects of World War II', 75.8, 60, 15.2, 4.0, 1200),
('Python Functions', 'Computer Science', 'beginner', 'Write and use functions in Python', 85.3, 90, 6.8, 4.6, 3200),
('Chemical Bonding', 'Chemistry', 'advanced', 'Understand ionic and covalent bonds', 71.2, 120, 18.5, 3.8, 800);

-- Insert sample meta-learning insights
INSERT INTO meta_learning_insights (insight_type, insight_data, confidence_score, impact_score, sample_size) VALUES
('teaching_optimization', 
 '{"finding": "Visual learners perform 23% better with diagram-based explanations", "strategy": "visual", "improvement": 0.23}', 
 0.89, 0.75, 5000),
('curriculum_improvement', 
 '{"finding": "Adding 5-minute practice exercises between theory and application improves retention by 18%", "recommendation": "add_practice_exercises", "improvement": 0.18}', 
 0.82, 0.68, 3500),
('personalization', 
 '{"finding": "Students with high anxiety benefit from immediate positive feedback", "strategy": "immediate_feedback", "improvement": 0.31}', 
 0.91, 0.82, 2800);