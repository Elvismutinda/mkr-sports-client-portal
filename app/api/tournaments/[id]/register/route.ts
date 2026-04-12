import { db } from "@/lib/db/db";
import { tournament, tournamentTeam, teamMember, team } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: tournamentId } = await params;

    // 1. Auth — must be signed in
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { teamId, selectedMemberIds } = await req.json();

    if (!teamId) {
      return NextResponse.json(
        { error: "teamId is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(selectedMemberIds) || selectedMemberIds.length === 0) {
      return NextResponse.json(
        { error: "Select at least one member to participate." },
        { status: 400 },
      );
    }

    // 2. Verify tournament exists and is open
    const [t] = await db
      .select({
        id: tournament.id,
        status: tournament.status,
        maxTeams: tournament.maxTeams,
        registrationDeadline: tournament.registrationDeadline,
      })
      .from(tournament)
      .where(eq(tournament.id, tournamentId))
      .limit(1);

    if (!t) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    if (t.status === "COMPLETED") {
      return NextResponse.json(
        { error: "This tournament has already concluded." },
        { status: 400 },
      );
    }

    if (
      t.registrationDeadline &&
      new Date() > new Date(t.registrationDeadline)
    ) {
      return NextResponse.json(
        { error: "Registration deadline has passed." },
        { status: 400 },
      );
    }

    // 3. Verify the requesting user is an active member of this team
    const [membership] = await db
      .select({ id: teamMember.id })
      .from(teamMember)
      .where(
        and(
          eq(teamMember.teamId, teamId),
          eq(teamMember.playerId, userId),
          eq(teamMember.isActive, true),
        ),
      )
      .limit(1);

    if (!membership) {
      return NextResponse.json(
        { error: "You are not an active member of this team." },
        { status: 403 },
      );
    }

    // 4. Verify the team itself exists and is active
    const [teamRecord] = await db
      .select({ id: team.id, isActive: team.isActive })
      .from(team)
      .where(eq(team.id, teamId))
      .limit(1);

    if (!teamRecord || !teamRecord.isActive) {
      return NextResponse.json(
        { error: "Team not found or inactive." },
        { status: 404 },
      );
    }

    // 5. Check team is not already registered
    const [alreadyRegistered] = await db
      .select({ id: tournamentTeam.id })
      .from(tournamentTeam)
      .where(
        and(
          eq(tournamentTeam.tournamentId, tournamentId),
          eq(tournamentTeam.teamId, teamId),
        ),
      )
      .limit(1);

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "This team is already registered for the tournament." },
        { status: 409 },
      );
    }

    // 6. Max teams capacity check
    if (t.maxTeams != null) {
      const [{ count }] = await db
        .select({
          count: db.$count(
            tournamentTeam,
            eq(tournamentTeam.tournamentId, tournamentId),
          ),
        })
        .from(tournamentTeam)
        .where(eq(tournamentTeam.tournamentId, tournamentId));

      if (Number(count) >= t.maxTeams) {
        return NextResponse.json(
          { error: "Tournament has reached its maximum team capacity." },
          { status: 400 },
        );
      }
    }

    // 7. Validate all selected members are active members of the team
    const validMembers = await db
      .select({ playerId: teamMember.playerId })
      .from(teamMember)
      .where(
        and(
          eq(teamMember.teamId, teamId),
          eq(teamMember.isActive, true),
          inArray(teamMember.playerId, selectedMemberIds),
        ),
      );

    if (validMembers.length !== selectedMemberIds.length) {
      return NextResponse.json(
        {
          error: "Some selected members are not active members of this team.",
        },
        { status: 400 },
      );
    }

    // 8. Register the team
    const [registration] = await db
      .insert(tournamentTeam)
      .values({
        tournamentId,
        teamId,
        paymentStatus: "pending",
      })
      .returning();

    return NextResponse.json(
      {
        message: "Team successfully enlisted.",
        data: {
          registration,
          memberCount: selectedMemberIds.length,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/tournaments/:id/register]", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
