"use client";

interface FinBannerProps {
  onClick: () => void;
}

export default function FinBanner({ onClick }: FinBannerProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-black text-white py-8 text-center font-mono text-sm tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer"
    >
      [fin]
    </button>
  );
}
