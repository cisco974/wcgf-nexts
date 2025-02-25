"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "./PageHeader";

const Navbar = () => {
  const events = [
    {
      title: "Tarot",
      subtitle: "4 players",
      icon: "/img/store/icon-tarot.webp",
      month: "MAY",
      day: "02",
      buyin: "250",
    },
    {
      title: "Rummy 500",
      subtitle: "2 players",
      icon: "/img/store/icon-rummy500.webp",
      month: "MAY",
      day: "04",
      buyin: "500",
    },
    {
      title: "Rummy",
      subtitle: "3 players",
      icon: "/img/store/icon-rummy.webp",
      month: "MAY",
      day: "06",
      buyin: "1000",
    },
    {
      title: "Tarot",
      subtitle: "5 players",
      icon: "/img/store/icon-tarot.webp",
      month: "MAY",
      day: "08",
      buyin: "500",
    },
    {
      title: "Rummy 500",
      subtitle: "4 players",
      icon: "/img/store/icon-rummy500.webp",
      month: "MAY",
      day: "10",
      buyin: "1000",
    },
    {
      title: "Tarot",
      subtitle: "4 players",
      icon: "/img/store/icon-tarot.webp",
      month: "MAY",
      day: "02",
      buyin: "250",
    },
    {
      title: "Rummy 500",
      subtitle: "2 players",
      icon: "/img/store/icon-rummy500.webp",
      month: "MAY",
      day: "04",
      buyin: "500",
    },
    {
      title: "Rummy",
      subtitle: "3 players",
      icon: "/img/store/icon-rummy.webp",
      month: "MAY",
      day: "06",
      buyin: "1000",
    },
    {
      title: "Tarot",
      subtitle: "5 players",
      icon: "/img/store/icon-tarot.webp",
      month: "MAY",
      day: "08",
      buyin: "500",
    },
    {
      title: "Rummy 500",
      subtitle: "4 players",
      icon: "/img/store/icon-rummy500.webp",
      month: "MAY",
      day: "10",
      buyin: "1000",
    },
  ];
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar px-3 py-1">
        <div className="d-flex justify-content-between align-items-center">
          {/* Left menu */}
          <div className="d-flex gap-5">
            <Link href="#" className="top-link">
              ABOUT US
            </Link>
            <Link href="#" className="top-link">
              FAQ
            </Link>
          </div>

          {/* Right menu */}
          <div className="d-flex align-items-center gap-4">
            <Link href="#" className="top-link top-link-feedback p-1">
              GIVE FEEDBACK
            </Link>

            {/* Language dropdown */}
            <div className="dropdown">
              <button
                className="btn dropdown-toggle top-link px-0 fs-8 d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image src="/img/flag/en.svg" alt="EN" width={20} height={15} />
                EN
                <i className="fi fi-rr-angle-small-down mt-1 fs-6"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark fs-8">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    href="/locale/en"
                  >
                    <Image
                      src="/img/flag/en.svg"
                      alt="EN"
                      width={20}
                      height={15}
                    />
                    EN
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    href="/locale/fr"
                  >
                    <Image
                      src="/img/flag/fr.svg"
                      alt="FR"
                      width={20}
                      height={15}
                    />
                    FR
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    href="/locale/es"
                  >
                    <Image
                      src="/img/flag/es.svg"
                      alt="ES"
                      width={20}
                      height={15}
                    />
                    ES
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-3 z-3">
        <Link className="navbar-brand" href="/">
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
                className="nav-link text-white d-inline-flex align-items-center gap-2"
                href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
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
                    href="#"
                  >
                    <strong>All Games</strong>
                    <i className="fi fi-rr-angle-right"></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* EVENTS Link */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" href="#">
                <i className="fi fi-rr-calendar-lines fs-3 me-2"></i>
                EVENTS
              </Link>
            </li>

            {/* LEAGUES Dropdown */}
            <li className="nav-item dropdown d-flex align-items-center">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="#"
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
                    href="#"
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
                        Top Tarot&#39;ss players
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href="#"
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
                        Top Rummy&#39;ss players
                      </small>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-3 py-2"
                    href="#"
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
                        Top Scopa&#39;ss players
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
                    href="#"
                  >
                    <strong>All Games</strong>
                    <i className="fi fi-rr-angle-right"></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* ARTICLES Link */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" href="#">
                <i className="fi fi-rr-document fs-3 me-2"></i>
                ARTICLES
              </Link>
            </li>
          </ul>

          {/* PLAY TAROT Button */}
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link href="#" className="play-game-button text-uppercase">
                Play Tarot
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <PageHeader type="home" events={events} background="/img/header.jpg" />
    </>
  );
};

export default Navbar;
