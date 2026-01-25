import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circuit AI - Interactive Circuit Design Tool",
  description: "Create, simulate, and analyze electronic circuits with AI-powered tools. Design digital and analog circuits easily with our interactive platform.",
  keywords: "circuit design, electronic circuits, AI circuit creator, digital circuits, analog circuits, circuit simulation, circuit analysis, electronics learning tool",
  verification: {
    google: "tUtKF9kdLnzHmzp_zXdEg-XXGifxAxknwLTyUuWgzuQ",
  },
  openGraph: {
    title: "Circuit AI - AI-Powered Circuit Creator",
    description: "Design and simulate electronic circuits with advanced AI assistance. The perfect tool for students, hobbyists, and professionals.",
    type: "website",
  },
};

import Navbar from "@/components/Navbar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="tUtKF9kdLnzHmzp_zXdEg-XXGifxAxknwLTyUuWgzuQ"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}
      >
        <Navbar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="w-full py-6 text-center border-t border-border bg-card">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Powered by DigitalJS & Gemini AI
              <a href="https://www.producthunt.com/posts/circuitai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-circuitai" target="_blank" rel="noopener noreferrer">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=958872&theme=light&t=1745907417856" alt="CircuitAi - Instantly Create Digital Logic Circuits with AI | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
              </a>
            </div>
            <div className="text-sm font-medium">
              Created by <a href="https://github.com/KshKnsl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kush Kansal</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
