// Cross-Domain OmniMind Applications - API functions
import { supabase } from './supabase'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

// OmniMind Health Types
export interface OmniMindHealth {
  id: string
  userId: string
  healthProfile: {
    age?: number
    gender?: string
    medicalConditions: string[]
    allergies: string[]
    medications: string[]
  }
  emotionalState: {
    currentMood: string
    stressLevel: number
    anxietyLevel: number
    energyLevel: number
  }
  therapySessions: HealthTherapySession[]
  wellnessGoals: WellnessGoal[]
  healthMetrics: {
    sleepQuality: number
    exerciseFrequency: number
    nutritionScore: number
    hydrationLevel: number
  }
  medicationTracking: MedicationEntry[]
  moodPatterns: {
    patterns: string[]
    triggers: string[]
    copingStrategies: string[]
  }
  stressLevels: {
    currentLevel: number
    averageLevel: number
    peakTimes: string[]
    managementTechniques: string[]
  }
  sleepQuality: {
    averageHours: number
    qualityScore: number
    sleepPatterns: string[]
    improvementTips: string[]
  }
  exerciseRoutine: {
    frequency: number
    duration: number
    types: string[]
    progress: number
  }
  nutritionTracking: {
    dailyCalories: number
    macronutrients: {
      protein: number
      carbs: number
      fats: number
    }
    waterIntake: number
    mealQuality: number
  }
  mentalHealthScore: number
  physicalHealthScore: number
  emotionalWellnessScore: number
  overallHealthScore: number
  aiInsights: {
    strengths: string[]
    areasForImprovement: string[]
    recommendations: string[]
    moodPatterns: string[]
  }
  recommendations: string[]
  createdAt: string
  lastUpdated: string
  isActive: boolean
  privacyLevel: 'private' | 'confidential' | 'public'
  dataRetentionDays: number
}

export interface HealthTherapySession {
  id: string
  healthId: string
  sessionType: 'emotional_support' | 'stress_management' | 'anxiety_therapy' | 'depression_support' | 'mindfulness' | 'counseling'
  sessionTitle: string
  sessionDescription: string
  durationMinutes: number
  sessionDate: string
  emotionalStateBefore: {
    mood: string
    stress: number
    energy: number
  }
  emotionalStateAfter: {
    mood: string
    stress: number
    energy: number
  }
  sessionNotes: string
  aiAnalysis: {
    keyInsights: string[]
    improvements: string[]
    recommendations: string[]
  }
  effectivenessScore: number
  userFeedback: string
  followUpRequired: boolean
  nextSessionRecommended: string
  createdAt: string
}

export interface WellnessGoal {
  id: string
  healthId: string
  goalType: 'mental_health' | 'physical_fitness' | 'emotional_wellness' | 'stress_reduction' | 'sleep_improvement' | 'nutrition'
  goalTitle: string
  goalDescription: string
  targetValue: number
  currentValue: number
  unit: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  aiRecommendations: string[]
  milestoneAchievements: string[]
  createdAt: string
  updatedAt: string
}

export interface MedicationEntry {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  sideEffects: string[]
  effectiveness: number
  notes: string
}

// OmniMind Code Types
export interface OmniMindCode {
  id: string
  userId: string
  developerProfile: {
    specialization: string
    interests: string[]
    learningStyle: string
    experience: string
  }
  codingSkills: {
    [key: string]: number
  }
  programmingLanguages: string[]
  frameworks: string[]
  projects: CodeProject[]
  codeReviews: CodeReview[]
  learningPath: LearningPathItem[]
  codingChallenges: CodingChallenge[]
  mentorshipSessions: CodeMentorshipSession[]
  codeQualityMetrics: {
    overallScore: number
    readabilityScore: number
    performanceScore: number
    maintainabilityScore: number
  }
  productivityMetrics: {
    linesOfCode: number
    commitsPerWeek: number
    codeReviewScore: number
    bugFixRate: number
  }
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  experienceYears: number
  githubIntegration: {
    username: string
    repositories: number
    contributions: number
    streak: number
    lastActivity: string
  }
  aiMentorPersonality: string
  codingGoals: CodingGoal[]
  createdAt: string
  lastUpdated: string
  isActive: boolean
}

