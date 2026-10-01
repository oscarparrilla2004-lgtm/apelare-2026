export type ExperienceStep = 
  | 'INTRO'           // Scene 1: Key intro & hold to awaken
  | 'LOCK'            // Scene 2: Ancient lock turn interaction
  | 'PORTAL'          // Scene 3: Doors opening & threshold crossing
  | 'REVEAL'          // Scene 4: Atmospheric party invitation details
  | 'PACT'            // Scene 5: Gothic parchment agreement & wax seal
  | 'TEAM'            // Scene 6: Select Akelarre Coven / Team (6 teams x 6 members = 36 total)
  | 'REWARD'          // Scene 7: Secret magic seal unlock & team assignment
  | 'GATE';           // Scene 8: Final WhatsApp link reveal

export type TokenStatus = 
  | 'CREADA'
  | 'LLAVE_ACTIVADA'
  | 'UMBRAL_ABIERTO'
  | 'PACTO_ACEPTADO'
  | 'EQUIPO_SELECCIONADO'
  | 'ACCESO_DESBLOQUEADO';

export interface GuestData {
  token: string;
  nombre?: string;
  alias?: string;
  genero?: 'masculino' | 'femenino';
  equipoId?: string;
  equipoNombre?: string;
  estado: TokenStatus;
  fechaApertura?: string | null;
  pactAceptado: boolean;
  whatsappDesbloqueado: boolean;
}

export interface VerifyTokenResponse {
  valid: boolean;
  isSealed?: boolean;
  guest?: GuestData;
  spouse?: {
    name: string;
    token: string;
    gender: 'masculino' | 'femenino';
  };
  whatsappLink?: string;
  soulCount?: number;
  message?: string;
  takenNicknames?: string[];
}

export interface TeamMember {
  id: string;
  token: string;
  nombreMortal: string;
  aliasBrujo: string;
  genero: 'masculino' | 'femenino';
  fechaRegistro: string;
}

export interface TeamDefinition {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  glowColor: string;
  maxMembers: number;
}

export interface TeamState extends TeamDefinition {
  currentCount: number;
  isFull: boolean;
  members: TeamMember[];
}

export interface TeamsOverviewResponse {
  success: boolean;
  totalPlayers: number;
  maxTotalCapacity: number;
  takenNicknames?: string[];
  spouseExclusionInfo?: {
    spouseName: string;
    spouseTeamId: string;
    spouseTeamName: string;
  };
  teams: {
    id: string;
    name: string;
    tagline: string;
    icon: string;
    color: string;
    borderColor: string;
    bgGradient: string;
    glowColor: string;
    maxMembers: number;
    currentCount: number;
    maleCount?: number;
    femaleCount?: number;
    isFull: boolean;
    isExcludedForSpouse?: boolean;
    spouseName?: string;
  }[];
}

export interface AdminTeamsDataResponse {
  success: boolean;
  totalPlayers: number;
  maxTotalCapacity: number;
  teams: TeamState[];
}

