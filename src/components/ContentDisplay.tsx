"use client";

import ReactMarkdown from "react-markdown";
import FinBanner from "./FinBanner";

interface Content {
  type: "text" | "image" | "video";
  content?: string;
  path?: string;
  filename: string;
}

interface ContentDisplayProps {
  content: Content;
  onRestart: () => void;
}

export default function ContentDisplay({
  content,
  onRestart,
}: ContentDisplayProps) {
  // Video gets full screen treatment
  if (content.type === "video" && content.path) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <div className="flex-1 flex items-center justify-center">
          <video
            src={content.path}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
            style={{ maxHeight: 'calc(100vh - 60px)' }}
          />
        </div>
        <FinBanner onClick={onRestart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <div className="flex-1 flex items-center justify-center p-8 py-16">
        {content.type === "text" && content.content && (
          <div className="max-w-prose">
            <article className="prose prose-lg">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ fontSize: '1.375rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: '3px solid #111', paddingLeft: '1rem', fontStyle: 'italic', margin: '1.5rem 0' }}>
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} style={{ color: '#118ab2', textDecoration: 'underline' }}>
                      {children}
                    </a>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: 'italic' }}>{children}</em>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 700 }}>{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ margin: '1rem 0', paddingLeft: '1.5rem', listStyleType: 'decimal' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.5rem' }}>{children}</li>
                  ),
                  hr: () => (
                    <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '2rem 0' }} />
                  ),
                }}
              >
                {content.content}
              </ReactMarkdown>
            </article>
          </div>
        )}

        {content.type === "image" && content.path && (
          <img
            src={content.path}
            alt=""
            className="max-w-full max-h-[80vh] object-contain"
          />
        )}
      </div>

      <FinBanner onClick={onRestart} />
    </div>
  );
}
