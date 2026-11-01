import React from 'react';
import { Provider } from '../types';
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  providers: Provider[];
  selectedProviderId?: string;
  onSelectProvider: (provider: Provider) => void;
  activeLocality: string;
}

/** Neutral map placeholder. Real map tiles and pins require verified backend coordinates. */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  providers,
  selectedProviderId,
  onSelectProvider,
  activeLocality,
}) => (
  <div className="bg-white rounded-2xl border border-[#DCE4DC] overflow-hidden shadow-xs">
    <div className="p-3.5 bg-[#EFF3EE] border-b border-[#DCE4DC] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#23734D]" />
        <span className="text-xs font-bold text-[#10382D]">Repair & Service Locations</span>
        <span className="text-[10px] bg-[#DCE9DF] text-[#174C3C] px-2 py-0.5 rounded-full font-semibold">{providers.length} locations</span>
      </div>
      <span className="text-[11px] text-[#5D6B63]">{activeLocality}</span>
    </div>
    <div className="min-h-[260px] bg-[#F1F6F2] flex flex-col items-center justify-center gap-3 p-8 text-center">
      <MapPin className="w-10 h-10 text-[#8AA596]" />
      {providers.length === 0 ? (
        <>
          <h3 className="text-sm font-bold text-[#10382D]">No service locations available</h3>
          <p className="max-w-md text-xs text-[#5D6B63]">Verified repair-centre records and coordinates will appear here after the location directory is connected.</p>
        </>
      ) : (
        <div className="w-full max-w-md space-y-2">
          <p className="text-xs text-[#5D6B63]">Map rendering will be enabled when a map provider and verified coordinates are configured.</p>
          {providers.map((provider) => (
            <button key={provider.id} onClick={() => onSelectProvider(provider)} className={`w-full rounded-xl border p-3 text-left text-xs ${selectedProviderId === provider.id ? 'border-[#23734D] bg-white' : 'border-[#DCE4DC] bg-white/70'}`}>
              <span className="font-semibold text-[#10382D]">{provider.name}</span>
              <span className="block text-[#5D6B63]">{provider.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);
