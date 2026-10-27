const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('🚪 Generando Photocall Puerta Akelarre 2026 (80cm x 200cm)...');

  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const outputDir = path.join(rootDir, 'PDFs_Photocall_Puerta');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read the HD image and encode to base64 for self-contained, high-speed rendering
  const imgPath = path.join(publicDir, 'images', 'photocall_puerta_akelarre_hd.jpg');
  const fallbackImgPath = path.join(publicDir, 'images', 'photocall_puerta_akelarre.jpg');
  const chosenPath = fs.existsSync(imgPath) ? imgPath : fallbackImgPath;
  const imgBase64 = 'data:image/jpeg;base64,' + fs.readFileSync(chosenPath).toString('base64');

  function buildHtml(showCutGuides = true) {
    // 6 vertical strips: each 133.33mm (6 * 133.33mm = 800mm)
    const strips = [
      { num: 1, label: 'Tira 1' },
      { num: 2, label: 'Tira 2' },
      { num: 3, label: 'Tira 3 (Centro)' },
      { num: 4, label: 'Tira 4 (Centro)' },
      { num: 5, label: 'Tira 5' },
      { num: 6, label: 'Tira 6' },
    ];

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Photocall Puerta (80 × 200 cm) — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=MedievalSharp&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    /* PAGE GEOMETRY: EXACT STANDARD DOOR SIZE (800mm x 2000mm) */
    @page {
      size: 800mm 2000mm;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 800mm;
      height: 2000mm;
      max-width: 800mm;
      max-height: 2000mm;
      margin: 0;
      padding: 0;
      background: #08040d;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* TOP SCREEN CONTROLS (HIDDEN ON PRINT) */
    .screen-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: rgba(13, 8, 20, 0.96);
      backdrop-filter: blur(14px);
      border-bottom: 2px solid rgba(212, 175, 55, 0.5);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.9);
    }

    .toolbar-info h1 {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 2.5px;
      color: #fef08a;
      text-transform: uppercase;
    }
    .toolbar-info p {
      font-size: 11.5px;
      color: #cbd5e1;
      margin-top: 3px;
    }

    .toolbar-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      border-radius: 8px;
      font-family: 'Cinzel', serif;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 1px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-gold {
      background: linear-gradient(135deg, #fef08a 0%, #d4af37 60%, #b8860b 100%);
      color: #000;
      font-weight: 900;
      box-shadow: 0 3px 12px rgba(212, 175, 55, 0.4);
    }
    .btn-gold:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }

    .btn-purple {
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      color: #fff;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }
    .btn-purple:hover {
      background: linear-gradient(135deg, #9333ea 0%, #6d28d9 100%);
    }

    .btn-dark {
      background: rgba(255, 255, 255, 0.1);
      color: #fef08a;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-dark:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* BANNER WRAPPER */
    .banner-wrapper {
      width: 800mm;
      height: 2000mm;
      position: relative;
      overflow: hidden;
      background: #000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* FULL-BLEED BACKGROUND ARTWORK */
    .art-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('${imgBase64}');
      background-size: cover;
      background-position: center top;
      z-index: 1;
    }

    /* TOP SHADING VIGNETTE (Guarantees text contrast while preserving art) */
    .vignette-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 400mm;
      background: linear-gradient(180deg, 
        rgba(5, 2, 8, 0.96) 0%, 
        rgba(5, 2, 8, 0.88) 45%, 
        rgba(5, 2, 8, 0.45) 75%, 
        rgba(5, 2, 8, 0.0) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* BOTTOM SHADING VIGNETTE */
    .vignette-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 360mm;
      background: linear-gradient(0deg, 
        rgba(5, 2, 8, 0.98) 0%, 
        rgba(5, 2, 8, 0.88) 45%, 
        rgba(5, 2, 8, 0.45) 75%, 
        rgba(5, 2, 8, 0.0) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* OUTER GOLD ORNATE BORDER */
    .ornate-border-outer {
      position: absolute;
      top: 8mm;
      left: 8mm;
      right: 8mm;
      bottom: 8mm;
      border: 3.5mm solid #d4af37;
      border-radius: 6mm;
      box-shadow: inset 0 0 30px rgba(0,0,0,0.95), 0 0 25px rgba(212, 175, 55, 0.5);
      z-index: 4;
      pointer-events: none;
    }

    .ornate-border-inner {
      position: absolute;
      top: 13mm;
      left: 13mm;
      right: 13mm;
      bottom: 13mm;
      border: 1mm dashed rgba(254, 240, 138, 0.55);
      border-radius: 4mm;
      z-index: 4;
      pointer-events: none;
    }

    /* CORNER GOTHIC RUNES */
    .corner-rune {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 26mm;
      font-weight: 900;
      color: #fef08a;
      line-height: 1;
      text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 4px 10px #000;
      z-index: 5;
      pointer-events: none;
    }
    .cr-tl { top: 15mm; left: 16mm; }
    .cr-tr { top: 15mm; right: 16mm; }
    .cr-bl { bottom: 15mm; left: 16mm; }
    .cr-br { bottom: 15mm; right: 16mm; }

    /* =========================================================================
       TOP HEADER (Title, Pre-title, Anchor instructions)
       Height: ~260mm
       ========================================================================= */
    .header-area {
      position: relative;
      z-index: 6;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding-top: 24mm;
      padding-left: 25mm;
      padding-right: 25mm;
    }

    .pre-badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 5mm 22mm;
      background: rgba(139, 0, 0, 0.85);
      border: 1.5mm solid #d4af37;
      border-radius: 20mm;
      box-shadow: 0 6px 25px rgba(0,0,0,0.9), 0 0 25px rgba(212, 175, 55, 0.5);
      margin-bottom: 7mm;
    }

    .pre-badge-text {
      font-family: 'Cinzel', serif;
      font-size: 14mm;
      font-weight: 900;
      letter-spacing: 5px;
      color: #fef08a;
      text-transform: uppercase;
      text-shadow: 0 2px 6px #000;
    }

    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 34mm;
      font-weight: 900;
      letter-spacing: 8px;
      text-transform: uppercase;
      line-height: 1.05;
      background: linear-gradient(180deg, #ffffff 0%, #fef08a 40%, #d4af37 75%, #996515 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 6px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 25px rgba(212, 175, 55, 0.6));
      margin-bottom: 6mm;
    }

    .sub-title {
      font-family: 'MedievalSharp', cursive;
      font-size: 18mm;
      font-style: italic;
      color: #fbcfe8;
      letter-spacing: 3px;
      text-shadow: 0 4px 15px rgba(0,0,0,0.95), 0 0 20px rgba(225, 29, 72, 0.6);
      margin-bottom: 7mm;
    }

    .strip-anchor-notice {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 3mm 16mm;
      background: rgba(0, 0, 0, 0.75);
      border: 1mm dashed rgba(212, 175, 55, 0.6);
      border-radius: 6mm;
      font-family: 'Inter', sans-serif;
      font-size: 7.5mm;
      font-weight: 800;
      letter-spacing: 2px;
      color: #fde68a;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(0,0,0,0.8);
      margin-top: 2mm;
    }

    /* =========================================================================
       VERTICAL STRIP CUTTING GUIDES (TIRAS)
       6 Strips of 133.33mm each
       ========================================================================= */
    .strips-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      display: flex;
      pointer-events: none;
    }

    .strip-column {
      flex: 1; /* 1/6th of 800mm = 133.33mm */
      height: 100%;
      position: relative;
    }

    /* Dashed cut line separating the strips (starts below header anchor: ~240mm down to 1980mm) */
    .cut-line {
      position: absolute;
      right: 0;
      top: 235mm; /* Preserves solid uncut top header anchor bar! */
      bottom: 24mm;
      width: 0;
      border-right: 0.8mm dashed rgba(255, 255, 255, 0.55);
      filter: drop-shadow(0 0 3px rgba(0,0,0,0.9));
    }

    /* Cut indicator icons at the top of each slit */
    .cut-start-marker {
      position: absolute;
      right: -8mm;
      top: 236mm;
      width: 16mm;
      height: 16mm;
      background: rgba(139, 0, 0, 0.9);
      border: 0.8mm solid #d4af37;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7mm;
      line-height: 1;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.9);
    }

    /* Strip Number Badges (discreet at the bottom) */
    .strip-badge-bottom {
      position: absolute;
      bottom: 26mm;
      left: 50%;
      transform: translateX(-50%);
      padding: 1.5mm 6mm;
      background: rgba(0,0,0,0.7);
      border: 0.6mm solid rgba(212, 175, 55, 0.6);
      border-radius: 3mm;
      font-size: 6mm;
      font-weight: 800;
      color: #fde68a;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    /* =========================================================================
       BOTTOM FOOTER (Dates, Portal Motto, Stamped Wax Seals)
       Height: ~210mm
       ========================================================================= */
    .footer-area {
      position: relative;
      z-index: 6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 34mm;
      padding-left: 32mm;
      padding-right: 32mm;
    }

    .footer-seal-group {
      width: 34mm;
      height: 34mm;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b91c1c 0%, #8b0000 70%, #450a0a 100%);
      border: 2mm solid #d4af37;
      box-shadow: 0 8px 24px rgba(0,0,0,0.95), inset 0 0 10mm rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .seal-letter-large {
      color: #fef08a;
      font-family: 'Cinzel', serif;
      font-size: 20mm;
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }

    .footer-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 3.5mm;
    }

    .portal-motto {
      font-family: 'MedievalSharp', cursive;
      font-size: 15mm;
      font-style: italic;
      color: #fde68a;
      letter-spacing: 2.5px;
      text-shadow: 0 3px 12px rgba(0,0,0,0.95), 0 0 18px rgba(212, 175, 55, 0.5);
    }

    .event-dates {
      font-family: 'Cinzel', serif;
      font-size: 11.5mm;
      font-weight: 800;
      letter-spacing: 4px;
      color: #ffffff;
      text-transform: uppercase;
      text-shadow: 0 2px 8px #000;
    }

    .clans-runes-bar {
      font-family: 'Cinzel', serif;
      font-size: 9mm;
      font-weight: 700;
      letter-spacing: 5px;
      color: #f59e0b;
      opacity: 0.95;
      margin-top: 1mm;
      text-shadow: 0 2px 8px #000;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* PRINT SPECIFIC */
    @media print {
      body {
        background: transparent !important;
      }
      .no-print {
        display: none !important;
      }
      .banner-wrapper {
        box-shadow: none !important;
        margin: 0 !important;
        width: 800mm !important;
        height: 2000mm !important;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation (Hidden in Print) -->
  <aside class="screen-toolbar no-print">
    <div class="toolbar-info">
      <h1>Photocall Puerta (80 × 200 cm) — Akelarre 2026</h1>
      <p>Cartel para puerta estándar cortado en tiras · Cortina de paso y photocall para zona de fiesta</p>
    </div>

    <div class="toolbar-buttons">
      <a href="/" class="btn btn-dark">← Web Principal</a>
      <a href="/organizacion" class="btn btn-dark">⚙️ Organización</a>
      <a href="PDFs_Photocall_Puerta/Photocall_Puerta_80x200cm_(Con_Guias_Tiras).pdf" download class="btn btn-purple" title="Descargar PDF con guías de corte punteadas">
        📥 PDF con Guías de Tiras
      </a>
      <a href="PDFs_Photocall_Puerta/Photocall_Puerta_80x200cm_(Sin_Guias_Limpio).pdf" download class="btn btn-gold" title="Descargar PDF limpio para imprenta/plotter">
        📥 PDF Imprenta Limpio
      </a>
      <button onclick="window.print()" class="btn btn-gold">
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  </aside>

  <!-- BANNER (800mm x 2000mm) -->
  <main class="banner-wrapper">
    
    <!-- Artwork Background -->
    <div class="art-background"></div>

    <!-- Vignettes for text legibility -->
    <div class="vignette-top"></div>
    <div class="vignette-bottom"></div>

    <!-- Ornate Borders -->
    <div class="ornate-border-outer"></div>
    <div class="ornate-border-inner"></div>

    <!-- Corner Runes -->
    <span class="corner-rune cr-tl">𝕬</span>
    <span class="corner-rune cr-tr">𝕬</span>
    <span class="corner-rune cr-bl">𝕬</span>
    <span class="corner-rune cr-br">𝕬</span>

    <!-- 1. TOP HEADER -->
    <header class="header-area">
      <div class="pre-badge">
        <span class="pre-badge-text">✦ ZONA DE FIESTA Y RITUAL ✦</span>
      </div>

      <h1 class="main-title">AKELARRE 2026</h1>
      <p class="sub-title">«Cruza el Umbral del Pecado»</p>

      ${showCutGuides ? `
      <div class="strip-anchor-notice no-print">
        <span>📌 BANDA SUPERIOR FIJA (NO CORTAR)</span>
        <span>·</span>
        <span>CORTAR TIRAS HACIA ABAJO ✂️</span>
      </div>
      ` : ''}
    </header>

    <!-- 2. VERTICAL STRIPS (6 TIRAS) -->
    ${showCutGuides ? `
    <div class="strips-container">
      ${strips.map((s, idx) => `
        <div class="strip-column">
          ${idx < strips.length - 1 ? `
            <div class="cut-line"></div>
            <div class="cut-start-marker">✂️</div>
          ` : ''}
          <div class="strip-badge-bottom">${s.label}</div>
        </div>
      `).join('\n')}
    </div>
    ` : ''}

    <!-- 3. BOTTOM FOOTER -->
    <footer class="footer-area">
      <div class="footer-seal-group">
        <span class="seal-letter-large">𝕬</span>
      </div>

      <div class="footer-center">
        <p class="portal-motto">«Sólo los dignos atraviesan el velo hacia el festín»</p>
        <p class="event-dates">30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026</p>
        <div class="clans-runes-bar">
          <span>🔥 PECADORES</span>
          <span>·</span>
          <span>🍷 ÉXTASIS</span>
          <span>·</span>
          <span>🖤 PLACER OSCURO</span>
          <span>·</span>
          <span>🕯️ VELA NEGRA</span>
        </div>
      </div>

      <div class="footer-seal-group">
        <span class="seal-letter-large">𝕬</span>
      </div>
    </footer>

  </main>

</body>
</html>`;
  }

  // 1. Generate HTML with cut guides
  const htmlWithGuides = buildHtml(true);
  const htmlWithGuidesPath = path.join(publicDir, 'photocall_puerta_con_guias.html');
  fs.writeFileSync(htmlWithGuidesPath, htmlWithGuides, 'utf8');

  // 2. Generate HTML clean (without cut guides)
  const htmlClean = buildHtml(false);
  const htmlCleanPath = path.join(publicDir, 'photocall_puerta_limpio.html');
  fs.writeFileSync(htmlCleanPath, htmlClean, 'utf8');

  // Copy default to root and public
  fs.writeFileSync(path.join(publicDir, 'photocall_puerta_80x200cm.html'), htmlWithGuides, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'photocall_puerta_80x200cm.html'), htmlWithGuides, 'utf8');
  console.log('✅ Generados archivos HTML interactivos en public/ y raíz.');

  // 3. Compile PDFs with Chrome Headless
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(chromePath)) {
    console.log('🖨️ Compilando PDFs de gran formato (800mm x 2000mm) para imprenta...');

    // 3.1 PDF with cut guides
    const pdfGuidesPath = path.join(outputDir, 'Photocall_Puerta_80x200cm_(Con_Guias_Tiras).pdf');
    try {
      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfGuidesPath}" --print-to-pdf-no-header "file://${htmlWithGuidesPath}"`, { stdio: 'ignore' });
      console.log('✅ Generado PDF con guías de tiras: Photocall_Puerta_80x200cm_(Con_Guias_Tiras).pdf');
    } catch (err) {
      console.error('Error generando PDF con guías:', err);
    }

    // 3.2 PDF clean
    const pdfCleanPath = path.join(outputDir, 'Photocall_Puerta_80x200cm_(Sin_Guias_Limpio).pdf');
    const pdfOfficialPublic = path.join(publicDir, 'Photocall_Puerta_Akelarre_80x200cm.pdf');
    try {
      execSync(`"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfCleanPath}" --print-to-pdf-no-header "file://${htmlCleanPath}"`, { stdio: 'ignore' });
      fs.copyFileSync(pdfCleanPath, pdfOfficialPublic);
      console.log('✅ Generado PDF limpio para plotter/imprenta: Photocall_Puerta_80x200cm_(Sin_Guias_Limpio).pdf');
    } catch (err) {
      console.error('Error generando PDF limpio:', err);
    }

    // 3.3 Create ZIP package
    const zipPath = path.join(publicDir, 'Photocall_Puerta_Akelarre_80x200cm.zip');
    try {
      execSync(`cd "${outputDir}" && zip -r "${zipPath}" ./*.pdf`, { stdio: 'ignore' });
      console.log('✅ Creado paquete ZIP para imprenta: public/Photocall_Puerta_Akelarre_80x200cm.zip');
    } catch (err) {
      console.warn('No se pudo empaquetar ZIP:', err);
    }

  } else {
    console.warn('Chrome no encontrado en la ruta esperada, HTML listo para imprimir.');
  }

  console.log('🎉 ¡Photocall Puerta completado!');
}

main().catch(console.error);
