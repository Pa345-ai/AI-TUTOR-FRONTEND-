-- OmniMind OS - AI Ecosystem Infrastructure Database Schema
-- Transform from product → platform

-- =====================================================
-- AI PLUGIN ECOSYSTEM TABLES
-- =====================================================

-- Plugin Registry and Management
CREATE TABLE IF NOT EXISTS ai_plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL,
    developer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plugin_type VARCHAR(50) NOT NULL, -- 'learning_module', 'assessment_tool', 'content_generator', 'analytics_engine', 'integration_bridge'
    category VARCHAR(100) NOT NULL, -- 'mathematics', 'science', 'language', 'history', 'art', 'business', 'technology'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending_review', 'approved', 'rejected', 'deprecated'
    pricing_model VARCHAR(20) DEFAULT 'free', -- 'free', 'freemium', 'subscription', 'one_time', 'usage_based'
    price DECIMAL(10,2) DEFAULT 0.00,
    api_endpoints JSONB, -- Available API endpoints for the plugin
    configuration_schema JSONB, -- JSON schema for plugin configuration
    capabilities JSONB, -- What the plugin can do
    requirements JSONB, -- System requirements and dependencies
    documentation_url TEXT,
    source_code_url TEXT,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Plugin Installations and Usage
CREATE TABLE IF NOT EXISTS plugin_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plugin_id UUID REFERENCES ai_plugins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    installation_config JSONB, -- Plugin-specific configuration
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'error', 'updating'
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plugin Reviews and Ratings
CREATE TABLE IF NOT EXISTS plugin_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plugin_id UUID REFERENCES ai_plugins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    helpful_votes INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plugin Analytics and Usage Tracking
CREATE TABLE IF NOT EXISTS plugin_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plugin_id UUID REFERENCES ai_plugins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'install', 'uninstall', 'use', 'error', 'feature_used'
    event_data JSONB, -- Additional event-specific data
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- OPEN API HUB TABLES
-- =====================================================

-- API Keys and Authentication
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    key_value VARCHAR(255) NOT NULL UNIQUE,
    key_type VARCHAR(20) DEFAULT 'production', -- 'development', 'production', 'sandbox'
    permissions JSONB, -- Array of allowed API endpoints and operations
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Tracking
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL, -- 'GET', 'POST', 'PUT', 'DELETE'
    request_data JSONB,
    response_data JSONB,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Third-party Platform Integrations
CREATE TABLE IF NOT EXISTS platform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(255) NOT NULL,
    platform_type VARCHAR(50) NOT NULL, -- 'lms', 'hr_system', 'corporate_training', 'edtech', 'crm'
    integration_type VARCHAR(50) NOT NULL, -- 'webhook', 'api', 'sso', 'data_sync'
    configuration JSONB, -- Integration-specific settings
    webhook_url TEXT,
    api_endpoints JSONB, -- Available endpoints for this platform
    authentication_method VARCHAR(50), -- 'oauth2', 'api_key', 'basic_auth', 'jwt'
    auth_config JSONB, -- Authentication configuration
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'error', 'pending'
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'realtime', -- 'realtime', 'hourly', 'daily', 'weekly'
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Data Sync Logs
CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES platform_integrations(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'user_data', 'learning_progress', 'content', 'analytics'
    direction VARCHAR(20) NOT NULL, -- 'inbound', 'outbound', 'bidirectional'
    data_type VARCHAR(100) NOT NULL,
    record_count INTEGER,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- =====================================================
-- NEUROCLOUD AI WORKSPACE TABLES
-- =====================================================

-- AI Workspaces for Institutions
CREATE TABLE IF NOT EXISTS ai_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_type VARCHAR(50) NOT NULL, -- 'institutional', 'departmental', 'project_based', 'research'
    ai_model_type VARCHAR(50) NOT NULL, -- 'tutor', 'assistant', 'specialist', 'custom'
    training_data_source VARCHAR(100), -- 'private_data', 'public_data', 'hybrid', 'synthetic'
    privacy_level VARCHAR(20) DEFAULT 'private', -- 'private', 'confidential', 'restricted', 'public'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'training', 'deployed', 'archived', 'error'
    model_configuration JSONB, -- AI model parameters and settings
    training_progress JSONB, -- Training status and metrics
    performance_metrics JSONB, -- Model performance data
    data_sources JSONB, -- Connected data sources
    access_permissions JSONB, -- Who can access this workspace
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deployed_at TIMESTAMP WITH TIME ZONE
);

