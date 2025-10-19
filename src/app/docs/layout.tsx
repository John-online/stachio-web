import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stachio Documentation",
  description:
    "Comprehensive documentation for Stachio Discord bot - setup guides, commands reference, and troubleshooting.",
  keywords: [
    "discord bot",
    "stachio",
    "documentation",
    "moderation",
    "server management",
  ],
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
