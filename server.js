// server.js - Script simplifié pour exécuter npm run start sur Linux avec Phusion Passenger
const { spawn } = require("child_process");

console.log("Démarrage de l'application Next.js via npm run start...");

// Définir les options pour le processus enfant
const options = {
  cwd: __dirname, // Répertoire courant
  stdio: "inherit", // Rediriger stdin/stdout/stderr vers le processus parent
};

// Démarrer le processus npm directement (environnement Linux)
const npmProcess = spawn("npm", ["run", "start"], options);

// Gestion des événements du processus
npmProcess.on("error", (err) => {
  console.error("Erreur lors du démarrage de npm run start:", err);
  process.exit(1);
});

npmProcess.on("close", (code) => {
  console.log(`Le processus npm s'est terminé avec le code: ${code}`);
  process.exit(code);
});

// Capturer les signaux pour une fermeture propre
process.on("SIGTERM", () => {
  console.log("Arrêt du processus npm...");
  npmProcess.kill("SIGTERM");
});

// Indiquer que le script est prêt
console.log("Script server.js exécuté avec succès");
