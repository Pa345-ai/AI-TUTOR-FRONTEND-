import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/auth/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    learning_style: '',
    difficulty_preference: '',
    time_commitment: '',
    interests: [] as string[],
    goals: '',
    experience_level: ''
  })

  const learningStyles = [
    { id: 'visual', name: 'Visual', description: 'Learn through images, diagrams, and visual aids' },
    { id: 'auditory', name: 'Auditory', description: 'Learn through listening and verbal explanations' },
    { id: 'kinesthetic', name: 'Hands-on', description: 'Learn through doing and practical activities' },
    { id: 'reading', name: 'Reading/Writing', description: 'Learn through text and written materials' }
  ]

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', description: 'New to the subject' },
    { id: 'intermediate', name: 'Intermediate', description: 'Some knowledge, want to improve' },
    { id: 'advanced', name: 'Advanced', description: 'Experienced, want to master' }
  ]

  const timeCommitments = [
    { id: '15min', name: '15 minutes/day', description: 'Quick daily sessions' },
    { id: '30min', name: '30 minutes/day', description: 'Moderate daily learning' },
    { id: '1hour', name: '1 hour/day', description: 'Dedicated daily study' },
    { id: '2hours', name: '2+ hours/day', description: 'Intensive learning' }
  ]

  const interestAreas = [
    'Mathematics', 'Science', 'Technology', 'Languages', 'History',
    'Art & Design', 'Music', 'Business', 'Health & Fitness', 'Philosophy',
    'Psychology', 'Economics', 'Literature', 'Geography', 'Sports'
  ]

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Update user profile with onboarding data
      const { error } = await supabase
        .from('users')
        .update({
          learning_style: formData.learning_style,
          difficulty_preference: formData.difficulty_preference,
          time_commitment: formData.time_commitment,
          interests: formData.interests,
          goals: formData.goals,
          experience_level: formData.experience_level,
          onboarding_completed: true
        })
        .eq('id', user?.id)

      if (error) throw error

      // Create initial learning path
      const { data: learningPathData } = await supabase
        .from('learning_paths')
        .insert({
          user_id: user?.id,
          title: 'Your Personalized Learning Journey',
          description: 'AI-generated learning path based on your preferences',
          subjects: formData.interests,
          difficulty_level: formData.difficulty_preference,
          estimated_duration: formData.time_commitment,
          status: 'active'
        })
        .select()
        .single()

      if (learningPathData) {
        // Initialize gamification data
        await supabase
          .from('gamification')
          .insert({
            user_id: user?.id,
            level: 1,
            total_xp: 0,
            current_streak: 0,
            longest_streak: 0,
            badges: [],
            achievements: []
          })

        // Create initial cognitive twin
        await supabase
          .from('cognitive_twins')
          .insert({
            user_id: user?.id,
            learning_style: formData.learning_style,
            difficulty_preference: formData.difficulty_preference,
            interests: formData.interests,
            goals: formData.goals,
            experience_level: formData.experience_level,
            knowledge_graph: {},
            learning_patterns: {},
            strengths: [],
            weaknesses: [],
            recommendations: []
          })
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">How do you learn best?</h2>
            <p className="text-gray-600">This helps us personalize your learning experience</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleInputChange('learning_style', style.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.learning_style === style.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{style.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What's your experience level?</h2>
            <p className="text-gray-600">This helps us set the right difficulty for you</p>
            <div className="space-y-4">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleInputChange('difficulty_preference', level.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.difficulty_preference === level.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{level.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">How much time can you commit?</h2>
            <p className="text-gray-600">We'll create a schedule that fits your lifestyle</p>
            <div className="space-y-4">
              {timeCommitments.map((commitment) => (
                <button
                  key={commitment.id}
                  onClick={() => handleInputChange('time_commitment', commitment.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.time_commitment === commitment.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{commitment.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{commitment.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What interests you?</h2>
            <p className="text-gray-600">Select all subjects you'd like to learn about</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestAreas.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    formData.interests.includes(interest)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What are your learning goals?</h2>
            <p className="text-gray-600">Tell us what you want to achieve</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => handleInputChange('experience_level', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select your experience level</option>
                  <option value="student">Student</option>
                  <option value="professional">Working Professional</option>
                  <option value="retired">Retired</option>
                  <option value="career_change">Career Changer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="Describe what you want to achieve through learning..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.learning_style) ||
                  (currentStep === 2 && !formData.difficulty_preference) ||
                  (currentStep === 3 && !formData.time_commitment) ||
                  (currentStep === 4 && formData.interests.length === 0)
                }
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading || !formData.goals || !formData.experience_level}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}