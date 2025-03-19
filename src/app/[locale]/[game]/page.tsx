// app/[locale]/[game]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameService from "../../../services/gameService";
import PageHeader from "@app/components/PageHeader";
import { SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";

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
      "game",
      locale,
    );

    // Si la page n'existe pas, retourner des métadonnées par défaut
    if (!pageData || !pageData.meta) {
      return {
        title: "Page not found",
        description: "The requested page could not be found.",
      };
    }

    // Les métadonnées sont déjà dans la langue actuelle ou avec fallback
    const meta = pageData.meta;

    // Retourner les métadonnées formatées
    return {
      title:
        meta.title || `${game.charAt(0).toUpperCase() + game.slice(1)} | WCGF`,
      description: meta.description || "",
      keywords: meta.keywords || "",
      openGraph: {
        title: meta.og_title || meta.title || "",
        description: meta.og_description || meta.description || "",
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | WCGF",
      description: "An error occurred while loading this page.",
    };
  }
}

// Composant principal de la page
export default async function GamePage(props: { params: PageParams }) {
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
      "game",
      locale,
    );

    // Si la page n'existe pas, afficher une page 404 personnalisée
    if (!pageData || !pageData.content) {
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

    // Le contenu est déjà dans la langue actuelle ou avec fallback
    const content = pageData.content;

    // Rendu de la page
    return (
      <>
        <PageHeader
          type="game"
          background={`/img/header/header-${game}.jpg`}
          title={content.page_header?.title ?? game.toUpperCase()}
          logo={`/img/${game}/logo.png`}
          activeTab="game"
          gamePath={`/${locale}/${game}`}
        />

        <div className="container my-5 lead">
          {/* Section Introduction */}
          {content.introduction && (
            <div className="mb-5">
              <h2 className="text-primary fw-bold mb-4">
                {content.introduction.title ?? "Introduction"}
              </h2>
              <p>{content.introduction.text ?? ""}</p>
            </div>
          )}

          <div className="row g-4">
            {/* Contenu Principal */}
            <div className="col-md-9">
              {content.main_sections?.map((section, index) => (
                <section className="mb-5" key={index}>
                  <h3 className="text-danger fw-bold text-uppercase mb-3">
                    {section.title}
                  </h3>
                  <p className="mb-4">{section.text}</p>
                  {section.cta && (
                    <Link
                      href={`/${locale}/${game}${section.cta.link}`}
                      className="btn btn-primary text-white fw-bold"
                      target={
                        section.cta.link.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        section.cta.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {section.cta.text}
                    </Link>
                  )}
                </section>
              ))}
            </div>

            {/* Barre latérale */}
            <div className="col-md-3 px-4">
              {/* Advertisement */}
              <div className="gh_ad_container mb-4 w-100 rounded-4 overflow-hidden">
                <video autoPlay loop muted className="w-100">
                  <source src="/videos/rummy/ad1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {content.sidebar && (
                <div className="gh_cta_box rounded-4 p-4 text-white text-center w-100">
                  <Image
                    src={`/img/store/icon-${game}.webp`}
                    alt={`${game} Logo`}
                    width={100}
                    height={100}
                    className="rounded-4 border border-4 border-white mb-3"
                  />
                  <p className="fs-4 fw-bold">
                    {content.sidebar.cta_title ?? ""}
                  </p>
                  <p className="fs-5 mb-4">
                    {content.sidebar.cta_subtitle ?? ""}
                  </p>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {content.sidebar.buttons?.map((buttonText, index) => (
                      <button key={index} className="play-game-button">
                        {buttonText}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section "En savoir plus" */}
          {content.learn_more && (
            <div className="bg-white shadow-sm rounded-4 p-4 my-5">
              <h2 className="fw-bold mb-3">{content.learn_more.title ?? ""}</h2>
              <p className="mb-4">{content.learn_more.introduction ?? ""}</p>
            </div>
          )}
        </div>
        <MoreGamesSlider locale={locale} currentGame={game}></MoreGamesSlider>
      </>
    );
  } catch (error) {
    console.error("Error rendering game page:", error);
    return notFound();
  }
}
