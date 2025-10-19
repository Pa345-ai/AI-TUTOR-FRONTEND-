-- OmniMind Advanced Security and Audit System
-- Comprehensive RLS policies, triggers, and audit logging for all feature tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create audit log table for comprehensive tracking
CREATE TABLE IF NOT EXISTS audit_logs_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE, SELECT
    record_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- login, logout, permission_denied, suspicious_activity
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, critical
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    old_record JSONB;
    new_record JSONB;
    changed_fields TEXT[] := '{}';
    field_name TEXT;
BEGIN
    -- Get old and new records as JSONB
    IF TG_OP = 'DELETE' THEN
        old_record = to_jsonb(OLD);
        new_record = NULL;
    ELSIF TG_OP = 'INSERT' THEN
        old_record = NULL;
        new_record = to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        old_record = to_jsonb(OLD);
        new_record = to_jsonb(NEW);
        
        -- Find changed fields
        FOR field_name IN SELECT jsonb_object_keys(new_record) LOOP
            IF old_record->field_name IS DISTINCT FROM new_record->field_name THEN
                changed_fields = array_append(changed_fields, field_name);
            END IF;
        END LOOP;
    END IF;

    -- Insert audit log
    INSERT INTO audit_logs_enhanced (
        table_name,
        operation,
        record_id,
        user_id,
        old_values,
        new_values,
        changed_fields,
        ip_address,
        session_id,
        metadata
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.user_id, OLD.user_id, auth.uid()),
        old_record,
        new_record,
        changed_fields,
        inet_client_addr(),
        current_setting('request.jwt.claims', true)::jsonb->>'session_id',
        jsonb_build_object(
            'trigger_function', TG_NAME,
            'timestamp', NOW(),
            'transaction_id', txid_current()
        )
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type VARCHAR(100),
    p_description TEXT,
    p_severity VARCHAR(20) DEFAULT 'info',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO security_events (
        event_type,
        user_id,
        severity,
        description,
        ip_address,
        user_agent,
        session_id,
        metadata
    ) VALUES (
        p_event_type,
        auth.uid(),
        p_severity,
        p_description,
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent',
        current_setting('request.jwt.claims', true)::jsonb->>'session_id',
        p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_resource_type VARCHAR(100),
    p_action VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier VARCHAR(20);
    has_permission BOOLEAN := FALSE;
BEGIN
    -- Get user subscription tier
    SELECT subscription_tier INTO user_tier
    FROM users
    WHERE id = p_user_id;

    -- Check permissions based on tier and resource type
    CASE p_resource_type
        WHEN 'learning_paths' THEN
            has_permission := CASE p_action
                WHEN 'create' THEN user_tier IN ('free', 'premium', 'enterprise')
                WHEN 'read' THEN TRUE
                WHEN 'update' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'delete' THEN user_tier = 'enterprise'
                ELSE FALSE
            END;
        WHEN 'ai_sessions' THEN
            has_permission := CASE p_action
                WHEN 'create' THEN user_tier IN ('free', 'premium', 'enterprise')
                WHEN 'read' THEN TRUE
                WHEN 'update' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'delete' THEN user_tier = 'enterprise'
                ELSE FALSE
            END;
        WHEN 'cognitive_twins' THEN
            has_permission := CASE p_action
                WHEN 'create' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'read' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'update' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'delete' THEN user_tier = 'enterprise'
                ELSE FALSE
            END;
        WHEN 'tokens' THEN
            has_permission := CASE p_action
                WHEN 'create' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'read' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'update' THEN user_tier IN ('premium', 'enterprise')
                WHEN 'delete' THEN user_tier = 'enterprise'
                ELSE FALSE
            END;
        ELSE
            has_permission := FALSE;
    END CASE;

    RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced RLS Policies for Users Table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Enhanced RLS Policies for Learning Paths
DROP POLICY IF EXISTS "Users can view their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can create their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON learning_paths;

CREATE POLICY "Users can view their own learning paths" ON learning_paths
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning paths" ON learning_paths
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'create')
    );

CREATE POLICY "Users can update their own learning paths" ON learning_paths
    FOR UPDATE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'update')
    ) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning paths" ON learning_paths
    FOR DELETE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'delete')
    );

-- Enhanced RLS Policies for Lessons
DROP POLICY IF EXISTS "Users can view lessons in their paths" ON lessons;
DROP POLICY IF EXISTS "Users can create lessons in their paths" ON lessons;
DROP POLICY IF EXISTS "Users can update lessons in their paths" ON lessons;
DROP POLICY IF EXISTS "Users can delete lessons in their paths" ON lessons;

