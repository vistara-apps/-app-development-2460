/**
 * AI Prompt Templates
 * Specialized prompts for different insurance policy types
 */

/**
 * Get prompt template for specific policy type
 * @param {string} policyType - Type of insurance policy
 * @param {Object} context - Context data including policy, classification, and risk analysis
 * @returns {string} Formatted prompt
 */
export function getPromptTemplate(policyType, context) {
  const { policy, classification, riskAnalysis } = context;
  
  const baseContext = formatPolicyContext(policy);
  const riskContext = formatRiskContext(riskAnalysis);
  
  const templates = {
    auto: getAutoInsurancePrompt(baseContext, riskContext),
    home: getHomeInsurancePrompt(baseContext, riskContext),
    renters: getRentersInsurancePrompt(baseContext, riskContext),
    life: getLifeInsurancePrompt(baseContext, riskContext),
    health: getHealthInsurancePrompt(baseContext, riskContext),
    disability: getDisabilityInsurancePrompt(baseContext, riskContext),
    umbrella: getUmbrellaInsurancePrompt(baseContext, riskContext),
    business: getBusinessInsurancePrompt(baseContext, riskContext)
  };
  
  return templates[policyType] || getGenericPrompt(baseContext, riskContext);
}

/**
 * Format policy context for prompts
 */
function formatPolicyContext(policy) {
  return `
Policy Information:
- Type: ${policy.coverageType || 'Not specified'}
- Provider: ${policy.insuranceProvider || 'Not specified'}
- Policy Number: ${policy.policyNumber || 'Not specified'}
- Coverage Limits: ${policy.limits || 'Not specified'}
- Deductible: ${policy.deductible || 'Not specified'}
- Renewal Date: ${policy.renewalDate || 'Not specified'}
- Premium: ${policy.premium || 'Not specified'}

Extracted Data:
${policy.structuredData ? Object.entries(policy.structuredData)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n') : 'No structured data available'}

Document Analysis:
- File Type: ${policy.fileType || 'Unknown'}
- Processing Status: ${policy.processingStatus || 'Unknown'}
`;
}

/**
 * Format risk analysis context
 */
function formatRiskContext(riskAnalysis) {
  if (!riskAnalysis || !riskAnalysis.success) {
    return 'Risk analysis not available or failed.';
  }
  
  return `
Risk Analysis Results:
- Overall Risk Score: ${riskAnalysis.overallRiskScore}/100
- Risk Level: ${riskAnalysis.riskLevel}
- Critical Issues: ${riskAnalysis.criticalIssues?.length || 0}
- High Priority Recommendations: ${riskAnalysis.recommendations?.filter(r => r.priority === 'high').length || 0}

Top Risk Factors:
${riskAnalysis.riskFactors?.slice(0, 3).map(risk => 
  `- ${risk.title} (${risk.severity}): ${risk.description}`
).join('\n') || 'None identified'}
`;
}

/**
 * Auto Insurance Prompt Template
 */
function getAutoInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this auto insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Coverage Adequacy Assessment**
   - Bodily injury liability limits vs. recommended minimums
   - Property damage liability sufficiency
   - Collision and comprehensive coverage evaluation
   - Uninsured/underinsured motorist protection

2. **Risk Factors Analysis**
   - Geographic risk factors (if location known)
   - Vehicle-specific risks (age, value, safety features)
   - Driver profile risks (age, experience, record)
   - Usage patterns (commuting, mileage, parking)

3. **Coverage Gaps Identification**
   - Missing essential coverages
   - Insufficient coverage limits
   - Deductible appropriateness
   - Rental car and roadside assistance needs

4. **Cost Optimization Opportunities**
   - Deductible optimization for premium savings
   - Discount opportunities (multi-policy, safety features, etc.)
   - Coverage adjustments based on vehicle value
   - Alternative coverage options

5. **Specific Recommendations**
   - Immediate actions needed
   - Coverage limit adjustments
   - Additional coverage considerations
   - Policy shopping recommendations

6. **Risk Mitigation Strategies**
   - Defensive driving courses
   - Vehicle safety improvements
   - Usage pattern modifications
   - Claim prevention tips

