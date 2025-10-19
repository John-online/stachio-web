import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface CacheEntry {
  data: {
    success: boolean;
    content: string;
    metadata: Record<string, string>;
    filename: string;
    category: string;
  };
  timestamp: number;
  lastModified: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000;

function getFileLastModified(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.getTime();
  } catch {
    return 0;
  }
}

function parseDocumentationFile(content: string): {
  metadata: Record<string, string>;
  processedContent: string;
} {
  const fileMatch = content.match(/<file>([\s\S]*?)<\/file>/);
  const contentMatch = content.match(/<content>([\s\S]*?)<\/content>/);

  const metadata: Record<string, string> = {};
  let processedContent = content;

  if (fileMatch && contentMatch) {
    const fileSection = fileMatch[1];
    const nameMatch = fileSection.match(/<file:name\s+str="([^"]+)"\s*>/);

    if (nameMatch) {
      metadata["file.name"] = nameMatch[1];
    }

    const rawContent = contentMatch[1].trim();

    processedContent = rawContent.replace(
      /\{\{([^}]+)\}\}/g,
      (match, variable) => {
        const trimmedVar = variable.trim();
        return metadata[trimmedVar] || match;
      }
    );
  }

  return { metadata, processedContent };
}

function isCacheValid(cacheKey: string, filePath: string): boolean {
  const cacheEntry = cache.get(cacheKey);
  if (!cacheEntry) return false;

  const now = Date.now();
  const isExpired = now - cacheEntry.timestamp > CACHE_DURATION;

  if (isExpired) return false;

  const currentLastModified = getFileLastModified(filePath);
  return currentLastModified === cacheEntry.lastModified;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const filename = searchParams.get("filename");

    if (!category || !filename) {
      return NextResponse.json(
        { error: "Category and filename parameters are required" },
        { status: 400 }
      );
    }

    const docsPath = path.join(process.cwd(), "src", "assets", "docs");
    const categoryPath = path.join(docsPath, category);
    const filePath = path.join(categoryPath, filename);

    if (!filePath.startsWith(docsPath)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const cacheKey = `${category}/${filename}`;

    if (isCacheValid(cacheKey, filePath)) {
      const cacheEntry = cache.get(cacheKey)!;
      const response = NextResponse.json(cacheEntry.data);

      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300"
      );
      response.headers.set("ETag", `"${cacheEntry.lastModified}"`);

      return response;
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { metadata, processedContent } = parseDocumentationFile(rawContent);

    const data = {
      success: true,
      content: processedContent,
      metadata,
      filename,
      category,
    };

    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now(),
      lastModified: getFileLastModified(filePath),
    };

    cache.set(cacheKey, cacheEntry);

    const response = NextResponse.json(data);

    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
    response.headers.set("ETag", `"${cacheEntry.lastModified}"`);

    return response;
  } catch (error) {
    console.error("Error reading documentation file:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
