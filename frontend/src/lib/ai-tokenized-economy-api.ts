import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface LearningToken {
  id: string;
  user_id: string;
  token_type: 'OMNI' | 'SKILL' | 'ACHIEVEMENT' | 'PARTICIPATION';
  amount: number;
  earned_from: string;
  learning_milestone_id?: string;
  transaction_hash?: string;
  block_number?: number;
  created_at: string;
  expires_at?: string;
  is_spent: boolean;
  spent_at?: string;
  metadata: any;
}

export interface AICredential {
  id: string;
  user_id: string;
  credential_type: string;
  skill_name: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  verification_method: string;
  verification_score: number;
  credential_hash: string;
  blockchain_network: string;
  contract_address?: string;
  token_id?: number;
  issued_at: string;
  expires_at?: string;
  is_revoked: boolean;
  revoked_at?: string;
  revoked_reason?: string;
  metadata: any;
}

export interface ScholarshipPool {
  id: string;
  pool_name: string;
  pool_type: 'micro_scholarship' | 'merit_based' | 'need_based' | 'ai_recommended' | 'community_voted';
  total_amount: number;
  available_amount: number;
  token_type: string;
  smart_contract_address?: string;
  distribution_algorithm: string;
  min_eligibility_score: number;
  max_recipients: number;
  distribution_frequency: string;
  last_distribution?: string;
  next_distribution?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export interface ScholarshipDistribution {
  id: string;
  pool_id: string;
  recipient_id: string;
  amount: number;
  distribution_reason: string;
  ai_recommendation_score?: number;
  merit_score?: number;
  need_score?: number;
  transaction_hash?: string;
  block_number?: number;
  distributed_at: string;
  metadata: any;
}

export interface LearningMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  milestone_name: string;
  description?: string;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'expert';
  token_reward: number;
  skill_points: number;
  completed_at: string;
  verification_data: any;
  metadata: any;
}

export interface TokenTransaction {
  id: string;
  from_user_id?: string;
  to_user_id: string;
  token_type: string;
  amount: number;
  transaction_type: 'earn' | 'spend' | 'transfer' | 'reward' | 'penalty' | 'refund';
  purpose: string;
  transaction_hash?: string;
  block_number?: number;
  gas_fee?: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  created_at: string;
  confirmed_at?: string;
  metadata: any;
}