export interface CodeProject {
  id: string
  codeId: string
  projectName: string
  projectDescription: string
  projectType: 'web_app' | 'mobile_app' | 'api' | 'library' | 'game' | 'data_science' | 'ai_ml' | 'blockchain'
  programmingLanguages: string[]
  frameworks: string[]
  technologies: string[]
  projectStatus: 'planning' | 'development' | 'testing' | 'deployment' | 'maintenance' | 'completed'
  complexityLevel: number
  estimatedHours: number
  actualHours: number
  progressPercentage: number
  githubRepository: string
  deploymentUrl: string
  aiGuidance: {
    suggestions: string[]
    improvements: string[]
    bestPractices: string[]
  }
  codeQualityScore: number
  performanceMetrics: {
    loadTime: number
    bundleSize: number
    testCoverage: number
  }
  createdAt: string
  updatedAt: string
}

export interface CodeMentorshipSession {
  id: string
  codeId: string
  sessionType: 'code_review' | 'debugging' | 'architecture_design' | 'best_practices' | 'algorithm_explanation' | 'project_guidance'
  sessionTitle: string
  sessionDescription: string
  codeSnippet: string
  programmingLanguage: string
  framework: string
  difficultyLevel: number
  durationMinutes: number
  sessionDate: string
  aiFeedback: {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
  }
  codeImprovements: string[]
  learningOutcomes: string[]
  skillImprovements: string[]
  userRating: number
  aiRating: number
  followUpTasks: string[]
  createdAt: string
}

export interface CodeReview {
  id: string
  codeId: string
  reviewType: string
  codeSnippet: string
  feedback: string
  rating: number
  improvements: string[]
  createdAt: string
}

export interface LearningPathItem {
  id: string
  skill: string
  level: number
  resources: string[]
  completed: boolean
  completedAt?: string
}

export interface CodingChallenge {
  id: string
  title: string
  description: string
  difficulty: number
  language: string
  solution: string
  completed: boolean
  completedAt?: string
}

export interface CodingGoal {
  id: string
  codeId: string
  goalType: 'skill_development' | 'project_completion' | 'certification' | 'career_advancement'
  title: string
  description: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  milestones: string[]
  skillsToLearn: string[]
  createdAt: string
  updatedAt: string
}

// OmniMind Business Types
export interface OmniMindBusiness {
  id: string
  userId: string
  companyId: string
  employeeProfile: {
    role: string
    department: string
    level: string
    experience: number
  }
  businessSkills: {
    leadership: number
    communication: number
    projectManagement: number
    strategicThinking: number
    negotiation: number
    problemSolving: number
  }
  leadershipSkills: {
    teamManagement: number
    decisionMaking: number
    conflictResolution: number
    mentoring: number
    vision: number
  }
  productivityMetrics: {
    tasksCompleted: number
    meetingEfficiency: number
    emailResponseTime: number
    projectDeliveryRate: number
  }
  trainingModules: BusinessTrainingModule[]
  performanceReviews: PerformanceReview[]
  careerGoals: BusinessCareerGoal[]
  teamCollaboration: {
    collaborationScore: number
    teamSize: number
    crossFunctionalProjects: number
    mentoringOthers: number
  }
  projectManagement: {
    projectsLed: number
    successRate: number
    onTimeDelivery: number
    budgetManagement: number
  }
  communicationSkills: {
    presentation: number
    writing: number
    listening: number
    negotiation: number
  }
  decisionMaking: {
    speed: number
    accuracy: number
    riskAssessment: number
    dataDriven: number
  }
  innovationMetrics: {
    ideasGenerated: number
    innovationsImplemented: number
    processImprovements: number
    creativeSolutions: number
  }
  businessIntelligence: {
    dataAnalysis: number
    marketInsights: number
    competitiveAnalysis: number
    trendIdentification: number
  }
  aiCoachingSessions: BusinessCoachingSession[]
  productivityScore: number
  leadershipScore: number
  collaborationScore: number
  innovationScore: number
  overallPerformanceScore: number
  createdAt: string
  lastUpdated: string
  isActive: boolean
}

