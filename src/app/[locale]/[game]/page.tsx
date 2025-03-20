// app/[locale]/[game]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameService from "../../../services/gameService";
import PageHeader from "@app/components/PageHeader";
import { SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";
import SectionHeader from "@app/components/SectionHeader";
import CtaBox from "@app/components/CtaBox";
import SectionContent from "@app/components/SectionContentPage";
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
      "home",
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
      "home",
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
            <SectionHeader
              title={content.introduction?.title}
              subtitle={content.introduction?.text}
            />
          )}

          <div className="row g-4">
            {/* Contenu Principal */}
            <div className="col-md-9">
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

            {/* Barre latérale */}
            <div className="col-md-3 px-4">
              {/* Advertisement */}
              <div className="rounded-4 overflow-hidden shadow-sm mb-4 transition">
                <video autoPlay loop muted className="w-100">
                  <source src={`/videos/${game}/ad1.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {content.sidebar && (
                <CtaBox game={game} sidebarContent={content.sidebar}></CtaBox>
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
          <MoreGamesSlider locale={locale} currentGame={game}></MoreGamesSlider>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error rendering game page:", error);
    return notFound();
  }
}
