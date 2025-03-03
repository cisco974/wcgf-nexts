#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"
DEPLOY_LOCK="/home/cayi7350/test.wcgf.com/.deploying"

echo "[$(date)] 🔍 Vérification du serveur Next.js..." >> "$LOG_FILE"

# Vérifier si un déploiement est en cours
if [ -f "$DEPLOY_LOCK" ]; then
  echo "[$(date)] 🚧 Déploiement en cours, vérification ignorée." >> "$LOG_FILE"
  exit 0
fi

# Vérifier si Next.js tourne déjà
EXISTING_PID=$(pgrep -f "npm run start")

if [ -n "$EXISTING_PID" ]; then
  echo "[$(date)] ✅ Next.js tourne déjà (PID: $EXISTING_PID), aucune action nécessaire." >> "$LOG_FILE"
else
  echo "[$(date)] ❌ Next.js est arrêté. Redémarrage en cours..." >> "$LOG_FILE"
  /home/cayi7350/test.wcgf.com/start.sh
  echo "[$(date)] ✅ Next.js a été redémarré avec succès." >> "$LOG_FILE"
fi
