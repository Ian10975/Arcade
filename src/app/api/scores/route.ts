import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, avatar, score } = await request.json();

    // Verificar si ya existe un puntaje para este usuario
    const existingScore = await prisma.gameScore.findFirst({
      where: {
        user: {
          email: email
        }
      },
      include: {
        user: true
      }
    });

    if (existingScore) {
      // Si el puntaje existente es menor, actualizarlo
      if (existingScore.score < score) {
        await prisma.gameScore.update({
          where: { id: existingScore.id },
          data: { score: score }
        });
        return NextResponse.json({ 
          message: 'Puntaje actualizado', 
          updated: true 
        });
      } else {
        // Si el puntaje existente es mayor o igual, no hacer nada
        return NextResponse.json({ 
          message: 'Puntaje no superado', 
          updated: false 
        });
      }
    } else {
      // Crear nuevo usuario y puntaje
      const user = await prisma.user.create({
        data: {
          name,
          email,
          avatar,
          scores: {
            create: {
              score: score
            }
          }
        }
      });

      return NextResponse.json({ 
        message: 'Usuario y puntaje creados', 
        user: user 
      });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener solo los 3 mejores puntajes únicos
    const topScores = await prisma.gameScore.findMany({
      take: 3,
      orderBy: {
        score: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json(topScores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Nuevo endpoint para eliminar puntajes
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    // Eliminar el puntaje
    await prisma.gameScore.delete({
      where: { id: id }
    });

    return NextResponse.json({ 
      message: 'Puntaje eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting score:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
