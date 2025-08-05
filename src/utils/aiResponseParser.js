/**
 * AI Response Parser
 * Parses and structures AI-generated policy analysis responses
 */

/**
 * Parse AI response into structured format
 * @param {string} aiResponse - Raw AI response text
 * @param {Object} policy - Original policy data
 * @param {string} policyType - Type of insurance policy
 * @returns {Object} Structured analysis results
 */
export function parseAIResponse(aiResponse, policy, policyType) {
  try {
    // Initialize structured response
    const structuredResponse = {
      summary: extractSummary(aiResponse),
      keyFindings: extractKeyFindings(aiResponse),
      coverageBreakdown: extractCoverageBreakdown(aiResponse, policyType),
      recommendations: extractRecommendations(aiResponse),
      nextSteps: extractNextSteps(aiResponse),
      riskAssessment: extractRiskAssessment(aiResponse),
      costAnalysis: extractCostAnalysis(aiResponse),
      metadata: {
        originalResponse: aiResponse,
        parseDate: new Date().toISOString(),
        policyType,
        responseLength: aiResponse.length,
        confidence: calculateParsingConfidence(aiResponse)
      }
    };

    return structuredResponse;

  } catch (error) {
    console.error('AI response parsing failed:', error);
    return getFallbackStructure(aiResponse, policy, policyType);
  }
}

/**
 * Extract summary information from AI response
 */
function extractSummary(response) {
  const summary = {
    overallRating: 'B',
    coverageScore: 75,
    riskLevel: 'Medium',
    recommendations: 3
  };

  // Extract rating (A+, A, B+, B, C+, C, D, F)
  const ratingMatch = response.match(/(?:rating|grade|score).*?([A-F][+-]?)/i);
  if (ratingMatch) {
    summary.overallRating = ratingMatch[1];
  }

  // Extract percentage scores
  const scoreMatch = response.match(/(?:coverage|score).*?(\d{1,3})%/i);
  if (scoreMatch) {
    summary.coverageScore = parseInt(scoreMatch[1]);
  }

  // Extract risk level
  const riskMatch = response.match(/(?:risk level|risk).*?(low|medium|high|critical)/i);
  if (riskMatch) {
    summary.riskLevel = riskMatch[1].charAt(0).toUpperCase() + riskMatch[1].slice(1).toLowerCase();
  }

  // Count recommendations
  const recCount = (response.match(/recommend/gi) || []).length;
  summary.recommendations = Math.min(recCount, 10);

  return summary;
}

/**
 * Extract key findings from AI response
 */
function extractKeyFindings(response) {
  const findings = [];
  
  // Look for numbered lists or bullet points
  const patterns = [
    /(?:key findings?|findings?|issues?|concerns?)[\s\S]*?(?:\d+\.|\*|-)\s*([^\n]+)/gi,
    /(?:identified|found|discovered)[\s\S]*?([^\n.]+(?:gap|risk|issue|concern)[^\n.]*)/gi,
    /(?:critical|high|medium|low)[\s\S]*?([^\n.]+)/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(response)) !== null && findings.length < 5) {
      const finding = match[1].trim();
      if (finding.length > 20 && !findings.some(f => f.title.includes(finding.substring(0, 20)))) {
        findings.push({
          type: determineFindingType(finding),
          severity: determineSeverity(finding),
          title: extractTitle(finding),
          description: finding,
          recommendation: extractRecommendationFromFinding(finding)
        });
      }
    }
  }

  // If no findings found, create generic ones
  if (findings.length === 0) {
    findings.push({
      type: 'gap',
      severity: 'medium',
      title: 'Coverage Review Needed',
      description: 'Policy requires detailed review to identify potential gaps.',
      recommendation: 'Conduct comprehensive coverage analysis.'
    });
  }

  return findings.slice(0, 5);
}

/**
 * Extract coverage breakdown from AI response
 */
