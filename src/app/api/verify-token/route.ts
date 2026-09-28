import { NextResponse } from 'next/server';
import { eventConfig } from '@/config/eventConfig';
import { VerifyTokenResponse, GuestData } from '@/types';
import { TeamsService } from '@/lib/teamsService';

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

  // Check if this token is already enrolled in any team in the database
  const adminData = await TeamsService.getAdminTeamsData();
  let existingMember = undefined;
  let enrolledTeamName = undefined;
  let enrolledTeamId = undefined;

  for (const team of adminData.teams) {
    const member = team.members.find(
      (m) => m.token.toUpperCase() === token || m.nombreMortal.toLowerCase() === rawToken.toLowerCase()
    );
    if (member) {
      existingMember = member;
      enrolledTeamName = team.name;
      enrolledTeamId = team.id;
      break;
    }
  }

  const nameFormatted = existingMember?.nombreMortal || formatTokenToName(rawToken);

  const guest: GuestData = {
    token,
    nombre: nameFormatted || undefined,
    alias: existingMember?.aliasBrujo,
    genero: existingMember?.genero,
    equipoId: enrolledTeamId,
    equipoNombre: enrolledTeamName,
    estado: existingMember ? 'EQUIPO_SELECCIONADO' : 'CREADA',
    fechaApertura: null,
    pactAceptado: !!existingMember,
    whatsappDesbloqueado: !!existingMember,
  };

  const response: VerifyTokenResponse = {
    valid: true,
    guest,
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
