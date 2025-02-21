import React from 'react';
import Image from 'next/image';

type Platform = {
    name: string;
    icon: string;
    class?: string;
    url?: string;
};

type GameCardProps = {
    image: string;
    title: string;
    icon: string;
    subtitle: string;
    platforms: Platform[];
};

const GameCard: React.FC<GameCardProps> = ({
                                               image,
                                               title,
                                               icon,
                                               subtitle,
                                               platforms = []
                                           }) => {
    return (
        <div className="card border-0 rounded-4 h-100 game-card">
            {/* Padding wrapper for image */}
            <div className="p-3 position-relative">
                {/* Image container with rounded corners */}
                <div className="rounded-4 overflow-hidden">
                    {/* Background Gradient Overlay */}
                    <div className="position-absolute w-100 h-100   z-1"></div>

                    {/* Game Header Image */}
                    <Image
                        src={image}
                        className="w-100 object-fit-cover"
                        alt={title}
                        width={400}
                        height={200}
                        priority={false}
                    />
                </div>

                {/* Game Icon - Moved outside the overflow-hidden container */}
                <div className="position-absolute start-50 translate-middle-x z-1" style={{ bottom: '-0.5rem' }}>
                    <Image
                        src={icon}
                        className="rounded-4 border border-4 border-white"
                        alt={`${title} Icon`}
                        width={88}
                        height={88}
                    />
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body text-center pt-2">
                <h3 className="text-danger fw-bold mb-4 text-uppercase">{title}</h3>
                <p className="fs-5 mb-4">{subtitle}</p>

                {/* Platform Buttons */}
                <div className="d-flex gap-1 justify-content-center flex-wrap platform-buttons">
                    {platforms.map((platform, index) => (
                        <a
                            key={index}
                            href={platform.url || '#'}
                            className={`btn btn-primary py-2 fw-bold platform-btn text-white ${platform.class || ''}`}
                        >
                            {platform.icon === 'fi-brands-apple' && <i className="fi fi-brands-apple me-2"></i>}
                            {platform.icon === 'fi-brands-android' && <i className="fi fi-brands-android me-2"></i>}
                            {platform.icon === 'fi-ss-spade' && <i className="fi fi-ss-spade me-2"></i>}
                            {platform.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameCard;