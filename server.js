const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Définir le chemin absolu du fichier de log
const logFile = "/home/cayi7350/test.wcgf.com/nextjs.log";

// Fonction pour écrire dans le fichier de log
function logToFile(message) {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    // Utiliser writeFileSync avec flag 'a' pour append
    fs.writeFileSync(logFile, logMessage, { flag: "a" });
    console.log(message);
  } catch (err) {
    console.error(`Erreur de journalisation: ${err.message}`);
  }
}

// Écrire un message initial pour vérifier que l'écriture fonctionne
try {
  fs.writeFileSync(
    logFile,
    `=== DÉMARRAGE DU SERVEUR NEXT.JS: ${new Date().toISOString()} ===\n`,
  );
  console.log(`Log créé à ${logFile}`);
} catch (error) {
  console.error(`ERREUR D'ÉCRITURE DU FICHIER LOG: ${error.message}`);
}

// Enregistrer les informations sur l'environnement
logToFile(
  "=============== DÉMARRAGE NOUVELLE INSTANCE NEXT.JS ===============",
);
logToFile(`Node version: ${process.version}`);
logToFile(`Répertoire courant: ${__dirname}`);
logToFile(`Fichier en cours d'exécution: ${__filename}`);
logToFile(
  `Variables d'environnement: NODE_ENV=${process.env.NODE_ENV || "non défini"}`,
);

// Lister les fichiers du répertoire pour debug
try {
  const files = fs.readdirSync(__dirname);
  logToFile(`Fichiers dans le répertoire: ${files.join(", ")}`);
} catch (error) {
  logToFile(`Erreur de lecture du répertoire: ${error.message}`);
}

// Vérifier l'existence de package.json
try {
  const packageJson = require("./package.json");
  logToFile(
    `Version Next.js: ${packageJson.dependencies.next || "non trouvée"}`,
  );
  logToFile(
    `Scripts disponibles: ${Object.keys(packageJson.scripts).join(", ")}`,
  );
} catch (error) {
  logToFile(`Erreur de lecture de package.json: ${error.message}`);
}

// Capture des erreurs non gérées
process.on("uncaughtException", (error) => {
  logToFile(`ERREUR NON GÉRÉE: ${error.message}`);
  logToFile(`Stack trace: ${error.stack}`);
});

// Capture des promesses rejetées non gérées
process.on("unhandledRejection", (reason, promise) => {
  logToFile(`PROMESSE REJETÉE NON GÉRÉE: ${reason}`);
});

try {
  logToFile("Démarrage de l'application Next.js...");

  // Utiliser spawn au lieu de exec pour une meilleure gestion des flux
  const nextProcess = spawn("npm", ["run", "start"], {
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  logToFile(`Processus Next.js démarré avec PID: ${nextProcess.pid}`);

  // Capture de la sortie standard
  nextProcess.stdout.on("data", (data) => {
    const output = data.toString().trim();
    logToFile(`NEXT.JS STDOUT: ${output}`);
  });

  // Capture des erreurs
  nextProcess.stderr.on("data", (data) => {
    const error = data.toString().trim();
    logToFile(`NEXT.JS STDERR: ${error}`);
  });

  // Capture de la fin du processus
  nextProcess.on("close", (code) => {
    if (code === 0) {
      logToFile(`Next.js s'est terminé normalement avec code: ${code}`);
    } else {
      logToFile(`Next.js s'est terminé avec code d'erreur: ${code}`);
    }
  });

  // Capture des erreurs du processus
  nextProcess.on("error", (error) => {
    logToFile(`ERREUR DE PROCESSUS NEXT.JS: ${error.message}`);
  });
} catch (error) {
  logToFile(`ERREUR AU DÉMARRAGE DE NEXT.JS: ${error.message}`);
  logToFile(`Stack trace: ${error.stack}`);
}
