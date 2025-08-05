import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText,
  Clock,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { generatePolicyAnalysis } from '../services/aiService';

const PolicyAnalysis = ({ policy, onComplete, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysis, setAnalysis] = useState(null);

  const analysisSteps = [
    { label: 'Reading Policy Document', duration: 3000 },
    { label: 'Identifying Coverage Areas', duration: 4000 },
    { label: 'Analyzing Risk Factors', duration: 3000 },
    { label: 'Generating Recommendations', duration: 2000 },
    { label: 'Finalizing Report', duration: 1000 }
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      // Simulate step-by-step analysis
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, analysisSteps[i].duration));
      }

      // Generate AI analysis
      try {
        const analysisResults = await generatePolicyAnalysis(policy);
        setAnalysis(analysisResults);
        setLoading(false);
        onComplete(analysisResults);
      } catch (error) {
        console.error('Analysis failed:', error);
        // Use mock data as fallback
        const mockAnalysis = generateMockAnalysis(policy);
        setAnalysis(mockAnalysis);
        setLoading(false);
        onComplete(mockAnalysis);
      }
    };

    runAnalysis();
  }, [policy]);

  const generateMockAnalysis = (policy) => {
    return {
      summary: {
        overallRating: 'B+',
        coverageScore: 78,
        riskLevel: 'Medium',
        recommendations: 3
      },
      keyFindings: [
        {
          type: 'gap',
          severity: 'high',
          title: 'Liability Coverage Gap',
          description: 'Your liability coverage of $50,000 may be insufficient for your income level and assets.',
          recommendation: 'Consider increasing to $100,000 or more.'
        },
        {
          type: 'risk',
          severity: 'medium',
          title: 'Deductible Too High',
          description: 'Your $2,500 deductible represents a significant out-of-pocket expense.',
          recommendation: 'Consider lowering to $1,000 for better financial protection.'
        },
        {
          type: 'opportunity',
          severity: 'low',
          title: 'Discount Opportunity',
          description: 'You may qualify for a multi-policy discount.',
          recommendation: 'Bundle with home insurance to save 10-15%.'
        }
      ],
      coverageBreakdown: [
        { category: 'Liability', current: '$50,000', recommended: '$100,000', status: 'insufficient' },
        { category: 'Collision', current: '$25,000', recommended: '$25,000', status: 'adequate' },
        { category: 'Comprehensive', current: '$15,000', recommended: '$20,000', status: 'low' },
        { category: 'Uninsured Motorist', current: 'Not Included', recommended: '$50,000', status: 'missing' }
      ],
      recommendations: [
        {
          priority: 'high',
          title: 'Increase Liability Coverage',
          impact: 'Protects against major financial loss',
          costImpact: '+$15-25/month',
          description: 'Increase liability coverage to match your asset level and income.'
        },
        {
          priority: 'medium',
          title: 'Add Uninsured Motorist Coverage',
          impact: 'Protection against uninsured drivers',
          costImpact: '+$8-12/month',
          description: 'Essential coverage that many policies lack.'
        },
        {
          priority: 'low',
          title: 'Consider Multi-Policy Bundle',
          impact: 'Potential savings of 10-15%',
          costImpact: '-$20-40/month',
          description: 'Bundle with home/renters insurance for discounts.'
        }
      ],
      nextSteps: [
        'Contact your agent to discuss liability increase',
        'Get quotes for uninsured motorist coverage',
        'Compare bundle options with other insurers',
        'Review and update policy annually'
      ]
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Analyzing Your Policy
          </h1>
          <p className="text-gray-600">
            Our AI is reviewing your {policy.coverageType} policy. This will take about 30 seconds.
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {analysisSteps[analysisStep]?.label}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Step {analysisStep + 1} of {analysisSteps.length}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'adequate': return 'text-green-600 bg-green-100';
      case 'insufficient':
      case 'missing': return 'text-red-600 bg-red-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Policy Analysis Complete
          </h1>
          <p className="text-gray-600">
            Analysis for {policy.insuranceProvider} {policy.coverageType} policy #{policy.policyNumber}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {analysis.summary.overallRating}
          </div>
          <div className="text-sm text-gray-600">Overall Rating</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {analysis.summary.coverageScore}%
          </div>
          <div className="text-sm text-gray-600">Coverage Score</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {analysis.summary.riskLevel}
          </div>
          <div className="text-sm text-gray-600">Risk Level</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {analysis.summary.recommendations}
          </div>
          <div className="text-sm text-gray-600">Recommendations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Findings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Key Findings
          </h2>
          <div className="space-y-4">
            {analysis.keyFindings.map((finding, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{finding.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{finding.description}</p>
                <p className="text-blue-600 text-sm font-medium">{finding.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Breakdown */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Coverage Breakdown
          </h2>
          <div className="space-y-4">
            {analysis.coverageBreakdown.map((coverage, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{coverage.category}</h3>
                  <p className="text-sm text-gray-600">
                    Current: {coverage.current} → Recommended: {coverage.recommended}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coverage.status)}`}>
                  {coverage.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
                <span className="text-sm text-gray-600">{rec.costImpact}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{rec.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
              <p className="text-sm font-medium text-blue-600">{rec.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyAnalysis;