import { statusConfig } from "@/config/status";
import { Tournament } from "@/types/types";
import Link from "next/link";

interface Props {
  tournaments: Tournament[];
}

export default function TournamentsSection({ tournaments }: Props) {
  const getStatusStyles = (status: Tournament["status"]) => {
    const config = statusConfig[status];
    return `${config.bg} ${config.text} ${config.dot} ${config.border} ${config.glow}`;
  };

  if (tournaments.length === 0) {
    return (
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
            Live Tournaments
          </h2>
          <div className="w-16 h-1 bg-mkr-yellow mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full py-24 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
              No Active Tournaments
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
          Live Tournaments
        </h2>
        <div className="w-16 h-1 bg-mkr-yellow mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="relative bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7 hover:border-mkr-yellow/30 transition-all duration-300 overflow-hidden flex flex-col gap-5"
          >
            {/* Watermark */}
            <div className="absolute bottom-4 right-6 opacity-[0.04] pointer-events-none select-none">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>

            <div
              className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-2xl rounded-tr-[1.75rem] ${getStatusStyles(tournament.status)} text-[10px] font-black tracking-[0.18em] uppercase`}
            >
              {tournament.status.charAt(0) +
                tournament.status.slice(1).toLowerCase()}
            </div>

            <div className="pr-24">
              <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-1.5">
                {tournament.name}
              </h3>
              <p className="text-sm text-slate-500 font-black tracking-wider">
                KSH {tournament.prizePool.toLocaleString()} Prize Pool
              </p>
              {tournament.commencement && (
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-1">
                  {new Date(tournament.commencement).toLocaleDateString(
                    "en-KE",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </p>
              )}
            </div>

            {/* Standings preview */}
            {tournament.standings && tournament.standings.length > 0 ? (
              <div className="space-y-2.5">
                {tournament.standings.slice(0, 3).map((s) => (
                  <div
                    key={s.rank}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs font-black text-slate-300 tracking-wider">
                      #{s.rank} {s.name}
                    </span>
                    <span className="text-xs font-black text-mkr-yellow uppercase tracking-wider">
                      {s.points} Pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 py-3 border border-white/5 rounded-xl px-4">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-600 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Standings not yet available
                </span>
              </div>
            )}

            {/* Participant avatars */}
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
                  {tournament.participants.length} enlisted
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
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/tournaments"
          className="inline-block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-mkr-yellow transition-colors border border-white/10 hover:border-mkr-yellow/30 rounded-full px-6 py-2.5"
        >
          View All Tournaments
        </Link>
      </div>
    </section>
  );
}
