type Props = {
  score: { home: number; away: number } | null;
  completed: boolean;
  matchReport: string | null;
};

export function ScorePanel({ score, completed, matchReport }: Props) {
  return (
    <section>
      <h2
        className="text-lg font-black uppercase tracking-tight text-white mb-5"
      >
        {completed ? "Final Score" : "Score"}
      </h2>

      <div className="rounded-2xl border border-white/8 bg-black/30 p-6 flex flex-col items-center gap-4">
        {completed && score ? (
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
                Home
              </p>
              <span
                className="font-black text-5xl text-white leading-none"
              >
                {score.home}
              </span>
            </div>
            <span className="text-slate-600 font-black text-3xl mt-4">–</span>
            <div className="text-center">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
                Away
              </p>
              <span
                className="font-black text-5xl text-white leading-none"
              >
                {score.away}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-slate-600 font-black uppercase tracking-widest text-sm">
            {completed ? "Score not recorded" : "Match not yet played"}
          </div>
        )}

        {matchReport && (
          <div className="w-full border-t border-white/5 pt-4 mt-1">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
              Match Report
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {matchReport}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
