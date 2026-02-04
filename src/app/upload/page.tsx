"use client";

import { useState } from "react";

const CONTENT_TYPES = [
  { value: "fiction-long", label: "Fiction (Long)" },
  { value: "fiction-short", label: "Fiction (Short)" },
  { value: "non-fiction-long", label: "Non-Fiction (Long)" },
  { value: "non-fiction-short", label: "Non-Fiction (Short)" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "abstract-still", label: "Abstract (Still)" },
  { value: "abstract-moving", label: "Abstract (Moving)" },
];

const TEXT_TYPES = ["fiction-long", "fiction-short", "non-fiction-long", "non-fiction-short"];
const IMAGE_TYPES = ["photo", "abstract-still"];
const VIDEO_TYPES = ["video", "abstract-moving"];

export default function UploadPage() {
  const [contentType, setContentType] = useState("");
  const [fileName, setFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isTextType = TEXT_TYPES.includes(contentType);
  const isImageType = IMAGE_TYPES.includes(contentType);
  const isVideoType = VIDEO_TYPES.includes(contentType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contentType || !fileName) {
      setStatus("error");
      setMessage("Please fill in all required fields");
      return;
    }

    if (isTextType && !textContent) {
      setStatus("error");
      setMessage("Please enter some content");
      return;
    }

    if ((isImageType || isVideoType) && !file) {
      setStatus("error");
      setMessage("Please select a file");
      return;
    }

    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("contentType", contentType);
      formData.append("fileName", fileName);

      if (isTextType) {
        formData.append("textContent", textContent);
      } else if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Content uploaded successfully!");
        // Reset form
        setFileName("");
        setTextContent("");
        setFile(null);
      } else {
        setStatus("error");
        setMessage(data.error || "Upload failed");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  };

  const getAcceptType = () => {
    if (isImageType) return "image/*";
    if (isVideoType) return "video/*";
    return "";
  };

  return (
    <div className="min-h-screen bg-white p-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl mb-8 text-center">upload content</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm mb-2 text-neutral-600">
              content type
            </label>
            <select
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value);
                setFile(null);
                setTextContent("");
              }}
              className="w-full p-3 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-400"
            >
              <option value="">select type...</option>
              {CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm mb-2 text-neutral-600">
              file name (no extension)
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="my-content-name"
              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* Text Content */}
          {isTextType && (
            <div>
              <label className="block text-sm mb-2 text-neutral-600">
                content (markdown supported)
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={12}
                placeholder="Write your content here..."
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 font-mono text-sm"
              />
            </div>
          )}

          {/* File Upload */}
          {(isImageType || isVideoType) && (
            <div>
              <label className="block text-sm mb-2 text-neutral-600">
                {isImageType ? "image file" : "video file"}
              </label>
              <input
                type="file"
                accept={getAcceptType()}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
              />
              {file && (
                <p className="text-sm text-neutral-500 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "uploading" || !contentType}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {status === "uploading" ? "uploading..." : "upload"}
          </button>

          {/* Status Message */}
          {message && (
            <p
              className={`text-center ${
                status === "success" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-neutral-400 hover:text-neutral-600 text-sm">
            ← back to site
          </a>
        </div>
      </div>
    </div>
  );
}
