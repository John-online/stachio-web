import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stachio.dk"),
  title: "Stachio - Advanced Discord Safety Bot",
  description:
    "Stachio is an advanced Discord bot focused on safety and security, featuring anti-phishing, automod, content filtering, moderation tools, logging, and more to protect your community.",
  openGraph: {
    type: "website",
    title:
      "Protect your server with advanced moderation, automod, and anti-phishing tools.",
    description:
      "Protect your server with advanced moderation, automod, and anti-phishing tools.",
    images: ["/images/logo.png"],
  },
  authors: [
    { name: "Stachio", url: "https://stachio.dk" },
    { name: "John", url: "https://github.com/John-online" },
  ],
  creator: "John-online",
  publisher: "Stachio",
  applicationName: "Stachio",
  keywords: [
    "Discord Bot",
    "Moderation",
    "Automod",
    "Anti-Phishing",
    "Content Filtering",
    "Safety",
    "Security",
    "Community Protection",
    "Discord Safety Bot",
  ],
  twitter: {
    card: "summary_large_image",
    title: "Stachio - Protect Your Discord Community",
    description: "Advanced safety & moderation bot for Discord.",
    images: ["/images/logo.png"],
  },
};

export const viewport: Viewport = {
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
        <link rel="preload" href="/images/logo.png" as="image" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
