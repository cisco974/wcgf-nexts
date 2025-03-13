import admin from "firebase-admin";
import fs from "fs";

// Type pour faciliter l'utilisation ailleurs
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreData = Record<string, unknown>;

// Initialisation unique de Firebase Admin
let _db: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  try {
    // Récupérer le chemin depuis la variable d'environnement
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
      console.error(
        `Le fichier de configuration Firebase n'existe pas à l'emplacement: ${serviceAccountPath}`,
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
    _db = admin.firestore();
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
  }
}

// Utiliser une assertion de non-nullité pour db
// Si Firebase n'est pas initialisé, cela lancera une erreur au démarrage de l'application
export const db = _db!;
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// Fonction utilitaire pour formater les données Firestore (conversion des timestamps, etc.)
export function formatFirestoreData<T>(data: unknown): T {
  if (data === null || data === undefined) {
    return {} as T; // Retourner un objet vide plutôt que null/undefined
  }

  // Si c'est un tableau, formater chaque élément
  if (Array.isArray(data)) {
    return data.map((item) =>
      formatFirestoreData<unknown>(item),
    ) as unknown as T;
  }

  // Si c'est un objet
  if (typeof data === "object") {
    // Si c'est un Timestamp Firestore, convertir en Date
    if (data instanceof admin.firestore.Timestamp) {
      return data.toDate() as unknown as T;
    }

    // Traiter les objets normaux récursivement
    const result: Record<string, unknown> = {};
    for (const key in data as Record<string, unknown>) {
      result[key] = formatFirestoreData((data as Record<string, unknown>)[key]);
    }
    return result as unknown as T;
  }

  // Si c'est une valeur primitive, la retourner telle quelle
  return data as T;
}
