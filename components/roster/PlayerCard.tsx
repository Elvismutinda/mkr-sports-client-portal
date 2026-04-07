"use client";

import { useState } from "react";
import Image from "next/image";
import { Player } from "@/types/types";
import { PositionBadge } from "./PositionBadge";
import { StatCell } from "./StatCell";
import { SkillIndexBar } from "./SkillIndexBar";
import { RemovePlayerButton } from "./invite/RemovePlayerButton";
import { Trophy, Activity, Target } from "lucide-react";

type Props = {
  player: Player & { isCaptain: boolean };
  onRemove?: () => void; // undefined = not a captain, hide remove
};

export function PlayerCard({ player, onRemove }: Props) {
  const [hovered, setHovered] = useState(false);

  const displayName = (() => {
    const parts = player.name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}. ${parts.slice(1).join(" ")}`.toUpperCase();
    }
    return player.name.toUpperCase();
  })();

  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative rounded-2xl border border-white/8 bg-[#0d1117] p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${
        hovered
          ? "scale-[1.02] border-yellow-400/20 shadow-yellow-400/10 shadow-xl"
          : "shadow-xs"
      }`}
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
            {player.avatarUrl ? (
              <Image
                src={player.avatarUrl}
                alt={player.name}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl font-black text-slate-300">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <PositionBadge position={player.position} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-xl text-white truncate">
              {displayName}
            </h3>

            {player.isCaptain && (
              <span className="text-[8px] px-2 py-0.5 rounded bg-mkr-yellow text-black font-black uppercase">
                Captain
              </span>
            )}
          </div>

          <p className="text-[10px] text-slate-500 font-semibold tracking-[0.12em] uppercase mt-1">
            ID: {player.id.slice(0, 7).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <StatCell
          icon={<Activity />}
          value={player.stats?.matchesPlayed ?? 0}
          label="OPS"
        />
        <StatCell
          icon={<Target />}
          value={player.stats?.goals ?? 0}
          label="Goals"
          highlight={(player.stats?.goals ?? 0) > 0}
        />
        <StatCell
          icon={<Trophy />}
          value={player.stats?.motm ?? 0}
          label="MVP"
        />
      </div>

      <SkillIndexBar rating={player.stats?.rating ?? 0} />

      {/* Remove action — only shown when captain passes onRemove */}
      {onRemove && (
        <div className="pt-3 border-t border-white/5 flex justify-end">
          <RemovePlayerButton
            playerId={player.id}
            playerName={player.name}
            onRemoved={onRemove}
          />
        </div>
      )}
    </div>
  );
}
