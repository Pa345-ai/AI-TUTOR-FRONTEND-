"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Settings, 
  Share, 
  Copy, 
  Crown, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  FileText, 
  BookOpen, 
  Calculator, 
  Palette, 
  Code, 
  Globe, 
  Brain, 
  Zap, 
  Target, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Timer, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Shuffle, 
  Headphones, 
  Camera, 
  CameraOff, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Desktop, 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalZero, 
  SignalOne, 
  SignalTwo, 
  SignalThree, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryHigh, 
  BatteryFull, 
  Plug, 
  PlugZap, 
  Power, 
  PowerOff, 
  Zap, 
  ZapOff, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Thermometer, 
  Gauge, 
  BarChart, 
  PieChart, 
  LineChart, 
  TrendingDown, 
  TrendingUp as TrendingUpIcon, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Move, 
  GripVertical, 
  Layers, 
  Link, 
  Unlink, 
  MousePointer, 
  Hand, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code as CodeIcon, 
  Table, 
  Grid, 
  Layout, 
  Maximize, 
  Minimize, 
  RotateCcw as Undo, 
  Redo, 
  Copy as CopyIcon, 
  Scissors, 
  Clipboard, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Shield as ShieldIcon, 
  CheckSquare, 
  Square, 
  Circle, 
  Dot, 
  Hash, 
  Percent, 
  DollarSign, 
  Euro, 
  Bitcoin, 
  CreditCard, 
  Banknote, 
  Coins, 
  TrendingDown as TrendingDownIcon, 
  Activity as ActivityIcon, 
  Zap as ZapIcon, 
  Flame, 
  Snowflake, 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Cloud as CloudIcon, 
  CloudRain as CloudRainIcon, 
  CloudSnow as CloudSnowIcon, 
  Wind as WindIcon, 
  Thermometer as ThermometerIcon, 
  Droplets as DropletsIcon, 
  Waves, 
  Mountain, 
  TreePine, 
  Trees, 
  Flower, 
  Leaf, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Squirrel, 
  Turtle, 
  Butterfly, 
  Bee, 
  Spider, 
  Ant, 
  Ladybug, 
  Dragonfly, 
  Snail, 
  Frog, 
  Lizard, 
  Snake, 
  Crocodile, 
  Penguin, 
  Owl, 
  Eagle, 
  Parrot, 
  Peacock, 
  Flamingo, 
  Toucan, 
  Hummingbird, 
  Robin, 
  Cardinal, 
  Bluebird, 
  Canary, 
  Finch, 
  Sparrow, 
  Crow, 
  Raven, 
  Magpie, 
  Jay, 
  Woodpecker, 
  Kingfisher, 
  Heron, 
  Stork, 
  Crane, 
  Swan, 
  Duck, 
  Goose, 
  Chicken, 
  Rooster, 
  Turkey, 
  Pheasant, 
  Quail, 
  Partridge, 
  Grouse, 
  Ptarmigan, 
  Sandpiper, 
  Plover, 
  Lapwing, 
  Curlew, 
  Snipe, 
  Woodcock, 
  Sanderling, 
  Dunlin, 
  Knot, 
  Turnstone, 
  Oystercatcher, 
  Avocet, 
  Stilt, 
  Godwit, 
  Redshank, 
  Greenshank, 
  Yellowlegs, 
  Willet, 
  Dowitcher, 
  Phalarope, 
  Jaeger, 
  Skua, 
  Gull, 
  Tern, 
  Noddy, 
  Booby, 
  Gannet, 
  Cormorant, 
  Shag, 
  Pelican, 
  Frigatebird, 
  Albatross, 
  Petrel, 
  Shearwater, 
  Fulmar, 
  StormPetrel, 
  DivingPetrel, 
  Prion, 
  Puffin, 
  Auk, 
  Guillemot, 
  Razorbill, 
  Murre, 
  Murrelet, 
  Auklet, 
  Dovekie, 
  Gyrfalcon, 
  Peregrine, 
  Merlin, 
  Kestrel, 
  Hobby, 
  Saker, 
  Lanner, 
  Goshawk, 
  Sparrowhawk, 
  Buzzard, 
  Harrier, 
  Kite, 
  Osprey, 
  Vulture, 
  Condor, 
  Caracara, 
  Falcon, 
  Hawk, 
  Accipiter, 
  Buteo, 
  Circus, 
  Milvus, 
  Haliaeetus, 
  Aquila, 
  Hieraaetus, 
  Spizaetus, 
  Lophaetus, 
  Polemaetus, 
  Stephanoaetus, 
  Morphnus, 
  Harpia, 
  Harpyopsis, 
  Pithecophaga, 
  Spilornis, 
  Gypaetus, 
  Neophron, 
  Gyps, 
  Aegypius, 
  Sarcogyps, 
  Trigonoceps, 
  Necrosyrtes, 
  Torgos, 
  Terathopius, 
  Circaetus, 
  Dryotriorchis, 
  Eutriorchis, 
  Leptodon, 
  Chondrohierax, 
  Elanoides, 
  Gampsonyx, 
  Chelictinia, 
  Elanus, 
  Machaerhamphus, 
  Rostrhamus, 
  Helicolestes, 
  Ictinia, 
  Busarellus, 
  Geranospiza, 
  Leucopternis, 
  Buteogallus, 
  Parabuteo, 
  Geranoaetus, 
  Harpyhaliaetus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  subject: string;
  topic: string;
  maxParticipants: number;
  currentParticipants: number;
  isPrivate: boolean;
  password?: string;
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  status: 'active' | 'paused' | 'ended' | 'scheduled';
  scheduledStart?: Date;
  scheduledEnd?: Date;
  settings: {
    allowScreenShare: boolean;
    allowFileSharing: boolean;
    allowChat: boolean;
    allowVoice: boolean;
    allowVideo: boolean;
    recordSession: boolean;
    aiModeration: boolean;
    autoBreak: boolean;
    breakInterval: number; // minutes
    maxBreakDuration: number; // minutes
  };
  participants: StudyRoomParticipant[];
  aiModerator: AIModerator;
  sharedResources: SharedResource[];
  chatMessages: ChatMessage[];
  studySessions: StudySession[];
  analytics: StudyRoomAnalytics;
}

interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'moderator' | 'participant';
  isOnline: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  joinedAt: Date;
  lastSeen: Date;
  permissions: {
    canShareScreen: boolean;
    canShareFiles: boolean;
    canMuteOthers: boolean;
    canRemoveOthers: boolean;
    canModerateChat: boolean;
    canControlAI: boolean;
  };
  stats: {
    totalTimeSpent: number;
    messagesSent: number;
    filesShared: number;
    screenShares: number;
    participationScore: number;
  };
}

interface AIModerator {
  isActive: boolean;
  settings: {
    autoDetectOffTopic: boolean;
    autoDetectInappropriateContent: boolean;
    autoSuggestBreaks: boolean;
    autoEncourageParticipation: boolean;
    autoSummarizeProgress: boolean;
    autoGenerateQuestions: boolean;
    autoDetectConfusion: boolean;
    autoSuggestResources: boolean;
  };
  capabilities: {
    contentModeration: boolean;
    participationTracking: boolean;
    progressAnalysis: boolean;
    resourceRecommendation: boolean;
    questionGeneration: boolean;
    breakScheduling: boolean;
    conflictResolution: boolean;
    learningOptimization: boolean;
  };
  currentActions: ModeratorAction[];
  history: ModeratorAction[];
}

interface ModeratorAction {
  id: string;
  type: 'warning' | 'suggestion' | 'encouragement' | 'break_reminder' | 'resource_recommendation' | 'question_generation' | 'progress_summary' | 'conflict_resolution';
  message: string;
  targetParticipant?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  isResolved: boolean;
  aiConfidence: number;
}

interface SharedResource {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'presentation' | 'spreadsheet' | 'code' | 'link' | 'quiz' | 'flashcard';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
  description?: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  rating: number;
  comments: ResourceComment[];
}

