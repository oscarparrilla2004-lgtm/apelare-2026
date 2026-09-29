'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminTeamsDataResponse, TeamState, TeamMember } from '@/types';
import { COUPLES_CONFIG, getAllGuestsFlat } from '@/config/couplesConfig';
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
  HeartHandshake,
} from 'lucide-react';

export default function OrganizacionPage() {
  const [data, setData] = useState<AdminTeamsDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'clanes' | 'parejas' | 'enlaces'>('clanes');

  // Authentication State (Password = admin)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Copy & Toast state
  const [copied, setCopied] = useState(false);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ teamId: string; memberId: string; name: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Link Generator State
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
      const isAuth = localStorage.getItem('akelarre_admin_auth');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('akelarre_admin_auth', 'true');
      }
      showToast('Acceso concedido al panel de Organización.');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('akelarre_admin_auth');
    }
  };

  const handleResetAll = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all', password: 'admin' }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast('¡Todos los clanes han sido reiniciados a 0 almas!');
        setShowResetConfirm(false);
        fetchData();
      } else {
        showToast('Error al reiniciar los clanes.');
      }
    } catch {
      showToast('Error de conexión.');
    }
  };

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

  // Helper to find member enrollment in teams
  const findMemberInfo = (token: string, name: string) => {
    if (!data) return null;
    const normToken = token.toUpperCase();
    const normName = name.toLowerCase().trim();

    for (const team of data.teams) {
      const found = team.members.find(
        (m) => m.token.toUpperCase() === normToken || m.nombreMortal.toLowerCase().trim() === normName
      );
      if (found) {
        return {
          member: found,
          team,
        };
      }
    }
    return null;
  };

  const handleCopyWhatsApp = () => {
    if (!data) return;

    let text = `🔥 *AKELARRE DE BRUJAS 2026 — LISTA OFICIAL DE CLANES* 🔥\n`;
    text += `📅 30 Octubre — 1 Noviembre\n`;
    text += `👥 Total Inscritos: ${data.totalPlayers} / ${data.maxTotalCapacity} (21 Parejas)\n\n`;
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
    const flatGuests = getAllGuestsFlat();

    const headers = [
      'Pareja ID',
      'Nombre Mortal',
      'Genero',
      'Token Enlace',
      'Clan Asignado',
      'Alias Brujo',
      'Pareja (Esposo/a)',
      'Clan de la Pareja',
      'Estado',
      'Enlace Directo',
      'Fecha Registro',
    ];

    const rows: string[][] = flatGuests.map((g) => {
      const myInfo = findMemberInfo(g.token, g.name);
      const spouseInfo = findMemberInfo(g.spouseToken, g.spouseName);
      const guestUrl = `${baseUrl}/llave/${g.token}`;

      return [
        g.coupleId,
        `"${g.name}"`,
        g.gender,
        g.token,
        myInfo ? `"${myInfo.team.name}"` : '"PENDIENTE"',
        myInfo ? `"${myInfo.member.aliasBrujo}"` : '""',
        `"${g.spouseName}"`,
        spouseInfo ? `"${spouseInfo.team.name}"` : '"PENDIENTE"',
        myInfo ? '"INSCRITO"' : '"SIN REGISTRAR"',
        guestUrl,
        myInfo ? myInfo.member.fechaRegistro : '""',
      ];
    });

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `akelarre_2026_parejas_clanes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo Excel/CSV descargado con las 21 parejas');
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

  const handleCopySingleLink = (token: string, name: string) => {
    const url = `${baseUrl}/llave/${token}`;
    const text = `🔮 ¡Hola ${name}! Has recibido tu Llave Sagrada para el *Akelarre de Brujas 2026* 🔥\n\nÁbrela aquí para sellar tu pacto y que el Oráculo te asigne tu clan secreto:\n👉 ${url}\n\n🔊 *¡Importante! Sube el volumen al máximo y disfruta de la experiencia* 🧙‍♀️✨`;
    navigator.clipboard.writeText(text);
    setCopiedLinkIndex(token);
    showToast(`Enlace y mensaje de ${name} copiado`);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
  };

  const handleCopyAllWhatsappMessages = () => {
    const flatGuests = getAllGuestsFlat();
    let text = `🔥 *INVITACIONES INDIVIDUALES PARA EL AKELARRE 2026 (42 INVITADOS)* 🔥\n\n`;

    flatGuests.forEach((item, idx) => {
      const url = `${baseUrl}/llave/${item.token}`;
      text += `${idx + 1}. *${item.name}* (pareja de ${item.spouseName}):\n👉 ${url}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAllLinks(true);
    showToast('¡Los 42 enlaces copiados al portapapeles!');
    setTimeout(() => setCopiedAllLinks(false), 3000);
  };

  // Stats calculation
  const totalWitches = data?.teams.reduce((acc, t) => acc + t.members.filter((m) => m.genero === 'femenino').length, 0) || 0;
  const totalWarlocks = data?.teams.reduce((acc, t) => acc + t.members.filter((m) => m.genero === 'masculino').length, 0) || 0;
  const fullTeamsCount = data?.teams.filter((t) => t.isFull).length || 0;

  // If not authenticated, display password gate screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-akelarre-dark text-white font-sans flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#1c110b] via-[#120a06] to-[#0a0503] border-2 border-gold/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] text-center space-y-5 backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-black/80 border-2 border-gold flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)] text-2xl">
            🔮
          </div>

          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-gothic tracking-widest text-gold uppercase font-bold">
              CÁMARA DEL ORGANIZADOR
            </h2>
            <p className="text-xs font-sans text-rose-200/70 italic">
              Introduce la clave sagrada para acceder al control de clanes y parejas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Clave de acceso..."
                autoFocus
                className={`w-full px-4 py-3 rounded-xl bg-black/85 border ${
                  authError ? 'border-red-500 animate-bounce-short' : 'border-gold/40 focus:border-gold'
                } text-amber-100 font-sans tracking-widest text-center text-base focus:outline-none focus:ring-1 focus:ring-gold shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]`}
              />
              {authError && (
                <p className="text-xs text-red-400 font-sans text-center pt-1 font-semibold">
                  Clave incorrecta. Solo el Guardián puede pasar.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-red-950 via-amber-900 to-red-950 border-2 border-gold text-gold font-gothic text-xs md:text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer font-bold"
            >
              🔓 DESBLOQUEAR PANEL
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-gothic text-white/40 hover:text-white/80 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la invitación</span>
          </Link>
        </div>
      </div>
    );
  }

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
              Control en tiempo real de los 4 Clanes (10 plazas c/u), 21 Parejas (42 Invitados) y Exportador Excel.
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
              <span>DESCARGAR EXCEL / CSV (PAREJAS)</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-gothic tracking-wider hover:bg-red-900/60 active:scale-95 transition-all cursor-pointer"
              title="Poner todos los contadores de clanes a 0"
            >
              <RefreshCw className="w-4 h-4 text-red-400" />
              <span>REINICIAR A CERO</span>
            </button>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-black/70 border border-white/20 text-white/70 hover:text-white hover:border-white/40 active:scale-95 transition-all cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-gold' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-black/60 border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all text-xs font-gothic cursor-pointer"
              title="Cerrar sesión"
            >
              🔒 SALIR
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gold/20 pb-1">
          <button
            onClick={() => setActiveTab('clanes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-gothic text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'clanes'
                ? 'bg-gradient-to-r from-amber-950 to-red-950 border-2 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CLANES ({data?.totalPlayers || 0}/{data?.maxTotalCapacity || 40})</span>
          </button>

          <button
            onClick={() => setActiveTab('parejas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-gothic text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'parejas'
                ? 'bg-gradient-to-r from-amber-950 to-red-950 border-2 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>21 PAREJAS Y ANTI-COLISIÓN</span>
          </button>

          <button
            onClick={() => setActiveTab('enlaces')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-gothic text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'enlaces'
                ? 'bg-gradient-to-r from-amber-950 to-red-950 border-2 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>ENLACES INVITADOS (42)</span>
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
                  <span className="text-xs text-white/40 font-sans">/ {data?.maxTotalCapacity || 40}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-gold rounded-full transition-all duration-500"
                    style={{ width: `${((data?.totalPlayers || 0) / (data?.maxTotalCapacity || 40)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-red-900/50 backdrop-blur-md space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-red-300/80 uppercase">CLANES COMPLETOS</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-gothic font-bold text-red-400">{fullTeamsCount}</span>
                  <span className="text-xs text-white/40 font-sans">/ 4 clanes</span>
                </div>
                <p className="text-[10px] font-sans text-rose-300/60 pt-1">{4 - fullTeamsCount} clanes con plazas</p>
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

            {/* 4 Clans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
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
                          {team.isFull ? 'COMPLETO (7/7)' : `${team.members.length} / ${team.maxMembers} MIEMBROS`}
                        </span>
                        <span className="text-[10px] font-sans text-white/40">
                          {Math.max(0, team.maxMembers - team.members.length)} plazas libres
                        </span>
                      </div>
                    </div>

                    {/* Team Members List */}
                    <div className="space-y-2 min-h-[200px] flex flex-col justify-start">
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

        {/* TAB 2: PAREJAS Y ANTI-COLISIÓN */}
        {activeTab === 'parejas' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-black/60 border border-gold/30 backdrop-blur-md space-y-2">
              <h3 className="text-lg font-gothic text-gold uppercase font-bold flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-gold" />
                <span>SEGUIMIENTO DE LAS 21 PAREJAS (ANTI-COLISIÓN ACTIVO)</span>
              </h3>
              <p className="text-xs font-sans text-rose-200/80 italic">
                El sistema garantiza que ningún miembro de una pareja coincida en el mismo clan. Cuando uno elige, el clan queda bloqueado para el otro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COUPLES_CONFIG.map((couple, idx) => {
                const info1 = findMemberInfo(couple.partner1.token, couple.partner1.name);
                const info2 = findMemberInfo(couple.partner2.token, couple.partner2.name);

                return (
                  <div
                    key={couple.id}
                    className="p-4 rounded-2xl bg-black/70 border border-white/15 hover:border-gold/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-gothic text-gold font-bold">PAREJA #{idx + 1}</span>
                      <span className="text-[10px] font-mono text-white/40">{couple.id}</span>
                    </div>

                    {/* Partner 1 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-100">{couple.partner1.name}</span>
                          <span className="text-[10px] text-rose-300">♀</span>
                        </div>
                        <p className="text-[10px] text-white/50">
                          {info1 ? (
                            <span className="text-amber-400 font-bold">{info1.team.name}</span>
                          ) : (
                            <span className="text-amber-600/70 italic">Pendiente de entrar</span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopySingleLink(couple.partner1.token, couple.partner1.name)}
                        className="p-1.5 rounded-lg bg-black/60 border border-gold/40 text-gold hover:bg-gold/20 text-xs cursor-pointer"
                        title="Copiar enlace"
                      >
                        {copiedLinkIndex === couple.partner1.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Partner 2 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-100">{couple.partner2.name}</span>
                          <span className="text-[10px] text-blue-300">♂</span>
                        </div>
                        <p className="text-[10px] text-white/50">
                          {info2 ? (
                            <span className="text-amber-400 font-bold">{info2.team.name}</span>
                          ) : (
                            <span className="text-amber-600/70 italic">Pendiente de entrar</span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopySingleLink(couple.partner2.token, couple.partner2.name)}
                        className="p-1.5 rounded-lg bg-black/60 border border-gold/40 text-gold hover:bg-gold/20 text-xs cursor-pointer"
                        title="Copiar enlace"
                      >
                        {copiedLinkIndex === couple.partner2.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ENLACES PARA INVITADOS (42) */}
        {activeTab === 'enlaces' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Quick copy all */}
            <div className="p-6 rounded-2xl bg-black/60 border border-gold/30 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-gothic text-gold uppercase font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>ENLACES DIRECTOS PERSONALIZADOS (42 INVITADOS)</span>
                  </h3>
                  <p className="text-xs font-sans text-rose-200/70 italic mt-0.5">
                    Cada enlace abre la experiencia personalizada con el nombre del invitado y su pareja precargada.
                  </p>
                </div>

                <button
                  onClick={handleCopyAllWhatsappMessages}
                  className="py-2.5 px-5 rounded-full bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400 text-emerald-200 font-gothic text-xs tracking-wider uppercase hover:scale-105 transition-all cursor-pointer flex items-center gap-2 self-start"
                >
                  {copiedAllLinks ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                  <span>{copiedAllLinks ? '¡TODOS COPIADOS!' : 'COPIAR TODOS LOS 42 MENSAJES'}</span>
                </button>
              </div>
            </div>

            {/* List of 42 Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getAllGuestsFlat().map((item, idx) => {
                const isItemCopied = copiedLinkIndex === item.token;
                const url = `${baseUrl}/llave/${item.token}`;
                const myInfo = findMemberInfo(item.token, item.name);

                return (
                  <div
                    key={item.token}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-black/70 border border-white/10 hover:border-gold/50 transition-all text-xs space-x-3"
                  >
                    <div className="truncate flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-gothic text-gold/80 w-6 text-center">#{idx + 1}</span>
                        <span className="font-gothic font-bold text-amber-100 text-sm truncate">{item.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded ${
                            item.gender === 'femenino' ? 'text-rose-300 bg-rose-950/60' : 'text-blue-300 bg-blue-950/60'
                          }`}
                        >
                          {item.gender === 'femenino' ? '♀' : '♂'}
                        </span>
                        {myInfo && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                            EN EL CLAN
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-sans text-rose-200/60 pl-8">
                        Pareja: <strong className="text-amber-200">{item.spouseName}</strong>
                        {myInfo && <span className="text-amber-400 ml-2">Clan: {myInfo.team.name}</span>}
                      </p>
                      <p className="text-[11px] font-mono text-white/40 truncate pl-8">{url}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySingleLink(item.token, item.name)}
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
                        href={url}
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

      {/* Reset All Teams Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#1a0808] border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)] space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-400 flex items-center justify-center mx-auto text-red-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>

            <h3 className="text-lg font-gothic text-red-400 uppercase font-bold">¿REINICIAR TODOS LOS CLANES A CERO?</h3>
            <p className="text-xs font-sans text-amber-100/90 leading-relaxed">
              Esta acción vaciará todas las plazas registradas de los 4 clanes (0/40). Úsalo para dejar la aplicación completamente limpia antes de enviar los enlaces a tus invitados.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white/70 text-xs font-gothic uppercase hover:text-white transition-colors cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-300 text-white text-xs font-gothic font-bold uppercase transition-colors shadow-[0_0_20px_rgba(239,68,68,0.8)] cursor-pointer"
              >
                SÍ, VACIAR A CERO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
