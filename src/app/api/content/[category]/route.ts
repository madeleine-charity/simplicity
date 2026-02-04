import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TEXT_CATEGORIES = [
  "fiction-long",
  "fiction-short",
  "non-fiction-long",
  "non-fiction-short",
];

const MEDIA_CATEGORIES = [
  "video",
  "photo",
  "abstract-moving",
  "abstract-still",
];

const VALID_CATEGORIES = [...TEXT_CATEGORIES, ...MEDIA_CATEGORIES];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  // Text content is in /content, media is in /public/content
  const isMedia = MEDIA_CATEGORIES.includes(category);
  const contentDir = isMedia
    ? path.join(process.cwd(), "public", "content", category)
    : path.join(process.cwd(), "content", category);

  try {
    const files = fs.readdirSync(contentDir);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No content available" },
        { status: 404 }
      );
    }

    // Pick random file
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(contentDir, randomFile);
    const ext = path.extname(randomFile).toLowerCase();

    // For text content (.md, .txt), return the content
    if (ext === ".md" || ext === ".txt") {
      const content = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json({
        type: "text",
        content,
        filename: randomFile,
      });
    }

    // For images
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      return NextResponse.json({
        type: "image",
        path: `/content/${category}/${randomFile}`,
        filename: randomFile,
      });
    }

    // For video
    if ([".mp4", ".webm", ".mov"].includes(ext)) {
      return NextResponse.json({
        type: "video",
        path: `/content/${category}/${randomFile}`,
        filename: randomFile,
      });
    }

    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Content not found" },
      { status: 404 }
    );
  }
}
