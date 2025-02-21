"use client";
import React, { useEffect, useState } from "react";

import RankingTable from "./RankingTable";
import RankingChart from "./RankingChart";

// Définition des types
interface ChartPoint {
  name: string;
  value: number;
}

interface ChartSeries {
  name: string;
  data: ChartPoint[];
}

const RankingComponent = () => {
  const [players, setPlayers] = useState([]);
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedGame, setSelectedGame] = useState("tarot");
  const [playerLimit, setPlayerLimit] = useState(3);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rankings?period=${selectedPeriod}&game=${selectedGame}&limit=${playerLimit}`,
        );
        const data = await response.json();
        setPlayers(data.players);

        // Vérifier que l'API renvoie bien un tableau
        if (Array.isArray(data.chartSeries)) {
          setChartSeries(data.chartSeries);
        } else {
          console.error("chartSeries is not an array:", data.chartSeries);
          setChartSeries([]);
        }
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, [selectedPeriod, selectedGame, playerLimit]);

  return (
    <div className="rk-container h-100">
      <div className="card border-0 shadow-sm p-3 d-flex flex-column h-100">
        <div className="bg-light rounded mb-3">
          <div className="d-flex align-items-center gap-3 py-3 px-5">
            <select
              className="form-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>

            <select
              className="form-select"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="tarot">Tarot</option>
              <option value="rummy">Rummy</option>
            </select>

            <select
              className="form-select"
              value={playerLimit}
              onChange={(e) => setPlayerLimit(Number(e.target.value))}
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
            </select>
          </div>
        </div>

        <RankingTable
          players={players}
          title="Official WCGF Super Leagues"
          timer="Best Players"
        />

        <RankingChart
          id={`ranking-chart`}
          series={chartSeries}
          colors={["#0088FE", "#67c1eb", "#FF5252", "#45bfe6"]}
          height={350}
          animate={true}
        />

        <div className="text-center mt-3">
          <button className="btn btn-primary text-white fw-bold">
            {selectedGame.toUpperCase()} RANKINGS
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingComponent;
