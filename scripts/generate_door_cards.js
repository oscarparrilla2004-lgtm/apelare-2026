const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function main() {
  const couplesDataPath = path.join(__dirname, '..', 'couples_data.json');
  if (!fs.existsSync(couplesDataPath)) {
    console.error('couples_data.json not found');
    process.exit(1);
  }

  const couples = JSON.parse(fs.readFileSync(couplesDataPath, 'utf8'));

  const optionsHtml = couples.map(c => 
    `<option value="pareja_${c.coupleIndex}">Pareja #${c.coupleIndex}: ${c.chica.name} & ${c.chico.name}</option>`
  ).join('\n        ');

  const sheetsHtml = couples.map(c => `
    <!-- HOJA A4 HORIZONTAL PAREJA #${c.coupleIndex} -->
    <section class="door-sheet" id="pareja_${c.coupleIndex}">
      <!-- Sheet Top Bar -->
      <div class="sheet-header">
        <div class="sheet-header-left">
          <span>🕯️</span>
          <span>AKELARRE DE BRUJAS 2026</span>
        </div>
        <div class="sheet-header-center">
          HABITACIÓN · PAREJA #${c.coupleIndex}: <span>${c.chica.name}</span> & <span>${c.chico.name}</span>
        </div>
        <div class="sheet-header-right">
          <span>ACCESO PRIVADO</span>
          <span>🗝️</span>
        </div>
      </div>

      <!-- Cards Row -->
      <div class="cards-row">
        <!-- Cut divider line -->
        <div class="cut-divider">
          <span class="cut-icon">✂</span>
          <span class="cut-icon">✦</span>
          <span class="cut-icon">✂</span>
        </div>

        <!-- TARJETA IZQUIERDA: CHICA (BRUJA) -->
        <article class="invitation-card">
          <div class="card-inner-frame"></div>
          <span class="corner-rune corner-tl">𝕬</span>
          <span class="corner-rune corner-tr">𝕬</span>
          <span class="corner-rune corner-bl">✦</span>
          <span class="corner-rune corner-br">✦</span>

          <!-- Role Pill -->
          <div class="card-role-badge">
            <span>🌙</span>
            <span>INVITACIÓN SAGRADA · BRUJA</span>
          </div>

          <!-- Mortal Name & Alias -->
          <div class="card-identity">
            <h1 class="guest-mortal-name">${c.chica.name}</h1>
            <span class="guest-witch-alias">«${c.chica.alias}»</span>
          </div>

          <!-- Clan Shield Box -->
          <div class="card-clan-box">
            <div class="clan-title">
              <span>${c.chica.teamIcon}</span>
              <span>CLAN: ${c.chica.teamName}</span>
            </div>
            <div class="clan-tagline">&ldquo;${c.chica.teamTagline}&rdquo;</div>
          </div>

          <!-- Conclave Details Box -->
          <div class="card-event-box">
            <div class="event-item">
              <span>🏰</span>
              <span><strong>Mansión del Akelarre</strong> · Habitación Privada</span>
            </div>
            <div class="event-item">
              <span>📅</span>
              <span><strong>30 Octubre – 1 Noviembre 2026</strong></span>
            </div>
            <div class="event-item">
              <span>🌙</span>
              <span><strong>Viernes Noche:</strong> Fiesta Dress Code Sexy</span>
            </div>
            <div class="event-item">
              <span>🎭</span>
              <span><strong>Sábado Noche:</strong> Gran Akelarre Brujas & Brujos</span>
            </div>
          </div>

          <!-- Footer with Wax Seal & QR Code -->
          <div class="card-footer">
            <div class="wax-seal-wrapper">
              <div class="wax-seal">𝕬</div>
              <div class="wax-seal-text">
                SELLO OFICIAL<br />AKELARRE 2026<br />PACTO SELLADO
              </div>
            </div>

            <div class="qr-container">
              <img src="${c.chica.qr}" alt="QR ${c.chica.name}" class="qr-img" />
              <div class="qr-info">
                <span class="qr-scan-label">ESCANEA TU LLAVE</span>
                <span class="qr-token-code">${c.chica.token.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </article>

        <!-- TARJETA DERECHA: CHICO (BRUJO) -->
        <article class="invitation-card">
          <div class="card-inner-frame"></div>
          <span class="corner-rune corner-tl">𝕬</span>
          <span class="corner-rune corner-tr">𝕬</span>
          <span class="corner-rune corner-bl">✦</span>
          <span class="corner-rune corner-br">✦</span>

          <!-- Role Pill -->
          <div class="card-role-badge">
            <span>⚡</span>
            <span>INVITACIÓN SAGRADA · BRUJO</span>
          </div>

          <!-- Mortal Name & Alias -->
          <div class="card-identity">
            <h1 class="guest-mortal-name">${c.chico.name}</h1>
            <span class="guest-witch-alias">«${c.chico.alias}»</span>
          </div>

          <!-- Clan Shield Box -->
          <div class="card-clan-box">
            <div class="clan-title">
              <span>${c.chico.teamIcon}</span>
              <span>CLAN: ${c.chico.teamName}</span>
            </div>
            <div class="clan-tagline">&ldquo;${c.chico.teamTagline}&rdquo;</div>
          </div>

          <!-- Conclave Details Box -->
          <div class="card-event-box">
            <div class="event-item">
              <span>🏰</span>
              <span><strong>Mansión del Akelarre</strong> · Habitación Privada</span>
            </div>
            <div class="event-item">
              <span>📅</span>
              <span><strong>30 Octubre – 1 Noviembre 2026</strong></span>
            </div>
            <div class="event-item">
              <span>🌙</span>
              <span><strong>Viernes Noche:</strong> Fiesta Dress Code Sexy</span>
            </div>
            <div class="event-item">
              <span>🎭</span>
              <span><strong>Sábado Noche:</strong> Gran Akelarre Brujas & Brujos</span>
            </div>
          </div>

          <!-- Footer with Wax Seal & QR Code -->
          <div class="card-footer">
            <div class="wax-seal-wrapper">
              <div class="wax-seal">𝕬</div>
              <div class="wax-seal-text">
                SELLO OFICIAL<br />AKELARRE 2026<br />PACTO SELLADO
              </div>
            </div>

            <div class="qr-container">
              <img src="${c.chico.qr}" alt="QR ${c.chico.name}" class="qr-img" />
              <div class="qr-info">
                <span class="qr-scan-label">ESCANEA TU LLAVE</span>
                <span class="qr-token-code">${c.chico.token.toUpperCase()}</span>
              </div>
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
  <title>Tarjetas de Invitación por Parejas — Akelarre 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800;900&family=MedievalSharp&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-page: #070509;
      --bg-card: #0f0a15;
      --bg-card-gradient: radial-gradient(circle at 50% 20%, #200f24 0%, #0d0714 70%, #050208 100%);
      --text-main: #ffffff;
      --text-muted: #e2d9cc;
      --gold-primary: #d4af37;
      --gold-light: #fef08a;
      --gold-dark: #8c6d1f;
      --gold-glow: rgba(212, 175, 55, 0.45);
      --border-gold: #d4af37;
      --border-inner: rgba(212, 175, 55, 0.4);
      --box-clan-bg: rgba(0, 0, 0, 0.6);
      --box-details-bg: rgba(0, 0, 0, 0.4);
      --wax-red: #8b0000;
      --sheet-header-bg: rgba(0, 0, 0, 0.7);
      --divider-color: rgba(212, 175, 55, 0.35);
    }

    body.parchment {
      --bg-page: #fbf7ee;
      --bg-card: #f5eedb;
      --bg-card-gradient: linear-gradient(135deg, #fffcf5 0%, #f4ebd6 100%);
      --text-main: #1c140c;
      --text-muted: #4a3828;
      --gold-primary: #8a6a1b;
      --gold-light: #684f11;
      --gold-dark: #473507;
      --gold-glow: rgba(138, 106, 27, 0.2);
      --border-gold: #8a6a1b;
      --border-inner: rgba(138, 106, 27, 0.4);
      --box-clan-bg: rgba(255, 255, 255, 0.7);
      --box-details-bg: rgba(255, 255, 255, 0.6);
      --wax-red: #851313;
      --sheet-header-bg: #ece2c8;
      --divider-color: rgba(138, 106, 27, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #1a1622;
      font-family: 'Inter', sans-serif;
      color: var(--text-main);
      -webkit-font-smoothing: antialiased;
    }

    /* Print Controls Bar */
    .controls-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #11091a;
      border-bottom: 2px solid var(--gold-primary);
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.8);
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
      color: var(--gold-light);
      letter-spacing: 1px;
      text-transform: uppercase;
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

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 1px solid rgba(212, 175, 55, 0.5);
    }

    .btn-secondary:hover {
      background: rgba(212, 175, 55, 0.2);
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

    /* A4 Landscape Sheet */
    .door-sheet {
      width: 297mm;
      height: 210mm;
      max-width: 297mm;
      max-height: 210mm;
      background: var(--bg-page);
      padding: 7mm 9mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6);
      page-break-after: always;
      break-after: page;
    }

    /* Sheet Header */
    .sheet-header {
      height: 11mm;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1.5px solid var(--border-gold);
      background: var(--sheet-header-bg);
      border-radius: 6px;
      padding: 0 14px;
    }

    .sheet-header-left {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-primary);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sheet-header-center {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 900;
      color: var(--text-main);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .sheet-header-center span {
      color: var(--gold-primary);
    }

    .sheet-header-right {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: var(--gold-primary);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Cards Row */
    .cards-row {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 6mm;
      height: 182mm;
      width: 100%;
      position: relative;
    }

    /* Center Cut Divider */
    .cut-divider {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 0;
      border-left: 1.5px dashed var(--divider-color);
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      pointer-events: none;
    }

    .cut-icon {
      font-size: 11px;
      background: var(--bg-page);
      color: var(--gold-primary);
      padding: 2px 4px;
      border-radius: 4px;
      border: 1px solid var(--border-gold);
    }

    /* Individual Card */
    .invitation-card {
      width: 136mm;
      height: 182mm;
      background: var(--bg-card);
      background-image: var(--bg-card-gradient);
      border: 2.5px solid var(--border-gold);
      border-radius: 10px;
      padding: 7mm 7mm 5mm 7mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 25px rgba(0,0,0,0.5);
    }

    /* Inner Inset Dashed Border */
    .card-inner-frame {
      position: absolute;
      top: 3mm;
      left: 3mm;
      right: 3mm;
      bottom: 3mm;
      border: 1px dashed var(--border-inner);
      border-radius: 7px;
      pointer-events: none;
    }

    /* Corner Gothic Runes */
    .corner-rune {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 800;
      color: var(--gold-primary);
      line-height: 1;
      pointer-events: none;
    }
    .corner-tl { top: 4.5mm; left: 4.5mm; }
    .corner-tr { top: 4.5mm; right: 4.5mm; }
    .corner-bl { bottom: 4.5mm; left: 4.5mm; }
    .corner-br { bottom: 4.5mm; right: 4.5mm; }

    /* Card Top Role Badge */
    .card-role-badge {
      align-self: center;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 12px;
      border-radius: 9999px;
      border: 1px solid var(--border-gold);
      background: rgba(0, 0, 0, 0.4);
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      font-weight: 700;
      color: var(--gold-light);
      letter-spacing: 2px;
      text-transform: uppercase;
      z-index: 2;
    }

    /* Name & Alias Area */
    .card-identity {
      text-align: center;
      margin-top: 3px;
      margin-bottom: 3px;
      z-index: 2;
    }

    .guest-mortal-name {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold-light);
      line-height: 1.1;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }

    .guest-witch-alias {
      font-family: 'MedievalSharp', cursive;
      font-size: 17px;
      color: var(--gold-primary);
      margin-top: 3px;
      letter-spacing: 1px;
      display: block;
      font-weight: bold;
    }

    /* Clan Box */
    .card-clan-box {
      background: var(--box-clan-bg);
      border: 1.5px solid var(--border-gold);
      border-radius: 8px;
      padding: 6px 10px;
      text-align: center;
      margin: 3px 0;
      z-index: 2;
    }

    .clan-title {
      font-family: 'Cinzel', serif;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--gold-light);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .clan-tagline {
      font-family: 'MedievalSharp', cursive;
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 2px;
      font-style: italic;
    }

    /* Event Conclave Details Box */
    .card-event-box {
      background: var(--box-details-bg);
      border: 1px solid var(--border-inner);
      border-radius: 8px;
      padding: 6px 10px;
      margin: 3px 0;
      font-size: 10px;
      line-height: 1.45;
      color: var(--text-muted);
      z-index: 2;
    }

    .event-item {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }
    .event-item:last-child {
      margin-bottom: 0;
    }
    .event-item strong {
      color: var(--gold-light);
      font-weight: 700;
    }

    /* Card Bottom Footer: Wax Seal + QR Code */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 4px;
      padding-top: 5px;
      border-top: 1px solid var(--border-inner);
      z-index: 2;
    }

    /* Wax Seal */
    .wax-seal-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .wax-seal {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b91c1c 0%, var(--wax-red) 70%, #450a0a 100%);
      border: 2px solid var(--border-gold);
      box-shadow: 0 0 10px rgba(185, 28, 28, 0.6), inset 0 0 6px rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold-light);
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 900;
      flex-shrink: 0;
    }

    .wax-seal-text {
      font-family: 'Cinzel', serif;
      font-size: 8.5px;
      line-height: 1.25;
      color: var(--gold-primary);
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    /* QR Code Container */
    .qr-container {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1.5px solid var(--border-gold);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .qr-img {
      width: 44px;
      height: 44px;
      display: block;
    }

    .qr-info {
      text-align: left;
    }

    .qr-scan-label {
      font-size: 7.5px;
      font-weight: 800;
      color: #713f12;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
    }

    .qr-token-code {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      font-weight: 900;
      color: #000000;
      display: block;
      letter-spacing: 0.5px;
    }

    /* PRINT SPECIFIC STYLES */
    @page {
      size: A4 landscape;
      margin: 0;
    }

    @media print {
      body {
        background: transparent !important;
        color-adjust: exact !important;
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
<body id="mainBody">

  <!-- Sticky Controls Header (hidden on print) -->
  <header class="controls-bar no-print">
    <div class="controls-left">
      <span style="font-size: 24px;">🗝️</span>
      <div>
        <div class="controls-title">Tarjetas de Invitación para Puertas de Habitación</div>
        <div style="font-size: 11px; color: #a1a1aa;">2 tarjetas por hoja A4 Horizontal: Chica (Izquierda) & Chico (Derecha)</div>
      </div>
    </div>

    <div class="controls-actions">
      <!-- Filter couple -->
      <select id="coupleFilter" class="select-dropdown" onchange="filterCouples()">
        <option value="all">Imprimir Todas las Parejas (23 Hojas A4)</option>
        ${optionsHtml}
      </select>

      <!-- Toggle parchment/dark -->
      <button class="btn btn-secondary" onclick="toggleTheme()">
        🌓 Modo Ahorro Tinta / Oscuro
      </button>

      <!-- Print Button -->
      <button class="btn btn-primary" onclick="window.print()">
        🖨️ IMPRIMIR A4 HORIZONTAL
      </button>
    </div>
  </header>

  <!-- Printable Area -->
  <main class="print-container">
${sheetsHtml}
  </main>

  <script>
    function toggleTheme() {
      document.body.classList.toggle('parchment');
    }

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
  console.log('Successfully generated public/tarjetas_puertas_A4_horizontal.html and root tarjetas_puertas_A4_horizontal.html!');
}

main();
