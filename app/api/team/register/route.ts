import { db } from "@/lib/db/db";
import { team, teamMember } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Prevent creating a second team
    const [existing] = await db
      .select({ id: team.id })
      .from(team)
      .where(and(eq(team.captainId, userId), eq(team.isActive, true)))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "You already captain a team." },
        { status: 409 },
      );
    }

    const { name, type, bio, badgeFallback } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Team name is required." }, { status: 400 });
    }

    // Create team with current user as captain
    const [newTeam] = await db
      .insert(team)
      .values({
        name: name.trim(),
        type: type?.trim() || null,
        bio: bio?.trim() || null,
        badgeFallback: badgeFallback?.trim().slice(0, 8) || name.trim().slice(0, 2).toUpperCase(),
        captainId: userId,
      })
      .returning();

    // Auto-add captain as first team member
    await db.insert(teamMember).values({
      teamId: newTeam.id,
      playerId: userId,
    });

    return NextResponse.json({ team: newTeam }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/team/register]", error);
    return NextResponse.json({ error: "Failed to create team." }, { status: 500 });
  }
}