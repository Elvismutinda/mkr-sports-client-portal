"use client";

import { useState } from "react";
import Image from "next/image";
import { Player } from "@/types/types";
import { PositionBadge } from "./PositionBadge";
import { StatCell } from "./StatCell";
import { SkillIndexBar } from "./SkillIndexBar";

function PulseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline
        points="2 12 6 4 10 18 14 8 18 14 22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <line
        x1="2"
        y1="12"
        x2="6"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <line
        x1="18"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4h1M17 4h3a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4h-1M7 4h10v7a5 5 0 0 1-10 0V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  player: Player;
};

export function PlayerCard({ player }: Props) {
  const [hovered, setHovered] = useState(false);

  const displayName = (() => {
    const parts = player.name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}. ${parts.slice(1).join(" ")}`.toUpperCase();
    }
    return player.name.toUpperCase();
  })();

  return (
    <div
      className={`relative rounded-2xl border border-white/8 bg-[#0d1117] p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${
        hovered
          ? "scale-[1.02] border-yellow-400/20 shadow-yellow-400/10 shadow-xl"
          : "shadow-lg"
      }`}
      style={{
        background:
          "linear-gradient(145deg, #13181f 0%, #0d1117 70%, #090d13 100%)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute right-4 top-4 opacity-[0.04] pointer-events-none select-none"
        aria-hidden
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4h1M17 4h3a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4h-1M7 4h10v7a5 5 0 0 1-10 0V4Z" />
        </svg>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 bg-slate-800">
            <Image
              src={player.avatarUrl || "/images/default-avatar.png"}
              alt={player.name}
              width={64}
              height={64}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <PositionBadge position={player.position} />
          </div>
        </div>

        <div className="min-w-0">
          <h3
            className="font-black text-xl text-white leading-tight truncate"
            style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
          >
            {displayName}
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold tracking-[0.12em] uppercase mt-1">
            Personnel ID: {player.id.slice(0, 7).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <StatCell
          icon={<PulseIcon />}
          value={player.stats.matchesPlayed}
          label="OPS"
        />
        <StatCell
          icon={<TargetIcon />}
          value={player.stats.goals}
          label="Goals"
          highlight={player.stats.goals > 0}
        />
        <StatCell icon={<TrophyIcon />} value={player.stats.motm} label="MVP" />
      </div>

      <SkillIndexBar rating={player.stats.rating} />
    </div>
  );
}
