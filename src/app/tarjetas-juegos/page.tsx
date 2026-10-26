'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COUPLES_CONFIG } from '@/config/couplesConfig';
import { AdminTeamsDataResponse } from '@/types';
import {
  Printer,
  ArrowLeft,
  RefreshCw,
  Download,
  CreditCard,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';

interface ClanDef {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  cardBg: string;
  badgeBg: string;
  chipColor: string;
}

const CLANS_MAP: Record<string, ClanDef> = {
  pecadores_caldero: {
    id: 'pecadores_caldero',
    name: 'Los Pecadores del Caldero',
    shortName: 'PECADORES DEL CALDERO',
    tagline: 'Hierve la sangre, arde el deseo',
    icon: '🔥',
    primaryColor: '#f59e0b',
    secondaryColor: '#ea580c',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    cardBg: 'linear-gradient(135deg, #1c0e06 0%, #3d1605 50%, #140803 100%)',
    badgeBg: 'rgba(245, 158, 11, 0.22)',
    chipColor: '#f59e0b',
  },
  akelarre_extasis: {
    id: 'akelarre_extasis',
    name: 'Aquelarre del Éxtasis',
    shortName: 'AQUELARRE DEL ÉXTASIS',
    tagline: 'Vino rojo, placeres ocultos y sombras',
    icon: '🍷',
    primaryColor: '#fb7185',
    secondaryColor: '#e11d48',
    glowColor: 'rgba(251, 113, 133, 0.45)',
    cardBg: 'linear-gradient(135deg, #1d0711 0%, #420a22 50%, #14040b 100%)',
    badgeBg: 'rgba(251, 113, 133, 0.22)',
    chipColor: '#fb7185',
  },
  placer_oscuro: {
    id: 'placer_oscuro',
    name: 'Hechiceros del Placer Oscuro',
    shortName: 'PLACER OSCURO',
    tagline: 'Encantamientos y tentaciones de medianoche',
    icon: '🖤',
    primaryColor: '#facc15',
    secondaryColor: '#ca8a04',
    glowColor: 'rgba(250, 204, 21, 0.45)',
    cardBg: 'linear-gradient(135deg, #181305 0%, #3a2e0a 50%, #110d03 100%)',
    badgeBg: 'rgba(250, 204, 21, 0.22)',
    chipColor: '#facc15',
  },
  vela_negra: {
    id: 'vela_negra',
    name: 'Secta de la Vela Negra',
    shortName: 'SECTA DE LA VELA NEGRA',
    tagline: 'Hasta que la cera queme la última sombra',
    icon: '🕯️',
    primaryColor: '#c084fc',
    secondaryColor: '#9333ea',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    cardBg: 'linear-gradient(135deg, #130822 0%, #34104f 50%, #0d0417 100%)',
    badgeBg: 'rgba(192, 132, 252, 0.22)',
    chipColor: '#c084fc',
  },
  organizacion: {
    id: 'organizacion',
    name: 'Organización del Akelarre',
    shortName: 'ORGANIZACIÓN',
    tagline: 'Grandes Anfitriones y Maestros de Ceremonia',
    icon: '👑',
    primaryColor: '#fbbf24',
    secondaryColor: '#b91c1c',
    glowColor: 'rgba(251, 191, 36, 0.55)',
    cardBg: 'linear-gradient(135deg, #22080d 0%, #4a0d18 50%, #160408 100%)',
    badgeBg: 'rgba(251, 191, 36, 0.25)',
    chipColor: '#fbbf24',
  },
};

interface GameCardItem {
  cardIndex: number;
  coupleIndex: number;
  name: string;
  token: string;
  gender: 'femenino' | 'masculino';
  coupleNick: string;
  alias: string;
  clanDef: ClanDef;
  isSpecial?: boolean;
}

interface SheetGroup {
  pageIndex: number;
  cards: GameCardItem[];
}

export default function TarjetasJuegosPage() {
  const [cards, setCards] = useState<GameCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClan, setSelectedClan] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'a4' | 'grid'>('a4');

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

      const list: GameCardItem[] = [];

      COUPLES_CONFIG.forEach((c, cIdx) => {
        // Partner 1
        const m1 = membersByToken[c.partner1.token.toUpperCase()];
        const p1ClanId =
          m1?.teamId ||
          (c.partner1.token === 'soraya'
            ? 'organizacion'
            : c.partner1.token === 'mar'
            ? 'akelarre_extasis'
            : c.partner1.token === 'bea-sergio'
            ? 'vela_negra'
            : 'akelarre_extasis');
        const p1Alias =
          m1?.aliasBrujo ||
          (c.partner1.token === 'soraya'
            ? 'La Gran Anfitriona'
            : c.partner1.token === 'mar'
            ? 'La Cazadora de Almas'
            : c.partner1.token === 'bea-sergio'
            ? 'La Ocultista'
            : 'La Hechicera');

        list.push({
          cardIndex: list.length + 1,
          coupleIndex: cIdx + 1,
          name: c.partner1.name,
          token: c.partner1.token,
          gender: c.partner1.gender,
          coupleNick: c.nickname,
          alias: p1Alias,
          clanDef: CLANS_MAP[p1ClanId] || CLANS_MAP.akelarre_extasis,
        });

        // Partner 2
        const m2 = membersByToken[c.partner2.token.toUpperCase()];
        const p2ClanId =
          m2?.teamId ||
          (c.partner2.token === 'oscar'
            ? 'organizacion'
            : c.partner2.token === 'fernando'
            ? 'vela_negra'
            : c.partner2.token === 'jorge-aran'
            ? 'akelarre_extasis'
            : 'pecadores_caldero');
        const p2Alias =
          m2?.aliasBrujo ||
          (c.partner2.token === 'oscar'
            ? 'El Gran Anfitrión'
            : c.partner2.token === 'fernando'
            ? 'El Guardián del Pacto'
            : c.partner2.token === 'jorge-aran'
            ? 'El Guardián del Pacto'
            : 'El Nigromante');

        list.push({
          cardIndex: list.length + 1,
          coupleIndex: cIdx + 1,
          name: c.partner2.name,
          token: c.partner2.token,
          gender: c.partner2.gender,
          coupleNick: c.nickname,
          alias: p2Alias,
          clanDef: CLANS_MAP[p2ClanId] || CLANS_MAP.vela_negra,
        });
      });

      // Wildcards to complete sheet 5
      const wildcards: GameCardItem[] = [
        {
          cardIndex: 49,
          coupleIndex: 0,
          name: 'INVITADO DE HONOR',
          token: 'wildcard-1',
          gender: 'masculino',
          coupleNick: 'COMODÍN DE JUEGO',
          alias: 'El Hechicero Supremo',
          clanDef: CLANS_MAP.organizacion,
          isSpecial: true,
        },
        {
          cardIndex: 50,
          coupleIndex: 0,
          name: 'ORÁCULO DEL DESTINO',
          token: 'wildcard-2',
          gender: 'femenino',
          coupleNick: 'COMODÍN DE JUEGO',
          alias: 'La Sombra de la Noche',
          clanDef: CLANS_MAP.vela_negra,
          isSpecial: true,
        },
      ];

      setCards([...list, ...wildcards]);
    } catch (err) {
      console.error('Error cargando tarjetas:', err);
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

  const filteredCards =
    selectedClan === 'all'
      ? cards
      : cards.filter((c) => c.clanDef.id === selectedClan);

  // Group into sheets of 10 for A4 printing
  const sheets: SheetGroup[] = [];
  for (let i = 0; i < filteredCards.length; i += 10) {
    const pageIndex = Math.floor(i / 10) + 1;
    const pageCards = filteredCards.slice(i, i + 10);
    sheets.push({
      pageIndex,
      cards: pageCards,
    });
  }

  const renderCard = (c: GameCardItem) => {
    const padNum = c.cardIndex < 10 ? '0' + c.cardIndex : '' + c.cardIndex;
    const clan = c.clanDef;

    return (
      <div key={c.cardIndex} className="card-cell">
        <article
          className="credit-card"
          style={{
            background: clan.cardBg,
            borderColor: clan.primaryColor,
            boxShadow: `0 4px 18px rgba(0,0,0,0.9), inset 0 0 16px rgba(0,0,0,0.8), 0 0 10px ${clan.glowColor}`,
          }}
        >
          {/* Outer Filigree */}
          <div
            className="card-filigree-border"
            style={{ borderColor: `${clan.primaryColor}88` }}
          />
          <div
            className="card-inner-dash"
            style={{ borderColor: `${clan.primaryColor}44` }}
          />

          {/* Corner Gothic Runes */}
          <span className="rune r-tl" style={{ color: clan.primaryColor }}>
            𝕬
          </span>
          <span className="rune r-tr" style={{ color: clan.primaryColor }}>
            𝕬
          </span>
          <span className="rune r-bl" style={{ color: clan.primaryColor }}>
            𝕬
          </span>
          <span className="rune r-br" style={{ color: clan.primaryColor }}>
            𝕬
          </span>

          {/* Watermark Crest */}
          <div className="watermark-crest">{clan.icon}</div>

          {/* Top Header */}
          <header className="card-header">
            <div className="event-brand">
              <span className="brand-title">AKELARRE 2026</span>
              <span className="brand-sub">CREDENCIAL OFICIAL DE JUEGO</span>
            </div>
            <div
              className="clan-pill"
              style={{
                borderColor: clan.primaryColor,
                background: clan.badgeBg,
                color: clan.primaryColor,
              }}
            >
              <span className="pill-icon">{clan.icon}</span>
              <span className="pill-name">{clan.shortName}</span>
            </div>
          </header>

          {/* Body */}
          <div className="card-body">
            {/* Left Chip */}
            <div className="chip-col">
              <div
                className="arcane-chip"
                style={{ borderColor: clan.primaryColor }}
              >
                <div className="chip-h-line" />
                <div className="chip-v-line" />
                <div
                  className="chip-center"
                  style={{ background: clan.primaryColor, color: '#000' }}
                >
                  ✦
                </div>
              </div>
              <div className="card-id-number" style={{ color: clan.primaryColor }}>
                #{padNum}
                <span style={{ opacity: 0.6 }}>/48</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="details-col">
              {/* 1. Real Mortal Name & Couple Nick */}
              <div className="name-block">
                <h2 className="mortal-name">{c.name}</h2>
                <span className="couple-nick">({c.coupleNick})</span>
              </div>

              {/* 2. Oracle Witch Nick */}
              <div className="oracle-block">
                <span className="oracle-tag">ORÁCULO:</span>
                <span
                  className="oracle-alias"
                  style={{
                    color: clan.primaryColor,
                    textShadow: `0 0 8px ${clan.glowColor}`,
                  }}
                >
                  «{c.alias}»
                </span>
              </div>

              {/* 3. Clan Name */}
              <div className="clan-banner-line">
                <span className="clan-bullet" style={{ color: clan.primaryColor }}>
                  ✦
                </span>
                <span className="clan-full-name">{clan.name}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="card-footer">
            <div className="footer-runes" style={{ color: clan.primaryColor }}>
              ✦ 𝕬 ᛉ ᚱ ᚲ 𝕬 ✦
            </div>
            <div className="footer-validity">30 OCT – 01 NOV 2026</div>
            <div className="wax-seal-mini" style={{ borderColor: clan.primaryColor }}>
              <span className="seal-letter">𝕬</span>
            </div>
          </footer>
        </article>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#060309] text-white">
      {/* Global & Print CSS */}
      <style jsx global>{`
        @page {
          size: 210mm 297mm;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
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
          .a4-sheet {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 9.5mm 16.4mm !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
          }
        }

        .a4-sheet {
          width: 210mm;
          height: 297mm;
          max-width: 210mm;
          max-height: 297mm;
          background: #0d0813;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 175, 55, 0.3);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8.5mm 15mm;
        }

        .sheet-header-bar {
          width: 100%;
          max-width: 177.2mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2mm;
          padding-bottom: 1.5mm;
          border-bottom: 1px dashed rgba(212, 175, 55, 0.25);
        }

        /* 2 COLUMNS x 5 ROWS = 10 CARDS */
        .cards-grid {
          width: 177.2mm;
          height: 278mm;
          display: grid;
          grid-template-columns: 85.6mm 85.6mm;
          grid-template-rows: repeat(5, 54mm);
          column-gap: 6mm;
          row-gap: 2mm;
          justify-content: center;
          align-content: center;
        }

        .card-cell {
          width: 85.6mm;
          height: 54mm;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* CREDIT CARD (85.6mm x 54.0mm) */
        .credit-card {
          width: 85.6mm;
          height: 54mm;
          border-radius: 3.18mm;
          border: 1.2px solid #d4af37;
          position: relative;
          overflow: hidden;
          padding: 3mm 3.5mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
          user-select: none;
          box-sizing: border-box;
        }

        .card-filigree-border {
          position: absolute;
          top: 1.2mm;
          left: 1.2mm;
          right: 1.2mm;
          bottom: 1.2mm;
          border: 0.8px solid rgba(212, 175, 55, 0.5);
          border-radius: 2.2mm;
          pointer-events: none;
          z-index: 2;
        }

        .card-inner-dash {
          position: absolute;
          top: 1.8mm;
          left: 1.8mm;
          right: 1.8mm;
          bottom: 1.8mm;
          border: 0.5px dashed rgba(212, 175, 55, 0.3);
          border-radius: 1.6mm;
          pointer-events: none;
          z-index: 2;
        }

        .rune {
          position: absolute;
          font-family: var(--font-cinzel), serif;
          font-size: 7px;
          font-weight: 900;
          line-height: 1;
          opacity: 0.75;
          z-index: 3;
          pointer-events: none;
        }
        .r-tl {
          top: 2.2mm;
          left: 2.2mm;
        }
        .r-tr {
          top: 2.2mm;
          right: 2.2mm;
        }
        .r-bl {
          bottom: 2.2mm;
          left: 2.2mm;
        }
        .r-br {
          bottom: 2.2mm;
          right: 2.2mm;
        }

        .watermark-crest {
          position: absolute;
          right: 3mm;
          top: 50%;
          transform: translateY(-50%);
          font-size: 34mm;
          line-height: 1;
          opacity: 0.08;
          pointer-events: none;
          z-index: 1;
          filter: blur(0.5px);
        }

        .card-header {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          padding: 0 1mm;
          height: 7.5mm;
        }

        .event-brand {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .brand-title {
          font-family: var(--font-cinzel), serif;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.2px;
          color: #fef08a;
          text-shadow: 0 1px 3px #000;
        }

        .brand-sub {
          font-family: var(--font-inter), sans-serif;
          font-size: 4.8px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #cbd5e1;
          text-transform: uppercase;
          text-shadow: 0 1px 2px #000;
        }

        .clan-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          border: 0.8px solid;
          border-radius: 3px;
          padding: 1.2px 4px;
          font-family: var(--font-cinzel), serif;
          font-size: 5.6px;
          font-weight: 900;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
        }

        .pill-icon {
          font-size: 6.5px;
          line-height: 1;
        }

        .pill-name {
          line-height: 1;
        }

        .card-body {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 3mm;
          padding: 0 1mm;
          flex: 1;
        }

        .chip-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5mm;
          width: 14mm;
          flex-shrink: 0;
        }

        .arcane-chip {
          width: 12mm;
          height: 9.5mm;
          border-radius: 1.8mm;
          border: 0.9px solid #d4af37;
          background: linear-gradient(
            135deg,
            #b45309 0%,
            #d97706 35%,
            #f59e0b 60%,
            #b45309 100%
          );
          position: relative;
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.8), 0 2px 5px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chip-h-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 0.5px;
          background: rgba(0, 0, 0, 0.6);
        }

        .chip-v-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 0.5px;
          background: rgba(0, 0, 0, 0.6);
        }

        .chip-center {
          position: relative;
          z-index: 2;
          width: 3.8mm;
          height: 3.8mm;
          border-radius: 50%;
          font-size: 5px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
        }

        .card-id-number {
          font-family: var(--font-cinzel), serif;
          font-size: 5.2px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-shadow: 0 1px 2px #000;
          white-space: nowrap;
        }

        .details-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.2mm;
          min-width: 0;
        }

        .name-block {
          display: flex;
          align-items: baseline;
          gap: 4px;
          flex-wrap: wrap;
          line-height: 1.1;
        }

        .mortal-name {
          font-family: var(--font-cinzel), serif;
          font-size: 13.5px;
          font-weight: 900;
          letter-spacing: 1.2px;
          color: #ffffff;
          text-transform: uppercase;
          text-shadow: 0 2px 4px #000, 0 0 8px #000;
          margin: 0;
          padding: 0;
        }

        .couple-nick {
          font-family: var(--font-cinzel), serif;
          font-size: 8.5px;
          font-weight: 800;
          color: #fde68a;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-shadow: 0 1px 3px #000;
        }

        .oracle-block {
          display: flex;
          align-items: baseline;
          gap: 3px;
          line-height: 1.15;
        }

        .oracle-tag {
          font-family: var(--font-inter), sans-serif;
          font-size: 5.5px;
          font-weight: 900;
          letter-spacing: 0.8px;
          color: #94a3b8;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .oracle-alias {
          font-family: var(--font-medieval), cursive;
          font-size: 10.5px;
          font-style: italic;
          font-weight: 700;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .clan-banner-line {
          display: flex;
          align-items: center;
          gap: 3px;
          line-height: 1;
        }

        .clan-bullet {
          font-size: 6px;
          line-height: 1;
        }

        .clan-full-name {
          font-family: var(--font-inter), sans-serif;
          font-size: 6.8px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #e2e8f0;
          text-transform: uppercase;
          text-shadow: 0 1px 2px #000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1mm;
          height: 5.5mm;
          border-top: 0.5px solid rgba(255, 255, 255, 0.12);
        }

        .footer-runes {
          font-family: var(--font-cinzel), serif;
          font-size: 5.5px;
          letter-spacing: 1.2px;
          opacity: 0.8;
          text-shadow: 0 1px 2px #000;
        }

        .footer-validity {
          font-family: var(--font-inter), sans-serif;
          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #cbd5e1;
          text-shadow: 0 1px 2px #000;
        }

        .wax-seal-mini {
          width: 4.8mm;
          height: 4.8mm;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 35%,
            #dc2626 0%,
            #881337 70%,
            #450a0a 100%
          );
          border: 0.8px solid #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          flex-shrink: 0;
        }

        .seal-letter {
          font-family: var(--font-cinzel), serif;
          font-size: 3.2px;
          font-weight: 900;
          color: #fef08a;
          line-height: 1;
        }
      `}</style>

      {/* Top Navbar (Hidden on print) */}
      <header className="sticky top-0 z-50 bg-[#0d0814]/95 backdrop-blur-md border-b border-gold/40 px-4 py-3 shadow-2xl no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/organizacion"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gold border border-gold/30 transition-colors"
              title="Volver a Organización"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-gothic text-lg sm:text-xl font-bold tracking-wider text-amber-200 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                TARJETAS DE JUEGO (CRÉDITO 85.6 × 54 MM)
              </h1>
              <p className="text-xs text-slate-400">
                Nombre Real · Nick Pareja · Alias Oráculo · Clan · Formato A4
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>Actualizar</span>
            </button>

            <a
              href="/Tarjetas_Juegos_Credenciales_A4.pdf"
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 text-xs font-semibold border border-purple-500/40 shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF A4</span>
            </a>

            <a
              href="/Tarjetas_Juegos_Copisteria_A4.zip"
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 text-xs font-semibold border border-gold/40 shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5 text-gold" />
              <span>ZIP Copistería</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-black font-gothic font-bold text-xs tracking-wider shadow-lg shadow-gold/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR A4</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-gold" />
              Filtrar:
            </span>
            <button
              onClick={() => setSelectedClan('all')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                selectedClan === 'all'
                  ? 'bg-gold text-black shadow'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Todos ({cards.length})
            </button>
            {Object.values(CLANS_MAP).map((clan) => (
              <button
                key={clan.id}
                onClick={() => setSelectedClan(clan.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                  selectedClan === clan.id
                    ? 'bg-white/20 text-white shadow ring-1 ring-gold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                style={{
                  color: selectedClan === clan.id ? clan.primaryColor : undefined,
                }}
              >
                <span>{clan.icon}</span>
                <span>{clan.shortName}</span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Mostrando {filteredCards.length} tarjetas en {sheets.length} hoja(s) A4
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="print-container flex flex-col items-center py-6 gap-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-gold animate-spin" />
            <p className="text-sm font-gothic tracking-wider text-amber-200">
              Convocando credenciales sagradas del Akelarre...
            </p>
          </div>
        ) : (
          sheets.map((sheet) => (
            <section
              key={sheet.pageIndex}
              className="a4-sheet"
              id={`pagina_${sheet.pageIndex}`}
            >
              <div className="sheet-header-bar no-print">
                <span className="bg-gold text-black text-[10px] font-bold font-gothic px-2 py-0.5 rounded">
                  PÁGINA {sheet.pageIndex} DE {sheets.length}
                </span>
                <span className="text-[10px] font-gothic text-amber-200 font-bold">
                  AKELARRE 2026 · TARJETAS DE JUEGO (85.6 × 54 MM)
                </span>
                <span className="text-[9px] text-slate-400">
                  {sheet.cards.length} tarjetas por hoja
                </span>
              </div>

              <div className="cards-grid">{sheet.cards.map(renderCard)}</div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
