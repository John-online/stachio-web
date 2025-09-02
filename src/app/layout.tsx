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
  twitter: {
    card: "summary_large_image",
    title: "Stachio - Protect Your Discord Community",
    description: "Advanced safety & moderation bot for Discord.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
