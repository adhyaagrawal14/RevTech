import React from 'react';
import { RevTechLogo } from './RevTechLogo';
import { ShieldCheck, Cpu, RefreshCw, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#EFF3EE] border-t border-[#DCE4DC] mt-20 text-[#5D6B63]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <RevTechLogo size="lg" variant="full" />
            <p className="text-sm leading-relaxed max-w-md text-[#5D6B63]">
              "Buy smarter. Find the right parts. Repair with confidence."
            </p>
            <p className="text-xs text-[#78857D] leading-relaxed max-w-md">
              RevTech is an integrated decision-support platform connecting consumers with spare parts discovery, local repair services, and Gemini-powered purchase & repair-vs-replace guidance.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#174C3C]">
              <span className="w-2 h-2 rounded-full bg-[#23734D]"></span>
              <span>Electronics lifecycle intelligence</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold text-[#10382D] uppercase tracking-wider mb-3">
              Decision Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('spare-parts')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Spare Parts Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-nearby')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Find Nearby Providers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-agent')}
                  className="hover:text-[#174C3C] transition-colors text-left font-semibold text-[#174C3C]"
                >
                  RevTech AI Decision Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Repair vs Replace Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('repair-assistant')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Safe Diagnostic Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Methodology */}
          <div>
            <h4 className="text-xs font-bold text-[#10382D] uppercase tracking-wider mb-3">
              Transparency & Scoring
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('methodology')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Repairability Methodology (30/25/20/15/10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  Product Catalog & Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  3-Way Device Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-devices')}
                  className="hover:text-[#174C3C] transition-colors text-left"
                >
                  My Device Garage
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="p-4 rounded-xl bg-white border border-[#DCE4DC] text-xs text-[#78857D] space-y-2 mb-8">
          <div className="flex items-center gap-2 text-[#10382D] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#23734D]" />
            <span>RevTech Data & Advisory Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            RevTech distinguishes between manufacturer specifications, external directory listings, calculated estimates and user-submitted information. Data sources, verification status and uncertainty should be reviewed before making purchase or repair decisions. RevTech does not represent or warranty third-party workmanship.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#DCE4DC] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p>© {new Date().getFullYear()} RevTech. All rights reserved. Circular Technology & Repairability Initiative.</p>
          <div className="flex items-center gap-4">
            <span>•</span>
            <button onClick={() => onNavigate('methodology')} className="hover:text-[#174C3C]">
              Scoring Weights
            </button>
            <span>•</span>
            <span className="text-[#174C3C] font-semibold">Location-aware services</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