export interface BusinessTrainingModule {
  id: string
  businessId: string
  moduleType: 'leadership' | 'productivity' | 'communication' | 'project_management' | 'innovation' | 'teamwork' | 'decision_making'
  moduleTitle: string
  moduleDescription: string
  difficultyLevel: number
  estimatedDurationHours: number
  actualDurationHours: number
  completionPercentage: number
  moduleStatus: 'not_started' | 'in_progress' | 'completed' | 'paused'
  learningObjectives: string[]
  contentModules: string[]
  assessments: string[]
  aiFeedback: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  skillImprovements: string[]
  practicalApplications: string[]
  peerInteractions: string[]
  certificationEarned: boolean
  completionDate: string
  createdAt: string
  updatedAt: string
}

export interface PerformanceReview {
  id: string
  businessId: string
  reviewPeriod: string
  overallRating: number
  goalsAchieved: number
  goalsTotal: number
  strengths: string[]
  areasForImprovement: string[]
  feedback: string[]
  nextGoals: string[]
  reviewDate: string
  createdAt: string
}

export interface BusinessCareerGoal {
  id: string
  businessId: string
  goalType: 'promotion' | 'skill_development' | 'project_leadership' | 'certification' | 'mentoring'
  title: string
  description: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  milestones: string[]
  skillsRequired: string[]
  resourcesNeeded: string[]
  createdAt: string
  updatedAt: string
}

export interface BusinessCoachingSession {
  id: string
  businessId: string
  coachingType: 'leadership_development' | 'productivity_optimization' | 'communication_skills' | 'project_management' | 'innovation_coaching' | 'team_building'
  sessionTitle: string
  sessionDescription: string
  durationMinutes: number
  sessionDate: string
  coachingObjectives: string[]
  currentChallenges: string[]
  aiGuidance: {
    insights: string[]
    strategies: string[]
    actionPlan: string[]
  }
  progressMetrics: {
    beforeSession: number
    afterSession: number
    improvement: number
  }
  skillDevelopment: string[]
  leadershipInsights: string[]
  productivityTips: string[]
  followUpActions: string[]
  effectivenessRating: number
  userSatisfaction: number
  nextSessionScheduled: string
  createdAt: string
}

// Cross-Domain Analytics Types
export interface CrossDomainAnalytics {
  id: string
  userId: string
  domain: 'health' | 'code' | 'business'
  domainId: string
  metricType: 'engagement' | 'progress' | 'satisfaction' | 'effectiveness' | 'productivity' | 'learning'
  metricName: string
  metricValue: number
  metricUnit: string
  measurementDate: string
  contextData: {
    [key: string]: any
  }
  aiInsights: {
    [key: string]: any
  }
  trends: {
    [key: string]: any
  }
  comparisons: {
    [key: string]: any
  }
  createdAt: string
}

// =====================================================
// API FUNCTIONS - OMNIMIND HEALTH
// =====================================================

export async function fetchOmniMindHealth(userId: string): Promise<OmniMindHealth | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_health')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching OmniMind Health:', error)
    return null
  }
}

export async function createOmniMindHealth(healthData: Partial<OmniMindHealth>): Promise<OmniMindHealth | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_health')
      .insert([healthData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating OmniMind Health:', error)
    return null
  }
}

export async function updateOmniMindHealth(healthId: string, updates: Partial<OmniMindHealth>): Promise<OmniMindHealth | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_health')
      .update(updates)
      .eq('id', healthId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating OmniMind Health:', error)
    return null
  }
}

export async function fetchHealthTherapySessions(healthId: string): Promise<HealthTherapySession[]> {
  try {
    const { data, error } = await supabase
      .from('health_therapy_sessions')
      .select('*')
      .eq('health_id', healthId)
      .order('session_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching therapy sessions:', error)
    return []
  }
}

