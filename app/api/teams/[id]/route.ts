import { db } from "@/lib/db/db";
import { team, teamMember, user, turf } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const [t] = await db
      .select({
        id: team.id,
        name: team.name,
        badgeUrl: team.badgeUrl,
        badgeFallback: team.badgeFallback,
        type: team.type,
        bio: team.bio,
        captainId: team.captainId,
        stats: team.stats,
        isActive: team.isActive,
        createdAt: team.createdAt,
        homePitchId: team.homePitchId,
      })
      .from(team)
      .where(and(eq(team.id, id), eq(team.isActive, true)))
      .limit(1);

    if (!t) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const [members, homePitch, [{ memberCount }]] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          position: user.position,
          avatarUrl: user.avatarUrl,
          stats: user.stats,
          jerseyNumber: teamMember.jerseyNumber,
        })
        .from(teamMember)
        .innerJoin(user, eq(teamMember.playerId, user.id))
        .where(and(eq(teamMember.teamId, id), eq(teamMember.isActive, true)))
        .orderBy(teamMember.jerseyNumber),

      t.homePitchId
        ? db
            .select({
              id: turf.id,
              name: turf.name,
              area: turf.area,
              city: turf.city,
              address: turf.address,
            })
            .from(turf)
            .where(eq(turf.id, t.homePitchId))
            .limit(1)
            .then((r) => r[0] ?? null)
        : Promise.resolve(null),

      db
        .select({ memberCount: count(teamMember.id) })
        .from(teamMember)
        .where(and(eq(teamMember.teamId, id), eq(teamMember.isActive, true))),
    ]);

    return NextResponse.json(
      { ...t, members, homePitch, memberCount },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/teams/:id]", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}