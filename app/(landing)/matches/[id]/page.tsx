import { auth } from "@/auth";
import LeaveMatchButton from "@/components/match/LeaveMatchButton";
import RegisterMatchForm from "@/components/match/RegisterMatchForm";
import RoasterPreview from "@/components/match/RoasterPreview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface MatchPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  position: Position;
  team: "home" | "away" | "unassigned";
}

export default async function MatchDetailsPage({ params }: PageProps) {
  const session = await auth();
  const currentUser = session?.user || null;

  const { id } = await params;

  const res = await fetch(`${BASE_URL}/api/matches/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const match = await res.json();

  const isRegistered = match.players.some(
    (p: { id: string | undefined }) => p.id === currentUser?.id,
  );

  const isFull = match.players.length >= match.maxPlayers;

  const gameDate = new Date(match.date);

  const playersByPositionAndTeam = (
    pos: Position,
    team: "home" | "away" | "unassigned",
  ) =>
    (match.players as MatchPlayer[]).filter(
      (p) => p.position === pos && p.team === team,
    );

  // Fallback: if no teams are assigned yet, render all players as a single squad
  const hasTeams =
    (match.players as MatchPlayer[]).some((p) => p.team === "home") ||
    (match.players as MatchPlayer[]).some((p) => p.team === "away");

  const playersByPosition = (pos: Position) =>
    (match.players as MatchPlayer[]).filter((p) => p.position === pos);

  const priceKES = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(match.price);

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pb-20 selection:bg-mkr-yellow selection:text-mkr-navy">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex justify-between items-start">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
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
              className="mr-2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to list
          </Link>
        </div>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none text-white">
            Match Day: {match.location.split(" ")[0]}{" "}
            <span className="text-mkr-yellow">{gameDate.getFullYear()}</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            MKR Sports&apos; premier weekly football fixture.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          <div className="flex-1 space-y-16">
            <section className="animate-fade-in">
              {/* Section header with legend */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    Tactical Deployment
                  </h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                {hasTeams && (
                  <div className="flex gap-4 ml-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        Away
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-mkr-yellow" />
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        Home
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative w-full bg-[#1a2a1a] rounded-[2rem] border-2 border-white/10 overflow-hidden shadow-2xl"
                style={{ aspectRatio: "4/3" }}
              >
                {/* Grass stripes */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(255,255,255,0.03) 10%, rgba(255,255,255,0.03) 20%)",
                  }}
                />

                <div
                  className="absolute border border-white/20 pointer-events-none"
                  style={{ inset: "4%" }}
                />
                <div
                  className="absolute left-[4%] right-[4%] border-t border-dashed border-white/20 pointer-events-none"
                  style={{ top: "50%" }}
                />
                <div
                  className="absolute border border-white/20 rounded-full pointer-events-none"
                  style={{
                    width: "18%",
                    aspectRatio: "1",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <div
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <div
                  className="absolute border border-white/20 border-t-0 pointer-events-none"
                  style={{
                    top: "4%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: "18%",
                  }}
                />
                {/* Top 6-yard box */}
                <div
                  className="absolute border border-white/15 border-t-0 pointer-events-none"
                  style={{
                    top: "4%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "20%",
                    height: "8%",
                  }}
                />
                <div
                  className="absolute border border-white/20 border-b-0 pointer-events-none"
                  style={{
                    bottom: "4%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: "18%",
                  }}
                />
                <div
                  className="absolute border border-white/15 border-b-0 pointer-events-none"
                  style={{
                    bottom: "4%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "20%",
                    height: "8%",
                  }}
                />

                <div className="absolute inset-0">
                  {hasTeams ? (
                    <>
                      {(
                        [
                          "Goalkeeper",
                          "Defender",
                          "Midfielder",
                          "Forward",
                        ] as Position[]
                      ).map((pos, rowIdx) => {
                        const players = playersByPositionAndTeam(pos, "away");
                        // Rows distributed in top 46% of pitch (leaving gap before halfway line)
                        const rowTops = ["7%", "18%", "29%", "40%"];
                        if (players.length === 0) return null;
                        return players.map((p, colIdx) => {
                          const total = players.length;
                          const leftPct =
                            total === 1 ? 50 : 20 + (colIdx / (total - 1)) * 60;
                          return (
                            <div
                              key={p.id}
                              className="absolute group"
                              style={{
                                top: rowTops[rowIdx],
                                left: `${leftPct}%`,
                                transform: "translate(-50%, 0)",
                              }}
                            >
                              <div className="relative w-11 h-11">
                                <div className="w-11 h-11 rounded-full border-2 border-red-500 bg-[#2d1e1e] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <span className="text-xs font-black text-red-400 uppercase">
                                    {p.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                  <span className="text-[7px] font-black text-white uppercase">
                                    {pos[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-1 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded border border-red-500/30 text-center">
                                {p.name}
                              </div>
                            </div>
                          );
                        });
                      })}

                      {(
                        [
                          "Goalkeeper",
                          "Defender",
                          "Midfielder",
                          "Forward",
                        ] as Position[]
                      ).map((pos, rowIdx) => {
                        const players = playersByPositionAndTeam(pos, "home");
                        // Rows distributed in bottom 46% of pitch
                        const rowBottoms = ["7%", "18%", "29%", "40%"];
                        if (players.length === 0) return null;
                        return players.map((p, colIdx) => {
                          const total = players.length;
                          const leftPct =
                            total === 1 ? 50 : 20 + (colIdx / (total - 1)) * 60;
                          return (
                            <div
                              key={p.id}
                              className="absolute group"
                              style={{
                                bottom: rowBottoms[rowIdx],
                                left: `${leftPct}%`,
                                transform: "translate(-50%, 0)",
                              }}
                            >
                              <div className="relative w-11 h-11">
                                <div className="w-11 h-11 rounded-full border-2 border-mkr-yellow bg-[#1e1e0d] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <span className="text-xs font-black text-mkr-yellow uppercase">
                                    {p.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mkr-yellow flex items-center justify-center">
                                  <span className="text-[7px] font-black text-mkr-navy uppercase">
                                    {pos[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-1 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded border border-mkr-yellow/30 text-center">
                                {p.name}
                              </div>
                            </div>
                          );
                        });
                      })}
                    </>
                  ) : (
                    /* Single-squad fallback */
                    (
                      [
                        "Forward",
                        "Midfielder",
                        "Defender",
                        "Goalkeeper",
                      ] as Position[]
                    ).map((pos, rowIdx) => {
                      const players = playersByPosition(pos);
                      const rowTops = ["10%", "30%", "55%", "75%"];
                      if (players.length === 0) return null;
                      return players.map((p, colIdx) => {
                        const total = players.length;
                        const leftPct =
                          total === 1 ? 50 : 20 + (colIdx / (total - 1)) * 60;
                        return (
                          <div
                            key={p.id}
                            className="absolute group"
                            style={{
                              top: rowTops[rowIdx],
                              left: `${leftPct}%`,
                              transform: "translate(-50%, 0)",
                            }}
                          >
                            <div className="relative w-11 h-11">
                              <div className="w-11 h-11 rounded-full border-2 border-mkr-yellow bg-[#1e1e0d] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-xs font-black text-mkr-yellow uppercase">
                                  {p.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mkr-yellow flex items-center justify-center">
                                <span className="text-[7px] font-black text-mkr-navy uppercase">
                                  {pos[0]}
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded border border-mkr-yellow/30 text-center">
                              {p.name}
                            </div>
                          </div>
                        );
                      });
                    })
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">
                Match Details
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-slate-300 font-bold">
                  <div className="w-5 flex justify-center text-mkr-yellow">
                    📅
                  </div>
                  <span>
                    Date:{" "}
                    {gameDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-bold">
                  <div className="w-5 flex justify-center text-mkr-yellow">
                    ⏰
                  </div>
                  <span>
                    Time:{" "}
                    {gameDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    —{" "}
                    {new Date(gameDate.getTime() + 3600000).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-bold">
                  <div className="w-5 flex justify-center text-mkr-yellow">
                    📍
                  </div>
                  <span>Location: {match.location}</span>
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-bold">
                  <div className="w-5 flex justify-center text-mkr-yellow">
                    ⚽
                  </div>
                  <span>Mode: {match.mode}</span>
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-bold">
                  <div className="w-5 flex justify-center text-mkr-yellow">
                    💰
                  </div>
                  <span>Registration Fee: KSH. {priceKES} per player</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">
                Match Day Schedule
              </h2>
              <div className="space-y-4">
                {[
                  { time: "15 mins prior", event: "Match Briefing & Warm-up" },
                  { time: "T+00", event: "First Half Kickoff" },
                  { time: "T+30", event: "Half-time Hydration" },
                  { time: "T+35", event: "Second Half Kickoff" },
                  { time: "T+65", event: "Match Conclusion & Debrief" },
                  { time: "T+80", event: "Post-match Socializing" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <span className="text-mkr-yellow font-black text-sm uppercase tracking-widest whitespace-nowrap pt-1">
                      • {item.time}
                    </span>
                    <span className="text-slate-300 font-bold">
                      {item.event}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="w-full lg:w-95">
            <div className="sticky top-28 bg-mkr-dark border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
              {isRegistered ? (
                <div className="flex border-b border-white/5 pb-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    You&apos;re In!
                  </h3>
                </div>
              ) : (
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    Register Now
                  </h3>
                  <span className="text-mkr-yellow font-black text-lg">
                    KSH. {priceKES}
                  </span>
                </div>
              )}

              {!match.completed ? (
                isRegistered ? (
                  <>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-fade-in">
                      <div className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-2">
                        Registration Confirmed
                      </div>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">
                        You are already registered for this match.
                      </p>
                    </div>
                    <LeaveMatchButton matchId={match.id} />
                  </>
                ) : isFull ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <div className="text-red-400 font-black uppercase text-[10px]">
                      Match Full
                    </div>
                    <p className="text-xs text-slate-400 font-bold">
                      No more slots available.
                    </p>
                  </div>
                ) : (
                  <RegisterMatchForm match={match} />
                )
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center opacity-50">
                  <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">
                    Status: Closed
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    Match played.
                  </p>
                </div>
              )}

              <RoasterPreview
                players={match.players}
                maxPlayers={match.maxPlayers}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
