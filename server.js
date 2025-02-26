const npm = require("npm");

npm.load({}, function (err) {
  if (err) {
    console.error("❌ Erreur lors du chargement de npm :", err);
    return;
  }

  console.log("🔄 Démarrage de l’application avec npm run start...");

  npm.commands.run(["start"], function (err, data) {
    if (err) {
      console.error("❌ Erreur lors de l’exécution de npm run start :", err);
    } else {
      console.log("🚀 Next.js est lancé avec succès !");
    }
  });
});

// Indique à Phusion Passenger que le script est prêt
module.exports = {};
