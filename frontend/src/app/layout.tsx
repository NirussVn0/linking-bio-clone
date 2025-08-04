import SkipLink from "@/components/accessibility/SkipLink";
import WebVitals from "@/components/performance/WebVitals";
import Navigation from "@/components/ui/Navigation";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gun.lol Clone - Modern Interactive Web Experience",
  description: "A modern, interactive web application inspired by gun.lol with stunning 3D visuals, smooth animations, and cutting-edge design.",
  keywords: ["interactive", "3D", "modern", "web app", "animations", "design"],
  authors: [{ name: "Gun.lol Clone Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  openGraph: {
    title: "Gun.lol Clone - Modern Interactive Web Experience",
    description: "A modern, interactive web application inspired by gun.lol with stunning 3D visuals, smooth animations, and cutting-edge design.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gun.lol Clone - Modern Interactive Web Experience",
    description: "A modern, interactive web application inspired by gun.lol with stunning 3D visuals, smooth animations, and cutting-edge design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
      >
        <SkipLink />
        <Navigation />
        <main id="main-content" role="main">
          {children}
        </main>
        <WebVitals />
      </body>
    </html>
  );
}
