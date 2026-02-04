"use client";

import { useMemo } from "react";

interface Choice {
  label: string;
  value: string;
}

interface ChoiceNodeProps {
  choices: [Choice, Choice];
  onSelect: (value: string, color: string) => void;
}

// Colors from the palette
const colors = [
  "#ef476f", // bubblegum_pink
  "#ffd166", // golden_pollen
  "#06d6a0", // emerald
  "#118ab2", // ocean_blue
  "#073b4c", // dark_teal
];

function getRandomColor(exclude?: string): string {
  const available = exclude ? colors.filter((c) => c !== exclude) : colors;
  return available[Math.floor(Math.random() * available.length)];
}

// Random position within safe bounds (not too close to edges)
function getRandomPosition(): { x: number; y: number } {
  // Keep within 15-85% of viewport to avoid edges
  const x = 15 + Math.random() * 70;
  const y = 20 + Math.random() * 60;
  return { x, y };
}

export default function ChoiceNode({ choices, onSelect }: ChoiceNodeProps) {
  // Generate colors and position synchronously when choices change
  const { color1, color2, position } = useMemo(() => {
    const c1 = getRandomColor();
    const c2 = getRandomColor(c1);
    const pos = getRandomPosition();
    return { color1: c1, color2: c2, position: pos };
  }, [choices[0].value, choices[1].value]);

  return (
    <div className="min-h-screen bg-white relative">
      <div
        className="absolute flex items-center gap-6 text-2xl md:text-3xl lowercase -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        <button
          onClick={() => onSelect(choices[0].value, color1)}
          className="hover:opacity-50 transition-opacity duration-300 relative group"
          style={{ color: color1 }}
        >
          {choices[0].label}
          <span
            className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: color1 }}
          />
        </button>
        <span className="text-neutral-300">/</span>
        <button
          onClick={() => onSelect(choices[1].value, color2)}
          className="hover:opacity-50 transition-opacity duration-300 relative group"
          style={{ color: color2 }}
        >
          {choices[1].label}
          <span
            className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: color2 }}
          />
        </button>
      </div>
    </div>
  );
}
