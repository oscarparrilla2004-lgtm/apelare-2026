'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { COUPLES_CONFIG } from '@/config/couplesConfig';
import { AdminTeamsDataResponse } from '@/types';
import {
  Printer,
  ArrowLeft,
  Moon,
  Sun,
  Filter,
  Sparkles,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface ProcessedMember {
  name: string;
  token: string;
  gender: 'femenino' | 'masculino';
  alias: string;
  teamName: string;
  teamIcon: string;
  teamTagline: string;
  qrDataUrl: string;
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
  const [isParchmentMode, setIsParchmentMode] = useState(false);
  const [selectedCoupleId, setSelectedCoupleId] = useState<string>('all');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

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
            teamTagline: t.tagline,
          };
        });
      });

      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://apelare-2026.vercel.app';

      const processed: ProcessedCouple[] = [];

      for (let i = 0; i < COUPLES_CONFIG.length; i++) {
        const c = COUPLES_CONFIG[i];
        const m1 = membersByToken[c.partner1.token.toUpperCase()];
        const m2 = membersByToken[c.partner2.token.toUpperCase()];

        let p1Data: ProcessedMember = {
          name: c.partner1.name,
          token: c.partner1.token,
          gender: c.partner1.gender,
          alias: m1?.aliasBrujo || (c.partner1.token === 'soraya' ? 'La Gran Anfitriona' : 'La Ocultista'),
          teamName: m1?.teamName || (c.partner1.token === 'soraya' ? 'Organización del Akelarre' : 'Secta de la Vela Negra'),
          teamIcon: m1?.teamIcon || (c.partner1.token === 'soraya' ? '🗝️' : '🕯️'),
          teamTagline: m1?.teamTagline || (c.partner1.token === 'soraya' ? 'Poder y gobierno del Akelarre' : 'Hasta que la cera queme la última sombra'),
          qrDataUrl: '',
        };

        let p2Data: ProcessedMember = {
          name: c.partner2.name,
          token: c.partner2.token,
          gender: c.partner2.gender,
          alias: m2?.aliasBrujo || (c.partner2.token === 'oscar' ? 'El Gran Anfitrión' : 'El Guardián del Pacto'),
          teamName: m2?.teamName || (c.partner2.token === 'oscar' ? 'Organización del Akelarre' : 'Aquelarre del Éxtasis'),
          teamIcon: m2?.teamIcon || (c.partner2.token === 'oscar' ? '🗝️' : '🍷'),
          teamTagline: m2?.teamTagline || (c.partner2.token === 'oscar' ? 'Poder y gobierno del Akelarre' : 'Vino rojo, placeres ocultos y sombras'),
          qrDataUrl: '',
        };

        const chica = c.partner1.gender === 'femenino' ? p1Data : p2Data;
        const chico = c.partner1.gender === 'masculino' ? p1Data : p2Data;

        // Generate QRs
        const linkChica = `${currentOrigin}/llave/${chica.token}`;
        const linkChico = `${currentOrigin}/llave/${chico.token}`;

        chica.qrDataUrl = await QRCode.toDataURL(linkChica, {
          width: 140,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });

        chico.qrDataUrl = await QRCode.toDataURL(linkChico, {
          width: 140,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });

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
    <div className={`min-h-screen ${isParchmentMode ? 'parchment-theme' : 'dark-theme'}`}>
      {/* Dynamic Styling according to Theme & Print rules */}
      <style jsx global>{`
        :root {
          --bg-page: #070509;
          --bg-card: #0f0a15;
          --bg-card-gradient: radial-gradient(circle at 50% 20%, #200f24 0%, #0d0714 70%, #050208 100%);
          --text-main: #ffffff;
          --text-muted: #e2d9cc;
          --gold-primary: #d4af37;
          --gold-light: #fef08a;
          --border-gold: #d4af37;
          --border-inner: rgba(212, 175, 55, 0.4);
          --box-clan-bg: rgba(0, 0, 0, 0.6);
          --box-details-bg: rgba(0, 0, 0, 0.4);
          --wax-red: #8b0000;
          --sheet-header-bg: rgba(0, 0, 0, 0.75);
          --divider-color: rgba(212, 175, 55, 0.35);
        }

        .parchment-theme {
          --bg-page: #fbf7ee;
          --bg-card: #f5eedb;
          --bg-card-gradient: linear-gradient(135deg, #fffcf5 0%, #f4ebd6 100%);
          --text-main: #1c140c;
          --text-muted: #4a3828;
          --gold-primary: #8a6a1b;
          --gold-light: #684f11;
          --border-gold: #8a6a1b;
          --border-inner: rgba(138, 106, 27, 0.4);
          --box-clan-bg: rgba(255, 255, 255, 0.7);
          --box-details-bg: rgba(255, 255, 255, 0.6);
          --wax-red: #851313;
          --sheet-header-bg: #ece2c8;
          --divider-color: rgba(138, 106, 27, 0.4);
        }

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
      <header className="no-print sticky top-0 z-50 bg-[#11091a]/95 backdrop-blur-md border-b-2 border-gold px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
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
                <span>Tarjetas de Habitación por Parejas (A4 Horizontal)</span>
              </h1>
              <p className="text-[11px] text-white/60 font-sans hidden sm:block">
                Chica (Izquierda) & Chico (Derecha) listos para colocar en las puertas de las habitaciones
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

            {/* Toggle Ink-saver Parchment Mode */}
            <button
              onClick={() => setIsParchmentMode(!isParchmentMode)}
              className="px-3 py-2 rounded-lg border border-gold/40 bg-white/5 hover:bg-gold/15 text-gold text-xs font-sans flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isParchmentMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isParchmentMode ? 'Modo Noche' : 'Modo Ahorro Tinta'}</span>
            </button>

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
            <span>Preparando sellos sagrados y tarjetas de habitación...</span>
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
                backgroundColor: 'var(--bg-page)',
                padding: '7mm 9mm',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              }}
            >
              {/* Sheet Top Bar */}
              <div
                style={{
                  height: '11mm',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1.5px solid var(--border-gold)',
                  backgroundColor: 'var(--sheet-header-bg)',
                  borderRadius: '6px',
                  padding: '0 14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🕯️</span>
                  <span>AKELARRE DE BRUJAS 2026</span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    fontSize: '13.5px',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  HABITACIÓN · PAREJA #{c.coupleIndex}:{' '}
                  <span style={{ color: 'var(--gold-primary)' }}>{c.chica.name}</span> &{' '}
                  <span style={{ color: 'var(--gold-primary)' }}>{c.chico.name}</span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>ACCESO PRIVADO</span>
                  <span>🗝️</span>
                </div>
              </div>

              {/* Cards Row (Left = Chica, Right = Chico) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  gap: '6mm',
                  height: '182mm',
                  width: '100%',
                  position: 'relative',
                }}
              >
                {/* Center Cut Divider */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: 0,
                    borderLeft: '1.5px dashed var(--divider-color)',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'var(--bg-page)',
                      color: 'var(--gold-primary)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-gold)',
                    }}
                  >
                    ✂
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'var(--bg-page)',
                      color: 'var(--gold-primary)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-gold)',
                    }}
                  >
                    ✦
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'var(--bg-page)',
                      color: 'var(--gold-primary)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-gold)',
                    }}
                  >
                    ✂
                  </span>
                </div>

                {/* TARJETA IZQUIERDA: CHICA (BRUJA) */}
                <article
                  style={{
                    width: '136mm',
                    height: '182mm',
                    backgroundColor: 'var(--bg-card)',
                    backgroundImage: 'var(--bg-card-gradient)',
                    border: '2.5px solid var(--border-gold)',
                    borderRadius: '10px',
                    padding: '7mm 7mm 5mm 7mm',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Inner Inset Dashed Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '3mm',
                      left: '3mm',
                      right: '3mm',
                      bottom: '3mm',
                      border: '1px dashed var(--border-inner)',
                      borderRadius: '7px',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Corner Runes */}
                  <span style={{ position: 'absolute', top: '4.5mm', left: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>𝕬</span>
                  <span style={{ position: 'absolute', top: '4.5mm', right: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '4.5mm', left: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '4.5mm', right: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>✦</span>

                  {/* Role Badge */}
                  <div
                    style={{
                      alignSelf: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-gold)',
                      background: 'rgba(0,0,0,0.4)',
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--gold-light)',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      zIndex: 2,
                    }}
                  >
                    <span>🌙</span>
                    <span>INVITACIÓN SAGRADA · BRUJA</span>
                  </div>

                  {/* Mortal Name & Witch Alias */}
                  <div style={{ textAlign: 'center', margin: '3px 0', zIndex: 2 }}>
                    <h2
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '26px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--gold-light)',
                        lineHeight: 1.1,
                      }}
                    >
                      {c.chica.name}
                    </h2>
                    <span
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '17px',
                        color: 'var(--gold-primary)',
                        marginTop: '3px',
                        letterSpacing: '1px',
                        display: 'block',
                        fontWeight: 'bold',
                      }}
                    >
                      «{c.chica.alias}»
                    </span>
                  </div>

                  {/* Clan Box */}
                  <div
                    style={{
                      background: 'var(--box-clan-bg)',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      textAlign: 'center',
                      margin: '3px 0',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--gold-light)',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{c.chica.teamIcon}</span>
                      <span>CLAN: {c.chica.teamName}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{c.chica.teamTagline}&rdquo;
                    </div>
                  </div>

                  {/* Conclave Details Box */}
                  <div
                    style={{
                      background: 'var(--box-details-bg)',
                      border: '1px solid var(--border-inner)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      margin: '3px 0',
                      fontSize: '10px',
                      lineHeight: '1.45',
                      color: 'var(--text-muted)',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>🏰</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Mansión del Akelarre</strong> · Habitación Privada
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>📅</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>30 Octubre – 1 Noviembre 2026</strong>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>🌙</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Viernes Noche:</strong> Fiesta Dress Code Sexy
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🎭</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Sábado Noche:</strong> Gran Akelarre Brujas & Brujos
                      </span>
                    </div>
                  </div>

                  {/* Footer with Wax Seal + QR */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginTop: '4px',
                      paddingTop: '5px',
                      borderTop: '1px solid var(--border-inner)',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background:
                            'radial-gradient(circle at 35% 35%, #b91c1c 0%, var(--wax-red) 70%, #450a0a 100%)',
                          border: '2px solid var(--border-gold)',
                          boxShadow: '0 0 10px rgba(185, 28, 28, 0.6), inset 0 0 6px rgba(0,0,0,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--gold-light)',
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '22px',
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        𝕬
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '8.5px',
                          lineHeight: '1.25',
                          color: 'var(--gold-primary)',
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        SELLO OFICIAL
                        <br />
                        AKELARRE 2026
                        <br />
                        PACTO SELLADO
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#ffffff',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--border-gold)',
                      }}
                    >
                      {c.chica.qrDataUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={c.chica.qrDataUrl}
                          alt={`QR ${c.chica.name}`}
                          style={{ width: '44px', height: '44px', display: 'block' }}
                        />
                      )}
                      <div style={{ textAlign: 'left' }}>
                        <span
                          style={{
                            fontSize: '7.5px',
                            fontWeight: 800,
                            color: '#713f12',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                          }}
                        >
                          ESCANEA TU LLAVE
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-cinzel), serif',
                            fontSize: '9px',
                            fontWeight: 900,
                            color: '#000000',
                            display: 'block',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {c.chica.token.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* TARJETA DERECHA: CHICO (BRUJO) */}
                <article
                  style={{
                    width: '136mm',
                    height: '182mm',
                    backgroundColor: 'var(--bg-card)',
                    backgroundImage: 'var(--bg-card-gradient)',
                    border: '2.5px solid var(--border-gold)',
                    borderRadius: '10px',
                    padding: '7mm 7mm 5mm 7mm',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Inner Inset Dashed Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '3mm',
                      left: '3mm',
                      right: '3mm',
                      bottom: '3mm',
                      border: '1px dashed var(--border-inner)',
                      borderRadius: '7px',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Corner Runes */}
                  <span style={{ position: 'absolute', top: '4.5mm', left: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>𝕬</span>
                  <span style={{ position: 'absolute', top: '4.5mm', right: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>𝕬</span>
                  <span style={{ position: 'absolute', bottom: '4.5mm', left: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '4.5mm', right: '4.5mm', fontFamily: 'var(--font-cinzel), serif', fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)', pointerEvents: 'none' }}>✦</span>

                  {/* Role Badge */}
                  <div
                    style={{
                      alignSelf: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-gold)',
                      background: 'rgba(0,0,0,0.4)',
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--gold-light)',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      zIndex: 2,
                    }}
                  >
                    <span>⚡</span>
                    <span>INVITACIÓN SAGRADA · BRUJO</span>
                  </div>

                  {/* Mortal Name & Warlock Alias */}
                  <div style={{ textAlign: 'center', margin: '3px 0', zIndex: 2 }}>
                    <h2
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '26px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--gold-light)',
                        lineHeight: 1.1,
                      }}
                    >
                      {c.chico.name}
                    </h2>
                    <span
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '17px',
                        color: 'var(--gold-primary)',
                        marginTop: '3px',
                        letterSpacing: '1px',
                        display: 'block',
                        fontWeight: 'bold',
                      }}
                    >
                      «{c.chico.alias}»
                    </span>
                  </div>

                  {/* Clan Box */}
                  <div
                    style={{
                      background: 'var(--box-clan-bg)',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      textAlign: 'center',
                      margin: '3px 0',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--gold-light)',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{c.chico.teamIcon}</span>
                      <span>CLAN: {c.chico.teamName}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-medieval), cursive',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{c.chico.teamTagline}&rdquo;
                    </div>
                  </div>

                  {/* Conclave Details Box */}
                  <div
                    style={{
                      background: 'var(--box-details-bg)',
                      border: '1px solid var(--border-inner)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      margin: '3px 0',
                      fontSize: '10px',
                      lineHeight: '1.45',
                      color: 'var(--text-muted)',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>🏰</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Mansión del Akelarre</strong> · Habitación Privada
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>📅</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>30 Octubre – 1 Noviembre 2026</strong>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span>🌙</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Viernes Noche:</strong> Fiesta Dress Code Sexy
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🎭</span>
                      <span>
                        <strong style={{ color: 'var(--gold-light)' }}>Sábado Noche:</strong> Gran Akelarre Brujas & Brujos
                      </span>
                    </div>
                  </div>

                  {/* Footer with Wax Seal + QR */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginTop: '4px',
                      paddingTop: '5px',
                      borderTop: '1px solid var(--border-inner)',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background:
                            'radial-gradient(circle at 35% 35%, #b91c1c 0%, var(--wax-red) 70%, #450a0a 100%)',
                          border: '2px solid var(--border-gold)',
                          boxShadow: '0 0 10px rgba(185, 28, 28, 0.6), inset 0 0 6px rgba(0,0,0,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--gold-light)',
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '22px',
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        𝕬
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-cinzel), serif',
                          fontSize: '8.5px',
                          lineHeight: '1.25',
                          color: 'var(--gold-primary)',
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        SELLO OFICIAL
                        <br />
                        AKELARRE 2026
                        <br />
                        PACTO SELLADO
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#ffffff',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--border-gold)',
                      }}
                    >
                      {c.chico.qrDataUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={c.chico.qrDataUrl}
                          alt={`QR ${c.chico.name}`}
                          style={{ width: '44px', height: '44px', display: 'block' }}
                        />
                      )}
                      <div style={{ textAlign: 'left' }}>
                        <span
                          style={{
                            fontSize: '7.5px',
                            fontWeight: 800,
                            color: '#713f12',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                          }}
                        >
                          ESCANEA TU LLAVE
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-cinzel), serif',
                            fontSize: '9px',
                            fontWeight: 900,
                            color: '#000000',
                            display: 'block',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {c.chico.token.toUpperCase()}
                        </span>
                      </div>
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