-- Training Data and Datasets
CREATE TABLE IF NOT EXISTS training_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ai_workspaces(id) ON DELETE CASCADE,
    dataset_name VARCHAR(255) NOT NULL,
    description TEXT,
    data_type VARCHAR(50) NOT NULL, -- 'text', 'images', 'audio', 'video', 'structured', 'unstructured'
    file_format VARCHAR(20) NOT NULL, -- 'json', 'csv', 'txt', 'pdf', 'docx', 'mp4', 'wav'
    file_size_bytes BIGINT,
    record_count INTEGER,
    data_schema JSONB, -- Schema definition for structured data
    quality_score DECIMAL(3,2), -- Data quality assessment (0-1)
    privacy_compliance JSONB, -- Privacy and compliance information
    processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'ready', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Training Jobs
CREATE TABLE IF NOT EXISTS model_training_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ai_workspaces(id) ON DELETE CASCADE,
    job_name VARCHAR(255) NOT NULL,
    training_config JSONB, -- Training parameters and configuration
    dataset_ids UUID[], -- Array of training dataset IDs
    model_architecture JSONB, -- Neural network architecture
    hyperparameters JSONB, -- Learning rate, batch size, etc.
    status VARCHAR(20) DEFAULT 'queued', -- 'queued', 'running', 'completed', 'failed', 'cancelled'
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    current_epoch INTEGER DEFAULT 0,
    total_epochs INTEGER,
    training_metrics JSONB, -- Loss, accuracy, etc. over time
    validation_metrics JSONB, -- Validation performance
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployed AI Models
CREATE TABLE IF NOT EXISTS deployed_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ai_workspaces(id) ON DELETE CASCADE,
    training_job_id UUID REFERENCES model_training_jobs(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'tutor', 'assistant', 'specialist', 'custom'
    deployment_config JSONB, -- Deployment configuration
    api_endpoint VARCHAR(255), -- API endpoint for the deployed model
    status VARCHAR(20) DEFAULT 'deploying', -- 'deploying', 'active', 'inactive', 'error', 'updating'
    performance_metrics JSONB, -- Real-time performance data
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Model Inference Logs
CREATE TABLE IF NOT EXISTS model_inference_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES deployed_models(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    input_data JSONB, -- Input to the model
    output_data JSONB, -- Model output
    confidence_score DECIMAL(3,2), -- Model confidence in the output
    processing_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SDK AND DEVELOPER TOOLS TABLES
-- =====================================================

-- Developer Accounts and Organizations
CREATE TABLE IF NOT EXISTS developer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255),
    organization_type VARCHAR(50), -- 'individual', 'startup', 'enterprise', 'educational', 'nonprofit'
    website_url TEXT,
    description TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_documents JSONB, -- Uploaded verification documents
    api_quota_per_month INTEGER DEFAULT 10000,
    current_month_usage INTEGER DEFAULT 0,
    billing_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'basic', 'professional', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SDK Downloads and Usage
CREATE TABLE IF NOT EXISTS sdk_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES developer_accounts(id) ON DELETE CASCADE,
    sdk_name VARCHAR(100) NOT NULL, -- 'python', 'javascript', 'java', 'csharp', 'go'
    sdk_version VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'windows', 'macos', 'linux', 'web', 'mobile'
    download_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Documentation and Resources
CREATE TABLE IF NOT EXISTS developer_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(50) NOT NULL, -- 'documentation', 'tutorial', 'example', 'template', 'guide'
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_url TEXT,
    category VARCHAR(100) NOT NULL, -- 'getting_started', 'api_reference', 'tutorials', 'examples', 'best_practices'
    difficulty_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    tags TEXT[], -- Array of tags for categorization
    view_count INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ECOSYSTEM ANALYTICS TABLES
-- =====================================================

-- Platform Usage Analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL, -- 'api_calls', 'plugin_installs', 'model_training', 'user_engagement'
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(20), -- 'count', 'percentage', 'duration', 'size'
    dimension_data JSONB, -- Additional dimensions for the metric
    time_period VARCHAR(20) NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Engagement Metrics
CREATE TABLE IF NOT EXISTS developer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES developer_accounts(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'active_plugins', 'api_usage', 'downloads', 'revenue'
    metric_value DECIMAL(15,4) NOT NULL,
    time_period VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- AI Plugins indexes
CREATE INDEX IF NOT EXISTS idx_ai_plugins_status ON ai_plugins(status);
CREATE INDEX IF NOT EXISTS idx_ai_plugins_category ON ai_plugins(category);
CREATE INDEX IF NOT EXISTS idx_ai_plugins_developer ON ai_plugins(developer_id);
CREATE INDEX IF NOT EXISTS idx_ai_plugins_rating ON ai_plugins(rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_plugins_downloads ON ai_plugins(download_count DESC);

-- Plugin Installations indexes
CREATE INDEX IF NOT EXISTS idx_plugin_installations_plugin ON plugin_installations(plugin_id);
CREATE INDEX IF NOT EXISTS idx_plugin_installations_user ON plugin_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_plugin_installations_org ON plugin_installations(organization_id);

-- API Keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- API Usage Logs indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);

-- Platform Integrations indexes
CREATE INDEX IF NOT EXISTS idx_platform_integrations_type ON platform_integrations(platform_type);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_status ON platform_integrations(status);

-- AI Workspaces indexes
CREATE INDEX IF NOT EXISTS idx_ai_workspaces_org ON ai_workspaces(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_workspaces_status ON ai_workspaces(status);
CREATE INDEX IF NOT EXISTS idx_ai_workspaces_type ON ai_workspaces(workspace_type);

-- Training Datasets indexes
CREATE INDEX IF NOT EXISTS idx_training_datasets_workspace ON training_datasets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_training_datasets_type ON training_datasets(data_type);

-- Model Training Jobs indexes
CREATE INDEX IF NOT EXISTS idx_model_training_jobs_workspace ON model_training_jobs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_model_training_jobs_status ON model_training_jobs(status);

-- Deployed Models indexes
CREATE INDEX IF NOT EXISTS idx_deployed_models_workspace ON deployed_models(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deployed_models_status ON deployed_models(status);

-- Developer Accounts indexes
CREATE INDEX IF NOT EXISTS idx_developer_accounts_user ON developer_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_accounts_verification ON developer_accounts(verification_status);

-- Platform Analytics indexes
CREATE INDEX IF NOT EXISTS idx_platform_analytics_type ON platform_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_recorded ON platform_analytics(recorded_at);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE ai_plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_training_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployed_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_inference_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdk_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_metrics ENABLE ROW LEVEL SECURITY;

-- AI Plugins policies
CREATE POLICY "Public plugins are viewable by all users" ON ai_plugins
    FOR SELECT USING (is_public = true AND status = 'approved');

CREATE POLICY "Users can view their own plugins" ON ai_plugins
    FOR SELECT USING (auth.uid() = developer_id);

CREATE POLICY "Users can create plugins" ON ai_plugins
    FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Users can update their own plugins" ON ai_plugins
    FOR UPDATE USING (auth.uid() = developer_id);

-- Plugin Installations policies
CREATE POLICY "Users can view their own plugin installations" ON plugin_installations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can install plugins" ON plugin_installations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installations" ON plugin_installations
    FOR UPDATE USING (auth.uid() = user_id);

-- API Keys policies
CREATE POLICY "Users can view their own API keys" ON api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON api_keys
    FOR UPDATE USING (auth.uid() = user_id);

-- AI Workspaces policies
CREATE POLICY "Users can view workspaces they have access to" ON ai_workspaces
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM organization_members 
            WHERE organization_id = ai_workspaces.organization_id
        )
    );

CREATE POLICY "Organization members can create workspaces" ON ai_workspaces
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM organization_members 
            WHERE organization_id = ai_workspaces.organization_id
        )
    );

