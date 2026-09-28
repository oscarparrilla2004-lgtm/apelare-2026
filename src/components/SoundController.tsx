'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export const SoundController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundEngine.getIsMuted());

    // Auto-unmute & start all 3 ambient layers on first user interaction
    const handleFirstInteraction = () => {
      soundEngine.startAmbient();
      setIsMuted(soundEngine.getIsMuted());
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, []);

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    soundEngine.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-50 select-none animate-fade-in">
      <button
        onClick={handleToggleSound}
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 border border-gold/50 shadow-[0_2px_15px_rgba(0,0,0,0.9)] backdrop-blur-md hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
        title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
      >
        {!isMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] font-gothic tracking-widest text-amber-200 uppercase font-bold">
              SONIDO ON
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-gothic tracking-widest text-white/50 uppercase">
              MUTE
            </span>
          </>
        )}
      </button>
    </div>
  );
};
