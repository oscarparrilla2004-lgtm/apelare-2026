'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COUPLES_CONFIG } from '@/config/couplesConfig';
import { AdminTeamsDataResponse } from '@/types';
import {
  Printer,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

interface ProcessedMember {
  name: string;
  token: string;
  gender: 'femenino' | 'masculino';
  alias: string;
  teamName: string;
  teamIcon: string;
}

interface ProcessedCouple {
  coupleIndex: number;
  id: string;
  chica: ProcessedMember;
  chico: ProcessedMember;
}

export default function ImprimirParejasPage() {
  const [couples, setCouples] = useState<ProcessedCouple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoupleId, setSelectedCoupleId] = useState<string>('all');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin', { cache: 'no-store' });
      const adminData: AdminTeamsDataResponse = await res.json();

      const membersByToken: Record<string, any> = {};
      adminData.teams.forEach((t) => {
        t.members.forEach((m) => {
          membersByToken[m.token.toUpperCase()] = {
            ...m,
            teamName: t.name,
            teamId: t.id,
            teamIcon: t.icon,
          };
        });
      });

      const processed: ProcessedCouple[] = [];

      for (let i = 0; i < COUPLES_CONFIG.length; i++) {
        const c = COUPLES_CONFIG[i];
        const m1 = membersByToken[c.partner1.token.toUpperCase()];
        const m2 = membersByToken[c.partner2.token.toUpperCase()];

        const p1Data: ProcessedMember = {
          name: c.partner1.name,
          token: c.partner1.token,
          gender: c.partner1.gender,
          alias: m1?.aliasBrujo || (c.partner1.token === 'soraya' ? 'La Gran Anfitriona' : 'La Ocultista'),
          teamName: m1?.teamName || (c.partner1.token === 'soraya' ? 'Organización del Akelarre' : 'Secta de la Vela Negra'),
          teamIcon: m1?.teamIcon || (c.partner1.token === 'soraya' ? '🗝️' : '🕯️'),
        };

        const p2Data: ProcessedMember = {
          name: c.partner2.name,
          token: c.partner2.token,
          gender: c.partner2.gender,
          alias: m2?.aliasBrujo || (c.partner2.token === 'oscar' ? 'El Gran Anfitrión' : 'El Guardián del Pacto'),
          teamName: m2?.teamName || (c.partner2.token === 'oscar' ? 'Organización del Akelarre' : 'Aquelarre del Éxtasis'),
          teamIcon: m2?.teamIcon || (c.partner2.token === 'oscar' ? '🗝️' : '🍷'),
        };

        const chica = c.partner1.gender === 'femenino' ? p1Data : p2Data;
        const chico = c.partner1.gender === 'masculino' ? p1Data : p2Data;

        processed.push({
          coupleIndex: i + 1,
          id: c.id,
          chica,
          chico,
        });
      }

      setCouples(processed);
    } catch (err) {
      console.error('Error loading couples data for print:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrint = () => {
    window.print();
  };

  const filteredCouples =
    selectedCoupleId === 'all'
      ? couples
      : couples.filter((c) => c.id === selectedCoupleId || `pareja_${c.coupleIndex}` === selectedCoupleId);

  return (
    <div className="min-h-screen bg-[#120e18] text-white">
      {/* Print Specific CSS Rules */}
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          body {
            background: transparent !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            padding: 0 !important;
            gap: 0 !important;
          }

          .door-sheet {
            box-shadow: none !important;
            margin: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      `}</style>

      {/* TOP CONTROLS BAR (Hidden in print) */}
      <header className="no-print sticky top-0 z-50 bg-[#0a060f]/95 backdrop-blur-md border-b-2 border-gold px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/organizacion"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Organización</span>
            </Link>

            <div>
              <h1 className="font-gothic font-bold text-amber-200 text-sm md:text-base uppercase tracking-wider flex items-center gap-2">
                <span>🗝️</span>
                <span>Pases VIP de Habitación por Parejas (A4 Horizontal)</span>
              </h1>
              <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                Cartel oficial de la invitación + Nombre + Apodo + Clan + Sello de Lacre (Chica izquierda, Chico derecha)
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Filter */}
            <div className="relative">
              <select
                value={selectedCoupleId}
                onChange={(e) => setSelectedCoupleId(e.target.value)}
                className="bg-[#08030d] border border-gold/70 text-amber-200 text-xs rounded-lg px-3 py-2 pr-8 font-sans focus:outline-none cursor-pointer"
              >
                <option value="all">Todas las Parejas ({couples.length} Puertas)</option>
                {couples.map((c) => (
                  <option key={c.id} value={c.id}>
                    Puerta #{c.coupleIndex}: {c.chica.name} & {c.chico.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              title="Recargar datos"
              className="p-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              style={{ backgroundColor: '#d4af37', color: '#070509' }}
              className="px-5 py-2 rounded-full border-2 border-white font-sans font-black text-xs md:text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>IMPRIMIR A4 HORIZONTAL</span>
            </button>
          </div>
        </div>
      </header>

      {/* PRINTABLE SHEETS CONTAINER */}
      <main className="print-container flex flex-col items-center py-8 gap-8">
        {isLoading && couples.length === 0 ? (
          <div className="p-12 text-center text-gold font-gothic text-lg flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Generando pases sagrados con el cartel oficial...</span>
          </div>
        ) : (
          filteredCouples.map((c) => (
            <section
              key={c.id}
              id={`pareja_${c.coupleIndex}`}
              className="door-sheet"
              style={{
                width: '297mm',
                height: '210mm',
                maxWidth: '297mm',
                maxHeight: '210mm',
                backgroundColor: '#07040a',
                padding: '5mm 10mm',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
              }}
            >
              {/* Sheet Minimal Room Tag Header */}
              <div
                style={{
                  height: '6mm',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                  color: '#d4af37',
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <span style={{ fontWeight: 700, color: '#a1a1aa' }}>
                  PUERTA DE HABITACIÓN · PAREJA #{c.coupleIndex}
                </span>
                <span style={{ fontWeight: 900, color: '#fef08a', letterSpacing: '2px' }}>
                  {c.chica.name.toUpperCase()} &amp; {c.chico.name.toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: 'rgba(212, 175, 55, 0.6)' }}>
                  AKELARRE 2026
                </span>
              </div>

              {/* Cards Pair Row (9:16 Aspect Ratio Identical to Downloaded Pass) */}
              <div
                style={{
                  height: '191mm',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16mm',
                  position: 'relative',
                }}
              >
                {/* TARJETA IZQUIERDA: CHICA (INVITACIÓN IDENTICA AL PASE DESCARGADO) */}
                <article
                  style={{
                    width: '107.5mm',
                    height: '191mm',
                    position: 'relative',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#07040a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                    flexShrink: 0,
                  }}
                >
                  {/* Poster Art Background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '118mm',
                      backgroundImage: `url('/images/akelarre_poster.jpg')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'top center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />

                  {/* Smooth Gradient Transition */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '102mm',
                      left: 0,
                      width: '100%',
                      height: '18mm',
                      background:
                        'linear-gradient(to bottom, rgba(7, 4, 10, 0) 0%, rgba(7, 4, 10, 0.85) 50%, rgba(7, 4, 10, 1) 100%)',
                      zIndex: 2,
                    }}
                  />

                  {/* Dark Solid Bottom Base */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '118mm',
                      left: 0,
                      width: '100%',
                      height: '73mm',
                      backgroundColor: '#07040a',
                      zIndex: 2,
                    }}
                  />

                  {/* Outer Gold Ornate Border */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '3mm',
                      left: '3mm',
                      right: '3mm',
                      bottom: '3mm',
                      border: '2px solid #d4af37',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '4.8mm',
                      left: '4.8mm',
                      right: '4.8mm',
                      bottom: '4.8mm',
                      border: '1px dashed rgba(212, 175, 55, 0.4)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />

                  {/* Corner Gothic Runes 𝕬 */}
                  <span style={{ position: 'absolute', top: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', top: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>

                  {/* Lower Gothic Parchment Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '120mm',
                      left: '7mm',
                      right: '7mm',
                      bottom: '7mm',
                      border: '1px solid rgba(212, 175, 55, 0.55)',
                      borderRadius: '4px',
                      padding: '5mm 4mm',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                      zIndex: 5,
                    }}
                  >
                    <span style={{ position: 'absolute', top: '1.5mm', left: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', top: '1.5mm', right: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', bottom: '1.5mm', left: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', bottom: '1.5mm', right: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>

                    {/* Header */}
                    <div
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#f3e5ab',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginTop: '1mm',
                      }}
                    >
                      ✦ PASE SAGRADO DEL AKELARRE ✦
                    </div>

                    {/* Mortal Name */}
                    <h2
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '21px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to bottom, #fffbe6 0%, #d4af37 50%, #aa8214 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginTop: '1.5mm',
                      }}
                    >
                      {c.chica.name}
                    </h2>

                    {/* Witch Nickname */}
                    <div
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '14.5px',
                        fontStyle: 'italic',
                        color: '#fcd34d',
                        letterSpacing: '1px',
                        marginTop: '1mm',
                      }}
                    >
                      «{c.chica.alias}»
                    </div>

                    {/* Clan Badge */}
                    <div
                      style={{
                        display: 'inline-block',
                        background: 'rgba(139, 0, 0, 0.65)',
                        border: '1.5px solid #d4af37',
                        borderRadius: '3px',
                        padding: '3px 10px',
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        color: '#fef08a',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginTop: '2mm',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.25)',
                      }}
                    >
                      ✦ CLAN: {c.chica.teamName.toUpperCase()} ✦
                    </div>

                    {/* Stamped Red Wax Seal */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%)',
                        border: '2px solid #d4af37',
                        boxShadow: '0 0 12px rgba(185, 28, 28, 0.7), inset 0 0 6px rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2.5mm',
                        marginBottom: '1mm',
                      }}
                    >
                      <span
                        style={{
                          color: '#fef08a',
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '19px',
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        𝕬
                      </span>
                    </div>
                  </div>
                </article>

                {/* Vertical Cut Guide Divider */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '185mm',
                    color: 'rgba(212, 175, 55, 0.35)',
                    fontSize: '12px',
                    borderLeft: '1px dashed rgba(212, 175, 55, 0.3)',
                    padding: '6px 0',
                  }}
                >
                  <span>✂</span>
                  <span>✦</span>
                  <span>✂</span>
                </div>

                {/* TARJETA DERECHA: CHICO (INVITACIÓN IDENTICA AL PASE DESCARGADO) */}
                <article
                  style={{
                    width: '107.5mm',
                    height: '191mm',
                    position: 'relative',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#07040a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                    flexShrink: 0,
                  }}
                >
                  {/* Poster Art Background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '118mm',
                      backgroundImage: `url('/images/akelarre_poster.jpg')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'top center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />

                  {/* Smooth Gradient Transition */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '102mm',
                      left: 0,
                      width: '100%',
                      height: '18mm',
                      background:
                        'linear-gradient(to bottom, rgba(7, 4, 10, 0) 0%, rgba(7, 4, 10, 0.85) 50%, rgba(7, 4, 10, 1) 100%)',
                      zIndex: 2,
                    }}
                  />

                  {/* Dark Solid Bottom Base */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '118mm',
                      left: 0,
                      width: '100%',
                      height: '73mm',
                      backgroundColor: '#07040a',
                      zIndex: 2,
                    }}
                  />

                  {/* Outer Gold Ornate Border */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '3mm',
                      left: '3mm',
                      right: '3mm',
                      bottom: '3mm',
                      border: '2px solid #d4af37',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '4.8mm',
                      left: '4.8mm',
                      right: '4.8mm',
                      bottom: '4.8mm',
                      border: '1px dashed rgba(212, 175, 55, 0.4)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />

                  {/* Corner Gothic Runes 𝕬 */}
                  <span style={{ position: 'absolute', top: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', top: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '14px', fontWeight: 900, color: '#d4af37', lineHeight: 1, pointerEvents: 'none', zIndex: 11 }}>𝕬</span>

                  {/* Lower Gothic Parchment Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '120mm',
                      left: '7mm',
                      right: '7mm',
                      bottom: '7mm',
                      border: '1px solid rgba(212, 175, 55, 0.55)',
                      borderRadius: '4px',
                      padding: '5mm 4mm',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                      zIndex: 5,
                    }}
                  >
                    <span style={{ position: 'absolute', top: '1.5mm', left: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', top: '1.5mm', right: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', bottom: '1.5mm', left: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>
                    <span style={{ position: 'absolute', bottom: '1.5mm', right: '2mm', fontSize: '11px', color: '#d4af37', lineHeight: 1, pointerEvents: 'none' }}>✦</span>

                    {/* Header */}
                    <div
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        color: '#f3e5ab',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginTop: '1mm',
                      }}
                    >
                      ✦ PASE SAGRADO DEL AKELARRE ✦
                    </div>

                    {/* Mortal Name */}
                    <h2
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '21px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to bottom, #fffbe6 0%, #d4af37 50%, #aa8214 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginTop: '1.5mm',
                      }}
                    >
                      {c.chico.name}
                    </h2>

                    {/* Warlock Nickname */}
                    <div
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '14.5px',
                        fontStyle: 'italic',
                        color: '#fcd34d',
                        letterSpacing: '1px',
                        marginTop: '1mm',
                      }}
                    >
                      «{c.chico.alias}»
                    </div>

                    {/* Clan Badge */}
                    <div
                      style={{
                        display: 'inline-block',
                        background: 'rgba(139, 0, 0, 0.65)',
                        border: '1.5px solid #d4af37',
                        borderRadius: '3px',
                        padding: '3px 10px',
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        color: '#fef08a',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginTop: '2mm',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.25)',
                      }}
                    >
                      ✦ CLAN: {c.chico.teamName.toUpperCase()} ✦
                    </div>

                    {/* Stamped Red Wax Seal */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%)',
                        border: '2px solid #d4af37',
                        boxShadow: '0 0 12px rgba(185, 28, 28, 0.7), inset 0 0 6px rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2.5mm',
                        marginBottom: '1mm',
                      }}
                    >
                      <span
                        style={{
                          color: '#fef08a',
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '19px',
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        𝕬
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
