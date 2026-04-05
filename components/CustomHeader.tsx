type Props = {
  title: string;
  subtitle: string;
  activeCount?: number;
};

export function CustomHeader({ title, subtitle, activeCount }: Props) {
  return (
    <header className="mb-10 relative">
      <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-none tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
        {subtitle}
      </p>

      {activeCount !== undefined && (
        <div className="mt-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-yellow-400/40 text-yellow-400 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-lg bg-yellow-400/5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            {activeCount} Player{activeCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="mt-4 h-px w-full bg-linear-to-r from-yellow-400/40 via-white/5 to-transparent" />
    </header>
  );
}