export async function createHealthTherapySession(sessionData: Partial<HealthTherapySession>): Promise<HealthTherapySession | null> {
  try {
    const { data, error } = await supabase
      .from('health_therapy_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating therapy session:', error)
    return null
  }
}

export async function fetchWellnessGoals(healthId: string): Promise<WellnessGoal[]> {
  try {
    const { data, error } = await supabase
      .from('health_wellness_goals')
      .select('*')
      .eq('health_id', healthId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching wellness goals:', error)
    return []
  }
}

export async function createWellnessGoal(goalData: Partial<WellnessGoal>): Promise<WellnessGoal | null> {
  try {
    const { data, error } = await supabase
      .from('health_wellness_goals')
      .insert([goalData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating wellness goal:', error)
    return null
  }
}

// =====================================================
// API FUNCTIONS - OMNIMIND CODE
// =====================================================

export async function fetchOmniMindCode(userId: string): Promise<OmniMindCode | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_code')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching OmniMind Code:', error)
    return null
  }
}

export async function createOmniMindCode(codeData: Partial<OmniMindCode>): Promise<OmniMindCode | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_code')
      .insert([codeData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating OmniMind Code:', error)
    return null
  }
}

export async function updateOmniMindCode(codeId: string, updates: Partial<OmniMindCode>): Promise<OmniMindCode | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_code')
      .update(updates)
      .eq('id', codeId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating OmniMind Code:', error)
    return null
  }
}

