// app/api/admin/games/[gameId]/pages/[pageType]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  db,
  formatFirestoreData,
  serverTimestamp,
} from "@root/lib/firebase-config";

// Type pour les paramètres de route
type RouteParams = Promise<{
  gameId: string;
  pageType: string;
}>;

/**
 * GET /api/admin/games/[gameId]/pages/[pageType]
 * Récupère une page de jeu spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { gameId, pageType } = await params;
    console.log(
      `Récupération de la page pour jeu=${gameId}, pageType=${pageType}`,
    );

    // Vérifier si le jeu existe
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists) {
      console.log(`Jeu '${gameId}' non trouvé`);
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Rechercher le type de page par sa clé
    const pageTypeSnapshot = await db
      .collection("pageTypes")
      .where("key", "==", pageType)
      .limit(1)
      .get();

    if (pageTypeSnapshot.empty) {
      console.log(`Type de page '${pageType}' non trouvé`);
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = pageTypeSnapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;
    console.log(`Type de page trouvé: ${pageTypeId}`);

    // Récupérer la page
    const pageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    if (!pageDoc.exists) {
      console.log(
        `Page non trouvée pour jeu=${gameId}, pageTypeId=${pageTypeId}`,
      );
      return NextResponse.json({ error: "Page non trouvée" }, { status: 404 });
    }

    // Récupérer et formater les données
    const rawPageData = pageDoc.data() || {};
    const rawPageTypeData = pageTypeDoc.data() || {};

    const formattedPageData =
      formatFirestoreData<Record<string, unknown>>(rawPageData);
    const formattedPageTypeData =
      formatFirestoreData<Record<string, unknown>>(rawPageTypeData);

    // Construire l'objet de réponse
    const page = {
      id: pageDoc.id,
      gameId,
      pageTypeId,
      content: formattedPageData.content || {},
      meta: formattedPageData.meta || {},
      isPublished: formattedPageData.isPublished || false,
      createdAt: formattedPageData.createdAt || new Date(),
      updatedAt: formattedPageData.updatedAt || new Date(),
      pageType: {
        id: pageTypeDoc.id,
        key: formattedPageTypeData.key || "",
        name: formattedPageTypeData.name || "",
        createdAt: formattedPageTypeData.createdAt || new Date(),
        updatedAt: formattedPageTypeData.updatedAt || new Date(),
      },
    };

    return NextResponse.json(page);
  } catch (error) {
    console.error("Erreur lors de la récupération de la page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/games/[gameId]/pages/[pageType]
 * Crée une nouvelle page de jeu
 */
export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { gameId, pageType } = await params;
    const data = await request.json();

    // Vérifier si le jeu existe
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Rechercher le type de page par sa clé
    const pageTypeSnapshot = await db
      .collection("pageTypes")
      .where("key", "==", pageType)
      .limit(1)
      .get();

    if (pageTypeSnapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = pageTypeSnapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;

    // Vérifier si la page existe déjà
    const pageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    if (pageDoc.exists) {
      return NextResponse.json(
        {
          error: "Cette page existe déjà. Utilisez PUT pour la mettre à jour.",
        },
        { status: 400 },
      );
    }

    // Préparer les données avec timestamps
    const pageData = {
      content: data.content || {},
      meta: data.meta || {},
      isPublished: data.isPublished || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Créer la page
    await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .set(pageData);

    // Récupérer la page créée
    const newPageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    // Récupérer et formater les données
    const rawNewPageData = newPageDoc.data() || {};
    const rawPageTypeData = pageTypeDoc.data() || {};

    const formattedNewPageData =
      formatFirestoreData<Record<string, unknown>>(rawNewPageData);
    const formattedPageTypeData =
      formatFirestoreData<Record<string, unknown>>(rawPageTypeData);

    // Construire l'objet de réponse
    const newPage = {
      id: newPageDoc.id,
      gameId,
      pageTypeId,
      content: formattedNewPageData.content || {},
      meta: formattedNewPageData.meta || {},
      isPublished: formattedNewPageData.isPublished || false,
      createdAt: formattedNewPageData.createdAt || new Date(),
      updatedAt: formattedNewPageData.updatedAt || new Date(),
      pageType: {
        id: pageTypeDoc.id,
        key: formattedPageTypeData.key || "",
        name: formattedPageTypeData.name || "",
        createdAt: formattedPageTypeData.createdAt || new Date(),
        updatedAt: formattedPageTypeData.updatedAt || new Date(),
      },
    };

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/games/[gameId]/pages/[pageType]
 * Met à jour une page de jeu existante
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { gameId, pageType } = await params;
    const data = await request.json();

    // Vérifier si le jeu existe
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Rechercher le type de page par sa clé
    const pageTypeSnapshot = await db
      .collection("pageTypes")
      .where("key", "==", pageType)
      .limit(1)
      .get();

    if (pageTypeSnapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = pageTypeSnapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;

    // Vérifier si la page existe
    const pageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    if (!pageDoc.exists) {
      return NextResponse.json(
        { error: "Page non trouvée. Utilisez POST pour la créer." },
        { status: 404 },
      );
    }

    const currentData = pageDoc.data() || {};

    // Préparer les données de mise à jour
    const updateData = {
      content:
        data.content !== undefined ? data.content : currentData.content || {},
      meta: data.meta !== undefined ? data.meta : currentData.meta || {},
      isPublished:
        data.isPublished !== undefined
          ? data.isPublished
          : currentData.isPublished || false,
      updatedAt: serverTimestamp(),
    };

    // Mettre à jour la page
    await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .update(updateData);

    // Récupérer la page mise à jour
    const updatedPageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    // Récupérer et formater les données
    const rawUpdatedPageData = updatedPageDoc.data() || {};
    const rawPageTypeData = pageTypeDoc.data() || {};

    const formattedUpdatedPageData =
      formatFirestoreData<Record<string, unknown>>(rawUpdatedPageData);
    const formattedPageTypeData =
      formatFirestoreData<Record<string, unknown>>(rawPageTypeData);

    // Construire l'objet de réponse
    const updatedPage = {
      id: updatedPageDoc.id,
      gameId,
      pageTypeId,
      content: formattedUpdatedPageData.content || {},
      meta: formattedUpdatedPageData.meta || {},
      isPublished: formattedUpdatedPageData.isPublished || false,
      createdAt: formattedUpdatedPageData.createdAt || new Date(),
      updatedAt: formattedUpdatedPageData.updatedAt || new Date(),
      pageType: {
        id: pageTypeDoc.id,
        key: formattedPageTypeData.key || "",
        name: formattedPageTypeData.name || "",
        createdAt: formattedPageTypeData.createdAt || new Date(),
        updatedAt: formattedPageTypeData.updatedAt || new Date(),
      },
    };

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/games/[gameId]/pages/[pageType]
 * Supprime une page de jeu
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { gameId, pageType } = await params;

    // Vérifier si le jeu existe
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Rechercher le type de page par sa clé
    const pageTypeSnapshot = await db
      .collection("pageTypes")
      .where("key", "==", pageType)
      .limit(1)
      .get();

    if (pageTypeSnapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = pageTypeSnapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;

    // Vérifier si la page existe
    const pageDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .get();

    if (!pageDoc.exists) {
      return NextResponse.json({ error: "Page non trouvée" }, { status: 404 });
    }

    // Supprimer la page
    await db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
