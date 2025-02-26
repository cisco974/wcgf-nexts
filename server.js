const pm2 = require("pm2");

pm2.connect((err) => {
  if (err) {
    console.error("❌ Impossible de se connecter à PM2:", err);
    process.exit(1);
  }

  pm2.start(
    {
      script: "npm",
      args: ["run", "start"],
      name: "nextjs-app",
      autorestart: false,
    },
    (err, apps) => {
      pm2.disconnect();
      if (err) {
        console.error("❌ Erreur lors du démarrage avec PM2:", err);
        process.exit(1);
      }
      console.log("🚀 Next.js lancé avec PM2 !");
    },
  );
});

// Indique à Phusion Passenger que le script est prêt
module.exports = {};
