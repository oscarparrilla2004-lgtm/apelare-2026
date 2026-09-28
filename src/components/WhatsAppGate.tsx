'use client';

import React, { useState } from 'react';
import { eventConfig } from '@/config/eventConfig';
import { VipPassModal } from './VipPassModal';
import { MessageCircle, Sparkles, Download, Lock, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '@/lib/soundEngine';

interface WhatsAppGateProps {
  token?: string;
  guestName?: string;
  witchNickname?: string;
  teamName?: string;
}

export const WhatsAppGate: React.FC<WhatsAppGateProps> = ({
  token = 'DEMO',
  guestName = '',
  witchNickname = '',
  teamName = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passDownloaded, setPassDownloaded] = useState(false);
  const [copiedBizum, setCopiedBizum] = useState(false);
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  const handleOpenPass = () => {
    setIsPassModalOpen(true);
    if (!passDownloaded) setPassDownloaded(true);
  };

  const handleCopyBizum = () => {
    navigator.clipboard.writeText(eventConfig.bizumPhone);
    setCopiedBizum(true);
    soundEngine.playMechanicalClack();
    setTimeout(() => setCopiedBizum(false), 2500);
  };

  const handleEnterCircle = async () => {
    setIsLoading(true);
    setShowRedirectNotice(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f3e5ab', '#8b0000', '#b22222'],
    });

    try {
      const res = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'unlock_gate' }),
      });
      const data = await res.json();
      const targetUrl = data.whatsappLink || eventConfig.whatsappLink;
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1200);
    } catch {
      setTimeout(() => {
        window.location.href = eventConfig.whatsappLink;
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4 animate-fade-in w-full">
      {/* Personalized header */}
      {guestName && (
        <div className="p-3 rounded-xl border border-gold/30 bg-black/60 backdrop-blur-md w-full space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>BIENVENIDA AL CÍRCULO</span>
          </div>
          <p className="text-lg font-gothic tracking-wider text-amber-100">{guestName}</p>
          {witchNickname && (
            <p className="text-xs font-sans tracking-widest text-gold italic">«{witchNickname}»</p>
          )}
          {teamName && (
            <span className="inline-block px-3 py-1 rounded-full bg-gold/15 border border-gold/50 text-gold text-xs font-gothic tracking-wider uppercase">
              🛡️ Clan {teamName}
            </span>
          )}
        </div>
      )}

      {/* STEP 1 — VIP PASS: Big, unmissable, mandatory */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-amber-300/80">
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${passDownloaded ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-gold bg-gold/20 text-gold'}`}>
            {passDownloaded ? '✓' : '1'}
          </span>
          <span>{passDownloaded ? 'PASE SAGRADO ABIERTO ✓' : 'PRIMERO: DESCARGA TU PASE SAGRADO'}</span>
        </div>

        <button
          onClick={handleOpenPass}
          style={{ backgroundColor: passDownloaded ? '#14532d' : '#f59e0b', color: passDownloaded ? '#86efac' : '#000000' }}
          className="w-full py-4 px-5 rounded-2xl border-2 border-white font-sans font-black text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.85)] flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Download className={`w-5 h-5 stroke-[3] ${passDownloaded ? 'text-emerald-300' : 'text-black'}`} />
            <span className="text-sm md:text-base font-extrabold">🎟️ {passDownloaded ? 'VER / DESCARGAR PASE SAGRADO' : 'DESCARGAR MI PASE SAGRADO'}</span>
          </div>
          <span className={`text-[10px] font-normal tracking-normal ${passDownloaded ? 'text-emerald-200/80' : 'text-black/70'}`}>
            {passDownloaded ? 'Pase abierto • Guárdalo en tu galería' : 'Tu invitación personalizada en HD • Guárdala en tu galería'}
          </span>
        </button>
      </div>

      {/* STEP 2 — WHATSAPP: locked until pass opened */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-amber-300/80">
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${passDownloaded ? 'border-gold bg-gold/20 text-gold' : 'border-white/20 bg-white/5 text-white/30'}`}>
            2
          </span>
          <span className={passDownloaded ? 'text-amber-300/80' : 'text-white/30'}>
            {passDownloaded ? 'AHORA: ÚNETE AL GRUPO OFICIAL' : 'DESPUÉS DE DESCARGAR: ENTRAR AL GRUPO'}
          </span>
        </div>

        {passDownloaded ? (
          <button
            onClick={handleEnterCircle}
            disabled={isLoading}
            style={{ backgroundColor: '#10b981', color: '#000000' }}
            className="group w-full py-4 px-6 rounded-2xl border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.85)] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-black stroke-[2.5] group-hover:rotate-12 transition-transform" />
            <span>{isLoading ? 'ENTRANDO AL GRUPO...' : eventConfig.texts.enterCircleButton}</span>
          </button>
        ) : (
          <div
            className="w-full py-4 px-6 rounded-2xl border-2 border-white/15 bg-black/50 flex items-center justify-center gap-2.5 cursor-not-allowed opacity-50"
          >
            <Lock className="w-5 h-5 text-white/40" />
            <span className="text-white/40 font-sans font-black text-sm tracking-wider uppercase">
              {eventConfig.texts.enterCircleButton}
            </span>
          </div>
        )}
      </div>

      {/* Redirect notice popup */}
      {showRedirectNotice && (
        <div className="w-full p-3 rounded-2xl bg-amber-950/95 border-2 border-amber-400 text-amber-100 text-xs font-sans space-y-1 shadow-[0_0_25px_rgba(245,158,11,0.7)] animate-fade-in">
          <p className="font-bold text-amber-300 flex items-center justify-center gap-1.5">
            <span>✨</span>
            <span>¡Redirigiendo a WhatsApp!</span>
          </p>
          <p className="text-[11px] text-rose-100">
            ⚠️ <strong className="text-amber-200">Acuérdate de hacer tu pago, no esperes al último momento</strong>.
          </p>
        </div>
      )}

      {/* URGENT PAYMENT REMINDER BANNER */}
      <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#200b0b] via-[#150a0a] to-[#200b0b] border border-amber-500/50 text-center space-y-1.5 shadow-[0_0_20px_rgba(185,28,28,0.4)] backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <span>⚠️</span>
          <span>RECORDATORIO DE PAGO</span>
        </div>
        <p className="text-xs md:text-sm font-sans font-bold text-amber-100 leading-snug">
          &ldquo;{eventConfig.paymentReminder}&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-amber-500/20 text-left">
          <div>
            <p className="text-xs font-sans text-amber-200">
              🏡 <strong className="text-gold font-bold">{eventConfig.price} por pareja</strong> &bull; Casa Rural Completa
            </p>
            <p className="text-[11px] font-sans text-rose-200/90">
              📲 Bizum a <strong className="text-amber-200 font-bold">{eventConfig.bizumRecipient}</strong> (<span className="font-mono text-gold font-bold">{eventConfig.bizumPhoneFormatted}</span>) &bull; <span className="text-amber-300">Antes del {eventConfig.bizumDeadline}</span>
            </p>
          </div>

          <button
            onClick={handleCopyBizum}
            type="button"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-sans tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              copiedBizum
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-gold/15 border-gold/40 text-gold hover:bg-gold/25'
            }`}
          >
            {copiedBizum ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>¡COPIADO!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-gold" />
                <span>COPIAR TELÉFONO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VIP Pass Modal */}
      <VipPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        guestName={guestName}
        witchNickname={witchNickname}
        teamName={teamName}
        token={token}
      />
    </div>
  );
};
