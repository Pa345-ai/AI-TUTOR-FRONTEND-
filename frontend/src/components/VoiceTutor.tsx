"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, Heart, Smile, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceTutorProps {
  onTranscript: (text: string) => void;
  onSpeak: (text: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
  language: 'en' | 'si' | 'ta';
  mode: 'socratic' | 'exam' | 'friendly' | 'motivational';
  engagement?: { attention: number; frustration: number };
}

interface EmotionState {
  confidence: number;
  emotion: 'happy' | 'sad' | 'frustrated' | 'confused' | 'excited' | 'neutral';
  intensity: number;
}

export function VoiceTutor({
  onTranscript,
  onSpeak,
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeaking,
  language,
  mode,
  engagement
}: VoiceTutorProps) {
  const [emotion, setEmotion] = useState<EmotionState>({ confidence: 0, emotion: 'neutral', intensity: 0 });
  const [voiceAnalysis, setVoiceAnalysis] = useState<{ pitch: number; volume: number; pace: number }>({ pitch: 0, volume: 0, pace: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Voice emotion analysis
  const analyzeVoiceEmotion = useCallback((text: string) => {
    const emotionPatterns = {
      happy: /\b(yes|great|awesome|amazing|wonderful|excellent|perfect|love|like)\b/i,
      sad: /\b(no|sad|terrible|awful|hate|dislike|wrong|bad|difficult|hard)\b/i,
      frustrated: /\b(ugh|argh|frustrated|annoying|confusing|don't understand|stuck)\b/i,
      confused: /\b(what|how|why|confused|unclear|don't know|not sure)\b/i,
      excited: /\b(wow|cool|fantastic|brilliant|incredible|amazing|yes!)\b/i
    };

    let detectedEmotion: EmotionState['emotion'] = 'neutral';
    let confidence = 0;
    let intensity = 0;

    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        detectedEmotion = emotion as EmotionState['emotion'];
        confidence = Math.min(0.9, matches.length * 0.2);
        intensity = Math.min(1, matches.length * 0.3);
        break;
      }
    }

    setEmotion({ confidence, emotion: detectedEmotion, intensity });
  }, []);

  // Get emotion icon and color
  const getEmotionDisplay = () => {
    const emotionIcons = {
      happy: <Smile className="h-4 w-4 text-green-500" />,
      sad: <Frown className="h-4 w-4 text-blue-500" />,
      frustrated: <Frown className="h-4 w-4 text-red-500" />,
      confused: <Brain className="h-4 w-4 text-yellow-500" />,
      excited: <Heart className="h-4 w-4 text-pink-500" />,
      neutral: <Brain className="h-4 w-4 text-gray-500" />
    };

    return emotionIcons[emotion.emotion];
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Voice Controls */}
      <div className="flex items-center space-x-4">
        <Button
          variant={isListening ? "default" : "outline"}
          size="lg"
          onClick={onToggleListening}
          className="flex items-center space-x-2"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
        </Button>

        <Button
          variant={isSpeaking ? "default" : "outline"}
          size="lg"
          onClick={onToggleSpeaking}
          className="flex items-center space-x-2"
        >
          {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          <span>{isSpeaking ? 'Mute' : 'Enable Voice'}</span>
        </Button>
      </div>

      {/* Emotion Detection Display */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {getEmotionDisplay()}
          <span className="text-sm font-medium capitalize">{emotion.emotion}</span>
          <span className="text-xs text-gray-500">({Math.round(emotion.confidence * 100)}%)</span>
        </div>

        {isAnalyzing && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-600">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Mode-specific feedback */}
      <div className="text-center text-sm text-gray-600">
        {mode === 'socratic' && "I'm asking questions to guide your thinking..."}
        {mode === 'exam' && "Let's test your knowledge with challenging questions..."}
        {mode === 'friendly' && "I'm here to help you learn in a comfortable way..."}
        {mode === 'motivational' && "You're doing great! Let's keep the momentum going..."}
      </div>
    </div>
  );
}
