import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCategoryName } from "@/lib/icon-utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getCategory, getFileByPath } from "@/lib/docs-utils";
import path from "path";
import { notFound } from "next/navigation";

interface DocPageProps {
  params: Promise<{
    category: string;
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { category, slug } = await params;
  const docsPath = path.join(process.cwd(), "src", "assets", "docs");
  const filePath = slug.join("/");

  const categoryData = getCategory(docsPath, category, true);
  const fileData = getFileByPath(docsPath, category, filePath, true);

  if (!categoryData || !fileData) {
    notFound();
  }

  const formattedCategory = formatCategoryName(category);
  const fileName = fileData.name;

  const docFiles = [
    ...(categoryData.parentFile ? [categoryData.parentFile] : []),
    ...categoryData.files,
  ];

  const currentDocIndex = docFiles.findIndex((f) => {
    const cleaned = f.fileName.replace(".md", "").replace(/\s+/g, "-");
    const target = slug[slug.length - 1];
    return cleaned === target;
  });

  const prevFile = currentDocIndex > 0 ? docFiles[currentDocIndex - 1] : null;
  const nextFile =
    currentDocIndex >= 0 && currentDocIndex < docFiles.length - 1
      ? docFiles[currentDocIndex + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <nav className="flex items-center space-x-2 text-sm text-white/60 mb-8">
        <Link href="/docs" className="hover:text-white">
          Documentation
        </Link>
        <ChevronRight size={16} />
        <Link href={`/docs/${category}`} className="hover:text-white">
          {formattedCategory}
        </Link>
        <ChevronRight size={16} />
        <span className="text-white font-medium">{fileName}</span>
      </nav>

      <MarkdownRenderer content={fileData.content} />

      <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10">
        <div className="flex-1">
          {prevFile && (
            <Link
              href={
                prevFile.isParent
                  ? `/docs/${category}`
                  : `/docs/${category}/${prevFile.fileName
                      .replace(".md", "")
                      .replace(/\s+/g, "-")}`
              }
              className="group flex flex-col gap-2 p-4 rounded-lg border border-white/10 hover:border-[#aac49b] hover:bg-white/5 transition-all"
            >
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Previous
              </span>
              <span className="text-white font-medium group-hover:text-[#aac49b]">
                {formatCategoryName(prevFile.name.replace(".md", ""))}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {nextFile && (
            <Link
              href={
                nextFile.isParent
                  ? `/docs/${category}`
                  : `/docs/${category}/${nextFile.fileName
                      .replace(".md", "")
                      .replace(/\s+/g, "-")}`
              }
              className="group flex flex-col gap-2 p-4 rounded-lg border border-white/10 hover:border-[#aac49b] hover:bg-white/5 transition-all text-right"
            >
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Next
              </span>
              <span className="text-white font-medium group-hover:text-[#aac49b]">
                {formatCategoryName(nextFile.name.replace(".md", ""))}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
