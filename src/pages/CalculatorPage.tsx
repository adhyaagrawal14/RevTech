import React, { useState, useEffect } from 'react';
import { CalculatorService } from '../services/calculatorService';
import { ProductService } from '../services/productService';
import { SparePartService } from '../services/sparePartService';
import { Product } from '../types';
import {
  Calculator,
  Wrench,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CalculatorPageProps {
  initialProductId?: string;
  initialComponent?: string;
  initialMinPartCost?: number;
  initialMaxPartCost?: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  initialProductId,
  initialComponent,
  initialMinPartCost,
  initialMaxPartCost,
  onNavigate,
}) => {
  const products = ProductService.getAll();
  const [activeTab, setActiveTab] = useState<'repair_vs_replace' | 'repair_estimator' | 'ownership_cost'>('repair_vs_replace');

  // Sub-tab 1: Repair Estimator State
  const [estProductId, setEstProductId] = useState<string>(initialProductId || '');
  const [estComponentName, setEstComponentName] = useState<string>(initialComponent || 'Screen / Display Replacement');
  const [estMinPartCost, setEstMinPartCost] = useState<number>(initialMinPartCost ?? 0);
  const [estMaxPartCost, setEstMaxPartCost] = useState<number>(initialMaxPartCost ?? 0);
  const [estMinLabour, setEstMinLabour] = useState<number>(0);
  const [estMaxLabour, setEstMaxLabour] = useState<number>(0);
  const [estAdditionalFee, setEstAdditionalFee] = useState<number>(0); // adhesive kit
  const [includeLabour, setIncludeLabour] = useState<boolean>(true);

  // Sub-tab 2: Repair vs Replace State
  const [rvsRepairCost, setRvsRepairCost] = useState<number>(initialMaxPartCost ? initialMaxPartCost + 1000 : 0);
  const [rvsRemainingLife, setRvsRemainingLife] = useState<number>(0); // months
  const [rvsReplacementPrice, setRvsReplacementPrice] = useState<number>(0);
  const [rvsReplacementLife, setRvsReplacementLife] = useState<number>(0); // months

  // Sub-tab 3: 3-Year / 5-Year Ownership Cost State
  const [tcoInitialPrice, setTcoInitialPrice] = useState<number>(0);
  const [tcoHorizonYears, setTcoHorizonYears] = useState<3 | 5>(3);
  const [tcoIncludeBattery, setTcoIncludeBattery] = useState<boolean>(true);
  const [tcoBatteryCost, setTcoBatteryCost] = useState<number>(0);
  const [tcoScreenRisk, setTcoScreenRisk] = useState<number>(0); // 35% probability
  const [tcoScreenCost, setTcoScreenCost] = useState<number>(0);

  // Run Calculations
  const repairEstimateResult = CalculatorService.calculateRepairEstimate({
    productId: estProductId,
    componentName: estComponentName,
    minPartPriceInr: estMinPartCost,
    maxPartPriceInr: estMaxPartCost,
    minLabourPriceInr: estMinLabour,
    maxLabourPriceInr: estMaxLabour,
    additionalFeesInr: estAdditionalFee,
    includeLabour,
  });

  const rvsResult = CalculatorService.calculateRepairVsReplace({
    repairCostInr: rvsRepairCost,
    remainingLifeMonths: rvsRemainingLife,
    replacementDevicePriceInr: rvsReplacementPrice,
    replacementLifeMonths: rvsReplacementLife,
  });

  const tcoResult = CalculatorService.calculateOwnershipCost({
    initialPriceInr: tcoInitialPrice,
    years: tcoHorizonYears,
    expectedRepairsCount: 1,
    includeBatterySwap: tcoIncludeBattery,
    batteryCostInr: tcoBatteryCost,
    screenRiskProbability: tcoScreenRisk,
    screenCostInr: tcoScreenCost,
  });

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-[#23734D]" />
            <span>Deterministic Math Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
            Repair & Ownership Financial Calculators
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
            Mathematical decision tools that eliminate sunk-cost fallacy, amortize post-repair lifespans into monthly rates, and separate parts costs from technician labour.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DCE4DC] gap-4 text-xs font-bold">
        {[
          { id: 'repair_vs_replace', label: '1. Repair vs Replace Engine' },
          { id: 'repair_estimator', label: '2. Component Repair Estimator' },
          { id: 'ownership_cost', label: '3. 3-Year Ownership Cost (TCO)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#174C3C] text-[#10382D]'
                : 'border-transparent text-[#78857D] hover:text-[#1B2722]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Repair vs Replace Engine */}
      {activeTab === 'repair_vs_replace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#10382D] border-b border-[#DCE4DC] pb-2">
              Financial Comparison Parameters
            </h3>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">
                Estimated Upfront Repair Cost (₹)
              </label>
              <input
                type="number"
                value={rvsRepairCost}
                onChange={(e) => setRvsRepairCost(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] font-semibold text-[#1B2722]"
              />
              <span className="text-[10px] text-[#78857D] mt-0.5 block">
                Total parts + technician labor fee
              </span>
            </div>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">
                Expected Usable Lifespan Post-Repair
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[12, 18, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setRvsRemainingLife(m)}
                    className={`py-2 px-2 rounded-lg border font-medium ${
                      rvsRemainingLife === m
                        ? 'bg-[#174C3C] text-white border-[#174C3C]'
                        : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC]'
                    }`}
                  >
                    {m} Months ({m / 12} yr)
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE4DC]">
              <label className="font-bold text-[#5D6B63] block mb-1">
                Replacement Device Price (₹)
              </label>
              <input
                type="number"
                value={rvsReplacementPrice}
                onChange={(e) => setRvsReplacementPrice(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] font-semibold text-[#1B2722]"
              />
            </div>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">
                Expected Life of New Device
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[36, 48].map((m) => (
                  <button
                    key={m}
                    onClick={() => setRvsReplacementLife(m)}
                    className={`py-2 px-2 rounded-lg border font-medium ${
                      rvsReplacementLife === m
                        ? 'bg-[#174C3C] text-white border-[#174C3C]'
                        : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC]'
                    }`}
                  >
                    {m} Months ({m / 12} yrs)
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EEF5EF] text-[11px] text-[#174C3C] leading-relaxed">
              <strong>Sunk Cost Rule:</strong> The money already spent purchasing your current device is ignored because it cannot be recovered. Only future cash flows determine the optimal decision.
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
            <div
              className={`p-5 rounded-2xl border ${
                rvsResult.recommendation === 'Repair appears more economical'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {rvsResult.recommendation === 'Repair appears more economical' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  Mathematical Verdict
                </span>
              </div>
              <h3 className="text-xl font-black">{rvsResult.recommendation}</h3>
              <p className="text-xs mt-1 opacity-90 leading-relaxed">
                {rvsResult.explanation[0]}
              </p>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[10px] text-[#78857D] block">Upfront Cash Saved</span>
                <span className="text-base font-black text-emerald-700">
                  ₹{rvsResult.netSavingsInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[10px] text-[#78857D] block">Repair Amortization</span>
                <span className="text-base font-black text-[#10382D]">
                  ₹{rvsResult.monthlyRepairCostInr.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[10px] text-[#78857D] block">New Amortization</span>
                <span className="text-base font-black text-[#1B2722]">
                  ₹{rvsResult.monthlyReplacementCostInr.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[10px] text-[#78857D] block">Breakeven Horizon</span>
                <span className="text-base font-black text-[#174C3C]">
                  {rvsResult.breakevenMonths} Months
                </span>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#10382D] block">
                Monthly Equivalent Cost Comparison:
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#5D6B63] mb-1">
                    <span>Repair Amortized ({rvsRemainingLife} months)</span>
                    <span>₹{rvsResult.monthlyRepairCostInr.toLocaleString('en-IN')}/month</span>
                  </div>
                  <div className="w-full bg-[#EFF3EE] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#23734D] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (rvsResult.monthlyRepairCostInr /
                            Math.max(rvsResult.monthlyRepairCostInr, rvsResult.monthlyReplacementCostInr)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#5D6B63] mb-1">
                    <span>Replacement Amortized ({rvsReplacementLife} months)</span>
                    <span>₹{rvsResult.monthlyReplacementCostInr.toLocaleString('en-IN')}/month</span>
                  </div>
                  <div className="w-full bg-[#EFF3EE] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#78857D] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (rvsResult.monthlyReplacementCostInr /
                            Math.max(rvsResult.monthlyRepairCostInr, rvsResult.monthlyReplacementCostInr)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Factors */}
            <div className="pt-2 border-t border-[#DCE4DC] space-y-1.5">
              <span className="text-xs font-bold text-[#10382D] block">Key Economic Factors:</span>
              {rvsResult.keyFactors.map((k, idx) => (
                <div key={idx} className="text-xs text-[#5D6B63] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#23734D]"></span>
                  <span>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Component Repair Estimator */}
      {activeTab === 'repair_estimator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#10382D] border-b border-[#DCE4DC] pb-2">
              Component Cost Estimator Setup
            </h3>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Product</label>
              <select
                value={estProductId}
                onChange={(e) => setEstProductId(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.modelName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Component</label>
              <input
                type="text"
                value={estComponentName}
                onChange={(e) => setEstComponentName(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Part Min (₹)</label>
                <input
                  type="number"
                  value={estMinPartCost}
                  onChange={(e) => setEstMinPartCost(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>
              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Part Max (₹)</label>
                <input
                  type="number"
                  value={estMaxPartCost}
                  onChange={(e) => setEstMaxPartCost(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE4DC]">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#10382D] mb-2">
                <input
                  type="checkbox"
                  checked={includeLabour}
                  onChange={(e) => setIncludeLabour(e.target.checked)}
                  className="w-4 h-4 rounded text-[#23734D]"
                />
                <span>Include Technician Labour Estimate</span>
              </label>

              {includeLabour && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <label className="text-[11px] text-[#78857D] block mb-1">Min Labour (₹)</label>
                    <input
                      type="number"
                      value={estMinLabour}
                      onChange={(e) => setEstMinLabour(Number(e.target.value))}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#78857D] block mb-1">Max Labour (₹)</label>
                    <input
                      type="number"
                      value={estMaxLabour}
                      onChange={(e) => setEstMaxLabour(Number(e.target.value))}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#10382D]">
              Estimated Repair Expenditure
            </h3>

            <div className="p-6 rounded-2xl bg-[#EFF3EE] border border-[#DCE4DC] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5D6B63] block mb-1">Total Estimated Cost Range</span>
                <span className="text-3xl font-black text-[#10382D]">
                  ₹{repairEstimateResult.minTotalInr.toLocaleString('en-IN')}{' '}
                  {repairEstimateResult.maxTotalInr !== repairEstimateResult.minTotalInr && (
                    <span className="text-2xl font-bold text-[#5D6B63]">
                      – ₹{repairEstimateResult.maxTotalInr.toLocaleString('en-IN')}
                    </span>
                  )}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#DCE4DC] text-[#174C3C]">
                {includeLabour ? 'Parts + Labour' : 'Parts Only'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[#78857D] block mb-1">Component Part Range</span>
                <span className="font-bold text-[#1B2722]">
                  ₹{repairEstimateResult.partsRangeInr[0].toLocaleString('en-IN')} – ₹{repairEstimateResult.partsRangeInr[1].toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
                <span className="text-[#78857D] block mb-1">Technician Bench Fee</span>
                <span className="font-bold text-[#1B2722]">
                  {includeLabour
                    ? `₹${repairEstimateResult.labourRangeInr[0].toLocaleString('en-IN')} – ₹${repairEstimateResult.labourRangeInr[1].toLocaleString('en-IN')}`
                    : 'Not Included (DIY)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5D6B63] leading-relaxed">
              {repairEstimateResult.disclaimer}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Ownership Cost */}
      {activeTab === 'ownership_cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#10382D] border-b border-[#DCE4DC] pb-2">
              Ownership Cost Model Inputs
            </h3>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Device Purchase Price (₹)</label>
              <input
                type="number"
                value={tcoInitialPrice}
                onChange={(e) => setTcoInitialPrice(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              />
            </div>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Lifecycle Horizon</label>
              <div className="grid grid-cols-2 gap-2">
                {[3, 5].map((y) => (
                  <button
                    key={y}
                    onClick={() => setTcoHorizonYears(y as any)}
                    className={`py-2 rounded-lg border font-medium ${
                      tcoHorizonYears === y
                        ? 'bg-[#174C3C] text-white border-[#174C3C]'
                        : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC]'
                    }`}
                  >
                    {y} Years ({y * 12} months)
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE4DC]">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#10382D] mb-1">
                <input
                  type="checkbox"
                  checked={tcoIncludeBattery}
                  onChange={(e) => setTcoIncludeBattery(e.target.checked)}
                  className="w-4 h-4 rounded text-[#23734D]"
                />
                <span>Include Year 2 Battery Renewal (₹{tcoBatteryCost})</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#10382D]">
              {tcoHorizonYears}-Year Total Cost of Ownership
            </h3>

            <div className="p-6 rounded-2xl bg-[#EEF5EF] border border-[#DCE4DC] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5D6B63] block mb-1">Total Estimated {tcoHorizonYears}-Year Outlay</span>
                <span className="text-3xl font-black text-[#10382D]">
                  ₹{tcoResult.totalEstimatedOwnership.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#78857D] block">True Monthly Cost</span>
                <span className="text-xl font-black text-[#23734D]">
                  ₹{tcoResult.monthlyCost.toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#10382D] block">Expense Breakdown:</span>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-[#DCE4DC]">
                  <span className="text-[#5D6B63]">Hardware Purchase Price:</span>
                  <span className="font-semibold text-[#1B2722]">₹{tcoResult.breakdown.purchase.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE4DC]">
                  <span className="text-[#5D6B63]">Battery Replacement:</span>
                  <span className="font-semibold text-[#1B2722]">₹{tcoResult.breakdown.batterySwap.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE4DC]">
                  <span className="text-[#5D6B63]">Screen Breakage Risk Factor:</span>
                  <span className="font-semibold text-[#1B2722]">₹{tcoResult.breakdown.weightedScreenRisk.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#5D6B63]">Routine Maintenance & Port Cleaning:</span>
                  <span className="font-semibold text-[#1B2722]">₹{tcoResult.breakdown.maintenance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
