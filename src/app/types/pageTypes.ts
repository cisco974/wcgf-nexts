// src/app/types/pageTypes.ts
import { GamePage } from "./gamePages";

// Interface pour le modèle PageType de la base de données
export interface PageType {
  id: number;
  key: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optionnelles)
  gamePages?: GamePage[];
}

// Interface pour la création d'un type de page
export interface CreatePageTypeInput {
  key: string;
  name: string;
}

// Interface pour la mise à jour d'un type de page
export interface UpdatePageTypeInput {
  key?: string;
  name?: string;
}
