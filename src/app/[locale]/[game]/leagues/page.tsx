// app/[locale]/[game]/leagues/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GameService from "@services/gameService";
import PageHeader from "@app/components/PageHeader";
import { Player, SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";
import Link from "next/link";
import CtaBox from "@app/components/CtaBox";
import SectionContent from "@app/components/SectionContentPage";
import SectionHeader from "@app/components/SectionHeader";
import React from "react";
import Image from "next/image";
import styles from "@styles/LeagueRankings.module.scss";
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
  const { locale, game } = await props.params;

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
    <span className="bg-success text-white d-inline-block rounded px-2 py-1 fw-bold">
      V
    </span>
  ) : (
    <span className="bg-danger text-white d-inline-block rounded px-2 py-1 fw-bold">
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
              <SectionHeader
                title={"Welcome to the official Super Tarot league rankings!"}
              ></SectionHeader>
              <div className="p-4 rounded-4 mb-4">
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

              {/* Search Bar */}
              <div className="card rounded-4 bg-light mb-4 border-0 shadow-sm">
                <div className="p-3">
                  <div className="d-flex justify-content-center">
                    <input
                      type="text"
                      className="form-control me-2 mx-auto"
                      style={{ maxWidth: "550px" }}
                      placeholder="SEARCH FOR A PLAYER BY USERNAME OR ID..."
                    />
                    <button className="btn btn-danger text-white fw-bold">
                      SEARCH
                    </button>
                  </div>
                </div>
              </div>

              {/* League Rankings */}
              <div className="rounded-4 overflow-hidden shadow-sm mb-5">
                {/* League Header */}
                <div className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-2">
                      <Image
                        src={"/img/medals/1.webp"}
                        alt="ddd"
                        width={40}
                        height={60}
                      />
                    </div>
                    <div className="fs-4 fw-bold ms-2">LEAGUE 1</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <select className="form-select me-2">
                      {leagueOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <select className="form-select me-2">
                      {divisionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-danger px-4">VIEW</button>
                  </div>
                </div>

                {/* Zone de Promotion */}
                <div>
                  <div className="bg-success text-white p-2 text-center fw-bold text-uppercase">
                    ZONE DE PROMOTION
                  </div>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <tbody>
                        {zonePromotion.map((player: Player) => (
                          <tr
                            className={`   ${styles.playerRow} `}
                            key={player.rank}
                          >
                            <td
                              className={`   align-middle text-center`}
                              width="30"
                            >
                              ↑
                            </td>
                            <td className="align-middle text-center" width="50">
                              <span className="bgRankingLineRankNumber text-white d-inline-block rounded px-2 py-1 fw-bold">
                                {player.rank}
                              </span>
                            </td>
                            <td className="align-middle" width="60">
                              <Image
                                src={player.avatar}
                                alt={player.name}
                                className="rounded"
                                width={36}
                                height={36}
                              />
                            </td>
                            <td className="align-middle fw-medium">
                              {player.name}
                            </td>
                            <td className="align-middle">
                              {getPlayerForm(player)}
                            </td>
                            <td className="align-middle text-center">
                              <span className="bgRankingLineRankNumber text-white rounded px-3 py-1 fw-bold">
                                Level {player.level}
                              </span>
                            </td>
                            <td className="align-middle text-center">
                              {player.points}
                            </td>
                            <td className="align-middle text-end">
                              <span className="bgColorAzur text-white rounded px-3 py-1 fw-bold">
                                {player.pts} PTS
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Zone de Maintien */}
                <div>
                  <div className="bg-warning text-white p-2 text-center fw-bold text-uppercase">
                    ZONE DE MAINTIEN
                  </div>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <tbody>
                        {zoneMaintien.map((player: Player) => (
                          <tr
                            className={`   ${styles.playerRow} `}
                            key={player.rank}
                          >
                            <td
                              className="align-middle text-center"
                              width="30"
                            ></td>
                            <td
                              className="align-middle text-center "
                              width="50"
                            >
                              <span className="bgRankingLineRankNumber text-white d-inline-block rounded px-2 py-1 fw-bold">
                                {player.rank}
                              </span>
                            </td>
                            <td className="align-middle" width="60">
                              <Image
                                src={player.avatar}
                                alt={player.name}
                                className="rounded"
                                width={36}
                                height={36}
                              />
                            </td>
                            <td className="align-middle fw-medium">
                              {player.name}
                            </td>
                            <td className="align-middle">
                              {getPlayerForm(player)}
                            </td>
                            <td className="align-middle text-center">
                              <span className="bgRankingLineRankNumber text-white rounded px-3 py-1 fw-bold">
                                Level {player.level}
                              </span>
                            </td>
                            <td className="align-middle text-center">
                              {player.points}
                            </td>
                            <td className="align-middle text-end">
                              <span className="bgColorAzur text-white rounded px-3 py-1 fw-bold">
                                {player.pts} PTS
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Zone de Relégation */}
                <div>
                  <div className="bg-danger text-white p-2 text-center fw-bold text-uppercase">
                    ZONE DE RELÉGATION
                  </div>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <tbody>
                        {zoneRelegation.map((player: Player) => (
                          <tr
                            className={`   ${styles.playerRow} `}
                            key={player.rank}
                          >
                            <td className="align-middle text-center" width="30">
                              ↓
                            </td>
                            <td className="align-middle text-center" width="50">
                              <span className="bgRankingLineRankNumber text-white d-inline-block rounded px-2 py-1 fw-bold">
                                {player.rank}
                              </span>
                            </td>
                            <td className="align-middle" width="60">
                              <Image
                                src={player.avatar}
                                alt={player.name}
                                className="rounded"
                                width={36}
                                height={36}
                              />
                            </td>
                            <td className="align-middle fw-medium">
                              {player.name}
                            </td>
                            <td className="align-middle">
                              {getPlayerForm(player)}
                            </td>
                            <td className="align-middle text-center">
                              <span className="bgRankingLineRankNumber text-white rounded px-3 py-1 fw-bold">
                                Level {player.level}
                              </span>
                            </td>
                            <td className="align-middle text-center">
                              {player.points}
                            </td>
                            <td className="align-middle text-end">
                              <span className="bgColorAzur text-white rounded px-3 py-1 fw-bold">
                                {player.pts} PTS
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-light p-2 text-center small">
                    This is the official ranking of the WCGF{" "}
                    {game.charAt(0).toUpperCase() + game.slice(1)} Super League.
                    <Image
                      src={"/img/wcgf-logo.png"}
                      alt="WCGF Logo"
                      className="rounded"
                      width={20}
                      height={20}
                    />
                  </div>
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
              <div className="rounded-4 overflow-hidden shadow-sm mb-4 transition">
                <video autoPlay loop muted className="w-100">
                  <source src={`/videos/${game}/ad1.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
