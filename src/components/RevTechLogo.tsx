import React from 'react';

interface RevTechLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
  lightBackground?: boolean;
}

export const RevTechLogo: React.FC<RevTechLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  lightBackground = true,
}) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 60,
  };

  const currentSize = iconSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Creative SVG Logo Mark */}
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: currentSize, height: currentSize }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:rotate-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="revtech-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10382D" />
              <stop offset="50%" stopColor="#174C3C" />
              <stop offset="100%" stopColor="#23734D" />
            </linearGradient>
            <linearGradient id="revtech-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#23734D" />
              <stop offset="100%" stopColor="#48C78E" />
            </linearGradient>
            <linearGradient id="revtech-leaf-circuit" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#3DD598" />
              <stop offset="100%" stopColor="#174C3C" />
            </linearGradient>
            <filter id="revtech-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#23734D" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Circular Renewal Arc 1 (representing circular life extension) */}
          <path
            d="M 50 8 A 42 42 0 0 1 92 50 C 92 65 83 78 71 85"
            stroke="url(#revtech-grad-primary)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Outer Circular Renewal Arc 2 with arrow tip (reverse loop) */}
          <path
            d="M 50 92 A 42 42 0 0 1 8 50 C 8 35 17 22 29 15"
            stroke="url(#revtech-grad-accent)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Circuit / Renewal Arrow Heads on Arcs */}
          <path
            d="M 76 80 L 71 86 L 79 90"
            stroke="url(#revtech-grad-primary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 24 20 L 29 14 L 21 10"
            stroke="url(#revtech-grad-accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stylized 'R' Core combining tech microchip traces and eco leaf stem */}
          {/* Stem of R */}
          <path
            d="M 38 28 L 38 72"
            stroke="#10382D"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Microchip nodes on stem */}
          <circle cx="38" cy="28" r="3" fill="#48C78E" />
          <circle cx="38" cy="72" r="3" fill="#10382D" />

          {/* Upper Loop of 'R' that shapes like a renewable leaf node */}
          <path
            d="M 38 31 C 52 30 63 35 63 45 C 63 55 52 58 38 58"
            stroke="url(#revtech-grad-accent)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Diagonal leg of 'R' transitioning into a circuit prong */}
          <path
            d="M 48 57 L 64 72"
            stroke="url(#revtech-grad-primary)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Center glowing energy node representing tech repair spark */}
          <circle cx="51" cy="45" r="3.5" fill="#3DD598" filter="url(#revtech-glow)" />

          {/* Circuit connection dot */}
          <circle cx="64" cy="72" r="3" fill="#23734D" />
        </svg>

        {/* Ambient pulse effect */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Typography: RevTech */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight leading-none ${
                size === 'sm'
                  ? 'text-lg'
                  : size === 'md'
                  ? 'text-2xl'
                  : size === 'lg'
                  ? 'text-3xl'
                  : 'text-4xl'
              } text-[#10382D]`}
            >
              Rev<span className="text-[#23734D] font-extrabold">Tech</span>
            </span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EEF5EF] text-[#174C3C] border border-[#DCE4DC]">
              Beta
            </span>
          </div>
          {variant === 'full' && (
            <span className="text-[10px] font-medium tracking-wider text-[#5D6B63] uppercase -mt-0.5">
              Repair & Parts Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
