const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "nextjs.log");

// 📝 Écrire un message d'en-tête dans les logs avant le lancement
fs.writeFileSync(
  logFilePath,
  `🚀 [$(new Date().toISOString())] Démarrage de Next.js...\n`,
  { flag: "w" },
);

console.log(`🚀 Lancement de Next.js... Logs ici : ${logFilePath}`);

const process = exec("npm run start", { cwd: __dirname });

// Rediriger stdout et stderr vers le fichier de log
process.stdout.pipe(fs.createWriteStream(logFilePath, { flags: "a" }));
process.stderr.pipe(fs.createWriteStream(logFilePath, { flags: "a" }));

// Afficher aussi les logs dans le terminal
process.stdout.pipe(process.stdout);
process.stderr.pipe(process.stderr);

// Gérer la fermeture du processus
process.on("close", (code) => {
  const exitMessage = `❌ [$(new Date().toISOString())] Le processus npm run start s'est terminé avec le code ${code}\n`;
  fs.appendFileSync(logFilePath, exitMessage);
  console.log(exitMessage);
});
