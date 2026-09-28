'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Key3D } from './Key3D';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';

interface KeyIntroProps {
  onComplete: () => void;
  guestName?: string;
}

export const KeyIntro: React.FC<KeyIntroProps> = ({ onComplete, guestName }) => {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isAwakened, setIsAwakened] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const duration = 2400; // 2.4 seconds to awaken key

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIsAwakened(true);
    soundEngine.playClack();
    triggerHaptic([50, 40, 90]);

    setTimeout(() => {
      onComplete();
    }, 850);
  }, [onComplete, triggerHaptic]);

  const updateProgress = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const p = Math.min(1, elapsed / duration);

    setProgress(p);
    soundEngine.playCharge(p);

    if (Math.random() < 0.28) {
      triggerHaptic(14);
    }

    if (p < 1) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else {
      handleComplete();
    }
  }, [handleComplete, triggerHaptic]);

  const startPress = () => {
    if (isAwakened) return;
    setIsPressing(true);
    soundEngine.startAmbient();
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(updateProgress);
  };

  const endPress = () => {
    if (isAwakened) return;
    setIsPressing(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-6 py-10 select-none z-10 overflow-hidden">
      {/* Background candle blur halos */}
      <div className="absolute top-1/4 left-10 w-52 h-52 bg-red-950/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-8 w-60 h-60 bg-amber-900/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Header text */}
      <div className="flex flex-col items-center text-center mt-6 z-10 space-y-2 max-w-sm">
        {guestName ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-xs font-sans tracking-widest uppercase text-amber-200">
              {guestName}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 text-[10px] font-sans tracking-widest uppercase">
            <span>🗝️</span>
            <span>LLAVE SAGRADA</span>
          </div>
        )}

        <h1 className="text-2xl md:text-4xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-600 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase font-bold">
          {eventConfig.texts.introTitle}
        </h1>

        <p className="text-xs md:text-sm font-sans tracking-wider text-rose-100/70 italic">
          {eventConfig.texts.introSubtitle}
        </p>
      </div>

      {/* Center Interactive Key */}
      <div className="relative flex flex-col items-center justify-center my-auto z-20">
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 md:w-80 md:h-80 -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="130"
              className="stroke-amber-950/40 fill-none"
              strokeWidth="3"
            />
            <circle
              cx="50%"
              cy="50%"
              r="130"
              className="stroke-gold fill-none transition-all duration-75"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress)}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 ${8 + progress * 20}px rgba(212, 175, 55, 0.9))`,
              }}
            />
          </svg>

          <div
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onTouchCancel={endPress}
            className="absolute inset-0 flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95 touch-none"
          >
            <Key3D progress={progress} isAwakened={isAwakened} size={220} />
          </div>
        </div>

        {isAwakened && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-gradient-to-r from-gold via-red-600 to-amber-300 blur-2xl opacity-60 animate-ping" />
          </div>
        )}
      </div>

      {/* Footer Instruction */}
      <div className="flex flex-col items-center text-center mb-6 z-10 space-y-2">
        <p
          className={`text-xs md:text-sm font-sans tracking-widest uppercase transition-colors duration-300 ${
            isPressing ? 'text-amber-300 font-bold scale-105' : 'text-amber-200/60'
          }`}
        >
          {eventConfig.texts.introInstruction}
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>
    </div>
  );
};
