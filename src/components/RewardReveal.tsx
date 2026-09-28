'use client';

import React, { useEffect, useState } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { WhatsAppGate } from './WhatsAppGate';

interface RewardRevealProps {
  token?: string;
  soulCount?: number;
  guestName?: string;
  witchNickname?: string;
  teamName?: string;
}

export const RewardReveal: React.FC<RewardRevealProps> = ({
  token = 'DEMO',
  soulCount = 24,
  guestName = '',
  witchNickname = '',
  teamName = '',
}) => {
  const [phase, setPhase] = useState(0);
  const [circleOpened, setCircleOpened] = useState(false);

  useEffect(() => {
    // Relaxed progressive text sequence for comfortable reading
    const t1 = setTimeout(() => setPhase(1), 500);   // HAS ABIERTO LA LLAVE
    const t2 = setTimeout(() => setPhase(2), 2200);  // El Akelarre te acepta + Nombre + Apodo
    const t3 = setTimeout(() => setPhase(3), 4500);  // Brujas y brujos ya se están reuniendo
    const t4 = setTimeout(() => setPhase(4), 6800);  // TU RECOMPENSA ESTÁ AL OTRO LADO

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleOpenCircle = () => {
    if (circleOpened) return;
    soundEngine.playSecretChime();
    setCircleOpened(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-6 py-12 select-none z-10 overflow-hidden">
      {/* Background Red/Gold Dynamic Flame Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-red-950 via-amber-950 to-crimson blur-[140px] opacity-70 pointer-events-none" />

      {/* Soul Counter Badge (Optional) */}
      {eventConfig.guestCounterEnabled && (
        <div className="z-20 mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-black/70 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-amber-200">
            {soulCount} ALMAS YA HAN CRUZADO EL UMBRAL
          </span>
        </div>
      )}

      {/* Atmospheric Text Sequence */}
      <div className="flex flex-col items-center text-center my-auto z-10 space-y-6 max-w-md w-full">
        {phase >= 1 && (
          <h2 className="text-2xl md:text-4xl font-gothic tracking-widest text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase transition-all duration-1000 animate-fade-in">
            {eventConfig.texts.rewardTitle}
          </h2>
        )}

        {phase >= 2 && (
          <div className="space-y-2 transition-all duration-1000 animate-fade-in">
            <p className="text-base md:text-xl font-sans tracking-widest text-rose-100/90 italic">
              {eventConfig.texts.rewardAccepted}
            </p>
            {guestName && (
              <div className="pt-2 border-y border-gold/30 py-3 my-2 bg-black/40 rounded-xl px-4 backdrop-blur-md space-y-1.5">
                <p className="text-xl md:text-2xl font-gothic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold to-amber-400 uppercase">
                  {guestName}
                </p>
                {witchNickname && (
                  <p className="text-base font-gothic tracking-widest text-gold italic">
                    «{witchNickname}»
                  </p>
                )}
                {teamName && (
                  <div className="pt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/40 text-amber-200 text-xs font-gothic tracking-wider uppercase">
                    <span>CLAN:</span>
                    <span className="text-gold font-bold">{teamName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {phase >= 3 && (
          <p className="text-sm md:text-lg font-sans tracking-widest text-amber-200/80 transition-all duration-1000 animate-fade-in">
            {eventConfig.texts.rewardGathering}
          </p>
        )}

        {phase >= 4 && (
          <div className="pt-4 transition-all duration-1000 animate-fade-in">
            <h3 className="text-lg md:text-2xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold to-yellow-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] uppercase">
              {eventConfig.texts.rewardOtherSide}
            </h3>
          </div>
        )}

        {/* Closed Magic Circle Node to Tap */}
        {phase >= 4 && !circleOpened && (
          <button
            onClick={handleOpenCircle}
            className="group relative mt-6 w-36 h-36 rounded-full border-2 border-gold/50 bg-black/80 flex items-center justify-center cursor-pointer hover:border-gold hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md"
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-red-500/40 animate-spin-slow" />
            <div className="flex flex-col items-center text-center space-y-1 p-2">
              <span className="text-2xl text-gold group-hover:scale-125 transition-transform">✦</span>
              <span className="text-[10px] font-sans tracking-widest uppercase text-amber-100/80">
                TOCA PARA ABRIR
              </span>
            </div>
          </button>
        )}

        {/* WhatsApp Gate Reveal */}
        {circleOpened && (
          <WhatsAppGate
            token={token}
            guestName={guestName}
            witchNickname={witchNickname}
            teamName={teamName}
          />
        )}
      </div>
    </div>
  );
};
