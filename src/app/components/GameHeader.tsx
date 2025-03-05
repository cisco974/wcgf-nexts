"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GamePageHeaderProps {
  title: string;
  logo: string;
  activeTab:
    | "home"
    | "rules"
    | "leagues"
    | "tournaments"
    | "rankings"
    | "game"
    | "play";
  backgroundImage?: string;
}

const GamePageHeader: React.FC<GamePageHeaderProps> = ({
  title,
  logo,
  activeTab,
  backgroundImage = "/img/header/header-tarot.jpg",
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={` gh_header ${isSticky ? "gh_sticky" : ""}`}
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('${backgroundImage}') no-repeat top -80px center`,
        backgroundSize: "cover",
      }}
    >
      <div className="container d-flex flex-column align-items-center py-4">
        <Image
          src={logo}
          alt={title}
          width={130}
          height={130}
          className="gh_logo"
          priority
        />
        <h1 className="text-white fw-bold text-center mb-3">{title}</h1>
        <nav className="d-flex gap-3 justify-content-center flex-wrap">
          <Link
            href="/tarot"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "home" ? "gh_active" : ""}`}
          >
            HOME
          </Link>
          <Link
            href="/tarot/rules"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "rules" ? "gh_active" : ""}`}
          >
            RULES
          </Link>
          <Link
            href="/tarot/leagues"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "leagues" ? "gh_active" : ""}`}
          >
            LEAGUES
          </Link>
          <Link
            href="/tarot/tournaments"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "tournaments" ? "gh_active" : ""}`}
          >
            TOURNAMENTS
          </Link>
          <Link
            href="/tarot/rankings"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "rankings" ? "gh_active" : ""}`}
          >
            RANKINGS
          </Link>
          <Link
            href="/tarot/game"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "game" ? "gh_active" : ""}`}
          >
            GAME
          </Link>
          <Link
            href="https://webgl.tradigames.com/?g=tarot"
            className={`text-white text-decoration-none fw-bold px-3 py-2 rounded ${activeTab === "play" ? "gh_active" : ""}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            PLAY
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default GamePageHeader;
