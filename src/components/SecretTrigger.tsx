'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { Sparkles, X } from 'lucide-react';

export const SecretTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = useCallback(() => {
    soundEngine.startAmbient();
    setHoldProgress(0);

    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += 0.05;
      setHoldProgress(Math.min(1, progress));
    }, 150);

    timerRef.current = setTimeout(() => {
      soundEngine.playSecretChime();
      setIsOpen(true);
      setHoldProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 3000);
  }, []);

  const endHold = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  }, []);

  if (!eventConfig.secretEnabled) return null;

  return (
    <>
      {/* Hidden Corner Sigil Button */}
      <div
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
        className="fixed bottom-4 left-4 z-40 p-2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-500 touch-none"
        title="Secret Sigil"
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          {/* Progress Indicator Halo */}
          {holdProgress > 0 && (
            <div
              className="absolute inset-0 rounded-full border-2 border-gold blur-[1px]"
              style={{ opacity: holdProgress, transform: `scale(${1 + holdProgress * 0.5})` }}
            />
          )}
          <span className="text-gold text-lg select-none">⛧</span>
        </div>
      </div>

      {/* Secret Lore Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-sm p-6 rounded-2xl bg-gradient-to-b from-[#1c1224] to-[#0c0812] border-2 border-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.4)] text-center space-y-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-gold/60 hover:text-gold hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 border border-gold/30 text-gold mb-1">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-lg font-gothic tracking-widest text-gold uppercase">
              {eventConfig.texts.secretFoundTitle}
            </h3>

            <p className="text-sm font-sans tracking-wider text-rose-100/80 italic border-t border-gold/20 pt-3">
              &ldquo;{eventConfig.texts.secretFoundText}&rdquo;
            </p>

            <div className="pt-2 flex flex-col items-center gap-2">
              <Link
                href="/organizacion"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-950 via-amber-900 to-red-950 border border-gold text-gold text-xs font-gothic tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                🔮 PANEL DE ORGANIZACIÓN
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-1.5 text-xs text-white/50 hover:text-white uppercase tracking-wider"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
