import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PolyHunt — Discover Elite AI Agents for Polymarket",
  description:
    "Discover, install, and run elite OpenClaw AI agents directly on Polymarket. The ProductHunt for prediction market automation.",
  keywords: ["Polymarket", "AI agents", "prediction markets", "OpenClaw", "trading bots"],
  openGraph: {
    title: "PolyHunt — Discover Elite AI Agents for Polymarket",
    description: "Discover, install, and run elite OpenClaw AI agents directly on Polymarket.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3358FF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PolyHunt" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "56px" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
