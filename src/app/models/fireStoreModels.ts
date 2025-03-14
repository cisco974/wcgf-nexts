// app/models/fireStoreModels.ts
import { FirestoreTimestamp } from "@lib/firebase-config";

// Types pour les jeux
export interface Game {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  createdAt: FirestoreTimestamp | Date | string;
  updatedAt: FirestoreTimestamp | Date | string;
}

// Types pour les types de pages
export interface PageType {
  id: string;
  key: string;
  name: string;
  createdAt: FirestoreTimestamp | Date | string;
  updatedAt: FirestoreTimestamp | Date | string;
}

// Interface pour le contenu d'une page de jeu
export interface GameContent {
  page_header?: {
    title: string;
  };
  introduction?: {
    title: string;
    text: string;
  };
  main_sections?: Array<{
    title: string;
    text: string;
    cta?: {
      text: string;
      link: string;
    };
  }>;
  sidebar?: {
    cta_title?: string;
    cta_subtitle?: string;
    buttons?: string[];
    partner_text?: string;
  };
  learn_more?: {
    title: string;
    introduction: string;
  };
  history?: {
    title: string;
    sections: Array<{
      title: string;
      text: string;
    }>;
  };
  glossary?: {
    title: string;
    terms: Array<{
      term: string;
      definition: string;
    }>;
  };
  play_free?: {
    title: string;
    text: string;
  };
}

// Interface pour les métadonnées
export interface GameMeta {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

// Types pour les pages de jeux
export interface GamePage {
  id: string;
  gameId: string;
  pageTypeId: string;
  content: Record<"en" | "fr" | "es", GameContent>;
  meta: Record<"en" | "fr" | "es", GameMeta>;
  isPublished: boolean;
  createdAt: FirestoreTimestamp | Date | string;
  updatedAt: FirestoreTimestamp | Date | string;
}
