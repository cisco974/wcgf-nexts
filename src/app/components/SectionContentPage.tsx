import React, { JSX } from "react";
import Link from "next/link";

export interface SectionItem {
  title: string;
  text: string;
  cta?: {
    link: string;
    text: string;
  };
}

export interface SectionContentProps {
  section: SectionItem;
  locale: string;
  game: string;
  headingTag?: "h2" | "h3" | "h4" | "h5";
  headingColor?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "info"
    | "warning"
    | "dark";
  className?: string;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  locale,
  game,
  headingTag = "h3",
  headingColor,
  className = "",
}) => {
  // Destructure section object
  const { title, text, cta } = section;

  // Dynamically render the heading based on headingTag prop
  const Heading = headingTag as keyof JSX.IntrinsicElements;

  // Determine color and font weight based on heading tag
  const color = headingColor || (headingTag === "h3" ? "danger" : "primary");
  const fontWeight = headingTag === "h3" ? "fw-bold" : "";

  return (
    <section className={className}>
      <Heading
        className={`text-${color} ${fontWeight} text-uppercase mb-3`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="mb-4 lead" dangerouslySetInnerHTML={{ __html: text }} />
      {cta && (
        <Link
          href={
            cta.link.startsWith("/")
              ? `/${locale}/${game}${cta.link}`
              : cta.link
          }
          className="btn btn-primary text-white fw-bold"
          target={cta.link.startsWith("http") ? "_blank" : undefined}
          rel={cta.link.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {/* Support HTML in CTA text too */}
          <span dangerouslySetInnerHTML={{ __html: cta.text }} />
        </Link>
      )}
    </section>
  );
};

export default SectionContent;
