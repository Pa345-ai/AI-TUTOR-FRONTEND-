'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  Star,
  Target,
  Zap,
  Globe,
  DollarSign,
  Calendar,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface GlobalScholarshipPoolProps {
  className?: string;
}

interface ScholarshipPool {
  id: string;
  poolName: string;
  poolType: 'micro_scholarship' | 'merit_based' | 'need_based' | 'ai_recommended' | 'community_voted';
  totalAmount: number;
  availableAmount: number;
  tokenType: string;
  distributionAlgorithm: string;
  minEligibilityScore: number;
  maxRecipients: number;
  distributionFrequency: string;
  lastDistribution?: string;
  nextDistribution?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  metadata: any;
}

interface ScholarshipDistribution {
  id: string;
  poolId: string;
  recipientId: string;
  amount: number;
  distributionReason: string;
  aiRecommendationScore?: number;
  meritScore?: number;
  needScore?: number;
  distributedAt: string;
  transactionHash?: string;
}

interface PoolStats {
  totalPools: number;
  totalAmount: number;
  availableAmount: number;
  totalDistributed: number;
  activeRecipients: number;
  averageDistribution: number;
}

const GlobalScholarshipPool: React.FC<GlobalScholarshipPoolProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pools, setPools] = useState<ScholarshipPool[]>([]);
  const [distributions, setDistributions] = useState<ScholarshipDistribution[]>([]);
  const [stats, setStats] = useState<PoolStats>({
    totalPools: 0,
    totalAmount: 0,
    availableAmount: 0,
    totalDistributed: 0,
    activeRecipients: 0,
    averageDistribution: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<ScholarshipPool | null>(null);

  useEffect(() => {
    loadPools();
    loadDistributions();
    loadStats();
  }, []);

  const loadPools = () => {
    const mockPools: ScholarshipPool[] = [
      {
        id: '1',
        poolName: 'AI Learning Excellence Fund',
        poolType: 'merit_based',
        totalAmount: 1000000,
        availableAmount: 850000,
        tokenType: 'OMNI',
        distributionAlgorithm: 'ai_optimized',
        minEligibilityScore: 80,
        maxRecipients: 100,
        distributionFrequency: 'weekly',
        lastDistribution: '2024-01-15T10:00:00Z',
        nextDistribution: '2024-01-22T10:00:00Z',
        isActive: true,
        createdBy: 'OmniMind Foundation',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: {
          description: 'Supporting high-achieving learners in AI and machine learning',
          requirements: ['Minimum 80% average score', 'Active learning streak', 'Community contributions'],
          focus: 'AI/ML Education'
        }
      },
      {
        id: '2',
        poolName: 'Community Support Pool',
        poolType: 'need_based',
        totalAmount: 500000,
        availableAmount: 320000,
        tokenType: 'OMNI',
        distributionAlgorithm: 'ai_optimized',
        minEligibilityScore: 60,
        maxRecipients: 200,
        distributionFrequency: 'daily',
        lastDistribution: '2024-01-18T08:00:00Z',
        nextDistribution: '2024-01-19T08:00:00Z',
        isActive: true,
        createdBy: 'Community DAO',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: {
          description: 'Helping learners from underrepresented communities access quality education',
          requirements: ['Financial need verification', 'Learning commitment', 'Community engagement'],
          focus: 'Equity & Access'
        }
      },
      {
        id: '3',
        poolName: 'Innovation Challenge Fund',
        poolType: 'ai_recommended',
        totalAmount: 750000,
        availableAmount: 600000,
        tokenType: 'OMNI',
        distributionAlgorithm: 'ai_optimized',
        minEligibilityScore: 85,
        maxRecipients: 50,
        distributionFrequency: 'monthly',
        lastDistribution: '2024-01-01T12:00:00Z',
        nextDistribution: '2024-02-01T12:00:00Z',
        isActive: true,
        createdBy: 'Tech Innovation Hub',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: {
          description: 'Rewarding innovative projects and breakthrough learning achievements',
          requirements: ['Innovation project submission', 'AI recommendation score >85', 'Peer validation'],
          focus: 'Innovation & Creativity'
        }
      },
      {
        id: '4',
        poolName: 'Micro-Learning Grants',
        poolType: 'micro_scholarship',
        totalAmount: 100000,
        availableAmount: 75000,
        tokenType: 'OMNI',
        distributionAlgorithm: 'random_lottery',
        minEligibilityScore: 50,
        maxRecipients: 500,
        distributionFrequency: 'daily',
        lastDistribution: '2024-01-18T16:00:00Z',
        nextDistribution: '2024-01-19T16:00:00Z',
        isActive: true,
        createdBy: 'Learning Micro-Grants DAO',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: {
          description: 'Small grants for daily learning activities and micro-achievements',
          requirements: ['Daily learning activity', 'Minimum 50% completion rate', 'Community participation'],
          focus: 'Daily Learning'
        }
      },
      {
        id: '5',
        poolName: 'Community Voted Rewards',
        poolType: 'community_voted',
        totalAmount: 200000,
        availableAmount: 150000,
        tokenType: 'OMNI',
        distributionAlgorithm: 'community_consensus',
        minEligibilityScore: 70,
        maxRecipients: 25,
        distributionFrequency: 'weekly',
        lastDistribution: '2024-01-14T18:00:00Z',
        nextDistribution: '2024-01-21T18:00:00Z',
        isActive: true,
        createdBy: 'Community Governance',
        createdAt: '2024-01-01T00:00:00Z',
        metadata: {
          description: 'Community-selected recipients based on peer nominations and voting',
          requirements: ['Community nomination', 'Peer voting participation', 'Merit demonstration'],
          focus: 'Community Recognition'
        }
      }
    ];
    setPools(mockPools);
  };

  const loadDistributions = () => {
    const mockDistributions: ScholarshipDistribution[] = [
      {
        id: '1',
        poolId: '1',
        recipientId: 'user123',
        amount: 5000,
        distributionReason: 'Outstanding performance in AI fundamentals course',
        aiRecommendationScore: 95.5,
        meritScore: 92.0,
        distributedAt: '2024-01-15T10:00:00Z',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      },
      {
        id: '2',
        poolId: '2',
        recipientId: 'user456',
        amount: 2000,
        distributionReason: 'Financial need support for advanced learning',
        needScore: 88.0,
        distributedAt: '2024-01-18T08:00:00Z',
        transactionHash: '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef12'
      },
      {
        id: '3',
        poolId: '3',
        recipientId: 'user789',
        amount: 10000,
        distributionReason: 'Innovative machine learning project with real-world impact',
        aiRecommendationScore: 98.0,
        meritScore: 95.0,
        distributedAt: '2024-01-01T12:00:00Z',
        transactionHash: '0x3456789012cdef1234567890abcdef1234567890abcdef1234567890abcdef123'
      },
      {
        id: '4',
        poolId: '4',
        recipientId: 'user101',
        amount: 100,
        distributionReason: 'Daily learning streak achievement',
        distributedAt: '2024-01-18T16:00:00Z'
      },
      {
        id: '5',
        poolId: '5',
        recipientId: 'user202',
        amount: 8000,
        distributionReason: 'Community-nominated for exceptional peer support',
        meritScore: 90.0,
        distributedAt: '2024-01-14T18:00:00Z',
        transactionHash: '0x4567890123def1234567890abcdef1234567890abcdef1234567890abcdef1234'
      }
    ];
    setDistributions(mockDistributions);
  };

  const loadStats = () => {
    setStats({
      totalPools: 5,
      totalAmount: 2550000,
      availableAmount: 1995000,
      totalDistributed: 555000,
      activeRecipients: 875,
      averageDistribution: 1110
    });
  };

  const getPoolTypeColor = (type: string) => {
    switch (type) {
      case 'merit_based': return 'text-blue-600 bg-blue-100';
      case 'need_based': return 'text-green-600 bg-green-100';
      case 'ai_recommended': return 'text-purple-600 bg-purple-100';
      case 'micro_scholarship': return 'text-orange-600 bg-orange-100';
      case 'community_voted': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPoolTypeIcon = (type: string) => {
    switch (type) {
      case 'merit_based': return <Award className="w-4 h-4" />;
      case 'need_based': return <Users className="w-4 h-4" />;
      case 'ai_recommended': return <Zap className="w-4 h-4" />;
      case 'micro_scholarship': return <Gift className="w-4 h-4" />;
      case 'community_voted': return <Star className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.poolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || pool.poolType === filterType;
    return matchesSearch && matchesFilter && pool.isActive;
  });

  const handleApplyToPool = (pool: ScholarshipPool) => {
    setSelectedPool(pool);
    setShowApplyModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pools</p>
              <p className="text-2xl font-bold">{stats.totalPools}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Available Funds</p>
              <p className="text-2xl font-bold">${stats.availableAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Distributed</p>
              <p className="text-2xl font-bold">${stats.totalDistributed.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Recipients</p>
              <p className="text-2xl font-bold">{stats.activeRecipients}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Recent Distributions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Distributions</h3>
        <div className="space-y-3">
          {distributions.slice(0, 5).map((distribution) => (
            <div key={distribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Gift className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium">{distribution.distributionReason}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(distribution.distributedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  +${distribution.amount.toLocaleString()}
                </p>
                {distribution.transactionHash && (
                  <button
                    onClick={() => window.open(`https://polygonscan.com/tx/${distribution.transactionHash}`, '_blank')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View on Blockchain
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPools = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search scholarship pools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="merit_based">Merit-Based</option>
              <option value="need_based">Need-Based</option>
              <option value="ai_recommended">AI Recommended</option>
              <option value="micro_scholarship">Micro Scholarship</option>
              <option value="community_voted">Community Voted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPools.map((pool) => (
          <div key={pool.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getPoolTypeIcon(pool.poolType)}
                  <h3 className="text-lg font-semibold">{pool.poolName}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{pool.metadata.description}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPoolTypeColor(pool.poolType)}`}>
                  {pool.poolType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available Amount</span>
                <span className="font-semibold">${pool.availableAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Min Eligibility Score</span>
                <span className="font-semibold">{pool.minEligibilityScore}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max Recipients</span>
                <span className="font-semibold">{pool.maxRecipients}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Distribution</span>
                <span className="font-semibold">{pool.distributionFrequency}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <p>Next: {pool.nextDistribution ? new Date(pool.nextDistribution).toLocaleDateString() : 'TBD'}</p>
              </div>
              <button
                onClick={() => handleApplyToPool(pool)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDistributions = () => (
    <div className="space-y-4">
      {distributions.map((distribution) => (
        <div key={distribution.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">{distribution.distributionReason}</p>
                <p className="text-sm text-gray-500">
                  {new Date(distribution.distributedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">
                +${distribution.amount.toLocaleString()}
              </p>
              {distribution.transactionHash && (
                <button
                  onClick={() => window.open(`https://polygonscan.com/tx/${distribution.transactionHash}`, '_blank')}
                  className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View on Blockchain</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Scholarship Pool</h1>
          <p className="text-gray-600">
            AI-distributed micro-scholarships based on verified learning progress and achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'pools', label: 'Scholarship Pools' },
            { id: 'distributions', label: 'My Distributions' }
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
        {activeTab === 'pools' && renderPools()}
        {activeTab === 'distributions' && renderDistributions()}

        {/* Apply Modal */}
        {showApplyModal && selectedPool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Apply to {selectedPool.poolName}</h3>
              <p className="text-gray-600 mb-4">{selectedPool.metadata.description}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eligibility Score
                  </label>
                  <div className="text-lg font-semibold text-blue-600">
                    {Math.floor(Math.random() * 20) + 80}% (Estimated)
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Statement
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Explain why you should receive this scholarship..."
                  />
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedPool.metadata.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalScholarshipPool;
