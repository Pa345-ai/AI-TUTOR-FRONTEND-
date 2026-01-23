'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Zap,
  Database,
  Globe,
  Users,
  Clock,
  BarChart3,
  ShieldCheck,
  FileText,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface PrivacyPreservingAIProps {
  className?: string;
}

interface PrivacySettings {
  id: string;
  modelId: string;
  modelType: 'federated' | 'differential_privacy' | 'homomorphic' | 'secure_multiparty' | 'zero_knowledge';
  privacyLevel: 'minimal' | 'standard' | 'high' | 'maximum';
  dataAnonymizationMethod: string;
  encryptionType: string;
  localTrainingEnabled: boolean;
  federatedLearningEnabled: boolean;
  differentialPrivacyEpsilon: number;
  noiseLevel: number;
  dataRetentionDays: number;
  consentGiven: boolean;
  dataProcessingPurpose: string;
  thirdPartySharing: boolean;
  crossBorderTransfer: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConsentRecord {
  id: string;
  consentType: string;
  purpose: string;
  dataCategories: string[];
  processingMethods: string[];
  retentionPeriod: number;
  thirdPartySharing: boolean;
  thirdParties: string[];
  crossBorderTransfer: boolean;
  countries: string[];
  consentGiven: boolean;
  consentTimestamp: string;
  consentMethod: string;
  isActive: boolean;
}

interface AnonymizationLog {
  id: string;
  anonymizationMethod: string;
  privacyLevel: string;
  kAnonymityValue?: number;
  lDiversityValue?: number;
  tClosenessValue?: number;
  noiseAdded: number;
  informationLoss: number;
  utilityScore: number;
  anonymizedAt: string;
  expiresAt?: string;
}

const PrivacyPreservingAI: React.FC<PrivacyPreservingAIProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [anonymizationLogs, setAnonymizationLogs] = useState<AnonymizationLog[]>([]);
  const [privacyScore, setPrivacyScore] = useState(0);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedConsentType, setSelectedConsentType] = useState('');

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = () => {
    // Mock data - in real implementation, this would come from API
    const mockPrivacySettings: PrivacySettings[] = [
      {
        id: '1',
        modelId: 'omnimind-v1',
        modelType: 'federated',
        privacyLevel: 'high',
        dataAnonymizationMethod: 'differential_privacy',
        encryptionType: 'AES-256',
        localTrainingEnabled: true,
        federatedLearningEnabled: true,
        differentialPrivacyEpsilon: 0.5,
        noiseLevel: 0.1,
        dataRetentionDays: 30,
        consentGiven: true,
        dataProcessingPurpose: 'Personalized learning recommendations',
        thirdPartySharing: false,
        crossBorderTransfer: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        modelId: 'omnimind-v1',
        modelType: 'differential_privacy',
        privacyLevel: 'maximum',
        dataAnonymizationMethod: 'differential_privacy',
        encryptionType: 'homomorphic',
        localTrainingEnabled: true,
        federatedLearningEnabled: false,
        differentialPrivacyEpsilon: 0.1,
        noiseLevel: 0.05,
        dataRetentionDays: 7,
        consentGiven: true,
        dataProcessingPurpose: 'Learning analytics and progress tracking',
        thirdPartySharing: false,
        crossBorderTransfer: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T14:20:00Z'
      }
    ];

    const mockConsentRecords: ConsentRecord[] = [
      {
        id: '1',
        consentType: 'data_collection',
        purpose: 'Personalized learning experience',
        dataCategories: ['learning_progress', 'assessment_results', 'interaction_data'],
        processingMethods: ['federated_learning', 'differential_privacy'],
        retentionPeriod: 30,
        thirdPartySharing: false,
        thirdParties: [],
        crossBorderTransfer: false,
        countries: [],
        consentGiven: true,
        consentTimestamp: '2024-01-01T00:00:00Z',
        consentMethod: 'explicit',
        isActive: true
      },
      {
        id: '2',
        consentType: 'ai_training',
        purpose: 'Model improvement and personalization',
        dataCategories: ['learning_patterns', 'preferences', 'performance_data'],
        processingMethods: ['federated_learning', 'local_training'],
        retentionPeriod: 90,
        thirdPartySharing: false,
        thirdParties: [],
        crossBorderTransfer: false,
        countries: [],
        consentGiven: true,
        consentTimestamp: '2024-01-01T00:00:00Z',
        consentMethod: 'explicit',
        isActive: true
      },
      {
        id: '3',
        consentType: 'analytics',
        purpose: 'Usage analytics and system improvement',
        dataCategories: ['usage_statistics', 'performance_metrics', 'error_logs'],
        processingMethods: ['aggregated_analysis', 'anonymized_reporting'],
        retentionPeriod: 365,
        thirdPartySharing: true,
        thirdParties: ['Analytics Provider A', 'Research Institution B'],
        crossBorderTransfer: true,
        countries: ['United States', 'European Union'],
        consentGiven: false,
        consentTimestamp: '2024-01-01T00:00:00Z',
        consentMethod: 'opt_in',
        isActive: false
      }
    ];

    const mockAnonymizationLogs: AnonymizationLog[] = [
      {
        id: '1',
        anonymizationMethod: 'differential_privacy',
        privacyLevel: 'high',
        noiseAdded: 0.1,
        informationLoss: 5.2,
        utilityScore: 94.8,
        anonymizedAt: '2024-01-15T10:30:00Z',
        expiresAt: '2024-02-15T10:30:00Z'
      },
      {
        id: '2',
        anonymizationMethod: 'k_anonymity',
        privacyLevel: 'maximum',
        kAnonymityValue: 5,
        lDiversityValue: 3,
        tClosenessValue: 0.1,
        noiseAdded: 0.05,
        informationLoss: 8.7,
        utilityScore: 91.3,
        anonymizedAt: '2024-01-14T16:45:00Z',
        expiresAt: '2024-01-21T16:45:00Z'
      },
      {
        id: '3',
        anonymizationMethod: 'homomorphic_encryption',
        privacyLevel: 'maximum',
        noiseAdded: 0.02,
        informationLoss: 2.1,
        utilityScore: 97.9,
        anonymizedAt: '2024-01-13T09:15:00Z',
        expiresAt: '2024-01-20T09:15:00Z'
      }
    ];

    setPrivacySettings(mockPrivacySettings);
    setConsentRecords(mockConsentRecords);
    setAnonymizationLogs(mockAnonymizationLogs);
    setPrivacyScore(87.5); // Mock privacy score
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-red-600 bg-red-100';
      case 'standard': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      case 'maximum': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'federated': return <Users className="w-4 h-4" />;
      case 'differential_privacy': return <Shield className="w-4 h-4" />;
      case 'homomorphic': return <Lock className="w-4 h-4" />;
      case 'secure_multiparty': return <Globe className="w-4 h-4" />;
      case 'zero_knowledge': return <EyeOff className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getConsentStatusColor = (given: boolean, active: boolean) => {
    if (!active) return 'text-gray-600 bg-gray-100';
    return given ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const handleConsentToggle = (consentId: string, given: boolean) => {
    setConsentRecords(prev => prev.map(record => 
      record.id === consentId 
        ? { ...record, consentGiven: given, consentTimestamp: new Date().toISOString() }
        : record
    ));
  };

  const handleWithdrawConsent = (consentId: string) => {
    setConsentRecords(prev => prev.map(record => 
      record.id === consentId 
        ? { 
            ...record, 
            consentGiven: false, 
            isActive: false,
            withdrawalTimestamp: new Date().toISOString()
          }
        : record
    ));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Privacy Score Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Privacy Score</h3>
            <p className="text-green-100 mb-4">Your data protection level</p>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{privacyScore}%</div>
              <div className="flex-1">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: `${privacyScore}%` }}
                  />
                </div>
                <p className="text-sm text-green-100 mt-2">
                  {privacyScore >= 80 ? 'Excellent' : privacyScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
          <ShieldCheck className="w-16 h-16 text-green-200" />
        </div>
      </div>

      {/* Privacy Settings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Privacy Level</p>
              <p className="text-lg font-semibold">High</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Encryption</p>
              <p className="text-lg font-semibold">AES-256</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Federated Learning</p>
              <p className="text-lg font-semibold">Enabled</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Retention</p>
              <p className="text-lg font-semibold">30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Anonymization Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Data Anonymization</h3>
        <div className="space-y-3">
          {anonymizationLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium">{log.anonymizationMethod.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(log.anonymizedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {log.utilityScore}% utility
                </p>
                <p className="text-xs text-gray-500">
                  {log.informationLoss}% info loss
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {privacySettings.map((setting) => (
        <div key={setting.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {getModelTypeIcon(setting.modelType)}
                <h3 className="text-lg font-semibold">{setting.modelId}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrivacyLevelColor(setting.privacyLevel)}`}>
                  {setting.privacyLevel}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{setting.dataProcessingPurpose}</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Model Type</label>
              <p className="text-sm">{setting.modelType.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Encryption</label>
              <p className="text-sm">{setting.encryptionType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Privacy Budget</label>
              <p className="text-sm">ε = {setting.differentialPrivacyEpsilon}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Noise Level</label>
              <p className="text-sm">{setting.noiseLevel}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={setting.localTrainingEnabled}
                readOnly
                className="rounded"
              />
              <span className="text-sm">Local Training</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={setting.federatedLearningEnabled}
                readOnly
                className="rounded"
              />
              <span className="text-sm">Federated Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={setting.consentGiven}
                readOnly
                className="rounded"
              />
              <span className="text-sm">Consent Given</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderConsentManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Consent Management</h3>
        <button
          onClick={() => setShowConsentModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Consent
        </button>
      </div>
      
      {consentRecords.map((record) => (
        <div key={record.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold">{record.consentType.replace('_', ' ').toUpperCase()}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConsentStatusColor(record.consentGiven, record.isActive)}`}>
                  {record.isActive ? (record.consentGiven ? 'Consented' : 'Not Consented') : 'Withdrawn'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{record.purpose}</p>
            </div>
            <div className="flex space-x-2">
              {record.isActive && (
                <button
                  onClick={() => handleConsentToggle(record.id, !record.consentGiven)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    record.consentGiven
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {record.consentGiven ? 'Withdraw' : 'Give Consent'}
                </button>
              )}
              {record.consentGiven && record.isActive && (
                <button
                  onClick={() => handleWithdrawConsent(record.id)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Permanently Withdraw
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Data Categories</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {record.dataCategories.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {category.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Processing Methods</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {record.processingMethods.map((method, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {method.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Retention Period: {record.retentionPeriod} days</p>
            <p>Consent Method: {record.consentMethod.replace('_', ' ')}</p>
            <p>Given: {new Date(record.consentTimestamp).toLocaleString()}</p>
            {record.thirdPartySharing && (
              <p>Third Parties: {record.thirdParties.join(', ')}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnonymizationLogs = () => (
    <div className="space-y-4">
      {anonymizationLogs.map((log) => (
        <div key={log.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{log.anonymizationMethod.replace('_', ' ').toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {new Date(log.anonymizedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600">{log.utilityScore}%</p>
                  <p className="text-xs text-gray-500">Utility</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-orange-600">{log.informationLoss}%</p>
                  <p className="text-xs text-gray-500">Info Loss</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-600">{log.privacyLevel}</p>
                  <p className="text-xs text-gray-500">Privacy</p>
                </div>
              </div>
            </div>
          </div>
          
          {log.kAnonymityValue && (
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">K-Anonymity:</span>
                <span className="ml-2 font-medium">{log.kAnonymityValue}</span>
              </div>
              {log.lDiversityValue && (
                <div>
                  <span className="text-gray-600">L-Diversity:</span>
                  <span className="ml-2 font-medium">{log.lDiversityValue}</span>
                </div>
              )}
              {log.tClosenessValue && (
                <div>
                  <span className="text-gray-600">T-Closeness:</span>
                  <span className="ml-2 font-medium">{log.tClosenessValue}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy-Preserving AI</h1>
          <p className="text-gray-600">
            Zero-knowledge learning that keeps your personal data private while training global models
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'settings', label: 'Privacy Settings' },
            { id: 'consent', label: 'Consent Management' },
            { id: 'logs', label: 'Anonymization Logs' }
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
        {activeTab === 'settings' && renderPrivacySettings()}
        {activeTab === 'consent' && renderConsentManagement()}
        {activeTab === 'logs' && renderAnonymizationLogs()}

        {/* Consent Modal */}
        {showConsentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Consent</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consent Type
                  </label>
                  <select
                    value={selectedConsentType}
                    onChange={(e) => setSelectedConsentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select consent type</option>
                    <option value="data_collection">Data Collection</option>
                    <option value="data_processing">Data Processing</option>
                    <option value="data_sharing">Data Sharing</option>
                    <option value="ai_training">AI Training</option>
                    <option value="analytics">Analytics</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Privacy Notice</h4>
                  <p className="text-sm text-gray-600">
                    By giving consent, you agree to the processing of your data according to our privacy policy. 
                    You can withdraw consent at any time.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Consent
                </button>
                <button
                  onClick={() => setShowConsentModal(false)}
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

export default PrivacyPreservingAI;
