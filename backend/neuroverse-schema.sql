-- NeuroVerse - Global Learning Metaverse Database Schema
-- Merge education, AI, and 3D environments

-- =====================================================
-- VIRTUAL ENVIRONMENTS TABLES
-- =====================================================

-- 3D Virtual Classrooms and Learning Spaces
CREATE TABLE IF NOT EXISTS virtual_environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    environment_type VARCHAR(50) NOT NULL, -- 'classroom', 'laboratory', 'historical', 'space', 'underwater', 'forest', 'city'
    subject_area VARCHAR(100), -- 'physics', 'chemistry', 'biology', 'history', 'mathematics', 'art'
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    vr_supported BOOLEAN DEFAULT true,
    ar_supported BOOLEAN DEFAULT true,
    web_supported BOOLEAN DEFAULT true,
    max_capacity INTEGER DEFAULT 50,
    environment_data JSONB, -- 3D scene configuration, lighting, objects, etc.
    physics_settings JSONB, -- Physics simulation parameters
    audio_settings JSONB, -- Spatial audio configuration
    lighting_settings JSONB, -- Dynamic lighting and atmosphere
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Virtual Objects and Assets in 3D Environments
CREATE TABLE IF NOT EXISTS virtual_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    object_type VARCHAR(50) NOT NULL, -- 'interactive', 'decorative', 'tool', 'equipment', 'furniture'
    category VARCHAR(50), -- 'physics', 'chemistry', 'biology', 'mathematics', 'art'
    position JSONB NOT NULL, -- 3D coordinates {x, y, z}
    rotation JSONB, -- 3D rotation {x, y, z}
    scale JSONB, -- 3D scale {x, y, z}
    mesh_data JSONB, -- 3D model data, materials, textures
    interaction_data JSONB, -- How users can interact with the object
    physics_properties JSONB, -- Mass, friction, collision, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virtual Scenes and Scenarios
CREATE TABLE IF NOT EXISTS virtual_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    scene_name VARCHAR(255) NOT NULL,
    scene_type VARCHAR(50) NOT NULL, -- 'lesson', 'experiment', 'exploration', 'assessment', 'collaboration'
    description TEXT,
    learning_objectives JSONB, -- Array of learning goals for this scene
    scene_data JSONB, -- Scene configuration, spawn points, triggers, etc.
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    prerequisites JSONB, -- Required knowledge or completed scenes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AI AVATAR SYSTEM TABLES
-- =====================================================

-- AI Teacher Avatars
CREATE TABLE IF NOT EXISTS ai_teacher_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    personality_type VARCHAR(50) NOT NULL, -- 'enthusiastic', 'patient', 'scientific', 'artistic', 'mathematical'
    teaching_style VARCHAR(50) NOT NULL, -- 'socratic', 'demonstrative', 'collaborative', 'experimental'
    appearance_data JSONB, -- Avatar appearance, clothing, accessories
    voice_settings JSONB, -- Voice type, tone, speed, accent
    gesture_library JSONB, -- Available gestures and animations
    knowledge_domains JSONB, -- Subjects and topics this avatar specializes in
    emotional_intelligence JSONB, -- How avatar responds to student emotions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- AI Companion Avatars (Personal Learning Partners)
CREATE TABLE IF NOT EXISTS ai_companion_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    companion_name VARCHAR(255) NOT NULL,
    personality_type VARCHAR(50) NOT NULL, -- 'encouraging', 'curious', 'analytical', 'creative', 'supportive'
    companion_type VARCHAR(50) NOT NULL, -- 'study_buddy', 'tutor', 'mentor', 'friend', 'coach'
    appearance_data JSONB, -- Customizable appearance
    voice_settings JSONB, -- Personalized voice
    behavior_patterns JSONB, -- How companion adapts to user's learning style
    emotional_support JSONB, -- Emotional intelligence and support capabilities
    learning_preferences JSONB, -- Companion's learning approach preferences
    relationship_level INTEGER DEFAULT 1, -- 1-10, how close the relationship is
    experience_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Avatar Interactions and Conversations
