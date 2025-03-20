import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GameService from "@services/gameService";
import PageHeader from "@app/components/PageHeader";
import { SupportedLocale } from "@/app/types";
import MoreGamesSlider from "@app/components/MoreGamesSlider";
import styles from "@styles/GameRulesPage.module.scss";
import SectionHeader from "@app/components/SectionHeader";
import CtaBox from "@app/components/CtaBox";
import SectionContent from "@app/components/SectionContentPage";

// Types for page params
type PageParams = Promise<{
  locale: SupportedLocale;
  game: string;
}>;

// Revalidate every hour
export const revalidate = 3600;

// Generate dynamic metadata
export async function generateMetadata(props: {
  params: PageParams;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale, game } = params;

  try {
    const pageData = await GameService.getGamePageByLocale(
      game,
      "rules",
      locale,
    );

    if (!pageData || !pageData.meta) {
      return {
        title: "Page not found",
        description: "The requested page could not be found.",
      };
    }

    const meta = pageData.meta;

    return {
      title:
        meta.title ||
        `${game.charAt(0).toUpperCase() + game.slice(1)} Rules | WCGF`,
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

export default async function RulesPage(props: { params: PageParams }) {
  const params = await props.params;
  const { locale, game } = params;

  try {
    const pageData = await GameService.getGamePageByLocale(
      game,
      "rules",
      locale,
    );

    if (!pageData || !pageData.content) {
      return notFound();
    }

    const content = pageData.content;

    return (
      <>
        <PageHeader
          type="game"
          background={`/img/header/header-${game}.jpg`}
          title={content.page_header?.title ?? game.toUpperCase()}
          logo={`/img/${game}/logo.png`}
          activeTab="rules"
          gamePath={`/${locale}/${game}`}
        />

        <div className="container my-5">
          <SectionHeader
            title={content.introduction?.title}
            subtitle={content.introduction?.text}
          />

          <div className="row">
            {/* Main Content */}
            <div className="col-lg-9">
              <div className={styles.tr_content}>
                {content.main_sections?.map((section, i) => (
                  <SectionContent
                    key={`section-${i}`}
                    section={section}
                    locale={locale}
                    game={game}
                    headingTag={i === 0 ? "h3" : "h4"}
                    className="mb-5"
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-3">
              {/* Advertisement */}
              <div className="rounded-4 overflow-hidden shadow-sm mb-4 transition">
                <video autoPlay loop muted className="w-100">
                  <source src={`/videos/${game}/ad1.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <CtaBox game={game} sidebarContent={content.sidebar} />
            </div>
          </div>
          <MoreGamesSlider locale={locale} currentGame={game} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error rendering rules page:", error);
    return notFound();
  }
}
