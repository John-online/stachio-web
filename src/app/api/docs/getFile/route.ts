import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { scanDocumentationFiles } from "@/lib/docs-utils";

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

    const categoriesMap = scanDocumentationFiles(docsPath, true);
    const categoryData = categoriesMap.get(category);

    if (!categoryData) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const normalizedFilename = filename.endsWith(".md")
      ? filename
      : `${filename}.md`;

    const filenameWithSpaces = normalizedFilename.replace(/-/g, " ");

    let fileData = null;

    if (
      categoryData.parentFile &&
      (categoryData.parentFile.fileName === normalizedFilename ||
        categoryData.parentFile.fileName === filenameWithSpaces ||
        categoryData.parentFile.filePath.endsWith(filename) ||
        categoryData.parentFile.filePath.endsWith(normalizedFilename) ||
        categoryData.parentFile.filePath.endsWith(filenameWithSpaces))
    ) {
      fileData = categoryData.parentFile;
    } else {
      fileData = categoryData.files.find(
        (f) =>
          f.fileName === normalizedFilename ||
          f.fileName === filenameWithSpaces ||
          f.filePath.endsWith(filename) ||
          f.filePath.endsWith(normalizedFilename) ||
          f.filePath.endsWith(filenameWithSpaces)
      );
    }

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const data = {
      success: true,
      content: fileData.content,
      metadata: {
        name: fileData.name,
        category: fileData.category,
        categoryIcon: fileData.categoryIcon,
        isParent: fileData.isParent,
      },
      filename: fileData.fileName,
      category: fileData.category,
    };

    const response = NextResponse.json(data);

    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");

    return response;
  } catch (error) {
    console.error("Error reading documentation file:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
