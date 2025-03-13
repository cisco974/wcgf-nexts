// models.ts - Fichier unique pour tous les modèles Next.js

// Modèle des joueurs

import { GameMeta } from "./fireStoreModels";
import { FirestoreTimestamp } from "@root/lib/firebase-config";

export type Player = {
  rank: number;
  name: string;
  avatar: string;
  points: number;
};

// Modèle des tournois
export type TournamentEvent = {
  title: string;
  subtitle: string;
  icon: string;
  month: string;
  day: string;
  buyin: string;
};

// Modèle des jeux
export type Game = {
  key: string;
  title: string;
  subtitle: string;
  header_image: string;
  icon: string;
  logo: string;
  players: Player[];
  tournaments: TournamentEvent[];
};

// Modèle des plateformes
export type Platform = {
  name: string;
  icon: string;
  class: string;
};

// Modèle des ligues et divisions
export type League = {
  value: number;
  name: string;
};

export type Division = {
  value: number;
  name: string;
};

// Modèle des classements et séries de graphiques
export type RankingCategory = {
  key: string;
  title: string;
  logos: string[];
  players: Player[];
  chartSeries: { name: string; value: number }[][];
  chartColors: string[];
  resume: string;
};
// Définissez un type pour la structure de contenu
export type GameContent = Record<
  string,
  {
    page_header?: { title?: string };
    introduction?: { title?: string; text?: string };
    main_sections?: {
      title: string;
      text: string;
      cta: { link: string; text: string };
    }[];
    sidebar?: { cta_title?: string; cta_subtitle?: string; buttons?: string[] };
    learn_more?: { title?: string; introduction?: string };
    history?: { title?: string; sections: { title: string; text: string }[] };
    glossary?: {
      title?: string;
      terms: { term: string; definition: string }[];
    };
    play_free?: { title?: string; text?: string };
  }
>;

// Mettez à jour votre interface GamePageData
export interface GamePageData {
  id: string;
  gameId: string;
  pageTypeId: string;
  content: GameContent; // Indexé par langue
  meta: GameMeta; // Indexé par langue
  isPublished: boolean;
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
}
// Types
export type GameData = {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
};

export type PageType = {
  id: number;
  key: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};
