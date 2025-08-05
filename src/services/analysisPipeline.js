/**
 * Analysis Pipeline
 * Orchestrates the complete policy analysis workflow
 */

import documentProcessor from './documentProcessor.js';
import policyClassifier from './policyClassifier.js';
import riskEngine from './riskEngine.js';
import { generateEnhancedAnalysis } from './aiService.js';
import { ComprehensiveAnalysisResult } from '../models/AnalysisModels.js';
import { validatePolicyData, validateFileUpload } from '../utils/validation.js';
import { calculateConfidenceScore } from '../utils/riskScoring.js';

export class AnalysisPipeline {
  constructor() {
    this.stages = [
      'validation',
      'document_processing',
      'policy_classification',
      'risk_analysis',
      'ai_analysis',
      'result_compilation'
    ];
    
    this.currentStage = 0;
    this.stageProgress = {};
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Execute complete analysis pipeline
   * @param {File} file - Policy document file
   * @param {Object} policyData - Manual policy data input
   * @param {Object} userProfile - User profile data
   * @param {Function} progressCallback - Progress update callback
   * @returns {Promise<Object>} Complete analysis results
   */
  async executeAnalysis(file, policyData = {}, userProfile = {}, progressCallback = null) {
    try {
      this.reset();
      const analysisId = this.generateAnalysisId();
      
      this.updateProgress('validation', 0, 'Starting analysis validation...', progressCallback);
      
      // Stage 1: Validation
      const validationResult = await this.validateInputs(file, policyData, userProfile);
      if (!validationResult.success) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }
      this.updateProgress('validation', 100, 'Validation completed', progressCallback);

      // Stage 2: Document Processing
      this.updateProgress('document_processing', 0, 'Processing document...', progressCallback);
      const documentResult = await this.processDocument(file);
      this.updateProgress('document_processing', 100, 'Document processing completed', progressCallback);

      // Stage 3: Policy Classification
      this.updateProgress('policy_classification', 0, 'Classifying policy type...', progressCallback);
      const classificationResult = await this.classifyPolicy(documentResult, policyData);
      this.updateProgress('policy_classification', 100, 'Policy classification completed', progressCallback);

      // Stage 4: Risk Analysis
      this.updateProgress('risk_analysis', 0, 'Analyzing risks...', progressCallback);
      const riskResult = await this.analyzeRisks(documentResult, classificationResult, userProfile);
      this.updateProgress('risk_analysis', 100, 'Risk analysis completed', progressCallback);

      // Stage 5: AI Analysis
      this.updateProgress('ai_analysis', 0, 'Generating AI insights...', progressCallback);
      const aiResult = await this.generateAIAnalysis(documentResult, classificationResult, riskResult, userProfile);
      this.updateProgress('ai_analysis', 100, 'AI analysis completed', progressCallback);

      // Stage 6: Result Compilation
      this.updateProgress('result_compilation', 0, 'Compiling final results...', progressCallback);
      const finalResult = await this.compileResults(
        analysisId,
        documentResult,
        classificationResult,
        riskResult,
        aiResult,
        userProfile
      );
      this.updateProgress('result_compilation', 100, 'Analysis completed successfully', progressCallback);

      return {
        success: true,
        analysisId,
        result: finalResult,
        processingTime: Date.now() - this.startTime,
        stages: this.stageProgress,
        warnings: this.warnings
      };

    } catch (error) {
      console.error('Analysis pipeline failed:', error);
      
      return {
        success: false,
        error: error.message,
        analysisId: this.generateAnalysisId(),
        processingTime: Date.now() - this.startTime,
        stages: this.stageProgress,
        errors: this.errors,
        warnings: this.warnings,
        failedStage: this.stages[this.currentStage]
      };
    }
  }

