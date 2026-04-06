import { Participant, Position } from "@/types/types";
import Image from "next/image";

interface Props {
  participants: Participant[];
}

const POSITION_SHORT: Record<Position, string> = {
  Goalkeeper: "GK",
  Defender: "DEF",
  Midfielder: "MID",
  Forward: "FWD",
};

const POSITION_COLOR: Record<Position, string> = {
  Goalkeeper: "text-amber-400 border-amber-400/20 bg-amber-400/5",
  Defender: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  Midfielder: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  Forward: "text-red-400 border-red-400/20 bg-red-400/5",
};

export default function ParticipantsList({ participants }: Props) {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-white uppercase italic tracking-tight">
          Enlisted Players
        </h2>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
          {participants.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 bg-mkr-navy/50 border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0">
              {p.avatarUrl ? (
                <Image src={p.avatarUrl} alt={p.name} className="w-full h-full rounded-full object-cover" width={36} height={36} />
              ) : (
                <span className="text-xs font-black text-slate-300 uppercase">
                  {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white uppercase italic tracking-wide truncate">
                {p.name}
              </p>
              {p.position ? (
                <span
                  className={`inline-block text-[8px] font-black uppercase tracking-widest border rounded px-1.5 py-0.5 mt-0.5 ${POSITION_COLOR[p.position]}`}
                >
                  {POSITION_SHORT[p.position]}
                </span>
              ) : (
                <span className="inline-block text-[8px] font-black uppercase tracking-widest border rounded px-1.5 py-0.5 mt-0.5 text-slate-500 border-slate-500/20 bg-slate-500/5">
                  N/A
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}