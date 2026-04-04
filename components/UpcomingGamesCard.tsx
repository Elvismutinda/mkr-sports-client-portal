import { Match } from "@/types/types";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  matches: Match[];
}

const UpcomingGamesCard = ({ matches }: Props) => {
  return (
    <section id="matches" className="py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-4 uppercase">
          Live Fixtures
        </h2>
        <div className="w-20 h-1 bg-mkr-yellow mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {matches?.length > 0 ? (
          matches.map((match) => (
            <div
              key={match.id}
              className="bg-mkr-slate/50 border border-white/10 rounded-3xl p-8 hover:border-mkr-yellow transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-mkr-yellow font-black uppercase text-sm mb-2 tracking-widest">
                    {new Date(match.date).toLocaleDateString("en-KE", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-4xl font-black text-white">
                    {new Date(match.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="bg-mkr-navy/80 px-4 py-2 rounded-xl border border-white/10 text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Confirmed Players
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-mkr-yellow">
                      {match.registeredPlayerIds.length}/{match.maxPlayers}
                    </span>
                    {/* <span className="text-xs font-bold text-slate-400">
                    PLAYERS
                  </span> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300 mb-10 font-bold">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                {match.location}
              </div>

              <Link
                href={`/matches/${match.id}`}
                className={cn(buttonVariants({ variant: "primary" }), "h-10")}
              >
                View Game Details
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">
              No Active Fixtures Found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingGamesCard;
