import { series } from "async";
import { exec } from "child_process";

// Définition des commandes
const commands = [
  "source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate",
  "cd /home/cayi7350/test.wcgf.com",
  "npm run start",
];

console.log("🔄 Démarrage de l’application Next.js avec async.series...");

series(
  commands.map((cmd) => (cb) => {
    console.log(`🛠️ Exécution de : ${cmd}`);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Erreur lors de l’exécution : ${cmd}`, err);
        return cb(err);
      }
      console.log(`✅ Commande réussie : ${cmd}\n${stdout}`);
      return cb();
    });
  }),
  (err) => {
    if (err) {
      console.error("🚨 Une erreur est survenue dans la séquence :", err);
    } else {
      console.log("🚀 Next.js est lancé avec succès !");
    }
  },
);

// Indique à Phusion Passenger que le script est prêt
export default {};
