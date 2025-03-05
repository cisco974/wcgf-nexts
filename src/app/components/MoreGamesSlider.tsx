"use client";

import React, { useState, useRef } from "react";
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
  const sliderRef = useRef<HTMLDivElement>(null);

  // Données des jeux
  const games: GameDetails[] = [
    {
      id: "tarot",
      title: "Super Tarot",
      description: "The classic French card game of strategy and skill.",
      logo: "/img/store/icon-tarot.jpg",
    },
    {
      id: "rummy",
      title: "Super Rummy",
      description: "Match cards, form sets, and beat your opponents.",
      logo: "/img/store/icon-rummy.jpg",
    },
    {
      id: "scopa",
      title: "Super Scopa",
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
    <div className="mb-5">
      <h2 className="text-center text-danger fw-bold fs-2 mb-3">More Games?</h2>
      <p className="text-center fs-5 text-muted mb-4 w-75 mx-auto">
        Discover and enjoy more exciting games like Tarot, Rummy, and Scopa.
        Play online or on your favorite device now!
      </p>

      <div className="position-relative">
        {/* Bouton navigation gauche */}
        <Button
          variant="primary"
          className="gh_nav_button gh_left"
          onClick={() => navigateSlider("prev")}
          aria-label="Previous game"
        >
          <Image
            src="/img/icons/down-white.png"
            alt="Previous"
            width={20}
            height={20}
            className="gh_arrow_left"
          />
        </Button>

        {/* Container des jeux */}
        <div className="d-flex justify-content-center" ref={sliderRef}>
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`bg-white rounded-4 shadow-sm p-4 text-center mx-2 ${index === activeSlide ? "" : "opacity-50"}`}
              style={{
                width: "320px",
                transition: "opacity 0.3s ease",
                transform: index === activeSlide ? "scale(1.05)" : "scale(1)",
                transformOrigin: "center",
              }}
            >
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
                  className="fw-bold play-game-button  text-white"
                >
                  <i className="fi fi-brands-apple me-1"></i> iOS
                </Button>
                <Button
                  size="sm"
                  className="fw-bold play-game-button text-white"
                >
                  <i className="fi fi-brands-android me-1"></i> Android
                </Button>
                <Button
                  size="sm"
                  className="fw-bold play-game-button text-white"
                >
                  <i className="fi fi-ss-spade me-1"></i> Online
                </Button>
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
          <Image
            src="/img/icons/down-white.png"
            alt="Next"
            width={20}
            height={20}
            className="gh_arrow_right"
          />
        </Button>
      </div>
    </div>
  );
};

export default MoreGamesSlider;
