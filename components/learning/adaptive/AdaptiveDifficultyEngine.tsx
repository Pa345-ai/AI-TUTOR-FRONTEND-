import React, { useState, useEffect } from 'react'

interface AdaptiveDifficultyEngineProps {
  userId: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  timeLimit: number
}

interface PerformanceMetrics {
  accuracy: number
  averageTime: number
  confidence: number
  streak: number
  difficultyLevel: number
}

export const AdaptiveDifficultyEngine: React.FC<AdaptiveDifficultyEngineProps> = ({ userId }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    accuracy: 0,
    averageTime: 0,
    confidence: 0,
    streak: 0,
    difficultyLevel: 1
  })
  const [questionHistory, setQuestionHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sample questions with different difficulty levels
  const questionBank: Question[] = [
    {
      id: '1',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      difficulty: 'easy',
      explanation: 'Basic addition: 2 + 2 = 4',
      timeLimit: 30
    },
    {
      id: '2',
      question: 'Solve for x: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 'x = 4',
      difficulty: 'medium',
      explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
      timeLimit: 60
    },
    {
      id: '3',
      question: 'Find the derivative of f(x) = x³ + 2x² - 5x + 1',
      options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x + 5'],
      correctAnswer: '3x² + 4x - 5',
      difficulty: 'hard',
      explanation: 'Using power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0',
      timeLimit: 120
    }
  ]

  useEffect(() => {
    generateNextQuestion()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp()
    }
  }, [timeLeft, isAnswered])

  const generateNextQuestion = () => {
    setIsLoading(true)
    
    // Simulate AI difficulty adjustment based on performance
    const difficultyLevel = Math.min(Math.max(performance.difficultyLevel, 1), 3)
    const availableQuestions = questionBank.filter(q => {
      const difficultyScore = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3
      return Math.abs(difficultyScore - difficultyLevel) <= 1
    })
    
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    
    setTimeout(() => {
      setCurrentQuestion(randomQuestion)
      setTimeLeft(randomQuestion.timeLimit)
      setSelectedAnswer('')
      setIsAnswered(false)
      setShowExplanation(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const timeUsed = currentQuestion.timeLimit - timeLeft
    const confidence = calculateConfidence(timeUsed, currentQuestion.timeLimit)
    
    // Update performance metrics
    const newPerformance = updatePerformance(isCorrect, timeUsed, confidence)
    setPerformance(newPerformance)
    
    // Add to question history
    const questionResult = {
      question: currentQuestion.question,
      difficulty: currentQuestion.difficulty,
      correct: isCorrect,
      timeUsed,
      confidence,
      timestamp: new Date()
    }
    setQuestionHistory(prev => [questionResult, ...prev.slice(0, 9)]) // Keep last 10
    
    setIsAnswered(true)
    setShowExplanation(true)
  }

  const handleTimeUp = () => {
    if (!currentQuestion) return
    
    const timeUsed = currentQuestion.timeLimit
    const confidence = 0 // No confidence if time ran out
    
    const newPerformance = updatePerformance(false, timeUsed, confidence)
    setPerformance(newPerformance)
    
    const questionResult = {
      question: currentQuestion.question,
      difficulty: currentQuestion.difficulty,
      correct: false,
      timeUsed,
      confidence,
      timestamp: new Date(),
      reason: 'timeout'
    }
    setQuestionHistory(prev => [questionResult, ...prev.slice(0, 9)])
    
    setIsAnswered(true)
    setShowExplanation(true)
  }

  const calculateConfidence = (timeUsed: number, timeLimit: number): number => {
    const timeRatio = timeUsed / timeLimit
    if (timeRatio <= 0.3) return 0.9 // Very confident
    if (timeRatio <= 0.6) return 0.7 // Confident
    if (timeRatio <= 0.8) return 0.5 // Somewhat confident
    return 0.3 // Not confident
  }

  const updatePerformance = (isCorrect: boolean, timeUsed: number, confidence: number): PerformanceMetrics => {
    const totalQuestions = questionHistory.length + 1
    const currentAccuracy = performance.accuracy * (totalQuestions - 1) / totalQuestions + (isCorrect ? 1 : 0) / totalQuestions
    const currentAvgTime = (performance.averageTime * (totalQuestions - 1) + timeUsed) / totalQuestions
    const currentConfidence = (performance.confidence * (totalQuestions - 1) + confidence) / totalQuestions
    const newStreak = isCorrect ? performance.streak + 1 : 0
    
    // Adjust difficulty based on performance
    let newDifficultyLevel = performance.difficultyLevel
    if (isCorrect && confidence > 0.7 && newStreak >= 3) {
      newDifficultyLevel = Math.min(performance.difficultyLevel + 0.2, 3)
    } else if (!isCorrect || confidence < 0.3) {
      newDifficultyLevel = Math.max(performance.difficultyLevel - 0.3, 1)
    }
    
    return {
      accuracy: Math.round(currentAccuracy * 100),
      averageTime: Math.round(currentAvgTime),
      confidence: Math.round(currentConfidence * 100),
      streak: newStreak,
      difficultyLevel: Math.round(newDifficultyLevel * 10) / 10
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPerformanceColor = (value: number, type: 'accuracy' | 'confidence') => {
    if (type === 'accuracy') {
      if (value >= 80) return 'text-green-600'
      if (value >= 60) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value >= 70) return 'text-blue-600'
      if (value >= 50) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎯 Adaptive Difficulty Engine</h2>
        <p className="text-purple-100">AI automatically adjusts difficulty based on your performance</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.accuracy, 'accuracy')}`}>
              {performance.accuracy}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {performance.averageTime}s
            </div>
            <div className="text-sm text-gray-600">Avg Time</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.confidence, 'confidence')}`}>
              {performance.confidence}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {performance.streak}
            </div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {performance.difficultyLevel}
            </div>
            <div className="text-sm text-gray-600">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is generating your next question...</p>
        </div>
      ) : currentQuestion && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Difficulty Level: {performance.difficultyLevel}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time Left:</span>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isAnswered
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : selectedAnswer === option
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    : selectedAnswer === option
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>

          {!isAnswered && (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          )}

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p className="text-blue-700 mb-2">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">
                  Time used: {currentQuestion.timeLimit - timeLeft}s
                </span>
                <button
                  onClick={generateNextQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next Question
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question History */}
      {questionHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Recent Performance</h3>
          <div className="space-y-2">
            {questionHistory.slice(0, 5).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    result.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {result.correct ? '✓' : '✗'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-md">
                      {result.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      {result.difficulty} • {result.timeUsed}s • {Math.round(result.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">🤖 AI Learning Insights</h3>
        <div className="space-y-2 text-indigo-700">
          <p>• <strong>Difficulty Adjustment:</strong> {performance.difficultyLevel >= 2.5 ? 'Challenging you with harder questions' : performance.difficultyLevel <= 1.5 ? 'Building confidence with easier questions' : 'Maintaining optimal challenge level'}</p>
          <p>• <strong>Learning Pattern:</strong> {performance.streak >= 3 ? 'You\'re on a roll! Keep it up!' : 'Focus on accuracy over speed'}</p>
          <p>• <strong>Recommendation:</strong> {performance.confidence < 50 ? 'Take your time to think through each problem' : 'You\'re ready for more challenging content!'}</p>
        </div>
      </div>
    </div>
  )
}