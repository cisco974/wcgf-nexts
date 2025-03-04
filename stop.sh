#!/bin/bash
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] 🔴 Arrêt de l'application test-wcgf..." | tee -a "$LOG_FILE"

# Vérifier si l'application est en cours d'exécution sous PM2
if npx pm2 list | grep -q "test-wcgf"; then
    # Arrêter l'application avec PM2
    npx pm2 stop test-wcgf
    npx pm2 delete test-wcgf

    echo "[$(date)] ✅ L'application a été arrêtée et supprimée de PM2." | tee -a "$LOG_FILE"
else
    echo "[$(date)] ⚠️ Aucun processus trouvé, l'application ne tourne pas." | tee -a "$LOG_FILE"
fi
