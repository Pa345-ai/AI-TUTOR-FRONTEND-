'use client'

import React, { useState, useEffect } from 'react'
import { Code, GitBranch, Target, TrendingUp, Calendar, Plus, Settings, Eye, Edit3, Trash2, CheckCircle, AlertTriangle, Clock, Users, Zap, BookOpen, BarChart3, RefreshCw, Star, Github, Terminal, Cpu, Database, Globe } from 'lucide-react'

interface OmniMindCodeProps {
  userId: string
}

interface DeveloperProfile {
  id: string
  skillLevel: string
  experienceYears: number
  programmingLanguages: string[]
  frameworks: string[]
  projects: CodeProject[]
  mentorshipSessions: MentorshipSession[]
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
  aiMentorPersonality: string
  codingGoals: CodingGoal[]
  githubIntegration: {
    username: string
    repositories: number
    contributions: number
    streak: number
  }
}

interface CodeProject {
  id: string
  name: string
  description: string
  projectType: string
  programmingLanguages: string[]
  frameworks: string[]
  technologies: string[]
  projectStatus: string
  complexityLevel: number
  progressPercentage: number
  githubRepository: string
  deploymentUrl: string
  codeQualityScore: number
  performanceMetrics: {
    loadTime: number
    bundleSize: number
    testCoverage: number
  }
  aiGuidance: {
    suggestions: string[]
    improvements: string[]
    bestPractices: string[]
  }
}

interface MentorshipSession {
  id: string
  sessionType: string
  title: string
  description: string
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
}

interface CodingGoal {
  id: string
  goalType: string
  title: string
  description: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  milestones: string[]
  skillsToLearn: string[]
}

