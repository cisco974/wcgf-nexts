// models.ts - Fichier unique pour tous les modèles Next.js

// Modèle des joueurs
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
