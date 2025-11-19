import type { Metadata } from "next";

import { Martian_Mono, Schibsted_Grotesk } from "next/font/google";

import LightRays from "@/components/LightRays";
import Navbar from "./components/Navbar";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased flex pt-[72px] xxl:pt-[82px] flex-col gap-[50px] xxl:gap-[100px] items-center`}
      >
        <div className="inset-0 fixed z-[-1]">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={15}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
