import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { match, matchPlayer } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all matches the player participated in
    const participatedMatches = await db
      .select({
        matchId: matchPlayer.matchId,
        completed: match.completed,
        score: match.score,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
      })
      .from(matchPlayer)
      .innerJoin(match, eq(matchPlayer.matchId, match.id))
      .where(eq(matchPlayer.playerId, userId));

    const matchesPlayed = participatedMatches.filter((m) => m.completed).length;

    // Goals and assists aren't tracked per-player in the schema yet,
    // so we derive what we can and default the rest to 0.
    // When you add a goals/assists column to match_players, update here.
    const stats = {
      matchesPlayed,
      goals: 0,       // extend schema to track per-player goals
      assists: 0,     // extend schema to track per-player assists
      motm: 0,        // extend schema to track motm awards
      rating: matchesPlayed > 0 ? 6.5 : 0, // default rating until ratings are tracked
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Failed to fetch player stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}