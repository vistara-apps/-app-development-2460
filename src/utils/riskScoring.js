/**
 * Risk Scoring Utilities
 * Provides functions for calculating and aggregating risk scores
 */

/**
 * Calculate overall risk score from aggregated risk factors
 * @param {Array} riskFactors - Array of risk factor objects
 * @returns {number} Overall risk score (0-100)
 */
export function calculateRiskScore(riskFactors) {
  if (!riskFactors || riskFactors.length === 0) {
    return 0;
  }

  // Severity weights
  const severityWeights = {
    critical: 25,
    high: 20,
    medium: 15,
    low: 10,
    minimal: 5
  };

  // Category multipliers (some categories are more important)
  const categoryMultipliers = {
    coverage_gaps: 1.2,
    liability_limits: 1.1,
    deductible_risks: 0.9,
    policy_terms: 0.8,
    compliance: 1.3,
    financial_risk: 1.1,
    opportunity: 0.5 // Opportunities are less critical
  };

  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const risk of riskFactors) {
    const severityWeight = severityWeights[risk.severity] || 10;
    const categoryMultiplier = categoryMultipliers[risk.category] || 1.0;
    
    const riskScore = severityWeight * categoryMultiplier;
    totalScore += riskScore;
    
    // Calculate max possible score for normalization
    maxPossibleScore += severityWeights.critical * 1.3; // Assume worst case
  }

  // Normalize to 0-100 scale
  if (maxPossibleScore === 0) return 0;
  
  const normalizedScore = (totalScore / maxPossibleScore) * 100;
  return Math.min(100, Math.max(0, Math.round(normalizedScore)));
}

/**
 * Aggregate risk factors by category
 * @param {Array} riskFactors - Array of risk factor objects
 * @returns {Object} Risk factors grouped by category with scores
 */
export function aggregateRiskFactors(riskFactors) {
  const aggregated = {};
  
  for (const risk of riskFactors) {
    const category = risk.category || 'general';
    
    if (!aggregated[category]) {
      aggregated[category] = {
        risks: [],
        totalScore: 0,
        highestSeverity: 'low',
        count: 0
      };
    }
    
    aggregated[category].risks.push(risk);
    aggregated[category].count++;
    
    // Update highest severity
    const severityOrder = ['minimal', 'low', 'medium', 'high', 'critical'];
    const currentIndex = severityOrder.indexOf(aggregated[category].highestSeverity);
    const riskIndex = severityOrder.indexOf(risk.severity);
    
    if (riskIndex > currentIndex) {
      aggregated[category].highestSeverity = risk.severity;
    }
    
    // Add to category score
    const severityWeights = { critical: 25, high: 20, medium: 15, low: 10, minimal: 5 };
    aggregated[category].totalScore += severityWeights[risk.severity] || 10;
  }
  
  return aggregated;
}

/**
 * Calculate risk trend based on historical data
 * @param {Array} currentRisks - Current risk factors
 * @param {Array} previousRisks - Previous risk factors (optional)
 * @returns {Object} Risk trend analysis
 */
export function calculateRiskTrend(currentRisks, previousRisks = []) {
  const currentScore = calculateRiskScore(currentRisks);
  const previousScore = calculateRiskScore(previousRisks);
  
  const scoreDifference = currentScore - previousScore;
  let trend = 'stable';
  let trendDescription = 'Risk level remains stable';
  
  if (scoreDifference > 10) {
    trend = 'increasing';
    trendDescription = 'Risk level has increased significantly';
  } else if (scoreDifference < -10) {
    trend = 'decreasing';
    trendDescription = 'Risk level has decreased significantly';
  } else if (Math.abs(scoreDifference) > 5) {
    trend = scoreDifference > 0 ? 'slightly_increasing' : 'slightly_decreasing';
    trendDescription = `Risk level has ${scoreDifference > 0 ? 'slightly increased' : 'slightly decreased'}`;
  }
  
  return {
    trend,
    trendDescription,
    currentScore,
    previousScore,
    scoreDifference,
    percentageChange: previousScore > 0 ? Math.round((scoreDifference / previousScore) * 100) : 0
  };
}

/**
 * Generate risk priority matrix
 * @param {Array} riskFactors - Array of risk factor objects
 * @returns {Object} Risk factors organized by priority matrix
 */
