/**
 * Policy Types Configuration
 * Defines supported insurance policy types and their classification criteria
 */

export const POLICY_TYPES = {
  auto: {
    label: 'Auto Insurance',
    category: 'vehicle',
    requiredKeywords: ['auto', 'vehicle', 'car', 'automobile', 'motor'],
    optionalKeywords: [
      'liability', 'collision', 'comprehensive', 'uninsured motorist',
      'bodily injury', 'property damage', 'personal injury protection',
      'medical payments', 'rental', 'towing', 'roadside'
    ],
    exclusionKeywords: ['home', 'house', 'property', 'life', 'health', 'business'],
    structuredPatterns: {
      policyType: ['auto', 'vehicle', 'car', 'motor'],
      coverageType: ['auto', 'vehicle', 'automobile']
    },
    commonCoverages: [
      'Bodily Injury Liability',
      'Property Damage Liability',
      'Collision Coverage',
      'Comprehensive Coverage',
      'Uninsured/Underinsured Motorist',
      'Personal Injury Protection',
      'Medical Payments'
    ]
  },

  home: {
    label: 'Home Insurance',
    category: 'property',
    requiredKeywords: ['home', 'house', 'dwelling', 'homeowner', 'property'],
    optionalKeywords: [
      'structure', 'personal property', 'liability', 'additional living expenses',
      'medical payments', 'fire', 'theft', 'vandalism', 'weather',
      'replacement cost', 'actual cash value', 'deductible'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'car', 'life', 'health', 'business'],
    structuredPatterns: {
      policyType: ['home', 'homeowner', 'dwelling', 'property'],
      coverageType: ['home', 'homeowner', 'property']
    },
    commonCoverages: [
      'Dwelling Coverage',
      'Personal Property Coverage',
      'Liability Coverage',
      'Additional Living Expenses',
      'Medical Payments to Others',
      'Other Structures Coverage'
    ]
  },

  renters: {
    label: 'Renters Insurance',
    category: 'property',
    requiredKeywords: ['renter', 'tenant', 'rental', 'apartment'],
    optionalKeywords: [
      'personal property', 'liability', 'additional living expenses',
      'medical payments', 'theft', 'fire', 'vandalism',
      'replacement cost', 'actual cash value'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'car', 'life', 'health', 'homeowner'],
    structuredPatterns: {
      policyType: ['renter', 'tenant', 'rental'],
      coverageType: ['renter', 'tenant']
    },
    commonCoverages: [
      'Personal Property Coverage',
      'Liability Coverage',
      'Additional Living Expenses',
      'Medical Payments to Others'
    ]
  },

  life: {
    label: 'Life Insurance',
    category: 'life',
    requiredKeywords: ['life', 'death', 'beneficiary', 'mortality'],
    optionalKeywords: [
      'term', 'whole', 'universal', 'variable', 'premium',
      'death benefit', 'cash value', 'rider', 'accidental death',
      'disability waiver', 'convertible'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'home', 'property', 'health'],
    structuredPatterns: {
      policyType: ['life', 'term life', 'whole life', 'universal life'],
      coverageType: ['life']
    },
    commonCoverages: [
      'Death Benefit',
      'Accidental Death Benefit',
      'Waiver of Premium',
      'Cash Value (if applicable)',
      'Conversion Options'
    ]
  },

  health: {
    label: 'Health Insurance',
    category: 'health',
    requiredKeywords: ['health', 'medical', 'healthcare', 'hmo', 'ppo'],
    optionalKeywords: [
      'deductible', 'copay', 'coinsurance', 'out-of-pocket',
      'prescription', 'preventive', 'emergency', 'specialist',
      'network', 'provider', 'claim', 'benefit'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'home', 'property', 'life'],
    structuredPatterns: {
      policyType: ['health', 'medical', 'hmo', 'ppo', 'epo'],
      coverageType: ['health', 'medical']
    },
    commonCoverages: [
      'Preventive Care',
      'Emergency Services',
      'Hospitalization',
      'Prescription Drugs',
      'Mental Health Services',
      'Maternity Care'
    ]
  },

  disability: {
    label: 'Disability Insurance',
    category: 'income',
    requiredKeywords: ['disability', 'income protection', 'wage replacement'],
    optionalKeywords: [
      'short term', 'long term', 'benefit period', 'elimination period',
      'partial disability', 'residual benefits', 'cost of living',
      'own occupation', 'any occupation'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'home', 'property', 'life', 'health'],
    structuredPatterns: {
      policyType: ['disability', 'income protection'],
      coverageType: ['disability']
    },
    commonCoverages: [
      'Short-term Disability',
      'Long-term Disability',
      'Partial Disability Benefits',
      'Residual Benefits',
      'Cost of Living Adjustments'
    ]
  },

  umbrella: {
    label: 'Umbrella Insurance',
    category: 'liability',
    requiredKeywords: ['umbrella', 'excess liability', 'personal liability'],
    optionalKeywords: [
      'liability', 'coverage', 'excess', 'additional', 'protection',
      'lawsuit', 'judgment', 'settlement', 'defense costs'
    ],
    exclusionKeywords: ['auto', 'vehicle', 'home', 'life', 'health'],
    structuredPatterns: {
      policyType: ['umbrella', 'excess liability', 'personal liability'],
      coverageType: ['umbrella', 'liability']
    },
    commonCoverages: [
      'Personal Liability Coverage',
      'Property Damage Liability',
      'Legal Defense Costs',
      'Worldwide Coverage'
    ]
  },

  business: {
    label: 'Business Insurance',
    category: 'commercial',
    requiredKeywords: ['business', 'commercial', 'general liability', 'professional'],
    optionalKeywords: [
      'property', 'liability', 'workers compensation', 'cyber',
      'errors and omissions', 'directors and officers', 'employment practices',
      'business interruption', 'equipment', 'inventory'
    ],
    exclusionKeywords: ['personal', 'individual', 'family'],
    structuredPatterns: {
      policyType: ['business', 'commercial', 'general liability'],
      coverageType: ['business', 'commercial']
    },
    commonCoverages: [
      'General Liability',
      'Property Coverage',
      'Business Interruption',
      'Workers Compensation',
      'Professional Liability',
      'Cyber Liability'
    ]
  }
};

