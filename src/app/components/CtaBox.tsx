// components/GameCtaBox.tsx
import React from "react";
import Image from "next/image";
import { SidebarContent } from "@app/types";

// Define the type for the sidebar content

// Props for the GameCtaBox component
export interface GameCtaBoxProps {
  game: string;
  sidebarContent?: SidebarContent;
}

const CtaBox: React.FC<GameCtaBoxProps> = ({ game, sidebarContent }) => {
  return (
    <div className={`gh_cta_box rounded-4 p-4 text-white text-center w-100  `}>
      <Image
        src={`/img/store/icon-${game}.webp`}
        alt={`${game} Logo`}
        width={100}
        height={100}
        className="rounded-4 border border-4 border-white mb-3"
      />
      <p className="fs-4 fw-bold">{sidebarContent?.cta_title ?? ""}</p>
      <p className="fs-5 mb-4">{sidebarContent?.cta_subtitle ?? ""}</p>

      <div className="d-flex flex-column gap-3 mb-4">
        {sidebarContent?.buttons?.map((buttonText, index) => (
          <button key={index} className="play-game-button">
            {buttonText}
          </button>
        ))}
      </div>

      {sidebarContent?.partner_text && (
        <p className="text-sm">{sidebarContent.partner_text}</p>
      )}
      <Image
        src="/img/wcgf-white-small.webp"
        alt={"Wcgf Partner"}
        height={20}
        width={89}
      />
    </div>
  );
};

export default CtaBox;
