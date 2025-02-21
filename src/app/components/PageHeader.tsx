"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

type Event = {
  title: string;
  subtitle: string;
  icon: string;
  month: string;
  day: string;
  buyin: string;
};

type PageHeaderProps = {
  type?: string;
  events?: Event[];
  background?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  type = "home",
  events = [],
  background = "/img/header.jpg",
}) => {
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const fixPartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeader = pageHeaderRef.current;
      const fixPart = fixPartRef.current;
      const navbar = document.querySelector(".main-nav");

      if (!pageHeader || !fixPart || !navbar) {
        console.warn("Required elements not found");
        return;
      }

      const navbarHeight = navbar.clientHeight;
      const pageHeaderHeight = pageHeader.clientHeight;
      const fixPartInitialHeight = fixPart.clientHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > navbarHeight) {
        pageHeader.classList.add("sticky");
        pageHeader.style.top = `-${pageHeaderHeight - fixPartInitialHeight - navbarHeight - 20}px`;
      } else {
        pageHeader.classList.remove("sticky");
        pageHeader.style.top = "";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollEvents = (direction: number) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (type === "home") {
    return (
      <header
        className="page-header z-2"
        ref={pageHeaderRef}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('${background}') no-repeat top -80px center`,
          backgroundSize: "cover",
          overflow: "hidden",
          borderBottom: "solid 8px #f3004e",
        }}
      >
        <div className="container py-5 pb-2">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="text-white fw-bold mb-3 fs-2">
                WORLD CARD GAMES FEDERATION
              </h2>
              <p className="text-white fs-3 my-4">
                Welcome to WCGF.com, our Hub for Competitive Card Games
                <br />
                Discover leagues, tournaments and rankings
              </p>
            </div>
            <div className="row fix-part" ref={fixPartRef}>
              {events.length > 0 && (
                <div className="col-12 container">
                  <div className="tournament-carousel mx-4 d-flex align-items-center">
                    <button
                      className="my-2 btn btn-primary carousel-button prev z-3"
                      type="button"
                      onClick={() => scrollEvents(-1)}
                    >
                      <Image
                        src="/img/icons/down-white.webp"
                        width={40}
                        height={26}
                        alt="<"
                      />
                    </button>

                    <div
                      className="tournament-cards-container text-uppercase gap-2 d-flex flex-nowrap overflow-auto"
                      ref={containerRef}
                    >
                      {events.map((event, index) => (
                        <div
                          className="tournament-card flex-shrink-0"
                          key={index}
                        >
                          <div className="date fw-bold d-flex flex-column justify-content-center align-items-center rounded">
                            <small className="fs-7 lh-1">{event.month}</small>
                            <span className="fs-4 lh-1">{event.day}</span>
                          </div>

                          <div className="pt-0">
                            <div className="text-danger fw-bold fs-5 lh-1">
                              {event.title}
                            </div>
                            <div className="players text-capitalize lh-1">
                              {event.subtitle}
                            </div>
                            <span className="points rounded-pill lh-1">
                              {event.buyin}
                            </span>
                          </div>

                          <Image
                            src={event.icon}
                            alt={event.title}
                            width={54}
                            height={54}
                            className="d-flex flex-column justify-content-center align-items-center rounded"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn-primary carousel-button next"
                      type="button"
                      onClick={() => scrollEvents(1)}
                    >
                      <Image
                        src="/img/icons/down-white.webp"
                        width={40}
                        height={26}
                        alt=">"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="page-header z-2"
      ref={pageHeaderRef}
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('${background}') no-repeat top -80px center`,
        backgroundSize: "cover",
        overflow: "hidden",
        borderBottom: "solid 8px #f3004e",
      }}
    >
      {/* Other header types would be rendered here if needed */}
    </header>
  );
};

export default PageHeader;
