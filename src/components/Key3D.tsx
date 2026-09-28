'use client';

import React from 'react';

interface Key3DProps {
  progress?: number; // 0 to 1
  isAwakened?: boolean;
  className?: string;
  size?: number;
}

export const Key3D: React.FC<Key3DProps> = ({
  progress = 0,
  isAwakened = false,
  className = '',
  size = 240,
}) => {
  // Calculate dynamic glow and color intensities
  const rubyGlow = isAwakened ? 1 : Math.max(0.2, progress);
  const runeOpacity = isAwakened ? 0.9 : progress * 0.8;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Dynamic Ambient Background Glow behind Key */}
      <div
        className="absolute rounded-full transition-all duration-300 pointer-events-none"
        style={{
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          background: `radial-gradient(circle, rgba(212,175,55,${0.15 + progress * 0.45}) 0%, rgba(139,0,0,${0.1 + progress * 0.35}) 50%, rgba(0,0,0,0) 75%)`,
          filter: `blur(${15 + progress * 15}px)`,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)] transition-transform duration-300"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a7322" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="60%" stopColor="#f8f1cf" />
            <stop offset="85%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#5c4b14" />
          </linearGradient>

          <linearGradient id="goldBow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="35%" stopColor="#fff8db" />
            <stop offset="70%" stopColor="#aa8210" />
            <stop offset="100%" stopColor="#4a3703" />
          </linearGradient>

          {/* Glowing Gem Radial Gradient */}
          <radialGradient id="rubyCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d4d" stopOpacity={rubyGlow} />
            <stop offset="40%" stopColor="#b22222" stopOpacity={rubyGlow} />
            <stop offset="85%" stopColor="#660000" stopOpacity={rubyGlow} />
            <stop offset="100%" stopColor="#2a0000" stopOpacity="0.9" />
          </radialGradient>

          {/* Rune Glow Filter */}
          <filter id="runeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={2 + progress * 4} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- KEY BOW (HANDLE) --- */}
        {/* Outer Ring */}
        <path
          d="M 100 20 C 65 20, 35 48, 35 85 C 35 122, 65 150, 100 150 C 135 150, 165 122, 165 85 C 165 48, 135 20, 100 20 Z"
          fill="url(#goldBow)"
          stroke="#3d2d05"
          strokeWidth="3"
        />

        {/* Inner Ring Opening */}
        <path
          d="M 100 35 C 75 35, 52 57, 52 85 C 52 113, 75 135, 100 135 C 125 135, 148 113, 148 85 C 148 57, 125 35, 100 35 Z"
          fill="#0a070c"
          stroke="url(#goldStem)"
          strokeWidth="2"
        />

        {/* Central Gothic Ruby Eye */}
        <circle
          cx="100"
          cy="85"
          r={22 + progress * 3}
          fill="url(#rubyCore)"
          stroke="#d4af37"
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 ${10 + progress * 20}px rgba(238, 43, 43, ${rubyGlow}))`,
          }}
        />

        {/* Embedded Witch Sigil / Star in Center of Gem */}
        <path
          d="M 100 68 L 104 78 L 115 80 L 107 88 L 109 99 L 100 93 L 91 99 L 93 88 L 85 80 L 96 78 Z"
          fill={isAwakened ? '#fff7d1' : '#f3e5ab'}
          opacity={0.4 + progress * 0.6}
        />

        {/* Mystical Ring Runes */}
        <g opacity={runeOpacity} filter="url(#runeGlow)" fill="#f3e5ab">
          <text x="96" y="32" fontSize="11" fontFamily="serif">ᛇ</text>
          <text x="138" y="55" fontSize="11" fontFamily="serif">ᚦ</text>
          <text x="145" y="100" fontSize="11" fontFamily="serif">ᛉ</text>
          <text x="135" y="132" fontSize="11" fontFamily="serif">ᚱ</text>
          <text x="55" y="55" fontSize="11" fontFamily="serif">ᚠ</text>
          <text x="46" y="100" fontSize="11" fontFamily="serif">ᚹ</text>
          <text x="55" y="132" fontSize="11" fontFamily="serif">ᛗ</text>
        </g>

        {/* --- KEY COLLAR & CONNECTOR --- */}
        <rect
          x="88"
          y="145"
          width="24"
          height="16"
          rx="3"
          fill="url(#goldBow)"
          stroke="#4a3703"
          strokeWidth="1.5"
        />
        <circle cx="100" cy="153" r="4" fill="#aa8210" />

        {/* --- KEY STEM / SHAFT --- */}
        <rect
          x="91"
          y="160"
          width="18"
          height="140"
          rx="2"
          fill="url(#goldStem)"
          stroke="#3d2d05"
          strokeWidth="1.5"
        />

        {/* Stem Ribbing Lines */}
        <line x1="100" y1="165" x2="100" y2="295" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
        <line x1="94" y1="175" x2="106" y2="175" stroke="#5c4b14" strokeWidth="1" />
        <line x1="94" y1="210" x2="106" y2="210" stroke="#5c4b14" strokeWidth="1" />
        <line x1="94" y1="245" x2="106" y2="245" stroke="#5c4b14" strokeWidth="1" />

        {/* --- KEY BIT (NOTCHES) --- */}
        <path
          d="M 109 235 H 142 V 247 H 122 V 257 H 146 V 275 H 132 V 287 H 109 Z"
          fill="url(#goldBow)"
          stroke="#3d2d05"
          strokeWidth="1.5"
        />
        {/* Bit Secret Cutout Hole */}
        <rect x="126" y="240" width="8" height="12" rx="1" fill="#0a070c" />
        <polygon points="115,263 125,263 120,270" fill="#0a070c" />

        {/* --- KEY TIP --- */}
        <path d="M 91 300 L 100 312 L 109 300 Z" fill="url(#goldBow)" stroke="#3d2d05" />
      </svg>
    </div>
  );
};
