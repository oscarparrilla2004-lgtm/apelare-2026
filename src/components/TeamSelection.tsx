'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { TEAMS_CONFIG, MAX_PLAYERS_PER_TEAM, TOTAL_MAX_PLAYERS } from '@/config/teamsConfig';
import { TeamsOverviewResponse } from '@/types';
import { Sparkles, ArrowRight, Check, Lock } from 'lucide-react';

interface TeamSelectionProps {
  token?: string;
  guestName: string;
  witchNickname: string;
  gender?: 'masculino' | 'femenino';
  isAlreadyEnrolled?: boolean;
  preEnrolledTeamId?: string;
  preEnrolledTeamName?: string;
  onComplete: (teamId: string, teamName: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({
  token = 'DEMO',
  guestName,
  witchNickname,
  gender = 'masculino',
  isAlreadyEnrolled = false,
  preEnrolledTeamId,
  preEnrolledTeamName,
  onComplete,
}) => {
  const [teams, setTeams] = useState<TeamsOverviewResponse['teams']>(
    TEAMS_CONFIG.map((t) => ({
      ...t,
      currentCount: 0,
      isFull: false,
      isExcludedForSpouse: false,
    }))
  );
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(preEnrolledTeamId || null);
  const [assignedTeam, setAssignedTeam] = useState<{ id: string; name: string; icon: string; tagline: string } | null>(() => {
    if (preEnrolledTeamId) {
      const found = TEAMS_CONFIG.find((t) => t.id === preEnrolledTeamId);
      if (found) return { id: found.id, name: found.name, icon: found.icon, tagline: found.tagline };
    }
    return null;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(isAlreadyEnrolled || !!preEnrolledTeamId);

  useEffect(() => {
    if (preEnrolledTeamId) {
      const found = TEAMS_CONFIG.find((t) => t.id === preEnrolledTeamId);
      if (found) {
        setAssignedTeam({ id: found.id, name: found.name, icon: found.icon, tagline: found.tagline });
        setActiveHighlightId(found.id);
        setIsSuccess(true);
      }
    }
  }, [preEnrolledTeamId]);

  const [spouseExclusionInfo, setSpouseExclusionInfo] = useState<{
    spouseName: string;
    spouseTeamId: string;
    spouseTeamName: string;
  } | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams?token=${encodeURIComponent(token)}`, { cache: 'no-store' });
      const data: TeamsOverviewResponse = await res.json();
      if (data.success && data.teams) {
        setTeams(data.teams);
        setTotalPlayers(data.totalPlayers);
        if (data.spouseExclusionInfo) {
          setSpouseExclusionInfo(data.spouseExclusionInfo);
        }
      }
    } catch {
      // Fallback
    }
  }, [token]);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 6000);
    return () => clearInterval(interval);
  }, [fetchTeams]);

  // 🔮 Asignación armónica y equilibrada por el Oráculo del Caldero (Paridad de Género y Distribución Homogénea)
  const handleConsultOracle = () => {
    if (isSpinning || isSuccess || isLoading) return;

    const availableTeams = teams.filter(
      (t) => !t.isFull && t.currentCount < MAX_PLAYERS_PER_TEAM && !t.isExcludedForSpouse
    );
    if (availableTeams.length === 0) {
      setErrorMsg('No hay clanes con plazas disponibles para tu destino.');
      return;
    }

    setIsSpinning(true);
    setErrorMsg(null);

    // Algoritmo de ponderación inteligente para igualar el tamaño de los clanes y equilibrar hombres y mujeres (50/50)
    const maxCount = Math.max(...availableTeams.map((t) => t.currentCount));

    const weightedTeams = availableTeams.map((t) => {
      const sizeGap = maxCount - t.currentCount; // Favorece clanes con menos miembros totales
      const sameGenderCount = gender === 'femenino' ? (t.femaleCount || 0) : (t.maleCount || 0);
      const genderDeficit = Math.max(0, 5 - sameGenderCount); // Favorece clanes que necesitan este género

      let weight = Math.pow(2.5, sizeGap) * (1 + genderDeficit * 2.5);
      // Si el clan ya tiene 5 o más personas de este mismo género, penalizar drásticamente para desviar a otros clanes
      if (sameGenderCount >= 5) {
        weight *= 0.05;
      }
      return { team: t, weight };
    });

    const totalWeight = weightedTeams.reduce((sum, item) => sum + item.weight, 0);
    let randomVal = Math.random() * totalWeight;
    let chosen = weightedTeams[0].team;

    for (const item of weightedTeams) {
      if (randomVal < item.weight) {
        chosen = item.team;
        break;
      }
      randomVal -= item.weight;
    }

    const chosenIndex = availableTeams.findIndex((t) => t.id === chosen.id);
    const validChosenIndex = chosenIndex >= 0 ? chosenIndex : 0;

    let currentStep = 0;
    const totalSteps = 24 + validChosenIndex;
    let delay = 45; // Starts fast (tic-tic-tic-tic)

    const spinStep = () => {
      const activeCandidate = availableTeams[currentStep % availableTeams.length];
      setActiveHighlightId(activeCandidate.id);
      
      const progressRatio = currentStep / totalSteps;
      soundEngine.playRouletteTick(progressRatio);

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(20);
        } catch {}
      }

      currentStep++;
      if (currentStep < totalSteps) {
        // Dramatic realistic deceleration curve
        if (progressRatio > 0.85) {
          delay += 75;
        } else if (progressRatio > 0.65) {
          delay += 35;
        } else if (progressRatio > 0.4) {
          delay += 15;
        } else {
          delay += 5;
        }
        setTimeout(spinStep, delay);
      } else {
        // Landed on chosen team!
        setActiveHighlightId(chosen.id);
        setAssignedTeam({
          id: chosen.id,
          name: chosen.name,
          icon: chosen.icon,
          tagline: chosen.tagline,
        });
        setIsSpinning(false);
        soundEngine.playSecretChime();
        soundEngine.playWolfHowl();

        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([100, 50, 150]);
          } catch {}
        }

        enrollInTeam(chosen.id, chosen.name);
      }
    };

    spinStep();
  };

  const enrollInTeam = async (teamId: string, teamName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          token,
          nombreMortal: guestName || 'Invitado del Akelarre',
          aliasBrujo: witchNickname || 'Iniciado de las Sombras',
          genero: gender,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Error al sellar clan.');
        setIsLoading(false);
        fetchTeams();
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch {
      setErrorMsg('Error de conexión con el círculo sagrado.');
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (assignedTeam) {
      onComplete(assignedTeam.id, assignedTeam.name);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-4 py-8 md:py-10 select-none z-10 overflow-hidden">
      {/* Ambient Mystic Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center text-center z-10 max-w-sm w-full space-y-1 mt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 text-[10px] font-sans tracking-widest uppercase">
          <span>🔮</span>
          <span>ORÁCULO DE LOS 4 CLANES</span>
        </div>

        <h2 className="text-xl md:text-2xl font-gothic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 uppercase font-bold">
          Asignación de Clan
        </h2>

        {guestName && (
          <p className="text-xs font-sans text-amber-200/90 tracking-wide">
            {guestName} <span className="text-amber-400 italic font-medium">«{witchNickname}»</span>
          </p>
        )}

        {spouseExclusionInfo && (
          <div className="w-full mt-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/50 text-[10px] text-purple-200 font-sans tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-fade-in">
            <span>⚔️</span>
            <span>
              Ley del Akelarre: <strong>{spouseExclusionInfo.spouseName}</strong> está en <em>{spouseExclusionInfo.spouseTeamName}</em>. Tu destino será un clan rival.
            </span>
          </div>
        )}
      </div>

      {/* 4 CLANS COMPACT 2-COLUMN GRID */}
      <div className="grid grid-cols-2 gap-3 my-auto w-full max-w-md z-20">
        {teams.map((team) => {
          const isHighlighted = activeHighlightId === team.id;
          const isExcluded = team.isExcludedForSpouse;
          const isFull = team.isFull || team.currentCount >= MAX_PLAYERS_PER_TEAM;
          const isMyClan = assignedTeam?.id === team.id;

          return (
            <div
              key={team.id}
              className={`relative rounded-xl p-2.5 transition-all duration-200 border flex items-center gap-2 overflow-hidden ${
                isMyClan
                  ? 'bg-gradient-to-r from-amber-950 via-amber-900/60 to-amber-950 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-105 z-30'
                  : isHighlighted
                  ? 'bg-amber-950/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.7)] scale-105 z-20'
                  : isExcluded
                  ? 'bg-black/40 border-purple-900/40 opacity-40 grayscale-[40%]'
                  : isFull
                  ? 'bg-black/50 border-red-950/60 opacity-40'
                  : 'bg-black/80 border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* Clan Icon */}
              <div
                className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-lg border ${
                  isMyClan || isHighlighted
                    ? 'border-amber-400 bg-black/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : isExcluded
                    ? 'border-purple-500/30 bg-black/60 text-purple-300'
                    : 'border-white/10 bg-black/60'
                }`}
              >
                <span>{team.icon}</span>
              </div>

              {/* Clan Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className={`text-[11px] font-gothic font-bold leading-tight uppercase ${team.color}`}>
                    {team.name}
                  </h3>
                  {isExcluded ? (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950 border border-purple-500 text-purple-300 font-bold shrink-0">
                      PAREJA
                    </span>
                  ) : isFull ? (
                    <Lock className="w-2.5 h-2.5 text-red-400 shrink-0 mt-0.5" />
                  ) : isMyClan ? (
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[3]" />
                  ) : null}
                </div>

                {/* Slots Count */}
                <div className="flex items-center justify-between text-[9px] font-sans tracking-wider pt-0.5 text-white/50">
                  <span>
                    {isExcluded
                      ? `Clan de ${team.spouseName || 'pareja'}`
                      : isFull
                      ? 'COMPLETO'
                      : `${team.currentCount}/${MAX_PLAYERS_PER_TEAM} almas`}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-black/80 rounded-full h-1 mt-1 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExcluded
                        ? 'bg-purple-700'
                        : isFull
                        ? 'bg-red-600'
                        : isMyClan || isHighlighted
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                        : 'bg-amber-700/70'
                    }`}
                    style={{ width: `${(team.currentCount / MAX_PLAYERS_PER_TEAM) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="z-20 px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-sans animate-bounce-short text-center">
          {errorMsg}
        </div>
      )}

      {/* Dictamen del Oráculo Card once finished */}
      {assignedTeam && isSuccess && (
        <div className="z-20 p-3.5 rounded-2xl bg-gradient-to-b from-[#201026] via-[#120817] to-[#0a040d] border border-amber-400 text-center space-y-1 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-fade-in max-w-sm w-full my-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] uppercase font-sans tracking-widest font-bold">
            <span>✨</span>
            <span>DICTAMEN DEL CALDERO</span>
          </div>

          <p className="text-base font-gothic tracking-wider text-amber-100 font-bold uppercase">
            {assignedTeam.icon} {assignedTeam.name}
          </p>

          <p className="text-[11px] font-sans italic text-rose-200/90">
            &ldquo;{assignedTeam.tagline}&rdquo;
          </p>
        </div>
      )}

      {/* PRIMARY ACTION BUTTON */}
      <div className="z-20 w-full max-w-sm flex flex-col items-center mb-3">
        {!isSuccess ? (
          <button
            onClick={handleConsultOracle}
            disabled={isSpinning || isLoading}
            style={
              isSpinning
                ? { backgroundColor: '#7e22ce', color: '#ffffff' }
                : { backgroundColor: '#f59e0b', color: '#000000' }
            }
            className={`w-full py-4 px-6 rounded-full font-sans font-black text-sm md:text-base tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.95)] flex items-center justify-center gap-2.5 border-2 border-white ${
              isSpinning
                ? 'animate-pulse cursor-wait'
                : 'hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isSpinning ? 'animate-spin text-white' : 'text-black stroke-[2.5]'}`} />
            <span className="font-extrabold">{isSpinning ? 'EL CALDERO ESTÁ DECIDIENDO...' : '🔮 DESCUBRIR MI CLAN DEL DESTINO'}</span>
          </button>
        ) : (
          <button
            onClick={handleContinue}
            style={{ backgroundColor: '#10b981', color: '#000000' }}
            className="w-full py-4 px-6 rounded-full border-2 border-white font-sans font-black text-sm md:text-base tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.9)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="font-extrabold">CONTINUAR A MI PASE VIP</span>
            <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
