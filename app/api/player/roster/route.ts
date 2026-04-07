import { db } from "@/lib/db/db";
import { team, teamMember, user } from "@/lib/db/schema";
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

    // Find the team the user belongs to
    const [membership] = await db
      .select({
        teamId: teamMember.teamId,
      })
      .from(teamMember)
      .where(
        and(
          eq(teamMember.playerId, userId),
          eq(teamMember.isActive, true)
        )
      )
      .limit(1);

    if (!membership) {
      return NextResponse.json([], { status: 200 });
    }

    const teamId = membership.teamId;

    // Get captainId separately
    const [teamData] = await db
      .select({
        captainId: team.captainId,
      })
      .from(team)
      .where(eq(team.id, teamId))
      .limit(1);

    // Fetch members
    const members = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        avatarUrl: user.avatarUrl,
        role: user.role,
        bio: user.bio,
        isActive: user.isActive,
        stats: user.stats,
        attributes: user.attributes,
        aiAnalysis: user.aiAnalysis,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(teamMember)
      .innerJoin(user, eq(teamMember.playerId, user.id))
      .where(
        and(
          eq(teamMember.teamId, teamId),
          eq(teamMember.isActive, true)
        )
      );

    // Add isCaptain properly
    const enrichedMembers = members.map((player) => ({
      ...player,
      isCaptain: player.id === teamData?.captainId,
    }));

    // Captain first (optional)
    enrichedMembers.sort((a, b) => Number(b.isCaptain) - Number(a.isCaptain));

    return NextResponse.json(enrichedMembers, { status: 200 });
  } catch (error) {
    console.error("[GET /api/player/roster]", error);
    return NextResponse.json(
      { error: "Failed to fetch roster" },
      { status: 500 }
    );
  }
}