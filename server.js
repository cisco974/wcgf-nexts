const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Définir le chemin absolu du fichier de log
const logFile = "/home/cayi7350/test.wcgf.com/server_debug.log";

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
    `=== DÉMARRAGE DU SERVEUR: ${new Date().toISOString()} ===\n`,
  );
  console.log(`Log créé à ${logFile}`);
} catch (error) {
  console.error(`ERREUR D'ÉCRITURE DU FICHIER LOG: ${error.message}`);
}

// Enregistrer les informations sur l'environnement
logToFile("=============== DÉMARRAGE NOUVELLE INSTANCE ===============");
logToFile(`Node version: ${process.version}`);
logToFile(`Répertoire courant: ${__dirname}`);
logToFile(`Fichier en cours d'exécution: ${__filename}`);
logToFile(`Variables d'environnement: NODE_ENV=${process.env.NODE_ENV}`);

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
  logToFile("Démarrage de l'application...");

  // Création d'un fichier pour la sortie et l'erreur
  const outStream = fs.createWriteStream(
    "/home/cayi7350/test.wcgf.com/stdout.log",
    { flags: "a" },
  );
  const errStream = fs.createWriteStream(
    "/home/cayi7350/test.wcgf.com/stderr.log",
    { flags: "a" },
  );

  // Exécuter la commande avec redirection des flux stdout et stderr
  const childProcess = exec("npm run start", {
    shell: true,
    // Permet de détacher le processus enfant
    detached: false,
  });

  logToFile(`Processus enfant démarré avec PID: ${childProcess.pid}`);

  // Rediriger les flux vers les fichiers
  childProcess.stdout.pipe(outStream);
  childProcess.stderr.pipe(errStream);

  // Capture de la sortie standard
  childProcess.stdout.on("data", (data) => {
    logToFile(`STDOUT: ${data.trim()}`);
  });

  // Capture des erreurs
  childProcess.stderr.on("data", (data) => {
    logToFile(`STDERR: ${data.trim()}`);
  });

  // Capture de la fin du processus
  childProcess.on("close", (code) => {
    logToFile(`Le processus s'est terminé avec le code: ${code}`);
  });

  // Capture des erreurs du processus enfant
  childProcess.on("error", (error) => {
    logToFile(`ERREUR DE PROCESSUS: ${error.message}`);
  });

  logToFile("Processus enfant démarré");
} catch (error) {
  logToFile(`ERREUR AU DÉMARRAGE: ${error.message}`);
  logToFile(`Stack trace: ${error.stack}`);
}
