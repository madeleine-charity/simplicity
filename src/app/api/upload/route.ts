import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_CATEGORIES = [
  "fiction-long",
  "fiction-short",
  "non-fiction-long",
  "non-fiction-short",
  "video",
  "photo",
  "abstract-moving",
  "abstract-still",
];

const TEXT_TYPES = ["fiction-long", "fiction-short", "non-fiction-long", "non-fiction-short"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const contentType = formData.get("contentType") as string;
    const fileName = formData.get("fileName") as string;
    const textContent = formData.get("textContent") as string | null;
    const file = formData.get("file") as File | null;

    // Validate
    if (!contentType || !VALID_CATEGORIES.includes(contentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    if (!fileName || !/^[a-z0-9-]+$/.test(fileName)) {
      return NextResponse.json(
        { error: "Invalid file name (use lowercase letters, numbers, and hyphens only)" },
        { status: 400 }
      );
    }

    const contentDir = path.join(process.cwd(), "content", contentType);

    // Ensure directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    if (TEXT_TYPES.includes(contentType)) {
      // Handle text content
      if (!textContent) {
        return NextResponse.json({ error: "Text content is required" }, { status: 400 });
      }

      const filePath = path.join(contentDir, `${fileName}.md`);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ error: "A file with this name already exists" }, { status: 400 });
      }

      fs.writeFileSync(filePath, textContent);

      return NextResponse.json({ success: true, path: filePath });
    } else {
      // Handle file upload
      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }

      // Get file extension
      const originalName = file.name;
      const ext = path.extname(originalName).toLowerCase();

      // Validate extension
      const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const videoExts = [".mp4", ".webm", ".mov"];

      const isImage = ["photo", "abstract-still"].includes(contentType);
      const isVideo = ["video", "abstract-moving"].includes(contentType);

      if (isImage && !imageExts.includes(ext)) {
        return NextResponse.json(
          { error: "Invalid image format. Use: jpg, png, gif, or webp" },
          { status: 400 }
        );
      }

      if (isVideo && !videoExts.includes(ext)) {
        return NextResponse.json(
          { error: "Invalid video format. Use: mp4, webm, or mov" },
          { status: 400 }
        );
      }

      const filePath = path.join(contentDir, `${fileName}${ext}`);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ error: "A file with this name already exists" }, { status: 400 });
      }

      // Write file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ success: true, path: filePath });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
