import { Match } from "@/types/types";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  matches: Match[];
}

const UpcomingGamesCard = ({ matches }: Props) => {
  return (
    <section id="matches" className="pb-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
          Live Fixtures
        </h2>
        <div className="w-16 h-1 bg-mkr-yellow mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches?.length > 0 ? (
          matches.map((match) => {
            const matchDate = new Date(match.date);
            return (
              <div
                key={match.id}
                className="relative bg-[#0d1117] border border-white/5 rounded-[1.5rem] p-5 hover:border-mkr-yellow/30 transition-all duration-300 flex flex-col gap-4 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-[0.04] pointer-events-none select-none">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-mkr-yellow font-black uppercase text-[10px] tracking-widest mb-1">
                      {matchDate.toLocaleDateString("en-KE", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-2xl font-black text-white leading-none">
                      {matchDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="bg-mkr-navy/80 px-3 py-1.5 rounded-lg border border-white/10 text-right">
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Confirmed
                    </div>
                    <div className="text-sm font-black text-mkr-yellow">
                      {match.registeredPlayerIds?.length ?? 0}
                      <span className="text-slate-500 font-black text-xs">
                        /{match.maxPlayers}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="shrink-0 text-slate-500"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-xs font-black tracking-wider truncate">
                    {match.location}
                  </span>
                </div>

                <Link
                  href={`/matches/${match.id}`}
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    "w-full h-9 text-[10px] tracking-widest uppercase font-black mt-auto"
                  )}
                >
                  View Match Details
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
              No Active Fixtures Found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingGamesCard;