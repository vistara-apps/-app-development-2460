/**
 * Liability Analyzer
 * Assesses liability coverage adequacy and risks
 */

export class LiabilityAnalyzer {
  constructor() {
    this.name = 'Liability Analyzer';
    this.version = '1.0.0';
  }

  /**
   * Analyze liability coverage and risks
   * @param {Object} policy - Policy data
   * @param {Object} policyClassification - Classification results
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Analysis results
   */
  async analyze(policy, policyClassification, userProfile = {}) {
    try {
      const policyType = policyClassification.primaryType;
      const risks = [];

      // Analyze liability limits
      const limitAnalysis = this.analyzeLiabilityLimits(policy, policyType, userProfile);
      risks.push(...limitAnalysis);

      // Assess asset protection
      const assetProtection = this.assessAssetProtection(policy, userProfile);
      risks.push(...assetProtection);

      // Check for umbrella policy needs
      const umbrellaNeeds = this.assessUmbrellaNeed(policy, userProfile);
      risks.push(...umbrellaNeeds);

      // Analyze liability exclusions
      const exclusionRisks = this.analyzeExclusions(policy, policyType);
      risks.push(...exclusionRisks);

      // Calculate overall score
      const score = this.calculateLiabilityScore(risks);

      return {
        success: true,
        analyzer: this.name,
        score,
        risks,
        summary: this.generateSummary(risks),
        metadata: {
          policyType,
          liabilityLimits: this.extractLiabilityLimits(policy),
          riskFactors: risks.length,
          analysisDate: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Liability analysis failed:', error);
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
   * Analyze liability limits adequacy
   */
  analyzeLiabilityLimits(policy, policyType, userProfile) {
    const risks = [];
    const currentLimits = this.extractLiabilityLimits(policy);
    const recommendedLimits = this.calculateRecommendedLimits(policyType, userProfile);

    // Check bodily injury liability
    if (currentLimits.bodilyInjury < recommendedLimits.bodilyInjury) {
      const gap = recommendedLimits.bodilyInjury - currentLimits.bodilyInjury;
      risks.push({
        id: 'insufficient-bodily-injury-liability',
        type: 'liability_risk',
        category: 'liability_limits',
        severity: gap > 100000 ? 'high' : 'medium',
        title: 'Insufficient Bodily Injury Liability',
        description: `Current bodily injury liability of $${currentLimits.bodilyInjury.toLocaleString()} may be inadequate`,
        recommendation: `Increase to $${recommendedLimits.bodilyInjury.toLocaleString()} per person`,
        potentialImpact: `Personal assets at risk for claims exceeding $${currentLimits.bodilyInjury.toLocaleString()}`,
        urgency: 'high',
        currentValue: currentLimits.bodilyInjury,
        recommendedValue: recommendedLimits.bodilyInjury,
        costImpact: this.estimateCostImpact(gap, 'bodily-injury')
      });
    }

    // Check property damage liability
    if (currentLimits.propertyDamage < recommendedLimits.propertyDamage) {
      const gap = recommendedLimits.propertyDamage - currentLimits.propertyDamage;
      risks.push({
        id: 'insufficient-property-damage-liability',
        type: 'liability_risk',
        category: 'liability_limits',
        severity: gap > 50000 ? 'high' : 'medium',
        title: 'Insufficient Property Damage Liability',
        description: `Current property damage liability of $${currentLimits.propertyDamage.toLocaleString()} may be inadequate`,
        recommendation: `Increase to $${recommendedLimits.propertyDamage.toLocaleString()}`,
        potentialImpact: `Risk of personal liability for expensive vehicle or property damage`,
        urgency: 'medium',
        currentValue: currentLimits.propertyDamage,
        recommendedValue: recommendedLimits.propertyDamage,
        costImpact: this.estimateCostImpact(gap, 'property-damage')
      });
    }

    return risks;
  }

  /**
   * Assess asset protection adequacy
   */
  assessAssetProtection(policy, userProfile) {
    const risks = [];
    
    if (!userProfile.assets && !userProfile.income) {
      return risks; // Can't assess without financial information
    }

    const totalAssets = (userProfile.assets || 0) + (userProfile.homeValue || 0);
    const annualIncome = userProfile.income || 0;
    const currentLimits = this.extractLiabilityLimits(policy);
    
    // Calculate total liability exposure
    const totalLiability = currentLimits.bodilyInjury + currentLimits.propertyDamage;
    
    // Asset protection rule: liability coverage should be at least equal to net worth
    if (totalAssets > totalLiability) {
      const exposedAssets = totalAssets - totalLiability;
      risks.push({
        id: 'inadequate-asset-protection',
        type: 'liability_risk',
        category: 'liability_limits',
        severity: exposedAssets > 100000 ? 'critical' : 'high',
        title: 'Inadequate Asset Protection',
        description: `Your liability coverage may not fully protect your assets worth $${totalAssets.toLocaleString()}`,
        recommendation: 'Consider increasing liability limits or adding umbrella coverage',
        potentialImpact: `Up to $${exposedAssets.toLocaleString()} in assets could be at risk`,
        urgency: 'high',
        exposedAssets,
        totalAssets,
        currentCoverage: totalLiability
      });
    }

    // Income protection rule: coverage should be multiple of annual income
    const recommendedIncomeMultiple = 3;
    const incomeBasedCoverage = annualIncome * recommendedIncomeMultiple;
    
    if (annualIncome > 0 && totalLiability < incomeBasedCoverage) {
      risks.push({
        id: 'insufficient-income-protection',
        type: 'liability_risk',
        category: 'liability_limits',
        severity: 'medium',
        title: 'Insufficient Income-Based Protection',
        description: `Liability coverage should be at least ${recommendedIncomeMultiple}x your annual income`,
        recommendation: `Consider coverage of at least $${incomeBasedCoverage.toLocaleString()}`,
        potentialImpact: 'Future earnings could be garnished in major lawsuit',
        urgency: 'medium',
        currentCoverage: totalLiability,
        recommendedCoverage: incomeBasedCoverage,
        annualIncome
      });
    }

    return risks;
  }

  /**
   * Assess need for umbrella policy
   */
  assessUmbrellaNeed(policy, userProfile) {
    const risks = [];
    const currentLimits = this.extractLiabilityLimits(policy);
    const totalLiability = currentLimits.bodilyInjury + currentLimits.propertyDamage;
    
    // Umbrella policy indicators
    const umbrellaIndicators = [
      { condition: (userProfile.assets || 0) > 500000, reason: 'High net worth' },
      { condition: (userProfile.income || 0) > 100000, reason: 'High income' },
      { condition: userProfile.hasPool, reason: 'Swimming pool liability' },
      { condition: userProfile.hasRentalProperty, reason: 'Rental property exposure' },
      { condition: userProfile.hasTeenDrivers, reason: 'Teen driver risk' },
      { condition: totalLiability < 500000, reason: 'Low underlying liability limits' }
    ];

    const applicableIndicators = umbrellaIndicators.filter(indicator => indicator.condition);
    
    if (applicableIndicators.length >= 2) {
      risks.push({
        id: 'umbrella-policy-recommended',
        type: 'opportunity',
        category: 'liability_limits',
        severity: 'medium',
        title: 'Umbrella Policy Recommended',
        description: 'Multiple factors suggest you could benefit from umbrella liability coverage',
        recommendation: 'Consider adding a personal umbrella policy for additional liability protection',
        potentialImpact: 'Enhanced protection against major liability claims',
        urgency: 'low',
        reasons: applicableIndicators.map(i => i.reason),
        estimatedCost: '$200-400 annually for $1M coverage'
      });
    }

    return risks;
  }

  /**
   * Analyze liability exclusions
   */
  analyzeExclusions(policy, policyType) {
    const risks = [];
    
    // Common exclusions that create liability gaps
    const commonExclusions = {
      auto: [
        'Business use of vehicle',
        'Racing or competitive events',
        'Intentional acts',
        'Criminal acts'
      ],
      home: [
        'Business activities',
        'Professional services',
        'Intentional damage',
        'Certain dog breeds',
        'Trampolines without safety features'
      ]
    };

    const policyExclusions = commonExclusions[policyType] || [];
    
    if (policyExclusions.length > 0) {
      risks.push({
        id: 'liability-exclusions-present',
        type: 'awareness',
        category: 'policy_terms',
        severity: 'low',
        title: 'Liability Exclusions Present',
        description: 'Your policy contains standard exclusions that limit liability coverage',
        recommendation: 'Review exclusions and consider additional coverage if needed',
        potentialImpact: 'No coverage for excluded activities or situations',
        urgency: 'low',
        exclusions: policyExclusions
      });
    }

    return risks;
  }

  /**
   * Extract liability limits from policy
   */
  extractLiabilityLimits(policy) {
    const defaults = {
      bodilyInjury: 50000,
      propertyDamage: 25000,
      totalLiability: 100000
    };

    if (policy.structuredData) {
      const data = policy.structuredData;
      return {
        bodilyInjury: this.parseLimit(data.liabilityLimits) || defaults.bodilyInjury,
        propertyDamage: this.parseLimit(data.propertyDamage) || defaults.propertyDamage,
        totalLiability: (this.parseLimit(data.liabilityLimits) || defaults.bodilyInjury) + 
                       (this.parseLimit(data.propertyDamage) || defaults.propertyDamage)
      };
    }

    return defaults;
  }

  /**
   * Calculate recommended liability limits
   */
  calculateRecommendedLimits(policyType, userProfile) {
    const baseLimits = {
      auto: { bodilyInjury: 100000, propertyDamage: 50000 },
      home: { bodilyInjury: 300000, propertyDamage: 100000 },
      renters: { bodilyInjury: 100000, propertyDamage: 50000 }
    };

    let recommended = baseLimits[policyType] || baseLimits.auto;

    // Adjust based on user profile
    if (userProfile.assets > 250000) {
      recommended.bodilyInjury = Math.max(recommended.bodilyInjury, 250000);
      recommended.propertyDamage = Math.max(recommended.propertyDamage, 100000);
    }

    if (userProfile.income > 75000) {
      recommended.bodilyInjury = Math.max(recommended.bodilyInjury, userProfile.income * 2);
    }

    return recommended;
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
   * Estimate cost impact of increasing coverage
   */
  estimateCostImpact(increaseAmount, coverageType) {
    const costPerThousand = {
      'bodily-injury': 0.50,
      'property-damage': 0.30
    };

    const rate = costPerThousand[coverageType] || 0.40;
    const annualIncrease = (increaseAmount / 1000) * rate;
    
    return {
      annual: Math.round(annualIncrease),
      monthly: Math.round(annualIncrease / 12),
      description: `Estimated $${Math.round(annualIncrease)} annually`
    };
  }

  /**
   * Calculate liability score
   */
  calculateLiabilityScore(risks) {
    if (risks.length === 0) return 0;
    
    const severityWeights = {
      critical: 30,
      high: 20,
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
    const totalRisks = risks.length;
    
    if (totalRisks === 0) {
      return 'Liability coverage appears adequate for your risk profile.';
    }
    
    if (criticalCount > 0) {
      return `${criticalCount} critical liability risks identified. Your assets may be significantly exposed.`;
    }
    
    if (highCount > 0) {
      return `${highCount} high-priority liability concerns found. Consider increasing coverage limits.`;
    }
    
    return `${totalRisks} liability considerations identified with opportunities for optimization.`;
  }
}

export default LiabilityAnalyzer;

