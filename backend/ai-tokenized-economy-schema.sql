-- AI Tokenized Learning Economy Database Schema
-- This schema supports Web3 learning economy with tokens, credentials, and smart contracts

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Learning Tokens Table
CREATE TABLE learning_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token_type VARCHAR(50) NOT NULL CHECK (token_type IN ('OMNI', 'SKILL', 'ACHIEVEMENT', 'PARTICIPATION')),
    amount DECIMAL(18,8) NOT NULL DEFAULT 0,
    earned_from VARCHAR(100) NOT NULL, -- 'lesson_completion', 'quiz_perfect', 'project_submission', 'peer_help', 'ai_interaction'
    learning_milestone_id UUID,
    transaction_hash VARCHAR(66), -- Blockchain transaction hash
    block_number BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_spent BOOLEAN DEFAULT FALSE,
    spent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. AI Credential Blockchain Table
CREATE TABLE ai_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    credential_type VARCHAR(100) NOT NULL, -- 'skill_mastery', 'course_completion', 'project_certification', 'ai_verified_skill'
    skill_name VARCHAR(200) NOT NULL,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'master')),
    verification_method VARCHAR(100) NOT NULL, -- 'ai_assessment', 'peer_review', 'project_evaluation', 'exam_score'
    verification_score DECIMAL(5,2) NOT NULL CHECK (verification_score >= 0 AND verification_score <= 100),
    credential_hash VARCHAR(66) NOT NULL UNIQUE, -- Blockchain hash for immutability
    blockchain_network VARCHAR(50) DEFAULT 'polygon', -- 'ethereum', 'polygon', 'arbitrum', 'optimism'
    contract_address VARCHAR(42), -- Smart contract address
    token_id BIGINT, -- NFT token ID if applicable
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Global Scholarship Pool Table
CREATE TABLE scholarship_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_name VARCHAR(200) NOT NULL,
    pool_type VARCHAR(50) NOT NULL CHECK (pool_type IN ('micro_scholarship', 'merit_based', 'need_based', 'ai_recommended', 'community_voted')),
    total_amount DECIMAL(18,8) NOT NULL,
    available_amount DECIMAL(18,8) NOT NULL,
    token_type VARCHAR(50) NOT NULL DEFAULT 'OMNI',
    smart_contract_address VARCHAR(42),
    distribution_algorithm VARCHAR(100) NOT NULL, -- 'ai_optimized', 'merit_ranking', 'random_lottery', 'community_consensus'
    min_eligibility_score DECIMAL(5,2) DEFAULT 0,
    max_recipients INTEGER,
    distribution_frequency VARCHAR(50) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'quarterly'
    last_distribution TIMESTAMP WITH TIME ZONE,
    next_distribution TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Scholarship Distributions Table
CREATE TABLE scholarship_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID NOT NULL REFERENCES scholarship_pool(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    distribution_reason TEXT NOT NULL,
    ai_recommendation_score DECIMAL(5,2),
    merit_score DECIMAL(5,2),
    need_score DECIMAL(5,2),
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    distributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Smart Contracts Table
CREATE TABLE smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_name VARCHAR(200) NOT NULL,
    contract_type VARCHAR(100) NOT NULL, -- 'token_distribution', 'credential_verification', 'scholarship_pool', 'governance'
    network VARCHAR(50) NOT NULL,
    contract_address VARCHAR(42) NOT NULL UNIQUE,
    abi JSONB NOT NULL,
    bytecode TEXT,
    deployment_tx_hash VARCHAR(66),
    deployment_block BIGINT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. Learning Milestones Table
CREATE TABLE learning_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    milestone_type VARCHAR(100) NOT NULL, -- 'lesson_completion', 'quiz_perfect', 'project_submission', 'skill_mastery', 'streak_achievement'
    milestone_name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50) NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
    token_reward DECIMAL(18,8) NOT NULL DEFAULT 0,
    skill_points INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verification_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Token Transactions Table
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID,
    to_user_id UUID NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earn', 'spend', 'transfer', 'reward', 'penalty', 'refund')),
    purpose VARCHAR(200) NOT NULL,
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    gas_fee DECIMAL(18,8),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. AI Economy Analytics Table
CREATE TABLE ai_economy_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(18,8) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'total_tokens', 'active_users', 'credential_issuance', 'scholarship_distributed'
    time_period VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_learning_tokens_user_id ON learning_tokens(user_id);
CREATE INDEX idx_learning_tokens_type ON learning_tokens(token_type);
CREATE INDEX idx_learning_tokens_earned_from ON learning_tokens(earned_from);
CREATE INDEX idx_learning_tokens_created_at ON learning_tokens(created_at);