CREATE POLICY "Users can view lessons in their paths" ON lessons
    FOR SELECT USING (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create lessons in their paths" ON lessons
    FOR INSERT WITH CHECK (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'create')
    );

CREATE POLICY "Users can update lessons in their paths" ON lessons
    FOR UPDATE USING (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'update')
    ) WITH CHECK (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete lessons in their paths" ON lessons
    FOR DELETE USING (
        learning_path_id IN (
            SELECT id FROM learning_paths WHERE user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'delete')
    );

-- Enhanced RLS Policies for AI Sessions
DROP POLICY IF EXISTS "Users can view their own AI sessions" ON ai_sessions;
DROP POLICY IF EXISTS "Users can create their own AI sessions" ON ai_sessions;
DROP POLICY IF EXISTS "Users can update their own AI sessions" ON ai_sessions;
DROP POLICY IF EXISTS "Users can delete their own AI sessions" ON ai_sessions;

CREATE POLICY "Users can view their own AI sessions" ON ai_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI sessions" ON ai_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'ai_sessions', 'create')
    );

CREATE POLICY "Users can update their own AI sessions" ON ai_sessions
    FOR UPDATE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'ai_sessions', 'update')
    ) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI sessions" ON ai_sessions
    FOR DELETE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'ai_sessions', 'delete')
    );

-- Enhanced RLS Policies for Progress
DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON progress;

CREATE POLICY "Users can view their own progress" ON progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" ON progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON progress
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON progress
    FOR DELETE USING (auth.uid() = user_id);

-- Enhanced RLS Policies for Knowledge Graphs
DROP POLICY IF EXISTS "Users can view their own knowledge graphs" ON knowledge_graphs;
DROP POLICY IF EXISTS "Users can create their own knowledge graphs" ON knowledge_graphs;
DROP POLICY IF EXISTS "Users can update their own knowledge graphs" ON knowledge_graphs;
DROP POLICY IF EXISTS "Users can delete their own knowledge graphs" ON knowledge_graphs;

CREATE POLICY "Users can view their own knowledge graphs" ON knowledge_graphs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge graphs" ON knowledge_graphs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge graphs" ON knowledge_graphs
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge graphs" ON knowledge_graphs
    FOR DELETE USING (auth.uid() = user_id);

-- Enhanced RLS Policies for Tutor Personas (Public Read)
DROP POLICY IF EXISTS "Users can view public tutor personas" ON tutor_personas;
DROP POLICY IF EXISTS "Admins can manage tutor personas" ON tutor_personas;

CREATE POLICY "Users can view public tutor personas" ON tutor_personas
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage tutor personas" ON tutor_personas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

-- Enhanced RLS Policies for Quizzes
DROP POLICY IF EXISTS "Users can view quizzes in their lessons" ON quizzes;
DROP POLICY IF EXISTS "Users can create quizzes in their lessons" ON quizzes;
DROP POLICY IF EXISTS "Users can update quizzes in their lessons" ON quizzes;
DROP POLICY IF EXISTS "Users can delete quizzes in their lessons" ON quizzes;

CREATE POLICY "Users can view quizzes in their lessons" ON quizzes
    FOR SELECT USING (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create quizzes in their lessons" ON quizzes
    FOR INSERT WITH CHECK (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'create')
    );

