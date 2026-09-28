'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string; // ISO format or default
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = '2026-10-30T20:00:00+02:00',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null;

  const timeUnits = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEG', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center space-y-2 select-none w-full max-w-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-widest text-gold/80">
        <Sparkles className="w-3 h-3 text-gold animate-pulse" />
        <span>CUENTA ATRÁS HACIA EL AKELARRE</span>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/75 border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md"
          >
            <span className="text-lg md:text-xl font-gothic font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-500 drop-shadow-[0_1px_5px_rgba(212,175,55,0.7)]">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-sans tracking-widest text-rose-200/60 uppercase mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
