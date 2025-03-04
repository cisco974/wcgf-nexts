#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Redémarrage de l'application Next.js avec PM2..." | tee -a "$LOG_FILE"

# Vérifier si l'application est en cours d'exécution sous PM2
if pm2 list | grep -q "test-wcgf"; then
    # Redémarrer l'application avec PM2
    npx pm2 restart test-wcgf

    echo "[$(date)] L'application a été redémarrée avec succès." | tee -a "$LOG_FILE"
else
    # L'application n'est pas en cours d'exécution, la démarrer
    /home/cayi7350/test.wcgf.com/start.sh
fi