CREATE TABLE IF NOT EXISTS avatar_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_id UUID, -- Can reference either teacher or companion avatar
    avatar_type VARCHAR(20) NOT NULL, -- 'teacher', 'companion'
    interaction_type VARCHAR(50) NOT NULL, -- 'conversation', 'instruction', 'encouragement', 'question', 'explanation'
    content TEXT NOT NULL,
    context JSONB, -- Learning context, subject, difficulty, etc.
    emotional_tone VARCHAR(50), -- 'positive', 'neutral', 'encouraging', 'concerned'
    user_response TEXT,
    user_emotion VARCHAR(50), -- Detected user emotion
    effectiveness_score DECIMAL(3,2), -- How effective this interaction was
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MIXED REALITY LABS TABLES
-- =====================================================

-- Virtual Laboratory Equipment
CREATE TABLE IF NOT EXISTS virtual_lab_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL, -- 'microscope', 'bunsen_burner', 'beaker', 'scale', 'computer', 'robot'
    subject_area VARCHAR(50) NOT NULL, -- 'physics', 'chemistry', 'biology', 'engineering'
    functionality JSONB, -- What the equipment can do
    physics_properties JSONB, -- Realistic physics simulation
    safety_protocols JSONB, -- Safety rules and warnings
    usage_instructions JSONB, -- How to use the equipment
    mesh_data JSONB, -- 3D model and materials
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virtual Experiments and Simulations
CREATE TABLE IF NOT EXISTS virtual_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject_area VARCHAR(50) NOT NULL,
    experiment_type VARCHAR(50) NOT NULL, -- 'physics', 'chemistry', 'biology', 'engineering'
    difficulty_level VARCHAR(20) NOT NULL,
    description TEXT,
    learning_objectives JSONB,
    equipment_required JSONB, -- Array of required virtual equipment
    procedure_steps JSONB, -- Step-by-step experiment procedure
    expected_outcomes JSONB, -- What should happen
    variables JSONB, -- Variables that can be changed
    safety_notes JSONB, -- Safety considerations
    simulation_data JSONB, -- Physics/chemistry simulation parameters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- User Experiment Sessions
CREATE TABLE IF NOT EXISTS experiment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES virtual_experiments(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    session_data JSONB, -- User's actions, measurements, observations
    results JSONB, -- Experiment results and data
    accuracy_score DECIMAL(3,2), -- How accurate the experiment was performed
    safety_score DECIMAL(3,2), -- How safely the experiment was conducted
    learning_outcomes JSONB, -- What the user learned
    duration_minutes INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VR/AR SESSION MANAGEMENT TABLES
-- =====================================================

-- VR/AR User Sessions
CREATE TABLE IF NOT EXISTS vr_ar_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL, -- 'vr', 'ar', 'web'
    device_type VARCHAR(50), -- 'oculus', 'htc_vive', 'hololens', 'mobile', 'desktop'
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES virtual_scenes(id) ON DELETE CASCADE,
    session_data JSONB, -- User's movements, interactions, etc.
    performance_metrics JSONB, -- FPS, latency, tracking accuracy
    comfort_metrics JSONB, -- Motion sickness, eye strain, etc.
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER
);

-- Multi-user VR/AR Sessions (Collaborative Learning)
CREATE TABLE IF NOT EXISTS collaborative_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name VARCHAR(255) NOT NULL,
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES virtual_scenes(id) ON DELETE CASCADE,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    session_type VARCHAR(50) NOT NULL, -- 'study_group', 'project_collaboration', 'peer_teaching', 'competition'
    privacy_level VARCHAR(20) DEFAULT 'private', -- 'public', 'private', 'invite_only'
    session_data JSONB, -- Shared session state, objects, etc.
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Collaborative Session Participants
CREATE TABLE IF NOT EXISTS session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES collaborative_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_id UUID, -- User's chosen avatar for this session
    role VARCHAR(50) DEFAULT 'participant', -- 'host', 'moderator', 'participant', 'observer'
    permissions JSONB, -- What the user can do in the session
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    participation_data JSONB -- User's contributions and interactions
);

-- =====================================================
-- LEARNING ANALYTICS FOR NEUROVERSE
-- =====================================================

