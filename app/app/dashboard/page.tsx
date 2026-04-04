import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/db";
import { match, matchPlayers } from "@/lib/db/schema";
import { eq, gte, desc, and } from "drizzle-orm";
import { getPlayerStats } from "@/data/stats";
import { Position } from "@/types/types";
import { User } from "next-auth";
import Dashboard from "@/components/Dasboard";

export default async function DashboardPage() {
  const session = await auth();
  const sessionUser = session?.user as
    | (User & {
        role: "player" | "agent";
        phone: string;
        position: Position;
        avatarUrl?: string;
      })
    | undefined;

  if (!sessionUser) return redirect("/login");

  const userId = sessionUser.id!;
  const now = new Date();

  // Upcoming matches the player is registered for
  const upcomingMatches = await db
    .select({
      id: match.id,
      date: match.date,
      location: match.location,
      mode: match.mode,
      price: match.price,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      maxPlayers: match.maxPlayers,
      registeredPlayerIds: match.registeredPlayerIds,
      isPublic: match.isPublic,
    })
    .from(match)
    .innerJoin(matchPlayers, eq(matchPlayers.matchId, match.id))
    .where(
      and(
        eq(matchPlayers.playerId, userId),
        gte(match.date, now),
        eq(match.completed, false)
      )
    )
    .orderBy(match.date)
    .limit(3);

  // Recent completed matches the player participated in
  const recentMatches = await db
    .select({
      id: match.id,
      date: match.date,
      location: match.location,
      mode: match.mode,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      score: match.score,
      completed: match.completed,
      matchReport: match.matchReport,
    })
    .from(match)
    .innerJoin(matchPlayers, eq(matchPlayers.matchId, match.id))
    .where(
      and(
        eq(matchPlayers.playerId, userId),
        eq(match.completed, true)
      )
    )
    .orderBy(desc(match.date))
    .limit(5);

  const stats = await getPlayerStats(userId);

  return (
    <Dashboard
      user={sessionUser}
      stats={stats}
      upcomingMatches={upcomingMatches}
      recentMatches={recentMatches}
    />
  );
}