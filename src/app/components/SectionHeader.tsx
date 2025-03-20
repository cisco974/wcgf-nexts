import React from "react";
import Image from "next/image";

type SectionHeaderProps = {
  title: string | undefined;
  subtitle?: string | undefined;
  showIcon?: boolean;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title = "",
  subtitle = "",
  showIcon = true,
}) => {
  return (
    <div className="section-header">
      <h2 className="display-6 fw-bold mb-3 d-flex align-items-center gap-2 text-uppercase">
        {showIcon && (
          <Image src="/img/icon.png" alt="WCGF Icon" width={24} height={24} />
        )}
        {title}
      </h2>
      {subtitle && <p className="lead">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
