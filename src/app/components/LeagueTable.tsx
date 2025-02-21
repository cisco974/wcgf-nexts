import React from "react";
import Image from "next/image";

type League = {
  value: number;
  name: string;
};

type Player = {
  rank: number;
  name: string;
  avatar: string;
  points: number;
};

type LeagueTableProps = {
  title: string;
  logo: string;

  leagues: League[];
  divisions: League[];
  players: Player[];
};

const LeagueTable: React.FC<LeagueTableProps> = ({
  title,
  logo,

  leagues = [],
  divisions = [],
  players = [],
}) => {
  return (
    <div className="league-table-container">
      <div className="card border-0 shadow-sm p-3">
        <div className="card-header bg-white border-0 p-0 pb-4">
          <div className="lt-logo-container gap-3 py-2">
            <Image
              src="/img/logos/super-leagues-en.webp"
              alt="League Logo"
              className="lt-league-logo"
              width={150}
              height={50}
            />
            <Image
              src={logo}
              alt="League Logo"
              className="lt-league-icon"
              width={70}
              height={80}
            />
          </div>
        </div>

        <div className="bg-light rounded mb-3">
          <div className="d-flex align-items-center gap-3 py-3 px-5">
            <select className="form-select">
              {leagues.map((league) => (
                <option key={league.value} value={league.value}>
                  {league.name}
                </option>
              ))}
            </select>

            <select className="form-select">
              {divisions.map((division) => (
                <option key={division.value} value={division.value}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ranking table component */}
        <div className="table-responsive">
          {/* Timer header */}
          <div className="lt-timer py-2 fs-5">End in 3 days and 8 hours</div>

          {/* Ranking table */}
          <div className="lt-table-container">
            <table className="lt-table table mb-0">
              <tbody>
                {players.map((player) => (
                  <tr key={player.rank} className="lt-row">
                    <td className="lt-rank">
                      <div className="lt-rank-number">{player.rank}</div>
                    </td>
                    <td className="lt-avatar">
                      <Image
                        src={player.avatar}
                        alt={`${player.name}'s avatar`}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="fs-5">{player.name}</td>
                    <td className="lt-points">
                      <span className="p-2 fs-5 fw-bold rounded">
                        {player.points} PTS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lt-footer">Official WCGF Super Leagues</div>
        </div>

        <p className="text-center mt-3 fs-5">
          In league 1｜Division 1, {players[0]?.name}, {players[1]?.name}, and{" "}
          {players[2]?.name} are the current leaders on {title}.
        </p>

        <div className="text-center mt-3">
          <button className="btn btn-primary text-white fw-bold">
            {title.toUpperCase()} LEAGUES
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeagueTable;
