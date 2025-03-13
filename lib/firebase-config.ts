import admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Type pour faciliter l'utilisation ailleurs
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;

// Initialisation unique de Firebase Admin
let _db: admin.firestore.Firestore | null = null;
const client = new SecretManagerServiceClient();

async function initializeFirebase() {
  try {
    console.log(
      "🔐 Récupération du secret Firebase depuis Google Secret Manager...",
    );
    const [version] = await client.accessSecretVersion({
      name: "projects/1081763355576/secrets/GOOGLE_APPLICATION_CREDENTIALS/versions/latest",
    });

    const secretPayload = version.payload?.data?.toString();
    console.log("📜 Secret brut récupéré :", secretPayload);

    if (!secretPayload) {
      throw new Error("❌ Impossible de récupérer le secret Firebase");
    }

    const serviceAccount = JSON.parse(secretPayload);

    if (
      !serviceAccount ||
      !serviceAccount.private_key ||
      !serviceAccount.client_email
    ) {
      throw new Error(
        "❌ Clé Firebase invalide ou mal formée : une propriété est manquante",
      );
    }

    // Nettoyage de la clé privée pour éviter d’éventuels problèmes d'encodage
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\n/g,
      "\n",
    );

    // Initialiser Firebase si ce n'est pas déjà fait
    if (!admin.apps.length) {
      console.log("🚀 Initialisation de Firebase Admin...");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialisé avec succès");
    } else {
      console.log("⚠️ Firebase Admin était déjà initialisé");
    }
    _db = admin.firestore();
  } catch (error) {
    console.error("❌ Erreur d'initialisation Firebase:", error);
  }
}

// Exécuter l'initialisation et attendre qu'elle soit terminée
await initializeFirebase();

// Vérifier que _db a bien été initialisé avant l'export
if (!_db) {
  throw new Error(
    "🔥 Firebase Firestore n'a pas été initialisé correctement !",
  );
}

// Assurer que db a bien un type correct
export const db: admin.firestore.Firestore = _db;
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// Fonction utilitaire pour formater les données Firestore (conversion des timestamps, etc.)
export function formatFirestoreData<T>(data: unknown): T {
  if (data === null || data === undefined) {
    return {} as T; // Retourner un objet vide plutôt que null/undefined
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
