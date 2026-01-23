// Configuration for AI Tutoring App
export const config = {
  // Backend configuration
  backend: {
    // Set to 'supabase' to use Supabase backend, 'mock' to use mock data
    type: process.env.NEXT_PUBLIC_BACKEND_TYPE || 'supabase',
    
    // Supabase configuration
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    
    // API configuration
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    }
  },
  
  // Feature flags
  features: {
    realTimeChat: true,
    voiceInteraction: true,
    emotionRecognition: true,
    studyRooms: true,
    careerAdvice: true,
    homeworkFeedback: true,
    quizGeneration: true,
    fileUpload: true,
    notifications: true,
    achievements: true,
    leaderboard: true,
  },
  
  // AI configuration
  ai: {
    defaultModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    voiceEnabled: true,
    emotionEnabled: true,
  },
  
  // UI configuration
  ui: {
    theme: 'light', // 'light' | 'dark' | 'auto'
    language: 'en', // 'en' | 'si' | 'ta'
    animations: true,
    sounds: true,
  },
  
  // Development configuration
  dev: {
    debugMode: process.env.NODE_ENV === 'development',
    mockBackend: process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true',
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  }
}

// Helper functions
export const isSupabaseEnabled = () => {
  return config.backend.type === 'supabase' && 
         config.backend.supabase.url && 
         config.backend.supabase.anonKey
}

export const isMockBackend = () => {
  return config.backend.type === 'mock' || 
         config.dev.mockBackend ||
         !isSupabaseEnabled()
}

export const getBackendType = () => {
  if (isMockBackend()) return 'mock'
  if (isSupabaseEnabled()) return 'supabase'
  return 'api'
}

// Environment validation
export const validateEnvironment = () => {
  const errors: string[] = []
  
  if (config.backend.type === 'supabase') {
    if (!config.backend.supabase.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
    }
    if (!config.backend.supabase.anonKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    }
  }
  
  if (errors.length > 0) {
    console.error('Environment validation failed:', errors)
    return false
  }
  
  return true
}

// Initialize configuration
export const initializeConfig = () => {
  const isValid = validateEnvironment()
  
  if (!isValid) {
    console.warn('Configuration validation failed. Some features may not work properly.')
  }
  
  console.log('AI Tutoring App Configuration:', {
    backendType: getBackendType(),
    supabaseEnabled: isSupabaseEnabled(),
    mockBackend: isMockBackend(),
    features: config.features,
    dev: config.dev
  })
  
  return isValid
}