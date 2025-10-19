import React, { useState } from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'

interface EmotionalTutorProps {
  userId: string
}

export const EmotionalTutor: React.FC<EmotionalTutorProps> = ({ userId }) => {
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [sessionType, setSessionType] = useState('tutoring')
  const [subject, setSubject] = useState('general')
  const { getEmotionalTutorResponse } = useOmniMind(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setIsLoading(true)
    try {
      const result = await getEmotionalTutorResponse({
        user_input: userInput,
        session_type: sessionType,
        subject: subject
      })
      setResponse(result)
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        💝 Enhanced Emotional Tutor
        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          ChatGPT-Quality
        </span>
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tutoring">Tutoring</option>
              <option value="mentoring">Mentoring</option>
              <option value="counseling">Counseling</option>
              <option value="coaching">Coaching</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="mathematics">Mathematics</option>
              <option value="programming">Programming</option>
              <option value="science">Science</option>
              <option value="language">Language</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Share your thoughts, questions, or feelings..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              AI is thinking...
            </div>
          ) : (
            'Get AI Response'
          )}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">AI Response:</h4>
          <div className="space-y-3">
            {response.ai_response && (
              <div>
                <p className="text-gray-700 whitespace-pre-wrap">{response.ai_response}</p>
              </div>
            )}
            
            {response.emotional_tone && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Emotional Tone:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {response.emotional_tone}
                </span>
              </div>
            )}
            
            {response.learning_insights && (
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Learning Insights:</h5>
                <p className="text-sm text-gray-600">{response.learning_insights}</p>
              </div>
            )}
            
            {response.suggested_actions && (
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Suggested Actions:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {response.suggested_actions.map((action: string, index: number) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
