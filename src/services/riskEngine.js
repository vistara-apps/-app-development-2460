/**
 * Risk Detection Engine
 * Comprehensive risk assessment framework for insurance policies
 */

import CoverageGapAnalyzer from './riskAnalyzers/coverageGapAnalyzer.js';
import LiabilityAnalyzer from './riskAnalyzers/liabilityAnalyzer.js';
import DeductibleAnalyzer from './riskAnalyzers/deductibleAnalyzer.js';
import { calculateRiskScore, aggregateRiskFactors } from '../utils/riskScoring.js';

export class RiskEngine {
  constructor() {
    this.analyzers = {
      coverageGap: new CoverageGapAnalyzer(),
      liability: new LiabilityAnalyzer(),
      deductible: new DeductibleAnalyzer()
    };
    
    this.riskCategories = [
      'coverage_gaps',
      'liability_limits',
      'deductible_risks',
      'policy_terms',
      'market_comparison',
      'regulatory_compliance'
    ];
  }

  /**
   * Perform comprehensive risk analysis on a policy
   * @param {Object} policy - Policy data
   * @param {Object} policyClassification - Classification results
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Risk analysis results
   */
  async analyzeRisks(policy, policyClassification, userProfile = {}) {
    try {
      const analysisResults = {
        overallRiskScore: 0,
        riskLevel: 'unknown',
        riskFactors: [],
        recommendations: [],
        criticalIssues: [],
        opportunities: [],
        complianceStatus: 'unknown',
        analysisDate: new Date().toISOString()
      };

      // Run all risk analyzers
      const analyzerResults = await this.runAnalyzers(policy, policyClassification, userProfile);
      
      // Aggregate results
      const aggregatedRisks = this.aggregateResults(analyzerResults);
      
      // Calculate overall risk score
      const overallScore = calculateRiskScore(aggregatedRisks);
      
      // Determine risk level
      const riskLevel = this.determineRiskLevel(overallScore);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(aggregatedRisks, policyClassification.primaryType);
      
      // Identify critical issues
      const criticalIssues = this.identifyCriticalIssues(aggregatedRisks);
      
      // Find opportunities
      const opportunities = this.findOpportunities(aggregatedRisks);

      return {
        success: true,
        overallRiskScore: overallScore,
        riskLevel,
        riskFactors: aggregatedRisks,
        recommendations,
        criticalIssues,
        opportunities,
        complianceStatus: this.assessCompliance(aggregatedRisks, policyClassification.primaryType),
        analyzerResults,
        metadata: {
          analysisDate: new Date().toISOString(),
          policyType: policyClassification.primaryType,
          analyzersUsed: Object.keys(this.analyzers),
          version: '1.0.0'
        }
      };

    } catch (error) {
      console.error('Risk analysis failed:', error);
      return {
        success: false,
        error: error.message,
        overallRiskScore: 0,
        riskLevel: 'unknown'
      };
    }
  }

  /**
   * Run all risk analyzers
   */
  async runAnalyzers(policy, policyClassification, userProfile) {
    const results = {};
    
    for (const [name, analyzer] of Object.entries(this.analyzers)) {
      try {
        results[name] = await analyzer.analyze(policy, policyClassification, userProfile);
      } catch (error) {
        console.error(`Analyzer ${name} failed:`, error);
        results[name] = {
          success: false,
          error: error.message,
          risks: [],
          score: 0
        };
      }
    }
    
    return results;
  }

  /**
   * Aggregate results from all analyzers
   */
  aggregateResults(analyzerResults) {
    const aggregated = [];
    
    for (const [analyzerName, result] of Object.entries(analyzerResults)) {
      if (result.success && result.risks) {
        for (const risk of result.risks) {
          aggregated.push({
            ...risk,
            source: analyzerName,
            category: risk.category || 'general'
          });
        }
      }
    }
    
    return aggregated;
  }

