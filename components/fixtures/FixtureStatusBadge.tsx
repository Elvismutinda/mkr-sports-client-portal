import { FixtureStatus } from "@/types/types";

const config: Record<
  FixtureStatus,
  { label: string; bg: string; text: string; dot?: string }
> = {
  upcoming: {
    label: "UPCOMING",
    bg: "bg-yellow-400/10 border border-yellow-400/25",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  live: {
    label: "LIVE",
    bg: "bg-emerald-400/10 border border-emerald-400/25",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  completed: {
    label: "COMPLETED",
    bg: "bg-slate-700/40 border border-slate-600/20",
    text: "text-slate-500",
  },
};

export function FixtureStatusBadge({ status }: { status: FixtureStatus }) {
  const cfg = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black tracking-[0.18em] uppercase ${cfg.bg} ${cfg.text}`}
    >
      {cfg.dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "live" ? "animate-pulse" : ""}`}
        />
      )}
      {cfg.label}
    </span>
  );
}
