const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Définir le chemin absolu du fichier de log
const logFile = path.join(__dirname, "server_debug.log");

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
  const outStream = fs.createWriteStream(path.join(__dirname, "stdout.log"), {
    flags: "a",
  });
  const errStream = fs.createWriteStream(path.join(__dirname, "stderr.log"), {
    flags: "a",
  });

  // Exécuter la commande avec redirection des flux stdout et stderr
  const childProcess = exec("npm run start", {
    shell: true,
    // Permet de détacher le processus enfant
    detached: false,
  });

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
