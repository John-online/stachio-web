import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface CacheEntry {
  data: {
    success: boolean;
    categories: string[];
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

function isCacheValid(docsPath: string): boolean {
  if (!cache) return false;

  const now = Date.now();
  const isExpired = now - cache.timestamp > CACHE_DURATION;

  if (isExpired) return false;

  const currentLastModified = getDirectoryLastModified(docsPath);
  return currentLastModified === cache.lastModified;
}

export async function GET() {
  try {
    const docsPath = path.join(process.cwd(), "src", "assets", "docs");

    if (!fs.existsSync(docsPath)) {
      return NextResponse.json(
        { error: "No Categories found" },
        { status: 404 }
      );
    }

    if (isCacheValid(docsPath)) {
      const response = NextResponse.json(cache!.data);

      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300"
      );
      response.headers.set("ETag", `"${cache!.lastModified}"`);

      return response;
    }

    const items = fs.readdirSync(docsPath, { withFileTypes: true });

    const categories = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .sort();

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
