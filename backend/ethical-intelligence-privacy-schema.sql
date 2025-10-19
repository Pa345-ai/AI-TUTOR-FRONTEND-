-- Ethical Intelligence + Privacy Core Database Schema
-- This schema supports privacy-preserving AI, transparent reasoning, and fairness

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Privacy-Preserving AI (Zero-Knowledge Learning) Table
CREATE TABLE privacy_preserving_ai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    model_id VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('federated', 'differential_privacy', 'homomorphic', 'secure_multiparty', 'zero_knowledge')),
    privacy_level VARCHAR(50) NOT NULL CHECK (privacy_level IN ('minimal', 'standard', 'high', 'maximum')),
    data_anonymization_method VARCHAR(100) NOT NULL, -- 'k_anonymity', 'l_diversity', 't_closeness', 'differential_privacy'
    encryption_type VARCHAR(50) NOT NULL, -- 'AES-256', 'RSA-4096', 'homomorphic', 'zero_knowledge_proof'
    local_training_enabled BOOLEAN DEFAULT TRUE,
    federated_learning_enabled BOOLEAN DEFAULT FALSE,
    differential_privacy_epsilon DECIMAL(10,6) DEFAULT 1.0, -- Privacy budget
    noise_level DECIMAL(10,6) DEFAULT 0.1, -- Noise added for privacy
    data_retention_days INTEGER DEFAULT 30,
    consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMP WITH TIME ZONE,
    data_processing_purpose TEXT NOT NULL,
    third_party_sharing BOOLEAN DEFAULT FALSE,
    cross_border_transfer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Transparent AI Reasoning Reports Table
CREATE TABLE ai_reasoning_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID NOT NULL,
    ai_model_id VARCHAR(100) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('question_answer', 'feedback', 'recommendation', 'assessment', 'explanation')),
    input_data JSONB NOT NULL,
    ai_response TEXT NOT NULL,
    reasoning_steps JSONB NOT NULL, -- Step-by-step reasoning process
    confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    uncertainty_factors JSONB DEFAULT '[]'::jsonb, -- Areas of uncertainty
    data_sources JSONB DEFAULT '[]'::jsonb, -- Sources used for reasoning
    assumptions_made JSONB DEFAULT '[]'::jsonb, -- Assumptions in reasoning
    alternative_explanations JSONB DEFAULT '[]'::jsonb, -- Other possible explanations
    bias_checks JSONB DEFAULT '{}'::jsonb, -- Bias detection results
    fairness_metrics JSONB DEFAULT '{}'::jsonb, -- Fairness assessment
    transparency_score DECIMAL(5,2) DEFAULT 0, -- Overall transparency rating
    user_understanding_score DECIMAL(5,2) DEFAULT 0, -- How well user understood
    feedback_provided BOOLEAN DEFAULT FALSE,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. AI Fairness Engine Table
CREATE TABLE ai_fairness_engine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(100) NOT NULL,
    fairness_metric VARCHAR(100) NOT NULL, -- 'demographic_parity', 'equalized_odds', 'equal_opportunity', 'calibration'
    protected_attribute VARCHAR(50) NOT NULL, -- 'gender', 'ethnicity', 'age', 'language', 'socioeconomic'
    attribute_value VARCHAR(100) NOT NULL, -- Specific value of protected attribute
    metric_value DECIMAL(10,6) NOT NULL, -- Fairness metric score
    threshold_value DECIMAL(10,6) NOT NULL, -- Acceptable threshold
    is_fair BOOLEAN NOT NULL, -- Whether this group meets fairness criteria
    sample_size INTEGER NOT NULL,
    confidence_interval_lower DECIMAL(10,6),
    confidence_interval_upper DECIMAL(10,6),
    statistical_significance DECIMAL(10,6), -- P-value
    bias_detected BOOLEAN DEFAULT FALSE,
    bias_severity VARCHAR(20) CHECK (bias_severity IN ('low', 'medium', 'high', 'critical')),
    mitigation_strategy TEXT,
    mitigation_applied BOOLEAN DEFAULT FALSE,
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_check TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Privacy Consent Management Table
CREATE TABLE privacy_consent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('data_collection', 'data_processing', 'data_sharing', 'ai_training', 'analytics', 'marketing')),
    purpose TEXT NOT NULL,
    data_categories JSONB NOT NULL, -- Types of data collected
    processing_methods JSONB NOT NULL, -- How data will be processed
    retention_period INTEGER NOT NULL, -- Days to retain data
    third_party_sharing BOOLEAN DEFAULT FALSE,
    third_parties JSONB DEFAULT '[]'::jsonb, -- List of third parties
    cross_border_transfer BOOLEAN DEFAULT FALSE,
    countries JSONB DEFAULT '[]'::jsonb, -- Countries data may be transferred to
    consent_given BOOLEAN NOT NULL,
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consent_method VARCHAR(50) NOT NULL, -- 'explicit', 'opt_in', 'opt_out', 'implied'
    withdrawal_timestamp TIMESTAMP WITH TIME ZONE,
    withdrawal_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(10) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Data Anonymization Log Table
