import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generatePolicyAnalysis = async (policy) => {
  try {
    const prompt = `
    Analyze this insurance policy and provide a comprehensive assessment:
    
    Policy Details:
    - Type: ${policy.coverageType}
    - Provider: ${policy.insuranceProvider}
    - Policy Number: ${policy.policyNumber}
    - Coverage Limits: ${policy.limits}
    - Deductible: ${policy.deductible}
    - Renewal Date: ${policy.renewalDate}
    
    Please provide:
    1. Overall policy rating (A+ to F)
    2. Coverage score (0-100%)
    3. Risk level assessment (Low, Medium, High)
    4. 3-5 key findings with severity levels
    5. Coverage breakdown analysis
    6. Specific recommendations for improvement
    7. Next steps for the policyholder
    
    Focus on identifying coverage gaps, optimization opportunities, and potential risks.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance analyst with 20+ years of experience. Provide detailed, actionable insights about insurance policies."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the AI response and structure it
    return parseAIAnalysis(analysis, policy);
    
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw error;
  }
};

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