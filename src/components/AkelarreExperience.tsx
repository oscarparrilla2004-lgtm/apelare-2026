'use client';

import React, { useState, useEffect } from 'react';
import { ExperienceStep, GuestData } from '@/types';
import { ParticleBackground } from './ParticleBackground';
import { SoundController } from './SoundController';
import { SecretTrigger } from './SecretTrigger';
import { KeyIntro } from './KeyIntro';
import { LockInteraction } from './LockInteraction';
import { PortalOpening } from './PortalOpening';
import { InvitationReveal } from './InvitationReveal';
import { Pact } from './Pact';
import { TeamSelection } from './TeamSelection';
import { RewardReveal } from './RewardReveal';
import { RitualProgress } from './RitualProgress';

interface AkelarreExperienceProps {
  initialToken?: string;
}

export const AkelarreExperience: React.FC<AkelarreExperienceProps> = ({ initialToken = 'DEMO' }) => {
  const [currentStep, setCurrentStep] = useState<ExperienceStep>('INTRO');
  const [guest, setGuest] = useState<GuestData | undefined>(undefined);
  const [soulCount, setSoulCount] = useState(24);
  const [guestName, setGuestName] = useState<string>('');
  const [witchNickname, setWitchNickname] = useState<string>('');
  const [gender, setGender] = useState<'masculino' | 'femenino'>('masculino');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTeamName, setSelectedTeamName] = useState<string>('');

  useEffect(() => {
    fetch(`/api/verify-token?token=${encodeURIComponent(initialToken)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setGuest(data.guest);
          if (data.guest?.nombre) setGuestName(data.guest.nombre);
          if (data.guest?.genero) setGender(data.guest.genero);
          if (data.soulCount) setSoulCount(data.soulCount);

          // Single-use token protection: if already registered, show VIP pass directly
          if (data.isSealed || data.guest?.estado === 'EQUIPO_SELECCIONADO') {
            if (data.guest?.alias) setWitchNickname(data.guest.alias);
            if (data.guest?.equipoId) setSelectedTeamId(data.guest.equipoId);
            if (data.guest?.equipoNombre) setSelectedTeamName(data.guest.equipoNombre);
            setCurrentStep('REWARD');
          }
        }
      })
      .catch(() => {
        // Fallback
      });
  }, [initialToken]);

  return (
    <main className="relative min-h-screen w-full bg-akelarre-dark text-white overflow-hidden font-sans select-none">
      {/* Dynamic Animated Ambient Embers Background */}
      <ParticleBackground intensity={currentStep === 'PORTAL' || currentStep === 'TEAM' || currentStep === 'REWARD' ? 'high' : 'normal'} />

      {/* Sound Controller visible ONLY on initial screen so it never covers information */}
      {currentStep === 'INTRO' && <SoundController />}
      <RitualProgress currentStep={currentStep} />
      <SecretTrigger />

      {/* Render Active Scene */}
      <div className="relative z-10 w-full min-h-screen">
        {currentStep === 'INTRO' && (
          <KeyIntro
            guestName={guestName || guest?.nombre}
            onComplete={() => setCurrentStep('LOCK')}
          />
        )}

        {currentStep === 'LOCK' && (
          <LockInteraction
            onComplete={() => setCurrentStep('PORTAL')}
          />
        )}

        {currentStep === 'PORTAL' && (
          <PortalOpening
            onComplete={() => setCurrentStep('REVEAL')}
          />
        )}

        {currentStep === 'REVEAL' && (
          <InvitationReveal
            onNext={() => setCurrentStep('PACT')}
          />
        )}

        {currentStep === 'PACT' && (
          <Pact
            token={initialToken}
            initialGuestName={guestName || guest?.nombre}
            onComplete={(name, nickname, g) => {
              setGuestName(name);
              setWitchNickname(nickname);
              setGender(g);
              setCurrentStep('TEAM');
            }}
          />
        )}

        {currentStep === 'TEAM' && (
          <TeamSelection
            token={initialToken}
            guestName={guestName}
            witchNickname={witchNickname}
            gender={gender}
            onComplete={(teamId, teamName) => {
              setSelectedTeamId(teamId);
              setSelectedTeamName(teamName);
              setCurrentStep('REWARD');
            }}
          />
        )}

        {currentStep === 'REWARD' && (
          <RewardReveal
            token={initialToken}
            soulCount={soulCount}
            guestName={guestName}
            witchNickname={witchNickname}
            teamName={selectedTeamName}
          />
        )}
      </div>
    </main>
  );
};