CREATE POLICY "Users can update quizzes in their lessons" ON quizzes
    FOR UPDATE USING (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'update')
    ) WITH CHECK (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete quizzes in their lessons" ON quizzes
    FOR DELETE USING (
        lesson_id IN (
            SELECT l.id FROM lessons l
            JOIN learning_paths lp ON l.learning_path_id = lp.id
            WHERE lp.user_id = auth.uid()
        ) AND
        check_user_permission(auth.uid(), 'learning_paths', 'delete')
    );

-- Enhanced RLS Policies for Quiz Attempts
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can delete their own quiz attempts" ON quiz_attempts;

CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts" ON quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz attempts" ON quiz_attempts
    FOR DELETE USING (auth.uid() = user_id);

-- Enhanced RLS Policies for Flashcards
DROP POLICY IF EXISTS "Users can view their own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can create their own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can update their own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can delete their own flashcards" ON flashcards;

CREATE POLICY "Users can view their own flashcards" ON flashcards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards" ON flashcards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" ON flashcards
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" ON flashcards
    FOR DELETE USING (auth.uid() = user_id);

-- Enhanced RLS Policies for Gamification
DROP POLICY IF EXISTS "Users can view their own gamification" ON gamification;
DROP POLICY IF EXISTS "Users can create their own gamification" ON gamification;
DROP POLICY IF EXISTS "Users can update their own gamification" ON gamification;
DROP POLICY IF EXISTS "Users can delete their own gamification" ON gamification;

CREATE POLICY "Users can view their own gamification" ON gamification
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gamification" ON gamification
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification" ON gamification
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gamification" ON gamification
    FOR DELETE USING (auth.uid() = user_id);

-- Enhanced RLS Policies for VR Environments (Public Read)
DROP POLICY IF EXISTS "Users can view public VR environments" ON mock_vr_environments;
DROP POLICY IF EXISTS "Admins can manage VR environments" ON mock_vr_environments;

CREATE POLICY "Users can view public VR environments" ON mock_vr_environments
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage VR environments" ON mock_vr_environments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

-- Enhanced RLS Policies for Cognitive Twins
DROP POLICY IF EXISTS "Users can view their own cognitive twins" ON cognitive_twins;
DROP POLICY IF EXISTS "Users can create their own cognitive twins" ON cognitive_twins;
DROP POLICY IF EXISTS "Users can update their own cognitive twins" ON cognitive_twins;
DROP POLICY IF EXISTS "Users can delete their own cognitive twins" ON cognitive_twins;

CREATE POLICY "Users can view their own cognitive twins" ON cognitive_twins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cognitive twins" ON cognitive_twins
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'cognitive_twins', 'create')
    );

CREATE POLICY "Users can update their own cognitive twins" ON cognitive_twins
    FOR UPDATE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'cognitive_twins', 'update')
    ) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cognitive twins" ON cognitive_twins
    FOR DELETE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'cognitive_twins', 'delete')
    );

-- Enhanced RLS Policies for Developer Apps
DROP POLICY IF EXISTS "Users can view their own developer apps" ON developer_apps;
DROP POLICY IF EXISTS "Users can create their own developer apps" ON developer_apps;
DROP POLICY IF EXISTS "Users can update their own developer apps" ON developer_apps;
DROP POLICY IF EXISTS "Users can delete their own developer apps" ON developer_apps;

CREATE POLICY "Users can view their own developer apps" ON developer_apps
    FOR SELECT USING (auth.uid() = developer_id);

CREATE POLICY "Users can create their own developer apps" ON developer_apps
    FOR INSERT WITH CHECK (
        auth.uid() = developer_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'create')
    );

CREATE POLICY "Users can update their own developer apps" ON developer_apps
    FOR UPDATE USING (
        auth.uid() = developer_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'update')
    ) WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Users can delete their own developer apps" ON developer_apps
    FOR DELETE USING (
        auth.uid() = developer_id AND
        check_user_permission(auth.uid(), 'learning_paths', 'delete')
    );

-- Enhanced RLS Policies for Tokens
DROP POLICY IF EXISTS "Users can view their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can create their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can delete their own tokens" ON tokens;

CREATE POLICY "Users can view their own tokens" ON tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tokens" ON tokens
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'tokens', 'create')
    );

CREATE POLICY "Users can update their own tokens" ON tokens
    FOR UPDATE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'tokens', 'update')
    ) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens" ON tokens
    FOR DELETE USING (
        auth.uid() = user_id AND
        check_user_permission(auth.uid(), 'tokens', 'delete')
    );

-- Enhanced RLS Policies for Audit Logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;

CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

-- Enhanced RLS Policies for Meta Learning
DROP POLICY IF EXISTS "Users can view their own meta learning" ON meta_learning;
DROP POLICY IF EXISTS "Admins can view all meta learning" ON meta_learning;

CREATE POLICY "Users can view their own meta learning" ON meta_learning
    FOR SELECT USING (true); -- Global learning insights

CREATE POLICY "Admins can view all meta learning" ON meta_learning
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

-- Enhanced RLS Policies for Cross Domain Apps
DROP POLICY IF EXISTS "Users can view their own cross-domain apps" ON cross_domain_apps;
DROP POLICY IF EXISTS "Users can create their own cross-domain apps" ON cross_domain_apps;
DROP POLICY IF EXISTS "Users can update their own cross-domain apps" ON cross_domain_apps;
DROP POLICY IF EXISTS "Users can delete their own cross-domain apps" ON cross_domain_apps;

CREATE POLICY "Users can view their own cross-domain apps" ON cross_domain_apps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cross-domain apps" ON cross_domain_apps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cross-domain apps" ON cross_domain_apps
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cross-domain apps" ON cross_domain_apps
    FOR DELETE USING (auth.uid() = user_id);

