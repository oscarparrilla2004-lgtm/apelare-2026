import fs from 'fs/promises';
import path from 'path';
import { TEAMS_CONFIG, MAX_PLAYERS_PER_TEAM, TOTAL_MAX_PLAYERS } from '@/config/teamsConfig';
import { TeamMember, TeamState, TeamsOverviewResponse, AdminTeamsDataResponse } from '@/types';

const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'teams_data.json');
const BUNDLED_DATA_FILE = path.join(process.cwd(), 'data', 'teams_data.json');

function getRedisCredentials() {
  const env = process.env;
  let url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || env.STORAGE_REST_API_URL;
  let token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || env.STORAGE_REST_API_TOKEN;

  if (!url || !token) {
    const urlKey = Object.keys(env).find((k) => k.endsWith('_REST_API_URL'));
    const tokenKey = Object.keys(env).find((k) => k.endsWith('_REST_API_TOKEN'));
    if (urlKey) url = env[urlKey];
    if (tokenKey) token = env[tokenKey];
  }

  return { url, token };
}

const REDIS_KEY = 'akelarre_2026_teams';

interface StoredTeamsData {
  members: Record<string, TeamMember[]>; // teamId -> TeamMember[]
  updatedAt: string;
}

function createEmptyData(): StoredTeamsData {
  return {
    members: {
      pecadores_caldero: [],
      akelarre_extasis: [],
      luna_roja: [],
      placer_oscuro: [],
      viboras_deseo: [],
      vela_negra: [],
    },
    updatedAt: new Date().toISOString(),
  };
}

async function ensureDataFile(): Promise<StoredTeamsData> {
  const { url: redisUrl, token: redisToken } = getRedisCredentials();

  // 1. Try Cloud Redis (Upstash / Vercel KV) if connected — this is the ONLY source of truth
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/${REDIS_KEY}`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Redis HTTP error: ${res.status}`);
      }

      const data = await res.json();

      if (data.result) {
        // Key exists and has data — parse and return it
        const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        for (const team of TEAMS_CONFIG) {
          if (!parsed.members[team.id]) {
            parsed.members[team.id] = [];
          }
        }
        return parsed;
      } else {
        // Key doesn't exist yet in Redis — return empty WITHOUT saving (prevents wiping on transient null)
        const fresh = createEmptyData();
        return fresh;
      }
    } catch (err) {
      // Redis error — do NOT fall through to file (file is always empty on Vercel /tmp cold starts)
      // Return empty data in memory only — do NOT save it to Redis
      console.error('[TeamsService] Redis read error, returning in-memory empty:', err);
      return createEmptyData();
    }
  }

  // 2. Local dev fallback only (not used on Vercel since Redis credentials are always present)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let content: string;
    try {
      content = await fs.readFile(DATA_FILE, 'utf-8');
    } catch {
      content = await fs.readFile(BUNDLED_DATA_FILE, 'utf-8');
      await fs.writeFile(DATA_FILE, content, 'utf-8');
    }
    const parsed = JSON.parse(content) as StoredTeamsData;
    for (const team of TEAMS_CONFIG) {
      if (!parsed.members[team.id]) {
        parsed.members[team.id] = [];
      }
    }
    return parsed;
  } catch {
    return createEmptyData();
  }
}

