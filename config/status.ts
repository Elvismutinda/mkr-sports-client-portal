import { TournamentStatus } from "@/types/types";

export const statusConfig: Record<
  TournamentStatus,
  {
    bg: string;
    text: string;
    dot: string;
    border: string;
    glow: string;
  }
> = {
  "UPCOMING OPERATION": {
    bg: "bg-yellow-400",
    text: "text-black",
    dot: "bg-yellow-400",
    border: "border-yellow-400/20",
    glow: "shadow-yellow-400/10",
  },
  "ONGOING OPERATION": {
    bg: "bg-emerald-400",
    text: "text-black",
    dot: "bg-emerald-400",
    border: "border-emerald-400/20",
    glow: "shadow-emerald-400/10",
  },
  COMPLETED: {
    bg: "bg-slate-500",
    text: "text-white",
    dot: "bg-slate-400",
    border: "border-slate-500/20",
    glow: "shadow-slate-400/5",
  },
};
