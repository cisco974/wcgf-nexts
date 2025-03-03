#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Arrêt de l'application Next.js..." | tee -a "$LOG_FILE"

# Trouver le processus lié à "npm run start"
PID=$(pgrep -f "npm run start")

if [ -n "$PID" ]; then
  echo "[$(date)] Processus trouvé : $PID" | tee -a "$LOG_FILE"
  kill -15 "$PID"  # SIGTERM pour un arrêt propre
  sleep 5

  # Vérifier si le processus s'est bien arrêté, sinon le forcer
  if ps -p "$PID" > /dev/null; then
    echo "[$(date)] Le processus ne s'est pas arrêté, forçage en cours..." | tee -a "$LOG_FILE"
    kill -9 "$PID"
  fi
  echo "[$(date)] L'application a été arrêtée avec succès." | tee -a "$LOG_FILE"
else
  echo "[$(date)] Aucun processus trouvé, l'application ne tourne pas." | tee -a "$LOG_FILE"
fi
