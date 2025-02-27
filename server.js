const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Créer un fichier de log
const logFile = path.join(__dirname, "server.log");

// Fonction pour écrire dans le fichier de log
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(logFile, logMessage);
  console.log(message); // Affiche également dans la console
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

  // Exécuter la commande avec redirection des flux stdout et stderr
  const childProcess = exec("npm run start", { shell: true });

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
    if (code === 0) {
      logToFile(`Le processus s'est terminé avec succès (code: ${code})`);
    } else {
      logToFile(`Le processus s'est terminé avec une erreur (code: ${code})`);
    }
  });

  // Capture des erreurs du processus enfant
  childProcess.on("error", (error) => {
    logToFile(`ERREUR DE PROCESSUS: ${error.message}`);
  });
} catch (error) {
  logToFile(`ERREUR AU DÉMARRAGE: ${error.message}`);
  logToFile(`Stack trace: ${error.stack}`);
}
