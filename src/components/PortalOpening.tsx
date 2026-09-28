'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PortalOpeningProps {
  onComplete: () => void;
}

type DoorStage = 'CLOSED' | 'SLOW_CREAK' | 'STUCK' | 'FORCE_OPEN' | 'OPEN';

export const PortalOpening: React.FC<PortalOpeningProps> = ({ onComplete }) => {
  const [doorStage, setDoorStage] = useState<DoorStage>('CLOSED');
  const [isEnteringMansion, setIsEnteringMansion] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Initial click and latch unlocking sound
    soundEngine.playMechanicalClack();

    // Ensure video is paused at second 0 while doors are closed
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // 2. Begin slow creaking open (Phase 1)
    const timer1 = setTimeout(() => {
      setDoorStage('SLOW_CREAK');
      soundEngine.playDoorCreakInitial();
    }, 400);

    // 3. Door gets STUCK! (Phase 2 - 3.0s duration so message is completely legible)
    const timer2 = setTimeout(() => {
      setDoorStage('STUCK');
      soundEngine.playDoorStuck();
    }, 1800);

    // 4. Force through the jam — doors swing wide open, VIDEO STARTS FROM SECOND 0:00!
    const timer3 = setTimeout(() => {
      setDoorStage('FORCE_OPEN');
      setIsEnteringMansion(true);
      soundEngine.playDoorForceOpen();

      // Duck ambient music completely so the video's voice is crystal clear
      soundEngine.duckAmbient(true);

      // Start video from the very beginning with audio
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }, 4800);

    // 5. Door fully open, camera pushed in
    const timer4 = setTimeout(() => {
      setDoorStage('OPEN');
    }, 7800);

    // 6. Narrative sequence
    const timer5 = setTimeout(() => {
      setShowFirstText(true);
    }, 5600);

    const timer6 = setTimeout(() => {
      setShowSecondText(true);
    }, 7200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []); // Run ONLY once on mount

  // Continue button appears ONLY when the video of the witches has finished 100% of its duration
  const handleVideoEnded = () => {
    setShowContinueButton(true);
    soundEngine.duckAmbient(false);
  };

  // Door 3D transforms
  const getLeftDoorStyles = () => {
    switch (doorStage) {
      case 'CLOSED':
        return 'translate-x-0 [transform:rotateY(0deg)]';
      case 'SLOW_CREAK':
        return '-translate-x-[12%] [transform:rotateY(-20deg)] duration-[1300ms] ease-out';
      case 'STUCK':
        return '-translate-x-[14%] [transform:rotateY(-22deg)] duration-[150ms] animate-pulse';
      case 'FORCE_OPEN':
      case 'OPEN':
        return '-translate-x-full [transform:rotateY(-85deg)] duration-[3200ms] cubic-bezier(0.2, 0.8, 0.2, 1) opacity-0';
    }
  };

  const getRightDoorStyles = () => {
    switch (doorStage) {
      case 'CLOSED':
        return 'translate-x-0 [transform:rotateY(0deg)]';
      case 'SLOW_CREAK':
        return 'translate-x-[12%] [transform:rotateY(20deg)] duration-[1300ms] ease-out';
      case 'STUCK':
        return 'translate-x-[14%] [transform:rotateY(22deg)] duration-[150ms] animate-pulse';
      case 'FORCE_OPEN':
      case 'OPEN':
        return 'translate-x-full [transform:rotateY(85deg)] duration-[3200ms] cubic-bezier(0.2, 0.8, 0.2, 1) opacity-0';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full select-none z-10 overflow-hidden bg-black [perspective:1400px]">
      {/* BACKGROUND: FULL CINEMATIC VIDEO WITH LIVE ATMOSPHERE */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <div
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in ${
            doorStage === 'FORCE_OPEN' || doorStage === 'OPEN' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Full cinematic video */}
          <video
            ref={videoRef}
            src="/video/continua_con_otro_video_con_es.mp4"
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[5000ms] ease-out ${
              isEnteringMansion
                ? 'scale-[1.12] brightness-105'
                : 'scale-100 brightness-75'
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

          {/* Cauldron Rising Emerald Steam & Smoke Animation */}
          <div className="absolute bottom-1/4 inset-x-0 h-56 bg-gradient-to-t from-emerald-950/40 via-emerald-900/20 to-transparent pointer-events-none animate-pulse-slow mix-blend-screen" />

          {/* Ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80 pointer-events-none" />

          {/* Floor mystical fog */}
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-red-950/30 to-transparent pointer-events-none animate-pulse-slow" />
        </div>
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

      {/* ATMOSPHERIC NARRATIVE OVERLAY ONCE INSIDE MANSION */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 my-auto space-y-4 max-w-lg">
        {showFirstText && (
          <div className="space-y-1 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] font-sans tracking-widest uppercase backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-gold animate-spin-slow" />
              <span>EL CÍRCULO TE OBSERVA</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-600 drop-shadow-[0_0_25px_rgba(212,175,55,0.9)] uppercase pt-1 font-bold">
              {eventConfig.texts.portalCrossed}
            </h2>
          </div>
        )}

        {showSecondText && (
          <p className="text-xs md:text-base font-sans tracking-wider text-rose-100/90 italic animate-fade-in drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] bg-black/60 backdrop-blur-md py-1.5 px-4 rounded-xl border border-gold/30">
            «Las brujas y los brujos te invitan a unirte al caldero...»
          </p>
        )}

        {/* Continue Button: stays visible inviting to advance */}
        {showContinueButton && (
          <div className="pt-4 animate-fade-in z-30 w-full max-w-xs">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                }
                soundEngine.duckAmbient(false);
                onComplete();
              }}
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full border-2 border-white font-sans font-black text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.95)] cursor-pointer"
            >
              <span>ACERCARSE AL CALDERO</span>
              <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
