const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function sanitizeFilename(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9_\-\(\)\s]/g, '') // remove unsupported chars
    .trim()
    .replace(/\s+/g, '_');
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

async function main() {
  const couplesConfigPath = path.join(__dirname, '..', 'src', 'config', 'couplesConfig.ts');
  const couplesConfigContent = fs.readFileSync(couplesConfigPath, 'utf8');
  const match = couplesConfigContent.match(/export const COUPLES_CONFIG: CoupleDefinition\[\] = (\[[\s\S]*?\]);/);
  const couplesConfig = eval(match[1]);

  const posterPath = path.join(__dirname, '..', 'public', 'images', 'akelarre_poster.jpg');
  const posterB64 = 'data:image/jpeg;base64,' + fs.readFileSync(posterPath).toString('base64');

  // Fetch live team assignments from admin API
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
  } catch (e) {
    console.warn('Could not fetch admin API, using fallback member assignments');
  }

  const couples = couplesConfig.map((c, i) => {
    const m1 = membersByToken[c.partner1.token.toUpperCase()];
    const m2 = membersByToken[c.partner2.token.toUpperCase()];

    const p1 = {
      name: c.partner1.name,
      token: c.partner1.token,
      gender: c.partner1.gender,
      alias: m1?.aliasBrujo || (c.partner1.token === 'soraya' ? 'La Gran Anfitriona' : (c.partner1.token === 'mar' ? 'La Cazadora de Almas' : (c.partner1.token === 'vir' ? 'La Invocadora' : (c.partner1.token === 'bea-sergio' ? 'La Ocultista' : 'La Hechicera')))),
      teamName: m1?.teamName || (c.partner1.token === 'soraya' ? 'Organización del Akelarre' : (c.partner1.token === 'mar' ? 'Aquelarre del Éxtasis' : (c.partner1.token === 'vir' ? 'Secta de la Vela Negra' : 'Secta de la Vela Negra'))),
      coupleNick: c.nickname,
    };

    const p2 = {
      name: c.partner2.name,
      token: c.partner2.token,
      gender: c.partner2.gender,
      alias: m2?.aliasBrujo || (c.partner2.token === 'oscar' ? 'El Gran Anfitrión' : (c.partner2.token === 'fernando' ? 'El Guardián del Pacto' : (c.partner2.token === 'miky' ? 'El Hechicero' : (c.partner2.token === 'jorge-aran' ? 'El Guardián del Pacto' : 'El Nigromante')))),
      teamName: m2?.teamName || (c.partner2.token === 'oscar' ? 'Organización del Akelarre' : (c.partner2.token === 'fernando' ? 'Secta de la Vela Negra' : (c.partner2.token === 'miky' ? 'Los Pecadores del Caldero' : 'Aquelarre del Éxtasis'))),
      coupleNick: c.nickname,
    };

    const chica = c.partner1.gender === 'femenino' ? p1 : p2;
    const chico = c.partner1.gender === 'masculino' ? p1 : p2;

    return {
      coupleIndex: i + 1,
      id: c.id,
      coupleNick: c.nickname,
      chica,
      chico,
    };
  });

  const optionsHtml = couples.map(c => 
    `<option value="pareja_${c.coupleIndex}">Pareja #${c.coupleIndex}: ${c.chica.name} & ${c.chico.name} (${c.coupleNick})</option>`
  ).join('\n        ');

  function renderSheet(c) {
    return `
    <!-- HOJA A4 HORIZONTAL PAREJA #${c.coupleIndex} (CARTEL COMPLETO LIMPIO SIN CAJÓN) -->
    <section class="door-sheet" id="pareja_${c.coupleIndex}">
      
      <!-- TARJETA IZQUIERDA: CHICA (CARTEL 100% LIMPIO, TEXTO DIRECTO SOBRE EL CARTEL) -->
      <article class="pass-half pass-half-left">
        <!-- Full-Bleed Poster Art Background (Occupy 100% of card) -->
        <div class="pass-full-poster" style="background-image: url('${posterB64}');"></div>

        <!-- Outer Gold Ornate Border -->
        <div class="pass-outer-border"></div>
        <div class="pass-inner-dashed"></div>

        <!-- Corner Gothic Runes -->
        <span class="corner-rune cr-tl">𝕬</span>
        <span class="corner-rune cr-tr">𝕬</span>
        <span class="corner-rune cr-bl">𝕬</span>
        <span class="corner-rune cr-br">𝕬</span>

        <!-- Lower Text Area (COMPLETAMENTE TRANSPARENTE, SIN CAJÓN NI FONDO) -->
        <div class="pass-lower-text-area">
          <!-- 1. Mortal Name -->
          <h1 class="pass-mortal-name">${c.chica.name}</h1>

          <!-- 2. Nick Ficticio de la Pareja (debajo del nombre) -->
          <div class="pass-couple-nick">(${c.chica.coupleNick})</div>

          <!-- 3. Nick Puesto por el Oráculo -->
          <div class="pass-witch-alias">«${c.chica.alias}»</div>

          <!-- 4. Clan Asignado -->
          <div class="pass-clan-badge">
            ✦ CLAN: ${c.chica.teamName.toUpperCase()} ✦
          </div>

          <!-- 5. Fecha Oficial -->
          <div class="pass-date-line">
            30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026
          </div>

          <!-- 6. Stamped Red Wax Seal -->
          <div class="pass-wax-seal">
            <span class="seal-rune">𝕬</span>
          </div>
        </div>
      </article>

      <!-- TARJETA DERECHA: CHICO (CARTEL 100% LIMPIO, TEXTO DIRECTO SOBRE EL CARTEL) -->
      <article class="pass-half pass-half-right">
        <!-- Full-Bleed Poster Art Background (Occupy 100% of card) -->
        <div class="pass-full-poster" style="background-image: url('${posterB64}');"></div>

        <!-- Outer Gold Ornate Border -->
        <div class="pass-outer-border"></div>
        <div class="pass-inner-dashed"></div>

        <!-- Corner Gothic Runes -->
        <span class="corner-rune cr-tl">𝕬</span>
        <span class="corner-rune cr-tr">𝕬</span>
        <span class="corner-rune cr-bl">𝕬</span>
        <span class="corner-rune cr-br">𝕬</span>

        <!-- Lower Text Area (COMPLETAMENTE TRANSPARENTE, SIN CAJÓN NI FONDO) -->
        <div class="pass-lower-text-area">
          <!-- 1. Mortal Name -->
          <h1 class="pass-mortal-name">${c.chico.name}</h1>

          <!-- 2. Nick Ficticio de la Pareja (debajo del nombre) -->
          <div class="pass-couple-nick">(${c.chico.coupleNick})</div>

          <!-- 3. Nick Puesto por el Oráculo -->
          <div class="pass-witch-alias">«${c.chico.alias}»</div>

          <!-- 4. Clan Asignado -->
          <div class="pass-clan-badge">
            ✦ CLAN: ${c.chico.teamName.toUpperCase()} ✦
          </div>

          <!-- 5. Fecha Oficial -->
          <div class="pass-date-line">
            30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026
          </div>

          <!-- 6. Stamped Red Wax Seal -->
          <div class="pass-wax-seal">
            <span class="seal-rune">𝕬</span>
          </div>
        </div>
      </article>

    </section>`;
  }

  const sheetsHtml = couples.map(c => renderSheet(c)).join('\n');

  // Shared CSS for cards
  const sharedCardsCss = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* A4 Landscape Sheet (297mm x 210mm) - EXACTO, OCUPA TODO, SIN ESPACIOS */
    .door-sheet {
      width: 297mm;
      height: 210mm;
      max-width: 297mm;
      max-height: 210mm;
      background: #000000;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      align-items: stretch;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.85);
      page-break-after: always;
      break-after: page;
    }

    /* Cada Mitad del A4 (148.5mm x 210mm) */
    .pass-half {
      width: 50%;
      height: 210mm;
      position: relative;
      overflow: hidden;
      background-color: #000000;
      flex-shrink: 0;
    }

    .pass-half-left {
      border-right: 1px solid rgba(212, 175, 55, 0.4);
    }

    .pass-half-right {
      border-left: 1px solid rgba(212, 175, 55, 0.4);
    }

    /* Full-Bleed Poster Background - CARTEL 100% VISIBLE SIN NINGÚN CAJÓN QUE LO TAPE */
    .pass-full-poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      z-index: 1;
    }

    /* Outer Gold Ornate Border */
    .pass-outer-border {
      position: absolute;
      top: 3.5mm;
      left: 3.5mm;
      right: 3.5mm;
      bottom: 3.5mm;
      border: 2px solid #d4af37;
      pointer-events: none;
      z-index: 10;
    }

    /* Inner Dashed Decorative Border */
    .pass-inner-dashed {
      position: absolute;
      top: 5mm;
      left: 5mm;
      right: 5mm;
      bottom: 5mm;
      border: 1px dashed rgba(212, 175, 55, 0.45);
      pointer-events: none;
      z-index: 10;
    }

    /* Corner Runes 𝕬 */
    .corner-rune {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 900;
      color: #d4af37;
      line-height: 1;
      text-shadow: 0 0 8px rgba(0,0,0,0.95);
      pointer-events: none;
      z-index: 11;
    }
    .cr-tl { top: 7mm; left: 8mm; }
    .cr-tr { top: 7mm; right: 8mm; }
    .cr-bl { bottom: 7mm; left: 8mm; }
    .cr-br { bottom: 7mm; right: 8mm; }

    /* Lower Text Area - TOTALMENTE TRANSPARENTE, SIN CAJÓN, SIN BORDES, NADA TAPA EL CARTEL */
    .pass-lower-text-area {
      position: absolute;
      left: 6mm;
      right: 6mm;
      bottom: 7mm;
      height: 76mm;
      background: none !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      text-align: center;
      z-index: 5;
    }

    /* 1. Mortal Name */
    .pass-mortal-name {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      line-height: 1.1;
      color: #ffffff;
      text-shadow: 0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000, 0 0 30px #000000;
      margin-bottom: 1mm;
    }

    /* 2. Nick Ficticio de Pareja (debajo del nombre) */
    .pass-couple-nick {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 900;
      color: #fef08a;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000;
      margin-bottom: 1.5mm;
    }

    /* 3. Nick Puesto por el Oráculo */
    .pass-witch-alias {
      font-family: 'MedievalSharp', cursive;
      font-size: 17.5px;
      font-style: italic;
      color: #fcd34d;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px #000000, 0 0 8px #000000, 0 0 15px #000000, 0 0 25px #000000;
      margin-bottom: 2mm;
    }

    /* 4. Clan Badge */
    .pass-clan-badge {
      display: inline-block;
      background: rgba(139, 0, 0, 0.88);
      border: 1.5px solid #d4af37;
      border-radius: 4px;
      padding: 3.5px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 10.5px;
      font-weight: 900;
      color: #fef08a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 2mm;
      box-shadow: 0 2px 12px rgba(0,0,0,0.9), 0 0 15px rgba(212, 175, 55, 0.4);
      text-shadow: 0 1px 4px #000000;
    }

    /* 5. Fecha */
    .pass-date-line {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 800;
      color: #fde68a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-shadow: 0 2px 4px #000000, 0 0 10px #000000, 0 0 20px #000000;
      margin-bottom: 2mm;
    }

    /* 6. Stamped Red Wax Seal */
    .pass-wax-seal {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%);
      border: 2px solid #d4af37;
      box-shadow: 0 4px 15px rgba(0,0,0,0.95), inset 0 0 6px rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .seal-rune {
      color: #fef08a;
      font-family: 'Cinzel', serif;
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 0 6px rgba(0,0,0,0.8);
    }
  `;

  // 1. FULL INTERACTIVE VIEWER HTML
  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitaciones VIP de Pareja para Puertas (A4 Horizontal) — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=MedievalSharp&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    ${sharedCardsCss}

    body {
      background-color: #0b0710;
      font-family: 'Inter', sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    /* Print Controls Bar (No Print) */
    .controls-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0a060f;
      border-bottom: 2px solid #d4af37;
      padding: 10px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.85);
    }

    .controls-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .controls-title {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 800;
      color: #fef08a;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .controls-desc {
      font-size: 11px;
      color: #a1a1aa;
    }

    .controls-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .mode-toggles {
      display: flex;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 3px;
      gap: 4px;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }

    .toggle-btn {
      background: none;
      border: none;
      color: #d1d5db;
      font-size: 11.5px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      background: #d4af37;
      color: #0b0710;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    }

    .single-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-btn {
      background: rgba(212, 175, 55, 0.2);
      border: 1px solid #d4af37;
      color: #fef08a;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .nav-btn:hover {
      background: #d4af37;
      color: #0b0710;
    }

    .controls-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .btn {
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: #d4af37;
      color: #070509;
      border: 2px solid #ffffff;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
    }

    .btn-primary:hover {
      background: #fde047;
      transform: scale(1.03);
    }

    .btn-secondary {
      background: #27272a;
      color: #f4f4f5;
      border: 1px solid #52525b;
    }

    .btn-secondary:hover {
      background: #3f3f46;
    }

    .btn-zip {
      background: #047857;
      color: #ffffff;
      border: 2px solid #34d399;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
    }

    .btn-zip:hover {
      background: #059669;
      transform: scale(1.03);
    }

    .select-dropdown {
      background: #08030d;
      color: #fde68a;
      border: 1.5px solid #d4af37;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-family: 'Inter', sans-serif;
      outline: none;
      cursor: pointer;
    }

    /* Print Container */
    .print-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 32px;
    }

    /* Print Rules */
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
  </style>
</head>
<body>

  <!-- Controls Bar (Hidden during print) -->
  <header class="controls-bar no-print">
    <div class="controls-left">
      <span style="font-size: 26px;">🗝️</span>
      <div>
        <div class="controls-title">Invitaciones de Puertas (A4 Horizontal Pegadas Sin Espacios)</div>
        <div class="controls-desc" id="statusDesc">Hoja separada para imprimir en A4 apaisado</div>
      </div>
    </div>

    <!-- Mode Selector & Pagination -->
    <div class="controls-center">
      <div class="mode-toggles">
        <button id="btnModeSingle" class="toggle-btn active" onclick="setMode('single')">📄 Hoja a Hoja (1 Pareja)</button>
        <button id="btnModeAll" class="toggle-btn" onclick="setMode('all')">📚 Ver Todas (${couples.length} Hojas)</button>
      </div>

      <div id="singleNav" class="single-nav">
        <button class="nav-btn" onclick="prevCouple()" title="Pareja Anterior">◀ Anterior</button>
        <select id="coupleFilter" class="select-dropdown" onchange="onCoupleSelect()">
          ${optionsHtml}
        </select>
        <button class="nav-btn" onclick="nextCouple()" title="Pareja Siguiente">Siguiente ▶</button>
      </div>
    </div>

    <div class="controls-actions">
      <!-- Botón Imprimir Hoja Actual -->
      <button id="btnPrintCurrent" class="btn btn-primary" onclick="printCurrent()">
        🖨️ IMPRIMIR HOJA #1
      </button>

      <!-- Botón Imprimir Todas -->
      <button id="btnPrintAll" class="btn btn-secondary" onclick="printAll()" style="display: none;">
        🖨️ IMPRIMIR LAS ${couples.length} HOJAS
      </button>

      <!-- Botón Descargar PDFs -->
      <a href="PDFs_Copisteria_A4_Horizontal.zip" download class="btn btn-zip" title="Descargar paquete ZIP con los ${couples.length} PDFs individuales para llevar en PenDrive a la copistería">
        💾 DESCARGAR ${couples.length} PDFs (ZIP)
      </a>
    </div>
  </header>

  <!-- Printable Container -->
  <main class="print-container">
${sheetsHtml}
  </main>

  <script>
    let currentCoupleIndex = 1;
    let currentMode = 'single';

    function updateView() {
      const sheets = document.querySelectorAll('.door-sheet');
      const nav = document.getElementById('singleNav');
      const btnPrintCurrent = document.getElementById('btnPrintCurrent');
      const btnPrintAll = document.getElementById('btnPrintAll');
      const btnModeSingle = document.getElementById('btnModeSingle');
      const btnModeAll = document.getElementById('btnModeAll');
      const statusDesc = document.getElementById('statusDesc');

      if (currentMode === 'single') {
        btnModeSingle.classList.add('active');
        btnModeAll.classList.remove('active');
        nav.style.display = 'flex';
        btnPrintCurrent.style.display = 'inline-flex';
        btnPrintAll.style.display = 'none';

        sheets.forEach((sheet, idx) => {
          if (idx + 1 === currentCoupleIndex) {
            sheet.style.display = 'flex';
          } else {
            sheet.style.display = 'none';
          }
        });

        const select = document.getElementById('coupleFilter');
        select.value = 'pareja_' + currentCoupleIndex;
        const selectedText = select.options[select.selectedIndex].text;
        statusDesc.textContent = 'Mostrando ' + selectedText + ' (1 hoja A4 separada)';
        btnPrintCurrent.innerHTML = '🖨️ IMPRIMIR HOJA #' + currentCoupleIndex;
      } else {
        btnModeSingle.classList.remove('active');
        btnModeAll.classList.add('active');
        nav.style.display = 'none';
        btnPrintCurrent.style.display = 'none';
        btnPrintAll.style.display = 'inline-flex';

        sheets.forEach(sheet => {
          sheet.style.display = 'flex';
        });
        statusDesc.textContent = 'Mostrando todas las ' + ${couples.length} + ' parejas (una página por hoja)';
      }
    }

    function setMode(mode) {
      currentMode = mode;
      updateView();
    }

    function prevCouple() {
      if (currentCoupleIndex > 1) {
        currentCoupleIndex--;
        updateView();
      }
    }

    function nextCouple() {
      const max = document.querySelectorAll('.door-sheet').length;
      if (currentCoupleIndex < max) {
        currentCoupleIndex++;
        updateView();
      }
    }

    function onCoupleSelect() {
      const select = document.getElementById('coupleFilter');
      const val = select.value;
      const match = val.match(/pareja_(\\d+)/);
      if (match) {
        currentCoupleIndex = parseInt(match[1]);
        currentMode = 'single';
        updateView();
      }
    }

    function printCurrent() {
      currentMode = 'single';
      updateView();
      window.print();
    }

    function printAll() {
      currentMode = 'all';
      updateView();
      window.print();
    }

    // Inicializar mostrando sólo la Pareja 1 de forma limpia e individual
    window.addEventListener('DOMContentLoaded', () => {
      setMode('single');
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'tarjetas_puertas_A4_horizontal.html'), fullHtml);
  fs.writeFileSync(path.join(__dirname, '..', 'tarjetas_puertas_A4_horizontal.html'), fullHtml);
  console.log('✅ Generated interactive HTML: public/tarjetas_puertas_A4_horizontal.html');

  // 2. GENERATE INDIVIDUAL STANDALONE HTML FILES & RENDER TO PDF
  const outputDir = path.join(__dirname, '..', 'PDFs_Copisteria_A4_Horizontal');
  const htmlSubdir = path.join(outputDir, 'html_individuales');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(htmlSubdir)) fs.mkdirSync(htmlSubdir, { recursive: true });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const hasChrome = fs.existsSync(chromePath);

  console.log(`Starting generation of ${couples.length} separate sheets (1 per couple)... (Headless Chrome: ${hasChrome ? 'YES' : 'NO'})`);

  for (let i = 0; i < couples.length; i++) {
    const c = couples[i];
    const cleanChica = sanitizeFilename(c.chica.name);
    const cleanChico = sanitizeFilename(c.chico.name);
    const cleanNick = sanitizeFilename(c.coupleNick);
    const filenameBase = `Pareja_${pad2(c.coupleIndex)}_${cleanChica}_y_${cleanChico}_(${cleanNick})`;

    const singleHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${filenameBase}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=MedievalSharp&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    html, body {
      width: 297mm;
      height: 210mm;
      margin: 0;
      padding: 0;
      background: #000;
      overflow: hidden;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    ${sharedCardsCss}
  </style>
</head>
<body>
  ${renderSheet(c)}
</body>
</html>`;

    const singleHtmlPath = path.join(htmlSubdir, `${filenameBase}.html`);
    fs.writeFileSync(singleHtmlPath, singleHtml);

    if (hasChrome) {
      const pdfPath = path.join(outputDir, `${filenameBase}.pdf`);
      try {
        execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "file://${singleHtmlPath}"`, { stdio: 'ignore' });
        process.stdout.write(`[${c.coupleIndex}/${couples.length}] `);
      } catch (err) {
        console.error(`Error rendering PDF for couple ${c.coupleIndex}:`, err.message);
      }
    }
  }
  console.log(`\n✅ All ${couples.length} individual PDFs generated successfully!`);

  // Render combined PDF
  if (hasChrome) {
    const combinedPdfPath = path.join(outputDir, `00_TODAS_LAS_${couples.length}_PAREJAS_A4_HORIZONTAL.pdf`);
    const fullHtmlPath = path.join(__dirname, '..', 'tarjetas_puertas_A4_horizontal.html');
    try {
      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${combinedPdfPath}" --print-to-pdf-no-header "file://${fullHtmlPath}"`, { stdio: 'ignore' });
      console.log(`✅ Generated 00_TODAS_LAS_${couples.length}_PAREJAS_A4_HORIZONTAL.pdf (${couples.length} pages)`);
    } catch (err) {
      console.error('Error rendering combined PDF:', err.message);
    }
  }

  // Create ZIP archive for copistería
  try {
    const zipName = 'PDFs_Copisteria_A4_Horizontal.zip';
    const zipPathInRoot = path.join(__dirname, '..', zipName);
    const zipPathInPublic = path.join(__dirname, '..', 'public', zipName);
    
    // Remove old zip if exists
    if (fs.existsSync(zipPathInRoot)) fs.unlinkSync(zipPathInRoot);
    if (fs.existsSync(zipPathInPublic)) fs.unlinkSync(zipPathInPublic);

    execSync(`cd "${path.join(__dirname, '..')}" && /usr/bin/zip -r "${zipPathInRoot}" PDFs_Copisteria_A4_Horizontal/ -x "*.DS_Store"`, { stdio: 'ignore' });
    fs.copyFileSync(zipPathInRoot, zipPathInPublic);
    console.log(`✅ Generated ZIP archive with all ${couples.length} PDFs for copistería: public/PDFs_Copisteria_A4_Horizontal.zip`);
  } catch (err) {
    console.error('Error creating ZIP archive:', err.message);
  }

  console.log('🎉 Done! Everything is ready for print shop / copistería.');
}

main();
