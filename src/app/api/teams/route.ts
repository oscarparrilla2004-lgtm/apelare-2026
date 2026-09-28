import { NextResponse } from 'next/server';
import { TeamsService } from '@/lib/teamsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || undefined;
    const overview = await TeamsService.getTeamsOverview(token);
    return NextResponse.json(overview);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al consultar clanes del Akelarre.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, token, nombreMortal, aliasBrujo, genero } = body;

    if (!teamId || !nombreMortal) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos obligatorios para unirse al clan.' },
        { status: 400 }
      );
    }

    const result = await TeamsService.joinTeam({
      teamId,
      token: token || 'DEMO',
      nombreMortal,
      aliasBrujo: aliasBrujo || 'Iniciado de las Sombras',
      genero: genero || 'masculino',
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error interno al registrarse en el clan.' },
      { status: 500 }
    );
  }
}
