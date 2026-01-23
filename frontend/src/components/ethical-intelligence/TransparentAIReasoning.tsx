'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Brain, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Clock,
  Star,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Zap,
  Shield,
  Search,
  Filter
} from 'lucide-react';

interface TransparentAIReasoningProps {
  className?: string;
}

interface AIReasoningReport {
  id: string;
  sessionId: string;
  aiModelId: string;
  interactionType: 'question_answer' | 'feedback' | 'recommendation' | 'assessment' | 'explanation';
  inputData: any;
  aiResponse: string;
  reasoningSteps: ReasoningStep[];
  confidenceScore: number;
  uncertaintyFactors: string[];
  dataSources: string[];
  assumptionsMade: string[];
  alternativeExplanations: string[];
  biasChecks: any;
  fairnessMetrics: any;
  transparencyScore: number;
  userUnderstandingScore: number;
  feedbackProvided: boolean;
  feedbackRating?: number;
  feedbackText?: string;
  generatedAt: string;
}

interface ReasoningStep {
  step: number;
  description: string;
  confidence: number;
  evidence: string[];
  reasoning: string;
}

const TransparentAIReasoning: React.FC<TransparentAIReasoningProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState<AIReasoningReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AIReasoningReport | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const mockReports: AIReasoningReport[] = [
      {
        id: '1',
        sessionId: 'session-001',
        aiModelId: 'omnimind-v1',
        interactionType: 'question_answer',
        inputData: {
          question: "What is the best way to learn machine learning?",
          context: "I'm a beginner with some programming experience"
        },
        aiResponse: "Based on your programming background, I recommend starting with Python fundamentals, then moving to libraries like scikit-learn and TensorFlow. Focus on hands-on projects to reinforce learning.",
        reasoningSteps: [
          {
            step: 1,
            description: "Analyzed user's programming background",
            confidence: 95,
            evidence: ["User mentioned 'some programming experience'", "Context indicates beginner level"],
            reasoning: "Programming experience is crucial for ML as most tools require coding skills"
          },
          {
            step: 2,
            description: "Identified appropriate learning path",
            confidence: 88,
            evidence: ["Python is most popular for ML", "scikit-learn is beginner-friendly", "TensorFlow offers comprehensive learning"],
            reasoning: "Python ecosystem provides the best balance of ease and capability for beginners"
          },
          {
            step: 3,
            description: "Recommended hands-on approach",
            confidence: 92,
            evidence: ["Research shows project-based learning is most effective", "ML requires practical application"],
            reasoning: "Machine learning concepts are best understood through practical implementation"
          }
        ],
        confidenceScore: 91.7,
        uncertaintyFactors: ["Unclear about specific programming languages", "Unknown time commitment"],
        dataSources: ["ML learning research papers", "Educational best practices", "Industry surveys"],
        assumptionsMade: ["User has access to computer", "User can dedicate time to learning"],
        alternativeExplanations: [
          "Could start with R if user prefers statistics",
          "Online courses might be better than self-study",
          "Could focus on specific ML domain first"
        ],
        biasChecks: {
          cultural_bias: "low",
          gender_bias: "none",
          language_bias: "none"
        },
        fairnessMetrics: {
          demographic_parity: 0.89,
          equalized_odds: 0.92
        },
        transparencyScore: 94.5,
        userUnderstandingScore: 87.0,
        feedbackProvided: true,
        feedbackRating: 5,
        feedbackText: "Very helpful and clear explanation!",
        generatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        sessionId: 'session-002',
        aiModelId: 'omnimind-v1',
        interactionType: 'feedback',
        inputData: {
          assignment: "Implement a linear regression model",
          submission: "Code with basic implementation",
          criteria: ["Correctness", "Code quality", "Documentation"]
        },
        aiResponse: "Your implementation shows good understanding of linear regression concepts. The code is clean and well-structured. Consider adding more detailed comments and error handling for production use.",
        reasoningSteps: [
          {
            step: 1,
            description: "Evaluated code correctness",
            confidence: 96,
            evidence: ["Algorithm implementation is accurate", "Mathematical formulas are correct"],
            reasoning: "The core linear regression algorithm is properly implemented"
          },
          {
            step: 2,
            description: "Assessed code quality",
            confidence: 78,
            evidence: ["Code is readable", "Functions are well-named", "Structure is logical"],
            reasoning: "Code follows good practices but could be more robust"
          },
          {
            step: 3,
            description: "Checked documentation",
            confidence: 65,
            evidence: ["Basic comments present", "Missing detailed explanations", "No docstrings"],
            reasoning: "Documentation is minimal and could be more comprehensive"
          }
        ],
        confidenceScore: 79.7,
        uncertaintyFactors: ["Unclear about specific requirements", "Unknown target audience"],
        dataSources: ["Coding standards", "Educational rubrics", "Industry best practices"],
        assumptionsMade: ["Student is learning, not production-ready", "Focus on learning over optimization"],
        alternativeExplanations: [
          "Could suggest specific documentation tools",
          "Might recommend testing frameworks",
          "Could provide examples of error handling"
        ],
        biasChecks: {
          cultural_bias: "none",
          gender_bias: "none",
          language_bias: "low"
        },
        fairnessMetrics: {
          demographic_parity: 0.91,
          equalized_odds: 0.88
        },
        transparencyScore: 89.2,
        userUnderstandingScore: 82.0,
        feedbackProvided: false,
        generatedAt: '2024-01-14T16:45:00Z'
      },
      {
        id: '3',
        sessionId: 'session-003',
        aiModelId: 'omnimind-v1',
        interactionType: 'recommendation',
        inputData: {
          userProfile: {
            interests: ["data science", "python", "statistics"],
            skillLevel: "intermediate",
            goals: ["career change", "data analysis"]
          },
          currentCourse: "Python for Data Science"
        },
        aiResponse: "I recommend focusing on pandas and numpy libraries next, followed by data visualization with matplotlib and seaborn. Then consider machine learning with scikit-learn to align with your career goals.",
        reasoningSteps: [
          {
            step: 1,
            description: "Analyzed user interests and goals",
            confidence: 93,
            evidence: ["Data science interest", "Career change goal", "Data analysis focus"],
            reasoning: "User's interests align with data science career path"
          },
          {
            step: 2,
            description: "Assessed current skill level",
            confidence: 85,
            evidence: ["Intermediate level", "Python experience", "Statistics knowledge"],
            reasoning: "User has foundation to build upon"
          },
          {
            step: 3,
            description: "Identified learning progression",
            confidence: 90,
            evidence: ["pandas/numpy are essential", "Visualization is important", "ML is career-relevant"],
            reasoning: "Logical progression from data manipulation to analysis to ML"
          }
        ],
        confidenceScore: 89.3,
        uncertaintyFactors: ["Unknown time availability", "Unclear preferred learning style"],
        dataSources: ["Career path data", "Learning progression research", "Industry requirements"],
        assumptionsMade: ["User wants practical skills", "Career change is primary goal"],
        alternativeExplanations: [
          "Could focus on specific domain (finance, healthcare)",
          "Might prioritize SQL over visualization",
          "Could suggest online courses vs self-study"
        ],
        biasChecks: {
          cultural_bias: "none",
          gender_bias: "none",
          language_bias: "none"
        },
        fairnessMetrics: {
          demographic_parity: 0.94,
          equalized_odds: 0.91
        },
        transparencyScore: 91.8,
        userUnderstandingScore: 89.0,
        feedbackProvided: true,
        feedbackRating: 4,
        feedbackText: "Good recommendations, but would like more specific resources",
        generatedAt: '2024-01-13T09:15:00Z'
      }
    ];
    setReports(mockReports);
  };

  const getInteractionTypeIcon = (type: string) => {
    switch (type) {
      case 'question_answer': return <MessageCircle className="w-4 h-4" />;
      case 'feedback': return <ThumbsUp className="w-4 h-4" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4" />;
      case 'assessment': return <Target className="w-4 h-4" />;
      case 'explanation': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTransparencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.aiResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inputData.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inputData.assignment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.interactionType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleViewReport = (report: AIReasoningReport) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleFeedback = (reportId: string, rating: number, text: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            feedbackProvided: true, 
            feedbackRating: rating, 
            feedbackText: text 
          }
        : report
    ));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Transparency Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">AI Transparency Score</h3>
            <p className="text-blue-100 mb-4">How transparent our AI reasoning is</p>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">92.5%</div>
              <div className="flex-1">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: '92.5%' }}
                  />
                </div>
                <p className="text-sm text-blue-100 mt-2">Excellent transparency</p>
              </div>
            </div>
          </div>
          <Eye className="w-16 h-16 text-blue-200" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Confidence</p>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.confidenceScore >= 90).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Transparency</p>
              <p className="text-2xl font-bold">
                {Math.round(reports.reduce((sum, r) => sum + r.transparencyScore, 0) / reports.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">User Feedback</p>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.feedbackProvided).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent AI Reasoning Reports</h3>
        <div className="space-y-3">
          {reports.slice(0, 3).map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getInteractionTypeIcon(report.interactionType)}
                <div>
                  <p className="font-medium">
                    {report.interactionType.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransparencyColor(report.transparencyScore)}`}>
                  {report.transparencyScore}% transparent
                </span>
                <span className={`text-sm font-medium ${getConfidenceColor(report.confidenceScore)}`}>
                  {report.confidenceScore}% confidence
                </span>
                <button
                  onClick={() => handleViewReport(report)}
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

  const renderReports = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reasoning reports..."
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
              <option value="question_answer">Question & Answer</option>
              <option value="feedback">Feedback</option>
              <option value="recommendation">Recommendation</option>
              <option value="assessment">Assessment</option>
              <option value="explanation">Explanation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getInteractionTypeIcon(report.interactionType)}
                  <h3 className="text-lg font-semibold">
                    {report.interactionType.replace('_', ' ').toUpperCase()}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransparencyColor(report.transparencyScore)}`}>
                    {report.transparencyScore}% transparent
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {report.aiResponse}
                </p>
              </div>
              <button
                onClick={() => handleViewReport(report)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Confidence Score</label>
                <p className={`text-lg font-semibold ${getConfidenceColor(report.confidenceScore)}`}>
                  {report.confidenceScore}%
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reasoning Steps</label>
                <p className="text-lg font-semibold">{report.reasoningSteps.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data Sources</label>
                <p className="text-lg font-semibold">{report.dataSources.length}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {new Date(report.generatedAt).toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                {report.feedbackProvided ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Rated {report.feedbackRating}/5</span>
                  </div>
                ) : (
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Provide Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReasoningSteps = () => (
    <div className="space-y-6">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            {getInteractionTypeIcon(report.interactionType)}
            <h3 className="text-lg font-semibold">
              {report.interactionType.replace('_', ' ').toUpperCase()}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransparencyColor(report.transparencyScore)}`}>
              {report.transparencyScore}% transparent
            </span>
          </div>
          
          <div className="space-y-4">
            {report.reasoningSteps.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Step {step.step}: {step.description}</h4>
                  <span className={`text-sm font-medium ${getConfidenceColor(step.confidence)}`}>
                    {step.confidence}% confidence
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{step.reasoning}</p>
                <div className="flex flex-wrap gap-1">
                  {step.evidence.map((evidence, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transparent AI Reasoning</h1>
          <p className="text-gray-600">
            See exactly how and why AI makes decisions with step-by-step reasoning reports
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'reports', label: 'All Reports' },
            { id: 'reasoning', label: 'Reasoning Steps' }
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
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'reasoning' && renderReasoningSteps()}

        {/* Report Detail Modal */}
        {showDetailModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Reasoning Report Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Report Header */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {getInteractionTypeIcon(selectedReport.interactionType)}
                    <h4 className="text-lg font-semibold">
                      {selectedReport.interactionType.replace('_', ' ').toUpperCase()}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransparencyColor(selectedReport.transparencyScore)}`}>
                      {selectedReport.transparencyScore}% transparent
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedReport.aiResponse}</p>
                </div>
                
                {/* Reasoning Steps */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Reasoning Process</h4>
                  <div className="space-y-4">
                    {selectedReport.reasoningSteps.map((step, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Step {step.step}: {step.description}</h5>
                          <span className={`text-sm font-medium ${getConfidenceColor(step.confidence)}`}>
                            {step.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{step.reasoning}</p>
                        <div className="flex flex-wrap gap-1">
                          {step.evidence.map((evidence, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Data Sources</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedReport.dataSources.map((source, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Assumptions Made</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedReport.assumptionsMade.map((assumption, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {assumption}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Feedback Section */}
                {!selectedReport.feedbackProvided && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2">Provide Feedback</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleFeedback(selectedReport.id, rating, '')}
                          className="p-1 text-gray-400 hover:text-yellow-500"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your thoughts about this AI response..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransparentAIReasoning;
