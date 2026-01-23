import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizGeneratorProps {
  subject?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  onQuizComplete?: (score: number, total: number) => void
}

export default function QuizGenerator({ subject = 'General', difficulty = 'medium', onQuizComplete }: QuizGeneratorProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizComplete, setQuizComplete] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateQuiz()
  }, [subject, difficulty])

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit()
    }
  }, [timeLeft, showResult, quizComplete])

  const generateQuiz = async () => {
    setIsGenerating(true)
    try {
      // Simulate AI quiz generation
      const generatedQuestions = await generateAIQuestions(subject, difficulty)
      setQuestions(generatedQuestions)
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
      setTimeLeft(30)
      setQuizComplete(false)
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAIQuestions = async (subject: string, difficulty: string): Promise<Question[]> => {
    // This would typically call your AI API
    const sampleQuestions: Question[] = [
      {
        id: '1',
        question: `What is the primary focus of ${subject}?`,
        options: [
          'Theoretical concepts',
          'Practical applications',
          'Historical context',
          'Future predictions'
        ],
        correctAnswer: 1,
        explanation: 'This subject primarily focuses on practical applications and real-world usage.',
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      },
      {
        id: '2',
        question: `Which of the following is most important in ${subject}?`,
        options: [
          'Memorization',
          'Understanding concepts',
          'Following procedures',
          'Creative thinking'
        ],
        correctAnswer: 1,
        explanation: 'Understanding the underlying concepts is crucial for mastery in this subject.',
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      },
      {
        id: '3',
        question: `How does ${subject} relate to everyday life?`,
        options: [
          'It has no practical use',
          'It only applies to professionals',
          'It affects many daily activities',
          'It is purely academic'
        ],
        correctAnswer: 2,
        explanation: 'This subject has wide-ranging applications in daily life and various fields.',
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      }
    ]
    return sampleQuestions
  }

  const handleAnswerSelect = (index: number) => {
    if (showResult || quizComplete) return
    setSelectedAnswer(index)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return
    
    setShowResult(true)
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      setQuizComplete(true)
      onQuizComplete?.(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0), questions.length)
    }
  }

  const handleRestart = () => {
    generateQuiz()
  }

  if (isGenerating) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your personalized quiz...</p>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
          <p className="text-gray-300 mb-6">Great job on finishing the quiz</p>
          
          <div className="bg-white/20 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold text-white mb-2">{score}/{questions.length}</div>
            <div className="text-lg text-gray-300 mb-4">{percentage}% Correct</div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              ></motion.div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white text-lg">No questions available</p>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">AI Quiz Generator</h3>
            <p className="text-gray-400">{subject} • {difficulty}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">{score} correct</div>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-semibold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/20 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">{question.question}</h4>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  selectedAnswer === index
                    ? showResult
                      ? index === question.correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : 'bg-red-500/20 border-2 border-red-500 text-red-400'
                      : 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                    : showResult && index === question.correctAnswer
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? showResult
                        ? index === question.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : 'border-blue-500 bg-blue-500'
                      : showResult && index === question.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : 'border-white/40'
                  }`}>
                    {selectedAnswer === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                    {showResult && index === question.correctAnswer && selectedAnswer !== index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <h5 className="text-lg font-semibold text-white">
                {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
              </h5>
            </div>
            <p className="text-gray-300">{question.explanation}</p>
          </motion.div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}