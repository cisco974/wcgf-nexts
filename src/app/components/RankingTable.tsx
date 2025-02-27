import React from "react";
import Image from "next/image";

// Types de base
type Player = {
  rank: number;
  name: string;
  avatar: string;
  points?: number;
};

// Type étendu pour les derniers jeux
type GameResult = Player & {
  gameTitle?: string;
  result?: number;
};

type RankingTableProps = {
  players: Player[] | GameResult[];
  title?: string;
  timer?: string;
  type?: "ranking" | "games";
  buttonText?: string;
  onButtonClick?: () => void;
  headerBgColor?: string;
};

const RankingTable: React.FC<RankingTableProps> = ({
  players = [],
  title = "Official WCGF Super Leagues",
  timer = "End in 3 days and 8 hours",
  type = "ranking",
  buttonText,
  onButtonClick,
  headerBgColor = "#007bff",
}) => {
  return (
    <div className="table-responsive lt-ranking-container">
      {/* Timer header */}
      <div
        className="lt-timer py-2 fs-5"
        style={{ backgroundColor: headerBgColor }}
      >
        {timer}
      </div>

      {/* Ranking table */}
      <div className="lt-table-container">
        <table className="lt-table table mb-0">
          <tbody>
            {players.map((player, index) => {
              // Cast en GameResult pour accéder aux propriétés spécifiques
              const gamePlayer = player as GameResult;
              const isPositive = gamePlayer.result && gamePlayer.result > 0;
              const isNegative = gamePlayer.result && gamePlayer.result < 0;

              return (
                <tr key={index} className="lt-row">
                  <td className="lt-rank">
                    <div className="lt-rank-number">{player.rank}</div>
                  </td>
                  <td className="lt-avatar">
                    <Image
                      src={player.avatar}
                      alt={player.name}
                      width={40}
                      height={40}
                      className="lt-avatar-img"
                    />
                  </td>

                  {type === "ranking" ? (
                    // Affichage standard pour le classement
                    <>
                      <td className="fs-5">{player.name}</td>
                      <td className="lt-points">
                        <span className="p-2 fs-5 fw-bold rounded">
                          {player.points} PTS
                        </span>
                      </td>
                    </>
                  ) : (
                    // Affichage pour les derniers jeux
                    <>
                      <td className="fs-5 fw-semibold">
                        {gamePlayer.gameTitle}
                      </td>
                      <td className="lt-points">
                        <span
                          className={`p-2 fs-5 fw-bold rounded lt-result ${isPositive ? "lt-positive" : ""} ${isNegative ? "lt-negative" : ""}`}
                        >
                          {isPositive ? "+ " : ""}
                          {gamePlayer.result}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lt-footer">{title}</div>

      {/* Button (optional) */}
      {buttonText && (
        <div className="text-center mt-3">
          <button
            className="btn btn-primary text-light fw-bold view-more-btn"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default RankingTable;
