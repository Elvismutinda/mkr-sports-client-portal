type SkillIndexBarProps = {
  rating: number; // 0–10
};

export function SkillIndexBar({ rating }: SkillIndexBarProps) {
  const pct = Math.min(Math.max((rating / 10) * 100, 0), 100);

  return (
    <div className="space-y-1.5 pt-2 border-t border-white/5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">
          Skill Index
        </span>
        <span className="text-yellow-400 font-black text-sm">{rating}/10</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
