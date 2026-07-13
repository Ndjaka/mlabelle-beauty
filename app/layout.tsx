import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import {
  CLIENT_MANIFEST_PATH,
  CLIENT_PWA_APP_NAME,
  CLIENT_PWA_DESCRIPTION,
  CLIENT_PWA_SHORT_NAME,
} from "@/features/pwa/utils";
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
  applicationName: CLIENT_PWA_APP_NAME,
  title: {
    default: "Mlabelle Beauty | Réservation en ligne",
    template: "%s | Mlabelle Beauty",
  },
  description: CLIENT_PWA_DESCRIPTION,
  manifest: CLIENT_MANIFEST_PATH,
  appleWebApp: {
    capable: true,
    title: CLIENT_PWA_SHORT_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/brand/mlabelle-favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1B1B18",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
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