async function saveTeamsData(data: StoredTeamsData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  const { url: redisUrl, token: redisToken } = getRedisCredentials();

  // Save to Cloud Redis if connected
  if (redisUrl && redisToken) {
    try {
      await fetch(`${redisUrl}/set/${REDIS_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(data)),
      });
      return;
    } catch {
      // Fallback to file
    }
  }

  // Fallback to file system
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

import { getSpouseInfoByToken } from '@/config/couplesConfig';

export class TeamsService {
  /**
   * Obtiene la lista completa de equipos con sus estados para los usuarios,
   * excluyendo el clan de su pareja si ya está inscrita.
   */
  static async getTeamsOverview(token?: string): Promise<TeamsOverviewResponse> {
    const data = await ensureDataFile();
    let totalPlayers = 0;

    // Buscar si el participante tiene pareja y si dicha pareja ya está en algún clan
    let spouseClanId: string | null = null;
    let spouseClanName: string | null = null;
    let spouseName: string | null = null;

    if (token) {
      const spouseInfo = getSpouseInfoByToken(token);
      if (spouseInfo) {
        spouseName = spouseInfo.spouse.name;
        const spouseToken = spouseInfo.spouse.token.toUpperCase();
        const spouseNormalizedName = spouseInfo.spouse.name.toLowerCase().trim();

        for (const [tid, members] of Object.entries(data.members)) {
          const hasSpouse = members.some(
            (m) =>
              m.token.toUpperCase() === spouseToken ||
              m.nombreMortal.toLowerCase().trim() === spouseNormalizedName
          );
          if (hasSpouse) {
            spouseClanId = tid;
            const teamDef = TEAMS_CONFIG.find((t) => t.id === tid);
            spouseClanName = teamDef?.name || tid;
            break;
          }
        }
      }
    }

    const teams = TEAMS_CONFIG.map((def) => {
      const members = data.members[def.id] || [];
      const currentCount = members.length;
      totalPlayers += currentCount;
      const isExcludedForSpouse = spouseClanId === def.id;

      return {
        id: def.id,
        name: def.name,
        tagline: def.tagline,
        icon: def.icon,
        color: def.color,
        borderColor: def.borderColor,
        bgGradient: def.bgGradient,
        glowColor: def.glowColor,
        maxMembers: def.maxMembers,
        currentCount,
        isFull: currentCount >= def.maxMembers,
        isExcludedForSpouse,
        spouseName: isExcludedForSpouse && spouseName ? spouseName : undefined,
      };
    });

    return {
      success: true,
      totalPlayers,
      maxTotalCapacity: TOTAL_MAX_PLAYERS,
      spouseExclusionInfo:
        spouseClanId && spouseClanName && spouseName
          ? {
              spouseName,
              spouseTeamId: spouseClanId,
              spouseTeamName: spouseClanName,
            }
          : undefined,
      teams,
    };
  }

  /**
   * Obtiene la información detallada con miembros para el Administrador/Organizador
   */
  static async getAdminTeamsData(): Promise<AdminTeamsDataResponse> {
    const data = await ensureDataFile();
    let totalPlayers = 0;

    const teams: TeamState[] = TEAMS_CONFIG.map((def) => {
      const members = data.members[def.id] || [];
      const currentCount = members.length;
      totalPlayers += currentCount;

      return {
        ...def,
        currentCount,
        isFull: currentCount >= def.maxMembers,
        members,
      };
    });

    return {
      success: true,
      totalPlayers,
      maxTotalCapacity: TOTAL_MAX_PLAYERS,
      teams,
    };
  }

  /**
   * Une a un participante a un equipo validando capacidad máxima (7) y anti-colisión de parejas
   */
  static async joinTeam(params: {
    teamId: string;
    token: string;
    nombreMortal: string;
    aliasBrujo: string;
    genero: 'masculino' | 'femenino';
  }): Promise<{ success: boolean; message: string; team?: TeamState }> {
    const { teamId, token, nombreMortal, aliasBrujo, genero } = params;

    const teamDef = TEAMS_CONFIG.find((t) => t.id === teamId);
    if (!teamDef) {
      return { success: false, message: 'El clan seleccionado no existe.' };
    }

    const data = await ensureDataFile();

    // 0. IDEMPOTENCY: Si el participante ya está en el equipo correcto, no hacer nada
    const alreadyInTargetTeam = (data.members[teamId] || []).some(
      (m) => m.token.toUpperCase() === token.toUpperCase()
    );
    if (alreadyInTargetTeam) {
      const targetMembers = data.members[teamId] || [];
      return {
        success: true,
        message: `Ya perteneces al clan ${teamDef.name}.`,
        team: {
          ...teamDef,
          currentCount: targetMembers.length,
          isFull: targetMembers.length >= teamDef.maxMembers,
          members: targetMembers,
        },
      };
    }

    // 1. Validar separación de parejas (Anti-Collision)
    const spouseInfo = getSpouseInfoByToken(token);
    if (spouseInfo) {
      const spouseToken = spouseInfo.spouse.token.toUpperCase();
      const spouseNormalizedName = spouseInfo.spouse.name.toLowerCase().trim();
      const targetTeamMembers = data.members[teamId] || [];

      const spouseInTargetTeam = targetTeamMembers.some(
        (m) =>
          m.token.toUpperCase() === spouseToken ||
          m.nombreMortal.toLowerCase().trim() === spouseNormalizedName
      );

      if (spouseInTargetTeam) {
        return {
          success: false,
          message: `Tu pareja (${spouseInfo.spouse.name}) ya está en el clan ${teamDef.name}. El Akelarre exige separación de parejas. Por favor, elige otro clan.`,
        };
      }
    }

    // 2. Eliminar al jugador de cualquier otro equipo (solo por token, no por nombre)
    for (const tid of Object.keys(data.members)) {
      if (tid === teamId) continue; // no tocar el equipo destino
      data.members[tid] = data.members[tid].filter(
        (m) => m.token.toUpperCase() !== token.toUpperCase()
      );
    }

    // 3. Comprobar si el equipo destino está lleno
    const targetMembers = data.members[teamId] || [];
    if (targetMembers.length >= teamDef.maxMembers) {
      return {
        success: false,
        message: `El clan ${teamDef.name} ya está completo (${teamDef.maxMembers}/${teamDef.maxMembers}). Por favor, elige otro.`,
      };
    }

    // 4. Crear el nuevo miembro
    const newMember: TeamMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      token: token.toUpperCase(),
      nombreMortal: nombreMortal.trim(),
      aliasBrujo: aliasBrujo.trim(),
      genero,
      fechaRegistro: new Date().toISOString(),
    };

    targetMembers.push(newMember);
    data.members[teamId] = targetMembers;

    await saveTeamsData(data);

    return {
      success: true,
      message: `¡Te has unido con éxito al clan ${teamDef.name}!`,
      team: {
        ...teamDef,
        currentCount: targetMembers.length,
        isFull: targetMembers.length >= teamDef.maxMembers,
        members: targetMembers,
      },
    };
  }

  /**
   * Elimina un participante (para uso de administración)
   */
  static async removeMember(teamId: string, memberId: string): Promise<{ success: boolean; message: string }> {
    const data = await ensureDataFile();
    if (data.members[teamId]) {
      data.members[teamId] = data.members[teamId].filter((m) => m.id !== memberId);
      await saveTeamsData(data);
      return { success: true, message: 'Miembro eliminado correctamente.' };
    }
    return { success: false, message: 'Equipo no encontrado.' };
  }

  /**
   * Reinicia todos los clanes a 0 miembros (para uso de administración)
   */
  static async resetAllTeams(): Promise<{ success: boolean; message: string }> {
    const data: StoredTeamsData = {
      members: {
        pecadores_caldero: [],
        akelarre_extasis: [],
        luna_roja: [],
        placer_oscuro: [],
        viboras_deseo: [],
        vela_negra: [],
      },
      updatedAt: new Date().toISOString(),
    };
    await saveTeamsData(data);
    return { success: true, message: 'Todos los clanes han sido reiniciados a 0 almas.' };
  }
}
