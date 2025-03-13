// lib/firebase-config.ts
import admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;

// Initialisation de Firebase - Ne s'exécute qu'une seule fois
let dbInstance: admin.firestore.Firestore | null = null;

export async function getDb(): Promise<admin.firestore.Firestore> {
  // Si l'instance existe déjà, la retourner
  if (dbInstance) {
    return dbInstance;
  }

  // Éviter les initialisations multiples (côté client)
  if (typeof window !== "undefined") {
    throw new Error("Firebase ne doit pas être initialisé côté client");
  }

  console.log("🔄 Initialisation de Firebase...");

  // Vérifier si Firebase est déjà initialisé
  if (getApps().length > 0) {
    console.log("⚠️ Firebase app déjà initialisé, récupération de Firestore");
    dbInstance = getFirestore();
    return dbInstance;
  }

  try {
    // Essai d'initialisation via variables d'environnement
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.log("🔑 Initialisation avec variables d'environnement");

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });

      dbInstance = getFirestore();
      console.log(
        "✅ Firebase initialisé avec succès via variables d'environnement",
      );
      return dbInstance;
    }

    // Sinon, essayer via Secret Manager
    console.log("🔐 Initialisation via Secret Manager");
    const client = new SecretManagerServiceClient();

    const [version] = await client.accessSecretVersion({
      name: "projects/1081763355576/secrets/GOOGLE_APPLICATION_CREDENTIALS/versions/latest",
    });

    const secretPayload = version.payload?.data?.toString();
    if (!secretPayload) {
      throw new Error("Secret Manager: payload vide");
    }

    const serviceAccount = JSON.parse(secretPayload);

    if (
      !serviceAccount.private_key ||
      !serviceAccount.client_email ||
      !serviceAccount.project_id
    ) {
      throw new Error("Format de clé de service invalide");
    }

    // Nettoyage de la clé privée
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n",
    );

    // Initialisation de l'app
    initializeApp({
      credential: cert(serviceAccount),
    });

    dbInstance = getFirestore();
    console.log("✅ Firebase initialisé avec succès via Secret Manager");
    return dbInstance;
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de Firebase:", error);

    // Dernier recours - identifiants implicites
    try {
      console.log("🔄 Tentative avec identifiants implicites (ADC)");
      initializeApp();
      dbInstance = getFirestore();
      console.log("✅ Firebase initialisé avec identifiants implicites");
      return dbInstance;
    } catch (fallbackError) {
      console.error(
        "❌ Échec total de l'initialisation Firebase:",
        fallbackError,
      );
      throw new Error("Firebase Firestore non disponible");
    }
  }
}

export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// Fonction utilitaire pour formater les données Firestore
export function formatFirestoreData<T>(data: unknown): T {
  if (data === null || data === undefined) {
    return {} as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      formatFirestoreData<unknown>(item),
    ) as unknown as T;
  }

  if (typeof data === "object") {
    if (data instanceof admin.firestore.Timestamp) {
      return data.toDate() as unknown as T;
    }

    const result: Record<string, unknown> = {};
    for (const key in data as Record<string, unknown>) {
      result[key] = formatFirestoreData((data as Record<string, unknown>)[key]);
    }
    return result as unknown as T;
  }

  return data as T;
}
