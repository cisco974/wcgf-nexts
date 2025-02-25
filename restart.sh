#!/bin/bash
# Script de redémarrage pour l'application Next.js

# Répertoire de l'application
APP_DIR="/home/cayi7350/test.wcgf.com"

# Chemin vers les scripts start et stop
STOP_SCRIPT="$APP_DIR/stop.sh"
START_SCRIPT="$APP_DIR/start.sh"

# Vérifier si les scripts existent
if [ ! -f "$STOP_SCRIPT" ] || [ ! -f "$START_SCRIPT" ]; then
    echo "Les scripts start.sh et stop.sh doivent être dans le même répertoire"
    exit 1
fi

# S'assurer que les scripts sont exécutables
chmod +x "$STOP_SCRIPT"
chmod +x "$START_SCRIPT"

echo "Redémarrage de l'application Next.js..."

# Arrêter l'application
echo "Étape 1: Arrêt de l'application en cours..."
$STOP_SCRIPT

# Attendre un peu pour s'assurer que tout est bien arrêté
sleep 2

# Démarrer l'application
echo "Étape 2: Démarrage de l'application..."
$START_SCRIPT

echo "Redémarrage terminé"