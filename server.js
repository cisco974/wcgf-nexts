const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Définition du fichier de log
const logFilePath = path.join(__dirname, "nextjs.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Lancer `npm run start`
const startProcess = spawn("npm", ["run", "start"], {
  cwd: __dirname, // Assurez-vous d'être dans le bon dossier
  shell: true,
  env: process.env,
});

// Rediriger la sortie standard et les erreurs vers le fichier de log
startProcess.stdout.pipe(logStream);
startProcess.stderr.pipe(logStream);

// Afficher également les logs dans la console
startProcess.stdout.pipe(process.stdout);
startProcess.stderr.pipe(process.stderr);

// Gérer la fermeture du processus
startProcess.on("close", (code) => {
  const exitMessage = `Le processus npm run start s'est terminé avec le code ${code}\n`;
  console.log(exitMessage);
  logStream.write(exitMessage);
  logStream.end();
});
