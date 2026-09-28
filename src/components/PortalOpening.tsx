'use client';

import React, { useEffect, useState, useRef } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { ArrowRight, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface PortalOpeningProps {
  onComplete: () => void;
}

export const PortalOpening: React.FC<PortalOpeningProps> = ({ onComplete }) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Duck background sound so the video sound is clear
    soundEngine.duckAmbient(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks unmuted autoplay, play muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    return () => {
      soundEngine.duckAmbient(false);
    };
  }, []);

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setIsPlaying(false);
    soundEngine.duckAmbient(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      soundEngine.duckAmbient(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      soundEngine.duckAmbient(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsVideoEnded(false);
    soundEngine.duckAmbient(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full select-none z-10 overflow-hidden bg-black">
      {/* FULL-SCREEN CINEMATIC WITCHES VIDEO */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center cursor-pointer"
      >
        <video
          ref={videoRef}
          src="/video/continua_con_otro_video_con_es.mp4"
          playsInline
          autoPlay
          preload="auto"
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 pointer-events-none" />

        {/* Sound Toggle Control (Top Right) */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {isMuted && (
            <span className="text-[10px] font-sans bg-black/80 text-amber-300 px-2.5 py-1 rounded-full border border-gold/40 animate-pulse">
              Toca para activar sonido 🔊
            </span>
          )}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/80 border border-gold/50 text-gold hover:bg-gold/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>

      {/* TOP HEADER OVERLAY */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 mt-8 space-y-1 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-gold/40 text-gold text-[10px] font-sans tracking-widest uppercase backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-gold animate-spin-slow" />
          <span>EL CÍRCULO TE OBSERVA</span>
        </div>
        <h2 className="text-xl md:text-3xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-600 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase font-bold">
          {eventConfig.texts.portalCrossed}
        </h2>
        <p className="text-xs md:text-sm font-sans tracking-wider text-rose-100/90 italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-black/60 backdrop-blur-md py-1 px-3 rounded-lg border border-gold/20">
          «Las brujas y los brujos te invitan a unirte al caldero...»
        </p>
      </div>

      {/* BOTTOM ACTION: Button appears ONLY when the video has ended 100% */}
      <div className="relative z-30 mb-8 w-full max-w-sm px-6 flex flex-col items-center space-y-3">
        {isVideoEnded ? (
          <div className="w-full space-y-2.5 animate-fade-in text-center">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                }
                soundEngine.duckAmbient(false);
                onComplete();
              }}
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.95)] cursor-pointer"
            >
              <span className="font-extrabold">ACERCARSE AL CALDERO</span>
              <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 text-xs text-amber-200/70 hover:text-amber-100 transition-colors font-sans underline pt-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a ver el vídeo</span>
            </button>
          </div>
        ) : (
          <div className="py-2 px-4 rounded-full bg-black/60 border border-white/10 text-[11px] text-amber-200/60 font-sans tracking-wider animate-pulse pointer-events-none backdrop-blur-md">
            🕯️ Observa el ritual del caldero...
          </div>
        )}
      </div>
    </div>
  );
};
