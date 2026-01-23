"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Calculator,
  BookOpen,
  Target,
  ArrowRight,
  ArrowDown,
  Plus,
  Minus,
  Divide,
  X,
  Equal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Step {
  id: string;
  title: string;
  description: string;
  equation?: string;
  explanation: string;
  visualElements: VisualElement[];
  isCorrect: boolean;
  userInput?: string;
  expectedAnswer?: string;
  hints: string[];
}

interface VisualElement {
  id: string;
  type: 'equation' | 'diagram' | 'graph' | 'text' | 'highlight' | 'arrow' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  animation?: 'fadeIn' | 'slideIn' | 'highlight' | 'pulse';
}

interface Problem {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'science' | 'physics' | 'chemistry' | 'biology';
  difficulty: 'easy' | 'medium' | 'hard';
  steps: Step[];
  finalAnswer: string;
  explanation: string;
}

export function StepByStepVisualSolver() {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [stepId: string]: string }>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Sample problems
  const sampleProblems: Problem[] = [
    {
      id: '1',
      title: 'Solving Linear Equations',
      description: 'Solve for x: 2x + 5 = 13',
      subject: 'math',
      difficulty: 'easy',
      steps: [
        {
          id: '1-1',
          title: 'Identify the equation',
          description: 'We have a linear equation with one variable',
          equation: '2x + 5 = 13',
          explanation: 'This is a linear equation where we need to find the value of x that makes the equation true.',
          visualElements: [
            {
              id: 'eq1',
              type: 'equation',
              content: '2x + 5 = 13',
              position: { x: 100, y: 100 },
              size: { width: 200, height: 50 },
              color: '#3B82F6',
              animation: 'fadeIn'
            }
          ],
          isCorrect: true,
          hints: ['Look for the variable x', 'Identify the constants']
        },
        {
          id: '1-2',
          title: 'Isolate the variable term',
          description: 'Subtract 5 from both sides',
          equation: '2x + 5 - 5 = 13 - 5',
          explanation: 'We subtract 5 from both sides to isolate the term containing x.',
          visualElements: [
            {
              id: 'eq2',
              type: 'equation',
              content: '2x + 5 - 5 = 13 - 5',
              position: { x: 100, y: 150 },
              size: { width: 250, height: 50 },
              color: '#10B981',
              animation: 'slideIn'
            },
            {
              id: 'arrow1',
              type: 'arrow',
              content: '↓',
              position: { x: 200, y: 120 },
              size: { width: 20, height: 20 },
              color: '#EF4444',
              animation: 'pulse'
            }
          ],
          isCorrect: true,
          hints: ['Subtract the same number from both sides', 'Keep the equation balanced']
        },
        {
          id: '1-3',
          title: 'Simplify',
          description: 'Simplify both sides',
          equation: '2x = 8',
          explanation: 'After subtracting 5 from both sides, we get 2x = 8.',
          visualElements: [
            {
              id: 'eq3',
              type: 'equation',
              content: '2x = 8',
              position: { x: 100, y: 200 },
              size: { width: 150, height: 50 },
              color: '#8B5CF6',
              animation: 'highlight'
            }
          ],
          isCorrect: true,
          hints: ['Combine like terms', 'Simplify the arithmetic']
        },
        {
          id: '1-4',
          title: 'Solve for x',
          description: 'Divide both sides by 2',
          equation: 'x = 4',
          explanation: 'Divide both sides by 2 to get x = 4.',
          visualElements: [
            {
              id: 'eq4',
              type: 'equation',
              content: 'x = 4',
              position: { x: 100, y: 250 },
              size: { width: 100, height: 50 },
              color: '#F59E0B',
              animation: 'fadeIn'
            },
            {
              id: 'check',
              type: 'shape',
              content: '✓',
              position: { x: 220, y: 250 },
              size: { width: 30, height: 30 },
              color: '#10B981',
              animation: 'pulse'
            }
          ],
          isCorrect: true,
          hints: ['Divide by the coefficient of x', 'Check your answer by substitution']
        }
      ],
      finalAnswer: 'x = 4',
      explanation: 'The solution to the equation 2x + 5 = 13 is x = 4. We can verify this by substituting x = 4 back into the original equation: 2(4) + 5 = 8 + 5 = 13 ✓'
    },
    {
      id: '2',
      title: 'Quadratic Formula',
      description: 'Solve using the quadratic formula: x² - 5x + 6 = 0',
      subject: 'math',
      difficulty: 'medium',
      steps: [
        {
          id: '2-1',
          title: 'Identify coefficients',
          description: 'For ax² + bx + c = 0, identify a, b, and c',
          equation: 'x² - 5x + 6 = 0',
          explanation: 'In the equation x² - 5x + 6 = 0, we have a = 1, b = -5, and c = 6.',
          visualElements: [
            {
              id: 'coeffs',
              type: 'text',
              content: 'a = 1, b = -5, c = 6',
              position: { x: 100, y: 100 },
              size: { width: 200, height: 30 },
              color: '#3B82F6',
              animation: 'fadeIn'
            }
          ],
          isCorrect: true,
          hints: ['Look for the coefficient of x²', 'Identify the coefficient of x', 'Find the constant term']
        },
        {
          id: '2-2',
          title: 'Apply quadratic formula',
          description: 'Use x = (-b ± √(b² - 4ac)) / 2a',
          equation: 'x = (5 ± √(25 - 24)) / 2',
          explanation: 'Substitute the values: x = (-(-5) ± √((-5)² - 4(1)(6))) / 2(1)',
          visualElements: [
            {
              id: 'formula',
              type: 'equation',
              content: 'x = (5 ± √(25 - 24)) / 2',
              position: { x: 100, y: 150 },
              size: { width: 300, height: 50 },
              color: '#10B981',
              animation: 'slideIn'
            }
          ],
          isCorrect: true,
          hints: ['Substitute carefully', 'Watch the signs', 'Calculate the discriminant']
        },
        {
          id: '2-3',
          title: 'Simplify',
          description: 'Simplify the discriminant and solve',
          equation: 'x = (5 ± 1) / 2',
          explanation: '√(25 - 24) = √1 = 1, so x = (5 ± 1) / 2',
          visualElements: [
            {
              id: 'simplified',
              type: 'equation',
              content: 'x = (5 ± 1) / 2',
              position: { x: 100, y: 200 },
              size: { width: 200, height: 50 },
              color: '#8B5CF6',
              animation: 'highlight'
            }
          ],
          isCorrect: true,
          hints: ['Calculate the square root', 'Simplify the expression']
        },
        {
          id: '2-4',
          title: 'Find both solutions',
          description: 'Calculate both values of x',
          equation: 'x = 3 or x = 2',
          explanation: 'x = (5 + 1) / 2 = 6 / 2 = 3, and x = (5 - 1) / 2 = 4 / 2 = 2',
          visualElements: [
            {
              id: 'solutions',
              type: 'equation',
              content: 'x = 3 or x = 2',
              position: { x: 100, y: 250 },
              size: { width: 200, height: 50 },
              color: '#F59E0B',
              animation: 'fadeIn'
            }
          ],
          isCorrect: true,
          hints: ['Calculate both cases', 'Check your answers']
        }
      ],
      finalAnswer: 'x = 3 or x = 2',
      explanation: 'The solutions to x² - 5x + 6 = 0 are x = 3 and x = 2. We can verify by substituting back into the original equation.'
    }
  ];

  // Start a new problem
  const startProblem = (problem: Problem) => {
    setCurrentProblem(problem);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setUserAnswers({});
    setCompletedSteps(new Set());
    setShowHints(false);
  };

  // Play/pause animation
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Next step
  const nextStep = () => {
    if (currentProblem && currentStepIndex < currentProblem.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Previous step
  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Reset to beginning
  const resetProblem = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setUserAnswers({});
    setCompletedSteps(new Set());
  };

  // Submit answer for current step
  const submitAnswer = (stepId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [stepId]: answer }));
    
    if (currentProblem) {
      const step = currentProblem.steps.find(s => s.id === stepId);
      if (step && step.expectedAnswer) {
        const isCorrect = answer.toLowerCase().trim() === step.expectedAnswer.toLowerCase().trim();
        if (isCorrect) {
          setCompletedSteps(prev => new Set([...prev, stepId]));
        }
      }
    }
  };

  // Render visual elements
  const renderVisualElements = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentProblem) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentStep = currentProblem.steps[currentStepIndex];
    if (!currentStep) return;

    currentStep.visualElements.forEach(element => {
      ctx.save();

      // Set color
      ctx.fillStyle = element.color || '#000000';
      ctx.strokeStyle = element.color || '#000000';

      // Apply animation
      if (element.animation === 'fadeIn' && isAnimating) {
        ctx.globalAlpha = 0.7;
      } else if (element.animation === 'pulse' && isAnimating) {
        const time = Date.now() * 0.005;
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time);
      }

      // Render based on type
      switch (element.type) {
        case 'equation':
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.content, element.position.x, element.position.y);
          break;
        case 'text':
          ctx.font = '16px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(element.content, element.position.x, element.position.y);
          break;
        case 'arrow':
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.content, element.position.x, element.position.y);
          break;
        case 'shape':
          if (element.content === '✓') {
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✓', element.position.x, element.position.y);
          }
          break;
        case 'highlight':
          ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
          ctx.fillRect(element.position.x - 10, element.position.y - 20, element.size.width + 20, element.size.height + 10);
          ctx.fillStyle = element.color || '#000000';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.content, element.position.x, element.position.y);
          break;
      }

      ctx.restore();
    });
  }, [currentProblem, currentStepIndex, isAnimating]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setIsAnimating(true);
        renderVisualElements();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnimating(false);
      renderVisualElements();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, renderVisualElements]);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && currentProblem) {
      const timer = setTimeout(() => {
        if (currentStepIndex < currentProblem.steps.length - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, 3000); // 3 seconds per step

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStepIndex, currentProblem]);

  return (
    <div className="step-by-step-solver h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Step-by-Step Visual Solver</h2>
        <div className="flex items-center gap-2">
          {currentProblem && (
            <>
              <Button
                variant="outline"
                onClick={togglePlayPause}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <SkipBack className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextStep}
                disabled={currentStepIndex >= (currentProblem?.steps.length || 0) - 1}
                className="flex items-center gap-2"
              >
                Next
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={resetProblem}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Problem selection sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Problems</h3>
          <div className="space-y-2">
            {sampleProblems.map(problem => (
              <div
                key={problem.id}
                className={`p-3 rounded-lg cursor-pointer border ${
                  currentProblem?.id === problem.id 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => startProblem(problem)}
              >
                <h4 className="font-medium text-sm">{problem.title}</h4>
                <p className="text-xs text-gray-500">{problem.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{problem.subject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {currentProblem ? (
            <>
              {/* Problem info */}
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold">{currentProblem.title}</h3>
                <p className="text-gray-600">{currentProblem.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    Step {currentStepIndex + 1} of {currentProblem.steps.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {currentProblem.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual canvas */}
              <div className="flex-1 p-4">
                <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full"
                  />
                </div>

                {/* Current step */}
                {currentProblem.steps[currentStepIndex] && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">
                      {currentProblem.steps[currentStepIndex].title}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {currentProblem.steps[currentStepIndex].description}
                    </p>
                    
                    {currentProblem.steps[currentStepIndex].equation && (
                      <div className="bg-gray-100 p-3 rounded mb-4">
                        <code className="text-lg font-mono">
                          {currentProblem.steps[currentStepIndex].equation}
                        </code>
                      </div>
                    )}

                    <p className="text-gray-700 mb-4">
                      {currentProblem.steps[currentStepIndex].explanation}
                    </p>

                    {/* User input for interactive steps */}
                    {currentProblem.steps[currentStepIndex].expectedAnswer && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Your answer:
                        </label>
                        <div className="flex gap-2">
                          <Textarea
                            value={userAnswers[currentProblem.steps[currentStepIndex].id] || ''}
                            onChange={(e) => setUserAnswers(prev => ({
                              ...prev,
                              [currentProblem.steps[currentStepIndex].id]: e.target.value
                            }))}
                            placeholder="Enter your answer..."
                            className="flex-1"
                          />
                          <Button
                            onClick={() => submitAnswer(
                              currentProblem.steps[currentStepIndex].id,
                              userAnswers[currentProblem.steps[currentStepIndex].id] || ''
                            )}
                            disabled={completedSteps.has(currentProblem.steps[currentStepIndex].id)}
                          >
                            Submit
                          </Button>
                        </div>
                        {completedSteps.has(currentProblem.steps[currentStepIndex].id) && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Correct!
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hints */}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2"
                      >
                        <Lightbulb className="h-4 w-4" />
                        {showHints ? 'Hide' : 'Show'} Hints
                      </Button>
                      {showHints && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <ul className="space-y-1">
                            {currentProblem.steps[currentStepIndex].hints.map((hint, index) => (
                              <li key={index} className="text-sm text-yellow-800">
                                • {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a problem to start solving step by step</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}