// src/app/types/games.ts
import { GamePage } from "./gamePages";

// Interface pour le modèle Game de la base de données
export interface Game {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optionnelles)
  pages?: GamePage[];
}

// Interface pour la création d'un jeu
export interface CreateGameInput {
  key: string;
  title: string;
  subtitle?: string | null;
}

// Interface pour la mise à jour d'un jeu
export interface UpdateGameInput {
  key?: string;
  title?: string;
  subtitle?: string | null;
}

// Type pour les filtres de recherche de jeux
export type GameFilters = {
  key?: string;
  title?: string;
  search?: string;
};
