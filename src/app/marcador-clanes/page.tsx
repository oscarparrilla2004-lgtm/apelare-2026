'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
  Download,
  Trophy,
  ArrowLeftRight,
} from 'lucide-react';

interface PruebaDef {
  num: number;
  name: string;
  icon: string;
  desc: string;
}

interface ClanDef {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  cardBg: string;
  badgeBg: string;
  members: string;
}

export default function MarcadorClanesPage() {
  const [clansPosition, setClansPosition] = useState<'right' | 'left'>('right');

  const pruebas: PruebaDef[] = [
    { num: 1, name: 'PRUEBA 1', icon: '🎯', desc: 'Puntería / Diana' },
    { num: 2, name: 'PRUEBA 2', icon: '🧪', desc: 'Poción Secreta' },
    { num: 3, name: 'PRUEBA 3', icon: '🎲', desc: 'Dados del Azar' },
    { num: 4, name: 'PRUEBA 4', icon: '🔮', desc: 'Visión Oráculo' },
    { num: 5, name: 'PRUEBA 5', icon: '🎭', desc: 'Mímica / Máscara' },
    { num: 6, name: 'PRUEBA 6', icon: '⚡', desc: 'Duelo de Reflejos' },
    { num: 7, name: 'PRUEBA 7', icon: '🕸️', desc: 'Enredo / Trampas' },
    { num: 8, name: 'PRUEBA 8', icon: '💀', desc: 'Trivia Siniestra' },
    { num: 9, name: 'PRUEBA 9', icon: '🎃', desc: 'Reto de Brujas' },
    { num: 10, name: 'PRUEBA 10', icon: '⚔️', desc: 'Gran Desafío' },
  ];

  const clanes: ClanDef[] = [
    {
      id: 'pecadores_caldero',
      name: 'Los Pecadores del Caldero',
      tagline: 'Hierve la sangre, arde el deseo',
      icon: '🔥',
      primaryColor: '#f59e0b',
      accentColor: '#ea580c',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      cardBg: 'linear-gradient(135deg, rgba(124, 45, 18, 0.95) 0%, rgba(69, 26, 3, 0.95) 50%, rgba(20, 7, 0, 0.98) 100%)',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      members: '11 Brujos & Hechiceros',
    },
    {
      id: 'akelarre_extasis',
      name: 'Aquelarre del Éxtasis',
      tagline: 'Vino rojo, placeres ocultos y sombras',
      icon: '🍷',
      primaryColor: '#f43f5e',
      accentColor: '#be123c',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      cardBg: 'linear-gradient(135deg, rgba(136, 19, 55, 0.95) 0%, rgba(76, 5, 25, 0.95) 50%, rgba(25, 2, 8, 0.98) 100%)',
      badgeBg: 'rgba(244, 63, 94, 0.15)',
      members: '11 Brujos & Hechiceros',
    },
    {
      id: 'placer_oscuro',
      name: 'Hechiceros del Placer Oscuro',
      tagline: 'Encantamientos y tentaciones de medianoche',
      icon: '🖤',
      primaryColor: '#facc15',
      accentColor: '#ca8a04',
      glowColor: 'rgba(250, 204, 21, 0.45)',
      cardBg: 'linear-gradient(135deg, rgba(113, 63, 18, 0.95) 0%, rgba(58, 33, 5, 0.95) 50%, rgba(20, 11, 2, 0.98) 100%)',
      badgeBg: 'rgba(250, 204, 21, 0.15)',
      members: '11 Brujos & Hechiceros',
    },
    {
      id: 'vela_negra',
      name: 'Secta de la Vela Negra',
      tagline: 'Hasta que la cera queme la última sombra',
      icon: '🕯️',
      primaryColor: '#c084fc',
      accentColor: '#9333ea',
      glowColor: 'rgba(192, 132, 252, 0.45)',
      cardBg: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(46, 16, 101, 0.95) 50%, rgba(18, 6, 42, 0.98) 100%)',
      badgeBg: 'rgba(192, 132, 252, 0.15)',
      members: '11 Brujos & Hechiceros',
    },
  ];

  const isRight = clansPosition === 'right';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#07030b] text-white flex flex-col items-center">
      {/* Print Specific CSS Rules */}
      <style jsx global>{`
        @page {
          size: A3 landscape;
          margin: 0;
        }

        @media print {
          html, body {
            width: 420mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #09050e !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }

          .a3-sheet-container {
            width: 420mm !important;
            height: 297mm !important;
            max-width: 420mm !important;
            max-height: 297mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 6mm 8mm !important;
          }
        }
      `}</style>

      {/* TOP CONTROLS BAR (Hidden in print) */}
      <header className="no-print sticky top-0 z-50 w-full bg-[#0a060f]/95 backdrop-blur-md border-b-2 border-gold px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
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
                <span>🏆</span>
                <span>Tablero de Puntuaciones de Clanes (A3 Horizontal)</span>
              </h1>
              <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                Tabla de 4 Clanes × 10 Pruebas con casillas en blanco para anotar la puntuación en vivo
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Toggle Position Button */}
            <button
              onClick={() => setClansPosition(isRight ? 'left' : 'right')}
              className="px-3 py-2 rounded-lg border border-gold/50 bg-black/60 hover:bg-white/10 text-amber-200 text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isRight ? 'Poner Clanes a la Izquierda' : 'Poner Clanes a la Derecha'}</span>
            </button>

            {/* Download PDF A3 */}
            <a
              href="/marcador_clanes_A3.pdf"
              download
              className="px-4 py-2 rounded-full border-2 border-purple-400 bg-purple-900 hover:bg-purple-800 font-sans font-bold text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center gap-1.5 cursor-pointer text-white no-underline"
              title="Descargar archivo PDF A3 listo para llevar en PenDrive a la copistería"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>DESCARGAR PDF A3</span>
            </a>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              style={{ backgroundColor: '#d4af37', color: '#070509' }}
              className="px-4 py-2 rounded-full border-2 border-white font-sans font-black text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>IMPRIMIR A3 HORIZONTAL</span>
            </button>
          </div>
        </div>
      </header>

      {/* A3 SHEET CONTAINER (EXACT 420mm x 297mm) */}
      <div className="w-full overflow-x-auto py-8 flex justify-center">
        <section
          className="a3-sheet-container"
          style={{
            width: '420mm',
            height: '297mm',
            minWidth: '420mm',
            minHeight: '297mm',
            maxWidth: '420mm',
            maxHeight: '297mm',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 15%, #230f2d 0%, #100617 50%, #060209 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '6mm 8mm',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.95)',
          }}
        >
          {/* Outer Gold Ornate Borders */}
          <div
            style={{
              position: 'absolute',
              top: '3.5mm',
              left: '3.5mm',
              right: '3.5mm',
              bottom: '3.5mm',
              border: '2.5px solid #d4af37',
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

          {/* Corner Runes */}
          <span style={{ position: 'absolute', top: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '16px', fontWeight: 900, color: '#d4af37', textShadow: '0 0 10px rgba(212, 175, 55, 0.8)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
          <span style={{ position: 'absolute', top: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '16px', fontWeight: 900, color: '#d4af37', textShadow: '0 0 10px rgba(212, 175, 55, 0.8)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
          <span style={{ position: 'absolute', bottom: '6.5mm', left: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '16px', fontWeight: 900, color: '#d4af37', textShadow: '0 0 10px rgba(212, 175, 55, 0.8)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>
          <span style={{ position: 'absolute', bottom: '6.5mm', right: '7.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '16px', fontWeight: 900, color: '#d4af37', textShadow: '0 0 10px rgba(212, 175, 55, 0.8)', pointerEvents: 'none', zIndex: 11 }}>𝕬</span>

          {/* HEADER */}
          <header style={{ textAlign: 'center', position: 'relative', marginBottom: '2mm', zIndex: 5 }}>
            <div
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '4px',
                color: '#fde68a',
                textTransform: 'uppercase',
                textShadow: '0 0 8px rgba(253, 230, 138, 0.6)',
                marginBottom: '1mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <span>✦</span>
              <span>TORNEO DE BRUJOS Y HECHICEROS</span>
              <span>•</span>
              <span>AKELARRE 2026</span>
              <span>✦</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '26px' }}>⚔️</span>
              <h1
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '27px',
                  fontWeight: 900,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#fef08a',
                  textShadow: '0 2px 10px #000000, 0 0 25px rgba(212, 175, 55, 0.6)',
                  lineHeight: 1.1,
                }}
              >
                TABLERO DE PUNTUACIONES DE LOS CLANES
              </h1>
              <span style={{ fontSize: '26px' }}>⚔️</span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-medieval), cursive',
                fontSize: '13.5px',
                fontStyle: 'italic',
                color: '#fbcfe8',
                letterSpacing: '1px',
                textShadow: '0 1px 6px rgba(0,0,0,0.9)',
                marginTop: '1mm',
              }}
            >
              «Diez pruebas malditas decidirán el destino. Que hiervan los calderos y arda la noche: ¡apunta la gloria de tu clan!»
            </p>
          </header>

          {/* TABLE CONTAINER */}
          <main style={{ flex: 1, display: 'flex', alignItems: 'stretch', zIndex: 5, margin: '1mm 0 3mm 0' }}>
            <table
              style={{
                width: '100%',
                height: '100%',
                borderCollapse: 'separate',
                borderSpacing: '4.5px 5.5px',
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr>
                  {!isRight && (
                    <th
                      style={{
                        width: '118mm',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid #d4af37',
                        borderRadius: '6px',
                        padding: '3px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '14px', lineHeight: 1.1 }}>⚔️</div>
                      <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '9.5px', fontWeight: 800, color: '#fef08a', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.1, marginTop: '1px' }}>
                        CLAN DEL AKELARRE
                      </div>
                    </th>
                  )}

                  {pruebas.map((p) => (
                    <th
                      key={p.num}
                      style={{
                        width: '25.5mm',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1.5px solid rgba(212, 175, 55, 0.4)',
                        borderRadius: '6px',
                        padding: '3px 2px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '14px', lineHeight: 1.1 }}>{p.icon}</div>
                      <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '9.5px', fontWeight: 800, color: '#fef08a', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.1, marginTop: '1px' }}>
                        {p.name}
                      </div>
                    </th>
                  ))}

                  <th
                    style={{
                      width: '32mm',
                      background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.25) 0%, rgba(139, 0, 0, 0.3) 100%)',
                      border: '2px solid #d4af37',
                      borderRadius: '6px',
                      padding: '3px 2px',
                      textAlign: 'center',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <div style={{ fontSize: '14px', lineHeight: 1.1 }}>👑</div>
                    <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '9.5px', fontWeight: 800, color: '#fef08a', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.1, marginTop: '1px' }}>
                      TOTAL
                    </div>
                  </th>

                  {isRight && (
                    <th
                      style={{
                        width: '118mm',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid #d4af37',
                        borderRadius: '6px',
                        padding: '3px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '14px', lineHeight: 1.1 }}>⚔️</div>
                      <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '9.5px', fontWeight: 800, color: '#fef08a', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.1, marginTop: '1px' }}>
                        CLAN DEL AKELARRE
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {clanes.map((clan) => {
                  const scoreCells = pruebas.map((p) => (
                    <td key={p.num} style={{ padding: 0, height: '48mm' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#ffffff',
                          border: `2.5px solid ${clan.primaryColor}`,
                          borderRadius: '7px',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.06), 0 3px 8px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            right: '4px',
                            fontFamily: 'var(--font-inter), sans-serif',
                            fontSize: '9px',
                            fontWeight: 800,
                            color: '#9ca3af',
                            pointerEvents: 'none',
                            lineHeight: 1,
                          }}
                        >
                          #{p.num}
                        </span>
                        <span style={{ position: 'absolute', top: '3px', left: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: clan.primaryColor, pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', top: '3px', right: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: clan.primaryColor, pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', bottom: '3px', left: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: clan.primaryColor, pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', bottom: '3px', right: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: clan.primaryColor, pointerEvents: 'none' }} />
                      </div>
                    </td>
                  ));

                  const totalCell = (
                    <td key="total" style={{ padding: 0, height: '48mm' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#fffbeb',
                          border: '3px solid #d4af37',
                          borderRadius: '7px',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.2)',
                        }}
                      >
                        <span style={{ fontSize: '26px', opacity: 0.18, pointerEvents: 'none' }}>🏆</span>
                        <span style={{ position: 'absolute', top: '3px', left: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d4af37', pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', top: '3px', right: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d4af37', pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', bottom: '3px', left: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d4af37', pointerEvents: 'none' }} />
                        <span style={{ position: 'absolute', bottom: '3px', right: '3px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d4af37', pointerEvents: 'none' }} />
                      </div>
                    </td>
                  );

                  const clanCard = (
                    <td key="clan" style={{ padding: 0, height: '48mm' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: clan.cardBg,
                          border: `2.5px solid ${clan.primaryColor}`,
                          borderRadius: '8px',
                          padding: '4mm 5mm',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: `0 0 15px ${clan.glowColor}`,
                        }}
                      >
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            border: `2px solid ${clan.primaryColor}`,
                            background: clan.badgeBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.8)',
                          }}
                        >
                          <span style={{ fontSize: '24px', lineHeight: 1 }}>{clan.icon}</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', overflow: 'hidden' }}>
                          <h2
                            style={{
                              fontFamily: 'var(--font-cinzel), serif',
                              fontSize: '15px',
                              fontWeight: 900,
                              letterSpacing: '1.5px',
                              lineHeight: 1.15,
                              color: clan.primaryColor,
                              textShadow: `0 0 12px ${clan.glowColor}`,
                              marginBottom: '1.5px',
                            }}
                          >
                            {clan.name.toUpperCase()}
                          </h2>
                          <p
                            style={{
                              fontFamily: 'var(--font-medieval), cursive',
                              fontSize: '11px',
                              fontStyle: 'italic',
                              color: '#e5e7eb',
                              lineHeight: 1.1,
                              marginBottom: '3px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            «{clan.tagline}»
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                fontFamily: 'var(--font-inter), sans-serif',
                                fontSize: '9px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: `1px solid ${clan.primaryColor}`,
                                borderRadius: '4px',
                                padding: '1px 7px',
                                color: clan.primaryColor,
                                lineHeight: 1.2,
                              }}
                            >
                              ✦ {clan.members} ✦
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );

                  return (
                    <tr key={clan.id}>
                      {isRight ? (
                        <>
                          {scoreCells}
                          {totalCell}
                          {clanCard}
                        </>
                      ) : (
                        <>
                          {clanCard}
                          {scoreCells}
                          {totalCell}
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </main>

          {/* FOOTER / PODIUM */}
          <footer
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1.5px solid rgba(212, 175, 55, 0.4)',
              paddingTop: '2.5mm',
              zIndex: 5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#fef08a',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🏆</span>
                <span>PODIO FINAL DEL AKELARRE:</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '6px',
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#fef08a',
                  }}
                >
                  <span>🥇 1º CLAN CAMPEÓN:</span>
                  <span style={{ display: 'inline-block', width: '45mm', borderBottom: '1.5px dotted #d4af37' }} />
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '6px',
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  <span>🥈 2º PUESTO:</span>
                  <span style={{ display: 'inline-block', width: '35mm', borderBottom: '1.5px dotted #a1a1aa' }} />
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '6px',
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  <span>🥉 3º PUESTO:</span>
                  <span style={{ display: 'inline-block', width: '35mm', borderBottom: '1.5px dotted #ca8a04' }} />
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '6px',
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  <span>💀 4º CASTIGO:</span>
                  <span style={{ display: 'inline-block', width: '35mm', borderBottom: '1.5px dotted #ef4444' }} />
                </div>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '10px', fontWeight: 800, color: '#d4af37', letterSpacing: '1.5px', textTransform: 'uppercase', textAlign: 'right' }}>
              <div>30 OCTUBRE - 1 NOVIEMBRE 2026</div>
              <div style={{ fontSize: '8.5px', color: '#a1a1aa', fontFamily: 'var(--font-inter), sans-serif' }}>FINCA DEL AKELARRE • EDICIÓN SAGRADA</div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
