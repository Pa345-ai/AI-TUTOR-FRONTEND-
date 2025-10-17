-- Cognitive Digital Twin System - Database Schema
-- Each student gets a "digital brain clone" with AI-powered cognitive mapping

-- =====================================================
-- COGNITIVE DIGITAL TWIN TABLES
-- =====================================================

-- Personal Cognitive Twin - Core digital brain clone
CREATE TABLE IF NOT EXISTS cognitive_twins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    twin_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    -- Cognitive Profile
    cognitive_style VARCHAR(50), -- 'visual', 'auditory', 'kinesthetic', 'reading', 'mixed'
    learning_pace VARCHAR(20), -- 'slow', 'moderate', 'fast', 'variable'
    attention_span INTEGER, -- Average attention span in minutes
    memory_type VARCHAR(30), -- 'short_term', 'long_term', 'working', 'episodic'
    processing_speed DECIMAL(5,2), -- Cognitive processing speed score
    
    -- Knowledge Graph Data
    knowledge_graph JSONB, -- Complete knowledge map with nodes and connections
    skill_levels JSONB, -- Skill proficiency levels across subjects
    learning_preferences JSONB, -- AI-discovered learning preferences
    cognitive_biases JSONB, -- Identified cognitive biases and patterns
    
    -- Performance Metrics
    overall_cognitive_score DECIMAL(5,2) DEFAULT 0.00,
    memory_retention_rate DECIMAL(5,2) DEFAULT 0.00,
    learning_efficiency DECIMAL(5,2) DEFAULT 0.00,
    problem_solving_ability DECIMAL(5,2) DEFAULT 0.00,
    
    -- AI Analysis
    ai_insights JSONB, -- AI-generated insights about learning patterns
    predicted_performance JSONB, -- Future performance predictions
    recommended_strategies JSONB, -- Personalized learning strategies
    cognitive_health_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Metadata
    version INTEGER DEFAULT 1,
    parent_twin_id UUID REFERENCES cognitive_twins(id),
    is_primary BOOLEAN DEFAULT true
);

-- Knowledge Graph Nodes - Individual knowledge pieces
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    node_type VARCHAR(50) NOT NULL, -- 'concept', 'skill', 'fact', 'procedure', 'principle'
    subject_area VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    content TEXT,
    
    -- Knowledge Properties
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    importance_score DECIMAL(5,2) DEFAULT 0.00,
    mastery_level DECIMAL(5,2) DEFAULT 0.00, -- 0.0 to 1.0
    confidence_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Learning Data
    first_learned_at TIMESTAMP WITH TIME ZONE,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    learning_time_minutes INTEGER DEFAULT 0,
    
    -- Connections
    prerequisites JSONB, -- Array of prerequisite node IDs
    related_concepts JSONB, -- Array of related concept IDs
    applications JSONB, -- Real-world applications
    
    -- AI Analysis
    learning_difficulty DECIMAL(5,2), -- AI-calculated difficulty
    retention_probability DECIMAL(5,2), -- Likelihood of retention
    optimal_review_interval INTEGER, -- Days until next review
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Graph Connections - Relationships between nodes
CREATE TABLE IF NOT EXISTS knowledge_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    source_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) NOT NULL, -- 'prerequisite', 'related', 'applies_to', 'contradicts', 'builds_on'
    strength DECIMAL(5,2) DEFAULT 0.00, -- Connection strength 0.0 to 1.0
    confidence DECIMAL(5,2) DEFAULT 0.00, -- AI confidence in connection
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictive Learning Engine - Performance forecasting
CREATE TABLE IF NOT EXISTS learning_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50) NOT NULL, -- 'performance', 'retention', 'difficulty', 'engagement'
    subject_area VARCHAR(100),
    time_horizon VARCHAR(20), -- '1_week', '1_month', '3_months', '6_months', '1_year'
    
    -- Prediction Data
    predicted_value DECIMAL(10,4),
    confidence_level DECIMAL(5,2),
    prediction_factors JSONB, -- Factors that influenced the prediction
    model_version VARCHAR(50),
    
    -- Validation
    actual_value DECIMAL(10,4),
    prediction_accuracy DECIMAL(5,2),
    validated_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Memory Replay Sessions - Learning session timeline