Provide specific dollar amounts, percentages, and actionable steps where possible.
`;
}

/**
 * Home Insurance Prompt Template
 */
function getHomeInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this homeowners insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Dwelling Coverage Analysis**
   - Replacement cost vs. market value
   - Coverage adequacy for rebuilding
   - Construction cost inflation considerations
   - Special features and upgrades coverage

2. **Personal Property Protection**
   - Coverage limits vs. actual belongings value
   - High-value items coverage needs
   - Replacement cost vs. actual cash value
   - Off-premises coverage adequacy

3. **Liability Coverage Assessment**
   - Personal liability limits appropriateness
   - Medical payments coverage
   - Additional structures coverage
   - Home business liability gaps

4. **Natural Disaster and Peril Coverage**
   - Standard perils coverage review
   - Flood insurance needs assessment
   - Earthquake coverage considerations
   - Wind/hail deductible analysis

5. **Additional Living Expenses**
   - Coverage duration and limits
   - Temporary housing cost estimates
   - Loss of use scenarios
   - Fair rental value coverage

6. **Risk Reduction Recommendations**
   - Home security improvements
   - Maintenance and upkeep priorities
   - Natural disaster preparedness
   - Liability risk mitigation

Include specific coverage amounts, deductible recommendations, and cost-benefit analyses.
`;
}

/**
 * Renters Insurance Prompt Template
 */
function getRentersInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this renters insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Personal Property Coverage**
   - Coverage limits vs. belongings inventory
   - High-value items protection
   - Replacement cost vs. actual cash value
   - Off-premises coverage scenarios

2. **Liability Protection**
   - Personal liability coverage adequacy
   - Medical payments to others
   - Damage to rented premises coverage
   - Guest injury protection

3. **Additional Living Expenses**
   - Temporary housing coverage limits
   - Duration of coverage
   - Alternative accommodation costs
   - Loss of use scenarios

4. **Coverage Gaps and Enhancements**
   - Identity theft protection
   - Business property coverage
   - Valuable items scheduling
   - Pet liability coverage

5. **Cost Optimization**
   - Deductible selection strategies
   - Multi-policy discount opportunities
   - Coverage bundling benefits
   - Premium reduction techniques

6. **Renter-Specific Risks**
   - Neighbor damage scenarios
   - Theft and burglary protection
   - Water damage from upstairs units
   - Building code compliance issues

Provide practical recommendations for renters' unique situations and risks.
`;
}

/**
 * Life Insurance Prompt Template
 */
function getLifeInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this life insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Coverage Adequacy Analysis**
   - Death benefit sufficiency for dependents
   - Income replacement calculations
   - Debt coverage assessment
   - Future financial obligations

2. **Policy Type Evaluation**
   - Term vs. permanent insurance appropriateness
   - Cash value component analysis (if applicable)
   - Premium structure and affordability
   - Conversion options and flexibility

3. **Beneficiary and Ownership Review**
   - Beneficiary designation appropriateness
   - Contingent beneficiary needs
   - Ownership structure optimization
   - Estate planning considerations

4. **Riders and Additional Benefits**
   - Accidental death benefit evaluation
   - Waiver of premium rider needs
   - Disability income rider assessment
   - Long-term care rider considerations

5. **Premium and Cost Analysis**
   - Premium competitiveness
   - Cost per thousand analysis
   - Premium payment options
   - Policy loan implications (if applicable)

6. **Life Stage Appropriateness**
   - Current life situation alignment
   - Future needs projection
   - Policy adjustment recommendations
   - Supplemental coverage needs

Include specific coverage amount recommendations and premium optimization strategies.
`;
}

/**
 * Health Insurance Prompt Template
 */
function getHealthInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this health insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Coverage Structure Analysis**
   - Deductible appropriateness
   - Out-of-pocket maximum evaluation
   - Copayment and coinsurance structure
   - Network provider adequacy

2. **Essential Health Benefits Review**
   - Preventive care coverage
   - Emergency services protection
   - Prescription drug coverage
   - Mental health and substance abuse benefits

3. **Provider Network Assessment**
   - Primary care physician availability
   - Specialist access and referral requirements
   - Hospital network quality and proximity
   - Out-of-network cost implications

4. **Cost Management Strategies**
   - HSA/FSA optimization opportunities
   - Generic vs. brand name drug costs
   - Preventive care utilization
   - Telemedicine benefits usage

5. **Coverage Gaps and Limitations**
   - Exclusions and limitations review
   - Pre-existing condition considerations
   - Waiting periods and restrictions
   - International coverage needs

6. **Plan Optimization Recommendations**
   - Plan type suitability (HMO, PPO, EPO)
   - Deductible and premium balance
   - Supplemental insurance needs
   - Annual enrollment considerations

