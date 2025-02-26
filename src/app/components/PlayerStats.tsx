import React from "react";
import Image from "next/image";
import LineChart from "./LineChart";

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
  chartSeries: ChartSeries[]; // ✅ Remplace any[]
  chartColors: string[];
  winLossSeries: ChartSeries[]; // ✅ Remplace any[]
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
  // Generate unique chart IDs
  const chartId = `player-stats-chart-${playerName.replace(/\s+/g, "-").toLowerCase()}`;
  const winLossChartId = `player-winloss-chart-${playerName.replace(/\s+/g, "-").toLowerCase()}`;

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
                src="/img/bg-table.jpg"
                alt="Background"
                width={600}
                height={120}
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
          {chartSeries.length > 0 && (
            <div className="ps_chart-container mb-4">
              <LineChart
                id={chartId}
                series={chartSeries}
                colors={chartColors}
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
          {winLossSeries.length > 0 && (
            <div className="ps_winloss-chart-container mb-3">
              <LineChart
                id={winLossChartId}
                series={winLossSeries}
                colors={winLossColors}
                height={180}
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

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div className="ps_games-table bg-light rounded p-3">
              <h6 className="text-center mb-3">Recent Games</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <tbody>
                    {recentGames.map((game, index) => (
                      <tr key={index}>
                        <td className="ps_game-type">{game.type}</td>
                        <td
                          className={`ps_game-result ${game.result > 0 ? "text-success" : "text-danger"}`}
                        >
                          {game.result > 0 ? "Win" : "Loss"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
