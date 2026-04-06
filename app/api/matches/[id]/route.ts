import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { match, matchPlayer, user } from "@/lib/db/schema";
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

    // Always query matchPlayer — this is the source of truth for who is registered.
    // Do NOT gate on registeredPlayerIds.length: that field is legacy/unused
    // and will always be [] since registration goes through matchPlayer now.
    const players = await db
      .select({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        position: matchPlayer.position,
      })
      .from(matchPlayer)
      .innerJoin(user, eq(matchPlayer.playerId, user.id))
      .where(eq(matchPlayer.matchId, foundMatch.id));

    // Derive team membership from the match's homeTeam / awayTeam ID arrays.
    // Players not yet assigned to either team are considered "unassigned" —
    // the frontend pitch visualizer handles that case gracefully.
    const homeTeamIds: string[] = foundMatch.homeTeam ?? [];
    const awayTeamIds: string[] = foundMatch.awayTeam ?? [];

    const playersWithTeam = players.map((p) => ({
      ...p,
      team: homeTeamIds.includes(p.id)
        ? ("home" as const)
        : awayTeamIds.includes(p.id)
          ? ("away" as const)
          : ("unassigned" as const),
    }));

    return NextResponse.json({
      ...foundMatch,
      players: playersWithTeam,
      isFull: players.length >= foundMatch.maxPlayers,
    });
  } catch (error) {
    console.error("Failed to fetch match: ", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    );
  }
}