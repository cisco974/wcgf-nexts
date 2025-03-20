// src/app/types/ui.ts
// Types pour l'UI qui n'ont pas d'équivalent direct dans la base de données

export interface Player {
  rank: number;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  level: number;
  points: number;
  pts: number;
}

export type TournamentEvent = {
  title: string;
  subtitle: string;
  icon: string;
  month: string;
  day: string;
  buyin: string;
};

export type Platform = {
  name: string;
  icon: string;
  class: string;
};

export type League = {
  value: number;
  name: string;
};

export type Division = {
  value: number;
  name: string;
};

export type RankingCategory = {
  key: string;
  title: string;
  logos: string[];
  players: Player[];
  chartSeries: { name: string; value: number }[][];
  chartColors: string[];
  resume: string;
};

// Version UI étendue du type Game
export type GameUI = {
  key: string;
  title: string;
  subtitle: string;
  header_image: string;
  icon: string;
  logo: string;
  players: Player[];
  tournaments: TournamentEvent[];
};
