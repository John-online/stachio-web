"use client";
import React from "react";
import { Book, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import quickStartSteps from "@/assets/quickstart.json";
import { getIconComponent, formatCategoryName } from "@/lib/icon-utils";

const DocCard = React.memo(function DocCard({
  title,
  description,
  href,
  icon: Icon,
  fileCount,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  fileCount: number;
}) {
  return (
    <Link
      href={href}
      className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-all duration-200 bg-white/10 hover:bg-white/15 p-6 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#232e1e] rounded-lg flex items-center justify-center text-[#aac49b] flex-shrink-0">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#aac49b] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">
              {fileCount} {fileCount === 1 ? "document" : "documents"}
            </span>
            <div className="flex items-center text-[#aac49b] text-sm font-medium">
              Read more <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

const QuickStartCard = React.memo(function QuickStartCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card rounded-2xl border border-white/10 shadow-xl bg-white/10 p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#aac49b] to-[#8ab087] rounded-lg flex items-center justify-center text-[#1a1f17] font-bold text-lg flex-shrink-0">
          {step}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
});

interface DocCategory {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  fileCount: number;
}

export default function DocsPage() {
  const [docCategories, setDocCategories] = React.useState<DocCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/docs/getCategories");
        const data = await response.json();

        if (data.success && data.categories) {
          const formattedCategories = data.categories.map(
            (category: {
              name: string;
              icon: string;
              hasParent: boolean;
              fileCount: number;
            }) => ({
              title: formatCategoryName(category.name),
              description: `Explore ${formatCategoryName(
                category.name
              ).toLowerCase()} documentation.`,
              href: `/docs/${category.name}`,
              icon: getIconComponent(category.icon),
              fileCount: category.fileCount,
            })
          );
          setDocCategories(formattedCategories);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <section
        id="docs-hero"
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] opacity-20"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <div className="w-16 h-16 bg-gradient-to-br from-[#aac49b] to-[#8ab087] rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Book size={32} className="text-[#1a1f17]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--hero-text)] leading-tight drop-shadow-lg mb-6">
            Stachio{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--hero-btn-gradient-from)] to-[var(--hero-btn-gradient-to)]">
              Documentation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--hero-text-muted)] max-w-3xl mx-auto mb-8">
            Everything you need to know about setting up and using Stachio to
            protect your Discord community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#search"
              className="btn-primary w-64 flex items-center justify-center"
            >
              <Search size={20} className="mr-2" />
              Search Docs
            </Link>
          </div>
        </div>
      </section>

      <section id="quick-start" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-xl text-white/70">
              Get Stachio up and running in your server in just a few minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartSteps.map((step, index) => (
              <QuickStartCard
                key={index}
                step={step.step}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/docs/getting-started" className="btn-primary">
              View Full Setup Guide
            </Link>
          </div>
        </div>
      </section>

      <section id="documentation" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Documentation</h2>
            <p className="text-xl text-white/70">
              Explore our comprehensive guides and references.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aac49b] mx-auto"></div>
              <p className="text-white/70 mt-4">Loading documentation...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docCategories.map((doc, index) => (
                <DocCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  href={doc.href}
                  icon={doc.icon}
                  fileCount={doc.fileCount}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="search" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Search Documentation</h2>
          <p className="text-xl text-white/70 mb-12">
            Can&apos;t find what you&apos;re looking for? Try searching our
            docs.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#aac49b] focus:border-transparent text-lg"
            />
          </div>
          <p className="text-sm text-white/50 mt-4">
            Press{" "}
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>{" "}
            to search
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Need More Help?</h2>
          <p className="text-xl text-white/70 mb-12">
            Get support from our community and development team.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-all duration-200 bg-white/10 hover:bg-white/15 p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                  💬
                </div>
                <h3 className="text-2xl font-bold mb-3">Join Our Discord</h3>
                <p className="text-white/70 mb-6">
                  Get help from our community and stay updated with the latest
                  news.
                </p>
                <Link href="/discord" className="btn-primary">
                  Join Server
                </Link>
              </div>
            </div>

            <div className="feature-card rounded-2xl border border-white/10 shadow-xl hover:scale-[1.01] hover:shadow-lg transition-all duration-200 bg-white/10 hover:bg-white/15 p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🐛
                </div>
                <h3 className="text-2xl font-bold mb-3">Report Issues</h3>
                <p className="text-white/70 mb-6">
                  Found a bug or have a feature request? Let us know on GitHub.
                </p>
                <Link href="/github" className="btn-primary">
                  View GitHub
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