function extractCoverageBreakdown(response, policyType) {
  const breakdown = [];
  
  // Policy type specific coverage categories
  const coverageCategories = {
    auto: ['Liability', 'Collision', 'Comprehensive', 'Uninsured Motorist'],
    home: ['Dwelling', 'Personal Property', 'Liability', 'Additional Living Expenses'],
    renters: ['Personal Property', 'Liability', 'Additional Living Expenses'],
    life: ['Death Benefit', 'Cash Value', 'Riders'],
    health: ['Deductible', 'Out-of-Pocket Max', 'Network Coverage', 'Prescription Drugs']
  };

  const categories = coverageCategories[policyType] || ['Primary Coverage', 'Secondary Coverage', 'Additional Coverage'];

  for (const category of categories) {
    // Look for mentions of this coverage type
    const categoryRegex = new RegExp(`${category}[^\\n]*`, 'i');
    const match = response.match(categoryRegex);
    
    if (match) {
      const text = match[0];
      breakdown.push({
        category,
        current: extractCurrentValue(text),
        recommended: extractRecommendedValue(text),
        status: determineStatus(text)
      });
    } else {
      // Default entry if not found
      breakdown.push({
        category,
        current: 'Not specified',
        recommended: 'Review needed',
        status: 'review'
      });
    }
  }

  return breakdown;
}

/**
 * Extract recommendations from AI response
 */
function extractRecommendations(response) {
  const recommendations = [];
  
  // Look for recommendation patterns
  const patterns = [
    /(?:recommend|suggest|advise|should)[\s\S]*?([^\n.]+)/gi,
    /(?:\d+\.)\s*([^.\n]+(?:increase|decrease|add|remove|consider)[^.\n]*)/gi,
    /(?:action|step)[\s\S]*?([^\n.]+)/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(response)) !== null && recommendations.length < 6) {
      const recText = match[1].trim();
      if (recText.length > 15 && !recommendations.some(r => r.title.includes(recText.substring(0, 15)))) {
        recommendations.push({
          priority: determinePriority(recText),
          title: extractTitle(recText),
          impact: extractImpact(recText),
          costImpact: extractCostImpact(recText),
          description: recText
        });
      }
    }
  }

  // Ensure we have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Policy Review',
      impact: 'Improved coverage understanding',
      costImpact: 'No immediate cost',
      description: 'Review policy terms and coverage details with your agent.'
    });
  }

  return recommendations.slice(0, 6);
}

/**
 * Extract next steps from AI response
 */
function extractNextSteps(response) {
  const steps = [];
  
  // Look for step patterns
  const stepPatterns = [
    /(?:next steps?|steps?|actions?)[\s\S]*?(?:\d+\.|\*|-)\s*([^\n]+)/gi,
    /(?:should|need to|must)[\s\S]*?([^\n.]+)/gi
  ];

  for (const pattern of stepPatterns) {
    let match;
    while ((match = pattern.exec(response)) !== null && steps.length < 6) {
      const step = match[1].trim();
      if (step.length > 10 && !steps.includes(step)) {
        steps.push(step);
      }
    }
  }

  // Default steps if none found
  if (steps.length === 0) {
    steps.push(
      'Review analysis results with your insurance agent',
      'Compare current coverage with recommendations',
      'Get quotes for suggested coverage changes',
      'Schedule annual policy review'
    );
  }

  return steps.slice(0, 6);
}

/**
 * Extract risk assessment from AI response
 */
function extractRiskAssessment(response) {
  return {
    overallRisk: extractRiskLevel(response),
    riskFactors: extractRiskFactors(response),
    mitigation: extractMitigationStrategies(response)
  };
}

/**
 * Extract cost analysis from AI response
 */
function extractCostAnalysis(response) {
  const costs = {
    currentPremium: null,
    estimatedChanges: [],
    potentialSavings: null,
    costBenefit: 'Analysis needed'
  };

  // Extract dollar amounts
  const dollarMatches = response.match(/\$[\d,]+/g);
  if (dollarMatches) {
    costs.estimatedChanges = dollarMatches.slice(0, 3);
  }

  // Look for savings mentions
  const savingsMatch = response.match(/sav(?:e|ing).*?\$?([\d,]+)/i);
  if (savingsMatch) {
    costs.potentialSavings = savingsMatch[1];
  }

  return costs;
}

/**
 * Helper functions for extraction
 */
function determineFindingType(text) {
  if (text.toLowerCase().includes('gap')) return 'gap';
  if (text.toLowerCase().includes('risk')) return 'risk';
  if (text.toLowerCase().includes('opportunity')) return 'opportunity';
  return 'general';
}

function determineSeverity(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('critical') || lowerText.includes('urgent')) return 'critical';
  if (lowerText.includes('high') || lowerText.includes('important')) return 'high';
  if (lowerText.includes('medium') || lowerText.includes('moderate')) return 'medium';
  return 'low';
}

