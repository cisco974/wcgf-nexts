#!/bin/bash
# Script d'arrêt pour l'application Next.js

# Répertoire de l'application
APP_DIR="/home/cayi7350/test.wcgf.com"
# Fichier contenant le PID
PID_FILE="$APP_DIR/.nextjs.pid"

# Vérifier si le fichier PID existe
if [ ! -f "$PID_FILE" ]; then
    echo "Aucune instance de l'application Next.js n'est en cours d'exécution (fichier PID non trouvé)"
    exit 0
fi

# Récupérer le PID
PID=$(cat "$PID_FILE")

# Vérifier si le processus existe
if ! ps -p $PID > /dev/null; then
    echo "Le processus avec PID $PID n'existe pas"
    rm -f "$PID_FILE"
    exit 0
fi

# Arrêter le processus
echo "Arrêt de l'application Next.js (PID: $PID)..."
kill $PID

# Attendre que le processus se termine (maximum 10 secondes)
for i in {1..10}; do
    if ! ps -p $PID > /dev/null; then
        echo "Application Next.js arrêtée"
        rm -f "$PID_FILE"
        exit 0
    fi
    sleep 1
done

# Si le processus existe toujours, forcer l'arrêt
if ps -p $PID > /dev/null; then
    echo "Forçage de l'arrêt de l'application Next.js..."
    kill -9 $PID
    rm -f "$PID_FILE"
fi

echo "Application Next.js arrêtée"