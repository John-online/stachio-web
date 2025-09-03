"use client";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import testimonials from "@/assets/testimonials.json";
import {
  Shield,
  AlertTriangle,
  Archive,
  FileArchive,
  FileStack,
  FileText,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

type PartnerType = {
  name: string;
  description: string;
  url: string;
  logo: string;
  cta?: string;
};

const PartnerCard = React.memo(function PartnerCard({ partner }: { partner: PartnerType }) {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return <div ref={ref} className="feature-card rounded-2xl border border-white/10 shadow-xl bg-white/10 p-6 flex flex-col items-center text-center h-64" />;
  }

  return (
    <div ref={ref} className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-transform duration-200 bg-white/10 hover:bg-white/15 p-6 flex flex-col items-center text-center">
      <Image
        src={imageError ? "/images/logo.png" : partner.logo}
        alt={partner.name}
        width={80}
        height={80}
        className="w-20 h-20 mb-4 rounded-xl object-cover border border-white/20 bg-white/10"
        onError={() => setImageError(true)}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      <h4 className="text-xl font-bold mb-2">{partner.name}</h4>
      <p className="text-white/70 mb-4">{partner.description}</p>
      <Link
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {partner.cta || "Join Discord"}
      </Link>
    </div>
  );
});

type CommandCategoryType = {
  icon: string;
  title: string;
  commands: {
    name: string;
    description: string;
    permission: string;
  }[];
};

