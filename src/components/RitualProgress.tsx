'use client';

import React from 'react';
import { ExperienceStep } from '@/types';

interface RitualProgressProps {
  currentStep: ExperienceStep;
}

const STEPS: { key: ExperienceStep; label: string; icon: string }[] = [
  { key: 'INTRO', label: 'Despertar', icon: '🗝️' },
  { key: 'LOCK', label: 'Cerradura', icon: '🔒' },
  { key: 'PORTAL', label: 'Umbral', icon: '🚪' },
  { key: 'REVEAL', label: 'Invitación', icon: '🕯️' },
  { key: 'PACT', label: 'El Pacto', icon: '📜' },
  { key: 'TEAM', label: 'Tu Clan', icon: '🔮' },
  { key: 'REWARD', label: 'Pase VIP', icon: '🎟️' },
];

export const RitualProgress: React.FC<RitualProgressProps> = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  if (currentIndex === -1) return null;

  return (
    <div className="fixed top-2 inset-x-0 z-40 flex justify-center px-4 pointer-events-none select-none">
      <div className="flex items-center gap-1.5 md:gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-gold/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-1">
              <div
                className={`flex items-center justify-center transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-6 h-6 bg-amber-500/30 border border-gold text-[12px] shadow-[0_0_10px_rgba(212,175,55,0.7)] scale-110'
                    : isDone
                    ? 'w-5 h-5 bg-emerald-950/60 border border-emerald-500/50 text-[10px] text-emerald-300'
                    : 'w-4 h-4 bg-white/5 border border-white/10 text-[9px] opacity-35'
                }`}
              >
                <span>{step.icon}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-2 md:w-3 rounded-full transition-all duration-300 ${
                    idx < currentIndex ? 'bg-emerald-500/60' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
