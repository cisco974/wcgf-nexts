"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.scss";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  // Extraire la locale du chemin URL (format: /[locale]/...)
  useEffect(() => {
    const pathParts = pathname?.split("/").filter(Boolean);
    if (pathParts && pathParts.length > 0) {
      const firstPart = pathParts[0];
      if (["en", "fr", "es"].includes(firstPart)) {
        setCurrentLocale(firstPart);
      }
    }
  }, [pathname]);

  // Changer de langue tout en préservant le chemin actuel
  const changeLanguage = (newLocale: string) => {
    if (!pathname) return;

    // Extraire les parties du chemin actuel
    const pathParts = pathname.split("/").filter(Boolean);

    // Vérifier si la première partie est une locale
    if (pathParts.length > 0 && ["en", "fr", "es"].includes(pathParts[0])) {
      // Remplacer la première partie (locale) par la nouvelle locale
      pathParts[0] = newLocale;
    } else {
      // Pas de locale dans le chemin, ajouter la nouvelle locale au début
      pathParts.unshift(newLocale);
    }

    // Reconstruire le chemin avec la nouvelle locale
    const newPath = `/${pathParts.join("/")}`;
    router.push(newPath);
  };

  return (
    <>
      {/* Top Bar */}
      <div className={styles["top-bar"] + " px-3 py-1"}>
        <div className="d-flex justify-content-between align-items-center">
          {/* Left menu */}
          <div className="d-flex gap-5">
            <Link href="#" className={styles["top-link"]}>
              ABOUT US
            </Link>
            <Link href="#" className={styles["top-link"]}>
              FAQ
            </Link>
          </div>

          {/* Right menu */}
          <div className="d-flex align-items-center gap-4">
            <Link
              href="#"
              className={
                styles["top-link"] + " " + styles["top-link-feedback"] + " p-1"
              }
            >
              GIVE FEEDBACK
            </Link>

            {/* Language dropdown - Updated for dynamic routing */}
            <div className="dropdown">
              <button
                className={
                  "btn dropdown-toggle " +
                  styles["top-link"] +
                  " px-0 fs-8 d-flex align-items-center gap-2"
                }
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  src={`/img/flag/${currentLocale}.svg`}
                  alt={currentLocale.toUpperCase()}
                  width={20}
                  height={15}
                />
                {currentLocale.toUpperCase()}
                <i className="fi fi-rr-angle-small-down mt-1 fs-6"></i>
              </button>
              <ul
                className={
                  "dropdown-menu dropdown-menu-end dropdown-menu-dark fs-8 " +
                  styles["dropdown-menu"]
                }
              >
                <li>
                  <button
                    className={
                      "dropdown-item d-flex align-items-center gap-2 " +
                      styles["dropdown-item"]
                    }
                    onClick={() => changeLanguage("en")}
                  >
                    <Image
                      src="/img/flag/en.svg"
                      alt="EN"
                      width={20}
                      height={15}
                    />
                    EN
                  </button>
                </li>
                <li>
                  <button
                    className={
                      "dropdown-item d-flex align-items-center gap-2 " +
                      styles["dropdown-item"]
                    }
                    onClick={() => changeLanguage("fr")}
                  >
                    <Image
                      src="/img/flag/fr.svg"
                      alt="FR"
                      width={20}
                      height={15}
                    />
                    FR
                  </button>
                </li>
                <li>
                  <button
                    className={
                      "dropdown-item d-flex align-items-center gap-2 " +
                      styles["dropdown-item"]
                    }
                    onClick={() => changeLanguage("es")}
                  >
                    <Image
                      src="/img/flag/es.svg"
                      alt="ES"
                      width={20}
                      height={15}
                    />
                    ES
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        id="main-navbar"
        className={
          styles["main-nav"] +
          " navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-3 z-3"
        }
      >
        <Link className="navbar-brand" href={`/${currentLocale}`}>
          <Image
            src="/img/wcgf-small.webp"
            alt="WCGF Logo"
            width={248}
            height={30}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto align-items-center gap-4 fs-4 fw-bold">
            {/* GAMES Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className={
                  styles["nav-link"] +
                  " text-white d-inline-flex align-items-center gap-2"
                }
                href={`/${currentLocale}/games`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fi fi-rr-spade fs-3 fw-bold"></i>
                <span className="fs-5 fw-bold">GAMES</span>
                <i className="fi fi-rr-angle-small-down mt-1 fs-6"></i>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/tarot`}
                  >
                    <Image
                      src="/img/store/icon-tarot.webp"
                      alt="Tarot Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Super Tarot</strong>
                      <small className="text-muted">
                        the popular French game
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/rummy`}
                  >
                    <Image
                      src="/img/store/icon-rummy.webp"
                      alt="Rummy Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Super Rummy</strong>
                      <small className="text-muted">The world rummy game</small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/scopa`}
                  >
                    <Image
                      src="/img/store/icon-scopa.webp"
                      alt="Scopa Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Super Scopa</strong>
                      <small className="text-muted">
                        the Italian famous game
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    href={`/${currentLocale}/games`}
                  >
                    <strong>All Games</strong>
                    <i className="fi fi-rr-angle-right"></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* EVENTS Link */}
            <li className="nav-item">
              <Link
                className={styles["nav-link"] + " d-flex align-items-center"}
                href={`/${currentLocale}/events`}
              >
                <i className="fi fi-rr-calendar-lines fs-3 me-2"></i>
                EVENTS
              </Link>
            </li>

            {/* LEAGUES Dropdown */}
            <li className="nav-item dropdown d-flex align-items-center">
              <Link
                className={
                  styles["nav-link"] + " d-flex align-items-center gap-2"
                }
                href={`/${currentLocale}/leagues`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fi fi-rr-club fs-3"></i>
                <span className="fs-5 fw-bold">LEAGUES</span>
                <i className="fi fi-rr-angle-small-down mt-1 fs-6"></i>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/tarot/leagues`}
                  >
                    <Image
                      src="/img/store/icon-tarot.webp"
                      alt="Tarot Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Tarot Leagues</strong>
                      <small className="text-muted">
                        Top Tarot&#39;s players
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/rummy/leagues`}
                  >
                    <Image
                      src="/img/store/icon-rummy.webp"
                      alt="Rummy Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Rummy Leagues</strong>
                      <small className="text-muted">
                        Top Rummy&#39;s players
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href={`/${currentLocale}/scopa/leagues`}
                  >
                    <Image
                      src="/img/store/icon-scopa.webp"
                      alt="Scopa Icon"
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column">
                      <strong>Scopa Leagues</strong>
                      <small className="text-muted">
                        Top Scopa&#39;s players
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    href={`/${currentLocale}/leagues`}
                  >
                    <strong>All Leagues</strong>
                    <i className="fi fi-rr-angle-right"></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* ARTICLES Link */}
            <li className="nav-item">
              <Link
                className={styles["nav-link"] + " d-flex align-items-center"}
                href={`/${currentLocale}/articles`}
              >
                <i className="fi fi-rr-document fs-3 me-2"></i>
                ARTICLES
              </Link>
            </li>
          </ul>

          {/* PLAY TAROT Button */}
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link
                href="https://webgl.tradigames.com/?g=tarot"
                className="play-game-button text-uppercase"
                target="_blank"
                rel="noopener noreferrer"
              >
                Play Tarot
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
