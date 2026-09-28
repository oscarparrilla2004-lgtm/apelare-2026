'use client';

import React, { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  pulseSpeed: number;
}

interface Rune {
  x: number;
  y: number;
  char: string;
  size: number;
  opacity: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

const RUNE_CHARS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];

export const ParticleBackground: React.FC<{ intensity?: 'normal' | 'high' }> = ({ intensity = 'normal' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const emberCount = intensity === 'high' ? 70 : 45;
    const runeCount = intensity === 'high' ? 14 : 8;

    const embers: Ember[] = [];
    const runes: Rune[] = [];

    const colors = [
      'rgba(212, 175, 55, ', // Gold
      'rgba(180, 20, 20, ',  // Blood red
      'rgba(243, 229, 171, ',// Soft gold
      'rgba(139, 0, 0, ',    // Dark red
    ];

    for (let i = 0; i < emberCount; i++) {
      const maxOp = Math.random() * 0.7 + 0.2;
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * maxOp,
        maxOpacity: maxOp,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    for (let i = 0; i < runeCount; i++) {
      runes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)],
        size: Math.floor(Math.random() * 16 + 14),
        opacity: Math.random() * 0.15 + 0.05,
        speedY: -(Math.random() * 0.3 + 0.1),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render embers
      embers.forEach((ember) => {
        ember.y += ember.speedY;
        ember.x += ember.speedX + Math.sin(time + ember.y * 0.01) * 0.2;
        ember.opacity += Math.sin(time * 5) * ember.pulseSpeed;

        if (ember.opacity < 0) ember.opacity = 0.05;
        if (ember.opacity > ember.maxOpacity) ember.opacity = ember.maxOpacity;

        if (ember.y < -10) {
          ember.y = canvas.height + 10;
          ember.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `${ember.color}${ember.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ember.color.includes('212') ? 'rgba(212,175,55,0.8)' : 'rgba(180,20,20,0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render floating runes
      runes.forEach((rune) => {
        rune.y += rune.speedY;
        rune.rotation += rune.rotationSpeed;

        if (rune.y < -20) {
          rune.y = canvas.height + 20;
          rune.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(rune.x, rune.y);
        ctx.rotate(rune.rotation);
        ctx.font = `${rune.size}px serif`;
        ctx.fillStyle = `rgba(212, 175, 55, ${rune.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rune.char, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
