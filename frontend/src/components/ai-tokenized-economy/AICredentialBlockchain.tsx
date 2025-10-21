'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Eye,
  Download,
  Share2,
  Lock,
  Globe,
  Zap,
  Star,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface AICredentialBlockchainProps {
  className?: string;
}

interface AICredential {
  id: string;
  credentialType: string;
  skillName: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  verificationMethod: string;
  verificationScore: number;
  credentialHash: string;
  blockchainNetwork: string;
  contractAddress: string;
  tokenId?: number;
  issuedAt: string;
  expiresAt?: string;
  isRevoked: boolean;
  metadata: any;
}

interface CredentialStats {
  totalCredentials: number;
  verifiedSkills: number;
  averageScore: number;
  blockchainVerified: number;
  recentIssued: number;
}

const AICredentialBlockchain: React.FC<AICredentialBlockchainProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [credentials, setCredentials] = useState<AICredential[]>([]);
  const [stats, setStats] = useState<CredentialStats>({
    totalCredentials: 0,
    verifiedSkills: 0,
    averageScore: 0,
    blockchainVerified: 0,
    recentIssued: 0
  });
  const [selectedCredential, setSelectedCredential] = useState<AICredential | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadCredentials();
    loadStats();
  }, []);

  const loadCredentials = () => {
    const mockCredentials: AICredential[] = [
      {
        id: '1',
        credentialType: 'skill_mastery',
        skillName: 'React Development',
        skillLevel: 'expert',
        verificationMethod: 'ai_assessment',
        verificationScore: 95.5,
        credentialHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        blockchainNetwork: 'polygon',
        contractAddress: '0x1234567890123456789012345678901234567890',
        tokenId: 1001,
        issuedAt: '2024-01-15T10:30:00Z',
        expiresAt: '2025-01-15T10:30:00Z',
        isRevoked: false,
        metadata: {
          projectCount: 12,
          codeQuality: 98,
          peerReviews: 8
        }
      },
      {
        id: '2',
        credentialType: 'course_completion',
        skillName: 'Machine Learning Fundamentals',
        skillLevel: 'advanced',
        verificationMethod: 'exam_score',
        verificationScore: 88.0,
        credentialHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
        blockchainNetwork: 'polygon',
        contractAddress: '0x2345678901234567890123456789012345678901',
        tokenId: 1002,
        issuedAt: '2024-01-10T14:20:00Z',
        expiresAt: '2026-01-10T14:20:00Z',
        isRevoked: false,
        metadata: {
          courseDuration: '8 weeks',
          finalExamScore: 88,
          assignmentsCompleted: 12
        }
      },
      {
        id: '3',
        credentialType: 'project_certification',
        skillName: 'Full-Stack Web Development',
        skillLevel: 'master',
        verificationMethod: 'project_evaluation',
        verificationScore: 92.5,
        credentialHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
        blockchainNetwork: 'polygon',
        contractAddress: '0x3456789012345678901234567890123456789012',
        tokenId: 1003,
        issuedAt: '2024-01-05T09:15:00Z',
        expiresAt: '2025-01-05T09:15:00Z',
        isRevoked: false,
        metadata: {
          projectType: 'E-commerce Platform',
          technologies: ['React', 'Node.js', 'PostgreSQL'],
          deploymentUrl: 'https://example.com'
        }
      },
      {
        id: '4',
        credentialType: 'ai_verified_skill',
        skillName: 'Data Analysis with Python',
        skillLevel: 'intermediate',
        verificationMethod: 'ai_assessment',
        verificationScore: 85.0,
        credentialHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        blockchainNetwork: 'polygon',
        contractAddress: '0x4567890123456789012345678901234567890123',
        tokenId: 1004,
        issuedAt: '2024-01-20T16:45:00Z',
        expiresAt: '2025-01-20T16:45:00Z',
        isRevoked: false,
        metadata: {
          datasetsAnalyzed: 5,
          algorithmsUsed: ['Linear Regression', 'Random Forest'],
          accuracy: 87.5
        }
      },
      {
        id: '5',
        credentialType: 'skill_mastery',
        skillName: 'Cloud Architecture',
        skillLevel: 'advanced',
        verificationMethod: 'peer_review',
        verificationScore: 90.0,
        credentialHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        blockchainNetwork: 'polygon',
        contractAddress: '0x5678901234567890123456789012345678901234',
        tokenId: 1005,
        issuedAt: '2024-01-12T11:30:00Z',
        expiresAt: '2025-01-12T11:30:00Z',
        isRevoked: false,
        metadata: {
          cloudProviders: ['AWS', 'Azure'],
          certifications: ['AWS Solutions Architect'],
          projectsDeployed: 3
        }
      }
    ];
    setCredentials(mockCredentials);
  };

  const loadStats = () => {
    setStats({
      totalCredentials: 5,
      verifiedSkills: 8,
      averageScore: 90.2,
      blockchainVerified: 5,
      recentIssued: 3
    });
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-blue-600 bg-blue-100';
      case 'advanced': return 'text-purple-600 bg-purple-100';
      case 'expert': return 'text-orange-600 bg-orange-100';
      case 'master': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationMethodIcon = (method: string) => {
    switch (method) {
      case 'ai_assessment': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'peer_review': return <Users className="w-4 h-4 text-green-600" />;
      case 'project_evaluation': return <Award className="w-4 h-4 text-purple-600" />;
      case 'exam_score': return <CheckCircle className="w-4 h-4 text-orange-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const viewOnBlockchain = (hash: string, network: string) => {
    const explorerUrl = network === 'polygon' 
      ? `https://polygonscan.com/tx/${hash}`
      : `https://etherscan.io/tx/${hash}`;
    window.open(explorerUrl, '_blank');
  };

  const handleViewCredential = (credential: AICredential) => {
    setSelectedCredential(credential);
    setShowDetailModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Credentials</p>
              <p className="text-2xl font-bold">{stats.totalCredentials}</p>
            </div>
            <Award className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Verified Skills</p>
              <p className="text-2xl font-bold">{stats.verifiedSkills}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Average Score</p>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Blockchain Verified</p>
              <p className="text-2xl font-bold">{stats.blockchainVerified}</p>
            </div>
            <Shield className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Recent Issued</p>
              <p className="text-2xl font-bold">{stats.recentIssued}</p>
            </div>
            <Calendar className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Recent Credentials */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Credentials</h3>
        <div className="space-y-3">
          {credentials.slice(0, 3).map((credential) => (
            <div key={credential.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getVerificationMethodIcon(credential.verificationMethod)}
                <div>
                  <p className="font-medium">{credential.skillName}</p>
                  <p className="text-sm text-gray-500">
                    {credential.credentialType.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(credential.skillLevel)}`}>
                  {credential.skillLevel}
                </span>
                <span className={`font-semibold ${getScoreColor(credential.verificationScore)}`}>
                  {credential.verificationScore}%
                </span>
                <button
                  onClick={() => handleViewCredential(credential)}
                  className="p-1 text-gray-500 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <div key={credential.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold">{credential.skillName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(credential.skillLevel)}`}>
                  {credential.skillLevel}
                </span>
                {!credential.isRevoked && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  {getVerificationMethodIcon(credential.verificationMethod)}
                  <span>{credential.verificationMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span className={getScoreColor(credential.verificationScore)}>
                    {credential.verificationScore}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{credential.blockchainNetwork}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Issued: {new Date(credential.issuedAt).toLocaleDateString()}</span>
                {credential.expiresAt && (
                  <span>Expires: {new Date(credential.expiresAt).toLocaleDateString()}</span>
                )}
                <span>Token ID: {credential.tokenId}</span>
              </div>
            </div>
            
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => handleViewCredential(credential)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(credential.credentialHash)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => viewOnBlockchain(credential.credentialHash, credential.blockchainNetwork)}
                className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBlockchain = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Blockchain Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Network Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Polygon Network</span>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Smart Contracts</span>
                <span className="text-sm text-green-600 font-medium">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gas Fees</span>
                <span className="text-sm text-blue-600 font-medium">Low</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Verification Stats</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Verified</span>
                <span className="text-sm font-medium">{stats.blockchainVerified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Immutable Records</span>
                <span className="text-sm font-medium">{stats.totalCredentials}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hash Integrity</span>
                <span className="text-sm text-green-600 font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Smart Contract Addresses</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Credential Verification Contract</p>
              <p className="text-sm text-gray-500">0x2345678901234567890123456789012345678901</p>
            </div>
            <button
              onClick={() => copyToClipboard('0x2345678901234567890123456789012345678901')}
              className="p-1 text-gray-500 hover:text-blue-600"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Token Distribution Contract</p>
              <p className="text-sm text-gray-500">0x1234567890123456789012345678901234567890</p>
            </div>
            <button
              onClick={() => copyToClipboard('0x1234567890123456789012345678901234567890')}
              className="p-1 text-gray-500 hover:text-blue-600"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Credential Blockchain</h1>
          <p className="text-gray-600">
            Immutable, blockchain-verified credentials for skill mastery and achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'credentials', label: 'My Credentials' },
            { id: 'blockchain', label: 'Blockchain' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'credentials' && renderCredentials()}
        {activeTab === 'blockchain' && renderBlockchain()}

        {/* Credential Detail Modal */}
        {showDetailModal && selectedCredential && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Credential Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Skill Name</label>
                    <p className="text-lg font-semibold">{selectedCredential.skillName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Level</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(selectedCredential.skillLevel)}`}>
                      {selectedCredential.skillLevel}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification Score</label>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedCredential.verificationScore)}`}>
                      {selectedCredential.verificationScore}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification Method</label>
                    <p className="text-lg">{selectedCredential.verificationMethod.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Credential Hash</label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                    <code className="text-xs flex-1 break-all">{selectedCredential.credentialHash}</code>
                    <button
                      onClick={() => copyToClipboard(selectedCredential.credentialHash)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issued Date</label>
                    <p>{new Date(selectedCredential.issuedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expires</label>
                    <p>{selectedCredential.expiresAt ? new Date(selectedCredential.expiresAt).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => viewOnBlockchain(selectedCredential.credentialHash, selectedCredential.blockchainNetwork)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Blockchain</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedCredential.credentialHash)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Hash</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICredentialBlockchain;
