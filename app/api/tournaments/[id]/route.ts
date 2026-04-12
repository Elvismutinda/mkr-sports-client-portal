import { db } from "@/lib/db/db";
import {
  tournament,
  standing,
  tournamentTeam,
  team,
  match,
  teamMember,
} from "@/lib/db/schema";
import { eq, asc, desc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Tournament base
    const [t] = await db
      .select()
      .from(tournament)
      .where(eq(tournament.id, id))
      .limit(1);

    if (!t) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // 2. All data in parallel
    const [allStandings, registeredTeams, fixtures] = await Promise.all([
      // Standings with team details
      db
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
          teamId: team.id,
          teamName: team.name,
        })
        .from(standing)
        .leftJoin(team, eq(standing.teamId, team.id))
        .where(eq(standing.tournamentId, id))
        .orderBy(asc(standing.rank)),

      // Registered teams with stats
      db
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
          teamId: tournamentTeam.teamId,
        })
        .from(tournamentTeam)
        .innerJoin(team, eq(tournamentTeam.teamId, team.id))
        .where(eq(tournamentTeam.tournamentId, id))
        .orderBy(asc(team.name)),

      // Tournament fixtures
      db
        .select({
          id: match.id,
          date: match.date,
          location: match.location,
          mode: match.mode,
          status: match.status,
          roundName: match.roundName,
          score: match.score,
          completed: match.completed,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
        })
        .from(match)
        .where(eq(match.tournamentId, id))
        .orderBy(desc(match.date)),
    ]);

    // 3. Collect all user IDs that belong to registered teams
    //    so the detail page can determine if the current user's team is enlisted.
    let registeredUserIds: string[] = [];
    if (registeredTeams.length > 0) {
      const registeredTeamIds = registeredTeams.map((rt) => rt.teamId);
      const members = await db
        .select({ playerId: teamMember.playerId })
        .from(teamMember)
        .where(inArray(teamMember.teamId, registeredTeamIds));
      registeredUserIds = [...new Set(members.map((m) => m.playerId))];
    }

    // 4. Resolve team names for fixtures
    const fixtureTeamIds = [
      ...new Set(
        fixtures
          .flatMap((f) => [f.homeTeamId, f.awayTeamId])
          .filter(Boolean) as string[],
      ),
    ];

    let teamMap: Record<string, { name: string; badge: string | null }> = {};
    if (fixtureTeamIds.length > 0) {
      const teams = await db
        .select({ id: team.id, name: team.name, badge: team.badgeFallback })
        .from(team)
        .where(inArray(team.id, fixtureTeamIds));
      teamMap = Object.fromEntries(
        teams.map((t) => [t.id, { name: t.name, badge: t.badge }]),
      );
    }

    const enrichedFixtures = fixtures.map((f) => ({
      ...f,
      homeTeamName: f.homeTeamId ? (teamMap[f.homeTeamId]?.name ?? null) : null,
      awayTeamName: f.awayTeamId ? (teamMap[f.awayTeamId]?.name ?? null) : null,
    }));

    // 5. Group standings by group if applicable
    const standingsByGroup = allStandings.reduce<
      Record<string, typeof allStandings>
    >((acc, s) => {
      const key = s.groupName ?? "overall";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});

    const response = {
      id: t.id,
      name: t.name,
      description: t.description,
      location: t.location,
      prizePool: Number(t.prizePool ?? 0),
      entryFee: Number(t.entryFee ?? 0),
      format: t.format,
      status: t.status,
      startsAt: t.startsAt,
      endsAt: t.endsAt,
      registrationDeadline: t.registrationDeadline,
      maxTeams: t.maxTeams,
      maxPlayersPerTeam: t.maxPlayersPerTeam,
      rules: t.rules,
      isPublic: t.isPublic,
      createdAt: t.createdAt,
      commencement: t.startsAt,
      standings: (standingsByGroup["overall"] ?? allStandings).map((s) => ({
        rank: s.rank,
        name: s.teamName ?? "Unknown",
        points: s.points,
        matchesPlayed: s.matchesPlayed,
        wins: s.wins,
        draws: s.draws,
        losses: s.losses,
        goalsFor: s.goalsFor,
        goalsAgainst: s.goalsAgainst,
        goalDifference: s.goalDifference,
      })),
      standingsByGroup,
      // Team-based participants (primary — tournaments are team-only now)
      teams: registeredTeams,
      // All user IDs whose teams are registered — used for isTeamRegistered check
      registeredUserIds,
      fixtures: enrichedFixtures,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tournaments/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
      { status: 500 },
    );
  }
}
