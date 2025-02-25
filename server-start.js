// start-server.js
import { execSync } from "child_process";

try {
  console.log("Démarrage du serveur Next.js...");
  execSync("npm run start", { stdio: "inherit" });
} catch (error) {
  console.error("Erreur lors du démarrage du serveur:", error);
  process.exit(1);
}
