"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Globe, Volume2, Mic, BookOpen, Brain, Zap, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

interface TranslationResult {
  text: string;
  language: string;
  confidence: number;
  alternatives: string[];
}

interface LessonContent {
  id: string;
  title: string;
  content: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  translations: Record<string, string>;
  audioUrl?: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false }
];

export function MultiLanguageTutor() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[1]);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<TranslationResult[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate translation
  const translateText = useCallback(async (text: string, from: string, to: string) => {
    setIsTranslating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock translation (in real app, this would call translation API)
    const mockTranslations: Record<string, Record<string, string>> = {
      'en': {
        'si': 'මෙය ඉංග්‍රීසි පාඩමකි',
        'ta': 'இது ஒரு ஆங்கில பாடம்',
        'hi': 'यह एक अंग्रेजी पाठ है',
        'zh': '这是一节英语课',
        'es': 'Esta es una lección de inglés',
        'fr': 'Ceci est une leçon d\'anglais',
        'de': 'Das ist eine Englischstunde',
        'ja': 'これは英語のレッスンです',
        'ko': '이것은 영어 수업입니다'
      },
      'si': {
        'en': 'This is a Sinhala lesson',
        'ta': 'இது ஒரு සිංහල பாடம்',
        'hi': 'यह एक सिंहली पाठ है'
      },
      'ta': {
        'en': 'This is a Tamil lesson',
        'si': 'මෙය දෙමළ පාඩමකි',
        'hi': 'यह एक तमिल पाठ है'
      }
    };
    
    const translation = mockTranslations[from]?.[to] || `[Translated from ${from} to ${to}] ${text}`;
    
    const result: TranslationResult = {
      text: translation,
      language: to,
      confidence: 0.95,
      alternatives: [translation + ' (alt 1)', translation + ' (alt 2)']
    };
    
    setTranslatedText(translation);
    setTranslationHistory(prev => [result, ...prev.slice(0, 9)]);
    setIsTranslating(false);
    
    return result;
  }, []);

  // Generate lesson content
  const generateLesson = useCallback(async (topic: string, difficulty: string) => {
    const lesson: LessonContent = {
      id: crypto.randomUUID(),
      title: `${topic} - ${difficulty} Level`,
      content: `This is a ${difficulty} level lesson about ${topic}. It covers the fundamental concepts and provides practical examples to help you understand the material better.`,
      language: sourceLanguage.code,
      difficulty: difficulty as any,
      translations: {
        [targetLanguage.code]: `මෙය ${topic} පිළිබඳ ${difficulty} මට්ටමේ පාඩමකි. මූලික සංකල්ප ආවරණය කරන අතර ඔබට ද්‍රව්‍ය වඩා හොඳින් තේරුම් ගැනීමට උදව් වන ප්‍රායෝගික උදාහරණ සපයයි.`
      },
      audioUrl: undefined
    };
    
    setCurrentLesson(lesson);
  }, [sourceLanguage.code, targetLanguage.code]);

  // Text-to-speech
  const speakText = useCallback(async (text: string, language: string) => {
    if (!('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  // Speech-to-text
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = sourceLanguage.code;
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  }, [sourceLanguage.code]);

  // Swap languages
  const swapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  }, [sourceLanguage, targetLanguage, inputText, translatedText]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          Multi-Language Tutor
        </h1>
        <p className="text-gray-600">Learn in your native language with real-time translation and voice support</p>
      </div>

      {/* Language Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Source Language</label>
            <div className="flex items-center gap-3">
              <select
                value={sourceLanguage.code}
                onChange={(e) => setSourceLanguage(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                className="flex-1 p-2 border rounded-lg"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText(inputText, sourceLanguage.code)}
                disabled={!inputText || isSpeaking}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Language</label>
            <div className="flex items-center gap-3">
              <select
                value={targetLanguage.code}
                onChange={(e) => setTargetLanguage(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                className="flex-1 p-2 border rounded-lg"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText(translatedText, targetLanguage.code)}
                disabled={!translatedText || isSpeaking}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button onClick={swapLanguages} variant="outline" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Swap Languages
          </Button>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {sourceLanguage.flag} {sourceLanguage.nativeName}
            </h3>
            <Button
              onClick={startListening}
              disabled={isListening}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              {isListening ? 'Listening...' : 'Voice Input'}
            </Button>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type or speak in ${sourceLanguage.nativeName}...`}
            rows={6}
            className="resize-none"
          />
          <Button
            onClick={() => translateText(inputText, sourceLanguage.code, targetLanguage.code)}
            disabled={!inputText || isTranslating}
            className="w-full"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {targetLanguage.flag} {targetLanguage.nativeName}
          </h3>
          <div className="p-4 border rounded-lg min-h-[150px] bg-gray-50">
            {translatedText ? (
              <p className="text-gray-800" dir={targetLanguage.rtl ? 'rtl' : 'ltr'}>
                {translatedText}
              </p>
            ) : (
              <p className="text-gray-500 italic">Translation will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Generator */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Generate Multi-Language Lesson
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Enter topic (e.g., Mathematics, Science)"
            className="p-2 border rounded-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                generateLesson((e.target as HTMLInputElement).value, 'intermediate');
              }
            }}
          />
          <select className="p-2 border rounded-lg">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <Button onClick={() => generateLesson('Mathematics', 'intermediate')} className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Generate Lesson
          </Button>
        </div>
      </div>

      {/* Current Lesson */}
      {currentLesson && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">{currentLesson.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {sourceLanguage.flag} {sourceLanguage.nativeName}
              </h4>
              <p className="text-gray-700">{currentLesson.content}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {targetLanguage.flag} {targetLanguage.nativeName}
              </h4>
              <p className="text-gray-700" dir={targetLanguage.rtl ? 'rtl' : 'ltr'}>
                {currentLesson.translations[targetLanguage.code] || 'Translation not available'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Recent Translations</h3>
          <div className="space-y-2">
            {translationHistory.slice(0, 5).map((translation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{translation.language}</p>
                  <p className="font-medium">{translation.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {Math.round(translation.confidence * 100)}%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => speakText(translation.text, translation.language)}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
