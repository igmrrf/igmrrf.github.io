import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({ 
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const viewport: Viewport = {
  themeColor: "#030305",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "DevIcons — Developer Icon & Raw Asset CDN Registry",
    template: "%s | DevIcons",
  },
  description:
    "High-craft developer icon registry with 620+ Cryptocurrency and Social & Brand assets. Direct GitHub raw file access, jsDelivr CDN endpoints, and an interactive Neo-Glass web application.",
  keywords: [
    "icons",
    "developer icons",
    "cryptocurrency icons",
    "social icons",
    "tech logos",
    "svg icons",
    "github raw icons",
    "jsdelivr cdn icons",
    "crypto logos svg",
    "free svg icons",
    "react icons",
    "web design assets"
  ],
  authors: [{ name: "igmrrf", url: "https://github.com/igmrrf" }],
  creator: "igmrrf",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://igmrrf.github.io'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/icon.svg'],
    apple: [
      { url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://igmrrf.github.io",
    title: "DevIcons — Developer Icon & Raw Asset CDN Registry",
    description: "High-craft developer icon registry with 620+ Cryptocurrency and Social & Brand assets with direct GitHub raw file access and jsDelivr CDN endpoints.",
    siteName: "DevIcons",
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'DevIcons Brand Glyph',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevIcons — Developer Icon & Raw Asset CDN Registry",
    description: "High-craft developer icon registry with 620+ Cryptocurrency and Social & Brand assets with direct GitHub raw file access.",
    creator: "@igmrrf",
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DevIcons",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://igmrrf.github.io",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "High-craft developer icon registry with 620+ Cryptocurrency and Social & Brand assets with direct GitHub raw file access and jsDelivr CDN distribution.",
    "author": {
      "@type": "Person",
      "name": "igmrrf",
      "url": "https://github.com/igmrrf"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-mono bg-[#030305] text-[#e0e0e0] min-h-screen selection:bg-[#00f0ff] selection:text-[#030305]`}>
        {children}
      </body>
    </html>
  );
}
