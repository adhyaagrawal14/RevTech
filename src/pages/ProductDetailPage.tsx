import React from 'react';
import { Product, SparePart } from '../types';
import { ProductService } from '../services/productService';
import { SparePartService } from '../services/sparePartService';
import {
  Wrench,
  ShieldCheck,
  Bot,
  MapPin,
  Calculator,
  ArrowLeft,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
  Box,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onNavigate,
}) => {
  const product = ProductService.getById(productId);
  if (!product) return <div className="max-w-3xl mx-auto px-6 py-20 text-center"><h2 className="text-xl font-bold text-[#10382D]">Device details are not available yet</h2><p className="text-sm text-[#5D6B63] mt-2">The device catalogue will appear here when connected to the RevTech backend.</p><button onClick={onBack} className="mt-5 px-4 py-2 rounded-xl bg-[#174C3C] text-white">Back to catalogue</button></div>;
  const parts = SparePartService.getByProductId(product.id);
  const reviews: any[] = [];
  const warranty = undefined;

  const factorConfig = [
    { label: 'Spare-Parts Availability', weight: '30%', value: product.factors.partsAvailability, desc: 'Abundance & commercial access to core wear components' },
    { label: 'Repair Affordability', weight: '25%', value: product.factors.repairAffordability, desc: 'Component cost relative to device retail price' },
    { label: 'Repair Documentation', weight: '20%', value: product.factors.documentation, desc: 'Public schematics, teardowns, and diagnostic tools' },
    { label: 'Service Accessibility', weight: '15%', value: product.factors.serviceAccessibility, desc: 'Local independent and authorised repair clinic density' },
    { label: 'Repair Complexity', weight: '10%', value: product.factors.repairComplexity, desc: 'Standard screw fasteners, pull-tabs vs tight industrial glue' },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-xs font-semibold text-[#5D6B63] hover:text-[#10382D] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </button>

      {/* Hero Product Overview */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Product Visual */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 bg-[#EFF3EE] rounded-2xl relative">
          <img
            src={product.image}
            alt={`${product.brand} ${product.modelName}`}
            className="max-h-72 object-contain drop-shadow-xl"
          />
          <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#10382D] text-white">
            Device information
          </span>
        </div>

        {/* Specs & Score Summary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#23734D] bg-[#EEF5EF] px-2.5 py-1 rounded-full">
              {product.brand} • {product.category}
            </span>
            <span className="text-xs text-[#78857D]">Released {product.releaseYear}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#10382D] tracking-tight">
            {product.brand} {product.modelName}
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63]">{product.variant}</p>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#1B2722]">
              ₹{product.priceInr.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#78857D]">Estimated Retail in India</span>
          </div>

          {/* Repairability Index Score Spotlight */}
          <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#DCE4DC] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#23734D]" />
                <span className="text-xs font-bold text-[#10382D]">RevTech Repairability Index</span>
              </div>
              <p className="text-[11px] text-[#5D6B63] mt-0.5">
                Calculated via 5 transparent lifecycle weights. Confidence: {product.scoreConfidence}.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#10382D]">
                {product.repairabilityScore}
              </span>
              <span className="text-xs text-[#5D6B63] font-bold"> / 10</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('spare-parts', { productId: product.id })}
              className="py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Wrench className="w-4 h-4 text-emerald-300" />
              <span>Explore Spare Parts ({parts.length})</span>
            </button>

            <button
              onClick={() => onNavigate('ai-agent', { mode: 'worth_buying', productId: product.id })}
              className="py-2.5 px-4 rounded-xl bg-[#23734D] hover:bg-[#1b5e3e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Ask AI: Worth Buying?</span>
            </button>

            <button
              onClick={() => onNavigate('3d-lab', { productId: product.id })}
              className="py-2.5 px-4 rounded-xl bg-[#EEF5EF] hover:bg-[#DCE9DF] text-[#174C3C] border border-[#DCE4DC] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Box className="w-4 h-4 text-[#23734D]" />
              <span>Inspect in 3D Lab</span>
            </button>

            <button
              onClick={() => onNavigate('calculator', { productId: product.id })}
              className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#F8FAF7] text-[#10382D] border border-[#DCE4DC] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#23734D]" />
              <span>Repair vs Replace</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Factor Repairability Score Breakdown (Section 12) */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#DCE4DC]">
          <div>
            <h2 className="text-lg font-bold text-[#10382D]">
              Repairability Index Methodology Breakdown
            </h2>
            <p className="text-xs text-[#5D6B63]">
              RevTech evaluates smartphones against 5 objective factors rather than subjective teardown aesthetics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('methodology')}
            className="text-xs font-bold text-[#174C3C] hover:underline"
          >
            View Full Scoring Formula
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {factorConfig.map((f, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#78857D]">{f.weight} Weight</span>
                <span className="text-base font-black text-[#10382D]">{f.value} / 10</span>
              </div>
              <h4 className="text-xs font-bold text-[#10382D] leading-tight">{f.label}</h4>
              <p className="text-[11px] text-[#5D6B63] leading-relaxed">{f.desc}</p>
              {/* Progress bar */}
              <div className="w-full bg-[#DCE4DC] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#23734D] h-full rounded-full"
                  style={{ width: `${(f.value / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatible Spare Parts Section */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#10382D]">
              Compatible Spare Parts Catalog ({parts.length})
            </h2>
            <p className="text-xs text-[#5D6B63]">
              Component information for {product.brand} {product.modelName}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('spare-parts', { productId: product.id })}
            className="text-xs font-bold text-[#174C3C] hover:underline"
          >
            Open Parts Finder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map((part) => (
            <div
              key={part.id}
              className="p-4 rounded-2xl border border-[#DCE4DC] bg-[#F8FAF7] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-[#10382D] border border-[#DCE4DC]">
                    {part.partType}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {part.availabilityStatus}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#10382D] mb-1">{part.componentName}</h4>
                <div className="text-sm font-black text-[#1B2722] mb-2">
                  ₹{part.minPriceInr.toLocaleString('en-IN')}{' '}
                  {part.maxPriceInr !== part.minPriceInr && (
                    <span className="text-xs font-normal text-[#5D6B63]">
                      – ₹{part.maxPriceInr.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#DCE4DC]">
                <button
                  onClick={() => onNavigate('find-nearby', { category: part.category, model: product.modelName })}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#174C3C] text-white text-[11px] font-semibold text-center hover:bg-[#10382D]"
                >
                  Find Shops
                </button>
                <button
                  onClick={() =>
                    onNavigate('calculator', {
                      productId: product.id,
                      component: part.componentName,
                      minPartCost: part.minPriceInr,
                      maxPartCost: part.maxPriceInr,
                    })
                  }
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#EEF5EF] text-[#174C3C] text-[11px] font-semibold text-center border border-[#DCE4DC] hover:bg-[#DCE9DF]"
                >
                  Estimate Repair
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications & Warranty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Specifications */}
        <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#10382D] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#23734D]" />
            <span>Hardware Specifications & Teardown Layout</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#DCE4DC]">
              <span className="text-[#5D6B63]">Display</span>
              <span className="font-semibold text-[#1B2722] text-right">{product.specifications.display}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#DCE4DC]">
              <span className="text-[#5D6B63]">Processor</span>
              <span className="font-semibold text-[#1B2722] text-right">{product.specifications.processor}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#DCE4DC]">
              <span className="text-[#5D6B63]">Battery Capacity</span>
              <span className="font-semibold text-[#1B2722] text-right">{product.specifications.batteryCapacity}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#DCE4DC]">
              <span className="text-[#5D6B63]">Charging Tech</span>
              <span className="font-semibold text-[#1B2722] text-right">{product.specifications.chargingSpeed}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#DCE4DC]">
              <span className="text-[#5D6B63]">Back Housing Material</span>
              <span className="font-semibold text-[#1B2722] text-right">{product.specifications.backMaterial}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#5D6B63]">Adhesive & Fastener</span>
              <span className="font-semibold text-[#1B2722] text-right max-w-[200px]">{product.specifications.adhesiveType}</span>
            </div>
          </div>
        </div>

        {/* Warranty & Support Policies */}
        <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#10382D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#23734D]" />
            <span>Manufacturer Warranty & Support</span>
          </h3>

          {warranty ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EEF5EF] text-[#10382D] font-medium leading-relaxed">
                {warranty.coverageSummary}
              </div>

              <div>
                <span className="font-bold text-[#5D6B63] block mb-1">Battery Degradation Policy:</span>
                <p className="text-[#5D6B63] leading-relaxed">{warranty.batteryDegradationClause}</p>
              </div>

              <div>
                <span className="font-bold text-[#5D6B63] block mb-1">Exclusions:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#78857D]">
                  {warranty.exclusions.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={warranty.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#174C3C] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Official Support Directory</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#78857D]">Warranty information not verified for this model.</p>
          )}
        </div>
      </div>

      {/* Community Reviews (Section 10) */}
      <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DC]">
          <div>
            <h2 className="text-lg font-bold text-[#10382D]">
              Owner Repair & Durability Feedback ({reviews.length} Records)
            </h2>
            <p className="text-xs text-[#5D6B63]">
              User and community feedback, where available.
            </p>
          </div>
          <span className="text-[10px] uppercase font-semibold text-[#78857D] bg-[#EFF3EE] px-2.5 py-1 rounded-full">
            Review information
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-[#78857D]">No review records collected for this model yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DC] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#10382D]">
                    <div className="flex text-amber-500">
                      {'★'.repeat(Math.floor(rev.rating))}
                    </div>
                    <span>{rev.title}</span>
                  </div>
                  <span className="text-[11px] text-[#78857D]">{rev.ownershipDuration} of use</span>
                </div>

                <p className="text-xs text-[#5D6B63] leading-relaxed">{rev.reviewText}</p>

                <div className="p-2.5 rounded-xl bg-[#EEF5EF] text-[11px] text-[#174C3C]">
                  <strong>Repairability Insight:</strong> {rev.themes.repairFeedback}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