export async function fetchCodeProjects(codeId: string): Promise<CodeProject[]> {
  try {
    const { data, error } = await supabase
      .from('code_projects')
      .select('*')
      .eq('code_id', codeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching code projects:', error)
    return []
  }
}

export async function createCodeProject(projectData: Partial<CodeProject>): Promise<CodeProject | null> {
  try {
    const { data, error } = await supabase
      .from('code_projects')
      .insert([projectData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating code project:', error)
    return null
  }
}

export async function fetchCodeMentorshipSessions(codeId: string): Promise<CodeMentorshipSession[]> {
  try {
    const { data, error } = await supabase
      .from('code_mentorship_sessions')
      .select('*')
      .eq('code_id', codeId)
      .order('session_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching mentorship sessions:', error)
    return []
  }
}

export async function createCodeMentorshipSession(sessionData: Partial<CodeMentorshipSession>): Promise<CodeMentorshipSession | null> {
  try {
    const { data, error } = await supabase
      .from('code_mentorship_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating mentorship session:', error)
    return null
  }
}

export async function fetchCodingGoals(codeId: string): Promise<CodingGoal[]> {
  try {
    const { data, error } = await supabase
      .from('coding_goals')
      .select('*')
      .eq('code_id', codeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching coding goals:', error)
    return []
  }
}

export async function createCodingGoal(goalData: Partial<CodingGoal>): Promise<CodingGoal | null> {
  try {
    const { data, error } = await supabase
      .from('coding_goals')
      .insert([goalData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating coding goal:', error)
    return null
  }
}

// =====================================================
// API FUNCTIONS - OMNIMIND BUSINESS
// =====================================================

export async function fetchOmniMindBusiness(userId: string): Promise<OmniMindBusiness | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_business')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching OmniMind Business:', error)
    return null
  }
}

export async function createOmniMindBusiness(businessData: Partial<OmniMindBusiness>): Promise<OmniMindBusiness | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_business')
      .insert([businessData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating OmniMind Business:', error)
    return null
  }
}

export async function updateOmniMindBusiness(businessId: string, updates: Partial<OmniMindBusiness>): Promise<OmniMindBusiness | null> {
  try {
    const { data, error } = await supabase
      .from('omnimind_business')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating OmniMind Business:', error)
    return null
  }
}

export async function fetchBusinessTrainingModules(businessId: string): Promise<BusinessTrainingModule[]> {
  try {
    const { data, error } = await supabase
      .from('business_training_modules')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching training modules:', error)
    return []
  }
}

export async function createBusinessTrainingModule(moduleData: Partial<BusinessTrainingModule>): Promise<BusinessTrainingModule | null> {
  try {
    const { data, error } = await supabase
      .from('business_training_modules')
      .insert([moduleData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating training module:', error)
    return null
  }
}

export async function fetchBusinessCoachingSessions(businessId: string): Promise<BusinessCoachingSession[]> {
  try {
    const { data, error } = await supabase
      .from('business_ai_coaching')
      .select('*')
      .eq('business_id', businessId)
      .order('session_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching coaching sessions:', error)
    return []
  }
}

export async function createBusinessCoachingSession(sessionData: Partial<BusinessCoachingSession>): Promise<BusinessCoachingSession | null> {
  try {
    const { data, error } = await supabase
      .from('business_ai_coaching')
      .insert([sessionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating coaching session:', error)
    return null
  }
}

export async function fetchBusinessCareerGoals(businessId: string): Promise<BusinessCareerGoal[]> {
  try {
    const { data, error } = await supabase
      .from('business_career_goals')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching career goals:', error)
    return []
  }
}

export async function createBusinessCareerGoal(goalData: Partial<BusinessCareerGoal>): Promise<BusinessCareerGoal | null> {
  try {
    const { data, error } = await supabase
      .from('business_career_goals')
      .insert([goalData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating career goal:', error)
    return null
  }
}

// =====================================================
// API FUNCTIONS - CROSS-DOMAIN ANALYTICS
// =====================================================

export async function fetchCrossDomainAnalytics(userId: string): Promise<CrossDomainAnalytics[]> {
  try {
    const { data, error } = await supabase
      .from('cross_domain_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('measurement_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cross-domain analytics:', error)
    return []
  }
}

export async function createCrossDomainAnalytics(analyticsData: Partial<CrossDomainAnalytics>): Promise<CrossDomainAnalytics | null> {
  try {
    const { data, error } = await supabase
      .from('cross_domain_analytics')
      .insert([analyticsData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating cross-domain analytics:', error)
    return null
  }
}

export async function getCrossDomainInsights(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .rpc('get_cross_domain_insights', { p_user_id: userId })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching cross-domain insights:', error)
    return null
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

export const subscribeToOmniMindHealth = (userId: string, callback: (health: OmniMindHealth) => void) => {
  return supabase
    .channel('omnimind_health_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'omnimind_health',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as OmniMindHealth)
    })
    .subscribe()
}

export const subscribeToHealthTherapySessions = (healthId: string, callback: (session: HealthTherapySession) => void) => {
  return supabase
    .channel('health_therapy_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'health_therapy_sessions',
      filter: `health_id=eq.${healthId}`
    }, (payload) => {
      callback(payload.new as HealthTherapySession)
    })
    .subscribe()
}

export const subscribeToOmniMindCode = (userId: string, callback: (code: OmniMindCode) => void) => {
  return supabase
    .channel('omnimind_code_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'omnimind_code',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as OmniMindCode)
    })
    .subscribe()
}

export const subscribeToCodeMentorshipSessions = (codeId: string, callback: (session: CodeMentorshipSession) => void) => {
  return supabase
    .channel('code_mentorship_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'code_mentorship_sessions',
      filter: `code_id=eq.${codeId}`
    }, (payload) => {
      callback(payload.new as CodeMentorshipSession)
    })
    .subscribe()
}

export const subscribeToOmniMindBusiness = (userId: string, callback: (business: OmniMindBusiness) => void) => {
  return supabase
    .channel('omnimind_business_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'omnimind_business',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as OmniMindBusiness)
    })
    .subscribe()
}

export const subscribeToBusinessCoachingSessions = (businessId: string, callback: (session: BusinessCoachingSession) => void) => {
  return supabase
    .channel('business_ai_coaching_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'business_ai_coaching',
      filter: `business_id=eq.${businessId}`
    }, (payload) => {
      callback(payload.new as BusinessCoachingSession)
    })
    .subscribe()
}

export const subscribeToCrossDomainAnalytics = (userId: string, callback: (analytics: CrossDomainAnalytics) => void) => {
  return supabase
    .channel('cross_domain_analytics_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cross_domain_analytics',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as CrossDomainAnalytics)
    })
    .subscribe()
}