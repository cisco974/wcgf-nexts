"use server";

import prisma from "@root/lib/prisma";
import { CreateGamePageInput, PageType, UpdateGamePageInput } from "@app/types";

/**
 * Récupère la liste des jeux
 */
export async function fetchGames() {
  try {
    return await prisma.game.findMany({
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}

/**
 * Récupère un jeu par ID
 */
export async function fetchGameById(id: number) {
  try {
    return await prisma.game.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
}
export async function loadInitialData(gameId: number, pageTypeKey: string) {
  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    const pageType = await prisma.pageType.findUnique({
      where: { key: pageTypeKey },
    });

    if (!game || !pageType) {
      throw new Error("Game or PageType not found");
    }

    const gamePage = await prisma.gamePage.findUnique({
      where: {
        gameId_pageTypeId: {
          gameId,
          pageTypeId: pageType.id,
        },
      },
      include: { pageType: true },
    });

    return {
      game,
      pageType,
      gamePage: gamePage
        ? {
            ...gamePage,
            content:
              typeof gamePage.content === "string"
                ? JSON.parse(gamePage.content)
                : gamePage.content,
            meta:
              typeof gamePage.meta === "string"
                ? JSON.parse(gamePage.meta)
                : gamePage.meta,
          }
        : null,
    };
  } catch (error) {
    console.error("Error loading initial game page data:", error);
    throw error;
  }
}

export async function getDashboardStats() {
  try {
    const games = await prisma.game.findMany();
    const pageTypes = await prisma.pageType.findMany();

    let totalPages = 0;
    let publishedPages = 0;

    for (const game of games) {
      const pages = await prisma.gamePage.findMany({
        where: { gameId: game.id },
      });
      totalPages += pages.length;
      publishedPages += pages.filter((page) => page.isPublished).length;
    }

    return {
      gamesCount: games.length,
      pageTypesCount: pageTypes.length,
      totalPages,
      publishedPages,
      draftPages: totalPages - publishedPages,
      recentGames: games
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error fetching dashboard stats",
    );
  }
}
/**
 * Crée un nouveau jeu
 */
export async function createGame(formData: FormData) {
  try {
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;

    if (!key || !title) {
      throw new Error("Key and title are required");
    }

    return await prisma.game.create({
      data: {
        key,
        title,
        subtitle: subtitle || null,
      },
    });
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
}

/**
 * Met à jour un jeu existant
 */
export async function updateGame(gameId: number, formData: FormData) {
  try {
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;

    if (!key || !title) {
      throw new Error("Key and title are required");
    }

    return await prisma.game.update({
      where: { id: gameId },
      data: {
        key,
        title,
        subtitle: subtitle || null,
      },
    });
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
}
/**
 * Supprime un jeu
 */
export async function deleteGame(id: number) {
  try {
    await prisma.gamePage.deleteMany({
      where: { gameId: id },
    });

    return await prisma.game.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    throw error;
  }
}
/**
 * Récupère toutes les pages de jeu
 */
export async function fetchGamePages(gameId: number) {
  try {
    return await prisma.gamePage.findMany({
      where: { gameId },
      include: { pageType: true },
      orderBy: { pageType: { name: "asc" } },
    });
  } catch (error) {
    console.error(`Error fetching game pages for gameId ${gameId}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle page de jeu
 */
export async function createGamePage(data: CreateGamePageInput) {
  try {
    return await prisma.gamePage.create({
      data: {
        gameId: data.gameId,
        pageTypeId: data.pageTypeId,
        content: JSON.stringify(data.content),
        meta: JSON.stringify(data.meta),
        isPublished: data.isPublished,
      },
      include: { pageType: true },
    });
  } catch (error) {
    console.error("Error creating game page:", error);
    throw error;
  }
}

/**
 * Met à jour une page de jeu
 */
export async function updateGamePage(
  gameId: number,
  pageTypeId: number,
  data: UpdateGamePageInput,
) {
  try {
    return await prisma.gamePage.update({
      where: {
        gameId_pageTypeId: {
          gameId,
          pageTypeId,
        },
      },
      data: {
        content: JSON.stringify(data.content),
        meta: JSON.stringify(data.meta),
        isPublished: data.isPublished,
      },
      include: { pageType: true },
    });
  } catch (error) {
    console.error(
      `Error updating game page for gameId=${gameId}, pageTypeId=${pageTypeId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Supprime une page de jeu
 */
export async function deleteGamePage(gameId: number, pageTypeId: number) {
  try {
    return await prisma.gamePage.delete({
      where: {
        gameId_pageTypeId: {
          gameId,
          pageTypeId,
        },
      },
    });
  } catch (error) {
    console.error(
      `Error deleting game page for gameId=${gameId}, pageTypeId=${pageTypeId}:`,
      error,
    );
    throw error;
  }
}
export async function getGames() {
  try {
    return await prisma.game.findMany({
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}
/**
 * Sauvegarde ou met à jour une page de jeu
 */
export async function saveGamePage(
  gameId: number,
  pageTypeId: number,
  data: {
    content: Record<string, unknown>;
    meta: Record<string, Record<string, string>>;
    isPublished: boolean;
  },
  id = 0,
) {
  try {
    if (id > 0) {
      return await prisma.gamePage.update({
        where: {
          gameId_pageTypeId: { gameId, pageTypeId },
        },
        data: {
          content: JSON.stringify(data.content),
          meta: JSON.stringify(data.meta),
          isPublished: data.isPublished,
        },
        include: { pageType: true },
      });
    } else {
      return await prisma.gamePage.create({
        data: {
          gameId,
          pageTypeId,
          content: JSON.stringify(data.content),
          meta: JSON.stringify(data.meta),
          isPublished: data.isPublished,
        },
        include: { pageType: true },
      });
    }
  } catch (error) {
    console.error("Error saving game page:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error saving page",
    );
  }
}
export async function getGameDetails(gameId: number) {
  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }

    const pageTypes = await prisma.pageType.findMany();
    const gamePages = await prisma.gamePage.findMany({
      where: { gameId },
    });

    return {
      game,
      pageTypes,
      gamePages,
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
}

// Récupère tous les types de pages
export async function getPageTypes(): Promise<PageType[]> {
  try {
    return await prisma.pageType.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching page types:", error);
    throw new Error("Error fetching page types");
  }
}

// Crée un nouveau type de page
export async function createPageType(formData: FormData): Promise<PageType> {
  try {
    const key = formData.get("key") as string;
    const name = formData.get("name") as string;

    if (!key || !name) {
      throw new Error("Key and name are required");
    }

    return await prisma.pageType.create({
      data: { key, name },
    });
  } catch (error) {
    console.error("Error creating page type:", error);
    throw new Error("Error creating page type");
  }
}

// Supprime un type de page
export async function deletePageType(id: number): Promise<void> {
  try {
    await prisma.pageType.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting page type:", error);
    throw new Error("Error deleting page type");
  }
}

// Vérifie si un type de page est utilisé
export async function checkPageTypeUsage(id: number): Promise<number> {
  try {
    return await prisma.gamePage.count({
      where: { pageTypeId: id },
    });
  } catch (error) {
    console.error("Error checking page type usage:", error);
    throw new Error("Error checking page type usage");
  }
}
