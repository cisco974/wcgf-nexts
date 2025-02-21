// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const availableLocales = {
        en: 'English',
        fr: 'Français',
        es: 'Español'
    };
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container-fluid">
                <div className="row my-3">
                    <div className="col text-center mb-4">
                        <Image
                            src="/img/wcgf-small.webp"
                            alt="WCGF Logo"
                            height={30}
                            width={248}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-10">
                        <div className="row g-2 justify-content-around">
                            {/* GAMES Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">GAMES</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">SUPER TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">SUPER RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">SUPER SCOPA</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* LEAGUES Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">LEAGUES</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">LEAGUES TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">LEAGUES RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">LEAGUES SCOPA</Link></li>
                                        <li className="mb-2"><Link href="#">ALL LEAGUES</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* TOURNAMENTS Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">TOURNAMENTS</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">SCOPA</Link></li>
                                        <li className="mb-2"><Link href="#">ALL</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* RANKINGS Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">RANKINGS</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">RANKINGS TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">RANKINGS RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">RANKINGS SCOPA</Link></li>
                                        <li className="mb-2"><Link href="#">ALL RANKINGS</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* RULES Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">RULES</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">RULES TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">RULES RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">RULES SCOPA</Link></li>
                                        <li className="mb-2"><Link href="#">ALL RULES</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* PLAY Section */}
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="footer-column-content text-white-50 text-center text-md-start">
                                    <h3 className="mb-3 text-danger fw-bold">PLAY</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><Link href="#">PLAY TAROT</Link></li>
                                        <li className="mb-2"><Link href="#">PLAY RUMMY</Link></li>
                                        <li className="mb-2"><Link href="#">PLAY SCOPA</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 fs-6">
                    <div className="col-md-12 text-center">
                        <div className="game-logos mb-4">
                            <Image
                                loading="lazy"
                                src="/img/footer/logo-tarot-s.webp"
                                alt="Logo Tarot"
                                className="mx-2"
                                height={60}
                                width={120}
                            />
                            <Image
                                loading="lazy"
                                src="/img/footer/logo-rummy-s.webp"
                                alt="Logo Rummy"
                                className="mx-2"
                                height={50}
                                width={100}
                            />
                            <Image
                                loading="lazy"
                                src="/img/footer/logo-scopa-s.webp"
                                alt="Logo Scopa"
                                className="mx-2"
                                height={50}
                                width={100}
                            />
                        </div>
                        <p className="text-white-50 mx-auto w-50">
                            At the World Card Games Federation (WCGF), we emphasize the competitive nature of card games by
                            providing detailed statistics on leagues, rankings, tournaments and players. Our vision is to become
                            the official representative of card game leagues worldwide, fostering excellence and recognition in
                            the community.
                        </p>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="row">
                    <div className="col-md-12 text-center">
                        <div className="mb-3">
                            <Link href="#" className="text-white-50 mx-2">Terms and Conditions</Link>
                            <span className="text-white-50">|</span>
                            <Link href="#" className="text-white-50 mx-2">Privacy Policy</Link>
                            <span className="text-white-50">|</span>
                            <Link href="#" className="text-white-50 mx-2">Contact</Link>
                        </div>
                        <div className="language-flags mb-3">
                            {Object.entries(availableLocales).map(([locale, language]) => (
                                <Link href="#" className="text-decoration-none mx-2" key={locale}>
                                    <Image
                                        loading="lazy"
                                        src={`/img/flag/${locale}.svg`}
                                        alt={language}
                                        height={20}
                                        width={30}
                                    />
                                    <span className="text-white-50 ms-1">{language}</span>
                                </Link>
                            ))}
                        </div>
                        <p className="text-white-50 mb-0">&copy; {currentYear} World Card Games Federation. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;