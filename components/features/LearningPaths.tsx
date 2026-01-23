import React, { useState } from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'
import { LearningPath } from '../../lib/supabase'

interface LearningPathsProps {
  userId: string
}

export const LearningPaths: React.FC<LearningPathsProps> = ({ userId }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatedPath, setGeneratedPath] = useState<any>(null)
  const { learningPaths, generateLearningPath } = useOmniMind(userId)

  const [pathData, setPathData] = useState({
    subject: 'programming',
    difficulty_level: 'beginner',
    learning_goals: ['Master Python', 'Build projects'],
    preferred_languages: ['en'],
    learning_style: 'visual'
  })

  const handleGeneratePath = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const result = await generateLearningPath(pathData)
      setGeneratedPath(result)
      setShowGenerator(false)
    } catch (error) {
      console.error('Error generating learning path:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">📚 Learning Paths</h2>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showGenerator ? 'Hide Generator' : 'Generate New Path'}
        </button>
      </div>

      {showGenerator && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Generate Personalized Learning Path</h3>
          <form onSubmit={handleGeneratePath} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={pathData.subject}
                  onChange={(e) => setPathData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="programming">Programming</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="language">Language</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={pathData.difficulty_level}
                  onChange={(e) => setPathData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Style
                </label>
                <select
                  value={pathData.learning_style}
                  onChange={(e) => setPathData(prev => ({ ...prev, learning_style: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                  <option value="reading">Reading/Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Languages
                </label>
                <select
                  value={pathData.preferred_languages[0]}
                  onChange={(e) => setPathData(prev => ({ ...prev, preferred_languages: [e.target.value] }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learning Goals (one per line)
              </label>
              <textarea
                value={pathData.learning_goals.join('\n')}
                onChange={(e) => setPathData(prev => ({ 
                  ...prev, 
                  learning_goals: e.target.value.split('\n').filter(goal => goal.trim()) 
                }))}
                placeholder="Master Python programming&#10;Build web applications&#10;Learn data science"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Learning Path...
                </div>
              ) : (
                'Generate Learning Path'
              )}
            </button>
          </form>
        </div>
      )}

      {generatedPath && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎉 Generated Learning Path</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Path Overview:</h4>
              <p className="text-blue-700">{generatedPath.learning_path?.overview || 'AI-generated learning path'}</p>
            </div>
            
            {generatedPath.learning_path?.modules && (
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Learning Modules:</h4>
                <div className="space-y-2">
                  {generatedPath.learning_path.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-blue-200">
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
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {learningPaths.map((path: LearningPath) => (
          <div key={path.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{path.title}</h3>
                <p className="text-gray-600 mt-1">{path.description}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty_level)}`}>
                  {path.difficulty_level}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(path.status)}`}>
                  {path.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subject: {path.subject}</span>
                <span>Duration: {path.estimated_duration} hours</span>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{path.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${path.progress_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Continue Learning
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {learningPaths.length === 0 && !showGenerator && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Learning Paths Yet</h3>
          <p className="text-gray-600 mb-4">Generate your first personalized learning path to get started!</p>
          <button
            onClick={() => setShowGenerator(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Learning Path
          </button>
        </div>
      )}
    </div>
  )
}
