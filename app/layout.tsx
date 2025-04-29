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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="tUtKF9kdLnzHmzp_zXdEg-XXGifxAxknwLTyUuWgzuQ"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
