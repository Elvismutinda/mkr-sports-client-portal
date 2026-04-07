import { db } from "@/lib/db/db";
import { team, teamMember, user, notification } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerId } = await req.json();
    if (!playerId) {
      return NextResponse.json({ error: "playerId is required" }, { status: 400 });
    }

    // 1. Find captain's team
    const [captainedTeam] = await db
      .select({ id: team.id, name: team.name })
      .from(team)
      .where(and(eq(team.captainId, session.user.id), eq(team.isActive, true)))
      .limit(1);

    if (!captainedTeam) {
      return NextResponse.json(
        { error: "You don't have a team. Create one first." },
        { status: 404 },
      );
    }

    // 2. Check the player exists
    const [player] = await db
      .select({ id: user.id, name: user.name, isActive: user.isActive })
      .from(user)
      .where(eq(user.id, playerId))
      .limit(1);

    if (!player || !player.isActive) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // 3. Check not already a member
    const [existing] = await db
      .select({ id: teamMember.id, isActive: teamMember.isActive })
      .from(teamMember)
      .where(
        and(
          eq(teamMember.teamId, captainedTeam.id),
          eq(teamMember.playerId, playerId),
        ),
      )
      .limit(1);

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "Player is already on your team." },
          { status: 409 },
        );
      }

      // Re-activate a previously removed member
      await db
        .update(teamMember)
        .set({ isActive: true, joinedAt: new Date() })
        .where(eq(teamMember.id, existing.id));

      await db.insert(notification).values({
        userId: playerId,
        type: "TEAM_INVITE",
        title: `Welcome back to ${captainedTeam.name}`,
        body: `You have been re-added to ${captainedTeam.name} by the captain.`,
        entityType: "team",
        entityId: captainedTeam.id,
      });

      return NextResponse.json(
        { message: "Player re-added to your team.", teamId: captainedTeam.id },
        { status: 200 },
      );
    }

    // 4. Add to team
    const [newMember] = await db
      .insert(teamMember)
      .values({ teamId: captainedTeam.id, playerId })
      .returning();

    // 5. Notify the player
    await db.insert(notification).values({
      userId: playerId,
      type: "TEAM_INVITE",
      title: `You've been added to ${captainedTeam.name}`,
      body: `A captain has added you to their roster. Head to your squad page to see your team.`,
      entityType: "team",
      entityId: captainedTeam.id,
    });

    return NextResponse.json(
      { message: "Player added to your team.", data: newMember, teamId: captainedTeam.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/team/invite]", error);
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerId } = await req.json();
    if (!playerId) {
      return NextResponse.json({ error: "playerId is required" }, { status: 400 });
    }

    const [captainedTeam] = await db
      .select({ id: team.id, name: team.name })
      .from(team)
      .where(and(eq(team.captainId, session.user.id), eq(team.isActive, true)))
      .limit(1);

    if (!captainedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    await db
      .update(teamMember)
      .set({ isActive: false })
      .where(
        and(
          eq(teamMember.teamId, captainedTeam.id),
          eq(teamMember.playerId, playerId),
        ),
      );

    // Notify the removed player
    await db.insert(notification).values({
      userId: playerId,
      type: "GENERAL",
      title: `Removed from ${captainedTeam.name}`,
      body: `You have been removed from the roster of ${captainedTeam.name}.`,
      entityType: "team",
      entityId: captainedTeam.id,
    });

    return NextResponse.json({ message: "Player removed from team." }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/team/invite]", error);
    return NextResponse.json({ error: "Failed to remove player" }, { status: 500 });
  }
}