/**
 * Analysis Data Models
 * Standardized data structures for policy analysis results
 */

/**
 * Base Analysis Result Model
 */
export class BaseAnalysisResult {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.policyId = data.policyId || '';
    this.analysisType = data.analysisType || 'comprehensive';
    this.analysisDate = data.analysisDate || new Date().toISOString();
    this.version = data.version || '1.0.0';
    this.status = data.status || 'completed'; // pending, in-progress, completed, failed
    this.confidence = data.confidence || 0;
    this.metadata = data.metadata || {};
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  isComplete() {
    return this.status === 'completed';
  }

  getAge() {
    return Date.now() - new Date(this.analysisDate).getTime();
  }

  isStale(maxAgeMs = 30 * 24 * 60 * 60 * 1000) { // 30 days default
    return this.getAge() > maxAgeMs;
  }
}

/**
 * Risk Analysis Result Model
 */
export class RiskAnalysisResult extends BaseAnalysisResult {
  constructor(data = {}) {
    super(data);
    this.analysisType = 'risk';
    
    this.overallRiskScore = data.overallRiskScore || 0;
    this.riskLevel = data.riskLevel || 'unknown'; // minimal, low, medium, high, critical
    this.riskFactors = data.riskFactors || [];
    this.criticalIssues = data.criticalIssues || [];
    this.opportunities = data.opportunities || [];
    this.complianceStatus = data.complianceStatus || 'unknown';
    
    // Risk categories breakdown
    this.riskCategories = {
      coverageGaps: data.riskCategories?.coverageGaps || [],
      liabilityLimits: data.riskCategories?.liabilityLimits || [],
      deductibleRisks: data.riskCategories?.deductibleRisks || [],
      policyTerms: data.riskCategories?.policyTerms || [],
      compliance: data.riskCategories?.compliance || [],
      ...data.riskCategories
    };
    
    // Financial impact
    this.financialImpact = {
      potentialLoss: data.financialImpact?.potentialLoss || 0,
      potentialSavings: data.financialImpact?.potentialSavings || 0,
      costToFix: data.financialImpact?.costToFix || 0,
      ...data.financialImpact
    };
  }

  addRiskFactor(riskFactor) {
    const risk = new RiskFactor(riskFactor);
    this.riskFactors.push(risk);
    
    // Update critical issues if high severity
    if (risk.severity === 'critical' || risk.severity === 'high') {
      this.criticalIssues.push({
        id: risk.id,
        title: risk.title,
        severity: risk.severity,
        category: risk.category
      });
    }
    
    return risk;
  }

  getRisksByCategory(category) {
    return this.riskFactors.filter(risk => risk.category === category);
  }

  getRisksBySeverity(severity) {
    return this.riskFactors.filter(risk => risk.severity === severity);
  }

  getCriticalRisksCount() {
    return this.getRisksBySeverity('critical').length;
  }

  getHighRisksCount() {
    return this.getRisksBySeverity('high').length;
  }

  getTotalFinancialExposure() {
    return this.financialImpact.potentialLoss || 0;
  }

  getNetFinancialImpact() {
    return (this.financialImpact.potentialSavings || 0) - (this.financialImpact.costToFix || 0);
  }
}

/**
 * Risk Factor Model
 */
export class RiskFactor {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || 'general';
    this.severity = data.severity || 'low'; // minimal, low, medium, high, critical
    this.urgency = data.urgency || 'medium'; // low, medium, high, immediate
    this.type = data.type || 'risk'; // risk, gap, opportunity, compliance
    this.source = data.source || 'analysis'; // analysis, ai, manual, external
    
    this.recommendation = data.recommendation || '';
    this.potentialImpact = data.potentialImpact || '';
    this.mitigation = data.mitigation || '';
    
    // Financial data
    this.estimatedCost = data.estimatedCost || null;
    this.potentialSavings = data.potentialSavings || null;
    this.probabilityScore = data.probabilityScore || null; // 0-100
    
    // Metadata
    this.tags = data.tags || [];
    this.relatedRisks = data.relatedRisks || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  isCritical() {
    return this.severity === 'critical';
  }

  isHighPriority() {
    return this.severity === 'critical' || this.severity === 'high';
  }

  requiresImmediateAction() {
    return this.urgency === 'immediate';
  }

  getFinancialImpact() {
    if (this.type === 'opportunity' && this.potentialSavings) {
      return this.potentialSavings;
    }
    if (this.estimatedCost) {
      return -this.estimatedCost;
    }
    return 0;
  }
}

/**
 * AI Analysis Result Model
 */
export class AIAnalysisResult extends BaseAnalysisResult {
  constructor(data = {}) {
    super(data);
    this.analysisType = 'ai';
    
    this.model = data.model || '';
    this.prompt = data.prompt || '';
    this.rawResponse = data.rawResponse || '';
    this.parsedResponse = data.parsedResponse || {};
    
    // Analysis components
    this.summary = data.summary || {};
    this.keyFindings = data.keyFindings || [];
    this.recommendations = data.recommendations || [];
    this.nextSteps = data.nextSteps || [];
    
    // AI-specific metrics
    this.aiConfidence = data.aiConfidence || 0;
    this.responseTime = data.responseTime || 0;
    this.tokenUsage = data.tokenUsage || {};
    this.processingErrors = data.processingErrors || [];
  }

  addFinding(finding) {
    this.keyFindings.push({
      id: this.generateId(),
      type: finding.type || 'general',
      severity: finding.severity || 'medium',
      title: finding.title || '',
      description: finding.description || '',
      recommendation: finding.recommendation || '',
      ...finding
    });
  }

