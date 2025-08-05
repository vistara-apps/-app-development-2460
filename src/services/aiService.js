import OpenAI from 'openai';
import { getPromptTemplate } from './promptTemplates.js';
import { parseAIResponse } from '../utils/aiResponseParser.js';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generatePolicyAnalysis = async (policy, policyClassification, riskAnalysis) => {
  try {
    const policyType = policyClassification?.primaryType || policy.coverageType || 'auto';
    
    // Get specialized prompt for policy type
    const prompt = getPromptTemplate(policyType, {
      policy,
      classification: policyClassification,
      riskAnalysis
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(policyType)
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the AI response with enhanced parser
    const parsedAnalysis = parseAIResponse(analysis, policy, policyType);
    
    // Add confidence scoring
    const confidenceScore = calculateAIConfidence(analysis, policy);
    
    return {
      ...parsedAnalysis,
      aiConfidence: confidenceScore,
      analysisMethod: 'ai-enhanced',
      model: 'google/gemini-2.0-flash-001',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw error;
  }
};

/**
 * Generate enhanced policy analysis using multiple AI calls
 */
export const generateEnhancedAnalysis = async (policy, policyClassification, riskAnalysis, userProfile) => {
  try {
    const policyType = policyClassification?.primaryType || 'auto';
    
    // Step 1: Basic policy analysis
    const basicAnalysis = await generatePolicyAnalysis(policy, policyClassification, riskAnalysis);
    
    // Step 2: Risk-specific analysis
    const riskSpecificAnalysis = await generateRiskSpecificAnalysis(policy, riskAnalysis, policyType);
    
    // Step 3: Personalized recommendations
    const personalizedRecs = await generatePersonalizedRecommendations(policy, userProfile, policyType);
    
    // Combine all analyses
    return combineAnalyses(basicAnalysis, riskSpecificAnalysis, personalizedRecs);
    
  } catch (error) {
    console.error('Enhanced AI Analysis failed:', error);
    // Fallback to basic analysis
    return await generatePolicyAnalysis(policy, policyClassification, riskAnalysis);
  }
};

/**
 * Generate risk-specific analysis
 */
async function generateRiskSpecificAnalysis(policy, riskAnalysis, policyType) {
  if (!riskAnalysis || !riskAnalysis.success) {
    return null;
  }

  const prompt = `
  Based on the following risk analysis results, provide specific insights and recommendations:
  
  Risk Analysis Summary:
  - Overall Risk Score: ${riskAnalysis.overallRiskScore}/100
  - Risk Level: ${riskAnalysis.riskLevel}
  - Critical Issues: ${riskAnalysis.criticalIssues?.length || 0}
  - Total Risk Factors: ${riskAnalysis.riskFactors?.length || 0}
  
  Key Risk Factors:
  ${riskAnalysis.riskFactors?.slice(0, 5).map(risk => 
    `- ${risk.title}: ${risk.description} (Severity: ${risk.severity})`
  ).join('\n') || 'None identified'}
  
  Please provide:
  1. Risk prioritization and urgency assessment
  2. Specific actions to mitigate top 3 risks
  3. Cost-benefit analysis of recommended changes
  4. Timeline for implementing changes
  5. Potential consequences of inaction
  
  Focus on actionable, specific recommendations.
  `;

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are a risk management specialist. Provide specific, actionable risk mitigation strategies."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2,
  });

  return {
    riskInsights: completion.choices[0].message.content,
    analysisType: 'risk-specific',
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate personalized recommendations
 */
async function generatePersonalizedRecommendations(policy, userProfile, policyType) {
  if (!userProfile || Object.keys(userProfile).length === 0) {
    return null;
  }

  const prompt = `
  Based on the user profile and policy information, provide personalized recommendations:
  
  User Profile:
  - Age: ${userProfile.age || 'Not specified'}
  - Income: ${userProfile.income ? '$' + userProfile.income.toLocaleString() : 'Not specified'}
  - Assets: ${userProfile.assets ? '$' + userProfile.assets.toLocaleString() : 'Not specified'}
  - Family Status: ${userProfile.familyStatus || 'Not specified'}
  - Risk Tolerance: ${userProfile.riskTolerance || 'Not specified'}
  - Location: ${userProfile.location || 'Not specified'}
  
  Policy Type: ${policyType}
  
  Please provide:
  1. Life stage appropriate recommendations
  2. Income and asset protection strategies
  3. Family-specific considerations
  4. Location-based risk factors
  5. Risk tolerance alignment
  6. Long-term planning suggestions
  
  Make recommendations specific to their personal situation.
  `;

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are a personal insurance advisor. Provide tailored advice based on individual circumstances."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
  });

  return {
    personalizedInsights: completion.choices[0].message.content,
    analysisType: 'personalized',
    timestamp: new Date().toISOString()
  };
}

/**
 * Get system prompt based on policy type
 */
function getSystemPrompt(policyType) {
  const basePrompt = "You are an expert insurance analyst with 20+ years of experience. Provide detailed, actionable insights about insurance policies.";
  
  const specializations = {
    auto: "You specialize in auto insurance, including liability, collision, comprehensive, and uninsured motorist coverage.",
    home: "You specialize in homeowners insurance, including dwelling, personal property, liability, and additional living expenses coverage.",
    renters: "You specialize in renters insurance, focusing on personal property protection and liability coverage.",
    life: "You specialize in life insurance, including term, whole, and universal life policies.",
    health: "You specialize in health insurance, including HMO, PPO, and high-deductible health plans.",
    business: "You specialize in commercial insurance, including general liability, property, and workers compensation."
  };
  
  return basePrompt + " " + (specializations[policyType] || "");
}

/**
 * Calculate AI confidence score
 */
function calculateAIConfidence(analysis, policy) {
  let confidence = 100;
  
  // Reduce confidence for short responses
  if (analysis.length < 500) confidence -= 20;
  
  // Reduce confidence if missing key elements
  if (!analysis.includes('recommendation')) confidence -= 15;
  if (!analysis.includes('risk')) confidence -= 10;
  if (!analysis.includes('coverage')) confidence -= 10;
  
  // Reduce confidence for generic responses
  if (!policy.policyNumber && analysis.includes('Policy Number')) confidence -= 5;
  
  return Math.max(0, Math.min(100, confidence));
}

/**
 * Combine multiple analyses
 */
function combineAnalyses(basicAnalysis, riskAnalysis, personalizedAnalysis) {
  return {
    ...basicAnalysis,
    enhancedInsights: {
      riskSpecific: riskAnalysis,
      personalized: personalizedAnalysis
    },
    analysisMethod: 'multi-stage-ai',
    completeness: calculateCompleteness(basicAnalysis, riskAnalysis, personalizedAnalysis)
  };
}

/**
 * Calculate analysis completeness
 */
function calculateCompleteness(basic, risk, personalized) {
  let score = 60; // Base score for basic analysis
  
  if (risk) score += 25;
  if (personalized) score += 15;
  
  return Math.min(100, score);
}

const parseAIAnalysis = (analysis, policy) => {
  // This is a simplified parser - in a real app, you'd want more sophisticated parsing
  // For now, we'll return a structured mock response based on the AI analysis
  
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
        title: 'Potential Coverage Gap Identified',
        description: `Based on the analysis of your ${policy.coverageType} policy, there may be insufficient coverage for your risk profile.`,
        recommendation: 'Consider increasing coverage limits or adding supplementary protection.'
      },
      {
        type: 'risk',
        severity: 'medium',
        title: 'Deductible Risk Assessment',
        description: 'Current deductible levels may pose financial risk in case of claims.',
        recommendation: 'Evaluate if current deductible aligns with your financial capacity.'
      },
      {
        type: 'opportunity',
        severity: 'low',
        title: 'Cost Optimization Opportunity',
        description: 'Potential savings identified through policy adjustments or provider comparison.',
        recommendation: 'Review policy terms and compare with market alternatives.'
      }
    ],
    coverageBreakdown: [
      { category: 'Primary Coverage', current: policy.limits || 'Not specified', recommended: 'Review needed', status: 'review' },
      { category: 'Deductible', current: policy.deductible || 'Not specified', recommended: 'Optimize', status: 'optimize' },
      { category: 'Additional Coverage', current: 'Unknown', recommended: 'Assess needs', status: 'assess' }
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Review Coverage Limits',
        impact: 'Ensures adequate protection',
        costImpact: 'Varies',
        description: 'Assess if current coverage limits meet your needs and risk exposure.'
      },
      {
        priority: 'medium',
        title: 'Optimize Deductible',
        impact: 'Balance cost vs. risk',
        costImpact: 'Potential savings',
        description: 'Find the right balance between premium costs and out-of-pocket expenses.'
      },
      {
        priority: 'low',
        title: 'Compare Market Options',
        impact: 'Potential cost savings',
        costImpact: 'Up to 20% savings',
        description: 'Regular market comparison ensures competitive rates and coverage.'
      }
    ],
    nextSteps: [
      'Review detailed analysis report',
      'Contact insurance provider for clarifications',
      'Compare with alternative providers',
      'Schedule annual policy review'
    ]
  };
};
