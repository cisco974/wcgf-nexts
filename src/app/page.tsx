"use client";
import React from "react";
import GameCard from "./components/GameCard";
import LeagueTable from "./components/LeagueTable";
import RankingComponent from "./components/RankingComponent";
import SectionHeader from "./components/SectionHeader";
import Tournament from "./components/Tournament";
import { Game, Platform } from "./models/models";
import PlayerStats from "./components/PlayerStats";
import PageHeader from "./components/PageHeader";
// Mock data for leagues and divisions
const leagues = {
  tarot: [
    { value: 1, name: "League 1" },
    { value: 2, name: "League 2" },
    { value: 3, name: "League 3" },
  ],
  rummy: [
    { value: 1, name: "League 1" },
    { value: 2, name: "League 2" },
    { value: 3, name: "League 3" },
  ],
  rummy500: [
    { value: 1, name: "League 1" },
    { value: 2, name: "League 2" },
    { value: 3, name: "League 3" },
  ],
};

const divisions = {
  tarot: [
    { value: 1, name: "Division 1" },
    { value: 2, name: "Division 2" },
    { value: 3, name: "Division 3" },
  ],
  rummy: [
    { value: 1, name: "Division 1" },
    { value: 2, name: "Division 2" },
    { value: 3, name: "Division 3" },
  ],
  rummy500: [
    { value: 1, name: "Division 1" },
    { value: 2, name: "Division 2" },
    { value: 3, name: "Division 3" },
  ],
};