  addRecommendation(recommendation) {
    this.recommendations.push({
      id: this.generateId(),
      priority: recommendation.priority || 'medium',
      title: recommendation.title || '',
      description: recommendation.description || '',
      impact: recommendation.impact || '',
      costImpact: recommendation.costImpact || '',
      ...recommendation
    });
  }

  getHighPriorityRecommendations() {
    return this.recommendations.filter(rec => rec.priority === 'high');
  }

  getCriticalFindings() {
    return this.keyFindings.filter(finding => finding.severity === 'critical');
  }
}

/**
 * Document Analysis Result Model
 */
export class DocumentAnalysisResult extends BaseAnalysisResult {
  constructor(data = {}) {
    super(data);
    this.analysisType = 'document';
    
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    
    // Extraction results
    this.extractedText = data.extractedText || '';
    this.structuredData = data.structuredData || {};
    this.extractionMethod = data.extractionMethod || '';
    this.extractionConfidence = data.extractionConfidence || 0;
    
    // Document quality metrics
    this.documentQuality = data.documentQuality || 'unknown'; // poor, fair, good, excellent
    this.readabilityScore = data.readabilityScore || 0;
    this.completenessScore = data.completenessScore || 0;
    
    // Processing details
    this.processingTime = data.processingTime || 0;
    this.processingErrors = data.processingErrors || [];
  }

  getExtractedValue(key) {
    return this.structuredData[key] || null;
  }

  hasExtractedData() {
    return Object.keys(this.structuredData).length > 0;
  }

  isHighQuality() {
    return this.documentQuality === 'good' || this.documentQuality === 'excellent';
  }

  getTextLength() {
    return this.extractedText.length;
  }
}

/**
 * Policy Classification Result Model
 */
export class PolicyClassificationResult extends BaseAnalysisResult {
  constructor(data = {}) {
    super(data);
    this.analysisType = 'classification';
    
    this.primaryType = data.primaryType || 'unknown';
    this.confidence = data.confidence || 0;
    this.isConfident = data.isConfident || false;
    
    this.allClassifications = data.allClassifications || [];
    this.suggestedTypes = data.suggestedTypes || [];
    
    // Classification details
    this.method = data.method || 'keyword-matching';
    this.keywordsFound = data.keywordsFound || [];
    this.patternsMatched = data.patternsMatched || [];
    
    // Validation
    this.userValidation = data.userValidation || null;
    this.accuracyFeedback = data.accuracyFeedback || null;
  }

  isHighConfidence() {
    return this.confidence >= 0.8;
  }

  getAlternativeTypes() {
    return this.allClassifications
      .filter(c => c.type !== this.primaryType)
      .slice(0, 3);
  }

  setUserValidation(actualType, isCorrect) {
    this.userValidation = {
      actualType,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    
    this.accuracyFeedback = isCorrect ? 'correct' : 'incorrect';
  }
}

/**
 * Comprehensive Analysis Result Model
 */
export class ComprehensiveAnalysisResult extends BaseAnalysisResult {
  constructor(data = {}) {
    super(data);
    this.analysisType = 'comprehensive';
    
    // Component analyses
    this.documentAnalysis = data.documentAnalysis || null;
    this.classificationAnalysis = data.classificationAnalysis || null;
    this.riskAnalysis = data.riskAnalysis || null;
    this.aiAnalysis = data.aiAnalysis || null;
    
    // Combined results
    this.overallScore = data.overallScore || 0;
    this.overallRating = data.overallRating || 'B';
    this.keyInsights = data.keyInsights || [];
    this.prioritizedRecommendations = data.prioritizedRecommendations || [];
    this.actionPlan = data.actionPlan || [];
    
    // Quality metrics
    this.completeness = data.completeness || 0;
    this.reliability = data.reliability || 0;
    this.dataQuality = data.dataQuality || 'fair';
  }

  hasAllComponents() {
    return !!(this.documentAnalysis && 
              this.classificationAnalysis && 
              this.riskAnalysis && 
              this.aiAnalysis);
  }

  getComponentCount() {
    let count = 0;
    if (this.documentAnalysis) count++;
    if (this.classificationAnalysis) count++;
    if (this.riskAnalysis) count++;
    if (this.aiAnalysis) count++;
    return count;
  }

  getHighestPriorityActions() {
    return this.actionPlan
      .filter(action => action.priority === 'high')
      .slice(0, 3);
  }

  getCriticalIssuesCount() {
    return this.riskAnalysis?.getCriticalRisksCount() || 0;
  }

  getTotalRecommendationsCount() {
    let total = 0;
    if (this.riskAnalysis) total += this.riskAnalysis.riskFactors.length;
    if (this.aiAnalysis) total += this.aiAnalysis.recommendations.length;
    return total;
  }
}

/**
 * Analysis Factory
 */
export class AnalysisFactory {
  static createAnalysis(type, data) {
    switch (type.toLowerCase()) {
      case 'risk':
        return new RiskAnalysisResult(data);
      case 'ai':
        return new AIAnalysisResult(data);
      case 'document':
        return new DocumentAnalysisResult(data);
      case 'classification':
        return new PolicyClassificationResult(data);
      case 'comprehensive':
        return new ComprehensiveAnalysisResult(data);
      default:
        return new BaseAnalysisResult({ ...data, analysisType: type });
    }
  }

  static getSupportedTypes() {
    return ['risk', 'ai', 'document', 'classification', 'comprehensive'];
  }
}

export default {
  BaseAnalysisResult,
  RiskAnalysisResult,
  RiskFactor,
  AIAnalysisResult,
  DocumentAnalysisResult,
  PolicyClassificationResult,
  ComprehensiveAnalysisResult,
  AnalysisFactory
};

