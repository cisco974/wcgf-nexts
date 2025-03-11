"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Props type
interface MoreGamesSliderProps {
  locale: string;
  currentGame: string;
}

// Define our games
const GAMES = [
  {
    id: "tarot",
    title: "Tarot",
    image: "/img/tarot/thumb.jpg",
  },
  {
    id: "rummy",
    title: "Rummy",
    image: "/img/rummy/thumb.jpg",
  },
  {
    id: "bridge",
    title: "Bridge",
    image: "/img/bridge/thumb.jpg",
  },
];

export default function MoreGamesSlider({
  locale,
  currentGame,
}: MoreGamesSliderProps) {
  // Filter out the current game
  const otherGames = GAMES.filter((game) => game.id !== currentGame);

  return (
    <div className="more-games-section my-5">
      <h2 className="fw-bold mb-4">More Card Games</h2>

      <div className="row">
        {otherGames.map((game) => (
          <div key={game.id} className="col-md-6">
            <Link
              href={`/${locale}/${game.id}`}
              className="text-decoration-none"
            >
              <div className="card mb-4 shadow-sm hover-effect">
                <div className="row g-0">
                  <div className="col-4">
                    <Image
                      src={game.image}
                      alt={game.title}
                      width={150}
                      height={150}
                      className="img-fluid rounded-start"
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <h5 className="card-title">{game.title}</h5>
                      <p className="card-text">
                        Discover the exciting world of {game.title}.
                      </p>
                      <span className="btn btn-sm btn-outline-primary">
                        Learn More
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
