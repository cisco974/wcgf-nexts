// scripts/migrate-to-firestore.js
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// Initialisation de Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccountPath =
      "../config/wcgf-project-453310-65cc5ebedd20.json";
    if (!serviceAccountPath) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS non défini");
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialisé");
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
    process.exit(1);
  }
}

// Référence Firestore
const db = admin.firestore();
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

/**
 * Charge un fichier JSON et retourne son contenu
 */
function loadJsonFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
}

/**
 * Importe les jeux depuis le fichier JSON
 */
async function importGames(filePath) {
  console.log("Importation des jeux...");
  const jsonData = loadJsonFile(filePath);
  if (!jsonData || !jsonData.games) {
    console.error("Données de jeux non valides");
    return new Map();
  }

  const games = jsonData.games;
  const idMap = new Map();

  for (const game of games) {
    // Préparer les données pour Firestore
    const gameData = {
      key: game.key,
      title: game.title,
      subtitle: game.subtitle || null,
      createdAt: new Date(game.created_at) || serverTimestamp(),
      updatedAt: new Date(game.updated_at) || serverTimestamp(),
    };

    // Utiliser la clé du jeu comme ID du document Firestore
    const gameId = game.key;
    const gameRef = db.collection("games").doc(gameId);

    try {
      await gameRef.set(gameData);
      console.log(`✅ Jeu importé: ${game.title} (${gameId})`);

      // Stocker la correspondance d'ID
      idMap.set(game.id.toString(), gameId);
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'importation du jeu ${game.title}:`,
        error,
      );
    }
  }

  return idMap;
}

/**
 * Importe les types de pages depuis le fichier JSON
 */
async function importPageTypes(filePath) {
  console.log("Importation des types de pages...");
  const jsonData = loadJsonFile(filePath);
  if (!jsonData || !jsonData.page_types) {
    console.error("Données de types de pages non valides");
    return new Map();
  }

  const pageTypes = jsonData.page_types;
  const idMap = new Map();

  for (const pageType of pageTypes) {
    // Préparer les données pour Firestore
    const pageTypeData = {
      key: pageType.key,
      name: pageType.name,
      createdAt: new Date(pageType.created_at) || serverTimestamp(),
      updatedAt: new Date(pageType.updated_at) || serverTimestamp(),
    };

    // Utiliser la clé du type de page comme ID du document Firestore
    const pageTypeId = pageType.key;
    const pageTypeRef = db.collection("pageTypes").doc(pageTypeId);

    try {
      await pageTypeRef.set(pageTypeData);
      console.log(`✅ Type de page importé: ${pageType.name} (${pageTypeId})`);

      // Stocker la correspondance d'ID
      idMap.set(pageType.id.toString(), pageTypeId);
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'importation du type de page ${pageType.name}:`,
        error,
      );
    }
  }

  return idMap;
}

/**
 * Importe les pages de jeux depuis le fichier JSON
 */
async function importGamePages(filePath, gameIdMap, pageTypeIdMap) {
  console.log("Importation des pages de jeux...");
  const jsonData = loadJsonFile(filePath);
  if (!jsonData || !jsonData.game_pages) {
    console.error("Données de pages de jeux non valides");
    return;
  }

  const gamePages = jsonData.game_pages;

  for (const gamePage of gamePages) {
    // Récupérer les correspondances d'IDs
    const oldGameId = gamePage.game_id.toString();
    const oldPageTypeId = gamePage.page_type_id.toString();

    const gameId = gameIdMap.get(oldGameId);
    const pageTypeId = pageTypeIdMap.get(oldPageTypeId);

    if (!gameId || !pageTypeId) {
      console.error(
        `❌ Références manquantes pour la page: game_id=${oldGameId}, page_type_id=${oldPageTypeId}`,
      );
      continue;
    }

    // Parser le contenu et les méta-données qui sont stockés sous forme de chaîne JSON
    let content;
    let meta;

    try {
      content =
        typeof gamePage.content === "object"
          ? gamePage.content
          : JSON.parse(gamePage.content);

      meta =
        typeof gamePage.meta === "object"
          ? gamePage.meta
          : JSON.parse(gamePage.meta);
    } catch (error) {
      console.error(
        `❌ Erreur lors du parsing JSON pour la page ${gameId}/${pageTypeId}:`,
        error,
      );
      continue;
    }

    // Préparer les données pour Firestore
    const gamePageData = {
      content,
      meta,
      isPublished:
        gamePage.is_published === true || gamePage.is_published === "true",
      createdAt: new Date(gamePage.created_at) || serverTimestamp(),
      updatedAt: new Date(gamePage.updated_at) || serverTimestamp(),
    };

    // Créer le document dans la sous-collection 'pages' du jeu
    const pageRef = db
      .collection("games")
      .doc(gameId)
      .collection("pages")
      .doc(pageTypeId);

    try {
      await pageRef.set(gamePageData);
      console.log(`✅ Page importée: ${gameId}/${pageTypeId}`);
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'importation de la page ${gameId}/${pageTypeId}:`,
        error,
      );
    }
  }
}

/**
 * Fonction principale d'importation
 */
async function migrateJsonToFirestore() {
  try {
    // Configurer les chemins des fichiers JSON
    const basePath = path.join(__dirname, "../data");
    const gamesFilePath = path.join(basePath, "games_202503121012.json");
    const pageTypesFilePath = path.join(
      basePath,
      "page_types_202503121012.json",
    );
    const gamePagesFilePath = path.join(
      basePath,
      "game_pages_202503121012.json",
    );

    // Vérifier l'existence des fichiers
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
      console.log(`✅ Répertoire de données créé: ${basePath}`);
    }

    // Vérifier chaque fichier
    const sourceFiles = [
      { name: "games_202503121012.json", path: gamesFilePath },
      { name: "page_types_202503121012.json", path: pageTypesFilePath },
      { name: "game_pages_202503121012.json", path: gamePagesFilePath },
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file.path)) {
        console.error(`❌ Fichier non trouvé: ${file.path}`);
        console.log(
          `Veuillez vous assurer que le fichier ${file.name} est disponible dans le répertoire ${basePath}`,
        );
        return;
      }
    }

    // Importer les données
    console.log("🚀 Démarrage de la migration vers Firestore...");

    // 1. Importer les jeux
    const gameIdMap = await importGames(gamesFilePath);
    console.log(`ℹ️ ${gameIdMap.size} jeux importés.`);

    // 2. Importer les types de pages
    const pageTypeIdMap = await importPageTypes(pageTypesFilePath);
    console.log(`ℹ️ ${pageTypeIdMap.size} types de pages importés.`);

    // 3. Importer les pages de jeux
    await importGamePages(gamePagesFilePath, gameIdMap, pageTypeIdMap);

    console.log("✅ Migration terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
  }
}

// Exécuter la migration
migrateJsonToFirestore();