const CommandCategory = React.memo(function CommandCategory({
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
  const handleToggle = useCallback(() => {
    onToggle(categoryKey);
  }, [categoryKey, onToggle]);

  return (
    <div
      className="rounded-2xl border border-white/10 shadow-lg bg-[#181c17] hover:border-[#aac49b]/40 transition-colors duration-200"
      id={`${categoryKey}-container`}
    >
      <button
        className="w-full px-8 py-6 flex justify-between items-center text-2xl font-semibold bg-transparent hover:bg-[#232e1e]/40 rounded-t-2xl transition-colors duration-200"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={`${categoryKey}-commands`}
        type="button"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#232e1e] rounded-lg flex items-center justify-center text-2xl text-[#aac49b]">
            {category.icon}
          </div>
          <span className="text-white">{category.title}</span>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-white/70 transform transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`${open ? "" : "hidden"} px-8 pb-6 space-y-4`}
        id={`${categoryKey}-commands`}
      >
        {category.commands.map((cmd) => (
          <div
            key={cmd.name}
            className="flex items-center gap-6 bg-[#20251f] border border-white/10 rounded-xl px-6 py-5 shadow-sm hover:shadow-md hover:border-[#aac49b]/40 transition-all duration-200 group"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#232e1e] text-white text-2xl font-bold border border-white/10">
                /
              </div>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-lg font-semibold mb-1 text-white group-hover:text-[#aac49b] transition-colors duration-200">
                {cmd.name}
              </h4>
              <p className="text-white/60 text-base">{cmd.description}</p>
            </div>
            <span className="ml-4 px-3 py-1 bg-[#2c1e1e] text-red-400 rounded-lg text-xs font-semibold border border-red-400/20 shadow-sm">
              {cmd.permission}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const TestimonialCard = React.memo(function TestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: (typeof testimonials)[0];
  isActive: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`feature-card rounded-2xl border border-white/10 shadow-xl transition-all duration-500 bg-white/10 p-8 w-full max-w-2xl mx-auto ${isActive ? 'opacity-100 scale-100 hover:scale-[1.02] hover:shadow-lg hover:bg-white/15' : 'opacity-60 scale-95'
        }`}
    >
      <p className="text-white/90 text-lg mb-6 leading-relaxed">{testimonial.text}</p>
      <div className="flex items-center gap-4">
        <Image
          src={imageError ? "/images/logo.png" : testimonial.user.avatar}
          alt={testimonial.user.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
          onError={() => setImageError(true)}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="text-left">
          <h4 className="text-xl font-bold text-white">{testimonial.user.name}</h4>
          <p className="text-sm text-white/70">{testimonial.user.role}</p>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const [showContent, setShowContent] = useState(false);
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

  const [loadingProgress, setLoadingProgress] = useState({
    features: false,
    partners: false,
    commands: false,
    githubStats: false,
    discordStats: false,
    images: false,
  });

  const handleToggleCategory = useCallback((key: string) => {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const updateLoadingProgress = useCallback((key: keyof typeof loadingProgress, value: boolean) => {
    setLoadingProgress(prev => ({ ...prev, [key]: value }));
  }, []);

  const checkAllLoaded = useCallback(() => {
    return Object.values(loadingProgress).every(Boolean);
  }, [loadingProgress]);

  useEffect(() => {
    if (checkAllLoaded()) {
      setShowContent(true);
    }
  }, [loadingProgress, checkAllLoaded]);

  const fetchGithubStats = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.github.com/repos/MilkshakeCollective/stachio-bot"
      );
      const data = await res.json();
      setGithubStats({
        stars: data.stargazers_count,
        forks: data.forks_count,
      });
    } catch { }
    updateLoadingProgress('githubStats', true);
  }, [updateLoadingProgress]);

  const fetchDiscordStats = useCallback(async () => {
    try {
      const res = await fetch(
        "https://discord.com/api/guilds/1396235829579485214/widget.json"
      );
      const data = await res.json();
      setDiscordStats({
        online: data.presence_count,
        members: data.members.length,
      });
    } catch { }
    updateLoadingProgress('discordStats', true);
  }, [updateLoadingProgress]);

  useEffect(() => {
    fetchGithubStats();
    const interval = setInterval(fetchGithubStats, 600000);
    return () => clearInterval(interval);
  }, [fetchGithubStats]);

  useEffect(() => {
    fetchDiscordStats();
    const interval = setInterval(fetchDiscordStats, 600000);
    return () => clearInterval(interval);
  }, [fetchDiscordStats]);

  useEffect(() => {
    Promise.all([
      import("@/assets/features.json"),
      import("@/assets/partners.json"),
      import("@/assets/commands.json")
    ]).then(([featuresModule, partnersModule, commandsModule]) => {
      setFeatures(featuresModule.default || []);
      updateLoadingProgress('features', true);

      setPartners(partnersModule.default || []);
      updateLoadingProgress('partners', true);

      setCommands(commandsModule.default || {});
      updateLoadingProgress('commands', true);
    });
  }, [updateLoadingProgress]);

  // Preload critical images
  useEffect(() => {
    const imagesToPreload = [
      '/images/logo.png',
      ...partners.map(p => p.logo),
      ...testimonials.map(t => t.user.avatar)
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    if (totalImages === 0) {
      updateLoadingProgress('images', true);
      return;
    }

    imagesToPreload.forEach(src => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          updateLoadingProgress('images', true);
        }
      };
      img.src = src;
    });
  }, [partners, updateLoadingProgress]);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const throttledScrollHandler = useCallback(() => {
    if (!isScrolling) setIsScrolling(true);

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
  }, [isScrolling]);

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [throttledScrollHandler]);

  const memoizedFeatures = useMemo(() => features, [features]);
  const memoizedPartners = useMemo(() => partners, [partners]);
  const memoizedCommands = useMemo(() => commands, [commands]);

  const smoothScrollHandler = useCallback((e: MouseEvent) => {
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

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", smoothScrollHandler);
    return () => document.removeEventListener("click", smoothScrollHandler);
  }, [smoothScrollHandler]);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimeout = useRef<NodeJS.Timeout | null>(null);
  const testimonialCount = testimonials.length;
  const [testimonialsPaused, setTestimonialsPaused] = useState(false);

  useEffect(() => {
    if (testimonialCount <= 1 || testimonialsPaused) return;
    if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    testimonialTimeout.current = setTimeout(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonialCount);
    }, 7000);
    return () => {
      if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    };
  }, [testimonialIndex, testimonialCount, testimonialsPaused]);

  const dragStartX = useRef<number | null>(null);
  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setTestimonialsPaused(true);
    dragStartX.current =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  }, []);

  const handleDragEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
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
    setTimeout(() => setTestimonialsPaused(false), 1000);
  }, [testimonialCount]);

  const lucideIconMap: Record<string, React.ElementType> = useMemo(() => ({
    shield: Shield,
    warning: AlertTriangle,
    "file-drawer": Archive,
    archive: Archive,
    "file-archive": FileArchive,
    "file-stack": FileStack,
    "file-text": FileText,
  }), []);

  const handleLoadingComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  return (
    <>
      <Navbar />

      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] opacity-20"></div>
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
              <Link
                href="/invite"
                className="btn-primary"
              >
                Add to Discord
              </Link>
              <Link
                href="#commands"
                className="btn-primary"
              >
                View Commands
              </Link>
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
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
            {memoizedFeatures.length > 0 &&
              memoizedFeatures.map((feature, idx) => (
                <div
                  key={feature.title || idx}
                  className={`feature-card p-0 rounded-2xl border border-white/10 shadow-xl transition-all duration-200 group ${isScrolling ? '' : 'hover:scale-[1.01] hover:shadow-lg'
                    }`}
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
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#aac49b] transition-colors duration-200">
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
            {memoizedPartners.length > 0 &&
              memoizedPartners.map((partner: PartnerType) => (
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
            {Object.keys(memoizedCommands).length > 0 &&
              Object.entries(memoizedCommands).map(([key, category]) => (
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
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-white/70 mb-20">
            See how Stachio helps communities stay safe and organized.
          </p>
          <div
            className="relative w-full max-w-4xl mx-auto"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => (dragStartX.current = null)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${testimonialIndex * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, i) => (
                  <div
                    key={i}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={testimonialIndex === i}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${testimonialIndex === i
                      ? "bg-[#aac49b] scale-125"
                      : "bg-white/30 hover:bg-[#aac49b]/60 hover:scale-110"
                    }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => {
                    setTestimonialIndex(i);
                    setTestimonialsPaused(true);
                    setTimeout(() => setTestimonialsPaused(false), 2000);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Connect With Us</h2>
          <p className="text-xl text-white/70 mb-20">
            Join our community and contribute to development.
          </p>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-all duration-200 bg-white/10 hover:bg-white/15 p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🐙
                </div>
                <h3 className="text-2xl font-bold mb-3">Source Code</h3>
                <p className="text-white/70 mb-6">
                  View our open-source code on GitHub and contribute to development
                </p>
                <div className="flex gap-6 text-white/70 text-sm mb-6">
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <span id="stars-count">{githubStats.stars} Stars</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-400">🍴</span>
                    <span id="forks-count">{githubStats.forks} Forks</span>
                  </span>
                </div>
                <Link
                  href="/github"
                  className="btn-primary"
                >
                  View Source
                </Link>
              </div>
            </div>

            <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-all duration-200 bg-white/10 hover:bg-white/15 p-8">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/logo.png"
                  alt="Server Icon"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl border-2 border-white/20 bg-white/10 mb-6"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold mb-3">Stachio Community</h3>
                <p className="text-white/70 mb-6">
                  Join our official Discord server for support and updates
                </p>
                <div className="flex gap-6 text-white/70 text-sm mb-6">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span id="discord-online-count">{discordStats.online} Online</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-400">👥</span>
                    <span id="discord-members">{discordStats.members} Members</span>
                  </span>
                </div>
                <Link
                  href="/discord"
                  className="btn-primary"
                >
                  Join Server
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}