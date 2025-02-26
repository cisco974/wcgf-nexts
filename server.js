const { execSync } = require("child_process");

try {
  console.log("🔄 Activation de l’environnement et démarrage de Next.js...");

  // Active l'environnement Node.js et démarre l'application
  execSync(
    `source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate && cd /home/cayi7350/test.wcgf.com && npm run start`,
    { stdio: "inherit", shell: true },
  );

  console.log("🚀 Next.js est lancé avec succès !");
} catch (error) {
  console.error("❌ Erreur lors du démarrage de Next.js :", error);
}

// Indique à Phusion Passenger que le script est prêt
module.exports = {};
