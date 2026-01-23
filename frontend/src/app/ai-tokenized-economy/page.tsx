'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Shield, 
  Gift, 
  TrendingUp, 
  Users, 
  Award,
  Zap,
  Globe,
  DollarSign,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import LearnToEarnModel from '@/components/ai-tokenized-economy/LearnToEarnModel';
import AICredentialBlockchain from '@/components/ai-tokenized-economy/AICredentialBlockchain';
import GlobalScholarshipPool from '@/components/ai-tokenized-economy/GlobalScholarshipPool';

interface TokenizedEconomyStats {
  totalTokensInCirculation: number;
  activeTokenHolders: number;
  credentialsIssued: number;
  scholarshipsDistributed: number;
  averageTokenBalance: number;
  transactionVolume: number;
  blockchainVerified: number;
  smartContractsDeployed: number;
}

const AITokenizedEconomyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<TokenizedEconomyStats>({
    totalTokensInCirculation: 0,
    activeTokenHolders: 0,
    credentialsIssued: 0,
    scholarshipsDistributed: 0,
    averageTokenBalance: 0,
    transactionVolume: 0,
    blockchainVerified: 0,
    smartContractsDeployed: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Mock data - in real implementation, this would come from API
    setStats({
      totalTokensInCirculation: 5000000,
      activeTokenHolders: 15420,
      credentialsIssued: 8945,
      scholarshipsDistributed: 1250,
      averageTokenBalance: 324.5,
      transactionVolume: 250000,
      blockchainVerified: 8945,
      smartContractsDeployed: 12
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">AI Tokenized Learning Economy</h1>
        <p className="text-xl text-blue-100 mb-6">
          Turn learning progress into digital value through Web3 tokens, blockchain credentials, and AI-distributed scholarships
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Coins className="w-5 h-5" />
            <span className="font-medium">Learn-to-Earn</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Blockchain Credentials</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Gift className="w-5 h-5" />
            <span className="font-medium">AI Scholarships</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold">{stats.totalTokensInCirculation.toLocaleString()}</p>
            </div>
            <Coins className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Holders</p>
              <p className="text-2xl font-bold">{stats.activeTokenHolders.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credentials Issued</p>
              <p className="text-2xl font-bold">{stats.credentialsIssued.toLocaleString()}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scholarships</p>
              <p className="text-2xl font-bold">{stats.scholarshipsDistributed.toLocaleString()}</p>
            </div>
            <Gift className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Learn-to-Earn Model</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Earn OMNI tokens by completing learning milestones, achieving goals, and participating in the community.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Milestone-based rewards</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Multiple token types</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Real-time tracking</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">AI Credential Blockchain</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Immutable, blockchain-verified credentials for skill mastery and achievements with AI-powered verification.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Blockchain verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>AI assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>NFT credentials</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold">Global Scholarship Pool</h3>
          </div>
          <p className="text-gray-600 mb-4">
            AI-distributed micro-scholarships based on verified progress, merit, and community needs.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>AI-optimized distribution</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Multiple pool types</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Smart contracts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Coins className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Earned 50 OMNI tokens</p>
                <p className="text-sm text-gray-500">Completed "React Fundamentals" lesson</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-purple-600" />
              <div>
                <p className="font-medium">New credential issued</p>
                <p className="text-sm text-gray-500">JavaScript Expert Level</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Gift className="w-4 h-4 text-orange-600" />
              <div>
                <p className="font-medium">Scholarship received</p>
                <p className="text-sm text-gray-500">$500 from AI Learning Excellence Fund</p>
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
      case 'learn-to-earn':
        return <LearnToEarnModel />;
      case 'credentials':
        return <AICredentialBlockchain />;
      case 'scholarships':
        return <GlobalScholarshipPool />;
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
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'learn-to-earn', label: 'Learn-to-Earn', icon: Coins },
            { id: 'credentials', label: 'Credentials', icon: Shield },
            { id: 'scholarships', label: 'Scholarships', icon: Gift }
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

export default AITokenizedEconomyPage;
