"use client";

import { useState } from "react";
import TeamSearchBar from "@/app/(landing)/teams/(components)/TeamSearchBar";
import TeamGrid from "@/app/(landing)/teams/(components)/TeamGrid";
import { Team } from "@/types/types";

const ALL_TEAMS: Team[] = [
  {
    id: "1",
    name: "Nairobi Ninjas",
    badge: "NN",
    type: "Tactical Unit",
    bio: '"The most lethal 5-a-side team in the central sector."',
    stats: { ops: 10, won: 7, rtg: 8.8 },
    members: ["A", "B"],
  },
  {
    id: "2",
    name: "Mombasa Marauders",
    badge: "MM",
    type: "Tactical Unit",
    bio: '"Coastal tactical unit specializing in high-pressure defense."',
    stats: { ops: 8, won: 4, rtg: 7.5 },
    members: ["C"],
  },
  {
    id: "3",
    name: "Kisumu Strikers",
    badge: "KS",
    type: "Tactical Unit",
    bio: '"Lakeside speed merchants with an unmatched counter-attack."',
    stats: { ops: 6, won: 3, rtg: 7.1 },
    members: ["D", "E", "F"],
  },
  {
    id: "4",
    name: "Eldoret Elites",
    badge: "EE",
    type: "Tactical Unit",
    bio: '"High-altitude conditioned unit built for endurance dominance."',
    stats: { ops: 5, won: 2, rtg: 6.8 },
    members: ["G"],
  },
];

export default function TeamsPage() {
  const [query, setQuery] = useState("");

  const filtered = ALL_TEAMS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Registered Teams
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Analyze and challenge elite teams across the region.
        </p>

        <TeamSearchBar value={query} onChange={setQuery} />

        <div className="mt-10">
          <TeamGrid teams={filtered} />
        </div>
      </div>
    </div>
  );
}