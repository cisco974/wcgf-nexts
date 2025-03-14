import admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Type pour faciliter l'utilisation ailleurs
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;

// Initialisation unique de Firebase Admin
let _db: admin.firestore.Firestore | null = null;
const client = new SecretManagerServiceClient();

// Configuration pour le retry
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // ms

// Initialisation immédiate pour la compatibilité avec le code existant
console.log("🔄 Début de l'initialisation Firebase...");

try {
  console.log(
    "🔐 Récupération du secret Firebase depuis Google Secret Manager...",
  );
  const [version] = await client.accessSecretVersion({
    name: "projects/1081763355576/secrets/GOOGLE_APPLICATION_CREDENTIALS/versions/latest",
  });

  const secretPayload = version.payload?.data?.toString();
  if (!secretPayload) {
    throw new Error(
      "❌ Impossible de récupérer le secret Firebase : Secret vide",
    );
  }

  console.log("📜 Secret brut récupéré avec succès");
  const serviceAccount = JSON.parse(secretPayload);

  if (
    !serviceAccount ||
    !serviceAccount.private_key ||
    !serviceAccount.client_email ||
    !serviceAccount.project_id
  ) {
    throw new Error(
      "❌ Clé Firebase invalide ou mal formée : une propriété est manquante",
    );
  }

  // Nettoyage de la clé privée
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  // Désactiver GOOGLE_APPLICATION_CREDENTIALS pour éviter l'erreur ENOENT
  process.env.GOOGLE_APPLICATION_CREDENTIALS = "";

  // Vérifier si Firebase est déjà initialisé
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
  console.log("🔥 Firestore initialisé");
} catch (error) {
  console.error(
    "❌ Erreur critique lors de l'initialisation de Firebase:",
    error,
  );
  _db = null; // Empêcher l'utilisation d'un Firestore non initialisé
}

// Vérifier que _db a bien été initialisé avant l'export
if (!_db) {
  console.error(
    "🔥 Firebase Firestore n'a pas été initialisé correctement. L'application ne pourra pas interagir avec Firestore.",
  );
  throw new Error("🔥 Firebase Firestore non disponible");
}

// Export direct de db pour compatibilité avec le code existant
export const db: admin.firestore.Firestore = _db;

/**
 * Mécanisme de retry pour les environnements serverless
 * À utiliser pour les nouvelles implémentations
 */
export async function getFirestoreWithRetry(): Promise<admin.firestore.Firestore> {
  if (!_db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      // Tester que la connexion fonctionne
      await _db.collection("_health").limit(1).get();
      return _db;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(
        `❌ Erreur de connexion Firestore tentative ${attempts}/${MAX_RETRIES}:`,
        error,
      );

      if (attempts >= MAX_RETRIES) {
        console.error(
          "🚨 Nombre maximum de tentatives atteint. Échec de la connexion.",
        );
        break;
      }

      // Attendre avant de réessayer
      console.log(`⏱️ Attente de ${RETRY_DELAY}ms avant nouvelle tentative...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  // Si nous arrivons ici, c'est que toutes les tentatives ont échoué
  throw new Error(
    `🔥 Impossible de se connecter à Firestore après ${MAX_RETRIES} tentatives: ${lastError?.message}`,
  );
}

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