  /**
   * Determine overall risk level based on score
   */
  determineRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'minimal';
  }

  /**
   * Generate recommendations based on risk factors
   */
  generateRecommendations(riskFactors, policyType) {
    const recommendations = [];
    const risksByCategory = this.groupRisksByCategory(riskFactors);
    
    for (const [category, risks] of Object.entries(risksByCategory)) {
      const categoryRecommendations = this.generateCategoryRecommendations(category, risks, policyType);
      recommendations.push(...categoryRecommendations);
    }
    
    // Sort by priority
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Group risks by category
   */
  groupRisksByCategory(riskFactors) {
    const grouped = {};
    
    for (const risk of riskFactors) {
      const category = risk.category || 'general';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(risk);
    }
    
    return grouped;
  }

  /**
   * Generate recommendations for a specific category
   */
  generateCategoryRecommendations(category, risks, policyType) {
    const recommendations = [];
    const highSeverityRisks = risks.filter(r => r.severity === 'high' || r.severity === 'critical');
    
    if (highSeverityRisks.length > 0) {
      switch (category) {
        case 'coverage_gaps':
          recommendations.push({
            id: `coverage-${Date.now()}`,
            priority: 'high',
            category: 'coverage',
            title: 'Address Coverage Gaps',
            description: 'Critical coverage gaps identified that could leave you financially exposed.',
            action: 'Review and increase coverage limits or add missing coverages',
            impact: 'Reduces financial exposure to major losses',
            costImpact: 'Moderate premium increase',
            timeframe: 'Immediate',
            risks: highSeverityRisks.map(r => r.id)
          });
          break;
          
        case 'liability_limits':
          recommendations.push({
            id: `liability-${Date.now()}`,
            priority: 'high',
            category: 'liability',
            title: 'Increase Liability Limits',
            description: 'Current liability limits may be insufficient for your risk profile.',
            action: 'Consider increasing liability coverage to recommended levels',
            impact: 'Better protection against lawsuits and major claims',
            costImpact: 'Low to moderate premium increase',
            timeframe: 'Next renewal',
            risks: highSeverityRisks.map(r => r.id)
          });
          break;
          
        case 'deductible_risks':
          recommendations.push({
            id: `deductible-${Date.now()}`,
            priority: 'medium',
            category: 'financial',
            title: 'Optimize Deductible Levels',
            description: 'Current deductible may not align with your financial capacity.',
            action: 'Review deductible amounts and adjust based on your emergency fund',
            impact: 'Better balance between premium costs and out-of-pocket expenses',
            costImpact: 'Variable - could increase or decrease premiums',
            timeframe: 'Next renewal',
            risks: highSeverityRisks.map(r => r.id)
          });
          break;
      }
    }
    
    return recommendations;
  }

  /**
   * Identify critical issues requiring immediate attention
   */
  identifyCriticalIssues(riskFactors) {
    return riskFactors
      .filter(risk => risk.severity === 'critical' || risk.urgency === 'immediate')
      .map(risk => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
        category: risk.category,
        recommendation: risk.recommendation,
        potentialImpact: risk.potentialImpact
      }));
  }

  /**
   * Find optimization opportunities
   */
  findOpportunities(riskFactors) {
    return riskFactors
      .filter(risk => risk.type === 'opportunity' || risk.category === 'optimization')
      .map(risk => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        potentialSavings: risk.potentialSavings,
        effort: risk.effort || 'medium',
        category: risk.category,
        recommendation: risk.recommendation
      }));
  }

  /**
   * Assess regulatory compliance
   */
  assessCompliance(riskFactors, policyType) {
    const complianceRisks = riskFactors.filter(risk => 
      risk.category === 'compliance' || risk.tags?.includes('regulatory')
    );
    
    if (complianceRisks.length === 0) {
      return 'compliant';
    }
    
    const criticalCompliance = complianceRisks.filter(risk => 
      risk.severity === 'critical' || risk.severity === 'high'
    );
    
    if (criticalCompliance.length > 0) {
      return 'non-compliant';
    }
    
    return 'review-needed';
  }

  /**
   * Get risk analysis summary
   */
  getRiskSummary(analysisResults) {
    if (!analysisResults.success) {
      return {
        status: 'error',
        message: 'Risk analysis failed'
      };
    }
    
    const { overallRiskScore, riskLevel, criticalIssues, recommendations } = analysisResults;
    
    return {
      status: 'success',
      riskLevel,
      score: overallRiskScore,
      criticalIssuesCount: criticalIssues.length,
      recommendationsCount: recommendations.length,
      topRecommendation: recommendations[0]?.title || 'No recommendations',
      summary: this.generateRiskSummary(riskLevel, criticalIssues.length)
    };
  }

  /**
   * Generate human-readable risk summary
   */
  generateRiskSummary(riskLevel, criticalIssuesCount) {
    const summaries = {
      critical: `Your policy has critical risks that need immediate attention. ${criticalIssuesCount} critical issues identified.`,
      high: `Your policy has significant risks that should be addressed soon. ${criticalIssuesCount} critical issues found.`,
      medium: `Your policy has moderate risks with room for improvement. Review recommended actions.`,
      low: `Your policy has minor risks with good overall coverage. Consider optimization opportunities.`,
      minimal: `Your policy shows minimal risks with excellent coverage. Well protected.`
    };
    
    return summaries[riskLevel] || 'Risk level could not be determined.';
  }

  /**
   * Get engine statistics
   */
  getEngineStats() {
    return {
      analyzers: Object.keys(this.analyzers),
      riskCategories: this.riskCategories,
      supportedPolicyTypes: ['auto', 'home', 'renters', 'life', 'health', 'disability', 'umbrella', 'business'],
      version: '1.0.0',
      features: [
        'Multi-analyzer risk assessment',
        'Severity-based prioritization',
        'Actionable recommendations',
        'Compliance checking',
        'Opportunity identification'
      ]
    };
  }
}

export default new RiskEngine();

