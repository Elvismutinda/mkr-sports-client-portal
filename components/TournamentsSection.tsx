import { Tournament } from "@/types/types";
import Link from "next/link";

// Static showcase — swap for a real API fetch if you have one
const TOURNAMENTS: Tournament[] = [
  {
    id: "1",
    name: "MKR Elite Invitational",
    prizePool: 50000,
    status: "UPCOMING",
    standings: [
      { rank: 1, name: "Nairobi Ninjas", points: 0 },
      { rank: 2, name: "Mombasa Marauders", points: 0 },
    ],
  },
  {
    id: "2",
    name: "Sector 7 Championship",
    prizePool: 25000,
    status: "ONGOING",
    standings: [
      { rank: 1, name: "Nairobi Ninjas", points: 7 },
      { rank: 2, name: "Mombasa Marauders", points: 3 },
    ],
  },
];

export default function TournamentsSection() {
  return (
    <section className="pb-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
          Tournaments
        </h2>
        <div className="w-16 h-1 bg-mkr-yellow mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOURNAMENTS.map((tournament) => (
          <div
            key={tournament.id}
            className="relative bg-[#0d1117] border border-white/5 rounded-[1.75rem] p-7 hover:border-mkr-yellow/30 transition-all duration-300 overflow-hidden flex flex-col gap-5"
          >
            <div className="absolute top-0 right-0">
              <div className="bg-mkr-yellow text-mkr-navy text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl rounded-tr-[1.75rem]">
                {tournament.status}
              </div>
            </div>

            <div className="pr-24">
              <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-1.5">
                {tournament.name}
              </h3>
              <p className="text-sm text-slate-500 font-black tracking-wider">
                KSH {tournament.prizePool.toLocaleString()} Prize Pool
              </p>
            </div>

            <div className="space-y-2.5">
              {(tournament.standings ?? []).map((s) => (
                <div
                  key={s.rank}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs font-black text-slate-300 tracking-wider">
                    #{s.rank} {s.name}
                  </span>
                  <span className="text-xs font-black text-mkr-yellow uppercase tracking-wider">
                    {s.points} Pts
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <Link
                href={`/tournaments/${tournament.id}`}
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                Track Standings
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}