"use client";
import { Navbar } from "@/components/navbar";
import React from "react";
import {
  Book,
  FileText,
  Shield,
  Settings,
  Users,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

// Utility function to format category names
const formatCategoryName = (category: string): string => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Icon mapping for categories
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: React.ElementType } = {
    blacklist: Shield,
    "getting-started": Book,
    commands: FileText,
    moderation: Shield,
    configuration: Settings,
    users: Users,
    troubleshooting: AlertTriangle,
  };
  return iconMap[category] || FileText;
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

interface DocFile {
  content: string;
  metadata: Record<string, string>;
  filename: string;
  category: string;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [docContent, setDocContent] = React.useState<DocFile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { category } = params;
  const formattedCategory = formatCategoryName(category);
  const CategoryIcon = getCategoryIcon(category);

  React.useEffect(() => {
    const fetchCategoryContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/docs/getCategory?category=${encodeURIComponent(
            category
          )}`
        );
        const data = await response.json();

        if (data.success && data.content) {
          setDocContent({
            content: data.content,
            metadata: data.metadata || {},
            filename: data.filename || category,
            category: data.category || category,
          });
        } else {
          setError("Category not found or no content available");
        }
      } catch (err) {
        console.error("Error fetching category content:", err);
        setError("Failed to load category content");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [category]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aac49b] mx-auto"></div>
              <p className="text-white/70 mt-4">Loading documentation...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !docContent) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-white mb-4">
                Category Not Found
              </h1>
              <p className="text-white/70 mb-8">
                {error ||
                  "The requested documentation category does not exist."}
              </p>
              <Link href="/docs" className="btn-primary">
                <ArrowLeft size={20} className="mr-2" />
                Back to Documentation
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] opacity-20"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-[#aac49b] to-[#8ab087] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CategoryIcon size={32} className="text-[#1a1f17]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--hero-text)] leading-tight drop-shadow-lg mb-4">
            {formattedCategory}
          </h1>
          <p className="text-lg md:text-xl text-[var(--hero-text-muted)] max-w-2xl mx-auto mb-6">
            Documentation for {formattedCategory.toLowerCase()}
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center text-[#aac49b] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All Documentation
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8">
            {/* File Info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2 text-white/70">
                <User size={16} />
                <span className="text-sm">{docContent.filename}</span>
              </div>
              {docContent.metadata.lastModified && (
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Last updated:{" "}
                    {new Date(
                      docContent.metadata.lastModified
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Markdown Content */}
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-code:text-[#aac49b] prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-white/10 prose-pre:border prose-pre:border-white/20"
              dangerouslySetInnerHTML={{ __html: docContent.content }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
