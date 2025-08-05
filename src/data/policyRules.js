/**
 * Policy Rules and Benchmarks
 * Industry standards and best practices for different insurance types
 */

export const POLICY_RULES = {
  auto: {
    minimumCoverages: {
      bodilyInjuryLiability: {
        perPerson: 25000,
        perAccident: 50000,
        recommended: {
          perPerson: 100000,
          perAccident: 300000
        }
      },
      propertyDamageLiability: {
        minimum: 25000,
        recommended: 50000
      },
      uninsuredMotorist: {
        required: false,
        recommended: true,
        minimumAmount: 25000
      }
    },
    deductibleRanges: {
      collision: { min: 250, max: 2500, recommended: 500 },
      comprehensive: { min: 250, max: 2500, recommended: 500 }
    },
    riskFactors: {
      age: {
        high: [16, 25],
        medium: [26, 65],
        low: [66, 100]
      },
      vehicleAge: {
        new: [0, 3],
        moderate: [4, 10],
        old: [11, 100]
      }
    }
  },

  home: {
    minimumCoverages: {
      dwelling: {
        basis: 'replacement_cost',
        minimumPercentage: 80,
        recommended: 100
      },
      personalProperty: {
        standardPercentage: 50, // of dwelling coverage
        recommendedPercentage: 70
      },
      liability: {
        minimum: 100000,
        recommended: 300000
      },
      additionalLivingExpenses: {
        standardPercentage: 20, // of dwelling coverage
        recommendedPercentage: 30
      }
    },
    deductibleRanges: {
      allPerils: { min: 500, max: 5000, recommended: 1000 },
      windHail: { min: 1000, max: 10000, recommended: 2500 },
      hurricane: { min: 2000, max: 25000, recommended: 5000 }
    },
    riskFactors: {
      homeAge: {
        new: [0, 10],
        moderate: [11, 30],
        old: [31, 100]
      },
      location: {
        coastal: 'high',
        floodZone: 'high',
        earthquake: 'high',
        tornado: 'medium'
      }
    }
  },

  renters: {
    minimumCoverages: {
      personalProperty: {
        minimum: 15000,
        recommended: 30000
      },
      liability: {
        minimum: 100000,
        recommended: 300000
      },
      additionalLivingExpenses: {
        minimum: 5000,
        recommended: 15000
      }
    },
    deductibleRanges: {
      personalProperty: { min: 250, max: 2500, recommended: 500 }
    },
    riskFactors: {
      buildingType: {
        apartment: 'low',
        condo: 'low',
        house: 'medium',
        mobile: 'high'
      }
    }
  },

  life: {
    coverageCalculation: {
      incomeMultiplier: {
        minimum: 5,
        recommended: 10,
        optimal: 12
      },
      debtCoverage: {
        mortgage: 1.0,
        otherDebts: 1.0,
        finalExpenses: 15000
      },
      dependentSupport: {
        perChild: 100000,
        spouseSupport: 5 // years of income
      }
    },
    policyTypes: {
      term: {
        costEffective: true,
        temporaryNeeds: true,
        recommendedTerms: [10, 15, 20, 30]
      },
      permanent: {
        lifetimeNeeds: true,
        investmentComponent: true,
        higherCost: true
      }
    },
    riskFactors: {
      age: {
        young: [18, 35],
        middle: [36, 55],
        senior: [56, 80]
      },
      health: {
        excellent: 'preferred_plus',
        good: 'preferred',
        average: 'standard',
        poor: 'substandard'
      }
    }
  },

  health: {
    planTypes: {
      HMO: {
        lowerCost: true,
        networkRestrictions: true,
        primaryCareRequired: true
      },
      PPO: {
        higherCost: true,
        networkFlexibility: true,
        outOfNetworkCoverage: true
      },
      EPO: {
        moderateCost: true,
        networkRequired: true,
        noReferrals: true
      }
    },
    costSharing: {
      deductible: {
        bronze: { min: 6000, max: 8000 },
        silver: { min: 3000, max: 6000 },
        gold: { min: 1000, max: 3000 },
        platinum: { min: 0, max: 1000 }
      },
      outOfPocketMax: {
        individual: 8700, // 2023 limit
        family: 17400
      }
    },
    essentialBenefits: [
      'Ambulatory patient services',
      'Emergency services',
      'Hospitalization',
      'Maternity and newborn care',
      'Mental health and substance use disorder services',
      'Prescription drugs',
      'Rehabilitative services',
      'Laboratory services',
      'Preventive and wellness services',
      'Pediatric services'
    ]
  }
};

export const INDUSTRY_BENCHMARKS = {
  auto: {
    averagePremiums: {
      liability: 600,
      fullCoverage: 1200,
      byState: {
        CA: 1500,
        TX: 1200,
        FL: 1800,
        NY: 1400
      }
    },
    claimFrequency: {
      collision: 0.06, // 6% annually
      comprehensive: 0.03,
      liability: 0.04
    }
  },

  home: {
    averagePremiums: {
      national: 1200,
      byRegion: {
        northeast: 1000,
        south: 1500,
        midwest: 900,
        west: 1100
      }
    },
    replacementCostFactors: {
      constructionCostPerSqFt: 150,
      inflationRate: 0.03,
      upgradeFactor: 1.2
    }
  },

  life: {
    averageRates: {
      term20: {
        male: {
          30: 15,
          40: 20,
          50: 45
        },
        female: {
          30: 12,
          40: 17,
          50: 35
        }
      }
    },
    ownershipStats: {
      percentage: 0.52, // 52% of Americans have life insurance
      averageCoverage: 178000
    }
  }
};

export const COMPLIANCE_REQUIREMENTS = {
  auto: {
    stateRequirements: {
      CA: {
        bodilyInjury: { perPerson: 15000, perAccident: 30000 },
        propertyDamage: 5000,
        uninsuredMotorist: { required: true }
      },
      TX: {
        bodilyInjury: { perPerson: 30000, perAccident: 60000 },
        propertyDamage: 25000,
        uninsuredMotorist: { required: false }
      },
      FL: {
        personalInjuryProtection: 10000,
        propertyDamage: 10000,
        bodilyInjury: { required: false }
      },
      NY: {
        bodilyInjury: { perPerson: 25000, perAccident: 50000 },
        propertyDamage: 10000,
        personalInjuryProtection: 50000,
        uninsuredMotorist: { perPerson: 25000, perAccident: 50000 }
      }
    }
  },

  health: {
    acaRequirements: {
      essentialHealthBenefits: true,
      preventiveCare: true,
      preExistingConditions: false, // cannot exclude
      annualLimits: false, // cannot impose
      lifetimeLimits: false
    }
  }
};

export const RISK_ASSESSMENT_CRITERIA = {
  coverage: {
    adequate: { score: 0, description: 'Coverage meets or exceeds recommendations' },
    marginal: { score: 25, description: 'Coverage is below recommended levels' },
    insufficient: { score: 50, description: 'Coverage is significantly inadequate' },
    missing: { score: 75, description: 'Required coverage is missing' }
  },

  deductible: {
    appropriate: { score: 0, description: 'Deductible aligns with financial capacity' },
    high: { score: 15, description: 'Deductible may be too high for comfort' },
    low: { score: 10, description: 'Deductible may result in higher premiums' }
  },

  compliance: {
    compliant: { score: 0, description: 'Meets all regulatory requirements' },
    nonCompliant: { score: 100, description: 'Does not meet legal requirements' }
  }
};

export default {
  POLICY_RULES,
  INDUSTRY_BENCHMARKS,
  COMPLIANCE_REQUIREMENTS,
  RISK_ASSESSMENT_CRITERIA
};

