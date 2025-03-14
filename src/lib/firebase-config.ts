// lib/firebase-admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore, Timestamp } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import admin from "firebase-admin";

// Vérifier que le code n'est pas exécuté côté client
const isClient = typeof window !== "undefined";

// Variable pour stocker l'instance Firestore
let adminDb: Firestore | null = null;

// Fonction pour récupérer le secret et l'afficher
async function getAndLogSecret() {
  try {
    console.log("Tentative de récupération du secret...");
    const client = new SecretManagerServiceClient();
    console.log("Client Secret Manager créé avec succès");

    const [version] = await client.accessSecretVersion({
      name: "projects/1081763355576/secrets/GOOGLE_APPLICATION_CREDENTIALS/versions/latest",
    });
    console.log("Version du secret récupérée avec succès");

    if (!version || !version.payload || !version.payload.data) {
      console.error("❌ Format de secret invalide ou données manquantes");
      return null;
    }

    const secretValue = Buffer.from(
      version.payload.data as Uint8Array,
    ).toString();

    console.log("Secret récupéré avec succès. Contenu du secret:");
    console.log(secretValue);

    try {
      // Essayer de parser le JSON pour voir s'il est valide
      const jsonSecret = JSON.parse(secretValue);
      console.log("Le secret est un JSON valide. Structure des clés:");
      console.log(Object.keys(jsonSecret));
      return jsonSecret;
    } catch (parseError) {
      console.error("❌ Le secret n'est pas un JSON valide:", parseError);
      console.log(
        "Premier caractères du secret:",
        secretValue.substring(0, 30) + "...",
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du secret:", error);
    return null;
  }
}

if (!isClient) {
  // Initialiser l'application Firebase Admin
  if (!getApps().length) {
    (async () => {
      try {
        console.log("Initialisation de Firebase Admin...");

        // Récupérer et afficher le secret
        const serviceAccount = await getAndLogSecret();

        if (!serviceAccount) {
          throw new Error("Impossible de récupérer le compte de service");
        }

        // Initialiser Firebase avec le compte de service
        const app = initializeApp({
          credential: cert(serviceAccount),
        });

        adminDb = getFirestore(app);
        console.log("✅ Firebase Admin initialisé avec succès!");
      } catch (error) {
        console.error(
          "❌ Erreur lors de l'initialisation de Firebase Admin:",
          error,
        );
      }
    })();
  } else {
    // S'il y a déjà une app, utiliser celle-ci
    adminDb = getFirestore();
    console.log("✅ Instance Firebase existante utilisée");
  }
}

/**
 * Obtient une instance Firestore initialisée
 * @returns Promise avec l'instance Firestore
 */
export const getAdminDb = async (): Promise<Firestore> => {
  if (adminDb) return adminDb;

  // Si adminDb n'est pas encore initialisé, attendre un peu
  return new Promise((resolve, reject) => {
    console.log("⏳ En attente de l'initialisation de Firebase Admin...");

    let attempts = 0;
    const maxAttempts = 10;

    const checkDb = () => {
      attempts++;
      if (adminDb) {
        console.log(
          `✅ Firebase Admin initialisé après ${attempts} tentatives`,
        );
        resolve(adminDb);
      } else if (attempts >= maxAttempts) {
        console.error(`❌ Échec après ${maxAttempts} tentatives`);
        reject(new Error("Timeout: Failed to initialize Firestore Admin"));
      } else {
        console.log(`⏳ Tentative ${attempts}/${maxAttempts}...`);
        setTimeout(checkDb, 1000); // Attendre 1 seconde entre les tentatives
      }
    };

    checkDb();
  });
};
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
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
    if (data instanceof Timestamp) {
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

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 Firestore admin module loaded");
}

// Exporter la référence à la base de données sous deux noms
export { adminDb };
