import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { tournament, tournamentTeam, teamMember } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Tournament } from "@/types/types";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Find all teams the player belongs to
  const memberships = await db
    .select({ teamId: teamMember.teamId })
    .from(teamMember)
    .where(eq(teamMember.playerId, userId));

  const teamIds = memberships.map((m) => m.teamId);

  if (teamIds.length === 0) {
    return NextResponse.json<Tournament[]>([]);
  }

  // Find all tournaments those teams are registered in
  const rows = await db
    .selectDistinct({
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      location: tournament.location,
      turfId: tournament.turfId,
      prizePool: tournament.prizePool,
      entryFee: tournament.entryFee,
      format: tournament.format,
      status: tournament.status,
      startsAt: tournament.startsAt,
      endsAt: tournament.endsAt,
      registrationDeadline: tournament.registrationDeadline,
      maxTeams: tournament.maxTeams,
      maxPlayersPerTeam: tournament.maxPlayersPerTeam,
      rules: tournament.rules,
      isPublic: tournament.isPublic,
      createdAt: tournament.createdAt,
    })
    .from(tournamentTeam)
    .innerJoin(tournament, eq(tournamentTeam.tournamentId, tournament.id))
    .where(
      teamIds.length === 1
        ? eq(tournamentTeam.teamId, teamIds[0])
        : inArray(tournamentTeam.teamId, teamIds),
    )
    .orderBy(tournament.startsAt);

  const tournaments: Tournament[] = rows.map((r) => ({
    ...r,
    prizePool: Number(r.prizePool),
    entryFee: Number(r.entryFee),
    startsAt: r.startsAt?.toISOString() ?? null,
    endsAt: r.endsAt?.toISOString() ?? null,
    registrationDeadline: r.registrationDeadline?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    // alias expected by TournamentCard
    commencement: r.startsAt
      ? new Date(r.startsAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      : null,
  }));

  return NextResponse.json(tournaments);
}
