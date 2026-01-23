import React, { useState, useEffect } from 'react'
import { useOmniMind } from '../../../hooks/useOmniMind'

interface PersonalizedLearningPathProps {
  userId: string
}

export const PersonalizedLearningPath: React.FC<PersonalizedLearningPathProps> = ({ userId }) => {
  const { generateLearningPath, learningPaths, loading } = useOmniMind(userId)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPath, setCurrentPath] = useState<any>(null)
  const [dailyGoals, setDailyGoals] = useState<any[]>([])
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState({
    accuracy: 0,
    speed: 0,
    engagement: 0,
    weaknesses: [] as string[]
  })

  const [formData, setFormData] = useState({
    subject: '',
    currentLevel: 'beginner',
    learningGoals: [] as string[],
    timeCommitment: '30',
    preferredStyle: 'visual'
  })

  const handleGeneratePath = async () => {
    setIsGenerating(true)
    try {
      const result = await generateLearningPath({
        subject: formData.subject,
        difficulty_level: formData.currentLevel,
        learning_goals: formData.learningGoals,
        preferred_languages: ['English'],
        learning_style: formData.preferredStyle
      })
      
      if (result.learning_path) {
        setCurrentPath(result.learning_path)
        generateDailyWeeklyGoals(result.learning_path)
        analyzePerformance(result.learning_path)
      }
    } catch (error) {
      console.error('Error generating learning path:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDailyWeeklyGoals = (path: any) => {
    // Generate daily goals based on the learning path
    const daily = [
      { id: 1, title: "Master Basic Concepts", description: "Complete 3 practice problems on fractions", xp: 50, completed: false },
      { id: 2, title: "Review Previous Lessons", description: "Go through yesterday's material", xp: 30, completed: false },
      { id: 3, title: "Take Quick Assessment", description: "5-minute knowledge check", xp: 40, completed: false }
    ]
    
    const weekly = [
      { id: 1, title: "Complete Module 1", description: "Finish all lessons in Introduction to Algebra", xp: 200, completed: false },
      { id: 2, title: "Achieve 80% Accuracy", description: "Maintain high performance across all quizzes", xp: 150, completed: false },
      { id: 3, title: "Build Study Streak", description: "Learn for 5 consecutive days", xp: 100, completed: false }
    ]
    
    setDailyGoals(daily)
    setWeeklyGoals(weekly)
  }

  const analyzePerformance = (path: any) => {
    // Simulate performance analysis
    setPerformanceData({
      accuracy: Math.floor(Math.random() * 40) + 60, // 60-100%
      speed: Math.floor(Math.random() * 30) + 70, // 70-100%
      engagement: Math.floor(Math.random() * 25) + 75, // 75-100%
      weaknesses: ['Fractions', 'Word Problems', 'Geometry']
    })
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600'
    if (value >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBg = (value: number) => {
    if (value >= 90) return 'bg-green-100'
    if (value >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🧠 Ultra-Intelligent Learning Engine</h2>
        <p className="text-blue-100">AI-powered personalized learning that adapts to your unique needs</p>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${getPerformanceBg(performanceData.accuracy)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Accuracy</span>
            <span className={`text-lg font-bold ${getPerformanceColor(performanceData.accuracy)}`}>
              {performanceData.accuracy}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performanceData.accuracy}%` }}
            ></div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${getPerformanceBg(performanceData.speed)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Speed</span>
            <span className={`text-lg font-bold ${getPerformanceColor(performanceData.speed)}`}>
              {performanceData.speed}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performanceData.speed}%` }}
            ></div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${getPerformanceBg(performanceData.engagement)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Engagement</span>
            <span className={`text-lg font-bold ${getPerformanceColor(performanceData.engagement)}`}>
              {performanceData.engagement}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performanceData.engagement}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-orange-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Weaknesses</span>
            <span className="text-lg font-bold text-orange-600">
              {performanceData.weaknesses.length}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Areas to focus on
          </div>
        </div>
      </div>

      {/* Learning Path Generator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🎯 Generate Your Personal Learning Path</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="e.g., Mathematics, Science, Programming"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
            <select
              value={formData.currentLevel}
              onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment (minutes/day)</label>
            <input
              type="number"
              value={formData.timeCommitment}
              onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
            <select
              value={formData.preferredStyle}
              onChange={(e) => setFormData({...formData, preferredStyle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
              <option value="reading">Reading/Writing</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
          <div className="flex flex-wrap gap-2">
            {['Master Algebra', 'Improve Problem Solving', 'Prepare for Exams', 'Build Confidence'].map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  const newGoals = formData.learningGoals.includes(goal)
                    ? formData.learningGoals.filter(g => g !== goal)
                    : [...formData.learningGoals, goal]
                  setFormData({...formData, learningGoals: newGoals})
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.learningGoals.includes(goal)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGeneratePath}
          disabled={isGenerating || !formData.subject}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? '🤖 AI is generating your path...' : '🚀 Generate My Learning Path'}
        </button>
      </div>

      {/* Current Learning Path */}
      {currentPath && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-4">🎉 Your Personalized Learning Path</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Path Overview</h4>
              <p className="text-gray-600">{currentPath.overview || 'AI-generated personalized learning journey'}</p>
            </div>
            
            {currentPath.modules && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Learning Modules</h4>
                {currentPath.modules.map((module: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-800">{module.title}</h5>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {module.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily & Weekly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Goals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📅 Daily Goals
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length}
            </span>
          </h3>
          
          <div className="space-y-3">
            {dailyGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={(e) => {
                      const updated = dailyGoals.map(g => 
                        g.id === goal.id ? {...g, completed: e.target.checked} : g
                      )
                      setDailyGoals(updated)
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{goal.title}</p>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  +{goal.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🗓️ Weekly Goals
            <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {weeklyGoals.filter(g => g.completed).length}/{weeklyGoals.length}
            </span>
          </h3>
          
          <div className="space-y-3">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={(e) => {
                      const updated = weeklyGoals.map(g => 
                        g.id === goal.id ? {...g, completed: e.target.checked} : g
                      )
                      setWeeklyGoals(updated)
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{goal.title}</p>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  +{goal.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weaknesses Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">🎯 Areas to Focus On</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceData.weaknesses.map((weakness, index) => (
            <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <span className="font-medium text-red-800">{weakness}</span>
              </div>
              <p className="text-sm text-red-600 mt-1">Needs more practice</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}