// PolicyAI Monetization Configuration
// This file contains all pricing, plans, and revenue model configurations

export const PRICING_PLANS = {
  // Free Tier
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Get started with basic policy analysis',
    limits: {
      analysesPerMonth: 1,
      features: ['basic-analysis', 'coverage-gaps', 'email-support'],
      users: 1,
      storage: '100MB',
      apiCalls: 0
    },
    target: 'Individual',
    popular: false
  },

  // Consumer Tiers
  'personal-pro': {
    id: 'personal-pro',
    name: 'Personal Pro',
    price: 29,
    yearlyPrice: 290, // 17% discount
    period: 'month',
    description: 'Perfect for individuals and families',
    limits: {
      analysesPerMonth: 5,
      features: [
        'advanced-analysis',
        'ai-insights',
        'renewal-reminders',
        'savings-recommendations',
        'priority-email-support',
        'mobile-app'
      ],
      users: 1,
      storage: '1GB',
      apiCalls: 0
    },
    target: 'Individual',
    popular: false,
    savings: 'Save vs $9.99 per analysis'
  },

  'business-pro': {
    id: 'business-pro',
    name: 'Business Pro',
    price: 79,
    yearlyPrice: 790, // 17% discount
    period: 'month',
    description: 'Ideal for small businesses and teams',
    limits: {
      analysesPerMonth: 20,
      features: [
        'multi-policy-management',
        'team-collaboration',
        'business-risk-assessment',
        'compliance-tracking',
        'phone-support',
        'custom-reporting'
      ],
      users: 5,
      storage: '10GB',
      apiCalls: 100
    },
    target: 'Small Business',
    popular: true,
    savings: 'Most popular choice'
  },

  // Professional Tiers
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 149,
    yearlyPrice: 1490, // 17% discount
    period: 'month',
    description: 'For insurance agents and brokers',
    limits: {
      analysesPerMonth: 100,
      features: [
        'client-management',
        'white-label-reports',
        'limited-api-access',
        'lead-generation',
        'priority-support',
        'training-resources'
      ],
      users: 10,
      storage: '50GB',
      apiCalls: 1000
    },
    target: 'Professional',
    popular: false,
    savings: 'Best for professionals'
  },

  // Enterprise (Custom Pricing)
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999, // Starting price
    period: 'month',
    description: 'Custom solutions for large organizations',
    limits: {
      analysesPerMonth: 'unlimited',
      features: [
        'unlimited-analysis',
        'advanced-api-access',
        'custom-integrations',
        'dedicated-account-manager',
        'sla-guarantees',
        'custom-branding',
        'advanced-analytics',
        'compliance-certifications'
      ],
      users: 'unlimited',
      storage: 'unlimited',
      apiCalls: 'unlimited'
    },
    target: 'Enterprise',
    popular: false,
    customPricing: true
  },

  // White Label
  'white-label': {
    id: 'white-label',
    name: 'White Label',
    price: 2499, // Starting price
    period: 'month',
    description: 'Full platform licensing for partners',
    limits: {
      analysesPerMonth: 'unlimited',
      features: [
        'full-platform-licensing',
        'custom-branding',
        'custom-domain',
        'api-integration-support',
        'dedicated-infrastructure',
        'custom-feature-development',
        'revenue-sharing-options'
      ],
      users: 'unlimited',
      storage: 'unlimited',
      apiCalls: 'unlimited'
    },
    target: 'Partner',
    popular: false,
    customPricing: true
  }
};

// Usage-Based Pricing Options
export const USAGE_PRICING = {
  'pay-per-analysis': {
    id: 'pay-per-analysis',
    name: 'Pay Per Analysis',
    price: 9.99,
    description: 'Perfect for occasional users',
    features: [
      'no-monthly-commitment',
      'full-analysis-features',
      '30-day-result-access',
      'email-support'
    ]
  },

  'volume-10': {
    id: 'volume-10',
    name: '10 Analysis Pack',
    price: 79,
    pricePerAnalysis: 7.90,
    savings: 0.20, // 20% savings
    validityMonths: 6,
    description: 'Great for trying out the service',
    features: [
      'valid-6-months',
      'full-analysis-features',
      'priority-email-support',
      '20-percent-savings'
    ]
  },

  'volume-25': {
    id: 'volume-25',
    name: '25 Analysis Pack',
    price: 179,
    pricePerAnalysis: 7.16,
    savings: 0.28, // 28% savings
    validityMonths: 12,
    description: 'Popular choice for small businesses',
    features: [
      'valid-12-months',
      'full-analysis-features',
      'priority-support',
      '28-percent-savings'
    ],
    popular: true
  },

  'volume-50': {
    id: 'volume-50',
    name: '50 Analysis Pack',
    price: 299,
    pricePerAnalysis: 5.98,
    savings: 0.40, // 40% savings
    validityMonths: 12,
    description: 'Best value for regular users',
    features: [
      'valid-12-months',
      'full-analysis-features',
      'priority-support',
      '40-percent-savings'
    ]
  }
};

