"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Palette, 
  Code, 
  BarChart3, 
  Calculator, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload,
  Eraser,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  ArrowDown,
  Minus,
  Plus,
  Save,
  Eye,
  EyeOff,
  Layers,
  Zap,
  Brain,
  Lightbulb,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DrawingTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'pen' | 'shape' | 'text' | 'eraser';
  color?: string;
  size?: number;
}

interface CodeExample {
  id: string;
  language: string;
  title: string;
  code: string;
  explanation: string;
  lineHighlights?: number[];
  interactive?: boolean;
}

interface Diagram {
  id: string;
  type: 'flowchart' | 'mindmap' | 'timeline' | 'hierarchy' | 'network';
  title: string;
  nodes: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
    type: 'start' | 'process' | 'decision' | 'end' | 'data';
    connections?: string[];
  }>;
  interactive: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  visual?: 'drawing' | 'code' | 'diagram' | 'calculation';
  content?: any;
  completed: boolean;
  hints?: string[];
}

interface Problem {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: Step[];
  solution?: any;
  timeEstimate: number; // minutes
}

export function MultiModalExplanations() {
  const [activeTool, setActiveTool] = useState<string>('pen');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const [showDiagram, setShowDiagram] = useState(true);
  const [showDrawing, setShowDrawing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const drawingTools: DrawingTool[] = [
    { id: 'pen', name: 'Pen', icon: <Palette className="h-4 w-4" />, type: 'pen' },
    { id: 'eraser', name: 'Eraser', icon: <Eraser className="h-4 w-4" />, type: 'eraser' },
    { id: 'rectangle', name: 'Rectangle', icon: <Square className="h-4 w-4" />, type: 'shape' },
    { id: 'circle', name: 'Circle', icon: <Circle className="h-4 w-4" />, type: 'shape' },
    { id: 'triangle', name: 'Triangle', icon: <Triangle className="h-4 w-4" />, type: 'shape' },
    { id: 'arrow', name: 'Arrow', icon: <ArrowRight className="h-4 w-4" />, type: 'shape' },
    { id: 'line', name: 'Line', icon: <Minus className="h-4 w-4" />, type: 'shape' }
  ];

  const codeExamples: CodeExample[] = [
    {
      id: 'python-basic',
      language: 'python',
      title: 'Basic Python Function',
      code: `def calculate_area(length, width):
    """Calculate the area of a rectangle"""
    area = length * width
    return area

# Example usage
length = 5
width = 3
result = calculate_area(length, width)
print(f"The area is {result}")`,
      explanation: 'This function takes two parameters (length and width) and returns their product. The docstring explains what the function does.',
      lineHighlights: [1, 4, 7, 8, 9],
      interactive: true
    },
    {
      id: 'javascript-async',
      language: 'javascript',
      title: 'Async/Await Example',
      code: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

// Usage
fetchUserData(123)
    .then(data => console.log(data))
    .catch(error => console.error(error));`,
      explanation: 'This function demonstrates async/await pattern for handling asynchronous operations. The try-catch block handles potential errors.',
      lineHighlights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14],
      interactive: true
    }
  ];

  const diagrams: Diagram[] = [
    {
      id: 'math-workflow',
      type: 'flowchart',
      title: 'Quadratic Equation Solving Process',
      nodes: [
        { id: 'start', label: 'Start', x: 100, y: 50, type: 'start' },
        { id: 'input', label: 'Input: ax² + bx + c = 0', x: 100, y: 120, type: 'data' },
        { id: 'discriminant', label: 'Calculate Discriminant\nD = b² - 4ac', x: 100, y: 190, type: 'process' },
        { id: 'check', label: 'D > 0?', x: 100, y: 260, type: 'decision' },
        { id: 'two-roots', label: 'Two Real Roots\nx = (-b ± √D) / 2a', x: 50, y: 330, type: 'process' },
        { id: 'one-root', label: 'One Real Root\nx = -b / 2a', x: 150, y: 330, type: 'process' },
        { id: 'no-roots', label: 'No Real Roots', x: 250, y: 330, type: 'process' },
        { id: 'end', label: 'Display Results', x: 100, y: 400, type: 'end' }
      ],
      interactive: true
    },
    {
      id: 'concept-map',
      type: 'mindmap',
      title: 'Algebra Concepts',
      nodes: [
        { id: 'algebra', label: 'Algebra', x: 200, y: 100, type: 'start' },
        { id: 'variables', label: 'Variables', x: 100, y: 180, type: 'process' },
        { id: 'equations', label: 'Equations', x: 200, y: 180, type: 'process' },
        { id: 'functions', label: 'Functions', x: 300, y: 180, type: 'process' },
        { id: 'linear', label: 'Linear', x: 50, y: 260, type: 'data' },
        { id: 'quadratic', label: 'Quadratic', x: 150, y: 260, type: 'data' },
        { id: 'polynomial', label: 'Polynomial', x: 250, y: 260, type: 'data' },
        { id: 'exponential', label: 'Exponential', x: 350, y: 260, type: 'data' }
      ],
      interactive: true
    }
  ];

  const sampleProblems: Problem[] = [
    {
      id: 'quadratic-solve',
      title: 'Solving Quadratic Equations',
      description: 'Learn to solve quadratic equations using the quadratic formula with visual step-by-step guidance.',
      subject: 'Mathematics',
      difficulty: 'medium',
      timeEstimate: 15,
      steps: [
        {
          id: 'step1',
          title: 'Identify the coefficients',
          description: 'For the equation ax² + bx + c = 0, identify values of a, b, and c',
          visual: 'drawing',
          completed: false,
          hints: ['Look for the coefficient of x² (a)', 'Find the coefficient of x (b)', 'Identify the constant term (c)']
        },
        {
          id: 'step2',
          title: 'Calculate the discriminant',
          description: 'Use the formula D = b² - 4ac to find the discriminant',
          visual: 'calculation',
          completed: false,
          hints: ['Square the value of b', 'Multiply 4, a, and c', 'Subtract the second term from the first']
        },
        {
          id: 'step3',
          title: 'Apply the quadratic formula',
          description: 'Use x = (-b ± √D) / 2a to find the roots',
          visual: 'code',
          completed: false,
          hints: ['Substitute the values into the formula', 'Calculate both + and - cases', 'Simplify the results']
        },
        {
          id: 'step4',
          title: 'Verify your solution',
          description: 'Check your answers by substituting back into the original equation',
          visual: 'diagram',
          completed: false,
          hints: ['Replace x with your calculated values', 'Simplify both sides', 'Check if they are equal']
        }
      ]
    }
  ];

  // Initialize with first problem
  useEffect(() => {
    if (sampleProblems.length > 0) {
      setCurrentProblem(sampleProblems[0]);
    }
  }, []);

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save state for undo
    saveCanvasState();
  }, [drawingColor, brushSize]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setCanvasHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [canvasHistory, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const imageData = canvasHistory[historyIndex - 1];
      ctx.putImageData(imageData, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, canvasHistory]);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  }, [saveCanvasState]);

  const downloadCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  // Step navigation
  const nextStep = useCallback(() => {
    if (currentProblem && currentStep < currentProblem.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentProblem, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeStep = useCallback(() => {
    if (!currentProblem) return;
    
    const updatedSteps = currentProblem.steps.map((step, index) => 
      index === currentStep ? { ...step, completed: true } : step
    );
    
    setCurrentProblem({
      ...currentProblem,
      steps: updatedSteps
    });
  }, [currentProblem, currentStep]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      if (currentStep < (currentProblem?.steps.length || 0) - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 3000 / playbackSpeed);
  }, [currentStep, currentProblem, playbackSpeed]);

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const currentStepData = currentProblem?.steps[currentStep];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          Multi-Modal Explanations
        </h1>
        <p className="text-gray-600">Interactive visual learning with drawing, code, diagrams, and step-by-step problem solving</p>
      </div>

      {/* Problem Selection */}
      {currentProblem && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{currentProblem.title}</h2>
              <p className="text-gray-600">{currentProblem.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentProblem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentProblem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentProblem.difficulty}
                </span>
                <span className="text-sm text-gray-500">{currentProblem.timeEstimate} min</span>
                <span className="text-sm text-gray-500">{currentProblem.subject}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Auto-play'}
              </Button>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStep + 1} of {currentProblem.steps.length}</span>
              <span>{Math.round(((currentStep + 1) / currentProblem.steps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / currentProblem.steps.length) * 100} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={completeStep}
                disabled={currentStepData?.completed}
                variant={currentStepData?.completed ? "outline" : "default"}
              >
                {currentStepData?.completed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={nextStep}
              disabled={currentStep === currentProblem.steps.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Current Step */}
      {currentStepData && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 mb-4">{currentStepData.description}</p>

          {/* Hints */}
          {currentStepData.hints && currentStepData.hints.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Hints
              </h4>
              <ul className="space-y-1">
                {currentStepData.hints.map((hint, index) => (
                  <li key={index} className="text-sm text-blue-700">• {hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Multi-Modal Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Drawing Interface */}
            {showDrawing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Drawing Canvas
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDrawing(!showDrawing)}
                    >
                      {showDrawing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Drawing Tools */}
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  {drawingTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={activeTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTool(tool.id)}
                    >
                      {tool.icon}
                    </Button>
                  ))}
                </div>

                {/* Color and Size Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Color:</label>
                    <input
                      type="color"
                      value={drawingColor}
                      onChange={(e) => setDrawingColor(e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Size:</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">{brushSize}px</span>
                  </div>
                </div>

                {/* Canvas */}
                <div className="border rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full h-96 cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>

                {/* Canvas Controls */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                    <RotateCcw className="h-4 w-4" />
                    Undo
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCanvas}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Code Examples */}
            {showCode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code Examples
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {codeExamples.map((example) => (
                  <div key={example.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                      <h5 className="font-medium">{example.title}</h5>
                      <span className="text-sm text-gray-500">{example.language}</span>
                    </div>
                    <div className="p-4">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                      <p className="text-sm text-gray-600 mt-2">{example.explanation}</p>
                      {example.interactive && (
                        <Button size="sm" className="mt-2">
                          <Play className="h-3 w-3 mr-1" />
                          Run Code
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Diagrams */}
          {showDiagram && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Interactive Diagrams
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiagram(!showDiagram)}
                >
                  {showDiagram ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagrams.map((diagram) => (
                  <div key={diagram.id} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-3">{diagram.title}</h5>
                    <div className="relative bg-gray-50 rounded-lg h-64 overflow-hidden">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        {diagram.nodes.map((node) => (
                          <g key={node.id}>
                            <rect
                              x={node.x - 30}
                              y={node.y - 15}
                              width="60"
                              height="30"
                              rx="5"
                              fill={
                                node.type === 'start' ? '#10b981' :
                                node.type === 'end' ? '#ef4444' :
                                node.type === 'decision' ? '#f59e0b' :
                                '#3b82f6'
                              }
                              className="cursor-pointer hover:opacity-80"
                            />
                            <text
                              x={node.x}
                              y={node.y + 5}
                              textAnchor="middle"
                              className="text-xs font-medium fill-white"
                            >
                              {node.label.split('\n')[0]}
                            </text>
                            {node.label.includes('\n') && (
                              <text
                                x={node.x}
                                y={node.y + 18}
                                textAnchor="middle"
                                className="text-xs font-medium fill-white"
                              >
                                {node.label.split('\n')[1]}
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>
                    {diagram.interactive && (
                      <Button size="sm" className="mt-2">
                        <Play className="h-3 w-3 mr-1" />
                        Interact
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
