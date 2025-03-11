import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    // Await params avant d'accéder à ses propriétés
    const resolvedParams = await params;
    const gameId = parseInt(resolvedParams.gameId);

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    // Await params avant d'accéder à ses propriétés
    const resolvedParams = await params;
    const gameId = parseInt(resolvedParams.gameId);
    const data = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Update game
    const updatedGame = await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        key: data.key || game.key,
        title: data.title || game.title,
        subtitle: data.subtitle,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