// Revenue Streams Configuration
export const REVENUE_STREAMS = {
  subscriptions: {
    name: 'Subscription Revenue',
    description: 'Monthly and yearly recurring subscriptions',
    percentage: 70, // Expected percentage of total revenue
    plans: ['personal-pro', 'business-pro', 'professional', 'enterprise']
  },

  usage: {
    name: 'Usage-Based Revenue',
    description: 'Pay-per-analysis and volume packs',
    percentage: 15,
    plans: ['pay-per-analysis', 'volume-10', 'volume-25', 'volume-50']
  },

  enterprise: {
    name: 'Enterprise & Custom Solutions',
    description: 'Custom pricing for large organizations',
    percentage: 10,
    plans: ['enterprise', 'white-label']
  },

  partnerships: {
    name: 'Partnership Revenue',
    description: 'API licensing, affiliates, and integrations',
    percentage: 5,
    sources: ['api-licensing', 'affiliate-commissions', 'integration-fees']
  }
};

// Customer Acquisition Configuration
export const ACQUISITION_STRATEGY = {
  channels: {
    organic: {
      name: 'Organic Growth',
      cost: 0,
      expectedPercentage: 30,
      methods: ['seo', 'content-marketing', 'referrals']
    },
    
    paidAdvertising: {
      name: 'Paid Advertising',
      cost: 50, // Cost per acquisition
      expectedPercentage: 40,
      methods: ['google-ads', 'facebook-ads', 'linkedin-ads']
    },
    
    partnerships: {
      name: 'Partnerships',
      cost: 25, // Cost per acquisition
      expectedPercentage: 20,
      methods: ['insurance-agents', 'fintech-integrations', 'affiliate-program']
    },
    
    directSales: {
      name: 'Direct Sales',
      cost: 200, // Cost per acquisition
      expectedPercentage: 10,
      methods: ['enterprise-sales', 'demos', 'conferences']
    }
  },

  conversionRates: {
    freeToPersonalPro: 0.15, // 15% of free users upgrade to Personal Pro
    freeToBusinessPro: 0.05, // 5% of free users upgrade to Business Pro
    personalProToBusiness: 0.10, // 10% of Personal Pro users upgrade
    businessToEnterprise: 0.02, // 2% of Business users upgrade to Enterprise
    trialToSubscription: 0.25 // 25% of trial users convert to paid
  }
};

// Pricing Strategy Configuration
export const PRICING_STRATEGY = {
  freemium: {
    enabled: true,
    freeFeatures: ['basic-analysis', 'coverage-gaps', 'email-support'],
    upgradeIncentives: ['advanced-analysis', 'unlimited-policies', 'priority-support']
  },

  discounts: {
    yearly: 0.17, // 17% discount for yearly billing
    volume: {
      10: 0.20, // 20% discount for 10-pack
      25: 0.28, // 28% discount for 25-pack
      50: 0.40  // 40% discount for 50-pack
    },
    enterprise: 0.15, // 15% discount for enterprise deals
    student: 0.50 // 50% discount for students (if implemented)
  },

  trials: {
    duration: 14, // 14-day free trial
    features: 'all', // Access to all features during trial
    creditCardRequired: false
  },

  guarantees: {
    moneyBack: 30, // 30-day money-back guarantee
    sla: {
      uptime: 99.9, // 99.9% uptime guarantee for Enterprise
      responseTime: 24 // 24-hour response time for Enterprise
    }
  }
};

// Market Segmentation
export const MARKET_SEGMENTS = {
  individual: {
    name: 'Individual Consumers',
    size: 'Large',
    willingness_to_pay: 'Low-Medium',
    preferred_plans: ['free', 'personal-pro'],
    acquisition_cost: 25,
    lifetime_value: 400
  },

  smallBusiness: {
    name: 'Small Businesses',
    size: 'Medium',
    willingness_to_pay: 'Medium',
    preferred_plans: ['business-pro'],
    acquisition_cost: 75,
    lifetime_value: 1200
  },

  professionals: {
    name: 'Insurance Professionals',
    size: 'Small',
    willingness_to_pay: 'High',
    preferred_plans: ['professional'],
    acquisition_cost: 150,
    lifetime_value: 2500
  },

  enterprise: {
    name: 'Enterprise Clients',
    size: 'Very Small',
    willingness_to_pay: 'Very High',
    preferred_plans: ['enterprise', 'white-label'],
    acquisition_cost: 500,
    lifetime_value: 15000
  }
};

// Financial Projections
export const FINANCIAL_PROJECTIONS = {
  year1: {
    revenue: 500000, // $500K ARR
    customers: {
      free: 1500,
      paid: 400,
      enterprise: 100
    },
    churnRate: 0.05, // 5% monthly churn
    grossMargin: 0.85 // 85% gross margin
  },

  year2: {
    revenue: 2000000, // $2M ARR
    customers: {
      free: 6000,
      paid: 1800,
      enterprise: 200
    },
    churnRate: 0.03, // 3% monthly churn
    grossMargin: 0.88 // 88% gross margin
  },

  year3: {
    revenue: 10000000, // $10M ARR
    customers: {
      free: 18000,
      paid: 6500,
      enterprise: 500
    },
    churnRate: 0.02, // 2% monthly churn
    grossMargin: 0.90 // 90% gross margin
  }
};

export default {
  PRICING_PLANS,
  USAGE_PRICING,
  REVENUE_STREAMS,
  ACQUISITION_STRATEGY,
  PRICING_STRATEGY,
  MARKET_SEGMENTS,
  FINANCIAL_PROJECTIONS
};

