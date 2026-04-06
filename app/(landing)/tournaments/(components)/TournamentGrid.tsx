import { Tournament } from "@/types/types";
import TournamentCard from "./TournamentCard";

interface Props {
  tournaments: Tournament[];
}

export default function TournamentGrid({ tournaments }: Props) {
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#0d1117]/60 rounded-lg border border-white/5">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-700 mb-5"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
        <p className="text-sm font-black uppercase italic tracking-widest text-slate-600">
          No active tournaments
        </p>
        <p className="text-xs font-black uppercase italic tracking-widest text-slate-700 mt-1">
          Check back soon for upcoming tournaments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tournaments.map((t) => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </div>
  );
}