// app/api/admin/page-types/route.ts
import { NextResponse } from "next/server";
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
/**
 * GET /api/admin/page-types
 * Récupère tous les types de pages
 */
export async function GET() {
  try {
    // Récupérer tous les types de pages, triés par nom
    const snapshot = await adminDb
      .collection("pageTypes")
      .orderBy("name", "asc")
      .get();

    // Convertir les données Firestore en JSON
    const pageTypes = snapshot.docs.map((doc) => {
      const formattedData = formatFirestoreData<Record<string, unknown>>(
        doc.data(),
      );
      return {
        id: doc.id,
        ...formattedData,
      };
    });

    return NextResponse.json(pageTypes);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de pages:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/page-types
 * Crée un nouveau type de page
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.key || !data.name) {
      return NextResponse.json(
        { error: "Les champs 'key' et 'name' sont obligatoires" },
        { status: 400 },
      );
    }

    // Vérifier si un type de page avec cette clé existe déjà
    const existingSnapshot = await adminDb
      .collection("pageTypes")
      .where("key", "==", data.key)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: "Un type de page avec cette clé existe déjà" },
        { status: 409 },
      );
    }

    // Préparer les données avec timestamps
    const pageTypeData = {
      key: data.key,
      name: data.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Ajouter le document à Firestore
    const docRef = await adminDb.collection("pageTypes").add(pageTypeData);

    // Récupérer le document créé
    const pageTypeDoc = await docRef.get();
    const formattedPageType = formatFirestoreData<Record<string, unknown>>(
      pageTypeDoc.data(),
    );
    const pageType = {
      id: pageTypeDoc.id,
      ...formattedPageType,
    };

    return NextResponse.json(pageType, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du type de page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
