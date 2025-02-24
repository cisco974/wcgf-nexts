// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss"; // Changed from CSS to SCSS
import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Font configuration
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Card Games Federation",
  description:
    "Discover leagues, tournaments and rankings for your favorite card games",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "World Card Games Federation",
    description:
      "Discover leagues, tournaments and rankings for your favorite card games",
    url: "https://worldcardgamefederation.com",
    siteName: "WCGF",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-100">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-brands/css/uicons-brands.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css"
        />
      </head>
      <body
        className={`d-flex flex-column min-h-100 bg-light ${inter.className}`}
      >
        <a href="#main-content" className="visually-hidden-focusable">
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-shrink-0 container">
          {children}
        </main>

        <Footer />

        {/* Bootstrap JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
