type Props = {
  score: { home: number; away: number } | null;
  completed: boolean;
};

export function ScoreDisplay({ score, completed }: Props) {
  if (!completed || !score) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-slate-700 font-black text-3xl">vs</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="font-black text-3xl text-white leading-none"
      >
        {score.home}
      </span>
      <span className="text-slate-600 font-black text-xl">–</span>
      <span
        className="font-black text-3xl text-white leading-none"
      >
        {score.away}
      </span>
    </div>
  );
}
