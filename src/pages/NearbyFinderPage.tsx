import React, { useState, useEffect } from 'react';
import { ProviderService } from '../services/providerService';
import { GeminiService } from '../services/geminiService';
import { Provider, ProviderType } from '../types';
import { ProviderCard } from '../components/ProviderCard';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  Clock,
  Phone,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Bot,
  RefreshCw,
} from 'lucide-react';

interface NearbyFinderPageProps {
  initialCategory?: string;
  initialModel?: string;
  initialPartId?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const NearbyFinderPage: React.FC<NearbyFinderPageProps> = ({
  initialCategory,
  initialModel,
  initialPartId,
  onNavigate,
}) => {
  const [providerTypeFilter, setProviderTypeFilter] = useState<ProviderType | 'All'>('All');
  const [selectedLocality, setSelectedLocality] = useState<string>('All');
  const [componentFilter, setComponentFilter] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(initialModel || '');
  const [onlyAuthorised, setOnlyAuthorised] = useState<boolean>(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>(undefined);
  const [userGeoLocationNotice, setUserGeoLocationNotice] = useState<string | null>(null);

  // Google Maps Grounding State
  const [mapsGroundingQuery, setMapsGroundingQuery] = useState<string>('Find nearby electronics repair centres and spare-parts providers');
  const [mapsGroundingResults, setMapsGroundingResults] = useState<{
    text: string;
    places: { title: string; uri: string; reviewSnippets?: string[] }[];
  } | null>(null);
  const [isMapsLoading, setIsMapsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) setComponentFilter(initialCategory);
    if (initialModel) setSearchQuery(initialModel);
  }, [initialCategory, initialModel]);

