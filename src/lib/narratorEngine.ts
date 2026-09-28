'use client';

import { soundEngine } from './soundEngine';

export const NARRATOR_SCRIPT = 
  "Almas mortales... Habéis cruzado las puertas de la mansión. " +
  "Del 30 de octubre al 1 de noviembre celebraremos el gran fin de semana del Akelarre en una casa rural completa. " +
  "Cuarenta almas, divididas en seis clanes ancestrales, que competirán en rituales y juegos secretos. " +
  "La noche del viernes comenzaremos con una gran fiesta sin temática... pero con código de vestimenta obligatorio: sexy. " +
  "Y la gran noche del sábado, celebraremos el auténtico aquelarre... donde el código sagrado será: brujas y brujos erótico. " +
  "El precio del fin de semana completo es de doscientos treinta y cinco euros por pareja, mediante Bizum a Oscar antes del 6 de octubre. " +
  "Acuérdate de hacer tu pago y no esperes al último momento. " +
  "Solo quienes sellen el pacto sagrado... descubrirán a qué clan pertenecen sus almas.";

class NarratorEngine {
  private isSpeaking: boolean = false;
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();

  public subscribe(listener: (isSpeaking: boolean) => void) {
    this.listeners.add(listener);
    listener(this.isSpeaking);
    return () => this.listeners.delete(listener);
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach((l) => l(speaking));
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  private initAudio() {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      this.audio = new Audio('/audio/locucion_akelarre.mp3');
      this.audio.preload = 'auto';

      this.audio.onplay = () => {
        this.notify(true);
        soundEngine.duckAmbient(true);
      };

      this.audio.onended = () => {
        this.notify(false);
        soundEngine.duckAmbient(false);
      };

      this.audio.onpause = () => {
        this.notify(false);
        soundEngine.duckAmbient(false);
      };

      this.audio.onerror = () => {
        // Fallback to speech synthesis if audio file fails
        this.fallbackSpeechSynthesis();
      };
    }
    return this.audio;
  }

  public speak() {
    if (typeof window === 'undefined') return;

    const audio = this.initAudio();
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy
          this.notify(false);
        });
      }
    } else {
      this.fallbackSpeechSynthesis();
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.notify(false);
    soundEngine.duckAmbient(false);
  }

  public toggle() {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speak();
    }
  }

  private fallbackSpeechSynthesis() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(NARRATOR_SCRIPT);
      utterance.lang = 'es-ES';
      utterance.rate = 0.88;
      utterance.pitch = 0.85;

      utterance.onstart = () => {
        this.notify(true);
        soundEngine.duckAmbient(true);
      };
      utterance.onend = () => {
        this.notify(false);
        soundEngine.duckAmbient(false);
      };
      utterance.onerror = () => {
        this.notify(false);
        soundEngine.duckAmbient(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false);
    }
  }
}

export const narratorEngine = new NarratorEngine();
