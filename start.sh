#!/bin/bash
# Script de démarrage pour l'application Next.js

# Répertoire de l'application
APP_DIR="/home/cayi7350/test.wcgf.com"
# Fichier pour stocker le PID
PID_FILE="$APP_DIR/.nextjs.pid"
# Fichier de log
LOG_FILE="$APP_DIR/nextjs.log"

# Vérifier si l'application est déjà en cours d'exécution
if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null; then
    echo "L'application Next.js est déjà en cours d'exécution (PID: $(cat $PID_FILE))"
    exit 1
fi

# Se déplacer dans le répertoire de l'application
cd $APP_DIR

# Démarrer l'application avec les variables d'environnement spécifiées
echo "Démarrage de l'application Next.js..."
nohup bash -c "source /home/cayi7350/nodevenv/test.wcgf.com/22/bin/activate   npm run start" > $LOG_FILE 2>&1 &

# Enregistrer le PID
echo $! > $PID_FILE

echo "Application Next.js démarrée avec le PID: $(cat $PID_FILE)"
echo "Logs disponibles dans: $LOG_FILE"