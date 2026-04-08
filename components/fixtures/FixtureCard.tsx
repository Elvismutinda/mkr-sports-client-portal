"use client";

import { useState } from "react";
import Link from "next/link";
import { Match, FixtureStatus, Position } from "@/types/types";
import { FixtureStatusBadge } from "./FixtureStatusBadge";
import { ScoreDisplay } from "./ScoreDisplay";
import { PositionBadge } from "../roster/PositionBadge";
import { ChevronRight, MapPin, Calendar } from "lucide-react";

function getStatus(match: Match): FixtureStatus {
  if (match.completed) return "COMPLETED";
  const now = new Date();
  const matchDate = new Date(match.date);
  const diffMs = matchDate.getTime() - now.getTime();
  const diffMins = diffMs / 1000 / 60;
  if (diffMins >= 0 && diffMins <= 90) return "LIVE";
  return "UPCOMING";
}

interface Props {
  match: Match;
  playerPosition?: Position | null;
}

export function FixtureCard({ match, playerPosition }: Props) {
  const [hovered, setHovered] = useState(false);
  const status = getStatus(match);
  const isCompleted = status === "COMPLETED";

  const gameDate = new Date(match.date);
  const dateStr = gameDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = gameDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/app/fixtures/${match.id}`}>
      <div
        className={`relative rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${
          isCompleted
            ? "border-white/5 opacity-70 hover:opacity-90"
            : "border-white/8 hover:border-yellow-400/20 hover:shadow-yellow-400/10 hover:shadow-xl"
        } ${hovered ? "scale-[1.015]" : ""}`}
        style={{
          background:
            "linear-gradient(145deg, #13181f 0%, #0d1117 70%, #090d13 100%)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center justify-between">
          <FixtureStatusBadge status={status} />
          <PositionBadge position={playerPosition ?? null} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
              Home
            </p>
            <p className="font-black text-sm uppercase text-white truncate max-w-25">
              {match.homeTeam.length > 0 ? "Home" : "TBD"}
            </p>
          </div>

          <ScoreDisplay score={match.score} completed={match.completed} />

          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1">
              Away
            </p>
            <p className="font-black text-sm uppercase text-white truncate max-w-25">
              {match.awayTeam.length > 0 ? "Away" : "TBD"}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <Calendar className="w-4 h-4" />
              {dateStr} · {timeStr}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <MapPin className="w-4 h-4" />
              {match.location}
            </div>
          </div>

          <span
            className={`text-slate-600 transition-transform duration-200 ${
              hovered ? "translate-x-1 text-yellow-400" : ""
            }`}
          >
            <ChevronRight />
          </span>
        </div>

        {match.matchReport && (
          <div className="bg-black/30 rounded-xl px-3 py-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
              Report
            </p>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {match.matchReport}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
