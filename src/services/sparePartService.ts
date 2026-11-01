import { SparePart, PartType, AvailabilityStatus } from '../types';

// Backend integration point: spare-part records must be returned by the API.
export const SparePartService = {
  getAll: (): SparePart[] => [],
  getById: (_id:string): SparePart | undefined => undefined,
  getByProductId: (_productId:string): SparePart[] => [],
  getByCategory: (_category:string): SparePart[] => [],
  search: (_query:string): SparePart[] => [],
  filter: (_options:{productId?:string;category?:string;partType?:PartType|'All';availability?:AvailabilityStatus|'All';maxPrice?:number;sortBy?:'price-asc'|'price-desc'|'availability'}): SparePart[] => [],
  getCategories: (): string[] => ['Battery','Display','Charging Port','Camera','Back Panel','Speaker','Motherboard'],
};
