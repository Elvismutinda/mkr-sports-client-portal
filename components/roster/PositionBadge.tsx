"use client";

import { Position } from "@/types/types";

const positionConfig: Record<
  Position,
  { label: string; bg: string; text: string }
> = {
  Forward: { label: "FOR", bg: "bg-yellow-400", text: "text-black" },
  Midfielder: { label: "MID", bg: "bg-blue-500", text: "text-white" },
  Defender: { label: "DEF", bg: "bg-emerald-500", text: "text-white" },
  Goalkeeper: { label: "GOA", bg: "bg-orange-500", text: "text-white" },
};

export function PositionBadge({ position }: { position: Position }) {
  const cfg = positionConfig[position] ?? {
    label: position.slice(0, 3).toUpperCase(),
    bg: "bg-slate-600",
    text: "text-white",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}
