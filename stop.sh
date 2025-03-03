#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Arrêt de l'application Next.js..." | tee -a "$LOG_FILE"

# Trouver le PID de npm run start
PARENT_PID=$(pgrep -f "npm run start")

if [ -n "$PARENT_PID" ]; then
  echo "[$(date)] Processus parent trouvé : $PARENT_PID" | tee -a "$LOG_FILE"

  # Trouver les sous-processus de ce PID (ex: node server.js)
  CHILD_PIDS=$(pgrep -P "$PARENT_PID")

  # Tuer les sous-processus s'il y en a
  if [ -n "$CHILD_PIDS" ]; then
    echo "[$(date)] Sous-processus trouvés : $CHILD_PIDS, arrêt en cours..." | tee -a "$LOG_FILE"
    kill -15 "$CHILD_PIDS"
    sleep 2
  fi

  # Tuer le processus principal npm run start
  kill -15 "$PARENT_PID"
  sleep 5

  # Vérifier si le processus persiste, forcer l'arrêt si nécessaire
  if ps -p "$PARENT_PID" > /dev/null; then
    echo "[$(date)] Le processus principal ne s'est pas arrêté, forçage en cours..." | tee -a "$LOG_FILE"
    kill -9 "$PARENT_PID"
  fi

  echo "[$(date)] L'application a été arrêtée avec succès." | tee -a "$LOG_FILE"
else
  echo "[$(date)] Aucun processus trouvé, l'application ne tourne pas." | tee -a "$LOG_FILE"
fi
