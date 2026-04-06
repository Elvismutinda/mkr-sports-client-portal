import { db } from "@/lib/db/db";
import { match, matchPlayer } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Player } from "@/types/types";

export async function getPlayerStats(userId: string): Promise<Player["stats"]> {
  const participatedMatches = await db
    .select({
      matchId: matchPlayer.matchId,
      completed: match.completed,
    })
    .from(matchPlayer)
    .innerJoin(match, eq(matchPlayer.matchId, match.id))
    .where(eq(matchPlayer.playerId, userId));

  const matchesPlayed = participatedMatches.filter((m) => m.completed).length;

  return {
    matchesPlayed,
    goals: 0,
    assists: 0,
    motm: 0,
    rating: matchesPlayed > 0 ? 6.5 : 0,
    wins: 0,
    losses: 0,
    draws: 0,
  };
}