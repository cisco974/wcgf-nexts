import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameService from '@services/gameService';
import PageHeader from '@app/components/PageHeader';
import { SupportedLocale } from '@/app/types';

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
      'tournaments',
      locale,
    );

    if (!pageData || !pageData.meta) {
      return {
        title: 'Page not found',
        description: 'The requested page could not be found.',
      };
    }

    const meta = pageData.meta;

    return {
      title: meta.title || `${game.charAt(0).toUpperCase() + game.slice(1)} Tournaments | WCGF`,
      description: meta.description || '',
      keywords: meta.keywords || '',
      openGraph: {
        title: meta.og_title || meta.title || '',
        description: meta.og_description || meta.description || '',
        images: meta.og_image ? [meta.og_image] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | WCGF',
      description: 'An error occurred while loading this page.',
    };
  }
}

export default async function TournamentsPage(props: { params: PageParams }) {
  const params = await props.params;
  const { locale, game } = params;

  try {
    const pageData = await GameService.getGamePageByLocale(
      game,
      'tournaments',
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
          activeTab="tournaments"
          gamePath={`/${locale}/${game}`}
        />

        <div className="container my-5">
          {/* Introduction Section */}
          {content.introduction && (
            <div className="mb-5">
              <h2 className="text-primary fw-bold mb-4">
                {content.introduction.title ?? 'Introduction'}
              </h2>
              <p className="lead">{content.introduction.text ?? ''}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="row">
            <div className="col-lg-9">
              {content.main_sections?.map((section, index) => (
                <section key={index} className="mb-5">
                  <h3 className="text-danger fw-bold mb-3">{section.title}</h3>
                  <p>{section.text}</p>
                  {section.cta && (
                    <a
                      href={section.cta.link}
                      className="btn btn-primary text-white fw-bold"
                    >
                      {section.cta.text}
                    </a>
                  )}
                </section>
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-lg-3">
              {content.sidebar && (
                <div className="gh_cta_box rounded-4 p-4 text-white text-center">
                  <img
                    src={`/img/store/icon-${game}.webp`}
                    alt={`${game} Logo`}
                    className="rounded-4 border border-4 border-white mb-3"
                    width={100}
                    height={100}
                  />
                  <p className="fs-4 fw-bold">{content.sidebar.cta_title ?? ''}</p>
                  <p className="fs-5 mb-4">
                    {content.sidebar.cta_subtitle ?? ''}
                  </p>
                  <div className="d-flex flex-column gap-3">
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
        </div>
      </>
    );
  } catch (error) {
    console.error('Error rendering tournaments page:', error);
    return notFound();
  }
}