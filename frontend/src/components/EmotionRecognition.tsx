"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  Smile, 
  Frown, 
  Meh, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Brain,
  Heart,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  Star,
  Award,
  Lightbulb,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EmotionData {
  emotion: 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised' | 'disgusted' | 'neutral';
  confidence: number;
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  dominance: number; // 0 to 1 (submissive to dominant)
  timestamp: Date;
}

interface LearningState {
  engagement: 'low' | 'medium' | 'high';
  frustration: 'low' | 'medium' | 'high';
  boredom: 'low' | 'medium' | 'high';
  confusion: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  overallMood: 'positive' | 'neutral' | 'negative';
}

interface EmotionInsight {
  id: string;
  type: 'pattern' | 'alert' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
  timestamp: Date;
}

interface EmotionStats {
  totalSessions: number;
  averageEngagement: number;
  frustrationEpisodes: number;
  positiveMoodPercentage: number;
  longestPositiveStreak: number;
  currentStreak: number;
  lastSession: Date;
  topEmotions: Array<{ emotion: string; count: number; percentage: number }>;
}

export function EmotionRecognition() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);
  const [stats, setStats] = useState<EmotionStats | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.7);
  const [updateInterval, setUpdateInterval] = useState(1000); // ms
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const emotionBufferRef = useRef<EmotionData[]>([]);

  // Initialize emotion recognition
  useEffect(() => {
    initializeEmotionRecognition();
    return () => {
      stopRecording();
    };
  }, []);

  // Update learning state based on emotion data
  useEffect(() => {
    if (emotionHistory.length > 0) {
      updateLearningState();
    }
  }, [emotionHistory]);

  // Generate insights periodically
  useEffect(() => {
    if (emotionHistory.length > 10) {
      generateInsights();
    }
  }, [emotionHistory]);

  const initializeEmotionRecognition = useCallback(async () => {
    try {
      // Check for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      setHasPermission(true);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Initialize sample stats
      const sampleStats: EmotionStats = {
        totalSessions: 12,
        averageEngagement: 78,
        frustrationEpisodes: 3,
        positiveMoodPercentage: 85,
        longestPositiveStreak: 8,
        currentStreak: 5,
        lastSession: new Date(Date.now() - 2 * 60 * 60 * 1000),
        topEmotions: [
          { emotion: 'happy', count: 45, percentage: 35 },
          { emotion: 'neutral', count: 38, percentage: 30 },
          { emotion: 'surprised', count: 25, percentage: 20 },
          { emotion: 'sad', count: 12, percentage: 10 },
          { emotion: 'angry', count: 8, percentage: 5 }
        ]
      };
      
      setStats(sampleStats);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!hasPermission || !videoRef.current) return;
    
    setIsRecording(true);
    
    // Start emotion analysis
    analysisIntervalRef.current = setInterval(() => {
      analyzeEmotion();
    }, updateInterval);
  }, [hasPermission, updateInterval]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  const analyzeEmotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simulate emotion detection (in real implementation, this would use ML models)
    const emotions: EmotionData['emotion'][] = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Generate realistic emotion data based on learning context
    const emotionData: EmotionData = {
      emotion: randomEmotion,
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      valence: Math.random() * 2 - 1, // -1 to 1
      arousal: Math.random(), // 0 to 1
      dominance: Math.random(), // 0 to 1
      timestamp: new Date()
    };
    
    // Apply some learning context to make emotions more realistic
    if (emotionHistory.length > 0) {
      const lastEmotion = emotionHistory[emotionHistory.length - 1];
      const timeDiff = Date.now() - lastEmotion.timestamp.getTime();
      
      // Emotions tend to persist for a short time
      if (timeDiff < 5000 && Math.random() < 0.7) {
        emotionData.emotion = lastEmotion.emotion;
        emotionData.valence = lastEmotion.valence + (Math.random() - 0.5) * 0.2;
        emotionData.arousal = lastEmotion.arousal + (Math.random() - 0.5) * 0.2;
      }
    }
    
    setCurrentEmotion(emotionData);
    
    // Add to buffer
    emotionBufferRef.current.push(emotionData);
    
    // Keep only last 50 emotions
    if (emotionBufferRef.current.length > 50) {
      emotionBufferRef.current = emotionBufferRef.current.slice(-50);
    }
    
    // Update emotion history
    setEmotionHistory(prev => [...prev.slice(-49), emotionData]);
  }, [emotionHistory]);

  const updateLearningState = useCallback(() => {
    if (emotionHistory.length < 5) return;
    
    const recentEmotions = emotionHistory.slice(-10);
    
    // Calculate engagement based on arousal and positive emotions
    const avgArousal = recentEmotions.reduce((sum, e) => sum + e.arousal, 0) / recentEmotions.length;
    const positiveEmotions = recentEmotions.filter(e => e.valence > 0.2).length;
    const engagementScore = (avgArousal + (positiveEmotions / recentEmotions.length)) / 2;
    
    // Calculate frustration based on negative emotions and high arousal
    const negativeEmotions = recentEmotions.filter(e => e.valence < -0.2).length;
    const highArousalNegative = recentEmotions.filter(e => e.valence < -0.2 && e.arousal > 0.7).length;
    const frustrationScore = (negativeEmotions + highArousalNegative) / recentEmotions.length;
    
    // Calculate boredom based on low arousal and neutral emotions
    const lowArousal = recentEmotions.filter(e => e.arousal < 0.3).length;
    const neutralEmotions = recentEmotions.filter(e => e.emotion === 'neutral').length;
    const boredomScore = (lowArousal + neutralEmotions) / recentEmotions.length;
    
    // Calculate confusion based on mixed emotions
    const emotionVariety = new Set(recentEmotions.map(e => e.emotion)).size;
    const confusionScore = Math.max(0, 1 - (emotionVariety / 7));
    
    // Calculate confidence based on positive emotions and low confusion
    const confidenceScore = (positiveEmotions / recentEmotions.length) * (1 - confusionScore);
    
    // Determine overall mood
    const avgValence = recentEmotions.reduce((sum, e) => sum + e.valence, 0) / recentEmotions.length;
    const overallMood = avgValence > 0.2 ? 'positive' : avgValence < -0.2 ? 'negative' : 'neutral';
    
    const newLearningState: LearningState = {
      engagement: engagementScore > 0.6 ? 'high' : engagementScore > 0.3 ? 'medium' : 'low',
      frustration: frustrationScore > 0.6 ? 'high' : frustrationScore > 0.3 ? 'medium' : 'low',
      boredom: boredomScore > 0.6 ? 'high' : boredomScore > 0.3 ? 'medium' : 'low',
      confusion: confusionScore > 0.6 ? 'high' : confusionScore > 0.3 ? 'medium' : 'low',
      confidence: confidenceScore > 0.6 ? 'high' : confidenceScore > 0.3 ? 'medium' : 'low',
      overallMood
    };
    
    setLearningState(newLearningState);
  }, [emotionHistory]);

  const generateInsights = useCallback(() => {
    if (emotionHistory.length < 10) return;
    
    const recentEmotions = emotionHistory.slice(-20);
    const insights: EmotionInsight[] = [];
    
    // Analyze patterns
    const positiveEmotions = recentEmotions.filter(e => e.valence > 0.2).length;
    const negativeEmotions = recentEmotions.filter(e => e.valence < -0.2).length;
    const neutralEmotions = recentEmotions.filter(e => e.valence >= -0.2 && e.valence <= 0.2).length;
    
    // High engagement insight
    if (positiveEmotions > recentEmotions.length * 0.7) {
      insights.push({
        id: 'high-engagement',
        type: 'achievement',
        title: 'High Engagement Detected',
        description: 'You\'re showing excellent engagement and positive emotions during learning!',
        confidence: 90,
        actionable: false,
        timestamp: new Date()
      });
    }
    
    // Frustration alert
    if (negativeEmotions > recentEmotions.length * 0.5) {
      insights.push({
        id: 'frustration-alert',
        type: 'alert',
        title: 'Frustration Detected',
        description: 'I notice you might be feeling frustrated. Consider taking a short break or trying a different approach.',
        confidence: 85,
        actionable: true,
        actionItems: ['Take a 5-minute break', 'Try easier problems first', 'Ask for help', 'Switch to a different topic'],
        timestamp: new Date()
      });
    }
    
    // Boredom alert
    const lowArousalCount = recentEmotions.filter(e => e.arousal < 0.3).length;
    if (lowArousalCount > recentEmotions.length * 0.6) {
      insights.push({
        id: 'boredom-alert',
        type: 'alert',
        title: 'Low Engagement Detected',
        description: 'You seem less engaged than usual. Try switching to more challenging content or interactive activities.',
        confidence: 80,
        actionable: true,
        actionItems: ['Try more challenging problems', 'Use interactive learning tools', 'Take a break and return later', 'Switch learning methods'],
        timestamp: new Date()
      });
    }
    
    // Learning pattern insight
    if (emotionHistory.length > 50) {
      const earlyEmotions = emotionHistory.slice(0, 25);
      const recentEmotions = emotionHistory.slice(-25);
      
      const earlyPositive = earlyEmotions.filter(e => e.valence > 0.2).length;
      const recentPositive = recentEmotions.filter(e => e.valence > 0.2).length;
      
      if (recentPositive > earlyPositive * 1.2) {
        insights.push({
          id: 'improvement-pattern',
          type: 'pattern',
          title: 'Learning Mood Improvement',
          description: 'Your emotional state during learning has improved significantly over time!',
          confidence: 75,
          actionable: false,
          timestamp: new Date()
        });
      }
    }
    
    setInsights(prev => [...insights, ...prev.slice(0, 10)]);
  }, [emotionHistory]);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="h-6 w-6 text-green-500" />;
      case 'sad': return <Frown className="h-6 w-6 text-blue-500" />;
      case 'angry': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'fearful': return <Eye className="h-6 w-6 text-purple-500" />;
      case 'surprised': return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'disgusted': return <Meh className="h-6 w-6 text-orange-500" />;
      case 'neutral': return <Meh className="h-6 w-6 text-gray-500" />;
      default: return <Meh className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'text-green-600 bg-green-100';
      case 'sad': return 'text-blue-600 bg-blue-100';
      case 'angry': return 'text-red-600 bg-red-100';
      case 'fearful': return 'text-purple-600 bg-purple-100';
      case 'surprised': return 'text-yellow-600 bg-yellow-100';
      case 'disgusted': return 'text-orange-600 bg-orange-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStateColor = (state: string, level: string) => {
    if (level === 'high') {
      return state === 'engagement' || state === 'confidence' 
        ? 'text-green-600 bg-green-100' 
        : 'text-red-600 bg-red-100';
    } else if (level === 'medium') {
      return 'text-yellow-600 bg-yellow-100';
    } else {
      return state === 'engagement' || state === 'confidence'
        ? 'text-red-600 bg-red-100'
        : 'text-green-600 bg-green-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600 bg-blue-100';
      case 'alert': return 'text-red-600 bg-red-100';
      case 'recommendation': return 'text-purple-600 bg-purple-100';
      case 'achievement': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!hasPermission) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <CameraOff className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-600">Camera Access Required</h2>
          <p className="text-gray-500">
            Emotion recognition requires camera access to analyze your facial expressions during learning.
          </p>
          <Button onClick={initializeEmotionRecognition}>
            <Camera className="h-4 w-4 mr-2" />
            Enable Camera Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Emotion Recognition
          </h1>
          <p className="text-gray-600">AI-powered facial emotion analysis for personalized learning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => setIsEnabled(!isEnabled)}
            variant={isEnabled ? "default" : "outline"}
          >
            {isEnabled ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Disable
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Enable
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Emotion Recognition Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sensitivity</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                {Math.round(sensitivity * 100)}% - {sensitivity > 0.7 ? 'High' : sensitivity > 0.4 ? 'Medium' : 'Low'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Update Interval</label>
              <select
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="500">500ms (Fast)</option>
                <option value="1000">1s (Normal)</option>
                <option value="2000">2s (Slow)</option>
                <option value="5000">5s (Very Slow)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Camera Feed and Controls */}
      {isEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Live Emotion Analysis
            </h3>
            
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover rounded-lg border"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Overlay for emotion detection */}
              {currentEmotion && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getEmotionIcon(currentEmotion.emotion)}
                    <span className="font-medium capitalize">{currentEmotion.emotion}</span>
                    <span className="text-sm">
                      {Math.round(currentEmotion.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
              >
                {isRecording ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Analysis
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Analyzing emotions...
                </div>
              )}
            </div>
          </div>

          {/* Current Learning State */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Learning State
            </h3>
            
            {learningState ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {learningState.engagement === 'high' ? '🔥' : learningState.engagement === 'medium' ? '⚡' : '😴'}
                    </div>
                    <div className="text-sm font-medium">Engagement</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('engagement', learningState.engagement)}`}>
                      {learningState.engagement}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {learningState.frustration === 'high' ? '😤' : learningState.frustration === 'medium' ? '😕' : '😌'}
                    </div>
                    <div className="text-sm font-medium">Frustration</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('frustration', learningState.frustration)}`}>
                      {learningState.frustration}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {learningState.boredom === 'high' ? '😴' : learningState.boredom === 'medium' ? '😑' : '😊'}
                    </div>
                    <div className="text-sm font-medium">Boredom</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('boredom', learningState.boredom)}`}>
                      {learningState.boredom}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {learningState.confidence === 'high' ? '💪' : learningState.confidence === 'medium' ? '🤔' : '😰'}
                    </div>
                    <div className="text-sm font-medium">Confidence</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('confidence', learningState.confidence)}`}>
                      {learningState.confidence}
                    </div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-medium">Overall Mood</div>
                  <div className={`text-2xl ${learningState.overallMood === 'positive' ? '😊' : learningState.overallMood === 'negative' ? '😔' : '😐'}`}>
                    {learningState.overallMood === 'positive' ? '😊' : learningState.overallMood === 'negative' ? '😔' : '😐'}
                  </div>
                  <div className={`text-sm font-medium capitalize ${learningState.overallMood === 'positive' ? 'text-green-600' : learningState.overallMood === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                    {learningState.overallMood}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Start emotion analysis to see your learning state
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSessions}</div>
            <div className="text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageEngagement}%</div>
            <div className="text-gray-600">Avg Engagement</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.positiveMoodPercentage}%</div>
            <div className="text-gray-600">Positive Mood</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.currentStreak}</div>
            <div className="text-gray-600">Current Streak</div>
          </div>
        </div>
      )}

      {/* Emotion History */}
      {emotionHistory.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Recent Emotion History
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {emotionHistory.slice(-14).map((emotion, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">
                  {getEmotionIcon(emotion.emotion)}
                </div>
                <div className="text-xs font-medium capitalize">{emotion.emotion}</div>
                <div className="text-xs text-gray-500">
                  {Math.round(emotion.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </h3>
          
          <div className="space-y-4">
            {insights.slice(0, 5).map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    {insight.actionable && insight.actionItems && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Suggested Actions:</h5>
                        <ul className="space-y-1">
                          {insight.actionItems.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Emotions Chart */}
      {stats && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Emotion Distribution
          </h3>
          
          <div className="space-y-3">
            {stats.topEmotions.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getEmotionIcon(emotion.emotion)}
                  <span className="font-medium capitalize">{emotion.emotion}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${emotion.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {emotion.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
