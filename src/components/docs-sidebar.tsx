"use client";
import React from "react";
import { ArrowLeft, Menu, X, FileText } from "lucide-react";
import Link from "next/link";
import { getIconComponent, formatCategoryName } from "@/lib/icon-utils";

interface Category {
  name: string;
  icon: string;
  hasParent: boolean;
  fileCount: number;
}

interface CategoryFile {
  name: string;
  fileName: string;
  filePath: string;
  isParent: boolean;
}

interface DocsSidebarProps {
  currentCategory?: string;
  currentSlug?: string[];
}

export function DocsSidebar({
  currentCategory,
  currentSlug,
}: DocsSidebarProps) {
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [categoryFiles, setCategoryFiles] = React.useState<CategoryFile[]>([]);
  const [categoryFilesCache, setCategoryFilesCache] = React.useState<
    Map<string, CategoryFile[]>
  >(new Map());
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await fetch("/api/docs/getCategories");
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setAllCategories(categoriesData.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (!currentCategory) {
      setCategoryFiles([]);
      return;
    }

    if (categoryFilesCache.has(currentCategory)) {
      setCategoryFiles(categoryFilesCache.get(currentCategory)!);
      return;
    }

    setCategoryFiles([]);

    const fetchCategoryFiles = async () => {
      try {
        const categoryResponse = await fetch(
          `/api/docs/getCategory?category=${encodeURIComponent(
            currentCategory
          )}`
        );
        const categoryData = await categoryResponse.json();
        if (categoryData.success && categoryData.category.files) {
          const files = categoryData.category.files;
          setCategoryFiles(files);

          setCategoryFilesCache((prev) =>
            new Map(prev).set(currentCategory, files)
          );
        }
      } catch (err) {
        console.error("Error fetching category files:", err);
      }
    };

    fetchCategoryFiles();
  }, [currentCategory, categoryFilesCache]);

  const currentFileSlug = currentSlug
    ? currentSlug[currentSlug.length - 1]
    : null;

  return (
    <>
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white/10 border border-white/10 rounded-lg shadow-sm hover:bg-white/15"
        >
          {sidebarOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>
      </div>

      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-[#181c17] border-r border-white/10 
          overflow-y-auto z-40 transition-transform duration-300 pt-20 docs-sidebar-scrollbar
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="pl-4 pr-4 py-6">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">All Documentation</span>
          </Link>

          <nav className="space-y-2">
            {allCategories.map((cat) => {
              const Icon = getIconComponent(cat.icon);
              const isActive = cat.name === currentCategory;
              const isCategoryExpanded = cat.name === currentCategory;

              return (
                <div key={cat.name}>
                  <Link
                    href={`/docs/${cat.name.split(" ").join("-")}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#aac49b]/20 text-[#aac49b] font-medium"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{formatCategoryName(cat.name)}</span>
                  </Link>

                  {isCategoryExpanded && categoryFiles.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
                      {categoryFiles
                        .filter((file) => file.isParent === false)
                        .map((file) => {
                          const fileSlug =
                            file.filePath.replace(".md", "").split("/").pop() ||
                            "";
                          const fileName = file.name.replace(".md", "");
                          const isActivePage = fileSlug === currentFileSlug;

                          return (
                            <Link
                              key={file.name}
                              href={`/docs/${currentCategory}/${fileSlug}`}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                isActivePage
                                  ? "bg-[#aac49b] text-[#1a1f17] font-medium"
                                  : "text-white/60 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <FileText size={14} />
                              <span>{formatCategoryName(fileName)}</span>
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
