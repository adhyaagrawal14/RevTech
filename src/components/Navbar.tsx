import React, { useState } from 'react';
import { RevTechLogo } from './RevTechLogo';
import {
  Wrench,
  Search,
  MapPin,
  Bot,
  Layers,
  Scale,
  Sparkles,
  Smartphone,
  Info,
  Menu,
  X,
  Compass,
  Box,
  MessageSquare,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'spare-parts', label: 'Spare Parts', icon: Wrench, highlight: true },
    { id: '3d-lab', label: '3D Teardown Lab', icon: Box, highlight: true },
    { id: 'find-nearby', label: 'Find Nearby', icon: MapPin, highlight: true },
    { id: 'ai-chat', label: 'Gemini Chat', icon: MessageSquare, highlight: true },
    { id: 'ai-agent', label: 'AI Decisions', icon: Bot },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'calculator', label: 'Calculator', icon: Sparkles },
    { id: 'my-devices', label: 'Garage', icon: Smartphone },
    { id: 'methodology', label: 'Methodology', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAF7]/95 backdrop-blur-md border-b border-[#DCE4DC]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer transition-transform hover:opacity-95"
        >
          <RevTechLogo size="md" variant="full" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#174C3C] text-white shadow-sm'
                    : item.highlight
                    ? 'text-[#174C3C] hover:bg-[#EEF5EF] font-semibold'
                    : 'text-[#5D6B63] hover:text-[#1B2722] hover:bg-[#EFF3EE]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#23734D]' : 'text-[#78857D]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header actions */}
        <div className="flex items-center gap-2.5">
          {/* Ask AI Quick CTA */}
          <button
            onClick={() => handleNavClick('ai-agent')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23734D] hover:bg-[#1b5e3e] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-200" />
            <span>Ask RevTech AI</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#1B2722] hover:bg-[#EFF3EE]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#DCE4DC] px-4 pt-2 pb-5 shadow-lg max-h-[85vh] overflow-y-auto animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition-all ${
                    isActive
                      ? 'bg-[#174C3C] text-white'
                      : item.highlight
                      ? 'bg-[#EEF5EF] text-[#174C3C] font-semibold'
                      : 'text-[#1B2722] hover:bg-[#EFF3EE]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#23734D]' : 'text-[#78857D]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>


        </div>
      )}
    </header>
  );
};
