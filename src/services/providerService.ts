import { Provider, ProviderType } from '../types';

// Backend integration point: provider records must be returned by the API.
export const ProviderService = {
  getAll: (): Provider[] => [],
  getById: (_id: string): Provider | undefined => undefined,
  filter: (_options: {providerType?:ProviderType|'All';brand?:string;componentCategory?:string;locality?:string;onlyAuthorised?:boolean}): Provider[] => [],
  getForSparePart: (_providerIds: string[]): Provider[] => [],
  calculateDistanceApproxKm: (a:{lat:number;lng:number},b:{lat:number;lng:number}):number => { const r=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLon=(b.lng-a.lng)*Math.PI/180; const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2; return Math.round(2*r*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))*10)/10; },
};
