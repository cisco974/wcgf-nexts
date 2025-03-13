// app/api/admin/page-types/[key]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  db,
  formatFirestoreData,
  serverTimestamp,
} from "@root/lib/firebase-config";

type keyParams = Promise<{
  key: string;
}>;
/**
 * GET /api/admin/page-types/[key]
 * Récupère un type de page par sa clé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: keyParams },
) {
  try {
    const { key } = await params;

    // Récupérer le type de page par sa clé
    const snapshot = await db
      .collection("pageTypes")
      .where("key", "==", key)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = snapshot.docs[0];
    const formattedPageType = formatFirestoreData<Record<string, unknown>>(
      pageTypeDoc.data(),
    );

    const pageType = {
      id: pageTypeDoc.id,
      ...formattedPageType,
    };
    return NextResponse.json(pageType);
  } catch (error) {
    console.error("Erreur lors de la récupération du type de page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/page-types/[key]
 * Met à jour un type de page existant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: keyParams },
) {
  try {
    const { key } = await params;
    const data = await request.json();

    // Récupérer le type de page par sa clé
    const snapshot = await db
      .collection("pageTypes")
      .where("key", "==", key)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = snapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;
    const currentData = pageTypeDoc.data();

    // Si la clé est modifiée, vérifier qu'elle n'existe pas déjà
    if (data.key && data.key !== key) {
      const existingSnapshot = await db
        .collection("pageTypes")
        .where("key", "==", data.key)
        .limit(1)
        .get();

      if (
        !existingSnapshot.empty &&
        existingSnapshot.docs[0].id !== pageTypeId
      ) {
        return NextResponse.json(
          { error: "Un type de page avec cette clé existe déjà" },
          { status: 409 },
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData = {
      key: data.key || currentData.key,
      name: data.name || currentData.name,
      updatedAt: serverTimestamp(),
    };

    // Mettre à jour le document
    await db.collection("pageTypes").doc(pageTypeId).update(updateData);

    // Récupérer le document mis à jour
    const updatedDoc = await db.collection("pageTypes").doc(pageTypeId).get();
    const formattedDoc = formatFirestoreData<Record<string, unknown>>(
      updatedDoc.data(),
    );

    const updatedPageType = {
      id: updatedDoc.id,
      ...formattedDoc,
    };

    return NextResponse.json(updatedPageType);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/page-types/[key]
 * Supprime un type de page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: keyParams },
) {
  try {
    const { key } = await params;

    // Récupérer le type de page par sa clé
    const snapshot = await db
      .collection("pageTypes")
      .where("key", "==", key)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Type de page non trouvé" },
        { status: 404 },
      );
    }

    const pageTypeDoc = snapshot.docs[0];
    const pageTypeId = pageTypeDoc.id;

    // Vérifier si ce type de page est utilisé par des pages de jeux
    // Note: cette vérification est complexe et coûteuse avec Firestore
    // Une alternative serait d'utiliser des compteurs ou une collection spéciale

    // Supprimer le type de page
    await db.collection("pageTypes").doc(pageTypeId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du type de page:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 },
    );
  }
}