-- Create audit triggers for all tables
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_learning_paths_trigger
    AFTER INSERT OR UPDATE OR DELETE ON learning_paths
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_lessons_trigger
    AFTER INSERT OR UPDATE OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_ai_sessions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ai_sessions
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON progress
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_knowledge_graphs_trigger
    AFTER INSERT OR UPDATE OR DELETE ON knowledge_graphs
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_tutor_personas_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tutor_personas
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_quizzes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_quiz_attempts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON quiz_attempts
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_flashcards_trigger
    AFTER INSERT OR UPDATE OR DELETE ON flashcards
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_gamification_trigger
    AFTER INSERT OR UPDATE OR DELETE ON gamification
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_mock_vr_environments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON mock_vr_environments
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_cognitive_twins_trigger
    AFTER INSERT OR UPDATE OR DELETE ON cognitive_twins
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_developer_apps_trigger
    AFTER INSERT OR UPDATE OR DELETE ON developer_apps
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_tokens_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tokens
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_audit_logs_trigger
    AFTER INSERT OR UPDATE OR DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_meta_learning_trigger
    AFTER INSERT OR UPDATE OR DELETE ON meta_learning
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_cross_domain_apps_trigger
    AFTER INSERT OR UPDATE OR DELETE ON cross_domain_apps
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_table_name ON audit_logs_enhanced(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_user_id ON audit_logs_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_created_at ON audit_logs_enhanced(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_operation ON audit_logs_enhanced(operation);

CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- Enable RLS on new tables
ALTER TABLE audit_logs_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit tables
CREATE POLICY "Users can view their own audit logs enhanced" ON audit_logs_enhanced
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs enhanced" ON audit_logs_enhanced
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'enterprise'
        )
    );

-- Create function to detect suspicious activity
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
    recent_attempts INTEGER;
    user_ip INET;
BEGIN
    user_ip := inet_client_addr();
    
    -- Check for rapid successive operations
    SELECT COUNT(*) INTO recent_attempts
    FROM audit_logs_enhanced
    WHERE user_id = auth.uid()
    AND created_at > NOW() - INTERVAL '1 minute'
    AND operation = TG_OP;
    
    IF recent_attempts > 10 THEN
        PERFORM log_security_event(
            'suspicious_activity',
            'Rapid successive ' || TG_OP || ' operations detected',
            'warning',
            jsonb_build_object(
                'table_name', TG_TABLE_NAME,
                'operation_count', recent_attempts,
                'time_window', '1 minute'
            )
        );
    END IF;
    
    -- Check for unusual access patterns
    IF TG_OP = 'SELECT' AND TG_TABLE_NAME IN ('audit_logs', 'security_events') THEN
        PERFORM log_security_event(
            'suspicious_activity',
            'Access to sensitive audit tables',
            'info',
            jsonb_build_object(
                'table_name', TG_TABLE_NAME,
                'user_id', auth.uid()
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add suspicious activity detection triggers
CREATE TRIGGER suspicious_activity_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION detect_suspicious_activity();

CREATE TRIGGER suspicious_activity_ai_sessions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ai_sessions
    FOR EACH ROW EXECUTE FUNCTION detect_suspicious_activity();

-- Create function to generate security report
CREATE OR REPLACE FUNCTION generate_security_report(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '24 hours',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
    report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'report_period', jsonb_build_object(
            'start', p_start_date,
            'end', p_end_date
        ),
        'total_operations', (
            SELECT COUNT(*) FROM audit_logs_enhanced
            WHERE created_at BETWEEN p_start_date AND p_end_date
        ),
        'operations_by_type', (
            SELECT jsonb_object_agg(operation, count)
            FROM (
                SELECT operation, COUNT(*) as count
                FROM audit_logs_enhanced
                WHERE created_at BETWEEN p_start_date AND p_end_date
                GROUP BY operation
            ) op_stats
        ),
        'security_events', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'event_type', event_type,
                    'severity', severity,
                    'description', description,
                    'created_at', created_at
                )
            )
            FROM security_events
            WHERE created_at BETWEEN p_start_date AND p_end_date
            ORDER BY created_at DESC
        ),
        'top_users_by_activity', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'user_id', user_id,
                    'operation_count', count
                )
            )
            FROM (
                SELECT user_id, COUNT(*) as count
                FROM audit_logs_enhanced
                WHERE created_at BETWEEN p_start_date AND p_end_date
                GROUP BY user_id
                ORDER BY count DESC
                LIMIT 10
            ) user_stats
        )
    ) INTO report;
    
    RETURN report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
