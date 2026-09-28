'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { ArrowRight, Sparkles, Volume2, VolumeX, RotateCcw, Play } from 'lucide-react';

interface PortalOpeningProps {
  onComplete: () => void;
}

type DoorStage = 'CLOSED' | 'SLOW_CREAK' | 'STUCK' | 'FORCE_OPEN' | 'OPEN';

export const PortalOpening: React.FC<PortalOpeningProps> = ({ onComplete }) => {
  const [doorStage, setDoorStage] = useState<DoorStage>('CLOSED');
  const [isEnteringMansion, setIsEnteringMansion] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Initial click and latch unlocking sound
    soundEngine.playMechanicalClack();

    // Start video muted in background to prime decoder on mobile
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Will start when doors open
      });
    }

    // 2. Begin slow creaking open (Phase 1)
    const timer1 = setTimeout(() => {
      setDoorStage('SLOW_CREAK');
      soundEngine.playDoorCreakInitial();
    }, 500);

    // 3. Door gets STUCK! (Phase 2)
    const timer2 = setTimeout(() => {
      setDoorStage('STUCK');
      soundEngine.playDoorStuck();
    }, 2000);

    // 4. Force through the jam — doors swing wide open & video starts from 0:00!
    const timer3 = setTimeout(() => {
      setDoorStage('FORCE_OPEN');
      setIsEnteringMansion(true);
      soundEngine.playDoorForceOpen();
      soundEngine.duckAmbient(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayOverlay(false);
          })
          .catch(() => {
            // If browser blocks unmuted playback, try muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(() => {
                  // Show play button if mobile totally blocked autoplay
                  setShowPlayOverlay(true);
                  setIsPlaying(false);
                });
            }
          });
      }
    }, 4800);

    // 5. Door fully open
    const timer4 = setTimeout(() => {
      setDoorStage('OPEN');
    }, 7600);

    // 6. Narrative sequence
    const timer5 = setTimeout(() => {
      setShowFirstText(true);
    }, 5500);

    const timer6 = setTimeout(() => {
      setShowSecondText(true);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      soundEngine.duckAmbient(false);
    };
  }, []);

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setIsPlaying(false);
    soundEngine.duckAmbient(false);
  };

  const handleManualPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setIsMuted(false);
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setShowPlayOverlay(false);
        soundEngine.duckAmbient(true);
      })
      .catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
          setShowPlayOverlay(false);
        }
      });
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

  // Door 3D transforms
  const getLeftDoorStyles = () => {
    switch (doorStage) {
      case 'CLOSED':
        return 'translate-x-0 [transform:rotateY(0deg)]';
      case 'SLOW_CREAK':
        return '-translate-x-[12%] [transform:rotateY(-20deg)] duration-[1400ms] ease-out';
      case 'STUCK':
        return '-translate-x-[14%] [transform:rotateY(-22deg)] duration-[150ms] animate-pulse';
      case 'FORCE_OPEN':
      case 'OPEN':
        return '-translate-x-full [transform:rotateY(-85deg)] duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1) opacity-0 pointer-events-none';
    }
  };

  const getRightDoorStyles = () => {
    switch (doorStage) {
      case 'CLOSED':
        return 'translate-x-0 [transform:rotateY(0deg)]';
      case 'SLOW_CREAK':
        return 'translate-x-[12%] [transform:rotateY(20deg)] duration-[1400ms] ease-out';
      case 'STUCK':
        return 'translate-x-[14%] [transform:rotateY(22deg)] duration-[150ms] animate-pulse';
      case 'FORCE_OPEN':
      case 'OPEN':
        return 'translate-x-full [transform:rotateY(85deg)] duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1) opacity-0 pointer-events-none';
    }
  };

  return (
    <div
      onClick={doorStage === 'FORCE_OPEN' || doorStage === 'OPEN' ? handleManualPlay : undefined}
      className="relative flex flex-col items-center justify-between min-h-screen w-full select-none z-10 overflow-hidden bg-black [perspective:1400px]"
    >
      {/* BACKGROUND: FULL-SCREEN CINEMATIC WITCHES VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src="/video/continua_con_otro_video_con_es.mp4"
          playsInline
          autoPlay
          muted
          preload="auto"
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover object-center transition-all duration-[4000ms] ease-out ${
            isEnteringMansion ? 'scale-105 brightness-105' : 'scale-100 brightness-75'
          }`}
        />

        {/* Dynamic Pulsing Cauldron Light & Living Embers Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            isEnteringMansion ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at 50% 65%, rgba(52, 211, 153, 0.35) 0%, rgba(212, 175, 55, 0.20) 25%, transparent 65%)',
          }}
        />

        {/* Ambient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 pointer-events-none" />

        {/* Big Center Golden Play Button if mobile blocked autoplay */}
        {showPlayOverlay && (doorStage === 'FORCE_OPEN' || doorStage === 'OPEN') && !isVideoEnded && (
          <div
            onClick={handleManualPlay}
            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 cursor-pointer animate-fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 via-gold to-yellow-400 border-2 border-white flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.95)] hover:scale-110 active:scale-95 transition-all">
              <Play className="w-10 h-10 text-black fill-black ml-1" />
            </div>
            <span className="text-xs font-gothic tracking-widest text-amber-200 uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/80 px-4 py-1.5 rounded-full border border-gold/40">
              TOCA PARA VER EL RITUAL DE LAS BRUJAS
            </span>
          </div>
        )}

        {/* Sound Toggle Control (Top Right) */}
        {(doorStage === 'FORCE_OPEN' || doorStage === 'OPEN') && !showPlayOverlay && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            {isMuted && (
              <span className="text-[10px] font-sans bg-black/80 text-amber-300 px-2.5 py-1 rounded-full border border-gold/40 animate-pulse">
                Toca para sonido 🔊
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
        )}
      </div>

      {/* LEFT HEAVY OAK & IRON MANSION DOOR */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 z-30 transition-all origin-left border-r-2 border-black/80 shadow-[20px_0_60px_rgba(0,0,0,0.98)] overflow-hidden ${getLeftDoorStyles()}`}
      >
        <div className="absolute top-0 bottom-0 left-0 w-[200%] h-full">
          <Image
            src="/images/mansion_doors_closed.jpg"
            alt="Portón de la Mansión Izquierdo"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-1/2 w-4 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* RIGHT HEAVY OAK & IRON MANSION DOOR */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 z-30 transition-all origin-right border-l-2 border-black/80 shadow-[-20px_0_60px_rgba(0,0,0,0.98)] overflow-hidden ${getRightDoorStyles()}`}
      >
        <div className="absolute top-0 bottom-0 right-0 w-[200%] h-full">
          <Image
            src="/images/mansion_doors_closed.jpg"
            alt="Portón de la Mansión Derecho"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-1/2 w-4 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* TENSION / STUCK DOOR WARNING */}
      {doorStage === 'STUCK' && (
        <div className="relative z-40 my-auto text-center px-4 animate-fade-in pointer-events-none max-w-md w-full">
          <div className="p-4 rounded-2xl bg-black/90 border-2 border-red-700/80 text-center shadow-[0_0_35px_rgba(185,28,28,0.8)] backdrop-blur-md space-y-1.5 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-red-400 font-gothic tracking-widest text-sm md:text-base font-bold uppercase">
              <span>⚔️</span>
              <span>¡PORTÓN ATASCADO!</span>
              <span>⚔️</span>
            </div>
            <p className="text-xs md:text-sm font-sans tracking-wide text-amber-200/90">
              La pesada madera de roble y los herrajes oponen resistencia...
            </p>
          </div>
        </div>
      )}

      {/* TOP HEADER OVERLAY ONCE INSIDE MANSION */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 mt-8 space-y-1 pointer-events-none">
        {showFirstText && (
          <div className="space-y-1 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-gold/40 text-gold text-[10px] font-sans tracking-widest uppercase backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-gold animate-spin-slow" />
              <span>EL CÍRCULO TE OBSERVA</span>
            </div>
            <h2 className="text-xl md:text-3xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-600 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase font-bold">
              {eventConfig.texts.portalCrossed}
            </h2>
          </div>
        )}

        {showSecondText && (
          <p className="text-xs md:text-sm font-sans tracking-wider text-rose-100/90 italic animate-fade-in drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-black/60 backdrop-blur-md py-1 px-3 rounded-lg border border-gold/20">
            «Las brujas y los brujos te invitan a unirte al caldero...»
          </p>
        )}
      </div>

      {/* BOTTOM ACTION: Button appears ONLY when the video has ended 100% */}
      <div className="relative z-20 mb-8 w-full max-w-sm px-6 flex flex-col items-center space-y-3">
        {doorStage === 'FORCE_OPEN' || doorStage === 'OPEN' ? (
          isVideoEnded ? (
            <div className="w-full space-y-2.5 animate-fade-in text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
          )
        ) : null}
      </div>
    </div>
  );
};
