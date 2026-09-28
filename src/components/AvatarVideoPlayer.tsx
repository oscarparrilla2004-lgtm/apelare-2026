'use client';

import React, { useRef, useState, useEffect } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

export const AvatarVideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('1:04');
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      soundEngine.duckAmbient(false);
    } else {
      setHasStartedOnce(true);
      soundEngine.duckAmbient(true);
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
        }
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (!isPlaying) togglePlay();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 64;
    setProgress((cur / dur) * 100);
    setCurrentTime(formatTime(cur));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration || 64));
  };

  const handleEnded = () => {
    setIsPlaying(false);
    soundEngine.duckAmbient(false);
    setProgress(100);
  };

  useEffect(() => {
    return () => {
      soundEngine.duckAmbient(false);
    };
  }, []);

  return (
    <div className="w-full max-w-lg my-2 z-20 flex flex-col items-center">
      {/* Full-width container with object-contain so Oscar is NEVER cropped */}
      <div className="relative w-full rounded-2xl p-1 bg-gradient-to-b from-[#3a2212] via-[#1a0e1c] to-[#0a050d] border-2 border-gold/70 shadow-[0_15px_45px_rgba(0,0,0,0.95)] overflow-hidden">
        <div
          onClick={togglePlay}
          className="relative w-full bg-black rounded-xl overflow-hidden cursor-pointer flex items-center justify-center min-h-[240px] sm:min-h-[300px]"
        >
          {/* Uncropped 100% visible video with object-contain */}
          <video
            ref={videoRef}
            src="/video/avatar_oscar.mp4"
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="w-full h-auto max-h-[60vh] object-contain object-center"
          />

          {/* Big Center Golden Play Button when Paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 transition-all animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-amber-500 via-gold to-yellow-400 border-2 border-white flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.95)] hover:scale-110 active:scale-95 transition-all">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
              </div>
              <span className="text-xs sm:text-sm font-gothic tracking-widest text-amber-200 uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/70 px-4 py-1.5 rounded-full border border-gold/40">
                {hasStartedOnce ? 'REANUDAR MENSAJE' : 'TOCA PARA ESCUCHAR A OSCAR'}
              </span>
            </div>
          )}

          {/* Top Video Header Overlay */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md pointer-events-none">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-sans tracking-wider uppercase font-bold">
              <Sparkles className="w-3 h-3 text-gold animate-spin-slow" />
              <span>INVOCACIÓN DE OSCAR</span>
            </div>
            <span className="text-[10px] font-mono text-amber-200/90 font-bold">
              {currentTime} / {duration}
            </span>
          </div>

          {/* Bottom Custom Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-1.5"
          >
            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-gold to-yellow-300 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-0.5 text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 text-gold hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-gold" /> : <Play className="w-4 h-4 fill-gold" />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gold" />}
                </button>
              </div>

              <span className="text-[10px] font-sans text-amber-200/70">
                Akelarre 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] font-sans text-amber-200/90 italic text-center pt-1.5">
        «Toca el vídeo para escuchar el mensaje completo de Oscar»
      </p>
    </div>
  );
};
