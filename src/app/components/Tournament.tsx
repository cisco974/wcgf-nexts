"use client";
import React from "react";
import Image from "next/image";
import { TournamentEvent } from "../models/models";

// Props du composant
export type TournamentsSectionProps = {
  logo?: string;
  events?: TournamentEvent[];
  game?: string;
};

const TournamentsSection: React.FC<TournamentsSectionProps> = ({
  logo = "/images/super-tarot-multijoueur.png",
  events = [],
  game = "",
}) => {
  return (
    <div className="card border-0 shadow-sm p-3">
      <div className="tc_tournament-card rounded">
        <div className="tc_card-header border-0 text-center">
          <Image
            src={logo}
            alt="Game Logo"
            width={100}
            height={100}
            className="tc_tournament-logo"
          />
        </div>

        <div className="tc_event-slider w-100 pb-2 px-2">
          {events.map((event, index) => (
            <div key={index} className="tc_event-item rounded p-2 px-3 mb-3">
              <div className="d-flex align-items-center">
                <div className="tc_event-date me-3 d-flex flex-column justify-content-center">
                  <span className="fs-7 lh-1 fw-bold">{event.month}</span>
                  <span className="fs-4 lh-1 fw-bold">{event.day}</span>
                </div>
                <div className="tc_event-info d-flex flex-column justify-content-center">
                  <h4 className="mb-1 fs-5 fw-bold text-danger text-uppercase">
                    SUPER {event.title}
                  </h4>
                  <p className="mb-0 fw-bold text-primary">{event.subtitle}</p>
                </div>
                <div className="tc_event-icon ms-auto d-flex align-items-center">
                  <Image
                    src={event.icon}
                    alt={event.title}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-primary text-white text-uppercase">
          {game} TOURNAMENTS
        </button>
      </div>
    </div>
  );
};

export default TournamentsSection;
