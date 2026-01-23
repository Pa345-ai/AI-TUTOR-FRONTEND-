'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  Scale, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Users,
  Globe,
  Zap,
  Settings,
  FileText,
  Brain,
  Target
} from 'lucide-react';
import PrivacyPreservingAI from '@/components/ethical-intelligence/PrivacyPreservingAI';
import TransparentAIReasoning from '@/components/ethical-intelligence/TransparentAIReasoning';
import AIFairnessEngine from '@/components/ethical-intelligence/AIFairnessEngine';

interface EthicalIntelligenceStats {
  privacyScore: number;
  transparencyScore: number;
  fairnessScore: number;
  totalConsentRecords: number;
  activeBiasDetections: number;
  reasoningReportsGenerated: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant' | 'needs_review';
  lastAuditDate: string;
}

const EthicalIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<EthicalIntelligenceStats>({
    privacyScore: 0,
    transparencyScore: 0,
    fairnessScore: 0,
    totalConsentRecords: 0,
    activeBiasDetections: 0,
    reasoningReportsGenerated: 0,
    complianceStatus: 'needs_review',
    lastAuditDate: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Mock data - in real implementation, this would come from API
    setStats({
      privacyScore: 87.5,
      transparencyScore: 92.5,
      fairnessScore: 89.0,
      totalConsentRecords: 15,
      activeBiasDetections: 3,
      reasoningReportsGenerated: 1247,
      complianceStatus: 'compliant',
      lastAuditDate: '2024-01-15T10:30:00Z'
    });
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partially_compliant': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      case 'needs_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Ethical Intelligence + Privacy Core</h1>
        <p className="text-xl text-blue-100 mb-6">
          Required for global adoption - ensuring privacy, transparency, and fairness in AI systems
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Zero-Knowledge Learning</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Transparent AI Reasoning</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Scale className="w-5 h-5" />
            <span className="font-medium">AI Fairness Engine</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Privacy Score</p>
              <p className="text-2xl font-bold">{stats.privacyScore}%</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transparency Score</p>
              <p className="text-2xl font-bold">{stats.transparencyScore}%</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fairness Score</p>
              <p className="text-2xl font-bold">{stats.fairnessScore}%</p>
            </div>
            <Scale className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Status</p>
              <p className="text-2xl font-bold">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(stats.complianceStatus)}`}>
                  {stats.complianceStatus.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Privacy-Preserving AI</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Zero-knowledge learning that keeps personal data private while training global models.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Federated Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Differential Privacy</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Homomorphic Encryption</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Transparent AI Reasoning</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Students and parents can see exactly why AI chose an answer or provided feedback.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Step-by-step reasoning</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Confidence scores</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Bias detection</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">AI Fairness Engine</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Ensures equal outcomes across gender, ethnicity, and language with continuous monitoring.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Demographic parity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Equalized odds</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Bias mitigation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Ethical AI Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Privacy audit completed</p>
                <p className="text-sm text-gray-500">Score: 87.5% - Excellent</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-green-600" />
              <div>
                <p className="font-medium">Transparency report generated</p>
                <p className="text-sm text-gray-500">92.5% transparency score</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Scale className="w-4 h-4 text-purple-600" />
              <div>
                <p className="font-medium">Bias detection alert</p>
                <p className="text-sm text-gray-500">Medium severity - ethnicity bias</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'privacy':
        return <PrivacyPreservingAI />;
      case 'transparency':
        return <TransparentAIReasoning />;
      case 'fairness':
        return <AIFairnessEngine />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'privacy', label: 'Privacy-Preserving AI', icon: Shield },
            { id: 'transparency', label: 'Transparent Reasoning', icon: Eye },
            { id: 'fairness', label: 'AI Fairness Engine', icon: Scale }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EthicalIntelligencePage;
