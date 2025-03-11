// app/[locale]/[game]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fetchGamePage from "../../../services/gameService";
import { notFound } from "next/navigation";

type PageParams = {
  locale: string;
  game: string;
};

// Revalidation period
export const revalidate = 3600; // 1 hour

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  // Utiliser await pour résoudre la promesse si nécessaire

  const { locale, game } = await params;

  try {
    const pageData = await fetchGamePage(game, "game", locale);

    if (!pageData) {
      return {
        title: "Page not found",
        description: "The requested page could not be found.",
      };
    }

    return {
      title: pageData.meta.title,
      description: pageData.meta.description,
      keywords: pageData.meta.keywords,
      openGraph: {
        title: pageData.meta.og_title,
        description: pageData.meta.og_description,
        images: pageData.meta.og_image ? [pageData.meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error rendering game page:", error);

    // Passer les paramètres à la fonction pageNotFound
    return notFound();
  }
}

// The main page component
export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  try {
    // Utiliser await pour résoudre la promesse si nécessaire

    const { locale, game } = await params;
    // Call fetchGamePage with parameters from the URL
    const pageData = await fetchGamePage(game, "game", locale);

    if (!pageData) {
      return (
        <div className="container my-5 text-center">
          <h1 className="text-danger">Page not found</h1>
          <p>The requested page could not be found.</p>
          <Link href={`/${locale}`} className="btn btn-primary">
            Return to home page
          </Link>
        </div>
      );
    }

    const content = pageData.content;

    return (
      <>
        <header
          className="game-header py-5 mb-5"
          style={{
            backgroundImage: `url(/img/header/header-${game}.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container text-center text-white">
            <Image
              src={`/img/${game}/logo.png`}
              alt={game}
              width={150}
              height={150}
              className="mb-4"
            />
            <h1 className="display-4 fw-bold">{content.page_header.title}</h1>
          </div>
        </header>

        <div className="container my-5 lead">
          {/* Introduction Section */}
          <div className="mb-5">
            <h2 className="text-primary fw-bold mb-4">
              {content.introduction.title}
            </h2>
            <p>{content.introduction.text}</p>
          </div>

          <div className="row g-4">
            {/* Main Content */}
            <div className="col-md-9">
              {content.main_sections.map((section, index) => (
                <section className="mb-5" key={index}>
                  <h3 className="text-danger fw-bold text-uppercase mb-3">
                    {section.title}
                  </h3>
                  <p className="mb-4">{section.text}</p>
                  <Link
                    href={
                      section.cta.link.startsWith("/")
                        ? `/${locale}/${game}${section.cta.link}`
                        : section.cta.link
                    }
                    className="btn btn-primary text-white fw-bold"
                    target={
                      section.cta.link.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      section.cta.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {section.cta.text}
                  </Link>
                </section>
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-md-3 px-4">
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
                  src={`/img/store/icon-${game}.jpg`}
                  alt={`${game} Logo`}
                  width={100}
                  height={100}
                  className="rounded-4 border border-4 border-white mb-3"
                />
                <p className="fs-4 fw-bold">{content.sidebar.cta_title}</p>
                <p className="fs-5 mb-4">{content.sidebar.cta_subtitle}</p>

                <div className="d-flex flex-column gap-3 mb-4">
                  {content.sidebar.buttons.map((buttonText, index) => (
                    <button key={index} className="play-game-button">
                      {buttonText}
                    </button>
                  ))}
                </div>

                <p className="mb-2">{content.sidebar.partner_text}</p>
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

          <div className="bg-white shadow-sm rounded-4 p-4 my-5">
            <h2 className="fw-bold mb-3">{content.learn_more.title}</h2>
            <p className="mb-4">{content.learn_more.introduction}</p>

            {/* History section */}
            <div className="mb-5">
              <h3 className="text-danger fw-bold mb-3">
                {content.history.title}
              </h3>

              {content.history.sections.map((section, index) => (
                <div key={index}>
                  <h4 className="text-primary mb-2">{section.title}</h4>
                  <p className="mb-3">{section.text}</p>
                </div>
              ))}
            </div>

            {/* Glossary section */}
            <div className="mb-5">
              <h3 className="text-danger mb-3">{content.glossary.title}</h3>

              {content.glossary.terms.map((term, index) => (
                <div key={index}>
                  <h4 className="text-primary mb-2">{term.term}</h4>
                  <p className="mb-3">{term.definition}</p>
                </div>
              ))}
            </div>

            {/* Play For Free section */}
            <div className="mb-5">
              <h3 className="text-danger fw-bold mb-3">
                {content.play_free.title}
              </h3>
              <p className="mb-3">{content.play_free.text}</p>
            </div>
          </div>

          {/* Pass the current locale and game to the client component */}
          <div className="more-games-section my-5">
            <h2 className="fw-bold mb-4">More Card Games</h2>
            <div className="row g-4">
              {["tarot", "rummy", "bridge"]
                .filter((g) => g !== game)
                .map((otherGame) => (
                  <div key={otherGame} className="col-md-6">
                    <Link
                      href={`/${locale}/${otherGame}`}
                      className="text-decoration-none"
                    >
                      <div className="card mb-4 shadow-sm hover-effect">
                        <div className="row g-0">
                          <div className="col-4">
                            <Image
                              src={`/img/${otherGame}/thumb.jpg`}
                              alt={otherGame}
                              width={150}
                              height={150}
                              className="img-fluid rounded-start"
                            />
                          </div>
                          <div className="col-8">
                            <div className="card-body">
                              <h5 className="card-title">
                                {otherGame.charAt(0).toUpperCase() +
                                  otherGame.slice(1)}
                              </h5>
                              <p className="card-text">
                                Discover the exciting world of {otherGame}.
                              </p>
                              <span className="btn btn-sm btn-outline-primary">
                                Learn More
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error rendering game page:", error);

    // Passer les paramètres à la fonction pageNotFound
    return notFound();
  }
}
