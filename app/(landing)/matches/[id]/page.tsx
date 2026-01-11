import { auth } from "@/auth";
import LeaveMatchButton from "@/components/match/LeaveMatchButton";
import RegisterMatchForm from "@/components/match/RegisterMatchForm";

import RoasterPreview from "@/components/match/RoasterPreview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/types";
import Image from "next/image";
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
    (p: { id: string | undefined }) => p.id === currentUser?.id
  );

  const isFull = match.players.length >= match.maxPlayers;

  const gameDate = new Date(match.date);

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
              "mb-8 p-2 tracking-normal! opacity-60 hover:opacity-100"
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
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none text-white">
            Match Day: {match.location.split(" ")[0]}{" "}
            <span className="text-mkr-yellow">{gameDate.getFullYear()}</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed italic">
            MKR Sports&apos; premier weekly football fixture.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          <div className="flex-1 space-y-16">
            {/* <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-mkr-dark aspect-video relative group">
              <Image
                src="/images/football-field.jpeg"
                alt="Match Atmosphere"
                width={1200}
                height={675}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-mkr-navy/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="px-4 py-2 bg-mkr-yellow text-mkr-navy font-black text-xs uppercase tracking-widest rounded-xl italic shadow-xl">
                  Status: {match.completed ? "Terminated" : "Active"}
                </div>
              </div>
            </div> */}

            <section className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
                  Playground Visual
                </h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="relative aspect-4/3 w-full bg-[#1a2a1a] rounded-[2.5rem] border-4 border-white/10 overflow-hidden shadow-2xl">
                {/* Grass Pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 20%)",
                  }}
                ></div>

                {/* Field Markings */}
                <div className="absolute inset-4 border-2 border-white/20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-t-0"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-b-0"></div>

                {/* Player Rendering on Pitch */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-center">
                  {/* FWD Zone */}
                  <div className="flex justify-around items-center">
                    {playersByPosition(Position.FWD).map((p) => (
                      <div key={p.id} className="group relative">
                        <Image
                          src={p.avatarUrl}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-mkr-yellow shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded italic border border-mkr-yellow/30">
                          {p.name}
                        </div>
                      </div>
                    ))}
                    {playersByPosition(Position.FWD).length === 0 && (
                      <div className="text-[10px] text-white/20 font-black uppercase italic">
                        No FWD Units
                      </div>
                    )}
                  </div>
                  {/* MID Zone */}
                  <div className="flex justify-around items-center">
                    {playersByPosition(Position.MID).map((p) => (
                      <div key={p.id} className="group relative">
                        <Image
                          src={p.avatarUrl}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-mkr-yellow shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded italic border border-mkr-yellow/30">
                          {p.name}
                        </div>
                      </div>
                    ))}
                    {playersByPosition(Position.MID).length === 0 && (
                      <div className="text-[10px] text-white/20 font-black uppercase italic">
                        No MID Units
                      </div>
                    )}
                  </div>
                  {/* DEF Zone */}
                  <div className="flex justify-around items-center">
                    {playersByPosition(Position.DEF).map((p) => (
                      <div key={p.id} className="group relative">
                        <Image
                          src={p.avatarUrl}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-mkr-yellow shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded italic border border-mkr-yellow/30">
                          {p.name}
                        </div>
                      </div>
                    ))}
                    {playersByPosition(Position.DEF).length === 0 && (
                      <div className="text-[10px] text-white/20 font-black uppercase italic">
                        No DEF Units
                      </div>
                    )}
                  </div>
                  {/* GK Zone */}
                  <div className="flex justify-center">
                    {playersByPosition(Position.GK).map((p) => (
                      <div key={p.id} className="group relative">
                        <Image
                          src={p.avatarUrl}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-mkr-yellow shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white uppercase whitespace-nowrap bg-mkr-navy/80 px-2 py-0.5 rounded italic border border-mkr-yellow/30">
                          {p.name}
                        </div>
                      </div>
                    ))}
                    {playersByPosition(Position.GK).length === 0 && (
                      <div className="text-[10px] text-white/20 font-black uppercase italic">
                        GK Required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-6 text-white">
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
                      { hour: "2-digit", minute: "2-digit" }
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
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-6 text-white">
                Match Day Schedule
              </h2>
              <div className="space-y-4">
                {[
                  {
                    time: "15 mins prior",
                    event: "Match Briefing & Warm-up",
                  },
                  {
                    time: "T+00",
                    event: "First Half Kickoff",
                  },
                  {
                    time: "T+30",
                    event: "Half-time Hydration",
                  },
                  { time: "T+35", event: "Second Half Kickoff" },
                  { time: "T+65", event: "Match Conclusion & Debrief" },
                  {
                    time: "T+80",
                    event: "Post-match Socializing",
                  },
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
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  Register Now
                </h3>
                <span className="text-mkr-yellow font-black text-lg italic">
                  KSH. {priceKES}
                </span>
              </div>

              {!match.completed ? (
                isRegistered ? (
                  <>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-fade-in">
                      <div className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-2">
                        Registration Confirmed
                      </div>
                      <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
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
                    <p className="text-xs text-slate-400 font-bold italic">
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
                  <p className="text-xs text-slate-400 font-bold italic">
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
