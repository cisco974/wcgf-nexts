// app/[locale]/[game]/game/page.tsx

import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import { GameContentPage, SupportedLocale } from "@/app/types";
import GameService from "@/services/gameService";
import styles from "@styles/Game.module.scss";

import GameButtonsClient from "./components/GameButtonsClient";
import MoreGamesSlider from "@/app/components/MoreGamesSlider";
import CtaBox from "@/app/components/CtaBox";
import SectionHeader from "@app/components/SectionHeader";
import Image from "next/image";

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

// Features de jeu par défaut
const defaultFeatures = [
  {
    id: "gameplay",
    title: "Gameplay",
    description:
      "Super Tarot brings the classic card game to life with thrilling gameplay, engaging mechanics, and a competitive edge that challenges players to showcase their strategy and skills.",
    image: "/img/features/home-super-tarot.png",
  },
  {
    id: "variant",
    title: "Variant Super Tarot",
    description:
      "Explore different game variants, including 3, 4, or 5-player configurations, each offering unique strategic dynamics and exciting opportunities to outwit your opponents.",
    image: "/img/features/ingame-super-tarot.png",
  },
  {
    id: "leagues",
    title: "Leagues Super Tarot",
    description:
      "Climb the ranks in competitive leagues and prove your mastery. Earn points through your victories and secure a spot among the best players on the leaderboard.",
    image: "/img/features/leagues.png",
  },
  {
    id: "tournaments",
    title: "Tournaments Super Tarot",
    description:
      "Participate in thrilling tournaments with varying buy-ins and prize pools. Each match tests your mettle, with quarterfinals, semifinals, and finals determining the ultimate champion.",
    image: "/img/features/tournaments.png",
  },
  {
    id: "missions",
    title: "Missions Super Tarot",
    description:
      "Complete daily and weekly missions to earn rewards, boost your ranking, and unlock exclusive items that enhance your Super Tarot experience.",
    image: "/img/features/missions.png",
  },
  {
    id: "vip",
    title: "VIP Program Super Tarot",
    description:
      "Join the VIP program to enjoy premium benefits, including exclusive tournaments, higher rewards, and a dedicated VIP leaderboard for top-tier competitors.",
    image: "/img/features/vip.png",
  },
  {
    id: "villages",
    title: "Villages Super Tarot",
    description:
      "Progress through charming villages as you advance in the game. Each village offers new challenges, rewards, and a unique theme that keeps the experience fresh and exciting.",
    image: "/img/features/villages.png",
  },
  {
    id: "clubs",
    title: "Clubs Super Tarot",
    description:
      "Join clubs to connect with fellow players, share strategies, and participate in exclusive club-based challenges and leaderboards. Build your community within the game!",
    image: "/img/features/clubs.png",
  },
  {
    id: "slots",
    title: "Slots Super Tarot",
    description:
      "Spin the slots for a chance to win tokens, boosters, and other in-game rewards. Slots add an element of luck to your journey, enhancing the excitement of the game.",
    image: "/img/features/slots.png",
  },
  {
    id: "boosters",
    title: "Boosters Super Tarot",
    description:
      "Utilize boosters to gain an edge in your matches. From score multipliers to strategic advantages, boosters help you dominate the competition and climb the ranks.",
    image: "/img/features/boosters.png",
  },
];

// Historique du jeu par défaut
const defaultHistory = {
  title: "Discover More About Tarot",
  intro:
    "Tarot is a timeless card game that has captivated players for centuries. Its rich history, unique deck, and strategic depth have made it a favorite among card enthusiasts worldwide. Learn about its fascinating origins and how it has evolved into the modern game enjoyed today.",
  sections: [
    {
      title: "History of Tarot",
      subsections: [
        {
          title: "Origins of Tarot",
          text: "Tarot originated in the 15th century in northern Italy as a deck of playing cards used for various games. These early Tarot cards featured four traditional suits along with an additional set of illustrated trump cards, making it distinct from standard card decks of the time. The game quickly spread across Europe, gaining popularity in France, where its unique rules and symbolism were further developed.",
        },
        {
          title: "Modern Evolution",
          text: "In the 18th century, Tarot began to gain prominence as a strategic card game in France, evolving into the 78-card deck used today. Featuring 21 trump cards and the Fool, Tarot introduced unique gameplay mechanics such as bidding, partnerships, and scoring systems. Over time, its competitive nature solidified its place as one of the most cherished card games. Today, Tarot continues to thrive, blending tradition with innovation, as players worldwide enjoy it in tournaments, leagues, and casual play.",
        },
      ],
    },
  ],
};

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
  const gameFeatures =
    content.features ||
    defaultFeatures.map((feature) => ({
      ...feature,
      title: feature.title.replace(
        "Tarot",
        game.charAt(0).toUpperCase() + game.slice(1),
      ),
    }));

  // Historique du jeu (personnalisé ou par défaut)
  const gameHistory = content.gameHistory || defaultHistory;

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
            {/* Introduction */}
            {content.introduction && (
              <SectionHeader
                title={content.introduction?.title}
                subtitle={content.introduction?.text}
              />
            )}
            <GameButtonsClient platforms={platforms} game={game} />

            <div className={styles.contentWithSidebar}>
              <div className={styles.mainContent}>
                {/* Features du jeu */}
                {gameFeatures.map((feature, index) => (
                  <div
                    key={feature.id || index}
                    className={styles.featureSection}
                  >
                    <SectionHeader title={feature.title} />

                    <p>{feature.description}</p>
                    <div className={styles.presentationImage}>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        className="img-fluid"
                        width={1000}
                        height={685}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className={styles.sidebar}>
                {/* Advertisement */}
                <div className={styles.adContainer}>
                  <div className={styles.adVideo}>
                    <video
                      autoPlay
                      loop
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src={`/videos/${game}/ad1.mp4`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
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
            <div className={styles.moreText}>
              <h2>{gameHistory.title}</h2>
              <p>{gameHistory.intro}</p>

              {gameHistory.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3>{section.title}</h3>
                  {section.subsections?.map((subsection, subsectionIndex) => (
                    <div key={subsectionIndex}>
                      <h4>{subsection.title}</h4>
                      <p>{subsection.text}</p>
                    </div>
                  ))}
                </div>
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
