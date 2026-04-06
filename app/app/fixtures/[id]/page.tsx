import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFixtureById } from "@/data/fixtures";
import { FixtureDetailHeader } from "../(components)/FixtureDetailHeader";
import { MatchInfoPanel } from "../(components)/MatchInfoPanel";
import { ScorePanel } from "../(components)/ScorePanel";
import { SquadRoster } from "../(components)/SquadRoster";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FixtureDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const data = await getFixtureById(id, session.user.id);
  if (!data) notFound();

  const { fixture, players } = data;
  const playerPosition =
    players.find((p) => p.id === session.user.id)?.position ?? null;

  return (
    <div className="px-6 py-12 md:px-16">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/app/fixtures"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Fixtures
        </Link>

        <FixtureDetailHeader match={fixture} playerPosition={playerPosition} />

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-10">
            <MatchInfoPanel fixture={fixture} />
            <ScorePanel
              score={fixture.score}
              completed={fixture.completed}
              matchReport={fixture.matchReport}
            />
          </div>
          <div className="w-full lg:w-80 space-y-6">
            <SquadRoster players={players} currentUserId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
