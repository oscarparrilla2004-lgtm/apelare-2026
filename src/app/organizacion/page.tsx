'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminTeamsDataResponse, TeamState, TeamMember } from '@/types';
import {
  Users,
  Shield,
  Copy,
  Check,
  Download,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  Send,
  FileText,
} from 'lucide-react';

const SAMPLE_GUESTS = [
  'Laura', 'Carlos', 'Marta', 'Alejandro', 'Elena', 'David',
  'Sara', 'Pablo', 'Lucía', 'Javier', 'Carmen', 'Daniel',
  'Paula', 'Adrián', 'Alba', 'Mario', 'Irene', 'Gonzalo',
  'Raquel', 'Sergio', 'Nerea', 'Iván', 'Claudia', 'Diego',
  'Natalia', 'Manuel', 'Miriam', 'Jorge', 'Silvia', 'Rubén',
  'Cristina', 'Álvaro', 'Patricia', 'Héctor', 'Andrea', 'Víctor'
];

export default function OrganizacionPage() {
  const [data, setData] = useState<AdminTeamsDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'clanes' | 'enlaces'>('clanes');

  // Copy & Toast state
  const [copied, setCopied] = useState(false);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ teamId: string; memberId: string; name: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Link Generator State
  const [namesInput, setNamesInput] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState<Array<{ name: string; token: string; url: string }>>([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin', { cache: 'no-store' });
      const resData: AdminTeamsDataResponse = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopyWhatsApp = () => {
    if (!data) return;

    let text = `🔥 *AKELARRE DE BRUJAS 2026 — LISTA OFICIAL DE CLANES* 🔥\n`;
    text += `📅 30 Octubre — 1 Noviembre\n`;
    text += `👥 Total Inscritos: ${data.totalPlayers} / ${data.maxTotalCapacity}\n\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    data.teams.forEach((team) => {
      text += `${team.icon} *${team.name.toUpperCase()}* (${team.members.length}/${team.maxMembers})\n`;
      text += `_${team.tagline}_\n`;

      if (team.members.length === 0) {
        text += `   _Sin miembros aún_\n`;
      } else {
        team.members.forEach((m, idx) => {
          const genderIcon = m.genero === 'femenino' ? '♀️' : '♂️';
          text += `  ${idx + 1}. *${m.nombreMortal}* ${genderIcon} — «${m.aliasBrujo}»\n`;
        });
      }
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🔮 _"Lo que ocurra dentro del Akelarre pertenecerá a las sombras para siempre."_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('¡Lista de clanes copiada para WhatsApp!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadCSV = () => {
    if (!data) return;

    const headers = ['Equipo ID', 'Nombre del Clan', 'Nombre Mortal', 'Alias Brujo', 'Genero', 'Token', 'Fecha Registro'];
    const rows: string[][] = [];

    data.teams.forEach((team) => {
      team.members.forEach((m) => {
        rows.push([
          team.id,
          `"${team.name}"`,
          `"${m.nombreMortal}"`,
          `"${m.aliasBrujo}"`,
          m.genero,
          m.token,
          m.fechaRegistro,
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akelarre_equipos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado');
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/admin?teamId=${deleteConfirm.teamId}&memberId=${deleteConfirm.memberId}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(`Se eliminó a ${deleteConfirm.name} del equipo.`);
        setDeleteConfirm(null);
        fetchData();
      } else {
        showToast('Error al eliminar miembro');
      }
    } catch {
      showToast('Error de conexión');
    }
  };

  // Link Generator Actions
  const handleGenerateLinks = () => {
    const lines = namesInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      showToast('Introduce al menos un nombre para generar enlaces.');
      return;
    }

    const links = lines.map((name) => {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        name,
        token: slug,
        url: `${baseUrl || ''}/llave/${slug}`,
      };
    });

    setGeneratedLinks(links);
    showToast(`¡Se han generado ${links.length} enlaces personalizados!`);
  };

  const handleLoadSample = () => {
    setNamesInput(SAMPLE_GUESTS.join('\n'));
  };

  const handleCopySingleLink = (url: string, index: number, name: string) => {
    const text = `🔮 ¡Hola ${name}! Has recibido tu Llave Sagrada para el *Akelarre de Brujas 2026* 🔥\n\nÁbrela aquí para sellar tu pacto y elegir tu clan:\n👉 ${url}`;
    navigator.clipboard.writeText(text);
    setCopiedLinkIndex(index);
    showToast(`Enlace y mensaje de ${name} copiado`);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
  };

  const handleCopyAllWhatsappMessages = () => {
    if (generatedLinks.length === 0) return;

    let text = `🔥 *INVITACIONES INDIVIDUALES PARA EL AKELARRE 2026* 🔥\n\n`;
    generatedLinks.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}*: ${item.url}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAllLinks(true);
    showToast('¡Todos los enlaces copiados al portapapeles!');
    setTimeout(() => setCopiedAllLinks(false), 3000);
  };

  // Stats calculation
  const totalWitches = data?.teams.reduce((acc, t) => acc + t.members.filter((m) => m.genero === 'femenino').length, 0) || 0;
  const totalWarlocks = data?.teams.reduce((acc, t) => acc + t.members.filter((m) => m.genero === 'masculino').length, 0) || 0;
  const fullTeamsCount = data?.teams.filter((t) => t.isFull).length || 0;

  return (
    <div className="min-h-screen w-full bg-akelarre-dark text-white font-sans p-4 md:p-8 select-none">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-950 via-gold to-amber-950 border-2 border-gold text-black font-gothic font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.8)] animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/30 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-gothic tracking-widest text-gold hover:text-amber-200 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VOLVER A LA EXPERIENCIA</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-gothic tracking-widest text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase">
              ORGANIZACIÓN DEL AKELARRE
            </h1>
            <p className="text-xs md:text-sm font-sans text-rose-200/70 italic">
              Control en tiempo real de los 6 Clanes, 36 Jugadores y Generador de Enlaces.
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 border border-emerald-500/70 text-emerald-200 text-xs font-gothic tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copied ? '¡COPIADO!' : 'COPIAR CLANES (WHATSAPP)'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 border border-gold/50 text-gold text-xs font-gothic tracking-wider hover:bg-gold/10 hover:border-gold active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <Download className="w-4 h-4 text-gold" />
              <span>DESCARGAR CSV</span>
            </button>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-black/70 border border-white/20 text-white/70 hover:text-white hover:border-white/40 active:scale-95 transition-all cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-gold' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-gold/20 pb-1">
          <button
            onClick={() => setActiveTab('clanes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-gothic text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'clanes'
                ? 'bg-gradient-to-r from-amber-950 to-red-950 border-2 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CLANES Y JUGADORES ({data?.totalPlayers || 0}/36)</span>
          </button>

          <button
            onClick={() => setActiveTab('enlaces')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-gothic text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'enlaces'
                ? 'bg-gradient-to-r from-amber-950 to-red-950 border-2 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>GENERADOR DE ENLACES PARA INVITADOS</span>
          </button>
        </div>

        {/* TAB 1: CLANES Y JUGADORES */}
        {activeTab === 'clanes' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-gold/80 uppercase">TOTAL JUGADORES</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-gothic font-bold text-amber-100">{data?.totalPlayers || 0}</span>
                  <span className="text-xs text-white/40 font-sans">/ 36</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-gold rounded-full transition-all duration-500"
                    style={{ width: `${((data?.totalPlayers || 0) / 36) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-red-900/50 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-red-300/80 uppercase">CLANES COMPLETOS</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-gothic font-bold text-red-400">{fullTeamsCount}</span>
                  <span className="text-xs text-white/40 font-sans">/ 6 clanes</span>
                </div>
                <p className="text-[10px] font-sans text-rose-300/60 pt-1">{6 - fullTeamsCount} clanes con plazas</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-purple-900/50 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-purple-300/80 uppercase">BRUJAS (FEMENINO)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-gothic font-bold text-rose-300">{totalWitches}</span>
                  <span className="text-xs text-white/40 font-sans">♀</span>
                </div>
                <p className="text-[10px] font-sans text-rose-300/60 pt-1">Inscritas en el Akelarre</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-amber-900/50 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-amber-300/80 uppercase">BRUJOS (MASCULINO)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-gothic font-bold text-amber-300">{totalWarlocks}</span>
                  <span className="text-xs text-white/40 font-sans">♂</span>
                </div>
                <p className="text-[10px] font-sans text-amber-300/60 pt-1">Inscritos en el Akelarre</p>
              </div>
            </div>

            {/* 6 Clans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data?.teams.map((team) => {
                return (
                  <div
                    key={team.id}
                    className={`flex flex-col justify-between rounded-2xl p-5 backdrop-blur-md border-2 bg-gradient-to-b ${team.bgGradient} ${
                      team.isFull ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]' : team.borderColor
                    } space-y-4`}
                  >
                    {/* Team Card Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{team.icon}</span>
                          <div>
                            <h3 className={`text-base font-gothic font-bold uppercase ${team.color}`}>
                              {team.name}
                            </h3>
                            <p className="text-[11px] font-sans text-amber-100/70 italic">&ldquo;{team.tagline}&rdquo;</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`text-[11px] font-gothic tracking-wider px-2.5 py-0.5 rounded-full border ${
                            team.isFull
                              ? 'bg-red-950 border-red-500 text-red-300 font-bold'
                              : 'bg-black/50 border-gold/30 text-amber-200'
                          }`}
                        >
                          {team.isFull ? 'COMPLETO (6/6)' : `${team.members.length} / ${team.maxMembers} MIEMBROS`}
                        </span>
                        <span className="text-[10px] font-sans text-white/40">
                          {Math.max(0, team.maxMembers - team.members.length)} plazas libres
                        </span>
                      </div>
                    </div>

                    {/* Team Members List */}
                    <div className="space-y-2 min-h-[180px] flex flex-col justify-start">
                      {team.members.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-white/10 rounded-xl text-center">
                          <p className="text-xs font-sans text-white/40 italic">Aún no hay almas en este clan.</p>
                        </div>
                      ) : (
                        team.members.map((member, idx) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10 hover:border-gold/40 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden pr-2">
                              <span className="text-[10px] font-gothic text-gold/70 w-4 text-center">{idx + 1}.</span>
                              <div className="truncate">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-gothic font-bold text-amber-100 truncate">{member.nombreMortal}</span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                                      member.genero === 'femenino' ? 'text-rose-300 bg-rose-950/60' : 'text-blue-300 bg-blue-950/60'
                                    }`}
                                  >
                                    {member.genero === 'femenino' ? '♀' : '♂'}
                                  </span>
                                </div>
                                <p className="text-[10px] font-gothic text-gold italic truncate">«{member.aliasBrujo}»</p>
                              </div>
                            </div>

                            {/* Delete Member Button */}
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  teamId: team.id,
                                  memberId: member.id,
                                  name: member.nombreMortal,
                                  })
                              }
                              className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-950/80 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar del equipo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}

                      {/* Render Empty Slots Placeholders */}
                      {Array.from({ length: Math.max(0, team.maxMembers - team.members.length) }).map((_, idx) => (
                        <div
                          key={`empty_${idx}`}
                          className="p-2 rounded-xl border border-dashed border-white/10 bg-black/20 text-center"
                        >
                          <span className="text-[10px] font-sans text-white/20 tracking-wider">
                            [ Plaza #{team.members.length + idx + 1} Disponible ]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GENERADOR DE ENLACES PARA INVITADOS */}
        {activeTab === 'enlaces' && (
          <div className="space-y-6 animate-fade-in">
            {/* Instruction Card */}
            <div className="p-6 rounded-2xl bg-black/60 border border-gold/30 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-gothic text-gold uppercase font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>GENERADOR DE ENLACES INDIVIDUALES (36 AMIGOS)</span>
                  </h3>
                  <p className="text-xs font-sans text-rose-200/70 italic mt-0.5">
                    Pega los nombres de tus invitados (uno por línea). Cada uno recibirá su enlace directo con bienvenida personalizada.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-3.5 py-1.5 rounded-lg border border-gold/40 bg-gold/10 text-gold text-xs font-gothic tracking-wider hover:bg-gold/20 transition-colors self-start cursor-pointer"
                >
                  ⚡ Cargar 36 nombres de ejemplo
                </button>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={namesInput}
                  onChange={(e) => setNamesInput(e.target.value)}
                  placeholder="Laura&#10;Carlos&#10;Marta Gómez&#10;Alejandro..."
                  className="w-full p-4 rounded-xl bg-black/80 border border-gold/40 text-amber-100 font-sans text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={handleGenerateLinks}
                    className="py-3 px-6 rounded-full bg-gradient-to-r from-red-950 via-amber-900 to-red-950 border-2 border-gold text-gold font-gothic text-xs md:text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>GENERAR ENLACES MÁGICOS</span>
                  </button>

                  {generatedLinks.length > 0 && (
                    <button
                      onClick={handleCopyAllWhatsappMessages}
                      className="py-2.5 px-5 rounded-full bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400 text-emerald-200 font-gothic text-xs tracking-wider uppercase hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                    >
                      {copiedAllLinks ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                      <span>{copiedAllLinks ? '¡TODOS COPIADOS!' : 'COPIAR TODOS LOS ENLACES'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Generated Links Table */}
            {generatedLinks.length > 0 && (
              <div className="p-6 rounded-2xl bg-black/60 border border-gold/30 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-gothic text-gold uppercase tracking-wider">
                    ENLACES GENERADOS ({generatedLinks.length} INVITADOS)
                  </h4>
                  <span className="text-xs font-sans text-white/50">
                    Pulsa en copiar para obtener el mensaje de WhatsApp con 1 clic
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedLinks.map((item, idx) => {
                    const isItemCopied = copiedLinkIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/70 border border-white/10 hover:border-gold/50 transition-all text-xs space-x-3"
                      >
                        <div className="truncate flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-gothic text-gold/80 w-5 text-center">#{idx + 1}</span>
                            <span className="font-gothic font-bold text-amber-100 text-sm truncate">{item.name}</span>
                          </div>
                          <p className="text-[11px] font-mono text-white/40 truncate pl-7">
                            {item.url}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySingleLink(item.url, idx, item.name)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              isItemCopied
                                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                                : 'bg-black/60 border-gold/40 text-gold hover:bg-gold/15'
                            }`}
                            title="Copiar mensaje personalizado para WhatsApp"
                          >
                            {isItemCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/50 bg-black/60 transition-all"
                            title="Probar enlace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#140c1a] border-2 border-red-600/70 shadow-[0_0_40px_rgba(220,38,38,0.5)] space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-500 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-gothic text-red-400 uppercase font-bold">¿ELIMINAR ALMA DEL CLAN?</h3>
            <p className="text-xs font-sans text-amber-100/80 leading-relaxed">
              ¿Estás seguro/a de que deseas retirar a <span className="text-gold font-bold">{deleteConfirm.name}</span> de este clan? La plaza quedará libre inmediatamente para otro participante.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white/70 text-xs font-gothic uppercase hover:text-white transition-colors cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={handleDeleteMember}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 border border-red-400 text-white text-xs font-gothic font-bold uppercase transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
              >
                SÍ, ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
