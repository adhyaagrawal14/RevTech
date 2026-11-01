import React from 'react';
import { ShieldCheck, Wrench, Scale, HelpCircle, Layers, Cpu, Award } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-[#23734D]" />
            <span>Methodology & Scoring System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
            RevTech Scoring Formula & Data Provenance
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
            A transparent documentation of the RevTech Repairability Index weights, deterministic lifecycle math, and data-quality standards.
          </p>
        </div>
      </div>

      {/* 5-Factor Scoring Formula Section */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#10382D]">
            The 5-Factor Repairability Weighting Model
          </h2>
          <p className="text-xs text-[#5D6B63] mt-1 leading-relaxed">
            Unlike superficial teardown ratings that focus solely on whether a phone uses standard screws, RevTech models actual consumer repair feasibility across physical parts access, economic affordability, and local service density.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <span className="text-2xl font-black text-[#174C3C]">30%</span>
            <h4 className="text-xs font-bold text-[#10382D]">Spare-Parts Availability</h4>
            <p className="text-[11px] text-[#5D6B63] leading-relaxed">
              Assesses the commercial abundance of original OEM and quality 3rd-party wear items (batteries, OLED panels, charging daughterboards) in regional distribution channels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <span className="text-2xl font-black text-[#174C3C]">25%</span>
            <h4 className="text-xs font-bold text-[#10382D]">Repair Affordability</h4>
            <p className="text-[11px] text-[#5D6B63] leading-relaxed">
              The ratio of component replacement cost to device retail value. If a screen replacement costs over 40% of the device, the affordability score penalizes the product.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <span className="text-2xl font-black text-[#174C3C]">20%</span>
            <h4 className="text-xs font-bold text-[#10382D]">Documentation Availability</h4>
            <p className="text-[11px] text-[#5D6B63] leading-relaxed">
              Availability of public service manuals, official diagnostic calibration tools (e.g. Google browser calibration vs proprietary activation locks), and schematics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <span className="text-2xl font-black text-[#174C3C]">15%</span>
            <h4 className="text-xs font-bold text-[#10382D]">Service Accessibility</h4>
            <p className="text-[11px] text-[#5D6B63] leading-relaxed">
              Density of authorized repair plazas and independent workshop capability within the user-selected service area.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <span className="text-2xl font-black text-[#174C3C]">10%</span>
            <h4 className="text-xs font-bold text-[#10382D]">Repair Complexity</h4>
            <p className="text-[11px] text-[#5D6B63] leading-relaxed">
              Physical disassembly friction: presence of stretch pull-tabs for battery extraction, standardized Phillips #00 screws, and modular daughterboards.
            </p>
          </div>
        </div>
      </div>

      {/* Sunk Cost & Economic Principles */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#10382D]">
            Economic Rationality & Sunk Cost Fallacy
          </h2>
          <p className="text-xs text-[#5D6B63] mt-1 leading-relaxed">
            How RevTech's AI Decision Agent and financial engines prevent consumer overspending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5D6B63] leading-relaxed">
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <h4 className="font-bold text-sm text-[#10382D]">1. Amortized Monthly Horizon</h4>
            <p>
              When evaluating a ₹10,000 repair versus a ₹40,000 replacement, looking only at upfront price is misleading. If the repair grants 18 months of reliable use, the effective cost is ₹555/month. If the new phone lasts 36 months, its effective depreciation is ₹1,111/month. Repairing preserves ₹30,000 upfront capital today.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
            <h4 className="font-bold text-sm text-[#10382D]">2. The 50% Economic Ceiling</h4>
            <p>
              RevTech enforces an economic rule: when a single repair expense exceeds 50% to 60% of an equivalent modern replacement device, upgrading becomes mathematically superior because newer devices grant a fresh battery cycle, newer OS security updates, and a factory warranty.
            </p>
          </div>
        </div>
      </div>

      {/* Data Provenance Standards */}
      <div className="bg-[#EFF3EE] rounded-3xl border border-[#DCE4DC] p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#23734D]" />
          <h3 className="text-base font-bold text-[#10382D]">
            Data Transparency
          </h3>
        </div>

        <div className="space-y-2 text-xs text-[#5D6B63] leading-relaxed">
          <p>
            1. <strong>Source transparency:</strong> Device specifications, prices, stock statuses and service-centre details must include their source and verification status. Unverified information must not be presented as confirmed.
          </p>
          <p>
            2. <strong>No Fabricated Claims:</strong> RevTech never claims to have telephoned stores in real-time or verified live physical warehouse stock without a live authenticated integration.
          </p>
          <p>
            3. <strong>Gemini 3.8 Flash Grounding:</strong> The AI Decision Agent uses strict prompt schemas and deterministic mathematical inputs to ensure recommendations are numerically valid, auditable, and repeatable.
          </p>
        </div>
      </div>
    </div>
  );
};
