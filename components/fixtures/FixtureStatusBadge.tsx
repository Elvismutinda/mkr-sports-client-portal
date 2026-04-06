import { FixtureStatus } from "@/types/types";

const config: Record<
  FixtureStatus,
  { label: string; bg: string; text: string; dot?: string }
> = {
  UPCOMING: {
    label: "UPCOMING",
    bg: "bg-yellow-400/10 border border-yellow-400/25",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  LIVE: {
    label: "LIVE",
    bg: "bg-emerald-400/10 border border-emerald-400/25",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  COMPLETED: {
    label: "COMPLETED",
    bg: "bg-slate-700/40 border border-slate-600/20",
    text: "text-slate-500",
  },
  CANCELLED: {
    label: "CANCELLED",
    bg: "bg-red-400/10 border border-red-400/25",
    text: "text-red-400",
  },
  POSTPONED: {
    label: "POSTPONED",
    bg: "bg-orange-400/10 border border-orange-400/25",
    text: "text-orange-400",
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
          className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "LIVE" ? "animate-pulse" : ""}`}
        />
      )}
      {cfg.label}
    </span>
  );
}
