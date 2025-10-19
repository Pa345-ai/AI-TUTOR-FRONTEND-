'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  TrendingUp,
  Target,
  Shield,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  Info,
  Zap,
  Globe,
  Clock,
  Star
} from 'lucide-react';

interface AIFairnessEngineProps {
  className?: string;
}

interface FairnessMetric {
  id: string;
  modelId: string;
  fairnessMetric: 'demographic_parity' | 'equalized_odds' | 'equal_opportunity' | 'calibration';
  protectedAttribute: 'gender' | 'ethnicity' | 'age' | 'language' | 'socioeconomic';
  attributeValue: string;
  metricValue: number;
  thresholdValue: number;
  isFair: boolean;
  sampleSize: number;
  confidenceIntervalLower?: number;
  confidenceIntervalUpper?: number;
  statisticalSignificance?: number;
  biasDetected: boolean;
  biasSeverity?: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy?: string;
  mitigationApplied: boolean;
  lastChecked: string;
  nextCheck?: string;
}

interface BiasDetectionResult {
  id: string;
  modelId: string;
  testDatasetId: string;
  protectedAttribute: string;
  biasType: 'statistical_parity' | 'equalized_odds' | 'calibration' | 'representation';
  biasScore: number;
  biasDirection: 'positive' | 'negative' | 'neutral';
  affectedGroups: string[];
  sampleSizes: any;
  statisticalSignificance: number;
  confidenceLevel: number;
  detectionMethod: string;
  mitigationSuggestions: string[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresImmediateAction: boolean;
  detectedAt: string;
  reviewedBy?: string;
  reviewTimestamp?: string;
  status: 'detected' | 'reviewing' | 'mitigating' | 'resolved' | 'false_positive';
}

const AIFairnessEngine: React.FC<AIFairnessEngineProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetric[]>([]);
  const [biasResults, setBiasResults] = useState<BiasDetectionResult[]>([]);
  const [overallFairnessScore, setOverallFairnessScore] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttribute, setFilterAttribute] = useState('all');
  const [showMitigationModal, setShowMitigationModal] = useState(false);
  const [selectedBias, setSelectedBias] = useState<BiasDetectionResult | null>(null);

  useEffect(() => {
    loadFairnessData();
  }, []);

  const loadFairnessData = () => {
    const mockFairnessMetrics: FairnessMetric[] = [
      {
        id: '1',
        modelId: 'omnimind-v1',
        fairnessMetric: 'demographic_parity',
        protectedAttribute: 'gender',
        attributeValue: 'female',
        metricValue: 0.85,
        thresholdValue: 0.80,
        isFair: true,
        sampleSize: 5000,
        confidenceIntervalLower: 0.82,
        confidenceIntervalUpper: 0.88,
        statisticalSignificance: 0.001,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      },
      {
        id: '2',
        modelId: 'omnimind-v1',
        fairnessMetric: 'demographic_parity',
        protectedAttribute: 'gender',
        attributeValue: 'male',
        metricValue: 0.87,
        thresholdValue: 0.80,
        isFair: true,
        sampleSize: 5200,
        confidenceIntervalLower: 0.84,
        confidenceIntervalUpper: 0.90,
        statisticalSignificance: 0.001,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      },
      {
        id: '3',
        modelId: 'omnimind-v1',
        fairnessMetric: 'demographic_parity',
        protectedAttribute: 'gender',
        attributeValue: 'non_binary',
        metricValue: 0.82,
        thresholdValue: 0.80,
        isFair: true,
        sampleSize: 300,
        confidenceIntervalLower: 0.75,
        confidenceIntervalUpper: 0.89,
        statisticalSignificance: 0.05,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      },
      {
        id: '4',
        modelId: 'omnimind-v1',
        fairnessMetric: 'equalized_odds',
        protectedAttribute: 'ethnicity',
        attributeValue: 'white',
        metricValue: 0.88,
        thresholdValue: 0.85,
        isFair: true,
        sampleSize: 4000,
        confidenceIntervalLower: 0.85,
        confidenceIntervalUpper: 0.91,
        statisticalSignificance: 0.001,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      },
      {
        id: '5',
        modelId: 'omnimind-v1',
        fairnessMetric: 'equalized_odds',
        protectedAttribute: 'ethnicity',
        attributeValue: 'black',
        metricValue: 0.86,
        thresholdValue: 0.85,
        isFair: true,
        sampleSize: 2000,
        confidenceIntervalLower: 0.82,
        confidenceIntervalUpper: 0.90,
        statisticalSignificance: 0.01,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      },
      {
        id: '6',
        modelId: 'omnimind-v1',
        fairnessMetric: 'equalized_odds',
        protectedAttribute: 'ethnicity',
        attributeValue: 'hispanic',
        metricValue: 0.84,
        thresholdValue: 0.85,
        isFair: false,
        sampleSize: 1500,
        confidenceIntervalLower: 0.80,
        confidenceIntervalUpper: 0.88,
        statisticalSignificance: 0.05,
        biasDetected: true,
        biasSeverity: 'medium',
        mitigationStrategy: 'Increase training data diversity and apply bias correction techniques',
        mitigationApplied: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-18T10:30:00Z'
      },
      {
        id: '7',
        modelId: 'omnimind-v1',
        fairnessMetric: 'equalized_odds',
        protectedAttribute: 'ethnicity',
        attributeValue: 'asian',
        metricValue: 0.90,
        thresholdValue: 0.85,
        isFair: true,
        sampleSize: 1800,
        confidenceIntervalLower: 0.87,
        confidenceIntervalUpper: 0.93,
        statisticalSignificance: 0.001,
        biasDetected: false,
        lastChecked: '2024-01-15T10:30:00Z',
        nextCheck: '2024-01-22T10:30:00Z'
      }
    ];

    const mockBiasResults: BiasDetectionResult[] = [
      {
        id: '1',
        modelId: 'omnimind-v1',
        testDatasetId: 'test-dataset-001',
        protectedAttribute: 'ethnicity',
        biasType: 'equalized_odds',
        biasScore: -0.15,
        biasDirection: 'negative',
        affectedGroups: ['hispanic', 'black'],
        sampleSizes: { hispanic: 1500, black: 2000, white: 4000, asian: 1800 },
        statisticalSignificance: 0.03,
        confidenceLevel: 95.0,
        detectionMethod: 'statistical_test',
        mitigationSuggestions: [
          'Increase training data diversity',
          'Apply demographic parity constraints',
          'Use adversarial debiasing techniques'
        ],
        severityLevel: 'medium',
        requiresImmediateAction: false,
        detectedAt: '2024-01-15T10:30:00Z',
        status: 'detected'
      },
      {
        id: '2',
        modelId: 'omnimind-v1',
        testDatasetId: 'test-dataset-002',
        protectedAttribute: 'gender',
        biasType: 'representation',
        biasScore: 0.08,
        biasDirection: 'positive',
        affectedGroups: ['male'],
        sampleSizes: { male: 5200, female: 5000, non_binary: 300 },
        statisticalSignificance: 0.02,
        confidenceLevel: 95.0,
        detectionMethod: 'machine_learning',
        mitigationSuggestions: [
          'Balance training data representation',
          'Apply gender-aware sampling',
          'Monitor for representation drift'
        ],
        severityLevel: 'low',
        requiresImmediateAction: false,
        detectedAt: '2024-01-14T16:45:00Z',
        reviewedBy: 'fairness_team_001',
        reviewTimestamp: '2024-01-14T17:30:00Z',
        status: 'reviewing'
      },
      {
        id: '3',
        modelId: 'omnimind-v1',
        testDatasetId: 'test-dataset-003',
        protectedAttribute: 'age',
        biasType: 'calibration',
        biasScore: -0.12,
        biasDirection: 'negative',
        affectedGroups: ['18-25', '65+'],
        sampleSizes: { '18-25': 2000, '26-35': 3000, '36-50': 2500, '51-65': 2000, '65+': 1500 },
        statisticalSignificance: 0.01,
        confidenceLevel: 95.0,
        detectionMethod: 'human_evaluation',
        mitigationSuggestions: [
          'Age-aware model calibration',
          'Increase age group representation',
          'Apply age-specific thresholds'
        ],
        severityLevel: 'high',
        requiresImmediateAction: true,
        detectedAt: '2024-01-13T09:15:00Z',
        reviewedBy: 'fairness_team_001',
        reviewTimestamp: '2024-01-13T10:00:00Z',
        status: 'mitigating'
      }
    ];

    setFairnessMetrics(mockFairnessMetrics);
    setBiasResults(mockBiasResults);
    setOverallFairnessScore(87.5); // Mock overall score
  };

  const getFairnessColor = (isFair: boolean) => {
    return isFair ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getBiasSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBiasDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      case 'neutral': return <Target className="w-4 h-4 text-gray-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-red-600 bg-red-100';
      case 'reviewing': return 'text-yellow-600 bg-yellow-100';
      case 'mitigating': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBiasResults = biasResults.filter(result => {
    const matchesSearch = result.protectedAttribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.biasType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAttribute === 'all' || result.protectedAttribute === filterAttribute;
    return matchesSearch && matchesFilter;
  });

  const handleMitigateBias = (bias: BiasDetectionResult) => {
    setSelectedBias(bias);
    setShowMitigationModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Fairness Score */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">AI Fairness Score</h3>
            <p className="text-green-100 mb-4">Overall fairness across all protected attributes</p>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{overallFairnessScore}%</div>
              <div className="flex-1">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallFairnessScore}%` }}
                  />
                </div>
                <p className="text-sm text-green-100 mt-2">
                  {overallFairnessScore >= 80 ? 'Excellent' : overallFairnessScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
          <Scale className="w-16 h-16 text-green-200" />
        </div>
      </div>

      {/* Fairness Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fair Metrics</p>
              <p className="text-2xl font-bold">
                {fairnessMetrics.filter(m => m.isFair).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bias Detected</p>
              <p className="text-2xl font-bold">
                {fairnessMetrics.filter(m => m.biasDetected).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Protected Groups</p>
              <p className="text-2xl font-bold">
                {new Set(fairnessMetrics.map(m => m.protectedAttribute)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold">{fairnessMetrics.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bias Detection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Bias Detection Results</h3>
        <div className="space-y-3">
          {biasResults.slice(0, 3).map((result) => (
            <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getBiasDirectionIcon(result.biasDirection)}
                <div>
                  <p className="font-medium">
                    {result.biasType.replace('_', ' ').toUpperCase()} - {result.protectedAttribute}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.detectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasSeverityColor(result.severityLevel)}`}>
                  {result.severityLevel}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
                <button
                  onClick={() => handleMitigateBias(result)}
                  className="p-1 text-gray-500 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFairnessMetrics = () => (
    <div className="space-y-6">
      {/* Metrics by Protected Attribute */}
      {['gender', 'ethnicity', 'age', 'language', 'socioeconomic'].map(attribute => {
        const attributeMetrics = fairnessMetrics.filter(m => m.protectedAttribute === attribute);
        if (attributeMetrics.length === 0) return null;

        return (
          <div key={attribute} className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 capitalize">{attribute} Fairness</h3>
            <div className="space-y-4">
              {attributeMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{metric.attributeValue}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFairnessColor(metric.isFair)}`}>
                        {metric.isFair ? 'Fair' : 'Unfair'}
                      </span>
                      {metric.biasDetected && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasSeverityColor(metric.biasSeverity)}`}>
                          {metric.biasSeverity} bias
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Metric Value:</span>
                        <span className="ml-2 font-medium">{metric.metricValue.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Threshold:</span>
                        <span className="ml-2 font-medium">{metric.thresholdValue.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sample Size:</span>
                        <span className="ml-2 font-medium">{metric.sampleSize.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Checked:</span>
                        <span className="ml-2 font-medium">
                          {new Date(metric.lastChecked).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-300"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={metric.isFair ? "text-green-500" : "text-red-500"}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${(metric.metricValue / metric.thresholdValue) * 100}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {Math.round((metric.metricValue / metric.thresholdValue) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderBiasDetection = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bias detection results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterAttribute}
              onChange={(e) => setFilterAttribute(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Attributes</option>
              <option value="gender">Gender</option>
              <option value="ethnicity">Ethnicity</option>
              <option value="age">Age</option>
              <option value="language">Language</option>
              <option value="socioeconomic">Socioeconomic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bias Results */}
      <div className="space-y-4">
        {filteredBiasResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getBiasDirectionIcon(result.biasDirection)}
                  <h3 className="text-lg font-semibold">
                    {result.biasType.replace('_', ' ').toUpperCase()}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasSeverityColor(result.severityLevel)}`}>
                    {result.severityLevel}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Detected in {result.protectedAttribute} attribute affecting {result.affectedGroups.join(', ')} groups
                </p>
              </div>
              <button
                onClick={() => handleMitigateBias(result)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bias Score</label>
                <p className={`text-lg font-semibold ${result.biasScore < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.biasScore > 0 ? '+' : ''}{result.biasScore.toFixed(3)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Statistical Significance</label>
                <p className="text-lg font-semibold">{result.statisticalSignificance.toFixed(3)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Confidence Level</label>
                <p className="text-lg font-semibold">{result.confidenceLevel}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Detection Method</label>
                <p className="text-lg font-semibold">{result.detectionMethod.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 mb-2 block">Mitigation Suggestions</label>
              <div className="flex flex-wrap gap-1">
                {result.mitigationSuggestions.map((suggestion, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Detected: {new Date(result.detectedAt).toLocaleString()}
                {result.reviewedBy && (
                  <span className="ml-4">
                    Reviewed by: {result.reviewedBy}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {result.requiresImmediateAction && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">
                    Immediate Action Required
                  </span>
                )}
                <button
                  onClick={() => handleMitigateBias(result)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Mitigate Bias
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Fairness Engine</h1>
          <p className="text-gray-600">
            Ensures equal outcomes across gender, ethnicity, and language with continuous bias monitoring
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'metrics', label: 'Fairness Metrics' },
            { id: 'bias', label: 'Bias Detection' }
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
        {activeTab === 'metrics' && renderFairnessMetrics()}
        {activeTab === 'bias' && renderBiasDetection()}

        {/* Mitigation Modal */}
        {showMitigationModal && selectedBias && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Mitigate Bias</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bias Details</h4>
                  <p className="text-gray-600">
                    {selectedBias.biasType.replace('_', ' ').toUpperCase()} bias detected in {selectedBias.protectedAttribute} 
                    affecting {selectedBias.affectedGroups.join(', ')} groups
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Mitigation Strategy</h4>
                  <div className="space-y-2">
                    {selectedBias.mitigationSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any additional mitigation strategies or notes..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowMitigationModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Mitigation
                </button>
                <button
                  onClick={() => setShowMitigationModal(false)}
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

export default AIFairnessEngine;
