import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { ProductService } from '../services/productService';
import {
  Wrench,
  Bot,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Search,
  MapPin,
  Calculator,
} from 'lucide-react';

interface RepairAssistantPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const RepairAssistantPage: React.FC<RepairAssistantPageProps> = ({ onNavigate }) => {
  const products = ProductService.getAll();

  const [productModel, setProductModel] = useState<string>('');
  const [deviceAge, setDeviceAge] = useState<string>('');
  const [symptomCategory, setSymptomCategory] = useState<string>('Battery draining quickly');
  const [description, setDescription] = useState<string>('');
  const [warrantyStatus, setWarrantyStatus] = useState<string>('Unsure');
  const [recentDamage, setRecentDamage] = useState<string>('');

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await GeminiService.getTroubleshooting({
      productModel,
      symptomCategory,
      description: `${description} Recent history: ${recentDamage}`,
      deviceAge,
      warrantyStatus,
    });
    setResult(res.result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5 text-[#23734D]" />
            <span>AI Diagnostic Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
            Repair Assistant & Safe Diagnostic Wizard
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
            Identify potential hardware vs software causes, execute safe non-destructive checks at home, and understand component replacement options without hazardous DIY.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Questionnaire Form */}
        <form
          onSubmit={handleDiagnose}
          className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-[#10382D] border-b border-[#DCE4DC] pb-2">
            Device Symptoms & History
          </h3>

          <div>
            <label className="font-bold text-[#5D6B63] block mb-1">Device Brand and Model</label>
            <input
              type="text"
              required
              value={productModel}
              onChange={(e) => setProductModel(e.target.value)}
              placeholder="Enter your device model"
              className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Device Age</label>
              <select
                value={deviceAge}
                onChange={(e) => setDeviceAge(e.target.value)}
                className="w-full py-2 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              >
                <option value="">Select device age</option>
                <option value="Under 6 months">&lt; 6 Months</option>
                <option value="12 months">1 Year (12 mos)</option>
                <option value="18 months">1.5 Years (18 mos)</option>
                <option value="24+ months">2+ Years</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#5D6B63] block mb-1">Warranty Status</label>
              <select
                value={warrantyStatus}
                onChange={(e) => setWarrantyStatus(e.target.value)}
                className="w-full py-2 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              >
                <option value="In Warranty">Active Manufacturer Warranty</option>
                <option value="Expired">Expired (Out of Warranty)</option>
                <option value="Unsure">Not sure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#5D6B63] block mb-1">Primary Symptom Category</label>
            <select
              value={symptomCategory}
              onChange={(e) => setSymptomCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
            >
              <option value="Battery draining quickly">Battery draining quickly / Sudden shutdown</option>
              <option value="Charging problem / Loose port">Charging problem / Port loose / Slow charge</option>
              <option value="Display flickering or lines">Display lines / Touch ghosting / Cracked glass</option>
              <option value="Camera blurry or vibrating">Camera blurry / OIS rattling / Lens crack</option>
              <option value="Speaker or microphone problem">Speaker muffled / Low in-call earpiece volume</option>
              <option value="Device overheating">Device overheating while idle</option>
              <option value="Device not turning on">Device completely unresponsive</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#5D6B63] block mb-1">Describe What Happened</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the symptoms you have noticed..."
              className="w-full p-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] text-xs text-[#1B2722]"
            />
          </div>

          <div>
            <label className="font-bold text-[#5D6B63] block mb-1">Recent Physical Shocks / Liquid</label>
            <input
              type="text"
              value={recentDamage}
              onChange={(e) => setRecentDamage(e.target.value)}
              placeholder="Optional: mention any recent drops, liquid exposure, or charger changes..."
              className="w-full py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span>{isLoading ? 'Running Triage Diagnostics...' : 'Diagnose Problem Safely'}</span>
          </button>
        </form>

        {/* Diagnostic Results Card */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4">
              <Bot className="w-8 h-8 text-[#23734D] animate-bounce mx-auto" />
              <h3 className="text-base font-bold text-[#10382D]">
                Analyzing Device Symptoms with Gemini...
              </h3>
              <p className="text-xs text-[#5D6B63]">
                Checking safe non-destructive checks and component failure benchmarks.
              </p>
            </div>
          ) : result ? (
            <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
              <div className="border-b border-[#DCE4DC] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#23734D] bg-[#EEF5EF] px-2.5 py-1 rounded-full">
                  Diagnostic Assessment
                </span>
                <h3 className="text-xl font-bold text-[#10382D] mt-2">
                  Likely Root Cause
                </h3>
                <p className="text-xs text-[#1B2722] mt-1 leading-relaxed bg-[#F8FAF7] p-3 rounded-xl border border-[#DCE4DC]">
                  {result.likelyCause}
                </p>
              </div>

              {/* Safe Basic Checks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#10382D] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#23734D]" />
                  <span>Safe DIY Checks to Perform First (Non-Destructive)</span>
                </h4>
                <div className="space-y-1.5">
                  {result.safeBasicChecks?.map((check: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] text-xs text-[#5D6B63] flex items-start gap-2"
                    >
                      <span className="font-bold text-[#174C3C] mt-0.5">•</span>
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Component & Safety Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#EEF5EF] border border-[#DCE4DC]">
                  <span className="text-[10px] font-bold uppercase text-[#10382D] block mb-1">
                    Suspected Component
                  </span>
                  <span className="text-sm font-black text-[#174C3C]">
                    {result.estimatedHardwareComponent}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFDF5] border border-amber-200">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-900 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>Safety Advisory</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-snug">
                    {result.safetyWarnings}
                  </p>
                </div>
              </div>

              {/* Recommended Next Step */}
              <div className="p-4 rounded-xl bg-[#10382D] text-white text-xs leading-relaxed">
                <span className="font-bold text-emerald-300 block mb-1">
                  Professional Recommendation:
                </span>
                {result.recommendedNextStep}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-[#DCE4DC] flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigate('spare-parts', { search: productModel })}
                  className="py-2 px-3 rounded-lg bg-[#174C3C] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Find Spare Part</span>
                </button>
                <button
                  onClick={() => onNavigate('find-nearby')}
                  className="py-2 px-3 rounded-lg bg-[#EEF5EF] text-[#174C3C] text-xs font-bold border border-[#DCE4DC] flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Find Nearby Workshops</span>
                </button>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="py-2 px-3 rounded-lg bg-white text-[#10382D] text-xs font-bold border border-[#DCE4DC] flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate Repair vs Replace</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-10 text-center space-y-3">
              <Wrench className="w-8 h-8 text-[#23734D] mx-auto" />
              <h3 className="text-base font-bold text-[#10382D]">
                Fill In Symptoms to Start Triage
              </h3>
              <p className="text-xs text-[#5D6B63] max-w-sm mx-auto">
                The RevTech diagnostic agent will formulate safe non-invasive checks and flag hardware components requiring inspection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