// Mock data - in a real app, this would come from an API
const games: Game[] = [
  {
    key: "tarot",
    title: "Tarot",
    subtitle:
      "Challenge your strategy skills with Super Tarot. A timeless classic.",
    header_image: "/img/header/header-tarot.jpg",
    icon: "/img/store/icon-tarot.webp",
    logo: "/img/tarot/logo-en.webp",
    players: [
      {
        rank: 1,
        name: "Yum",
        avatar: "/img/avatars/1.png",
        points: 2000,
      },
      {
        rank: 2,
        name: "CR7",
        avatar: "/img/avatars/2.png",
        points: 1700,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    tournaments: [
      {
        title: "Tarot",
        subtitle: "5 players",
        icon: "/img/store/icon-tarot.webp",
        month: "MAY",
        day: "08",
        buyin: "500",
      },
      {
        title: "Tarot",
        subtitle: "4 players",
        icon: "/img/store/icon-tarot.webp",
        month: "MAY",
        day: "02",
        buyin: "250",
      },
      {
        title: "Tarot",
        subtitle: "5 players",
        icon: "/img/store/icon-tarot.webp",
        month: "MAY",
        day: "08",
        buyin: "500",
      },
    ],
  },
  {
    key: "rummy",
    title: "Rummy",
    subtitle:
      "Experience the excitement of Super Rummy. Combine strategy and skill.",
    header_image: "/img/header/header-rummy.jpg",
    icon: "/img/store/icon-rummy.webp",
    logo: "/img/rummy/logo-en.webp",
    players: [
      {
        rank: 1,
        name: "Gen7",
        avatar: "/img/avatars/1.png",
        points: 1950,
      },
      {
        rank: 2,
        name: "Atole24",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    tournaments: [
      {
        title: "Rummy",
        subtitle: "3 players",
        icon: "/img/store/icon-rummy.webp",
        month: "MAY",
        day: "06",
        buyin: "1000",
      },
      {
        title: "Rummy",
        subtitle: "3 players",
        icon: "/img/store/icon-rummy.webp",
        month: "MAY",
        day: "06",
        buyin: "1000",
      },
      {
        title: "Rummy",
        subtitle: "3 players",
        icon: "/img/store/icon-rummy.webp",
        month: "MAY",
        day: "06",
        buyin: "1000",
      },
    ],
  },
  {
    key: "rummy500",
    title: "Rummy 500",
    subtitle: "Dive into the world of Super Rummy 500. A beloved card game.",
    header_image: "/img/header/header-rummy500.webp",
    icon: "/img/store/icon-rummy500.webp",
    logo: "/img/rummy500/logo-en.webp",
    players: [
      {
        rank: 1,
        name: "ProGamerX",
        avatar: "/img/avatars/1.png",
        points: 1500,
      },
      {
        rank: 2,
        name: "Legend47",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    tournaments: [
      {
        title: "Rummy 500",
        subtitle: "4 players",
        icon: "/img/store/icon-rummy500.webp",
        month: "MAY",
        day: "10",
        buyin: "1000",
      },
      {
        title: "Rummy 500",
        subtitle: "2 players",
        icon: "/img/store/icon-rummy500.webp",
        month: "MAY",
        day: "04",
        buyin: "500",
      },
      {
        title: "Rummy 500",
        subtitle: "2 players",
        icon: "/img/store/icon-rummy500.webp",
        month: "MAY",
        day: "04",
        buyin: "500",
      },
    ],
  },
];

const platforms: Platform[] = [
  { name: "iOS", icon: "fi-brands-apple", class: "btn-ios" },
  { name: "Android", icon: "fi-brands-android", class: "btn-android" },
  { name: "Online", icon: "fi-ss-spade", class: "btn-web" },
];

// Mock data for ranking categories
const rankingCategories = [
  {
    key: "leagues",
    title: "LEAGUES RANKINGS",
    logos: ["/img/avatars/5.png", "/img/avatars/4.png", "/img/avatars/2.png"],
    players: [
      {
        rank: 1,
        name: "ProGamerX",
        avatar: "/img/avatars/1.png",
        points: 1500,
      },
      {
        rank: 2,
        name: "Legend47",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    chartSeries: [
      [
        { name: "Mon", value: 0 },
        { name: "Tue", value: 5 },
        { name: "Wed", value: 7 },
        { name: "Thu", value: 8 },
        { name: "Fri", value: 15 },
        { name: "Sat", value: 20 },
        { name: "Sun", value: 25 },
      ],
      [
        { name: "Mon", value: 0 },
        { name: "Tue", value: 4 },
        { name: "Wed", value: 8 },
        { name: "Thu", value: 7 },
        { name: "Fri", value: 10 },
        { name: "Sat", value: 15 },
        { name: "Sun", value: 25 },
      ],
      [
        { name: "Mon", value: 0 },
        { name: "Tue", value: 4 },
        { name: "Wed", value: 9 },
        { name: "Thu", value: 15 },
        { name: "Fri", value: 19 },
        { name: "Sat", value: 45 },
        { name: "Sun", value: 52 },
      ],
    ],
    chartColors: ["#0088FE", "#67c1eb", "#a0d8f1"],
    resume:
      "Week the top of the Super Tarot game league points table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
  {
    key: "experience",
    title: "EXPERIENCE RANKINGS",
    logos: ["/img/avatars/2.png", "/img/avatars/1.png", "/img/avatars/3.png"],
    players: [
      {
        rank: 1,
        name: "ProGamerX",
        avatar: "/img/avatars/1.png",
        points: 1500,
      },
      {
        rank: 2,
        name: "Legend47",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    chartSeries: [
      [
        { name: "Week 1", value: 9500 },
        { name: "Week 2", value: 15000 },
        { name: "Week 3", value: 22000 },
        { name: "Week 4", value: 30000 },
      ],
      [
        { name: "Week 1", value: 7800 },
        { name: "Week 2", value: 12500 },
        { name: "Week 3", value: 18000 },
        { name: "Week 4", value: 24000 },
      ],
      [
        { name: "Week 1", value: 5600 },
        { name: "Week 2", value: 9000 },
        { name: "Week 3", value: 13500 },
        { name: "Week 4", value: 18000 },
      ],
    ],
    chartColors: ["#FF5252", "#f18d5e", "#f5c5a0"],
    resume:
      "Month the top of the Super Tarot game league points table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
  {
    key: "coins",
    title: "COINS RANKINGS",
    logos: ["/img/avatars/4.png", "/img/avatars/3.png", "/img/avatars/1.png"],
    players: [
      {
        rank: 1,
        name: "dDD",
        avatar: "/img/avatars/1.png",
        points: 1500,
      },
      {
        rank: 2,
        name: "Legend997",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      {
        rank: 3,
        name: "CardMaster",
        avatar: "/img/avatars/3.png",
        points: 1350,
      },
    ],
    chartSeries: [
      [
        { name: "Jan", value: 30000 },
        { name: "Feb", value: 42000 },
        { name: "Mar", value: 55000 },
        { name: "Apr", value: 70000 },
        { name: "May", value: 88000 },
        { name: "Jun", value: 110000 },
        { name: "Jul", value: 135000 },
        { name: "Aug", value: 165000 },
        { name: "Sep", value: 200000 },
        { name: "Oct", value: 240000 },
        { name: "Nov", value: 285000 },
        { name: "Dec", value: 270000 },
      ],
      [
        { name: "Jan", value: 24000 },
        { name: "Feb", value: 34000 },
        { name: "Mar", value: 45000 },
        { name: "Apr", value: 58000 },
        { name: "May", value: 72000 },
        { name: "Jun", value: 88000 },
        { name: "Jul", value: 106000 },
        { name: "Aug", value: 127000 },
        { name: "Sep", value: 150000 },
        { name: "Oct", value: 176000 },
        { name: "Nov", value: 205000 },
        { name: "Dec", value: 237000 },
      ],
      [
        { name: "Jan", value: 18000 },
        { name: "Feb", value: 25000 },
        { name: "Mar", value: 33000 },
        { name: "Apr", value: 42000 },
        { name: "May", value: 52000 },
        { name: "Jun", value: 63000 },
        { name: "Jul", value: 75000 },
        { name: "Aug", value: 88000 },
        { name: "Sep", value: 102000 },
        { name: "Oct", value: 117000 },
        { name: "Nov", value: 133000 },
        { name: "Dec", value: 150000 },
      ],
    ],
    chartColors: ["#8B4513", "#a57047", "#c4a283"],
    resume:
      "Year the top of the Super Tarot game league points table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
];
// BEST PLAYERS Section to be added directly to page.tsx

// Player data
const topPlayers = [
  {
    name: "ProGamerX",
    avatar: "/img/avatars/1.png",
    title: "XP / LEAGUES / COINS",
    game_icon: "/img/store/icon-tarot.jpg",
    stats: {
      experience: 5000,
      points: 7565,
      coins: 25000,
      wins: 75,
      losses: 30,
    },
    recentGames: [
      { type: "Tarot", result: 1 },
      { type: "Rummy", result: -1 },
      { type: "Rummy 500", result: 1 },
    ],
  },
  {
    name: "Legend47",
    avatar: "/img/avatars/2.png",
    title: "XP / LEAGUES / COINS",
    game_icon: "/img/store/icon-rummy.jpg",
    stats: {
      experience: 4900,
      points: 7200,
      coins: 23000,
      wins: 70,
      losses: 29,
    },
    recentGames: [
      { type: "Rummy", result: 1 },
      { type: "Rummy 500", result: -1 },
      { type: "Tarot", result: 1 },
    ],
  },
  {
    name: "CardMaster",
    avatar: "/img/avatars/3.png",
    title: "XP / LEAGUES / COINS",
    game_icon: "/img/store/icon-rummy500.webp",
    stats: {
      experience: 5200,
      points: 7600,
      coins: 26000,
      wins: 80,
      losses: 27,
    },
    recentGames: [
      { type: "Rummy 500", result: 1 },
      { type: "Tarot", result: -1 },
      { type: "Rummy", result: 1 },
    ],
  },
];

// Chart data configuration
const playerChartSeries: Record<
  string,
  {
    series: { name: string; data: { name: string; value: number }[] }[];
    colors: string[];
    statValues: number[];
    statLabels: string[];
    statColors: string[];
    winLoss: { name: string; data: { name: string; value: number }[] }[];
    winLossColors: string[];
  }
> = {
  ProGamerX: {
    // Series data for main chart (3 lines)
    series: [
      // XP (Red line)
      {
        name: "XP",
        data: [
          { name: "Mon", value: 1200 },
          { name: "Tue", value: 4500 },
          { name: "Wed", value: 1800 },
          { name: "Thu", value: 5000 },
          { name: "Fri", value: 7500 },
          { name: "Sat", value: 8200 },
          { name: "Sun", value: 7400 },
        ],
      },
      // League Points (Blue line)
      {
        name: "League",
        data: [
          { name: "Mon", value: 250 },
          { name: "Tue", value: 1000 },
          { name: "Wed", value: 1500 },
          { name: "Thu", value: 4000 },
          { name: "Fri", value: 6200 },
          { name: "Sat", value: 8000 },
          { name: "Sun", value: 10000 },
        ],
      },
      // Coins (Gold line)
      {
        name: "Coins",
        data: [
          { name: "Mon", value: 0 },
          { name: "Tue", value: 2200 },
          { name: "Wed", value: 3800 },
          { name: "Thu", value: 4800 },
          { name: "Fri", value: 5100 },
          { name: "Sat", value: 6400 },
          { name: "Sun", value: 7300 },
        ],
      },
    ],
    colors: ["#E64A19", "#29B6F6", "#D4AC0D"], // Red, Blue, Gold
    statValues: [5000, 7565, 25000],
    statLabels: ["XP", "LEAGUES", "COINS"],
    statColors: ["#E64A19", "#29B6F6", "#D4AC0D"],

    // Win/Loss chart data
    winLoss: [
      // Wins (Green line)
      {
        name: "Wins",
        data: [
          { name: "Mon", value: 5 },
          { name: "Tue", value: 20 },
          { name: "Wed", value: 30 },
          { name: "Thu", value: 45 },
          { name: "Fri", value: 55 },
          { name: "Sat", value: 65 },
          { name: "Sun", value: 75 },
        ],
      },
      // Losses (Red line)
      {
        name: "Losses",
        data: [
          { name: "Mon", value: 5 },
          { name: "Tue", value: 10 },
          { name: "Wed", value: 15 },
          { name: "Thu", value: 20 },
          { name: "Fri", value: 25 },
          { name: "Sat", value: 30 },
          { name: "Sun", value: 35 },
        ],
      },
    ],
    winLossColors: ["#8BC34A", "#E53935"], // Green, Red
  },

  Legend47: {
    series: [
      {
        name: "XP",
        data: [
          { name: "Mon", value: 1300 },
          { name: "Tue", value: 2300 },
          { name: "Wed", value: 1600 },
          { name: "Thu", value: 6000 },
          { name: "Fri", value: 4200 },
          { name: "Sat", value: 4500 },
          { name: "Sun", value: 2000 },
        ],
      },
      {
        name: "League",
        data: [
          { name: "Mon", value: 500 },
          { name: "Tue", value: 1500 },
          { name: "Wed", value: 2200 },
          { name: "Thu", value: 3800 },
          { name: "Fri", value: 5200 },
          { name: "Sat", value: 7000 },
          { name: "Sun", value: 9000 },
        ],
      },
      {
        name: "Coins",
        data: [
          { name: "Mon", value: 800 },
          { name: "Tue", value: 1600 },
          { name: "Wed", value: 2600 },
          { name: "Thu", value: 3500 },
          { name: "Fri", value: 4500 },
          { name: "Sat", value: 6000 },
          { name: "Sun", value: 7200 },
        ],
      },
    ],
    colors: ["#E64A19", "#29B6F6", "#D4AC0D"],
    statValues: [4900, 7200, 23000],
    statLabels: ["XP", "LEAGUES", "COINS"],
    statColors: ["#E64A19", "#29B6F6", "#D4AC0D"],
    winLoss: [
      {
        name: "Wins",
        data: [
          { name: "Mon", value: 8 },
          { name: "Tue", value: 18 },
          { name: "Wed", value: 28 },
          { name: "Thu", value: 40 },
          { name: "Fri", value: 50 },
          { name: "Sat", value: 60 },
          { name: "Sun", value: 70 },
        ],
      },
      {
        name: "Losses",
        data: [
          { name: "Mon", value: 4 },
          { name: "Tue", value: 8 },
          { name: "Wed", value: 12 },
          { name: "Thu", value: 18 },
          { name: "Fri", value: 23 },
          { name: "Sat", value: 26 },
          { name: "Sun", value: 29 },
        ],
      },
    ],
    winLossColors: ["#8BC34A", "#E53935"],
  },

  CardMaster: {
    series: [
      {
        name: "XP",
        data: [
          { name: "Mon", value: 1600 },
          { name: "Tue", value: 2500 },
          { name: "Wed", value: 4800 },
          { name: "Thu", value: 2500 },
          { name: "Fri", value: 3000 },
          { name: "Sat", value: 5800 },
          { name: "Sun", value: 2700 },
        ],
      },
      {
        name: "League",
        data: [
          { name: "Mon", value: 400 },
          { name: "Tue", value: 1200 },
          { name: "Wed", value: 2000 },
          { name: "Thu", value: 3500 },
          { name: "Fri", value: 5500 },
          { name: "Sat", value: 7600 },
          { name: "Sun", value: 10000 },
        ],
      },
      {
        name: "Coins",
        data: [
          { name: "Mon", value: 300 },
          { name: "Tue", value: 900 },
          { name: "Wed", value: 1900 },
          { name: "Thu", value: 3000 },
          { name: "Fri", value: 4500 },
          { name: "Sat", value: 6000 },
          { name: "Sun", value: 7300 },
        ],
      },
    ],
    colors: ["#E64A19", "#29B6F6", "#D4AC0D"],
    statValues: [5200, 7600, 26000],
    statLabels: ["XP", "LEAGUES", "COINS"],
    statColors: ["#E64A19", "#29B6F6", "#D4AC0D"],
    winLoss: [
      {
        name: "Wins",
        data: [
          { name: "Mon", value: 10 },
          { name: "Tue", value: 22 },
          { name: "Wed", value: 35 },
          { name: "Thu", value: 45 },
          { name: "Fri", value: 55 },
          { name: "Sat", value: 68 },
          { name: "Sun", value: 80 },
        ],
      },
      {
        name: "Losses",
        data: [
          { name: "Mon", value: 3 },
          { name: "Tue", value: 7 },
          { name: "Wed", value: 12 },
          { name: "Thu", value: 15 },
          { name: "Fri", value: 19 },
          { name: "Sat", value: 23 },
          { name: "Sun", value: 27 },
        ],
      },
    ],
    winLossColors: ["#8BC34A", "#E53935"],
  },
};
const events = [
  {
    title: "Tarot",
    subtitle: "4 players",
    icon: "/img/store/icon-tarot.webp",
    month: "MAY",
    day: "02",
    buyin: "250",
  },
  {
    title: "Rummy 500",
    subtitle: "2 players",
    icon: "/img/store/icon-rummy500.webp",
    month: "MAY",
    day: "04",
    buyin: "500",
  },
  {
    title: "Rummy",
    subtitle: "3 players",
    icon: "/img/store/icon-rummy.webp",
    month: "MAY",
    day: "06",
    buyin: "1000",
  },
  {
    title: "Tarot",
    subtitle: "5 players",
    icon: "/img/store/icon-tarot.webp",
    month: "MAY",
    day: "08",
    buyin: "500",
  },
  {
    title: "Rummy 500",
    subtitle: "4 players",
    icon: "/img/store/icon-rummy500.webp",
    month: "MAY",
    day: "10",
    buyin: "1000",
  },
  {
    title: "Tarot",
    subtitle: "4 players",
    icon: "/img/store/icon-tarot.webp",
    month: "MAY",
    day: "02",
    buyin: "250",
  },
  {
    title: "Rummy 500",
    subtitle: "2 players",
    icon: "/img/store/icon-rummy500.webp",
    month: "MAY",
    day: "04",
    buyin: "500",
  },
  {
    title: "Rummy",
    subtitle: "3 players",
    icon: "/img/store/icon-rummy.webp",
    month: "MAY",
    day: "06",
    buyin: "1000",
  },
  {
    title: "Tarot",
    subtitle: "5 players",
    icon: "/img/store/icon-tarot.webp",
    month: "MAY",
    day: "08",
    buyin: "500",
  },
  {
    title: "Rummy 500",
    subtitle: "4 players",
    icon: "/img/store/icon-rummy500.webp",
    month: "MAY",
    day: "10",
    buyin: "1000",
  },
];
export default function HomePage() {
  return (
    <>
      <PageHeader type="home" events={events} background="/img/header.jpg" />

      <div className="container py-4">
        {/* WCGF OFFICIAL GAMES Section */}
        <section className="mb-5">
          <SectionHeader
            title="WCGF OFFICIAL GAMES"
            subtitle="Explore our selection of official games on WCGF. Discover our classics games like Super Tarot, Super Rummy, and Super Rummy 500 and more card games soon. These games are crafted for both casual players and competitive enthusiasts."
          />

          <div className="row g-4">
            {games.map((game) => (
              <div className="col-12 col-md-6 col-lg-4" key={game.key}>
                <GameCard
                  title={game.title}
                  subtitle={game.subtitle}
                  image={game.header_image}
                  icon={game.icon}
                  platforms={platforms}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button className="play-game-button text-white fw-bold">
              MORE GAMES
            </button>
          </div>
        </section>

        {/* WCGF SUPER LEAGUES Section */}
        <section className="mb-5">
          <SectionHeader
            title="WCGF SUPER LEAGUES"
            subtitle="Compete in the highly anticipated WCGF leagues, where players worldwide test their skills and climb the ranks."
          />

          <div className="row g-4">
            {games.map((game) => {
              const gameKey = game.key;
              return (
                <div className="col-12 col-lg-4" key={`league-${gameKey}`}>
                  <LeagueTable
                    title={game.title}
                    logo={game.logo}
                    leagues={leagues[gameKey as keyof typeof leagues] || []}
                    divisions={
                      divisions[gameKey as keyof typeof divisions] || []
                    }
                    players={game.players}
                  />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <button className="play-game-button">MORE LEAGUES</button>
          </div>
        </section>

        {/* WCGF Ranking Section */}
        <section className="mb-5">
          <SectionHeader
            title="WCGF RANKINGS"
            subtitle="Stay updated with the latest rankings of your favorite games on WCGF. Our detailed leaderboards showcase the top players across different leagues and tournaments. See how you rank against other competitors, analyze their stats, and strategize your next move to secure your position at the top."
          />

          <div className="row g-4">
            {rankingCategories.map((rankCategory) => (
              <div
                className="col-12 col-lg-4"
                key={`ranking-${rankCategory.key}`}
              >
                <RankingComponent />
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button className="play-game-button">ALL RANKINGS</button>
          </div>
        </section>

        {/* WCGF Tournament Section */}
        <section className="mb-5">
          <SectionHeader
            title="WCGF TOURNAMENTS"
            subtitle="Dive into the thrill of WCGF tournaments! With exciting buy-ins, dynamic match formats, and generous prize pools."
          />

          <div className="row g-4">
            {games.map((game: Game) => (
              <div className="col-12 col-lg-4" key={`tournament-${game.key}`}>
                <Tournament
                  logo={game.logo}
                  events={game.tournaments}
                  game={game.title}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button className="play-game-button">ALL RANKINGS</button>
          </div>
        </section>

        {/* BEST PLAYERS Section */}
        <section className="mb-5">
          <SectionHeader
            title="BEST PLAYERS OF THE WEEK, MONTH, AND YEAR"
            subtitle="Explore the champions of the moment on WCGF! From the stars of the week to the legends of the year."
          />

          <div className="row g-4">
            {topPlayers.map((player) => {
              const chartData = playerChartSeries[player.name] || null;
              if (!chartData) {
                console.error(`No data found for player: ${player.name}`);
                return null; // Évite une erreur d'accès
              }
              if (!chartData) return null;

              return (
                <div className="col-12 col-md-4" key={player.name}>
                  <PlayerStats
                    playerName={player.name}
                    avatar={player.avatar}
                    title={player.title}
                    game_icon={player.game_icon}
                    experience={player.stats.experience}
                    points={player.stats.points}
                    coins={player.stats.coins}
                    wins={player.stats.wins}
                    losses={player.stats.losses}
                    recentGames={player.recentGames}
                    chartSeries={chartData.series}
                    chartColors={chartData.colors}
                    winLossSeries={chartData.winLoss}
                    winLossColors={chartData.winLossColors}
                    statColors={chartData.statColors}
                  />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <button className="play-game-button">ALL PLAYERS</button>
          </div>
        </section>
      </div>
    </>
  );
}
