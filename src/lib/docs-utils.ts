import fs from "fs";
import path from "path";

export interface DocFileMetadata {
  name: string;
  category: string;
  categoryIcon?: string;
  categoryDescription?: string;
  isParent: boolean;
  content: string;
  filePath: string;
  fileName: string;
}

export interface DocCategory {
  name: string;
  icon: string;
  description?: string;
  parentFile: DocFileMetadata | null;
  files: DocFileMetadata[];
}

interface DocsCache {
  categories: Map<string, DocCategory>;
  timestamp: number;
}

let docsCache: DocsCache | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

function isCacheValid(): boolean {
  if (!docsCache) return false;
  const now = Date.now();
  return now - docsCache.timestamp <= CACHE_DURATION;
}

export function clearDocsCache(): void {
  docsCache = null;
}

export function parseDocumentationFile(
  rawContent: string,
  filePath: string,
  fileName: string
): DocFileMetadata & { categoryDescription?: string } {
  const fileMatch = rawContent.match(/<file>([\s\S]*?)<\/file>/);
  const contentStart = rawContent.indexOf("<content>");
  const contentEnd = rawContent.lastIndexOf("</content>");
  let contentMatch: RegExpMatchArray | null = null;
  if (contentStart !== -1 && contentEnd !== -1 && contentEnd > contentStart) {
    contentMatch = [
      rawContent.substring(contentStart, contentEnd + "</content>".length),
      rawContent.substring(contentStart + "<content>".length, contentEnd),
    ];
  }
  const descriptionMatch = rawContent.match(
    /<category:description>([\s\S]*?)<\/category:description>/
  );

  const metadata: Partial<DocFileMetadata> & { categoryDescription?: string } =
    {
      filePath,
      fileName,
      isParent: false,
      category: "",
      name: fileName.replace(".md", ""),
    };

  if (fileMatch) {
    const fileSection = fileMatch[1];

    const nameMatch = fileSection.match(
      /<file:name\s+val="([^"]+)"\s*(?:>|\/?>)/
    );
    if (nameMatch) {
      metadata.name = nameMatch[1];
    }

    const categoryMatch = fileSection.match(
      /<file:category\s+(?:isParent="(true|false)"\s+)?val="([^"]+)"(?:\s+icon="([^"]+)")?\s*(?:>|\/?>)/
    );
    if (categoryMatch) {
      const [, isParentStr, categoryName, categoryIcon] = categoryMatch;
      metadata.isParent = isParentStr === "true";
      metadata.category = categoryName.replace(/\s+/g, "-");
      metadata.categoryIcon = categoryIcon || undefined;
    }
  }

  if (descriptionMatch) {
    metadata.categoryDescription = descriptionMatch[1].trim();
  }

  let processedContent = rawContent;
  if (contentMatch) {
    processedContent = contentMatch[1].trim();
  }

  processedContent = processedContent.replace(
    /\{\{([^}]+)\}\}/g,
    (match, variable) => {
      const trimmedVar = variable.trim();
      if (trimmedVar === "file.name" && metadata.name) {
        return metadata.name;
      }
      return match;
    }
  );

  return {
    name: metadata.name!,
    category: metadata.category!,
    categoryIcon: metadata.categoryIcon,
    categoryDescription: metadata.categoryDescription,
    isParent: metadata.isParent!,
    content: processedContent,
    filePath,
    fileName,
  };
}

export function resolveFileReferences(
  content: string,
  allFiles: Map<string, DocFileMetadata>
): string {
  return content.replace(/\[\(([^)]+)\)\]/g, (match, reference) => {
    const cleanRef = reference.trim();

    const file = allFiles.get(cleanRef);
    if (file && !file.isParent) {
      const [, ...fileNameParts] = cleanRef.split("/");
      const fileName = fileNameParts
        .join("/")
        .replace(".md", "")
        .replace(/\s+/g, "-");
      return `[</docs/${file.category}/${fileName}>${file.name}]`;
    } else if (file && file.isParent) {
      return `[</docs/${file.category}>${file.name}]`;
    }

    return "**Unknown Reference**";
  });
}

