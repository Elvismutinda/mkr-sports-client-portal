import { db } from "@/lib/db/db";
import { team, teamMember } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if captain first
    const [captainedTeam] = await db
      .select({
        id: team.id,
        name: team.name,
        badgeFallback: team.badgeFallback,
        badgeUrl: team.badgeUrl,
        type: team.type,
        bio: team.bio,
        stats: team.stats,
        captainId: team.captainId,
        createdAt: team.createdAt,
      })
      .from(team)
      .where(and(eq(team.captainId, userId), eq(team.isActive, true)))
      .limit(1);

    if (captainedTeam) {
      return NextResponse.json(
        { team: captainedTeam, isCaptain: true },
        { status: 200 },
      );
    }

    // Otherwise check membership
    const [membership] = await db
      .select({ teamId: teamMember.teamId })
      .from(teamMember)
      .where(and(eq(teamMember.playerId, userId), eq(teamMember.isActive, true)))
      .limit(1);

    if (!membership) {
      return NextResponse.json({ team: null, isCaptain: false }, { status: 200 });
    }

    const [memberTeam] = await db
      .select({
        id: team.id,
        name: team.name,
        badgeFallback: team.badgeFallback,
        badgeUrl: team.badgeUrl,
        type: team.type,
        bio: team.bio,
        stats: team.stats,
        captainId: team.captainId,
        createdAt: team.createdAt,
      })
      .from(team)
      .where(and(eq(team.id, membership.teamId), eq(team.isActive, true)))
      .limit(1);

    return NextResponse.json(
      { team: memberTeam ?? null, isCaptain: false },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/team/mine]", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}