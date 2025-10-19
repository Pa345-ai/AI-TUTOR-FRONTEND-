import React, { useState } from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'

interface QuizGeneratorProps {
  userId: string
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ userId }) => {
  const [quizData, setQuizData] = useState({
    subject: 'mathematics',
    topic: 'algebra',
    difficulty_level: 'beginner',
    question_count: 5,
    quiz_type: 'multiple_choice'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [score, setScore] = useState<number | null>(null)
  const { generateQuiz } = useOmniMind(userId)

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await generateQuiz(quizData)
      setQuiz(result)
      setAnswers({})
      setScore(null)
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const calculateScore = () => {
    if (!quiz?.quiz?.questions) return

    let correct = 0
    quiz.quiz.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correct_answer) {
        correct++
      }
    })
    
    const percentage = Math.round((correct / quiz.quiz.questions.length) * 100)
    setScore(percentage)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        🧩 Enhanced Quiz Generator
        <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
          AI-Powered
        </span>
      </h3>

      {!quiz ? (
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={quizData.subject}
                onChange={(e) => setQuizData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="mathematics">Mathematics</option>
                <option value="programming">Programming</option>
                <option value="science">Science</option>
                <option value="language">Language</option>
                <option value="history">History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={quizData.topic}
                onChange={(e) => setQuizData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., algebra, functions, loops"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={quizData.difficulty_level}
                onChange={(e) => setQuizData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Count
              </label>
              <select
                value={quizData.question_count}
                onChange={(e) => setQuizData(prev => ({ ...prev, question_count: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Type
            </label>
            <select
              value={quizData.quiz_type}
              onChange={(e) => setQuizData(prev => ({ ...prev, quiz_type: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="fill_blank">Fill in the Blank</option>
              <option value="short_answer">Short Answer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Quiz...
              </div>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{quiz.quiz?.title || 'Generated Quiz'}</h4>
            <button
              onClick={() => setQuiz(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Generate New Quiz
            </button>
          </div>

          {quiz.quiz?.questions?.map((question: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-3">
                {index + 1}. {question.question}
              </h5>
              
              {question.hint && (
                <p className="text-sm text-blue-600 mb-3 italic">💡 Hint: {question.hint}</p>
              )}

              <div className="space-y-2">
                {question.options?.map((option: string, optionIndex: number) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>

              {question.reasoning_steps && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h6 className="text-sm font-medium text-gray-700 mb-1">Reasoning Steps:</h6>
                  <p className="text-sm text-gray-600">{question.reasoning_steps}</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              onClick={calculateScore}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Answers
            </button>
            <button
              onClick={() => setQuiz(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {score !== null && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h5 className="text-lg font-semibold mb-2">Quiz Results</h5>
              <div className="text-3xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                {score >= 80 ? 'Excellent work! 🎉' : 
                 score >= 60 ? 'Good job! Keep practicing! 👍' : 
                 'Keep studying! You can do better! 💪'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
