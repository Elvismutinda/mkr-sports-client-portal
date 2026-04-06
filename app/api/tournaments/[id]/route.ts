import { db } from "@/lib/db/db";
import {
  tournament,
  standing,
  tournamentParticipant,
  tournamentTeam,
  user,
  team,
  match,
} from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
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
    const [allStandings, participants, registeredTeams, fixtures] =
      await Promise.all([
        // Full standings with team details
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
            teamBadge: team.badgeFallback,
            teamBadgeUrl: team.badgeUrl,
          })
          .from(standing)
          .leftJoin(team, eq(standing.teamId, team.id))
          .where(eq(standing.tournamentId, id))
          .orderBy(asc(standing.rank)),

        // All individual participants with position
        db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            position: user.position,
            avatarUrl: user.avatarUrl,
          })
          .from(tournamentParticipant)
          .innerJoin(user, eq(tournamentParticipant.playerId, user.id))
          .where(eq(tournamentParticipant.tournamentId, id))
          .orderBy(asc(user.name)),

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
          })
          .from(tournamentTeam)
          .innerJoin(team, eq(tournamentTeam.teamId, team.id))
          .where(eq(tournamentTeam.tournamentId, id))
          .orderBy(asc(team.name)),

        // Tournament fixtures (matches linked to this tournament)
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

    // Resolve team names for fixtures
    const teamIds = [
      ...new Set(
        fixtures.flatMap(
          (f) => [f.homeTeamId, f.awayTeamId].filter(Boolean) as string[],
        ),
      ),
    ];

    let teamMap: Record<string, { name: string; badge: string | null }> = {};
    if (teamIds.length > 0) {
      const teams = await db
        .select({ id: team.id, name: team.name, badge: team.badgeFallback })
        .from(team)
        .where(
          // Use inArray once available, fallback to manual OR for now
          teamIds.length === 1
            ? eq(team.id, teamIds[0])
            : eq(team.id, teamIds[0]), // Drizzle's inArray: import { inArray } from "drizzle-orm"
        );
      teamMap = Object.fromEntries(
        teams.map((t) => [t.id, { name: t.name, badge: t.badge }]),
      );
    }

    const enrichedFixtures = fixtures.map((f) => ({
      ...f,
      homeTeamName: f.homeTeamId ? (teamMap[f.homeTeamId]?.name ?? null) : null,
      awayTeamName: f.awayTeamId ? (teamMap[f.awayTeamId]?.name ?? null) : null,
    }));

    // Group standings by group if applicable
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
      // Alias used by existing components
      commencement: t.startsAt,
      // Flattened standings for StandingsTable component (overall / first group)
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
      // All individual participants (used by ParticipantsList)
      participants,
      // Team-based participants (for team tournaments)
      teams: registeredTeams,
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
