import { Tournament } from "@/types/types";

interface Props {
  tournament: Tournament;
}

const STATUS_STYLES = {
  UPCOMING: "bg-mkr-yellow text-mkr-navy",
  ONGOING: "bg-emerald-400 text-emerald-950",
  COMPLETED: "bg-slate-600 text-slate-200",
};

export default function TournamentHero({ tournament }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-8 relative overflow-hidden">
      <div className="absolute bottom-4 right-6 opacity-[0.04] pointer-events-none select-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLES[tournament.status]}`}
        >
          {tournament.status.charAt(0) + tournament.status.slice(1).toLowerCase()}
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
        {tournament.name}
      </h1>
      <p className="text-mkr-yellow font-black uppercase italic tracking-widest text-sm mb-4">
        KSH {tournament.prizePool.toLocaleString()} Prize Pool
      </p>

      {tournament.location && (
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs font-black uppercase italic tracking-wider">
            {tournament.location}
          </span>
        </div>
      )}

      {tournament.commencement && (
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs font-black uppercase italic tracking-wider">
            {new Date(tournament.commencement).toLocaleDateString("en-KE", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      {tournament.description && (
        <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-t border-white/5 pt-5">
          {tournament.description}
        </p>
      )}
    </div>
  );
}