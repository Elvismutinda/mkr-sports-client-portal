import { Standing } from "@/types/types";

interface Props {
  standings: Standing[];
}

export default function StandingsTable({ standings }: Props) {
  const hasFullStats = standings.some((s) => s.matchesPlayed !== undefined);

  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7">
      <h2 className="text-lg font-black text-white uppercase italic tracking-tight mb-6">
        Current Standings
      </h2>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-120 text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 w-8">#</th>
              <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600">Team</th>
              {hasFullStats && (
                <>
                  <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">MP</th>
                  <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">W</th>
                  <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">D</th>
                  <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">L</th>
                  <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">GD</th>
                </>
              )}
              <th className="px-3 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-600 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, idx) => (
              <tr
                key={s.rank}
                className={`transition-colors ${
                  idx === 0
                    ? "bg-mkr-yellow/5"
                    : idx % 2 === 0
                    ? "bg-white/1.5"
                    : ""
                } hover:bg-white/5`}
              >
                <td className="px-3 py-3 rounded-l-xl">
                  <span
                    className={`text-sm font-black italic ${
                      idx === 0 ? "text-mkr-yellow" : "text-slate-500"
                    }`}
                  >
                    {s.rank}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-black text-white uppercase italic tracking-wide whitespace-nowrap">
                    {s.name}
                  </span>
                </td>
                {hasFullStats && (
                  <>
                    <td className="px-3 py-3 text-center text-xs font-black text-slate-500">{s.matchesPlayed ?? 0}</td>
                    <td className="px-3 py-3 text-center text-xs font-black text-slate-400">{s.wins ?? 0}</td>
                    <td className="px-3 py-3 text-center text-xs font-black text-slate-400">{s.draws ?? 0}</td>
                    <td className="px-3 py-3 text-center text-xs font-black text-slate-400">{s.losses ?? 0}</td>
                    <td className={`px-3 py-3 text-center text-xs font-black ${
                      (s.goalDifference ?? 0) > 0
                        ? "text-emerald-400"
                        : (s.goalDifference ?? 0) < 0
                        ? "text-red-400"
                        : "text-slate-500"
                    }`}>
                      {(s.goalDifference ?? 0) > 0 ? "+" : ""}{s.goalDifference ?? 0}
                    </td>
                  </>
                )}
                <td className="px-3 py-3 text-right rounded-r-xl">
                  <span
                    className={`text-sm font-black italic ${
                      idx === 0 ? "text-mkr-yellow" : "text-slate-300"
                    }`}
                  >
                    {s.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}