'use client';

import React, { useState, useEffect } from 'react';
import { WaxSeal } from './WaxSeal';
import { soundEngine } from '@/lib/soundEngine';
import { eventConfig } from '@/config/eventConfig';
import { generateWitchNickname, generateUniqueWitchNickname, detectGender } from '@/lib/witchNickname';
import { ArrowRight } from 'lucide-react';

interface PactProps {
  token?: string;
  initialGuestName?: string;
  initialWitchNickname?: string;
  isAlreadySealed?: boolean;
  onComplete: (name: string, nickname: string, gender: 'masculino' | 'femenino') => void;
}

export const Pact: React.FC<PactProps> = ({
  token = 'DEMO',
  initialGuestName = '',
  initialWitchNickname = '',
  isAlreadySealed = false,
  onComplete,
}) => {
  const [userName, setUserName] = useState(initialGuestName);
  const [gender, setGender] = useState<'masculino' | 'femenino'>(
    initialGuestName ? detectGender(initialGuestName) : 'masculino'
  );
  const [confirmedWarning, setConfirmedWarning] = useState(isAlreadySealed);
  const [isSealed, setIsSealed] = useState(isAlreadySealed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [witchNickname, setWitchNickname] = useState(initialWitchNickname || '');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (initialGuestName && !userName) {
      setUserName(initialGuestName);
      setGender(detectGender(initialGuestName));
    }
    if (initialWitchNickname) {
      setWitchNickname(initialWitchNickname);
    }
    if (isAlreadySealed) {
      setIsSealed(true);
      setConfirmedWarning(true);
    }
  }, [initialGuestName, userName, isAlreadySealed, initialWitchNickname]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    if (newName.trim()) {
      setGender(detectGender(newName));
    }
  };

  const handleAcceptPact = async () => {
    if (!userName.trim()) {
      setShowError(true);
      return;
    }
    if (!confirmedWarning) {
      return;
    }
    setShowError(false);

    if (isSealed || isSubmitting) return;

    setIsSubmitting(true);

    // Fetch all already-used nicknames from the DB to guarantee uniqueness
    let usedNicknames: string[] = [];
    try {
      const res = await fetch('/api/teams', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.takenNicknames)) {
        usedNicknames = data.takenNicknames;
      }
    } catch {
      // If fetch fails, fall back
    }

    const nickname =
      initialWitchNickname && !usedNicknames.map(n => n.toLowerCase().trim()).includes(initialWitchNickname.toLowerCase().trim())
        ? initialWitchNickname
        : generateUniqueWitchNickname(userName, gender, usedNicknames);

    setWitchNickname(nickname);

    soundEngine.playWaxSeal();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 50, 120]);
      } catch {}
    }
    setIsSealed(true);

    try {
      await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'accept_pact', name: userName, nickname, gender }),
      });
    } catch {
      // Network fallback
    }
  };

  const handleContinueToReward = () => {
    onComplete(userName, witchNickname, gender);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-5 py-8 select-none z-10 overflow-hidden">
      {/* Background Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-6 z-10 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 text-[10px] font-sans tracking-widest uppercase">
          <span>📜</span>
          <span>DOCUMENTO SAGRADO</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-gold to-amber-600 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase font-bold">
          {eventConfig.texts.pactTitle}
        </h2>
      </div>

      {/* Ancient Parchment Scroll */}
      <div className="relative my-auto w-full max-w-md p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#19110b] via-[#100a06] to-[#0a0604] border border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-md z-20 flex flex-col items-center text-center space-y-4">
        {/* Subtle Decorative Corners */}
        <div className="absolute top-2.5 left-3 text-gold/30 text-xs font-serif select-none">✦</div>
        <div className="absolute top-2.5 right-3 text-gold/30 text-xs font-serif select-none">✦</div>
        <div className="absolute bottom-2.5 left-3 text-gold/30 text-xs font-serif select-none">✦</div>
        <div className="absolute bottom-2.5 right-3 text-gold/30 text-xs font-serif select-none">✦</div>

        <p className="text-sm md:text-base font-sans tracking-wide text-amber-100/95 leading-relaxed italic font-medium px-2">
          &ldquo;{eventConfig.texts.pactBody}&rdquo;
        </p>

        {!isSealed ? (
          <>
            {/* Input Box and Gender Toggle Selector */}
            <div className="w-full flex flex-col items-center space-y-2 pt-1">
              <label className="text-xs font-gothic tracking-widest text-amber-300 uppercase flex items-center gap-1.5">
                <span>✍️</span>
                <span>Escribe tu nombre de mortal</span>
              </label>

              <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Tu nombre aquí..."
                className={`w-full max-w-sm px-4 py-3 rounded-xl bg-black/85 border ${
                  showError ? 'border-red-500 animate-bounce-short' : 'border-gold/40 focus:border-gold'
                } text-amber-100 font-sans tracking-wide text-center text-base md:text-lg focus:outline-none focus:ring-1 focus:ring-gold/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] transition-all font-semibold`}
              />

              {/* Gender Toggle Selector */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setGender('masculino')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wider border transition-all duration-300 cursor-pointer ${
                    gender === 'masculino'
                      ? 'bg-amber-950/80 border-gold text-amber-200 shadow-[0_0_10px_rgba(212,175,55,0.4)] font-bold'
                      : 'bg-black/50 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  🧙‍♂️ Brujo
                </button>

                <button
                  type="button"
                  onClick={() => setGender('femenino')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wider border transition-all duration-300 cursor-pointer ${
                    gender === 'femenino'
                      ? 'bg-red-950/80 border-rose-500 text-rose-200 shadow-[0_0_10px_rgba(225,29,72,0.4)] font-bold'
                      : 'bg-black/50 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  🧙‍♀️ Bruja
                </button>
              </div>

              {showError && (
                <p className="text-xs font-sans text-red-400 font-medium">
                  Debes escribir tu nombre para sellar el pacto.
                </p>
              )}
            </div>

            {/* Warning Box */}
            <div className="w-full p-3.5 rounded-xl border border-red-900/50 bg-red-950/25 text-left space-y-2 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(139,0,0,0.3)]">
              <div className="flex items-center gap-1.5 text-red-400">
                <span>⚠️</span>
                <span className="text-xs font-gothic tracking-wider uppercase font-bold">
                  Advertencia del Círculo
                </span>
              </div>
              <p className="text-xs font-sans leading-relaxed text-rose-100/90">
                Una vez sellado este pacto con tu nombre, <strong className="text-red-400">no habrá marcha atrás</strong>. Lo que ocurra dentro del Akelarre pertenecerá a las sombras para siempre.
              </p>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 pt-0.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={confirmedWarning}
                  onChange={(e) => setConfirmedWarning(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gold/50 text-red-600 focus:ring-red-900 bg-black cursor-pointer accent-red-600"
                />
                <span className="text-xs font-sans text-amber-200/90 group-hover:text-amber-100 transition-colors">
                  Acepto sellar mi destino y asumo las consecuencias de la noche sin marcha atrás.
                </span>
              </label>
            </div>
          </>
        ) : (
          /* Sealed State */
          <div className="w-full flex flex-col items-center space-y-3 py-2 animate-fade-in">
            <WaxSeal isSealed={true} />
            <div className="space-y-1 text-center">
              <p className="text-[11px] uppercase tracking-widest text-red-400 font-bold">
                {eventConfig.texts.pactSealed}
              </p>
              <p className="text-lg font-gothic tracking-wider text-amber-100 font-bold uppercase">
                {userName}
              </p>
              <p className="text-base font-gothic tracking-widest text-gold italic border-y border-gold/30 py-1 px-4 my-1">
                «{witchNickname}»
              </p>
              <p className="text-xs font-sans text-rose-200/80 italic pt-0.5">
                Tu nombre ha quedado escrito en el pergamino sagrado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Button Action */}
      <div className="z-20 mb-3 w-full max-w-sm">
        {!isSealed ? (
          <button
            onClick={handleAcceptPact}
            disabled={isSubmitting || !confirmedWarning || !userName.trim()}
            style={
              confirmedWarning && userName.trim()
                ? { backgroundColor: '#dc2626', color: '#ffffff' }
                : { backgroundColor: '#27272a', color: '#71717a' }
            }
            className={`w-full py-4 px-6 rounded-full font-sans font-black text-sm md:text-base tracking-wider uppercase transition-all duration-300 border-2 ${
              confirmedWarning && userName.trim()
                ? 'border-white shadow-[0_0_25px_rgba(220,38,38,0.9)] hover:scale-105 active:scale-95 cursor-pointer'
                : 'border-white/10 cursor-not-allowed opacity-60'
            }`}
          >
            {confirmedWarning && userName.trim()
              ? '🔥 SELLAR EL PACTO PARA SIEMPRE'
              : '⚠️ MARCA LA CASILLA PARA SELLAR'}
          </button>
        ) : (
          <button
            onClick={handleContinueToReward}
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="w-full py-4 px-6 rounded-full border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.95)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="font-extrabold">ELEGIR TU CLAN DEL DESTINO</span>
            <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
