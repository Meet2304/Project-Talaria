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
  openGraph: {
    title: "Talaria - Cardiovascular & Gait Analysis",
    description: "Integrated footwear system for concurrent cardiovascular and gait analysis",
    url: 'https://project-talaria.app', // Replace with your actual domain
    siteName: 'Talaria',
    images: [
      {
        url: '/public/images/Assets/Talaria Banner.png', // This will be your preview image
        width: 1200,
        height: 630,
        alt: 'Talaria - Cardiovascular & Gait Analysis Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Talaria - Cardiovascular & Gait Analysis",
    description: "Integrated footwear system for concurrent cardiovascular and gait analysis",
    images: ['/og-image.jpg'], // Same image for Twitter
  },
  metadataBase: new URL('https://project-talaria.app'), // Replace with your actual domain
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

