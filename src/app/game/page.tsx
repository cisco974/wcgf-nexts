import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Client components

// Styles - Minimales car on utilise principalement Bootstrap

import MoreGamesSlider from "../components/MoreGamesSlider";
import SectionHeader from "../components/SectionHeader";
import React from "react";
import PageHeader from "../components/PageHeader";

// Define metadata for the page (SEO)
export const metadata: Metadata = {
  title: "Play Tarot Online | Rules, Leagues, and Rankings | WCGF",
  description:
    "Discover the world of Tarot with detailed rules, leagues, rankings, and exciting tournaments. Play Tarot online anytime, anywhere!",
  keywords:
    "Tarot, play Tarot online, Tarot rules, Tarot leagues, Tarot rankings, Tarot tournaments",
  openGraph: {
    title: "Play Tarot Online | Rules, Leagues, and Rankings | WCGF",
    description:
      "Discover the world of Tarot with detailed rules, leagues, rankings, and exciting tournaments.",
    images: ["/img/tarot/tarot-en.webp"],
  },
};

// Revalidation period (ISR)
export const revalidate = 86400; // Revalidate once per day

// Server component to fetch data
async function getGameData() {
  // In a real app, you would fetch this from an API or database
  return {
    name: "Super Tarot",
    description: "A classic strategy card game with deep tactical gameplay",
  };
}

