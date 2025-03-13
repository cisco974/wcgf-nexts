// app/api/firestore-test/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import fs from "fs";

// Initialiser Firebase Admin une seule fois
if (!admin.apps.length) {
  try {
    // Récupérer le chemin depuis la variable d'environnement
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log("Tentative de chargement du fichier:", serviceAccountPath);

    // Vérifier si le fichier existe
    if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
      console.error(
        "Le fichier service-account.json n'existe pas à l'emplacement:",
        serviceAccountPath,
      );
      throw new Error("Fichier de configuration Firebase non trouvé");
    }

    // Charger le fichier JSON
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );

    // Initialiser l'application Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialisé avec succès");
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
  }
}

// Route GET pour tester la connexion
export async function GET() {
  try {
    const db = admin.firestore();

    // Tester la connexion en récupérant les collections
    const collections = await db.listCollections();
    const collectionIds = collections.map((col) => col.id);

    // Répondre avec les résultats
    return NextResponse.json({
      success: true,
      message: "Connexion à Firestore réussie",
      collections: collectionIds,
    });
  } catch (error) {
    console.error("Erreur de connexion à Firestore:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur de connexion à Firestore",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Route POST pour ajouter une collection/document
export async function POST(request: Request) {
  try {
    const db = admin.firestore();

    // Récupérer et valider les données
    const body = await request.json();
    console.log("Requête reçue:", body);

    const { collectionName, documentData } = body;

    if (!collectionName || !documentData) {
      return NextResponse.json(
        {
          success: false,
          message: "Nom de collection et données du document requis",
        },
        { status: 400 },
      );
    }

    // Ajouter le document à la collection
    const docRef = await db.collection(collectionName).add({
      ...documentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const responseData = {
      success: true,
      message: `Document ajouté avec succès à la collection '${collectionName}'`,
      documentId: docRef.id,
    };

    console.log("Réponse envoyée:", responseData);
    console.log(`Document ajouté à ${collectionName} avec ID: ${docRef.id}`);

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'ajout du document",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
