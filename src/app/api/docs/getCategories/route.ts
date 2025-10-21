import { NextResponse } from "next/server";
import path from "path";
import { scanDocumentationFiles } from "@/lib/docs-utils";

export async function GET() {
  try {
    const docsPath = path.join(process.cwd(), "src", "assets", "docs");

    const categoriesMap = scanDocumentationFiles(docsPath);

    const categories = Array.from(categoriesMap.values()).map((category) => ({
      name: category.name,
      icon: category.icon,
      hasParent: category.parentFile !== null,
      fileCount: category.files.length + (category.parentFile ? 1 : 0),
    }));

    const data = {
      success: true,
      categories,
      count: categories.length,
    };

    const response = NextResponse.json(data);
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");

    return response;
  } catch (error) {
    console.error("Error reading docs categories:", error);
    return NextResponse.json(
      { error: "Failed to read categories" },
      { status: 500 }
    );
  }
}
