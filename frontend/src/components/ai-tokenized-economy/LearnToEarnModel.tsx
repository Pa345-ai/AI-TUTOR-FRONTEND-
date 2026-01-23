'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Trophy, 
  Target, 
  TrendingUp, 
  Gift, 
  Star,
  Clock,
  CheckCircle,
  Zap,
  Award
} from 'lucide-react';

interface LearnToEarnModelProps {
  className?: string;
}

interface TokenBalance {
  omni: number;
  skill: number;
  achievement: number;
  participation: number;
}

interface LearningMilestone {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tokenReward: number;
  skillPoints: number;
  completed: boolean;
  completedAt?: string;
  progress: number;
}

interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward';
  amount: number;
  tokenType: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

const LearnToEarnModel: React.FC<LearnToEarnModelProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    omni: 2847.5,
    skill: 1250.0,
    achievement: 890.0,
    participation: 2100.0
  });
  const [milestones, setMilestones] = useState<LearningMilestone[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<LearningMilestone | null>(null);

  useEffect(() => {
    loadMilestones();
    loadTransactions();
  }, []);

  const loadMilestones = () => {
    const mockMilestones: LearningMilestone[] = [
      {
        id: '1',
        name: 'Complete First Lesson',
        description: 'Finish your first interactive lesson',
        difficulty: 'easy',
        tokenReward: 50,
        skillPoints: 10,
        completed: true,
        completedAt: '2024-01-15T10:30:00Z',
        progress: 100
      },
      {
        id: '2',
        name: 'Perfect Quiz Score',
        description: 'Achieve 100% on any quiz',
        difficulty: 'medium',
        tokenReward: 100,
        skillPoints: 25,
        completed: true,
        completedAt: '2024-01-16T14:20:00Z',
        progress: 100
      },
      {
        id: '3',
        name: '7-Day Learning Streak',
        description: 'Learn for 7 consecutive days',
        difficulty: 'medium',
        tokenReward: 200,
        skillPoints: 50,
        completed: false,
        progress: 85
      },
      {
        id: '4',
        name: 'Master a Skill',
        description: 'Reach expert level in any skill',
        difficulty: 'hard',
        tokenReward: 500,
        skillPoints: 100,
        completed: false,
        progress: 60
      },
      {
        id: '5',
        name: 'Help a Peer',
        description: 'Successfully help another learner',
        difficulty: 'easy',
        tokenReward: 75,
        skillPoints: 15,
        completed: false,
        progress: 0
      },
      {
        id: '6',
        name: 'Complete Project',
        description: 'Submit a capstone project',
        difficulty: 'expert',
        tokenReward: 1000,
        skillPoints: 200,
        completed: false,
        progress: 30
      }
    ];
    setMilestones(mockMilestones);
  };

  const loadTransactions = () => {
    const mockTransactions: TokenTransaction[] = [
      {
        id: '1',
        type: 'earn',
        amount: 50,
        tokenType: 'OMNI',
        description: 'Completed: Complete First Lesson',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'confirmed'
      },
      {
        id: '2',
        type: 'earn',
        amount: 100,
        tokenType: 'OMNI',
        description: 'Perfect Quiz Score Achievement',
        timestamp: '2024-01-16T14:20:00Z',
        status: 'confirmed'
      },
      {
        id: '3',
        type: 'earn',
        amount: 25,
        tokenType: 'SKILL',
        description: 'Skill Points Earned',
        timestamp: '2024-01-16T15:45:00Z',
        status: 'confirmed'
      },
      {
        id: '4',
        type: 'spend',
        amount: 200,
        tokenType: 'OMNI',
        description: 'Premium Course Access',
        timestamp: '2024-01-17T09:15:00Z',
        status: 'confirmed'
      },
      {
        id: '5',
        type: 'earn',
        amount: 150,
        tokenType: 'ACHIEVEMENT',
        description: 'Learning Streak Bonus',
        timestamp: '2024-01-18T08:00:00Z',
        status: 'pending'
      }
    ];
    setTransactions(mockTransactions);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'spend': return <Target className="w-4 h-4 text-red-600" />;
      case 'transfer': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'reward': return <Gift className="w-4 h-4 text-purple-600" />;
      default: return <Coins className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleClaimMilestone = (milestone: LearningMilestone) => {
    setSelectedMilestone(milestone);
    setShowClaimModal(true);
  };

  const claimMilestone = () => {
    if (selectedMilestone) {
      // Update milestone as completed
      setMilestones(prev => prev.map(m => 
        m.id === selectedMilestone.id 
          ? { ...m, completed: true, completedAt: new Date().toISOString(), progress: 100 }
          : m
      ));
      
      // Add tokens to balance
      setTokenBalance(prev => ({
        ...prev,
        omni: prev.omni + selectedMilestone.tokenReward
      }));
      
      // Add transaction
      const newTransaction: TokenTransaction = {
        id: Date.now().toString(),
        type: 'earn',
        amount: selectedMilestone.tokenReward,
        tokenType: 'OMNI',
        description: `Completed: ${selectedMilestone.name}`,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
    setShowClaimModal(false);
    setSelectedMilestone(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Token Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">OMNI Tokens</p>
              <p className="text-2xl font-bold">{tokenBalance.omni.toLocaleString()}</p>
            </div>
            <Coins className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Skill Tokens</p>
              <p className="text-2xl font-bold">{tokenBalance.skill.toLocaleString()}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Achievement Tokens</p>
              <p className="text-2xl font-bold">{tokenBalance.achievement.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Participation Tokens</p>
              <p className="text-2xl font-bold">{tokenBalance.participation.toLocaleString()}</p>
            </div>
            <Star className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones Completed</p>
              <p className="text-xl font-semibold">{milestones.filter(m => m.completed).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-xl font-semibold">{(tokenBalance.omni + tokenBalance.skill + tokenBalance.achievement + tokenBalance.participation).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl font-semibold">5 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} {transaction.tokenType}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold">{milestone.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(milestone.difficulty)}`}>
                  {milestone.difficulty}
                </span>
                {milestone.completed && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{milestone.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4" />
                  <span>{milestone.tokenReward} OMNI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{milestone.skillPoints} Skill Points</span>
                </div>
              </div>
              
              {!milestone.completed && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="ml-4">
              {milestone.completed ? (
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">Completed!</p>
                  <p className="text-xs text-gray-500">
                    {milestone.completedAt && new Date(milestone.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : milestone.progress === 100 ? (
                <button
                  onClick={() => handleClaimMilestone(milestone)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Claim Reward
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  In Progress
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTransactionIcon(transaction.type)}
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} {transaction.tokenType}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn-to-Earn Model</h1>
          <p className="text-gray-600">
            Earn tokens and rewards by completing learning milestones and achieving goals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'milestones', label: 'Milestones' },
            { id: 'transactions', label: 'Transactions' }
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
        {activeTab === 'milestones' && renderMilestones()}
        {activeTab === 'transactions' && renderTransactions()}

        {/* Claim Modal */}
        {showClaimModal && selectedMilestone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Claim Milestone Reward</h3>
              <p className="text-gray-600 mb-4">
                You've completed "{selectedMilestone.name}"! Claim your reward:
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">OMNI Tokens:</span>
                  <span className="text-xl font-bold text-blue-600">+{selectedMilestone.tokenReward}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium">Skill Points:</span>
                  <span className="text-xl font-bold text-green-600">+{selectedMilestone.skillPoints}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={claimMilestone}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Claim Reward
                </button>
                <button
                  onClick={() => setShowClaimModal(false)}
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

export default LearnToEarnModel;
