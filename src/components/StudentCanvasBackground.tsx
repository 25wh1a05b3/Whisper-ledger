import React from 'react';

export const StudentCanvasBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Base Subtle Dot-Grid / Notebook Matrix */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `radial-gradient(#94A3B8 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Soft, Energetic Daylight Ambient Washes (Sunny + Sky + Sage) */}
      {/* Top Left: Fresh Daylight Sky & Morning Azure */}
      <div className="absolute -top-32 -left-20 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-transparent blur-3xl" />

      {/* Top Right: Warm Creative Sun / Honey Highlighter Tint */}
      <div className="absolute -top-20 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-amber-100/50 via-yellow-100/30 to-transparent blur-3xl" />

      {/* Mid Left: Soft Mint / Campus Garden Accent */}
      <div className="absolute top-[40%] -left-36 w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent blur-3xl" />

      {/* Bottom Right: Playful Lilac / Sunset Study Glow */}
      <div className="absolute -bottom-24 -right-20 w-[560px] h-[560px] rounded-full bg-gradient-to-tl from-indigo-100/40 via-purple-50/30 to-transparent blur-3xl" />

      {/* 3. Hand-Crafted Student Life Micro-Accents (Tasteful, Low-Opacity, Asymmetrical) */}

      {/* Top Right: Subtle Angled Sticky Note with Pin Doodle */}
      <div className="hidden lg:block absolute top-24 right-12 opacity-85 rotate-3 transition-transform hover:rotate-6">
        <div className="relative w-36 p-3 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-200/90 shadow-sm border border-amber-300/60 text-amber-900/80 font-sans text-[11px] leading-tight select-none">
          {/* Pushpin / Tape Top Accent */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-amber-400/40 rounded-sm backdrop-blur-[1px] rotate-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]" />
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>Campus Charter</span>
          </div>
          <p className="text-[10px] text-amber-800/80 font-medium leading-snug">
            "Your voice matters. 100% blind encryption protects student identity."
          </p>
        </div>
      </div>

      {/* Top Left: Notebook Margin Line & Spiral Binding Silhouette */}
      <div className="hidden xl:flex absolute top-36 left-6 flex-col gap-3.5 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-white shadow-xs" />
            <div className="w-3 h-0.5 bg-slate-300" />
          </div>
        ))}
      </div>

      {/* Left Margin: Hand-drawn Pencil Doodle SVG */}
      <svg
        className="hidden lg:block absolute top-[48%] left-8 w-10 h-10 text-slate-300/80 -rotate-45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>

      {/* Right Margin: Open Book Silhouette & Highlighter Stroke */}
      <div className="hidden xl:block absolute top-[62%] right-10 opacity-60">
        <div className="relative">
          {/* Highlighter yellow brush stroke behind book */}
          <div className="absolute -inset-1.5 bg-yellow-200/50 -rotate-3 rounded-md blur-[1px]" />
          <svg
            className="relative w-9 h-9 text-blue-700/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
            <path d="M6 14h6" />
          </svg>
        </div>
      </div>

      {/* Bottom Left: Paperclip & Graduation Cap Symbolism */}
      <div className="hidden lg:block absolute bottom-24 left-14 opacity-50">
        <svg
          className="w-8 h-8 text-indigo-400/80 -rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l7.88-7.88" />
        </svg>
      </div>

      {/* Floating Sparkle / Learning Doodles */}
      <svg
        className="hidden md:block absolute top-[28%] right-[22%] w-5 h-5 text-amber-400/60"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
      </svg>
      <svg
        className="hidden md:block absolute top-[68%] left-[20%] w-4 h-4 text-sky-400/60"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
      </svg>
    </div>
  );
};
