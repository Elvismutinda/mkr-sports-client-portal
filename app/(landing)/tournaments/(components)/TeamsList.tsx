import { TournamentTeamEntry } from "@/types/types";
import Image from "next/image";

interface Props {
  teams: TournamentTeamEntry[];
}

const PAYMENT_STYLES = {
  success: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  pending: "text-amber-400 border-amber-400/20 bg-amber-400/5",
  failed: "text-red-400 border-red-400/20 bg-red-400/5",
};

const PAYMENT_LABEL = {
  success: "Paid",
  pending: "Pending",
  failed: "Failed",
};

export default function TeamsList({ teams }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-white uppercase tracking-tight">
          Registered Teams
        </h2>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
          {teams.length} team{teams.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teams.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 bg-mkr-navy/50 border rounded-xl px-4 py-3 transition-colors ${
              t.isEliminated
                ? "border-white/5 opacity-50"
                : "border-white/5 hover:border-white/10"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {t.badgeUrl ? (
                <Image
                  src={t.badgeUrl}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-black text-mkr-yellow uppercase">
                  {t.badgeFallback ??
                    t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white uppercase tracking-wide truncate">
                {t.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-block text-[8px] font-black uppercase tracking-widest border rounded px-1.5 py-0.5 ${
                    PAYMENT_STYLES[t.paymentStatus]
                  }`}
                >
                  {PAYMENT_LABEL[t.paymentStatus]}
                </span>
                {t.groupName && (
                  <span className="inline-block text-[8px] font-black uppercase tracking-widest border rounded px-1.5 py-0.5 text-slate-400 border-slate-400/20 bg-slate-400/5">
                    Group {t.groupName}
                  </span>
                )}
                {t.isEliminated && (
                  <span className="inline-block text-[8px] font-black uppercase tracking-widest border rounded px-1.5 py-0.5 text-slate-600 border-slate-600/20">
                    Eliminated
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
