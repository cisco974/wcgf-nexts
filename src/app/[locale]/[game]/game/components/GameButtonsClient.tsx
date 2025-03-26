"use client";
// app/[locale]/[game]/game/components/GameButtonsClient.tsx

import React from "react";

interface Platform {
  name: string;
  icon: string;
  class: string;
}

interface GameButtonsClientProps {
  platforms: Platform[];
  game: string;
}

const GameButtonsClient: React.FC<GameButtonsClientProps> = ({
  platforms,
  game,
}) => {
  return (
    <div className="game-buttons-container">
      {platforms.map((platform, index) => (
        <button
          key={index}
          className="btn btn-primary me-2 text-light fw-bold"
          onClick={() => console.log(`Play ${game} on ${platform.name}`)}
        >
          {`Play ${game} on ${platform.name}`}
        </button>
      ))}
    </div>
  );
};

export default GameButtonsClient;
