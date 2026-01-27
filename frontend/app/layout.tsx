import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://numeros.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Numeros - Cosmic Compatibility Through Numbers & Stars",
    template: "%s | Numeros",
  },
  description: "Discover your deepest compatibility patterns through numerology and astrology. Calculate your Life Path, Soul Urge, Expression, and Personality numbers free.",
  keywords: [
    "numerology calculator",
    "life path number",
    "astrology birth chart",
    "compatibility",
    "soul urge number",
    "expression number",
    "personality number",
    "cosmic compatibility",
    "numerology meanings",
    "free numerology reading",
  ],
  authors: [{ name: "Numeros" }],
  creator: "Numeros",
  publisher: "Numeros",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Numeros",
    title: "Numeros - Cosmic Compatibility Through Numbers & Stars",
    description: "Your numbers know who you're looking for. Calculate your numerology profile free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Numeros - Cosmic Compatibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numeros - Cosmic Compatibility",
    description: "Your numbers know who you're looking for.",
    images: ["/og-image.png"],
    creator: "@numerosapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0c0a1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload fonts for performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bgDeep text-white font-sans selection:bg-accentViolet/30 selection:text-white overflow-x-hidden antialiased">
        <Navbar />
        <main className="flex-grow pt-[80px]">
          {children}
        </main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1533',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}
