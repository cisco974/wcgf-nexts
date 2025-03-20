// app/[locale]/[game]/leagues/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GameService from "@services/gameService";
import PageHeader from "@app/components/PageHeader";
import { Player, SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";
import Link from "next/link";
import CtaBox from "@app/components/CtaBox";
import styles from "@styles/LeagueRankings.module.scss";
import SectionContent from "@app/components/SectionContentPage";
import SectionHeader from "@app/components/SectionHeader";
import React from "react";

// Types pour les paramètres de la page
type PageParams = Promise<{
  locale: SupportedLocale;
  game: string;
}>;

// Revalidation toutes les heures
export const revalidate = 3600;

// Génération des métadonnées dynamiques
export async function generateMetadata(props: {
  params: PageParams;
}): Promise<Metadata> {
  // Attendre la résolution de la promesse params
  const params = await props.params;
  const { locale, game } = params;

  try {
    // Récupérer les données de la page
    const pageData = await GameService.getGamePageByLocale(
      game,
      "leagues",
      locale,
    );

    // Si la page n'existe pas, retourner des métadonnées par défaut
    if (!pageData || !pageData.meta) {
      return {
        title: `${game.charAt(0).toUpperCase() + game.slice(1)} League Rankings | WCGF`,
        description:
          "Explore the official league rankings, check the top players, and compete to climb the ladder.",
      };
    }

    // Les métadonnées sont déjà dans la langue actuelle ou avec fallback
    const meta = pageData.meta;

    // Retourner les métadonnées formatées
    return {
      title:
        meta.title ||
        `${game.charAt(0).toUpperCase() + game.slice(1)} League Rankings | WCGF`,
      description:
        meta.description ||
        "Explore the official league rankings, check the top players, and compete to climb the ladder.",
      keywords:
        meta.keywords ||
        "rankings, league, players, competition, official, WCGF",
      openGraph: {
        title: meta.og_title || meta.title || "",
        description: meta.og_description || meta.description || "",
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${game.charAt(0).toUpperCase() + game.slice(1)} League Rankings | WCGF`,
      description:
        "Explore the official league rankings, check the top players, and compete to climb the ladder.",
    };
  }
}

// Options pour les ligues et divisions
const leagueOptions = [
  { value: "1", label: "League 1" },
  { value: "2", label: "League 2" },
  { value: "3", label: "League 3" },
];

const divisionOptions = [
  { value: "1", label: "Division 1" },
  { value: "2", label: "Division 2" },
  { value: "3", label: "Division 3" },
];

// Fonction pour obtenir un indicateur victoire/défaite
const getStatusIndicator = (isWin: boolean) => {
  return isWin ? (
    <span
      className="bg-success text-white d-inline-block rounded-circle text-center"
      style={{ width: "24px", height: "24px", lineHeight: "24px" }}
    >
      V
    </span>
  ) : (
    <span
      className="bg-danger text-white d-inline-block rounded-circle text-center"
      style={{ width: "24px", height: "24px", lineHeight: "24px" }}
    >
      L
    </span>
  );
};

// Fonction pour obtenir les indicateurs de forme (3 derniers matchs)
const getPlayerForm = (player: Player) => {
  // Simuler les résultats des 3 derniers matchs en fonction du rang
  if (player.rank <= 5) {
    return (
      <div className="d-flex gap-1">
        {getStatusIndicator(true)}
        {getStatusIndicator(true)}
        {getStatusIndicator(player.rank > 2)}
      </div>
    );
  } else if (player.rank <= 15) {
    return (
      <div className="d-flex gap-1">
        {getStatusIndicator(player.rank % 2 === 0)}
        {getStatusIndicator(true)}
        {getStatusIndicator(player.rank % 3 === 0)}
      </div>
    );
  } else {
    return (
      <div className="d-flex gap-1">
        {getStatusIndicator(false)}
        {getStatusIndicator(player.rank % 5 === 0)}
        {getStatusIndicator(false)}
      </div>
    );
  }
};

// Composant principal de la page
export default async function LeagueRankingsPage(props: {
  params: PageParams;
}) {
  // Attendre la résolution de la promesse params
  const params = await props.params;
  const { locale, game } = params;

  try {
    if (!locale || !game) {
      console.error("Params are missing or undefined.");
      return notFound();
    }

    // Récupérer les données de la page
    const pageData = await GameService.getGamePageLeaguesByLocale(
      game,
      "leagues",
      locale,
    );

    // Récupérer les données des classements
    const rankingData = await GameService.getLeagueRankings(game);

    // Si la page n'existe pas ou si les classements n'existent pas, afficher une page 404 personnalisée
    if (!pageData || !pageData.content || !rankingData) {
      return notFound();
    }

    // Le contenu est déjà dans la langue actuelle ou avec fallback
    const content = pageData.content;

    // Sections de mise en évidence
    const highlightSections = content.highlight_sections || [
      {
        title: "The Leaders of League 1, Division 1",
        text: "At the top of the leaderboard, <strong>ProGamerX</strong>, <strong>Legend247</strong>, and <strong>CardMaster</strong> are showing unmatched skill and determination. With ProGamerX leading at 1500 PTS, they are securing their positions to move up to <strong>League 2</strong> at the end of the season this Sunday at midnight. These players have consistently outperformed their competitors, setting the stage for a well-deserved promotion. Will they continue their dominance in the higher league? Only time will tell.",
      },
      {
        title: "The Middle of the Pack",
        text: "The mid-table competition is heating up as <strong>PlayerOne</strong>, <strong>RandomHero</strong>, and <strong>RiskTaker</strong> hold steady with scores above 1100 PTS. While they are safe from relegation, their ascent into the top spots still hangs by a thread. Meanwhile, players like <strong>CardShark</strong> and <strong>LuckyDraw</strong> must step up their game to avoid falling into the danger zone. The fight for a stronger position remains fierce, and every match counts for these contenders.",
      },
      {
        title: "The Fight to Avoid Relegation",
        text: "At the bottom of the table, <strong>SlowPlay</strong>, <strong>LastStand</strong>, and <strong>OutOfLuck</strong> face the tough reality of relegation to <strong>Division 2</strong>. With scores under 1000 PTS, these players will need to rally their strength and make a comeback in their final matches. As challenging as the climb may be, resilience and focus could help them turn the tide. Keep going, champions—your next victory might be closer than you think!",
      },
    ];

    // Données filtrées par zone
    const zonePromotion = rankingData.slice(0, 10);
    const zoneMaintien = rankingData.slice(
      10,
      rankingData.length >= 20 ? 20 : rankingData.length,
    );
    const zoneRelegation = rankingData.slice(
      rankingData.length >= 20 ? 20 : rankingData.length,
      rankingData.length >= 30 ? 30 : rankingData.length,
    );

    // Titre de la page
    const pageTitle =
      content.page_header?.title ||
      `WELCOME TO THE OFFICIAL SUPER ${game.toUpperCase()} LEAGUE RANKINGS!`;

    // Rendu de la page
    return (
      <>
        <PageHeader
          type="game"
          background={`/img/header/header-${game}.jpg`}
          title={pageTitle}
          logo={`/img/${game}/logo.png`}
          activeTab="leagues"
          gamePath={`/${locale}/${game}`}
        />

        <div className="container my-5">
          <div className="row">
            <div className="col-lg-9">
              {/* Introduction */}
              <div className="bg-light p-4 rounded-4 mb-4">
                <p>
                  Here, you can explore the latest{" "}
                  <span className="text-primary fw-bold">league rankings</span>,
                  learn the{" "}
                  <Link
                    href={`/${locale}/${game}/rules`}
                    className="text-primary fw-bold"
                  >
                    rules of {game}
                  </Link>
                  , join exciting{" "}
                  <Link
                    href={`/${locale}/${game}/tournaments`}
                    className="text-primary fw-bold"
                  >
                    tournaments
                  </Link>
                  , and connect with other players in{" "}
                  <Link
                    href={`/${locale}/${game}/clubs`}
                    className="text-primary fw-bold"
                  >
                    clubs
                  </Link>
                  . Stay updated with our blog for news and updates on all games
                  available on WCGF! Join leagues to test your skills, earn
                  rewards, and compete against the best players worldwide!
                </p>
              </div>

              {/* Search and filters */}
              <div
                className={`${styles.filterBox} bg-white p-3 rounded-4 mb-4 shadow-sm`}
              >
                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="SEARCH FOR A PLAYER BY USERNAME OR ID..."
                      />
                      <button className="btn btn-danger" type="button">
                        SEARCH
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex gap-2 align-items-center justify-content-end">
                    <select
                      className="form-select form-select-sm w-auto"
                      defaultValue="1"
                    >
                      {leagueOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-select form-select-sm w-auto"
                      defaultValue="1"
                    >
                      {divisionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-primary btn-sm">VIEW</button>
                  </div>
                </div>
              </div>

              {/* League Header */}
              <div
                className={`${styles.leagueHeader} d-flex align-items-center mb-2 p-2 rounded-3`}
              >
                <div className={styles.leagueIcon}>1</div>
                <div className={styles.leagueName}>LEAGUE 1</div>
              </div>

              {/* Rankings Table - Zone de Promotion */}
              <div className={`${styles.rankingTable} mb-4`}>
                <div
                  className={`${styles.zoneHeader} bg-success text-white p-2 text-center`}
                >
                  ZONE DE PROMOTION
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Form</th>
                        <th>Level</th>
                        <th>Points</th>
                        <th className="text-end">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zonePromotion.map((player: Player) => (
                        <tr key={player.rank} className={styles.playerRow}>
                          <td className="align-middle">{player.rank}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="rounded-circle me-2"
                                width="36"
                                height="36"
                              />
                              <span>{player.name}</span>
                            </div>
                          </td>
                          <td className="align-middle">
                            {getPlayerForm(player)}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`${styles.levelBadge} bg-warning text-white px-2 py-1 rounded`}
                            >
                              Level {player.level}
                            </span>
                          </td>
                          <td className="align-middle">{player.points}</td>
                          <td
                            className={`${styles.pointsColumn} text-danger fw-bold align-middle text-end`}
                          >
                            {player.pts} PTS
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rankings Table - Zone de Maintien */}
              <div className={`${styles.rankingTable} mb-4`}>
                <div
                  className={`${styles.zoneHeader} bg-primary text-white p-2 text-center`}
                >
                  ZONE DE MAINTIEN
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Form</th>
                        <th>Level</th>
                        <th>Points</th>
                        <th className="text-end">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zoneMaintien.map((player: Player) => (
                        <tr key={player.rank} className={styles.playerRow}>
                          <td className="align-middle">{player.rank}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="rounded-circle me-2"
                                width="36"
                                height="36"
                              />
                              <span>{player.name}</span>
                            </div>
                          </td>
                          <td className="align-middle">
                            {getPlayerForm(player)}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`${styles.levelBadge} bg-warning text-white px-2 py-1 rounded`}
                            >
                              Level {player.level}
                            </span>
                          </td>
                          <td className="align-middle">{player.points}</td>
                          <td
                            className={`${styles.pointsColumn} text-danger fw-bold align-middle text-end`}
                          >
                            {player.pts} PTS
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rankings Table - Zone de Relégation */}
              <div className={`${styles.rankingTable} mb-5`}>
                <div
                  className={`${styles.zoneHeader} bg-danger text-white p-2 text-center`}
                >
                  ZONE DE RELÉGATION
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Form</th>
                        <th>Level</th>
                        <th>Points</th>
                        <th className="text-end">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zoneRelegation.map((player: Player) => (
                        <tr key={player.rank} className={styles.playerRow}>
                          <td className="align-middle">{player.rank}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="rounded-circle me-2"
                                width="36"
                                height="36"
                              />
                              <span>{player.name}</span>
                            </div>
                          </td>
                          <td className="align-middle">
                            {getPlayerForm(player)}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`${styles.levelBadge} bg-warning text-white px-2 py-1 rounded`}
                            >
                              Level {player.level}
                            </span>
                          </td>
                          <td className="align-middle">{player.points}</td>
                          <td
                            className={`${styles.pointsColumn} text-danger fw-bold align-middle text-end`}
                          >
                            {player.pts} PTS
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-light p-2 text-center">
                  <small>
                    This is the official ranking of the WCGF Super{" "}
                    {game.charAt(0).toUpperCase() + game.slice(1)} League.
                  </small>
                  <img
                    src="/img/wcgf-logo.png"
                    alt="WCGF"
                    height="20"
                    className="ms-2"
                  />
                </div>
              </div>

              {/* League Rankings and Player Highlights */}
              <SectionHeader title="LEAGUE RANKINGS AND PLAYER HIGHLIGHTS" />

              {/* Player Highlight Sections */}
              {highlightSections.map((section, index) => (
                <SectionContent
                  key={`highlight-${index}`}
                  section={section}
                  locale={locale}
                  game={game}
                  headingTag={"h3"}
                  className="mb-4"
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-lg-3">
              {/* Game Promotion */}
              <div className="mb-4">
                <img
                  src={`/img/${game}/promo.jpg`}
                  alt={`${game} Game Play`}
                  className="img-fluid rounded-4 shadow-sm"
                />
              </div>

              {/* CTA Box */}
              <CtaBox
                game={game}
                sidebarContent={
                  content.sidebar || {
                    cta_title: `PLAY ${game.toUpperCase()} ONLINE NOW OR ON MOBILE`,
                    cta_subtitle: `Join the official WCGF ${game.charAt(0).toUpperCase() + game.slice(1)} community`,
                    buttons: ["Play on iOS", "Play on Android", "Play Online"],
                    partner_text: "The official partner game",
                  }
                }
              />
            </div>
          </div>
        </div>

        {/* More Games Section */}
        <div className="container mb-5 text-center">
          <MoreGamesSlider
            locale={locale as SupportedLocale}
            currentGame={game}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error rendering league rankings page:", error);
    return notFound();
  }
}
