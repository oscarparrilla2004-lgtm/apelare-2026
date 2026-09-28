import { NextResponse } from 'next/server';
import { TeamsService } from '@/lib/teamsService';

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
