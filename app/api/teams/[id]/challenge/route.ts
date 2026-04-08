import { db } from "@/lib/db/db";
import { team, challenge } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: challengedTeamId } = await params;
    const { message, proposedDate, proposedLocation, mode } = await req.json();

    // 1. Verify the challenged team exists
    const [challengedTeam] = await db
      .select({ id: team.id, name: team.name })
      .from(team)
      .where(and(eq(team.id, challengedTeamId), eq(team.isActive, true)))
      .limit(1);

    if (!challengedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // 2. Get the challenger's team (must be a captain)
    const [challengerTeam] = await db
      .select({ id: team.id, name: team.name })
      .from(team)
      .where(and(eq(team.captainId, session.user.id), eq(team.isActive, true)))
      .limit(1);

    if (!challengerTeam) {
      return NextResponse.json(
        { error: "You must be a team captain to issue a challenge." },
        { status: 403 },
      );
    }

    if (challengerTeam.id === challengedTeamId) {
      return NextResponse.json(
        { error: "You cannot challenge your own team." },
        { status: 400 },
      );
    }

    // 3. Check for existing pending challenge between these two teams (either direction)
    const [existing] = await db
      .select({ id: challenge.id, status: challenge.status })
      .from(challenge)
      .where(
        and(
          or(
            and(
              eq(challenge.challengerTeamId, challengerTeam.id),
              eq(challenge.challengedTeamId, challengedTeamId),
            ),
            and(
              eq(challenge.challengerTeamId, challengedTeamId),
              eq(challenge.challengedTeamId, challengerTeam.id),
            ),
          ),
          eq(challenge.status, "PENDING"),
        ),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A pending challenge already exists between these teams." },
        { status: 409 },
      );
    }

    // 4. Create challenge — expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [newChallenge] = await db
      .insert(challenge)
      .values({
        challengerTeamId: challengerTeam.id,
        challengedTeamId,
        message: message?.trim() || null,
        proposedDate: proposedDate ? new Date(proposedDate) : null,
        proposedLocation: proposedLocation?.trim() || null,
        mode: mode || "5v5",
        expiresAt,
        status: "PENDING",
      })
      .returning();

    return NextResponse.json(
      {
        message: `Challenge sent to ${challengedTeam.name}.`,
        data: newChallenge,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/teams/:id/challenge]", error);
    return NextResponse.json({ error: "Failed to send challenge" }, { status: 500 });
  }
}