export const CLASSIFICATION_KEYWORDS = {
  // High-confidence indicators
  definitive: {
    auto: ['auto insurance', 'car insurance', 'vehicle insurance', 'motor insurance'],
    home: ['homeowners insurance', 'home insurance', 'dwelling insurance'],
    renters: ['renters insurance', 'tenant insurance', 'rental insurance'],
    life: ['life insurance', 'term life', 'whole life', 'universal life'],
    health: ['health insurance', 'medical insurance', 'healthcare plan'],
    disability: ['disability insurance', 'income protection', 'wage replacement'],
    umbrella: ['umbrella insurance', 'excess liability', 'personal umbrella'],
    business: ['business insurance', 'commercial insurance', 'general liability']
  },

  // Coverage-specific terms
  coverageTerms: {
    auto: [
      'bodily injury liability', 'property damage liability', 'collision coverage',
      'comprehensive coverage', 'uninsured motorist', 'underinsured motorist',
      'personal injury protection', 'medical payments coverage'
    ],
    home: [
      'dwelling coverage', 'personal property coverage', 'liability coverage',
      'additional living expenses', 'other structures coverage', 'medical payments to others'
    ],
    health: [
      'deductible', 'copayment', 'coinsurance', 'out-of-pocket maximum',
      'network provider', 'prescription drug coverage', 'preventive care'
    ]
  },

  // Risk indicators
  riskFactors: {
    high: ['high risk', 'previous claims', 'multiple violations', 'poor credit'],
    medium: ['moderate risk', 'some claims history', 'average profile'],
    low: ['low risk', 'no claims', 'good driving record', 'excellent credit']
  }
};

export const POLICY_CATEGORIES = {
  vehicle: ['auto'],
  property: ['home', 'renters'],
  life: ['life'],
  health: ['health'],
  income: ['disability'],
  liability: ['umbrella'],
  commercial: ['business']
};

export default {
  POLICY_TYPES,
  CLASSIFICATION_KEYWORDS,
  POLICY_CATEGORIES
};

