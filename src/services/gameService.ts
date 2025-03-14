// services/gameService.ts
import { formatFirestoreData, getAdminDb } from "@lib/firebase-config";
import { GamePage } from "@models/fireStoreModels";

class GameService {
  /**
   * Récupère une page de jeu par sa clé et son type, dans une langue spécifique
   * @param gameKey - La clé du jeu (ex: "tarot", "rummy", etc.)
   * @param pageType - Le type de page (ex: "game", "rules", etc.)
   * @param locale - La langue (en, fr, es)
   * @returns La page du jeu ou null si non trouvée
   */
  async getGamePageByLocale(
    gameKey: string,
    pageType: string,
    locale: "en" | "fr" | "es",
  ): Promise<GamePage | null> {
    try {
      // Obtenir l'instance Firebase Admin
      const db = await getAdminDb();

      console.log(
        `Récupération de la page ${pageType} pour le jeu ${gameKey} en ${locale}`,
      );

      // 1. Récupérer le jeu par sa clé
      const gamesSnapshot = await db
        .collection("games")
        .where("key", "==", gameKey)
        .limit(1)
        .get();

      if (gamesSnapshot.empty) {
        console.error(`Jeu avec la clé '${gameKey}' non trouvé`);
        return null;
      }

      const gameDoc = gamesSnapshot.docs[0];
      const gameId = gameDoc.id;

      // 2. Récupérer le type de page par sa clé
      const pageTypesSnapshot = await db
        .collection("pageTypes")
        .where("key", "==", pageType)
        .limit(1)
        .get();

      if (pageTypesSnapshot.empty) {
        console.error(`Type de page avec la clé '${pageType}' non trouvé`);
        return null;
      }

      const pageTypeDoc = pageTypesSnapshot.docs[0];
      const pageTypeId = pageTypeDoc.id;

      // 3. Récupérer la page
      const pageRef = db
        .collection("games")
        .doc(gameId)
        .collection("pages")
        .doc(pageTypeId);

      const pageDoc = await pageRef.get();

      if (!pageDoc.exists) {
        console.error(
          `Page non trouvée pour le jeu '${gameKey}' et le type '${pageType}'`,
        );
        return null;
      }

      // 4. Extraire les données brutes
      const rawData = pageDoc.data();
      if (!rawData) {
        console.error(
          `Document trouvé mais sans données pour ${gameKey}/${pageType}`,
        );
        return null;
      }

      // 5. Formater les données (sans inclure l'id qui sera ajouté séparément)
      const pageData = formatFirestoreData<Omit<GamePage, "id">>(rawData);

      // 6. Vérifier si la page est publiée
      if (!pageData.isPublished) {
        console.error(
          `Page pour '${gameKey}/${pageType}' existe mais n'est pas publiée`,
        );
        return null;
      }

      // 7. Vérifier si le contenu existe pour la locale demandée
      if (!pageData.content || !pageData.content[locale]) {
        console.warn(
          `Le contenu pour la locale ${locale} n'existe pas dans la page ${pageType} du jeu ${gameKey}`,
        );
        // On continue quand même - la page pourrait utiliser un contenu de secours
      }

      // 8. Retourner l'objet correctement formé
      return {
        id: pageDoc.id, // ID provenant du document Firestore
        gameId,
        pageTypeId,
        content: pageData.content || {},
        meta: pageData.meta || {},
        isPublished: pageData.isPublished,
        createdAt: pageData.createdAt || new Date(),
        updatedAt: pageData.updatedAt || new Date(),
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la page ${pageType} du jeu ${gameKey} en ${locale}:`,
        error,
      );
      return null;
    }
  }
}

const gameService = new GameService();
export default gameService;
