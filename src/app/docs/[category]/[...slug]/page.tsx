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
  Home,
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

interface DocPageProps {
  params: {
    category: string;
    slug: string[];
  };
}

interface DocFile {
  content: string;
  metadata: Record<string, string>;
  filename: string;
  category: string;
}

export default function DocPage({ params }: DocPageProps) {
  const [docContent, setDocContent] = React.useState<DocFile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { category, slug } = params;
  const formattedCategory = formatCategoryName(category);
  const CategoryIcon = getCategoryIcon(category);
  const filePath = slug.join("/");
  const fileName = formatCategoryName(slug[slug.length - 1] || "");

  React.useEffect(() => {
    const fetchDocContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/docs/getFile?category=${encodeURIComponent(
            category
          )}&file=${encodeURIComponent(filePath)}`
        );
        const data = await response.json();

        if (data.success && data.content) {
          setDocContent({
            content: data.content,
            metadata: data.metadata || {},
            filename: data.filename || fileName,
            category: data.category || category,
          });
        } else {
          setError("Document not found or no content available");
        }
      } catch (err) {
        console.error("Error fetching document content:", err);
        setError("Failed to load document content");
      } finally {
        setLoading(false);
      }
    };

    fetchDocContent();
  }, [category, filePath, fileName]);

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
                Document Not Found
              </h1>
              <p className="text-white/70 mb-8">
                {error || "The requested documentation page does not exist."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/docs/${category}`} className="btn-primary">
                  <ArrowLeft size={20} className="mr-2" />
                  Back to {formattedCategory}
                </Link>
                <Link href="/docs" className="btn-secondary">
                  <Home size={20} className="mr-2" />
                  All Documentation
                </Link>
              </div>
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

      {/* Breadcrumb Navigation */}
      <section className="bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-white/70">
            <Link
              href="/docs"
              className="hover:text-[#aac49b] transition-colors"
            >
              Documentation
            </Link>
            <span>/</span>
            <Link
              href={`/docs/${category}`}
              className="hover:text-[#aac49b] transition-colors"
            >
              {formattedCategory}
            </Link>
            <span>/</span>
            <span className="text-white">{fileName}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] opacity-20"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <div className="w-12 h-12 bg-gradient-to-br from-[#aac49b] to-[#8ab087] rounded-xl flex items-center justify-center mx-auto mb-4">
            <CategoryIcon size={24} className="text-[#1a1f17]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--hero-text)] leading-tight drop-shadow-lg mb-3">
            {fileName}
          </h1>
          <p className="text-base md:text-lg text-[var(--hero-text-muted)] max-w-2xl mx-auto">
            {formattedCategory} Documentation
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8">
            {/* File Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/10">
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
              <div className="flex items-center gap-2 text-white/70">
                <FileText size={16} />
                <span className="text-sm">{filePath}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href={`/docs/${category}`}
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition-all duration-200 text-sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to {formattedCategory}
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition-all duration-200 text-sm"
              >
                <Home size={16} className="mr-2" />
                All Documentation
              </Link>
            </div>

            {/* Markdown Content */}
            <div
              className="prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-white/90 prose-p:leading-relaxed
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-white/80
                prose-code:text-[#aac49b] prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-white/10 prose-pre:border prose-pre:border-white/20 prose-pre:rounded-lg
                prose-blockquote:border-l-4 prose-blockquote:border-[#aac49b] prose-blockquote:bg-white/5 prose-blockquote:text-white/80
                prose-ul:text-white/90 prose-ol:text-white/90
                prose-li:text-white/90 prose-li:marker:text-[#aac49b]
                prose-a:text-[#aac49b] prose-a:hover:text-white prose-a:transition-colors
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: docContent.content }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
