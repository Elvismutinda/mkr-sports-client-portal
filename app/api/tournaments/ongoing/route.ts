import { db } from "@/lib/db/db";
import {
  tournament,
  standing,
  tournamentParticipant,
  user,
  team,
} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tournaments = await db
      .select({
        id: tournament.id,
        name: tournament.name,
        description: tournament.description,
        location: tournament.location,
        prizePool: tournament.prizePool,
        entryFee: tournament.entryFee,
        format: tournament.format,
        status: tournament.status,
        startsAt: tournament.startsAt,
        endsAt: tournament.endsAt,
        registrationDeadline: tournament.registrationDeadline,
        maxTeams: tournament.maxTeams,
        maxPlayersPerTeam: tournament.maxPlayersPerTeam,
        isPublic: tournament.isPublic,
        createdAt: tournament.createdAt,
      })
      .from(tournament)
      .where(eq(tournament.status, "ONGOING"));

    const enriched = await Promise.all(
      tournaments.map(async (t) => {
        const [topStandings, participants] = await Promise.all([
          db
            .select({
              rank: standing.rank,
              points: standing.points,
              teamName: team.name,
            })
            .from(standing)
            .leftJoin(team, eq(standing.teamId, team.id))
            .where(eq(standing.tournamentId, t.id))
            .orderBy(asc(standing.rank))
            .limit(3),
          db
            .select({
              id: user.id,
              name: user.name,
              avatarUrl: user.avatarUrl,
            })
            .from(tournamentParticipant)
            .innerJoin(user, eq(tournamentParticipant.playerId, user.id))
            .where(eq(tournamentParticipant.tournamentId, t.id))
            .limit(4),
        ]);

        return {
          ...t,
          prizePool: Number(t.prizePool ?? 0),
          entryFee: Number(t.entryFee ?? 0),
          commencement: t.startsAt
            ? new Date(t.startsAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })
            : null,
          standings: topStandings.map((s) => ({
            rank: s.rank,
            name: s.teamName ?? "Unknown",
            points: s.points,
          })),
          participants,
        };
      }),
    );

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tournaments/ongoing]", error);
    return NextResponse.json(
      { error: "Failed to fetch ongoing tournaments" },
      { status: 500 },
    );
  }
}