interface ResourceComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isEdited: boolean;
  likes: number;
  replies: ResourceComment[];
}

interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system' | 'ai' | 'announcement';
  isEdited: boolean;
  isDeleted: boolean;
  reactions: MessageReaction[];
  replies: ChatMessage[];
  mentions: string[];
  attachments: MessageAttachment[];
}

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface StudySession {
  id: string;
  name: string;
  type: 'group_study' | 'quiz_session' | 'presentation' | 'discussion' | 'problem_solving' | 'review_session';
  startTime: Date;
  endTime?: Date;
  duration: number;
  participants: string[];
  activities: SessionActivity[];
  resources: string[];
  notes: string;
  isActive: boolean;
}

interface SessionActivity {
  id: string;
  type: 'discussion' | 'quiz' | 'presentation' | 'break' | 'file_share' | 'screen_share' | 'ai_intervention';
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  participants: string[];
  data: any;
}

interface StudyRoomAnalytics {
  totalSessions: number;
  totalParticipants: number;
  averageSessionDuration: number;
  totalMessages: number;
  totalFilesShared: number;
  participationRate: number;
  engagementScore: number;
  learningOutcomes: { [key: string]: number };
  popularTopics: { [key: string]: number };
  peakHours: { [key: string]: number };
  aiInterventions: number;
  conflictResolutions: number;
  resourceDownloads: number;
  satisfactionScore: number;
}

