// src/app/services/gameService.ts
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import {
  CreateGameInput,
  CreateGamePageInput,
  CreatePageTypeInput,
  Game,
  GameFilters,
  GamePage,
  GamePageContent,
  GamePageMeta,
  LocalizedContent,
  LocalizedMeta,
  PageType,
  SupportedLocale,
  UpdateGameInput,
  UpdateGamePageInput,
  UpdatePageTypeInput,
} from "@app/types";

class GameService {
  /**
   * Récupère tous les jeux avec filtrage optionnel
   */
  async getGames(filters?: GameFilters): Promise<Game[]> {
    try {
      const where: Prisma.GameWhereInput = {};

      if (filters?.key) {
        where.key = filters.key;
      }

      if (filters?.title) {
        where.title = {
          contains: filters.title,
          mode: "insensitive",
        };
      }

      if (filters?.search) {
        where.OR = [
          { key: { contains: filters.search, mode: "insensitive" } },
          { title: { contains: filters.search, mode: "insensitive" } },
          { subtitle: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      return await prisma.game.findMany({
        where,
        orderBy: { title: "asc" },
      });
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  }

  /**
   * Récupère un jeu par son ID
   */
  async getGameById(id: number): Promise<Game | null> {
    try {
      return await prisma.game.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching game with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un jeu par sa clé
   */
  async getGameByKey(key: string): Promise<Game | null> {
    try {
      return await prisma.game.findUnique({
        where: { key },
      });
    } catch (error) {
      console.error(`Error fetching game with key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau jeu
   */
  async createGame(data: CreateGameInput): Promise<Game> {
    try {
      // Vérifier si un jeu avec cette clé existe déjà
      const existing = await prisma.game.findUnique({
        where: { key: data.key },
      });

      if (existing) {
        throw new Error(`A game with key '${data.key}' already exists`);
      }

      return await prisma.game.create({
        data,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  }

  /**
   * Met à jour un jeu existant
   */
  async updateGame(id: number, data: UpdateGameInput): Promise<Game> {
    try {
      // Vérifier si le jeu existe
      const game = await prisma.game.findUnique({
        where: { id },
      });

      if (!game) {
        throw new Error(`Game with ID ${id} not found`);
      }

      // Vérifier si la nouvelle clé est déjà utilisée par un autre jeu
      if (data.key && data.key !== game.key) {
        const existing = await prisma.game.findUnique({
          where: { key: data.key },
        });

        if (existing && existing.id !== id) {
          throw new Error(
            `Another game is already using the key '${data.key}'`,
          );
        }
      }

      return await prisma.game.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Error updating game with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un jeu
   */
  async deleteGame(id: number): Promise<Game> {
    try {
      // Vérifier si le jeu existe
      const game = await prisma.game.findUnique({
        where: { id },
      });

      if (!game) {
        throw new Error(`Game with ID ${id} not found`);
      }

      // Supprimer d'abord toutes les pages associées au jeu
      await prisma.gamePage.deleteMany({
        where: { gameId: id },
      });

      // Supprimer le jeu
      return await prisma.game.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting game with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère tous les types de page
   */
  async getPageTypes(): Promise<PageType[]> {
    try {
      return await prisma.pageType.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Error fetching page types:", error);
      throw error;
    }
  }

  /**
   * Récupère un type de page par son ID
   */
  async getPageTypeById(id: number): Promise<PageType | null> {
    try {
      return await prisma.pageType.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching page type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un type de page par sa clé
   */
  async getPageTypeByKey(key: string): Promise<PageType | null> {
    try {
      return await prisma.pageType.findUnique({
        where: { key },
      });
    } catch (error) {
      console.error(`Error fetching page type with key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau type de page
   */
  async createPageType(data: CreatePageTypeInput): Promise<PageType> {
    try {
      // Vérifier si un type de page avec cette clé existe déjà
      const existing = await prisma.pageType.findUnique({
        where: { key: data.key },
      });

      if (existing) {
        throw new Error(`A page type with key '${data.key}' already exists`);
      }

      return await prisma.pageType.create({
        data,
      });
    } catch (error) {
      console.error("Error creating page type:", error);
      throw error;
    }
  }

  /**
   * Met à jour un type de page existant
   */
  async updatePageType(
    id: number,
    data: UpdatePageTypeInput,
  ): Promise<PageType> {
    try {
      // Vérifier si le type de page existe
      const pageType = await prisma.pageType.findUnique({
        where: { id },
      });

      if (!pageType) {
        throw new Error(`Page type with ID ${id} not found`);
      }

      // Vérifier si la nouvelle clé est déjà utilisée par un autre type de page
      if (data.key && data.key !== pageType.key) {
        const existing = await prisma.pageType.findUnique({
          where: { key: data.key },
        });

        if (existing && existing.id !== id) {
          throw new Error(
            `Another page type is already using the key '${data.key}'`,
          );
        }
      }

      return await prisma.pageType.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Error updating page type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un type de page
   */
  async deletePageType(id: number): Promise<PageType> {
    try {
      // Vérifier si le type de page existe
      const pageType = await prisma.pageType.findUnique({
        where: { id },
      });

      if (!pageType) {
        throw new Error(`Page type with ID ${id} not found`);
      }

      // Vérifier si des pages utilisent ce type
      const pagesCount = await prisma.gamePage.count({
        where: { pageTypeId: id },
      });

      if (pagesCount > 0) {
        throw new Error(
          `Cannot delete page type: ${pagesCount} pages are using it`,
        );
      }

      // Supprimer le type de page
      return await prisma.pageType.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting page type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère une page de jeu par ses IDs
   */
  async getGamePage(
    gameId: number,
    pageTypeId: number,
  ): Promise<GamePage | null> {
    try {
      const page = await prisma.gamePage.findUnique({
        where: {
          gameId_pageTypeId: {
            gameId,
            pageTypeId,
          },
        },
        include: {
          game: true,
          pageType: true,
        },
      });

      if (!page) {
        return null;
      }

      // Parser le contenu et les métadonnées JSON
      return {
        ...page,
        content:
          typeof page.content === "string"
            ? JSON.parse(page.content)
            : page.content,
        meta: typeof page.meta === "string" ? JSON.parse(page.meta) : page.meta,
      };
    } catch (error) {
      console.error(
        `Error fetching game page for gameId=${gameId}, pageTypeId=${pageTypeId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Crée une nouvelle page de jeu
   */
  async createGamePage(data: CreateGamePageInput): Promise<GamePage> {
    try {
      // Vérifier si le jeu et le type de page existent
      const game = await prisma.game.findUnique({
        where: { id: data.gameId },
      });

      if (!game) {
        throw new Error(`Game with ID ${data.gameId} not found`);
      }

      const pageType = await prisma.pageType.findUnique({
        where: { id: data.pageTypeId },
      });

      if (!pageType) {
        throw new Error(`Page type with ID ${data.pageTypeId} not found`);
      }

      // Vérifier si une page existe déjà pour ce jeu et ce type
      const existing = await prisma.gamePage.findUnique({
        where: {
          gameId_pageTypeId: {
            gameId: data.gameId,
            pageTypeId: data.pageTypeId,
          },
        },
      });

      if (existing) {
        throw new Error(`A page already exists for this game and page type`);
      }

      // Créer la page
      const newPage = await prisma.gamePage.create({
        data: {
          gameId: data.gameId,
          pageTypeId: data.pageTypeId,
          content: JSON.stringify(data.content),
          meta: JSON.stringify(data.meta),
          isPublished: data.isPublished,
        },
        include: {
          game: true,
          pageType: true,
        },
      });

      // Retourner la page avec contenu et métadonnées parsés
      return {
        ...newPage,
        content: data.content,
        meta: data.meta,
      };
    } catch (error) {
      console.error("Error creating game page:", error);
      throw error;
    }
  }

  /**
   * Met à jour une page de jeu existante
   */
  async updateGamePage(
    gameId: number,
    pageTypeId: number,
    data: UpdateGamePageInput,
  ): Promise<GamePage> {
    try {
      // Vérifier si la page existe
      const page = await prisma.gamePage.findUnique({
        where: {
          gameId_pageTypeId: {
            gameId,
            pageTypeId,
          },
        },
      });

      if (!page) {
        throw new Error(`Game page not found`);
      }

      // Préparer les données de mise à jour
      const updateData: Prisma.GamePageUpdateInput = {};

      if (data.content) {
        updateData.content = JSON.stringify(data.content);
      }

      if (data.meta) {
        updateData.meta = JSON.stringify(data.meta);
      }

      if (data.isPublished !== undefined) {
        updateData.isPublished = data.isPublished;
      }

      // Mettre à jour la page
      const updatedPage = await prisma.gamePage.update({
        where: {
          gameId_pageTypeId: {
            gameId,
            pageTypeId,
          },
        },
        data: updateData,
        include: {
          game: true,
          pageType: true,
        },
      });

      // Retourner la page avec contenu et métadonnées parsés
      return {
        ...updatedPage,
        content:
          typeof updatedPage.content === "string"
            ? JSON.parse(updatedPage.content)
            : updatedPage.content,
        meta:
          typeof updatedPage.meta === "string"
            ? JSON.parse(updatedPage.meta)
            : updatedPage.meta,
      };
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
  async deleteGamePage(gameId: number, pageTypeId: number): Promise<GamePage> {
    try {
      // Vérifier si la page existe
      const page = await prisma.gamePage.findUnique({
        where: {
          gameId_pageTypeId: {
            gameId,
            pageTypeId,
          },
        },
      });

      if (!page) {
        throw new Error(`Game page not found`);
      }

      // Supprimer la page
      const deletedPage = await prisma.gamePage.delete({
        where: {
          gameId_pageTypeId: {
            gameId,
            pageTypeId,
          },
        },
      });

      // Retourner la page supprimée avec contenu et métadonnées parsés
      return {
        ...deletedPage,
        content:
          typeof deletedPage.content === "string"
            ? JSON.parse(deletedPage.content)
            : deletedPage.content,
        meta:
          typeof deletedPage.meta === "string"
            ? JSON.parse(deletedPage.meta)
            : deletedPage.meta,
      };
    } catch (error) {
      console.error(
        `Error deleting game page for gameId=${gameId}, pageTypeId=${pageTypeId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Récupère une page de jeu par la clé du jeu, la clé du type de page et la langue
   */
  /**
   * Récupère une page de jeu par la clé du jeu, la clé du type de page et la langue
   * Gère le fallback vers la langue par défaut si nécessaire
   */
  async getGamePageByLocale(
    gameKey: string,
    pageTypeKey: string,
    locale: SupportedLocale = "en",
  ): Promise<{ content: LocalizedContent; meta: LocalizedMeta } | null> {
    try {
      // Récupérer le jeu par sa clé
      const game = await prisma.game.findUnique({
        where: { key: gameKey },
      });

      if (!game) {
        console.error(`Game with key '${gameKey}' not found`);
        return null;
      }

      // Récupérer le type de page par sa clé
      const pageType = await prisma.pageType.findUnique({
        where: { key: pageTypeKey },
      });

      if (!pageType) {
        console.error(`Page type with key '${pageTypeKey}' not found`);
        return null;
      }

      // Récupérer la page
      const page = await prisma.gamePage.findUnique({
        where: {
          gameId_pageTypeId: {
            gameId: game.id,
            pageTypeId: pageType.id,
          },
        },
      });

      if (!page) {
        console.error(
          `Page not found for game '${gameKey}' and page type '${pageTypeKey}'`,
        );
        return null;
      }

      if (!page.isPublished) {
        console.error(
          `Page for '${gameKey}/${pageTypeKey}' exists but is not published`,
        );
        return null;
      }

      // Extraire et normaliser le contenu et les métadonnées
      const content = this.normalizeJsonData<GamePageContent>(page.content);
      const meta = this.normalizeJsonData<GamePageMeta>(page.meta);

      // Gérer le contenu localisé avec fallback
      const fallbackLocale: SupportedLocale = "en";

      // Récupérer le contenu pour la langue demandée ou utiliser le fallback
      const localeContent = content[locale] || {};
      const shouldUseFallback =
        Object.keys(localeContent).length === 0 && locale !== fallbackLocale;
      const finalContent = shouldUseFallback
        ? ((content[fallbackLocale] || {}) as LocalizedContent)
        : (localeContent as LocalizedContent);

      // Récupérer les métadonnées pour la langue demandée ou utiliser le fallback
      const localeMeta = meta[locale] || {};
      const shouldUseMetaFallback =
        Object.keys(localeMeta).length === 0 && locale !== fallbackLocale;
      const finalMeta = shouldUseMetaFallback
        ? ((meta[fallbackLocale] || {}) as LocalizedMeta)
        : (localeMeta as LocalizedMeta);

      return {
        content: finalContent,
        meta: finalMeta,
      };
    } catch (error) {
      console.error(
        `Error fetching game page for gameKey=${gameKey}, pageTypeKey=${pageTypeKey}, locale=${locale}:`,
        error,
      );
      throw error;
    }
  }

  async getGamePagesByGameId(gameId: number): Promise<GamePage[]> {
    try {
      // Vérifier si le jeu existe
      const game = await prisma.game.findUnique({
        where: { id: gameId },
      });

      if (!game) {
        throw new Error(`Game with ID ${gameId} not found`);
      }

      // Récupérer toutes les pages du jeu avec les informations du type de page
      const pages = await prisma.gamePage.findMany({
        where: { gameId },
        include: {
          pageType: true,
        },
        orderBy: {
          pageType: {
            name: "asc",
          },
        },
      });

      // Transformer les données JSON en objets
      return pages.map((page) => ({
        ...page,
        content:
          typeof page.content === "string"
            ? JSON.parse(page.content)
            : page.content,
        meta: typeof page.meta === "string" ? JSON.parse(page.meta) : page.meta,
      }));
    } catch (error) {
      console.error(`Error fetching game pages for gameId ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Fonction utilitaire pour normaliser les données JSON
   * Gère à la fois les chaînes JSON et les objets déjà parsés
   */
  private normalizeJsonData<T>(data: unknown): T {
    if (typeof data === "string") {
      try {
        return JSON.parse(data) as T;
      } catch (error) {
        console.error("Error parsing JSON string:", error);
        return {} as T;
      }
    }
    return data as T;
  }
}
// Exporter une instance de la classe pour utilisation dans l'application
const gameService = new GameService();
export default gameService;
