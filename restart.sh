#!/bin/bash
LOG_FILE="/home/cayi7350/test.wcgf.com/nextjs.log"

echo "[$(date)] Redémarrage de l'application Next.js..." | tee -a "$LOG_FILE"

# Arrêter l'application
/home/cayi7350/test.wcgf.com/stop.sh

# Démarrer l'application
/home/cayi7350/test.wcgf.com/start.sh

echo "[$(date)] L'application Next.js a été redémarrée avec succès." | tee -a "$LOG_FILE"
