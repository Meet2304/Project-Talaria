import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talaria - Cardiovascular & Gait Analysis",
  description: "Integrated footwear system for concurrent cardiovascular and gait analysis",
  icons: {
    icon: '/images/Assets/favicon.ico',
    shortcut: '/images/Assets/favicon.ico',
    apple: '/images/Assets/Talaria_Logo_TR.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

