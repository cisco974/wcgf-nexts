const { spawn } = require("child_process");

// Vérifie si Phusion Passenger est disponible
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

// Définition des chemins
const envPath = "/home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate";
const appPath = "/home/cayi7350/test.wcgf.com";

// Commande complète pour activer l'environnement et exécuter Next.js
const command = `source ${envPath} && cd ${appPath} && npm run start`;

// Exécute la commande dans un shell
const nextProcess = spawn(command, {
  cwd: appPath,
  stdio: "inherit",
  shell: true, // Obligatoire pour exécuter plusieurs commandes enchaînées
});

// Gestion des erreurs
nextProcess.on("error", (err) => {
  console.error("Erreur lors du démarrage de Next.js :", err);
});

// Gestion de l'arrêt du processus
nextProcess.on("exit", (code) => {
  console.log(`Next.js s'est arrêté avec le code ${code}`);
});

// Indique à Passenger que le script est prêt
module.exports = nextProcess;
