#!/bin/bash
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate
cd /home/cayi7350/test.wcgf.com || exit 1
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Démarrage de l'application test-wcgf avec PM2..." | tee -a "$LOG_FILE"

cd /home/cayi7350/test.wcgf.com || exit 1

# Vérifier si l'application est déjà en cours d'exécution sous PM2
if npx pm2 list | grep -q "test-wcgf"; then
    if npx pm2 list | grep "test-wcgf" | grep -q "stopped"; then
            echo "[$(date)] L'application est en arrêt. Redémarrage..." | tee -a "$LOG_FILE"
            npx pm2 restart test-wcgf
            exit 0
        else
            echo "[$(date)] L'application est déjà en cours d'exécution sous PM2." | tee -a "$LOG_FILE"
            exit 0
        fi
fi

# Activer l'environnement Node.js
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate

# Démarrer l'application avec PM2
npx pm2 start npm --name "test-wcgf" --watch --interpreter bash -- run start

# Sauvegarder la configuration PM2
npx  pm2 save --force



echo "[$(date)] L'application Next.js a été démarrée avec PM2." | tee -a "$LOG_FILE"