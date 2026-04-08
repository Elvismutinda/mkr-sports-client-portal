import { Team } from "@/types/types";
import TeamCard from "./TeamCard";

interface Props {
  teams: Team[];
  loading?: boolean;
}

function TeamCardSkeleton() {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-lg p-7 flex flex-col gap-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-2/3 rounded bg-white/5" />
          <div className="h-4 w-1/3 rounded-full bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-white/5" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-mkr-navy rounded-xl p-3 border border-white/5 h-16" />
        ))}
      </div>
      <div className="h-3 w-24 rounded bg-white/5 self-center mt-auto" />
    </div>
  );
}

export default function TeamGrid({ teams, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <TeamCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="py-32 text-center bg-[#0d1117]/60 rounded-lg border border-white/5">
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">
          No teams found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}