#!/bin/bash
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate
cd /home/cayi7350/test.wcgf.com || exit 1
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Démarrage de l'application Next Js : test-wcgf avec PM2..." | tee -a "$LOG_FILE"

cd /home/cayi7350/test.wcgf.com || exit 1

# Vérifier si l'application est déjà en cours d'exécution sous PM2
if npx pm2 list | grep -q "test-wcgf"; then
    echo "[$(date)] L'application est déjà en cours d'exécution sous PM2." | tee -a "$LOG_FILE"
    npx pm2 stop test-wcgf
    npx pm2 delete test-wcgf
fi

# Activer l'environnement Node.js
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate

# Démarrer l'application avec PM2
nohup npx pm2 start npm --name "test-wcgf" --watch --interpreter bash -- run start >> "$LOG_FILE" 2>&1 &


# Sauvegarder la configuration PM2
npx  pm2 save --force



echo "[$(date)] L'application Next Js : test-wcgf  a été démarrée avec PM2." | tee -a "$LOG_FILE"