import React from 'react';
import { Provider } from '../types';
import { MapPin, Phone, Clock, Star, ExternalLink, ShieldCheck, Wrench, ShieldAlert } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  currentLocality?: string;
  selectedComponentCategory?: string;
  onSelect?: (provider: Provider) => void;
  isSelected?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  selectedComponentCategory,
  onSelect,
  isSelected = false,
}) => {
  const isAuthorised = provider.authorisationStatus === 'Manufacturer-authorised';
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${provider.name} ${provider.address}`
  )}`;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
        isSelected
          ? 'border-[#23734D] ring-2 ring-[#23734D]/20 shadow-md'
          : 'border-[#DCE4DC] hover:border-[#b8cfbf] hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
              isAuthorised
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-[#EFF3EE] text-[#174C3C] border-[#DCE4DC]'
            }`}
          >
            {isAuthorised ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Wrench className="w-3.5 h-3.5 text-[#23734D]" />
            )}
            <span>{provider.authorisationStatus}</span>
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-[#1B2722] bg-[#F8FAF7] px-2 py-0.5 rounded border border-[#DCE4DC]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{provider.rating}</span>
            <span className="text-[10px] text-[#78857D] font-normal">({provider.reviewCount})</span>
          </div>
        </div>

        {/* Provider Name */}
        <h3 className="text-base font-bold text-[#10382D] leading-snug mb-1">
          {provider.name}
        </h3>

        {/* Locality & Address */}
        <div className="flex items-start gap-1.5 text-xs text-[#5D6B63] mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-[#23734D] flex-shrink-0 mt-0.5" />
          <span>{provider.address}</span>
        </div>

        {/* Operating Hours & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#78857D] mb-3.5 bg-[#F8FAF7] p-2.5 rounded-lg border border-[#DCE4DC]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5D6B63]" />
            <span className="truncate">{provider.openingHours}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#5D6B63]" />
            <span>{provider.phone}</span>
          </div>
        </div>

        {/* Supported Brands */}
        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D] block mb-1">
            Supported Brands:
          </span>
          <div className="flex flex-wrap gap-1">
            {provider.supportedBrands.map((b) => (
              <span
                key={b}
                className="text-[10px] font-medium bg-[#EEF5EF] text-[#174C3C] px-2 py-0.5 rounded"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stocked Categories */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D] block mb-1">
            Stocked Component Categories:
          </span>
          <div className="flex flex-wrap gap-1">
            {provider.stockedComponentCategories.map((c) => {
              const isMatch = selectedComponentCategory && c.toLowerCase().includes(selectedComponentCategory.toLowerCase());
              return (
                <span
                  key={c}
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    isMatch
                      ? 'bg-[#23734D] text-white font-bold border-[#23734D]'
                      : 'bg-white text-[#5D6B63] border-[#DCE4DC]'
                  }`}
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>

        {/* Mandatory Stock Disclaimer Notice */}
        <div className="p-2.5 rounded-lg bg-[#FFFDF5] border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 mb-4">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Stock Disclaimer:</strong> Component availability must be verified directly with provider. Proximity does not guarantee immediate parts in stock.
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#DCE4DC] flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#78857D] italic">
          Directory listing
        </span>

        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-3 rounded-lg bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Find on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
