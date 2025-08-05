/**
 * Validation Utilities
 * Provides validation functions for policy data and analysis results
 */

/**
 * Validate policy data based on policy type
 * @param {Object} policyData - Policy data to validate
 * @param {string} policyType - Type of policy
 * @returns {Object} Validation result
 */
export function validatePolicyData(policyData, policyType) {
  const errors = [];
  const warnings = [];
  
  // Common validations
  if (!policyData.policyNumber || policyData.policyNumber.trim() === '') {
    errors.push('Policy number is required');
  }
  
  if (!policyData.insuranceProvider || policyData.insuranceProvider.trim() === '') {
    errors.push('Insurance provider is required');
  }
  
  // Date validations
  if (policyData.effectiveDate) {
    if (!isValidDate(policyData.effectiveDate)) {
      errors.push('Effective date is not valid');
    }
  }
  
  if (policyData.expirationDate) {
    if (!isValidDate(policyData.expirationDate)) {
      errors.push('Expiration date is not valid');
    } else if (policyData.effectiveDate && new Date(policyData.expirationDate) <= new Date(policyData.effectiveDate)) {
      errors.push('Expiration date must be after effective date');
    }
  }
  
  // Premium validation
  if (policyData.premium !== null && policyData.premium !== undefined) {
    if (!isValidCurrency(policyData.premium)) {
      errors.push('Premium must be a valid monetary amount');
    } else if (policyData.premium < 0) {
      errors.push('Premium cannot be negative');
    }
  }
  
  // Policy type specific validations
  const typeSpecificValidation = validateByPolicyType(policyData, policyType);
  errors.push(...typeSpecificValidation.errors);
  warnings.push(...typeSpecificValidation.warnings);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings)
  };
}

/**
 * Validate policy data by specific type
 */
function validateByPolicyType(policyData, policyType) {
  const errors = [];
  const warnings = [];
  
  switch (policyType.toLowerCase()) {
    case 'auto':
      return validateAutoPolicy(policyData);
    case 'home':
      return validateHomePolicy(policyData);
    case 'renters':
      return validateRentersPolicy(policyData);
    case 'life':
      return validateLifePolicy(policyData);
    case 'health':
      return validateHealthPolicy(policyData);
    default:
      return { errors, warnings };
  }
}

/**
 * Validate auto insurance policy
 */
