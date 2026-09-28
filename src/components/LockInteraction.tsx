'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Key3D } from './Key3D';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { RotateCw, Check, Sparkles } from 'lucide-react';

interface LockInteractionProps {
  onComplete: () => void;
}

export const LockInteraction: React.FC<LockInteractionProps> = ({ onComplete }) => {
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 90 degrees
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }, []);

  const unlock = useCallback(() => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setRotationAngle(90);
    soundEngine.playClack();
    triggerHaptic([60, 40, 100]);

    setTimeout(() => {
      onComplete();
    }, 800);
  }, [isUnlocked, onComplete, triggerHaptic]);

  const checkUnlockThreshold = useCallback(
    (angle: number) => {
      if (angle >= 65 && !isUnlocked) {
        unlock();
      }
    },
    [isUnlocked, unlock]
  );

  // 1. Gyroscope listener (if supported / secure context)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const tilt = e.gamma ?? 0;
      if (tilt > 5 && !isUnlocked) {
        const mappedAngle = Math.min(90, Math.max(0, (tilt / 40) * 90));
        setRotationAngle(mappedAngle);
        checkUnlockThreshold(mappedAngle);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [isUnlocked, checkUnlockThreshold]);

  // 2. Touch & Mouse Swipe Handlers
  const handleTouchStart = (clientX: number) => {
    if (isUnlocked) return;
    setIsDragging(true);
    startXRef.current = clientX;
    initialAngleRef.current = rotationAngle;
  };

  const handleTouchMove = (clientX: number) => {
    if (!isDragging || isUnlocked) return;
    const deltaX = clientX - startXRef.current;
    // 90px horizontal drag = 90 degrees
    const newAngle = Math.min(90, Math.max(0, initialAngleRef.current + (deltaX / 90) * 90));
    setRotationAngle(newAngle);

    if (Math.floor(newAngle) % 15 === 0) {
      soundEngine.playMechanicalClack();
      triggerHaptic(8);
    }

    checkUnlockThreshold(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 3. One-Click Smooth Auto-Turn Button
  const handleAutoTurn = () => {
    if (isUnlocked) return;
    let current = rotationAngle;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 90) {
        clearInterval(interval);
        setRotationAngle(90);
        unlock();
      } else {
        setRotationAngle(current);
        soundEngine.playMechanicalClack();
        triggerHaptic(10);
      }
    }, 45);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-4 py-6 select-none z-10 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mt-2 z-10 space-y-2 max-w-sm">
        <h2 className="text-2xl md:text-3xl font-gothic tracking-widest text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase font-bold">
          {eventConfig.texts.lockTitle}
        </h2>

        <p className="text-xs md:text-sm font-sans tracking-wide text-rose-100/90 max-w-xs">
          Desliza la llave hacia la derecha o pulsa el botón para abrir
        </p>
      </div>

      {/* Lock Escutcheon & Key with Touch/Swipe */}
      <div
        onMouseDown={(e) => handleTouchStart(e.clientX)}
        onMouseMove={(e) => handleTouchMove(e.clientX)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        onClick={handleAutoTurn}
        className="relative flex items-center justify-center my-auto cursor-pointer touch-none z-20"
      >
        {/* Lock Plate SVG */}
        <div className="relative flex items-center justify-center">
          <svg
            width="260"
            height="320"
            viewBox="0 0 280 360"
            className="drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
          >
            <defs>
              <linearGradient id="ironPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2c2436" />
                <stop offset="50%" stopColor="#15101c" />
                <stop offset="100%" stopColor="#08060a" />
              </linearGradient>
              <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#f3e5ab" />
                <stop offset="100%" stopColor="#8a7322" />
              </linearGradient>
            </defs>

            <path
              d="M 140 10 L 260 70 V 290 L 140 350 L 20 290 V 70 Z"
              fill="url(#ironPlate)"
              stroke="url(#goldBorder)"
              strokeWidth="4"
            />
            <path
              d="M 140 25 L 245 78 V 282 L 140 335 L 35 282 V 78 Z"
              fill="none"
              stroke="#5c4b14"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            <circle cx="45" cy="85" r="5" fill="#d4af37" />
            <circle cx="235" cy="85" r="5" fill="#d4af37" />
            <circle cx="45" cy="275" r="5" fill="#d4af37" />
            <circle cx="235" cy="275" r="5" fill="#d4af37" />

            <circle cx="140" cy="180" r="70" fill="#070509" stroke="url(#goldBorder)" strokeWidth="3" />
            <circle cx="140" cy="180" r="55" fill="#000000" />
          </svg>

          {/* Rotating Key Inside Lock */}
          <div
            className="absolute transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              filter: `drop-shadow(0 0 ${10 + (rotationAngle / 90) * 25}px rgba(212, 175, 55, 0.9))`,
            }}
          >
            <Key3D progress={rotationAngle / 90} isAwakened={rotationAngle > 40} size={190} />
          </div>
        </div>
      </div>

      {/* Action Helper & Big Prominent Turn Button */}
      <div className="flex flex-col items-center text-center mb-6 z-10 space-y-3 w-full max-w-xs">
        {/* Progress bar */}
        <div className="w-full bg-black/80 border border-gold/40 rounded-full h-2.5 overflow-hidden p-0.5 backdrop-blur-md">
          <div
            className="bg-gradient-to-r from-amber-600 via-gold to-yellow-300 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(212,175,55,0.9)]"
            style={{ width: `${(rotationAngle / 90) * 100}%` }}
          />
        </div>

        {/* PRIMARY ULTRA-LEGIBLE BUTTON TO TURN KEY */}
        {!isUnlocked ? (
          <button
            onClick={handleAutoTurn}
            type="button"
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="w-full py-4 px-6 rounded-full border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <RotateCw className="w-5 h-5 text-black stroke-[3] animate-spin-slow" />
            <span className="font-extrabold">GIRAR LA LLAVE PARA ABRIR</span>
          </button>
        ) : (
          <div
            style={{ backgroundColor: '#10b981', color: '#000000' }}
            className="w-full py-3.5 px-6 rounded-full border-2 border-white font-sans font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.9)] flex items-center justify-center gap-2 animate-fade-in"
          >
            <Check className="w-5 h-5 text-black stroke-[3]" />
            <span>¡CERRADURA ABIERTA!</span>
          </div>
        )}
      </div>
    </div>
  );
};
