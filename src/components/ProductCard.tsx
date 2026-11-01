import React from 'react';
import { Product } from '../types';
import { Wrench, Shield, Star, Cpu, ArrowRight, Bot, Scale } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onCheckParts: (product: Product) => void;
  onAskAI: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onCheckParts,
  onAskAI,
  onToggleCompare,
  isCompared = false,
}) => {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-[#23734D] text-white';
    if (score >= 7.0) return 'bg-[#174C3C] text-white';
    if (score >= 6.0) return 'bg-[#9A6700] text-white';
    return 'bg-[#B42318] text-white';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE4DC] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Top Banner with Data Label & Repairability Score */}
      <div className="relative h-44 bg-[#EFF3EE] overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={`${product.brand} ${product.modelName}`}
          className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          loading="lazy"
        />

        {/* Data status */}
        <span className="absolute top-3 left-3 bg-[#10382D]/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
          Device record
        </span>

        {/* Repairability Score Pill */}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${getScoreBadgeColor(
            product.repairabilityScore
          )}`}
          title={`RevTech Repairability Index: ${product.repairabilityScore} / 10`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{product.repairabilityScore} / 10</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-[#5D6B63]">
              {product.brand}
            </span>
            <span className="text-xs text-[#78857D]">{product.releaseYear}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="text-base font-bold text-[#10382D] hover:text-[#23734D] cursor-pointer transition-colors leading-snug mb-1"
          >
            {product.brand} {product.modelName}
          </h3>

          <p className="text-xs text-[#5D6B63] mb-3 line-clamp-1">{product.variant}</p>

          {/* Pricing in INR */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-black text-[#1B2722]">
              ₹{product.priceInr.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#78857D]">Est. Retail</span>
          </div>

          {/* Repairability Metrics Snippet */}
          <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2 mb-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5D6B63] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#23734D]" />
                Parts Coverage
              </span>
              <span className="font-semibold text-[#10382D]">
                {product.partsSummary.availableCount} of {product.partsSummary.totalComponentsListed} Available
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#78857D]">
              <span>Est. Battery Swap:</span>
              <span className="font-medium text-[#1B2722]">
                ₹{product.partsSummary.batteryEstimatedCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#78857D]">
              <span>Est. Screen Swap:</span>
              <span className="font-medium text-[#1B2722]">
                ₹{product.partsSummary.screenEstimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-[#DCE4DC]">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCheckParts(product)}
              className="py-2 px-3 rounded-lg bg-[#EEF5EF] hover:bg-[#DCE9DF] text-[#174C3C] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#DCE4DC]"
            >
              <Wrench className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Check Parts</span>
            </button>

            <button
              onClick={() => onAskAI(product)}
              className="py-2 px-3 rounded-lg bg-[#23734D] hover:bg-[#1b5e3e] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-200" />
              <span>Worth Buying?</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onSelect(product)}
              className="text-xs text-[#5D6B63] hover:text-[#174C3C] font-semibold flex items-center gap-1"
            >
              <span>Full Profile & Specs</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(product)}
                className={`text-xs px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                  isCompared
                    ? 'bg-[#10382D] text-white font-semibold'
                    : 'text-[#5D6B63] hover:text-[#10382D] hover:bg-[#EFF3EE]'
                }`}
              >
                <Scale className="w-3 h-3" />
                <span>{isCompared ? 'Added' : 'Compare'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
