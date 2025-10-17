'use client'

import React, { useState, useEffect } from 'react'
import { Briefcase, Target, TrendingUp, Calendar, Plus, Settings, Eye, Edit3, Trash2, CheckCircle, AlertTriangle, Clock, Users, Zap, BookOpen, BarChart3, RefreshCw, Star, Award, Building, Presentation, Lightbulb, DollarSign } from 'lucide-react'

interface OmniMindBusinessProps {
  userId: string
}

interface BusinessProfile {
  id: string
  companyId: string
  role: string
  department: string
  businessSkills: {
    leadership: number
    communication: number
    projectManagement: number
    strategicThinking: number
    negotiation: number
    problemSolving: number
  }
  productivityMetrics: {
    tasksCompleted: number
    meetingEfficiency: number
    emailResponseTime: number
    projectDeliveryRate: number
  }
  trainingModules: TrainingModule[]
  performanceReviews: PerformanceReview[]
  careerGoals: CareerGoal[]
  teamCollaboration: {
    collaborationScore: number
    teamSize: number
    crossFunctionalProjects: number
    mentoringOthers: number
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
  aiCoachingSessions: CoachingSession[]
  productivityScore: number
  leadershipScore: number
  collaborationScore: number
  innovationScore: number
  overallPerformanceScore: number
}

interface TrainingModule {
  id: string
  moduleType: string
  title: string
  description: string
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
}

interface PerformanceReview {
  id: string
  reviewPeriod: string
  overallRating: number
  goalsAchieved: number
  goalsTotal: number
  strengths: string[]
  areasForImprovement: string[]
  feedback: string[]
  nextGoals: string[]
  reviewDate: string
}

interface CareerGoal {
  id: string
  goalType: string
  title: string
  description: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  milestones: string[]
  skillsRequired: string[]
  resourcesNeeded: string[]
}

interface CoachingSession {
  id: string
  coachingType: string
  title: string
  description: string
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
}

export default function OmniMindBusiness({ userId }: OmniMindBusinessProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'coaching' | 'goals' | 'analytics'>('overview')
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewModuleModal, setShowNewModuleModal] = useState(false)
  const [showNewCoachingModal, setShowNewCoachingModal] = useState(false)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<CoachingSession | null>(null)
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)

  useEffect(() => {
    loadBusinessProfile()
  }, [userId])

  const loadBusinessProfile = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockProfile: BusinessProfile = {
        id: 'business-1',
        companyId: 'company-123',
        role: 'Product Manager',
        department: 'Engineering',
        businessSkills: {
          leadership: 85,
          communication: 92,
          projectManagement: 88,
          strategicThinking: 75,
          negotiation: 70,
          problemSolving: 90
        },
        productivityMetrics: {
          tasksCompleted: 156,
          meetingEfficiency: 87,
          emailResponseTime: 2.3,
          projectDeliveryRate: 94
        },
        trainingModules: [
          {
            id: 'module-1',
            moduleType: 'leadership',
            title: 'Advanced Leadership Strategies',
            description: 'Master advanced leadership techniques for managing high-performing teams',
            difficultyLevel: 8,
            estimatedDurationHours: 12,
            actualDurationHours: 10,
            completionPercentage: 100,
            moduleStatus: 'completed',
            learningObjectives: [
              'Develop emotional intelligence in leadership',
              'Master conflict resolution techniques',
              'Build high-performing teams',
              'Implement strategic decision-making processes'
            ],
            contentModules: [
              'Emotional Intelligence Fundamentals',
              'Conflict Resolution Strategies',
              'Team Building Techniques',
              'Strategic Decision Making'
            ],
            assessments: [
              'Leadership Style Assessment',
              'Team Dynamics Quiz',
              'Conflict Resolution Scenario',
              'Strategic Planning Exercise'
            ],
            aiFeedback: {
              strengths: ['Strong communication skills', 'Natural team builder', 'Strategic thinking ability'],
              improvements: ['Work on delegation skills', 'Improve time management', 'Develop coaching techniques'],
              recommendations: ['Practice active listening', 'Implement regular team check-ins', 'Develop mentoring program']
            },
            skillImprovements: ['Leadership', 'Team Management', 'Strategic Thinking', 'Communication'],
            practicalApplications: [
              'Implemented weekly team retrospectives',
              'Created team development plan',
              'Established mentoring program',
              'Improved meeting efficiency by 25%'
            ],
            peerInteractions: [
              'Collaborated with 5 other managers',
              'Participated in leadership roundtable',
              'Mentored 2 junior team members',
              'Led cross-functional project team'
            ],
            certificationEarned: true,
            completionDate: '2024-01-10T00:00:00Z'
          },
          {
            id: 'module-2',
            moduleType: 'productivity',
            title: 'Productivity Optimization Masterclass',
            description: 'Learn advanced productivity techniques and time management strategies',
            difficultyLevel: 6,
            estimatedDurationHours: 8,
            actualDurationHours: 6,
            completionPercentage: 75,
            moduleStatus: 'in_progress',
            learningObjectives: [
              'Master time management techniques',
              'Optimize workflow processes',
              'Implement productivity tools',
              'Develop focus and concentration'
            ],
            contentModules: [
              'Time Management Fundamentals',
              'Workflow Optimization',
              'Productivity Tools & Apps',
              'Focus & Concentration Techniques'
            ],
            assessments: [
              'Time Audit Exercise',
              'Productivity Assessment',
              'Tool Implementation Project',
              'Focus Challenge'
            ],
            aiFeedback: {
              strengths: ['Good task prioritization', 'Effective use of tools', 'Strong work ethic'],
              improvements: ['Reduce multitasking', 'Improve email management', 'Better work-life balance'],
              recommendations: ['Implement time blocking', 'Use Pomodoro technique', 'Set clear boundaries']
            },
            skillImprovements: ['Time Management', 'Workflow Optimization', 'Focus', 'Tool Mastery'],
            practicalApplications: [
              'Implemented time blocking system',
              'Reduced email time by 40%',
              'Improved task completion rate',
              'Better work-life balance'
            ],
            peerInteractions: [
              'Shared productivity tips with team',
              'Collaborated on workflow improvements',
              'Participated in productivity challenges',
              'Mentored colleagues on time management'
            ],
            certificationEarned: false,
            completionDate: ''
          }
        ],
        performanceReviews: [
          {
            id: 'review-1',
            reviewPeriod: 'Q4 2023',
            overallRating: 4.2,
            goalsAchieved: 8,
            goalsTotal: 10,
            strengths: [
              'Excellent project management skills',
              'Strong team leadership',
              'Great communication abilities',
              'Innovative problem-solving approach'
            ],
            areasForImprovement: [
              'Strategic planning depth',
              'Cross-functional collaboration',
              'Data analysis skills',
              'Presentation skills'
            ],
            feedback: [
              'Outstanding performance this quarter',
              'Team productivity increased significantly',
              'Great job on the new product launch',
              'Continue developing strategic thinking'
            ],
            nextGoals: [
              'Complete advanced analytics training',
              'Lead cross-functional initiative',
              'Improve presentation skills',
              'Develop mentoring program'
            ],
            reviewDate: '2024-01-15T00:00:00Z'
          }
        ],
        careerGoals: [
          {
            id: 'goal-1',
            goalType: 'promotion',
            title: 'Senior Product Manager',
            description: 'Advance to Senior Product Manager role with expanded responsibilities',
            targetDate: '2024-06-30',
            progressPercentage: 65,
            status: 'active',
            milestones: [
              'Complete leadership training',
              'Lead major product initiative',
              'Develop team of 5+ people',
              'Achieve 95% project delivery rate'
            ],
            skillsRequired: [
              'Advanced Leadership',
              'Strategic Planning',
              'Team Management',
              'Product Strategy',
              'Stakeholder Management'
            ],
            resourcesNeeded: [
              'Mentorship from senior PM',
              'Advanced training modules',
              'Leadership coaching sessions',
              'Cross-functional project experience'
            ]
          },
          {
            id: 'goal-2',
            goalType: 'skill_development',
            title: 'Data Analytics Mastery',
            description: 'Develop advanced data analytics skills for better product decisions',
            targetDate: '2024-04-30',
            progressPercentage: 40,
            status: 'active',
            milestones: [
              'Complete SQL certification',
              'Learn Python for data analysis',
              'Master Tableau/Power BI',
              'Complete data science project'
            ],
            skillsRequired: [
              'SQL',
              'Python',
              'Data Visualization',
              'Statistical Analysis',
              'Machine Learning Basics'
            ],
            resourcesNeeded: [
              'Online courses',
              'Data analysis tools',
              'Mentorship from data team',
              'Real project data access'
            ]
          }
        ],
        teamCollaboration: {
          collaborationScore: 92,
          teamSize: 8,
          crossFunctionalProjects: 5,
          mentoringOthers: 3
        },
        innovationMetrics: {
          ideasGenerated: 12,
          innovationsImplemented: 8,
          processImprovements: 6,
          creativeSolutions: 15
        },
        businessIntelligence: {
          dataAnalysis: 75,
          marketInsights: 80,
          competitiveAnalysis: 85,
          trendIdentification: 70
        },
        aiCoachingSessions: [
          {
            id: 'coaching-1',
            coachingType: 'leadership_development',
            title: 'Team Leadership Strategies',
            description: 'Developing advanced leadership skills for managing diverse teams',
            durationMinutes: 60,
            sessionDate: '2024-01-12T14:00:00Z',
            coachingObjectives: [
              'Improve team motivation techniques',
              'Develop conflict resolution skills',
              'Enhance communication effectiveness',
              'Build stronger team relationships'
            ],
            currentChallenges: [
              'Managing remote team dynamics',
              'Balancing individual and team goals',
              'Handling difficult conversations',
              'Maintaining team morale during change'
            ],
            aiGuidance: {
              insights: [
                'Focus on individual strengths and development',
                'Create psychological safety in team environment',
                'Use data-driven approach for team decisions',
                'Implement regular feedback mechanisms'
              ],
              strategies: [
                'Weekly one-on-one meetings with each team member',
                'Monthly team retrospectives and planning sessions',
                'Quarterly team building activities',
                'Annual team development planning'
              ],
              actionPlan: [
                'Schedule individual meetings with all team members',
                'Implement team feedback system',
                'Create team development roadmap',
                'Establish regular communication channels'
              ]
            },
            progressMetrics: {
              beforeSession: 6,
              afterSession: 8,
              improvement: 33
            },
            skillDevelopment: [
              'Leadership Communication',
              'Team Motivation',
              'Conflict Resolution',
              'Strategic Thinking'
            ],
            leadershipInsights: [
              'Great leaders listen more than they speak',
              'Trust is built through consistent actions',
              'Team success comes from individual growth',
              'Transparency builds stronger relationships'
            ],
            productivityTips: [
              'Use time blocking for focused work',
              'Delegate effectively to team members',
              'Set clear expectations and deadlines',
              'Regular check-ins prevent major issues'
            ],
            followUpActions: [
              'Implement weekly team meetings',
              'Create individual development plans',
              'Schedule monthly team retrospectives',
              'Establish team communication guidelines'
            ],
            effectivenessRating: 4,
            userSatisfaction: 5,
            nextSessionScheduled: '2024-01-26T14:00:00Z'
          },
          {
            id: 'coaching-2',
            coachingType: 'productivity_optimization',
            title: 'Workflow Efficiency Mastery',
            description: 'Optimizing personal and team workflows for maximum productivity',
            durationMinutes: 45,
            sessionDate: '2024-01-08T10:00:00Z',
            coachingObjectives: [
              'Streamline daily workflows',
              'Improve task prioritization',
              'Optimize meeting efficiency',
              'Reduce time waste activities'
            ],
            currentChallenges: [
              'Too many meetings consuming time',
              'Difficulty prioritizing tasks effectively',
              'Email overload and response delays',
              'Lack of focus time for deep work'
            ],
            aiGuidance: {
              insights: [
                'Meetings should have clear agendas and outcomes',
                'Time blocking increases focus and productivity',
                'Email batching reduces context switching',
                'Regular breaks improve overall performance'
              ],
              strategies: [
                'Implement meeting-free Fridays',
                'Use time blocking for focused work',
                'Batch email processing twice daily',
                'Schedule regular breaks and movement'
              ],
              actionPlan: [
                'Audit current time usage for one week',
                'Implement time blocking system',
                'Reduce meeting frequency by 30%',
                'Create email processing schedule'
              ]
            },
            progressMetrics: {
              beforeSession: 5,
              afterSession: 7,
              improvement: 40
            },
            skillDevelopment: [
              'Time Management',
              'Task Prioritization',
              'Workflow Optimization',
              'Focus Techniques'
            ],
            leadershipInsights: [
              'Productivity is about working smarter, not harder',
              'Clear priorities prevent overwhelm',
              'Regular breaks improve decision quality',
              'Automation frees time for strategic work'
            ],
            productivityTips: [
              'Start each day with top 3 priorities',
              'Use 2-minute rule for quick tasks',
              'Batch similar activities together',
              'End each day with tomorrow\'s plan'
            ],
            followUpActions: [
              'Implement time blocking calendar',
              'Reduce meeting frequency',
              'Create email processing schedule',
              'Track productivity metrics weekly'
            ],
            effectivenessRating: 5,
            userSatisfaction: 4,
            nextSessionScheduled: '2024-01-22T10:00:00Z'
          }
        ],
        productivityScore: 88,
        leadershipScore: 85,
        collaborationScore: 92,
        innovationScore: 78,
        overallPerformanceScore: 86
      }
      
      setBusinessProfile(mockProfile)
    } catch (error) {
      console.error('Error loading business profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getModuleStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'not_started': 'text-gray-600 bg-gray-100',
      'in_progress': 'text-blue-600 bg-blue-100',
      'completed': 'text-green-600 bg-green-100',
      'paused': 'text-yellow-600 bg-yellow-100'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100'
  }

  const getGoalStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'text-green-600 bg-green-100',
      'completed': 'text-blue-600 bg-blue-100',
      'paused': 'text-yellow-600 bg-yellow-100',
      'cancelled': 'text-red-600 bg-red-100'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'training', label: 'Training Modules', icon: BookOpen },
    { id: 'coaching', label: 'AI Coaching', icon: Users },
    { id: 'goals', label: 'Career Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading business profile...</span>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Business Profile Found</h3>
        <p className="text-gray-600 mb-4">Create your OmniMind Business profile to get started.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Business Profile
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
              <Briefcase className="w-8 h-8 text-blue-500 mr-3" />
              OmniMind Business
            </h1>
            <p className="text-gray-600 mt-2">Corporate AI training + productivity modules</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewCoachingModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Coaching
            </button>
            <button
              onClick={() => setShowNewModuleModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Module
            </button>
          </div>
        </div>
      </div>

      {/* Performance Scores */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productivity</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(businessProfile.productivityScore)}`}>
            {businessProfile.productivityScore}%
          </div>
          <div className={`text-sm ${getScoreColor(businessProfile.productivityScore)}`}>
            {businessProfile.productivityScore >= 85 ? 'Excellent' : businessProfile.productivityScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leadership</h3>
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(businessProfile.leadershipScore)}`}>
            {businessProfile.leadershipScore}%
          </div>
          <div className={`text-sm ${getScoreColor(businessProfile.leadershipScore)}`}>
            {businessProfile.leadershipScore >= 85 ? 'Excellent' : businessProfile.leadershipScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Collaboration</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(businessProfile.collaborationScore)}`}>
            {businessProfile.collaborationScore}%
          </div>
          <div className={`text-sm ${getScoreColor(businessProfile.collaborationScore)}`}>
            {businessProfile.collaborationScore >= 85 ? 'Excellent' : businessProfile.collaborationScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Innovation</h3>
            <Lightbulb className="w-6 h-6 text-yellow-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(businessProfile.innovationScore)}`}>
            {businessProfile.innovationScore}%
          </div>
          <div className={`text-sm ${getScoreColor(businessProfile.innovationScore)}`}>
            {businessProfile.innovationScore >= 85 ? 'Excellent' : businessProfile.innovationScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall</h3>
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(businessProfile.overallPerformanceScore)}`}>
            {businessProfile.overallPerformanceScore}%
          </div>
          <div className={`text-sm ${getScoreColor(businessProfile.overallPerformanceScore)}`}>
            {businessProfile.overallPerformanceScore >= 85 ? 'Excellent' : businessProfile.overallPerformanceScore >= 70 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
      </div>

      {/* Role & Department Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Role & Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Current Position</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-semibold">{businessProfile.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold">{businessProfile.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team Size:</span>
                <span className="font-semibold">{businessProfile.teamCollaboration.teamSize} people</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tasks Completed:</span>
                <span className="font-semibold">{businessProfile.productivityMetrics.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meeting Efficiency:</span>
                <span className="font-semibold">{businessProfile.productivityMetrics.meetingEfficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project Delivery:</span>
                <span className="font-semibold">{businessProfile.productivityMetrics.projectDeliveryRate}%</span>
              </div>
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
          {/* Recent Training Modules */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Training Modules</h3>
            <div className="space-y-4">
              {businessProfile.trainingModules.slice(0, 2).map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getModuleStatusColor(module.moduleStatus)}`}>
                      {module.moduleStatus}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Progress: {module.completionPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {module.actualDurationHours}/{module.estimatedDurationHours}h
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${module.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Coaching Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Coaching Sessions</h3>
            <div className="space-y-4">
              {businessProfile.aiCoachingSessions.slice(0, 2).map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {session.coachingType}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Duration: {session.durationMinutes} min
                    </div>
                    <div className="text-sm text-gray-600">
                      Rating: {session.effectivenessRating}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Training Modules</h3>
            <button
              onClick={() => setShowNewModuleModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Module
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessProfile.trainingModules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{module.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getModuleStatusColor(module.moduleStatus)}`}>
                    {module.moduleStatus}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{module.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${module.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{module.actualDurationHours}/{module.estimatedDurationHours}h</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold">{module.difficultyLevel}/10</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Certification:</span>
                    <span className={`font-semibold ${module.certificationEarned ? 'text-green-600' : 'text-gray-600'}`}>
                      {module.certificationEarned ? 'Earned' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedModule(module)}
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

      {activeTab === 'coaching' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">AI Coaching Sessions</h3>
            <button
              onClick={() => setShowNewCoachingModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </button>
          </div>

          <div className="space-y-4">
            {businessProfile.aiCoachingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{session.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {session.coachingType}
                    </span>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < session.effectivenessRating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <div className="font-semibold">{session.durationMinutes} min</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <div className="font-semibold">{new Date(session.sessionDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Effectiveness:</span>
                    <div className="font-semibold">{session.effectivenessRating}/5</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Satisfaction:</span>
                    <div className="font-semibold">{session.userSatisfaction}/5</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Improvement: +{session.progressMetrics.improvement}%
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
            <h3 className="text-lg font-semibold text-gray-900">Career Goals</h3>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessProfile.careerGoals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getGoalStatusColor(goal.status)}`}>
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
                    <span className="text-gray-600">Skills Required:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {goal.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {goal.skillsRequired.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{goal.skillsRequired.length - 3} more
                        </span>
                      )}
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
          <h3 className="text-lg font-semibold text-gray-900">Business Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Business Skills</h4>
              <div className="space-y-4">
                {Object.entries(businessProfile.businessSkills).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-semibold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Innovation Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ideas Generated</span>
                  <span className="font-semibold">{businessProfile.innovationMetrics.ideasGenerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Innovations Implemented</span>
                  <span className="font-semibold">{businessProfile.innovationMetrics.innovationsImplemented}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Process Improvements</span>
                  <span className="font-semibold">{businessProfile.innovationMetrics.processImprovements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creative Solutions</span>
                  <span className="font-semibold">{businessProfile.innovationMetrics.creativeSolutions}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Team Collaboration</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Collaboration Score</span>
                  <span className="font-semibold">{businessProfile.teamCollaboration.collaborationScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-semibold">{businessProfile.teamCollaboration.teamSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cross-functional Projects</span>
                  <span className="font-semibold">{businessProfile.teamCollaboration.crossFunctionalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mentoring Others</span>
                  <span className="font-semibold">{businessProfile.teamCollaboration.mentoringOthers}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Business Intelligence</h4>
              <div className="space-y-4">
                {Object.entries(businessProfile.businessIntelligence).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-semibold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                      <span className="ml-2 font-medium">{selectedSession.coachingType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{selectedSession.durationMinutes} minutes</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedSession.sessionDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Effectiveness:</span>
                      <span className="ml-2 font-medium">{selectedSession.effectivenessRating}/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Coaching Objectives</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedSession.coachingObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Guidance</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Insights</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiGuidance.insights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Strategies</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiGuidance.strategies.map((strategy, index) => (
                          <li key={index} className="flex items-start">
                            <Zap className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Follow-up Actions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedSession.followUpActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {action}
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