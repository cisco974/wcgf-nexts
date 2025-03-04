#!/bin/bash
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate
cd /home/cayi7350/test.wcgf.com || exit 1
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Démarrage de l'application Next.js avec PM2..." | tee -a "$LOG_FILE"

cd /home/cayi7350/test.wcgf.com || exit 1

# Vérifier si l'application est déjà en cours d'exécution sous PM2
if npx pm2 list | grep -q "test-wcgf"; then
    echo "[$(date)] L'application est déjà en cours d'exécution sous PM2." | tee -a "$LOG_FILE"
    exit 0
fi

# Activer l'environnement Node.js
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate

# Démarrer l'application avec PM2
npx pm2 start npm --name "nextjs" --watch -- start

# Sauvegarder la configuration PM2
npx pm2 save


echo "[$(date)] L'application Next.js a été démarrée avec PM2." | tee -a "$LOG_FILE"