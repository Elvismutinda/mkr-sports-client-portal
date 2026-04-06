interface Standing {
  rank: number;
  name: string;
  points: number;
}

interface Props {
  standings: Standing[];
}

export default function StandingsTable({ standings }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7">
      <h2 className="text-lg font-black text-white uppercase italic tracking-tight mb-6">
        Current Standings
      </h2>
      <div className="space-y-2">
        <div className="grid grid-cols-12 px-3 pb-2 border-b border-white/5">
          <span className="col-span-1 text-[9px] font-black uppercase tracking-widest text-slate-600">#</span>
          <span className="col-span-9 text-[9px] font-black uppercase tracking-widest text-slate-600">Team</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-widest text-slate-600 text-right">Pts</span>
        </div>
        {standings.map((s, idx) => (
          <div
            key={s.rank}
            className={`grid grid-cols-12 items-center px-3 py-3 rounded-xl transition-colors ${
              idx === 0
                ? "bg-mkr-yellow/5 border border-mkr-yellow/10"
                : "hover:bg-white/5"
            }`}
          >
            <span
              className={`col-span-1 text-sm font-black italic ${
                idx === 0 ? "text-mkr-yellow" : "text-slate-500"
              }`}
            >
              {s.rank}
            </span>
            <span className="col-span-9 text-sm font-black text-white uppercase italic tracking-wide">
              {s.name}
            </span>
            <span
              className={`col-span-2 text-sm font-black italic text-right ${
                idx === 0 ? "text-mkr-yellow" : "text-slate-300"
              }`}
            >
              {s.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}