"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/PageHeader.module.scss";

// Types
type Event = {
  title: string;
  subtitle: string;
  icon: string;
  month: string;
  day: string;
  buyin: string;
};

type GameTab =
  | "home"
  | "rules"
  | "leagues"
  | "tournaments"
  | "rankings"
  | "game"
  | "play";

type PageHeaderProps = {
  type?: "home" | "game" | "base";
  events?: Event[];
  background?: string;
  title?: string;
  logo?: string;
  activeTab?: GameTab;
  gamePath?: string; // Chemin de base pour les liens du jeu (ex: "/tarot")
};

const PageHeader: React.FC<PageHeaderProps> = ({
  type = "home",
  events = [],
  background = "/img/header.jpg",
  title = "",
  logo = "",
  activeTab = "home",
  gamePath = "/game",
}) => {
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const fixPartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // État pour stocker l'URL optimisée de l'image d'arrière-plan
  const [bgImageUrl, setBgImageUrl] = useState<string>("");
  // État pour gérer l'affichage pendant le chargement de l'image

  useEffect(() => {
    // Création d'une URL optimisée pour l'image d'arrière-plan
    // Utilise l'API Next.js Image pour l'optimisation
    const width = window.innerWidth;
    // Réduire la taille pour les appareils mobiles
    const optimizedWidth = width < 768 ? Math.min(width, 640) : width;
    const quality = width < 768 ? 60 : 80; // Qualité plus basse sur mobile pour un chargement plus rapide
    const optimizedBgUrl = `/_next/image?url=${encodeURIComponent(background)}&w=${optimizedWidth}&q=${quality}`;

    // Utiliser l'URL optimisée directement dans un environnement Next.js/React
    // L'approche avec new Image() ne fonctionne pas correctement dans cet environnement
    setBgImageUrl(optimizedBgUrl);
  }, [background]);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeader = pageHeaderRef.current;
      const fixPart = fixPartRef.current;
      const navbar = document.querySelector(".main-nav");

      if (!pageHeader || !fixPart || !navbar) {
        console.warn("Required elements not found");
        return;
      }

      const navbarHeight = navbar.clientHeight;
      const pageHeaderHeight = pageHeader.clientHeight;
      const fixPartInitialHeight = fixPart.clientHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > navbarHeight) {
        console.log("navbarHeight", navbarHeight);
        pageHeader.classList.add("sticky");
        pageHeader.style.top = `-${pageHeaderHeight - fixPartInitialHeight - navbarHeight - 20}px`;
      } else {
        pageHeader.classList.remove("sticky");
        pageHeader.style.top = "";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollEvents = (direction: number) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Style d'arrière-plan commun avec l'URL optimisée - propriétés séparées pour éviter les conflits
  const headerStyle = {
    backgroundImage: bgImageUrl
      ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${bgImageUrl}')`
      : undefined,

    backgroundPosition: "top -80px center",
    backgroundSize: "cover",
  };

  // Commenté pour éviter l'avertissement ESLint sur les variables non utilisées
  /* Méthode alternative : utiliser une div avec Image pour l'arrière-plan
  const BackgroundImage = () => (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 1 }} />
      <Image
        src={background}
        alt="Background"
        fill
        quality={80}
        priority
        style={{ objectFit: "cover", objectPosition: "center -80px" }}
      />
    </div>
  );
  */

  // Rendu pour l'en-tête de type "home"
  if (type === "home") {
    return (
      <header
        className={`${styles["page-header"]} z-2`}
        ref={pageHeaderRef}
        style={headerStyle}
      >
        {/* Décommentez la ligne suivante et commentez le style headerStyle ci-dessus
           pour utiliser l'approche Image comme arrière-plan */}
        {/* Alternative: Décommenter si vous préférez utiliser la technique du composant Image:
        <BackgroundImage />
        */}
        <div className="container py-5 pb-2">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="text-white fw-bold mb-3 fs-2">
                WORLD CARD GAMES FEDERATION
              </h2>
              <p className="text-white fs-3 my-4">
                Welcome to WCGF.com, our Hub for Competitive Card Games
                <br />
                Discover leagues, tournaments and rankings
              </p>
            </div>
            <div className="row fix-part" ref={fixPartRef}>
              {events.length > 0 && (
                <div className="col-12 container">
                  <div
                    className={`${styles["tournament-carousel"]} mx-4 d-flex align-items-center`}
                  >
                    <button
                      className={`my-2 btn btn-primary ${styles.carouselButton} ${styles.prev} z-3`}
                      type="button"
                      onClick={() => scrollEvents(-1)}
                    >
                      <Image
                        src="/img/icons/down-white.webp"
                        width={40}
                        height={26}
                        alt="<"
                      />
                    </button>

                    <div
                      className={`${styles["tournament-cards-container"]} text-uppercase gap-2 d-flex flex-nowrap overflow-auto`}
                      ref={containerRef}
                    >
                      {events.map((event, index) => (
                        <div
                          className={`${styles["tournament-card"]} flex-shrink-0`}
                          key={index}
                        >
                          <div
                            className={`${styles.date} fw-bold d-flex flex-column justify-content-center align-items-center rounded`}
                          >
                            <small className="fs-7 lh-1">{event.month}</small>
                            <span className="fs-4 lh-1">{event.day}</span>
                          </div>

                          <div className="pt-0">
                            <div className="text-danger fw-bold fs-5 lh-1">
                              {event.title}
                            </div>
                            <div
                              className={`${styles.players} text-capitalize lh-1`}
                            >
                              {event.subtitle}
                            </div>
                            <span
                              className={`${styles.points} rounded-pill lh-1`}
                            >
                              {event.buyin}
                            </span>
                          </div>

                          <Image
                            src={event.icon}
                            alt={event.title}
                            width={54}
                            height={54}
                            className={`${styles["game-icon"]} d-flex flex-column justify-content-center align-items-center rounded`}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      className={`btn btn-primary ${styles.carouselButton} ${styles.next}`}
                      type="button"
                      onClick={() => scrollEvents(1)}
                    >
                      <Image
                        src="/img/icons/down-white.webp"
                        width={40}
                        height={26}
                        alt=">"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Rendu pour l'en-tête de type "game"
  if (type === "game") {
    return (
      <header
        className={`${styles["page-header"]} z-2`}
        ref={pageHeaderRef}
        style={headerStyle}
      >
        {/* <BackgroundImage /> */}
        <div className="container d-flex flex-column align-items-center py-4 py-5 pb-2">
          <Image
            src={logo}
            alt={title}
            width={130}
            height={130}
            className="gh_logo"
            priority
          />
          <h1 className="text-white fw-bold text-center mb-3">{title}</h1>
          <div className="row fix-part" ref={fixPartRef}>
            <nav className="d-flex gap-3 justify-content-center flex-wrap fix-part">
              <Link
                href={`${gamePath}`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "home" ? styles.gh_active : ""
                }`}
              >
                HOME
              </Link>
              <Link
                href={`${gamePath}/rules`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "rules" ? styles.gh_active : ""
                }`}
              >
                RULES
              </Link>
              <Link
                href={`${gamePath}/leagues`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "leagues" ? styles.gh_active : ""
                }`}
              >
                LEAGUES
              </Link>
              <Link
                href={`${gamePath}/tournaments`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "tournaments" ? styles.gh_active : ""
                }`}
              >
                TOURNAMENTS
              </Link>
              <Link
                href={`${gamePath}/rankings`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "rankings" ? styles.gh_active : ""
                }`}
              >
                RANKINGS
              </Link>
              <Link
                href={`${gamePath}/game`}
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "game" ? styles.gh_active : ""
                }`}
              >
                GAME
              </Link>
              <Link
                href="https://webgl.tradigames.com/?g=tarot"
                className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${
                  activeTab === "play" ? styles.gh_active : ""
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                PLAY
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Rendu pour l'en-tête de type "base" (par défaut pour tout autre type)
  return (
    <header
      className={`${styles.pageHeader} z-2`}
      ref={pageHeaderRef}
      style={headerStyle}
    >
      {/* <BackgroundImage /> */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="text-white fw-bold">{title || "TITLE BASE"}</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
