import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../../lib/prisma";

// Type pour les paramètres de route
type RouteParams = {
  gameId: string;
  pageType: string;
};

/**
 * GET - Récupère une page de jeu spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { gameId, pageType } = await params;
    const gameIdNum = parseInt(gameId, 10);

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: gameIdNum },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Find page type
    const pageTypeObj = await prisma.pageType.findUnique({
      where: { key: pageType },
    });

    if (!pageTypeObj) {
      return NextResponse.json(
        { error: "Page type not found" },
        { status: 404 },
      );
    }

    // Find game page
    const gamePage = await prisma.gamePage.findFirst({
      where: {
        gameId: gameIdNum,
        pageTypeId: pageTypeObj.id,
      },
      include: {
        pageType: true,
      },
    });

    if (!gamePage) {
      return NextResponse.json(
        { error: "Game page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(gamePage);
  } catch (error) {
    console.error("Error fetching game page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST - Crée une nouvelle page de jeu
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { gameId, pageType } = await params;
    const gameIdNum = parseInt(gameId, 10);
    const data = await request.json();

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: gameIdNum },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Find page type
    const pageTypeObj = await prisma.pageType.findUnique({
      where: { key: pageType },
    });

    if (!pageTypeObj) {
      return NextResponse.json(
        { error: "Page type not found" },
        { status: 404 },
      );
    }

    // Check if game page already exists
    const existingPage = await prisma.gamePage.findFirst({
      where: {
        gameId: gameIdNum,
        pageTypeId: pageTypeObj.id,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Game page already exists. Use PUT to update." },
        { status: 400 },
      );
    }

    // Create new game page
    const gamePage = await prisma.gamePage.create({
      data: {
        gameId: gameIdNum,
        pageTypeId: pageTypeObj.id,
        content: data.content || {},
        meta: data.meta || {},
        isPublished: data.isPublished || false,
      },
      include: {
        pageType: true,
      },
    });

    return NextResponse.json(gamePage);
  } catch (error) {
    console.error("Error creating game page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PUT - Met à jour une page de jeu existante
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { gameId, pageType } = await params;
    const gameIdNum = parseInt(gameId, 10);
    const data = await request.json();

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: gameIdNum },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Find page type
    const pageTypeObj = await prisma.pageType.findUnique({
      where: { key: pageType },
    });

    if (!pageTypeObj) {
      return NextResponse.json(
        { error: "Page type not found" },
        { status: 404 },
      );
    }

    // Find game page
    const gamePage = await prisma.gamePage.findFirst({
      where: {
        gameId: gameIdNum,
        pageTypeId: pageTypeObj.id,
      },
    });

    if (!gamePage) {
      return NextResponse.json(
        { error: "Game page not found. Use POST to create." },
        { status: 404 },
      );
    }

    // Update game page
    const updatedGamePage = await prisma.gamePage.update({
      where: {
        id: gamePage.id,
      },
      data: {
        content: data.content || gamePage.content,
        meta: data.meta || gamePage.meta,
        isPublished:
          data.isPublished !== undefined
            ? data.isPublished
            : gamePage.isPublished,
      },
      include: {
        pageType: true,
      },
    });

    return NextResponse.json(updatedGamePage);
  } catch (error) {
    console.error("Error updating game page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Supprime une page de jeu
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { gameId, pageType } = await params;
    const gameIdNum = parseInt(gameId, 10);

    // Find page type
    const pageTypeObj = await prisma.pageType.findUnique({
      where: { key: pageType },
    });

    if (!pageTypeObj) {
      return NextResponse.json(
        { error: "Page type not found" },
        { status: 404 },
      );
    }

    // Find game page
    const gamePage = await prisma.gamePage.findFirst({
      where: {
        gameId: gameIdNum,
        pageTypeId: pageTypeObj.id,
      },
    });

    if (!gamePage) {
      return NextResponse.json(
        { error: "Game page not found" },
        { status: 404 },
      );
    }

    // Delete game page
    await prisma.gamePage.delete({
      where: {
        id: gamePage.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting game page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
