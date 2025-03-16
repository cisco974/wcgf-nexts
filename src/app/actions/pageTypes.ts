// pageTypes.ts
import { GamePage } from "./gamePages";

// Interface pour le modèle PageType
export interface PageType {
  id: number;
  key: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optionnelles selon le contexte)
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

// Type pour les filtres de recherche de types de page
export type PageTypeFilters = {
  key?: string;
  name?: string;
  search?: string;
};
