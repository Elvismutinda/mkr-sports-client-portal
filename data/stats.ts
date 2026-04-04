import { db } from "@/lib/db/db";
import { match, matchPlayers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Player } from "@/types/types";

export async function getPlayerStats(userId: string): Promise<Player["stats"]> {
  const participatedMatches = await db
    .select({
      matchId: matchPlayers.matchId,
      completed: match.completed,
    })
    .from(matchPlayers)
    .innerJoin(match, eq(matchPlayers.matchId, match.id))
    .where(eq(matchPlayers.playerId, userId));

  const matchesPlayed = participatedMatches.filter((m) => m.completed).length;

  return {
    matchesPlayed,
    goals: 0,
    assists: 0,
    motm: 0,
    rating: matchesPlayed > 0 ? 6.5 : 0,
  };
}