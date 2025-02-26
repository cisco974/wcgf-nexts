const { spawn } = require("child_process");

// Démarrer Next.js via npm run start
const nextProcess = spawn("npm", ["run", "start"], {
  cwd: __dirname, // Répertoire de l'application
  stdio: "inherit", // Affiche les logs directement dans la console
  shell: true, // Utilise un shell pour exécuter la commande
});

// Gestion des erreurs
nextProcess.on("error", (err) => {
  console.error("Erreur lors du démarrage de l’application:", err);
});

// Gestion de l'arrêt du processus
nextProcess.on("exit", (code) => {
  console.log(`Next.js s'est arrêté avec le code ${code}`);
});

// Exporter un module vide pour Phusion Passenger
module.exports = {};
