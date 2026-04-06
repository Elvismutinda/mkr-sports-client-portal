import { db } from "@/lib/db/db";
import { match, matchPlayer, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Match, FixtureDetail, FixturePlayer, Position } from "@/types/types";

export type MatchWithPosition = {
  match: Match;
  playerPosition: Position | null;
};

export async function getMyFixtures(
  userId: string,
): Promise<MatchWithPosition[]> {
  const rows = await db
    .select({
      id: match.id,
      date: match.date,
      location: match.location,
      turfId: match.turfId,
      tournamentId: match.tournamentId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      mode: match.mode,
      price: match.price,
      maxPlayers: match.maxPlayers,
      registeredPlayerIds: match.registeredPlayerIds,
      status: match.status,
      completed: match.completed,
      score: match.score,
      matchReport: match.matchReport,
      isPublic: match.isPublic,
      roundName: match.roundName,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      playerPosition: matchPlayer.position,
    })
    .from(matchPlayer)
    .innerJoin(match, eq(matchPlayer.matchId, match.id))
    .where(eq(matchPlayer.playerId, userId))
    .orderBy(match.date);

  return rows.map((r) => {
    const { playerPosition, ...rest } = r;
    return {
      match: {
        ...rest,
        date: r.date.toISOString(),
        price: Number(r.price),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      } as Match,
      playerPosition: playerPosition ?? null,
    };
  });
}

export async function getFixtureById(
  matchId: string,
  userId: string,
): Promise<FixtureDetail | null> {
  const participation = await db
    .select({ matchId: matchPlayer.matchId })
    .from(matchPlayer)
    .where(
      and(eq(matchPlayer.matchId, matchId), eq(matchPlayer.playerId, userId)),
    )
    .limit(1);

  if (participation.length === 0) return null;

  const [matchData] = await db
    .select()
    .from(match)
    .where(eq(match.id, matchId))
    .limit(1);

  if (!matchData) return null;

  const playerRows = await db
    .select({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      position: matchPlayer.position,
      team: matchPlayer.team,
      goals: matchPlayer.goals,
      assists: matchPlayer.assists,
      rating: matchPlayer.rating,
      motm: matchPlayer.motm,
    })
    .from(matchPlayer)
    .innerJoin(user, eq(matchPlayer.playerId, user.id))
    .where(eq(matchPlayer.matchId, matchId));

  const fixture: Match = {
    ...matchData,
    date: matchData.date.toISOString(),
    price: Number(matchData.price),
    createdAt: matchData.createdAt.toISOString(),
    updatedAt: matchData.updatedAt.toISOString(),
  };

  const players: FixturePlayer[] = playerRows.map((p) => ({
    id: p.id,
    name: p.name,
    avatarUrl: p.avatarUrl ?? null,
    position: p.position,
    team: p.team as "home" | "away",
    goals: p.goals,
    assists: p.assists,
    rating: p.rating !== null ? Number(p.rating) : null,
    motm: p.motm,
  }));

  return { fixture, players };
}
