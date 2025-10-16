"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, BookOpen, Download, Sparkles, Brain, FileImage, FileVideo, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface SummarizedContent {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  questions: string[];
  flashcards: Array<{ front: string; back: string }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  subjects: string[];
  createdAt: Date;
}

interface FileUpload {
  file: File;
  type: 'pdf' | 'image' | 'video' | 'text';
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export function NoteSummarizer() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [summarizedContent, setSummarizedContent] = useState<SummarizedContent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SummarizedContent | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [summaryType, setSummaryType] = useState<'overview' | 'detailed' | 'exam-prep' | 'flashcards'>('overview');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach(file => {
      const fileType = getFileType(file);
      const newFile: FileUpload = {
        file,
        type: fileType,
        progress: 0,
        status: 'uploading'
      };
      
      setFiles(prev => [...prev, newFile]);
      processFile(newFile);
    });
  }, []);

  const getFileType = (file: File): FileUpload['type'] => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'text';
  };

  const processFile = async (fileUpload: FileUpload) => {
    try {
      // Simulate file processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.file === fileUpload.file 
            ? { ...f, progress, status: progress === 100 ? 'completed' : 'processing' }
            : f
        ));
      }

      // Generate AI summary
      const summary = await generateAISummary(fileUpload.file, summaryType);
      setSummarizedContent(prev => [...prev, summary]);
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.file === fileUpload.file 
          ? { ...f, status: 'error' }
          : f
      ));
    }
  };

  const generateAISummary = async (file: File, type: string): Promise<SummarizedContent> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSummary: SummarizedContent = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      summary: `This is an AI-generated summary of ${file.name}. The content covers key concepts and provides a comprehensive overview suitable for learning and exam preparation.`,
      keyPoints: [
        'Key concept 1: Fundamental principles explained',
        'Key concept 2: Important applications and examples',
        'Key concept 3: Advanced topics and connections',
        'Key concept 4: Practical implications and real-world usage'
      ],
      questions: [
        'What are the main principles discussed in this content?',
        'How do these concepts apply to real-world scenarios?',
        'What are the key differences between the approaches mentioned?',
        'What are the potential challenges and solutions?'
      ],
      flashcards: [
        { front: 'What is the main topic?', back: 'The main topic covers fundamental concepts and their applications.' },
        { front: 'Key principle 1', back: 'This principle explains the foundational understanding required.' },
        { front: 'Key principle 2', back: 'This principle demonstrates practical applications.' }
      ],
      difficulty: 'intermediate',
      estimatedTime: 45,
      subjects: ['General', 'Education'],
      createdAt: new Date()
    };

    return mockSummary;
  };

  const exportContent = (content: SummarizedContent, format: 'pdf' | 'docx' | 'anki' | 'quizlet') => {
    // Export functionality would be implemented here
    console.log(`Exporting ${content.title} as ${format}`);
  };

  const deleteContent = (id: string) => {
    setSummarizedContent(prev => prev.filter(c => c.id !== id));
  };

  const getFileIcon = (type: FileUpload['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'image': return <FileImage className="h-5 w-5 text-green-500" />;
      case 'video': return <FileVideo className="h-5 w-5 text-blue-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          AI Note Summarizer
        </h1>
        <p className="text-gray-600">Upload any document and get instant AI-powered summaries, flashcards, and study materials</p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.avi"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload Documents
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, Word, Images, Videos, and Text files
            </p>
          </div>
        </div>
      </div>

      {/* Summary Type Selection */}
      <div className="flex gap-2 justify-center">
        {[
          { value: 'overview', label: 'Overview', icon: BookOpen },
          { value: 'detailed', label: 'Detailed', icon: FileText },
          { value: 'exam-prep', label: 'Exam Prep', icon: Brain },
          { value: 'flashcards', label: 'Flashcards', icon: Sparkles }
        ].map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={summaryType === value ? 'default' : 'outline'}
            onClick={() => setSummaryType(value as any)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Custom Prompt */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Instructions (Optional)</label>
        <Textarea
          placeholder="e.g., Focus on mathematical concepts, explain for beginners, include practical examples..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
        />
      </div>

      {/* File Processing Status */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processing Files</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              {getFileIcon(file.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{file.file.name}</span>
                  <span className="text-sm text-gray-500">{file.progress}%</span>
                </div>
                <Progress value={file.progress} className="mt-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {file.status === 'uploading' && 'Uploading...'}
                  {file.status === 'processing' && 'AI is analyzing...'}
                  {file.status === 'completed' && 'Completed!'}
                  {file.status === 'error' && 'Error processing'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summarized Content */}
      {summarizedContent.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">AI-Generated Content</h3>
          <div className="grid gap-6">
            {summarizedContent.map((content) => (
              <div key={content.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-semibold">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>Difficulty: {content.difficulty}</span>
                      <span>Time: {content.estimatedTime} min</span>
                      <span>Subjects: {content.subjects.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportContent(content, 'pdf')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteContent(content.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Summary</h5>
                    <p className="text-gray-700">{content.summary}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Key Points</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {content.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Study Questions</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {content.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Flashcards</h5>
                    <div className="grid gap-2">
                      {content.flashcards.map((card, index) => (
                        <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">Q: {card.front}</div>
                            <div className="text-gray-600 text-sm">A: {card.back}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