-- VR/AR Learning Analytics
CREATE TABLE IF NOT EXISTS neuroverse_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES vr_ar_sessions(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'engagement', 'learning_outcome', 'interaction', 'movement', 'attention'
    metric_value DECIMAL(10,4) NOT NULL,
    context_data JSONB, -- Additional context about the metric
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial Learning Data
CREATE TABLE IF NOT EXISTS spatial_learning_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES virtual_environments(id) ON DELETE CASCADE,
    spatial_position JSONB NOT NULL, -- 3D position in virtual space
    gaze_direction JSONB, -- Where user is looking
    interaction_object_id UUID REFERENCES virtual_objects(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50), -- 'look', 'touch', 'manipulate', 'examine'
    learning_activity VARCHAR(50), -- 'exploration', 'experimentation', 'collaboration', 'assessment'
    duration_seconds INTEGER,
    effectiveness_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Virtual environments indexes
CREATE INDEX IF NOT EXISTS idx_virtual_environments_type ON virtual_environments(environment_type);
CREATE INDEX IF NOT EXISTS idx_virtual_environments_subject ON virtual_environments(subject_area);
CREATE INDEX IF NOT EXISTS idx_virtual_environments_active ON virtual_environments(is_active) WHERE is_active = true;

-- Virtual objects indexes
CREATE INDEX IF NOT EXISTS idx_virtual_objects_environment ON virtual_objects(environment_id);
CREATE INDEX IF NOT EXISTS idx_virtual_objects_type ON virtual_objects(object_type);
CREATE INDEX IF NOT EXISTS idx_virtual_objects_category ON virtual_objects(category);

-- Avatar indexes
CREATE INDEX IF NOT EXISTS idx_ai_teacher_avatars_personality ON ai_teacher_avatars(personality_type);
CREATE INDEX IF NOT EXISTS idx_ai_companion_avatars_user ON ai_companion_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_companion_avatars_type ON ai_companion_avatars(companion_type);

-- Experiment indexes
CREATE INDEX IF NOT EXISTS idx_virtual_experiments_subject ON virtual_experiments(subject_area);
CREATE INDEX IF NOT EXISTS idx_virtual_experiments_type ON virtual_experiments(experiment_type);
CREATE INDEX IF NOT EXISTS idx_experiment_sessions_user ON experiment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_experiment_sessions_experiment ON experiment_sessions(experiment_id);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_vr_ar_sessions_user ON vr_ar_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_vr_ar_sessions_type ON vr_ar_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_collaborative_sessions_environment ON collaborative_sessions(environment_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON session_participants(session_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_neuroverse_analytics_user ON neuroverse_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_neuroverse_analytics_metric ON neuroverse_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_spatial_learning_user ON spatial_learning_data(user_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE virtual_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_teacher_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_companion_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_lab_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vr_ar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuroverse_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_learning_data ENABLE ROW LEVEL SECURITY;

-- Virtual environments - readable by all authenticated users
CREATE POLICY "Virtual environments are viewable by all users" ON virtual_environments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Virtual objects - readable by all authenticated users
CREATE POLICY "Virtual objects are viewable by all users" ON virtual_objects
    FOR SELECT USING (auth.role() = 'authenticated');

-- AI teacher avatars - readable by all authenticated users
CREATE POLICY "AI teacher avatars are viewable by all users" ON ai_teacher_avatars
    FOR SELECT USING (auth.role() = 'authenticated');

-- AI companion avatars - users can only see their own
CREATE POLICY "Users can view own companion avatars" ON ai_companion_avatars
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own companion avatars" ON ai_companion_avatars
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companion avatars" ON ai_companion_avatars
    FOR UPDATE USING (auth.uid() = user_id);

-- Avatar interactions - users can only see their own
CREATE POLICY "Users can view own avatar interactions" ON avatar_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar interactions" ON avatar_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Virtual experiments - readable by all authenticated users
CREATE POLICY "Virtual experiments are viewable by all users" ON virtual_experiments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Experiment sessions - users can only see their own
CREATE POLICY "Users can view own experiment sessions" ON experiment_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiment sessions" ON experiment_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- VR/AR sessions - users can only see their own
CREATE POLICY "Users can view own VR/AR sessions" ON vr_ar_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own VR/AR sessions" ON vr_ar_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collaborative sessions - participants can see sessions they're in
CREATE POLICY "Users can view collaborative sessions they participate in" ON collaborative_sessions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM session_participants 
            WHERE session_id = collaborative_sessions.id
        )
    );

-- Session participants - users can see participants in their sessions
CREATE POLICY "Users can view session participants" ON session_participants
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT user_id FROM session_participants sp2 
            WHERE sp2.session_id = session_participants.session_id
        )
    );

