"use client";

import React, { useState, useCallback } from 'react';
import { 
  Brain, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Image, 
  Video, 
  FileText, 
  Code, 
  Calculator,
  Palette,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Lightbulb,
  Target,
  BookOpen,
  Zap,
  Edit3,
  BarChart,
  PieChart,
  LineChart,
  MousePointer,
  Type,
  Pen,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DrawingCanvas } from './DrawingCanvas';
import { InteractiveDiagrams } from './InteractiveDiagrams';
import { StepByStepVisualSolver } from './StepByStepVisualSolver';
import { CodeSyntaxHighlighter } from './CodeSyntaxHighlighter';

interface ExplanationMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface MultiModalExplanation {
  id: string;
  title: string;
  content: string;
  mode: 'text' | 'voice' | 'visual' | 'interactive' | 'code' | 'step-by-step';
  timestamp: Date;
  isActive: boolean;
}

export function MultiModalExplanations() {
  const [activeMode, setActiveMode] = useState<'text' | 'voice' | 'visual' | 'interactive' | 'code' | 'step-by-step'>('text');
  const [explanations, setExplanations] = useState<MultiModalExplanation[]>([]);
  const [currentExplanation, setCurrentExplanation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    visualEnabled: true,
    interactiveEnabled: true,
    codeEnabled: true,
    stepByStepEnabled: true,
    autoAdvance: false,
    showHints: true
  });

  const explanationModes: ExplanationMode[] = [
    {
      id: 'text',
      name: 'Text Explanation',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Traditional text-based explanations',
      color: 'bg-blue-500'
    },
    {
      id: 'voice',
      name: 'Voice Explanation',
      icon: <Mic className="h-5 w-5" />,
      description: 'Audio explanations with voice synthesis',
      color: 'bg-green-500'
    },
    {
      id: 'visual',
      name: 'Visual Drawing',
      icon: <Palette className="h-5 w-5" />,
      description: 'Draw and paint visual explanations',
      color: 'bg-purple-500'
    },
    {
      id: 'interactive',
      name: 'Interactive Diagrams',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Interactive charts and diagrams',
      color: 'bg-orange-500'
    },
    {
      id: 'code',
      name: 'Code Examples',
      icon: <Code className="h-5 w-5" />,
      description: 'Syntax-highlighted code examples',
      color: 'bg-gray-500'
    },
    {
      id: 'step-by-step',
      name: 'Step-by-Step Visual',
      icon: <Target className="h-5 w-5" />,
      description: 'Visual step-by-step problem solving',
      color: 'bg-red-500'
    }
  ];

  // Generate explanation based on mode
  const generateExplanation = async (mode: string, content: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExplanation: MultiModalExplanation = {
        id: Date.now().toString(),
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Explanation`,
        content,
        mode: mode as any,
        timestamp: new Date(),
        isActive: true
      };
      
      setExplanations(prev => [newExplanation, ...prev]);
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle text explanation
  const handleTextExplanation = () => {
    if (!currentExplanation.trim()) return;
    generateExplanation('text', currentExplanation);
  };

  // Handle voice explanation
  const handleVoiceExplanation = () => {
    if (!currentExplanation.trim()) return;
    generateExplanation('voice', currentExplanation);
  };

  // Handle visual explanation
  const handleVisualExplanation = (drawingData: string) => {
    generateExplanation('visual', drawingData);
  };

  // Toggle voice listening
  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setCurrentExplanation('This is a voice input example for visual explanation');
        setIsListening(false);
      }, 2000);
    }
  };

  // Toggle voice speaking
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Simulate text-to-speech
    if (!isSpeaking) {
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
    }
  };

  // Clear explanations
  const clearExplanations = () => {
    setExplanations([]);
  };

  // Download explanation
  const downloadExplanation = (explanation: MultiModalExplanation) => {
    const data = {
      title: explanation.title,
      content: explanation.content,
      mode: explanation.mode,
      timestamp: explanation.timestamp.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${explanation.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="multi-modal-explanations h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Multi-Modal Explanations</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={clearExplanations}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Mode selection sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Explanation Modes</h3>
          <div className="space-y-2">
            {explanationModes.map(mode => (
              <div
                key={mode.id}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                  activeMode === mode.id 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setActiveMode(mode.id as any)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${mode.color} text-white`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{mode.name}</h4>
                    <p className="text-xs text-gray-500">{mode.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voice controls */}
          {activeMode === 'voice' && (
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <h4 className="font-medium mb-3">Voice Controls</h4>
              <div className="space-y-2">
                <Button
                  onClick={toggleListening}
                  className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
                <Button
                  onClick={toggleSpeaking}
                  variant="outline"
                  className="w-full"
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                  {isSpeaking ? 'Stop Speaking' : 'Start Speaking'}
                </Button>
              </div>
            </div>
          )}

          {/* Settings panel */}
          {showSettings && (
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <h4 className="font-medium mb-3">Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.voiceEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Voice explanations</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.visualEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, visualEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Visual explanations</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.interactiveEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, interactiveEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Interactive diagrams</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.codeEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, codeEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Code examples</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.stepByStepEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, stepByStepEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Step-by-step solving</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Input area */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex gap-2">
              <Textarea
                value={currentExplanation}
                onChange={(e) => setCurrentExplanation(e.target.value)}
                placeholder="Enter your question or topic for explanation..."
                className="flex-1"
                rows={2}
              />
              <div className="flex flex-col gap-2">
                {activeMode === 'text' && (
                  <Button
                    onClick={handleTextExplanation}
                    disabled={isGenerating || !currentExplanation.trim()}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Explain'}
                  </Button>
                )}
                {activeMode === 'voice' && (
                  <Button
                    onClick={handleVoiceExplanation}
                    disabled={isGenerating || !currentExplanation.trim()}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Speak'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content area based on active mode */}
          <div className="flex-1 p-4">
            {activeMode === 'text' && (
              <div className="h-full">
                <h3 className="text-lg font-semibold mb-4">Text Explanations</h3>
                <div className="space-y-4">
                  {explanations.filter(e => e.mode === 'text').map(explanation => (
                    <div key={explanation.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{explanation.title}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadExplanation(explanation)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700">{explanation.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {explanation.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {explanations.filter(e => e.mode === 'text').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No text explanations yet. Enter a question above to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMode === 'voice' && (
              <div className="h-full">
                <h3 className="text-lg font-semibold mb-4">Voice Explanations</h3>
                <div className="space-y-4">
                  {explanations.filter(e => e.mode === 'voice').map(explanation => (
                    <div key={explanation.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{explanation.title}</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleSpeaking}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadExplanation(explanation)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{explanation.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {explanation.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {explanations.filter(e => e.mode === 'voice').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No voice explanations yet. Use voice input to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMode === 'visual' && (
              <div className="h-full">
                <h3 className="text-lg font-semibold mb-4">Visual Drawing Interface</h3>
                <DrawingCanvas
                  width={800}
                  height={500}
                  onDrawingChange={handleVisualExplanation}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {activeMode === 'interactive' && (
              <div className="h-full">
                <InteractiveDiagrams />
              </div>
            )}

            {activeMode === 'code' && (
              <div className="h-full">
                <CodeSyntaxHighlighter />
              </div>
            )}

            {activeMode === 'step-by-step' && (
              <div className="h-full">
                <StepByStepVisualSolver />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}