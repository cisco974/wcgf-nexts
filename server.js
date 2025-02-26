const { exec } = require("child_process");

// Exécute directement `next start`
console.log("🔄 Démarrage de Next.js...");

exec("node_modules/.bin/next start", { shell: true }, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Erreur lors du démarrage :", err);
    return;
  }
  console.log(`✅ Next.js démarré avec succès !\n${stdout}`);
  if (stderr) console.error(`⚠️ Stderr :\n${stderr}`);
});

// Indique à Phusion Passenger que le script est prêt
module.exports = {};
