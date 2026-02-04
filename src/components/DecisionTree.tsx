"use client";

import { useState } from "react";
import ChoiceNode from "./ChoiceNode";
import ContentDisplay from "./ContentDisplay";

// Decision tree structure
// Each node has choices that lead to either another node or a content category
type TreeNode = {
  choices: [
    { label: string; value: string; next: TreeNode | string },
    { label: string; value: string; next: TreeNode | string }
  ];
};

const tree: TreeNode = {
  choices: [
    {
      label: "written",
      value: "written",
      next: {
        choices: [
          {
            label: "fiction",
            value: "fiction",
            next: {
              choices: [
                { label: "long", value: "long", next: "fiction-long" },
                { label: "short", value: "short", next: "fiction-short" },
              ],
            },
          },
          {
            label: "non-fiction",
            value: "non-fiction",
            next: {
              choices: [
                { label: "long", value: "long", next: "non-fiction-long" },
                { label: "short", value: "short", next: "non-fiction-short" },
              ],
            },
          },
        ],
      },
    },
    {
      label: "visual",
      value: "visual",
      next: {
        choices: [
          {
            label: "moving",
            value: "moving",
            next: {
              choices: [
                { label: "video", value: "video", next: "video" },
                { label: "abstract", value: "abstract", next: "abstract-moving" },
              ],
            },
          },
          {
            label: "still",
            value: "still",
            next: {
              choices: [
                { label: "photo", value: "photo", next: "photo" },
                { label: "abstract", value: "abstract", next: "abstract-still" },
              ],
            },
          },
        ],
      },
    },
  ],
};

type Content = {
  type: "text" | "image" | "video";
  content?: string;
  path?: string;
  filename: string;
};

// Colors from the palette for transition overlay
const colors = [
  "#ef476f", // bubblegum_pink
  "#ffd166", // golden_pollen
  "#06d6a0", // emerald
  "#118ab2", // ocean_blue
  "#073b4c", // dark_teal
];

function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function DecisionTree() {
  const [currentNode, setCurrentNode] = useState<TreeNode>(tree);
  const [content, setContent] = useState<Content | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionColor, setTransitionColor] = useState(getRandomColor());

  const handleSelect = async (value: string, color: string) => {
    const selected = currentNode.choices.find((c) => c.value === value);
    if (!selected) return;

    // Use the color of the clicked text for the transition
    setTransitionColor(color);

    // Start fade out
    setIsTransitioning(true);

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (typeof selected.next === "string") {
      // Terminal node - fetch content
      try {
        const res = await fetch(`/api/content/${selected.next}`);
        const data = await res.json();

        if (res.ok) {
          setContent(data);
        } else {
          // No content available, show error state
          setContent({
            type: "text",
            content: "no content yet...",
            filename: "empty",
          });
        }
      } catch {
        setContent({
          type: "text",
          content: "something went wrong...",
          filename: "error",
        });
      }
    } else {
      // Navigate deeper
      setCurrentNode(selected.next);
    }

    // Fade back in
    setIsTransitioning(false);
  };

  const handleRestart = async () => {
    setTransitionColor("#000000");
    setIsTransitioning(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    setContent(null);
    setCurrentNode(tree);

    setIsTransitioning(false);
  };

  return (
    <div className="relative">
      {/* Color overlay for transitions */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-400 z-50"
        style={{
          backgroundColor: transitionColor,
          opacity: isTransitioning ? 1 : 0,
        }}
      />

      {content ? (
        <ContentDisplay content={content} onRestart={handleRestart} />
      ) : (
        <ChoiceNode
          choices={[
            { label: currentNode.choices[0].label, value: currentNode.choices[0].value },
            { label: currentNode.choices[1].label, value: currentNode.choices[1].value },
          ]}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
