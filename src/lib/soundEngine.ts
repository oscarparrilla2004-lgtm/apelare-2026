class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Music state
  private isMusicPlaying: boolean = false;
  private musicGain: GainNode | null = null;
  private musicInterval: NodeJS.Timeout | null = null;

  // Fire sound state
  private isFirePlaying: boolean = false;
  private fireGain: GainNode | null = null;
  private fireInterval: NodeJS.Timeout | null = null;

  // Rain sound state
  private isRainPlaying: boolean = false;
  private rainGain: GainNode | null = null;
  private rainNoiseNode: AudioBufferSourceNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    } else {
      this.startAmbient();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getSoundLayers() {
    return {
      isMuted: this.isMuted,
      music: this.isMusicPlaying,
      fire: this.isFirePlaying,
      rain: this.isRainPlaying,
    };
  }

  /**
   * Inicia TODAS las atmósferas sonoras por defecto (Música + Fuego + Lluvia)
   */
  public startAmbient() {
    if (this.isMuted) return;
    this.startWitchcraftMusic();
    this.startFire();
    this.startRain();
  }

  public stopAll() {
    this.stopWitchcraftMusic();
    this.stopFire();
    this.stopRain();
  }

  /**
   * Atenúa o restaura la música y ambiente durante la locución hablada
   */
  public duckAmbient(duck: boolean) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.musicGain) {
        this.musicGain.gain.linearRampToValueAtTime(duck ? 0.03 : 0.12, now + 0.4);
      }
      if (this.fireGain) {
        this.fireGain.gain.linearRampToValueAtTime(duck ? 0.02 : 0.08, now + 0.4);
      }
    } catch {}
  }

  /**
   * 1. Generador de Música de Brujería Mística (Ritual Dark Ambient)
   */
  public startWitchcraftMusic() {
    this.initCtx();
    if (!this.ctx || this.isMusicPlaying || this.isMuted) return;

    try {
      this.isMusicPlaying = true;
      const now = this.ctx.currentTime;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.12, now + 3);
      masterGain.connect(this.ctx.destination);
      this.musicGain = masterGain;

      // Sub-drone 41.2 Hz (E1)
      const subOsc = this.ctx.createOscillator();
      const subFilter = this.ctx.createBiquadFilter();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(41.2, now);
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(90, now);
      subOsc.connect(subFilter);
      subFilter.connect(masterGain);
      subOsc.start();

      const witchNotes = [164.81, 196.0, 246.94, 311.13, 329.63, 392.0, 493.88];
      let noteIndex = 0;

      this.musicInterval = setInterval(() => {
        if (!this.ctx || this.isMuted || !this.isMusicPlaying) return;

        const currentTime = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const freq = witchNotes[noteIndex % witchNotes.length];
        noteIndex++;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, currentTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, currentTime);
        filter.Q.setValueAtTime(3, currentTime);

        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(0.18, currentTime + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 4.5);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(currentTime);
        osc.stop(currentTime + 4.8);

        // Tambor ritual
        if (noteIndex % 2 === 0) {
          const drumOsc = this.ctx.createOscillator();
          const drumGain = this.ctx.createGain();
          drumOsc.type = 'sine';
          drumOsc.frequency.setValueAtTime(65, currentTime);
          drumOsc.frequency.exponentialRampToValueAtTime(25, currentTime + 0.5);

          drumGain.gain.setValueAtTime(0.35, currentTime);
          drumGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.6);

          drumOsc.connect(drumGain);
          drumGain.connect(masterGain);
          drumOsc.start(currentTime);
          drumOsc.stop(currentTime + 0.6);
        }
      }, 3500);
    } catch {
      // Audio fallback
    }
  }

  public stopWitchcraftMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }
    this.isMusicPlaying = false;
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopWitchcraftMusic();
      return false;
    } else {
      this.isMuted = false;
      this.startWitchcraftMusic();
      return true;
    }
  }

  /**
   * 2. Generador Procedural de Crepitar de Hoguera (Fire Crackle)
   */
  public startFire() {
    this.initCtx();
    if (!this.ctx || this.isFirePlaying || this.isMuted) return;

    try {
      this.isFirePlaying = true;
      const now = this.ctx.currentTime;
      const fireGain = this.ctx.createGain();
      fireGain.gain.setValueAtTime(0.08, now);
      fireGain.connect(this.ctx.destination);
      this.fireGain = fireGain;

      // Crackle pops interval
      this.fireInterval = setInterval(() => {
        if (!this.ctx || !this.isFirePlaying || this.isMuted) return;
        const cTime = this.ctx.currentTime;

        // Micro-pop burst
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        const popFilter = this.ctx.createBiquadFilter();

        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(300 + Math.random() * 1200, cTime);

        popFilter.type = 'highpass';
        popFilter.frequency.setValueAtTime(800 + Math.random() * 800, cTime);

        popGain.gain.setValueAtTime(0.04 + Math.random() * 0.08, cTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, cTime + 0.03 + Math.random() * 0.05);

        popOsc.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(fireGain);

        popOsc.start(cTime);
        popOsc.stop(cTime + 0.1);
      }, 140);
    } catch {
      // Audio fallback
    }
  }

  public stopFire() {
    if (this.fireInterval) {
      clearInterval(this.fireInterval);
      this.fireInterval = null;
    }
    if (this.fireGain && this.ctx) {
      this.fireGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    }
    this.isFirePlaying = false;
  }

  public toggleFire(): boolean {
    if (this.isFirePlaying) {
      this.stopFire();
      return false;
    } else {
      this.isMuted = false;
      this.startFire();
      return true;
    }
  }

  /**
   * 3. Generador Procedural de Tormenta Nocturna (Lluvia mística)
   */
  public startRain() {
    this.initCtx();
    if (!this.ctx || this.isRainPlaying || this.isMuted) return;

    try {
      this.isRainPlaying = true;
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink noise synthesis
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      rainGain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 2);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.rainNoiseNode = whiteNoise;
      this.rainGain = rainGain;
    } catch {
      // Audio fallback
    }
  }

  public stopRain() {
    if (this.rainNoiseNode) {
      try {
        this.rainNoiseNode.stop();
        this.rainNoiseNode.disconnect();
      } catch {}
      this.rainNoiseNode = null;
    }
    this.isRainPlaying = false;
  }

  public toggleRain(): boolean {
    if (this.isRainPlaying) {
      this.stopRain();
      return false;
    } else {
      this.isMuted = false;
      this.startRain();
      return true;
    }
  }

  /**
   * Sound effects
   */
  public playCharge(progress: number) {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 180 + progress * 340;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03 * progress, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  public playClack() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playMechanicalClack() {
    this.playClack();
  }

  public playDoorRumble() {
    this.playDoorForceOpen();
  }

  public playDoorCreak() {
    this.playDoorForceOpen();
  }

  /**
   * 1. Inicio de apertura lenta con chirrido de madera pesada
   */
  public playDoorCreakInitial() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(460, now);
      filter.Q.setValueAtTime(3.8, now);

      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(390, now + 0.4);
      osc.frequency.linearRampToValueAtTime(220, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {}
  }

  /**
   * 2. Golpe seco y rascado cuando la puerta se atasca de golpe
   */
  public playDoorStuck() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // Golpe sordo de madera encallada (Thud)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(95, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.2);
      thudGain.gain.setValueAtTime(0.45, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.25);

      // Chirrido de fricción brusco al frenarse
      const scrapeOsc = this.ctx.createOscillator();
      const scrapeGain = this.ctx.createGain();
      const scrapeFilter = this.ctx.createBiquadFilter();
      scrapeOsc.type = 'sawtooth';
      scrapeFilter.type = 'bandpass';
      scrapeFilter.frequency.setValueAtTime(580, now);
      scrapeFilter.Q.setValueAtTime(5.0, now);
      scrapeOsc.frequency.setValueAtTime(420, now);
      scrapeOsc.frequency.exponentialRampToValueAtTime(160, now + 0.35);
      scrapeGain.gain.setValueAtTime(0.3, now);
      scrapeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      scrapeOsc.connect(scrapeFilter);
      scrapeFilter.connect(scrapeGain);
      scrapeGain.connect(this.ctx.destination);
      scrapeOsc.start(now);
      scrapeOsc.stop(now + 0.4);
    } catch {}
  }

  /**
   * Sonido de Ruleta Mística del Oráculo (Tic mecánico/mágico que decelera)
   */
  public playRouletteTick(progress: number = 0) {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Pitch rises as the roulette nears its final choice
      const baseFreq = 580 + progress * 280;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.35, now + 0.05);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.4, now);
      filter.Q.setValueAtTime(5.0, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * 3. Desbloqueo forzado y apertura completa majestuosa con gran crujido y retumbe
   */
  public playDoorForceOpen() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // Gran chirrido largo y estridente de bisagras antiguas
      const creakOsc = this.ctx.createOscillator();
      const creakGain = this.ctx.createGain();
      const creakFilter = this.ctx.createBiquadFilter();

      creakOsc.type = 'sawtooth';
      creakFilter.type = 'bandpass';
      creakFilter.frequency.setValueAtTime(510, now);
      creakFilter.Q.setValueAtTime(4.2, now);

      creakOsc.frequency.setValueAtTime(310, now);
      creakOsc.frequency.linearRampToValueAtTime(540, now + 0.4);
      creakOsc.frequency.linearRampToValueAtTime(380, now + 1.1);
      creakOsc.frequency.linearRampToValueAtTime(480, now + 1.8);
      creakOsc.frequency.exponentialRampToValueAtTime(160, now + 2.8);

      creakGain.gain.setValueAtTime(0, now);
      creakGain.gain.linearRampToValueAtTime(0.28, now + 0.1);
      creakGain.gain.linearRampToValueAtTime(0.22, now + 0.8);
      creakGain.gain.linearRampToValueAtTime(0.26, now + 1.6);
      creakGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      creakOsc.connect(creakFilter);
      creakFilter.connect(creakGain);
      creakGain.connect(this.ctx.destination);

      creakOsc.start(now);
      creakOsc.stop(now + 3.0);

      // Retumbe de bajos de portones masivos
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();
      bassOsc.type = 'sawtooth';
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(120, now);

      bassOsc.frequency.setValueAtTime(60, now);
      bassOsc.frequency.linearRampToValueAtTime(28, now + 3.2);

      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      bassGain.gain.linearRampToValueAtTime(0.22, now + 2.0);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 3.5);
    } catch {}
  }

  public playWaxSeal() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public playSecretChime() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch {}
  }

  /**
   * 🐺 Aullido de Lobo Procedural Realista para el Dictamen del Clan
   */
  public playWolfHowl() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 3.6;

      // 1. Vocal cord oscillator
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';

      // Pitch curve: low growl (320Hz) -> rising howl (680Hz) -> mournful dip (260Hz)
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.9);
      osc.frequency.setValueAtTime(680, now + 1.8);
      osc.frequency.exponentialRampToValueAtTime(260, now + duration);

      // Vibrato LFO (5.5 Hz canine tremolo)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, now);
      lfoGain.gain.setValueAtTime(14, now);
      lfo.connect(osc.frequency);
      lfo.start(now + 0.4);
      lfo.stop(now + duration);

      // 2. Vocal tract formant filter ("Awoooo" formant: 850Hz -> 1100Hz -> 600Hz)
      const formant = this.ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.Q.setValueAtTime(4.0, now);
      formant.frequency.setValueAtTime(750, now);
      formant.frequency.linearRampToValueAtTime(1150, now + 0.9);
      formant.frequency.linearRampToValueAtTime(600, now + duration);

      // 3. Amplitude envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.6);
      gain.gain.setValueAtTime(0.22, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // 4. Subtle distance delay / echo for eerie nighttime landscape
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.28, now);
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.35, now);

      osc.connect(formant);
      formant.connect(gain);
      gain.connect(this.ctx.destination);

      // Reverb delay loop
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.ctx.destination);
      delayGain.connect(delay);

      osc.start(now);
      osc.stop(now + duration + 0.5);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
