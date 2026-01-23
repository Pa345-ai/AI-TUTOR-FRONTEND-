"use client";

import React, { useState } from 'react';
import { 
  Brain, 
  Mic, 
  Volume2, 
  Upload, 
  Target, 
  Trophy, 
  Globe, 
  Zap, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceTutor } from '@/components/VoiceTutor';
import { NoteSummarizer } from '@/components/NoteSummarizer';
import { AdaptiveLearningEngine } from '@/components/AdaptiveLearningEngine';
import { GamificationSystem } from '@/components/GamificationSystem';
import { MultiLanguageTutor } from '@/components/MultiLanguageTutor';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'planned';
  component?: React.ComponentType<any>;
  benefits: string[];
}

const ULTRA_FEATURES: FeatureCard[] = [
  {
    id: 'voice-tutor',
    title: 'Ultra-Intelligent Voice Tutor',
    description: 'AI-powered voice interaction with emotion detection and adaptive responses',
    icon: <Mic className="h-8 w-8 text-blue-600" />,
    status: 'completed',
    component: VoiceTutor,
    benefits: [
      'Real-time voice recognition with emotion analysis',
      'Adaptive TTS based on student engagement',
      'Multi-modal voice interaction',
      'Emotion-aware teaching responses'
    ]
  },
  {
    id: 'note-summarizer',
    title: 'AI Note Summarizer',
    description: 'Upload any document and get instant AI-powered summaries, flashcards, and study materials',
    icon: <Upload className="h-8 w-8 text-green-600" />,
    status: 'completed',
    component: NoteSummarizer,
    benefits: [
      'Supports PDF, Word, Images, Videos',
      'Auto-generates flashcards and quizzes',
      'Multiple summary types (overview, detailed, exam-prep)',
      'Export to various formats'
    ]
  },
  {
    id: 'adaptive-engine',
    title: 'Adaptive Learning Engine',
    description: 'AI-powered personalized learning paths that adapt to your performance in real-time',
    icon: <Target className="h-8 w-8 text-purple-600" />,
    status: 'completed',
    component: AdaptiveLearningEngine,
    benefits: [
      'Personalized learning roadmaps',
      'Real-time difficulty adjustment',
      'Performance-based recommendations',
      'Knowledge gap identification'
    ]
  },
  {
    id: 'gamification',
    title: 'Advanced Gamification',
    description: 'XP levels, achievements, leaderboards, and social learning features',
    icon: <Trophy className="h-8 w-8 text-yellow-600" />,
    status: 'completed',
    component: GamificationSystem,
    benefits: [
      'XP system with level progression',
      'Achievement and badge system',
      'Global leaderboards',
      'Weekly progress tracking'
    ]
  },
  {
    id: 'multi-language',
    title: 'Multi-Language Tutor',
    description: 'Learn in your native language with real-time translation and voice support',
    icon: <Globe className="h-8 w-8 text-indigo-600" />,
    status: 'completed',
    component: MultiLanguageTutor,
    benefits: [
      '10+ supported languages',
      'Real-time translation',
      'Voice input/output in native languages',
      'Cultural context awareness'
    ]
  },
  {
    id: 'emotion-recognition',
    title: 'Facial Emotion Recognition',
    description: 'Detect student emotions via webcam and adjust teaching approach accordingly',
    icon: <Brain className="h-8 w-8 text-pink-600" />,
    status: 'planned',
    benefits: [
      'Real-time emotion detection',
      'Adaptive teaching tone',
      'Frustration and boredom alerts',
      'Premium feature for advanced users'
    ]
  },
  {
    id: 'knowledge-graph',
    title: 'Knowledge Graph Understanding',
    description: 'AI maps your learning progress and identifies knowledge gaps like Khan Academy',
    icon: <BookOpen className="h-8 w-8 text-orange-600" />,
    status: 'in-progress',
    benefits: [
      'Visual knowledge mapping',
      'Gap identification and filling',
      'Prerequisite tracking',
      'Mastery learning system'
    ]
  },
  {
    id: 'offline-mode',
    title: 'Offline Mode + On-Device AI',
    description: 'Works without internet using small, efficient AI models for developing regions',
    icon: <Zap className="h-8 w-8 text-teal-600" />,
    status: 'in-progress',
    benefits: [
      'Works without internet',
      'On-device AI processing',
      'Sync when online',
      'Perfect for remote areas'
    ]
  }
];

export default function UltraIntelligentPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const getStatusColor = (status: FeatureCard['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: FeatureCard['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Zap className="h-4 w-4" />;
      case 'planned': return <Star className="h-4 w-4" />;
    }
  };

  const renderFeatureDemo = () => {
    if (!activeFeature) return null;
    
    const feature = ULTRA_FEATURES.find(f => f.id === activeFeature);
    if (!feature?.component) return null;

    const Component = feature.component;
    
    // Render components with appropriate props
    switch (feature.id) {
      case 'voice-tutor':
        return <Component onTranscript={() => {}} onSpeak={() => {}} isListening={false} isSpeaking={false} onToggleListening={() => {}} onToggleSpeaking={() => {}} language="en" mode="friendly" />;
      case 'note-summarizer':
        return <Component />;
      case 'adaptive-engine':
        return <Component userId="123" subject="math" onPathUpdate={() => {}} onRecommendation={() => {}} />;
      case 'gamification':
        return <Component />;
      case 'multi-language':
        return <Component />;
      default:
        return <Component />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ultra-Intelligent Learning Engine
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of AI-powered education with our comprehensive suite of intelligent learning tools
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={() => setShowDemo(!showDemo)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {showDemo ? 'Hide Demo' : 'Try Live Demo'}
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-gray-600">Completed Features</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">2</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
            <div className="text-gray-600">Supported Languages</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">AI-Powered</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ULTRA_FEATURES.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    {feature.icon}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                    {getStatusIcon(feature.status)}
                    {feature.status.replace('-', ' ')}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                  {feature.benefits.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{feature.benefits.length - 3} more benefits
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-4 group-hover:bg-purple-600 transition-colors"
                  variant={activeFeature === feature.id ? "default" : "outline"}
                >
                  {activeFeature === feature.id ? 'Currently Viewing' : 'Try Feature'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Demo Section */}
        {showDemo && activeFeature && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {ULTRA_FEATURES.find(f => f.id === activeFeature)?.title} - Live Demo
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveFeature(null)}
              >
                Close Demo
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              {renderFeatureDemo()}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of students already using our ultra-intelligent learning platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