-- Analytics - users can only see their own
CREATE POLICY "Users can view own analytics" ON neuroverse_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON neuroverse_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own spatial learning data" ON spatial_learning_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spatial learning data" ON spatial_learning_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS FOR NEUROVERSE
-- =====================================================

-- Function to create a new AI companion avatar
CREATE OR REPLACE FUNCTION create_ai_companion(
    p_user_id UUID,
    p_companion_name VARCHAR,
    p_personality_type VARCHAR,
    p_companion_type VARCHAR
)
RETURNS UUID AS $$
DECLARE
    companion_id UUID;
BEGIN
    INSERT INTO ai_companion_avatars (
        user_id, companion_name, personality_type, companion_type
    ) VALUES (
        p_user_id, p_companion_name, p_personality_type, p_companion_type
    ) RETURNING id INTO companion_id;
    
    RETURN companion_id;
END;
$$ LANGUAGE plpgsql;

-- Function to start a VR/AR session
CREATE OR REPLACE FUNCTION start_vr_session(
    p_user_id UUID,
    p_session_type VARCHAR,
    p_device_type VARCHAR,
    p_environment_id UUID,
    p_scene_id UUID
)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO vr_ar_sessions (
        user_id, session_type, device_type, environment_id, scene_id
    ) VALUES (
        p_user_id, p_session_type, p_device_type, p_environment_id, p_scene_id
    ) RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log spatial learning data
CREATE OR REPLACE FUNCTION log_spatial_learning(
    p_user_id UUID,
    p_environment_id UUID,
    p_spatial_position JSONB,
    p_gaze_direction JSONB,
    p_interaction_object_id UUID,
    p_interaction_type VARCHAR,
    p_learning_activity VARCHAR,
    p_duration_seconds INTEGER
)
RETURNS UUID AS $$
DECLARE
    learning_id UUID;
BEGIN
    INSERT INTO spatial_learning_data (
        user_id, environment_id, spatial_position, gaze_direction,
        interaction_object_id, interaction_type, learning_activity, duration_seconds
    ) VALUES (
        p_user_id, p_environment_id, p_spatial_position, p_gaze_direction,
        p_interaction_object_id, p_interaction_type, p_learning_activity, p_duration_seconds
    ) RETURNING id INTO learning_id;
    
    RETURN learning_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's learning progress in NeuroVerse
CREATE OR REPLACE FUNCTION get_neuroverse_progress(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_sessions', COUNT(DISTINCT vs.id),
        'total_time_minutes', COALESCE(SUM(vs.duration_minutes), 0),
        'environments_visited', COUNT(DISTINCT vs.environment_id),
        'experiments_completed', COUNT(DISTINCT es.id),
        'companion_level', COALESCE(MAX(aca.relationship_level), 1),
        'favorite_environment', (
            SELECT ve.name FROM virtual_environments ve
            JOIN vr_ar_sessions vs2 ON ve.id = vs2.environment_id
            WHERE vs2.user_id = p_user_id
            GROUP BY ve.id, ve.name
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )
    ) INTO result
    FROM vr_ar_sessions vs
    LEFT JOIN experiment_sessions es ON es.user_id = p_user_id
    LEFT JOIN ai_companion_avatars aca ON aca.user_id = p_user_id
    WHERE vs.user_id = p_user_id;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample virtual environments
INSERT INTO virtual_environments (name, description, environment_type, subject_area, difficulty_level, environment_data) VALUES
('Physics Lab - Space Station', 'Learn physics in zero gravity aboard a space station', 'laboratory', 'physics', 'intermediate', 
 '{"gravity": 0, "atmosphere": "artificial", "lighting": "fluorescent", "objects": ["floating_balls", "magnetic_fields", "laser_equipment"]}'),
('Chemistry Lab - Molecular World', 'Explore chemistry at the molecular level', 'laboratory', 'chemistry', 'advanced',
 '{"scale": "molecular", "interactions": "atomic", "visualization": "3d_atoms", "tools": ["electron_microscope", "molecular_builder"]}'),
