const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildHtml(clansPosition = 'left') {
  const isRight = clansPosition === 'right';

  const pruebas = [
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

  const clanes = [
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

  // Table header cells
  const pruebaHeaderCells = pruebas.map(p => `
    <th class="th-prueba">
      <div class="th-icon">${p.icon}</div>
      <div class="th-label">${p.name}</div>
    </th>
  `).join('');

  const totalHeaderCell = `
    <th class="th-total">
      <div class="th-icon">👑</div>
      <div class="th-label">TOTAL</div>
    </th>
  `;

  const clanHeaderCell = `
    <th class="th-clan ${isRight ? 'th-clan-right' : 'th-clan-left'}">
      <div class="th-icon">⚔️</div>
      <div class="th-label">CLAN DEL AKELARRE</div>
    </th>
  `;

  const headerRow = isRight
    ? `<tr>${pruebaHeaderCells}${totalHeaderCell}${clanHeaderCell}</tr>`
    : `<tr>${clanHeaderCell}${pruebaHeaderCells}${totalHeaderCell}</tr>`;

  // Rows
  const rowsHtml = clanes.map(clan => {
    // 10 Blank score cells
    const scoreCells = pruebas.map(p => `
      <td class="td-score">
        <div class="score-box" style="border-color: ${clan.primaryColor};">
          <span class="box-watermark">#${p.num}</span>
          <span class="corner-dot c-tl" style="background-color: ${clan.primaryColor};"></span>
          <span class="corner-dot c-tr" style="background-color: ${clan.primaryColor};"></span>
          <span class="corner-dot c-bl" style="background-color: ${clan.primaryColor};"></span>
          <span class="corner-dot c-br" style="background-color: ${clan.primaryColor};"></span>
        </div>
      </td>
    `).join('');

    // Total box
    const totalCell = `
      <td class="td-total">
        <div class="total-box">
          <span class="total-trophy">🏆</span>
          <span class="corner-dot c-tl" style="background-color: #d4af37;"></span>
          <span class="corner-dot c-tr" style="background-color: #d4af37;"></span>
          <span class="corner-dot c-bl" style="background-color: #d4af37;"></span>
          <span class="corner-dot c-br" style="background-color: #d4af37;"></span>
        </div>
      </td>
    `;

    // Clan Card
    const clanCell = `
      <td class="td-clan ${isRight ? 'td-clan-right' : 'td-clan-left'}">
        <div class="clan-badge-card" style="background: ${clan.cardBg}; border-color: ${clan.primaryColor}; box-shadow: 0 0 15px ${clan.glowColor};">
          <div class="clan-crest" style="background: ${clan.badgeBg}; border-color: ${clan.primaryColor};">
            <span class="clan-icon">${clan.icon}</span>
          </div>
          <div class="clan-info">
            <h2 class="clan-title" style="color: ${clan.primaryColor}; text-shadow: 0 0 12px ${clan.glowColor};">
              ${clan.name.toUpperCase()}
            </h2>
            <p class="clan-tagline">«${clan.tagline}»</p>
            <div class="clan-meta">
              <span class="clan-badge" style="border-color: ${clan.primaryColor}; color: ${clan.primaryColor};">
                ✦ ${clan.members} ✦
              </span>
            </div>
          </div>
        </div>
      </td>
    `;

    return `
      <tr class="row-clan row-${clan.id}">
        ${isRight ? scoreCells + totalCell + clanCell : clanCell + scoreCells + totalCell}
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tablero de Puntuación de Clanes (A3 Horizontal) — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=MedievalSharp&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A3 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 420mm;
      height: 297mm;
      max-width: 420mm;
      max-height: 297mm;
      margin: 0;
      padding: 0;
      background: #09050e;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Screen Wrapper */
    .screen-wrapper {
      width: 420mm;
      height: 297mm;
      position: relative;
      background: radial-gradient(circle at 50% 15%, #230f2d 0%, #100617 50%, #060209 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6mm 8mm;
      overflow: hidden;
    }

    /* Ornate Gold Borders */
    .border-outer {
      position: absolute;
      top: 3.5mm;
      left: 3.5mm;
      right: 3.5mm;
      bottom: 3.5mm;
      border: 2.5px solid #d4af37;
      pointer-events: none;
      z-index: 10;
    }

    .border-inner {
      position: absolute;
      top: 5mm;
      left: 5mm;
      right: 5mm;
      bottom: 5mm;
      border: 1px dashed rgba(212, 175, 55, 0.45);
      pointer-events: none;
      z-index: 10;
    }

    .rune-corner {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 900;
      color: #d4af37;
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
      pointer-events: none;
      z-index: 11;
    }
    .rc-tl { top: 6.5mm; left: 7.5mm; }
    .rc-tr { top: 6.5mm; right: 7.5mm; }
    .rc-bl { bottom: 6.5mm; left: 7.5mm; }
    .rc-br { bottom: 6.5mm; right: 7.5mm; }

    /* Controls Bar for Web View (Hidden in Print) */
    .controls-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(10, 5, 16, 0.96);
      border-bottom: 2px solid #d4af37;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }

    @media print {
      .no-print {
        display: none !important;
      }
      .screen-wrapper {
        padding: 6mm 8mm !important;
      }
    }

    /* HEADER */
    .board-header {
      text-align: center;
      position: relative;
      margin-bottom: 2mm;
      z-index: 5;
    }

    .pre-title {
      font-family: 'Cinzel', serif;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #fde68a;
      text-transform: uppercase;
      text-shadow: 0 0 8px rgba(253, 230, 138, 0.6);
      margin-bottom: 1mm;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .main-title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 27px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      background: linear-gradient(180deg, #ffffff 0%, #fef08a 45%, #d4af37 80%, #996515 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.9));
      line-height: 1.1;
    }

    .sub-title {
      font-family: 'MedievalSharp', cursive;
      font-size: 13.5px;
      font-style: italic;
      color: #fbcfe8;
      letter-spacing: 1px;
      text-shadow: 0 1px 6px rgba(0,0,0,0.9);
      margin-top: 1mm;
    }

    /* TABLE */
    .table-container {
      flex: 1;
      display: flex;
      align-items: stretch;
      z-index: 5;
      margin: 1mm 0 3mm 0;
    }

    .scoreboard-table {
      width: 100%;
      height: 100%;
      border-collapse: separate;
      border-spacing: 4.5px 5.5px;
      table-layout: fixed;
    }

    /* Column Widths: 10 Pruebas (~25mm each = 250mm), 1 Total (~32mm), 1 Clan (~118mm) = 400mm */
    .th-prueba {
      width: 25.5mm;
      background: rgba(255, 255, 255, 0.06);
      border: 1.5px solid rgba(212, 175, 55, 0.4);
      border-radius: 6px;
      padding: 3px 2px;
      text-align: center;
    }

    .th-total {
      width: 32mm;
      background: linear-gradient(180deg, rgba(212, 175, 55, 0.25) 0%, rgba(139, 0, 0, 0.3) 100%);
      border: 2px solid #d4af37;
      border-radius: 6px;
      padding: 3px 2px;
      text-align: center;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }

    .th-clan {
      width: 118mm;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid #d4af37;
      border-radius: 6px;
      padding: 3px 12px;
      text-align: center;
    }

    .th-icon {
      font-size: 14px;
      line-height: 1.1;
    }

    .th-label {
      font-family: 'Cinzel', serif;
      font-size: 9.5px;
      font-weight: 800;
      color: #fef08a;
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1.1;
      margin-top: 1px;
      text-shadow: 0 1px 4px #000000;
    }

    /* SCORE BOXES (BLANCO LIMPIO PARA ESCRIBIR A MANO) */
    .td-score {
      padding: 0;
      height: 48mm;
    }

    .score-box {
      width: 100%;
      height: 100%;
      background: #ffffff !important;
      border: 2.5px solid #d4af37;
      border-radius: 7px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.06), 0 3px 8px rgba(0, 0, 0, 0.6);
    }

    .box-watermark {
      position: absolute;
      top: 3px;
      right: 4px;
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 800;
      color: #9ca3af;
      pointer-events: none;
      line-height: 1;
    }

    .corner-dot {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      pointer-events: none;
    }
    .c-tl { top: 3px; left: 3px; }
    .c-tr { top: 3px; right: 3px; }
    .c-bl { bottom: 3px; left: 3px; }
    .c-br { bottom: 3px; right: 3px; }

    /* TOTAL BOX */
    .td-total {
      padding: 0;
      height: 48mm;
    }

    .total-box {
      width: 100%;
      height: 100%;
      background: #fffbeb !important;
      border: 3px solid #d4af37;
      border-radius: 7px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.2);
    }

    .total-trophy {
      font-size: 26px;
      opacity: 0.18;
      pointer-events: none;
    }

    /* CLAN BADGE CARD */
    .td-clan {
      padding: 0;
      height: 48mm;
    }

    .clan-badge-card {
      width: 100%;
      height: 100%;
      border: 2.5px solid #d4af37;
      border-radius: 8px;
      padding: 4mm 5mm;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }

    .clan-crest {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.8);
    }

    .clan-icon {
      font-size: 24px;
      line-height: 1;
    }

    .clan-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
      overflow: hidden;
    }

    .clan-title {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 1.5px;
      line-height: 1.15;
      margin-bottom: 1.5px;
    }

    .clan-tagline {
      font-family: 'MedievalSharp', cursive;
      font-size: 11px;
      font-style: italic;
      color: #e5e7eb;
      line-height: 1.1;
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .clan-meta {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .clan-badge {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid;
      border-radius: 4px;
      padding: 1px 7px;
      line-height: 1.2;
    }

    /* FOOTER / PODIUM */
    .board-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(212, 175, 55, 0.4);
      padding-top: 2.5mm;
      z-index: 5;
    }

    .podium-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .podium-title {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 800;
      color: #fef08a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .podium-slots {
      display: flex;
      gap: 10px;
    }

    .podium-slot {
      background: rgba(255, 255, 255, 0.06);
      border: 1.5px solid rgba(212, 175, 55, 0.5);
      border-radius: 6px;
      padding: 2px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 700;
    }

    .slot-first {
      background: rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
      color: #fef08a;
    }

    .footer-dates {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-align: right;
    }

    /* BUTTONS IN CONTROLS BAR */
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
      border: none;
    }

    .btn-gold {
      background: #d4af37;
      color: #070509;
      border: 2px solid #ffffff;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
    }
    .btn-gold:hover {
      background: #fde047;
      transform: scale(1.03);
    }

    .btn-dark {
      background: #27272a;
      color: #f4f4f5;
      border: 1.5px solid #52525b;
    }
    .btn-dark:hover {
      background: #3f3f46;
      color: #ffffff;
    }

    .btn-purple {
      background: #7e22ce;
      color: #ffffff;
      border: 1.5px solid #c084fc;
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
    }
    .btn-purple:hover {
      background: #9333ea;
    }
  </style>
</head>
<body>

  <!-- Controls Bar (No Print) -->
  <header class="controls-bar no-print">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 24px;">🏆</span>
      <div>
        <div style="font-family: 'Cinzel', serif; font-size: 15px; font-weight: 800; color: #fef08a; letter-spacing: 1px;">
          TABLERO DE PUNTUACIONES DE LOS CLANES (A3 HORIZONTAL)
        </div>
        <div style="font-size: 11px; color: #a1a1aa;">
          Diseño para imprimir en tamaño A3 (420 x 297 mm) • 4 Clanes x 10 Pruebas
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 10px;">
      <!-- Toggle Column Position -->
      <a href="?clans=${isRight ? 'left' : 'right'}" class="btn btn-dark" onclick="toggleClans(event)">
        ${isRight ? '⬅️ Poner Clanes a la Izquierda' : '➡️ Poner Clanes a la Derecha'}
      </a>

      <!-- Download PDF -->
      <a href="marcador_clanes_A3.pdf" download class="btn btn-purple" title="Descargar PDF A3 listo para llevar a la copistería">
        💾 DESCARGAR PDF A3
      </a>

      <!-- Print Button -->
      <button class="btn btn-gold" onclick="window.print()">
        🖨️ IMPRIMIR A3 HORIZONTAL
      </button>
    </div>
  </header>

  <!-- A3 Screen & Printable Sheet -->
  <div class="screen-wrapper">
    <!-- Outer Gothic Borders -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <!-- Corner Runes -->
    <span class="rune-corner rc-tl">𝕬</span>
    <span class="rune-corner rc-tr">𝕬</span>
    <span class="rune-corner rc-bl">𝕬</span>
    <span class="rune-corner rc-br">𝕬</span>

    <!-- HEADER -->
    <header class="board-header">
      <div class="pre-title">
        <span>✦</span>
        <span>TORNEO DE BRUJOS Y HECHICEROS</span>
        <span>•</span>
        <span>AKELARRE 2026</span>
        <span>✦</span>
      </div>
      <div class="main-title-container">
        <span style="font-size: 26px;">⚔️</span>
        <h1 class="main-title">TABLERO DE PUNTUACIONES DE LOS CLANES</h1>
        <span style="font-size: 26px;">⚔️</span>
      </div>
      <p class="sub-title">
        «Diez pruebas malditas decidirán el destino. Que hiervan los calderos y arda la noche: ¡apunta la gloria de tu clan!»
      </p>
    </header>

    <!-- TABLE -->
    <main class="table-container">
      <table class="scoreboard-table">
        <thead>
          ${headerRow}
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </main>

    <!-- FOOTER / PODIUM -->
    <footer class="board-footer">
      <div class="podium-section">
        <div class="podium-title">
          <span>🏆</span>
          <span>PODIO FINAL DEL AKELARRE:</span>
        </div>
        <div class="podium-slots">
          <div class="podium-slot slot-first">
            <span>🥇 1º CLAN CAMPEÓN:</span>
            <span style="display: inline-block; width: 45mm; border-bottom: 1.5px dotted #d4af37;"></span>
          </div>
          <div class="podium-slot">
            <span>🥈 2º PUESTO:</span>
            <span style="display: inline-block; width: 35mm; border-bottom: 1.5px dotted #a1a1aa;"></span>
          </div>
          <div class="podium-slot">
            <span>🥉 3º PUESTO:</span>
            <span style="display: inline-block; width: 35mm; border-bottom: 1.5px dotted #ca8a04;"></span>
          </div>
          <div class="podium-slot">
            <span>💀 4º CASTIGO:</span>
            <span style="display: inline-block; width: 35mm; border-bottom: 1.5px dotted #ef4444;"></span>
          </div>
        </div>
      </div>

      <div class="footer-dates">
        <div>30 OCTUBRE - 1 NOVIEMBRE 2026</div>
        <div style="font-size: 8.5px; color: #a1a1aa; font-family: 'Inter', sans-serif;">FINCA DEL AKELARRE • EDICIÓN SAGRADA</div>
      </div>
    </footer>
  </div>

  <script>
    function toggleClans(e) {
      // In local static file, we can redirect or toggle DOM
      const url = new URL(window.location.href);
      const current = url.searchParams.get('clans') || '${clansPosition}';
      const next = current === 'right' ? 'left' : 'right';
      url.searchParams.set('clans', next);
      window.location.href = url.href;
      e.preventDefault();
    }

    // Check query param on load
    const params = new URLSearchParams(window.location.search);
    const clansParam = params.get('clans');
    if (clansParam && clansParam !== '${clansPosition}') {
      // already handled if generated separately
    }
  </script>
</body>
</html>`;
}

async function main() {
  console.log('Generating A3 Clan Scoreboard...');

  const htmlLeft = buildHtml('left');
  const htmlRight = buildHtml('right');

  // Write HTMLs to public and root (default is Clanes a la Izquierda)
  const publicDir = path.join(__dirname, '..', 'public');
  const rootDir = path.join(__dirname, '..');

  fs.writeFileSync(path.join(publicDir, 'marcador_clanes_A3.html'), htmlLeft);
  fs.writeFileSync(path.join(rootDir, 'marcador_clanes_A3.html'), htmlLeft);

  fs.writeFileSync(path.join(publicDir, 'marcador_clanes_A3_izquierda.html'), htmlLeft);
  fs.writeFileSync(path.join(publicDir, 'marcador_clanes_A3_derecha.html'), htmlRight);

  console.log('✅ HTML files generated:');
  console.log('   - public/marcador_clanes_A3.html (Clanes a la Izquierda - Oficial)');
  console.log('   - public/marcador_clanes_A3_derecha.html (Clanes a la Derecha - Alternativo)');

  // Convert to high-resolution A3 PDFs using Google Chrome Headless
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(chromePath)) {
    console.log('Generating A3 PDFs with Headless Chrome...');

    const pdfOfficialPath = path.join(publicDir, 'marcador_clanes_A3.pdf');
    const pdfOfficialRoot = path.join(rootDir, 'marcador_clanes_A3.pdf');
    const pdfLeftPath = path.join(publicDir, 'Marcador_Clanes_A3_Horizontal_(Clanes_Izquierda).pdf');
    const pdfRightPath = path.join(publicDir, 'Marcador_Clanes_A3_Horizontal_(Clanes_Derecha).pdf');

    const htmlLeftPath = path.join(publicDir, 'marcador_clanes_A3_izquierda.html');
    const htmlRightPath = path.join(publicDir, 'marcador_clanes_A3_derecha.html');

    try {
      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfOfficialPath}" --print-to-pdf-no-header "file://${htmlLeftPath}"`, { stdio: 'ignore' });
      fs.copyFileSync(pdfOfficialPath, pdfOfficialRoot);
      fs.copyFileSync(pdfOfficialPath, pdfLeftPath);
      console.log('✅ Generated marcador_clanes_A3.pdf (A3 Landscape, Clanes a la Izquierda - Oficial)');

      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfRightPath}" --print-to-pdf-no-header "file://${htmlRightPath}"`, { stdio: 'ignore' });
      console.log('✅ Generated Marcador_Clanes_A3_Horizontal_(Clanes_Derecha).pdf');
    } catch (e) {
      console.error('Error generating PDF:', e.message);
    }
  }

  console.log('🎉 Done! A3 Scoreboards ready.');
}

main();
