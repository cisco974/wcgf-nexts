#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Vérification du processus Next.js..." | tee -a "$LOG_FILE"

# Vérifier si un processus "npm run start" est déjà actif
EXISTING_PID=$(pgrep -f "npm run start")

if [ -n "$EXISTING_PID" ]; then
  echo "[$(date)] L'application est déjà en cours d'exécution (PID: $EXISTING_PID). Démarrage annulé." | tee -a "$LOG_FILE"
  exit 1
fi

echo "[$(date)] Démarrage de l'application Next.js..." | tee -a "$LOG_FILE"

cd /home/cayi7350/test.wcgf.com || exit 1

nohup nice -n -20 bash -c "source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate && npm run start" >> "$LOG_FILE" 2>&1 &

echo "[$(date)] L'application Next.js est en cours d'exécution." | tee -a "$LOG_FILE"
