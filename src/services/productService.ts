import { Product } from '../types';

// Backend integration point: map this service to confirmed FastAPI routes after reviewing /docs.
export const ProductService = {
  getAll: (): Product[] => [],
  getById: (_id: string): Product | undefined => undefined,
  getByBrand: (_brand: string): Product[] => [],
  search: (_query: string): Product[] => [],
  calculateWeightedScore: (f: Product['factors']): number => Math.round((f.partsAvailability*.3 + f.repairAffordability*.25 + f.documentation*.2 + f.serviceAccessibility*.15 + f.repairComplexity*.1)*10)/10,
  filter: (_options: {brand?:string;minScore?:number;maxPrice?:number;sortBy?:'score-desc'|'price-asc'|'price-desc'|'year-desc'}): Product[] => [],
};
