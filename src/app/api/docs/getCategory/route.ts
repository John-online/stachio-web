import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface CategoryContent {
  name: string;
  files: {
    name: string;
    lastModified: number;
  }[];
}

interface CacheEntry {
  data: {
    success: boolean;
    categories?: CategoryContent[];
    category?: CategoryContent;
    count: number;
  };
  timestamp: number;
  lastModified: number;
}

let cache: CacheEntry | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

function getDirectoryLastModified(dirPath: string): number {
  try {
    const stats = fs.statSync(dirPath);
    return stats.mtime.getTime();
  } catch {
    return 0;
  }
}

function readCategoryContent(
  categoryPath: string,
  categoryName: string
): CategoryContent {
  const files: CategoryContent["files"] = [];

  try {
    const items = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile() && item.name.endsWith(".md")) {
        const filePath = path.join(categoryPath, item.name);
        try {
          const stats = fs.statSync(filePath);

          files.push({
            name: item.name,
            lastModified: stats.mtime.getTime(),
          });
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading category ${categoryName}:`, error);
  }

  return {
    name: categoryName,
    files: files.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function isCacheValid(docsPath: string): boolean {
  if (!cache) return false;

  const now = Date.now();
  const isExpired = now - cache.timestamp > CACHE_DURATION;

  if (isExpired) return false;

  const currentLastModified = getDirectoryLastModified(docsPath);
  return currentLastModified === cache.lastModified;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    const docsPath = path.join(process.cwd(), "src", "assets", "docs");

    if (!fs.existsSync(docsPath)) {
      return NextResponse.json(
        { error: "No Categories found" },
        { status: 404 }
      );
    }

    if (categoryParam) {
      const categoryPath = path.join(docsPath, categoryParam);

      if (
        !fs.existsSync(categoryPath) ||
        !fs.statSync(categoryPath).isDirectory()
      ) {
        return NextResponse.json(
          { error: `Category '${categoryParam}' not found` },
          { status: 404 }
        );
      }

      const category = readCategoryContent(categoryPath, categoryParam);

      const data = {
        success: true,
        category,
        count: category.files.length,
      };

      const response = NextResponse.json(data);
      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300"
      );

      return response;
    }

    if (isCacheValid(docsPath) && cache) {
      const response = NextResponse.json(cache.data);

      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300"
      );
      response.headers.set("ETag", `"${cache.lastModified}"`);

      return response;
    }

    const items = fs.readdirSync(docsPath, { withFileTypes: true });

    const categoryNames = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .sort();

    const categories = categoryNames.map((categoryName) => {
      const categoryPath = path.join(docsPath, categoryName);
      return readCategoryContent(categoryPath, categoryName);
    });

    const data = {
      success: true,
      categories,
      count: categories.length,
    };

    cache = {
      data,
      timestamp: Date.now(),
      lastModified: getDirectoryLastModified(docsPath),
    };

    const response = NextResponse.json(data);

    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
    response.headers.set("ETag", `"${cache.lastModified}"`);

    return response;
  } catch (error) {
    console.error("Error reading docs categories:", error);
    return NextResponse.json(
      { error: "Failed to read categories" },
      { status: 500 }
    );
  }
}
