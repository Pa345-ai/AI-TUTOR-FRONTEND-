import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { 
  Brain, 
  BookOpen, 
  Users, 
  Trophy, 
  Settings, 
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Globe,
  Shield,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Sparkles
} from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const coreFeatures = [
    {
      id: 'personalized-learning',
      title: 'Personalized Learning Paths',
      description: 'AI creates custom learning journeys',
      icon: Target,
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'emotional-tutor',
      title: 'Emotional AI Tutor',
      description: 'AI that understands your emotions',
      icon: Brain,
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      id: 'quiz-generator',
      title: 'Dynamic Quiz Generator',
      description: 'AI creates personalized quizzes',
      icon: BookOpen,
      color: 'bg-green-500',
      status: 'active'
    },
    {
      id: 'collaborative-learning',
      title: 'Collaborative Study Rooms',
      description: 'Study with others in real-time',
      icon: Users,
      color: 'bg-orange-500',
      status: 'active'
    },
    {
      id: 'multilingual-tutor',
      title: 'Multilingual Support',
      description: 'Learn in any language',
      icon: Globe,
      color: 'bg-teal-500',
      status: 'active'
    },
    {
      id: 'gamification',
      title: 'Gamified Learning',
      description: 'Earn tokens and achievements',
      icon: Trophy,
      color: 'bg-yellow-500',
      status: 'active'
    }
  ]

  const billionDollarFeatures = [
    {
      id: 'meta-learning',
      title: 'Meta-Learning Core',
      description: 'AI that learns to teach itself',
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      status: 'active',
      value: '$2.5B'
    },
    {
      id: 'neuroverse',
      title: 'NeuroVerse Metaverse',
      description: '3D AI learning worlds',
      icon: Globe,
      color: 'bg-gradient-to-r from-green-500 to-blue-600',
      status: 'active',
      value: '$1.8B'
    },
    {
      id: 'digital-twin',
      title: 'Cognitive Digital Twin',
      description: 'Personal AI learning companions',
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      status: 'active',
      value: '$3.2B'
    },
    {
      id: 'ai-ecosystem',
      title: 'AI Ecosystem Infrastructure',
      description: 'Complete AI development platform',
      icon: Rocket,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      status: 'active',
      value: '$4.1B'
    },
    {
      id: 'omnimind',
      title: 'Cross-Domain OmniMind',
      description: 'Universal AI applications',
      icon: Target,
      color: 'bg-gradient-to-r from-teal-500 to-green-600',
      status: 'active',
      value: '$2.9B'
    },
    {
      id: 'token-economy',
      title: 'AI Tokenized Economy',
      description: 'Learn-to-earn token system',
      icon: Award,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      status: 'active',
      value: '$1.5B'
    },
    {
      id: 'ethical-ai',
      title: 'Ethical Intelligence',
      description: 'Transparent and fair AI',
      icon: Shield,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      status: 'active',
      value: '$2.3B'
    }
  ]

  const stats = [
    { label: 'Learning Hours', value: '1,247', icon: Clock, color: 'text-blue-500' },
    { label: 'Achievements', value: '23', icon: Trophy, color: 'text-yellow-500' },
    { label: 'AI Interactions', value: '8,456', icon: Brain, color: 'text-purple-500' },
    { label: 'Streak Days', value: '12', icon: Zap, color: 'text-green-500' }
  ]

  return (
    <>
      <Head>
        <title>Dashboard - OmniMind AI Tutor</title>
        <meta name="description" content="Your personalized AI learning dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">OmniMind AI Tutor</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Search className="w-6 h-6" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-6 h-6" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, Learner! 👋
            </h2>
            <p className="text-gray-300">
              Ready to continue your AI-powered learning journey?
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'core-features', label: 'Core Features' },
              { id: 'billion-dollar', label: 'Billion-Dollar Features' },
              { id: 'progress', label: 'Progress' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-3">
                    <Plus className="w-5 h-5" />
                    <span>Start New Lesson</span>
                  </button>
                  <button className="bg-white/20 text-white p-4 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-3">
                    <BookOpen className="w-5 h-5" />
                    <span>Take Quiz</span>
                  </button>
                  <button className="bg-white/20 text-white p-4 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-3">
                    <Users className="w-5 h-5" />
                    <span>Join Study Room</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Completed AI Quiz', time: '2 hours ago', icon: BookOpen },
                    { action: 'Earned Achievement', time: '4 hours ago', icon: Trophy },
                    { action: 'Joined Study Room', time: '1 day ago', icon: Users },
                    { action: 'AI Tutor Session', time: '2 days ago', icon: Brain }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
                      <activity.icon className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'core-features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      <span className="text-sm text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <button className="w-full bg-white/20 text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-all duration-300 group-hover:bg-white/30">
                    Launch Feature
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'billion-dollar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {billionDollarFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{feature.value}</div>
                        <div className="text-sm text-gray-400">Market Value</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400 font-medium">Active</span>
                      <button className="bg-white/20 text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-all duration-300">
                        Explore
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Progress Overview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Learning Progress</h3>
                <div className="space-y-4">
                  {[
                    { subject: 'Mathematics', progress: 75, color: 'bg-blue-500' },
                    { subject: 'Science', progress: 60, color: 'bg-green-500' },
                    { subject: 'Language Arts', progress: 85, color: 'bg-purple-500' },
                    { subject: 'History', progress: 45, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{item.subject}</span>
                        <span className="text-gray-400">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'First Steps', description: 'Completed your first lesson', icon: Star, earned: true },
                    { name: 'Quiz Master', description: 'Scored 100% on 5 quizzes', icon: Trophy, earned: true },
                    { name: 'Team Player', description: 'Joined 10 study rooms', icon: Users, earned: false },
                    { name: 'AI Explorer', description: 'Used all AI features', icon: Brain, earned: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-xl border-2 ${
                      achievement.earned 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-white/20 bg-white/5'
                    }`}>
                      <achievement.icon className={`w-8 h-8 mb-2 ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                      <h4 className={`font-semibold ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}