export default async function TarotPage() {
  // Fetch data server-side
  const gameData = await getGameData();

  return (
    <>
      <PageHeader
        logo="/img/tarot/logo.png"
        type="game"
        background="/img/header/header-tarot.jpg"
      />
      {/* Page Header - Client Component */}

      <div className="container my-5 lead">
        {/* Introduction Section */}
        <div className="mb-5">
          <SectionHeader
            title={`Welcome to the official ${gameData.name ?? "Game"}`}
          />

          <p>
            Discover the world of <strong>{gameData.name}</strong> from World
            Card Games Federation, a thrilling card game of strategy and skill.
            Explore the latest{" "}
            <Link
              href="/tarot/leagues"
              className="text-primary text-decoration-none"
            >
              league rankings
            </Link>{" "}
            to see how you stand among the best players, learn the{" "}
            <Link
              href="/tarot/rules"
              className="text-primary text-decoration-none"
            >
              rules of Tarot
            </Link>{" "}
            to master every hand, and participate in exciting
            <Link
              href="/tarot/tournaments"
              className="text-primary text-decoration-none"
            >
              {" "}
              tournaments
            </Link>{" "}
            to showcase your abilities. Connect with a vibrant community of
            players in
            <Link
              href="/tarot/clubs"
              className="text-primary text-decoration-none"
            >
              {" "}
              clubs
            </Link>{" "}
            and dive deeper into the strategic nuances of Tarot. Stay tuned to
            our blog for updates, tips, and news on all games available on{" "}
            <strong>WCGF</strong>. Join leagues, test your skills, win rewards,
            and climb the leaderboard in this competitive and immersive card
            game!
          </p>
        </div>

        <div className="row g-4 ">
          {/* Main Content */}
          <div className="col-9">
            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Tarot Rules Overview
              </h3>
              <p className="mb-4">
                Super Tarot is a four-player game where strategy and teamwork
                are key. The goal is to fulfill contracts while predicting your
                points accurately. The game uses a 78-card deck, including
                trumps and special cards like the Fool. Players bid for the role
                of Declarer, aiming to meet their bid with the help of trumps
                and strategic play, while opponents work together to stop them.
                Mastering the rules is the first step to dominating the game!
              </p>
              <Link
                href="/tarot/rules"
                className="btn btn-primary text-white  fw-bold"
              >
                Learn the Rules
              </Link>
            </section>

            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Tarot League Overview
              </h3>
              <p className="mb-4">
                Our leagues are the heart of the competitive Super Tarot
                experience. Players are divided into divisions, climbing the
                ranks by earning points through victories. Each season offers
                exclusive rewards and recognition for top players. Whether
                you&apos;re a beginner or a seasoned expert, leagues offer a
                structured and exciting way to prove your skills and gain glory
                on the leaderboard.
              </p>
              <Link
                href="/tarot/leagues"
                className="btn btn-primary text-white  fw-bold"
              >
                View Leagues
              </Link>
            </section>

            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Tarot Tournament Overview
              </h3>
              <p className="mb-4">
                Super Tarot tournaments bring an adrenaline-filled challenge to
                all players. Compete in real-time matches against top-tier
                opponents and aim for the ultimate prize. With knockout rounds,
                strategic gameplay, and high stakes, tournaments are the
                pinnacle of competition. Test your mastery of the game and
                secure your place among the Tarot champions!
              </p>
              <Link
                href="/tarot/tournaments"
                className="btn btn-primary  text-white  fw-bold"
              >
                View Tournaments
              </Link>
            </section>

            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Tarot Rankings Overview
              </h3>
              <p className="mb-4">
                The ranking system in Super Tarot tracks your progress and
                achievements. Win matches, earn points, and climb the
                leaderboard to showcase your expertise. Rankings reset
                periodically to give everyone a fresh shot at the top, making
                each season a new opportunity to excel. Check your rank and
                strive to outperform rivals from around the world!
              </p>
              <Link
                href="/tarot/rankings"
                className="btn btn-primary text-white  fw-bold"
              >
                View Rankings
              </Link>
            </section>

            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Tarot Game Presentation
              </h3>
              <p className="mb-4">
                Super Tarot is a game of balance and foresight. Each round
                challenges you to adapt your strategy based on your hand, the
                bids, and your opponents&apos; moves. With trumps, the Fool, and
                strategic alliances, every game is unique. Whether you&apos;re
                defending against the Declarer or aiming to meet your bid,
                success depends on smart play and calculated risks.
              </p>
              <Link
                href="/tarot/game"
                className="btn btn-primary text-white fw-bold"
              >
                Game Presentation
              </Link>
            </section>

            <section className="mb-5">
              <h3 className="text-danger fw-bold text-uppercase mb-3">
                Play Tarot
              </h3>
              <p className="mb-4">
                Ready to dive in? Click <strong>Play</strong> to start your
                journey in Super Tarot. Play against AI to sharpen your skills
                or challenge real players in live matches. From casual games to
                competitive matches, there&apos;s something for everyone. Win,
                learn, and enjoy the thrill of this timeless card game!
              </p>
              <a
                href="https://webgl.tradigames.com/?g=tarot"
                className="btn btn-primary text-white  fw-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Playing
              </a>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-3 px-5">
            {/* Advertisement */}
            <div className="gh_ad_container mb-4 w-100 rounded-4 overflow-hidden">
              <video autoPlay loop muted className="w-100">
                <source src="/videos/rummy/ad1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* CTA Box */}
            <div className="gh_cta_box rounded-4 p-4 text-white text-center w-100">
              <Image
                src="/img/store/icon-tarot.jpg"
                alt="Tarot Logo"
                width={100}
                height={100}
                className="rounded-4 border border-4 border-white mb-3"
              />
              <p className="fs-4 fw-bold">Play Tarot online now or on mobile</p>
              <p className="fs-5 mb-4">
                Join the official WCGF Tarot community
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <button className="play-game-button  ">Play on iOS</button>
                <button className="play-game-button">Play on Android</button>
                <button className="play-game-button">Play Online</button>
              </div>

              <p className="mb-2">The official partner game</p>
              <div>
                <Image
                  src="/img/wcgf-white-small.png"
                  alt="WCGF PARTNER"
                  width={100}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarot history and glossary section */}
        <div className="bg-white shadow-sm rounded-4 p-4 my-5">
          <h2 className="fw-bold mb-3">Learn More About the Tarot Game</h2>
          <p className="mb-4">
            Tarot is a captivating game that blends strategy, skill, and
            historical richness. From its noble origins to modern-day
            competitive and casual play, it remains a timeless favorite among
            card enthusiasts. Dive into its history, glossary, and unique
            gameplay features to become a master of the game.
          </p>

          {/* History section */}
          <div className="mb-5">
            <h3 className="text-danger fw-bold mb-3">
              History of the Tarot Game
            </h3>

            <h4 className="text-primary  mb-2">The Origins of Tarot</h4>
            <p className="mb-3">
              Tarot, a game with roots tracing back to the 15th century, first
              emerged in Europe, specifically in Italy and France. Initially, it
              was a parlor game favored by the nobility, devoid of any
              divinatory connotations. The word &apos;Tarot&apos; derives from
              the Italian &apos;Tarocchi,&apos; the name given to these cards.
              Early versions of the game featured intricately decorated, often
              handmade cards that served as both entertainment and works of art.
            </p>

            <h4 className="text-primary   mb-2">
              The Evolution of Tarot Through the Centuries
            </h4>
            <p className="mb-3">
              The Renaissance marked a pivotal era for Tarot. It gradually
              evolved into a tool for divination, dream interpretation, and
              meditation. Tarot cards, with their symbolic illustrations, were
              redesigned and reinterpreted across cultures and eras to reflect
              varying beliefs and aesthetics. It was not until the 18th century
              that Tarot became firmly associated with esotericism and the
              Kabbalah, thanks in part to French occultist Antoine Court de
              Gébelin.
            </p>

            <h4 className="text-primary  mb-2">Tarot in the Modern World</h4>
            <p className="mb-3">
              In the 20th century, Tarot found a secure place both as a
              divinatory tool and as a card game. Societies like the Golden Dawn
              in England integrated Tarot into their rituals and mystical
              practices. Simultaneously, Tarot as a card game continued to
              thrive in Europe, especially in France, where it remains popular.
            </p>
            <p className="mb-3">
              With the technological boom of the late 20th and early 21st
              centuries, Tarot made its way into the digital realm. The rise of
              the internet brought forums and websites dedicated to Tarot
              readings, learning, and discussion. Modern mobile apps now allow
              enthusiasts to enjoy readings and multiplayer games anytime,
              anywhere, connecting players worldwide.
            </p>
          </div>

          {/* Glossary section */}
          <div className="mb-5">
            <h3 className="text-danger  mb-3">Tarot Glossary</h3>

            <h4 className="text-primary mb-2">Trump</h4>
            <p className="mb-3">
              Special cards in Tarot that can be played when a player cannot
              follow the suit. They have their own hierarchy, typically ranging
              from 1 (the Petit) to 21, plus the Excuse.
            </p>

            <h4 className="text-primary  mb-2">Oudler</h4>
            <p className="mb-3">
              Specific key cards in Tarot: the 1 (the Petit), the 21 of trumps,
              and the Excuse. These cards are crucial for scoring and winning a
              game.
            </p>

            <h4 className="text-primary   mb-2">Dog</h4>
            <p className="mb-3">
              A pile of cards set aside during the initial deal. These cards are
              later picked up by the taker to improve their hand.
            </p>
          </div>

          {/* Play For Free section */}
          <div className="mb-5">
            <h3 className="text-danger fw-bold mb-3">Play Tarot for Free</h3>
            <p className="mb-3">
              To play our free online Tarot game, simply create an account and
              choose a player name. Once in the game, you&apos;ll receive 300
              free tokens every 4 hours. Depending on your league, you may
              receive an additional bonus of 10% to 100%. Register today and
              enjoy playing Tarot anytime!
            </p>
          </div>
        </div>

        {/* More Games section - Client component */}
        <MoreGamesSlider />
      </div>
    </>
  );
}
