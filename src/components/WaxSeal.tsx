'use client';

import React from 'react';

interface WaxSealProps {
  isSealed: boolean;
  className?: string;
}

export const WaxSeal: React.FC<WaxSealProps> = ({ isSealed, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 transform ${
        isSealed ? 'scale-100 opacity-100 rotate-0' : 'scale-150 opacity-0 -rotate-12 pointer-events-none'
      } ${className}`}
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 120 120"
        className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
      >
        <defs>
          <radialGradient id="waxRed" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#b22222" />
            <stop offset="50%" stopColor="#8b0000" />
            <stop offset="85%" stopColor="#4a0000" />
            <stop offset="100%" stopColor="#250000" />
          </radialGradient>
          <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e5ab" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8a7322" />
          </linearGradient>
        </defs>

        {/* Outer Organic Wax Dripping Ring */}
        <path
          d="M 60 5 C 75 4, 88 12, 98 20 C 108 30, 115 42, 116 58 C 117 74, 108 88, 98 98 C 85 110, 70 115, 55 114 C 38 113, 24 105, 14 92 C 4 80, 2 64, 6 48 C 10 32, 22 20, 36 12 C 44 7, 52 5, 60 5 Z"
          fill="url(#waxRed)"
          stroke="#380000"
          strokeWidth="2"
        />

        {/* Inner Stamped Ridge */}
        <circle cx="60" cy="60" r="42" fill="none" stroke="#500000" strokeWidth="3" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="url(#sealGold)" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Central Akelarre Sigil / Pentagon */}
        <polygon
          points="60,28 73,38 68,54 52,54 47,38"
          fill="none"
          stroke="url(#sealGold)"
          strokeWidth="2"
        />
        <circle cx="60" cy="60" r="10" fill="url(#sealGold)" />

        {/* Embedded Text around Seal */}
        <text
          x="60"
          y="92"
          fontSize="8"
          fontFamily="serif"
          fill="url(#sealGold)"
          textAnchor="middle"
          letterSpacing="2"
        >
          AKELARRE
        </text>
      </svg>
    </div>
  );
};
