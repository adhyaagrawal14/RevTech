import React, { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailPage } from './ProductDetailPage';
import { Search, Filter, Layers, Scale, RotateCcw, ArrowRight } from 'lucide-react';

interface ProductsPageProps {
  initialSearch?: string;
  initialSelectedId?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  comparedProductIds: string[];
  onToggleCompare: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialSearch = '',
  initialSelectedId,
  onNavigate,
  comparedProductIds,
  onToggleCompare,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialSelectedId || null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score-desc' | 'price-asc' | 'price-desc' | 'year-desc'>('score-desc');

  useEffect(() => {
    if (initialSelectedId) setSelectedProductId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  if (selectedProductId) {
    return (
      <ProductDetailPage
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  const allProducts = ProductService.getAll();
  const brands = ['All', ...Array.from(new Set(allProducts.map((p) => p.brand)))];

  let filtered = ProductService.filter({
    brand: selectedBrand,
    minScore: minScore > 0 ? minScore : undefined,
    sortBy,
  });

  if (searchQuery.trim()) {
    filtered = ProductService.search(searchQuery).filter((p) =>
      selectedBrand === 'All' ? true : p.brand === selectedBrand
    );
  }

  const handleReset = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setMinScore(0);
    setSortBy('score-desc');
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Smartphone Catalog & Repairability Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
              Explore Devices
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
              Inspect lifecycle scores, spare-parts coverage, teardown complexity, and community repair ratings before buying.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('compare')}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#F8FAF7] text-[#10382D] border border-[#DCE4DC] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Scale className="w-4 h-4 text-[#23734D]" />
              <span>Compare Devices ({comparedProductIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78857D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model, or variant..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] text-xs text-[#1B2722] focus:outline-hidden focus:border-[#23734D]"
            />
          </div>

          {/* Quick Brand Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-[#5D6B63] mr-1">Brand:</span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedBrand === b
                    ? 'bg-[#174C3C] text-white border-[#174C3C]'
                    : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="pt-3 border-t border-[#DCE4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#5D6B63]">Min Repairability:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="py-1.5 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              >
                <option value={0}>Any Score</option>
                <option value={7.0}>7.0+ (Repair-Friendly)</option>
                <option value={8.0}>8.0+ (Highly Modular)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#5D6B63]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7]"
              >
                <option value="score-desc">Highest Repairability Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Latest Release</option>
              </select>
            </div>
          </div>

          {(searchQuery || selectedBrand !== 'All' || minScore > 0) && (
            <button
              onClick={handleReset}
              className="text-xs text-[#5D6B63] hover:text-[#B42318] flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={(p) => setSelectedProductId(p.id)}
            onCheckParts={(p) => onNavigate('spare-parts', { productId: p.id })}
            onAskAI={(p) => onNavigate('ai-agent', { mode: 'worth_buying', productId: p.id })}
            onToggleCompare={onToggleCompare}
            isCompared={comparedProductIds.includes(product.id)}
          />
        ))}
      </div>

      {/* Floating Compare Notification Bar if items selected */}
      {comparedProductIds.length > 0 && (
        <div className="sticky bottom-4 z-40 bg-[#10382D] text-white p-4 rounded-2xl shadow-xl max-w-xl mx-auto flex items-center justify-between gap-4 border border-emerald-500/40 animate-slideUp">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold">
              {comparedProductIds.length} of 3 devices selected for comparison
            </span>
          </div>

          <button
            onClick={() => onNavigate('compare')}
            className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#10382D] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
