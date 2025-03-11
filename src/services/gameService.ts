import { GameContent, GamePageData } from "../app/models/models";
import prisma from "../../lib/prisma";
import { GamePage } from "@prisma/client";

/**
 * Récupère les données d'une page de jeu en fonction de la clé du jeu, du type de page et de la langue
 *
 * @param gameKey - La clé du jeu (ex: "tarot", "rummy", "bridge")
 * @param pageTypeKey - Le type de page (ex: "game", "rules", "strategy")
 * @param locale - La langue (ex: "fr", "en", "es")
 * @returns Les données de la page ou null si non trouvé
 */
export async function fetchGamePage(
  gameKey: string,
  pageTypeKey: string,
  locale: string,
): Promise<GamePageData | null> {
  try {
    // 1. Récupérer le jeu par sa clé
    const game = await prisma.game.findUnique({
      where: { key: gameKey },
    });

    if (!game) {
      console.error(`Game with key '${gameKey}' not found`);
      return null;
    }

    // 2. Récupérer le type de page par sa clé
    const pageType = await prisma.pageType.findUnique({
      where: { key: pageTypeKey },
    });

    if (!pageType) {
      console.error(`PageType with key '${pageTypeKey}' not found`);
      return null;
    }

    // 3. Récupérer la page correspondante
    const gamePage = await prisma.gamePage.findFirst({
      where: {
        gameId: game.id,
        pageTypeId: pageType.id,
        isPublished: true,
      },
    });

    if (!gamePage) {
      console.error(
        `Published game page not found for game '${gameKey}' and page type '${pageTypeKey}'`,
      );
      return null;
    }

    // 4. Extraire le contenu et les métadonnées pour la langue spécifiée
    const content = getContentForLanguage(gamePage, locale);
    const meta = getMetaForLanguage(gamePage, locale);

    // 5. Si le contenu n'existe pas pour cette langue, essayer avec la langue par défaut (en)
    const fallbackLocale = "en";
    const finalContent =
      Object.keys(content).length === 0 && locale !== fallbackLocale
        ? getContentForLanguage(gamePage, fallbackLocale)
        : content;

    const finalMeta =
      Object.keys(meta).length === 0 && locale !== fallbackLocale
        ? getMetaForLanguage(gamePage, fallbackLocale)
        : meta;

    // 6. Retourner les données structurées
    return {
      meta: finalMeta,
      content: finalContent,
    };
  } catch (error) {
    console.error("Error fetching game page:", error);
    throw error;
  }
}

/**
 * Récupère le contenu pour une langue spécifique
 */
function getContentForLanguage(
  gamePage: GamePage,
  locale: string,
): GameContent {
  // Utilise une conversion de type en deux étapes pour éviter les erreurs TypeScript
  const rawContent = gamePage.content as unknown as Record<string, unknown>;
  const localeContent = rawContent[locale] || {};

  // Conversion vers le type GameContent
  return localeContent as unknown as GameContent;
}

/**
 * Récupère les métadonnées pour une langue spécifique
 */
function getMetaForLanguage(
  gamePage: GamePage,
  locale: string,
): GamePageData["meta"] {
  // Utilise une conversion de type en deux étapes pour éviter les erreurs TypeScript
  const rawMeta = gamePage.meta as unknown as Record<
    string,
    Record<string, string>
  >;
  const localeMeta = rawMeta[locale] || {};

  return {
    title: localeMeta.title || "",
    description: localeMeta.description || "",
    keywords: localeMeta.keywords || "",
    og_title: localeMeta.og_title || localeMeta.title || "",
    og_description: localeMeta.og_description || localeMeta.description || "",
    og_image: localeMeta.og_image || "",
  };
}

export default fetchGamePage;
