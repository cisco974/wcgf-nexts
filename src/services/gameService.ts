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
  LeagueContentLeagues,
  LocalizedContent,
  LocalizedMeta,
  PageType,
  Player,
  SupportedLocale,
  UpdateGameInput,
  UpdateGamePageInput,
  UpdatePageTypeInput,
} from "@app/types";

class GameService {
  /**
   * Récupère les données de classement pour un jeu spécifique
   * @param game Le jeu concerné
   * @returns Les données de classement ou null si non trouvé
   */
  async getLeagueRankings(game: string): Promise<Player[] | null> {
    try {
      // Dans une vraie application, vous feriez un appel API ici
      // Pour l'exemple, nous simulons un délai et retournons des données statiques
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulation de latence

      // Génération de données de joueurs
      return Array.from({ length: 30 }, (_, i) => {
        const rank = i + 1;
        // Calculer les statistiques en fonction du rang
        const wins = Math.max(20 - Math.floor(i / 3) * 2, 0);
        const losses = 20 - wins;
        const level = Math.max(10 - Math.floor(i / 3), 1);
        const points = Math.max(1500 - i * 50, 0);

        return {
          rank,
          name: [
            "ProGamerX",
            "Legend247",
            "CardMaster",
            "QuickDraw",
            "KingSlayer",
            "AceHunter",
            "DeckWizard",
            "TopDeck",
            "SharpMind",
            "GameChanger",
            "PlayerOne",
            "RandomHero",
            "RiskTaker",
            "CardShark",
            "LuckyDraw",
            "AllIn",
            "CardHunter",
            "Bluffing",
            "DeckBuilder",
            "MindReader",
            "SlowPlay",
            "LastStand",
            "OutOfLuck",
            "LowCard",
            "BottomDeck",
            "DesperateMove",
            "NoDraw",
            "LastChance",
            "DiscardKing",
            "DeadHand",
          ][i],
          avatar: `/img/avatars/${(i % 5) + 1}.webp`,
          wins,
          losses,
          level,
          points,
          pts: points,
        };
      });
    } catch (error) {
      console.error(`Error fetching league rankings for ${game}:`, error);
      return null;
    }
  }

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

  async getGamePageLeaguesByLocale(
    gameKey: string,
    pageTypeKey: string,
    locale: SupportedLocale = "en",
  ): Promise<{ content: LeagueContentLeagues; meta: LocalizedMeta } | null> {
    try {
      // Rechercher le jeu dans la base de données
      const gameData = await prisma.game.findUnique({
        where: { key: gameKey },
      });

      if (!gameData) {
        return null;
      }

      // Rechercher le type de page "leagues"
      const pageType = await prisma.pageType.findUnique({
        where: { key: pageTypeKey },
      });

      if (!pageType) {
        return null;
      }

      // Rechercher la page de classement de ligue pour ce jeu
      const gamePage = await prisma.gamePage.findFirst({
        where: {
          gameId: gameData.id,
          pageTypeId: pageType.id,
          isPublished: true,
        },
      });

      if (!gamePage) {
        return null;
      }

      // Convertir le contenu et les métadonnées de JSON en objets
      const content =
        typeof gamePage.content === "string"
          ? JSON.parse(gamePage.content)
          : gamePage.content;

      const meta =
        typeof gamePage.meta === "string"
          ? JSON.parse(gamePage.meta)
          : gamePage.meta;

      // Récupérer le contenu pour la langue demandée, avec fallback sur l'anglais
      const localizedContent = content[locale] || content["en"] || {};
      const localizedMeta = meta[locale] ||
        meta["en"] || {
          title: "",
          description: "",
          keywords: "",
          og_title: "",
          og_description: "",
          og_image: "",
        };

      // Obtenir les valeurs par défaut basées sur la locale
      const defaultValues = this.getDefaultLeagueValues(locale, gameData.title);

      // Étendre le contenu localisé avec les propriétés spécifiques aux classements de ligue
      const leagueContent: LeagueContentLeagues = {
        ...localizedContent,
        // S'assurer que ces propriétés existent, même si elles sont vides
        league_info: {
          promotion_zone_title:
            localizedContent.league_info?.promotion_zone_title ||
            defaultValues.promotion_zone_title,
          maintenance_zone_title:
            localizedContent.league_info?.maintenance_zone_title ||
            defaultValues.maintenance_zone_title,
          relegation_zone_title:
            localizedContent.league_info?.relegation_zone_title ||
            defaultValues.relegation_zone_title,
          footer_text:
            localizedContent.league_info?.footer_text ||
            defaultValues.footer_text,
        },
        highlight_sections: localizedContent.highlight_sections || [],
      };

      // Retourner le contenu et les métadonnées
      return {
        content: leagueContent,
        meta: localizedMeta,
      };
    } catch (error) {
      console.error(`Error fetching leagues page for ${gameKey}:`, error);
      return null;
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
   * Obtient les valeurs par défaut pour les zones de classement en fonction de la locale
   */
  private getDefaultLeagueValues(locale: SupportedLocale, gameTitle: string) {
    switch (locale) {
      case "fr":
        return {
          promotion_zone_title: "ZONE DE PROMOTION",
          maintenance_zone_title: "ZONE DE MAINTIEN",
          relegation_zone_title: "ZONE DE RELÉGATION",
          footer_text: `Classement officiel de la Ligue Super ${gameTitle} FMJC.`,
        };
      case "es":
        return {
          promotion_zone_title: "ZONA DE PROMOCIÓN",
          maintenance_zone_title: "ZONA DE MANTENIMIENTO",
          relegation_zone_title: "ZONA DE RELEGACIÓN",
          footer_text: `Clasificación oficial de la Liga Super ${gameTitle} FMJC.`,
        };
      default: // 'en'
        return {
          promotion_zone_title: "PROMOTION ZONE",
          maintenance_zone_title: "MAINTENANCE ZONE",
          relegation_zone_title: "RELEGATION ZONE",
          footer_text: `Official ranking of the WCGF Super ${gameTitle} League.`,
        };
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
