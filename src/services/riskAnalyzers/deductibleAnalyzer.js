/**
 * Deductible Analyzer
 * Assesses deductible levels and financial risk exposure
 */

export class DeductibleAnalyzer {
  constructor() {
    this.name = 'Deductible Analyzer';
    this.version = '1.0.0';
  }

  /**
   * Analyze deductible levels and risks
   * @param {Object} policy - Policy data
   * @param {Object} policyClassification - Classification results
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Analysis results
   */
  async analyze(policy, policyClassification, userProfile = {}) {
    try {
      const policyType = policyClassification.primaryType;
      const risks = [];

      // Analyze deductible affordability
      const affordabilityAnalysis = this.analyzeAffordability(policy, userProfile);
      risks.push(...affordabilityAnalysis);

      // Assess deductible optimization
      const optimizationAnalysis = this.analyzeOptimization(policy, policyType, userProfile);
      risks.push(...optimizationAnalysis);

      // Check for multiple deductibles
      const multipleDeductibleAnalysis = this.analyzeMultipleDeductibles(policy, policyType);
      risks.push(...multipleDeductibleAnalysis);

      // Analyze claim frequency vs deductible
      const claimAnalysis = this.analyzeClaimFrequency(policy, userProfile);
      risks.push(...claimAnalysis);

      // Calculate overall score
      const score = this.calculateDeductibleScore(risks);

      return {
        success: true,
        analyzer: this.name,
        score,
        risks,
        summary: this.generateSummary(risks),
        metadata: {
          policyType,
          deductibles: this.extractDeductibles(policy),
          riskFactors: risks.length,
          analysisDate: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Deductible analysis failed:', error);
      return {
        success: false,
        error: error.message,
        analyzer: this.name,
        score: 0,
        risks: []
      };
    }
  }

  /**
   * Analyze deductible affordability
   */
  analyzeAffordability(policy, userProfile) {
    const risks = [];
    const deductibles = this.extractDeductibles(policy);
    const emergencyFund = userProfile.emergencyFund || 0;
    const monthlyIncome = (userProfile.income || 0) / 12;

    for (const [coverageType, deductible] of Object.entries(deductibles)) {
      if (deductible > 0) {
        // Check against emergency fund
        if (emergencyFund > 0 && deductible > emergencyFund) {
          risks.push({
            id: `unaffordable-deductible-${coverageType}`,
            type: 'financial_risk',
            category: 'deductible_risks',
            severity: 'high',
            title: `${this.formatCoverageType(coverageType)} Deductible Too High`,
            description: `$${deductible.toLocaleString()} deductible exceeds your emergency fund of $${emergencyFund.toLocaleString()}`,
            recommendation: `Consider lowering deductible to $${Math.min(deductible / 2, emergencyFund).toLocaleString()} or building emergency fund`,
            potentialImpact: 'May need to borrow money or delay repairs after a claim',
            urgency: 'medium',
            currentDeductible: deductible,
            emergencyFund,
            coverageType
          });
        }

        // Check against monthly income (deductible shouldn't exceed 1 month income)
        if (monthlyIncome > 0 && deductible > monthlyIncome) {
          risks.push({
            id: `high-deductible-vs-income-${coverageType}`,
            type: 'financial_risk',
            category: 'deductible_risks',
            severity: 'medium',
            title: `${this.formatCoverageType(coverageType)} Deductible vs Income`,
            description: `$${deductible.toLocaleString()} deductible represents ${Math.round((deductible / monthlyIncome) * 100)}% of monthly income`,
            recommendation: 'Consider if this deductible level aligns with your financial capacity',
            potentialImpact: 'Significant financial strain if claim occurs',
            urgency: 'low',
            currentDeductible: deductible,
            monthlyIncome,
            percentageOfIncome: Math.round((deductible / monthlyIncome) * 100),
            coverageType
          });
        }
      }
    }

    return risks;
  }

  /**
   * Analyze deductible optimization opportunities
   */
  analyzeOptimization(policy, policyType, userProfile) {
    const risks = [];
    const deductibles = this.extractDeductibles(policy);
    const claimHistory = userProfile.claimHistory || [];

    for (const [coverageType, deductible] of Object.entries(deductibles)) {
      if (deductible > 0) {
        const optimization = this.calculateOptimalDeductible(
          deductible, 
          coverageType, 
          policyType, 
          userProfile
        );

        if (optimization.recommendation !== 'current') {
          const severity = Math.abs(optimization.potentialSavings) > 200 ? 'medium' : 'low';
          
          risks.push({
            id: `deductible-optimization-${coverageType}`,
            type: 'opportunity',
            category: 'deductible_risks',
            severity,
            title: `${this.formatCoverageType(coverageType)} Deductible Optimization`,
            description: optimization.description,
            recommendation: optimization.recommendation === 'increase' ? 
              `Consider increasing deductible to $${optimization.suggestedDeductible.toLocaleString()}` :
              `Consider decreasing deductible to $${optimization.suggestedDeductible.toLocaleString()}`,
            potentialImpact: optimization.recommendation === 'increase' ?
              `Potential annual savings of $${Math.abs(optimization.potentialSavings)}` :
              `Better financial protection for additional $${Math.abs(optimization.potentialSavings)} annually`,
            urgency: 'low',
            currentDeductible: deductible,
            suggestedDeductible: optimization.suggestedDeductible,
            potentialSavings: optimization.potentialSavings,
            coverageType,
            optimizationType: optimization.recommendation
          });
        }
      }
    }

    return risks;
  }

  /**
   * Analyze multiple deductibles complexity
   */
  analyzeMultipleDeductibles(policy, policyType) {
    const risks = [];
    const deductibles = this.extractDeductibles(policy);
    const deductibleValues = Object.values(deductibles).filter(d => d > 0);
    
    if (deductibleValues.length > 2) {
      const uniqueValues = [...new Set(deductibleValues)];
      
      if (uniqueValues.length > 2) {
        risks.push({
          id: 'multiple-deductible-complexity',
          type: 'complexity',
          category: 'policy_terms',
          severity: 'low',
          title: 'Multiple Different Deductibles',
          description: `Your policy has ${uniqueValues.length} different deductible amounts: $${uniqueValues.join(', $')}`,
          recommendation: 'Consider standardizing deductibles for simplicity',
          potentialImpact: 'May cause confusion when filing claims',
          urgency: 'low',
          deductibleCount: uniqueValues.length,
          deductibleValues: uniqueValues
        });
      }
    }

    return risks;
  }

  /**
   * Analyze claim frequency vs deductible strategy
   */
  analyzeClaimFrequency(policy, userProfile) {
    const risks = [];
    const claimHistory = userProfile.claimHistory || [];
    const deductibles = this.extractDeductibles(policy);
    
    if (claimHistory.length > 0) {
      const recentClaims = claimHistory.filter(claim => {
        const claimDate = new Date(claim.date);
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        return claimDate > fiveYearsAgo;
      });

      const averageDeductible = Object.values(deductibles).reduce((sum, d) => sum + d, 0) / Object.keys(deductibles).length;
      
      if (recentClaims.length >= 2 && averageDeductible > 1000) {
        risks.push({
          id: 'high-deductible-frequent-claims',
          type: 'strategy_mismatch',
          category: 'deductible_risks',
          severity: 'medium',
          title: 'High Deductible with Frequent Claims',
          description: `You've had ${recentClaims.length} claims in 5 years with average deductible of $${averageDeductible.toLocaleString()}`,
          recommendation: 'Consider lowering deductibles if you tend to file claims frequently',
          potentialImpact: 'High out-of-pocket costs due to frequent deductible payments',
          urgency: 'medium',
          claimCount: recentClaims.length,
          averageDeductible,
          timeframe: '5 years'
        });
      }

      if (recentClaims.length === 0 && averageDeductible < 1000) {
        risks.push({
          id: 'low-deductible-no-claims',
          type: 'opportunity',
          category: 'deductible_risks',
          severity: 'low',
          title: 'Low Deductible with No Recent Claims',
          description: 'No claims in 5 years suggests you might benefit from higher deductibles',
          recommendation: 'Consider increasing deductibles to reduce premiums',
          potentialImpact: 'Potential premium savings of $200-500 annually',
          urgency: 'low',
          claimCount: 0,
          averageDeductible,
          timeframe: '5 years'
        });
      }
    }

    return risks;
  }

  /**
   * Extract deductibles from policy
   */
  extractDeductibles(policy) {
    const deductibles = {};
    
    // Extract from structured data
    if (policy.structuredData?.deductible) {
      deductibles.general = this.parseDeductible(policy.structuredData.deductible);
    }

    // Extract from text (mock patterns)
    if (policy.extractedText) {
      const text = policy.extractedText.toLowerCase();
      
      const patterns = [
        { type: 'collision', pattern: /collision.*deductible.*\$?([0-9,]+)/ },
        { type: 'comprehensive', pattern: /comprehensive.*deductible.*\$?([0-9,]+)/ },
        { type: 'dwelling', pattern: /dwelling.*deductible.*\$?([0-9,]+)/ },
        { type: 'hurricane', pattern: /hurricane.*deductible.*\$?([0-9,]+)/ }
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern.pattern);
        if (match) {
          deductibles[pattern.type] = this.parseDeductible(match[1]);
        }
      }
    }

    // Default values if none found
    if (Object.keys(deductibles).length === 0) {
      deductibles.general = 500; // Default assumption
    }

    return deductibles;
  }

  /**
   * Calculate optimal deductible
   */
  calculateOptimalDeductible(currentDeductible, coverageType, policyType, userProfile) {
    const emergencyFund = userProfile.emergencyFund || 0;
    const riskTolerance = userProfile.riskTolerance || 'medium';
    
    // Deductible options and typical premium savings
    const deductibleOptions = [250, 500, 1000, 2500, 5000];
    const premiumSavingsRate = 0.15; // 15% savings per $1000 increase in deductible
    
    let optimalDeductible = currentDeductible;
    let recommendation = 'current';
    let potentialSavings = 0;
    let description = 'Current deductible appears appropriate';

    // Conservative approach: don't exceed 50% of emergency fund
    const maxAffordableDeductible = Math.max(500, emergencyFund * 0.5);
    
    if (riskTolerance === 'high' && currentDeductible < maxAffordableDeductible) {
      // Suggest higher deductible for premium savings
      const nextHigherOption = deductibleOptions.find(d => d > currentDeductible && d <= maxAffordableDeductible);
      if (nextHigherOption) {
        optimalDeductible = nextHigherOption;
        recommendation = 'increase';
        potentialSavings = ((nextHigherOption - currentDeductible) / 1000) * premiumSavingsRate * 1000; // Estimated annual savings
        description = `Higher deductible could reduce premiums while staying within your financial capacity`;
      }
    } else if (riskTolerance === 'low' && currentDeductible > 1000) {
      // Suggest lower deductible for better protection
      const nextLowerOption = deductibleOptions.reverse().find(d => d < currentDeductible && d >= 500);
      if (nextLowerOption) {
        optimalDeductible = nextLowerOption;
        recommendation = 'decrease';
        potentialSavings = -((currentDeductible - nextLowerOption) / 1000) * premiumSavingsRate * 1000; // Estimated annual cost
        description = `Lower deductible provides better financial protection for claims`;
      }
    }

    return {
      suggestedDeductible: optimalDeductible,
      recommendation,
      potentialSavings: Math.round(potentialSavings),
      description
    };
  }

  /**
   * Parse deductible string to number
   */
  parseDeductible(deductibleStr) {
    if (typeof deductibleStr === 'number') return deductibleStr;
    if (!deductibleStr) return 0;
    
    const cleaned = deductibleStr.toString().replace(/[,$]/g, '');
    return parseInt(cleaned) || 0;
  }

  /**
   * Format coverage type for display
   */
  formatCoverageType(coverageType) {
    const formatMap = {
      general: 'General',
      collision: 'Collision',
      comprehensive: 'Comprehensive',
      dwelling: 'Dwelling',
      hurricane: 'Hurricane'
    };
    
    return formatMap[coverageType] || coverageType.charAt(0).toUpperCase() + coverageType.slice(1);
  }

  /**
   * Calculate deductible score
   */
  calculateDeductibleScore(risks) {
    if (risks.length === 0) return 0;
    
    const severityWeights = {
      critical: 25,
      high: 20,
      medium: 15,
      low: 5
    };
    
    const totalScore = risks.reduce((sum, risk) => {
      return sum + (severityWeights[risk.severity] || 5);
    }, 0);
    
    return Math.min(100, totalScore);
  }

  /**
   * Generate analysis summary
   */
  generateSummary(risks) {
    const highCount = risks.filter(r => r.severity === 'high').length;
    const opportunityCount = risks.filter(r => r.type === 'opportunity').length;
    const totalRisks = risks.length;
    
    if (totalRisks === 0) {
      return 'Deductible levels appear well-balanced for your situation.';
    }
    
    if (highCount > 0) {
      return `${highCount} deductible concerns identified that may impact your financial security.`;
    }
    
    if (opportunityCount > 0) {
      return `${opportunityCount} deductible optimization opportunities found for potential savings.`;
    }
    
    return `${totalRisks} deductible considerations identified for review.`;
  }
}

export default DeductibleAnalyzer;

