import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { match, matchPlayers, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const [foundMatch] = await db
      .select()
      .from(match)
      .where(eq(match.id, id));

    if (!foundMatch) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Always query matchPlayers — this is the source of truth for who is registered.
    // Do NOT gate on registeredPlayerIds.length: that field is legacy/unused
    // and will always be [] since registration goes through matchPlayers now.
    const players = await db
      .select({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        position: matchPlayers.position,
      })
      .from(matchPlayers)
      .innerJoin(user, eq(matchPlayers.playerId, user.id))
      .where(eq(matchPlayers.matchId, foundMatch.id));

    return NextResponse.json({
      ...foundMatch,
      players,
      isFull: players.length >= foundMatch.maxPlayers,
    });
  } catch (error) {
    console.error("[MATCH_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    );
  }
}