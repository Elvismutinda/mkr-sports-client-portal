import { Team } from "@/types/types";
import Link from "next/link";

interface Props {
  team: Team;
}

export default function TeamCard({ team }: Props) {
  return (
    <div className="relative bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7 hover:border-mkr-yellow/30 transition-all duration-300 flex flex-col gap-5 overflow-hidden">
      <div className="absolute top-4 right-5 opacity-[0.06] pointer-events-none select-none">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-mkr-navy border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-xl font-black text-slate-300">
            {team.badge}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-1.5">
            {team.name}
          </h3>
          <span className="inline-block bg-mkr-yellow/10 border border-mkr-yellow/20 text-mkr-yellow text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {team.type}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-400 font-medium leading-relaxed">
        {team.bio}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5">
          <div className="text-xl font-black text-white leading-none mb-1">
            {team.stats.ops}
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Ops
          </div>
        </div>
        <div className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5">
          <div className="text-xl font-black text-mkr-yellow leading-none mb-1">
            {team.stats.won}
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Won
          </div>
        </div>
        <div className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5">
          <div className="text-xl font-black text-mkr-yellow leading-none mb-1">
            {team.stats.rtg}
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            RTG
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-3 border-t border-white/5">
        <Link
          href={`/teams/${team.id}/challenge`}
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          Challenge Team
        </Link>
      </div>
    </div>
  );
}