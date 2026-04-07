import { db } from "@/lib/db/db";
import { user, teamMember } from "@/lib/db/schema";
import { eq, ilike, or, and, notInArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/players/search?q=john&teamId=xxx
// Returns players NOT already in the team, matching the query
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const teamId = searchParams.get("teamId") ?? "";

    if (q.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    // Get current member IDs to exclude them
    let excludeIds: string[] = [session.user.id]; // always exclude self
    if (teamId) {
      const existing = await db
        .select({ playerId: teamMember.playerId })
        .from(teamMember)
        .where(
          and(eq(teamMember.teamId, teamId), eq(teamMember.isActive, true)),
        );
      excludeIds = [...excludeIds, ...existing.map((m) => m.playerId)];
    }

    const results = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        avatarUrl: user.avatarUrl,
        stats: user.stats,
      })
      .from(user)
      .where(
        and(
          eq(user.isActive, true),
          or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`)),
          excludeIds.length > 0
            ? notInArray(user.id, excludeIds)
            : undefined,
        ),
      )
      .limit(10);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("[GET /api/players/search]", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}