import React from 'react';
import { GeminiChatbot } from '../components/GeminiChatbot';
import { Bot, MapPin, Box, Wrench, Calculator, Sparkles } from 'lucide-react';

interface AIChatPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialPrompt?: string;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ onNavigate, initialPrompt }) => {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-8 border border-[#DCE4DC]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE9DF] text-[#10382D] text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-[#23734D]" />
            <span>Multi-Turn Gemini Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10382D]">
            RevTech Gemini Chatbot & Local Navigator
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B63] max-w-2xl">
            Conversational decision assistant with persistent multi-turn history. Switch seamlessly between Gemini 3.8 Flash (with live Google Maps Grounding), Gemini 3.1 Flash Lite (ultra-fast), and Gemini 4 Argon (deep engineering reasoning).
          </p>
        </div>
      </div>

      {/* Main Chatbot Interface */}
      <div>
        <GeminiChatbot onNavigate={onNavigate} initialPrompt={initialPrompt} />
      </div>

      {/* Quick Access Decision Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <button
          onClick={() => onNavigate('3d-lab')}
          className="p-4 rounded-2xl bg-white border border-[#DCE4DC] hover:border-[#23734D] hover:shadow-xs transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] flex items-center justify-center text-[#174C3C]">
              <Box className="w-5 h-5 text-[#23734D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#10382D]">3D Teardown Lab</h4>
              <p className="text-[11px] text-[#5D6B63]">Inspect exploded phone layers</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('spare-parts')}
          className="p-4 rounded-2xl bg-white border border-[#DCE4DC] hover:border-[#23734D] hover:shadow-xs transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] flex items-center justify-center text-[#174C3C]">
              <Wrench className="w-5 h-5 text-[#23734D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#10382D]">Spare Parts Catalog</h4>
              <p className="text-[11px] text-[#5D6B63]">Compare OEM & 3rd-party parts</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('find-nearby')}
          className="p-4 rounded-2xl bg-white border border-[#DCE4DC] hover:border-[#23734D] hover:shadow-xs transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] flex items-center justify-center text-[#174C3C]">
              <MapPin className="w-5 h-5 text-[#23734D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#10382D]">Nearby Repair Hubs</h4>
              <p className="text-[11px] text-[#5D6B63]">Live Google Maps Grounding</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