-- Developer Accounts policies
CREATE POLICY "Users can view their own developer account" ON developer_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create developer accounts" ON developer_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own developer account" ON developer_accounts
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS FOR OMNIMIND OS
-- =====================================================

-- Function to create a new AI plugin
CREATE OR REPLACE FUNCTION create_ai_plugin(
    p_name VARCHAR,
    p_description TEXT,
    p_plugin_type VARCHAR,
    p_category VARCHAR,
    p_developer_id UUID,
    p_capabilities JSONB
)
RETURNS UUID AS $$
DECLARE
    plugin_id UUID;
BEGIN
    INSERT INTO ai_plugins (
        name, description, plugin_type, category, developer_id, capabilities
    ) VALUES (
        p_name, p_description, p_plugin_type, p_category, p_developer_id, p_capabilities
    ) RETURNING id INTO plugin_id;
    
    RETURN plugin_id;
END;
$$ LANGUAGE plpgsql;

-- Function to install a plugin
CREATE OR REPLACE FUNCTION install_plugin(
    p_plugin_id UUID,
    p_user_id UUID,
    p_organization_id UUID,
    p_config JSONB
)
RETURNS UUID AS $$
DECLARE
    installation_id UUID;
BEGIN
    INSERT INTO plugin_installations (
        plugin_id, user_id, organization_id, installation_config
    ) VALUES (
        p_plugin_id, p_user_id, p_organization_id, p_config
    ) RETURNING id INTO installation_id;
    
    -- Update plugin download count
    UPDATE ai_plugins SET download_count = download_count + 1 WHERE id = p_plugin_id;
    
    RETURN installation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create an AI workspace
