import React, { useState } from 'react';
import { SparePart } from '../types';
import { Wrench, MapPin, Calculator, Info, CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface SparePartCardProps {
  part: SparePart;
  onFindNearby: (part: SparePart) => void;
  onEstimateRepair: (part: SparePart) => void;
}

export const SparePartCard: React.FC<SparePartCardProps> = ({
  part,
  onFindNearby,
  onEstimateRepair,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAvailabilityBadge = (status: SparePart['availabilityStatus']) => {
    switch (status) {
      case 'Available':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          text: 'Availability reported',
        };
      case 'Limited availability':
        return {
          icon: AlertTriangle,
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          text: 'Limited Availability',
        };
      case 'Availability not verified':
        return {
          icon: HelpCircle,
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          text: 'Availability Not Verified',
        };
      case 'Unavailable':
        return {
          icon: XCircle,
          color: 'bg-rose-50 text-rose-800 border-rose-200',
          text: 'Unavailable / Out of Stock',
        };
      default:
        return {
          icon: HelpCircle,
          color: 'bg-stone-50 text-stone-800 border-stone-200',
          text: status,
        };
    }
  };

  const getPartTypeBadge = (type: SparePart['partType']) => {
    switch (type) {
      case 'OEM Original':
        return 'bg-[#EEF5EF] text-[#174C3C] border-[#b2cfb9]';
      case 'Compatible Third-Party':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Refurbished Grade-A':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Used Inspected':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const avail = getAvailabilityBadge(part.availabilityStatus);
  const AvailIcon = avail.icon;

  return (
    <div className="bg-white rounded-xl border border-[#DCE4DC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${avail.color}`}
          >
            <AvailIcon className="w-3.5 h-3.5" />
            <span>{avail.text}</span>
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPartTypeBadge(
              part.partType
            )}`}
          >
            {part.partType}
          </span>
        </div>

        {/* Component Name & Compatible Model */}
        <h3 className="text-base font-bold text-[#10382D] leading-snug mb-1">
          {part.componentName}
        </h3>

        <div className="flex items-center gap-2 text-xs text-[#5D6B63] mb-3">
          <span className="font-medium text-[#1B2722]">Model:</span>
          <span>{part.productModel}</span>
          {part.partNumber && (
            <>
              <span>•</span>
              <span className="font-mono text-[11px] text-[#78857D]">{part.partNumber}</span>
            </>
          )}
        </div>

        {/* Pricing in INR */}
        <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#DCE4DC] mb-3.5 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#78857D] block">Estimated Component Price</span>
            <span className="text-lg font-black text-[#1B2722]">
              ₹{part.minPriceInr.toLocaleString('en-IN')}{' '}
              {part.maxPriceInr !== part.minPriceInr && (
                <span className="text-sm font-bold text-[#5D6B63]">
                  – ₹{part.maxPriceInr.toLocaleString('en-IN')}
                </span>
              )}
            </span>
          </div>
          <span className="text-[10px] font-medium text-[#78857D] bg-white px-2 py-1 rounded border border-[#DCE4DC]">
            Parts Only
          </span>
        </div>

        {/* Specifications / Notes snippet */}
        {part.specs && (
          <p className="text-xs text-[#5D6B63] line-clamp-2 mb-3 leading-relaxed">
            {part.specs}
          </p>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-2 pt-3 border-t border-[#DCE4DC] text-xs space-y-2 text-[#5D6B63] animate-fadeIn">
            <div>
              <span className="font-semibold text-[#10382D]">Compatibility Status:</span>{' '}
              <span className="text-emerald-700 font-medium">{part.compatibilityStatus}</span>
            </div>
            <div>
              <span className="font-semibold text-[#10382D]">Compatible Models:</span>{' '}
              {part.compatibleModels.join(', ')}
            </div>
            <div>
              <span className="font-semibold text-[#10382D]">Data Provenance:</span>{' '}
              {part.sourceLabel}
            </div>
            <div className="p-2 rounded bg-[#EEF5EF] text-[11px] text-[#174C3C]">
              Notice: Price reflects component only. Labour charges (typically local labour charges vary by provider) vary based on workshop tooling and IP seal testing.
            </div>
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] font-semibold text-[#174C3C] hover:underline mb-4 flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showDetails ? 'Hide technical notes' : 'View compatibility & source details'}</span>
        </button>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#DCE4DC]">
        <button
          onClick={() => onFindNearby(part)}
          className="py-2 px-3 rounded-lg bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-300" />
          <span>Find Nearby Shops</span>
        </button>

        <button
          onClick={() => onEstimateRepair(part)}
          className="py-2 px-3 rounded-lg bg-[#EFF3EE] hover:bg-[#DCE9DF] text-[#10382D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#DCE4DC]"
        >
          <Calculator className="w-3.5 h-3.5 text-[#23734D]" />
          <span>Estimate Total Cost</span>
        </button>
      </div>
    </div>
  );
};