CREATE TABLE IF NOT EXISTS memory_replay_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    session_name VARCHAR(255) NOT NULL,
    original_session_id UUID, -- Reference to original learning session
    
    -- Session Data
    session_type VARCHAR(50), -- 'study', 'quiz', 'lesson', 'practice', 'review'
    subject_area VARCHAR(100),
    topic VARCHAR(255),
    duration_minutes INTEGER,
    
    -- Learning Content
    content_summary TEXT,
    key_concepts JSONB, -- Array of key concepts covered
    learning_objectives JSONB, -- Learning objectives for the session
    materials_used JSONB, -- Study materials, videos, books, etc.
    
    -- Performance Data
    performance_score DECIMAL(5,2),
    engagement_level DECIMAL(5,2),
    difficulty_rating DECIMAL(5,2),
    comprehension_level DECIMAL(5,2),
    
    -- Cognitive Data
    attention_patterns JSONB, -- Attention focus patterns during session
    cognitive_load DECIMAL(5,2), -- Mental effort required
    memory_encoding_strength DECIMAL(5,2), -- How well information was encoded
    learning_style_used JSONB, -- Learning styles utilized
    
    -- Timeline Data
    session_timeline JSONB, -- Detailed timeline of learning activities
    milestones JSONB, -- Key learning milestones achieved
    breakthroughs JSONB, -- Moments of understanding or insight
    struggles JSONB, -- Areas of difficulty or confusion
    
    -- AI Analysis
    ai_insights JSONB, -- AI analysis of the learning session
    improvement_suggestions JSONB, -- Suggestions for future learning
    knowledge_gaps JSONB, -- Identified knowledge gaps
    
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cognitive Learning Patterns - AI-discovered patterns
CREATE TABLE IF NOT EXISTS cognitive_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    pattern_type VARCHAR(50) NOT NULL, -- 'learning_style', 'attention_pattern', 'memory_pattern', 'problem_solving'
    pattern_name VARCHAR(255) NOT NULL,
    pattern_description TEXT,
    
    -- Pattern Data
    pattern_data JSONB, -- Specific pattern characteristics
    frequency DECIMAL(5,2), -- How often this pattern occurs
    strength DECIMAL(5,2), -- Pattern strength/confidence
    impact_score DECIMAL(5,2), -- Impact on learning outcomes
    
    -- Context
    subject_areas JSONB, -- Subject areas where pattern applies
    time_of_day VARCHAR(20), -- When pattern typically occurs
    learning_conditions JSONB, -- Conditions that trigger pattern
    
    -- AI Analysis
    ai_confidence DECIMAL(5,2), -- AI confidence in pattern identification
    prediction_accuracy DECIMAL(5,2), -- How well pattern predicts outcomes
    recommendations JSONB, -- AI recommendations based on pattern
    
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_observed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Cognitive Twin Analytics - Performance and growth metrics
CREATE TABLE IF NOT EXISTS cognitive_twin_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twin_id UUID REFERENCES cognitive_twins(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'knowledge_growth', 'skill_development', 'cognitive_health', 'learning_efficiency'
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_unit VARCHAR(50),
    
    -- Time Series Data
    measurement_date DATE,
    time_period VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'
    
    -- Context
    subject_area VARCHAR(100),
    learning_context JSONB, -- Context in which metric was measured
    
    -- Comparison Data
    previous_value DECIMAL(10,4),
    change_percentage DECIMAL(5,2),
    percentile_rank DECIMAL(5,2), -- Rank compared to similar learners
    
    -- AI Insights
    trend_analysis JSONB, -- AI analysis of trends
    anomaly_detection JSONB, -- Unusual patterns or outliers
    recommendations JSONB, -- AI recommendations based on metrics
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Cognitive Twins indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_twins_user_id ON cognitive_twins(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_twins_active ON cognitive_twins(is_active);
CREATE INDEX IF NOT EXISTS idx_cognitive_twins_cognitive_score ON cognitive_twins(overall_cognitive_score);

-- Knowledge Nodes indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_twin_id ON knowledge_nodes(twin_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_subject_area ON knowledge_nodes(subject_area);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_mastery_level ON knowledge_nodes(mastery_level);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_node_type ON knowledge_nodes(node_type);

-- Knowledge Connections indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_connections_twin_id ON knowledge_connections(twin_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_connections_source ON knowledge_connections(source_node_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_connections_target ON knowledge_connections(target_node_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_connections_type ON knowledge_connections(connection_type);

-- Learning Predictions indexes
CREATE INDEX IF NOT EXISTS idx_learning_predictions_twin_id ON learning_predictions(twin_id);
CREATE INDEX IF NOT EXISTS idx_learning_predictions_type ON learning_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_learning_predictions_time_horizon ON learning_predictions(time_horizon);
CREATE INDEX IF NOT EXISTS idx_learning_predictions_expires ON learning_predictions(expires_at);

-- Memory Replay Sessions indexes
CREATE INDEX IF NOT EXISTS idx_memory_replay_twin_id ON memory_replay_sessions(twin_id);
CREATE INDEX IF NOT EXISTS idx_memory_replay_session_type ON memory_replay_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_memory_replay_subject_area ON memory_replay_sessions(subject_area);
CREATE INDEX IF NOT EXISTS idx_memory_replay_started_at ON memory_replay_sessions(started_at);

-- Cognitive Patterns indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_patterns_twin_id ON cognitive_patterns(twin_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_patterns_type ON cognitive_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_cognitive_patterns_active ON cognitive_patterns(is_active);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_analytics_twin_id ON cognitive_twin_analytics(twin_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_analytics_metric_type ON cognitive_twin_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_cognitive_analytics_date ON cognitive_twin_analytics(measurement_date);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cognitive_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_replay_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_twin_analytics ENABLE ROW LEVEL SECURITY;

-- Cognitive Twins policies
CREATE POLICY "Users can view their own cognitive twins" ON cognitive_twins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cognitive twins" ON cognitive_twins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cognitive twins" ON cognitive_twins
    FOR UPDATE USING (auth.uid() = user_id);

-- Knowledge Nodes policies
CREATE POLICY "Users can view knowledge nodes for their twins" ON knowledge_nodes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = knowledge_nodes.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage knowledge nodes for their twins" ON knowledge_nodes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = knowledge_nodes.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- Knowledge Connections policies
CREATE POLICY "Users can view connections for their twins" ON knowledge_connections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = knowledge_connections.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage connections for their twins" ON knowledge_connections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = knowledge_connections.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- Learning Predictions policies
CREATE POLICY "Users can view predictions for their twins" ON learning_predictions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = learning_predictions.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage predictions for their twins" ON learning_predictions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = learning_predictions.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- Memory Replay Sessions policies
CREATE POLICY "Users can view replay sessions for their twins" ON memory_replay_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = memory_replay_sessions.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage replay sessions for their twins" ON memory_replay_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = memory_replay_sessions.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- Cognitive Patterns policies
CREATE POLICY "Users can view patterns for their twins" ON cognitive_patterns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = cognitive_patterns.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage patterns for their twins" ON cognitive_patterns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = cognitive_patterns.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Users can view analytics for their twins" ON cognitive_twin_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = cognitive_twin_analytics.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage analytics for their twins" ON cognitive_twin_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cognitive_twins 
            WHERE cognitive_twins.id = cognitive_twin_analytics.twin_id 
            AND cognitive_twins.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS FOR COGNITIVE DIGITAL TWIN
-- =====================================================

-- Function to create a new cognitive twin
CREATE OR REPLACE FUNCTION create_cognitive_twin(
    p_user_id UUID,
    p_twin_name VARCHAR(255),
    p_cognitive_style VARCHAR(50) DEFAULT 'mixed',
    p_learning_pace VARCHAR(20) DEFAULT 'moderate'
) RETURNS UUID AS $$
DECLARE
    twin_id UUID;
BEGIN
    INSERT INTO cognitive_twins (
        user_id, twin_name, cognitive_style, learning_pace,
        knowledge_graph, skill_levels, learning_preferences,
        cognitive_biases, ai_insights, predicted_performance,
        recommended_strategies
    ) VALUES (
        p_user_id, p_twin_name, p_cognitive_style, p_learning_pace,
        '{}'::jsonb, '{}'::jsonb, '{}'::jsonb,
        '{}'::jsonb, '{}'::jsonb, '{}'::jsonb,
        '{}'::jsonb
    ) RETURNING id INTO twin_id;
    
    RETURN twin_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add a knowledge node
CREATE OR REPLACE FUNCTION add_knowledge_node(
    p_twin_id UUID,
    p_node_type VARCHAR(50),
    p_subject_area VARCHAR(100),
    p_topic VARCHAR(255),
    p_content TEXT,
    p_difficulty_level INTEGER DEFAULT 5
) RETURNS UUID AS $$
DECLARE
    node_id UUID;
BEGIN
    INSERT INTO knowledge_nodes (
        twin_id, node_type, subject_area, topic, content,
        difficulty_level, first_learned_at, last_reviewed_at
    ) VALUES (
        p_twin_id, p_node_type, p_subject_area, p_topic, p_content,
        p_difficulty_level, NOW(), NOW()
    ) RETURNING id INTO node_id;
    
    RETURN node_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create a memory replay session
CREATE OR REPLACE FUNCTION create_memory_replay_session(
    p_twin_id UUID,
    p_session_name VARCHAR(255),
    p_session_type VARCHAR(50),
    p_subject_area VARCHAR(100),
    p_topic VARCHAR(255),
    p_duration_minutes INTEGER,
    p_performance_score DECIMAL(5,2)
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO memory_replay_sessions (
        twin_id, session_name, session_type, subject_area, topic,
        duration_minutes, performance_score, started_at, completed_at
    ) VALUES (
        p_twin_id, p_session_name, p_session_type, p_subject_area, p_topic,
        p_duration_minutes, p_performance_score, NOW(), NOW()
    ) RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get cognitive twin insights
CREATE OR REPLACE FUNCTION get_cognitive_twin_insights(p_twin_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    twin_data RECORD;
    knowledge_count INTEGER;
    pattern_count INTEGER;
    session_count INTEGER;
BEGIN
    -- Get twin data
    SELECT * INTO twin_data FROM cognitive_twins WHERE id = p_twin_id;
    
    -- Get counts
    SELECT COUNT(*) INTO knowledge_count FROM knowledge_nodes WHERE twin_id = p_twin_id;
    SELECT COUNT(*) INTO pattern_count FROM cognitive_patterns WHERE twin_id = p_twin_id AND is_active = true;
    SELECT COUNT(*) INTO session_count FROM memory_replay_sessions WHERE twin_id = p_twin_id;
    
    -- Build result
    SELECT jsonb_build_object(
        'twin_id', p_twin_id,
        'twin_name', twin_data.twin_name,
        'cognitive_style', twin_data.cognitive_style,
        'learning_pace', twin_data.learning_pace,
        'overall_score', twin_data.overall_cognitive_score,
        'memory_retention', twin_data.memory_retention_rate,
        'learning_efficiency', twin_data.learning_efficiency,
        'knowledge_nodes', knowledge_count,
        'cognitive_patterns', pattern_count,
        'replay_sessions', session_count,
        'ai_insights', twin_data.ai_insights,
        'recommended_strategies', twin_data.recommended_strategies,
        'last_updated', twin_data.last_updated
    ) INTO result;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to update cognitive twin performance
CREATE OR REPLACE FUNCTION update_cognitive_performance(
    p_twin_id UUID,
    p_cognitive_score DECIMAL(5,2),
    p_memory_retention DECIMAL(5,2),
    p_learning_efficiency DECIMAL(5,2),
    p_problem_solving DECIMAL(5,2)
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE cognitive_twins SET
        overall_cognitive_score = p_cognitive_score,
        memory_retention_rate = p_memory_retention,
        learning_efficiency = p_learning_efficiency,
        problem_solving_ability = p_problem_solving,
        last_updated = NOW()
    WHERE id = p_twin_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample cognitive twins
INSERT INTO cognitive_twins (user_id, twin_name, cognitive_style, learning_pace, overall_cognitive_score, memory_retention_rate, learning_efficiency, problem_solving_ability) VALUES
('00000000-0000-0000-0000-000000000001', 'Alex Cognitive Twin', 'visual', 'fast', 87.5, 92.3, 89.1, 85.7),
('00000000-0000-0000-0000-000000000002', 'Sarah Learning Clone', 'auditory', 'moderate', 78.9, 85.2, 82.4, 79.6),
('00000000-0000-0000-0000-000000000003', 'Jordan Digital Brain', 'kinesthetic', 'slow', 91.2, 88.7, 93.5, 89.8);

-- Insert sample knowledge nodes
INSERT INTO knowledge_nodes (twin_id, node_type, subject_area, topic, content, difficulty_level, mastery_level, confidence_level) VALUES
((SELECT id FROM cognitive_twins WHERE twin_name = 'Alex Cognitive Twin'), 'concept', 'mathematics', 'quadratic equations', 'Understanding how to solve quadratic equations using various methods', 7, 0.85, 0.92),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Alex Cognitive Twin'), 'skill', 'programming', 'Python functions', 'Ability to write and debug Python functions', 6, 0.78, 0.88),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Sarah Learning Clone'), 'fact', 'history', 'World War II', 'Key facts and dates about World War II', 5, 0.92, 0.95),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Jordan Digital Brain'), 'procedure', 'science', 'lab safety', 'Step-by-step lab safety procedures', 4, 0.96, 0.98);

-- Insert sample memory replay sessions
INSERT INTO memory_replay_sessions (twin_id, session_name, session_type, subject_area, topic, duration_minutes, performance_score, engagement_level, comprehension_level) VALUES
((SELECT id FROM cognitive_twins WHERE twin_name = 'Alex Cognitive Twin'), 'Algebra Mastery Session', 'study', 'mathematics', 'quadratic equations', 45, 88.5, 92.3, 89.7),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Sarah Learning Clone'), 'History Deep Dive', 'lesson', 'history', 'World War II', 60, 91.2, 87.8, 93.1),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Jordan Digital Brain'), 'Science Lab Practice', 'practice', 'science', 'lab safety', 30, 94.8, 95.2, 96.1);

-- Insert sample cognitive patterns
INSERT INTO cognitive_patterns (twin_id, pattern_type, pattern_name, pattern_description, frequency, strength, impact_score) VALUES
((SELECT id FROM cognitive_twins WHERE twin_name = 'Alex Cognitive Twin'), 'learning_style', 'Visual Problem Solving', 'Prefers to visualize problems before solving them', 0.85, 0.92, 0.88),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Sarah Learning Clone'), 'attention_pattern', 'Morning Focus Peak', 'Highest attention and focus in morning hours', 0.78, 0.89, 0.85),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Jordan Digital Brain'), 'memory_pattern', 'Hands-on Retention', 'Best retention when learning through hands-on activities', 0.91, 0.94, 0.92);

-- Insert sample learning predictions
INSERT INTO learning_predictions (twin_id, prediction_type, subject_area, time_horizon, predicted_value, confidence_level) VALUES
((SELECT id FROM cognitive_twins WHERE twin_name = 'Alex Cognitive Twin'), 'performance', 'mathematics', '3_months', 92.5, 0.87),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Sarah Learning Clone'), 'retention', 'history', '1_month', 88.3, 0.82),
((SELECT id FROM cognitive_twins WHERE twin_name = 'Jordan Digital Brain'), 'engagement', 'science', '6_months', 94.1, 0.91);