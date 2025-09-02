"use client";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import testimonials from "@/assets/testimonials.json";
import {
  Shield,
  AlertTriangle,
  Archive,
  FileArchive,
  FileStack,
  FileText,
} from "lucide-react";

type PartnerType = {
  name: string;
  description: string;
  url: string;
  logo: string;
  cta?: string;
};

function PartnerCard({ partner }: { partner: PartnerType }) {
  return (
    <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.025] hover:shadow-2xl transition-all bg-white/10 hover:bg-white/20 p-6 flex flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.name}
        className="w-20 h-20 mb-4 rounded-xl object-cover border border-white/20 bg-white/10"
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/images/logo.png")
        }
      />
      <h4 className="text-xl font-bold mb-2">{partner.name}</h4>
      <p className="text-white/70 mb-4">{partner.description}</p>
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#aac49b]/30 hover:bg-[#aac49b]/50 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
      >
        {partner.cta || "Join Discord"}
      </a>
    </div>
  );
}

type CommandCategoryType = {
  icon: string;
  title: string;
  commands: {
    name: string;
    description: string;
    permission: string;
  }[];
};

function CommandCategory({
  categoryKey,
  category,
  open,
  onToggle,
}: {
  categoryKey: string;
  category: CommandCategoryType;
  open: boolean;
  onToggle: (key: string) => void;
}) {
  return (
    <div
      className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.025] hover:shadow-2xl transition-all bg-white/10 hover:bg-white/20"
      id={`${categoryKey}-container`}
    >
      <button
        className="w-full px-8 py-6 flex justify-between items-center text-2xl font-semibold"
        onClick={() => onToggle(categoryKey)}
        aria-expanded={open}
        aria-controls={`${categoryKey}-commands`}
        type="button"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-2xl">
            {category.icon}
          </div>
          <span>{category.title}</span>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            className="menu-icon"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`${open ? "" : "hidden"} px-8 pb-6 space-y-4`}
        id={`${categoryKey}-commands`}
      >
        {category.commands.map((cmd) => (
          <div
            key={cmd.name}
            className="feature-card bg-gradient-to-br from-[#aac49b]/10 via-white/5 to-[#232e1e]/10 p-6 rounded-2xl border border-white/10 shadow-lg flex items-center gap-6 hover:scale-[1.025] hover:shadow-2xl transition-all"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#aac49b] to-[#232e1e] text-white text-2xl font-bold shadow-md border-2 border-white/20">
                {cmd.name[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-xl font-semibold mb-1 text-white group-hover:text-[#aac49b] transition">
                {cmd.name}
              </h4>
              <p className="text-white/70 text-base">{cmd.description}</p>
            </div>
            <span className="ml-4 px-3 py-1 bg-gradient-to-r from-[#ffb4b4]/30 to-[#ffb4b4]/10 text-red-400 rounded-lg text-xs font-semibold border border-red-400/30 shadow-sm">
              {cmd.permission}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.025] hover:shadow-2xl transition-all bg-white/10 hover:bg-white/20 p-8 min-w-[400px] max-w-[500px] flex flex-col justify-between">
      <p className="text-white/70 text-lg mb-6">{testimonial.text}</p>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={testimonial.user.avatar}
          alt={testimonial.user.name}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) =>
            ((e.target as HTMLImageElement).src = "/images/logo.png")
          }
        />
        <div className="text-left">
          <h4 className="text-xl font-bold">{testimonial.user.name}</h4>
          <p className="text-sm text-white/70">{testimonial.user.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [githubStats, setGithubStats] = useState<{
    stars: number;
    forks: number;
  }>({ stars: 0, forks: 0 });
  const [discordStats, setDiscordStats] = useState<{
    online: number;
    members: number;
  }>({ online: 0, members: 0 });

  type FeatureType = {
    title: string;
    description: string;
    iconName?: string;
    iconColour?: string;
    iconEmoji?: string;
    bgGradient?: string;
    iconBgGradient?: string;
  };
  const [features, setFeatures] = useState<FeatureType[]>([]);
  type PartnerType = {
    name: string;
    description: string;
    url: string;
    logo: string;
    cta?: string;
  };
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [commands, setCommands] = useState<{
    [key: string]: CommandCategoryType;
  }>({});

  const handleToggleCategory = (key: string) => {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/MilkshakeCollective/stachio-bot"
        );
        const data = await res.json();
        setGithubStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
        });
      } catch {}
    }
    fetchStats();
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          "https://discord.com/api/guilds/1396235829579485214/widget.json"
        );
        const data = await res.json();
        setDiscordStats({
          online: data.presence_count,
          members: data.members.length,
        });
      } catch {}
    }
    fetchStats();
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    import("@/assets/features.json").then((mod) =>
      setFeatures(mod.default || [])
    );
    import("@/assets/partners.json").then((mod) =>
      setPartners(mod.default || [])
    );
    import("@/assets/commands.json").then((mod) =>
      setCommands(mod.default || {})
    );
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" &&
        (target as HTMLAnchorElement).getAttribute("href")?.startsWith("#")
      ) {
        const href = (target as HTMLAnchorElement).getAttribute("href");
        const anchorTarget = document.querySelector(href!);
        if (anchorTarget) {
          e.preventDefault();
          const nav = document.querySelector("nav");
          const navHeight = nav ? nav.clientHeight : 0;
          const top =
            (anchorTarget as HTMLElement).getBoundingClientRect().top +
            window.scrollY -
            navHeight;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimeout = useRef<NodeJS.Timeout | null>(null);
  const testimonialCount = testimonials.length;

  useEffect(() => {
    if (testimonialCount <= 1) return;
    if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    testimonialTimeout.current = setTimeout(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonialCount);
    }, 5000);
    return () => {
      if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    };
  }, [testimonialIndex, testimonialCount]);

  const dragStartX = useRef<number | null>(null);
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartX.current =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  };
  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const endX =
      "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      setTestimonialIndex((prev) =>
        diff > 0
          ? (prev - 1 + testimonialCount) % testimonialCount
          : (prev + 1) % testimonialCount
      );
    }
    dragStartX.current = null;
  };

  const lucideIconMap: Record<string, React.ElementType> = {
    shield: Shield,
    warning: AlertTriangle,
    "file-drawer": Archive,
    archive: Archive,
    "file-archive": FileArchive,
    "file-stack": FileStack,
    "file-text": FileText,
  };

  return (
    <>
      <Navbar />

      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--hero-gradient-from)]/40 via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-20 py-24">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--hero-text)] leading-tight drop-shadow-lg">
              Protect Your Server with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--hero-btn-gradient-from)] to-[var(--hero-btn-gradient-to)]">
                Stachio
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-[var(--hero-text-muted)] max-w-2xl mx-auto lg:mx-0">
              The advanced Discord bot built for online safety, automod, and
              secure community management.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start w-full">
              <a
                href="https://discord.com/api/oauth2/authorize?client_id=1396235829579485214&permissions=8&scope=bot%20applications.commands"
                className="bg-gradient-to-r from-[var(--hero-btn-gradient-from)] to-[var(--hero-btn-gradient-to)] px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition text-[var(--hero-text)]"
              >
                Add to Discord
              </a>
              <a
                href="#commands"
                className="bg-[var(--hero-btn-bg)] hover:bg-[var(--hero-btn-bg-hover)] px-10 py-5 rounded-2xl font-bold text-lg shadow-lg transition text-[var(--hero-text)]"
              >
                View Commands
              </a>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 w-full h-full bg-[var(--hero-logo-bg)] rounded-3xl blur-3xl opacity-30"></div>
            <Image
              src="/images/logo.png"
              alt="Stachio Bot"
              className="relative rounded-3xl w-full max-w-md mx-auto"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Features of Stachio</h2>
          <p className="text-xl text-white/70 mb-20">
            Everything you need to keep your server safe, secure, and thriving.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {features.length > 0 &&
              features.map((feature, idx) => (
                <div
                  key={feature.title || idx}
                  className={`feature-card p-0 rounded-2xl border border-white/10 shadow-xl transition-all hover:scale-[1.025] hover:shadow-2xl group`}
                  style={{
                    background: feature.bgGradient || undefined,
                  }}
                >
                  <div className="flex flex-col items-center px-10 py-12">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        background: feature.iconBgGradient || undefined,
                      }}
                    >
                      {feature.iconName && lucideIconMap[feature.iconName]
                        ? React.createElement(lucideIconMap[feature.iconName], {
                            color: feature.iconColour || "#fff",
                            size: 28,
                            strokeWidth: 2.2,
                          })
                        : feature.iconEmoji || null}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#aac49b] transition">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section id="partners" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Our Partners</h2>
          <p className="text-xl text-white/70 mb-20">
            Stachio is proud to collaborate with amazing partners who support
            online safety.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.length > 0 &&
              partners.map((partner: PartnerType) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
          </div>
        </div>
      </section>

      <section id="commands" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Commands</h2>
          <p className="text-xl text-white/70 mb-20">
            Explore powerful commands designed for safety and moderation.
          </p>
          <div className="space-y-8">
            {Object.keys(commands).length > 0 &&
              Object.entries(commands).map(([key, category]) => (
                <CommandCategory
                  key={key}
                  categoryKey={key}
                  category={category}
                  open={!!openCategories[key]}
                  onToggle={handleToggleCategory}
                />
              ))}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-32"
        style={{
          overflow: "hidden",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-white/70 mb-20">
            See how Stachio helps communities stay safe and organized.
          </p>
          <div
            className="relative max-w-xl mx-auto"
            style={{ minHeight: 280 }}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => (dragStartX.current = null)}
          >
            <div
              className="transition-transform duration-700 ease-in-out"
              style={{
                display: "flex",
                transform: `translateX(-${testimonialIndex * 100}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: "100%",
                    transition: "opacity 0.5s",
                    opacity: testimonialIndex === i ? 1 : 0.5,
                  }}
                  aria-hidden={testimonialIndex !== i}
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    testimonialIndex === i
                      ? "bg-[#aac49b]"
                      : "bg-white/20 hover:bg-[#aac49b]/50"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setTestimonialIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-32 text-center">
        <h2 className="text-5xl font-bold mb-4">Connect With Us</h2>
        <p className="text-xl text-white/70 mb-20">
          Join our community and contribute to development.
        </p>
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.025] hover:shadow-2xl transition-all bg-white/10 hover:bg-white/20 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl">
                🐙
              </div>
              <div>
                <h3 className="text-xl font-bold">Source Code</h3>
                <p className="text-white/70 text-sm">View on GitHub</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-white/70 text-sm">
                <span id="stars-count">⭐ {githubStats.stars} Stars</span>
                <span id="forks-count">🍴 {githubStats.forks} Forks</span>
              </div>
              <a
                href="https://github.com/MilkshakeCollective/stachio-bot"
                className="bg-[#2f3e29] hover:bg-[#aac49b] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                View Source
              </a>
            </div>
          </div>

          <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.025] hover:shadow-2xl transition-all bg-white/10 hover:bg-white/20 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/images/logo.png"
                alt="Server Icon"
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl border border-white/20 bg-white/10"
              />
              <div>
                <h3 className="text-xl font-bold">Stachio Community</h3>
                <p className="text-white/70 text-sm">Official Discord Server</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-green-500">🟢</span>
                  <span id="discord-online-count">
                    {discordStats.online} Online
                  </span>
                </span>
                <span id="discord-members">
                  • {discordStats.members} Members
                </span>
              </div>
              <a
                href="https://discord.com/invite/wSAkewmzAM"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Join Server
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/images/logo.png"
              alt="Stachio Logo"
              width={40}
              height={40}
              className="h-10 mb-6"
            />
            <p className="text-lg text-white/70">
              Stachio is the ultimate bot for online safety and community
              protection, with automod, moderation, anti-phishing, and more.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-white/70 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-white/70 hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#commands" className="text-white/70 hover:text-white">
                  Commands
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-white/70 hover:text-white"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="privacy.html"
                  className="text-white/70 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="terms.html" className="text-white/70 hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1374870746006032414"
                  className="text-white/70 hover:text-white"
                >
                  Invite
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com/invite/wSAkewmzAM"
                  className="text-white/70 hover:text-white"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MilkshakeCollective"
                  className="text-white/70 hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://ko-fi.com/duckodas"
                  className="text-white/70 hover:text-white"
                >
                  Support Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Stachio. All rights reserved. • Not
          affiliated with Discord Inc.
        </div>
      </footer>
    </>
  );
}