function validateAutoPolicy(policyData) {
  const errors = [];
  const warnings = [];
  
  // Vehicle information
  if (!policyData.vehicles || policyData.vehicles.length === 0) {
    errors.push('At least one vehicle is required for auto insurance');
  } else {
    policyData.vehicles.forEach((vehicle, index) => {
      if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
        errors.push(`Vehicle ${index + 1}: Invalid year`);
      }
      if (!vehicle.make || vehicle.make.trim() === '') {
        errors.push(`Vehicle ${index + 1}: Make is required`);
      }
      if (!vehicle.model || vehicle.model.trim() === '') {
        errors.push(`Vehicle ${index + 1}: Model is required`);
      }
      if (vehicle.vin && !isValidVIN(vehicle.vin)) {
        warnings.push(`Vehicle ${index + 1}: VIN format appears invalid`);
      }
    });
  }
  
  // Coverage validations
  if (policyData.coverages) {
    if (!policyData.coverages.bodilyInjuryLiability) {
      errors.push('Bodily injury liability coverage is required');
    } else if (policyData.coverages.bodilyInjuryLiability.limit < 25000) {
      warnings.push('Bodily injury liability limit may be too low');
    }
    
    if (!policyData.coverages.propertyDamageLiability) {
      errors.push('Property damage liability coverage is required');
    } else if (policyData.coverages.propertyDamageLiability.limit < 25000) {
      warnings.push('Property damage liability limit may be too low');
    }
    
    if (policyData.coverages.collision && !policyData.deductibles?.collision) {
      warnings.push('Collision coverage specified but no deductible found');
    }
    
    if (policyData.coverages.comprehensive && !policyData.deductibles?.comprehensive) {
      warnings.push('Comprehensive coverage specified but no deductible found');
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate home insurance policy
 */
function validateHomePolicy(policyData) {
  const errors = [];
  const warnings = [];
  
  // Property information
  if (!policyData.property?.address || policyData.property.address.trim() === '') {
    errors.push('Property address is required');
  }
  
  if (policyData.property?.yearBuilt) {
    const currentYear = new Date().getFullYear();
    if (policyData.property.yearBuilt < 1800 || policyData.property.yearBuilt > currentYear) {
      errors.push('Property year built is invalid');
    } else if (policyData.property.yearBuilt < 1950) {
      warnings.push('Older homes may have higher insurance risks');
    }
  }
  
  if (policyData.property?.squareFootage) {
    if (policyData.property.squareFootage < 100 || policyData.property.squareFootage > 50000) {
      warnings.push('Property square footage seems unusual');
    }
  }
  
  // Coverage validations
  if (policyData.coverages) {
    if (!policyData.coverages.dwelling) {
      errors.push('Dwelling coverage is required');
    } else if (policyData.coverages.dwelling.limit < 50000) {
      warnings.push('Dwelling coverage limit may be insufficient');
    }
    
    if (!policyData.coverages.personalProperty) {
      warnings.push('Personal property coverage is recommended');
    }
    
    if (!policyData.coverages.liability) {
      errors.push('Liability coverage is required');
    } else if (policyData.coverages.liability.limit < 100000) {
      warnings.push('Liability coverage limit may be too low');
    }
    
    if (!policyData.coverages.additionalLivingExpenses) {
      warnings.push('Additional living expenses coverage is recommended');
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate renters insurance policy
 */
function validateRentersPolicy(policyData) {
  const errors = [];
  const warnings = [];
  
  // Rental property information
  if (!policyData.rentalProperty?.address || policyData.rentalProperty.address.trim() === '') {
    errors.push('Rental property address is required');
  }
  
  // Coverage validations
  if (policyData.coverages) {
    if (!policyData.coverages.personalProperty) {
      errors.push('Personal property coverage is required');
    } else if (policyData.coverages.personalProperty.limit < 10000) {
      warnings.push('Personal property coverage limit may be too low');
    }
    
    if (!policyData.coverages.liability) {
      errors.push('Liability coverage is required');
    } else if (policyData.coverages.liability.limit < 100000) {
      warnings.push('Liability coverage limit may be insufficient');
    }
    
    if (!policyData.coverages.additionalLivingExpenses) {
      warnings.push('Additional living expenses coverage is recommended');
    }
  }
  
  // Deductible validation
  if (policyData.deductible) {
    if (policyData.deductible < 250 || policyData.deductible > 5000) {
      warnings.push('Deductible amount seems unusual for renters insurance');
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate life insurance policy
 */
function validateLifePolicy(policyData) {
  const errors = [];
  const warnings = [];
  
  // Death benefit validation
  if (!policyData.deathBenefit || policyData.deathBenefit <= 0) {
    errors.push('Death benefit must be greater than zero');
  } else if (policyData.deathBenefit < 50000) {
    warnings.push('Death benefit may be insufficient for most needs');
  }
  
  // Insured information
  if (!policyData.insured?.name || policyData.insured.name.trim() === '') {
    errors.push('Insured name is required');
  }
  
  if (policyData.insured?.dateOfBirth) {
    if (!isValidDate(policyData.insured.dateOfBirth)) {
      errors.push('Insured date of birth is invalid');
    } else {
      const age = calculateAge(policyData.insured.dateOfBirth);
      if (age < 0 || age > 120) {
        errors.push('Insured age is invalid');
      } else if (age > 80) {
        warnings.push('Life insurance for seniors may have limited options');
      }
    }
  }
  
  // Beneficiary validation
  if (!policyData.beneficiaries?.primary || policyData.beneficiaries.primary.length === 0) {
    errors.push('At least one primary beneficiary is required');
  } else {
    const totalPercentage = policyData.beneficiaries.primary.reduce((sum, b) => sum + (b.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.push('Primary beneficiary percentages must total 100%');
    }
    
    policyData.beneficiaries.primary.forEach((beneficiary, index) => {
      if (!beneficiary.name || beneficiary.name.trim() === '') {
        errors.push(`Primary beneficiary ${index + 1}: Name is required`);
      }
      if (!beneficiary.relationship || beneficiary.relationship.trim() === '') {
        warnings.push(`Primary beneficiary ${index + 1}: Relationship should be specified`);
      }
    });
  }
  
  // Policy type specific validations
  if (policyData.policySubType === 'term' && policyData.termLength) {
    if (policyData.termLength < 1 || policyData.termLength > 40) {
      warnings.push('Term length seems unusual');
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate health insurance policy
 */
function validateHealthPolicy(policyData) {
  const errors = [];
  const warnings = [];
  
  // Plan type validation
  const validPlanTypes = ['HMO', 'PPO', 'EPO', 'POS'];
  if (policyData.planType && !validPlanTypes.includes(policyData.planType)) {
    warnings.push('Plan type may not be standard');
  }
  
  // Deductible validation
  if (policyData.deductible) {
    if (policyData.deductible.individual && policyData.deductible.individual < 0) {
      errors.push('Individual deductible cannot be negative');
    }
    if (policyData.deductible.family && policyData.deductible.family < 0) {
      errors.push('Family deductible cannot be negative');
    }
    if (policyData.deductible.individual && policyData.deductible.family) {
      if (policyData.deductible.family < policyData.deductible.individual) {
        errors.push('Family deductible should not be less than individual deductible');
      }
    }
  }
  
  // Out-of-pocket maximum validation
  if (policyData.outOfPocketMax) {
    if (policyData.outOfPocketMax.individual && policyData.outOfPocketMax.individual < 0) {
      errors.push('Individual out-of-pocket maximum cannot be negative');
    }
    if (policyData.outOfPocketMax.family && policyData.outOfPocketMax.family < 0) {
      errors.push('Family out-of-pocket maximum cannot be negative');
    }
    
    // Check if out-of-pocket max is reasonable compared to deductible
    if (policyData.deductible?.individual && policyData.outOfPocketMax.individual) {
      if (policyData.outOfPocketMax.individual < policyData.deductible.individual) {
        errors.push('Out-of-pocket maximum cannot be less than deductible');
      }
    }
  }
  
  // Covered members validation
  if (!policyData.coveredMembers || policyData.coveredMembers.length === 0) {
    errors.push('At least one covered member is required');
  } else {
    policyData.coveredMembers.forEach((member, index) => {
      if (!member.name || member.name.trim() === '') {
        errors.push(`Covered member ${index + 1}: Name is required`);
      }
      if (member.dateOfBirth && !isValidDate(member.dateOfBirth)) {
        errors.push(`Covered member ${index + 1}: Date of birth is invalid`);
      }
    });
  }
  
  return { errors, warnings };
}

/**
 * Validate analysis results
 * @param {Object} analysisResult - Analysis result to validate
 * @returns {Object} Validation result
 */
export function validateAnalysisResult(analysisResult) {
  const errors = [];
  const warnings = [];
  
  // Basic structure validation
  if (!analysisResult.id) {
    errors.push('Analysis result must have an ID');
  }
  
  if (!analysisResult.analysisDate) {
    errors.push('Analysis date is required');
  } else if (!isValidDate(analysisResult.analysisDate)) {
    errors.push('Analysis date is invalid');
  }
  
  if (!analysisResult.analysisType) {
    errors.push('Analysis type is required');
  }
  
  // Confidence validation
  if (analysisResult.confidence !== undefined) {
    if (typeof analysisResult.confidence !== 'number' || 
        analysisResult.confidence < 0 || 
        analysisResult.confidence > 100) {
      errors.push('Confidence must be a number between 0 and 100');
    } else if (analysisResult.confidence < 50) {
      warnings.push('Low confidence analysis result');
    }
  }
  
  // Type-specific validations
  if (analysisResult.analysisType === 'risk') {
    if (analysisResult.overallRiskScore !== undefined) {
      if (typeof analysisResult.overallRiskScore !== 'number' || 
          analysisResult.overallRiskScore < 0 || 
          analysisResult.overallRiskScore > 100) {
        errors.push('Overall risk score must be a number between 0 and 100');
      }
    }
    
    if (analysisResult.riskFactors && !Array.isArray(analysisResult.riskFactors)) {
      errors.push('Risk factors must be an array');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings)
  };
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export function validateFileUpload(file) {
  const errors = [];
  const warnings = [];
  
  // File existence
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors, warnings, score: 0 };
  }
  
  // File size validation (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size exceeds 10MB limit');
  } else if (file.size === 0) {
    errors.push('File is empty');
  } else if (file.size < 1000) {
    warnings.push('File is very small and may not contain sufficient data');
  }
  
  // File type validation
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not supported`);
  }
  
  // File name validation
  if (!file.name || file.name.trim() === '') {
    errors.push('File name is required');
  } else if (file.name.length > 255) {
    warnings.push('File name is very long');
  }
  
  // Extension validation
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['pdf', 'txt', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'];
  
  if (!extension || !allowedExtensions.includes(extension)) {
    warnings.push('File extension may not be supported');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings)
  };
}

/**
 * Helper validation functions
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function isValidCurrency(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function isValidVIN(vin) {
  // Basic VIN validation (17 characters, alphanumeric except I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
}

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function calculateValidationScore(errors, warnings) {
  let score = 100;
  score -= errors.length * 20; // Each error reduces score by 20
  score -= warnings.length * 5; // Each warning reduces score by 5
  return Math.max(0, score);
}

/**
 * Validate user profile data
 * @param {Object} userProfile - User profile to validate
 * @returns {Object} Validation result
 */
export function validateUserProfile(userProfile) {
  const errors = [];
  const warnings = [];
  
  if (!userProfile) {
    errors.push('User profile is required');
    return { isValid: false, errors, warnings, score: 0 };
  }
  
  // Age validation
  if (userProfile.age !== undefined) {
    if (typeof userProfile.age !== 'number' || userProfile.age < 0 || userProfile.age > 120) {
      errors.push('Age must be a valid number between 0 and 120');
    }
  }
  
  // Income validation
  if (userProfile.income !== undefined) {
    if (typeof userProfile.income !== 'number' || userProfile.income < 0) {
      errors.push('Income must be a non-negative number');
    }
  }
  
  // Assets validation
  if (userProfile.assets !== undefined) {
    if (typeof userProfile.assets !== 'number' || userProfile.assets < 0) {
      errors.push('Assets must be a non-negative number');
    }
  }
  
  // Emergency fund validation
  if (userProfile.emergencyFund !== undefined) {
    if (typeof userProfile.emergencyFund !== 'number' || userProfile.emergencyFund < 0) {
      errors.push('Emergency fund must be a non-negative number');
    }
  }
  
  // Risk tolerance validation
  if (userProfile.riskTolerance !== undefined) {
    const validRiskLevels = ['low', 'medium', 'high'];
    if (!validRiskLevels.includes(userProfile.riskTolerance)) {
      warnings.push('Risk tolerance should be low, medium, or high');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings)
  };
}

export default {
  validatePolicyData,
  validateAnalysisResult,
  validateFileUpload,
  validateUserProfile,
  isValidDate,
  isValidCurrency,
  calculateAge
};

