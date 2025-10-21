import { NextResponse } from "next/server";
import path from "path";
import { scanDocumentationFiles } from "@/lib/docs-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    if (!categoryParam) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    const docsPath = path.join(process.cwd(), "src", "assets", "docs");

    const categoriesMap = scanDocumentationFiles(docsPath, true);
    const category = categoriesMap.get(categoryParam);

    if (!category) {
      return NextResponse.json(
        { error: `Category '${categoryParam}' not found` },
        { status: 404 }
      );
    }

    const data = {
      success: true,
      category: {
        name: category.name,
        icon: category.icon,
        parentFile: category.parentFile,
        files: [
          ...(category.parentFile
            ? [
                {
                  name: category.parentFile.name,
                  fileName: category.parentFile.fileName,
                  filePath: category.parentFile.filePath,
                  isParent: true,
                },
              ]
            : []),
          ...category.files.map((file) => ({
            name: file.name,
            fileName: file.fileName,
            filePath: file.filePath,
            isParent: false,
          })),
        ],
      },
    };

    const response = NextResponse.json(data);

    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");

    return response;
  } catch (error) {
    console.error("Error reading docs category:", error);
    return NextResponse.json(
      { error: "Failed to read category" },
      { status: 500 }
    );
  }
}
