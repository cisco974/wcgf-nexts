"use client";
import { Game, SupportedLocale } from "@/app/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";
import styles from "../styles/MoreGamesSlider.module.scss";
import { getGames } from "@app/actions/games";

// Props interface
interface MoreGamesSliderProps {
  locale: SupportedLocale;
  currentGame: string;
}

const MoreGamesSlider: React.FC<MoreGamesSliderProps> = ({
  locale,
  currentGame,
}) => {
  // État pour les jeux récupérés
  const [games, setGames] = useState<Game[]>([]);
  // État pour l'index du slide actif
  const [activeSlide, setActiveSlide] = useState(0);
  // État de chargement
  const [loading, setLoading] = useState(true);

  // Charger les jeux au montage du composant
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Utiliser l'API Next.js au lieu de Firebase directement
        const games = await getGames();

        setGames(games);
      } catch (error) {
        console.error("Erreur lors du chargement des jeux:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentGame, locale]);

  // Fonction pour gérer la navigation du slider
  const navigateSlider = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveSlide((prev) => (prev > 0 ? prev - 1 : games.length - 1));
    } else {
      setActiveSlide((prev) => (prev < games.length - 1 ? prev + 1 : 0));
    }
  };

  // Afficher un indicateur de chargement
  if (loading && games.length === 0) {
    return (
      <div className="container-fluid bg-light py-3">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si aucun jeu n'est disponible après le chargement
  if (!loading && games.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid bg-light py-5">
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
        {games.length > 1 && (
          <>
            <Button
              variant="primary"
              className={`${styles.gh_nav_button} ${styles.gh_left}`}
              onClick={() => navigateSlider("prev")}
              aria-label="Previous game"
            >
              <span className="fs-4 text-white">&lt;</span>
            </Button>

            <Button
              variant="primary"
              className={`${styles.gh_nav_button} ${styles.gh_right}`}
              onClick={() => navigateSlider("next")}
              aria-label="Next game"
            >
              <span className="fs-4 text-white">&gt;</span>
            </Button>
          </>
        )}

        <div className="row justify-content-center mx-5">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`col-md-4 px-3 ${
                index === activeSlide
                  ? styles["active-slide"]
                  : styles["inactive-slide"]
              }`}
            >
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100">
                <Image
                  src={`/img/store/icon-${game.key}.webp`}
                  alt={game.title}
                  width={120}
                  height={120}
                  className="rounded mb-3"
                />
                <h3 className="text-danger fs-4 fw-bold mb-2">{game.title}</h3>
                <p className="text-muted mb-4">{game.subtitle}</p>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Button
                    size="sm"
                    className={`fw-bold ${styles["play-game-button"]} bg-primary text-white border-0 px-2`}
                  >
                    <i className="fi fi-brands-apple me-1"></i> iOS
                  </Button>
                  <Button
                    size="sm"
                    className={`fw-bold ${styles["play-game-button"]} bg-primary text-white border-0 px-2`}
                  >
                    <i className="fi fi-brands-android me-1"></i> Android
                  </Button>
                  <Button
                    size="sm"
                    className={`fw-bold ${styles["play-game-button"]} bg-primary text-white border-0 px-2`}
                    onClick={() =>
                      window.open(`/${locale}/${game.key}`, "_blank")
                    }
                  >
                    <i className="fi fi-ss-spade me-1"></i> Online
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreGamesSlider;
