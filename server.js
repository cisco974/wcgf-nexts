// Charge le module de Passenger si disponible
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

// Charge le module child_process pour exécuter npm run start
const { spawn } = require("child_process");

// Exécute la commande "npm run start"
const nextProcess = spawn("npm", ["run", "start"], {
  cwd: __dirname, // Répertoire de ton application
  stdio: "inherit", // Hérite de la sortie standard (affiche les logs)
  shell: true, // Utilisation d'un shell pour exécuter la commande
});

// Gestion des erreurs
nextProcess.on("error", (err) => {
  console.error("Erreur lors du démarrage de Next.js :", err);
});

// Gestion de l'arrêt du processus
nextProcess.on("exit", (code) => {
  console.log(`Next.js s'est arrêté avec le code ${code}`);
});

// Indique à Passenger que ce script est prêt
module.exports = nextProcess;
