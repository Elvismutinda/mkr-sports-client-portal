import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  tournament,
  tournamentTeam,
  teamMember,
  match,
  standing,
  team,
  user,
} from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Tournament, TournamentTeamEntry, Standing, Match, Participant } from "@/types/types";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tournamentId } = await params;

  const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const userId = session.user.id;

  // Verify the player participates in this tournament via a team
  const memberships = await db
    .select({ teamId: teamMember.teamId })
    .from(teamMember)
    .where(eq(teamMember.playerId, userId));

  const teamIds = memberships.map((m) => m.teamId);

  const participation = await db
    .select({ tournamentId: tournamentTeam.tournamentId })
    .from(tournamentTeam)
    .where(
      and(
        eq(tournamentTeam.tournamentId, tournamentId),
        teamIds.length === 1
          ? eq(tournamentTeam.teamId, teamIds[0])
          : inArray(tournamentTeam.teamId, teamIds)
      )
    )
    .limit(1);

  if (participation.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch tournament core data
  const [t] = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, tournamentId))
    .limit(1);

  if (!t) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch registered teams with their stats
  const teamRows = await db
    .select({
      id: team.id,
      name: team.name,
      badgeFallback: team.badgeFallback,
      badgeUrl: team.badgeUrl,
      type: team.type,
      stats: team.stats,
      groupName: tournamentTeam.groupName,
      isEliminated: tournamentTeam.isEliminated,
      paymentStatus: tournamentTeam.paymentStatus,
      registeredAt: tournamentTeam.registeredAt,
    })
    .from(tournamentTeam)
    .innerJoin(team, eq(tournamentTeam.teamId, team.id))
    .where(eq(tournamentTeam.tournamentId, tournamentId));

  const teams: TournamentTeamEntry[] = teamRows.map((r) => ({
    id: r.id,
    name: r.name,
    badgeFallback: r.badgeFallback,
    badgeUrl: r.badgeUrl,
    type: r.type,
    stats: r.stats,
    groupName: r.groupName ?? null,
    isEliminated: r.isEliminated ?? false,
    paymentStatus: r.paymentStatus,
    registeredAt: r.registeredAt.toISOString(),
  }));

  // Fetch fixtures for this tournament
  const fixtureRows = await db
    .select()
    .from(match)
    .where(eq(match.tournamentId, tournamentId))
    .orderBy(match.date);

  const fixtures: Match[] = fixtureRows.map((f) => ({
    ...f,
    date: f.date.toISOString(),
    price: Number(f.price),
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  // Fetch participants (players across all registered teams)
  const participantRows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      position: teamMember.position,
      avatarUrl: user.avatarUrl,
    })
    .from(tournamentTeam)
    .innerJoin(teamMember, eq(tournamentTeam.teamId, teamMember.teamId))
    .innerJoin(user, eq(teamMember.playerId, user.id))
    .where(
      and(eq(tournamentTeam.tournamentId, tournamentId), eq(teamMember.isActive, true))
    );

  const participants: Participant[] = participantRows.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    position: p.position ?? null,
    avatarUrl: p.avatarUrl ?? null,
  }));

  // Fetch standings if available
  const standingRows = await db
    .select({
      rank: standing.rank,
      points: standing.points,
      matchesPlayed: standing.matchesPlayed,
      wins: standing.wins,
      draws: standing.draws,
      losses: standing.losses,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      goalDifference: standing.goalDifference,
      groupName: standing.groupName,
      teamName: team.name,
      playerName: user.name,
    })
    .from(standing)
    .leftJoin(team, eq(standing.teamId, team.id))
    .leftJoin(user, eq(standing.playerId, user.id))
    .where(eq(standing.tournamentId, tournamentId))
    .orderBy(standing.rank);

  const standings: Standing[] = standingRows.map((s) => ({
    rank: s.rank,
    name: s.teamName ?? s.playerName ?? "Unknown",
    points: s.points,
    matchesPlayed: s.matchesPlayed ?? undefined,
    wins: s.wins ?? undefined,
    draws: s.draws ?? undefined,
    losses: s.losses ?? undefined,
    goalsFor: s.goalsFor ?? undefined,
    goalsAgainst: s.goalsAgainst ?? undefined,
    goalDifference: s.goalDifference ?? undefined,
    groupName: s.groupName ?? null,
  }));

  // Build standingsByGroup if tournament has groups
  const standingsByGroup =
    standings.some((s) => s.groupName)
      ? standings.reduce<Record<string, Standing[]>>((acc, s) => {
          const key = s.groupName ?? "Default";
          if (!acc[key]) acc[key] = [];
          acc[key].push(s);
          return acc;
        }, {})
      : undefined;

  const result: Tournament = {
    id: t.id,
    name: t.name,
    description: t.description,
    location: t.location,
    turfId: t.turfId,
    prizePool: Number(t.prizePool),
    entryFee: Number(t.entryFee),
    format: t.format,
    status: t.status,
    startsAt: t.startsAt?.toISOString() ?? null,
    endsAt: t.endsAt?.toISOString() ?? null,
    registrationDeadline: t.registrationDeadline?.toISOString() ?? null,
    maxTeams: t.maxTeams,
    maxPlayersPerTeam: t.maxPlayersPerTeam,
    rules: t.rules,
    isPublic: t.isPublic,
    createdAt: t.createdAt.toISOString(),
    commencement: t.startsAt
      ? new Date(t.startsAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      : null,
    teams,
    fixtures,
    participants,
    standings,
    ...(standingsByGroup ? { standingsByGroup } : {}),
  };

  return NextResponse.json(result);
}