  /**
   * Validate all inputs before processing
   */
  async validateInputs(file, policyData, userProfile) {
    const errors = [];
    const warnings = [];

    // File validation
    if (file) {
      const fileValidation = validateFileUpload(file);
      if (!fileValidation.isValid) {
        errors.push(...fileValidation.errors);
      }
      warnings.push(...fileValidation.warnings);
    }

    // Policy data validation (if provided)
    if (policyData && Object.keys(policyData).length > 0) {
      const policyValidation = validatePolicyData(policyData, policyData.coverageType || 'unknown');
      if (!policyValidation.isValid) {
        warnings.push(...policyValidation.errors); // Treat as warnings since manual data is optional
      }
      warnings.push(...policyValidation.warnings);
    }

    // Must have either file or policy data
    if (!file && (!policyData || Object.keys(policyData).length === 0)) {
      errors.push('Either a policy document file or manual policy data must be provided');
    }

    return {
      success: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Process uploaded document
   */
  async processDocument(file) {
    if (!file) {
      return {
        success: false,
        error: 'No file provided for processing'
      };
    }

    try {
      const result = await documentProcessor.processDocument(file);
      
      if (!result.success) {
        this.warnings.push(`Document processing warning: ${result.error}`);
        return {
          success: true,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extractedText: '',
          structuredData: {},
          processingWarning: result.error
        };
      }

      return result;

    } catch (error) {
      console.error('Document processing failed:', error);
      this.warnings.push(`Document processing failed: ${error.message}`);
      
      // Return minimal structure to allow pipeline to continue
      return {
        success: true,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedText: '',
        structuredData: {},
        processingError: error.message
      };
    }
  }

  /**
   * Classify policy type
   */
  async classifyPolicy(documentResult, policyData) {
    try {
      // Use manual policy data if available, otherwise use extracted text
      const textToClassify = documentResult.extractedText || '';
      const structuredData = {
        ...documentResult.structuredData,
        ...policyData
      };

      const result = policyClassifier.classifyPolicy(textToClassify, structuredData);
      
      if (!result.success) {
        this.warnings.push(`Policy classification warning: ${result.error}`);
        return {
          success: true,
          primaryType: policyData.coverageType || 'auto',
          confidence: 0.5,
          isConfident: false,
          method: 'fallback'
        };
      }

      return result;

    } catch (error) {
      console.error('Policy classification failed:', error);
      this.warnings.push(`Policy classification failed: ${error.message}`);
      
      return {
        success: true,
        primaryType: policyData.coverageType || 'auto',
        confidence: 0.3,
        isConfident: false,
        method: 'error-fallback',
        error: error.message
      };
    }
  }

  /**
   * Analyze risks
   */
  async analyzeRisks(documentResult, classificationResult, userProfile) {
    try {
      // Combine document data with manual input
      const policyData = {
        ...documentResult.structuredData,
        extractedText: documentResult.extractedText,
        fileName: documentResult.fileName,
        fileType: documentResult.fileType
      };

      const result = await riskEngine.analyzeRisks(policyData, classificationResult, userProfile);
      
      if (!result.success) {
        this.warnings.push(`Risk analysis warning: ${result.error}`);
        return this.createFallbackRiskAnalysis(classificationResult.primaryType);
      }

      return result;

    } catch (error) {
      console.error('Risk analysis failed:', error);
      this.warnings.push(`Risk analysis failed: ${error.message}`);
      
      return this.createFallbackRiskAnalysis(classificationResult.primaryType);
    }
  }

  /**
   * Generate AI analysis
   */
  async generateAIAnalysis(documentResult, classificationResult, riskResult, userProfile) {
    try {
      // Combine all data for AI analysis
      const policyData = {
        ...documentResult.structuredData,
        extractedText: documentResult.extractedText,
        fileName: documentResult.fileName,
        fileType: documentResult.fileType
      };

      const result = await generateEnhancedAnalysis(
        policyData,
        classificationResult,
        riskResult,
        userProfile
      );

      return {
        success: true,
        ...result
      };

    } catch (error) {
      console.error('AI analysis failed:', error);
      this.warnings.push(`AI analysis failed: ${error.message}`);
      
      return this.createFallbackAIAnalysis(classificationResult.primaryType, riskResult);
    }
  }

  /**
   * Compile final results
   */
  async compileResults(analysisId, documentResult, classificationResult, riskResult, aiResult, userProfile) {
    const comprehensiveResult = new ComprehensiveAnalysisResult({
      id: analysisId,
      documentAnalysis: documentResult,
      classificationAnalysis: classificationResult,
      riskAnalysis: riskResult,
      aiAnalysis: aiResult,
      analysisDate: new Date().toISOString()
    });

    // Calculate overall metrics
    comprehensiveResult.overallScore = this.calculateOverallScore(riskResult, aiResult);
    comprehensiveResult.overallRating = this.calculateOverallRating(comprehensiveResult.overallScore);
    comprehensiveResult.completeness = this.calculateCompleteness(documentResult, classificationResult, riskResult, aiResult);
    comprehensiveResult.reliability = this.calculateReliability(documentResult, classificationResult, riskResult);
    
    // Generate key insights
    comprehensiveResult.keyInsights = this.generateKeyInsights(riskResult, aiResult);
    
    // Prioritize recommendations
    comprehensiveResult.prioritizedRecommendations = this.prioritizeRecommendations(riskResult, aiResult);
    
    // Create action plan
    comprehensiveResult.actionPlan = this.createActionPlan(riskResult, aiResult);
    
    // Calculate confidence
    const confidenceData = {
      userProfile: userProfile || {},
      structuredData: documentResult.structuredData || {},
      aiAnalysisFailed: !aiResult.success,
      documentQuality: documentResult.success ? 'good' : 'poor',
      analyzersUsed: ['document', 'classification', 'risk', 'ai'].filter(a => 
        (a === 'document' && documentResult.success) ||
        (a === 'classification' && classificationResult.success) ||
        (a === 'risk' && riskResult.success) ||
        (a === 'ai' && aiResult.success)
      )
    };
    
    const confidenceScore = calculateConfidenceScore(confidenceData);
    comprehensiveResult.confidence = confidenceScore.score;
    comprehensiveResult.metadata.confidenceFactors = confidenceScore.factors;

    return comprehensiveResult;
  }

  /**
   * Helper methods
   */
  reset() {
    this.currentStage = 0;
    this.stageProgress = {};
    this.errors = [];
    this.warnings = [];
    this.startTime = Date.now();
  }

  generateAnalysisId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  updateProgress(stage, progress, message, callback) {
    this.stageProgress[stage] = { progress, message, timestamp: new Date().toISOString() };
    
    if (callback) {
      callback({
        stage,
        progress,
        message,
        overallProgress: this.calculateOverallProgress()
      });
    }
  }

  calculateOverallProgress() {
    const completedStages = Object.keys(this.stageProgress).length;
    const totalStages = this.stages.length;
    return Math.round((completedStages / totalStages) * 100);
  }

  calculateOverallScore(riskResult, aiResult) {
    let score = 75; // Base score
    
    if (riskResult.success) {
      // Adjust based on risk level
      const riskAdjustment = {
        minimal: 10,
        low: 5,
        medium: 0,
        high: -10,
        critical: -20
      };
      score += riskAdjustment[riskResult.riskLevel] || 0;
    }
    
    if (aiResult.success && aiResult.aiConfidence) {
      // Adjust based on AI confidence
      score += (aiResult.aiConfidence - 50) / 10;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  calculateOverallRating(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D+';
    if (score >= 55) return 'D';
    return 'F';
  }

  calculateCompleteness(documentResult, classificationResult, riskResult, aiResult) {
    let completeness = 0;
    
    if (documentResult.success) completeness += 25;
    if (classificationResult.success && classificationResult.isConfident) completeness += 25;
    if (riskResult.success) completeness += 25;
    if (aiResult.success) completeness += 25;
    
    return completeness;
  }

  calculateReliability(documentResult, classificationResult, riskResult) {
    let reliability = 100;
    
    if (!documentResult.success) reliability -= 30;
    if (!classificationResult.isConfident) reliability -= 20;
    if (!riskResult.success) reliability -= 25;
    
    return Math.max(0, reliability);
  }

  generateKeyInsights(riskResult, aiResult) {
    const insights = [];
    
    if (riskResult.success) {
      if (riskResult.criticalIssues.length > 0) {
        insights.push({
          type: 'critical',
          title: 'Critical Issues Identified',
          description: `${riskResult.criticalIssues.length} critical issues require immediate attention`,
          priority: 'high'
        });
      }
      
      if (riskResult.opportunities.length > 0) {
        insights.push({
          type: 'opportunity',
          title: 'Optimization Opportunities',
          description: `${riskResult.opportunities.length} opportunities identified for cost savings or improved coverage`,
          priority: 'medium'
        });
      }
    }
    
    if (aiResult.success && aiResult.keyFindings) {
      const criticalFindings = aiResult.keyFindings.filter(f => f.severity === 'critical');
      if (criticalFindings.length > 0) {
        insights.push({
          type: 'ai-insight',
          title: 'AI-Identified Concerns',
          description: `AI analysis identified ${criticalFindings.length} critical concerns`,
          priority: 'high'
        });
      }
    }
    
    return insights;
  }

  prioritizeRecommendations(riskResult, aiResult) {
    const recommendations = [];
    
    // Add risk-based recommendations
    if (riskResult.success && riskResult.recommendations) {
      recommendations.push(...riskResult.recommendations.map(rec => ({
        ...rec,
        source: 'risk-analysis'
      })));
    }
    
    // Add AI recommendations
    if (aiResult.success && aiResult.recommendations) {
      recommendations.push(...aiResult.recommendations.map(rec => ({
        ...rec,
        source: 'ai-analysis'
      })));
    }
    
    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return recommendations.sort((a, b) => 
      (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1)
    );
  }

  createActionPlan(riskResult, aiResult) {
    const actions = [];
    
    // Immediate actions from critical risks
    if (riskResult.success && riskResult.criticalIssues) {
      riskResult.criticalIssues.forEach(issue => {
        actions.push({
          id: `action-${issue.id}`,
          title: `Address ${issue.title}`,
          description: issue.description,
          priority: 'high',
          timeframe: 'immediate',
          category: 'risk-mitigation'
        });
      });
    }
    
    // High-priority recommendations
    const highPriorityRecs = this.prioritizeRecommendations(riskResult, aiResult)
      .filter(rec => rec.priority === 'high')
      .slice(0, 3);
    
    highPriorityRecs.forEach(rec => {
      actions.push({
        id: `action-rec-${rec.id || Date.now()}`,
        title: rec.title,
        description: rec.description,
        priority: 'medium',
        timeframe: 'short-term',
        category: 'improvement'
      });
    });
    
    return actions;
  }

  createFallbackRiskAnalysis(policyType) {
    return {
      success: true,
      overallRiskScore: 50,
      riskLevel: 'medium',
      riskFactors: [{
        id: 'fallback-risk',
        title: 'Analysis Incomplete',
        description: 'Risk analysis could not be completed with available data',
        severity: 'medium',
        category: 'general',
        recommendation: 'Provide additional policy details for comprehensive analysis'
      }],
      criticalIssues: [],
      opportunities: [],
      recommendations: [{
        id: 'fallback-rec',
        priority: 'medium',
        title: 'Complete Policy Review',
        description: 'Schedule a comprehensive policy review with your insurance agent',
        impact: 'Better understanding of coverage',
        costImpact: 'No immediate cost'
      }],
      complianceStatus: 'unknown',
      metadata: {
        fallback: true,
        reason: 'Insufficient data for complete analysis'
      }
    };
  }

  createFallbackAIAnalysis(policyType, riskResult) {
    return {
      success: true,
      summary: {
        overallRating: 'B',
        coverageScore: 75,
        riskLevel: riskResult.riskLevel || 'medium',
        recommendations: 1
      },
      keyFindings: [{
        type: 'general',
        severity: 'medium',
        title: 'AI Analysis Unavailable',
        description: 'AI analysis could not be completed but basic assessment is available',
        recommendation: 'Consider manual review with insurance professional'
      }],
      recommendations: [{
        priority: 'medium',
        title: 'Professional Review',
        description: 'Consult with an insurance professional for detailed analysis',
        impact: 'Comprehensive coverage assessment',
        costImpact: 'Consultation fee may apply'
      }],
      nextSteps: [
        'Review available analysis results',
        'Contact insurance agent for detailed review',
        'Consider policy comparison shopping'
      ],
      aiConfidence: 25,
      analysisMethod: 'fallback',
      metadata: {
        fallback: true,
        reason: 'AI analysis service unavailable'
      }
    };
  }
}

export default new AnalysisPipeline();