export interface SmartContract {
  id: string;
  contract_name: string;
  contract_type: string;
  network: string;
  contract_address: string;
  abi: any;
  bytecode?: string;
  deployment_tx_hash?: string;
  deployment_block?: number;
  is_verified: boolean;
  verification_tx_hash?: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export interface AIEconomyAnalytics {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  time_period: string;
  recorded_at: string;
  metadata: any;
}

// Learning Tokens API
export async function fetchLearningTokens(userId: string): Promise<LearningToken[]> {
  const { data, error } = await supabase
    .from('learning_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLearningToken(token: Omit<LearningToken, 'id' | 'created_at'>): Promise<LearningToken> {
  const { data, error } = await supabase
    .from('learning_tokens')
    .insert(token)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLearningToken(id: string, updates: Partial<LearningToken>): Promise<LearningToken> {
  const { data, error } = await supabase
    .from('learning_tokens')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTokenBalance(userId: string, tokenType: string = 'OMNI'): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_user_token_balance', {
      p_user_id: userId,
      p_token_type: tokenType
    });

  if (error) throw error;
  return data || 0;
}

// AI Credentials API
export async function fetchAICredentials(userId: string): Promise<AICredential[]> {
  const { data, error } = await supabase
    .from('ai_credentials')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAICredential(credential: Omit<AICredential, 'id' | 'issued_at'>): Promise<AICredential> {
  const { data, error } = await supabase
    .from('ai_credentials')
    .insert(credential)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function issueAICredential(
  userId: string,
  credentialType: string,
  skillName: string,
  skillLevel: string,
  verificationMethod: string,
  verificationScore: number,
  metadata: any = {}
): Promise<string> {
  const { data, error } = await supabase
    .rpc('issue_ai_credential', {
      p_user_id: userId,
      p_credential_type: credentialType,
      p_skill_name: skillName,
      p_skill_level: skillLevel,
      p_verification_method: verificationMethod,
      p_verification_score: verificationScore,
      p_metadata: metadata
    });

  if (error) throw error;
  return data;
}

export async function revokeAICredential(id: string, reason: string): Promise<AICredential> {
  const { data, error } = await supabase
    .from('ai_credentials')
    .update({
      is_revoked: true,
      revoked_at: new Date().toISOString(),
      revoked_reason: reason
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Scholarship Pools API
export async function fetchScholarshipPools(): Promise<ScholarshipPool[]> {
  const { data, error } = await supabase
    .from('scholarship_pool')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createScholarshipPool(pool: Omit<ScholarshipPool, 'id' | 'created_at' | 'updated_at'>): Promise<ScholarshipPool> {
  const { data, error } = await supabase
    .from('scholarship_pool')
    .insert(pool)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateScholarshipPool(id: string, updates: Partial<ScholarshipPool>): Promise<ScholarshipPool> {
  const { data, error } = await supabase
    .from('scholarship_pool')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Scholarship Distributions API
export async function fetchScholarshipDistributions(userId: string): Promise<ScholarshipDistribution[]> {
  const { data, error } = await supabase
    .from('scholarship_distributions')
    .select(`
      *,
      scholarship_pool:pool_id (
        pool_name,
        pool_type
      )
    `)
    .eq('recipient_id', userId)
    .order('distributed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function distributeScholarship(
  poolId: string,
  recipientId: string,
  amount: number,
  reason: string,
  aiScore?: number,
  meritScore?: number,
  needScore?: number
): Promise<string> {
  const { data, error } = await supabase
    .rpc('distribute_scholarship', {
      p_pool_id: poolId,
      p_recipient_id: recipientId,
      p_amount: amount,
      p_reason: reason,
      p_ai_score: aiScore,
      p_merit_score: meritScore,
      p_need_score: needScore
    });

  if (error) throw error;
  return data;
}

// Learning Milestones API
export async function fetchLearningMilestones(userId: string): Promise<LearningMilestone[]> {
  const { data, error } = await supabase
    .from('learning_milestones')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLearningMilestone(
  userId: string,
  milestoneType: string,
  milestoneName: string,
  description: string,
  difficultyLevel: string,
  tokenReward: number,
  skillPoints: number,
  verificationData: any = {}
): Promise<string> {
  const { data, error } = await supabase
    .rpc('create_learning_milestone', {
      p_user_id: userId,
      p_milestone_type: milestoneType,
      p_milestone_name: milestoneName,
      p_description: description,
      p_difficulty_level: difficultyLevel,
      p_token_reward: tokenReward,
      p_skill_points: skillPoints,
      p_verification_data: verificationData
    });

  if (error) throw error;
  return data;
}

// Token Transactions API
export async function fetchTokenTransactions(userId: string): Promise<TokenTransaction[]> {
  const { data, error } = await supabase
    .from('token_transactions')
    .select('*')
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTokenTransaction(transaction: Omit<TokenTransaction, 'id' | 'created_at'>): Promise<TokenTransaction> {
  const { data, error } = await supabase
    .from('token_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Smart Contracts API
export async function fetchSmartContracts(): Promise<SmartContract[]> {
  const { data, error } = await supabase
    .from('smart_contracts')
    .select('*')
    .eq('is_verified', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSmartContract(contract: Omit<SmartContract, 'id' | 'created_at' | 'updated_at'>): Promise<SmartContract> {
  const { data, error } = await supabase
    .from('smart_contracts')
    .insert(contract)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Analytics API
export async function fetchAIEconomyAnalytics(): Promise<AIEconomyAnalytics[]> {
  const { data, error } = await supabase
    .from('ai_economy_analytics')
    .select('*')
    .order('recorded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAIEconomyAnalytics(analytics: Omit<AIEconomyAnalytics, 'id' | 'recorded_at'>): Promise<AIEconomyAnalytics> {
  const { data, error } = await supabase
    .from('ai_economy_analytics')
    .insert(analytics)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToLearningTokens(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('learning_tokens_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'learning_tokens',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function subscribeToAICredentials(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('ai_credentials_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ai_credentials',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function subscribeToScholarshipDistributions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('scholarship_distributions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'scholarship_distributions',
      filter: `recipient_id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function subscribeToTokenTransactions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('token_transactions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'token_transactions',
      filter: `or(from_user_id.eq.${userId},to_user_id.eq.${userId})`
    }, callback)
    .subscribe();
}

// Utility functions
export async function getTokenizedEconomyStats(): Promise<{
  totalTokensInCirculation: number;
  activeTokenHolders: number;
  credentialsIssued: number;
  scholarshipsDistributed: number;
  averageTokenBalance: number;
  transactionVolume: number;
  blockchainVerified: number;
  smartContractsDeployed: number;
}> {
  try {
    const [
      tokensData,
      credentialsData,
      distributionsData,
      contractsData
    ] = await Promise.all([
      supabase.from('learning_tokens').select('amount, user_id'),
      supabase.from('ai_credentials').select('id'),
      supabase.from('scholarship_distributions').select('amount'),
      supabase.from('smart_contracts').select('id')
    ]);

    const totalTokens = tokensData.data?.reduce((sum, token) => sum + token.amount, 0) || 0;
    const uniqueUsers = new Set(tokensData.data?.map(t => t.user_id)).size;
    const totalDistributed = distributionsData.data?.reduce((sum, dist) => sum + dist.amount, 0) || 0;
    const averageBalance = uniqueUsers > 0 ? totalTokens / uniqueUsers : 0;

    return {
      totalTokensInCirculation: totalTokens,
      activeTokenHolders: uniqueUsers,
      credentialsIssued: credentialsData.data?.length || 0,
      scholarshipsDistributed: distributionsData.data?.length || 0,
      averageTokenBalance: averageBalance,
      transactionVolume: totalDistributed,
      blockchainVerified: credentialsData.data?.length || 0,
      smartContractsDeployed: contractsData.data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching tokenized economy stats:', error);
    return {
      totalTokensInCirculation: 0,
      activeTokenHolders: 0,
      credentialsIssued: 0,
      scholarshipsDistributed: 0,
      averageTokenBalance: 0,
      transactionVolume: 0,
      blockchainVerified: 0,
      smartContractsDeployed: 0
    };
  }
}
