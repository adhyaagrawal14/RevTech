import React, { useState, useEffect } from 'react';
import { SparePartService } from '../services/sparePartService';
import { ProductService } from '../services/productService';
import { SparePart, Product, PartType, AvailabilityStatus } from '../types';
import { SparePartCard } from '../components/SparePartCard';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
  MapPin,
  Calculator,
} from 'lucide-react';

interface SparePartsPageProps {
  initialProductId?: string;
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SparePartsPage: React.FC<SparePartsPageProps> = ({
  initialProductId,
  initialCategory,
  initialSearch,
  onNavigate,
}) => {
  const products = ProductService.getAll();
  const categories = SparePartService.getCategories();

  // Guided Flow Steps:
  // Step 1: Selected Brand
  // Step 2: Selected Product / Model
  // Step 3: Selected Component Category
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [selectedPartType, setSelectedPartType] = useState<PartType | 'All'>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'availability'>('price-asc');
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  // Sync if props change
  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
      const prod = ProductService.getById(initialProductId);
      if (prod) setSelectedBrand(prod.brand);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Available brands derived from products
  const brands = ['All', ...Array.from(new Set(products.map((p) => p.brand)))];

  // Available models for selected brand
  const availableProducts =
    selectedBrand === 'All'
      ? products
      : products.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());

  // Filtered Parts
  let filteredParts = SparePartService.filter({
    productId: selectedProductId !== 'All' ? selectedProductId : undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    partType: selectedPartType,
    availability: selectedAvailability,
    maxPrice: maxPrice,
    sortBy: sortBy,
  });

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredParts = filteredParts.filter(
      (p) =>
        p.componentName.toLowerCase().includes(q) ||
        p.productModel.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.partType.toLowerCase().includes(q) ||
        p.compatibleModels.some((m) => m.toLowerCase().includes(q))
    );
  }

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedProductId('All');
    setSelectedCategory('All');
    setSelectedPartType('All');
    setSelectedAvailability('All');
    setSearchQuery('');
    setMaxPrice(20000);
    setSortBy('price-asc');
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    // If current selected product is not from this brand, reset product
    if (brand !== 'All') {
      const match = products.find((p) => p.brand === brand);
      if (match) setSelectedProductId(match.id);
    } else {
      setSelectedProductId('All');
    }
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
              <Wrench className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Priority 1 Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
              Spare Parts Availability & Discovery
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
              Identify compatible replacement components, examine verified part types (OEM, compatible, refurbished), compare price estimates in ₹, and find service options when location data is available.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#174C3C] bg-white px-3 py-1.5 rounded-xl border border-[#DCE4DC] shadow-2xs">
              {filteredParts.length} Records Indexed
            </span>
          </div>
        </div>
      </div>

      {/* Guided 4-Step Product & Component Selector (Section 7.2) */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10382D] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#23734D]" />
            <span>Guided 3-Step Component Finder</span>
          </span>
          {(selectedBrand !== 'All' || selectedProductId !== 'All' || selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#5D6B63] hover:text-[#B42318] flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Selection</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Step 1: Select Brand */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5D6B63]">
              Step 1: Choose Brand
            </label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => handleBrandChange(b)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                    selectedBrand === b
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-xs'
                      : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Exact Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5D6B63]">
              Step 2: Choose Exact Model
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-[#DCE4DC] bg-[#F8FAF7] text-[#1B2722] focus:outline-hidden focus:border-[#23734D]"
            >
              <option value="All">All Supported Models ({availableProducts.length})</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.modelName} ({p.variant})
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Select Component Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5D6B63]">
              Step 3: Component Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#174C3C] text-white border-[#174C3C]'
                    : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                }`}
              >
                All Parts
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                    selectedCategory.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#174C3C] text-white border-[#174C3C]'
                      : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Fine-grain Filters Bar (Section 7.5) */}
      <div className="bg-[#F8FAF7] rounded-2xl border border-[#DCE4DC] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78857D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search component name, part number, model..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#DCE4DC] text-xs text-[#1B2722] placeholder-[#78857D] focus:outline-hidden focus:border-[#23734D]"
          />
        </div>

        {/* Part Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPartType}
            onChange={(e) => setSelectedPartType(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border border-[#DCE4DC] bg-white text-[#1B2722] focus:outline-hidden"
          >
            <option value="All">All Part Types</option>
            <option value="OEM Original">OEM Original</option>
            <option value="Compatible Third-Party">Compatible Third-Party</option>
            <option value="Refurbished Grade-A">Refurbished Grade-A</option>
            <option value="Used Inspected">Used Inspected</option>
          </select>

          {/* Availability Status Filter */}
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border border-[#DCE4DC] bg-white text-[#1B2722] focus:outline-hidden"
          >
            <option value="All">All Availability States</option>
            <option value="Available">Available</option>
            <option value="Limited availability">Limited availability</option>
            <option value="Availability not verified">Unverified Availability</option>
            <option value="Unavailable">Unavailable / Sold Out</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border border-[#DCE4DC] bg-white text-[#1B2722] focus:outline-hidden"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="availability">Availability Priority</option>
          </select>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {filteredParts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF5EF] flex items-center justify-center text-[#174C3C] mx-auto">
              <Search className="w-6 h-6 text-[#23734D]" />
            </div>
            <h3 className="text-base font-bold text-[#10382D]">
              No Matching Spare Part Records Found
            </h3>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              We do not fabricate inventory. If a part for this model is not in our verified catalogue, it is labeled missing or unverified.
            </p>
            <button
              onClick={handleResetFilters}
              className="py-2 px-4 rounded-xl bg-[#174C3C] text-white text-xs font-semibold"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <SparePartCard
                key={part.id}
                part={part}
                onFindNearby={(p) =>
                  onNavigate('find-nearby', {
                    category: p.category,
                    model: p.productModel,
                    partId: p.id,
                  })
                }
                onEstimateRepair={(p) =>
                  onNavigate('calculator', {
                    productId: p.productId,
                    component: p.componentName,
                    minPartCost: p.minPriceInr,
                    maxPartCost: p.maxPriceInr,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Part Price Transparency Disclaimer (Section 7.7) */}
      <div className="p-4 rounded-2xl bg-[#EFF3EE] border border-[#DCE4DC] text-xs text-[#5D6B63] space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#10382D]">
          <Info className="w-4 h-4 text-[#23734D]" />
          <span>RevTech Spare Part Pricing & Stock Transparency Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Prices and availability are displayed only when supplied by a connected, attributable data source. Confirm compatibility, stock and labour charges with the provider before purchase.
        </p>
      </div>
    </div>
  );
};
