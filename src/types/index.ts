export type PartType = 
  | 'OEM Original' 
  | 'Compatible Third-Party' 
  | 'Refurbished Grade-A' 
  | 'Used Inspected' 
  | 'Part type unknown';

export type AvailabilityStatus = 
  | 'Available' 
  | 'Limited availability' 
  | 'Availability not verified' 
  | 'Unavailable' 
  | 'No matching part record';

export type AuthorisationStatus = 
  | 'Manufacturer-authorised' 
  | 'Independent provider' 
  | 'Authorisation unverified';

export type ProviderType = 
  | 'Repair Centre' 
  | 'Spare-Parts Shop' 
  | 'Authorised Service Hub' 
  | 'Dual Repair & Spares';

export interface RepairabilityFactors {
  partsAvailability: number; // 0-10 (weight 30%)
  repairAffordability: number; // 0-10 (weight 25%)
  documentation: number; // 0-10 (weight 20%)
  serviceAccessibility: number; // 0-10 (weight 15%)
  repairComplexity: number; // 0-10 (weight 10%, higher = easier)
}

export interface Product {
  id: string;
  brand: string;
  modelName: string;
  variant: string;
  category: string;
  releaseYear: number;
  image: string;
  priceInr: number;
  repairabilityScore: number; // overall calculated 0-10
  scoreConfidence: 'High' | 'Moderate' | 'Low';
  factors: RepairabilityFactors;
  specifications: {
    display: string;
    processor: string;
    batteryCapacity: string;
    chargingSpeed: string;
    storage: string;
    backMaterial: string;
    adhesiveType: string;
  };
  partsSummary: {
    totalComponentsListed: number;
    availableCount: number;
    limitedCount: number;
    screenEstimatedCost: number;
    batteryEstimatedCost: number;
  };
  dataStatus: 'Verified manufacturer data' | 'Third-party sourced' | 'Unverified';
  sourceLabel: string;
  lastUpdated: string;
}

export interface SparePart {
  id: string;
  productId: string;
  productModel: string;
  componentName: string;
  category: 'Battery' | 'Display' | 'Charging Port' | 'Camera' | 'Back Panel' | 'Speaker' | 'Motherboard';
  partType: PartType;
  partNumber?: string;
  compatibleModels: string[];
  compatibilityStatus: 'Verified Compatible' | 'Compatibility not verified' | 'Model Specific';
  minPriceInr: number;
  maxPriceInr: number;
  availabilityStatus: AvailabilityStatus;
  providerIds: string[];
  specs?: string;
  sourceLabel: string;
  lastUpdated: string;
}

export interface RepairEstimate {
  id: string;
  productId: string;
  productModel: string;
  componentName: string;
  minPartsCostInr: number;
  maxPartsCostInr: number;
  minLabourCostInr: number;
  maxLabourCostInr: number;
  estimatedDuration: string;
  confidence: 'High' | 'Moderate' | 'Low';
  diyFeasibility: 'Recommended for Technicians' | 'Moderate DIY with tools' | 'Easy DIY' | 'Specialist Only';
  sourceLabel: string;
}

export interface Provider {
  id: string;
  name: string;
  providerType: ProviderType;
  address: string;
  locality: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  supportedBrands: string[];
  supportedServices: string[];
  stockedComponentCategories: string[];
  authorisationStatus: AuthorisationStatus;
  rating: number;
  reviewCount: number;
  sourceLabel: string;
  isVerified: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  reviewText: string;
  themes: {
    positive: string[];
    negative: string[];
    repairFeedback: string;
  };
  ownershipDuration: string;
  sourceType: 'Manufacturer' | 'Aggregated community review' | 'User submitted';
  date: string;
}

export interface WarrantyInformation {
  id: string;
  productId: string;
  durationMonths: number;
  coverageSummary: string;
  exclusions: string[];
  batteryDegradationClause: string;
  verificationStatus: 'Verified Official' | 'Warranty information not verified';
  supportUrl: string;
  sourceLabel: string;
}

export type RecommendationType = 
  | 'Repair appears more economical'
  | 'Replacement appears more economical'
  | 'Buying appears reasonable based on the available information'
  | 'Consider an alternative product'
  | 'Insufficient information for a reliable recommendation';

export interface AIDecisionResult {
  recommendation: RecommendationType;
  confidence: 'High' | 'Moderate' | 'Low' | 'Insufficient Data';
  headline: string;
  whyThisRecommendation: string[];
  costComparison: {
    upfrontRepairInr: number;
    replacementCostInr?: number;
    monthlyCostOverRemainingLifeInr: number;
    netSavingsInr?: number;
    breakevenHorizonMonths?: number;
    details: string;
  };
  sparePartsSituation: {
    summary: string;
    partName?: string;
    availability: string;
    estimatedPartCostInr?: number;
  };
  localServiceOptions: {
    summary: string;
    nearbyCount: number;
    authorisedAvailable: boolean;
  };
  reviewSummary?: {
    positiveThemes: string[];
    negativeThemes: string[];
    repairInsight: string;
    sampleSize: number;
  };
  whatToCheckNext: string[];
  suggestedActions: {
    label: string;
    page: string;
    params?: Record<string, string>;
  }[];
  isAiGenerated: boolean;
  engineUsed: string;
  generationNotice: string;
}

export interface SavedDevice {
  id: string;
  productId: string;
  productName: string;
  variant: string;
  purchaseDate: string;
  purchasePriceInr: number;
  loggedRepairs: {
    id: string;
    date: string;
    component: string;
    costInr: number;
    serviceProvider: string;
    notes: string;
  }[];
}