CREATE INDEX idx_ai_credentials_user_id ON ai_credentials(user_id);
CREATE INDEX idx_ai_credentials_type ON ai_credentials(credential_type);
CREATE INDEX idx_ai_credentials_skill_name ON ai_credentials(skill_name);
CREATE INDEX idx_ai_credentials_hash ON ai_credentials(credential_hash);
CREATE INDEX idx_ai_credentials_issued_at ON ai_credentials(issued_at);

CREATE INDEX idx_scholarship_pool_type ON scholarship_pool(pool_type);
CREATE INDEX idx_scholarship_pool_active ON scholarship_pool(is_active);
CREATE INDEX idx_scholarship_pool_next_distribution ON scholarship_pool(next_distribution);

CREATE INDEX idx_scholarship_distributions_pool_id ON scholarship_distributions(pool_id);
CREATE INDEX idx_scholarship_distributions_recipient_id ON scholarship_distributions(recipient_id);
CREATE INDEX idx_scholarship_distributions_distributed_at ON scholarship_distributions(distributed_at);

CREATE INDEX idx_smart_contracts_network ON smart_contracts(network);
CREATE INDEX idx_smart_contracts_type ON smart_contracts(contract_type);
CREATE INDEX idx_smart_contracts_address ON smart_contracts(contract_address);

CREATE INDEX idx_learning_milestones_user_id ON learning_milestones(user_id);
CREATE INDEX idx_learning_milestones_type ON learning_milestones(milestone_type);
CREATE INDEX idx_learning_milestones_completed_at ON learning_milestones(completed_at);

CREATE INDEX idx_token_transactions_from_user ON token_transactions(from_user_id);
CREATE INDEX idx_token_transactions_to_user ON token_transactions(to_user_id);
CREATE INDEX idx_token_transactions_type ON token_transactions(transaction_type);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);

CREATE INDEX idx_ai_economy_analytics_metric ON ai_economy_analytics(metric_name);
CREATE INDEX idx_ai_economy_analytics_period ON ai_economy_analytics(time_period);
CREATE INDEX idx_ai_economy_analytics_recorded_at ON ai_economy_analytics(recorded_at);

-- Enable Row Level Security
ALTER TABLE learning_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_economy_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own learning tokens" ON learning_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own credentials" ON ai_credentials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public scholarship pools" ON scholarship_pool
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can view their own distributions" ON scholarship_distributions
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can view public smart contracts" ON smart_contracts
    FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Users can view their own milestones" ON learning_milestones
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON token_transactions
    FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can view public analytics" ON ai_economy_analytics
    FOR SELECT USING (true);

