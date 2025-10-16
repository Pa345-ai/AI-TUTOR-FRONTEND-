// OmniMind OS - AI Ecosystem Infrastructure API functions
import { supabase } from './supabase'

// =====================================================
// AI PLUGIN ECOSYSTEM API
// =====================================================

export interface AIPlugin {
  id: string
  name: string
  description: string
  version: string
  developerId: string
  pluginType: string
  category: string
  status: string
  pricingModel: string
  price: number
  apiEndpoints: any
  configurationSchema: any
  capabilities: string[]
  requirements: any
  documentationUrl: string
  sourceCodeUrl: string
  downloadCount: number
  rating: number
  reviewCount: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface PluginInstallation {
  id: string
  pluginId: string
  userId: string
  organizationId: string
  installationConfig: any
  status: string
  lastUsedAt: string
  usageCount: number
  createdAt: string
}

export interface PluginReview {
  id: string
  pluginId: string
  userId: string
  rating: number
  title: string
  content: string
  helpfulVotes: number
  isVerified: boolean
  createdAt: string
}

// Fetch AI plugins
export async function fetchAIPlugins(
  category?: string,
  pluginType?: string,
  pricingModel?: string
): Promise<AIPlugin[]> {
  try {
    let query = supabase
      .from('ai_plugins')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }
    if (pluginType) {
      query = query.eq('plugin_type', pluginType)
    }
    if (pricingModel) {
      query = query.eq('pricing_model', pricingModel)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch AI plugins:', error)
    throw error
  }
}

// Create AI plugin
export async function createAIPlugin(pluginData: Omit<AIPlugin, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<AIPlugin> {
  try {
    const { data, error } = await supabase
      .from('ai_plugins')
      .insert(pluginData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create AI plugin:', error)
    throw error
  }
}

// Install plugin
export async function installPlugin(
  pluginId: string,
  userId: string,
  organizationId: string,
  installationConfig: any
): Promise<PluginInstallation> {
  try {
    const { data, error } = await supabase
      .from('plugin_installations')
      .insert({
        plugin_id: pluginId,
        user_id: userId,
        organization_id: organizationId,
        installation_config: installationConfig
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to install plugin:', error)
    throw error
  }
}

// Fetch user's plugin installations
export async function fetchPluginInstallations(userId: string): Promise<PluginInstallation[]> {
  try {
    const { data, error } = await supabase
      .from('plugin_installations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch plugin installations:', error)
    throw error
  }
}

// =====================================================
// OPEN API HUB API
// =====================================================

export interface APIKey {
  id: string
  userId: string
  organizationId: string
  keyName: string
  keyValue: string
  keyType: string
  permissions: string[]
  rateLimitPerHour: number
  rateLimitPerDay: number
  usageCount: number
  lastUsedAt: string
  expiresAt: string
  isActive: boolean
  createdAt: string
}

export interface PlatformIntegration {
  id: string
  platformName: string
  platformType: string
  integrationType: string
  configuration: any
  webhookUrl: string
  apiEndpoints: string[]
  authenticationMethod: string
  status: string
  lastSyncAt: string
  syncFrequency: string
  errorCount: number
  lastError: string
  createdAt: string
}

export interface APIUsageLog {
  id: string
  apiKeyId: string
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs: number
  ipAddress: string
  createdAt: string
}

// Create API key
export async function createAPIKey(
  userId: string,
  organizationId: string,
  keyData: Omit<APIKey, 'id' | 'userId' | 'organizationId' | 'createdAt'>
): Promise<APIKey> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        ...keyData,
        user_id: userId,
        organization_id: organizationId
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create API key:', error)
    throw error
  }
}

// Fetch user's API keys
export async function fetchAPIKeys(userId: string): Promise<APIKey[]> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch API keys:', error)
    throw error
  }
}

// Fetch platform integrations
export async function fetchPlatformIntegrations(): Promise<PlatformIntegration[]> {
  try {
    const { data, error } = await supabase
      .from('platform_integrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch platform integrations:', error)
    throw error
  }
}

// Create platform integration
export async function createPlatformIntegration(
  integrationData: Omit<PlatformIntegration, 'id' | 'createdAt'>
): Promise<PlatformIntegration> {
  try {
    const { data, error } = await supabase
      .from('platform_integrations')
      .insert(integrationData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create platform integration:', error)
    throw error
  }
}

// Fetch API usage logs
export async function fetchAPIUsageLogs(apiKeyId: string): Promise<APIUsageLog[]> {
  try {
    const { data, error } = await supabase
      .from('api_usage_logs')
      .select('*')
      .eq('api_key_id', apiKeyId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch API usage logs:', error)
    throw error
  }
}

// =====================================================
// NEUROCLOUD AI WORKSPACE API
// =====================================================

export interface AIWorkspace {
  id: string
  organizationId: string
  workspaceName: string
  description: string
  workspaceType: string
  aiModelType: string
  trainingDataSource: string
  privacyLevel: string
  status: string
  modelConfiguration: any
  trainingProgress: any
  performanceMetrics: any
  dataSources: any[]
  accessPermissions: any
  createdAt: string
  updatedAt: string
  deployedAt: string
}

export interface TrainingDataset {
  id: string
  workspaceId: string
  datasetName: string
  description: string
  dataType: string
  fileFormat: string
  fileSizeBytes: number
  recordCount: number
  dataSchema: any
  qualityScore: number
  privacyCompliance: any
  processingStatus: string
  createdAt: string
}

export interface ModelTrainingJob {
  id: string
  workspaceId: string
  jobName: string
  trainingConfig: any
  datasetIds: string[]
  modelArchitecture: any
  hyperparameters: any
  status: string
  progressPercentage: number
  currentEpoch: number
  totalEpochs: number
  trainingMetrics: any
  validationMetrics: any
  errorMessage: string
  startedAt: string
  completedAt: string
  estimatedCompletion: string
  createdAt: string
}

export interface DeployedModel {
  id: string
  workspaceId: string
  trainingJobId: string
  modelName: string
  modelVersion: string
  modelType: string
  deploymentConfig: any
  apiEndpoint: string
  status: string
  performanceMetrics: any
  usageCount: number
  lastUsedAt: string
  createdAt: string
}

// Create AI workspace
export async function createAIWorkspace(
  organizationId: string,
  workspaceData: Omit<AIWorkspace, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'deployedAt'>
): Promise<AIWorkspace> {
  try {
    const { data, error } = await supabase
      .from('ai_workspaces')
      .insert({
        ...workspaceData,
        organization_id: organizationId
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create AI workspace:', error)
    throw error
  }
}

// Fetch AI workspaces
export async function fetchAIWorkspaces(organizationId?: string): Promise<AIWorkspace[]> {
  try {
    let query = supabase
      .from('ai_workspaces')
      .select('*')
      .order('created_at', { ascending: false })

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch AI workspaces:', error)
    throw error
  }
}

// Fetch training datasets
export async function fetchTrainingDatasets(workspaceId: string): Promise<TrainingDataset[]> {
  try {
    const { data, error } = await supabase
      .from('training_datasets')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch training datasets:', error)
    throw error
  }
}

// Create training dataset
export async function createTrainingDataset(
  workspaceId: string,
  datasetData: Omit<TrainingDataset, 'id' | 'workspaceId' | 'createdAt'>
): Promise<TrainingDataset> {
  try {
    const { data, error } = await supabase
      .from('training_datasets')
      .insert({
        ...datasetData,
        workspace_id: workspaceId
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create training dataset:', error)
    throw error
  }
}

// Start model training job
export async function startModelTrainingJob(
  workspaceId: string,
  jobData: Omit<ModelTrainingJob, 'id' | 'workspaceId' | 'createdAt'>
): Promise<ModelTrainingJob> {
  try {
    const { data, error } = await supabase
      .from('model_training_jobs')
      .insert({
        ...jobData,
        workspace_id: workspaceId
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to start model training job:', error)
    throw error
  }
}

// Fetch model training jobs
export async function fetchModelTrainingJobs(workspaceId: string): Promise<ModelTrainingJob[]> {
  try {
    const { data, error } = await supabase
      .from('model_training_jobs')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch model training jobs:', error)
    throw error
  }
}

// Fetch deployed models
export async function fetchDeployedModels(workspaceId: string): Promise<DeployedModel[]> {
  try {
    const { data, error } = await supabase
      .from('deployed_models')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch deployed models:', error)
    throw error
  }
}

// =====================================================
// DEVELOPER TOOLS API
// =====================================================

export interface DeveloperAccount {
  id: string
  userId: string
  organizationName: string
  organizationType: string
  websiteUrl: string
  description: string
  verificationStatus: string
  apiQuotaPerMonth: number
  currentMonthUsage: number
  billingTier: string
  createdAt: string
}

export interface SDKDownload {
  id: string
  developerId: string
  sdkName: string
  sdkVersion: string
  platform: string
  downloadCount: number
  createdAt: string
}

export interface DeveloperResource {
  id: string
  resourceType: string
  title: string
  content: string
  contentUrl: string
  category: string
  difficultyLevel: string
  tags: string[]
  viewCount: number
  helpfulVotes: number
  isFeatured: boolean
  createdAt: string
}

// Create developer account
export async function createDeveloperAccount(
  userId: string,
  accountData: Omit<DeveloperAccount, 'id' | 'userId' | 'createdAt'>
): Promise<DeveloperAccount> {
  try {
    const { data, error } = await supabase
      .from('developer_accounts')
      .insert({
        ...accountData,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create developer account:', error)
    throw error
  }
}

// Fetch developer account
export async function fetchDeveloperAccount(userId: string): Promise<DeveloperAccount | null> {
  try {
    const { data, error } = await supabase
      .from('developer_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to fetch developer account:', error)
    throw error
  }
}

// Log SDK download
export async function logSDKDownload(
  developerId: string,
  sdkName: string,
  sdkVersion: string,
  platform: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('sdk_downloads')
      .insert({
        developer_id: developerId,
        sdk_name: sdkName,
        sdk_version: sdkVersion,
        platform: platform
      })

    if (error) throw error
  } catch (error) {
    console.error('Failed to log SDK download:', error)
    throw error
  }
}

// Fetch developer resources
export async function fetchDeveloperResources(
  category?: string,
  difficultyLevel?: string
): Promise<DeveloperResource[]> {
  try {
    let query = supabase
      .from('developer_resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }
    if (difficultyLevel) {
      query = query.eq('difficulty_level', difficultyLevel)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch developer resources:', error)
    throw error
  }
}

// =====================================================
// OMNIMIND ANALYTICS API
// =====================================================

export interface OmniMindAnalytics {
  totalPlugins: number
  totalIntegrations: number
  activeWorkspaces: number
  developerCount: number
  apiCallsToday: number
  revenueThisMonth: number
  platformGrowth: number
  ecosystemHealth: number
  pluginStats: {
    totalDownloads: number
    averageRating: number
    activePlugins: number
    newThisMonth: number
  }
  integrationStats: {
    totalConnections: number
    successfulSyncs: number
    errorRate: number
    newThisMonth: number
  }
  workspaceStats: {
    totalModels: number
    trainingJobs: number
    deployedModels: number
    dataProcessed: number
  }
  developerStats: {
    activeDevelopers: number
    newThisMonth: number
    averagePluginsPerDeveloper: number
    topContributors: number
  }
  revenueBreakdown: {
    pluginSales: number
    apiUsage: number
    workspaceSubscriptions: number
    enterpriseLicenses: number
  }
  performanceMetrics: {
    apiUptime: number
    averageResponseTime: number
    errorRate: number
    userSatisfaction: number
  }
}

// Fetch OmniMind analytics
export async function fetchOmniMindAnalytics(timeRange: string = '30d'): Promise<OmniMindAnalytics> {
  try {
    // This would typically involve complex queries and aggregations
    // For now, we'll return a mock structure
    const { data: plugins } = await supabase
      .from('ai_plugins')
      .select('count', { count: 'exact' })
      .eq('is_public', true)
      .eq('status', 'approved')

    const { data: integrations } = await supabase
      .from('platform_integrations')
      .select('count', { count: 'exact' })

    const { data: workspaces } = await supabase
      .from('ai_workspaces')
      .select('count', { count: 'exact' })
      .eq('status', 'active')

    const { data: developers } = await supabase
      .from('developer_accounts')
      .select('count', { count: 'exact' })

    return {
      totalPlugins: plugins?.length || 0,
      totalIntegrations: integrations?.length || 0,
      activeWorkspaces: workspaces?.length || 0,
      developerCount: developers?.length || 0,
      apiCallsToday: 125000, // This would be calculated from actual data
      revenueThisMonth: 45000, // This would be calculated from actual data
      platformGrowth: 23.5, // This would be calculated from actual data
      ecosystemHealth: 94.2, // This would be calculated from actual data
      pluginStats: {
        totalDownloads: 125000,
        averageRating: 4.6,
        activePlugins: 1180,
        newThisMonth: 45
      },
      integrationStats: {
        totalConnections: 89,
        successfulSyncs: 98.5,
        errorRate: 1.5,
        newThisMonth: 8
      },
      workspaceStats: {
        totalModels: 234,
        trainingJobs: 45,
        deployedModels: 189,
        dataProcessed: 1250
      },
      developerStats: {
        activeDevelopers: 1890,
        newThisMonth: 156,
        averagePluginsPerDeveloper: 2.3,
        topContributors: 25
      },
      revenueBreakdown: {
        pluginSales: 18000,
        apiUsage: 12000,
        workspaceSubscriptions: 10000,
        enterpriseLicenses: 5000
      },
      performanceMetrics: {
        apiUptime: 99.9,
        averageResponseTime: 145,
        errorRate: 0.1,
        userSatisfaction: 4.7
      }
    }
  } catch (error) {
    console.error('Failed to fetch OmniMind analytics:', error)
    throw error
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

// Subscribe to plugin updates
export const subscribeToPlugins = (callback: (plugin: AIPlugin) => void) => {
  return supabase
    .channel('ai_plugins_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ai_plugins'
    }, callback)
    .subscribe()
}

// Subscribe to API key updates
export const subscribeToAPIKeys = (userId: string, callback: (key: APIKey) => void) => {
  return supabase
    .channel('api_keys_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'api_keys',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}

// Subscribe to workspace updates
export const subscribeToWorkspaces = (organizationId: string, callback: (workspace: AIWorkspace) => void) => {
  return supabase
    .channel('ai_workspaces_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ai_workspaces',
      filter: `organization_id=eq.${organizationId}`
    }, callback)
    .subscribe()
}

// Subscribe to training job updates
export const subscribeToTrainingJobs = (workspaceId: string, callback: (job: ModelTrainingJob) => void) => {
  return supabase
    .channel('model_training_jobs_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'model_training_jobs',
      filter: `workspace_id=eq.${workspaceId}`
    }, callback)
    .subscribe()
}