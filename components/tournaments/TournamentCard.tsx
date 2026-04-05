"use client";

import { useState } from "react";
import { Tournament } from "@/types/types";
import { statusConfig } from "@/config/status";
import { PinIcon, TrophyIcon, CalendarIcon } from "./Icons";
import { Button } from "../ui/button";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const [hovered, setHovered] = useState(false);
  const cfg = statusConfig[tournament.status];
  const isCompleted = tournament.status === "COMPLETED";

  return (
    <div
      className={`relative rounded-2xl border ${cfg.border} p-7 flex flex-col gap-5 transition-all duration-300 shadow-xl ${cfg.glow} ${
        hovered ? "scale-[1.015] brightness-110" : ""
      }`}
      style={{
        background:
          "linear-gradient(145deg, #13181f 0%, #0d1117 60%, #0a0e14 100%)",
        boxShadow: hovered
          ? "0 8px 40px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 4px 24px 0 rgba(0,0,0,0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`absolute top-0 right-6 px-3 py-1.5 rounded-b-lg ${cfg.bg} ${cfg.text} text-[10px] font-black tracking-[0.18em] uppercase`}
      >
        {tournament.status === "ONGOING" && (
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 animate-pulse`}
          />
        )}
        {tournament.status}
      </div>

      <div>
        <h2
          className={`font-black text-xl md:text-2xl uppercase leading-tight ${
            isCompleted ? "text-slate-400" : "text-white"
          }`}
          style={{
            letterSpacing: "-0.01em",
          }}
        >
          {tournament.name}
        </h2>
        <div className="flex items-center gap-1 mt-2 text-slate-500 text-[11px] font-semibold tracking-[0.14em] uppercase">
          <PinIcon />
          {tournament.location}
        </div>
      </div>

      <p
        className={`text-sm leading-relaxed italic font-medium ${
          isCompleted ? "text-slate-600" : "text-slate-300"
        }`}
      >
        &ldquo;{tournament.description}&rdquo;
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3">
          <span className={isCompleted ? "text-slate-500" : "text-yellow-400"}>
            <TrophyIcon />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500">
              Prize Pool
            </p>
            <p
              className={`font-black text-sm tracking-wide ${
                isCompleted ? "text-slate-500" : "text-white"
              }`}
            >
              KSH {tournament.prizePool.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3">
          <span className={isCompleted ? "text-slate-500" : "text-yellow-400"}>
            <CalendarIcon />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500">
              Commencement
            </p>
            <p
              className={`font-black text-sm tracking-wide ${
                isCompleted ? "text-slate-500" : "text-white"
              }`}
            >
              {tournament.commencement}
            </p>
          </div>
        </div>
      </div>

      <Button
        disabled={isCompleted}
        variant={isCompleted ? "secondary" : "primary"}
      >
        {isCompleted ? "TOURNAMENT CLOSED" : "REGISTER TEAM"}
      </Button>
    </div>
  );
}