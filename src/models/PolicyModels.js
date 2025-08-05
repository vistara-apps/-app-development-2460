/**
 * Policy Data Models
 * Standardized data structures for different insurance policy types
 */

/**
 * Base Policy Model
 */
export class BasePolicy {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.policyNumber = data.policyNumber || '';
    this.insuranceProvider = data.insuranceProvider || '';
    this.policyType = data.policyType || '';
    this.effectiveDate = data.effectiveDate || null;
    this.expirationDate = data.expirationDate || null;
    this.premium = data.premium || null;
    this.paymentFrequency = data.paymentFrequency || 'annual';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  isActive() {
    return this.status === 'active' && new Date() < new Date(this.expirationDate);
  }

  daysUntilExpiration() {
    if (!this.expirationDate) return null;
    const today = new Date();
    const expiry = new Date(this.expirationDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  validate() {
    const errors = [];
    
    if (!this.policyNumber) errors.push('Policy number is required');
    if (!this.insuranceProvider) errors.push('Insurance provider is required');
    if (!this.policyType) errors.push('Policy type is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Auto Insurance Policy Model
 */
export class AutoPolicy extends BasePolicy {
  constructor(data = {}) {
    super(data);
    this.policyType = 'auto';
    
    // Vehicle information
    this.vehicles = data.vehicles || [];
    
    // Coverage details
    this.coverages = {
      bodilyInjuryLiability: data.coverages?.bodilyInjuryLiability || null,
      propertyDamageLiability: data.coverages?.propertyDamageLiability || null,
      collision: data.coverages?.collision || null,
      comprehensive: data.coverages?.comprehensive || null,
      uninsuredMotorist: data.coverages?.uninsuredMotorist || null,
      personalInjuryProtection: data.coverages?.personalInjuryProtection || null,
      medicalPayments: data.coverages?.medicalPayments || null,
      ...data.coverages
    };
    
    // Deductibles
    this.deductibles = {
      collision: data.deductibles?.collision || null,
      comprehensive: data.deductibles?.comprehensive || null,
      ...data.deductibles
    };
    
    // Discounts
    this.discounts = data.discounts || [];
  }

  addVehicle(vehicle) {
    this.vehicles.push({
      id: this.generateId(),
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      vin: vehicle.vin,
      usage: vehicle.usage || 'personal',
      annualMileage: vehicle.annualMileage,
      ...vehicle
    });
  }

  getCoverageLimit(coverageType) {
    return this.coverages[coverageType]?.limit || 0;
  }

  getDeductible(coverageType) {
    return this.deductibles[coverageType] || 0;
  }

  validate() {
    const baseValidation = super.validate();
    const errors = [...baseValidation.errors];
    
    if (this.vehicles.length === 0) {
      errors.push('At least one vehicle is required');
    }
    
    if (!this.coverages.bodilyInjuryLiability) {
      errors.push('Bodily injury liability coverage is required');
    }
    
    if (!this.coverages.propertyDamageLiability) {
      errors.push('Property damage liability coverage is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Home Insurance Policy Model
 */
export class HomePolicy extends BasePolicy {
  constructor(data = {}) {
    super(data);
    this.policyType = 'home';
    
    // Property information
    this.property = {
      address: data.property?.address || '',
      propertyType: data.property?.propertyType || 'single-family',
      yearBuilt: data.property?.yearBuilt || null,
      squareFootage: data.property?.squareFootage || null,
      constructionType: data.property?.constructionType || '',
      roofType: data.property?.roofType || '',
      foundationType: data.property?.foundationType || '',
      ...data.property
    };
    
    // Coverage details
    this.coverages = {
      dwelling: data.coverages?.dwelling || null,
      personalProperty: data.coverages?.personalProperty || null,
      liability: data.coverages?.liability || null,
      additionalLivingExpenses: data.coverages?.additionalLivingExpenses || null,
      otherStructures: data.coverages?.otherStructures || null,
      medicalPayments: data.coverages?.medicalPayments || null,
      ...data.coverages
    };
    
    // Deductibles
    this.deductibles = {
      allPerils: data.deductibles?.allPerils || null,
      windHail: data.deductibles?.windHail || null,
      hurricane: data.deductibles?.hurricane || null,
      earthquake: data.deductibles?.earthquake || null,
      ...data.deductibles
    };
    
    // Additional coverages
    this.additionalCoverages = data.additionalCoverages || [];
  }

  getReplacementCost() {
    return this.coverages.dwelling?.limit || 0;
  }

  getPersonalPropertyLimit() {
    return this.coverages.personalProperty?.limit || 0;
  }

  validate() {
    const baseValidation = super.validate();
    const errors = [...baseValidation.errors];
    
    if (!this.property.address) {
      errors.push('Property address is required');
    }
    
    if (!this.coverages.dwelling) {
      errors.push('Dwelling coverage is required');
    }
    
    if (!this.coverages.liability) {
      errors.push('Liability coverage is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Renters Insurance Policy Model
 */
export class RentersPolicy extends BasePolicy {
  constructor(data = {}) {
    super(data);
    this.policyType = 'renters';
    
    // Rental property information
    this.rentalProperty = {
      address: data.rentalProperty?.address || '',
      propertyType: data.rentalProperty?.propertyType || 'apartment',
      landlordInfo: data.rentalProperty?.landlordInfo || {},
      ...data.rentalProperty
    };
    
    // Coverage details
    this.coverages = {
      personalProperty: data.coverages?.personalProperty || null,
      liability: data.coverages?.liability || null,
      additionalLivingExpenses: data.coverages?.additionalLivingExpenses || null,
      medicalPayments: data.coverages?.medicalPayments || null,
      ...data.coverages
    };
    
    // Deductible
    this.deductible = data.deductible || null;
    
    // Personal property inventory
    this.personalPropertyInventory = data.personalPropertyInventory || [];
  }

  addPersonalProperty(item) {
    this.personalPropertyInventory.push({
      id: this.generateId(),
      category: item.category,
      description: item.description,
      value: item.value,
      purchaseDate: item.purchaseDate,
      ...item
    });
  }

  getTotalPersonalPropertyValue() {
    return this.personalPropertyInventory.reduce((total, item) => total + (item.value || 0), 0);
  }

  validate() {
    const baseValidation = super.validate();
    const errors = [...baseValidation.errors];
    
    if (!this.rentalProperty.address) {
      errors.push('Rental property address is required');
    }
    
    if (!this.coverages.personalProperty) {
      errors.push('Personal property coverage is required');
    }
    
    if (!this.coverages.liability) {
      errors.push('Liability coverage is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Life Insurance Policy Model
 */
export class LifePolicy extends BasePolicy {
  constructor(data = {}) {
    super(data);
    this.policyType = 'life';
    
    // Policy details
    this.policySubType = data.policySubType || 'term'; // term, whole, universal, variable
    this.deathBenefit = data.deathBenefit || null;
    this.cashValue = data.cashValue || null;
    this.termLength = data.termLength || null; // for term policies
    
    // Insured information
    this.insured = {
      name: data.insured?.name || '',
      dateOfBirth: data.insured?.dateOfBirth || null,
      gender: data.insured?.gender || '',
      smoker: data.insured?.smoker || false,
      healthClass: data.insured?.healthClass || '',
      ...data.insured
    };
    
    // Beneficiaries
    this.beneficiaries = {
      primary: data.beneficiaries?.primary || [],
      contingent: data.beneficiaries?.contingent || [],
      ...data.beneficiaries
    };
    
    // Riders
    this.riders = data.riders || [];
  }

  addBeneficiary(beneficiary, type = 'primary') {
    const beneficiaryData = {
      id: this.generateId(),
      name: beneficiary.name,
      relationship: beneficiary.relationship,
      percentage: beneficiary.percentage,
      ...beneficiary
    };
    
    this.beneficiaries[type].push(beneficiaryData);
  }

  addRider(rider) {
    this.riders.push({
      id: this.generateId(),
      type: rider.type,
      benefit: rider.benefit,
      premium: rider.premium,
      ...rider
    });
  }

  isTerm() {
    return this.policySubType === 'term';
  }

  isPermanent() {
    return ['whole', 'universal', 'variable'].includes(this.policySubType);
  }

  validate() {
    const baseValidation = super.validate();
    const errors = [...baseValidation.errors];
    
    if (!this.deathBenefit || this.deathBenefit <= 0) {
      errors.push('Death benefit must be greater than zero');
    }
    
    if (!this.insured.name) {
      errors.push('Insured name is required');
    }
    
    if (this.beneficiaries.primary.length === 0) {
      errors.push('At least one primary beneficiary is required');
    }
    
    // Check beneficiary percentages add up to 100%
    const primaryTotal = this.beneficiaries.primary.reduce((sum, b) => sum + (b.percentage || 0), 0);
    if (primaryTotal !== 100) {
      errors.push('Primary beneficiary percentages must total 100%');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Health Insurance Policy Model
 */
export class HealthPolicy extends BasePolicy {
  constructor(data = {}) {
    super(data);
    this.policyType = 'health';
    
    // Plan details
    this.planType = data.planType || 'PPO'; // HMO, PPO, EPO, POS
    this.metalTier = data.metalTier || 'Silver'; // Bronze, Silver, Gold, Platinum
    
    // Cost structure
    this.deductible = {
      individual: data.deductible?.individual || null,
      family: data.deductible?.family || null,
      ...data.deductible
    };
    
    this.outOfPocketMax = {
      individual: data.outOfPocketMax?.individual || null,
      family: data.outOfPocketMax?.family || null,
      ...data.outOfPocketMax
    };
    
    // Copays and coinsurance
    this.copays = {
      primaryCare: data.copays?.primaryCare || null,
      specialist: data.copays?.specialist || null,
      urgentCare: data.copays?.urgentCare || null,
      emergencyRoom: data.copays?.emergencyRoom || null,
      ...data.copays
    };
    
    this.coinsurance = data.coinsurance || null;
    
    // Network information
    this.network = {
      name: data.network?.name || '',
      providers: data.network?.providers || [],
      ...data.network
    };
    
    // Covered members
    this.coveredMembers = data.coveredMembers || [];
    
    // Prescription drug coverage
    this.prescriptionCoverage = data.prescriptionCoverage || {};
  }

  addCoveredMember(member) {
    this.coveredMembers.push({
      id: this.generateId(),
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      ...member
    });
  }

  isHMO() {
    return this.planType === 'HMO';
  }

  isPPO() {
    return this.planType === 'PPO';
  }

  validate() {
    const baseValidation = super.validate();
    const errors = [...baseValidation.errors];
    
    if (!this.planType) {
      errors.push('Plan type is required');
    }
    
    if (!this.deductible.individual) {
      errors.push('Individual deductible is required');
    }
    
    if (!this.outOfPocketMax.individual) {
      errors.push('Individual out-of-pocket maximum is required');
    }
    
    if (this.coveredMembers.length === 0) {
      errors.push('At least one covered member is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Policy Factory
 */
export class PolicyFactory {
  static createPolicy(type, data) {
    switch (type.toLowerCase()) {
      case 'auto':
        return new AutoPolicy(data);
      case 'home':
        return new HomePolicy(data);
      case 'renters':
        return new RentersPolicy(data);
      case 'life':
        return new LifePolicy(data);
      case 'health':
        return new HealthPolicy(data);
      default:
        return new BasePolicy({ ...data, policyType: type });
    }
  }

  static getSupportedTypes() {
    return ['auto', 'home', 'renters', 'life', 'health', 'disability', 'umbrella', 'business'];
  }

  static getModelForType(type) {
    const models = {
      auto: AutoPolicy,
      home: HomePolicy,
      renters: RentersPolicy,
      life: LifePolicy,
      health: HealthPolicy
    };
    
    return models[type.toLowerCase()] || BasePolicy;
  }
}

export default {
  BasePolicy,
  AutoPolicy,
  HomePolicy,
  RentersPolicy,
  LifePolicy,
  HealthPolicy,
  PolicyFactory
};

