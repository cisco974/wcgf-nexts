#!/bin/bash
source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate
cd /home/cayi7350/test.wcgf.com || exit 1
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"
DEPLOY_LOCK="/home/cayi7350/test.wcgf.com/.deploying"

echo "[$(date)] 🔍 Vérification du serveur Next.js avec PM2..." >> "$LOG_FILE"

# Vérifier si un déploiement est en cours
if [ -f "$DEPLOY_LOCK" ]; then
  echo "[$(date)] 🚧 Déploiement en cours, vérification ignorée." >> "$LOG_FILE"
  exit 0
fi

# Vérifier si l'application tourne déjà sous PM2
if npx pm2 list | grep -q "test-wcgf"; then
  echo "[$(date)] ✅ Next.js tourne déjà sous PM2, aucune action nécessaire." >> "$LOG_FILE"
else
  echo "[$(date)] ❌ Next.js est arrêté. Redémarrage en cours..." >> "$LOG_FILE"
  /home/cayi7350/test.wcgf.com/start.sh
  echo "[$(date)] ✅ Next.js a été redémarré avec succès." >> "$LOG_FILE"
fi