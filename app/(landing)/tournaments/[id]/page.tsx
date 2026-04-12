import { notFound } from "next/navigation";
import { auth } from "@/auth";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TournamentHero from "../(components)/TournamentHero";
import StandingsTable from "../(components)/StandingsTable";
import TeamsList from "../(components)/TeamsList";
import RegisterForTournament from "../(components)/RegisterForTournament";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const currentUser = session?.user ?? null;

  const res = await fetch(`${BASE_URL}/api/tournaments/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const tournament = await res.json();

  const isTeamRegistered: boolean =
    currentUser?.id != null &&
    Array.isArray(tournament.registeredUserIds) &&
    tournament.registeredUserIds.includes(currentUser.id);

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          <Link
            href="/tournaments"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 p-2 tracking-normal! opacity-60 hover:opacity-100",
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Tournaments
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-10">
            <TournamentHero tournament={tournament} />

            {tournament.standings && tournament.standings.length > 0 && (
              <StandingsTable standings={tournament.standings} />
            )}

            {tournament.teams && tournament.teams.length > 0 && (
              <TeamsList teams={tournament.teams} />
            )}
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 bg-[#0d1117] border border-white/10 rounded-[2rem] p-7 space-y-6">
              <div className="border-b border-white/5 pb-5">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-1">
                  {isTeamRegistered ? "Team Registered" : "Register Your Team"}
                </h3>
                <p className="text-xs font-black uppercase tracking-widest text-mkr-yellow">
                  KSH {tournament.prizePool?.toLocaleString()} Prize Pool
                </p>
              </div>

              {tournament.status === "COMPLETED" ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center opacity-50">
                  <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">
                    Status: Concluded
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    Campaign has ended.
                  </p>
                </div>
              ) : isTeamRegistered ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                  <div className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-2">
                    Team Registered
                  </div>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    Your team is registered for this tournament.
                  </p>
                </div>
              ) : !currentUser ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-bold text-center">
                    Login to register your team.
                  </p>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "primary" }),
                      "w-full h-11 text-xs tracking-widest uppercase font-black"
                    )}
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <RegisterForTournament
                  tournamentId={tournament.id}
                  entryFee={tournament.entryFee ?? 0}
                />
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5">
                  <div className="text-lg font-black text-white leading-none mb-1">
                    {tournament.teams?.length ?? 0}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Teams
                  </div>
                </div>
                <div className="bg-mkr-navy rounded-xl p-3 text-center border border-white/5">
                  <div className="text-lg font-black text-mkr-yellow leading-none mb-1">
                    {tournament.maxTeams ?? "∞"}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Max Teams
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}