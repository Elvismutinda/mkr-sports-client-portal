import { db } from "@/lib/db/db";
import { match, matchPlayers, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Fixture, FixtureDetail } from "@/types/types";

export async function getMyFixtures(userId: string): Promise<Fixture[]> {
  const rows = await db
    .select({
      id: match.id,
      date: match.date,
      location: match.location,
      mode: match.mode,
      price: match.price,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      maxPlayers: match.maxPlayers,
      completed: match.completed,
      score: match.score,
      matchReport: match.matchReport,
      isPublic: match.isPublic,
      playerPosition: matchPlayers.position,
    })
    .from(matchPlayers)
    .innerJoin(match, eq(matchPlayers.matchId, match.id))
    .where(eq(matchPlayers.playerId, userId))
    .orderBy(match.date);

  return rows.map((r) => ({
    ...r,
    date: r.date.toISOString(),
    price: String(r.price),
  })) as Fixture[];
}

export async function getFixtureById(
  matchId: string,
  userId: string
): Promise<FixtureDetail | null> {
  // Verify the user is a participant
  const participation = await db
    .select({ matchId: matchPlayers.matchId })
    .from(matchPlayers)
    .where(
      and(eq(matchPlayers.matchId, matchId), eq(matchPlayers.playerId, userId))
    )
    .limit(1);
 
  if (participation.length === 0) return null;
 
  const [matchData] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId))
    .limit(1);
 
  if (!matchData) return null;
 
  const players = await db
    .select({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      position: matchPlayers.position,
    })
    .from(matchPlayers)
    .innerJoin(user, eq(matchPlayers.playerId, user.id))
    .where(eq(matchPlayers.matchId, matchId));
 
  const fixture: Fixture = {
    ...matchData,
    date: matchData.date.toISOString(),
    price: String(matchData.price),
    playerPosition: players.find((p) => p.id === userId)?.position as Fixture["playerPosition"],
  };
 
  return { fixture, players };
}