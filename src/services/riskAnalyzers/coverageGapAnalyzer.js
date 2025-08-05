/**
 * Coverage Gap Analyzer
 * Identifies missing or insufficient coverage in insurance policies
 */

export class CoverageGapAnalyzer {
  constructor() {
    this.name = 'Coverage Gap Analyzer';
    this.version = '1.0.0';
  }

  /**
   * Analyze policy for coverage gaps
   * @param {Object} policy - Policy data
   * @param {Object} policyClassification - Classification results
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Analysis results
   */
  async analyze(policy, policyClassification, userProfile = {}) {
    try {
      const policyType = policyClassification.primaryType;
      const risks = [];

      // Get expected coverages for policy type
      const expectedCoverages = this.getExpectedCoverages(policyType);
      
      // Analyze coverage adequacy
      const coverageAnalysis = this.analyzeCoverageAdequacy(policy, expectedCoverages, userProfile);
      risks.push(...coverageAnalysis);

      // Check for missing essential coverages
      const missingCoverages = this.checkMissingCoverages(policy, expectedCoverages);
      risks.push(...missingCoverages);

      // Analyze coverage limits
      const limitAnalysis = this.analyzeCoverageLimits(policy, policyType, userProfile);
      risks.push(...limitAnalysis);

      // Calculate overall score
      const score = this.calculateGapScore(risks);

      return {
        success: true,
        analyzer: this.name,
        score,
        risks,
        summary: this.generateSummary(risks),
        metadata: {
          policyType,
          expectedCoverages: expectedCoverages.length,
          identifiedGaps: risks.length,
          analysisDate: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Coverage gap analysis failed:', error);
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
   * Get expected coverages for policy type
   */
  getExpectedCoverages(policyType) {
    const coverageMap = {
      auto: [
        { name: 'Bodily Injury Liability', required: true, minLimit: 50000 },
        { name: 'Property Damage Liability', required: true, minLimit: 25000 },
        { name: 'Collision Coverage', required: false, recommended: true },
        { name: 'Comprehensive Coverage', required: false, recommended: true },
        { name: 'Uninsured Motorist', required: false, recommended: true },
        { name: 'Personal Injury Protection', required: false, recommended: false }
      ],
      home: [
        { name: 'Dwelling Coverage', required: true, minLimit: 100000 },
        { name: 'Personal Property Coverage', required: true, minLimit: 50000 },
        { name: 'Liability Coverage', required: true, minLimit: 100000 },
        { name: 'Additional Living Expenses', required: true, minLimit: 20000 },
        { name: 'Medical Payments to Others', required: false, recommended: true },
        { name: 'Other Structures Coverage', required: false, recommended: true }
      ],
      renters: [
        { name: 'Personal Property Coverage', required: true, minLimit: 20000 },
        { name: 'Liability Coverage', required: true, minLimit: 100000 },
        { name: 'Additional Living Expenses', required: true, minLimit: 10000 },
        { name: 'Medical Payments to Others', required: false, recommended: true }
      ],
      life: [
        { name: 'Death Benefit', required: true, minLimit: 100000 },
        { name: 'Accidental Death Benefit', required: false, recommended: true },
        { name: 'Waiver of Premium', required: false, recommended: true }
      ],
      health: [
        { name: 'Preventive Care', required: true },
        { name: 'Emergency Services', required: true },
        { name: 'Hospitalization', required: true },
        { name: 'Prescription Drugs', required: true },
        { name: 'Mental Health Services', required: true },
        { name: 'Maternity Care', required: false, recommended: true }
      ]
    };

    return coverageMap[policyType] || [];
  }

  /**
   * Analyze coverage adequacy
   */
  analyzeCoverageAdequacy(policy, expectedCoverages, userProfile) {
    const risks = [];
    const currentCoverages = this.extractCurrentCoverages(policy);

    for (const expected of expectedCoverages) {
      const current = currentCoverages.find(c => 
        this.matchCoverageName(c.name, expected.name)
      );

      if (current) {
        // Check if limits are adequate
        if (expected.minLimit && current.limit < expected.minLimit) {
          risks.push({
            id: `inadequate-${expected.name.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'coverage_gap',
            category: 'coverage_gaps',
            severity: expected.required ? 'high' : 'medium',
            title: `Inadequate ${expected.name}`,
            description: `Current ${expected.name} limit of $${current.limit.toLocaleString()} is below recommended minimum of $${expected.minLimit.toLocaleString()}`,
            recommendation: `Increase ${expected.name} to at least $${expected.minLimit.toLocaleString()}`,
            potentialImpact: `Financial exposure up to $${(expected.minLimit - current.limit).toLocaleString()}`,
            urgency: expected.required ? 'high' : 'medium',
            currentValue: current.limit,
            recommendedValue: expected.minLimit,
            coverageName: expected.name
          });
        }
      }
    }

    return risks;
  }

  /**
   * Check for missing coverages
   */
  checkMissingCoverages(policy, expectedCoverages) {
    const risks = [];
    const currentCoverages = this.extractCurrentCoverages(policy);

    for (const expected of expectedCoverages) {
      const exists = currentCoverages.some(c => 
        this.matchCoverageName(c.name, expected.name)
      );

      if (!exists) {
        const severity = expected.required ? 'critical' : 
                        expected.recommended ? 'high' : 'medium';

        risks.push({
          id: `missing-${expected.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'coverage_gap',
          category: 'coverage_gaps',
          severity,
          title: `Missing ${expected.name}`,
          description: `${expected.name} is not included in your policy`,
          recommendation: `Add ${expected.name} to your policy`,
          potentialImpact: expected.required ? 
            'Critical financial exposure - may violate legal requirements' :
            'Potential financial exposure in specific scenarios',
          urgency: expected.required ? 'immediate' : 'medium',
          coverageName: expected.name,
          isRequired: expected.required,
          isRecommended: expected.recommended
        });
      }
    }

    return risks;
  }

  /**
   * Analyze coverage limits
   */
  analyzeCoverageLimits(policy, policyType, userProfile) {
    const risks = [];
    
    // Asset-based analysis for liability coverage
    if (userProfile.assets || userProfile.income) {
      const recommendedLiability = this.calculateRecommendedLiability(userProfile);
      const currentLiability = this.extractLiabilityLimit(policy);
      
      if (currentLiability && currentLiability < recommendedLiability) {
        risks.push({
          id: 'insufficient-liability',
          type: 'coverage_gap',
          category: 'coverage_gaps',
          severity: 'high',
          title: 'Insufficient Liability Coverage',
          description: `Based on your assets/income, liability coverage should be higher`,
          recommendation: `Increase liability coverage to $${recommendedLiability.toLocaleString()}`,
          potentialImpact: 'Personal assets at risk in major lawsuit',
          urgency: 'high',
          currentValue: currentLiability,
          recommendedValue: recommendedLiability,
          basis: 'asset-protection'
        });
      }
    }

    return risks;
  }

  /**
   * Extract current coverages from policy
   */
  extractCurrentCoverages(policy) {
    const coverages = [];
    
    // Extract from structured data
    if (policy.structuredData) {
      const data = policy.structuredData;
      
      if (data.liabilityLimits) {
        coverages.push({
          name: 'Bodily Injury Liability',
          limit: this.parseLimit(data.liabilityLimits)
        });
      }
      
      if (data.propertyDamage) {
        coverages.push({
          name: 'Property Damage Liability',
          limit: this.parseLimit(data.propertyDamage)
        });
      }
    }

    // Extract from text analysis (mock implementation)
    if (policy.extractedText) {
      const text = policy.extractedText.toLowerCase();
      
      // Look for coverage patterns
      const patterns = [
        { name: 'Collision Coverage', pattern: /collision.*\$?([0-9,]+)/ },
        { name: 'Comprehensive Coverage', pattern: /comprehensive.*\$?([0-9,]+)/ },
        { name: 'Uninsured Motorist', pattern: /uninsured.*\$?([0-9,]+)/ }
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern.pattern);
        if (match) {
          coverages.push({
            name: pattern.name,
            limit: this.parseLimit(match[1])
          });
        }
      }
    }

    return coverages;
  }

  /**
   * Match coverage names (fuzzy matching)
   */
  matchCoverageName(current, expected) {
    const normalize = (name) => name.toLowerCase().replace(/[^a-z]/g, '');
    const currentNorm = normalize(current);
    const expectedNorm = normalize(expected);
    
    return currentNorm.includes(expectedNorm) || expectedNorm.includes(currentNorm);
  }

  /**
   * Parse limit string to number
   */
  parseLimit(limitStr) {
    if (typeof limitStr === 'number') return limitStr;
    if (!limitStr) return 0;
    
    const cleaned = limitStr.toString().replace(/[,$]/g, '');
    return parseInt(cleaned) || 0;
  }

  /**
   * Calculate recommended liability based on user profile
   */
  calculateRecommendedLiability(userProfile) {
    let recommended = 100000; // Base minimum
    
    if (userProfile.assets) {
      recommended = Math.max(recommended, userProfile.assets * 1.5);
    }
    
    if (userProfile.income) {
      recommended = Math.max(recommended, userProfile.income * 3);
    }
    
    // Round to nearest 50k
    return Math.ceil(recommended / 50000) * 50000;
  }

  /**
   * Extract liability limit from policy
   */
  extractLiabilityLimit(policy) {
    if (policy.structuredData?.liabilityLimits) {
      return this.parseLimit(policy.structuredData.liabilityLimits);
    }
    
    // Default fallback
    return 50000;
  }

  /**
   * Calculate gap score
   */
  calculateGapScore(risks) {
    if (risks.length === 0) return 0;
    
    const severityWeights = {
      critical: 25,
      high: 15,
      medium: 10,
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
    const criticalCount = risks.filter(r => r.severity === 'critical').length;
    const highCount = risks.filter(r => r.severity === 'high').length;
    const totalGaps = risks.length;
    
    if (totalGaps === 0) {
      return 'No significant coverage gaps identified. Your policy appears to have adequate coverage.';
    }
    
    if (criticalCount > 0) {
      return `${criticalCount} critical coverage gaps found that require immediate attention. Total gaps: ${totalGaps}`;
    }
    
    if (highCount > 0) {
      return `${highCount} high-priority coverage gaps identified. Consider addressing these soon. Total gaps: ${totalGaps}`;
    }
    
    return `${totalGaps} coverage gaps identified with opportunities for improvement.`;
  }
}

export default CoverageGapAnalyzer;