-- Functions for core operations
CREATE OR REPLACE FUNCTION create_learning_milestone(
    p_user_id UUID,
    p_milestone_type VARCHAR(100),
    p_milestone_name VARCHAR(200),
    p_description TEXT,
    p_difficulty_level VARCHAR(50),
    p_token_reward DECIMAL(18,8),
    p_skill_points INTEGER,
    p_verification_data JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    milestone_id UUID;
BEGIN
    INSERT INTO learning_milestones (
        user_id, milestone_type, milestone_name, description,
        difficulty_level, token_reward, skill_points, verification_data
    ) VALUES (
        p_user_id, p_milestone_type, p_milestone_name, p_description,
        p_difficulty_level, p_token_reward, p_skill_points, p_verification_data
    ) RETURNING id INTO milestone_id;
    
    -- Award tokens for milestone completion
    INSERT INTO learning_tokens (
        user_id, token_type, amount, earned_from, learning_milestone_id
    ) VALUES (
        p_user_id, 'OMNI', p_token_reward, p_milestone_type, milestone_id
    );
    
    RETURN milestone_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION issue_ai_credential(
    p_user_id UUID,
    p_credential_type VARCHAR(100),
    p_skill_name VARCHAR(200),
    p_skill_level VARCHAR(50),
    p_verification_method VARCHAR(100),
    p_verification_score DECIMAL(5,2),
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    credential_id UUID;
    credential_hash VARCHAR(66);
BEGIN
    -- Generate unique credential hash
    credential_hash := encode(sha256(concat(
        p_user_id::text, p_credential_type, p_skill_name, p_skill_level,
        p_verification_score::text, NOW()::text
    )::bytea), 'hex');
    
    INSERT INTO ai_credentials (
        user_id, credential_type, skill_name, skill_level,
        verification_method, verification_score, credential_hash, metadata
    ) VALUES (
        p_user_id, p_credential_type, p_skill_name, p_skill_level,
        p_verification_method, p_verification_score, credential_hash, p_metadata
    ) RETURNING id INTO credential_id;
    
    RETURN credential_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION distribute_scholarship(
    p_pool_id UUID,
    p_recipient_id UUID,
    p_amount DECIMAL(18,8),
    p_reason TEXT,
    p_ai_score DECIMAL(5,2) DEFAULT NULL,
    p_merit_score DECIMAL(5,2) DEFAULT NULL,
    p_need_score DECIMAL(5,2) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    distribution_id UUID;
    current_available DECIMAL(18,8);
BEGIN
    -- Check pool availability
    SELECT available_amount INTO current_available
    FROM scholarship_pool WHERE id = p_pool_id AND is_active = TRUE;
    
    IF current_available < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds in scholarship pool';
    END IF;
    
    -- Create distribution record
    INSERT INTO scholarship_distributions (
        pool_id, recipient_id, amount, distribution_reason,
        ai_recommendation_score, merit_score, need_score
    ) VALUES (
        p_pool_id, p_recipient_id, p_amount, p_reason,
        p_ai_score, p_merit_score, p_need_score
    ) RETURNING id INTO distribution_id;
    
    -- Update pool available amount
    UPDATE scholarship_pool 
    SET available_amount = available_amount - p_amount,
        updated_at = NOW()
    WHERE id = p_pool_id;
    
    -- Award tokens to recipient
    INSERT INTO learning_tokens (
        user_id, token_type, amount, earned_from
    ) VALUES (
        p_recipient_id, 'OMNI', p_amount, 'scholarship_distribution'
    );
    
    RETURN distribution_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_token_balance(
    p_user_id UUID,
    p_token_type VARCHAR(50) DEFAULT 'OMNI'
) RETURNS DECIMAL(18,8) AS $$
DECLARE
    total_earned DECIMAL(18,8) := 0;
    total_spent DECIMAL(18,8) := 0;
    balance DECIMAL(18,8);
BEGIN
    -- Calculate total earned
    SELECT COALESCE(SUM(amount), 0) INTO total_earned
    FROM learning_tokens
    WHERE user_id = p_user_id 
    AND token_type = p_token_type
    AND is_spent = FALSE;
    
    -- Calculate total spent
    SELECT COALESCE(SUM(amount), 0) INTO total_spent
    FROM token_transactions
    WHERE to_user_id = p_user_id
    AND transaction_type = 'spend'
    AND status = 'confirmed';
    
    balance := total_earned - total_spent;
    RETURN balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data
INSERT INTO scholarship_pool (
    pool_name, pool_type, total_amount, available_amount, token_type,
    distribution_algorithm, min_eligibility_score, max_recipients, created_by
) VALUES 
('AI Learning Excellence Fund', 'merit_based', 1000000.0, 1000000.0, 'OMNI',
 'ai_optimized', 80.0, 100, uuid_generate_v4()),
('Community Support Pool', 'need_based', 500000.0, 500000.0, 'OMNI',
 'ai_optimized', 60.0, 200, uuid_generate_v4()),
('Innovation Challenge Fund', 'ai_recommended', 750000.0, 750000.0, 'OMNI',
 'ai_optimized', 85.0, 50, uuid_generate_v4());

INSERT INTO smart_contracts (
    contract_name, contract_type, network, contract_address, abi, is_verified
) VALUES 
('OmniMind Token Contract', 'token_distribution', 'polygon', '0x1234567890123456789012345678901234567890',
 '{"name": "OmniMindToken", "abi": [...]}', true),
('Credential Verification Contract', 'credential_verification', 'polygon', '0x2345678901234567890123456789012345678901',
 '{"name": "CredentialVerifier", "abi": [...]}', true),
('Scholarship Distribution Contract', 'scholarship_pool', 'polygon', '0x3456789012345678901234567890123456789012',
 '{"name": "ScholarshipPool", "abi": [...]}', true);

-- Analytics sample data
INSERT INTO ai_economy_analytics (metric_name, metric_value, metric_type, time_period) VALUES
('Total Tokens in Circulation', 5000000.0, 'total_tokens', 'monthly'),
('Active Token Holders', 15420.0, 'active_users', 'monthly'),
('Credentials Issued', 8945.0, 'credential_issuance', 'monthly'),
('Scholarships Distributed', 1250.0, 'scholarship_distributed', 'monthly'),
('Average Token Balance', 324.5, 'average_balance', 'monthly'),
('Token Transaction Volume', 250000.0, 'transaction_volume', 'monthly');
