// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Script from "next/script";

import { cookies } from "next/headers";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    apple: { url: "/apple-touch-icon.png" },
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "World Card Games Federation",
    description:
      "Discover leagues, tournaments and rankings for your favorite card games",
    url: "https://wcgf.com",
    siteName: "WCGF",
    type: "website",
  },
};

// Layout normal du site
const NormalLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-100">
    <head>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
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
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      />
    </body>
  </html>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Si pas en maintenance, retourner directement le site normal
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== "true") {
    return <NormalLayout>{children}</NormalLayout>;
  }

  // Si en maintenance, vérifier le cookie
  const cookieStore = await cookies();
  const maintenanceCookie = cookieStore.get("maintenance-bypass");

  // Si le cookie est présent, retourner le site normal
  if (maintenanceCookie) {
    return <NormalLayout>{children}</NormalLayout>;
  }

  // Sinon afficher la page de maintenance
  return (
    <html lang="en">
      <head>
        <title>WCGF</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: url('/img/header.jpg') no-repeat center center fixed;
            background-size: cover;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
          .logo {
            width: 500px;
          }
          .mainteance-footer {
            position: absolute;
            bottom: 20px;
            text-align: center;
            width: 100%;
            color: white;
            font-size: 14px;
          }
          @media (max-width: 768px) {
            .logo { width: 70%; }
            .mainteance-footer { font-size: 12px; }
          }
          @media (max-width: 480px) {
            .logo { width: 90%; }
            .mainteance-footer { font-size: 10px; }
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="logo-container">
          <Image
            src="/img/logo.png"
            alt="Logo WCGF"
            className="logo"
            priority
            width={500}
            height={112}
          />
        </div>
        <div className="mainteance-footer">&copy; 2025 WCGF</div>{" "}
      </body>
    </html>
  );
}
