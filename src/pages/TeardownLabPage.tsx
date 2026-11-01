import React, { useState } from 'react';
import { ThreeDeviceLab } from '../components/ThreeDeviceLab';
import { ProductService } from '../services/productService';
import {
  Layers,
  Wrench,
  ShieldCheck,
  Cpu,
  Calculator,
  MapPin,
  Bot,
  Info,
  ArrowRight,
} from 'lucide-react';

interface TeardownLabPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialProductId?: string;
}

export const TeardownLabPage: React.FC<TeardownLabPageProps> = ({
  onNavigate,
  initialProductId,
}) => {
  const products = ProductService.getAll();
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ''
  );

  const currentProduct = ProductService.getById(selectedProductId) || products[0];

  if (!currentProduct) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-white border border-[#DCE4DC] rounded-3xl p-10">
          <Layers className="w-10 h-10 text-[#39805B] mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#10382D]">3D Teardown Lab</h1>
          <p className="text-sm text-[#68776E] mt-3">Device models will appear here when the product catalogue is connected to the backend.</p>
          <button onClick={() => onNavigate('products')} className="mt-6 px-5 py-2.5 rounded-xl bg-[#174C3C] text-white text-sm font-bold">Browse product catalogue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Three.js WebGL 3D Craft</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
              Interactive 3D Device Teardown & Parts Lab
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
              Inspect an exploded view of procedural smartphone sub-assemblies. Rotate, zoom, and select internal components to evaluate teardown friction, adhesive pull tabs, and replacement costs.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#5D6B63]">Active Model:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="py-2 px-3 rounded-xl border border-[#DCE4DC] bg-white text-[#10382D] font-bold shadow-2xs"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.modelName} (Score: {p.repairabilityScore})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div>
        <ThreeDeviceLab
          onNavigate={onNavigate}
          productName={`${currentProduct.brand} ${currentProduct.modelName}`}
        />
      </div>

      {/* Explanatory Guide & Teardown Architecture Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#10382D] font-bold text-sm">
            <Wrench className="w-4 h-4 text-[#23734D]" />
            <span>Battery Pull-Tab Architecture</span>
          </div>
          <p className="text-xs text-[#5D6B63] leading-relaxed">
            Modern repairable smartphones use stretch-release pull tabs under the lithium pouch. This prevents dangerous puncture risk and avoids chemical isopropyl alcohol dissolution during servicing.
          </p>
          <button
            onClick={() => onNavigate('spare-parts', { productId: currentProduct.id, category: 'Battery' })}
            className="text-xs font-bold text-[#174C3C] hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Compatible Batteries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#10382D] font-bold text-sm">
            <Cpu className="w-4 h-4 text-[#23734D]" />
            <span>Display & Digitizer Bonding</span>
          </div>
          <p className="text-xs text-[#5D6B63] leading-relaxed">
            AMOLED panels fused directly with front Gorilla Glass require specialized heat separators or full display assembly replacements. Inspecting the bezel frame helps ensure proper frame seating.
          </p>
          <button
            onClick={() => onNavigate('spare-parts', { productId: currentProduct.id, category: 'Display' })}
            className="text-xs font-bold text-[#174C3C] hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Screen Assemblies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#10382D] font-bold text-sm">
            <Calculator className="w-4 h-4 text-[#23734D]" />
            <span>Modular Sub-Boards vs Mainboard</span>
          </div>
          <p className="text-xs text-[#5D6B63] leading-relaxed">
            Separating the USB-C charging daughterboard from the primary logic board keeps charging port repairs economical (₹450–₹1,100) instead of requiring expensive motherboard swaps.
          </p>
          <button
            onClick={() => onNavigate('calculator', { productId: currentProduct.id })}
            className="text-xs font-bold text-[#174C3C] hover:underline flex items-center gap-1 pt-1"
          >
            <span>Calculate Repair Economics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
