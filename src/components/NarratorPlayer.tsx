'use client';

import React, { useState, useEffect } from 'react';
import { narratorEngine, NARRATOR_SCRIPT } from '@/lib/narratorEngine';
import { Volume2, VolumeX, Mic, Sparkles, Play, Square } from 'lucide-react';

export const NarratorPlayer: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  useEffect(() => {
    const unsubscribe = narratorEngine.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (speaking) setHasStartedOnce(true);
    });

    // Attempt autoplay with slight delay
    const timer = setTimeout(() => {
      narratorEngine.speak();
    }, 800);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      narratorEngine.stop();
    };
  }, []);

  const handleToggle = () => {
    narratorEngine.toggle();
  };

  return (
    <div className="w-full max-w-md my-2 z-30 select-none">
      <div className="p-3 rounded-2xl bg-black/85 border-2 border-gold/60 shadow-[0_0_25px_rgba(212,175,55,0.35)] backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              isSpeaking
                ? 'bg-amber-500/20 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-pulse'
                : 'bg-black/60 border-white/20 text-white/50'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-gothic font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>LOCUCIÓN DEL AKELARRE</span>
                {isSpeaking && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-gold h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-gold h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 bg-gold h-1.5 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </p>
              <p className="text-[10px] font-sans text-white/60">
                {isSpeaking ? 'Narrando detalles del ritual...' : 'Voz de la profecía'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            type="button"
            style={
              isSpeaking
                ? { backgroundColor: '#7f1d1d', color: '#fecaca', borderColor: '#ef4444' }
                : { backgroundColor: '#f59e0b', color: '#000000', borderColor: '#ffffff' }
            }
            className="px-3.5 py-2 rounded-full border-2 font-sans font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ESCUCHAR VOZ</span>
              </>
            )}
          </button>
        </div>

        {/* Subtitle / Script snippet */}
        <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] font-sans italic text-rose-100/90 leading-relaxed text-center">
          &ldquo;{NARRATOR_SCRIPT}&rdquo;
        </div>
      </div>
    </div>
  );
};
