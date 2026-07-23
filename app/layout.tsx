import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "DevIcons | System",
  description:
    "A high-craft developer icon repository merging native web capabilities with structural aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body className={`font-mono bg-[#030305] text-[#e0e0e0] min-h-screen selection:bg-[#00f0ff] selection:text-[#030305]`}>
        {children}
      </body>
    </html>
  );
}
