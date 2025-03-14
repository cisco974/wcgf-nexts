// app/api/v1/games/[gameKey]/pages/[pageType]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { formatFirestoreData, getAdminDb } from "@lib/firebase-config";
import { GamePage } from "@models/fireStoreModels";
import { Firestore } from "firebase-admin/firestore";
// Promesse d'initialisation de adminDb
const adminDbPromise = getAdminDb();

// Définir une variable pour le handler avec un type adapté
let adminDb: Firestore;

// Auto-invoking async function pour initialiser adminDb
(async () => {
  try {
    adminDb = await adminDbPromise;
    console.log(
      "✅ Firebase Admin initialisé avec succès dans /api/admin/games",
    );
  } catch (error) {
    console.error("❌ Erreur d'initialisation de Firebase Admin:", error);
  }
})();
// Type pour les paramètres de route
type RouteParams = Promise<{
  gameKey: string;
  pageType: string;
}>;

/**
 * GET /api/v1/games/[gameKey]/pages/[pageType]
 * Route publique pour récupérer les données d'une page de jeu
 */
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { gameKey, pageType } = await params;

    // Extraire la langue depuis les paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") || "en";
    const fallbackLang = "en";

    // 1. Récupérer le jeu par sa clé
    const gamesSnapshot = await adminDb
      .collection("games")
      .where("key", "==", gameKey)
      .limit(1)
      .get();

    if (gamesSnapshot.empty) {
      console.error(`Jeu avec la clé '${gameKey}' non trouvé`);
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    const gameDoc = gamesSnapshot.docs[0];
    const gameId = gameDoc.id;

    // 2. Récupérer le type de page par sa clé
    const pageTypesSnapshot = await adminDb
      .collection("pageTypes")
      .where("key", "==", pageType)
      .limit(1)
      .get();

    if (pageTypesSnapshot.empty) {
      console.error(`Type de page avec la clé '${pageType}' non trouvé`);
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = pageTypesSnapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;

    // 3. Récupérer la page
    const pageDoc = await adminDb
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    if (!pageDoc.exists) {
      console.error(
        `Page non trouvée pour le jeu '${gameKey}' et le type '${pageType}'`,
      );
      return NextResponse.json({ error: "Page non trouvée" }, { status: 404 });
    }

    const rawPageData = pageDoc.data() || {};
    const pageData = formatFirestoreData<GamePage>(rawPageData);

    // 4. Vérifier si la page est publiée
    if (!pageData.isPublished) {
      console.error(
        `Page pour '${gameKey}/${pageType}' existe mais n'est pas publiée`,
      );
      return NextResponse.json({ error: "Page non publiée" }, { status: 404 });
    }

    // 5. Extraire le contenu et les métadonnées pour la langue spécifiée
    const content =
      pageData.content?.[lang as keyof typeof pageData.content] || {};
    const meta = pageData.meta?.[lang as keyof typeof pageData.meta] || {};

    // 6. Si le contenu n'existe pas pour cette langue, essayer avec la langue par défaut
    const finalContent =
      Object.keys(content).length === 0 && lang !== fallbackLang
        ? pageData.content?.[fallbackLang] || {}
        : content;

    const finalMeta =
      Object.keys(meta).length === 0 && lang !== fallbackLang
        ? pageData.meta?.[fallbackLang] || {}
        : meta;

    // 7. Formater les métadonnées correctement
    const formattedMeta = {
      title: finalMeta.title || "",
      description: finalMeta.description || "",
      keywords: finalMeta.keywords || "",
      og_title: finalMeta.og_title || finalMeta.title || "",
      og_description: finalMeta.og_description || finalMeta.description || "",
      og_image: finalMeta.og_image || "",
    };

    // 8. Retourner les données structurées
    return NextResponse.json({
      meta: formattedMeta,
      content: finalContent,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
