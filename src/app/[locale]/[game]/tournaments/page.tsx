// app/[locale]/[game]/tournaments/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GameService from "@services/gameService";
import PageHeader from "@app/components/PageHeader";
import { SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";
import CtaBox from "@app/components/CtaBox";
import SectionHeader from "@app/components/SectionHeader";
import React from "react";
import styles from "@styles/Tournaments.module.scss";
import SectionContent from "@app/components/SectionContentPage";
import Image from "next/image";

// Types pour les paramètres de la page
type PageParams = Promise<{
  locale: SupportedLocale;
  game: string;
}>;

// Type pour un tournoi
interface Tournament {
  id: number;
  date: string;
  type: string;
  level:
    | "district"
    | "departmental"
    | "regional"
    | "national"
    | "international";
  entryFee: number;
  prizePool: number;
  game: string;
}

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
      "tournaments",
      locale,
    );

    // Si la page n'existe pas, retourner des métadonnées par défaut
    if (!pageData || !pageData.meta) {
      return {
        title: `${game.charAt(0).toUpperCase() + game.slice(1)} Tournaments | WCGF`,
        description:
          "Discover exciting tournaments for 4 or 5 players. Compete in games with various buy-ins and win prize pools.",
      };
    }

    // Les métadonnées sont déjà dans la langue actuelle ou avec fallback
    const meta = pageData.meta;

    // Retourner les métadonnées formatées
    return {
      title:
        meta.title ||
        `${game.charAt(0).toUpperCase() + game.slice(1)} Tournaments | WCGF`,
      description:
        meta.description ||
        "Discover exciting tournaments for 4 or 5 players. Compete in games with various buy-ins and win prize pools.",
      keywords:
        meta.keywords || "tournaments, competition, players, prizes, WCGF",
      openGraph: {
        title: meta.og_title || meta.title || "",
        description: meta.og_description || meta.description || "",
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${game.charAt(0).toUpperCase() + game.slice(1)} Tournaments | WCGF`,
      description:
        "Discover exciting tournaments for 4 or 5 players. Compete in games with various buy-ins and win prize pools.",
    };
  }
}

// Fonction pour générer des tournois de démo
const generateTournaments = (): Tournament[] => {
  const levels = [
    "district",
    "departmental",
    "regional",
    "national",
    "international",
  ];
  const games = ["Super Rummy", "Super Tarot", "Super Scopa"];
  const dates = [
    "06 05 2025",
    "07 05 2025",
    "08 05 2025",
    "09 05 2025",
    "10 05 2025",
    "11 05 2025",
    "12 05 2025",
    "13 05 2025",
    "14 05 2025",
    "15 05 2025",
  ];

  // Dupliquer certaines dates pour avoir plus de tournois
  const extendedDates = [...dates, "13 05 2025", "14 05 2025", "15 05 2025"];

  return extendedDates.map((date, index) => {
    // Alterner entre les jeux
    const gameType = games[index % games.length];

    // Alterner entre les niveaux
    const level = levels[index % levels.length] as Tournament["level"];

    // Définir les frais d'entrée et les prix en fonction du niveau
    let entryFee = 0;
    let prizePool = 0;

    switch (level) {
      case "district":
        entryFee = [500, 550].includes(index % 1000) ? 550 : 500;
        prizePool = 1000;
        break;
      case "departmental":
        entryFee = [650, 750].includes(index % 1000) ? 650 : 750;
        prizePool = [800, 850].includes(index % 1000) ? 850 : 800;
        break;
      case "regional":
        entryFee = index % 2 === 0 ? 1000 : 800;
        prizePool = index % 2 === 0 ? 700 : 1000;
        break;
      case "national":
        entryFee = index % 2 === 0 ? 600 : 900;
        prizePool = index % 2 === 0 ? 500 : 1200;
        break;
      case "international":
        entryFee = index % 2 === 0 ? 400 : 1000;
        prizePool = index % 2 === 0 ? 300 : 1500;
        break;
    }

    return {
      id: index + 1,
      date,
      type: gameType,
      level,
      entryFee,
      prizePool,
      game: gameType.split(" ")[1].toLowerCase(),
    };
  });
};

// Fonction pour obtenir la couleur de fond en fonction du niveau
const getLevelBgClass = (level: Tournament["level"]): string => {
  switch (level) {
    case "district":
      return "bg-info-subtle";
    case "departmental":
      return "bg-warning-subtle";
    case "regional":
      return "bg-success-subtle";
    case "national":
      return "bg-primary-subtle";
    case "international":
      return "bg-danger-subtle";
    default:
      return "bg-light";
  }
};

// Composant principal de la page
export default async function TournamentsPage(props: { params: PageParams }) {
  // Attendre la résolution de la promesse params
  const params = await props.params;
  const { locale, game } = params;

  try {
    if (!locale || !game) {
      console.error("Params are missing or undefined.");
      return notFound();
    }

    // Récupérer les données de la page
    const pageData = await GameService.getGamePageByLocale(
      game,
      "tournaments",
      locale,
    );

    // Si la page n'existe pas, afficher une page 404 personnalisée
    if (!pageData || !pageData.content) {
      return notFound();
    }

    // Le contenu est déjà dans la langue actuelle ou avec fallback
    const content = pageData.content;

    // Générer des tournois de démo
    const tournaments = generateTournaments();

    // Filtrer les tournois pour le jeu actuel
    const filteredTournaments = tournaments.filter(
      (tournament) =>
        tournament.game.toLowerCase() === game.toLowerCase() ||
        tournament.type.toLowerCase().includes(game.toLowerCase()),
    );

    // Titre de la page
    const pageTitle =
      content.page_header?.title ||
      `DISCOVER THRILLING ${game.toUpperCase()} TOURNAMENTS FOR 4 OR 5 PLAYERS!`;

    // Rendu de la page
    return (
      <>
        <PageHeader
          type="game"
          background={`/img/header/header-${game}.jpg`}
          title={pageTitle}
          logo={`/img/${game}/logo.png`}
          activeTab="tournaments"
          gamePath={`/${locale}/${game}`}
        />

        <div className="container my-5">
          <div className="row">
            <div className="col-lg-9">
              {/* Introduction */}
              {content.introduction && (
                <SectionHeader
                  title={content.introduction?.title}
                  subtitle={content.introduction?.text}
                />
              )}

              {/* Tournaments List */}
              <div className="card border-0 rounded-4 p-4 game-card">
                <div className="card rounded-4 bg-light mb-5 border-0 shadow-sm overflow-hidden">
                  <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <Image
                          src={`/img/cups/1.png`}
                          alt="Trophy"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className="fs-4 fw-bold">{`${game.toUpperCase()} TOURNAMENTS`}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <select className="form-select me-2" defaultValue="all">
                        <option value="district">District</option>
                        <option value="all">All Levels</option>
                        <option value="departmental">Departmental</option>
                        <option value="regional">Regional</option>
                        <option value="national">National</option>
                        <option value="international">International</option>
                      </select>
                      <button className="btn btn-danger">VIEW</button>
                    </div>
                  </div>

                  <div className="bg-success text-white p-2 text-center fw-bold text-uppercase">
                    NEXT TOURNAMENTS
                  </div>

                  <div className="table-responsive">
                    <table className="table mb-0">
                      <tbody>
                        {filteredTournaments.map((tournament) => (
                          <tr
                            key={tournament.id}
                            className={`${styles.tournamentsRow}`}
                          >
                            <td className="d-flex align-items-center">
                              <div className="d-flex align-items-center">
                                {tournament.type === "Super Tarot" ? (
                                  <Image
                                    src={`/img/store/icon-tarot.webp`}
                                    alt="Tarot"
                                    width={50}
                                    height={50}
                                    className="me-2  rounded"
                                  />
                                ) : tournament.type === "Super Rummy" ? (
                                  <Image
                                    src={`/img/store/icon-rummy.webp`}
                                    alt="Rummy"
                                    width={50}
                                    height={50}
                                    className="me-2"
                                  />
                                ) : (
                                  <Image
                                    src={`/img/store/icon-rummy500.webp`}
                                    alt="Scopa"
                                    width={50}
                                    height={50}
                                    className="me-2"
                                  />
                                )}
                                <span className="fw-medium">
                                  {tournament.type}
                                </span>
                              </div>
                            </td>
                            <td
                              className="align-middle text-center"
                              width="100"
                            >
                              {tournament.date}
                            </td>
                            <td className="align-middle">
                              <div
                                className={`badge ${getLevelBgClass(tournament.level)} text-dark rounded-2 px-3 py-2`}
                              >
                                {tournament.level}
                              </div>
                            </td>
                            <td className="align-middle text-center" width="60">
                              <span className="bg-warning text-dark rounded px-2 py-1 fw-bold">
                                {tournament.entryFee}
                              </span>
                            </td>
                            <td className="align-middle text-center" width="60">
                              <span className="bg-primary text-white rounded px-2 py-1 fw-bold">
                                {tournament.prizePool}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-light p-2 text-center small">
                    <Image
                      src={`/img/wcgf-black-small.webp`}
                      alt="WCGF Logo"
                      className="ms-2"
                      height={20}
                      width={20}
                    />
                    <span className="ms-1">
                      This is the official ranking of the WCGF{" "}
                      {game.charAt(0).toUpperCase() + game.slice(1)} Super
                      League.
                    </span>
                  </div>
                </div>
              </div>

              {/* Tournament Info Sections */}
              <div className=" bg-white shadow-sm rounded-4 p-4 my-5">
                <SectionHeader
                  title={`EXPLORE ${game.toUpperCase()} TOURNAMENTS AND COMPETE FOR GLORY`}
                />

                {content.main_sections?.map((section, i) => (
                  <SectionContent
                    key={`section-${i}`}
                    section={section}
                    locale={locale}
                    game={game}
                    headingTag={"h3"}
                    className="mb-5"
                  />
                ))}
              </div>
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
    console.error("Error rendering tournaments page:", error);
    return notFound();
  }
}
