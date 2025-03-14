// firebaseConfig.js
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";

// Singleton pattern pour garantir une seule instance de Firebase
export function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Différentes méthodes d'initialisation selon l'environnement
    if (process.env.NODE_ENV === "production") {
      // En production (Cloud Run), l'authentification se fait via le compte de service par défaut
      initializeApp({
        // Vous n'avez pas besoin de spécifier les credentials en production
        // si vous avez correctement configuré les autorisations du service Cloud Run
      });
    } else {
      // En développement local, utilisez un fichier de clés de service
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!credentialsPath) {
        throw new Error(
          "La variable d'environnement GOOGLE_APPLICATION_CREDENTIALS n'est pas définie",
        );
      }

      // Option 1: Lecture synchrone du fichier JSON
      const serviceAccountJson = JSON.parse(
        fs.readFileSync(credentialsPath, "utf8"),
      );

      // Option 2: Si vous préférez vraiment utiliser un import dynamique
      // const serviceAccountModule = await import(/* @vite-ignore */ credentialsPath);
      // const serviceAccountJson = serviceAccountModule.default || serviceAccountModule;

      initializeApp({
        credential: cert(serviceAccountJson),
      });
    }
  }

  return getFirestore();
}

// Fonction utilitaire avec gestion de la tentative de reconnexion
export async function getFirestoreWithRetry(maxRetries = 3, delay = 1000) {
  let attempts = 0;
  let db = null;

  while (attempts < maxRetries && !db) {
    try {
      db = getFirebaseAdmin();
      // Tester la connexion avec une simple requête
      await db.collection("test").limit(1).get();
      console.log("Firestore connecté avec succès");
    } catch (error) {
      attempts++;
      console.error(
        `Tentative ${attempts}/${maxRetries} de connexion à Firestore échouée:`,
        error,
      );

      if (attempts >= maxRetries) {
        throw new Error(
          `Impossible de se connecter à Firestore après ${maxRetries} tentatives.`,
        );
      }

      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return db;
}
