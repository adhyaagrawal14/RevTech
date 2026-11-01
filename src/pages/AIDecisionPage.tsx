import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { ProductService } from '../services/productService';
import { CalculatorService } from '../services/calculatorService';
import { AIDecisionResult, Product, RecommendationType } from '../types';
import {
  Bot,
  Sparkles,
  Wrench,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  RefreshCw,
  Send,
  Sliders,
  DollarSign,
  MapPin,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface AIDecisionPageProps {
  initialMode?: 'repair_vs_replace' | 'worth_buying' | 'spare_parts_query';
  initialProductId?: string;
  initialComponent?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AIDecisionPage: React.FC<AIDecisionPageProps> = ({
  initialMode = 'repair_vs_replace',
  initialProductId,
  initialComponent,
  onNavigate,
}) => {
  const products = ProductService.getAll();

  const [activeTab, setActiveTab] = useState<'repair_vs_replace' | 'worth_buying' | 'spare_parts_query'>(
    initialMode
  );

  // Workflow A State: Repair vs Replace
  const [selectedProductIdA, setSelectedProductIdA] = useState<string>(
    initialProductId || ''
  );
  const [deviceAge, setDeviceAge] = useState<string>('');
  const [componentProblem, setComponentProblem] = useState<string>(
    initialComponent || 'Display / Screen Glass Shattered'
  );
  const [repairCostInr, setRepairCostInr] = useState<number>(0);
  const [currentResaleValueInr, setCurrentResaleValueInr] = useState<number>(0);
  const [remainingLifeMonths, setRemainingLifeMonths] = useState<number>(0);
  const [replacementModel, setReplacementModel] = useState<string>('');
  const [replacementPriceInr, setReplacementPriceInr] = useState<number>(0);
  const [replacementLifeMonths, setReplacementLifeMonths] = useState<number>(0);
  const [userPriorityA, setUserPriorityA] = useState<string>('Minimize cost over time');

  // Workflow B State: Worth Buying
  const [selectedProductIdB, setSelectedProductIdB] = useState<string>(
    initialProductId || ''
  );
  const [userBudgetB, setUserBudgetB] = useState<number>(0);
  const [userPriorityB, setUserPriorityB] = useState<string>('Balanced longevity & repair ease');

  // Workflow C State: Ask AI Freeform
  const [chatQuery, setChatQuery] = useState<string>('');

  // Results State
  const [decisionResult, setDecisionResult] = useState<AIDecisionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<{ status: string; hasApiKey: boolean }>({
    status: 'checking',
    hasApiKey: false,
  });

  // Check backend Gemini readiness on load
  useEffect(() => {
    GeminiService.checkHealth().then((res) => setHealthStatus(res));
  }, []);

  // Update default costs if product A changes
  useEffect(() => {
    const prod = ProductService.getById(selectedProductIdA);
    if (prod) {
      if (componentProblem.toLowerCase().includes('screen') || componentProblem.toLowerCase().includes('display')) {
        setRepairCostInr(prod.partsSummary.screenEstimatedCost);
      } else if (componentProblem.toLowerCase().includes('battery')) {
        setRepairCostInr(prod.partsSummary.batteryEstimatedCost);
      }
    }
  }, [selectedProductIdA, componentProblem]);

  // Execute Repair vs Replace evaluation
  const handleRunRepairVsReplace = async () => {
    setIsLoading(true);
    const prod = ProductService.getById(selectedProductIdA);
    const payload = {
      productName: prod ? `${prod.brand} ${prod.modelName}` : 'Smartphone',
      deviceAge,
      component: componentProblem,
      repairCostInr,
      currentDeviceValueInr: currentResaleValueInr,
      remainingLifeMonths,
      replacementModel,
      replacementPriceInr,
      replacementLifeMonths,
      userPriority: userPriorityA,
    };

    const res = await GeminiService.getDecision('repair_vs_replace', payload);
    setDecisionResult(res);
    setIsLoading(false);
  };

  // Execute Worth Buying evaluation
  const handleRunWorthBuying = async () => {
    setIsLoading(true);
    const prod = ProductService.getById(selectedProductIdB);
    if (!prod) { setIsLoading(false); return; }
    const payload = {
      brand: prod.brand,
      modelName: prod.modelName,
      variant: prod.variant,
      priceInr: prod.priceInr,
      repairabilityScore: prod.repairabilityScore,
      screenCostInr: prod.partsSummary.screenEstimatedCost,
      batteryCostInr: prod.partsSummary.batteryEstimatedCost,
      warrantyDuration: 12,
      userBudget: userBudgetB,
      userPriority: userPriorityB,
      reviewSummary: `${prod.brand} ${prod.modelName} scores ${prod.repairabilityScore}/10 with ${prod.partsSummary.availableCount} of ${prod.partsSummary.totalComponentsListed} core parts indexed in the connected catalogue.`,
    };

    const res = await GeminiService.getDecision('worth_buying', payload);
    setDecisionResult(res);
    setIsLoading(false);
  };

  // Execute Freeform Query
  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    const payload = {
      query: queryText,
      context: `Selected device: ${selectedProductIdA}`,
    };
    const res = await GeminiService.getDecision('spare_parts_query', payload);
    setDecisionResult(res);
    setIsLoading(false);
  };

  // Analysis runs only after an explicit user action; no seeded scenario is executed on page load.

  const getRecommendationBadge = (rec: RecommendationType) => {
    switch (rec) {
      case 'Repair appears more economical':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          title: 'Repair Appears More Economical',
        };
      case 'Replacement appears more economical':
        return {
          icon: AlertTriangle,
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          title: 'Replacement Appears More Economical',
        };
      case 'Buying appears reasonable based on the available information':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          title: 'Buying Appears Reasonable & Sustainable',
        };
      case 'Consider an alternative product':
        return {
          icon: XCircle,
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          title: 'Consider An Alternative Product',
        };
      default:
        return {
          icon: HelpCircle,
          color: 'bg-stone-100 text-stone-900 border-stone-300',
          title: 'Insufficient Information for Absolute Decision',
        };
    }
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner (Section 9.1) */}
      <div className="bg-gradient-to-r from-[#10382D] to-[#174C3C] text-white rounded-3xl p-6 sm:p-8 border border-[#10382D] shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI-assisted decision support</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Meet RevTech AI
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Get a clearer picture before you spend money on a new device or a repair. Grounded in deterministic economic calculations, spare parts records, and available source data and user-provided inputs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('ai-chat')}
              className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#10382D] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Multi-Turn Chat</span>
            </button>

            <span
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold ${
                healthStatus.hasApiKey
                  ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
                  : 'bg-white/10 text-emerald-100 border-white/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${healthStatus.hasApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{healthStatus.hasApiKey ? 'Gemini 3.8 Live API Attached' : 'Calibrated Rule Engine Ready'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Main Mode Selectors (Section 9.1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveTab('repair_vs_replace');
            setDecisionResult(null);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'repair_vs_replace'
              ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
              : 'bg-white text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Wrench className={`w-4 h-4 ${activeTab === 'repair_vs_replace' ? 'text-emerald-300' : 'text-[#23734D]'}`} />
            <span className="font-bold text-sm">Should I Repair or Replace?</span>
          </div>
          <p className={`text-xs ${activeTab === 'repair_vs_replace' ? 'text-emerald-100' : 'text-[#5D6B63]'}`}>
            Evaluate upfront repair cash vs new device monthly amortization.
          </p>
        </button>

        <button
          onClick={() => {
            setActiveTab('worth_buying');
            setDecisionResult(null);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'worth_buying'
              ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
              : 'bg-white text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className={`w-4 h-4 ${activeTab === 'worth_buying' ? 'text-emerald-300' : 'text-[#23734D]'}`} />
            <span className="font-bold text-sm">Is This Product Worth Buying?</span>
          </div>
          <p className={`text-xs ${activeTab === 'worth_buying' ? 'text-emerald-100' : 'text-[#5D6B63]'}`}>
            Assess long-term ownership costs, spare parts availability & score.
          </p>
        </button>

        <button
          onClick={() => {
            setActiveTab('spare_parts_query');
            setDecisionResult(null);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'spare_parts_query'
              ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
              : 'bg-white text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className={`w-4 h-4 ${activeTab === 'spare_parts_query' ? 'text-emerald-300' : 'text-[#23734D]'}`} />
            <span className="font-bold text-sm">Interpret Spare Parts & Advice</span>
          </div>
          <p className={`text-xs ${activeTab === 'spare_parts_query' ? 'text-emerald-100' : 'text-[#5D6B63]'}`}>
            Ask about OEM vs 3rd party differences, questions for shops, etc.
          </p>
        </button>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls / Customizer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DC]">
            <h3 className="text-sm font-bold text-[#10382D] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#23734D]" />
              <span>Input Parameters & Trade-offs</span>
            </h3>
            <span className="text-[10px] text-[#78857D] uppercase font-semibold">Configurable</span>
          </div>

          {/* Form for Workflow A: Repair vs Replace */}
          {activeTab === 'repair_vs_replace' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#10382D] block mb-1">
                  1. Current Smartphone
                </label>
                <select
                  value={selectedProductIdA}
                  onChange={(e) => setSelectedProductIdA(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] text-[#1B2722]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} (Repairability: {p.repairabilityScore}/10)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#5D6B63] block mb-1">Device Age</label>
                  <select
                    value={deviceAge}
                    onChange={(e) => setDeviceAge(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                  >
                    <option value="12 months">1 Year (12 mos)</option>
                    <option value="24 months">2 Years (24 mos)</option>
                    <option value="36 months">3 Years (36 mos)</option>
                    <option value="48 months">4+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#5D6B63] block mb-1">Post-Repair Life</label>
                  <select
                    value={remainingLifeMonths}
                    onChange={(e) => setRemainingLifeMonths(Number(e.target.value))}
                    className="w-full py-2 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                  >
                    <option value={12}>12 Months (1 yr)</option>
                    <option value={18}>18 Months (1.5 yrs)</option>
                    <option value={24}>24 Months (2 yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Component / Damaged Part</label>
                <select
                  value={componentProblem}
                  onChange={(e) => setComponentProblem(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                >
                  <option value="Screen / Display Cracked">Screen / Display Glass Shattered</option>
                  <option value="Battery Draining Rapidly">Battery Health Depleted (&lt;75%)</option>
                  <option value="USB-C Charging Port Damaged">USB-C Charging Port Loose</option>
                  <option value="Camera Lens Shattered">Primary Camera Module / OIS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#5D6B63] block mb-1">Repair Cost (₹)</label>
                  <input
                    type="number"
                    value={repairCostInr}
                    onChange={(e) => setRepairCostInr(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] font-semibold text-[#1B2722]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#5D6B63] block mb-1">New Phone Price (₹)</label>
                  <input
                    type="number"
                    value={replacementPriceInr}
                    onChange={(e) => setReplacementPriceInr(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] font-semibold text-[#1B2722]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Your Main Priority</label>
                <select
                  value={userPriorityA}
                  onChange={(e) => setUserPriorityA(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                >
                  <option value="Minimize cost over time">Lowest total cost over time (Recommended)</option>
                  <option value="Spend less money immediately">Spend less immediate cash today</option>
                  <option value="Keep device longer">Maximize sustainability & keep phone longer</option>
                  <option value="Avoid uncertain repair outcomes">Avoid uncertain repair risk</option>
                </select>
              </div>

              <button
                onClick={handleRunRepairVsReplace}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                ) : (
                  <Bot className="w-4 h-4 text-emerald-300" />
                )}
                <span>{isLoading ? 'Analyzing Parameters...' : 'Ask RevTech AI to Decide'}</span>
              </button>
            </div>
          )}

          {/* Form for Workflow B: Worth Buying */}
          {activeTab === 'worth_buying' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#10382D] block mb-1">
                  Select Smartphone to Evaluate
                </label>
                <select
                  value={selectedProductIdB}
                  onChange={(e) => setSelectedProductIdB(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] text-[#1B2722]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} — ₹{p.priceInr.toLocaleString('en-IN')} (Score: {p.repairabilityScore})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Your Total Budget (₹)</label>
                <input
                  type="number"
                  value={userBudgetB}
                  onChange={(e) => setUserBudgetB(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] font-semibold text-[#1B2722]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D6B63] block mb-1">Priority Factor</label>
                <select
                  value={userPriorityB}
                  onChange={(e) => setUserPriorityB(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
                >
                  <option value="Balanced longevity & repair ease">Balanced 3-year value & parts availability</option>
                  <option value="Lowest future repair expenses">Cheapest future screen/battery replacements</option>
                  <option value="Maximum official warranty security">Best official service centre coverage</option>
                </select>
              </div>

              <button
                onClick={handleRunWorthBuying}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                ) : (
                  <Bot className="w-4 h-4 text-emerald-300" />
                )}
                <span>{isLoading ? 'Evaluating Device Profile...' : 'Analyze Purchase Value'}</span>
              </button>
            </div>
          )}

          {/* Form for Workflow C: Freeform Prompt */}
          {activeTab === 'spare_parts_query' && (
            <div className="space-y-4 text-xs">
              <p className="text-[#5D6B63] leading-relaxed">
                Ask specific questions regarding spare-parts compatibility, the difference between OEM and 3rd-party displays, or how to negotiate with repair shops.
              </p>

              <div className="space-y-1.5">
                <span className="font-bold text-[#10382D] block">Suggested Question Chips:</span>
                {[
                  'What is the difference between OEM Original and Compatible Third-Party screens?',
                  'What should I ask the technician before leaving my phone for a battery swap?',
                  'Is replacing an iPhone 14 battery going to show an Unknown Part warning in iOS?',
                  'Does changing the Nothing Phone 2 back glass affect the Glyph lights?',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setChatQuery(chip);
                      handleRunQuery(chip);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-[#F8FAF7] hover:bg-[#EEF5EF] border border-[#DCE4DC] text-[11px] text-[#174C3C] transition-colors leading-snug"
                  >
                    "{chip}"
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <textarea
                  rows={3}
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="Type any spare parts or repair question..."
                  className="w-full p-2.5 rounded-xl border border-[#DCE4DC] bg-[#F8FAF7] text-xs text-[#1B2722] focus:outline-hidden focus:border-[#23734D]"
                />
                <button
                  onClick={() => handleRunQuery(chatQuery)}
                  disabled={isLoading || !chatQuery.trim()}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-[#174C3C] text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Question</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Structured AI Recommendation Output Card (Section 9.6) */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#EEF5EF] flex items-center justify-center text-[#174C3C] mx-auto animate-pulse">
                <Bot className="w-6 h-6 text-[#23734D]" />
              </div>
              <h3 className="text-base font-bold text-[#10382D]">
                RevTech AI Decision Agent Thinking...
              </h3>
              <p className="text-xs text-[#5D6B63] max-w-sm mx-auto">
                Evaluating the information supplied and available connected records.
              </p>
            </div>
          ) : decisionResult ? (
            <div className="bg-white rounded-3xl border border-[#DCE4DC] shadow-md overflow-hidden animate-fadeIn">
              {/* Verdict Header Badge */}
              {(() => {
                const recBadge = getRecommendationBadge(decisionResult.recommendation);
                const RecIcon = recBadge.icon;
                return (
                  <div className={`p-6 border-b border-[#DCE4DC] ${recBadge.color}`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <RecIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Official RevTech Verdict
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/70 border border-current">
                        Confidence: {decisionResult.confidence}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black leading-snug">
                      {decisionResult.headline}
                    </h2>
                  </div>
                );
              })()}

              {/* Recommendation Card Body */}
              <div className="p-6 space-y-6">
                {/* 1. Why this recommendation was made */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#10382D] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#23734D]" />
                    <span>Why This Recommendation Was Made</span>
                  </h4>
                  <ul className="space-y-2">
                    {decisionResult.whyThisRecommendation.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#1B2722] bg-[#F8FAF7] p-2.5 rounded-xl border border-[#DCE4DC] leading-relaxed flex items-start gap-2"
                      >
                        <span className="font-bold text-[#23734D] mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Deterministic Cost Comparison */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#10382D] mb-2 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-[#23734D]" />
                    <span>Cost Comparison & Math Breakdown</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-[#EFF3EE] border border-[#DCE4DC]">
                      <span className="text-[10px] text-[#78857D] block">Upfront Repair Cash</span>
                      <span className="text-base font-black text-[#10382D]">
                        ₹{decisionResult.costComparison.upfrontRepairInr.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {decisionResult.costComparison.replacementCostInr ? (
                      <div className="p-3 rounded-xl bg-[#EFF3EE] border border-[#DCE4DC]">
                        <span className="text-[10px] text-[#78857D] block">New Device Price</span>
                        <span className="text-base font-black text-[#10382D]">
                          ₹{decisionResult.costComparison.replacementCostInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null}

                    {decisionResult.costComparison.netSavingsInr ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 block">Immediate Cash Saved</span>
                        <span className="text-base font-black text-emerald-900">
                          ₹{decisionResult.costComparison.netSavingsInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#5D6B63] leading-relaxed">
                    {decisionResult.costComparison.details}
                  </p>
                </div>

                {/* 3. Spare Parts & Local Services Situation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-1">
                    <span className="text-[10px] font-bold text-[#10382D] uppercase tracking-wider block">
                      Spare Parts Situation
                    </span>
                    <p className="text-xs text-[#5D6B63] leading-relaxed">
                      {decisionResult.sparePartsSituation.summary}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-1">
                    <span className="text-[10px] font-bold text-[#10382D] uppercase tracking-wider block">
                      Nearby Services
                    </span>
                    <p className="text-xs text-[#5D6B63] leading-relaxed">
                      {decisionResult.localServiceOptions.summary}
                    </p>
                  </div>
                </div>

                {/* 4. What To Check Next */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#10382D] mb-2">
                    What to Check Next
                  </h4>
                  <div className="space-y-1.5">
                    {decisionResult.whatToCheckNext.map((step, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-[#5D6B63] flex items-center gap-2 p-2 rounded-lg bg-[#EFF3EE]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#174C3C] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation Actions */}
                <div className="pt-4 border-t border-[#DCE4DC]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D] block mb-2">
                    Recommended Next Actions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {decisionResult.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(action.page, action.params)}
                        className="py-2 px-3.5 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Provenance Footer */}
              <div className="p-3 bg-[#EFF3EE] border-t border-[#DCE4DC] flex items-center justify-between text-[11px] text-[#5D6B63]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#23734D]" />
                  <span>Engine: {decisionResult.engineUsed}</span>
                </div>
                <span>{decisionResult.generationNotice}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-10 text-center space-y-3">
              <Bot className="w-8 h-8 text-[#23734D] mx-auto" />
              <h3 className="text-base font-bold text-[#10382D]">
                Configure Inputs to Run RevTech AI Decision
              </h3>
              <p className="text-xs text-[#5D6B63] max-w-sm mx-auto">
                Select your smartphone model and parameters on the left to generate an objective verdict.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