export function generateRiskPriorityMatrix(riskFactors) {
  const matrix = {
    immediate: [], // Critical severity, high urgency
    high: [],      // High severity or critical with medium urgency
    medium: [],    // Medium severity or high with low urgency
    low: []        // Low severity or opportunities
  };
  
  for (const risk of riskFactors) {
    const severity = risk.severity || 'low';
    const urgency = risk.urgency || 'medium';
    
    if (severity === 'critical' && urgency === 'immediate') {
      matrix.immediate.push(risk);
    } else if (severity === 'critical' || (severity === 'high' && urgency === 'high')) {
      matrix.high.push(risk);
    } else if (severity === 'high' || severity === 'medium') {
      matrix.medium.push(risk);
    } else {
      matrix.low.push(risk);
    }
  }
  
  return matrix;
}

/**
 * Calculate financial impact score
 * @param {Array} riskFactors - Array of risk factor objects
 * @returns {Object} Financial impact analysis
 */
export function calculateFinancialImpact(riskFactors) {
  let potentialLoss = 0;
  let potentialSavings = 0;
  let costToFix = 0;
  
  for (const risk of riskFactors) {
    // Extract financial values from risk descriptions
    if (risk.potentialImpact && typeof risk.potentialImpact === 'string') {
      const lossMatch = risk.potentialImpact.match(/\$([0-9,]+)/);
      if (lossMatch) {
        potentialLoss += parseInt(lossMatch[1].replace(/,/g, ''));
      }
    }
    
    if (risk.potentialSavings) {
      potentialSavings += risk.potentialSavings;
    }
    
    if (risk.costImpact && typeof risk.costImpact === 'object' && risk.costImpact.annual) {
      costToFix += risk.costImpact.annual;
    }
  }
  
  return {
    potentialLoss,
    potentialSavings,
    costToFix,
    netImpact: potentialSavings - costToFix,
    riskExposure: potentialLoss,
    summary: generateFinancialSummary(potentialLoss, potentialSavings, costToFix)
  };
}

/**
 * Generate financial impact summary
 */
function generateFinancialSummary(potentialLoss, potentialSavings, costToFix) {
  const netBenefit = potentialSavings - costToFix;
  
  if (potentialLoss > 50000) {
    return `High financial exposure of $${potentialLoss.toLocaleString()} identified`;
  }
  
  if (netBenefit > 500) {
    return `Potential net savings of $${netBenefit.toLocaleString()} annually`;
  }
  
  if (potentialLoss > 10000) {
    return `Moderate financial exposure of $${potentialLoss.toLocaleString()}`;
  }
  
  return 'Financial impact appears manageable';
}

/**
 * Calculate confidence score for risk analysis
 * @param {Object} analysisData - Analysis metadata
 * @returns {Object} Confidence assessment
 */
export function calculateConfidenceScore(analysisData) {
  let confidenceScore = 100;
  const factors = [];
  
  // Reduce confidence based on missing data
  if (!analysisData.userProfile || Object.keys(analysisData.userProfile).length < 3) {
    confidenceScore -= 20;
    factors.push('Limited user profile data');
  }
  
  if (!analysisData.structuredData || Object.keys(analysisData.structuredData).length < 5) {
    confidenceScore -= 15;
    factors.push('Limited policy data extraction');
  }
  
  if (analysisData.aiAnalysisFailed) {
    confidenceScore -= 25;
    factors.push('AI analysis unavailable');
  }
  
  if (analysisData.documentQuality === 'poor') {
    confidenceScore -= 30;
    factors.push('Poor document quality');
  }
  
  // Increase confidence for comprehensive analysis
  if (analysisData.analyzersUsed && analysisData.analyzersUsed.length >= 3) {
    confidenceScore += 10;
    factors.push('Multiple analyzers used');
  }
  
  confidenceScore = Math.max(0, Math.min(100, confidenceScore));
  
  let confidenceLevel = 'low';
  if (confidenceScore >= 80) confidenceLevel = 'high';
  else if (confidenceScore >= 60) confidenceLevel = 'medium';
  
  return {
    score: confidenceScore,
    level: confidenceLevel,
    factors,
    description: generateConfidenceDescription(confidenceLevel, confidenceScore)
  };
}

/**
 * Generate confidence description
 */
function generateConfidenceDescription(level, score) {
  const descriptions = {
    high: `High confidence (${score}%) - Analysis based on comprehensive data and multiple verification methods`,
    medium: `Medium confidence (${score}%) - Analysis based on available data with some limitations`,
    low: `Low confidence (${score}%) - Analysis limited by data availability or quality issues`
  };
  
  return descriptions[level] || `Confidence score: ${score}%`;
}

/**
 * Export all functions as default object
 */
export default {
  calculateRiskScore,
  aggregateRiskFactors,
  calculateRiskTrend,
  generateRiskPriorityMatrix,
  calculateFinancialImpact,
  calculateConfidenceScore
};

