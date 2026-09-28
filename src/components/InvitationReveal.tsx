'use client';

import React, { useEffect, useState } from 'react';
import { eventConfig } from '@/config/eventConfig';
import { soundEngine } from '@/lib/soundEngine';
import { CountdownTimer } from './CountdownTimer';
import { AvatarVideoPlayer } from './AvatarVideoPlayer';
import { ArrowRight, Copy, Check } from 'lucide-react';

interface InvitationRevealProps {
  onNext: () => void;
}

export const InvitationReveal: React.FC<InvitationRevealProps> = ({ onNext }) => {
  const [step, setStep] = useState(0);
  const [copiedBizum, setCopiedBizum] = useState(false);

  const handleCopyBizum = () => {
    navigator.clipboard.writeText(eventConfig.bizumPhone);
    setCopiedBizum(true);
    soundEngine.playMechanicalClack();
    setTimeout(() => setCopiedBizum(false), 2500);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 150);
    const t2 = setTimeout(() => setStep(2), 500);
    const t3 = setTimeout(() => setStep(3), 1000);
    const t4 = setTimeout(() => setStep(4), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-4 py-6 md:py-8 select-none z-10 overflow-x-hidden">
      {/* Dynamic Background Crimson Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div
        className={`flex flex-col items-center text-center z-10 max-w-md w-full space-y-1 mt-2 transition-all duration-700 ${
          step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 text-[10px] font-sans tracking-widest uppercase">
          <span>🕯️</span>
          <span>MANSIÓN DEL AKELARRE</span>
        </div>
        <h2 className="text-xl md:text-2xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-500 font-bold uppercase">
          Invitación al Gran Cónclave
        </h2>
      </div>

      {/* 2. Central Oscar Avatar Video Player */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center w-full max-w-md transition-all duration-1000 ${
          step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <AvatarVideoPlayer />
      </div>

      {/* 3. Event Details Quick Chips & Countdown */}
      <div
        className={`flex flex-col items-center justify-center gap-2.5 z-10 max-w-md w-full transition-all duration-700 ${
          step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <CountdownTimer />

        <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md text-amber-100 text-xs font-sans">
            <span>📅</span>
            <span>{eventConfig.dates}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 border border-amber-500/40 backdrop-blur-md text-amber-200 text-xs font-sans">
            <span>🪙</span>
            <span>
              <strong>{eventConfig.price}</strong> por pareja
            </span>
          </div>
        </div>

        {/* Dress Code Dual Card */}
        <div className="w-full p-2.5 rounded-2xl bg-black/80 border border-rose-900/50 backdrop-blur-md space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 px-1 text-gold text-xs font-gothic tracking-wider border-b border-gold/15 pb-1">
            <span>👗</span>
            <span className="font-bold uppercase">Código de Vestimenta:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-sans">
            <div className="p-2 rounded-xl bg-red-950/30 border border-rose-500/20 flex items-start gap-2">
              <span className="text-sm shrink-0">🌙</span>
              <div>
                <p className="font-gothic font-bold text-amber-300 text-[11px] uppercase tracking-wide">Viernes Noche</p>
                <p className="text-rose-100 text-[11px]">Fiesta sin temática &bull; <strong className="text-amber-200">Dress code Sexy</strong></p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-red-950/30 border border-rose-500/20 flex items-start gap-2">
              <span className="text-sm shrink-0">🧙‍♀️</span>
              <div>
                <p className="font-gothic font-bold text-amber-300 text-[11px] uppercase tracking-wide">Sábado Noche</p>
                <p className="text-rose-100 text-[11px]">Gran Akelarre &bull; <strong className="text-amber-200">Brujas y Brujos Erótico</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Price & Bizum Card */}
        <div className="w-full p-3 rounded-2xl bg-black/75 border border-gold/30 text-center backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between border-b border-gold/15 pb-1 px-1">
            <span className="text-xs font-gothic tracking-wider text-gold font-bold uppercase">
              {eventConfig.price} por pareja
            </span>
            <span className="text-[10px] font-sans text-amber-200/70">
              Casa Rural Completa
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-left">
            <div className="space-y-0.5">
              <p className="text-[11px] font-sans text-rose-100">
                📲 Bizum a <strong className="text-amber-200 font-bold">Oscar</strong>: <span className="font-mono text-gold font-bold">{eventConfig.bizumPhoneFormatted}</span>
              </p>
              <p className="text-[10px] font-sans text-rose-300/80">
                ⏰ Plazo límite: <strong className="text-amber-200">Antes del {eventConfig.bizumDeadline}</strong>
              </p>
            </div>

            <button
              onClick={handleCopyBizum}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-sans tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                copiedBizum
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                  : 'bg-gold/15 border-gold/40 text-gold hover:bg-gold/25'
              }`}
            >
              {copiedBizum ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡COPIADO!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gold" />
                  <span>COPIAR TELÉFONO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Action Button: CONTINUAR AL PACTO */}
      <div
        className={`z-20 mt-4 mb-2 w-full max-w-sm transition-all duration-700 ${
          step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            soundEngine.duckAmbient(false);
            onNext();
          }}
          style={{ backgroundColor: '#f59e0b', color: '#000000' }}
          className="w-full py-4 px-6 rounded-full border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.95)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CONTINUAR AL PACTO SAGRADO</span>
          <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
