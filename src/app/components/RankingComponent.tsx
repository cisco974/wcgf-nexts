"use client";
import React, { useEffect, useState } from "react";

import RankingTable from "./RankingTable";
import LineChart from "./LineChart";

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
  const [playerLimit] = useState(3);

  // Définition des couleurs de base selon le type de classement
  const baseColors = {
    week: "#0088FE", // Bleu pour la semaine (comme sur l'image 1)
    month: "#FF5252", // Rouge pour le mois (comme sur l'image 2)
    year: "#8B4513", // Marron pour l'année (comme dans les données d'origine)
  };

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

  // Obtenir la couleur de base en fonction de la période sélectionnée
  const getBaseColor = () => {
    return baseColors[selectedPeriod as keyof typeof baseColors] || "#0088FE";
  };

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
          </div>
        </div>

        <RankingTable
          players={players}
          title="Official WCGF Super Leagues"
          timer="Best Players"
        />

        <LineChart
          id={`ranking-chart-${selectedPeriod}`}
          series={chartSeries}
          baseColor={getBaseColor()}
          useGradient={true}
          height={350}
          animate={true}
        />

        <div className="text-center mt-3">
          <button
            className="btn btn-primary text-white fw-bold"
            style={{
              backgroundColor: getBaseColor(),
              borderColor: getBaseColor(),
            }}
          >
            {selectedGame.toUpperCase()} RANKINGS
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingComponent;