CREATE TABLE data_anonymization_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    original_data_hash VARCHAR(64) NOT NULL, -- SHA-256 of original data
    anonymized_data_hash VARCHAR(64) NOT NULL, -- SHA-256 of anonymized data
    anonymization_method VARCHAR(100) NOT NULL,
    privacy_level VARCHAR(50) NOT NULL,
    k_anonymity_value INTEGER, -- For k-anonymity
    l_diversity_value INTEGER, -- For l-diversity
    t_closeness_value DECIMAL(10,6), -- For t-closeness
    noise_added DECIMAL(10,6), -- Amount of noise added
    information_loss DECIMAL(5,2), -- Percentage of information lost
    utility_score DECIMAL(5,2), -- Utility of anonymized data
    anonymized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. Bias Detection Results Table
CREATE TABLE bias_detection_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(100) NOT NULL,
    test_dataset_id VARCHAR(100) NOT NULL,
    protected_attribute VARCHAR(50) NOT NULL,
    bias_type VARCHAR(100) NOT NULL, -- 'statistical_parity', 'equalized_odds', 'calibration', 'representation'
    bias_score DECIMAL(10,6) NOT NULL, -- -1 to 1, where 0 is no bias
    bias_direction VARCHAR(20) CHECK (bias_direction IN ('positive', 'negative', 'neutral')),
    affected_groups JSONB NOT NULL, -- Groups affected by bias
    sample_sizes JSONB NOT NULL, -- Sample sizes for each group
    statistical_significance DECIMAL(10,6), -- P-value
    confidence_level DECIMAL(5,2) DEFAULT 95.0,
    detection_method VARCHAR(100) NOT NULL, -- 'statistical_test', 'machine_learning', 'human_evaluation'
    mitigation_suggestions JSONB DEFAULT '[]'::jsonb,
    severity_level VARCHAR(20) CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    requires_immediate_action BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by VARCHAR(100),
    review_timestamp TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'detected' CHECK (status IN ('detected', 'reviewing', 'mitigating', 'resolved', 'false_positive')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Transparency Metrics Table
CREATE TABLE transparency_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL, -- 'explainability', 'interpretability', 'auditability', 'reproducibility'
    metric_value DECIMAL(5,2) NOT NULL CHECK (metric_value >= 0 AND metric_value <= 100),
    measurement_method VARCHAR(100) NOT NULL,
    evaluation_dataset VARCHAR(100),
    human_evaluators INTEGER DEFAULT 0,
    automated_score DECIMAL(5,2),
    human_score DECIMAL(5,2),
    inter_rater_reliability DECIMAL(5,2), -- For human evaluations
    confidence_interval DECIMAL(5,2),
    measurement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_measurement TIMESTAMP WITH TIME ZONE,
    is_compliant BOOLEAN DEFAULT FALSE,
    compliance_standard VARCHAR(100), -- 'GDPR', 'CCPA', 'AI_Act', 'ISO_23053'
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. Ethical AI Audit Trail Table
CREATE TABLE ethical_ai_audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(100) NOT NULL,
    audit_type VARCHAR(50) NOT NULL CHECK (audit_type IN ('bias_check', 'fairness_assessment', 'privacy_review', 'transparency_evaluation', 'compliance_check')),
    audit_scope JSONB NOT NULL, -- What was audited
    audit_method VARCHAR(100) NOT NULL, -- How the audit was conducted
    auditor_id VARCHAR(100) NOT NULL, -- Who conducted the audit
    findings JSONB DEFAULT '[]'::jsonb, -- Audit findings
    recommendations JSONB DEFAULT '[]'::jsonb, -- Recommendations
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    compliance_status VARCHAR(20) CHECK (compliance_status IN ('compliant', 'non_compliant', 'partially_compliant', 'needs_review')),
    corrective_actions JSONB DEFAULT '[]'::jsonb, -- Actions taken
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    audit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_audit_date TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_privacy_preserving_ai_user_id ON privacy_preserving_ai(user_id);
CREATE INDEX idx_privacy_preserving_ai_model_id ON privacy_preserving_ai(model_id);
CREATE INDEX idx_privacy_preserving_ai_privacy_level ON privacy_preserving_ai(privacy_level);

CREATE INDEX idx_ai_reasoning_reports_user_id ON ai_reasoning_reports(user_id);
CREATE INDEX idx_ai_reasoning_reports_session_id ON ai_reasoning_reports(session_id);
CREATE INDEX idx_ai_reasoning_reports_model_id ON ai_reasoning_reports(ai_model_id);
CREATE INDEX idx_ai_reasoning_reports_generated_at ON ai_reasoning_reports(generated_at);

CREATE INDEX idx_ai_fairness_engine_model_id ON ai_fairness_engine(model_id);
CREATE INDEX idx_ai_fairness_engine_protected_attribute ON ai_fairness_engine(protected_attribute);
CREATE INDEX idx_ai_fairness_engine_is_fair ON ai_fairness_engine(is_fair);
CREATE INDEX idx_ai_fairness_engine_last_checked ON ai_fairness_engine(last_checked);

CREATE INDEX idx_privacy_consent_user_id ON privacy_consent(user_id);
CREATE INDEX idx_privacy_consent_consent_type ON privacy_consent(consent_type);
CREATE INDEX idx_privacy_consent_is_active ON privacy_consent(is_active);
CREATE INDEX idx_privacy_consent_consent_timestamp ON privacy_consent(consent_timestamp);

CREATE INDEX idx_data_anonymization_log_user_id ON data_anonymization_log(user_id);
CREATE INDEX idx_data_anonymization_log_anonymized_at ON data_anonymization_log(anonymized_at);

CREATE INDEX idx_bias_detection_results_model_id ON bias_detection_results(model_id);
CREATE INDEX idx_bias_detection_results_protected_attribute ON bias_detection_results(protected_attribute);
CREATE INDEX idx_bias_detection_results_severity_level ON bias_detection_results(severity_level);
CREATE INDEX idx_bias_detection_results_detected_at ON bias_detection_results(detected_at);

CREATE INDEX idx_transparency_metrics_model_id ON transparency_metrics(model_id);
CREATE INDEX idx_transparency_metrics_metric_name ON transparency_metrics(metric_name);
CREATE INDEX idx_transparency_metrics_measurement_date ON transparency_metrics(measurement_date);

CREATE INDEX idx_ethical_ai_audit_trail_model_id ON ethical_ai_audit_trail(model_id);
CREATE INDEX idx_ethical_ai_audit_trail_audit_type ON ethical_ai_audit_trail(audit_type);
CREATE INDEX idx_ethical_ai_audit_trail_audit_date ON ethical_ai_audit_trail(audit_date);

-- Enable Row Level Security
ALTER TABLE privacy_preserving_ai ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reasoning_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_fairness_engine ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_anonymization_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE bias_detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ethical_ai_audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own privacy settings" ON privacy_preserving_ai
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reasoning reports" ON ai_reasoning_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public fairness metrics" ON ai_fairness_engine
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own consent records" ON privacy_consent
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own anonymization logs" ON data_anonymization_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public bias detection results" ON bias_detection_results
    FOR SELECT USING (true);

CREATE POLICY "Users can view public transparency metrics" ON transparency_metrics
    FOR SELECT USING (true);

CREATE POLICY "Users can view public audit trails" ON ethical_ai_audit_trail
    FOR SELECT USING (true);

-- Functions for core operations
CREATE OR REPLACE FUNCTION create_privacy_consent(
    p_user_id UUID,
    p_consent_type VARCHAR(50),
    p_purpose TEXT,
    p_data_categories JSONB,
    p_processing_methods JSONB,
    p_retention_period INTEGER,
    p_consent_given BOOLEAN,
    p_consent_method VARCHAR(50)
) RETURNS UUID AS $$
DECLARE
    consent_id UUID;
BEGIN
    INSERT INTO privacy_consent (
        user_id, consent_type, purpose, data_categories, processing_methods,
        retention_period, consent_given, consent_method
    ) VALUES (
        p_user_id, p_consent_type, p_purpose, p_data_categories, p_processing_methods,
        p_retention_period, p_consent_given, p_consent_method
    ) RETURNING id INTO consent_id;
    
    RETURN consent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_ai_reasoning_report(
    p_user_id UUID,
    p_session_id UUID,
    p_ai_model_id VARCHAR(100),
    p_interaction_type VARCHAR(50),
    p_input_data JSONB,
    p_ai_response TEXT,
    p_reasoning_steps JSONB,
    p_confidence_score DECIMAL(5,2)
) RETURNS UUID AS $$
DECLARE
    report_id UUID;
BEGIN
    INSERT INTO ai_reasoning_reports (
        user_id, session_id, ai_model_id, interaction_type,
        input_data, ai_response, reasoning_steps, confidence_score
    ) VALUES (
        p_user_id, p_session_id, p_ai_model_id, p_interaction_type,
        p_input_data, p_ai_response, p_reasoning_steps, p_confidence_score
    ) RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_ai_fairness(
    p_model_id VARCHAR(100),
    p_protected_attribute VARCHAR(50),
    p_attribute_value VARCHAR(100)
) RETURNS BOOLEAN AS $$
DECLARE
    fairness_result BOOLEAN;
    metric_value DECIMAL(10,6);
    threshold_value DECIMAL(10,6);
BEGIN
    SELECT metric_value, threshold_value INTO metric_value, threshold_value
    FROM ai_fairness_engine
    WHERE model_id = p_model_id 
    AND protected_attribute = p_protected_attribute 
    AND attribute_value = p_attribute_value
    ORDER BY last_checked DESC
    LIMIT 1;
    
    IF metric_value IS NULL THEN
        RETURN NULL; -- No data available
    END IF;
    
    fairness_result := (metric_value >= threshold_value);
    RETURN fairness_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION anonymize_user_data(
    p_user_id UUID,
    p_original_data_hash VARCHAR(64),
    p_anonymization_method VARCHAR(100),
    p_privacy_level VARCHAR(50)
) RETURNS UUID AS $$
DECLARE
    anonymization_id UUID;
    anonymized_hash VARCHAR(64);
BEGIN
    -- Generate anonymized data hash (in real implementation, this would be actual anonymization)
    anonymized_hash := encode(sha256(concat(p_original_data_hash, p_anonymization_method, NOW()::text)::bytea), 'hex');
    
    INSERT INTO data_anonymization_log (
        user_id, original_data_hash, anonymized_data_hash,
        anonymization_method, privacy_level
    ) VALUES (
        p_user_id, p_original_data_hash, anonymized_hash,
        p_anonymization_method, p_privacy_level
    ) RETURNING id INTO anonymization_id;
    
    RETURN anonymization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_privacy_score(
    p_user_id UUID
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    privacy_score DECIMAL(5,2) := 0;
    total_checks INTEGER := 0;
    passed_checks INTEGER := 0;
BEGIN
    -- Check privacy-preserving AI settings
    SELECT COUNT(*) INTO total_checks
    FROM privacy_preserving_ai
    WHERE user_id = p_user_id;
    
    SELECT COUNT(*) INTO passed_checks
    FROM privacy_preserving_ai
    WHERE user_id = p_user_id 
    AND privacy_level IN ('high', 'maximum')
    AND consent_given = TRUE;
    
    -- Check consent management
    SELECT COUNT(*) + total_checks INTO total_checks
    FROM privacy_consent
    WHERE user_id = p_user_id;
    
    SELECT COUNT(*) + passed_checks INTO passed_checks
    FROM privacy_consent
    WHERE user_id = p_user_id 
    AND consent_given = TRUE
    AND is_active = TRUE;
    
    IF total_checks > 0 THEN
        privacy_score := (passed_checks::DECIMAL / total_checks::DECIMAL) * 100;
    END IF;
    
    RETURN privacy_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data
INSERT INTO privacy_preserving_ai (
    user_id, model_id, model_type, privacy_level, data_anonymization_method,
    encryption_type, local_training_enabled, federated_learning_enabled,
    differential_privacy_epsilon, data_retention_days, consent_given,
    data_processing_purpose
) VALUES 
(uuid_generate_v4(), 'omnimind-v1', 'federated', 'high', 'differential_privacy',
 'AES-256', true, true, 0.5, 30, true, 'Personalized learning recommendations'),
(uuid_generate_v4(), 'omnimind-v1', 'differential_privacy', 'maximum', 'differential_privacy',
 'homomorphic', true, false, 0.1, 7, true, 'Learning analytics and progress tracking'),
(uuid_generate_v4(), 'omnimind-v1', 'zero_knowledge', 'maximum', 'k_anonymity',
 'zero_knowledge_proof', true, true, 0.01, 1, true, 'Assessment and evaluation');

INSERT INTO ai_fairness_engine (
    model_id, fairness_metric, protected_attribute, attribute_value,
    metric_value, threshold_value, is_fair, sample_size, bias_detected
) VALUES 
('omnimind-v1', 'demographic_parity', 'gender', 'female', 0.85, 0.80, true, 5000, false),
('omnimind-v1', 'demographic_parity', 'gender', 'male', 0.87, 0.80, true, 5200, false),
('omnimind-v1', 'demographic_parity', 'gender', 'non_binary', 0.82, 0.80, true, 300, false),
('omnimind-v1', 'equalized_odds', 'ethnicity', 'white', 0.88, 0.85, true, 4000, false),
('omnimind-v1', 'equalized_odds', 'ethnicity', 'black', 0.86, 0.85, true, 2000, false),
('omnimind-v1', 'equalized_odds', 'ethnicity', 'hispanic', 0.84, 0.85, false, 1500, true),
('omnimind-v1', 'equalized_odds', 'ethnicity', 'asian', 0.90, 0.85, true, 1800, false);

INSERT INTO transparency_metrics (
    model_id, metric_name, metric_value, measurement_method, is_compliant, compliance_standard
) VALUES 
('omnimind-v1', 'explainability', 92.5, 'LIME_SHAP_analysis', true, 'GDPR'),
('omnimind-v1', 'interpretability', 88.0, 'human_evaluation', true, 'AI_Act'),
('omnimind-v1', 'auditability', 95.0, 'automated_testing', true, 'ISO_23053'),
('omnimind-v1', 'reproducibility', 90.0, 'cross_validation', true, 'GDPR');

INSERT INTO ethical_ai_audit_trail (
    model_id, audit_type, audit_scope, audit_method, auditor_id,
    risk_level, compliance_status, audit_date
) VALUES 
('omnimind-v1', 'bias_check', '{"protected_attributes": ["gender", "ethnicity", "age"]}', 'statistical_analysis', 'audit_system_v1',
 'low', 'compliant', NOW() - INTERVAL '7 days'),
('omnimind-v1', 'fairness_assessment', '{"metrics": ["demographic_parity", "equalized_odds"]}', 'automated_testing', 'fairness_engine_v1',
 'low', 'compliant', NOW() - INTERVAL '3 days'),
('omnimind-v1', 'privacy_review', '{"data_types": ["learning_data", "assessment_results"]}', 'privacy_impact_assessment', 'privacy_officer_001',
 'medium', 'partially_compliant', NOW() - INTERVAL '1 day');
