"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";

// Types
interface GameDetails {
  id: string;
  title: string;
  description: string;
  logo: string;
}

const MoreGamesSlider: React.FC = () => {
  // État pour l'index du slide actif
  const [activeSlide, setActiveSlide] = useState(1); // Commencer par le milieu

  // Données des jeux
  const games: GameDetails[] = [
    {
      id: "tarot",
      title: "SUPER TAROT",
      description: "The classic French card game of strategy and skill.",
      logo: "/img/store/icon-tarot.jpg",
    },
    {
      id: "rummy",
      title: "SUPER RUMMY",
      description: "Match cards, form sets, and beat your opponents.",
      logo: "/img/store/icon-rummy.jpg",
    },
    {
      id: "scopa",
      title: "SUPER SCOPA",
      description: "The famous Italian card game, easy to learn and play.",
      logo: "/img/store/icon-scopa.jpg",
    },
  ];

  // Fonction pour gérer la navigation du slider
  const navigateSlider = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveSlide((prev) => (prev > 0 ? prev - 1 : games.length - 1));
    } else {
      setActiveSlide((prev) => (prev < games.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="container-fluid  bg-light">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2 className="text-danger fw-bold fs-2 mb-3">MORE GAMES?</h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "800px" }}>
            Discover and enjoy more exciting games like Tarot, Rummy,
            <br />
            and Scopa. Play online or on your favorite device now!
          </p>
        </div>
      </div>

      <div className="position-relative">
        {/* Bouton navigation gauche */}
        <Button
          variant="primary"
          className="gh_nav_button gh_left"
          onClick={() => navigateSlider("prev")}
          aria-label="Previous game"
        >
          <span className="fs-4 text-white">&lt;</span>
        </Button>

        {/* Container des jeux */}
        <div className="row justify-content-center mx-5">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`col-md-4 px-3 ${
                index === activeSlide ? "active-slide" : "inactive-slide"
              }`}
            >
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100">
                <Image
                  src={game.logo}
                  alt={game.title}
                  width={120}
                  height={120}
                  className="rounded mb-3"
                />
                <h3 className="text-danger fs-4 fw-bold mb-2">{game.title}</h3>
                <p className="text-muted mb-4">{game.description}</p>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Button
                    size="sm"
                    className="fw-bold play-game-button bg-primary text-white border-0 px-2"
                  >
                    <i className="fi fi-brands-apple me-1"></i> iOS
                  </Button>
                  <Button
                    size="sm"
                    className="fw-bold play-game-button bg-primary text-white border-0 px-2"
                  >
                    <i className="fi fi-brands-android me-1"></i> Android
                  </Button>
                  <Button
                    size="sm"
                    className="fw-bold play-game-button bg-primary text-white border-0 px-2"
                  >
                    <i className="fi fi-ss-spade me-1"></i> Online
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton navigation droite */}
        <Button
          variant="primary"
          className="gh_nav_button gh_right"
          onClick={() => navigateSlider("next")}
          aria-label="Next game"
        >
          <span className="fs-4 text-white">&gt;</span>
        </Button>
      </div>
    </div>
  );
};

export default MoreGamesSlider;