export function CollaborativeStudyRooms() {
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'create' | 'join' | 'analytics'>('rooms');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    subject: 'Mathematics',
    topic: '',
    maxParticipants: 10,
    isPrivate: false,
    password: '',
    settings: {
      allowScreenShare: true,
      allowFileSharing: true,
      allowChat: true,
      allowVoice: true,
      allowVideo: true,
      recordSession: false,
      aiModeration: true,
      autoBreak: true,
      breakInterval: 25,
      maxBreakDuration: 5
    }
  });
  const [joinCode, setJoinCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [aiMessage, setAiMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleRooms: StudyRoom[] = [
      {
        id: 'room-1',
        name: 'Advanced Calculus Study Group',
        description: 'Working through multivariable calculus problems and preparing for finals',
        subject: 'Mathematics',
        topic: 'Calculus',
        maxParticipants: 8,
        currentParticipants: 5,
        isPrivate: false,
        createdBy: 'Alice Johnson',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active',
        settings: {
          allowScreenShare: true,
          allowFileSharing: true,
          allowChat: true,
          allowVoice: true,
          allowVideo: true,
          recordSession: false,
          aiModeration: true,
          autoBreak: true,
          breakInterval: 25,
          maxBreakDuration: 5
        },
        participants: [
          {
            id: 'user-1',
            name: 'Alice Johnson',
            avatar: '/avatars/alice.jpg',
            role: 'host',
            isOnline: true,
            isMuted: false,
            isVideoOn: true,
            isScreenSharing: false,
            joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            lastSeen: new Date(),
            permissions: {
              canShareScreen: true,
              canShareFiles: true,
              canMuteOthers: true,
              canRemoveOthers: true,
              canModerateChat: true,
              canControlAI: true
            },
            stats: {
              totalTimeSpent: 180,
              messagesSent: 45,
              filesShared: 8,
              screenShares: 3,
              participationScore: 95
            }
          },
          {
            id: 'user-2',
            name: 'Bob Smith',
            avatar: '/avatars/bob.jpg',
            role: 'participant',
            isOnline: true,
            isMuted: false,
            isVideoOn: true,
            isScreenSharing: false,
            joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            lastSeen: new Date(),
            permissions: {
              canShareScreen: true,
              canShareFiles: true,
              canMuteOthers: false,
              canRemoveOthers: false,
              canModerateChat: false,
              canControlAI: false
            },
            stats: {
              totalTimeSpent: 120,
              messagesSent: 32,
              filesShared: 5,
              screenShares: 1,
              participationScore: 78
            }
          }
        ],
        aiModerator: {
          isActive: true,
          settings: {
            autoDetectOffTopic: true,
            autoDetectInappropriateContent: true,
            autoSuggestBreaks: true,
            autoEncourageParticipation: true,
            autoSummarizeProgress: true,
            autoGenerateQuestions: true,
            autoDetectConfusion: true,
            autoSuggestResources: true
          },
          capabilities: {
            contentModeration: true,
            participationTracking: true,
            progressAnalysis: true,
            resourceRecommendation: true,
            questionGeneration: true,
            breakScheduling: true,
            conflictResolution: true,
            learningOptimization: true
          },
          currentActions: [
            {
              id: 'action-1',
              type: 'suggestion',
              message: 'Consider taking a 5-minute break. You\'ve been studying for 25 minutes.',
              timestamp: new Date(),
              severity: 'low',
              isResolved: false,
              aiConfidence: 0.85
            }
          ],
          history: []
        },
        sharedResources: [
          {
            id: 'resource-1',
            name: 'Calculus Problem Set 3',
            type: 'document',
            url: '/files/calculus-ps3.pdf',
            uploadedBy: 'Alice Johnson',
            uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            size: 2048000,
            description: 'Practice problems for multivariable calculus',
            tags: ['calculus', 'practice', 'homework'],
            isPublic: true,
            downloadCount: 12,
            viewCount: 45,
            rating: 4.5,
            comments: []
          }
        ],
        chatMessages: [
          {
            id: 'msg-1',
            author: 'Alice Johnson',
            content: 'Welcome everyone! Let\'s start with problem 1 from the problem set.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            type: 'text',
            isEdited: false,
            isDeleted: false,
            reactions: [],
            replies: [],
            mentions: [],
            attachments: []
          },
          {
            id: 'msg-2',
            author: 'AI Moderator',
            content: 'I\'ve detected that the group is making good progress. Would you like me to generate some additional practice problems?',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            type: 'ai',
            isEdited: false,
            isDeleted: false,
            reactions: [
              { emoji: '👍', count: 3, users: ['user-1', 'user-2', 'user-3'] }
            ],
            replies: [],
            mentions: [],
            attachments: []
          }
        ],
        studySessions: [],
        analytics: {
          totalSessions: 15,
          totalParticipants: 8,
          averageSessionDuration: 45,
          totalMessages: 234,
          totalFilesShared: 18,
          participationRate: 87,
          engagementScore: 92,
          learningOutcomes: { 'calculus': 85, 'problem-solving': 78 },
          popularTopics: { 'derivatives': 45, 'integrals': 38, 'limits': 32 },
          peakHours: { '19:00': 8, '20:00': 12, '21:00': 10 },
          aiInterventions: 23,
          conflictResolutions: 2,
          resourceDownloads: 156,
          satisfactionScore: 4.3
        }
      }
    ];
    
    setStudyRooms(sampleRooms);
  }, []);

  const createRoom = useCallback(async () => {
    setIsCreatingRoom(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const room: StudyRoom = {
        id: `room-${Date.now()}`,
        name: newRoom.name,
        description: newRoom.description,
        subject: newRoom.subject,
        topic: newRoom.topic,
        maxParticipants: newRoom.maxParticipants,
        currentParticipants: 1,
        isPrivate: newRoom.isPrivate,
        password: newRoom.password || undefined,
        createdBy: 'Current User',
        createdAt: new Date(),
        lastActivity: new Date(),
        status: 'active',
        settings: newRoom.settings,
        participants: [],
        aiModerator: {
          isActive: true,
          settings: {
            autoDetectOffTopic: true,
            autoDetectInappropriateContent: true,
            autoSuggestBreaks: true,
            autoEncourageParticipation: true,
            autoSummarizeProgress: true,
            autoGenerateQuestions: true,
            autoDetectConfusion: true,
            autoSuggestResources: true
          },
          capabilities: {
            contentModeration: true,
            participationTracking: true,
            progressAnalysis: true,
            resourceRecommendation: true,
            questionGeneration: true,
            breakScheduling: true,
            conflictResolution: true,
            learningOptimization: true
          },
          currentActions: [],
          history: []
        },
        sharedResources: [],
        chatMessages: [],
        studySessions: [],
        analytics: {
          totalSessions: 0,
          totalParticipants: 1,
          averageSessionDuration: 0,
          totalMessages: 0,
          totalFilesShared: 0,
          participationRate: 0,
          engagementScore: 0,
          learningOutcomes: {},
          popularTopics: {},
          peakHours: {},
          aiInterventions: 0,
          conflictResolutions: 0,
          resourceDownloads: 0,
          satisfactionScore: 0
        }
      };
      
      setStudyRooms(prev => [room, ...prev]);
      setCurrentRoom(room);
      setActiveTab('rooms');
      setNewRoom({
        name: '',
        description: '',
        subject: 'Mathematics',
        topic: '',
        maxParticipants: 10,
        isPrivate: false,
        password: '',
        settings: {
          allowScreenShare: true,
          allowFileSharing: true,
          allowChat: true,
          allowVoice: true,
          allowVideo: true,
          recordSession: false,
          aiModeration: true,
          autoBreak: true,
          breakInterval: 25,
          maxBreakDuration: 5
        }
      });
      
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreatingRoom(false);
    }
  }, [newRoom]);

  const joinRoom = useCallback(async (roomId: string) => {
    setIsJoiningRoom(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const room = studyRooms.find(r => r.id === roomId);
      if (room) {
        setCurrentRoom(room);
        setActiveTab('rooms');
      }
      
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoiningRoom(false);
    }
  }, [studyRooms]);

  const sendMessage = useCallback(async () => {
    if (!chatMessage.trim() || !currentRoom) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'Current User',
      content: chatMessage,
      timestamp: new Date(),
      type: 'text',
      isEdited: false,
      isDeleted: false,
      reactions: [],
      replies: [],
      mentions: [],
      attachments: []
    };
    
    setCurrentRoom(prev => prev ? {
      ...prev,
      chatMessages: [...prev.chatMessages, message]
    } : null);
    
    setChatMessage('');
    
    // Simulate AI response
    if (Math.random() > 0.7) {
      setIsAITyping(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        author: 'AI Moderator',
        content: 'That\'s a great question! Let me help you work through this step by step.',
        timestamp: new Date(),
        type: 'ai',
        isEdited: false,
        isDeleted: false,
        reactions: [],
        replies: [],
        mentions: [],
        attachments: []
      };
      
      setCurrentRoom(prev => prev ? {
        ...prev,
        chatMessages: [...prev.chatMessages, aiResponse]
      } : null);
      
      setIsAITyping(false);
    }
  }, [chatMessage, currentRoom]);

  const toggleScreenShare = useCallback(() => {
    setIsScreenSharing(!isScreenSharing);
  }, [isScreenSharing]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    setIsVideoOn(!isVideoOn);
  }, [isVideoOn]);

  const filteredRooms = studyRooms.filter(room => 
    (searchQuery === '' || room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterSubject === 'all' || room.subject === filterSubject) &&
    (filterStatus === 'all' || room.status === filterStatus)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'ended': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'moderator': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'participant': return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Collaborative Study Rooms
          </h1>
          <p className="text-gray-600">Study together with AI-powered moderation and real-time collaboration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'rooms', label: 'Study Rooms', icon: <Users className="h-4 w-4" /> },
          { id: 'create', label: 'Create Room', icon: <Plus className="h-4 w-4" /> },
          { id: 'join', label: 'Join Room', icon: <Users className="h-4 w-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Study Rooms List */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search study rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Language">Language</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <p className="text-gray-600 text-sm">{room.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(room.status)}`}>
                    {room.status}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{room.subject} - {room.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{room.currentParticipants}/{room.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Last activity: {room.lastActivity.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Brain className="h-4 w-4" />
                    <span>AI Moderation: {room.settings.aiModeration ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Created by {room.createdBy}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" onClick={() => joinRoom(room.id)}>
                      <Users className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Room */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-purple-600" />
            Create New Study Room
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room Name</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter room name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-20"
                  placeholder="Describe what you'll be studying"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={newRoom.subject}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Language">Language</option>
                    <option value="History">History</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <input
                    type="text"
                    value={newRoom.topic}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Calculus, Biology"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Participants</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={newRoom.maxParticipants}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.isPrivate}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  />
                  <span className="text-sm">Make room private</span>
                </label>
                
                {newRoom.isPrivate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={newRoom.password}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter room password"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Room Settings</h4>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.allowScreenShare}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, allowScreenShare: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Allow screen sharing</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.allowFileSharing}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, allowFileSharing: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Allow file sharing</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.allowChat}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, allowChat: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Allow chat</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.allowVoice}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, allowVoice: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Allow voice</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.allowVideo}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, allowVideo: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Allow video</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.recordSession}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, recordSession: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Record session</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.aiModeration}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, aiModeration: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">AI moderation</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.settings.autoBreak}
                    onChange={(e) => setNewRoom(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, autoBreak: e.target.checked }
                    }))}
                  />
                  <span className="text-sm">Auto break reminders</span>
                </label>
              </div>
              
              {newRoom.settings.autoBreak && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Break Interval (min)</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={newRoom.settings.breakInterval}
                      onChange={(e) => setNewRoom(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, breakInterval: parseInt(e.target.value) }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Break (min)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={newRoom.settings.maxBreakDuration}
                      onChange={(e) => setNewRoom(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, maxBreakDuration: parseInt(e.target.value) }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
              
              <Button
                onClick={createRoom}
                disabled={isCreatingRoom || !newRoom.name.trim()}
                className="w-full"
              >
                {isCreatingRoom ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room */}
      {activeTab === 'join' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Join Study Room
          </h3>
          
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter room code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password (if required)</label>
              <input
                type="password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter password"
              />
            </div>
            
            <Button
              onClick={() => joinRoom(joinCode)}
              disabled={isJoiningRoom || !joinCode.trim()}
              className="w-full"
            >
              {isJoiningRoom ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Join Room
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Current Room View */}
      {currentRoom && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{currentRoom.name}</h2>
              <p className="text-gray-600">{currentRoom.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="h-4 w-4 mr-2" />
                Participants ({currentRoom.currentParticipants})
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResources(!showResources)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
          
          {/* Video/Audio Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "outline"}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant={isVideoOn ? "default" : "outline"}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleScreenShare}
              variant={isScreenSharing ? "default" : "outline"}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
          
          {/* AI Moderator */}
          {showAI && currentRoom.aiModerator.isActive && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800">AI Moderator</span>
              </div>
              <div className="space-y-2">
                {currentRoom.aiModerator.currentActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      action.severity === 'high' ? 'bg-red-500' : 
                      action.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm text-purple-700">{action.message}</p>
                      <p className="text-xs text-purple-500">
                        {action.timestamp.toLocaleTimeString()} • Confidence: {Math.round(action.aiConfidence * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat */}
          {showChat && (
            <div className="border rounded-lg h-96 flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium">Chat</h3>
              </div>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                {currentRoom.chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.author === 'AI Moderator' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.author === 'AI Moderator' 
                        ? 'bg-purple-100 text-purple-800' 
                        : message.author === 'Current User'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="text-xs font-medium mb-1">{message.author}</div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isAITyping && (
                  <div className="flex justify-start">
                    <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
                      <div className="text-xs font-medium mb-1">AI Moderator</div>
                      <div className="text-sm">Typing...</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type a message..."
                  />
                  <Button onClick={sendMessage} disabled={!chatMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && studyRooms.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{studyRooms.length}</div>
              <div className="text-gray-600">Total Rooms</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {studyRooms.reduce((sum, room) => sum + room.currentParticipants, 0)}
              </div>
              <div className="text-gray-600">Active Participants</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {studyRooms.reduce((sum, room) => sum + room.analytics.totalMessages, 0)}
              </div>
              <div className="text-gray-600">Total Messages</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {studyRooms.reduce((sum, room) => sum + room.analytics.aiInterventions, 0)}
              </div>
              <div className="text-gray-600">AI Interventions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}