CREATE OR REPLACE FUNCTION create_ai_workspace(
    p_organization_id UUID,
    p_workspace_name VARCHAR,
    p_workspace_type VARCHAR,
    p_ai_model_type VARCHAR,
    p_privacy_level VARCHAR
)
RETURNS UUID AS $$
DECLARE
    workspace_id UUID;
BEGIN
    INSERT INTO ai_workspaces (
        organization_id, workspace_name, workspace_type, ai_model_type, privacy_level
    ) VALUES (
        p_organization_id, p_workspace_name, p_workspace_type, p_ai_model_type, p_privacy_level
    ) RETURNING id INTO workspace_id;
    
    RETURN workspace_id;
END;
$$ LANGUAGE plpgsql;

-- Function to start model training
CREATE OR REPLACE FUNCTION start_model_training(
    p_workspace_id UUID,
    p_job_name VARCHAR,
    p_training_config JSONB,
    p_dataset_ids UUID[]
)
RETURNS UUID AS $$
DECLARE
    job_id UUID;
BEGIN
    INSERT INTO model_training_jobs (
        workspace_id, job_name, training_config, dataset_ids, status
    ) VALUES (
        p_workspace_id, p_job_name, p_training_config, p_dataset_ids, 'queued'
    ) RETURNING id INTO job_id;
    
    RETURN job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get platform analytics
