import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { getIconComponent, formatCategoryName } from "@/lib/icon-utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getCategory } from "@/lib/docs-utils";
import path from "path";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const docsPath = path.join(process.cwd(), "src", "assets", "docs");

  const categoryData = getCategory(docsPath, category, true);

  if (!categoryData) {
    notFound();
  }

  const formattedCategory = formatCategoryName(category);
  const CategoryIcon = getIconComponent(categoryData.icon || "FileText");

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <nav className="flex items-center space-x-2 text-sm text-white/60 mb-8">
        <Link href="/docs" className="hover:text-white">
          Documentation
        </Link>
        <ChevronRight size={16} />
        <span className="text-white font-medium">{formattedCategory}</span>
      </nav>

      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#aac49b] to-[#8ab087] rounded-xl flex items-center justify-center">
            <CategoryIcon size={28} className="text-[#1a1f17]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            {formattedCategory}
          </h1>
        </div>
        {categoryData.description && (
          <p className="text-lg text-white/70">{categoryData.description}</p>
        )}
        {!categoryData.description && (
          <p className="text-lg text-white/70">
            Documentation for {formattedCategory.toLowerCase()}
          </p>
        )}
      </div>

      {categoryData.parentFile ? (
        <div className="mb-8">
          <MarkdownRenderer content={categoryData.parentFile.content} />
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-white/70">
            This category contains {categoryData.files.length} document
            {categoryData.files.length !== 1 ? "s" : ""}. Select a document from
            the sidebar to view its content.
          </p>
        </div>
      )}

      {categoryData.files.length > 0 && (
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            More documents in this category
          </h2>
          <div className="grid gap-4">
            {categoryData.files
              .filter((file) => !file.isParent)
              .map((file) => (
                <Link
                  key={file.fileName}
                  href={`/docs/${category}/${file.fileName
                    .replace(".md", "")
                    .replace(/\s+/g, "-")}`}
                  className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:border-[#aac49b] hover:shadow-md hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <FileText
                      size={24}
                      className="text-[#aac49b] flex-shrink-0 mt-1"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {file.name}
                      </h3>
                      <div className="flex items-center text-sm text-white/70">
                        <ChevronRight size={16} className="mr-1" />
                        <span>Read more</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
