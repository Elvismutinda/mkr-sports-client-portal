import { Tournament } from "@/types/types";
import TournamentCard from "./TournamentCard";

interface Props {
  tournaments: Tournament[];
  loading?: boolean;
}

function TournamentCardSkeleton() {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-7 flex flex-col gap-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-4 w-16 rounded-full bg-white/5" />
        <div className="h-4 w-20 rounded bg-white/5" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-6 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
      <div className="h-3 w-full rounded bg-white/5" />
      <div className="h-3 w-4/5 rounded bg-white/5" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-14 rounded-xl bg-white/5" />
        <div className="h-14 rounded-xl bg-white/5" />
      </div>
      <div className="h-9 rounded-lg bg-white/5 mt-auto" />
    </div>
  );
}

export default function TournamentGrid({ tournaments, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <TournamentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="py-32 text-center bg-[#0d1117]/60 rounded-lg border border-white/5">
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">
          No tournaments found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
      {tournaments.map((t) => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </div>
  );
}