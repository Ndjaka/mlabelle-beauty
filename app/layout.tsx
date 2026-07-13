import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
  src: [
    { path: "./fonts/manrope-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/manrope-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/manrope-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/manrope-700.ttf", weight: "700", style: "normal" },
  ],
});

const notoSerif = localFont({
  variable: "--font-noto-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
  src: [
    { path: "./fonts/noto-serif-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/noto-serif-700.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Mlabelle Beauty | Réservation en ligne",
  description: "Réservez votre séance de coiffure chez Mlabelle Beauty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${notoSerif.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
