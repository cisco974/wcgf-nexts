// app/[locale]/[game]/game/page.tsx

import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import { GameContentPage, SupportedLocale } from "@/app/types";
import GameService from "@/services/gameService";
import GameButtonsClient from "./components/GameButtonsClient";
import MoreGamesSlider from "@/app/components/MoreGamesSlider";
import CtaBox from "@/app/components/CtaBox";
import SectionHeader from "@app/components/SectionHeader";
import SectionContent, {
  SectionItem,
} from "@/app/components/SectionContentPage";
import Image from "next/image";

// Extension de SectionItem pour inclure l'image
interface FeatureItem extends SectionItem {
  image: string;
}

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
      "game",
      locale,
    );

    // Si la page n'existe pas, retourner des métadonnées par défaut
    if (!pageData || !pageData.meta) {
      return {
        title: `${game.charAt(0).toUpperCase() + game.slice(1)} Game | WCGF`,
        description: `Discover how you can enjoy Super ${game.charAt(0).toUpperCase() + game.slice(1)} on any device. Experience thrilling gameplay, competitive leagues, and exciting tournaments.`,
      };
    }

    // Les métadonnées sont déjà dans la langue actuelle ou avec fallback
    const meta = pageData.meta;

    // Retourner les métadonnées formatées
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      openGraph: {
        title: meta.og_title || meta.title || "",
        description: meta.og_description || meta.description || "",
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${game.charAt(0).toUpperCase() + game.slice(1)} Game | WCGF`,
      description: `Discover how you can enjoy Super ${game.charAt(0).toUpperCase() + game.slice(1)} on any device. Experience thrilling gameplay, competitive leagues, and exciting tournaments.`,
    };
  }
}

// Données des plateformes
const platforms = [
  { name: "iOS", icon: "fi-brands-apple", class: "btn-ios" },
  { name: "Android", icon: "fi-brands-android", class: "btn-android" },
  { name: "Online", icon: "fi-ss-spade", class: "btn-web" },
];

export default async function GamePage({ params }: { params: PageParams }) {
  const { locale, game } = await params;
  // Récupérer les données de la page
  const pageData = await GameService.getGamePageByLocale(game, "game", locale);

  // Si la page n'existe pas, afficher une page 404 personnalisée
  if (!pageData || !pageData.content) {
    return notFound();
  }

  // Le contenu est déjà dans la langue actuelle ou avec fallback
  const content = pageData.content as GameContentPage;

  // Titre de la page
  const pageTitle = content.page_header?.title || `SUPER ${game.toUpperCase()}`;

  // Features du jeu (personnalisées ou par défaut)
  // Le contenu features est déjà au format SectionItem avec une propriété image supplémentaire
  const gameFeatures = (content.features as FeatureItem[]) || [];

  // Historique du jeu (personnalisé ou par défaut)
  const gameHistory = content.gameHistorySections;

  return (
    <>
      <PageHeader
        type="game"
        background={`/img/header/header-${game}.jpg`}
        title={pageTitle}
        logo={`/img/${game}/logo.png`}
        activeTab="game"
        gamePath={`/${locale}/${game}`}
      />

      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            {/* Introduction */}
            {content.introduction && (
              <SectionHeader
                title={content.introduction?.title}
                subtitle={content.introduction?.text}
              />
            )}
            <GameButtonsClient platforms={platforms} game={game} />

            <div className="row g-4 pt-4">
              {/* Main Content */}
              <div className="col-lg-8">
                {/* Features du jeu utilisant le composant SectionContent */}
                {gameFeatures.map((feature, index) => (
                  <div key={index} className="mb-5">
                    <SectionContent
                      section={feature}
                      locale={locale}
                      game={game}
                      headingTag="h3"
                      headingColor="danger"
                    />
                    <div className="rounded-4 overflow-hidden shadow-sm mb-4">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        className="img-fluid w-100"
                        width={1000}
                        height={685}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                {/* Advertisement */}
                <div className="rounded-4 overflow-hidden shadow-sm mb-4">
                  <video autoPlay loop muted className="w-100">
                    <source src={`/videos/${game}/ad1.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Sidebar CTA */}
                <CtaBox
                  game={game}
                  sidebarContent={
                    content.sidebar || {
                      cta_title: `PLAY ${game.toUpperCase()} ONLINE NOW OR ON MOBILE`,
                      cta_subtitle: `Join the official WCGF ${game.charAt(0).toUpperCase() + game.slice(1)} community`,
                      buttons: [
                        "Play on iOS",
                        "Play on Android",
                        "Play Online",
                      ],
                      partner_text: "The official partner game",
                    }
                  }
                />
              </div>
            </div>

            {/* Historique du jeu */}
            <div className="mt-5 mb-4">
              {content.introduction && (
                <SectionHeader
                  title={content.gameHistoryTitle}
                  subtitle={content.gameHistoryIntro}
                />
              )}

              {gameHistory.map((section, sectionIndex) => (
                <SectionContent
                  key={sectionIndex}
                  section={section}
                  locale={locale}
                  game={game}
                  headingTag="h3"
                  headingColor="primary"
                />
              ))}
            </div>
          </div>
        </div>

        {/* More Games Slider */}
        <MoreGamesSlider
          locale={locale as SupportedLocale}
          currentGame={game}
        />
      </div>
    </>
  );
}
