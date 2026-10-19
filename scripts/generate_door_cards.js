const fs = require('fs');
const path = require('path');

async function main() {
  const couplesDataPath = path.join(__dirname, '..', 'couples_data.json');
  if (!fs.existsSync(couplesDataPath)) {
    console.error('couples_data.json not found');
    process.exit(1);
  }

  const couples = JSON.parse(fs.readFileSync(couplesDataPath, 'utf8'));

  const posterPath = path.join(__dirname, '..', 'public', 'images', 'akelarre_poster.jpg');
  const posterB64 = 'data:image/jpeg;base64,' + fs.readFileSync(posterPath).toString('base64');

  const optionsHtml = couples.map(c => 
    `<option value="pareja_${c.coupleIndex}">Pareja #${c.coupleIndex}: ${c.chica.name} & ${c.chico.name}</option>`
  ).join('\n        ');

  const sheetsHtml = couples.map(c => `
    <!-- HOJA A4 HORIZONTAL PAREJA #${c.coupleIndex} -->
    <section class="door-sheet" id="pareja_${c.coupleIndex}">
      <!-- Sheet Minimal Door Header -->
      <div class="sheet-room-tag">
        <span class="room-title">PUERTA DE HABITACIÓN · PAREJA #${c.coupleIndex}</span>
        <span class="room-names">${c.chica.name.toUpperCase()} &amp; ${c.chico.name.toUpperCase()}</span>
        <span class="room-sub">AKELARRE 2026</span>
      </div>

      <!-- Two Identical Cards Side-by-Side (Chica Left, Chico Right) -->
      <div class="cards-pair-container">
        
        <!-- TARJETA IZQUIERDA: CHICA (INVITACIÓN VIP IDÉNTICA) -->
        <article class="pass-card">
          <!-- Background Poster Art -->
          <div class="pass-poster-bg" style="background-image: url('${posterB64}');"></div>

          <!-- Smooth Dark Gradient Transition to Bottom -->
          <div class="pass-gradient-overlay"></div>

          <!-- Dark Solid Bottom Base -->
          <div class="pass-bottom-backdrop"></div>

          <!-- Outer Gold Ornate Border -->
          <div class="pass-outer-border"></div>
          <div class="pass-inner-dashed"></div>

          <!-- Corner Gothic Runes -->
          <span class="corner-rune cr-tl">𝕬</span>
          <span class="corner-rune cr-tr">𝕬</span>
          <span class="corner-rune cr-bl">𝕬</span>
          <span class="corner-rune cr-br">𝕬</span>

          <!-- Lower Gothic Frame with Inner Accents -->
          <div class="pass-lower-frame">
            <span class="frame-star fs-tl">✦</span>
            <span class="frame-star fs-tr">✦</span>
            <span class="frame-star fs-bl">✦</span>
            <span class="frame-star fs-br">✦</span>

            <!-- Header: PASE SAGRADO DEL AKELARRE -->
            <div class="pass-header-text">✦ PASE SAGRADO DEL AKELARRE ✦</div>

            <!-- Mortal Name -->
            <h1 class="pass-mortal-name">${c.chica.name}</h1>

            <!-- Witch Nickname -->
            <div class="pass-witch-alias">«${c.chica.alias}»</div>

            <!-- Clan Badge -->
            <div class="pass-clan-badge">
              ✦ CLAN: ${c.chica.teamName.toUpperCase()} ✦
            </div>

            <!-- Stamped Red Wax Seal -->
            <div class="pass-wax-seal">
              <span class="seal-rune">𝕬</span>
            </div>
          </div>
        </article>

        <!-- Vertical Cut Guide Divider -->
        <div class="pair-divider">
          <span>✂</span>
          <span>✦</span>
          <span>✂</span>
        </div>

        <!-- TARJETA DERECHA: CHICO (INVITACIÓN VIP IDÉNTICA) -->
        <article class="pass-card">
          <!-- Background Poster Art -->
          <div class="pass-poster-bg" style="background-image: url('${posterB64}');"></div>

          <!-- Smooth Dark Gradient Transition to Bottom -->
          <div class="pass-gradient-overlay"></div>

          <!-- Dark Solid Bottom Base -->
          <div class="pass-bottom-backdrop"></div>

          <!-- Outer Gold Ornate Border -->
          <div class="pass-outer-border"></div>
          <div class="pass-inner-dashed"></div>

          <!-- Corner Gothic Runes -->
          <span class="corner-rune cr-tl">𝕬</span>
          <span class="corner-rune cr-tr">𝕬</span>
          <span class="corner-rune cr-bl">𝕬</span>
          <span class="corner-rune cr-br">𝕬</span>

          <!-- Lower Gothic Frame with Inner Accents -->
          <div class="pass-lower-frame">
            <span class="frame-star fs-tl">✦</span>
            <span class="frame-star fs-tr">✦</span>
            <span class="frame-star fs-bl">✦</span>
            <span class="frame-star fs-br">✦</span>

            <!-- Header: PASE SAGRADO DEL AKELARRE -->
            <div class="pass-header-text">✦ PASE SAGRADO DEL AKELARRE ✦</div>

            <!-- Mortal Name -->
            <h1 class="pass-mortal-name">${c.chico.name}</h1>

            <!-- Warlock Nickname -->
            <div class="pass-witch-alias">«${c.chico.alias}»</div>

            <!-- Clan Badge -->
            <div class="pass-clan-badge">
              ✦ CLAN: ${c.chico.teamName.toUpperCase()} ✦
            </div>

            <!-- Stamped Red Wax Seal -->
            <div class="pass-wax-seal">
              <span class="seal-rune">𝕬</span>
            </div>
          </div>
        </article>

      </div>
    </section>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tarjetas de Invitación VIP para Puertas (A4 Horizontal) — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800;900&family=MedievalSharp&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #120e18;
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
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.85);
    }

    .controls-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .controls-title {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 800;
      color: #fef08a;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .controls-desc {
      font-size: 11px;
      color: #a1a1aa;
    }

    .controls-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 9px 18px;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: #d4af37;
      color: #070509;
      border: 2px solid #ffffff;
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    }

    .btn-primary:hover {
      background: #fde047;
      transform: scale(1.03);
    }

    .select-dropdown {
      background: #08030d;
      color: #fde68a;
      border: 1.5px solid #d4af37;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
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

    /* A4 Landscape Sheet (297mm x 210mm) */
    .door-sheet {
      width: 297mm;
      height: 210mm;
      max-width: 297mm;
      max-height: 210mm;
      background: #07040a;
      padding: 5mm 10mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.7);
      page-break-after: always;
      break-after: page;
    }

    /* Minimal Room Tag Header */
    .sheet-room-tag {
      height: 6mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      color: #d4af37;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 1.5px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }

    .room-title {
      font-weight: 700;
      color: #a1a1aa;
    }

    .room-names {
      font-weight: 900;
      color: #fef08a;
      letter-spacing: 2px;
    }

    .room-sub {
      font-weight: 600;
      color: rgba(212, 175, 55, 0.6);
    }

    /* Cards Pair Row */
    .cards-pair-container {
      height: 191mm;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16mm;
      position: relative;
    }

    /* Center Divider */
    .pair-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 185mm;
      color: rgba(212, 175, 55, 0.35);
      font-size: 12px;
      border-left: 1px dashed rgba(212, 175, 55, 0.3);
      padding: 6px 0;
    }

    /* IDENTICAL PASS CARD (9:16 Aspect Ratio) */
    .pass-card {
      width: 107.5mm;
      height: 191mm;
      position: relative;
      border-radius: 2px;
      overflow: hidden;
      background: #07040a;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      flex-shrink: 0;
    }

    /* Poster Artwork Background */
    .pass-poster-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 118mm;
      background-size: cover;
      background-position: top center;
      background-repeat: no-repeat;
    }

    /* Smooth Gradient Transition */
    .pass-gradient-overlay {
      position: absolute;
      top: 102mm;
      left: 0;
      width: 100%;
      height: 18mm;
      background: linear-gradient(to bottom, rgba(7, 4, 10, 0) 0%, rgba(7, 4, 10, 0.85) 50%, rgba(7, 4, 10, 1) 100%);
      z-index: 2;
    }

    /* Solid Dark Bottom Backdrop */
    .pass-bottom-backdrop {
      position: absolute;
      top: 118mm;
      left: 0;
      width: 100%;
      height: 73mm;
      background: #07040a;
      z-index: 2;
    }

    /* Outer Ornate Gold Border */
    .pass-outer-border {
      position: absolute;
      top: 3mm;
      left: 3mm;
      right: 3mm;
      bottom: 3mm;
      border: 2px solid #d4af37;
      pointer-events: none;
      z-index: 10;
    }

    /* Inner Dashed Decorative Border */
    .pass-inner-dashed {
      position: absolute;
      top: 4.8mm;
      left: 4.8mm;
      right: 4.8mm;
      bottom: 4.8mm;
      border: 1px dashed rgba(212, 175, 55, 0.4);
      pointer-events: none;
      z-index: 10;
    }

    /* Corner Runes 𝕬 */
    .corner-rune {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 900;
      color: #d4af37;
      line-height: 1;
      pointer-events: none;
      z-index: 11;
    }
    .cr-tl { top: 6.5mm; left: 7.5mm; }
    .cr-tr { top: 6.5mm; right: 7.5mm; }
    .cr-bl { bottom: 6.5mm; left: 7.5mm; }
    .cr-br { bottom: 6.5mm; right: 7.5mm; }

    /* Lower Gothic Parchment Frame */
    .pass-lower-frame {
      position: absolute;
      top: 120mm;
      left: 7mm;
      right: 7mm;
      bottom: 7mm;
      border: 1px solid rgba(212, 175, 55, 0.55);
      border-radius: 4px;
      padding: 5mm 4mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      z-index: 5;
    }

    /* Corner Stars ✦ */
    .frame-star {
      position: absolute;
      font-size: 11px;
      color: #d4af37;
      line-height: 1;
      pointer-events: none;
    }
    .fs-tl { top: 1.5mm; left: 2mm; }
    .fs-tr { top: 1.5mm; right: 2mm; }
    .fs-bl { bottom: 1.5mm; left: 2mm; }
    .fs-br { bottom: 1.5mm; right: 2mm; }

    /* Header Text: ✦ PASE SAGRADO DEL AKELARRE ✦ */
    .pass-header-text {
      font-family: 'Inter', sans-serif;
      font-size: 8.5px;
      font-weight: 700;
      color: #f3e5ab;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 1mm;
    }

    /* Mortal Name */
    .pass-mortal-name {
      font-family: 'Cinzel', serif;
      font-size: 21px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      line-height: 1.1;
      background: linear-gradient(to bottom, #fffbe6 0%, #d4af37 50%, #aa8214 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 1.5mm;
    }

    /* Witch Nickname */
    .pass-witch-alias {
      font-family: 'MedievalSharp', cursive;
      font-size: 14.5px;
      font-style: italic;
      color: #fcd34d;
      letter-spacing: 1px;
      margin-top: 1mm;
    }

    /* Clan Badge */
    .pass-clan-badge {
      display: inline-block;
      background: rgba(139, 0, 0, 0.65);
      border: 1.5px solid #d4af37;
      border-radius: 3px;
      padding: 3px 10px;
      font-family: 'Inter', sans-serif;
      font-size: 9.5px;
      font-weight: 800;
      color: #fef08a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2mm;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.25);
    }

    /* Stamped Red Wax Seal */
    .pass-wax-seal {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%);
      border: 2px solid #d4af37;
      box-shadow: 0 0 12px rgba(185, 28, 28, 0.7), inset 0 0 6px rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2.5mm;
      margin-bottom: 1mm;
    }

    .seal-rune {
      color: #fef08a;
      font-family: 'Cinzel', serif;
      font-size: 19px;
      font-weight: 900;
      line-height: 1;
    }

    /* PRINT SPECIFIC CSS */
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
  </style>
</head>
<body>

  <!-- Controls Bar (Hidden during print) -->
  <header class="controls-bar no-print">
    <div class="controls-left">
      <span style="font-size: 24px;">🗝️</span>
      <div>
        <div class="controls-title">Tarjetas de Invitación VIP para Puertas (A4 Horizontal)</div>
        <div class="controls-desc">Cartel original oficial + Nombre + Apodo + Clan + Sello de Lacre (Chica a la izquierda, Chico a la derecha)</div>
      </div>
    </div>

    <div class="controls-actions">
      <!-- Selector de Pareja -->
      <select id="coupleFilter" class="select-dropdown" onchange="filterCouples()">
        <option value="all">Imprimir Todas las Parejas (23 Hojas A4)</option>
        ${optionsHtml}
      </select>

      <!-- Botón Imprimir -->
      <button class="btn btn-primary" onclick="window.print()">
        🖨️ IMPRIMIR A4 HORIZONTAL
      </button>
    </div>
  </header>

  <!-- Printable Container -->
  <main class="print-container">
${sheetsHtml}
  </main>

  <script>
    function filterCouples() {
      const select = document.getElementById('coupleFilter');
      const val = select.value;
      const sheets = document.querySelectorAll('.door-sheet');
      sheets.forEach(sheet => {
        if (val === 'all' || sheet.id === val) {
          sheet.style.display = 'flex';
        } else {
          sheet.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'tarjetas_puertas_A4_horizontal.html'), html);
  fs.writeFileSync(path.join(__dirname, '..', 'tarjetas_puertas_A4_horizontal.html'), html);
  console.log('Successfully generated public/tarjetas_puertas_A4_horizontal.html and root tarjetas_puertas_A4_horizontal.html with IDENTICAL VIP pass design!');
}

main();
