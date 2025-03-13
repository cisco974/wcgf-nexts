// app/api/admin/games/route.ts
import { NextResponse } from "next/server";
import {
  db,
  formatFirestoreData,
  serverTimestamp,
} from "@root/lib/firebase-config";

/**
 * GET /api/admin/games
 * Récupère tous les jeux
 */
export async function GET() {
  try {
    // Récupérer tous les jeux, triés par titre
    const snapshot = await db.collection("games").orderBy("title", "asc").get();

    // Convertir les données Firestore en JSON
    const games = snapshot.docs.map((doc) => {
      const formattedData = formatFirestoreData<Record<string, unknown>>(
        doc.data(),
      );
      return {
        id: doc.id,
        ...formattedData,
      };
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/games
 * Crée un nouveau jeu
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.key || !data.title) {
      return NextResponse.json(
        { error: "Les champs 'key' et 'title' sont obligatoires" },
        { status: 400 },
      );
    }

    // Vérifier si un jeu avec cette clé existe déjà
    const existingSnapshot = await db
      .collection("games")
      .where("key", "==", data.key)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: "Un jeu avec cette clé existe déjà" },
        { status: 409 },
      );
    }

    // Préparer les données avec timestamps
    const gameData = {
      key: data.key,
      title: data.title,
      subtitle: data.subtitle || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Ajouter le document à Firestore
    const docRef = await db.collection("games").add(gameData);

    // Récupérer le document créé
    const gameDoc = await docRef.get();
    const formattedGameData = formatFirestoreData<Record<string, unknown>>(
      gameDoc.data(),
    );
    const game = {
      id: gameDoc.id,
      ...formattedGameData,
    };

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du jeu:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