function determinePriority(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('immediate') || lowerText.includes('urgent')) return 'high';
  if (lowerText.includes('soon') || lowerText.includes('important')) return 'medium';
  return 'low';
}

function extractTitle(text) {
  // Extract first meaningful phrase (up to 50 characters)
  const title = text.split(/[.!?]/)[0].trim();
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
}

function extractRecommendationFromFinding(text) {
  const recMatch = text.match(/(?:recommend|suggest|should|consider)([^.]+)/i);
  return recMatch ? recMatch[1].trim() : 'Review with insurance professional';
}

function extractCurrentValue(text) {
  const valueMatch = text.match(/current[ly]?.*?\$?([\d,]+)/i);
  return valueMatch ? `$${valueMatch[1]}` : 'Not specified';
}

function extractRecommendedValue(text) {
  const valueMatch = text.match(/recommend.*?\$?([\d,]+)/i);
  return valueMatch ? `$${valueMatch[1]}` : 'Review needed';
}

function determineStatus(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('adequate') || lowerText.includes('sufficient')) return 'adequate';
  if (lowerText.includes('insufficient') || lowerText.includes('low')) return 'insufficient';
  if (lowerText.includes('missing') || lowerText.includes('absent')) return 'missing';
  return 'review';
}

function extractRiskLevel(response) {
  const riskMatch = response.match(/(?:overall|total|general).*?risk.*?(low|medium|high|critical)/i);
  return riskMatch ? riskMatch[1] : 'medium';
}

function extractRiskFactors(response) {
  const factors = [];
  const riskPattern = /risk.*?([^\n.]+)/gi;
  let match;
  
  while ((match = riskPattern.exec(response)) !== null && factors.length < 3) {
    factors.push(match[1].trim());
  }
  
  return factors;
}

function extractMitigationStrategies(response) {
  const strategies = [];
  const mitigationPattern = /(?:mitigat|reduc|prevent).*?([^\n.]+)/gi;
  let match;
  
  while ((match = mitigationPattern.exec(response)) !== null && strategies.length < 3) {
    strategies.push(match[1].trim());
  }
  
  return strategies;
}

function extractImpact(text) {
  const impactMatch = text.match(/(?:impact|effect|result).*?([^\n.]+)/i);
  return impactMatch ? impactMatch[1].trim() : 'Improved protection';
}

function extractCostImpact(text) {
  const costMatch = text.match(/(?:cost|price|premium).*?([^\n.]+)/i);
  return costMatch ? costMatch[1].trim() : 'Cost varies';
}

function calculateParsingConfidence(response) {
  let confidence = 50; // Base confidence
  
  // Increase confidence for structured content
  if (response.includes('1.') || response.includes('•')) confidence += 20;
  if (response.includes('recommend')) confidence += 15;
  if (response.includes('$')) confidence += 10;
  if (response.length > 1000) confidence += 15;
  
  return Math.min(100, confidence);
}

function getFallbackStructure(response, policy, policyType) {
  return {
    summary: {
      overallRating: 'B',
      coverageScore: 75,
      riskLevel: 'Medium',
      recommendations: 1
    },
    keyFindings: [{
      type: 'general',
      severity: 'medium',
      title: 'Analysis Available',
      description: 'AI analysis completed but requires manual review.',
      recommendation: 'Review full analysis text for details.'
    }],
    coverageBreakdown: [{
      category: 'General Coverage',
      current: 'See analysis',
      recommended: 'Review needed',
      status: 'review'
    }],
    recommendations: [{
      priority: 'medium',
      title: 'Review Analysis',
      impact: 'Better understanding',
      costImpact: 'No immediate cost',
      description: 'Review the complete analysis for detailed insights.'
    }],
    nextSteps: ['Review complete analysis', 'Consult with insurance professional'],
    riskAssessment: {
      overallRisk: 'medium',
      riskFactors: ['Requires detailed review'],
      mitigation: ['Professional consultation recommended']
    },
    costAnalysis: {
      currentPremium: null,
      estimatedChanges: [],
      potentialSavings: null,
      costBenefit: 'Analysis needed'
    },
    metadata: {
      originalResponse: response,
      parseDate: new Date().toISOString(),
      policyType,
      responseLength: response.length,
      confidence: 25,
      fallback: true
    }
  };
}

export default {
  parseAIResponse,
  extractSummary,
  extractKeyFindings,
  extractRecommendations
};

