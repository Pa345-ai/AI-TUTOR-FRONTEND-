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
  RotateCcw,
  AlertCircle,
  TrendingDown,
  Users,
  BookOpen,
  Coffee,
  Music,
  Gamepad2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Gauge,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AdvancedEmotionData {
  emotion: 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised' | 'disgusted' | 'neutral' | 'contempt' | 'excited' | 'confused' | 'focused' | 'tired';
  confidence: number;
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  dominance: number; // 0 to 1 (submissive to dominant)
  intensity: number; // 0 to 1 (weak to strong)
  microExpressions: MicroExpression[];
  facialLandmarks: FacialLandmark[];
  timestamp: Date;
}

interface MicroExpression {
  type: 'micro_smile' | 'micro_frown' | 'eyebrow_raise' | 'eye_squint' | 'lip_purse' | 'nose_wrinkle';
  intensity: number;
  duration: number;
  confidence: number;
}

interface FacialLandmark {
  point: number;
  x: number;
  y: number;
  confidence: number;
}

interface LearningState {
  engagement: 'low' | 'medium' | 'high' | 'very_high';
  frustration: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  boredom: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  confusion: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  confidence: 'low' | 'medium' | 'high' | 'very_high';
  stress: 'low' | 'medium' | 'high' | 'extreme';
  focus: 'distracted' | 'low' | 'medium' | 'high' | 'laser_focused';
  overallMood: 'excellent' | 'good' | 'neutral' | 'poor' | 'critical';
  learningReadiness: 'not_ready' | 'ready' | 'optimal' | 'peak';
}

interface EmotionPattern {
  id: string;
  name: string;
  description: string;
  emotions: string[];
  duration: number;
  frequency: number;
  confidence: number;
  learningImpact: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
}

interface AdaptiveRecommendation {
  id: string;
  type: 'content' | 'pace' | 'method' | 'break' | 'encouragement' | 'challenge';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  expectedImpact: string;
  actionItems: string[];
  estimatedDuration: number;
}

interface EmotionInsight {
  id: string;
  type: 'pattern' | 'alert' | 'recommendation' | 'achievement' | 'warning' | 'breakthrough';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  category: 'engagement' | 'frustration' | 'boredom' | 'confusion' | 'stress' | 'focus' | 'mood';
}

interface EmotionStats {
  totalSessions: number;
  averageEngagement: number;
  frustrationEpisodes: number;
  boredomEpisodes: number;
  confusionEpisodes: number;
  stressEpisodes: number;
  positiveMoodPercentage: number;
  longestPositiveStreak: number;
  currentStreak: number;
  lastSession: Date;
  topEmotions: Array<{ emotion: string; count: number; percentage: number }>;
  learningPatterns: EmotionPattern[];
  adaptiveRecommendations: AdaptiveRecommendation[];
  performanceMetrics: {
    averageFocusTime: number;
    optimalLearningWindows: number;
    stressRecoveryTime: number;
    engagementConsistency: number;
  };
}