export default function OmniMindCode({ userId }: OmniMindCodeProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'mentorship' | 'goals' | 'analytics'>('overview')
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showNewSessionModal, setShowNewSessionModal] = useState(false)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null)
  const [selectedProject, setSelectedProject] = useState<CodeProject | null>(null)

  useEffect(() => {
    loadDeveloperProfile()
  }, [userId])

  const loadDeveloperProfile = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockProfile: DeveloperProfile = {
        id: 'code-1',
        skillLevel: 'intermediate',
        experienceYears: 3,
        programmingLanguages: ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js', 'SQL'],
        frameworks: ['React', 'Next.js', 'Express.js', 'Django', 'FastAPI'],
        projects: [
          {
            id: 'project-1',
            name: 'E-Commerce Platform',
            description: 'Full-stack e-commerce application with React and Node.js',
            projectType: 'web_app',
            programmingLanguages: ['JavaScript', 'TypeScript', 'SQL'],
            frameworks: ['React', 'Express.js'],
            technologies: ['PostgreSQL', 'Stripe', 'AWS'],
            projectStatus: 'development',
            complexityLevel: 8,
            progressPercentage: 75,
            githubRepository: 'https://github.com/user/ecommerce-platform',
            deploymentUrl: 'https://ecommerce-demo.vercel.app',
            codeQualityScore: 87,
            performanceMetrics: {
              loadTime: 1.2,
              bundleSize: 2.5,
              testCoverage: 85
            },
            aiGuidance: {
              suggestions: ['Implement lazy loading for better performance', 'Add comprehensive error handling'],
              improvements: ['Refactor authentication logic', 'Optimize database queries'],
              bestPractices: ['Use TypeScript strict mode', 'Implement proper logging']
            }
          },
          {
            id: 'project-2',
            name: 'AI Chat Bot',
            description: 'Intelligent chatbot using OpenAI API and React',
            projectType: 'ai_ml',
            programmingLanguages: ['Python', 'JavaScript'],
            frameworks: ['FastAPI', 'React'],
            technologies: ['OpenAI API', 'Redis', 'Docker'],
            projectStatus: 'testing',
            complexityLevel: 6,
            progressPercentage: 90,
            githubRepository: 'https://github.com/user/ai-chatbot',
            deploymentUrl: 'https://ai-chatbot.vercel.app',
            codeQualityScore: 92,
            performanceMetrics: {
              loadTime: 0.8,
              bundleSize: 1.8,
              testCoverage: 78
            },
            aiGuidance: {
              suggestions: ['Add conversation memory', 'Implement rate limiting'],
              improvements: ['Optimize API response times', 'Add user authentication'],
              bestPractices: ['Use environment variables', 'Implement proper error boundaries']
            }
          }
        ],
        mentorshipSessions: [
          {
            id: 'session-1',
            sessionType: 'code_review',
            title: 'React Component Optimization',
            description: 'Reviewing and optimizing React components for better performance',
            programmingLanguage: 'JavaScript',
            framework: 'React',
            difficultyLevel: 6,
            durationMinutes: 45,
            sessionDate: '2024-01-15T10:00:00Z',
            aiFeedback: {
              strengths: ['Good component structure', 'Proper use of hooks'],
              improvements: ['Add memoization for expensive calculations', 'Implement proper error boundaries'],
              suggestions: ['Consider using React.memo for performance', 'Add PropTypes or TypeScript for type safety']
            },
            codeImprovements: ['Added React.memo to prevent unnecessary re-renders', 'Implemented error boundaries'],
            learningOutcomes: ['Better understanding of React performance optimization', 'Learned about memoization techniques'],
            skillImprovements: ['React Performance', 'Code Optimization'],
            userRating: 5,
            aiRating: 4,
            followUpTasks: ['Implement the suggested optimizations', 'Practice with more complex components']
          },
          {
            id: 'session-2',
            sessionType: 'debugging',
            title: 'API Integration Debugging',
            description: 'Debugging issues with third-party API integration',
            programmingLanguage: 'Python',
            framework: 'FastAPI',
            difficultyLevel: 7,
            durationMinutes: 60,
            sessionDate: '2024-01-12T14:00:00Z',
            aiFeedback: {
              strengths: ['Good error handling structure', 'Clear logging'],
              improvements: ['Add retry logic for failed requests', 'Implement proper timeout handling'],
              suggestions: ['Use exponential backoff for retries', 'Add circuit breaker pattern']
            },
            codeImprovements: ['Implemented retry logic with exponential backoff', 'Added proper timeout handling'],
            learningOutcomes: ['Better understanding of API error handling', 'Learned about resilience patterns'],
            skillImprovements: ['API Integration', 'Error Handling', 'System Design'],
            userRating: 4,
            aiRating: 5,
            followUpTasks: ['Test the retry logic thoroughly', 'Implement circuit breaker pattern']
          }
        ],
        codeQualityMetrics: {
          overallScore: 87,
          readabilityScore: 89,
          performanceScore: 85,
          maintainabilityScore: 88
        },
        productivityMetrics: {
          linesOfCode: 15420,
          commitsPerWeek: 12,
          codeReviewScore: 92,
          bugFixRate: 0.95
        },
        aiMentorPersonality: 'encouraging',
        codingGoals: [
          {
            id: 'goal-1',
            goalType: 'skill_development',
            title: 'Master Advanced React Patterns',
            description: 'Learn and implement advanced React patterns like render props, HOCs, and custom hooks',
            targetDate: '2024-03-15',
            progressPercentage: 60,
            status: 'active',
            milestones: ['Complete HOC tutorial', 'Build custom hook library', 'Implement render props pattern'],
            skillsToLearn: ['Advanced React', 'Custom Hooks', 'Render Props', 'HOCs']
          },
          {
            id: 'goal-2',
            goalType: 'project_completion',
            title: 'Complete Full-Stack Project',
            description: 'Build and deploy a complete full-stack application with frontend, backend, and database',
            targetDate: '2024-02-28',
            progressPercentage: 80,
            status: 'active',
            milestones: ['Complete backend API', 'Implement frontend', 'Add authentication', 'Deploy to production'],
            skillsToLearn: ['Full-Stack Development', 'Deployment', 'Authentication', 'Database Design']
          }
        ],
        githubIntegration: {
          username: 'developer123',
          repositories: 24,
          contributions: 156,
          streak: 45
        }
      }
      
      setDeveloperProfile(mockProfile)
    } catch (error) {
      console.error('Error loading developer profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillLevelColor = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'beginner': 'text-green-600 bg-green-100',
      'intermediate': 'text-blue-600 bg-blue-100',
      'advanced': 'text-purple-600 bg-purple-100',
      'expert': 'text-orange-600 bg-orange-100'
    }
    return levelMap[level] || 'text-gray-600 bg-gray-100'
  }

  const getProjectStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'planning': 'text-gray-600 bg-gray-100',
      'development': 'text-blue-600 bg-blue-100',
      'testing': 'text-yellow-600 bg-yellow-100',
      'deployment': 'text-purple-600 bg-purple-100',
      'maintenance': 'text-green-600 bg-green-100',
      'completed': 'text-green-600 bg-green-100'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100'
  }

  const getDifficultyStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(10 - level)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading developer profile...</span>
      </div>
    )
  }

  if (!developerProfile) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Developer Profile Found</h3>
        <p className="text-gray-600 mb-4">Create your OmniMind Code profile to get started.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Developer Profile
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Code className="w-8 h-8 text-blue-500 mr-3" />
              OmniMind Code
            </h1>
            <p className="text-gray-600 mt-2">AI coding mentor for developers</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </button>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Developer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skill Level</h3>
            <Code className="w-6 h-6 text-blue-500" />
          </div>
          <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block ${getSkillLevelColor(developerProfile.skillLevel)}`}>
            {developerProfile.skillLevel.charAt(0).toUpperCase() + developerProfile.skillLevel.slice(1)}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {developerProfile.experienceYears} years experience
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Code Quality</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {developerProfile.codeQualityMetrics.overallScore}%
          </div>
          <div className="text-sm text-gray-600">
            Overall score
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productivity</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {developerProfile.productivityMetrics.commitsPerWeek}
          </div>
          <div className="text-sm text-gray-600">
            Commits per week
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">GitHub Streak</h3>
            <Github className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-gray-600">
            {developerProfile.githubIntegration.streak}
          </div>
          <div className="text-sm text-gray-600">
            Day streak
          </div>
        </div>
      </div>

      {/* Programming Languages & Frameworks */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Programming Languages</h4>
            <div className="flex flex-wrap gap-2">
              {developerProfile.programmingLanguages.map((lang, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Frameworks & Libraries</h4>
            <div className="flex flex-wrap gap-2">
              {developerProfile.frameworks.map((framework, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {framework}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developerProfile.projects.slice(0, 2).map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getProjectStatusColor(project.projectStatus)}`}>
                      {project.projectStatus}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Progress: {project.progressPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Quality: {project.codeQualityScore}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mentorship Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mentorship Sessions</h3>
            <div className="space-y-4">
              {developerProfile.mentorshipSessions.slice(0, 2).map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{session.difficultyLevel}/10</span>
                      <span className="text-yellow-500">{getDifficultyStars(session.difficultyLevel)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{session.programmingLanguage} • {session.framework}</span>
                    <span>{session.durationMinutes} min • {new Date(session.sessionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Code Projects</h3>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerProfile.projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getProjectStatusColor(project.projectStatus)}`}>
                    {project.projectStatus}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{project.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${project.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Complexity:</span>
                    <span className="font-semibold">{project.complexityLevel}/10</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="font-semibold text-green-600">{project.codeQualityScore}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.programmingLanguages.slice(0, 3).map((lang, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                  {project.programmingLanguages.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{project.programmingLanguages.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Mentorship Sessions</h3>
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </button>
          </div>

          <div className="space-y-4">
            {developerProfile.mentorshipSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{session.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {session.sessionType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getDifficultyStars(session.difficultyLevel)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Language:</span>
                    <div className="font-semibold">{session.programmingLanguage}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Framework:</span>
                    <div className="font-semibold">{session.framework}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <div className="font-semibold">{session.durationMinutes} min</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <div className="font-semibold">{new Date(session.sessionDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Your Rating:</span>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < session.userRating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">AI Rating:</span>
                      <div className="flex text-blue-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < session.aiRating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Coding Goals</h3>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developerProfile.codingGoals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    goal.status === 'active' ? 'bg-green-100 text-green-800' :
                    goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{goal.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${goal.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Target Date:</span>
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Skills to Learn:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {goal.skillsToLearn.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-2">Milestones</h5>
                  <ul className="space-y-1">
                    {goal.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Code Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Code Quality Metrics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Score</span>
                    <span className="font-semibold">{developerProfile.codeQualityMetrics.overallScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${developerProfile.codeQualityMetrics.overallScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Readability</span>
                    <span className="font-semibold">{developerProfile.codeQualityMetrics.readabilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${developerProfile.codeQualityMetrics.readabilityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Performance</span>
                    <span className="font-semibold">{developerProfile.codeQualityMetrics.performanceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${developerProfile.codeQualityMetrics.performanceScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Maintainability</span>
                    <span className="font-semibold">{developerProfile.codeQualityMetrics.maintainabilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${developerProfile.codeQualityMetrics.maintainabilityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Productivity Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lines of Code</span>
                  <span className="font-semibold">{developerProfile.productivityMetrics.linesOfCode.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commits per Week</span>
                  <span className="font-semibold">{developerProfile.productivityMetrics.commitsPerWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code Review Score</span>
                  <span className="font-semibold">{developerProfile.productivityMetrics.codeReviewScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bug Fix Rate</span>
                  <span className="font-semibold">{(developerProfile.productivityMetrics.bugFixRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">GitHub Integration</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username</span>
                  <span className="font-semibold">@{developerProfile.githubIntegration.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repositories</span>
                  <span className="font-semibold">{developerProfile.githubIntegration.repositories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contributions</span>
                  <span className="font-semibold">{developerProfile.githubIntegration.contributions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold text-orange-600">{developerProfile.githubIntegration.streak} days</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">AI Mentor Personality</h4>
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <div className="text-lg font-semibold text-gray-900 capitalize mb-2">
                  {developerProfile.aiMentorPersonality}
                </div>
                <p className="text-sm text-gray-600">
                  Your AI mentor adapts to your learning style and provides personalized guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedSession.title}</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Session Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{selectedSession.sessionType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{selectedSession.durationMinutes} minutes</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Language:</span>
                      <span className="ml-2 font-medium">{selectedSession.programmingLanguage}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Framework:</span>
                      <span className="ml-2 font-medium">{selectedSession.framework}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="ml-2 font-medium">{selectedSession.difficultyLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedSession.sessionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Feedback</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Strengths</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiFeedback.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Improvements</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiFeedback.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Suggestions</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <Zap className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedSession.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <BookOpen className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Follow-up Tasks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedSession.followUpTasks.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}