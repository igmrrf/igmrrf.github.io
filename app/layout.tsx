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
    default: "DevIcons | System",
    template: "%s | DevIcons",
  },
  description:
    "A high-craft developer icon repository merging native web capabilities with structural aesthetics.",
  keywords: ["icons", "developer icons", "svg", "react icons", "web design", "ui components"],
  authors: [{ name: "DevIcons" }],
  creator: "DevIcons",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://devicons.system'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "DevIcons | System",
    description: "A high-craft developer icon repository merging native web capabilities with structural aesthetics.",
    siteName: "DevIcons",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevIcons | System",
    description: "A high-craft developer icon repository merging native web capabilities with structural aesthetics.",
    creator: "@devicons",
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
    "@type": "WebSite",
    "name": "DevIcons | System",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://devicons.system",
    "description": "A high-craft developer icon repository merging native web capabilities with structural aesthetics.",
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
