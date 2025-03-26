// app/[locale]/[game]/rankings/page.tsx

import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import { SupportedLocale } from "@/app/types";
import GameService from "@/services/gameService";
import styles from "@styles/Rankings.module.scss";
import SectionHeader from "@app/components/SectionHeader";
import RankingComponent from "@app/components/RankingComponent";
import Image from "next/image";

// Constantes partagées
//const rankingTypes = ["Leagues", "Experience", "Coins"];

// Mock data for ranking categories
const rankingCategories = [
  {
    key: "leagues",
    title: "LEAGUES RANKING",
    players: [
      {
        rank: 1,
        name: "ProGamerX",
        avatar: "/img/avatars/1.png",
        points: 1500,
      },
      {
        rank: 2,
        name: "Legend47",
        avatar: "/img/avatars/2.png",
        points: 1400,
      },
      // ... autres joueurs
    ],
    chartSeries: [
      // ... données de séries
    ],
    chartColors: ["#0088FE", "#67c1eb", "#a0d8f1"],
    resume:
      "Week the top of the Super Tarot game league points table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
  {
    key: "experience",
    title: "EXPERIENCE RANKING",
    players: [
      // ... données des joueurs
    ],
    chartSeries: [
      // ... données de séries
    ],
    chartColors: ["#FF5252", "#f18d5e", "#f5c5a0"],
    resume:
      "Week the top of the Super Tarot game experience points table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
  {
    key: "coins",
    title: "COINS RANKING",
    players: [
      // ... données des joueurs
    ],
    chartSeries: [
      // ... données de séries
    ],
    chartColors: ["#8B4513", "#a57047", "#c4a283"],
    resume:
      "Week the top of the Super Tarot game coins table is dominated by ProGamerX, Legend47 and CardMaster.",
  },
];

// Games data for the slider at the bottom
const games = [
  {
    key: "tarot",
    title: "SUPER TAROT",
    description: "The classic French card game of strategy and skill.",
  },
  {
    key: "rummy",
    title: "SUPER RUMMY",
    description: "Match cards, form sets, and beat your opponents.",
  },
  {
    key: "scopa",
    title: "SUPER SCOPA",
    description: "The famous Italian card game, easy to learn and play.",
  },
];

// Game image paths
const gamePaths = {
  icons: {
    tarot: "/img/store/icon-tarot.webp",
    rummy: "/img/store/icon-rummy.webp",
    scopa: "/img/store/icon-rummy500.webp",
  },
};
type PageParams = Promise<{
  locale: SupportedLocale;
  game: string;
}>;
export async function generateMetadata(props: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale, game } = await props.params;

  try {
    // Récupérer les données de la page
    const pageData = await GameService.getGamePageByLocale(
      game,
      "rankings",
      locale,
    );

    // Si la page n'existe pas, retourner des métadonnées par défaut
    if (!pageData || !pageData.meta) {
      return {
        title: `${game.charAt(0).toUpperCase() + game.slice(1)} Rankings | WCGF`,
        description:
          "Explore the latest rankings on WCGF, highlighting top players' League Points, Experience Points, and Coins.",
      };
    }

    // Les métadonnées sont déjà dans la langue actuelle ou avec fallback
    const meta = pageData.meta;

    // Retourner les métadonnées formatées
    return {
      title:
        meta.title ||
        `${game.charAt(0).toUpperCase() + game.slice(1)} Rankings | WCGF`,
      description:
        meta.description ||
        "Explore the latest rankings on WCGF, highlighting top players' League Points, Experience Points, and Coins.",
      keywords:
        meta.keywords || "rankings, leaderboard, competition, players, WCGF",
      openGraph: {
        title: meta.og_title || meta.title || "",
        description: meta.og_description || meta.description || "",
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${game.charAt(0).toUpperCase() + game.slice(1)} Rankings | WCGF`,
      description:
        "Explore the latest rankings on WCGF, highlighting top players' League Points, Experience Points, and Coins.",
    };
  }
}

export default async function RankingsPage(props: { params: PageParams }) {
  const { locale, game } = await props.params;

  // Récupérer les données de la page
  const pageData = await GameService.getGamePageByLocale(
    game,
    "rankings",
    locale,
  );

  // Si la page n'existe pas, afficher une page 404 personnalisée
  if (!pageData || !pageData.content) {
    return notFound();
  }

  // Le contenu est déjà dans la langue actuelle ou avec fallback
  const content = pageData.content;

  // Titre de la page
  const pageTitle =
    content.page_header?.title || `WCGF ${game.toUpperCase()} RANKINGS`;

  return (
    <>
      <PageHeader
        type="game"
        background={`/img/header/header-${game}.jpg`}
        title={pageTitle}
        logo={`/img/${game}/logo.png`}
        activeTab="rankings"
        gamePath={`/${locale}/${game}`}
      />
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            {content.introduction && (
              <SectionHeader
                title={content.introduction?.title}
                subtitle={content.introduction.text}
              />
            )}

            <div className="row g-4">
              {rankingCategories.map((category) => (
                <div className="col-12 col-md-4" key={category.key}>
                  <RankingComponent></RankingComponent>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More Games Section */}
        <div className="my-5 text-center">
          <h2 className={styles.moreGamesTitle}>MORE GAMES?</h2>
          <p className={styles.moreGamesSubtitle}>
            Discover and enjoy more exciting games like Tarot, Rummy,
            <br />
            and Scopa. Play online or on your favorite device now!
          </p>

          <div className="row g-4 mt-4">
            <div className="col-1">
              <button className="btn btn-primary h-100 d-flex align-items-center justify-content-center">
                <i className="fi fi-sr-angle-left"></i>
              </button>
            </div>
            {games.map((gameItem) => (
              <div className="col-10 col-md-3" key={gameItem.key}>
                <div className={styles.gameCard}>
                  <div className={styles.gameIcon}>
                    <Image
                      src={
                        gamePaths.icons[
                          gameItem.key as keyof typeof gamePaths.icons
                        ]
                      }
                      alt={gameItem.title}
                      className="img-fluid"
                      width={40}
                      height={60}
                    />
                  </div>
                  <h3 className={styles.gameTitle}>{gameItem.title}</h3>
                  <p className={styles.gameDescription}>
                    {gameItem.description}
                  </p>
                  <div className={styles.platformButtons}>
                    <button className="btn btn-light btn-sm">
                      <i className="fi fi-brands-apple me-1"></i> iOS
                    </button>
                    <button className="btn btn-light btn-sm">
                      <i className="fi fi-brands-android me-1"></i> Android
                    </button>
                    <button className="btn btn-light btn-sm">
                      <i className="fi fi-ss-spade me-1"></i> Online
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-1">
              <button className="btn btn-primary h-100 d-flex align-items-center justify-content-center">
                <i className="fi fi-sr-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
