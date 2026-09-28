import { NextResponse } from 'next/server';
import { eventConfig } from '@/config/eventConfig';
import { VerifyTokenResponse, GuestData } from '@/types';
import { TeamsService } from '@/lib/teamsService';
import { getSpouseInfoByToken } from '@/config/couplesConfig';

function formatTokenToName(rawToken: string): string {
  if (!rawToken || rawToken.toUpperCase() === 'DEMO') return '';
  // Replace underscores and dashes with spaces, and capitalize words
  const clean = rawToken.replace(/[_-]+/g, ' ').trim();
  return clean
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get('token') || 'DEMO';
  const token = rawToken.toUpperCase();

  // Check if this token matches a pre-registered guest in couplesConfig
  const coupleInfo = getSpouseInfoByToken(rawToken);

  // Check if this token or guest is already enrolled in any team in the database
  const adminData = await TeamsService.getAdminTeamsData();
  let existingMember = undefined;
  let enrolledTeamName = undefined;
  let enrolledTeamId = undefined;

  for (const team of adminData.teams) {
    const member = team.members.find(
      (m) =>
        m.token.toUpperCase() === token ||
        (coupleInfo && m.token.toUpperCase() === coupleInfo.me.token.toUpperCase()) ||
        (coupleInfo && m.nombreMortal.toLowerCase().trim() === coupleInfo.me.name.toLowerCase().trim()) ||
        m.nombreMortal.toLowerCase().trim() === rawToken.toLowerCase().trim()
    );
    if (member) {
      existingMember = member;
      enrolledTeamName = team.name;
      enrolledTeamId = team.id;
      break;
    }
  }

  const nameFormatted =
    existingMember?.nombreMortal ||
    coupleInfo?.me.name ||
    formatTokenToName(rawToken);

  const guestGender =
    existingMember?.genero ||
    coupleInfo?.me.gender ||
    'masculino';

  const guest: GuestData = {
    token: coupleInfo ? coupleInfo.me.token : token,
    nombre: nameFormatted || undefined,
    alias: existingMember?.aliasBrujo,
    genero: guestGender,
    equipoId: enrolledTeamId,
    equipoNombre: enrolledTeamName,
    estado: existingMember ? 'EQUIPO_SELECCIONADO' : 'CREADA',
    fechaApertura: null,
    pactAceptado: !!existingMember,
    whatsappDesbloqueado: !!existingMember,
  };

  const response = {
    valid: true,
    isSealed: !!existingMember,
    guest,
    spouse: coupleInfo
      ? {
          name: coupleInfo.spouse.name,
          token: coupleInfo.spouse.token,
          gender: coupleInfo.spouse.gender,
        }
      : undefined,
    soulCount: 24 + adminData.totalPlayers,
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, action } = body as { token?: string; action?: 'accept_pact' | 'unlock_gate' };

    if (action === 'accept_pact') {
      return NextResponse.json({
        success: true,
        message: 'Pacto aceptado y sellado.',
      });
    }

    if (action === 'unlock_gate') {
      return NextResponse.json({
        success: true,
        whatsappLink: eventConfig.whatsappLink,
        message: 'Acceso al grupo de WhatsApp concedido.',
      });
    }

    return NextResponse.json({ success: false, message: 'Acción no reconocida' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno de validación' }, { status: 500 });
  }
}
