'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { Download, Share2, X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface VipPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  witchNickname: string;
  teamName: string;
  token?: string;
}

export const VipPassModal: React.FC<VipPassModalProps> = ({
  isOpen,
  onClose,
  guestName,
  witchNickname,
  teamName,
  token = 'DEMO',
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const generatePassCanvas = useCallback(() => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    baseImage.src = '/images/akelarre_poster.jpg';

    baseImage.onload = () => {
      // 1. Draw base poster image
      ctx.drawImage(baseImage, 0, 0, 1080, 1920);

      // 2. Smooth gradient transition from upper art to bottom section
      const transitionGrad = ctx.createLinearGradient(0, 1020, 0, 1180);
      transitionGrad.addColorStop(0, 'rgba(7, 4, 10, 0)');
      transitionGrad.addColorStop(0.5, 'rgba(7, 4, 10, 0.85)');
      transitionGrad.addColorStop(1, 'rgba(7, 4, 10, 0.99)');
      ctx.fillStyle = transitionGrad;
      ctx.fillRect(0, 1020, 1080, 160);

      // Fully opaque dark obsidian backdrop covering bottom completely
      ctx.fillStyle = '#07040a';
      ctx.fillRect(0, 1180, 1080, 740);

      // 3. Outer Ornate Gold Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1080 - 60, 1920 - 60);

      // Inner dashed decorative border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(48, 48, 1080 - 96, 1920 - 96);
      ctx.setLineDash([]);

      // 4. Corner Runes
      ctx.font = '36px serif';
      ctx.fillStyle = '#d4af37';
      ctx.textAlign = 'center';
      ctx.fillText('𝕬', 75, 90);
      ctx.fillText('𝕬', 1080 - 75, 90);
      ctx.fillText('𝕬', 75, 1920 - 65);
      ctx.fillText('𝕬', 1080 - 75, 1920 - 65);

      // 5. Lower Gothic Parchment Frame
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 1190, 1080 - 140, 665);

      // Corner accents on inner frame
      ctx.fillStyle = '#d4af37';
      ctx.fillText('✦', 90, 1215);
      ctx.fillText('✦', 1080 - 90, 1215);
      ctx.fillText('✦', 90, 1845);
      ctx.fillText('✦', 1080 - 90, 1845);

      // 6. Header: PASE SAGRADO OFICIAL
      ctx.font = '600 26px sans-serif';
      ctx.fillStyle = '#f3e5ab';
      ctx.textAlign = 'center';
      ctx.fillText('✦ PASE SAGRADO DEL AKELARRE ✦', 540, 1245);

      // 7. Guest Mortal Name
      const rawName = (guestName || 'INVITADO DE HONOR').toUpperCase();
      let nameFontSize = 64;
      ctx.font = `900 ${nameFontSize}px serif`;
      while (ctx.measureText(rawName).width > 860 && nameFontSize > 34) {
        nameFontSize -= 2;
        ctx.font = `900 ${nameFontSize}px serif`;
      }

      const nameGrad = ctx.createLinearGradient(0, 1280, 0, 1360);
      nameGrad.addColorStop(0, '#fffbe6');
      nameGrad.addColorStop(0.5, '#d4af37');
      nameGrad.addColorStop(1, '#aa8214');
      ctx.fillStyle = nameGrad;
      ctx.fillText(rawName, 540, 1325);

      // 8. Witch Nickname (Centered with dynamic auto-fit to stay safely within margins)
      if (witchNickname) {
        const rawNick = `«${witchNickname}»`;
        let nickFontSize = 38;
        ctx.font = `italic 700 ${nickFontSize}px serif`;
        ctx.textAlign = 'center';
        while (ctx.measureText(rawNick).width > 820 && nickFontSize > 20) {
          nickFontSize -= 2;
          ctx.font = `italic 700 ${nickFontSize}px serif`;
        }
        ctx.fillStyle = '#fcd34d';
        ctx.fillText(rawNick, 540, 1385);
      }

      // 9. Assigned Coven / Team Badge (Perfect mathematical centering & auto-fit)
      if (teamName) {
        const teamBadgeY = 1445;
        const cleanTeamName = teamName.toUpperCase();
        const displayLabel = `✦ CLAN: ${cleanTeamName} ✦`;

        let clanFontSize = 28;
        ctx.font = `700 ${clanFontSize}px sans-serif`;
        ctx.textAlign = 'center';
        while (ctx.measureText(displayLabel).width > 740 && clanFontSize > 18) {
          clanFontSize -= 2;
          ctx.font = `700 ${clanFontSize}px sans-serif`;
        }

        const textWidth = ctx.measureText(displayLabel).width;
        const badgeWidth = Math.min(840, textWidth + 60);

        ctx.fillStyle = 'rgba(139, 0, 0, 0.55)';
        ctx.fillRect(540 - badgeWidth / 2, teamBadgeY - 32, badgeWidth, 58);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.strokeRect(540 - badgeWidth / 2, teamBadgeY - 32, badgeWidth, 58);

        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayLabel, 540, teamBadgeY - 2);
        ctx.textBaseline = 'alphabetic';
      }

      // 10. Dates and Dress Code
      ctx.textAlign = 'center';
      ctx.font = '700 28px sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('FIN DE SEMANA DEL 30 DE OCTUBRE AL 1 DE NOVIEMBRE', 540, 1575);

      ctx.font = '700 22px sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('VIERNES: FIESTA DRESS CODE SEXY (SIN TEMÁTICA)', 540, 1625);

      ctx.font = '700 22px sans-serif';
      ctx.fillStyle = '#fda4af';
      ctx.fillText('SÁBADO: GRAN FIESTA BRUJAS Y BRUJOS ERÓTICO', 540, 1665);

      ctx.font = '700 20px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('235 € POR PAREJA · BIZUM A OSCAR ANTES DEL 6 OCTUBRE', 540, 1710);

      // 11. Stamped Red Wax Seal
      const sealY = 1780;
      ctx.beginPath();
      ctx.arc(540, sealY, 32, 0, 2 * Math.PI);
      ctx.fillStyle = '#8b0000';
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = '28px serif';
      ctx.fillText('𝕬', 540, sealY + 9);

      // Export as high quality PNG data URL
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setImageSrc(dataUrl);
      setIsGenerating(false);
    };

    baseImage.onerror = () => {
      setIsGenerating(false);
    };
  }, [guestName, witchNickname, teamName]);

  useEffect(() => {
    if (isOpen) {
      generatePassCanvas();
      setHasDownloaded(false);
    }
  }, [isOpen, generatePassCanvas]);

  const handleDownload = () => {
    if (!imageSrc) return;
    soundEngine.playSecretChime();
    setHasDownloaded(true);

    const safeName = (guestName || 'invitado').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `pase_akelarre_2026_${safeName}.png`;

    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!imageSrc) return;
    soundEngine.playMechanicalClack();

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], 'pase_sagrado_akelarre.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pase Sagrado Akelarre de Brujas 2026',
          text: `¡He sellado mi pacto y pertenezco al Clan ${teamName || 'Sagrado'} del Akelarre 2026! 🔥🧙‍♀️`,
        });
        setHasDownloaded(true);
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-4 animate-fade-in select-none overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm sm:max-w-md w-full flex flex-col items-center space-y-3 my-auto p-4 rounded-3xl bg-gradient-to-b from-[#1c1224] via-[#100a18] to-black border-2 border-gold/60 shadow-[0_0_60px_rgba(212,175,55,0.5)] text-center"
      >
        {/* Big Obvious Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-white/80 hover:text-white hover:border-gold text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>CERRAR</span>
        </button>

        {/* Header Title */}
        <div className="space-y-0.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-[10px] font-sans tracking-widest uppercase">
            <span>🎟️</span>
            <span>PASE SAGRADO PERSONALIZADO</span>
          </div>
          <h3 className="text-lg md:text-xl font-gothic tracking-wider text-amber-100 uppercase font-bold">
            Tu Entrada al Akelarre
          </h3>
        </div>

        {/* Rendered Preview Card */}
        <div className="relative w-full max-w-[260px] sm:max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-gold/70 shadow-[0_15px_35px_rgba(0,0,0,0.95)] bg-black flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center space-y-2 text-gold">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span className="text-xs font-gothic tracking-widest uppercase">GRABANDO TU PASE SAGRADO...</span>
            </div>
          ) : imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="Pase Sagrado VIP"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <span className="text-xs text-red-400">Error al generar imagen</span>
          )}
        </div>

        {/* Success Alert once downloaded */}
        {hasDownloaded && (
          <div className="w-full p-2 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-sans flex items-center justify-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Pase guardado! Ahora puedes continuar al grupo.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={isGenerating || !imageSrc}
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full border-2 border-white font-sans font-black text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>DESCARGAR</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isGenerating || !imageSrc}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-black/70 border border-gold/50 text-gold font-sans font-bold text-xs tracking-wider uppercase hover:bg-gold/15 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>COMPARTIR</span>
          </button>
        </div>

        {/* PRIMARY UNMISTAKABLE BUTTON TO CLOSE & PROCEED TO WHATSAPP */}
        <div className="w-full pt-1">
          <button
            onClick={onClose}
            style={{ backgroundColor: '#10b981', color: '#000000' }}
            className="w-full py-3.5 px-6 rounded-2xl border-2 border-white font-sans font-black text-xs md:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✓ CONTINUAR AL GRUPO DE WHATSAPP</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