Provide specific cost calculations and healthcare utilization strategies.
`;
}

/**
 * Disability Insurance Prompt Template
 */
function getDisabilityInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this disability insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Benefit Amount Adequacy**
   - Income replacement percentage
   - Monthly benefit vs. expenses
   - Cost of living adjustments
   - Tax implications of benefits

2. **Definition of Disability**
   - Own occupation vs. any occupation
   - Partial disability benefits
   - Residual benefits availability
   - Return to work incentives

3. **Benefit Period and Elimination Period**
   - Short-term vs. long-term coverage
   - Elimination period appropriateness
   - Benefit duration adequacy
   - Coordination with other benefits

4. **Policy Features and Riders**
   - Future increase options
   - Cost of living adjustments
   - Rehabilitation benefits
   - Survivor benefits

5. **Exclusions and Limitations**
   - Pre-existing condition exclusions
   - Mental health limitations
   - Substance abuse exclusions
   - High-risk activity exclusions

6. **Coverage Optimization**
   - Group vs. individual coverage
   - Supplemental coverage needs
   - Premium payment options
   - Policy portability considerations

Include specific benefit calculations and income protection strategies.
`;
}

/**
 * Umbrella Insurance Prompt Template
 */
function getUmbrellaInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this umbrella insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Coverage Limit Adequacy**
   - Asset protection analysis
   - Income protection considerations
   - Liability exposure assessment
   - Coverage limit recommendations

2. **Underlying Insurance Requirements**
   - Auto liability minimum requirements
   - Homeowners liability requirements
   - Coverage coordination analysis
   - Gap coverage identification

3. **Coverage Scope Analysis**
   - Personal liability coverage
   - Property damage liability
   - Legal defense cost coverage
   - Worldwide coverage provisions

4. **Exclusions and Limitations**
   - Business activity exclusions
   - Professional liability exclusions
   - Intentional acts exclusions
   - Criminal acts exclusions

5. **Cost-Benefit Analysis**
   - Premium vs. coverage value
   - Risk exposure reduction
   - Peace of mind benefits
   - Alternative risk management

6. **Asset Protection Strategy**
   - High net worth considerations
   - Professional liability needs
   - Social media liability risks
   - Volunteer activity coverage

Provide specific asset protection recommendations and coverage optimization strategies.
`;
}

/**
 * Business Insurance Prompt Template
 */
function getBusinessInsurancePrompt(policyContext, riskContext) {
  return `
Analyze this business insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **General Liability Coverage**
   - Coverage limits adequacy
   - Product liability protection
   - Professional liability needs
   - Premises liability coverage

2. **Property Coverage Analysis**
   - Building coverage adequacy
   - Equipment and inventory protection
   - Business personal property limits
   - Extra expense coverage

3. **Business Interruption Protection**
   - Income loss coverage
   - Extra expense provisions
   - Waiting period appropriateness
   - Extended period of indemnity

4. **Workers Compensation**
   - Coverage adequacy by state
   - Classification accuracy
   - Experience modification factors
   - Return-to-work programs

5. **Cyber Liability Assessment**
   - Data breach coverage
   - Business interruption from cyber events
   - Regulatory fines and penalties
   - Third-party liability coverage

6. **Industry-Specific Risks**
   - Professional liability needs
   - Employment practices liability
   - Directors and officers coverage
   - Commercial auto requirements

Include specific coverage recommendations and risk management strategies for the business type.
`;
}

/**
 * Generic Insurance Prompt Template
 */
function getGenericPrompt(policyContext, riskContext) {
  return `
Analyze this insurance policy and provide a comprehensive assessment:

${policyContext}

${riskContext}

Please provide a detailed analysis focusing on:

1. **Coverage Analysis**
   - Coverage adequacy assessment
   - Limits and deductibles evaluation
   - Coverage gaps identification
   - Policy terms review

2. **Risk Assessment**
   - Risk factors identification
   - Exposure analysis
   - Mitigation strategies
   - Prevention recommendations

3. **Cost Optimization**
   - Premium analysis
   - Deductible optimization
   - Discount opportunities
   - Coverage adjustments

4. **Recommendations**
   - Immediate actions needed
   - Coverage improvements
   - Policy modifications
   - Alternative options

5. **Next Steps**
   - Priority actions
   - Timeline for changes
   - Professional consultations
   - Regular review schedule

Provide specific, actionable recommendations based on the available policy information.
`;
}

export default {
  getPromptTemplate,
  formatPolicyContext,
  formatRiskContext
};

