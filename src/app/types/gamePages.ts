// src/app/types/gamePages.ts
import { Game } from "./games";
import { PageType } from "./pageTypes";

// Type pour la structure de contenu d'une langue
export type LocalizedContent = {
  page_header?: {
    title?: string;
  };
  introduction?: {
    title?: string;
    text?: string;
  };
  main_sections?: Array<{
    title: string;
    text: string;
    cta?: {
      link: string;
      text: HtmlString;
    };
  }>;
  sidebar?: SidebarContent;
  learn_more?: {
    title?: string;
    introduction?: string;
  };
  history?: {
    title?: string;
    sections: Array<{
      title: string;
      text: string;
    }>;
  };
  glossary?: {
    title?: string;
    terms: Array<{
      term: string;
      definition: string;
    }>;
  };
  play_free?: {
    title?: string;
    text?: string;
  };
};
export interface SidebarContent {
  cta_title?: string;
  cta_subtitle?: string;
  buttons?: string[];
  partner_text?: string;
}
// Type pour les métadonnées d'une langue
export type LocalizedMeta = {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
};

// Type pour le contenu complet avec toutes les langues
export type GamePageContent = {
  en?: LocalizedContent;
  fr?: LocalizedContent;
  es?: LocalizedContent;
};

// Type pour les métadonnées complètes avec toutes les langues
export type GamePageMeta = {
  en?: LocalizedMeta;
  fr?: LocalizedMeta;
  es?: LocalizedMeta;
};

// Type pour les langues supportées
export type SupportedLocale = "en" | "fr" | "es";

// Interface pour le modèle GamePage de la base de données
export interface GamePage {
  id: number;
  gameId: number;
  pageTypeId: number;
  content: string | GamePageContent; // String dans la DB, objet en mémoire
  meta: string | GamePageMeta; // String dans la DB, objet en mémoire
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optionnelles)
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
export interface LeagueContentLeagues extends LocalizedContent {
  league_info?: {
    promotion_zone_title?: string;
    maintenance_zone_title?: string;
    relegation_zone_title?: string;
    footer_text?: string;
  };
  highlight_sections?: Array<{
    title: string;
    text: string;
  }>;
}

export interface GameContentPage extends LocalizedContent {
  features?: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
  }>;
  gameHistory?: {
    // Renommé en gameHistory au lieu de history
    title: string;
    intro: string;
    sections: Array<{
      title: string;
      subsections: Array<{
        title: string;
        text: string;
      }>;
    }>;
  };
}
// Type pour marquer les champs contenant du HTML
export type HtmlString = string & { __htmlString: never };
