'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COUPLES_CONFIG } from '@/config/couplesConfig';
import { AdminTeamsDataResponse } from '@/types';
import {
  Printer,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Files,
} from 'lucide-react';

interface ProcessedMember {
  name: string;
  token: string;
  gender: 'femenino' | 'masculino';
  alias: string;
  teamName: string;
  coupleNick: string;
}

interface ProcessedCouple {
  coupleIndex: number;
  id: string;
  coupleNick: string;
  chica: ProcessedMember;
  chico: ProcessedMember;
}

export default function ImprimirParejasPage() {
  const [couples, setCouples] = useState<ProcessedCouple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [currentIndex, setCurrentIndex] = useState<number>(1);

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
          alias: m1?.aliasBrujo || (c.partner1.token === 'soraya' ? 'La Gran Anfitriona' : (c.partner1.token === 'mar' ? 'La Cazadora de Almas' : (c.partner1.token === 'vir' ? 'La Invocadora' : (c.partner1.token === 'bea-sergio' ? 'La Ocultista' : 'La Hechicera')))),
          teamName: m1?.teamName || (c.partner1.token === 'soraya' ? 'Organización del Akelarre' : (c.partner1.token === 'mar' ? 'Hechiceros del Placer Oscuro' : (c.partner1.token === 'vir' ? 'Secta de la Vela Negra' : 'Secta de la Vela Negra'))),
          coupleNick: c.nickname,
        };

        const p2Data: ProcessedMember = {
          name: c.partner2.name,
          token: c.partner2.token,
          gender: c.partner2.gender,
          alias: m2?.aliasBrujo || (c.partner2.token === 'oscar' ? 'El Gran Anfitrión' : (c.partner2.token === 'fernando' ? 'El Guardián del Pacto' : (c.partner2.token === 'miky' ? 'El Hechicero' : (c.partner2.token === 'jorge-aran' ? 'El Guardián del Pacto' : 'El Nigromante')))),
          teamName: m2?.teamName || (c.partner2.token === 'oscar' ? 'Organización del Akelarre' : (c.partner2.token === 'fernando' ? 'Secta de la Vela Negra' : (c.partner2.token === 'miky' ? 'Los Pecadores del Caldero' : 'Aquelarre del Éxtasis'))),
          coupleNick: c.nickname,
        };

        const chica = c.partner1.gender === 'femenino' ? p1Data : p2Data;
        const chico = c.partner1.gender === 'masculino' ? p1Data : p2Data;

        processed.push({
          coupleIndex: i + 1,
          id: c.id,
          coupleNick: c.nickname,
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

  const prevCouple = () => {
    if (currentIndex > 1) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextCouple = () => {
    if (currentIndex < couples.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const filteredCouples =
    viewMode === 'all'
      ? couples
      : couples.filter((c) => c.coupleIndex === currentIndex);

  return (
    <div className="min-h-screen bg-[#0b0710] text-white">
      {/* Print Specific CSS Rules */}
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
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
              <span>Volver</span>
            </Link>

            <div>
              <h1 className="font-gothic font-bold text-amber-200 text-sm md:text-base uppercase tracking-wider flex items-center gap-2">
                <span>🗝️</span>
                <span>Invitaciones de Puertas (A4 Horizontal)</span>
              </h1>
              <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                {viewMode === 'single'
                  ? `Mostrando Hoja #${currentIndex} de ${couples.length} (1 pareja separada por hoja)`
                  : `Mostrando las ${couples.length} hojas A4 completas`}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Mode Switcher */}
            <div className="flex bg-white/10 p-1 rounded-lg border border-gold/40 gap-1 text-xs font-sans">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'single'
                    ? 'bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Hoja a Hoja</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'all'
                    ? 'bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Files className="w-3.5 h-3.5" />
                <span>Ver Todas</span>
              </button>
            </div>

            {/* Pagination for Single Mode */}
            {viewMode === 'single' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={prevCouple}
                  disabled={currentIndex <= 1}
                  className="p-1.5 rounded-lg border border-gold/50 bg-black/40 text-amber-200 hover:bg-[#d4af37] hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Pareja Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <select
                  value={currentIndex}
                  onChange={(e) => setCurrentIndex(Number(e.target.value))}
                  className="bg-[#08030d] border border-gold/70 text-amber-200 text-xs rounded-lg px-2.5 py-1.5 font-sans focus:outline-none cursor-pointer"
                >
                  {couples.map((c) => (
                    <option key={c.id} value={c.coupleIndex}>
                      #{c.coupleIndex}: {c.chica.name} & {c.chico.name} ({c.coupleNick})
                    </option>
                  ))}
                </select>

                <button
                  onClick={nextCouple}
                  disabled={currentIndex >= couples.length}
                  className="p-1.5 rounded-lg border border-gold/50 bg-black/40 text-amber-200 hover:bg-[#d4af37] hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Pareja Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={loadData}
              title="Recargar datos"
              className="p-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              style={{ backgroundColor: '#d4af37', color: '#070509' }}
              className="px-4 py-2 rounded-full border-2 border-white font-sans font-black text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.7)] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {viewMode === 'single'
                  ? `IMPRIMIR HOJA #${currentIndex}`
                  : `IMPRIMIR LAS ${couples.length} HOJAS`}
              </span>
            </button>

            {/* Download ZIP */}
            <a
              href="/PDFs_Copisteria_A4_Horizontal.zip"
              download
              className="px-4 py-2 rounded-full border-2 border-emerald-400 bg-emerald-700 hover:bg-emerald-600 font-sans font-bold text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 cursor-pointer text-white no-underline"
              title={`Descargar ZIP con los ${couples.length} PDFs individuales para llevar en PenDrive a la copistería`}
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>DESCARGAR {couples.length} PDFs (ZIP)</span>
            </a>
          </div>
        </div>
      </header>

      {/* PRINTABLE SHEETS CONTAINER */}
      <main className="print-container flex flex-col items-center py-8 gap-8">
        {isLoading && couples.length === 0 ? (
          <div className="p-12 text-center text-gold font-gothic text-lg flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Generando invitaciones con el cartel completo de fondo...</span>
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
                backgroundColor: '#000000',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'stretch',
                alignItems: 'stretch',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.85)',
              }}
            >
              {/* TARJETA IZQUIERDA: CHICA (CARTEL ENTERO CON INFORMACIÓN TRASLÚCIDA ABAJO) */}
              <article
                style={{
                  width: '50%',
                  height: '210mm',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  borderRight: '1px solid rgba(212, 175, 55, 0.4)',
                  flexShrink: 0,
                }}
              >
                {/* Full-Bleed Poster Art Background - 100% de la tarjeta */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('/images/akelarre_poster.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1,
                  }}
                />

                {/* Outer Gold Ornate Border */}
                <div
                  style={{
                    position: 'absolute',
                    top: '3.5mm',
                    left: '3.5mm',
                    right: '3.5mm',
                    bottom: '3.5mm',
                    border: '2px solid #d4af37',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '5mm',
                    left: '5mm',
                    right: '5mm',
                    bottom: '5mm',
                    border: '1px dashed rgba(212, 175, 55, 0.45)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Corner Gothic Runes 𝕬 */}
                <span style={{ position: 'absolute', top: '7mm', left: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', top: '7mm', right: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', bottom: '7mm', left: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', bottom: '7mm', right: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>

                {/* Lower Text Area (COMPLETAMENTE TRANSPARENTE, SIN CAJÓN NI FONDO) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '6mm',
                    right: '6mm',
                    bottom: '7mm',
                    height: '76mm',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    textAlign: 'center',
                    zIndex: 5,
                  }}
                >
                  {/* 1. Mortal Name */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '26px',
                      fontWeight: 900,
                      letterSpacing: '2.5px',
                      textTransform: 'uppercase',
                      lineHeight: 1.1,
                      color: '#ffffff',
                      textShadow: '0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000, 0 0 30px #000000',
                      marginBottom: '1mm',
                    }}
                  >
                    {c.chica.name}
                  </h2>

                  {/* 2. Nick Ficticio de la Pareja (debajo del nombre) */}
                  <div
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '15px',
                      fontWeight: 900,
                      color: '#fef08a',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000',
                      marginBottom: '1.5mm',
                    }}
                  >
                    ({c.chica.coupleNick})
                  </div>

                  {/* 3. Nick Puesto por el Oráculo */}
                  <div
                    style={{
                      fontFamily: 'var(--font-medieval), cursive',
                      fontSize: '17.5px',
                      fontStyle: 'italic',
                      color: '#fcd34d',
                      letterSpacing: '1px',
                      textShadow: '0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000',
                      marginBottom: '2mm',
                    }}
                  >
                    «{c.chica.alias}»
                  </div>

                  {/* 4. Clan Asignado */}
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(139, 0, 0, 0.88)',
                      border: '1.5px solid #d4af37',
                      borderRadius: '4px',
                      padding: '3.5px 14px',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '10.5px',
                      fontWeight: 900,
                      color: '#fef08a',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      marginBottom: '2mm',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 15px rgba(212, 175, 55, 0.4)',
                      textShadow: '0 1px 4px #000000',
                    }}
                  >
                    ✦ CLAN: {c.chica.teamName.toUpperCase()} ✦
                  </div>

                  {/* 5. Fecha */}
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#fde68a',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000',
                      marginBottom: '2mm',
                    }}
                  >
                    30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026
                  </div>

                  {/* 6. Stamped Red Wax Seal */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%)',
                      border: '2px solid #d4af37',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.95), inset 0 0 6px rgba(0,0,0,0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: '#fef08a',
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '20px',
                        fontWeight: 900,
                        lineHeight: 1,
                        textShadow: '0 0 6px rgba(0,0,0,0.8)',
                      }}
                    >
                      𝕬
                    </span>
                  </div>
                </div>
              </article>

              {/* TARJETA DERECHA: CHICO (CARTEL ENTERO CON INFORMACIÓN TRASLÚCIDA ABAJO) */}
              <article
                style={{
                  width: '50%',
                  height: '210mm',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  borderLeft: '1px solid rgba(212, 175, 55, 0.4)',
                  flexShrink: 0,
                }}
              >
                {/* Full-Bleed Poster Art Background - 100% de la tarjeta */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('/images/akelarre_poster.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1,
                  }}
                />

                {/* Outer Gold Ornate Border */}
                <div
                  style={{
                    position: 'absolute',
                    top: '3.5mm',
                    left: '3.5mm',
                    right: '3.5mm',
                    bottom: '3.5mm',
                    border: '2px solid #d4af37',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '5mm',
                    left: '5mm',
                    right: '5mm',
                    bottom: '5mm',
                    border: '1px dashed rgba(212, 175, 55, 0.45)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Corner Gothic Runes 𝕬 */}
                <span style={{ position: 'absolute', top: '7mm', left: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', top: '7mm', right: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', bottom: '7mm', left: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
                <span style={{ position: 'absolute', bottom: '7mm', right: '8mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 900, color: '#d4af37', lineHeight: 1, textShadow: '0 0 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>

                {/* Lower Text Area (COMPLETAMENTE TRANSPARENTE, SIN CAJÓN NI FONDO) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '6mm',
                    right: '6mm',
                    bottom: '7mm',
                    height: '76mm',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    textAlign: 'center',
                    zIndex: 5,
                  }}
                >
                  {/* 1. Mortal Name */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '26px',
                      fontWeight: 900,
                      letterSpacing: '2.5px',
                      textTransform: 'uppercase',
                      lineHeight: 1.1,
                      color: '#ffffff',
                      textShadow: '0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000, 0 0 30px #000000',
                      marginBottom: '1mm',
                    }}
                  >
                    {c.chico.name}
                  </h2>

                  {/* 2. Nick Ficticio de la Pareja (debajo del nombre) */}
                  <div
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '15px',
                      fontWeight: 900,
                      color: '#fef08a',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000',
                      marginBottom: '1.5mm',
                    }}
                  >
                    ({c.chico.coupleNick})
                  </div>

                  {/* 3. Nick Puesto por el Oráculo */}
                  <div
                    style={{
                      fontFamily: 'var(--font-medieval), cursive',
                      fontSize: '17.5px',
                      fontStyle: 'italic',
                      color: '#fcd34d',
                      letterSpacing: '1px',
                      textShadow: '0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000',
                      marginBottom: '2mm',
                    }}
                  >
                    «{c.chico.alias}»
                  </div>

                  {/* 4. Clan Asignado */}
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(139, 0, 0, 0.88)',
                      border: '1.5px solid #d4af37',
                      borderRadius: '4px',
                      padding: '3.5px 14px',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '10.5px',
                      fontWeight: 900,
                      color: '#fef08a',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      marginBottom: '2mm',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 15px rgba(212, 175, 55, 0.4)',
                      textShadow: '0 1px 4px #000000',
                    }}
                  >
                    ✦ CLAN: {c.chico.teamName.toUpperCase()} ✦
                  </div>

                  {/* 5. Fecha */}
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#fde68a',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000',
                      marginBottom: '2mm',
                    }}
                  >
                    30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026
                  </div>

                  {/* 6. Stamped Red Wax Seal */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%)',
                      border: '2px solid #d4af37',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.95), inset 0 0 6px rgba(0,0,0,0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: '#fef08a',
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '20px',
                        fontWeight: 900,
                        lineHeight: 1,
                        textShadow: '0 0 6px rgba(0,0,0,0.8)',
                      }}
                    >
                      𝕬
                    </span>
                  </div>
                </div>
              </article>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