CREATE OR REPLACE FUNCTION get_platform_analytics(p_time_period VARCHAR DEFAULT 'daily')
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_plugins', (SELECT COUNT(*) FROM ai_plugins WHERE status = 'approved'),
        'total_installations', (SELECT COUNT(*) FROM plugin_installations),
        'active_workspaces', (SELECT COUNT(*) FROM ai_workspaces WHERE status = 'active'),
        'total_api_calls', (
            SELECT COUNT(*) FROM api_usage_logs 
            WHERE created_at >= NOW() - INTERVAL '1 day'
        ),
        'developer_count', (SELECT COUNT(*) FROM developer_accounts),
        'revenue_this_month', (
            SELECT COALESCE(SUM(price), 0) FROM ai_plugins 
            WHERE pricing_model != 'free' AND created_at >= DATE_TRUNC('month', NOW())
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample AI plugins
INSERT INTO ai_plugins (name, description, version, developer_id, plugin_type, category, capabilities, pricing_model, price) VALUES
('Math Tutor Pro', 'Advanced mathematics tutoring with step-by-step problem solving', '1.2.0', 
 (SELECT id FROM users LIMIT 1), 'learning_module', 'mathematics', 
 '{"problem_solving": true, "step_by_step": true, "visualization": true, "assessment": true}', 
 'subscription', 9.99),
('Chemistry Lab Simulator', 'Virtual chemistry experiments with realistic physics', '2.1.0',
 (SELECT id FROM users LIMIT 1), 'learning_module', 'science',
 '{"experiments": true, "safety_mode": true, "data_analysis": true, "report_generation": true}',
 'freemium', 0.00),
('Language Learning Assistant', 'AI-powered language learning with conversation practice', '1.5.0',
 (SELECT id FROM users LIMIT 1), 'learning_module', 'language',
 '{"conversation": true, "pronunciation": true, "grammar_check": true, "vocabulary": true}',
 'usage_based', 0.10),
('Code Review Bot', 'Automated code review and improvement suggestions', '3.0.0',
 (SELECT id FROM users LIMIT 1), 'assessment_tool', 'technology',
 '{"code_analysis": true, "bug_detection": true, "performance_optimization": true, "best_practices": true}',
 'subscription', 19.99);

-- Insert sample platform integrations
INSERT INTO platform_integrations (platform_name, platform_type, integration_type, configuration, status) VALUES
('Canvas LMS', 'lms', 'api', '{"base_url": "https://canvas.instructure.com", "version": "v1"}', 'active'),
('Moodle', 'lms', 'webhook', '{"webhook_url": "https://moodle.example.com/webhook", "events": ["course_completed", "grade_updated"]}', 'active'),
('Workday Learning', 'hr_system', 'sso', '{"sso_provider": "saml", "entity_id": "workday-learning"}', 'active'),
('Salesforce Trailhead', 'corporate_training', 'api', '{"base_url": "https://api.trailhead.com", "version": "v2"}', 'active');

-- Insert sample AI workspaces
INSERT INTO ai_workspaces (organization_id, workspace_name, workspace_type, ai_model_type, privacy_level, status) VALUES
((SELECT id FROM organizations LIMIT 1), 'University Math Department AI', 'institutional', 'tutor', 'private', 'active'),
((SELECT id FROM organizations LIMIT 1), 'Corporate Training Assistant', 'departmental', 'assistant', 'confidential', 'active'),
((SELECT id FROM organizations LIMIT 1), 'Research AI Lab', 'research', 'custom', 'restricted', 'training');

-- Insert sample developer resources
INSERT INTO developer_resources (resource_type, title, content, category, difficulty_level, tags) VALUES
('documentation', 'Getting Started with OmniMind SDK', 'Complete guide to building your first AI learning module', 'getting_started', 'beginner', '{"sdk", "tutorial", "beginner"}'),
('tutorial', 'Building a Math Plugin', 'Step-by-step tutorial for creating a mathematics learning plugin', 'tutorials', 'intermediate', '{"math", "plugin", "tutorial"}'),
('example', 'Chemistry Lab Integration', 'Example code for integrating with virtual chemistry labs', 'examples', 'advanced', '{"chemistry", "integration", "example"}'),
('guide', 'API Rate Limiting Best Practices', 'Guide to implementing proper rate limiting in your integrations', 'best_practices', 'intermediate', '{"api", "rate_limiting", "best_practices"}');