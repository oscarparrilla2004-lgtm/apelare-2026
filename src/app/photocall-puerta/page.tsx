'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Scissors,
  Eye,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  DoorOpen,
} from 'lucide-react';

export default function PhotocallPuertaPage() {
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 6 strips for the 80cm door
  const strips = [
    { id: 1, label: 'Tira 1', side: 'left', angle: -25, z: 20 },
    { id: 2, label: 'Tira 2', side: 'left', angle: -45, z: 40 },
    { id: 3, label: 'Tira 3 (Centro)', side: 'left', angle: -70, z: 60 },
    { id: 4, label: 'Tira 4 (Centro)', side: 'right', angle: 70, z: 60 },
    { id: 5, label: 'Tira 5', side: 'right', angle: 45, z: 40 },
    { id: 6, label: 'Tira 6', side: 'right', angle: 25, z: 20 },
  ];

  return (
    <div className="min-h-screen bg-[#07030b] text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0d0814]/95 backdrop-blur-md border-b border-gold/40 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/organizacion"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gold border border-gold/30 transition-colors"
              title="Volver a Organización"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-gothic text-lg sm:text-xl font-bold tracking-wider text-amber-200 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-gold" />
                PHOTOCALL PUERTA CORTINA (80 × 200 CM)
              </h1>
              <p className="text-xs text-slate-400">
                Póster de paso cortado a tiras · Photocall de entrada y portal a la zona de fiesta
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/Photocall_Puerta_Akelarre_80x200cm.pdf"
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-black font-gothic font-bold text-xs tracking-wider shadow-lg shadow-gold/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PDF IMPRENTA LIMPIO (80×200)</span>
            </a>

            <a
              href="/PDFs_Photocall_Puerta/Photocall_Puerta_80x200cm_(Con_Guias_Tiras).pdf"
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-900/70 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-500/40 shadow-lg transition-all"
            >
              <Scissors className="w-3.5 h-3.5 text-purple-300" />
              <span>PDF Con Guías de Tiras</span>
            </a>

            <a
              href="/photocall_puerta_80x200cm.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
              <span>Ver a Escala Real</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Column: Interactive 3D Simulator */}
        <div className="flex-1 w-full flex flex-col items-center">
          
          {/* Controls Bar */}
          <div className="w-full max-w-[420px] bg-black/60 border border-gold/30 rounded-xl p-3 mb-6 flex items-center justify-between gap-3 shadow-xl backdrop-blur-sm">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-gothic font-bold transition-all shadow ${
                isOpen
                  ? 'bg-rose-900 text-rose-200 border border-rose-500'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 text-black hover:brightness-110'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOpen ? 'CERRAR PUERTA' : '✨ ATRAVESAR LA PUERTA (ABRIR TIRAS)'}</span>
            </button>

            <button
              onClick={() => setShowGuides(!showGuides)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                showGuides
                  ? 'bg-purple-900/60 border-purple-400 text-purple-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Alternar visibilidad de las líneas de corte"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{showGuides ? 'Guías ON' : 'Guías OFF'}</span>
            </button>
          </div>

          {/* 3D Doorway Frame */}
          <div className="relative w-full max-w-[420px] aspect-[8/20] bg-stone-950 rounded-t-2xl border-4 border-stone-800 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden select-none">
            
            {/* Background Party Room (Revealed when strips open!) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2b0c16] via-[#1a0729] to-[#0a0312] flex flex-col items-center justify-center text-center p-6 z-0">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 blur-xl animate-pulse absolute" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-4xl animate-bounce">🎉 🍷 🔥</span>
                <h3 className="font-gothic text-2xl font-black text-amber-200 drop-shadow-[0_2px_10px_rgba(245,158,11,0.8)]">
                  ¡BIENVENIDO AL FESTÍN!
                </h3>
                <p className="font-medieval italic text-rose-200 text-sm max-w-[240px]">
                  Has atravesado el velo sagrado hacia el santuario de las brujas.
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold tracking-widest uppercase">
                  ZONA DE FIESTA Y RITUAL
                </div>
              </div>
            </div>

            {/* The Door Photocall Poster (With 6 Sliced Strips) */}
            <div
              className="absolute inset-0 z-10 flex cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              title="Haz clic para abrir/cerrar las tiras"
            >
              {strips.map((strip, idx) => {
                // Calculate background offset for this strip
                const bgOffsetPercent = (idx / (strips.length - 1)) * 100;

                return (
                  <div
                    key={strip.id}
                    className="relative h-full flex-1 transition-all duration-700 ease-out origin-top overflow-hidden"
                    style={{
                      transform: isOpen
                        ? `perspective(800px) rotateY(${strip.angle}deg) translateZ(${strip.z}px) scaleY(0.96)`
                        : 'perspective(800px) rotateY(0deg) translateZ(0) scaleY(1)',
                      boxShadow: isOpen
                        ? `${strip.side === 'left' ? '5px' : '-5px'} 10px 25px rgba(0,0,0,0.85)`
                        : 'none',
                    }}
                  >
                    {/* The Full Artwork inside this Strip with precise background offset */}
                    <div
                      className="absolute top-0 bottom-0 w-[420px]"
                      style={{
                        left: `-${idx * (420 / 6)}px`,
                        backgroundImage: 'url(/images/photocall_puerta_terror_hd.jpg)',
                        backgroundSize: '420px 100%',
                        backgroundPosition: 'top left',
                      }}
                    >
                      {/* Top Dark Vignette */}
                      <div className="absolute top-0 left-0 right-0 h-[22%] bg-gradient-to-b from-black/95 via-black/80 to-transparent pointer-events-none" />

                      {/* Bottom Dark Vignette */}
                      <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-gradient-to-t from-black/95 via-black/85 to-transparent pointer-events-none" />

                      {/* Header Titles (rendered on full width behind strips) */}
                      <div className="absolute top-4 left-0 right-0 flex flex-col items-center text-center px-4 pointer-events-none">
                        <span className="px-3 py-0.5 rounded-full bg-red-950/80 border border-gold text-[9px] font-gothic font-bold text-amber-200 tracking-wider">
                          ✦ ZONA DE FIESTA Y RITUAL ✦
                        </span>
                        <h2 className="font-gothic font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-1">
                          AKELARRE 2026
                        </h2>
                        <span className="font-medieval italic text-rose-200 text-xs drop-shadow">
                          «Cruza el Umbral del Pecado»
                        </span>
                      </div>

                      {/* Footer Titles */}
                      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-center px-4 pointer-events-none">
                        <span className="font-medieval italic text-amber-200 text-xs drop-shadow">
                          «Sólo los dignos atraviesan el velo hacia el festín»
                        </span>
                        <span className="font-gothic text-[9px] text-white tracking-widest mt-0.5">
                          30 DE OCTUBRE AL 1 DE NOVIEMBRE 2026
                        </span>
                      </div>
                    </div>

                    {/* Dashed Cut Guide Line (Right side of each strip except last) */}
                    {showGuides && idx < strips.length - 1 && (
                      <div className="absolute top-[16%] bottom-0 right-0 w-0 border-r border-dashed border-white/60 pointer-events-none z-20 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-red-900 border border-gold text-[8px] flex items-center justify-center -mr-2 mt-[-8px] shadow">
                          ✂️
                        </div>
                      </div>
                    )}

                    {/* Strip number badge at bottom */}
                    {showGuides && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 border border-gold/40 rounded px-1.5 py-0.5 text-[8px] font-bold text-amber-200 pointer-events-none z-20">
                        {strip.id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Top Anchor Bar Notice Overlay */}
            {showGuides && (
              <div className="absolute top-0 left-0 right-0 h-[15%] bg-amber-950/30 border-b border-dashed border-gold/60 flex items-center justify-center z-30 pointer-events-none">
                <span className="bg-black/80 px-2.5 py-0.5 rounded text-[8px] font-bold text-amber-300 border border-gold/40 tracking-wider">
                  📌 BANDA DE ANCLAJE (NO CORTAR)
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center mt-3 max-w-sm">
            💡 <strong>Interactúa:</strong> Haz clic en la puerta para ver cómo se abren las tiras al atravesarla.
          </p>
        </div>

        {/* Right Column: Instructions, Specifications & Print Details */}
        <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Card: What is this? */}
          <div className="bg-[#12081c] border border-gold/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-gothic text-xl font-bold text-amber-200 flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold" />
              EL CONCEPTO: PHOTOCALL + CORTINA DE PASO
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Este diseño cumple <strong>dos funciones mágicas</strong> en el Akelarre:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-gold text-lg leading-none">📸</span>
                <span><strong>Photocall de bienvenida:</strong> Cuando la puerta está cerrada, las tiras quedan juntas por gravedad y forman un cartel impresionante de 2 metros de altura donde los invitados se toman sus fotos posando con el Brujo, la Bruja y el Caldero burbujeante.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold text-lg leading-none">🚪</span>
                <span><strong>Portal hacia la fiesta:</strong> Al empujar el centro, las tiras se abren fluidamente como una cortina mágica y la gente atraviesa el póster para entrar a la zona de baile y juegos.</span>
              </li>
            </ul>
          </div>

          {/* Card: Technical Specifications */}
          <div className="bg-[#12081c] border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-gothic text-lg font-bold text-purple-200 flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-purple-400" />
              ESPECIFICACIONES TÉCNICAS PARA LA IMPRENTA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Medida Total</span>
                <span className="text-base font-bold text-amber-200 mt-1 block">80 cm × 200 cm</span>
                <span className="text-slate-400 mt-0.5 block">(Ancho y alto estándar de puerta)</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Número de Tiras</span>
                <span className="text-base font-bold text-purple-200 mt-1 block">6 Tiras Verticales</span>
                <span className="text-slate-400 mt-0.5 block">(~13,3 cm cada tira)</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Material Recomendado</span>
                <span className="text-sm font-bold text-amber-200 mt-1 block">Lona Frontlit Mate 400g</span>
                <span className="text-slate-400 mt-0.5 block">o Lona Microperforada (Mesh)</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">Corte de Centro</span>
                <span className="text-sm font-bold text-emerald-300 mt-1 block">Paso Directo al Centro</span>
                <span className="text-slate-400 mt-0.5 block">Abre entre el caldero y los anfitriones</span>
              </div>
            </div>
          </div>

          {/* Card: Step-by-Step Mounting Guide */}
          <div className="bg-[#12081c] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-gothic text-lg font-bold text-amber-200 flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-gold" />
              GUÍA DE MONTAJE Y CORTE (FÁCIL Y RÁPIDO)
            </h3>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Imprime el archivo:</strong> Lleva el archivo <code>Photocall_Puerta_Akelarre_80x200cm.pdf</code> a cualquier copistería o imprenta digital que imprima lonas o vinilos de gran formato (cuesta muy poco al ser 0.8 x 2m).
              </li>
              <li className="leading-relaxed">
                <strong>Deja la cabecera intacta:</strong> La parte superior (donde pone <em>AKELARRE 2026</em>, unos 20-25 cm) <strong>NO SE CORTA</strong>. Esa será la banda firme que sujeta todo el cartel.
              </li>
              <li className="leading-relaxed">
                <strong>Corta las 5 ranuras hacia el suelo:</strong> Con una regla metálica larga y un cúter afilado, haz los 5 cortes verticales siguiendo las líneas guía de arriba hacia abajo. Te quedarán 6 tiras colgantes.
              </li>
              <li className="leading-relaxed">
                <strong>Fija la cabecera a la puerta:</strong> Pega la banda superior al marco de la puerta usando <strong>cinta de doble cara fuerte</strong>, tiras de velcro adhesivo, o chinchetas/grapas si el marco lo permite.
              </li>
              <li className="leading-relaxed">
                <strong>¡A disfrutar!:</strong> Las tiras cuelgan rectas por su propio peso. Cuando no pasa nadie, la ilustración se ve perfecta; cuando pasan, se aparta como un telón encantado.
              </li>
            </ol>
          </div>

        </div>

      </main>
    </div>
  );
}
