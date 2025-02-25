#!/bin/bash
# Script d'arrêt amélioré pour l'application Next.js

# Répertoire de l'application
APP_DIR="/home/cayi7350/test.wcgf.com"
# Fichier contenant le PID
PID_FILE="$APP_DIR/.nextjs.pid"

echo "Arrêt de l'application Next.js..."

# 1. Rechercher et arrêter le processus next-server
NEXT_PIDS=$(pgrep -f "next-server")
if [ -n "$NEXT_PIDS" ]; then
  echo "Arrêt des processus next-server (PIDs: $NEXT_PIDS)..."
  for PID in $NEXT_PIDS; do
    kill $PID
  done
  sleep 1

  # Vérifier si les processus existent toujours et forcer l'arrêt si nécessaire
  for PID in $NEXT_PIDS; do
    if ps -p $PID > /dev/null 2>&1; then
      echo "Forçage de l'arrêt du processus next-server (PID: $PID)..."
      kill -9 $PID
    fi
  done
fi

# 2. Rechercher et arrêter les processus npm run start
NPM_PIDS=$(pgrep -f "npm run start")
if [ -n "$NPM_PIDS" ]; then
  echo "Arrêt des processus npm (PIDs: $NPM_PIDS)..."
  for PID in $NPM_PIDS; do
    kill $PID
  done
  sleep 1

  # Vérifier si les processus existent toujours et forcer l'arrêt si nécessaire
  for PID in $NPM_PIDS; do
    if ps -p $PID > /dev/null 2>&1; then
      echo "Forçage de l'arrêt du processus npm (PID: $PID)..."
      kill -9 $PID
    fi
  done
fi

# 3. Si un fichier PID existait, le supprimer
if [ -f "$PID_FILE" ]; then
  rm -f "$PID_FILE"
fi

echo "Application Next.js arrêtée avec succès"