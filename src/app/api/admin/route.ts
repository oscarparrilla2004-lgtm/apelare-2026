import { NextResponse } from 'next/server';
import { TeamsService } from '@/lib/teamsService';

const ADMIN_PASSWORD = 'admin';

export async function GET() {
  try {
    const data = await TeamsService.getAdminTeamsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al consultar datos de administración.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const memberId = searchParams.get('memberId');

    if (!teamId || !memberId) {
      return NextResponse.json(
        { success: false, message: 'Faltan parámetros teamId o memberId.' },
        { status: 400 }
      );
    }

    const result = await TeamsService.removeMember(teamId, memberId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al eliminar miembro.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'reset_all') {
      // Require password for destructive reset action
      if (!body.password || body.password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { success: false, message: 'Contraseña incorrecta. Acceso denegado.' },
          { status: 403 }
        );
      }
      const result = await TeamsService.resetAllTeams();
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, message: 'Acción no reconocida' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Error al reiniciar clanes' }, { status: 500 });
  }
}
