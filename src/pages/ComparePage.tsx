import React, { useState } from 'react';
import { ProductService } from '../services/productService';
import { Product } from '../types';
import { Scale, Wrench, Shield, Plus, X, ArrowRight, Bot } from 'lucide-react';

interface ComparePageProps {
  comparedProductIds: string[];
  onRemoveFromCompare: (productId: string) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  comparedProductIds,
  onRemoveFromCompare,
  onNavigate,
}) => {
  const allProducts = ProductService.getAll();
  const selectedProducts = comparedProductIds
    .map((id) => ProductService.getById(id))
    .filter(Boolean) as Product[];

  const displayProducts = selectedProducts;

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-[#23734D]" />
            <span>Multi-Device Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
            Device Lifecycle & Repairability Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
            Compare up to 3 smartphones side-by-side across initial purchase price, repairability index factors, spare parts availability, and long-term ownership costs.
          </p>
        </div>
      </div>

      {displayProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE4DC] p-12 text-center space-y-3">
          <Scale className="w-10 h-10 text-[#78857D] mx-auto" />
          <h2 className="text-lg font-bold text-[#10382D]">No devices selected</h2>
          <p className="text-sm text-[#5D6B63]">Search the device catalogue and add products to compare once catalogue data is connected.</p>
          <button onClick={() => onNavigate('products')} className="py-2 px-4 rounded-xl bg-[#174C3C] text-white text-sm font-semibold">Browse devices</button>
        </div>
      ) : (
      <>
      {/* Comparison Grid */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#DCE4DC] bg-[#F8FAF7]">
              <th className="p-4 font-bold text-[#5D6B63] w-1/4">Feature / Metric</th>
              {displayProducts.map((p) => (
                <th key={p.id} className="p-4 w-1/4 align-top">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#23734D] bg-[#EEF5EF] px-2 py-0.5 rounded">
                        {p.brand}
                      </span>
                      {comparedProductIds.includes(p.id) && (
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="text-[#78857D] hover:text-[#B42318] p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <img
                      src={p.image}
                      alt={p.modelName}
                      className="h-28 w-auto object-contain mx-auto"
                    />
                    <h3 className="font-bold text-sm text-[#10382D] text-center">
                      {p.brand} {p.modelName}
                    </h3>
                    <p className="text-[11px] text-[#78857D] text-center">{p.variant}</p>
                    <div className="text-center font-black text-base text-[#1B2722]">
                      ₹{p.priceInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE4DC]">
            {/* Repairability Score */}
            <tr className="bg-[#EEF5EF]/40 font-bold">
              <td className="p-4 text-[#10382D]">Overall Repairability Score</td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4">
                  <span className="text-base font-black text-[#10382D]">
                    {p.repairabilityScore}
                  </span>
                  <span className="text-xs text-[#5D6B63]"> / 10</span>
                </td>
              ))}
            </tr>

            {/* Factor: Parts Availability (30%) */}
            <tr>
              <td className="p-4 text-[#5D6B63]">
                <div className="font-semibold text-[#10382D]">Parts Availability</div>
                <div className="text-[10px] text-[#78857D]">Weight: 30%</div>
              </td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4">
                  <div className="font-bold text-[#10382D]">{p.factors.partsAvailability} / 10</div>
                  <div className="text-[11px] text-[#5D6B63]">
                    {p.partsSummary.availableCount} of {p.partsSummary.totalComponentsListed} Parts Ready
                  </div>
                </td>
              ))}
            </tr>

            {/* Factor: Repair Affordability (25%) */}
            <tr>
              <td className="p-4 text-[#5D6B63]">
                <div className="font-semibold text-[#10382D]">Repair Affordability</div>
                <div className="text-[10px] text-[#78857D]">Weight: 25%</div>
              </td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 font-bold text-[#10382D]">
                  {p.factors.repairAffordability} / 10
                </td>
              ))}
            </tr>

            {/* Est. Battery Replacement */}
            <tr>
              <td className="p-4 text-[#5D6B63]">Est. Battery Replacement</td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-[#1B2722]">
                  ₹{p.partsSummary.batteryEstimatedCost.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            {/* Est. Screen Replacement */}
            <tr>
              <td className="p-4 text-[#5D6B63]">Est. Screen Replacement</td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-[#1B2722]">
                  ₹{p.partsSummary.screenEstimatedCost.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            {/* Fasteners & Adhesive */}
            <tr>
              <td className="p-4 text-[#5D6B63]">Adhesive & Fasteners</td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 text-[#5D6B63]">
                  {p.specifications.adhesiveType}
                </td>
              ))}
            </tr>

            {/* 3-Year Estimated Ownership Outlay */}
            <tr className="bg-[#EFF3EE]/50 font-bold">
              <td className="p-4 text-[#10382D]">Est. 3-Year Total Outlay</td>
              {displayProducts.map((p) => {
                const total = Math.round(
                  p.priceInr + p.partsSummary.batteryEstimatedCost + p.partsSummary.screenEstimatedCost * 0.35 + 1200
                );
                return (
                  <td key={p.id} className="p-4">
                    <div className="text-sm font-black text-[#10382D]">₹{total.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-[#78857D] font-normal">
                      ~₹{Math.round(total / 36).toLocaleString('en-IN')}/mo
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Actions Row */}
            <tr>
              <td className="p-4 font-bold text-[#5D6B63]">Actions</td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 space-y-2">
                  <button
                    onClick={() => onNavigate('spare-parts', { productId: p.id })}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#174C3C] text-white text-[11px] font-semibold text-center hover:bg-[#10382D]"
                  >
                    View Spare Parts
                  </button>
                  <button
                    onClick={() => onNavigate('ai-agent', { mode: 'worth_buying', productId: p.id })}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#23734D] text-white text-[11px] font-semibold text-center hover:bg-[#1b5e3e]"
                  >
                    Ask AI: Worth Buying?
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};
