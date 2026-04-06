import { Tournament } from "@/types/types";
import Link from "next/link";

interface Props {
  tournament: Tournament;
}

const STATUS_STYLES = {
  UPCOMING: "bg-mkr-yellow text-mkr-navy",
  ONGOING: "bg-emerald-400 text-emerald-950",
  COMPLETED: "bg-slate-600 text-slate-200",
};

export default function TournamentCard({ tournament }: Props) {
  return (
    <div className="relative bg-[#0d1117] border border-white/5 rounded-lg p-7 hover:border-mkr-yellow/30 transition-all duration-300 overflow-hidden flex flex-col gap-5">
      <div className="absolute top-4 right-5 opacity-[0.04] pointer-events-none select-none">
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <div className="absolute top-0 right-0">
        <div
          className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl rounded-tr-[1.75rem] ${STATUS_STYLES[tournament.status]}`}
        >
          {tournament.status.charAt(0) + tournament.status.slice(1).toLowerCase()}
        </div>
      </div>

      <div className="pr-24">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight mb-1.5">
          {tournament.name}
        </h3>
        <p className="text-sm text-slate-500 font-black uppercase italic tracking-wider">
          KSH {tournament.prizePool.toLocaleString()} Prize Pool
        </p>
        {tournament.commencement && (
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-1">
            {new Date(tournament.commencement).toLocaleDateString("en-KE", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {tournament.description && (
        <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-t border-white/5 pt-4">
          {tournament.description}
        </p>
      )}

      {tournament.standings && tournament.standings.length > 0 && (
        <div className="space-y-2 border-t border-white/5 pt-4">
          {tournament.standings.slice(0, 3).map((s) => (
            <div key={s.rank} className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 uppercase italic tracking-wider">
                #{s.rank} {s.name}
              </span>
              <span className="text-xs font-black text-mkr-yellow uppercase italic tracking-wider">
                {s.points} Pts
              </span>
            </div>
          ))}
        </div>
      )}

      {tournament.participants && tournament.participants.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {tournament.participants.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="w-6 h-6 rounded-full bg-mkr-navy border-2 border-[#0d1117] flex items-center justify-center"
              >
                <span className="text-[8px] font-black text-slate-400 uppercase">
                  {p.name[0]}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {tournament.participants.length} registered
          </span>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-white/5">
        <Link
          href={`/tournaments/${tournament.id}`}
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          Track Standings →
        </Link>
      </div>
    </div>
  );
}