// gamePages.ts

import { PageType } from "./pageTypes";
import { Game, GamePageContent, GamePageMeta } from "@app/types";

// Type pour les langues supportées
export type SupportedLocale = "en" | "fr" | "es";

// Interface pour le modèle GamePage
export interface GamePage {
  id: number;
  gameId: number;
  pageTypeId: number;
  content: string | GamePageContent; // Stocké comme JSON string dans la DB, objet en mémoire
  meta: string | GamePageMeta; // Stocké comme JSON string dans la DB, objet en mémoire
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optionnelles selon le contexte)
  game?: Game;
  pageType?: PageType;
}

// Interface pour la création d'une page de jeu
export interface CreateGamePageInput {
  gameId: number;
  pageTypeId: number;
  content: GamePageContent;
  meta: GamePageMeta;
  isPublished: boolean;
}

// Interface pour la mise à jour d'une page de jeu
export interface UpdateGamePageInput {
  content?: GamePageContent;
  meta?: GamePageMeta;
  isPublished?: boolean;
}