('Historical Classroom - Ancient Rome', 'Learn history in a reconstructed Roman classroom', 'historical', 'history', 'beginner',
 '{"period": "ancient_rome", "architecture": "roman", "furniture": "ancient", "atmosphere": "historical"}'),
('Biology Lab - Underwater Research', 'Study marine biology in an underwater research station', 'laboratory', 'biology', 'intermediate',
 '{"location": "underwater", "pressure": "high", "visibility": "limited", "wildlife": "marine"}'),
('Mathematics Garden - Fractal Universe', 'Explore mathematical concepts in a fractal-based world', 'space', 'mathematics', 'advanced',
 '{"geometry": "fractal", "colors": "mathematical", "patterns": "infinite", "interactions": "geometric"}');

-- Insert sample AI teacher avatars
INSERT INTO ai_teacher_avatars (name, personality_type, teaching_style, appearance_data, knowledge_domains) VALUES
('Dr. Nova', 'enthusiastic', 'demonstrative', '{"gender": "female", "age": "middle", "clothing": "lab_coat", "accessories": ["glasses", "laser_pointer"]}', 
 '["physics", "astronomy", "space_science"]'),
('Professor Quantum', 'scientific', 'experimental', '{"gender": "male", "age": "elderly", "clothing": "formal", "accessories": ["pocket_watch", "calculator"]}', 
 '["mathematics", "physics", "quantum_mechanics"]'),
('Dr. Element', 'patient', 'collaborative', '{"gender": "non_binary", "age": "young", "clothing": "casual", "accessories": ["periodic_table", "safety_goggles"]}', 
 '["chemistry", "materials_science", "environmental_science"]'),
('Professor Bio', 'artistic', 'socratic', '{"gender": "female", "age": "middle", "clothing": "nature_themed", "accessories": ["microscope", "plant_samples"]}', 
 '["biology", "ecology", "evolution", "genetics"]');

-- Insert sample virtual experiments
INSERT INTO virtual_experiments (name, subject_area, experiment_type, difficulty_level, description, learning_objectives, equipment_required) VALUES
('Gravity Simulation', 'physics', 'physics', 'beginner', 'Experiment with gravity in different environments', 
 '["Understand gravity", "Compare gravitational forces", "Predict motion under gravity"]',
 '["gravity_simulator", "mass_objects", "measurement_tools"]'),
('Molecular Bonding', 'chemistry', 'chemistry', 'intermediate', 'Create and break molecular bonds in 3D', 
 '["Understand chemical bonds", "Visualize molecular structures", "Predict bond strength"]',
 '["molecular_builder", "bond_analyzer", "energy_meter"]'),
('Cell Division', 'biology', 'biology', 'intermediate', 'Observe and interact with cell division process', 
 '["Understand mitosis", "Identify cell phases", "Learn about cell cycle"]',
 '["microscope", "cell_samples", "phase_marker"]'),
('Fractal Geometry', 'mathematics', 'mathematics', 'advanced', 'Explore mathematical fractals in 3D space', 
 '["Understand fractals", "Calculate fractal dimensions", "Create fractal patterns"]',
 '["fractal_generator", "dimension_calculator", "pattern_analyzer"]');

-- Insert sample virtual lab equipment
INSERT INTO virtual_lab_equipment (name, equipment_type, subject_area, functionality, physics_properties) VALUES
('Virtual Microscope', 'microscope', 'biology', '{"magnification": "1000x", "resolution": "high", "imaging": "3d"}', 
 '{"weight": 5.0, "fragility": "high", "precision": "very_high"}'),
('Quantum Simulator', 'computer', 'physics', '{"simulation": "quantum_mechanics", "accuracy": "high", "visualization": "3d"}', 
 '{"weight": 10.0, "fragility": "medium", "precision": "very_high"}'),
('Molecular Builder', 'tool', 'chemistry', '{"bond_creation": true, "molecule_rotation": true, "energy_calculation": true}', 
 '{"weight": 2.0, "fragility": "low", "precision": "high"}'),
('Fractal Generator', 'computer', 'mathematics', '{"pattern_generation": true, "dimension_calculation": true, "visualization": "3d"}', 
 '{"weight": 8.0, "fragility": "medium", "precision": "very_high"}');