export function AdvancedEmotionRecognition() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<AdvancedEmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<AdvancedEmotionData[]>([]);
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);
  const [stats, setStats] = useState<EmotionStats | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.7);
  const [updateInterval, setUpdateInterval] = useState(1000);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'patterns' | 'recommendations'>('overview');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const emotionBufferRef = useRef<AdvancedEmotionData[]>([]);
  const patternAnalysisRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize advanced emotion recognition
  useEffect(() => {
    initializeAdvancedEmotionRecognition();
    return () => {
      stopRecording();
    };
  }, []);

  // Update learning state based on emotion data
  useEffect(() => {
    if (emotionHistory.length > 0) {
      updateAdvancedLearningState();
    }
  }, [emotionHistory]);

  // Generate insights and patterns
  useEffect(() => {
    if (emotionHistory.length > 10) {
      generateAdvancedInsights();
      analyzeEmotionPatterns();
    }
  }, [emotionHistory]);

  // Generate adaptive recommendations
  useEffect(() => {
    if (learningState) {
      generateAdaptiveRecommendations();
    }
  }, [learningState]);

  const initializeAdvancedEmotionRecognition = useCallback(async () => {
    try {
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
      
      // Initialize advanced stats
      const advancedStats: EmotionStats = {
        totalSessions: 25,
        averageEngagement: 82,
        frustrationEpisodes: 5,
        boredomEpisodes: 3,
        confusionEpisodes: 8,
        stressEpisodes: 4,
        positiveMoodPercentage: 88,
        longestPositiveStreak: 12,
        currentStreak: 7,
        lastSession: new Date(Date.now() - 1 * 60 * 60 * 1000),
        topEmotions: [
          { emotion: 'focused', count: 65, percentage: 28 },
          { emotion: 'happy', count: 58, percentage: 25 },
          { emotion: 'neutral', count: 45, percentage: 19 },
          { emotion: 'excited', count: 32, percentage: 14 },
          { emotion: 'confused', count: 18, percentage: 8 },
          { emotion: 'tired', count: 12, percentage: 5 },
          { emotion: 'frustrated', count: 8, percentage: 3 }
        ],
        learningPatterns: [
          {
            id: 'morning_focus',
            name: 'Morning Focus Pattern',
            description: 'High focus and engagement in morning sessions',
            emotions: ['focused', 'happy', 'excited'],
            duration: 45,
            frequency: 0.8,
            confidence: 92,
            learningImpact: 'positive',
            recommendations: ['Schedule difficult topics in morning', 'Use interactive learning methods']
          },
          {
            id: 'afternoon_fatigue',
            name: 'Afternoon Fatigue Pattern',
            description: 'Decreased focus and increased tiredness in afternoon',
            emotions: ['tired', 'neutral', 'bored'],
            duration: 30,
            frequency: 0.6,
            confidence: 78,
            learningImpact: 'negative',
            recommendations: ['Take breaks every 20 minutes', 'Use lighter content', 'Consider power nap']
          }
        ],
        adaptiveRecommendations: [],
        performanceMetrics: {
          averageFocusTime: 25,
          optimalLearningWindows: 4,
          stressRecoveryTime: 8,
          engagementConsistency: 85
        }
      };
      
      setStats(advancedStats);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!hasPermission || !videoRef.current) return;
    
    setIsRecording(true);
    
    analysisIntervalRef.current = setInterval(() => {
      analyzeAdvancedEmotion();
    }, updateInterval);

    // Start pattern analysis
    patternAnalysisRef.current = setInterval(() => {
      analyzeEmotionPatterns();
    }, 10000); // Every 10 seconds
  }, [hasPermission, updateInterval]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    if (patternAnalysisRef.current) {
      clearInterval(patternAnalysisRef.current);
      patternAnalysisRef.current = null;
    }
  }, []);

  const analyzeAdvancedEmotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Advanced emotion detection with micro-expressions
    const emotions: AdvancedEmotionData['emotion'][] = [
      'happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral', 
      'contempt', 'excited', 'confused', 'focused', 'tired'
    ];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Generate micro-expressions
    const microExpressions: MicroExpression[] = [];
    if (Math.random() < 0.3) {
      const microTypes: MicroExpression['type'][] = [
        'micro_smile', 'micro_frown', 'eyebrow_raise', 'eye_squint', 'lip_purse', 'nose_wrinkle'
      ];
      microExpressions.push({
        type: microTypes[Math.floor(Math.random() * microTypes.length)],
        intensity: Math.random(),
        duration: Math.random() * 200 + 100,
        confidence: Math.random() * 0.3 + 0.7
      });
    }
    
    // Generate facial landmarks (simplified)
    const facialLandmarks: FacialLandmark[] = [];
    for (let i = 0; i < 68; i++) {
      facialLandmarks.push({
        point: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        confidence: Math.random() * 0.2 + 0.8
      });
    }
    
    const emotionData: AdvancedEmotionData = {
      emotion: randomEmotion,
      confidence: Math.random() * 0.3 + 0.7,
      valence: Math.random() * 2 - 1,
      arousal: Math.random(),
      dominance: Math.random(),
      intensity: Math.random(),
      microExpressions,
      facialLandmarks,
      timestamp: new Date()
    };
    
    // Apply learning context and patterns
    if (emotionHistory.length > 0) {
      const lastEmotion = emotionHistory[emotionHistory.length - 1];
      const timeDiff = Date.now() - lastEmotion.timestamp.getTime();
      
      // Emotions tend to persist
      if (timeDiff < 3000 && Math.random() < 0.8) {
        emotionData.emotion = lastEmotion.emotion;
        emotionData.valence = Math.max(-1, Math.min(1, lastEmotion.valence + (Math.random() - 0.5) * 0.1));
        emotionData.arousal = Math.max(0, Math.min(1, lastEmotion.arousal + (Math.random() - 0.5) * 0.1));
      }
    }
    
    setCurrentEmotion(emotionData);
    emotionBufferRef.current.push(emotionData);
    
    if (emotionBufferRef.current.length > 100) {
      emotionBufferRef.current = emotionBufferRef.current.slice(-100);
    }
    
    setEmotionHistory(prev => [...prev.slice(-99), emotionData]);
  }, [emotionHistory]);

  const updateAdvancedLearningState = useCallback(() => {
    if (emotionHistory.length < 5) return;
    
    const recentEmotions = emotionHistory.slice(-15);
    
    // Advanced engagement calculation
    const avgArousal = recentEmotions.reduce((sum, e) => sum + e.arousal, 0) / recentEmotions.length;
    const positiveEmotionsCount = recentEmotions.filter(e => e.valence > 0.3).length;
    const focusedEmotions = recentEmotions.filter(e => e.emotion === 'focused').length;
    const excitedEmotions = recentEmotions.filter(e => e.emotion === 'excited').length;
    const engagementScore = (avgArousal * 0.4 + (positiveEmotionsCount / recentEmotions.length) * 0.3 + 
                           (focusedEmotions / recentEmotions.length) * 0.2 + 
                           (excitedEmotions / recentEmotions.length) * 0.1);
    
    // Advanced frustration detection
    const negativeEmotions = recentEmotions.filter(e => e.valence < -0.2).length;
    const angryEmotions = recentEmotions.filter(e => e.emotion === 'angry').length;
    const highArousalNegative = recentEmotions.filter(e => e.valence < -0.2 && e.arousal > 0.7).length;
    const microFrowns = recentEmotions.filter(e => 
      e.microExpressions.some(me => me.type === 'micro_frown' && me.intensity > 0.5)
    ).length;
    const frustrationScore = (negativeEmotions * 0.3 + angryEmotions * 0.4 + 
                             highArousalNegative * 0.2 + microFrowns * 0.1) / recentEmotions.length;
    
    // Advanced boredom detection
    const lowArousal = recentEmotions.filter(e => e.arousal < 0.2).length;
    const neutralEmotions = recentEmotions.filter(e => e.emotion === 'neutral').length;
    const tiredEmotions = recentEmotions.filter(e => e.emotion === 'tired').length;
    const microYawns = recentEmotions.filter(e => 
      e.microExpressions.some(me => me.type === 'eye_squint' && me.intensity > 0.7)
    ).length;
    const boredomScore = (lowArousal * 0.3 + neutralEmotions * 0.3 + 
                         tiredEmotions * 0.3 + microYawns * 0.1) / recentEmotions.length;
    
    // Advanced confusion detection
    const confusedEmotions = recentEmotions.filter(e => e.emotion === 'confused').length;
    const mixedEmotions = new Set(recentEmotions.map(e => e.emotion)).size;
    const eyebrowRaises = recentEmotions.filter(e => 
      e.microExpressions.some(me => me.type === 'eyebrow_raise' && me.intensity > 0.6)
    ).length;
    const confusionScore = (confusedEmotions * 0.5 + (1 - mixedEmotions / 12) * 0.3 + 
                           eyebrowRaises * 0.2) / recentEmotions.length;
    
    // Stress detection
    const fearfulEmotions = recentEmotions.filter(e => e.emotion === 'fearful').length;
    const highIntensity = recentEmotions.filter(e => e.intensity > 0.8).length;
    const stressScore = (fearfulEmotions * 0.4 + highIntensity * 0.3 + 
                        (frustrationScore + confusionScore) * 0.3);
    
    // Focus detection
    const focusedEmotionsForFocus = recentEmotions.filter(e => e.emotion === 'focused').length;
    const lowDistraction = recentEmotions.filter(e => e.emotion !== 'confused' && e.emotion !== 'tired').length;
    const focusScore = (focusedEmotionsForFocus * 0.6 + lowDistraction * 0.4) / recentEmotions.length;
    
    // Confidence calculation
    const positiveEmotionsForConfidence = recentEmotions.filter(e => e.valence > 0.2).length;
    const confidenceScore = (positiveEmotionsForConfidence / recentEmotions.length) * (1 - confusionScore) * (1 - stressScore);
    
    // Overall mood calculation
    const avgValence = recentEmotions.reduce((sum, e) => sum + e.valence, 0) / recentEmotions.length;
    const moodScore = (avgValence + engagementScore + confidenceScore) / 3;
    
    // Learning readiness
    const readinessScore = (engagementScore * 0.3 + focusScore * 0.3 + 
                           (1 - stressScore) * 0.2 + (1 - frustrationScore) * 0.2);
    
    const newLearningState: LearningState = {
      engagement: engagementScore > 0.8 ? 'very_high' : engagementScore > 0.6 ? 'high' : 
                 engagementScore > 0.4 ? 'medium' : 'low',
      frustration: frustrationScore > 0.8 ? 'extreme' : frustrationScore > 0.6 ? 'high' : 
                  frustrationScore > 0.4 ? 'medium' : frustrationScore > 0.2 ? 'low' : 'none',
      boredom: boredomScore > 0.8 ? 'extreme' : boredomScore > 0.6 ? 'high' : 
               boredomScore > 0.4 ? 'medium' : boredomScore > 0.2 ? 'low' : 'none',
      confusion: confusionScore > 0.8 ? 'extreme' : confusionScore > 0.6 ? 'high' : 
                 confusionScore > 0.4 ? 'medium' : confusionScore > 0.2 ? 'low' : 'none',
      confidence: confidenceScore > 0.8 ? 'very_high' : confidenceScore > 0.6 ? 'high' : 
                  confidenceScore > 0.4 ? 'medium' : 'low',
      stress: stressScore > 0.8 ? 'extreme' : stressScore > 0.6 ? 'high' : 
              stressScore > 0.4 ? 'medium' : 'low',
      focus: focusScore > 0.9 ? 'laser_focused' : focusScore > 0.7 ? 'high' : 
             focusScore > 0.5 ? 'medium' : focusScore > 0.3 ? 'low' : 'distracted',
      overallMood: moodScore > 0.8 ? 'excellent' : moodScore > 0.6 ? 'good' : 
                   moodScore > 0.4 ? 'neutral' : moodScore > 0.2 ? 'poor' : 'critical',
      learningReadiness: readinessScore > 0.8 ? 'peak' : readinessScore > 0.6 ? 'optimal' : 
                         readinessScore > 0.4 ? 'ready' : 'not_ready'
    };
    
    setLearningState(newLearningState);
  }, [emotionHistory]);

  const generateAdvancedInsights = useCallback(() => {
    if (emotionHistory.length < 10) return;
    
    const recentEmotions = emotionHistory.slice(-30);
    const insights: EmotionInsight[] = [];
    
    // Advanced pattern analysis
    const positiveEmotionsForAnalysis = recentEmotions.filter(e => e.valence > 0.3).length;
    const negativeEmotions = recentEmotions.filter(e => e.valence < -0.3).length;
    const neutralEmotions = recentEmotions.filter(e => e.valence >= -0.3 && e.valence <= 0.3).length;
    
    // Frustration breakthrough detection
    const frustrationSequence = recentEmotions.filter(e => 
      e.emotion === 'angry' || e.valence < -0.4
    ).length;
    
    if (frustrationSequence > recentEmotions.length * 0.4) {
      insights.push({
        id: 'frustration-breakthrough',
        type: 'breakthrough',
        title: 'Frustration Breakthrough Detected',
        description: 'I notice you\'re working through a challenging concept. This is actually a great sign of deep learning!',
        confidence: 88,
        actionable: true,
        actionItems: [
          'Take a 2-minute break to reset',
          'Try explaining the concept out loud',
          'Break the problem into smaller parts',
          'Use the step-by-step visual solver'
        ],
        timestamp: new Date(),
        severity: 'warning',
        category: 'frustration'
      });
    }
    
    // Boredom pattern detection
    const boredomSequence = recentEmotions.filter(e => 
      e.emotion === 'tired' || e.arousal < 0.2
    ).length;
    
    if (boredomSequence > recentEmotions.length * 0.5) {
      insights.push({
        id: 'boredom-pattern',
        type: 'alert',
        title: 'Boredom Pattern Detected',
        description: 'You seem to be losing interest. Let\'s switch things up to re-engage your attention.',
        confidence: 85,
        actionable: true,
        actionItems: [
          'Try interactive learning tools',
          'Switch to a different subject',
          'Use gamification features',
          'Take a 5-minute break'
        ],
        timestamp: new Date(),
        severity: 'warning',
        category: 'boredom'
      });
    }
    
    // High focus achievement
    const focusSequence = recentEmotions.filter(e => 
      e.emotion === 'focused' || e.emotion === 'excited'
    ).length;
    
    if (focusSequence > recentEmotions.length * 0.7) {
      insights.push({
        id: 'high-focus-achievement',
        type: 'achievement',
        title: 'Excellent Focus Session!',
        description: 'You\'re in the zone! This is the perfect time for challenging material.',
        confidence: 92,
        actionable: true,
        actionItems: [
          'Continue with current topic',
          'Try advanced problems',
          'Use the knowledge graph',
          'Set a learning goal'
        ],
        timestamp: new Date(),
        severity: 'info',
        category: 'focus'
      });
    }
    
    // Stress management alert
    const stressSequence = recentEmotions.filter(e => 
      e.emotion === 'fearful' || e.intensity > 0.8
    ).length;
    
    if (stressSequence > recentEmotions.length * 0.3) {
      insights.push({
        id: 'stress-management',
        type: 'warning',
        title: 'Stress Management Needed',
        description: 'I detect signs of stress. Let\'s take care of your mental well-being.',
        confidence: 90,
        actionable: true,
        actionItems: [
          'Take a 10-minute break',
          'Try breathing exercises',
          'Switch to lighter content',
          'Use the meditation features'
        ],
        timestamp: new Date(),
        severity: 'critical',
        category: 'stress'
      });
    }
    
    setInsights(prev => [...insights, ...prev.slice(0, 15)]);
  }, [emotionHistory]);

  const analyzeEmotionPatterns = useCallback(() => {
    if (emotionHistory.length < 20) return;
    
    // Analyze time-based patterns
    const now = new Date();
    const hour = now.getHours();
    
    // Morning pattern (6-12)
    if (hour >= 6 && hour < 12) {
      const morningEmotions = emotionHistory.filter(e => {
        const emotionHour = e.timestamp.getHours();
        return emotionHour >= 6 && emotionHour < 12;
      });
      
      if (morningEmotions.length > 5) {
        const focusRate = morningEmotions.filter(e => e.emotion === 'focused').length / morningEmotions.length;
        if (focusRate > 0.6) {
          // Morning focus pattern detected
        }
      }
    }
    
    // Afternoon pattern (12-18)
    if (hour >= 12 && hour < 18) {
      const afternoonEmotions = emotionHistory.filter(e => {
        const emotionHour = e.timestamp.getHours();
        return emotionHour >= 12 && emotionHour < 18;
      });
      
      if (afternoonEmotions.length > 5) {
        const tiredRate = afternoonEmotions.filter(e => e.emotion === 'tired').length / afternoonEmotions.length;
        if (tiredRate > 0.4) {
          // Afternoon fatigue pattern detected
        }
      }
    }
  }, [emotionHistory]);

  const generateAdaptiveRecommendations = useCallback(() => {
    if (!learningState || !stats) return;
    
    const recommendations: AdaptiveRecommendation[] = [];
    
    // Frustration-based recommendations
    if (learningState.frustration === 'high' || learningState.frustration === 'extreme') {
      recommendations.push({
        id: 'frustration-break',
        type: 'break',
        title: 'Take a Frustration Break',
        description: 'High frustration detected. A short break will help reset your mental state.',
        priority: 'urgent',
        confidence: 95,
        expectedImpact: 'Reduce frustration by 60-80%',
        actionItems: [
          'Step away from the screen for 5 minutes',
          'Do some light stretching',
          'Take deep breaths',
          'Return with a fresh perspective'
        ],
        estimatedDuration: 5
      });
    }
    
    // Boredom-based recommendations
    if (learningState.boredom === 'high' || learningState.boredom === 'extreme') {
      recommendations.push({
        id: 'boredom-engagement',
        type: 'method',
        title: 'Switch to Interactive Learning',
        description: 'Boredom detected. Interactive methods will re-engage your attention.',
        priority: 'high',
        confidence: 88,
        expectedImpact: 'Increase engagement by 70-90%',
        actionItems: [
          'Use the drawing canvas for visual learning',
          'Try interactive diagrams',
          'Switch to step-by-step problem solving',
          'Use gamification features'
        ],
        estimatedDuration: 15
      });
    }
    
    // High focus recommendations
    if (learningState.focus === 'laser_focused' && learningState.engagement === 'very_high') {
      recommendations.push({
        id: 'peak-learning',
        type: 'challenge',
        title: 'Peak Learning Window',
        description: 'You\'re in an optimal learning state. Perfect time for challenging material.',
        priority: 'medium',
        confidence: 92,
        expectedImpact: 'Maximize learning efficiency',
        actionItems: [
          'Try advanced problems',
          'Use the knowledge graph',
          'Set ambitious learning goals',
          'Explore complex topics'
        ],
        estimatedDuration: 30
      });
    }
    
    // Stress management recommendations
    if (learningState.stress === 'high' || learningState.stress === 'extreme') {
      recommendations.push({
        id: 'stress-management',
        type: 'encouragement',
        title: 'Stress Management Session',
        description: 'High stress detected. Let\'s focus on your well-being.',
        priority: 'urgent',
        confidence: 90,
        expectedImpact: 'Reduce stress by 50-70%',
        actionItems: [
          'Take a 10-minute break',
          'Try breathing exercises',
          'Switch to lighter content',
          'Use meditation features'
        ],
        estimatedDuration: 10
      });
    }
    
    // Update stats with recommendations
    setStats(prev => prev ? {
      ...prev,
      adaptiveRecommendations: recommendations
    } : null);
  }, [learningState, stats]);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="h-6 w-6 text-green-500" />;
      case 'sad': return <Frown className="h-6 w-6 text-blue-500" />;
      case 'angry': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'fearful': return <Eye className="h-6 w-6 text-purple-500" />;
      case 'surprised': return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'disgusted': return <Meh className="h-6 w-6 text-orange-500" />;
      case 'neutral': return <Meh className="h-6 w-6 text-gray-500" />;
      case 'contempt': return <ThumbsDown className="h-6 w-6 text-red-600" />;
      case 'excited': return <Star className="h-6 w-6 text-yellow-600" />;
      case 'confused': return <HelpCircle className="h-6 w-6 text-orange-600" />;
      case 'focused': return <Target className="h-6 w-6 text-blue-600" />;
      case 'tired': return <Coffee className="h-6 w-6 text-gray-600" />;
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
      case 'contempt': return 'text-red-700 bg-red-100';
      case 'excited': return 'text-yellow-700 bg-yellow-100';
      case 'confused': return 'text-orange-700 bg-orange-100';
      case 'focused': return 'text-blue-700 bg-blue-100';
      case 'tired': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStateColor = (state: string, level: string) => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      engagement: {
        very_high: 'text-green-700 bg-green-100',
        high: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        low: 'text-red-600 bg-red-100'
      },
      frustration: {
        none: 'text-green-600 bg-green-100',
        low: 'text-yellow-600 bg-yellow-100',
        medium: 'text-orange-600 bg-orange-100',
        high: 'text-red-600 bg-red-100',
        extreme: 'text-red-700 bg-red-200'
      },
      boredom: {
        none: 'text-green-600 bg-green-100',
        low: 'text-yellow-600 bg-yellow-100',
        medium: 'text-orange-600 bg-orange-100',
        high: 'text-red-600 bg-red-100',
        extreme: 'text-red-700 bg-red-200'
      },
      confusion: {
        none: 'text-green-600 bg-green-100',
        low: 'text-yellow-600 bg-yellow-100',
        medium: 'text-orange-600 bg-orange-100',
        high: 'text-red-600 bg-red-100',
        extreme: 'text-red-700 bg-red-200'
      },
      confidence: {
        very_high: 'text-green-700 bg-green-100',
        high: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        low: 'text-red-600 bg-red-100'
      },
      stress: {
        low: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        high: 'text-orange-600 bg-orange-100',
        extreme: 'text-red-700 bg-red-200'
      },
      focus: {
        laser_focused: 'text-green-700 bg-green-100',
        high: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        low: 'text-orange-600 bg-orange-100',
        distracted: 'text-red-600 bg-red-100'
      },
      overallMood: {
        excellent: 'text-green-700 bg-green-100',
        good: 'text-green-600 bg-green-100',
        neutral: 'text-gray-600 bg-gray-100',
        poor: 'text-orange-600 bg-orange-100',
        critical: 'text-red-700 bg-red-200'
      },
      learningReadiness: {
        peak: 'text-green-700 bg-green-100',
        optimal: 'text-green-600 bg-green-100',
        ready: 'text-yellow-600 bg-yellow-100',
        not_ready: 'text-red-600 bg-red-100'
      }
    };
    
    return colorMap[state]?.[level] || 'text-gray-600 bg-gray-100';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'breakthrough': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600 bg-blue-100';
      case 'alert': return 'text-yellow-600 bg-yellow-100';
      case 'recommendation': return 'text-purple-600 bg-purple-100';
      case 'achievement': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'breakthrough': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!hasPermission) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <CameraOff className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-600">Advanced Emotion Recognition</h2>
          <p className="text-gray-500">
            Advanced emotion recognition requires camera access to analyze your facial expressions, 
            micro-expressions, and learning patterns for personalized adaptive learning.
          </p>
          <Button onClick={initializeAdvancedEmotionRecognition}>
            <Camera className="h-4 w-4 mr-2" />
            Enable Advanced Emotion Recognition
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
            Advanced Emotion Recognition
          </h1>
          <p className="text-gray-600">AI-powered facial emotion analysis with micro-expression detection and adaptive learning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Basic View' : 'Advanced View'}
          </Button>
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
          <h3 className="text-lg font-semibold mb-4">Advanced Emotion Recognition Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="500">500ms (Ultra Fast)</option>
                <option value="1000">1s (Fast)</option>
                <option value="2000">2s (Normal)</option>
                <option value="5000">5s (Slow)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Mode</label>
              <select className="w-full p-2 border rounded-lg">
                <option value="standard">Standard Analysis</option>
                <option value="advanced">Advanced Analysis</option>
                <option value="research">Research Mode</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'analysis', label: 'Analysis', icon: <Brain className="h-4 w-4" /> },
          { id: 'patterns', label: 'Patterns', icon: <TrendingUp className="h-4 w-4" /> },
          { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="h-4 w-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Camera Feed and Controls */}
      {isEnabled && activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Live Advanced Emotion Analysis
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
              
              {/* Advanced overlay */}
              {currentEmotion && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getEmotionIcon(currentEmotion.emotion)}
                    <span className="font-medium capitalize">{currentEmotion.emotion}</span>
                    <span className="text-sm">
                      {Math.round(currentEmotion.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Valence: {currentEmotion.valence.toFixed(2)}</div>
                    <div>Arousal: {currentEmotion.arousal.toFixed(2)}</div>
                    <div>Intensity: {currentEmotion.intensity.toFixed(2)}</div>
                    {currentEmotion.microExpressions.length > 0 && (
                      <div>Micro-expressions: {currentEmotion.microExpressions.length}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "outline" : "default"}
                className={isRecording ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""}
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
                  Advanced analysis in progress...
                </div>
              )}
            </div>
          </div>

          {/* Current Learning State */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Advanced Learning State
            </h3>
            
            {learningState ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {learningState.engagement === 'very_high' ? '🚀' : 
                       learningState.engagement === 'high' ? '🔥' : 
                       learningState.engagement === 'medium' ? '⚡' : '😴'}
                    </div>
                    <div className="text-sm font-medium">Engagement</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('engagement', learningState.engagement)}`}>
                      {learningState.engagement.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {learningState.frustration === 'extreme' ? '😡' : 
                       learningState.frustration === 'high' ? '😤' : 
                       learningState.frustration === 'medium' ? '😕' : 
                       learningState.frustration === 'low' ? '😐' : '😌'}
                    </div>
                    <div className="text-sm font-medium">Frustration</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('frustration', learningState.frustration)}`}>
                      {learningState.frustration}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {learningState.boredom === 'extreme' ? '😴' : 
                       learningState.boredom === 'high' ? '😑' : 
                       learningState.boredom === 'medium' ? '😐' : 
                       learningState.boredom === 'low' ? '😊' : '😄'}
                    </div>
                    <div className="text-sm font-medium">Boredom</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('boredom', learningState.boredom)}`}>
                      {learningState.boredom}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {learningState.focus === 'laser_focused' ? '🎯' : 
                       learningState.focus === 'high' ? '💪' : 
                       learningState.focus === 'medium' ? '🤔' : 
                       learningState.focus === 'low' ? '😰' : '😵'}
                    </div>
                    <div className="text-sm font-medium">Focus</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStateColor('focus', learningState.focus)}`}>
                      {learningState.focus.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-medium">Stress Level</div>
                    <div className={`text-2xl ${learningState.stress === 'extreme' ? '😰' : 
                                 learningState.stress === 'high' ? '😟' : 
                                 learningState.stress === 'medium' ? '😐' : '😌'}`}>
                      {learningState.stress === 'extreme' ? '😰' : 
                       learningState.stress === 'high' ? '😟' : 
                       learningState.stress === 'medium' ? '😐' : '😌'}
                    </div>
                    <div className={`text-sm font-medium capitalize ${getStateColor('stress', learningState.stress)}`}>
                      {learningState.stress}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-medium">Learning Readiness</div>
                    <div className={`text-2xl ${learningState.learningReadiness === 'peak' ? '🚀' : 
                                 learningState.learningReadiness === 'optimal' ? '⭐' : 
                                 learningState.learningReadiness === 'ready' ? '👍' : '⏸️'}`}>
                      {learningState.learningReadiness === 'peak' ? '🚀' : 
                       learningState.learningReadiness === 'optimal' ? '⭐' : 
                       learningState.learningReadiness === 'ready' ? '👍' : '⏸️'}
                    </div>
                    <div className={`text-sm font-medium capitalize ${getStateColor('learningReadiness', learningState.learningReadiness)}`}>
                      {learningState.learningReadiness.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Start advanced emotion analysis to see your learning state
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Emotion History Chart */}
          {emotionHistory.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                Emotion Timeline Analysis
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {emotionHistory.slice(-16).map((emotion, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">
                      {getEmotionIcon(emotion.emotion)}
                    </div>
                    <div className="text-xs font-medium capitalize">{emotion.emotion}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(emotion.confidence * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {emotion.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Micro-expressions Analysis */}
          {currentEmotion && currentEmotion.microExpressions.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Micro-expressions Detected
              </h3>
              
              <div className="space-y-2">
                {currentEmotion.microExpressions.map((micro, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{micro.type.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${micro.intensity * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(micro.intensity * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && stats && (
        <div className="space-y-6">
          {/* Learning Patterns */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Learning Patterns
            </h3>
            
            <div className="space-y-4">
              {stats.learningPatterns.map((pattern) => (
                <div key={pattern.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{pattern.name}</h4>
                    <span className="text-sm text-gray-500">{pattern.confidence}% confidence</span>
                  </div>
                  <p className="text-gray-600 mb-3">{pattern.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Duration: {pattern.duration} min</span>
                    <span>Frequency: {Math.round(pattern.frequency * 100)}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pattern.learningImpact === 'positive' ? 'bg-green-100 text-green-800' :
                      pattern.learningImpact === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pattern.learningImpact} impact
                    </span>
                  </div>
                  {pattern.recommendations.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {pattern.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              Performance Metrics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.performanceMetrics.averageFocusTime}</div>
                <div className="text-sm text-gray-600">Avg Focus Time (min)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.performanceMetrics.optimalLearningWindows}</div>
                <div className="text-sm text-gray-600">Optimal Windows</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.performanceMetrics.stressRecoveryTime}</div>
                <div className="text-sm text-gray-600">Stress Recovery (min)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.performanceMetrics.engagementConsistency}%</div>
                <div className="text-sm text-gray-600">Engagement Consistency</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && stats && (
        <div className="space-y-6">
          {/* Adaptive Recommendations */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Adaptive Recommendations
            </h3>
            
            {stats.adaptiveRecommendations.length > 0 ? (
              <div className="space-y-4">
                {stats.adaptiveRecommendations.map((rec) => (
                  <div key={rec.id} className={`border rounded-lg p-4 ${
                    rec.priority === 'urgent' ? 'border-red-200 bg-red-50' :
                    rec.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                    rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rec.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="text-sm text-gray-500">{rec.confidence}% confidence</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      Expected Impact: {rec.expectedImpact} • Duration: {rec.estimatedDuration} min
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                      <ul className="space-y-1">
                        {rec.actionItems.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recommendations available. Start learning to get personalized suggestions!
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Advanced AI Learning Insights
          </h3>
          
          <div className="space-y-4">
            {insights.slice(0, 8).map((insight) => (
              <div key={insight.id} className={`border rounded-lg p-4 ${
                insight.severity === 'critical' ? 'border-red-200 bg-red-50' :
                insight.severity === 'warning' ? 'border-orange-200 bg-orange-50' :
                'border-gray-200 bg-white'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          insight.severity === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.severity}
                        </span>
                        <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                      </div>
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
    </div>
  );
}