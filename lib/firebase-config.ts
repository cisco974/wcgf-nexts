// lib/firebase-config.ts
import admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Type pour faciliter l'utilisation ailleurs
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;

// Définir un proxy qui sera rempli après initialisation asynchrone
const dbProxy = new Proxy({} as admin.firestore.Firestore, {
  get: function (target, prop) {
    // Si db n'est pas initialisé, lancer une erreur
    if (Object.keys(target).length === 0) {
      console.error(
        "⚠️ Tentative d'accès à Firebase avant initialisation complète",
      );
      throw new Error(
        "🔥 Firebase Firestore non disponible - Firebase n'est pas encore initialisé",
      );
    }
    return target[prop as keyof admin.firestore.Firestore];
  },
});

// Exportation pour compatibilité avec le code existant
export const db = dbProxy;
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// Fonction pour initialiser Firebase
async function initializeFirebase() {
  console.log("🔄 Début de l'initialisation Firebase...");

  try {
    // Si Firebase est déjà initialisé, ne rien faire
    if (admin.apps.length > 0) {
      console.log("⚠️ Firebase Admin était déjà initialisé");
      const firestoreDb = admin.firestore();

      // Copier toutes les propriétés de Firestore dans le proxy
      Object.setPrototypeOf(dbProxy, Object.getPrototypeOf(firestoreDb));
      Object.assign(dbProxy, firestoreDb);

      return;
    }

    console.log(
      "🔐 Récupération du secret Firebase depuis Google Secret Manager...",
    );
    const client = new SecretManagerServiceClient();

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
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n",
    );

    // Initialisation de Firebase Admin
    console.log("🚀 Initialisation de Firebase Admin...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialisé avec succès");
    const firestoreDb = admin.firestore();

    // Copier toutes les propriétés de Firestore dans le proxy
    Object.setPrototypeOf(dbProxy, Object.getPrototypeOf(firestoreDb));
    Object.assign(dbProxy, firestoreDb);

    console.log("🔥 Firestore initialisé et proxy configuré");
  } catch (error) {
    console.error(
      "❌ Erreur critique lors de l'initialisation de Firebase:",
      error,
    );

    // Essayer une dernière solution de secours avec l'ADC
    try {
      console.log(
        "🔄 Tentative de secours avec ADC (Application Default Credentials)",
      );
      admin.initializeApp();

      const firestoreDb = admin.firestore();

      // Copier toutes les propriétés de Firestore dans le proxy
      Object.setPrototypeOf(dbProxy, Object.getPrototypeOf(firestoreDb));
      Object.assign(dbProxy, firestoreDb);

      console.log(
        "✅ Firebase initialisé avec les identifiants par défaut de l'application",
      );
    } catch (fallbackError) {
      console.error(
        "❌ Échec total de l'initialisation Firebase:",
        fallbackError,
      );
      throw new Error("🔥 Firebase Firestore non disponible");
    }
  }
}

// Fonction utilitaire pour formater les données Firestore
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

// Initialiser Firebase immédiatement (mais de manière asynchrone)
// Seulement côté serveur
if (typeof window === "undefined") {
  console.log(
    "📋 Exécution côté serveur détectée, initialisation de Firebase...",
  );
  initializeFirebase().catch((error) => {
    console.error(
      "🔥 Erreur lors de l'initialisation automatique de Firebase:",
      error,
    );
  });
} else {
  console.log(
    "🌐 Exécution côté client détectée, Firebase n'est pas initialisé",
  );
}
