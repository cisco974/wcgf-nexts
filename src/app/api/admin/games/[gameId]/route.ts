// app/api/admin/games/[gameId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  formatFirestoreData,
  getAdminDb,
  serverTimestamp,
} from "@lib/firebase-config";
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
type gameParam = Promise<{ gameId: string }>;

/**
 * GET /api/admin/games/[gameId]
 * Récupère un jeu par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: gameParam },
) {
  try {
    const { gameId } = await params;

    // Récupérer le document du jeu
    const gameDoc = await adminDb.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }
    const gameDocFormated = formatFirestoreData<Record<string, unknown>>(
      gameDoc.data(),
    );
    // Formater et retourner les données
    const game = {
      id: gameDoc.id,
      ...gameDocFormated,
    };

    return NextResponse.json(game);
  } catch (error) {
    console.error("Erreur lors de la récupération du jeu:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/games/[gameId]
 * Met à jour un jeu existant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: gameParam },
) {
  try {
    const { gameId } = await params;
    const data = await request.json();

    // Vérifier si le jeu existe
    const gameDoc = await adminDb.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    const currentData = gameDoc.data();

    // Si la clé est modifiée, vérifier qu'elle n'existe pas déjà
    if (data.key && data.key !== currentData?.key) {
      const existingSnapshot = await adminDb
        .collection("games")
        .where("key", "==", data.key)
        .limit(1)
        .get();

      if (!existingSnapshot.empty && existingSnapshot.docs[0].id !== gameId) {
        return NextResponse.json(
          { error: "Un jeu avec cette clé existe déjà" },
          { status: 409 },
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData = {
      title: data.title || currentData?.title,
      key: data.key || currentData?.key,
      subtitle:
        data.subtitle !== undefined ? data.subtitle : currentData?.subtitle,
      updatedAt: serverTimestamp(),
    };

    // Mettre à jour le document
    await adminDb.collection("games").doc(gameId).update(updateData);

    // Récupérer le document mis à jour
    const updatedDoc = await adminDb.collection("games").doc(gameId).get();

    const updatedDocFormated =
      formatFirestoreData<Record<string, unknown>>(updatedDoc);
    const updatedGame = {
      id: updatedDoc.id,
      ...updatedDocFormated,
    };

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du jeu:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/games/[gameId]
 * Supprime un jeu
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: gameParam },
) {
  try {
    const { gameId } = await params;

    // Vérifier si le jeu existe
    const gameDoc = await adminDb.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Supprimer d'abord toutes les pages associées au jeu
    const pagesSnapshot = await adminDb
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .get();

    // Utiliser une transaction pour supprimer toutes les pages et le jeu
    await adminDb.runTransaction(async (transaction) => {
      // Supprimer toutes les pages
      pagesSnapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      // Supprimer le jeu
      transaction.delete(adminDb.collection("games").doc(gameId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du jeu:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
