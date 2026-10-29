const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clan styling and metadata
const CLANS_MAP = {
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

async function main() {
  console.log('🔮 Generando Tarjetas de Juego Personalizadas (Tamaño Tarjeta de Crédito 85.6mm x 54mm)...');

  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const outputDir = path.join(rootDir, 'PDFs_Tarjetas_Juegos');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Read Couples Config
  const couplesConfigPath = path.join(rootDir, 'src', 'config', 'couplesConfig.ts');
  const couplesConfigContent = fs.readFileSync(couplesConfigPath, 'utf8');
  const match = couplesConfigContent.match(/export const COUPLES_CONFIG: CoupleDefinition\[\] = (\[[\s\S]*?\]);/);
  const couplesConfig = eval(match[1]);

  // 2. Fetch live data from Admin API
  let membersByToken = {};
  try {
    const res = await fetch('https://apelare-2026.vercel.app/api/admin');
    const adminData = await res.json();
    adminData.teams.forEach(t => {
      t.members.forEach(m => {
        membersByToken[m.token.toUpperCase()] = {
          ...m,
          teamName: t.name,
          teamId: t.id,
          teamIcon: t.icon,
        };
      });
    });
    console.log(`📡 Datos obtenidos de producción: ${Object.keys(membersByToken).length} miembros en clanes.`);
  } catch (e) {
    console.warn('⚠️ No se pudo consultar la API de admin, usando lista local');
  }

  // 3. Build Flat Cards List (48 cards)
  const cards = [];

  couplesConfig.forEach((c, cIdx) => {
    // Partner 1
    const m1 = membersByToken[c.partner1.token.toUpperCase()];
    const p1ClanId = m1?.teamId || (c.partner1.token === 'soraya' ? 'organizacion' : (c.partner1.token === 'mar' ? 'placer_oscuro' : (c.partner1.token === 'vir' ? 'vela_negra' : (c.partner1.token === 'bea-sergio' ? 'vela_negra' : 'akelarre_extasis'))));
    const p1Alias = m1?.aliasBrujo || (c.partner1.token === 'soraya' ? 'La Gran Anfitriona' : (c.partner1.token === 'mar' ? 'La Cazadora de Almas' : (c.partner1.token === 'vir' ? 'La Invocadora' : (c.partner1.token === 'bea-sergio' ? 'La Ocultista' : 'La Hechicera'))));
    
    cards.push({
      cardIndex: cards.length + 1,
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
    const p2ClanId = m2?.teamId || (c.partner2.token === 'oscar' ? 'organizacion' : (c.partner2.token === 'fernando' ? 'vela_negra' : (c.partner2.token === 'miky' ? 'pecadores_caldero' : (c.partner2.token === 'jorge-aran' ? 'akelarre_extasis' : 'pecadores_caldero'))));
    const p2Alias = m2?.aliasBrujo || (c.partner2.token === 'oscar' ? 'El Gran Anfitrión' : (c.partner2.token === 'fernando' ? 'El Guardián del Pacto' : (c.partner2.token === 'miky' ? 'El Hechicero' : (c.partner2.token === 'jorge-aran' ? 'El Guardián del Pacto' : 'El Nigromante'))));

    cards.push({
      cardIndex: cards.length + 1,
      coupleIndex: cIdx + 1,
      name: c.partner2.name,
      token: c.partner2.token,
      gender: c.partner2.gender,
      coupleNick: c.nickname,
      alias: p2Alias,
      clanDef: CLANS_MAP[p2ClanId] || CLANS_MAP.vela_negra,
    });
  });

  // Add 6 special wildcards to complete page 5 (44 guests + 6 comodines = 50 cards in 5 sheets of 10)
  const wildcards = [
    {
      cardIndex: 45,
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
      cardIndex: 46,
      coupleIndex: 0,
      name: 'ORÁCULO DEL DESTINO',
      token: 'wildcard-2',
      gender: 'femenino',
      coupleNick: 'COMODÍN DE JUEGO',
      alias: 'La Sombra de la Noche',
      clanDef: CLANS_MAP.vela_negra,
      isSpecial: true,
    },
    {
      cardIndex: 47,
      coupleIndex: 0,
      name: 'MAESTRO DEL CALDERO',
      token: 'wildcard-3',
      gender: 'masculino',
      coupleNick: 'COMODÍN DE JUEGO',
      alias: 'El Brujo de Fuego',
      clanDef: CLANS_MAP.pecadores_caldero,
      isSpecial: true,
    },
    {
      cardIndex: 48,
      coupleIndex: 0,
      name: 'DAMA DEL ÉXTASIS',
      token: 'wildcard-4',
      gender: 'femenino',
      coupleNick: 'COMODÍN DE JUEGO',
      alias: 'La Hechicera de Rubí',
      clanDef: CLANS_MAP.akelarre_extasis,
      isSpecial: true,
    },
    {
      cardIndex: 49,
      coupleIndex: 0,
      name: 'REY DE LA OSCURIDAD',
      token: 'wildcard-5',
      gender: 'masculino',
      coupleNick: 'COMODÍN DE JUEGO',
      alias: 'El Señor del Placer Oscuro',
      clanDef: CLANS_MAP.placer_oscuro,
      isSpecial: true,
    },
    {
      cardIndex: 50,
      coupleIndex: 0,
      name: 'COMODÍN SAGRADO',
      token: 'wildcard-6',
      gender: 'femenino',
      coupleNick: 'COMODÍN DE JUEGO',
      alias: 'La Guardiana del Secreto',
      clanDef: CLANS_MAP.organizacion,
      isSpecial: true,
    },
  ];

  const allCards = [...cards, ...wildcards];
  console.log(`🃏 Total tarjetas generadas: ${cards.length} participantes + 6 comodines = ${allCards.length} tarjetas en 5 hojas A4.`);

  // 4. Render HTML for a Single Card
  function renderSingleCard(c) {
    const padNum = c.cardIndex < 10 ? '0' + c.cardIndex : '' + c.cardIndex;
    const clan = c.clanDef;

    return `
      <div class="card-cell">
        <!-- THE CREDIT CARD (85.6mm x 54.0mm) -->
        <article class="credit-card" style="background: ${clan.cardBg}; border-color: ${clan.primaryColor}; box-shadow: 0 4px 18px rgba(0,0,0,0.9), inset 0 0 16px rgba(0,0,0,0.8), 0 0 10px ${clan.glowColor};">
          
          <!-- Outer Ornate Filigree -->
          <div class="card-filigree-border" style="border-color: ${clan.primaryColor}88;"></div>
          <div class="card-inner-dash" style="border-color: ${clan.primaryColor}44;"></div>
          
          <!-- Corner Gothic Runes -->
          <span class="rune r-tl" style="color: ${clan.primaryColor};">𝕬</span>
          <span class="rune r-tr" style="color: ${clan.primaryColor};">𝕬</span>
          <span class="rune r-bl" style="color: ${clan.primaryColor};">𝕬</span>
          <span class="rune r-br" style="color: ${clan.primaryColor};">𝕬</span>

          <!-- Watermark Crest Icon in background -->
          <div class="watermark-crest">${clan.icon}</div>

          <!-- TOP HEADER ROW -->
          <header class="card-header">
            <div class="event-brand">
              <span class="brand-title">AKELARRE 2026</span>
              <span class="brand-sub">CREDENCIAL OFICIAL DE JUEGO</span>
            </div>
            <div class="clan-pill" style="border-color: ${clan.primaryColor}; background: ${clan.badgeBg}; color: ${clan.primaryColor};">
              <span class="pill-icon">${clan.icon}</span>
              <span class="pill-name">${clan.shortName}</span>
            </div>
          </header>

          <!-- MAIN CARD BODY -->
          <div class="card-body">
            
            <!-- LEFT CHIP & EMBLEM COLUMN -->
            <div class="chip-col">
              <!-- Golden Arcane EMV Chip -->
              <div class="arcane-chip" style="border-color: ${clan.primaryColor};">
                <div class="chip-h-line"></div>
                <div class="chip-v-line"></div>
                <div class="chip-center" style="background: ${clan.primaryColor}; color: #000;">✦</div>
              </div>
              <div class="card-id-number" style="color: ${clan.primaryColor};">
                #${padNum}<span style="opacity: 0.6;">/${cards.length}</span>
              </div>
            </div>

            <!-- RIGHT DETAILS COLUMN -->
            <div class="details-col">
              
              <!-- 1. Real Mortal Name & Couple Nickname -->
              <div class="name-block">
                <h2 class="mortal-name">${c.name}</h2>
                <span class="couple-nick">(${c.coupleNick})</span>
              </div>

              <!-- 2. Oracle Witch Nickname -->
              <div class="oracle-block">
                <span class="oracle-tag">ORÁCULO:</span>
                <span class="oracle-alias" style="color: ${clan.primaryColor}; text-shadow: 0 0 8px ${clan.glowColor};">
                  «${c.alias}»
                </span>
              </div>

              <!-- 3. Clan Name Banner -->
              <div class="clan-banner-line">
                <span class="clan-bullet" style="color: ${clan.primaryColor};">✦</span>
                <span class="clan-full-name">${clan.name}</span>
              </div>

            </div>
          </div>

          <!-- BOTTOM FOOTER ROW -->
          <footer class="card-footer">
            <div class="footer-runes" style="color: ${clan.primaryColor};">✦ 𝕬 ᛉ ᚱ ᚲ 𝕬 ✦</div>
            <div class="footer-validity">30 OCT – 01 NOV 2026</div>
            <div class="wax-seal-mini" style="border-color: ${clan.primaryColor};">
              <span class="seal-letter">𝕬</span>
            </div>
          </footer>

        </article>
      </div>
    `;
  }

  // 10 cards per sheet (2 columns x 5 rows)
  const sheets = [];
  for (let i = 0; i < allCards.length; i += 10) {
    const pageIndex = Math.floor(i / 10) + 1;
    const pageCards = allCards.slice(i, i + 10);
    sheets.push({
      pageIndex,
      cards: pageCards,
    });
  }

  function generateHtmlDocument(sheetsList, isSinglePdf = false) {
    const sheetsContent = sheetsList.map(s => `
    <!-- HOJA A4 VERTICAL / PAGINA #${s.pageIndex} (10 TARJETAS) -->
    <section class="a4-sheet" id="pagina_${s.pageIndex}">
      ${!isSinglePdf ? `
      <div class="sheet-header no-print">
        <span class="sheet-badge">PÁGINA ${s.pageIndex} DE ${sheets.length}</span>
        <span class="sheet-title">Tarjetas de Juego Akelarre 2026 (Formato Tarjeta de Crédito 85.6 × 54 mm)</span>
        <span class="sheet-hint">10 tarjetas por hoja A4 lista para guillotinar / recortar</span>
      </div>` : ''}

      <div class="cards-grid">
        ${s.cards.map(renderSingleCard).join('\n')}
      </div>
    </section>
    `).join('\n\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tarjetas de Juego Personalizadas — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=MedievalSharp&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    /* A4 PAGE SETUP */
    @page {
      size: 210mm 297mm;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      background: #060309;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* TOP SCREEN TOOLBAR (HIDDEN ON PRINT) */
    .top-toolbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: rgba(13, 8, 20, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1.5px solid rgba(212, 175, 55, 0.4);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 26px;
    }

    .brand-text h1 {
      font-family: 'Cinzel', serif;
      font-size: 17px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #fef08a;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .brand-text p {
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 2px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: 'Cinzel', serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-gold {
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #000;
      box-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #fef08a 0%, #d4af37 100%);
      transform: translateY(-1px);
    }

    .btn-purple {
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      color: #fff;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }
    .btn-purple:hover {
      background: linear-gradient(135deg, #9333ea 0%, #6d28d9 100%);
      transform: translateY(-1px);
    }

    .btn-dark {
      background: rgba(255, 255, 255, 0.1);
      color: #fef08a;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-dark:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* MAIN CONTAINER */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0 60px 0;
      gap: 24px;
    }

    /* A4 SHEET (210mm x 297mm) */
    .a4-sheet {
      width: 210mm;
      height: 297mm;
      max-width: 210mm;
      max-height: 297mm;
      background: #0d0813;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(212, 175, 55, 0.3);
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8.5mm 15mm;
    }

    .sheet-header {
      width: 100%;
      max-width: 180mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2mm;
      padding-bottom: 1.5mm;
      border-bottom: 1px dashed rgba(212, 175, 55, 0.25);
    }

    .sheet-badge {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #000;
      background: #d4af37;
      padding: 2px 8px;
      border-radius: 3px;
    }

    .sheet-title {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      font-weight: 700;
      color: #fef08a;
      letter-spacing: 1px;
    }

    .sheet-hint {
      font-size: 8.5px;
      color: #94a3b8;
    }

    /* GRID: 2 COLUMNS x 5 ROWS = 10 CARDS */
    /* Exact card size: 85.6mm x 54.0mm */
    /* 2 columns * 85.6mm = 171.2mm + 6.0mm gap = 177.2mm (Page width 210mm - 177.2mm = 32.8mm / 2 = 16.4mm margin) */
    /* 5 rows * 54.0mm = 270.0mm + 4 gaps * 2.0mm = 278.0mm (Page height 297mm - 278mm = 19mm / 2 = 9.5mm margin) */
    .cards-grid {
      width: 177.2mm;
      height: 278.0mm;
      display: grid;
      grid-template-columns: 85.6mm 85.6mm;
      grid-template-rows: repeat(5, 54.0mm);
      column-gap: 6.0mm;
      row-gap: 2.0mm;
      justify-content: center;
      align-content: center;
    }

    .card-cell {
      width: 85.6mm;
      height: 54.0mm;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* THE CREDIT CARD (85.6mm x 54.0mm) */
    .credit-card {
      width: 85.6mm;
      height: 54.0mm;
      border-radius: 3.18mm; /* ISO Standard Credit Card Corner Radius */
      border: 1.2px solid #d4af37;
      position: relative;
      overflow: hidden;
      padding: 3mm 3.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #ffffff;
      user-select: none;
    }

    /* FILIGREE ORNATE BORDERS */
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

    /* CORNER RUNES */
    .rune {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 7px;
      font-weight: 900;
      line-height: 1;
      opacity: 0.75;
      z-index: 3;
      pointer-events: none;
    }
    .r-tl { top: 2.2mm; left: 2.2mm; }
    .r-tr { top: 2.2mm; right: 2.2mm; }
    .r-bl { bottom: 2.2mm; left: 2.2mm; }
    .r-br { bottom: 2.2mm; right: 2.2mm; }

    /* WATERMARK CREST */
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

    /* HEADER */
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
      font-family: 'Cinzel', serif;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 1.2px;
      color: #fef08a;
      text-shadow: 0 1px 3px #000;
    }

    .brand-sub {
      font-family: 'Inter', sans-serif;
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
      font-family: 'Cinzel', serif;
      font-size: 5.6px;
      font-weight: 900;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      box-shadow: 0 1px 4px rgba(0,0,0,0.8);
      white-space: nowrap;
    }

    .pill-icon {
      font-size: 6.5px;
      line-height: 1;
    }

    .pill-name {
      line-height: 1;
    }

    /* BODY */
    .card-body {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      gap: 3mm;
      padding: 0 1mm;
      flex: 1;
    }

    /* CHIP COLUMN */
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
      background: linear-gradient(135deg, #b45309 0%, #d97706 35%, #f59e0b 60%, #b45309 100%);
      position: relative;
      box-shadow: inset 0 0 3px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.6);
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
      background: rgba(0,0,0,0.6);
    }

    .chip-v-line {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 0.5px;
      background: rgba(0,0,0,0.6);
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
      box-shadow: 0 0 3px rgba(0,0,0,0.8);
    }

    .card-id-number {
      font-family: 'Cinzel', serif;
      font-size: 5.2px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-shadow: 0 1px 2px #000;
      white-space: nowrap;
    }

    /* DETAILS COLUMN */
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
      font-family: 'Cinzel', serif;
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
      font-family: 'Cinzel', serif;
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
      font-family: 'Inter', sans-serif;
      font-size: 5.5px;
      font-weight: 900;
      letter-spacing: 0.8px;
      color: #94a3b8;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .oracle-alias {
      font-family: 'MedievalSharp', cursive;
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
      font-family: 'Inter', sans-serif;
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

    /* FOOTER */
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
      font-family: 'Cinzel', serif;
      font-size: 5.5px;
      letter-spacing: 1.2px;
      opacity: 0.8;
      text-shadow: 0 1px 2px #000;
    }

    .footer-validity {
      font-family: 'Inter', sans-serif;
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
      background: radial-gradient(circle at 35% 35%, #dc2626 0%, #881337 70%, #450a0a 100%);
      border: 0.8px solid #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.9);
      flex-shrink: 0;
    }

    .seal-letter {
      font-family: 'Cinzel', serif;
      font-size: 3.2px;
      font-weight: 900;
      color: #fef08a;
      line-height: 1;
    }

    /* PRINT RULES */
    @media print {
      html, body {
        width: 210mm !important;
        height: 297mm !important;
        background: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .container {
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
  </style>
</head>
<body>

  ${!isSinglePdf ? `
  <!-- Top Sticky Navigation Bar -->
  <aside class="top-toolbar no-print">
    <div class="brand-group">
      <span class="brand-icon">🃏</span>
      <div class="brand-text">
        <h1>Tarjetas de Juego (Formato Tarjeta de Crédito 85.6 × 54 mm)</h1>
        <p>Akelarre 2026 · 44 Miembros + 6 Comodines · 5 Páginas A4 listas para Copistería</p>
      </div>
    </div>

    <div class="toolbar-actions">
      <a href="/" class="btn btn-dark">← Web Principal</a>
      <a href="/organizacion" class="btn btn-dark">⚙️ Organización</a>
      <a href="PDFs_Tarjetas_Juegos/00_TODAS_LAS_TARJETAS_JUEGOS_A4.pdf" download class="btn btn-purple" title="Descargar PDF Completo para Copistería">
        📥 Descargar PDF A4
      </a>
      <button onclick="window.print()" class="btn btn-gold">
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  </aside>` : ''}

  <!-- Sheets Container -->
  <main class="container">
    ${sheetsContent}
  </main>

</body>
</html>`;
  }

  // 5. Generate and Write HTML Files
  const fullHtml = generateHtmlDocument(sheets, false);
  const htmlPublicPath = path.join(publicDir, 'tarjetas_juegos_A4.html');
  const htmlRootPath = path.join(rootDir, 'tarjetas_juegos_A4.html');
  fs.writeFileSync(htmlPublicPath, fullHtml, 'utf8');
  fs.writeFileSync(htmlRootPath, fullHtml, 'utf8');
  console.log('✅ Generado public/tarjetas_juegos_A4.html y tarjetas_juegos_A4.html');

  // 6. Generate PDFs using Chrome headless
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(chromePath)) {
    console.log('🖨️ Compilando PDFs de alta resolución para copistería con Chrome headless...');
    
    // 6.1 Full 5-page PDF
    const fullPdfPath = path.join(outputDir, '00_TODAS_LAS_TARJETAS_JUEGOS_A4.pdf');
    const publicPdfPath = path.join(publicDir, 'Tarjetas_Juegos_Credenciales_A4.pdf');

    try {
      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${fullPdfPath}" --print-to-pdf-no-header "file://${htmlPublicPath}"`, { stdio: 'ignore' });
      fs.copyFileSync(fullPdfPath, publicPdfPath);
      console.log('✅ Generado 00_TODAS_LAS_TARJETAS_JUEGOS_A4.pdf (5 páginas A4 con todas las tarjetas)');
    } catch (err) {
      console.error('Error generando PDF completo:', err);
    }

    // 6.2 Individual Sheet PDFs
    for (const sheet of sheets) {
      const singleSheetHtml = generateHtmlDocument([sheet], true);
      const tempHtmlPath = path.join(outputDir, `temp_sheet_${sheet.pageIndex}.html`);
      fs.writeFileSync(tempHtmlPath, singleSheetHtml, 'utf8');

      const sheetPdfPath = path.join(outputDir, `Tarjetas_Juegos_Hoja_${sheet.pageIndex}_de_5.pdf`);
      try {
        execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${sheetPdfPath}" --print-to-pdf-no-header "file://${tempHtmlPath}"`, { stdio: 'ignore' });
        console.log(`✅ Generada Hoja #${sheet.pageIndex} PDF: Tarjetas_Juegos_Hoja_${sheet.pageIndex}_de_5.pdf`);
      } catch (err) {
        console.error(`Error generando hoja #${sheet.pageIndex}:`, err);
      } finally {
        if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
      }
    }

    // 6.3 Create ZIP package for Copistería
    const zipPath = path.join(publicDir, 'Tarjetas_Juegos_Copisteria_A4.zip');
    try {
      execSync(`cd "${outputDir}" && zip -r "${zipPath}" ./*.pdf`, { stdio: 'ignore' });
      console.log('✅ Creado paquete ZIP para copistería: public/Tarjetas_Juegos_Copisteria_A4.zip');
    } catch (err) {
      console.warn('No se pudo empaquetar el ZIP:', err);
    }

  } else {
    console.warn('Chrome no encontrado en la ruta esperada, HTML generado listo para impresión manual.');
  }

  console.log('🎉 ¡Tarjetas de Juego listas!');
}

main().catch(console.error);
