import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { match, matchPlayer, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    // Verify the user is actually a participant of this match
    const participation = await db
      .select({ matchId: matchPlayer.matchId })
      .from(matchPlayer)
      .where(
        and(eq(matchPlayer.matchId, id), eq(matchPlayer.playerId, userId)),
      )
      .limit(1);

    if (participation.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch match details
    const [matchData] = await db
      .select()
      .from(match)
      .where(eq(match.id, id))
      .limit(1);

    if (!matchData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch all participants with their names, avatars, and positions
    const players = await db
      .select({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        position: matchPlayer.position,
      })
      .from(matchPlayer)
      .innerJoin(user, eq(matchPlayer.playerId, user.id))
      .where(eq(matchPlayer.matchId, id));

    return NextResponse.json({ match: matchData, players });
  } catch (error) {
    console.error("Failed to fetch match:", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 },
    );
  }
}