export function scanDocumentationFiles(
  docsPath: string,
  useCache: boolean = true
): Map<string, DocCategory> {
  if (useCache && isCacheValid()) {
    return docsCache!.categories;
  }

  const categories = new Map<string, DocCategory>();
  const allFiles = new Map<string, DocFileMetadata>();

  function scanDirectory(dirPath: string, relativePath: string = "") {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relPath = relativePath ? `${relativePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (item.isFile() && item.name.endsWith(".md")) {
        try {
          const rawContent = fs.readFileSync(fullPath, "utf-8");
          const fileMetadata = parseDocumentationFile(
            rawContent,
            relPath,
            item.name
          );

          allFiles.set(relPath, fileMetadata);

          if (fileMetadata.category) {
            if (!categories.has(fileMetadata.category)) {
              categories.set(fileMetadata.category, {
                name: fileMetadata.category,
                icon: fileMetadata.categoryIcon || "FileText",
                description: fileMetadata.categoryDescription,
                parentFile: null,
                files: [],
              });
            }

            const category = categories.get(fileMetadata.category)!;

            if (fileMetadata.isParent) {
              if (!category.parentFile) {
                category.parentFile = fileMetadata;

                if (fileMetadata.categoryDescription && !category.description) {
                  category.description = fileMetadata.categoryDescription;
                }
              }
            } else {
              category.files.push(fileMetadata);
            }
          }
        } catch (error) {
          console.error(`Error parsing file ${fullPath}:`, error);
        }
      }
    }
  }

  scanDirectory(docsPath);

  for (const [, category] of categories) {
    if (category.parentFile) {
      category.parentFile.content = resolveFileReferences(
        category.parentFile.content,
        allFiles
      );
    }
    for (const file of category.files) {
      file.content = resolveFileReferences(file.content, allFiles);
    }
  }

  if (useCache) {
    docsCache = {
      categories,
      timestamp: Date.now(),
    };
  }

  return categories;
}

export function getDocFile(
  docsPath: string,
  categoryName: string,
  filePath: string,
  useCache: boolean = true
): DocFileMetadata | null {
  const categories = scanDocumentationFiles(docsPath, useCache);
  const category = categories.get(categoryName);

  if (!category) {
    return null;
  }

  if (category.parentFile && category.parentFile.filePath === filePath) {
    return category.parentFile;
  }

  const file = category.files.find((f) => f.filePath === filePath);

  return file || null;
}

export function getCategoryFiles(
  docsPath: string,
  categoryName: string,
  useCache: boolean = true
): DocFileMetadata[] {
  const categories = scanDocumentationFiles(docsPath, useCache);
  const category = categories.get(categoryName);

  if (!category) {
    return [];
  }

  const files: DocFileMetadata[] = [];

  if (category.parentFile) {
    files.push(category.parentFile);
  }

  files.push(...category.files);

  return files;
}

export function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getCategory(
  docsPath: string,
  categoryName: string,
  useCache: boolean = true
): DocCategory | null {
  const categories = scanDocumentationFiles(docsPath, useCache);
  return categories.get(categoryName) || null;
}

export function getAllCategories(
  docsPath: string,
  useCache: boolean = true
): DocCategory[] {
  const categories = scanDocumentationFiles(docsPath, useCache);
  return Array.from(categories.values());
}

export function getFileByPath(
  docsPath: string,
  categoryName: string,
  filePath: string,
  useCache: boolean = true
): DocFileMetadata | null {
  const category = getCategory(docsPath, categoryName, useCache);

  if (!category) {
    return null;
  }

  const normalizedPath = filePath.endsWith(".md") ? filePath : `${filePath}.md`;
  const pathWithSpaces = normalizedPath.replace(/-/g, " ");

  let targetFile: DocFileMetadata | null = null;

  if (
    category.parentFile &&
    (category.parentFile.fileName === normalizedPath ||
      category.parentFile.fileName === pathWithSpaces ||
      category.parentFile.filePath.endsWith(filePath) ||
      category.parentFile.filePath.endsWith(normalizedPath) ||
      category.parentFile.filePath.endsWith(pathWithSpaces))
  ) {
    targetFile = category.parentFile;
  } else {
    targetFile =
      category.files.find(
        (f) =>
          f.fileName === normalizedPath ||
          f.fileName === pathWithSpaces ||
          f.filePath.endsWith(filePath) ||
          f.filePath.endsWith(normalizedPath) ||
          f.filePath.endsWith(pathWithSpaces)
      ) || null;
  }

  return targetFile;
}
