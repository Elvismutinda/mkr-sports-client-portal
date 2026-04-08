import { db } from "@/lib/db/db";
import { team, challenge } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/challenges — returns { incoming: [], outgoing: [] } for the captain's team
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [myTeam] = await db
      .select({ id: team.id })
      .from(team)
      .where(and(eq(team.captainId, session.user.id), eq(team.isActive, true)))
      .limit(1);

    if (!myTeam) {
      return NextResponse.json({ incoming: [], outgoing: [] }, { status: 200 });
    }

    // Fetch all challenges for this team
    const all = await db
      .select({
        id: challenge.id,
        status: challenge.status,
        message: challenge.message,
        proposedDate: challenge.proposedDate,
        proposedLocation: challenge.proposedLocation,
        mode: challenge.mode,
        expiresAt: challenge.expiresAt,
        createdAt: challenge.createdAt,
        challengerTeamId: challenge.challengerTeamId,
        challengedTeamId: challenge.challengedTeamId,
        matchId: challenge.matchId,
      })
      .from(challenge)
      .where(
        or(
          eq(challenge.challengerTeamId, myTeam.id),
          eq(challenge.challengedTeamId, myTeam.id),
        ),
      )
      .orderBy(challenge.createdAt);

    // Hydrate team names in JS (avoids complex self-join alias issues)
    const teamIds = [
      ...new Set(
        all.flatMap((c) => [c.challengerTeamId, c.challengedTeamId]),
      ),
    ];

    const teams = teamIds.length
      ? await db
          .select({ id: team.id, name: team.name, badgeFallback: team.badgeFallback })
          .from(team)
          .where(
            teamIds.length === 1
              ? eq(team.id, teamIds[0])
              : or(...teamIds.map((id) => eq(team.id, id))),
          )
      : [];

    const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

    const enriched = all.map((c) => ({
      ...c,
      challengerTeam: teamMap[c.challengerTeamId] ?? null,
      challengedTeam: teamMap[c.challengedTeamId] ?? null,
    }));

    return NextResponse.json(
      {
        incoming: enriched.filter((c) => c.challengedTeamId === myTeam.id),
        outgoing: enriched.filter((c) => c.challengerTeamId === myTeam.id),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/challenges]", error);
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}

// PATCH /api/challenges  { challengeId, action: "ACCEPTED" | "DECLINED" | "CANCELLED" }
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, action } = await req.json();

    if (!challengeId || !["ACCEPTED", "DECLINED", "CANCELLED"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [myTeam] = await db
      .select({ id: team.id })
      .from(team)
      .where(and(eq(team.captainId, session.user.id), eq(team.isActive, true)))
      .limit(1);

    if (!myTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const [existing] = await db
      .select({
        id: challenge.id,
        status: challenge.status,
        challengerTeamId: challenge.challengerTeamId,
        challengedTeamId: challenge.challengedTeamId,
      })
      .from(challenge)
      .where(eq(challenge.id, challengeId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json(
        { error: "This challenge is no longer pending." },
        { status: 409 },
      );
    }

    // Permission check: only challenged team can accept/decline; only challenger can cancel
    if (
      action === "CANCELLED" &&
      existing.challengerTeamId !== myTeam.id
    ) {
      return NextResponse.json({ error: "Only the challenger can cancel." }, { status: 403 });
    }
    if (
      ["ACCEPTED", "DECLINED"].includes(action) &&
      existing.challengedTeamId !== myTeam.id
    ) {
      return NextResponse.json(
        { error: "Only the challenged team can accept or decline." },
        { status: 403 },
      );
    }

    const [updated] = await db
      .update(challenge)
      .set({ status: action, respondedAt: new Date() })
      .where(eq(challenge.id, challengeId))
      .returning();

    return NextResponse.json(
      { message: `Challenge ${action.toLowerCase()}.`, data: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PATCH /api/challenges]", error);
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 });
  }
}