  // Request browser location on demand
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setUserGeoLocationNotice('Browser geolocation is not supported on this device. No location service is available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGeoLocationNotice(
          `Location detected (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}). Location permission was granted.`
        );
      },
      (err) => {
        setUserGeoLocationNotice('Location permission dismissed or unavailable. No location was shared. Enter an area to search.');
      }
    );
  };

  const providers = ProviderService.filter({
    providerType: providerTypeFilter,
    locality: selectedLocality !== 'All' ? selectedLocality : undefined,
    componentCategory: componentFilter !== 'All' ? componentFilter : undefined,
    onlyAuthorised,
  });

  const filteredProviders = providers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.supportedBrands.some((b) => b.toLowerCase().includes(q)) ||
      p.supportedServices.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleReset = () => {
    setProviderTypeFilter('All');
    setSelectedLocality('All');
    setComponentFilter('All');
    setSearchQuery('');
    setOnlyAuthorised(false);
    setSelectedProviderId(undefined);
  };

  const handleRunMapsGrounding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mapsGroundingQuery.trim() || isMapsLoading) return;
    setIsMapsLoading(true);
    const data = await GeminiService.queryMapsGrounding(mapsGroundingQuery);
    setMapsGroundingResults(data);
    setIsMapsLoading(false);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Google Maps Grounding & Local Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
              Nearby Repair Centres & Spare Parts Hubs
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
              Locate authorized manufacturer repair centers and verified independent parts stockists in your selected area. Search results will appear when a location service or backend directory is connected.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={handleRequestLocation}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#F8FAF7] text-[#10382D] border border-[#DCE4DC] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Use Current Location</span>
            </button>
          </div>
        </div>

        {userGeoLocationNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-white border border-[#DCE4DC] text-xs text-[#174C3C] animate-fadeIn">
            {userGeoLocationNotice}
          </div>
        )}
      </div>

      {/* NEW: Live Google Maps Grounding Search Card (MANDATORY REQUIREMENT) */}
      <div className="bg-gradient-to-r from-[#10382D] to-[#174C3C] text-white rounded-3xl p-6 sm:p-7 shadow-md border border-[#10382D] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live Google Maps Grounding Search
              </h3>
              <p className="text-xs text-emerald-100">
                Uses Gemini 3.8 Flash with <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300">googleMaps</code> tool to fetch verified place listings, review snippets, and maps links.
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-[#10382D]">
            gemini-3.8-flash Grounded
          </span>
        </div>

        <form onSubmit={handleRunMapsGrounding} className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={mapsGroundingQuery}
            onChange={(e) => setMapsGroundingQuery(e.target.value)}
            placeholder="e.g. Find authorised service centres near me..."
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 text-white placeholder-emerald-200/60 border border-white/20 text-xs focus:outline-hidden focus:border-emerald-400 focus:bg-white/15"
          />
          <button
            type="submit"
            disabled={isMapsLoading}
            className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#10382D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs flex-shrink-0"
          >
            {isMapsLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            <span>{isMapsLoading ? 'Grounding with Maps...' : 'Query Google Maps'}</span>
          </button>
        </form>

        {/* Live Grounding Results Card */}
        {mapsGroundingResults && (
          <div className="bg-white rounded-2xl p-5 text-[#1B2722] space-y-4 animate-fadeIn shadow-lg">
            <div className="flex items-center justify-between border-b border-[#DCE4DC] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#10382D] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#23734D]" />
                <span>Google Maps Grounded Results</span>
              </span>
              <span className="text-[10px] text-[#78857D]">
                {mapsGroundingResults.places?.length || 0} Places Retrieved
              </span>
            </div>

            <div className="text-xs leading-relaxed text-[#5D6B63] whitespace-pre-wrap">
              {mapsGroundingResults.text}
            </div>

            {mapsGroundingResults.places && mapsGroundingResults.places.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {mapsGroundingResults.places.map((place, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F0F5F1] border border-[#DCE4DC] flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-[#10382D] block mb-1">
                        {place.title}
                      </span>
                      {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                        <p className="text-[11px] text-[#5D6B63] italic line-clamp-2 mb-2">
                          "{place.reviewSnippets[0]}"
                        </p>
                      )}
                    </div>

                    <a
                      href={place.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-3 rounded-lg bg-[#174C3C] text-white text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#10382D] transition-colors mt-2"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Context indicator if coming from a spare part or phone */}
      {(initialCategory || initialModel) && (
        <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#23734D]/30 flex items-center justify-between text-xs text-[#10382D]">
          <div className="flex items-center gap-2">
            <span className="font-bold">Active Context:</span>
            <span>
              Searching providers that repair or supply{' '}
              <strong>{initialCategory || 'components'}</strong> for{' '}
              <strong>{initialModel || 'selected smartphone'}</strong>.
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-[#5D6B63] hover:text-[#B42318] underline font-medium"
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Segmented Provider Type & Locality Selector (Section 8.2 & 8.5) */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Segmented Control for Provider Type */}
          <div className="flex items-center gap-1 p-1 bg-[#EFF3EE] rounded-xl border border-[#DCE4DC] text-xs font-semibold">
            {[
              { id: 'All', label: 'All Providers' },
              { id: 'Repair Centre', label: 'Repair Centres' },
              { id: 'Spare-Parts Shop', label: 'Spare-Parts Shops' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProviderTypeFilter(tab.id as any)}
                className={`py-2 px-3.5 rounded-lg transition-all ${
                  providerTypeFilter === tab.id
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'text-[#5D6B63] hover:text-[#1B2722]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Locality Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-[#5D6B63] mr-1">Area:</span>
            <button
              onClick={() => setSelectedLocality('All')}
              className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                selectedLocality === 'All'
                  ? 'bg-[#10382D] text-white border-[#10382D]'
                  : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC]'
              }`}
            >
              All Localities
            </button>
            {([] as string[]).map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocality(loc)}
                className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                  selectedLocality === loc
                    ? 'bg-[#10382D] text-white border-[#10382D]'
                    : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Authorisation Toggle */}
        <div className="pt-3 border-t border-[#DCE4DC] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78857D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider name, brand supported, or street..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] text-xs text-[#1B2722] focus:outline-hidden focus:border-[#23734D]"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#10382D] select-none">
              <input
                type="checkbox"
                checked={onlyAuthorised}
                onChange={(e) => setOnlyAuthorised(e.target.checked)}
                className="w-4 h-4 rounded text-[#23734D] focus:ring-[#23734D] border-[#DCE4DC]"
              />
              <span>Only Manufacturer-Authorised</span>
            </label>

            {(searchQuery || selectedLocality !== 'All' || providerTypeFilter !== 'All' || onlyAuthorised) && (
              <button
                onClick={handleReset}
                className="text-xs text-[#5D6B63] hover:text-[#B42318] flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Service Map (Section 8.4) */}
      <div>
        <InteractiveMap
          providers={filteredProviders}
          selectedProviderId={selectedProviderId}
          onSelectProvider={(p) => setSelectedProviderId(p.id)}
          activeLocality={selectedLocality === 'All' ? 'Selected area' : selectedLocality}
        />
      </div>

      {/* Provider List Cards (Section 8.3 & 8.6) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#10382D]">
            Provider Results ({filteredProviders.length})
          </h2>
          <span className="text-xs text-[#78857D]">
            Service locations will be shown here when location data is available
          </span>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF5EF] flex items-center justify-center text-[#174C3C] mx-auto">
              <Search className="w-6 h-6 text-[#23734D]" />
            </div>
            <h3 className="text-base font-bold text-[#10382D]">
              No Matching Providers Found
            </h3>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Try switching localities or relaxing filters. RevTech does not generate fake businesses to make the directory appear fuller.
            </p>
            <button
              onClick={handleReset}
              className="py-2 px-4 rounded-xl bg-[#174C3C] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                selectedComponentCategory={componentFilter !== 'All' ? componentFilter : undefined}
                isSelected={provider.id === selectedProviderId}
                onSelect={(p) => setSelectedProviderId(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mandatory Disclaimers */}
      <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Local Provider & Stock Verification Notice</span>
        </div>
        <p className="leading-relaxed">
          Service listings and stock must be independently verified. RevTech recommends confirming: 1) exact part compatibility, 2) whether the quoted price includes diagnostic labour fees, and 3) whether replacement seals are replaced during service.
        </p>
      </div>
    </div>
  );
};
