"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LineChart from "./LineChart";
import LastGames from "./LastGames";

// Define types for player statistics
type RecentGame = {
  type: string;
  result: number; // 1 for win, -1 for loss
};

type ChartDataPoint = {
  name: string;
  value: number;
};

type ChartSeries = {
  name: string;
  data: ChartDataPoint[];
};

type PlayerStatsProps = {
  playerName: string;
  avatar: string;
  title: string;
  game_icon: string;
  experience: number;
  points: number;
  coins: number;
  wins: number;
  losses: number;
  recentGames: RecentGame[];
  chartSeries: ChartSeries[];
  chartColors: string[];
  winLossSeries: ChartSeries[];
  winLossColors: string[];
  statColors: string[];
};

const PlayerStats: React.FC<PlayerStatsProps> = ({
  playerName,
  avatar,
  title,
  game_icon,
  experience,
  points,
  coins,
  wins,
  losses,
  recentGames = [],
  chartSeries = [],
  chartColors,
  winLossSeries = [],
  winLossColors,
  statColors,
}) => {
  // État pour détection du client (résolution du problème d'hydratation)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate unique chart IDs
  const chartId = `player-stats-chart-${playerName.replace(/\s+/g, "-").toLowerCase()}`;
  const winLossChartId = `player-winloss-chart-${playerName.replace(/\s+/g, "-").toLowerCase()}`;

  // Transformer les données récentes de jeux pour le composant LastGames
  // Utilisation de valeurs fixes pour éviter les problèmes d'hydratation
  const formattedGameResults = recentGames.map((game, index) => {
    // Pour chaque jeu, on génère un résultat fixe en fonction du type de jeu
    let fixedResult;
    if (game.type === "Tarot") {
      fixedResult = game.result > 0 ? 250 : -100;
    } else if (game.type === "Rummy") {
      fixedResult = game.result > 0 ? 100 : -100;
    } else if (game.type === "Rummy 500") {
      fixedResult = game.result > 0 ? 100 : -50;
    } else {
      // Valeur par défaut pour les autres types de jeux
      fixedResult = game.result > 0 ? 100 : -100;
    }

    return {
      rank: index + 1,
      avatar: avatar,
      name: playerName,
      gameTitle: game.type,
      result: fixedResult,
    };
  });

  return (
    <div className="ps_outer-container">
      <div className="ps_card card shadow rounded-4 pb-4">
        <div className="ps_card-inner p-3">
          {/* Filter controls */}
          <div className="ps_filters-container bg-light rounded mb-3 p-3">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <select className="ps_time-filter form-select">
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>

              <select className="ps_game-filter form-select">
                <option value="tarot">Tarot</option>
                <option value="rummy">Rummy</option>
                <option value="rummy500">Rummy 500</option>
              </select>
            </div>
          </div>

          {/* Player header with banner */}
          <div className="ps_header-container position-relative mb-5">
            <div className="ps_header-bg-container rounded-4">
              <Image
                src="/img/bg-table.webp"
                alt="Background"
                width={462}
                height={130}
                className="ps_header-bg w-100 h-100 rounded-4"
              />
            </div>

            {/* Game icon */}
            <div className="ps_game-icon-wrapper p-2 z-1">
              <div className="ps_game-icon-container">
                <Image
                  src={game_icon}
                  alt="Game"
                  width={50}
                  height={50}
                  className="ps_game-icon"
                />
              </div>
            </div>

            {/* Player avatar */}
            <div className="ps_avatar-wrapper z-1">
              <div className="ps_avatar-container">
                <Image
                  src={avatar}
                  alt={playerName}
                  width={110}
                  height={110}
                  className="ps_avatar-img"
                />
              </div>
            </div>
          </div>

          {/* Player info */}
          <div className="ps_player-info text-center mb-4">
            <h3 className="ps_player-name text-danger fw-bold mb-1">
              {playerName.toUpperCase()}
            </h3>
            {title && <p className="ps_player-title text-primary">{title}</p>}
          </div>

          {/* Performance Chart */}
          {isClient && chartSeries.length > 0 && (
            <div className="ps_chart-container mb-4">
              <LineChart
                id={chartId}
                series={chartSeries}
                colors={chartColors}
                baseColor={chartColors[0]} // Utiliser la première couleur comme base pour le dégradé
                useGradient={true}
                height={300}
                animate={true}
              />
            </div>
          )}

          {/* Stats grid */}
          <div className="ps_stats-grid mb-4">
            <div className="row g-2">
              <div className="col-4">
                <div
                  className="ps_stat-box"
                  style={{ backgroundColor: statColors[0] }}
                >
                  <span className="ps_stat-value ps_xp-value text-white">
                    {experience}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div
                  className="ps_stat-box"
                  style={{ backgroundColor: statColors[1] }}
                >
                  <span className="ps_stat-value ps_points-value text-white">
                    {points}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div
                  className="ps_stat-box"
                  style={{ backgroundColor: statColors[2] }}
                >
                  <span className="ps_stat-value ps_coins-value text-white">
                    {coins}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Win/Loss section */}
          <div className="ps_section-header text-center text-primary mb-3">
            <h5 className="ps_section-title fw-bold">WINS / LOSSES</h5>
          </div>

          {/* Win/Loss Chart */}
          {isClient && winLossSeries.length > 0 && (
            <div className="ps_winloss-chart-container mb-3">
              <LineChart
                id={winLossChartId}
                series={winLossSeries}
                colors={winLossColors}
                baseColor={winLossColors[0]}
                useGradient={true}
                height={300}
                animate={true}
              />
            </div>
          )}

          {/* Win/Loss counters */}
          <div className="ps_winloss-counters d-flex justify-content-center mb-4 gap-2">
            <div
              className="ps_counter ps_wins-counter"
              style={{ backgroundColor: winLossColors[0] }}
            >
              <span className="ps_counter-value text-white fw-bold">
                {wins}
              </span>
            </div>
            <div
              className="ps_counter ps_losses-counter"
              style={{ backgroundColor: winLossColors[1] }}
            >
              <span className="ps_counter-value text-white fw-bold">
                {losses}
              </span>
            </div>
          </div>

          {/* Recent Games avec le nouveau composant LastGames - Rendu côté client uniquement */}
          {isClient && recentGames.length > 0 && (
            <div className="ps_games-table">
              <LastGames
                results={formattedGameResults}
                title="Official WCGF Super Leagues"
                sectionTitle="LAST 3 GAMES SERIE"
                buttonText="VIEW MORE"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
