import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductService } from '../services/productService';
import { SparePartService } from '../services/sparePartService';
import { Product } from '../types';
import {
  Search,
  Wrench,
  MapPin,
  Bot,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Box,
  MessageSquare,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredProducts = ProductService.getAll().slice(0, 3);
  const allProducts = ProductService.getAll();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Check if query matches a product or spare part
    const matchedProducts = ProductService.search(searchQuery);
    if (matchedProducts.length > 0) {
      onNavigate('products', { search: searchQuery });
    } else {
      onNavigate('spare-parts', { search: searchQuery });
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Hero Section */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-4 sm:pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5EF] border border-[#DCE4DC] text-xs font-semibold text-[#174C3C]">
            <Sparkles className="w-3.5 h-3.5 text-[#23734D]" />
            <span>Repairability & Ownership Cost Explorer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#10382D] tracking-tight leading-[1.1]">
            Don't replace it before you check.
          </h1>

          <p className="text-base sm:text-lg text-[#5D6B63] leading-relaxed max-w-2xl mx-auto">
            Find the right spare parts, discover nearby repair options, and let RevTech help you decide whether to repair, replace, or buy smarter.
          </p>

          {/* Search Bar with live quick suggestions */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center shadow-md rounded-2xl bg-white border border-[#DCE4DC] focus-within:border-[#23734D] focus-within:ring-3 focus-within:ring-[#23734D]/15 transition-all p-1.5"
          >
            <div className="pl-3.5 pr-2 text-[#78857D]">
              <Search className="w-5 h-5 text-[#23734D]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a phone, model, or spare part (e.g. Pixel 8 Screen, Nothing 2 Battery)..."
              className="w-full py-2.5 text-sm sm:text-base text-[#1B2722] placeholder-[#78857D] focus:outline-hidden"
            />
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-sm font-semibold transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
            <button
              onClick={() => onNavigate('spare-parts')}
              className="py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Wrench className="w-4 h-4 text-emerald-300" />
              <span>Find Spare Parts</span>
            </button>

            <button
              onClick={() => onNavigate('3d-lab')}
              className="py-2.5 px-4 rounded-xl bg-[#10382D] hover:bg-[#0b2921] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm border border-emerald-400/30"
            >
              <Box className="w-4 h-4 text-emerald-300" />
              <span>3D Teardown Lab</span>
            </button>

            <button
              onClick={() => onNavigate('find-nearby')}
              className="py-2.5 px-4 rounded-xl bg-[#EEF5EF] hover:bg-[#DCE9DF] text-[#174C3C] border border-[#DCE4DC] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-[#23734D]" />
              <span>Nearby Repair Centres</span>
            </button>

            <button
              onClick={() => onNavigate('ai-chat')}
              className="py-2.5 px-4 rounded-xl bg-[#23734D] hover:bg-[#1b5e3e] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>Gemini Chat</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Quick Action Cards (Section 6.2) */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Spare Parts Finder */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DCE4DC] flex items-center justify-center text-[#174C3C] mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6 text-[#23734D]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#23734D] bg-[#EEF5EF] px-2 py-0.5 rounded-full">
                Priority 1 Feature
              </span>
              <h3 className="text-xl font-bold text-[#10382D] mt-2 mb-2">
                Spare Parts Finder
              </h3>
              <p className="text-sm text-[#5D6B63] leading-relaxed mb-6">
                Check component availability, compare estimated prices, and explore compatible parts across verified models.
              </p>
            </div>
            <button
              onClick={() => onNavigate('spare-parts')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Spare Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Nearby Repair Finder */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DCE4DC] flex items-center justify-center text-[#174C3C] mb-4 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 text-[#23734D]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#23734D] bg-[#EEF5EF] px-2 py-0.5 rounded-full">
                Priority 1 Feature
              </span>
              <h3 className="text-xl font-bold text-[#10382D] mt-2 mb-2">
                Nearby Repair Finder
              </h3>
              <p className="text-sm text-[#5D6B63] leading-relaxed mb-6">
                Find repair centres and spare-parts providers in your selected area.
              </p>
            </div>
            <button
              onClick={() => onNavigate('find-nearby')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Find Nearby</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: RevTech AI Decision Agent */}
          <div className="bg-gradient-to-br from-[#10382D] to-[#174C3C] text-white rounded-2xl p-6 border border-[#10382D] shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/60 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
              <h3 className="text-xl font-bold text-white mt-2 mb-2">
                RevTech AI Decision Agent
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
                Understand whether a product is worth buying or whether repairing your current device makes more economic sense.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ai-agent')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#10382D] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Ask RevTech AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section (Section 6.3) */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#10382D]">
                Featured Products
              </h2>
              <span className="text-[10px] font-semibold bg-[#DCE9DF] text-[#10382D] px-2 py-0.5 rounded-full">
                Evidence-based Device Data
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] mt-0.5">
              Curated device profiles evaluated with RevTech's 5-factor Repairability Index.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#174C3C] hover:text-[#10382D] flex items-center gap-1 group"
          >
            <span>View All {allProducts.length} Devices</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => onNavigate('products', { selectedId: p.id })}
              onCheckParts={(p) => onNavigate('spare-parts', { productId: p.id })}
              onAskAI={(p) => onNavigate('ai-agent', { mode: 'worth_buying', productId: p.id })}
            />
          ))}
        </div>
      </section>

      {/* 3-Step "How RevTech Works" Section (Section 6.4) */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#EEF5EF] border border-[#DCE4DC]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#23734D] uppercase tracking-wider">
              Simplicity & Clarity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#10382D] mt-1">
              How RevTech Works
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B63] mt-2">
              Three transparent steps to stop premature e-waste and preserve household budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] shadow-xs relative">
              <span className="text-3xl font-black text-[#DCE9DF] absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-[#EFF3EE] flex items-center justify-center text-[#174C3C] font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-[#10382D] mb-2">
                Select Device or Problem
              </h4>
              <p className="text-xs text-[#5D6B63] leading-relaxed">
                Choose your exact smartphone variant or describe symptoms (e.g. cracked display, dying battery, faulty charging port).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] shadow-xs relative">
              <span className="text-3xl font-black text-[#DCE9DF] absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-[#EFF3EE] flex items-center justify-center text-[#174C3C] font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-[#10382D] mb-2">
                Explore Parts, Shops & Costs
              </h4>
              <p className="text-xs text-[#5D6B63] leading-relaxed">
                Review compatible part records and price information when verified sources are available.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] shadow-xs relative">
              <span className="text-3xl font-black text-[#DCE9DF] absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-[#EFF3EE] flex items-center justify-center text-[#174C3C] font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-[#10382D] mb-2">
                Get a Transparent Verdict
              </h4>
              <p className="text-xs text-[#5D6B63] leading-relaxed">
                RevTech AI compares upfront repair cash vs replacement depreciation to tell you honestly if repair or replace makes sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Provenance Section (Section 6.5) */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#DCE4DC] p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#10382D] mb-4">
            <ShieldCheck className="w-6 h-6 text-[#23734D]" />
            <h3 className="text-xl font-bold">Data Provenance & Decision Integrity</h3>
          </div>

          <p className="text-sm text-[#5D6B63] leading-relaxed mb-6">
            Unlike generic chatbots or unverified shopping affiliates, RevTech enforces clear separation between 5 distinct classes of information:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
              <span className="font-bold text-[#10382D] block mb-1">1. Verified Specs</span>
              <p className="text-[#5D6B63]">Direct OEM technical dimensions, battery mAh, screw types, and adhesive layouts.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
              <span className="font-bold text-[#10382D] block mb-1">2. External Listings</span>
              <p className="text-[#5D6B63]">Service directories and parts suppliers when connected data sources are available.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
              <span className="font-bold text-[#10382D] block mb-1">3. Deterministic Math</span>
              <p className="text-[#5D6B63]">Strict formulas for monthly amortization, breakeven horizons, and sunk-cost exclusions.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
              <span className="font-bold text-[#10382D] block mb-1">4. Gemini AI Advice</span>
              <p className="text-[#5D6B63]">Contextual trade-off explanations grounded exclusively in catalog and benchmark data.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC]">
              <span className="font-bold text-[#10382D] block mb-1">5. Data Transparency</span>
              <p className="text-[#5D6B63]">Source labels, verification status and uncertainty will be displayed with backend-supplied records.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
