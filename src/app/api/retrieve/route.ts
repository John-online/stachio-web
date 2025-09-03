import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("file");
    if (!id) {
        return new Response("Missing file parameter", { status: 400 });
    }

    if (id !== "/legal/privacy.md" && id !== "/legal/terms.md") {
        return new Response("Forbidden", { status: 403 });
    }

    const filePath = path.join(process.cwd(), "src/assets", id);

    try {
        const file = await fs.readFile(filePath);
        const contentType = getContentType(filePath);

        return new Response(new Uint8Array(file), { headers: { "Content-Type": contentType } });
    } catch (err) {
        return new Response("Not found", { status: 404 });
    }
}

function getContentType(filePath: string): string {
    const ext = path.extname(filePath);
    switch (ext) {
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        case ".pdf":
            return "application/pdf";
        case ".txt":
            return "text/plain";
        case ".json":
            return "application/json";
        default:
            return "application/octet-stream";
    }
}